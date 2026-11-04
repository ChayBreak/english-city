import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ExternalLink, ImageUp, Plus, Trash2 } from "lucide-react";
import { backend } from "../lib/backend";
import { useI18n } from "../lib/i18n";
import { Link, navigate } from "../lib/router";
import { CATEGORIES, LEVELS, type Course, type Lesson } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { errorText, newId } from "../lib/util";
import { Badge, Button, CATEGORY_META, CourseCover, Empty, ErrorState, Field, IconButton, Loading, useToast } from "../ui";
import { AdminHead } from "./AdminLayout";

/** One content field in RU (required), KZ and EN (optional, fall back to RU). */
export function LocalizedField({
  label,
  value,
  valueKk,
  valueEn,
  onChange,
  onChangeKk,
  onChangeEn,
  multiline,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  valueKk: string;
  valueEn: string;
  onChange: (v: string) => void;
  onChangeKk: (v: string) => void;
  onChangeEn: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  hint?: string;
}) {
  const { t } = useI18n();
  const input = (id: string, v: string, set: (v: string) => void, required?: boolean) =>
    multiline ? (
      <textarea id={id} className="input" rows={rows} value={v} onChange={(e) => set(e.target.value)} />
    ) : (
      <input id={id} className="input" value={v} required={required} onChange={(e) => set(e.target.value)} />
    );
  return (
    <div className="form-grid cols-3 span-all">
      <Field label={`${label} · RU`} hint={hint}>
        {(id) => input(id, value, onChange, true)}
      </Field>
      <Field label={`${label} · KZ`} hint={t("admin.kkHint")}>
        {(id) => input(id, valueKk, onChangeKk)}
      </Field>
      <Field label={`${label} · EN`} hint={t("admin.kkHint")}>
        {(id) => input(id, valueEn, onChangeEn)}
      </Field>
    </div>
  );
}

export default function CourseEditor({ id }: { id: string }) {
  const { t } = useI18n();
  const { data, error, loading, reload } = useAsync(() => backend.getCourseForEdit(id), [id]);
  if (loading && !data) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data) return <Empty title={t("course.notFound")} />;
  return <CourseForm key={data.course.id} initial={data.course} lessons={data.lessons} reload={reload} />;
}

function CourseForm({ initial, lessons, reload }: { initial: Course; lessons: Lesson[]; reload: () => Promise<void> }) {
  const { t } = useI18n();
  const toast = useToast();
  const [course, setCourse] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof Course>(key: K, value: Course[K]) => setCourse((current) => ({ ...current, [key]: value }));

  const save = async (event?: FormEvent, patch?: Partial<Course>) => {
    event?.preventDefault();
    setSaving(true);
    try {
      const next = { ...course, ...patch, slug: course.slug.trim().toLowerCase() };
      await backend.saveCourse(next);
      setCourse(next);
      toast(t("common.saved"));
    } catch (err) {
      const text = errorText(err);
      toast(/slug/.test(text) ? t("admin.crs.slugTaken") : text, true);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(t("admin.crs.deleteConfirm"))) return;
    try {
      await backend.deleteCourse(course.id);
      navigate("/admin/courses");
    } catch (err) {
      toast(errorText(err), true);
    }
  };

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      set("cover_url", await backend.uploadImage(file));
    } catch (err) {
      toast(errorText(err), true);
    } finally {
      setUploading(false);
    }
  };

  const addLesson = async () => {
    try {
      const lesson: Lesson = {
        id: newId(),
        course_id: course.id,
        sort: (lessons.at(-1)?.sort ?? 0) + 1,
        title: t("admin.les.newTitle"),
        title_kk: "",
        title_en: "",
        summary: "",
        summary_kk: "",
        summary_en: "",
        minutes: 10,
        is_free: lessons.length === 0,
        is_published: true,
      };
      await backend.saveLesson(lesson, { lesson_id: lesson.id, video_url: "", body: "", body_kk: "", body_en: "" });
      navigate(`/admin/lessons/${lesson.id}`);
    } catch (err) {
      toast(errorText(err), true);
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const other = lessons[index + direction];
    const lesson = lessons[index];
    if (!other) return;
    try {
      await Promise.all([backend.saveLesson({ ...lesson, sort: other.sort }), backend.saveLesson({ ...other, sort: lesson.sort })]);
      await reload();
    } catch (err) {
      toast(errorText(err), true);
    }
  };

  return (
    <>
      <Link to="/admin/courses" className="breadcrumbs" style={{ marginBottom: 12 }}>
        <ChevronLeft size={16} strokeWidth={1.75} /> {t("admin.courses")}
      </Link>
      <AdminHead title={course.title || t("admin.crs.newTitle")}>
        {course.is_published ? <Badge tone="success">{t("admin.published")}</Badge> : <Badge tone="warning">{t("admin.draft")}</Badge>}
        <Button size="sm" variant="ghost" icon={ExternalLink} to={`/courses/${course.slug}`}>
          {t("admin.preview")}
        </Button>
      </AdminHead>

      <div className="stack-lg">
        <form className="card editor-block" onSubmit={(e) => void save(e)}>
          <h2 className="h4">{t("admin.crs.info")}</h2>
          <div className="form-grid cols-2">
            <LocalizedField
              label={t("admin.crs.title")}
              value={course.title}
              valueKk={course.title_kk}
              valueEn={course.title_en}
              onChange={(v) => set("title", v)}
              onChangeKk={(v) => set("title_kk", v)}
              onChangeEn={(v) => set("title_en", v)}
            />
            <LocalizedField
              label={t("admin.crs.subtitle")}
              value={course.subtitle}
              valueKk={course.subtitle_kk}
              valueEn={course.subtitle_en}
              onChange={(v) => set("subtitle", v)}
              onChangeKk={(v) => set("subtitle_kk", v)}
              onChangeEn={(v) => set("subtitle_en", v)}
            />
            <LocalizedField
              label={t("admin.crs.description")}
              value={course.description}
              valueKk={course.description_kk}
              valueEn={course.description_en}
              onChange={(v) => set("description", v)}
              onChangeKk={(v) => set("description_kk", v)}
              onChangeEn={(v) => set("description_en", v)}
              multiline
              rows={4}
            />
          </div>
          <div className="form-grid cols-3">
            <Field label={t("admin.crs.level")}>
              {(fid) => (
                <select id={fid} className="input" value={course.level} onChange={(e) => set("level", e.target.value as Course["level"])}>
                  {LEVELS.map((level) => (
                    <option key={level}>{level}</option>
                  ))}
                </select>
              )}
            </Field>
            <Field label={t("admin.crs.category")}>
              {(fid) => (
                <select id={fid} className="input" value={course.category} onChange={(e) => set("category", e.target.value as Course["category"])}>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {CATEGORY_META[category].label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field label={t("admin.crs.slug")} hint={t("admin.crs.slugHint")}>
              {(fid) => (
                <input
                  id={fid}
                  className="input"
                  value={course.slug}
                  pattern="[a-z0-9-]+"
                  required
                  onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                />
              )}
            </Field>
            <Field label={t("admin.crs.sort")}>
              {(fid) => (
                <input id={fid} className="input num" type="number" value={course.sort} onChange={(e) => set("sort", Number(e.target.value))} />
              )}
            </Field>
          </div>

          <div className="form-grid cols-2" style={{ alignItems: "start" }}>
            <div className="stack">
              <Field label={t("admin.crs.cover")} hint={t("admin.crs.coverHint")}>
                {(fid) => (
                  <input id={fid} className="input" value={course.cover_url} onChange={(e) => set("cover_url", e.target.value)} placeholder="https://…" />
                )}
              </Field>
              <label className="btn btn-secondary btn-sm" style={{ alignSelf: "start" }}>
                {uploading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <ImageUp size={16} strokeWidth={1.75} />}
                {t("admin.uploadImage")}
                <input type="file" accept="image/*" hidden onChange={(e) => void upload(e.target.files?.[0])} />
              </label>
            </div>
            <CourseCover course={course} className="course-hero-cover" />
          </div>

          <div className="row">
            <Button variant="primary" type="submit" loading={saving}>
              {t("common.save")}
            </Button>
            <Button type="button" onClick={() => void save(undefined, { is_published: !course.is_published })} disabled={saving}>
              {course.is_published ? t("admin.unpublish") : t("admin.publish")}
            </Button>
            <span className="spacer" />
            <Button type="button" variant="danger" icon={Trash2} onClick={() => void remove()}>
              {t("admin.crs.delete")}
            </Button>
          </div>
        </form>

        <section className="card editor-block">
          <div className="row-between">
            <h2 className="h4">{t("course.program")}</h2>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => void addLesson()}>
              {t("admin.les.add")}
            </Button>
          </div>
          {lessons.length ? (
            <ol className="lesson-list">
              {lessons.map((lesson, index) => (
                <li key={lesson.id} className="lesson-row">
                  <div>
                    <span className="lesson-index">{index + 1}</span>
                    <span className="lesson-info">
                      <b>{lesson.title}</b>
                      <span>
                        {t("common.minutes", { n: lesson.minutes })}
                        {lesson.is_free && ` · ${t("common.free")}`}
                        {!lesson.is_published && ` · ${t("admin.hidden")}`}
                      </span>
                    </span>
                    <span className="lesson-side">
                      <IconButton icon={ArrowUp} size="sm" ghost label={t("admin.moveUp")} disabled={index === 0} onClick={() => void move(index, -1)} />
                      <IconButton
                        icon={ArrowDown}
                        size="sm"
                        ghost
                        label={t("admin.moveDown")}
                        disabled={index === lessons.length - 1}
                        onClick={() => void move(index, 1)}
                      />
                      <Button size="sm" to={`/admin/lessons/${lesson.id}`}>
                        {t("common.edit")}
                      </Button>
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="meta">{t("course.noLessons")}</p>
          )}
        </section>
      </div>
    </>
  );
}
