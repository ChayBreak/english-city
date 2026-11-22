import type { Course, Lesson } from "./types";

const photos = "/images/english-city";

export const landingHeroPhoto = `${photos}/everyday-conversation.webp`;
export const landingHeroPhotoSmall = `${photos}/everyday-conversation-small.webp`;

const builtInCovers: Partial<Record<string, string>> = {
  "first-steps-a1": `${photos}/first-meeting.webp`,
  "clear-pronunciation-a2": `${photos}/pronunciation-practice.webp`,
  "everyday-english-b1": `${photos}/almaty-conversation-v2.webp`,
  "business-english-b2": `${photos}/business-english.webp`,
};

type CourseImageFields = Pick<Course, "slug" | "cover_url">;

export function courseCoverUrl(course: CourseImageFields) {
  return course.cover_url || builtInCovers[course.slug];
}

export function lessonCoverUrl(course: CourseImageFields, lesson: Pick<Lesson, "id">) {
  if (course.slug === "everyday-english-b1") {
    // The pre-intermediate unit IDs are stable across the demo and Supabase seeds.
    const number = Number(/^00000000-0000-4000-8000-0000000010([0-9]{2})$/.exec(lesson.id)?.[1]);
    if (number >= 7 && number <= 12) return `${photos}/first-experiences.webp`;
    if (number >= 13 && number <= 18) return `${photos}/work-and-rest.webp`;
  }
  return courseCoverUrl(course);
}
