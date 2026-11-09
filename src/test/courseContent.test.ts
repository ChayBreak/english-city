import { describe, expect, it } from "vitest";
import { seedCourses, seedPlans } from "../data/seed";
import { signupPasswordIsValid } from "../lib/password";
import { createDemoBackend } from "../lib/demoBackend";

describe("pre-intermediate content", () => {
  it("publishes 18 ordered lessons with valid task relationships", () => {
    const course = seedCourses.find(c => c.slug === "everyday-english-b1")!;
    expect(course.title).toBe("Pre-Intermediate Course");
    const lessons = course.lessons.filter(l => l.is_published);
    expect(lessons).toHaveLength(18);
    expect(lessons.map(l => l.sort)).toEqual(Array.from({length:18},(_,i)=>i+1));
    const ids = lessons.flatMap(l => [l.id,...l.tasks.map(t=>t.id)]);
    expect(new Set(ids).size).toBe(ids.length);
    for (const lesson of lessons) {
      expect(lesson.materials.lesson_id).toBe(lesson.id);
      expect(lesson.tasks.length).toBeGreaterThan(0);
      for (const task of lesson.tasks) {
        expect(task.lesson_id).toBe(lesson.id);
        if (task.kind === "vocabulary") expect(task.data.words).toHaveLength(12);
        for (const q of task.data.questions ?? []) expect(q.correct).toBeLessThan(q.options.length);
      }
    }
    expect(lessons.filter(l=>l.tasks.some(t=>t.kind==='quiz'))).toHaveLength(3);
    expect(seedPlans[0].price).toBe(7700);
  });
  it.each([['123',false],['1234',true],['abcdefgh',true],['abcdefghi',false],['!!!!',true]])("validates length without complexity: %s",(password,valid)=>{
    expect(signupPasswordIsValid(password)).toBe(valid);
  });
  it("registers with email/password and preserves the account through the demo upgrade", async () => {
    localStorage.clear();
    const api = createDemoBackend();
    await api.signUp({email:'learner@example.com',password:'1234',full_name:'',phone:''});
    const user = await api.currentUserId();
    const stored = JSON.parse(localStorage.getItem('ec-demo-db')!);
    stored.version = 5;
    const newIds = new Set<string>();
    // Simulate the previous store with the new course lessons absent.
    const courseId = seedCourses.find(c=>c.slug==='everyday-english-b1')!.id;
    for (const lesson of seedCourses.find(c=>c.id===courseId)!.lessons.filter(l=>l.is_published)) newIds.add(lesson.id);
    stored.lessons = stored.lessons.filter((l: {id:string})=>!newIds.has(l.id));
    stored.materials = stored.materials.filter((m: {lesson_id:string})=>!newIds.has(m.lesson_id));
    stored.tasks = stored.tasks.filter((t: {lesson_id:string})=>!newIds.has(t.lesson_id));
    localStorage.setItem('ec-demo-db',JSON.stringify(stored));
    const upgraded = createDemoBackend();
    expect(await upgraded.currentUserId()).toBe(user);
    expect((await upgraded.getCourse('everyday-english-b1'))!.lessons).toHaveLength(18);
    await upgraded.signOut();
    await upgraded.signIn('learner@example.com','1234');
    expect(await upgraded.currentUserId()).toBe(user);
    const updated = JSON.parse(localStorage.getItem('ec-demo-db')!);
    expect(updated.payments).toEqual(stored.payments);
    expect(updated.submissions).toEqual(stored.submissions);
    expect(updated.version).toBe(6);
  });
});
