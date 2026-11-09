// Demo mode: the whole school in the browser's localStorage, used when
// Supabase keys aren't configured. Mirrors the rules the database enforces.
import { seedCourses, seedPaymentSettings, seedPlans } from "../data/seed";
import { signupPasswordIsValid } from "./password";
import type { Backend } from "./backend";
import type {
  Course,
  Lesson,
  LessonMaterials,
  PaymentRequest,
  PaymentSettings,
  Plan,
  Profile,
  Role,
  Submission,
  Subscription,
  Task,
  TaskResult,
} from "./types";
import { accessUntilFrom, bySort, isActive, newId, summarize } from "./util";

type DemoUser = Profile & { password: string };
type DB = {
  version: number;
  users: DemoUser[];
  plans: Plan[];
  settings: PaymentSettings;
  courses: Course[];
  lessons: Lesson[];
  materials: LessonMaterials[];
  tasks: Task[];
  payments: PaymentRequest[];
  subscriptions: Subscription[];
  progress: { student_id: string; lesson_id: string }[];
  results: (TaskResult & { student_id: string })[];
  submissions: Submission[];
};

const DB_KEY = "ec-demo-db";
const SESSION_KEY = "ec-demo-session";
const VERSION = 6;
export const DEMO_ADMIN_ID = "demo-admin";
export const DEMO_STUDENT_ID = "demo-student";

const now = () => new Date().toISOString();
const daysFromNow = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString();
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

function seedDb(): DB {
  const courses: Course[] = [];
  const lessons: Lesson[] = [];
  const materials: LessonMaterials[] = [];
  const tasks: Task[] = [];
  for (const { lessons: courseLessons, ...course } of clone(seedCourses)) {
    courses.push(course);
    for (const { materials: m, tasks: t, ...lesson } of courseLessons) {
      lessons.push(lesson);
      materials.push(m);
      tasks.push(...t);
    }
  }
  const person = (id: string, full_name: string, email: string, phone: string, role: Role): DemoUser => ({
    id,
    full_name,
    email,
    phone,
    role,
    password: "",
    created_at: daysFromNow(-20),
  });
  const writingTask = tasks.find((task) => task.kind === "writing" && task.data.min_words === 100)!;
  return {
    version: VERSION,
    users: [
      person(DEMO_ADMIN_ID, "Администратор", "admin@demo.local", "+7 700 000 00 00", "admin"),
      person(DEMO_STUDENT_ID, "Аружан Серикова", "student@demo.local", "+7 701 111 22 33", "student"),
      person("demo-dauren", "Даурен Абенов", "dauren@demo.local", "+7 705 444 55 66", "student"),
    ],
    plans: clone(seedPlans),
    settings: clone(seedPaymentSettings),
    courses,
    lessons,
    materials,
    tasks,
    payments: [
      {
        id: newId(),
        student_id: DEMO_STUDENT_ID,
        plan_id: seedPlans[1].id,
        plan_title: seedPlans[1].title,
        amount: seedPlans[1].price,
        days: seedPlans[1].days,
        payer_name: "Аружан С.",
        payer_phone: "+7 701 111 22 33",
        status: "pending",
        admin_note: "",
        reviewed_at: null,
        created_at: daysFromNow(-0.05),
      },
    ],
    subscriptions: [
      {
        id: newId(),
        student_id: "demo-dauren",
        starts_at: daysFromNow(-10),
        ends_at: daysFromNow(20),
        note: seedPlans[0].title,
        created_at: daysFromNow(-10),
      },
    ],
    progress: [],
    results: [],
    submissions: [
      {
        id: newId(),
        student_id: "demo-dauren",
        task_id: writingTask.id,
        lesson_id: writingTask.lesson_id,
        kind: "writing",
        answer: {
          text: "Last year I was working in a small café in Astana. One morning, while I was making coffee, a tourist from Canada asked me for directions. At first I was nervous because I didn't speak English well. Suddenly I remembered some phrases from my lessons and I explained the way to the museum. The tourist smiled and thanked me. In the end we talked for ten minutes about Kazakhstan. That day I understood that I can really use English. It was a small conversation, but it changed how I think about learning. Now I practise every day.",
        },
        auto_score: null,
        status: "submitted",
        score: null,
        feedback: "",
        feedback_audio_path: "",
        reviewed_at: null,
        created_at: daysFromNow(-1),
        updated_at: daysFromNow(-1),
      },
    ],
  };
}

function load(): DB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DB;
      if (parsed.version === VERSION) return parsed;
      if (parsed.version === 5) {
        const fresh = seedDb();
        const courseId = "00000000-0000-4000-8000-000000000100";
        const updated = fresh.courses.find((course) => course.id === courseId)!;
        parsed.courses = parsed.courses.map((course) => course.id === courseId ? updated : course);
        const archived = new Map(fresh.lessons.filter((lesson) => lesson.course_id === courseId && !lesson.is_published).map((lesson) => [lesson.id, lesson.sort]));
        parsed.lessons = parsed.lessons.map((lesson) => archived.has(lesson.id) ? { ...lesson, is_published: false, sort: archived.get(lesson.id)! } : lesson);
        parsed.lessons.push(...fresh.lessons.filter((lesson) => lesson.course_id === courseId && lesson.is_published));
        const ids = new Set(parsed.lessons.filter((lesson) => lesson.course_id === courseId && lesson.is_published).map((lesson) => lesson.id));
        parsed.materials.push(...fresh.materials.filter((material) => ids.has(material.lesson_id)));
        parsed.tasks.push(...fresh.tasks.filter((task) => ids.has(task.lesson_id)));
        const planId = seedPlans[0].id;
        parsed.plans = parsed.plans.map((plan) => plan.id === planId ? { ...plan, price: 7700 } : plan);
        parsed.version = VERSION;
        localStorage.setItem(DB_KEY, JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch {
    /* fall through to a fresh store */
  }
  return seedDb();
}

export function resetDemo() {
  try {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
}

export type DemoBackend = Backend & { demoSignIn(role: Role): Promise<void> };

export function createDemoBackend(): DemoBackend {
  let db = load();
  const audio = new Map<string, Blob>();
  const listeners = new Set<() => void>();
  let session: string | null = null;
  try {
    session = localStorage.getItem(SESSION_KEY);
  } catch {
    session = null;
  }

  const save = () => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
      /* quota or private mode: keep working in memory */
    }
  };
  const setSession = (userId: string | null) => {
    session = userId;
    try {
      if (userId) localStorage.setItem(SESSION_KEY, userId);
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* in-memory session only */
    }
    listeners.forEach((listener) => listener());
  };
  const me = () => db.users.find((user) => user.id === session) ?? null;
  const isAdmin = () => me()?.role === "admin";
  const requireAdmin = () => {
    if (!isAdmin()) throw new Error("Только для администратора");
  };
  const requireUser = () => {
    const user = me();
    if (!user) throw new Error("Войдите в аккаунт");
    return user;
  };
  const person = (id: string) => {
    const user = db.users.find((u) => u.id === id);
    return user ? { full_name: user.full_name, email: user.email, phone: user.phone } : null;
  };
  const accessUntil = (userId: string) => accessUntilFrom(db.subscriptions.filter((s) => s.student_id === userId));
  const canOpen = (lesson: Lesson) => {
    if (isAdmin()) return true;
    const course = db.courses.find((c) => c.id === lesson.course_id);
    if (!course?.is_published || !lesson.is_published) return false;
    return lesson.is_free || (session !== null && isActive(accessUntil(session)));
  };
  const grant = (studentId: string, days: number, note: string) => {
    const latest = db.subscriptions
      .filter((s) => s.student_id === studentId)
      .map((s) => s.ends_at)
      .sort()
      .at(-1);
    const start = latest && latest > now() ? latest : now();
    const end = new Date(new Date(start).getTime() + days * 86_400_000).toISOString();
    db.subscriptions.push({ id: newId(), student_id: studentId, starts_at: start, ends_at: end, note, created_at: now() });
  };
  const withRefs = (submission: Submission): Submission => {
    const task = db.tasks.find((t) => t.id === submission.task_id);
    const lesson = db.lessons.find((l) => l.id === submission.lesson_id);
    const course = lesson && db.courses.find((c) => c.id === lesson.course_id);
    return {
      ...submission,
      student: person(submission.student_id),
      task: task ? { title: task.title, title_kk: task.title_kk, title_en: task.title_en, kind: task.kind, prompt: task.prompt } : null,
      lesson: lesson
        ? {
            title: lesson.title,
            title_kk: lesson.title_kk,
            title_en: lesson.title_en,
            course: course ? { title: course.title, title_kk: course.title_kk, title_en: course.title_en } : null,
          }
        : null,
    };
  };
  const upsert = <T extends { id: string }>(list: T[], item: T) => {
    const index = list.findIndex((entry) => entry.id === item.id);
    if (index >= 0) list[index] = item;
    else list.push(item);
    return item;
  };
  const tick = <T,>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(clone(value)), 60));

  return {
    mode: "demo",

    async demoSignIn(role) {
      setSession(role === "admin" ? DEMO_ADMIN_ID : DEMO_STUDENT_ID);
    },
    async currentUserId() {
      return session && me() ? session : null;
    },
    onAuthChange(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    async signIn(email, password) {
      const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!user || (user.password && user.password !== password)) throw new Error("Invalid login credentials");
      setSession(user.id);
    },
    async signUp({ email, password, full_name, phone }) {
      if (!signupPasswordIsValid(password)) throw new Error("Password must contain 4–8 characters.");
      if (db.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
        throw new Error("User already registered");
      }
      const user: DemoUser = {
        id: newId(),
        email: email.trim(),
        password,
        full_name,
        phone,
        role: "student",
        created_at: now(),
      };
      db.users.push(user);
      save();
      setSession(user.id);
      return false;
    },
    async signInWithGoogle() {
      throw new Error("Вход через Google работает после подключения Supabase");
    },
    async signOut() {
      setSession(null);
    },
    async getProfile(userId) {
      const user = db.users.find((u) => u.id === userId);
      if (!user) throw new Error("Profile not found");
      const { password: _password, ...profile } = user;
      return tick(profile);
    },
    async updateProfile(userId, patch) {
      const user = db.users.find((u) => u.id === userId);
      if (user) Object.assign(user, patch);
      save();
    },
    async getAccessUntil(userId) {
      return accessUntil(userId);
    },

    async listCourses(includeDrafts) {
      const courses = db.courses.filter((c) => includeDrafts || c.is_published).sort(bySort);
      return tick(courses.map((c) => summarize(c, db.lessons.filter((l) => l.course_id === c.id))));
    },
    async getCourse(slug) {
      const course = db.courses.find((c) => c.slug === slug && (c.is_published || isAdmin()));
      if (!course) return null;
      const lessons = db.lessons.filter((l) => l.course_id === course.id && l.is_published).sort(bySort);
      return tick({ course, lessons });
    },
    async getLesson(lessonId) {
      const lesson = db.lessons.find((l) => l.id === lessonId);
      const course = lesson && db.courses.find((c) => c.id === lesson.course_id);
      if (!lesson || !course || (!isAdmin() && (!course.is_published || !lesson.is_published))) return null;
      const open = canOpen(lesson);
      return tick({
        lesson,
        course,
        lessons: db.lessons.filter((l) => l.course_id === course.id && l.is_published).sort(bySort),
        materials: open ? db.materials.find((m) => m.lesson_id === lessonId) ?? null : null,
        tasks: open ? db.tasks.filter((t) => t.lesson_id === lessonId).sort(bySort) : [],
      });
    },
    async listPlans(includeInactive) {
      return tick(db.plans.filter((p) => includeInactive || p.is_active).sort(bySort));
    },
    async getPaymentSettings() {
      return tick(db.settings);
    },

    async createPaymentRequest(input) {
      const user = requireUser();
      const plan = db.plans.find((p) => p.id === input.plan_id && p.is_active);
      if (!plan) throw new Error("Plan is not available");
      db.payments.push({
        id: newId(),
        student_id: user.id,
        plan_id: plan.id,
        plan_title: plan.title,
        amount: plan.price,
        days: plan.days,
        payer_name: input.payer_name,
        payer_phone: input.payer_phone,
        status: "pending",
        admin_note: "",
        reviewed_at: null,
        created_at: now(),
      });
      save();
    },
    async listMyPayments(userId) {
      return tick(db.payments.filter((p) => p.student_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at)));
    },
    async getProgress(userId) {
      return tick({
        completed: db.progress.filter((p) => p.student_id === userId).map((p) => p.lesson_id),
        results: db.results.filter((r) => r.student_id === userId),
        submissions: db.submissions
          .filter((s) => s.student_id === userId)
          .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
          .map(withRefs),
      });
    },
    async completeLesson(userId, lessonId) {
      if (!db.progress.some((p) => p.student_id === userId && p.lesson_id === lessonId)) {
        db.progress.push({ student_id: userId, lesson_id: lessonId });
        save();
      }
    },
    async saveTaskResult(userId, taskId, score, total) {
      const existing = db.results.find((r) => r.student_id === userId && r.task_id === taskId);
      if (existing && existing.score >= score) return;
      if (existing) Object.assign(existing, { score, total });
      else db.results.push({ student_id: userId, task_id: taskId, score, total });
      save();
    },
    async uploadAudio(folder, blob) {
      const path = `${folder}/${newId()}.webm`;
      audio.set(path, blob);
      // Keep short recordings across reloads when they fit in storage.
      if (blob.size < 400_000) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            localStorage.setItem(`ec-demo-audio:${path}`, String(reader.result));
          } catch {
            /* memory only */
          }
        };
        reader.readAsDataURL(blob);
      }
      return path;
    },
    async audioUrl(path) {
      const blob = audio.get(path);
      if (blob) return URL.createObjectURL(blob);
      try {
        return localStorage.getItem(`ec-demo-audio:${path}`) ?? "";
      } catch {
        return "";
      }
    },
    async submitTask(userId, { task, answer, auto_score }) {
      const existing = db.submissions.find((s) => s.student_id === userId && s.task_id === task.id);
      const base = {
        answer,
        auto_score,
        status: "submitted" as const,
        score: null,
        feedback: "",
        feedback_audio_path: "",
        reviewed_at: null,
        updated_at: now(),
      };
      if (existing) Object.assign(existing, base);
      else
        db.submissions.push({
          id: newId(),
          student_id: userId,
          task_id: task.id,
          lesson_id: task.lesson_id,
          kind: task.kind,
          created_at: now(),
          ...base,
        });
      save();
    },

    async adminStats() {
      requireAdmin();
      return {
        pendingPayments: db.payments.filter((p) => p.status === "pending").length,
        pendingReviews: db.submissions.filter((s) => s.status === "submitted").length,
        publishedCourses: db.courses.filter((c) => c.is_published).length,
        activeStudents: db.users.filter((u) => isActive(accessUntil(u.id))).length,
      };
    },
    async listPayments(status) {
      requireAdmin();
      return tick(
        db.payments
          .filter((p) => status === "all" || p.status === status)
          .sort((a, b) => b.created_at.localeCompare(a.created_at))
          .map((p) => ({ ...p, student: person(p.student_id) })),
      );
    },
    async approvePayment(id) {
      requireAdmin();
      const payment = db.payments.find((p) => p.id === id);
      if (!payment || payment.status !== "pending") throw new Error("Request is not pending");
      grant(payment.student_id, payment.days, payment.plan_title);
      Object.assign(payment, { status: "approved", reviewed_at: now() });
      save();
    },
    async rejectPayment(id, note) {
      requireAdmin();
      const payment = db.payments.find((p) => p.id === id);
      if (!payment || payment.status !== "pending") throw new Error("Request is not pending");
      Object.assign(payment, { status: "rejected", admin_note: note, reviewed_at: now() });
      save();
    },
    async listStudents() {
      requireAdmin();
      return tick(
        db.users
          .map(({ password: _password, ...user }) => ({
            ...user,
            access_until: accessUntil(user.id),
            completed_lessons: db.progress.filter((p) => p.student_id === user.id).length,
          }))
          .sort((a, b) => b.created_at.localeCompare(a.created_at)),
      );
    },
    async grantAccess(studentId, days, note) {
      requireAdmin();
      grant(studentId, days, note);
      save();
    },
    async revokeAccess(studentId) {
      requireAdmin();
      db.subscriptions.forEach((s) => {
        if (s.student_id === studentId && s.ends_at > now()) s.ends_at = now();
      });
      save();
    },
    async setRole(userId, role) {
      requireAdmin();
      const user = db.users.find((u) => u.id === userId);
      if (user) user.role = role;
      save();
    },
    async saveCourse(course) {
      requireAdmin();
      if (db.courses.some((c) => c.slug === course.slug && c.id !== course.id)) {
        throw new Error('duplicate key value violates unique constraint "courses_slug_key"');
      }
      upsert(db.courses, course);
      save();
      return clone(course);
    },
    async deleteCourse(id) {
      requireAdmin();
      const lessonIds = new Set(db.lessons.filter((l) => l.course_id === id).map((l) => l.id));
      db.courses = db.courses.filter((c) => c.id !== id);
      db.lessons = db.lessons.filter((l) => !lessonIds.has(l.id));
      db.materials = db.materials.filter((m) => !lessonIds.has(m.lesson_id));
      db.tasks = db.tasks.filter((t) => !lessonIds.has(t.lesson_id));
      save();
    },
    async getCourseForEdit(id) {
      requireAdmin();
      const course = db.courses.find((c) => c.id === id);
      if (!course) return null;
      return tick({ course, lessons: db.lessons.filter((l) => l.course_id === id).sort(bySort) });
    },
    async getLessonForEdit(id) {
      requireAdmin();
      const lesson = db.lessons.find((l) => l.id === id);
      const course = lesson && db.courses.find((c) => c.id === lesson.course_id);
      if (!lesson || !course) return null;
      return tick({
        lesson,
        course,
        materials: db.materials.find((m) => m.lesson_id === id) ?? { lesson_id: id, video_url: "", body: "", body_kk: "", body_en: "" },
        tasks: db.tasks.filter((t) => t.lesson_id === id).sort(bySort),
      });
    },
    async saveLesson(lesson, materials) {
      requireAdmin();
      upsert(db.lessons, lesson);
      if (materials) {
        db.materials = db.materials.filter((m) => m.lesson_id !== lesson.id);
        db.materials.push({ ...materials, lesson_id: lesson.id });
      }
      save();
      return clone(lesson);
    },
    async deleteLesson(id) {
      requireAdmin();
      db.lessons = db.lessons.filter((l) => l.id !== id);
      db.materials = db.materials.filter((m) => m.lesson_id !== id);
      db.tasks = db.tasks.filter((t) => t.lesson_id !== id);
      save();
    },
    async saveTask(task) {
      requireAdmin();
      upsert(db.tasks, task);
      save();
      return clone(task);
    },
    async deleteTask(id) {
      requireAdmin();
      db.tasks = db.tasks.filter((t) => t.id !== id);
      save();
    },
    async savePlan(plan) {
      requireAdmin();
      upsert(db.plans, plan);
      save();
      return clone(plan);
    },
    async deletePlan(id) {
      requireAdmin();
      db.plans = db.plans.filter((p) => p.id !== id);
      save();
    },
    async savePaymentSettings(settings) {
      requireAdmin();
      db.settings = { ...settings };
      save();
    },
    async uploadImage(file) {
      requireAdmin();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    },
    async listSubmissions(status) {
      requireAdmin();
      return tick(
        db.submissions
          .filter((s) => status === "all" || s.status === status)
          .sort((a, b) =>
            status === "submitted" ? a.updated_at.localeCompare(b.updated_at) : b.updated_at.localeCompare(a.updated_at),
          )
          .map(withRefs),
      );
    },
    async reviewSubmission(id, input) {
      requireAdmin();
      const submission = db.submissions.find((s) => s.id === id);
      if (submission) Object.assign(submission, input, { reviewed_at: now() });
      save();
    },
  };
}
