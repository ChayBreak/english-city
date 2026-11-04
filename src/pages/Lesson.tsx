import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Circle, Lock, PlayCircle } from "lucide-react";
import { backend } from "../lib/backend";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import { RichText } from "../lib/richtext";
import { Link } from "../lib/router";
import { useAsync } from "../lib/useAsync";
import { embedUrl } from "../lib/youtube";
import { TaskView } from "../tasks/TaskView";
import { Badge, Button, Empty, ErrorState, Loading, Notice, useToast } from "../ui";
import { errorText } from "../lib/util";

export default function LessonPage({ id }: { id: string }) {
  const { t, pick } = useI18n();
  const { profile, hasAccess } = useAuth();
  const toast = useToast();
  const view = useAsync(() => backend.getLesson(id), [id, profile?.id, hasAccess]);
  const progress = useAsync(() => (profile ? backend.getProgress(profile.id) : Promise.resolve(null)), [profile?.id]);
  const [saving, setSaving] = useState(false);

  if (view.loading && !view.data) return <Loading />;
  if (view.error) return <ErrorState error={view.error} onRetry={view.reload} />;
  if (!view.data)
    return (
      <div className="page">
        <Empty title={t("lesson.notFound")}>
          <Button to="/courses">{t("nav.courses")}</Button>
        </Empty>
      </div>
    );

  const { lesson, course, lessons, materials, tasks } = view.data;
  const completed = new Set(progress.data?.completed ?? []);
  const index = lessons.findIndex((item) => item.id === lesson.id);
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const done = completed.has(lesson.id);
  const video = materials?.video_url ? embedUrl(materials.video_url) : null;
  const body = materials ? pick(materials, "body") : "";

  const markDone = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await backend.completeLesson(profile.id, lesson.id);
      await progress.reload();
      toast(t("lesson.doneToast"));
    } catch (error) {
      toast(errorText(error), true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page" style={{ paddingTop: 16 }}>
      <div className="container stack">
        <nav className="breadcrumbs" aria-label={t("nav.breadcrumbs")}>
          <Link to="/courses">{t("nav.courses")}</Link>
          <ChevronRight strokeWidth={1.75} />
          <Link to={`/courses/${course.slug}`} lang="en">
            {pick(course, "title")}
          </Link>
          <ChevronRight strokeWidth={1.75} />
          <span>{pick(lesson, "title")}</span>
        </nav>
        <div className="lesson-layout">
          <nav className="lesson-nav" aria-label={t("lesson.contents")}>
            <div className="lesson-nav-title">
              <span className="caption">
                {course.level} · {t("lesson.contents")}
              </span>
              <b lang="en">{pick(course, "title")}</b>
            </div>
            {lessons.map((item) => {
              const open = hasAccess || item.is_free;
              const isDone = completed.has(item.id);
              const Icon = isDone ? CheckCircle2 : !open ? Lock : item.id === lesson.id ? PlayCircle : Circle;
              return (
                <Link
                  key={item.id}
                  to={`/lessons/${item.id}`}
                  className={isDone ? "done" : ""}
                  aria-current={item.id === lesson.id ? "page" : undefined}
                >
                  <Icon strokeWidth={1.75} />
                  <span>{pick(item, "title")}</span>
                  <span className="caption num">{item.minutes}′</span>
                </Link>
              );
            })}
          </nav>

          <div className="lesson-main">
            <header className="stack-sm">
              <div className="row">
                <span className="caption">
                  {t("lesson.number", { n: index + 1, total: lessons.length })}
                </span>
                {lesson.is_free && <Badge tone="success">{t("common.free")}</Badge>}
                {done && (
                  <Badge tone="success" icon={CheckCircle2}>
                    {t("lesson.done")}
                  </Badge>
                )}
              </div>
              <h1 className="h1">{pick(lesson, "title")}</h1>
              {pick(lesson, "summary") && <p className="lead">{pick(lesson, "summary")}</p>}
            </header>

            {!materials ? (
              <Paywall loggedIn={Boolean(profile)} />
            ) : (
              <>
                {video && (
                  <div className="video">
                    <iframe
                      src={video}
                      title={pick(lesson, "title")}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {body && (
                  <div className="card">
                    <RichText text={body} />
                  </div>
                )}
                {!profile && tasks.length > 0 && (
                  <Notice>
                    {t("lesson.loginToSave")} <Link to={`/login?next=/lessons/${lesson.id}`}>{t("nav.login")}</Link>
                  </Notice>
                )}
                {tasks.length > 0 && (
                  <section className="stack" aria-labelledby="tasks-title">
                    <h2 className="h3" id="tasks-title">
                      {t("lesson.tasks")}
                    </h2>
                    {tasks.map((task) => (
                      <TaskView key={task.id} task={task} progress={progress.data ?? null} onChange={progress.reload} />
                    ))}
                  </section>
                )}
                <div className="lesson-footer">
                  {prev ? (
                    <Button variant="ghost" icon={ArrowLeft} to={`/lessons/${prev.id}`}>
                      {t("lesson.prev")}
                    </Button>
                  ) : (
                    <span />
                  )}
                  <div className="row">
                    {profile && !done && (
                      <Button variant="secondary" icon={CheckCircle2} loading={saving} onClick={() => void markDone()}>
                        {t("lesson.markDone")}
                      </Button>
                    )}
                    {next && (
                      <Button variant="primary" to={`/lessons/${next.id}`}>
                        {t("lesson.next")} <ArrowRight size={18} strokeWidth={1.75} />
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Paywall({ loggedIn }: { loggedIn: boolean }) {
  const { t } = useI18n();
  return (
    <div className="paywall">
      <span className="paywall-icon">
        <Lock strokeWidth={1.75} />
      </span>
      <div className="stack-sm">
        <h2 className="h3">{t("lesson.lockedTitle")}</h2>
        <p className="muted">{t("lesson.lockedText")}</p>
      </div>
      <div className="row">
        <Button variant="primary" size="lg" arrow to="/pricing">
          {t("course.subscribe")}
        </Button>
        {loggedIn ? (
          <Button variant="ghost" to="/account">
            {t("lesson.checkStatus")}
          </Button>
        ) : (
          <Button variant="ghost" to="/login">
            {t("nav.login")}
          </Button>
        )}
      </div>
    </div>
  );
}
