import { writeFileSync } from "node:fs";
import { seedCourses, seedPlans } from "../src/data/seed.ts";

const path = process.argv[2];
if (!path?.endsWith("_pre_intermediate_and_monthly_price.sql")) throw new Error("Pass the CLI-created migration path.");
const value = (v: unknown): string => v == null ? 'null' : typeof v === 'number' || typeof v === 'boolean' ? String(v) : typeof v === 'object' ? `${value(JSON.stringify(v))}::jsonb` : `'${String(v).replaceAll("'", "''")}'`;
const upsert = (table: string, row: Record<string, unknown>, key = 'id') => {
  const keys = Object.keys(row);
  return `insert into public.${table} (${keys.join(', ')}) values (${keys.map(k=>value(row[k])).join(', ')}) on conflict (${key}) do update set ${keys.filter(k=>k!==key).map(k=>`${k} = excluded.${k}`).join(', ')};`;
};
const {lessons,...course} = seedCourses.find(c=>c.slug==='everyday-english-b1')!;
const lines = ['-- Original English City lessons; existing student work and payment snapshots are preserved.', 'begin;',upsert('courses',course),`update public.plans set price = 7700 where id = ${value(seedPlans[0].id)};`];
for (const {materials,tasks,...lesson} of lessons) {
  if (!lesson.is_published) {
    lines.push(`update public.lessons set is_published = false, sort = ${lesson.sort} where id = ${value(lesson.id)} and course_id = ${value(course.id)};`);
    continue;
  }
  lines.push(upsert('lessons',lesson),upsert('lesson_materials',materials,'lesson_id'));
  for (const task of tasks) lines.push(upsert('tasks',task));
}
lines.push('commit;','');
writeFileSync(path,lines.join('\n'));
