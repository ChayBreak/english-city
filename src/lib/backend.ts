import { isSupabaseConfigured } from "./supabase";
import { createDemoBackend } from "./demoBackend";
import { createSupabaseBackend } from "./supabaseBackend";
import type {
  AdminStats,
  Course,
  CourseSummary,
  Lesson,
  LessonMaterials,
  LessonView,
  PaymentRequest,
  PaymentSettings,
  PaymentStatus,
  Plan,
  Profile,
  ReviewStatus,
  StudentRow,
  Submission,
  SubmissionAnswer,
  Task,
  TaskResult,
} from "./types";

export type SignUpInput = { email: string; password: string; full_name: string; phone: string };
export type PaymentInput = { plan_id: string; payer_name: string; payer_phone: string };
export type SubmitInput = {
  task: Task;
  answer: SubmissionAnswer;
  auto_score: number | null;
};
export type ReviewInput = {
  status: ReviewStatus;
  score: number | null;
  feedback: string;
  feedback_audio_path: string;
};
export type Progress = {
  completed: string[];
  results: TaskResult[];
  submissions: Submission[];
};

/** Everything the UI needs from the server. Implemented by Supabase and by an
 * in-browser demo store used when Supabase isn't configured. */
export interface Backend {
  mode: "supabase" | "demo";

  currentUserId(): Promise<string | null>;
  onAuthChange(callback: () => void): () => void;
  signIn(email: string, password: string): Promise<void>;
  /** Returns true when the account still has to be confirmed by email. */
  signUp(input: SignUpInput): Promise<boolean>;
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
  getProfile(userId: string): Promise<Profile>;
  updateProfile(userId: string, patch: Pick<Profile, "full_name" | "phone">): Promise<void>;
  getAccessUntil(userId: string): Promise<string | null>;

  listCourses(includeDrafts?: boolean): Promise<CourseSummary[]>;
  getCourse(slug: string): Promise<{ course: Course; lessons: Lesson[] } | null>;
  getLesson(lessonId: string): Promise<LessonView | null>;
  listPlans(includeInactive?: boolean): Promise<Plan[]>;
  getPaymentSettings(): Promise<PaymentSettings>;

  createPaymentRequest(input: PaymentInput): Promise<void>;
  listMyPayments(userId: string): Promise<PaymentRequest[]>;
  getProgress(userId: string): Promise<Progress>;
  completeLesson(userId: string, lessonId: string): Promise<void>;
  saveTaskResult(userId: string, taskId: string, score: number, total: number): Promise<void>;
  uploadAudio(folder: string, blob: Blob): Promise<string>;
  audioUrl(path: string): Promise<string>;
  submitTask(userId: string, input: SubmitInput): Promise<void>;

  adminStats(): Promise<AdminStats>;
  listPayments(status: PaymentStatus | "all"): Promise<PaymentRequest[]>;
  approvePayment(id: string): Promise<void>;
  rejectPayment(id: string, note: string): Promise<void>;
  listStudents(): Promise<StudentRow[]>;
  grantAccess(studentId: string, days: number, note: string): Promise<void>;
  revokeAccess(studentId: string): Promise<void>;
  setRole(userId: string, role: Profile["role"]): Promise<void>;
  saveCourse(course: Course): Promise<Course>;
  deleteCourse(id: string): Promise<void>;
  getCourseForEdit(id: string): Promise<{ course: Course; lessons: Lesson[] } | null>;
  getLessonForEdit(id: string): Promise<{ lesson: Lesson; course: Course; materials: LessonMaterials; tasks: Task[] } | null>;
  saveLesson(lesson: Lesson, materials?: LessonMaterials): Promise<Lesson>;
  deleteLesson(id: string): Promise<void>;
  saveTask(task: Task): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  savePlan(plan: Plan): Promise<Plan>;
  deletePlan(id: string): Promise<void>;
  savePaymentSettings(settings: PaymentSettings): Promise<void>;
  uploadImage(file: File): Promise<string>;
  listSubmissions(status: ReviewStatus | "all"): Promise<Submission[]>;
  reviewSubmission(id: string, input: ReviewInput): Promise<void>;
}

export const backend: Backend = isSupabaseConfigured
  ? createSupabaseBackend()
  : createDemoBackend();
