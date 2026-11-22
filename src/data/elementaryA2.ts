import type { SeedCourse, SeedLesson } from "./seed.ts";
import type { Locale, QuizQuestion, Task, VocabWord } from "../lib/types.ts";
import { elementaryA2Units, type LocalText } from "./elementaryA2Units.ts";

const id = (number: number) => `00000000-0000-4000-8000-${String(number).padStart(12, "0")}`;
export const ELEMENTARY_A2_SLUG = "elementary-a2";
const courseId = id(500);
const localized = (en: string, kk: string, ru: string): LocalText => ({ en, kk, ru });

const labels = {
  model: localized("Read the example", "Үлгіні оқыңыз", "Прочитайте пример"),
  language: localized("Language to use", "Қолданатын тілдік үлгі", "Языковая подсказка"),
  practice: localized("Try it yourself", "Өзіңіз қолданып көріңіз", "Попробуйте сами"),
  vocabulary: localized("Key words", "Негізгі сөздер", "Ключевые слова"),
  vocabularyPrompt: localized("Listen to the words and check their meanings.", "Сөздерді тыңдап, мағынасын тексеріңіз.", "Послушайте слова и проверьте их значения."),
  quiz: localized("Quick check", "Қысқа тексеру", "Быстрая проверка"),
  checkpoint: localized("Unit check", "Бөлім бойынша тест", "Тест по разделу"),
  quizPrompt: localized("Choose the answer that fits the situation.", "Жағдайға сай жауапты таңдаңыз.", "Выберите ответ, подходящий к ситуации."),
  speaking: localized("Listen and speak", "Тыңдаңыз және айтыңыз", "Послушайте и произнесите"),
  speakingPrompt: localized("Listen, repeat each phrase, and record yourself.", "Тыңдаңыз, әр сөйлемді қайталаңыз да, даусыңызды жазыңыз.", "Послушайте, повторите каждую фразу и запишите свой голос."),
  writing: localized("Put it into writing", "Жазып көріңіз", "Письменное задание"),
  review: localized("Review and use it", "Қайталау және қолдану", "Повторение и практика"),
};

type TaskDraft = Omit<Task, "id" | "lesson_id" | "sort">;

function task(kind: Task["kind"], title: LocalText, prompt: LocalText, data: Task["data"]): TaskDraft {
  return { kind, title: title.ru, title_kk: title.kk, title_en: title.en, prompt: prompt.ru, prompt_kk: prompt.kk, prompt_en: prompt.en, data };
}

function makeLesson(sort: number, title: LocalText, goal: LocalText, minutes: number, body: (locale: Locale) => string, activities: TaskDraft[]): SeedLesson {
  const lessonId = id(3000 + sort);
  return {
    id: lessonId, course_id: courseId, sort, minutes,
    title: title.ru, title_kk: title.kk, title_en: title.en,
    summary: goal.ru, summary_kk: goal.kk, summary_en: goal.en,
    is_free: sort === 1, is_published: true,
    materials: { lesson_id: lessonId, video_url: "", body: body("ru"), body_kk: body("kk"), body_en: body("en") },
    tasks: activities.map((activity, index) => ({
      ...activity, id: id(300000 + sort * 10 + index + 1), lesson_id: lessonId, sort: index + 1,
    })),
  };
}

function numberedTitle(number: string, title: LocalText): LocalText {
  return localized(`${number} ${title.en}`, `${number} ${title.kk}`, `${number} ${title.ru}`);
}

const cases = (lines: string[]) => lines.map((line) => `- ${line}`).join("\n");

function questions(rows: readonly QuizQuestion[]) {
  return { questions: rows.map((row) => ({ ...row, options: [...row.options] })) };
}

function words(rows: readonly [term: string, kk: string, ru: string, example: string][]): VocabWord[] {
  return rows.map(([term, kk, ru, example]) => ({ term, kk, ru, example }));
}

const lessons = elementaryA2Units.flatMap((unit, unitIndex) => {
  const number = unitIndex + 1;
  const first = 4 * unitIndex + 1;
  return [
    ...unit.lessons.map((item, index) => makeLesson(first + index, numberedTitle(`${number}.${index + 1}`, item.title), item.goal, 25,
      (locale) => [
        `## ${labels.model[locale]}`, cases(item.model),
        `## ${labels.language[locale]}`, item.rule[locale],
        `## ${labels.practice[locale]}`, item.tryIt[locale],
      ].join("\n\n"),
      [
        task("vocabulary", labels.vocabulary, labels.vocabularyPrompt, { words: words(item.words) }),
        task("pronunciation", labels.speaking, labels.speakingPrompt, { phrases: item.speak.map((text) => ({ text })) }),
        task("quiz", labels.quiz, labels.quizPrompt, questions(item.quiz)),
      ],
    )),
    makeLesson(first + 3, numberedTitle(`${number}.4`, labels.review), unit.outcome, 30,
      (locale) => [
        `## ${labels.language[locale]}`,
        cases(unit.lessons.map((item) => item.rule[locale])),
        `## ${labels.model[locale]}`, unit.writingModel,
        `## ${labels.practice[locale]}`, unit.writing[locale],
      ].join("\n\n"),
      [
        task("quiz", labels.checkpoint, labels.quizPrompt, questions(unit.checkpoint)),
        task("writing", labels.writing, unit.writing, { min_words: 20, max_words: 60, checklist: unit.checklist }),
      ],
    ),
  ];
});

export const elementaryA2Course: SeedCourse = {
  id: courseId,
  slug: ELEMENTARY_A2_SLUG,
  title: "Elementary English",
  title_kk: "Elementary English",
  title_en: "Elementary English",
  subtitle: "Английский для повседневных ситуаций · Разделы 1–6",
  subtitle_kk: "Күнделікті өмірге арналған ағылшын тілі · 1–6-бөлім",
  subtitle_en: "English for everyday situations · Units 1–6",
  description: "Научитесь знакомиться, рассказывать о привычках, общаться на работе и учёбе, спрашивать дорогу, рассказывать о поездках и заказывать еду. В каждом разделе есть разговорная практика и итоговое задание.",
  description_kk: "Танысуды, күн тәртібі туралы айтуды, жұмыс пен оқу жайлы сөйлесуді, жол сұрауды, сапарды әңгімелеуді және тағамға тапсырыс беруді үйренесіз. Әр бөлімде айтылым жаттығуы мен қорытынды тапсырма бар.",
  description_en: "Introduce yourself, describe your routines, talk about work and study, ask for directions, tell travel stories, and order food. Each unit includes speaking practice and a checkpoint.",
  level: "A2", category: "general", glyph: "general",
  cover_url: "/images/english-city/elementary-a2.webp", is_published: true, sort: 25, lessons,
};

export const elementaryA2Sections = elementaryA2Units.map((unit, index) => ({
  title: localized(`Unit ${index + 1} · ${unit.title.en}`, `${index + 1}-бөлім · ${unit.title.kk}`, `Раздел ${index + 1} · ${unit.title.ru}`),
  lessonIds: new Set(lessons.slice(index * 4, index * 4 + 4).map((lesson) => lesson.id)),
}));
