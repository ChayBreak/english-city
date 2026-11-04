import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronLeft, ExternalLink, Plus, Trash2, Volume2, X } from "lucide-react";
import { backend } from "../lib/backend";
import { useI18n } from "../lib/i18n";
import { RichText } from "../lib/richtext";
import { speak } from "../lib/speech";
import { Link, navigate } from "../lib/router";
import { TASK_KINDS, type Lesson, type LessonMaterials, type Task, type TaskData, type TaskKind } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { errorText, newId } from "../lib/util";
import { embedUrl, parseYouTube } from "../lib/youtube";
import { TASK_META } from "../tasks/shared";
import { Button, Empty, ErrorState, Field, IconButton, Loading, Notice, useToast } from "../ui";
import { AdminHead } from "./AdminLayout";
import { LocalizedField } from "./CourseEditor";

const EMPTY_DATA: Record<TaskKind, TaskData> = {
  pronunciation: { phrases: [{ text: "", hint: "", hint_kk: "", hint_en: "" }] },
  quiz: { questions: [{ question: "", options: ["", ""], correct: 0, explanation: "", explanation_kk: "", explanation_en: "" }] },
  writing: { min_words: 50, max_words: 150, checklist: [] },
  vocabulary: { words: [{ term: "", ru: "", kk: "", example: "" }] },
};

type LessonData = NonNullable<Awaited<ReturnType<typeof backend.getLessonForEdit>>>;

export default function LessonEditor({ id }: { id: string }) {
  const { t } = useI18n();
  const { data, error, loading, reload } = useAsync(() => backend.getLessonForEdit(id), [id]);
  if (loading && !data) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data) return <Empty title={t("lesson.notFound")} />;
  return <LessonForm key={data.lesson.id} data={data} reload={reload} />;
}

function LessonForm({ data, reload }: { data: LessonData; reload: () => Promise<void> }) {
  const { t } = useI18n();
  const toast = useToast();
  const [lesson, setLesson] = useState<Lesson>(data.lesson);
  const [materials, setMaterials] = useState<LessonMaterials>(data.materials);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const setL = <K extends keyof Lesson>(key: K, value: Lesson[K]) => setLesson({ ...lesson, [key]: value });
  const setM = <K extends keyof LessonMaterials>(key: K, value: LessonMaterials[K]) => setMaterials({ ...materials, [key]: value });
  const videoOk = !materials.video_url || parseYouTube(materials.video_url) !== null;
  const video = materials.video_url && videoOk ? embedUrl(materials.video_url) : null;

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!videoOk) return;
    setSaving(true);
    try {
      await backend.saveLesson(lesson, materials);
      toast(t("common.saved"));
    } catch (err) {
      toast(errorText(err), true);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(t("admin.les.deleteConfirm"))) return;
    try {
      await backend.deleteLesson(lesson.id);
      navigate(`/admin/courses/${lesson.course_id}`);
    } catch (err) {
      toast(errorText(err), true);
    }
  };

  const addTask = async (kind: TaskKind) => {
    try {
      await backend.saveTask({
        id: newId(),
        lesson_id: lesson.id,
        sort: (data.tasks.at(-1)?.sort ?? 0) + 1,
        kind,
        title: t(`task.kind.${kind}`),
        title_kk: "",
        title_en: "",
        prompt: "",
        prompt_kk: "",
        prompt_en: "",
        data: JSON.parse(JSON.stringify(EMPTY_DATA[kind])),
      });
      await reload();
    } catch (err) {
      toast(errorText(err), true);
    }
  };

  const moveTask = async (index: number, direction: -1 | 1) => {
    const a = data.tasks[index];
    const b = data.tasks[index + direction];
    if (!b) return;
    try {
      await Promise.all([backend.saveTask({ ...a, sort: b.sort }), backend.saveTask({ ...b, sort: a.sort })]);
      await reload();
    } catch (err) {
      toast(errorText(err), true);
    }
  };

  return (
    <>
      <Link to={`/admin/courses/${data.course.id}`} className="breadcrumbs" style={{ marginBottom: 12 }}>
        <ChevronLeft size={16} strokeWidth={1.75} /> <span lang="en">{data.course.title}</span>
      </Link>
      <AdminHead title={lesson.title || t("admin.les.newTitle")}>
        <Button size="sm" variant="ghost" icon={ExternalLink} to={`/lessons/${lesson.id}`}>
          {t("admin.preview")}
        </Button>
      </AdminHead>

      <div className="stack-lg">
        <form className="card editor-block" onSubmit={save}>
          <h2 className="h4">{t("admin.les.info")}</h2>
          <div className="form-grid cols-2">
            <LocalizedField
              label={t("admin.crs.title")}
              value={lesson.title}
              valueKk={lesson.title_kk}
              valueEn={lesson.title_en}
              onChange={(v) => setL("title", v)}
              onChangeKk={(v) => setL("title_kk", v)}
              onChangeEn={(v) => setL("title_en", v)}
            />
            <LocalizedField
              label={t("admin.les.summary")}
              value={lesson.summary}
              valueKk={lesson.summary_kk}
              valueEn={lesson.summary_en}
              onChange={(v) => setL("summary", v)}
              onChangeKk={(v) => setL("summary_kk", v)}
              onChangeEn={(v) => setL("summary_en", v)}
            />
          </div>
          <div className="row" style={{ gap: 24 }}>
            <Field label={t("admin.les.minutes")}>
              {(fid) => (
                <input
                  id={fid}
                  className="input num"
                  style={{ width: 120 }}
                  type="number"
                  min={1}
                  value={lesson.minutes}
                  onChange={(e) => setL("minutes", Number(e.target.value))}
                />
              )}
            </Field>
            <label className="check">
              <input type="checkbox" checked={lesson.is_free} onChange={(e) => setL("is_free", e.target.checked)} />
              {t("admin.les.free")}
            </label>
            <label className="check">
              <input type="checkbox" checked={lesson.is_published} onChange={(e) => setL("is_published", e.target.checked)} />
              {t("admin.les.visible")}
            </label>
          </div>

          <hr className="divider" />
          <h2 className="h4">{t("lesson.video")}</h2>
          <Field label={t("admin.les.video")} hint={videoOk ? t("admin.les.videoHint") : undefined} error={videoOk ? undefined : t("admin.les.videoError")}>
            {(fid) => (
              <input
                id={fid}
                className="input"
                value={materials.video_url}
                onChange={(e) => setM("video_url", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
              />
            )}
          </Field>
          {video && (
            <div className="video" style={{ maxWidth: 560 }}>
              <iframe src={video} title={t("lesson.video")} loading="lazy" allowFullScreen />
            </div>
          )}

          <hr className="divider" />
          <div className="row-between">
            <h2 className="h4">{t("admin.les.body")}</h2>
            <Button type="button" size="sm" variant="ghost" onClick={() => setPreview((v) => !v)}>
              {preview ? t("admin.les.hidePreview") : t("admin.les.showPreview")}
            </Button>
          </div>
          <Notice>{t("admin.les.formatHint")}</Notice>
          <LocalizedField
            label={t("admin.les.text")}
            value={materials.body}
            valueKk={materials.body_kk}
            valueEn={materials.body_en}
            onChange={(v) => setM("body", v)}
            onChangeKk={(v) => setM("body_kk", v)}
            onChangeEn={(v) => setM("body_en", v)}
            multiline
            rows={10}
          />
          {preview && materials.body && (
            <div className="sunken">
              <RichText text={materials.body} />
            </div>
          )}

          <div className="row">
            <Button variant="primary" type="submit" loading={saving}>
              {t("common.save")}
            </Button>
            <span className="spacer" />
            <Button type="button" variant="danger" icon={Trash2} onClick={() => void remove()}>
              {t("admin.les.delete")}
            </Button>
          </div>
        </form>

        <section className="editor-block">
          <div className="row-between">
            <h2 className="h3">{t("lesson.tasks")}</h2>
            <div className="row">
              {TASK_KINDS.map((kind) => {
                const Icon = TASK_META[kind].icon;
                return (
                  <Button key={kind} size="sm" icon={Plus} onClick={() => void addTask(kind)}>
                    <Icon size={16} strokeWidth={1.75} />
                    {t(`task.kind.${kind}`)}
                  </Button>
                );
              })}
            </div>
          </div>
          {data.tasks.length ? (
            data.tasks.map((task, index) => (
              <TaskEditor
                key={task.id}
                task={task}
                first={index === 0}
                last={index === data.tasks.length - 1}
                onMove={(direction) => void moveTask(index, direction)}
                onChanged={reload}
              />
            ))
          ) : (
            <div className="card">
              <p className="meta">{t("admin.les.noTasks")}</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function TaskEditor({
  task: initial,
  first,
  last,
  onMove,
  onChanged,
}: {
  task: Task;
  first: boolean;
  last: boolean;
  onMove: (direction: -1 | 1) => void;
  onChanged: () => void;
}) {
  const { t } = useI18n();
  const toast = useToast();
  const [task, setTask] = useState(initial);
  const [saving, setSaving] = useState(false);
  const meta = TASK_META[task.kind];
  const data = task.data;
  const setData = (patch: Partial<TaskData>) => setTask({ ...task, data: { ...data, ...patch } });

  const save = async () => {
    const next =
      task.kind === "writing"
        ? { ...task, data: { ...data, checklist: (data.checklist ?? []).map((item) => item.trim()).filter(Boolean) } }
        : task;
    setSaving(true);
    try {
      await backend.saveTask(next);
      setTask(next);
      toast(t("common.saved"));
      onChanged();
    } catch (err) {
      toast(errorText(err), true);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(t("admin.task.deleteConfirm"))) return;
    try {
      await backend.deleteTask(task.id);
      onChanged();
    } catch (err) {
      toast(errorText(err), true);
    }
  };

  const update = <T,>(list: T[], index: number, patch: Partial<T>) => list.map((item, i) => (i === index ? { ...item, ...patch } : item));

  return (
    <details className="task-editor">
      <summary>
        <span className={`task-icon tone-${meta.tone}`}>
          <meta.icon strokeWidth={1.75} />
        </span>
        <div className="task-head-text">
          <span className="caption">{t(`task.kind.${task.kind}`)}</span>
          <b>{task.title || t(`task.kind.${task.kind}`)}</b>
        </div>
        <span className="spacer" />
        <IconButton icon={ArrowUp} size="sm" ghost label={t("admin.moveUp")} disabled={first} onClick={(e) => (e.preventDefault(), onMove(-1))} />
        <IconButton icon={ArrowDown} size="sm" ghost label={t("admin.moveDown")} disabled={last} onClick={(e) => (e.preventDefault(), onMove(1))} />
        <ChevronDown size={18} strokeWidth={1.75} />
      </summary>
      <div className="task-editor-body">
        <LocalizedField
          label={t("admin.task.title")}
          value={task.title}
          valueKk={task.title_kk}
          valueEn={task.title_en}
          onChange={(v) => setTask({ ...task, title: v })}
          onChangeKk={(v) => setTask({ ...task, title_kk: v })}
          onChangeEn={(v) => setTask({ ...task, title_en: v })}
        />
        <LocalizedField
          label={t("admin.task.prompt")}
          value={task.prompt}
          valueKk={task.prompt_kk}
          valueEn={task.prompt_en}
          onChange={(v) => setTask({ ...task, prompt: v })}
          onChangeKk={(v) => setTask({ ...task, prompt_kk: v })}
          onChangeEn={(v) => setTask({ ...task, prompt_en: v })}
          multiline
          rows={2}
        />

        {task.kind === "pronunciation" && (
          <div className="stack">
            <span className="field-label">{t("admin.task.phrases")}</span>
            {(data.phrases ?? []).map((phrase, index) => (
              <div key={index} className="edit-row">
                <div className="edit-row-head">
                  <b className="small">#{index + 1}</b>
                  <span className="spacer" />
                  <IconButton icon={Volume2} size="sm" ghost label={t("pron.listen")} onClick={() => void speak(phrase.text)} />
                  <IconButton
                    icon={X}
                    size="sm"
                    ghost
                    label={t("common.delete")}
                    onClick={() => setData({ phrases: (data.phrases ?? []).filter((_, i) => i !== index) })}
                  />
                </div>
                <Field label={t("admin.task.phraseText")}>
                  {(id) => (
                    <input
                      id={id}
                      className="input"
                      lang="en"
                      value={phrase.text}
                      onChange={(e) => setData({ phrases: update(data.phrases ?? [], index, { text: e.target.value }) })}
                    />
                  )}
                </Field>
                <LocalizedField
                  label={t("admin.task.hint")}
                  value={phrase.hint ?? ""}
                  valueKk={phrase.hint_kk ?? ""}
                  valueEn={phrase.hint_en ?? ""}
                  onChange={(v) => setData({ phrases: update(data.phrases ?? [], index, { hint: v }) })}
                  onChangeKk={(v) => setData({ phrases: update(data.phrases ?? [], index, { hint_kk: v }) })}
                  onChangeEn={(v) => setData({ phrases: update(data.phrases ?? [], index, { hint_en: v }) })}
                />
              </div>
            ))}
            <Button size="sm" icon={Plus} onClick={() => setData({ phrases: [...(data.phrases ?? []), { text: "", hint: "", hint_kk: "", hint_en: "" }] })}>
              {t("admin.task.addPhrase")}
            </Button>
          </div>
        )}

        {task.kind === "quiz" && (
          <div className="stack">
            <span className="field-label">{t("admin.task.questions")}</span>
            {(data.questions ?? []).map((question, qi) => (
              <div key={qi} className="edit-row">
                <div className="edit-row-head">
                  <b className="small">#{qi + 1}</b>
                  <span className="spacer" />
                  <IconButton
                    icon={X}
                    size="sm"
                    ghost
                    label={t("common.delete")}
                    onClick={() => setData({ questions: (data.questions ?? []).filter((_, i) => i !== qi) })}
                  />
                </div>
                <Field label={t("admin.task.question")}>
                  {(id) => (
                    <input
                      id={id}
                      className="input"
                      value={question.question}
                      onChange={(e) => setData({ questions: update(data.questions ?? [], qi, { question: e.target.value }) })}
                    />
                  )}
                </Field>
                <span className="field-hint">{t("admin.task.correctHint")}</span>
                {question.options.map((option, oi) => (
                  <div key={oi} className="option-row">
                    <input
                      type="radio"
                      name={`correct-${task.id}-${qi}`}
                      checked={question.correct === oi}
                      aria-label={t("admin.task.correct")}
                      onChange={() => setData({ questions: update(data.questions ?? [], qi, { correct: oi }) })}
                    />
                    <input
                      className="input"
                      value={option}
                      aria-label={`${t("admin.task.option")} ${oi + 1}`}
                      onChange={(e) =>
                        setData({
                          questions: update(data.questions ?? [], qi, {
                            options: question.options.map((o, i) => (i === oi ? e.target.value : o)),
                          }),
                        })
                      }
                    />
                    <IconButton
                      icon={X}
                      size="sm"
                      ghost
                      label={t("common.delete")}
                      disabled={question.options.length <= 2}
                      onClick={() =>
                        setData({
                          questions: update(data.questions ?? [], qi, {
                            options: question.options.filter((_, i) => i !== oi),
                            correct: question.correct === oi ? 0 : question.correct > oi ? question.correct - 1 : question.correct,
                          }),
                        })
                      }
                    />
                  </div>
                ))}
                {question.options.length < 6 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Plus}
                    onClick={() => setData({ questions: update(data.questions ?? [], qi, { options: [...question.options, ""] }) })}
                  >
                    {t("admin.task.addOption")}
                  </Button>
                )}
                <LocalizedField
                  label={t("admin.task.explanation")}
                  value={question.explanation ?? ""}
                  valueKk={question.explanation_kk ?? ""}
                  valueEn={question.explanation_en ?? ""}
                  onChange={(v) => setData({ questions: update(data.questions ?? [], qi, { explanation: v }) })}
                  onChangeKk={(v) => setData({ questions: update(data.questions ?? [], qi, { explanation_kk: v }) })}
                  onChangeEn={(v) => setData({ questions: update(data.questions ?? [], qi, { explanation_en: v }) })}
                />
              </div>
            ))}
            <Button
              size="sm"
              icon={Plus}
              onClick={() =>
                setData({ questions: [...(data.questions ?? []), { question: "", options: ["", ""], correct: 0, explanation: "", explanation_kk: "", explanation_en: "" }] })
              }
            >
              {t("admin.task.addQuestion")}
            </Button>
          </div>
        )}

        {task.kind === "writing" && (
          <div className="form-grid cols-2">
            <Field label={t("admin.task.minWords")}>
              {(id) => (
                <input id={id} className="input num" type="number" min={0} value={data.min_words ?? 0} onChange={(e) => setData({ min_words: Number(e.target.value) })} />
              )}
            </Field>
            <Field label={t("admin.task.maxWords")}>
              {(id) => (
                <input id={id} className="input num" type="number" min={0} value={data.max_words ?? 0} onChange={(e) => setData({ max_words: Number(e.target.value) })} />
              )}
            </Field>
            <Field label={t("admin.task.checklist")} hint={t("admin.task.checklistHint")} className="span-all">
              {(id) => (
                <textarea
                  id={id}
                  className="input"
                  rows={3}
                  value={(data.checklist ?? []).join("\n")}
                  onChange={(e) => setData({ checklist: e.target.value.split("\n") })}
                />
              )}
            </Field>
          </div>
        )}

        {task.kind === "vocabulary" && (
          <div className="stack">
            <span className="field-label">{t("admin.task.words")}</span>
            {(data.words ?? []).map((word, index) => (
              <div key={index} className="edit-row">
                <div className="edit-row-head">
                  <b className="small">#{index + 1}</b>
                  <span className="spacer" />
                  <IconButton icon={Volume2} size="sm" ghost label={t("pron.listen")} onClick={() => void speak(word.term)} />
                  <IconButton
                    icon={X}
                    size="sm"
                    ghost
                    label={t("common.delete")}
                    onClick={() => setData({ words: (data.words ?? []).filter((_, i) => i !== index) })}
                  />
                </div>
                <div className="form-grid cols-3">
                  <Field label={t("admin.task.term")}>
                    {(id) => (
                      <input id={id} className="input" lang="en" value={word.term} onChange={(e) => setData({ words: update(data.words ?? [], index, { term: e.target.value }) })} />
                    )}
                  </Field>
                  <Field label={t("admin.task.translationRu")}>
                    {(id) => (
                      <input id={id} className="input" value={word.ru} onChange={(e) => setData({ words: update(data.words ?? [], index, { ru: e.target.value }) })} />
                    )}
                  </Field>
                  <Field label={t("admin.task.translationKk")}>
                    {(id) => (
                      <input id={id} className="input" value={word.kk} onChange={(e) => setData({ words: update(data.words ?? [], index, { kk: e.target.value }) })} />
                    )}
                  </Field>
                  <Field label={t("admin.task.example")} className="span-all">
                    {(id) => (
                      <input
                        id={id}
                        className="input"
                        lang="en"
                        value={word.example ?? ""}
                        onChange={(e) => setData({ words: update(data.words ?? [], index, { example: e.target.value }) })}
                      />
                    )}
                  </Field>
                </div>
              </div>
            ))}
            <Button size="sm" icon={Plus} onClick={() => setData({ words: [...(data.words ?? []), { term: "", ru: "", kk: "", example: "" }] })}>
              {t("admin.task.addWord")}
            </Button>
          </div>
        )}

        <div className="row">
          <Button
            variant="primary"
            loading={saving}
            onClick={() => void save()}
          >
            {t("admin.task.save")}
          </Button>
          <span className="spacer" />
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => void remove()}>
            {t("admin.task.delete")}
          </Button>
        </div>
      </div>
    </details>
  );
}
