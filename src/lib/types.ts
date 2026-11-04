export type Locale = "ru" | "kk" | "en";
export type Role = "student" | "admin";
export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type Category = "general" | "speaking" | "grammar" | "ielts" | "business";
export type TaskKind = "pronunciation" | "quiz" | "writing" | "vocabulary";
export type PaymentStatus = "pending" | "approved" | "rejected";
export type ReviewStatus = "submitted" | "reviewed" | "needs_work";

export const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const CATEGORIES: Category[] = ["general", "speaking", "grammar", "ielts", "business"];
export const TASK_KINDS: TaskKind[] = ["pronunciation", "quiz", "writing", "vocabulary"];

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  role: Role;
  created_at: string;
};

export type Plan = {
  id: string;
  title: string;
  title_kk: string;
  title_en: string;
  description: string;
  description_kk: string;
  description_en: string;
  days: number;
  price: number;
  old_price: number | null;
  featured: boolean;
  is_active: boolean;
  sort: number;
};

export type PaymentSettings = {
  qr_url: string;
  pay_url: string;
  recipient: string;
  instructions: string;
  instructions_kk: string;
  instructions_en: string;
};

export type PersonRef = { full_name: string; email: string; phone: string };

export type PaymentRequest = {
  id: string;
  student_id: string;
  plan_id: string | null;
  plan_title: string;
  amount: number;
  days: number;
  payer_name: string;
  payer_phone: string;
  status: PaymentStatus;
  admin_note: string;
  reviewed_at: string | null;
  created_at: string;
  student?: PersonRef | null;
};

export type Subscription = {
  id: string;
  student_id: string;
  starts_at: string;
  ends_at: string;
  note: string;
  created_at: string;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  title_kk: string;
  title_en: string;
  subtitle: string;
  subtitle_kk: string;
  subtitle_en: string;
  description: string;
  description_kk: string;
  description_en: string;
  level: Level;
  category: Category;
  glyph: string;
  cover_url: string;
  is_published: boolean;
  sort: number;
};

export type CourseSummary = Course & { lesson_count: number; minutes: number };

export type Lesson = {
  id: string;
  course_id: string;
  sort: number;
  title: string;
  title_kk: string;
  title_en: string;
  summary: string;
  summary_kk: string;
  summary_en: string;
  minutes: number;
  is_free: boolean;
  is_published: boolean;
};

export type LessonMaterials = {
  lesson_id: string;
  video_url: string;
  body: string;
  body_kk: string;
  body_en: string;
};

export type Phrase = { text: string; hint?: string; hint_kk?: string; hint_en?: string };
export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  explanation_kk?: string;
  explanation_en?: string;
};
export type VocabWord = { term: string; ru: string; kk: string; example?: string };

export type TaskData = {
  phrases?: Phrase[];
  questions?: QuizQuestion[];
  words?: VocabWord[];
  min_words?: number;
  max_words?: number;
  checklist?: string[];
};

export type Task = {
  id: string;
  lesson_id: string;
  sort: number;
  kind: TaskKind;
  title: string;
  title_kk: string;
  title_en: string;
  prompt: string;
  prompt_kk: string;
  prompt_en: string;
  data: TaskData;
};

export type PhraseAttempt = {
  text: string;
  audio_path: string;
  transcript: string;
  score: number | null;
};

export type SubmissionAnswer = { items?: PhraseAttempt[]; text?: string };

export type Submission = {
  id: string;
  student_id: string;
  task_id: string;
  lesson_id: string;
  kind: TaskKind;
  answer: SubmissionAnswer;
  auto_score: number | null;
  status: ReviewStatus;
  score: number | null;
  feedback: string;
  feedback_audio_path: string;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  student?: PersonRef | null;
  task?: Pick<Task, "title" | "title_kk" | "title_en" | "kind" | "prompt"> | null;
  lesson?: (Pick<Lesson, "title" | "title_kk" | "title_en"> & { course?: Pick<Course, "title" | "title_kk" | "title_en"> | null }) | null;
};

export type TaskResult = { task_id: string; score: number; total: number };

export type LessonView = {
  lesson: Lesson;
  course: Course;
  lessons: Lesson[];
  /** null when the lesson is locked for this viewer */
  materials: LessonMaterials | null;
  tasks: Task[];
};

export type StudentRow = Profile & {
  access_until: string | null;
  completed_lessons: number;
};

export type AdminStats = {
  pendingPayments: number;
  pendingReviews: number;
  activeStudents: number;
  publishedCourses: number;
};
