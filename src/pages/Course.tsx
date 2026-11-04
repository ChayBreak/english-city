import { CheckCircle2, ChevronRight, Clock, Lock, PlayCircle, Unlock } from "lucide-react";
import { backend } from "../lib/backend";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import { Link } from "../lib/router";
import { useAsync } from "../lib/useAsync";
import { Badge, Button, CATEGORY_META, CourseCover, Empty, ErrorState, Loading, ProgressBar } from "../ui";

export default function CoursePage({ slug }: { slug: string }) {
  const { t, tn, pick, date } = useI18n();
  const { profile, hasAccess, accessUntil, isAdmin } = useAuth();
  const { data, error, loading, reload } = useAsync(() => backend.getCourse(slug), [slug]);
  const progress = useAsync(
    () => (profile ? backend.getProgress(profile.id) : Promise.resolve(null)),
    [profile?.id],
  );

  if (loading && !data) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data)
    return (
      <div className="page">
        <Empty title={t("course.notFound")}>
          <Button to="/courses">{t("nav.courses")}</Button>
        </Empty>
      </div>
    );

  const { course, lessons } = data;
  const meta = CATEGORY_META[course.category];
  const completed = new Set(progress.data?.completed ?? []);
  const doneCount = lessons.filter((lesson) => completed.has(lesson.id)).length;
  const firstOpen = lessons.find((lesson) => hasAccess || lesson.is_free);
  const nextLesson = lessons.find((lesson) => !completed.has(lesson.id) && (hasAccess || lesson.is_free)) ?? firstOpen;
  const totalMinutes = lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);

  return (
    <div className="page" style={{ paddingTop: 16 }}>
      <div className="container">
        <nav className="breadcrumbs" aria-label={t("nav.breadcrumbs")}>
          <Link to="/courses">{t("nav.courses")}</Link>
          <ChevronRight strokeWidth={1.75} />
          <span lang="en">{pick(course, "title")}</span>
        </nav>
        <div className="course-hero">
          <div className="stack-lg">
            <div className="stack">
              <div className="course-tags">
                <Badge tone="solid">{course.level}</Badge>
                <Badge tone={meta.tone} icon={meta.icon}>
                  {meta.label}
                </Badge>
                {!course.is_published && <Badge tone="warning">{t("admin.draft")}</Badge>}
              </div>
              <h1 className="h1" lang="en">
                {pick(course, "title")}
              </h1>
              <p className="lead">{pick(course, "subtitle")}</p>
              <div className="course-meta">
                <span>
                  <PlayCircle strokeWidth={1.75} />
                  {tn("unit.lesson", lessons.length)}
                </span>
                <span>
                  <Clock strokeWidth={1.75} />
                  {t("common.minutes", { n: totalMinutes })}
                </span>
              </div>
            </div>
            <p style={{ maxWidth: "var(--measure)" }}>{pick(course, "description")}</p>

            <div className="stack">
              <h2 className="h3">{t("course.program")}</h2>
              {lessons.length ? (
                <ol className="lesson-list">
                  {lessons.map((lesson, index) => {
                    const open = hasAccess || lesson.is_free;
                    const done = completed.has(lesson.id);
                    return (
                      <li key={lesson.id} className={`lesson-row ${done ? "done" : ""} ${open ? "" : "locked"}`}>
                        <Link to={`/lessons/${lesson.id}`}>
                          <span className="lesson-index">{done ? <CheckCircle2 size={18} strokeWidth={2} /> : index + 1}</span>
                          <span className="lesson-info">
                            <b>{pick(lesson, "title")}</b>
                            {pick(lesson, "summary") && <span>{pick(lesson, "summary")}</span>}
                          </span>
                          <span className="lesson-side">
                            {lesson.is_free && !hasAccess && <Badge tone="success">{t("common.free")}</Badge>}
                            <span className="num">{t("common.minutes", { n: lesson.minutes })}</span>
                            {open ? <ChevronRight strokeWidth={1.75} /> : <Lock strokeWidth={1.75} aria-label={t("course.locked")} />}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="muted">{t("course.noLessons")}</p>
              )}
            </div>
          </div>

          <aside className="sticky-card">
            <div className="card stack">
              <CourseCover course={course} className="course-hero-cover" />
              {profile && doneCount > 0 && (
                <ProgressBar
                  value={doneCount}
                  max={lessons.length}
                  label={t("course.progress")}
                  valueText={`${doneCount}/${lessons.length}`}
                />
              )}
              {hasAccess ? (
                <>
                  <p className="meta row">
                    <Unlock size={16} strokeWidth={1.75} />
                    {isAdmin ? t("course.adminAccess") : t("course.accessActive", { date: date(accessUntil) })}
                  </p>
                  {nextLesson && (
                    <Button variant="primary" size="lg" block arrow to={`/lessons/${nextLesson.id}`}>
                      {doneCount ? t("course.continue") : t("course.start")}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <p className="meta">{t("course.accessNone")}</p>
                  <Button variant="primary" size="lg" block arrow to="/pricing">
                    {t("course.subscribe")}
                  </Button>
                  {firstOpen && (
                    <Button variant="secondary" block to={`/lessons/${firstOpen.id}`}>
                      {t("course.tryFree")}
                    </Button>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
