import { beforeEach, describe, expect, it } from "vitest";
import { createDemoBackend, DEMO_STUDENT_ID } from "../lib/demoBackend";
import { comparePhrase, words } from "../lib/speech";
import { parseYouTube } from "../lib/youtube";

describe("pronunciation check", () => {
  it("expands contractions and digits", () => {
    expect(words("I'm from Almaty, 30 days!")).toEqual(["i", "am", "from", "almaty", "thirty", "days"]);
  });

  it("marks the words that were not heard", () => {
    const { marks, score } = comparePhrase("I think three is enough.", "I think tree is enough");
    expect(marks.map((m) => m.ok)).toEqual([true, true, false, true, true]);
    expect(score).toBe(80);
  });

  it("accepts a contraction heard as two words", () => {
    expect(comparePhrase("I'm from Almaty.", "I am from Almaty").score).toBe(100);
  });
});

describe("YouTube links", () => {
  it.each([
    ["https://www.youtube.com/watch?v=UNP03fDSj1U", "UNP03fDSj1U", 0],
    ["https://youtu.be/UNP03fDSj1U?t=63", "UNP03fDSj1U", 63],
    ["youtube.com/shorts/UNP03fDSj1U", "UNP03fDSj1U", 0],
    ["https://www.youtube.com/embed/UNP03fDSj1U?start=1m5s", "UNP03fDSj1U", 65],
  ])("parses %s", (url, id, start) => {
    expect(parseYouTube(url)).toEqual({ id, start });
  });

  it("rejects other links", () => {
    expect(parseYouTube("https://vimeo.com/123")).toBeNull();
  });
});

describe("subscription flow (demo store)", () => {
  beforeEach(() => localStorage.clear());

  it("locks paid lessons until the admin approves the Kaspi payment", async () => {
    const api = createDemoBackend();
    await api.demoSignIn("student");
    const course = await api.getCourse("everyday-english-b1");
    const [free, paid] = course!.lessons;
    expect((await api.getLesson(free.id))!.materials).not.toBeNull();
    expect((await api.getLesson(paid.id))!.materials).toBeNull();

    const [plan] = await api.listPlans();
    await api.createPaymentRequest({ plan_id: plan.id, payer_name: "Аружан С.", payer_phone: "+7 701 111 22 33" });
    expect(await api.getAccessUntil(DEMO_STUDENT_ID)).toBeNull();

    await api.demoSignIn("admin");
    const pending = await api.listPayments("pending");
    const mine = pending.find((p) => p.student_id === DEMO_STUDENT_ID && p.plan_id === plan.id)!;
    expect(mine.amount).toBe(plan.price);
    await api.approvePayment(mine.id);
    // The seeded 3-month request is approved too: terms stack.
    await api.approvePayment(pending.find((p) => p.id !== mine.id)!.id);

    const until = new Date((await api.getAccessUntil(DEMO_STUDENT_ID))!).getTime();
    const expected = Date.now() + (plan.days + 90) * 86_400_000;
    expect(Math.abs(until - expected)).toBeLessThan(60_000);

    await api.demoSignIn("student");
    expect((await api.getLesson(paid.id))!.materials).not.toBeNull();
  });

  it("returns a reviewed submission to the student with feedback", async () => {
    const api = createDemoBackend();
    await api.demoSignIn("admin");
    const [submission] = await api.listSubmissions("submitted");
    await api.reviewSubmission(submission.id, { status: "reviewed", score: 90, feedback: "Great story!", feedback_audio_path: "" });
    expect(await api.listSubmissions("submitted")).toHaveLength(0);
    const [reviewed] = await api.listSubmissions("reviewed");
    expect(reviewed).toMatchObject({ score: 90, feedback: "Great story!" });
  });

  it("refuses admin actions to students", async () => {
    const api = createDemoBackend();
    await api.demoSignIn("student");
    await expect(api.listPayments("pending")).rejects.toThrow();
  });
});
