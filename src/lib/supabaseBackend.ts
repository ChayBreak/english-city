import { supabase } from "./supabase";
import type { Backend } from "./backend";
import type {
  Course,
  Lesson,
  LessonMaterials,
  PaymentRequest,
  PaymentSettings,
  Plan,
  Profile,
  StudentRow,
  Submission,
  Task,
} from "./types";
import { accessUntilFrom, bySort, newId, summarize } from "./util";

type DataOf<R> = R extends { data: infer D } ? D : undefined;

function check<R extends { error: unknown }>(result: R): DataOf<R> {
  if (result.error) throw result.error;
  return (result as { data?: unknown }).data as DataOf<R>;
}

const PAYMENT_SELECT = "*, student:profiles!payment_requests_student_id_fkey(full_name, email, phone)";
const SUBMISSION_SELECT =
  "*, student:profiles!submissions_student_id_fkey(full_name, email, phone), task:tasks(title, title_kk, title_en, kind, prompt), lesson:lessons(title, title_kk, title_en, course:courses(title, title_kk, title_en))";

export function createSupabaseBackend(): Backend {
  const db = supabase!;

  return {
    mode: "supabase",

    async currentUserId() {
      const { data } = await db.auth.getSession();
      return data.session?.user.id ?? null;
    },
    onAuthChange(callback) {
      const { data } = db.auth.onAuthStateChange((event) => {
        if (event !== "TOKEN_REFRESHED") callback();
      });
      return () => data.subscription.unsubscribe();
    },
    async signIn(email, password) {
      check(await db.auth.signInWithPassword({ email, password }));
    },
    async signUp({ email, password, full_name, phone }) {
      const data = check(
        await db.auth.signUp({
          email,
          password,
          options: { data: { full_name, phone }, emailRedirectTo: window.location.origin },
        }),
      );
      return !data.session;
    },
    async signInWithGoogle() {
      check(
        await db.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin + "/account" },
        }),
      );
    },
    async signOut() {
      check(await db.auth.signOut());
    },
    async getProfile(userId) {
      return check(await db.from("profiles").select("*").eq("id", userId).single()) as Profile;
    },
    async updateProfile(userId, patch) {
      check(await db.from("profiles").update(patch).eq("id", userId));
    },
    async getAccessUntil(userId) {
      const terms = check(
        await db.from("subscriptions").select("starts_at, ends_at").eq("student_id", userId),
      ) as { starts_at: string; ends_at: string }[];
      return accessUntilFrom(terms);
    },

    async listCourses(includeDrafts) {
      let query = db.from("courses").select("*, lessons(minutes, is_published)").order("sort");
      if (!includeDrafts) query = query.eq("is_published", true);
      const rows = check(await query) as (Course & { lessons: Lesson[] })[];
      return rows.map(({ lessons, ...course }) => summarize(course, lessons));
    },
    async getCourse(slug) {
      const course = check(await db.from("courses").select("*").eq("slug", slug).maybeSingle()) as Course | null;
      if (!course) return null;
      const lessons = check(
        await db.from("lessons").select("*").eq("course_id", course.id).eq("is_published", true).order("sort"),
      ) as Lesson[];
      return { course, lessons };
    },
    async getLesson(lessonId) {
      const lesson = check(await db.from("lessons").select("*").eq("id", lessonId).maybeSingle()) as Lesson | null;
      if (!lesson) return null;
      const [course, lessons, materials, tasks] = await Promise.all([
        db.from("courses").select("*").eq("id", lesson.course_id).single(),
        db.from("lessons").select("*").eq("course_id", lesson.course_id).eq("is_published", true).order("sort"),
        db.from("lesson_materials").select("*").eq("lesson_id", lessonId).maybeSingle(),
        db.from("tasks").select("*").eq("lesson_id", lessonId).order("sort"),
      ]);
      return {
        lesson,
        course: check(course) as Course,
        lessons: check(lessons) as Lesson[],
        // RLS hides materials and tasks from viewers without access.
        materials: (check(materials) as LessonMaterials | null) ?? null,
        tasks: (check(tasks) as Task[]) ?? [],
      };
    },
    async listPlans(includeInactive) {
      let query = db.from("plans").select("*").order("sort");
      if (!includeInactive) query = query.eq("is_active", true);
      return check(await query) as Plan[];
    },
    async getPaymentSettings() {
      return check(
        await db.from("payment_settings").select("qr_url, pay_url, recipient, instructions, instructions_kk, instructions_en").eq("id", 1).single(),
      ) as PaymentSettings;
    },

    async createPaymentRequest(input) {
      const userId = await this.currentUserId();
      // Amount and term are filled in by a database trigger from the plan.
      check(await db.from("payment_requests").insert({ ...input, student_id: userId }));
    },
    async listMyPayments(userId) {
      return check(
        await db.from("payment_requests").select("*").eq("student_id", userId).order("created_at", { ascending: false }),
      ) as PaymentRequest[];
    },
    async getProgress(userId) {
      const [completed, results, submissions] = await Promise.all([
        db.from("lesson_progress").select("lesson_id").eq("student_id", userId),
        db.from("task_results").select("task_id, score, total").eq("student_id", userId),
        db.from("submissions").select(SUBMISSION_SELECT).eq("student_id", userId).order("updated_at", { ascending: false }),
      ]);
      return {
        completed: (check(completed) as { lesson_id: string }[]).map((row) => row.lesson_id),
        results: check(results) as { task_id: string; score: number; total: number }[],
        submissions: check(submissions) as Submission[],
      };
    },
    async completeLesson(userId, lessonId) {
      check(
        await db
          .from("lesson_progress")
          .upsert({ student_id: userId, lesson_id: lessonId }, { onConflict: "student_id,lesson_id", ignoreDuplicates: true }),
      );
    },
    async saveTaskResult(userId, taskId, score, total) {
      const existing = check(
        await db.from("task_results").select("score").eq("student_id", userId).eq("task_id", taskId).maybeSingle(),
      ) as { score: number } | null;
      if (existing && existing.score >= score) return;
      check(
        await db
          .from("task_results")
          .upsert({ student_id: userId, task_id: taskId, score, total, updated_at: new Date().toISOString() }),
      );
    },
    async uploadAudio(folder, blob) {
      const ext = blob.type.includes("ogg") ? "ogg" : blob.type.includes("mp4") ? "m4a" : "webm";
      const path = `${folder}/${newId()}.${ext}`;
      check(
        await db.storage.from("student-audio").upload(path, blob, { contentType: blob.type.split(";")[0] || "audio/webm" }),
      );
      return path;
    },
    async audioUrl(path) {
      const data = check(await db.storage.from("student-audio").createSignedUrl(path, 60 * 60));
      return data?.signedUrl ?? "";
    },
    async submitTask(userId, { task, answer, auto_score }) {
      check(
        await db.from("submissions").upsert(
          { student_id: userId, task_id: task.id, lesson_id: task.lesson_id, kind: task.kind, answer, auto_score },
          { onConflict: "student_id,task_id" },
        ),
      );
    },

    async adminStats() {
      const now = new Date().toISOString();
      const count = async (query: PromiseLike<{ count: number | null; error: unknown }>) => {
        const { count: value, error } = await query;
        if (error) throw error;
        return value ?? 0;
      };
      const [pendingPayments, pendingReviews, publishedCourses, active] = await Promise.all([
        count(db.from("payment_requests").select("id", { count: "exact", head: true }).eq("status", "pending")),
        count(db.from("submissions").select("id", { count: "exact", head: true }).eq("status", "submitted")),
        count(db.from("courses").select("id", { count: "exact", head: true }).eq("is_published", true)),
        db.from("subscriptions").select("student_id").lte("starts_at", now).gt("ends_at", now),
      ]);
      const activeRows = check(active) as { student_id: string }[];
      return {
        pendingPayments,
        pendingReviews,
        publishedCourses,
        activeStudents: new Set(activeRows.map((row) => row.student_id)).size,
      };
    },
    async listPayments(status) {
      let query = db.from("payment_requests").select(PAYMENT_SELECT).order("created_at", { ascending: false }).limit(200);
      if (status !== "all") query = query.eq("status", status);
      return check(await query) as PaymentRequest[];
    },
    async approvePayment(id) {
      check(await db.rpc("approve_payment", { request: id }));
    },
    async rejectPayment(id, note) {
      check(await db.rpc("reject_payment", { request: id, note }));
    },
    async listStudents() {
      const [profiles, subscriptions, progress] = await Promise.all([
        db.from("profiles").select("*").order("created_at", { ascending: false }),
        db.from("subscriptions").select("student_id, starts_at, ends_at"),
        db.from("lesson_progress").select("student_id"),
      ]);
      const terms = new Map<string, { starts_at: string; ends_at: string }[]>();
      for (const row of check(subscriptions) as { student_id: string; starts_at: string; ends_at: string }[]) {
        terms.set(row.student_id, [...(terms.get(row.student_id) ?? []), row]);
      }
      const done = new Map<string, number>();
      for (const row of check(progress) as { student_id: string }[]) {
        done.set(row.student_id, (done.get(row.student_id) ?? 0) + 1);
      }
      return (check(profiles) as Profile[]).map(
        (profile): StudentRow => ({
          ...profile,
          access_until: accessUntilFrom(terms.get(profile.id) ?? []),
          completed_lessons: done.get(profile.id) ?? 0,
        }),
      );
    },
    async grantAccess(studentId, days, note) {
      check(await db.rpc("grant_access", { target: studentId, extra_days: days, reason: note }));
    },
    async revokeAccess(studentId) {
      check(await db.rpc("revoke_access", { target: studentId }));
    },
    async setRole(userId, role) {
      check(await db.from("profiles").update({ role }).eq("id", userId));
    },
    async saveCourse(course) {
      return check(await db.from("courses").upsert(course).select().single()) as Course;
    },
    async deleteCourse(id) {
      check(await db.from("courses").delete().eq("id", id));
    },
    async getCourseForEdit(id) {
      const course = check(await db.from("courses").select("*").eq("id", id).maybeSingle()) as Course | null;
      if (!course) return null;
      const lessons = check(await db.from("lessons").select("*").eq("course_id", id).order("sort")) as Lesson[];
      return { course, lessons };
    },
    async getLessonForEdit(id) {
      const lesson = check(await db.from("lessons").select("*").eq("id", id).maybeSingle()) as Lesson | null;
      if (!lesson) return null;
      const [course, materials, tasks] = await Promise.all([
        db.from("courses").select("*").eq("id", lesson.course_id).single(),
        db.from("lesson_materials").select("*").eq("lesson_id", id).maybeSingle(),
        db.from("tasks").select("*").eq("lesson_id", id).order("sort"),
      ]);
      return {
        lesson,
        course: check(course) as Course,
        materials: (check(materials) as LessonMaterials | null) ?? { lesson_id: id, video_url: "", body: "", body_kk: "", body_en: "" },
        tasks: (check(tasks) as Task[]).sort(bySort),
      };
    },
    async saveLesson(lesson, materials) {
      const saved = check(await db.from("lessons").upsert(lesson).select().single()) as Lesson;
      if (materials) check(await db.from("lesson_materials").upsert({ ...materials, lesson_id: saved.id }));
      return saved;
    },
    async deleteLesson(id) {
      check(await db.from("lessons").delete().eq("id", id));
    },
    async saveTask(task) {
      return check(await db.from("tasks").upsert(task).select().single()) as Task;
    },
    async deleteTask(id) {
      check(await db.from("tasks").delete().eq("id", id));
    },
    async savePlan(plan) {
      return check(await db.from("plans").upsert(plan).select().single()) as Plan;
    },
    async deletePlan(id) {
      check(await db.from("plans").delete().eq("id", id));
    },
    async savePaymentSettings(settings) {
      check(await db.from("payment_settings").update({ ...settings, updated_at: new Date().toISOString() }).eq("id", 1));
    },
    async uploadImage(file) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${newId()}.${ext}`;
      check(await db.storage.from("public-assets").upload(path, file, { contentType: file.type }));
      return db.storage.from("public-assets").getPublicUrl(path).data.publicUrl;
    },
    async listSubmissions(status) {
      let query = db.from("submissions").select(SUBMISSION_SELECT).order("updated_at", { ascending: status === "submitted" }).limit(200);
      if (status !== "all") query = query.eq("status", status);
      return check(await query) as Submission[];
    },
    async reviewSubmission(id, input) {
      check(
        await db
          .from("submissions")
          .update({ ...input, reviewed_at: new Date().toISOString(), reviewed_by: await this.currentUserId() })
          .eq("id", id),
      );
    },
  };
}
