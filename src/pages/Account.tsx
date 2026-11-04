import { useEffect, useState, type FormEvent } from "react";
import { BookOpen, CreditCard, Crown, MessageSquareText, ShieldCheck } from "lucide-react";
import { backend } from "../lib/backend";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import { Link, navigate } from "../lib/router";
import type { PaymentStatus } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { daysUntil, errorText, isActive } from "../lib/util";
import { Feedback, TASK_META } from "../tasks/shared";
import { Badge, Button, CourseCover, Empty, ErrorState, Field, Loading, ProgressBar, useToast, type Tone } from "../ui";

const PAYMENT_TONE: Record<PaymentStatus, Tone> = { pending: "warning", approved: "success", rejected: "danger" };

export default function Account() {
  const { t, tn, pick, date, price } = useI18n();
  const { profile, ready, accessUntil, isAdmin } = useAuth();

  useEffect(() => {
    if (ready && !profile) navigate("/login?next=/account", { replace: true });
  }, [ready, profile]);

  const data = useAsync(async () => {
    if (!profile) return null;
    const [progress, payments, courses] = await Promise.all([
      backend.getProgress(profile.id),
      backend.listMyPayments(profile.id),
      backend.listCourses(),
    ]);
    const details = await Promise.all(courses.map((course) => backend.getCourse(course.slug)));
    const done = new Set(progress.completed);
    const myCourses = details
      .filter((detail): detail is NonNullable<typeof detail> => Boolean(detail))
      .map(({ course, lessons }) => ({
        course,
        total: lessons.length,
        done: lessons.filter((lesson) => done.has(lesson.id)).length,
        next: lessons.find((lesson) => !done.has(lesson.id)) ?? lessons[0],
      }))
      .filter((item) => item.done > 0);
    return { progress, payments, myCourses };
  }, [profile?.id, accessUntil]);

  if (!ready || !profile || (data.loading && !data.data)) return <Loading />;
  if (data.error) return <ErrorState error={data.error} onRetry={data.reload} />;
  const { progress, payments, myCourses } = data.data!;
  const active = isActive(accessUntil);
  const pending = payments.find((payment) => payment.status === "pending");
  const daysLeft = daysUntil(accessUntil);

  return (
    <div className="page">
      <div className="container stack-lg">
        <div className="row-between">
          <div className="stack-sm">
            <span className="overline">{t("account.title")}</span>
            <h1 className="h1">{t("account.hello", { name: profile.full_name.split(" ")[0] || profile.email })}</h1>
          </div>
          {isAdmin && (
            <Button variant="dark" icon={ShieldCheck} to="/admin">
              {t("account.adminLink")}
            </Button>
          )}
        </div>

        <div className="account-grid">
          <div className="stack-lg">
            <section className="stack">
              <h2 className="h3">{t("account.courses")}</h2>
              {myCourses.length ? (
                <div className="stack">
                  {myCourses.map(({ course, total, done, next }) => (
                    <Link key={course.id} to={next ? `/lessons/${next.id}` : `/courses/${course.slug}`} className="mini-course">
                      <CourseCover course={course} className="mini-cover" />
                      <div className="stack-sm" style={{ flex: 1, minWidth: 0 }}>
                        <b lang="en">
                          {pick(course, "title")} · {course.level}
                        </b>
                        <ProgressBar value={done} max={total} label={t("course.progress")} valueText={`${done}/${total}`} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="card">
                  <Empty icon={BookOpen} title={t("account.noCourses")}>
                    <Button variant="primary" to="/courses">
                      {t("account.browse")}
                    </Button>
                  </Empty>
                </div>
              )}
            </section>

            <section className="stack">
              <h2 className="h3">{t("account.tasks")}</h2>
              {progress.submissions.length ? (
                <div className="stack">
                  {progress.submissions.map((submission) => {
                    const Icon = TASK_META[submission.kind].icon;
                    return (
                      <article key={submission.id} className="card card-tight stack">
                        <div className="task-head">
                          <span className={`task-icon tone-${TASK_META[submission.kind].tone}`}>
                            <Icon strokeWidth={1.75} />
                          </span>
                          <div className="task-head-text">
                            <b>{(submission.task && pick(submission.task, "title")) || t(`task.kind.${submission.kind}`)}</b>
                            <span className="meta">
                              {submission.lesson?.course && pick(submission.lesson.course, "title")} · {submission.lesson && pick(submission.lesson, "title")}
                            </span>
                          </div>
                          <Button size="sm" variant="ghost" to={`/lessons/${submission.lesson_id}`}>
                            {t("account.openLesson")}
                          </Button>
                        </div>
                        <Feedback submission={submission} />
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="card">
                  <Empty icon={MessageSquareText} title={t("account.noTasks")} />
                </div>
              )}
            </section>
          </div>

          <aside className="stack-lg">
            <section className={`card sub-card ${active ? "active" : ""}`}>
              <div className="row-between">
                <span className="overline" style={active ? { color: "var(--on-violet)" } : undefined}>
                  {t("account.sub")}
                </span>
                <Crown size={20} strokeWidth={1.75} />
              </div>
              {isAdmin ? (
                <h3 className="h3">{t("course.adminAccess")}</h3>
              ) : active ? (
                <>
                  <h3 className="h3">{t("account.subActive", { date: date(accessUntil) })}</h3>
                  <span className="meta">{t("account.daysLeft", { days: tn("unit.day", daysLeft) })}</span>
                  <Button variant="dark" to="/pricing">
                    {t("account.extend")}
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="h3">{accessUntil ? t("account.subExpired", { date: date(accessUntil) }) : t("account.subNone")}</h3>
                  {pending ? (
                    <Badge tone="warning">{t("account.subPending")}</Badge>
                  ) : (
                    <Button variant="primary" to="/pricing" arrow>
                      {t("account.buy")}
                    </Button>
                  )}
                </>
              )}
            </section>

            <section className="card stack">
              <h2 className="h4 row">
                <CreditCard size={20} strokeWidth={1.75} />
                {t("account.payments")}
              </h2>
              {payments.length ? (
                <div className="list">
                  {payments.map((payment) => (
                    <div key={payment.id} className="list-row">
                      <div className="list-row-main">
                        <b>
                          {payment.plan_title} · <span className="num">{price(payment.amount)}</span>
                        </b>
                        <span className="meta">{date(payment.created_at, true)}</span>
                        {payment.status === "rejected" && payment.admin_note && (
                          <span className="meta">
                            {t("account.rejectReason")}: {payment.admin_note}
                          </span>
                        )}
                      </div>
                      <Badge tone={PAYMENT_TONE[payment.status]}>{t(`payment.status.${payment.status}`)}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="meta">{t("account.noPayments")}</p>
              )}
            </section>

            <ProfileForm />
          </aside>
        </div>
      </div>
    </div>
  );
}

function ProfileForm() {
  const { t } = useI18n();
  const { profile, refresh } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [busy, setBusy] = useState(false);
  if (!profile) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await backend.updateProfile(profile.id, { full_name: name.trim(), phone: phone.trim() });
      await refresh();
      toast(t("common.saved"));
    } catch (error) {
      toast(errorText(error), true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card stack" onSubmit={submit}>
      <h2 className="h4">{t("account.profile")}</h2>
      <Field label={t("auth.name")}>
        {(id) => <input id={id} className="input" value={name} onChange={(e) => setName(e.target.value)} />}
      </Field>
      <Field label={t("auth.phone")}>
        {(id) => <input id={id} className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />}
      </Field>
      <Field label="Email">{(id) => <input id={id} className="input" value={profile.email} disabled />}</Field>
      <Button type="submit" loading={busy}>
        {t("common.save")}
      </Button>
    </form>
  );
}
