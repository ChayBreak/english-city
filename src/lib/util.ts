import type { Course, CourseSummary, Lesson } from "./types";

export const newId = () => crypto.randomUUID();

export const bySort = <T extends { sort: number }>(a: T, b: T) => a.sort - b.sort;

export function summarize(course: Course, lessons: Pick<Lesson, "minutes" | "is_published">[]): CourseSummary {
  const visible = lessons.filter((lesson) => lesson.is_published);
  return {
    ...course,
    lesson_count: visible.length,
    minutes: visible.reduce((sum, lesson) => sum + lesson.minutes, 0),
  };
}

export const isActive = (until: string | null) => Boolean(until && new Date(until).getTime() > Date.now());

export const daysUntil = (iso: string | null) =>
  iso ? Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)) : 0;

export function errorText(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) return String((error as { message: unknown }).message);
  return String(error);
}

/** When access ends. Extensions are chained onto the current term, so while any
 * term is running, access lasts until the latest end; otherwise it's the end of
 * the last term that started (for "expired on" display). */
export function accessUntilFrom(terms: { starts_at: string; ends_at: string }[]): string | null {
  // Compare as times: Postgres and JS format timestamps differently.
  const now = Date.now();
  const started = terms.filter((term) => Date.parse(term.starts_at) <= now);
  const running = started.some((term) => Date.parse(term.ends_at) > now);
  const pool = running ? terms : started;
  let latest: string | null = null;
  for (const term of pool) if (!latest || Date.parse(term.ends_at) > Date.parse(latest)) latest = term.ends_at;
  return latest;
}
