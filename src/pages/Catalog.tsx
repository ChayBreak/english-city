import { useState } from "react";
import { SearchX } from "lucide-react";
import { backend } from "../lib/backend";
import { useI18n } from "../lib/i18n";
import { navigate, useLocation } from "../lib/router";
import { CATEGORIES, LEVELS, type Category, type Level } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { CATEGORY_META, CourseCard, Empty, ErrorState, Loading, Tabs } from "../ui";

export default function Catalog() {
  const { t, tn, pick } = useI18n();
  const { query } = useLocation();
  const q = (query.get("q") ?? "").trim().toLowerCase();
  const { data, error, loading, reload } = useAsync(() => backend.listCourses(), []);
  const [level, setLevel] = useState<Level | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");

  const courses = (data ?? []).filter(
    (course) =>
      (level === "all" || course.level === level) &&
      (category === "all" || course.category === category) &&
      (!q || [pick(course, "title"), pick(course, "subtitle"), course.title, CATEGORY_META[course.category].label].some((text) => text.toLowerCase().includes(q))),
  );
  const levels = LEVELS.filter((l) => data?.some((course) => course.level === l));
  const categories = CATEGORIES.filter((c) => data?.some((course) => course.category === c));

  return (
    <div className="page">
      <div className="container stack-lg">
        <div className="stack-sm">
          <h1 className="page-title">{t("catalog.title")}</h1>
          <p className="muted">{t("catalog.lead")}</p>
        </div>
        {loading && !data ? (
          <Loading />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : (
          <>
            <div className="filters">
              <Tabs
                label={t("catalog.levelFilter")}
                value={level}
                onChange={setLevel}
                items={[{ id: "all" as const, label: t("catalog.allLevels") }, ...levels.map((l) => ({ id: l, label: l }))]}
              />
              {categories.length > 1 && (
                <div className="chips" role="group" aria-label={t("catalog.categoryFilter")}>
                  <button type="button" className="chip" aria-pressed={category === "all"} onClick={() => setCategory("all")}>
                    {t("catalog.allTopics")}
                  </button>
                  {categories.map((c) => (
                    <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
                      {CATEGORY_META[c].label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="row-between">
              {q ? (
                <span className="row">
                  <b>{t("catalog.searchFor", { q: query.get("q") ?? "" })}</b>
                  <button type="button" className="link-btn" onClick={() => navigate("/courses")}>
                    {t("catalog.clearSearch")}
                  </button>
                </span>
              ) : (
                <span />
              )}
              <span className="meta">{tn("unit.course", courses.length)}</span>
            </div>
            {courses.length ? (
              <div className="panel grid-courses">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <Empty icon={SearchX} title={t("catalog.empty")} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
