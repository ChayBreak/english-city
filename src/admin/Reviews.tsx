import { useEffect, useState } from "react";
import { Check, ClipboardCheck, Mic, RotateCcw, Square, Trash2 } from "lucide-react";
import { backend } from "../lib/backend";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import { comparePhrase, words } from "../lib/speech";
import type { ReviewStatus, Submission } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { useRecorder } from "../lib/useRecorder";
import { errorText } from "../lib/util";
import { MarkedPhrase, scoreTone } from "../tasks/PronunciationTask";
import { StatusBadge, StoredAudio, TASK_META } from "../tasks/shared";
import { Badge, Button, Empty, ErrorState, Field, Loading, Notice, Tabs, useToast } from "../ui";
import { AdminHead, useAdmin } from "./AdminLayout";

export default function Reviews() {
  const { t } = useI18n();
  const { stats, refreshStats } = useAdmin();
  const [status, setStatus] = useState<ReviewStatus | "all">("submitted");
  const { data, error, loading, reload } = useAsync(() => backend.listSubmissions(status), [status]);

  return (
    <>
      <AdminHead title={t("admin.reviews")} lead={t("admin.rev.lead")} />
      <div className="toolbar">
        <Tabs
          label={t("admin.filter")}
          value={status}
          onChange={setStatus}
          items={[
            { id: "submitted", label: t("task.status.submitted"), count: stats?.pendingReviews },
            { id: "needs_work", label: t("task.status.needs_work") },
            { id: "reviewed", label: t("task.status.reviewed") },
            { id: "all", label: t("admin.all") },
          ]}
        />
      </div>
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : data?.length ? (
        <div className="stack">
          {data.map((submission) => (
            <ReviewCard
              key={submission.id}
              submission={submission}
              onDone={() => {
                void reload();
                refreshStats();
              }}
            />
          ))}
        </div>
      ) : (
        <div className="card">
          <Empty icon={ClipboardCheck} title={t("admin.rev.empty")} />
        </div>
      )}
    </>
  );
}

function ReviewCard({ submission, onDone }: { submission: Submission; onDone: () => void }) {
  const { t, date } = useI18n();
  const { profile } = useAuth();
  const toast = useToast();
  const meta = TASK_META[submission.kind];
  const [score, setScore] = useState(submission.score?.toString() ?? submission.auto_score?.toString() ?? "");
  const [feedback, setFeedback] = useState(submission.feedback);
  const [voicePath, setVoicePath] = useState(submission.feedback_audio_path);
  const [voice, setVoice] = useState<{ blob: Blob; url: string } | null>(null);
  const [busy, setBusy] = useState<ReviewStatus | null>(null);
  const recorder = useRecorder({ maxSeconds: 120 });

  useEffect(
    () => () => {
      if (voice) URL.revokeObjectURL(voice.url);
    },
    [voice],
  );

  const stopVoice = async () => {
    const result = await recorder.stop();
    if (result) setVoice({ blob: result.blob, url: URL.createObjectURL(result.blob) });
  };

  const save = async (status: ReviewStatus) => {
    const value = score.trim() === "" ? null : Math.max(0, Math.min(100, Math.round(Number(score))));
    if (value !== null && Number.isNaN(value)) return;
    setBusy(status);
    try {
      let audioPath = voicePath;
      if (voice && profile) audioPath = await backend.uploadAudio(submission.student_id, voice.blob);
      await backend.reviewSubmission(submission.id, { status, score: value, feedback: feedback.trim(), feedback_audio_path: audioPath });
      toast(status === "reviewed" ? t("admin.rev.acceptedToast") : t("admin.rev.returnedToast"));
      onDone();
    } catch (error) {
      toast(errorText(error), true);
    } finally {
      setBusy(null);
    }
  };

  const text = submission.answer.text ?? "";

  return (
    <article className="card stack">
      <header className="task-head">
        <span className={`task-icon tone-${meta.tone}`}>
          <meta.icon strokeWidth={1.75} />
        </span>
        <div className="task-head-text">
          <b>{submission.student?.full_name || submission.student?.email}</b>
          <span className="meta">
            {submission.lesson?.course?.title} · {submission.lesson?.title} · {submission.task?.title || t(`task.kind.${submission.kind}`)}
          </span>
          <span className="caption">{date(submission.updated_at, true)}</span>
        </div>
        <span className="task-status">
          <StatusBadge status={submission.status} />
        </span>
      </header>

      {submission.task?.prompt && <p className="muted small">{submission.task.prompt}</p>}

      {submission.kind === "pronunciation" && (
        <div className="stack-sm">
          {submission.auto_score !== null && (
            <span className="meta">
              {t("admin.rev.autoScore")}: <b>{submission.auto_score}%</b>
            </span>
          )}
          {(submission.answer.items ?? []).map((item, index) => (
            <div key={index} className="phrase">
              <div className="phrase-top">
                <span className="phrase-num">{index + 1}</span>
                <p className="phrase-text" lang="en">
                  {item.transcript ? <MarkedPhrase marks={comparePhrase(item.text, item.transcript).marks} /> : item.text}
                </p>
                {item.score !== null && <Badge tone={scoreTone(item.score)}>{item.score}%</Badge>}
              </div>
              <span className="meta">
                {t("pron.heard")}: {item.transcript ? <span lang="en">«{item.transcript}»</span> : t("admin.rev.noTranscript")}
              </span>
              <StoredAudio path={item.audio_path} />
            </div>
          ))}
        </div>
      )}

      {submission.kind === "writing" && (
        <div className="sunken stack-sm">
          <span className="caption">{t("writing.words", { n: words(text).length })}</span>
          <p lang="en" style={{ whiteSpace: "pre-wrap" }}>
            {text}
          </p>
        </div>
      )}

      <div className="form-grid cols-3">
        <Field label={t("admin.rev.score")} hint="0–100">
          {(id) => (
            <input
              id={id}
              className="input num"
              type="number"
              min={0}
              max={100}
              inputMode="numeric"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          )}
        </Field>
        <Field label={t("admin.rev.feedback")} className="span-all" hint={t("admin.rev.feedbackHint")}>
          {(id) => <textarea id={id} className="input" rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} />}
        </Field>
      </div>

      <div className="stack-sm">
        <span className="field-label">{t("task.voiceReply")}</span>
        {recorder.error && <Notice tone="danger">{t("pron.noMic")}</Notice>}
        <div className="row">
          {recorder.recording ? (
            <>
              <Button size="sm" className="btn-rec" icon={Square} onClick={() => void stopVoice()}>
                {t("pron.stop")}
              </Button>
              <span className="row meta">
                <span className="rec-dot" />
                {t("pron.recording")}
              </span>
            </>
          ) : voice ? (
            <>
              <audio controls src={voice.url} />
              <Button size="sm" variant="ghost" icon={Trash2} onClick={() => setVoice(null)}>
                {t("common.delete")}
              </Button>
            </>
          ) : voicePath ? (
            <>
              <StoredAudio path={voicePath} />
              <Button size="sm" variant="ghost" icon={Trash2} onClick={() => setVoicePath("")}>
                {t("common.delete")}
              </Button>
            </>
          ) : (
            <Button size="sm" icon={Mic} onClick={() => void recorder.start()}>
              {t("admin.rev.recordVoice")}
            </Button>
          )}
        </div>
      </div>

      <div className="row">
        <Button variant="success" icon={Check} loading={busy === "reviewed"} disabled={Boolean(busy) || recorder.recording} onClick={() => void save("reviewed")}>
          {t("admin.rev.accept")}
        </Button>
        <Button icon={RotateCcw} loading={busy === "needs_work"} disabled={Boolean(busy) || recorder.recording} onClick={() => void save("needs_work")}>
          {t("admin.rev.return")}
        </Button>
      </div>
    </article>
  );
}
