import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { backend } from "../lib/backend";
import { useI18n } from "../lib/i18n";
import { navigate } from "../lib/router";
import type { Course } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { errorText, newId } from "../lib/util";
import { Badge, Button, CATEGORY_META, CourseCover, Empty, ErrorState, Loading, useToast } from "../ui";
import { AdminHead } from "./AdminLayout";

export default function Courses() {
  const { t, tn } = useI18n();
  const toast = useToast();
  const { data, error, loading, reload } = useAsync(() => backend.listCourses(true), []);
  const [busy, setBusy] = useState(false);

  const create = async () => {
    setBusy(true);
    try {
      const id = newId();
      const course: Course = {
        id,
        slug: `course-${id.slice(0, 6)}`,
        title: t("admin.crs.newTitle"),
        title_kk: "",
        title_en: "",
        subtitle: "",
        subtitle_kk: "",
        subtitle_en: "",
        description: "",
        description_kk: "",
        description_en: "",
        level: "A1",
        category: "general",
        glyph: "Hi!",
        cover_url: "",
        is_published: false,
        sort: (data?.length ?? 0) + 1,
      };
      await backend.saveCourse(course);
      navigate(`/admin/courses/${id}`);
    } catch (err) {
      toast(errorText(err), true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminHead title={t("admin.courses")} lead={t("admin.crs.lead")}>
        <Button variant="primary" icon={Plus} loading={busy} onClick={() => void create()}>
          {t("admin.crs.new")}
        </Button>
      </AdminHead>
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : data?.length ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t("admin.crs.course")}</th>
                <th>{t("admin.crs.level")}</th>
                <th>{t("admin.crs.lessons")}</th>
                <th>{t("admin.crs.status")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div className="row" style={{ flexWrap: "nowrap" }}>
                      <CourseCover course={course} className="thumb" />
                      <div className="person">
                        <b lang="en">{course.title}</b>
                        <span>{CATEGORY_META[course.category].label} · /{course.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge tone="solid">{course.level}</Badge>
                  </td>
                  <td className="num">{tn("unit.lesson", course.lesson_count)}</td>
                  <td>{course.is_published ? <Badge tone="success">{t("admin.published")}</Badge> : <Badge tone="warning">{t("admin.draft")}</Badge>}</td>
                  <td className="actions">
                    <Button size="sm" to={`/admin/courses/${course.id}`}>
                      {t("common.edit")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <Empty icon={BookOpen} title={t("admin.crs.empty")} />
        </div>
      )}
    </>
  );
}
