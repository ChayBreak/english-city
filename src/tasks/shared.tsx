import { useEffect, useState } from "react";
import { BookOpenCheck, ListChecks, Mic, PenLine, type LucideIcon } from "lucide-react";
import { backend } from "../lib/backend";
import { useI18n } from "../lib/i18n";
import type { ReviewStatus, Submission, TaskKind } from "../lib/types";
import { Badge, type Tone } from "../ui";

export const TASK_META: Record<TaskKind, { icon: LucideIcon; tone: Tone }> = {
  pronunciation: { icon: Mic, tone: "violet" },
  quiz: { icon: ListChecks, tone: "sky" },
  writing: { icon: PenLine, tone: "pink" },
  vocabulary: { icon: BookOpenCheck, tone: "violet" },
};

export const STATUS_TONE: Record<ReviewStatus, Tone> = { submitted: "warning", reviewed: "success", needs_work: "danger" };

export function StatusBadge({ status }: { status: ReviewStatus }) {
  const { t } = useI18n();
  return <Badge tone={STATUS_TONE[status]}>{t(`task.status.${status}`)}</Badge>;
}

/** Plays a file from the private audio bucket (signed URL on demand). */
export function StoredAudio({ path }: { path: string }) {
  const [url, setUrl] = useState("");
  const [missing, setMissing] = useState(false);
  const { t } = useI18n();
  useEffect(() => {
    let alive = true;
    backend
      .audioUrl(path)
      .then((value) => {
        if (!alive) return;
        if (value) setUrl(value);
        else setMissing(true);
      })
      .catch(() => alive && setMissing(true));
    return () => {
      alive = false;
    };
  }, [path]);
  if (missing) return <span className="meta">{t("audio.unavailable")}</span>;
  if (!url) return <span className="spinner" />;
  return <audio controls preload="none" src={url} />;
}

export function Feedback({ submission }: { submission: Submission }) {
  const { t, date } = useI18n();
  if (submission.status === "submitted")
    return (
      <div className="feedback">
        <div className="feedback-head">
          <StatusBadge status="submitted" />
          <span className="meta">{t("task.sentAt", { date: date(submission.updated_at, true) })}</span>
        </div>
        <p className="meta">{t("task.waiting")}</p>
      </div>
    );
  return (
    <div className="feedback">
      <div className="feedback-head">
        <StatusBadge status={submission.status} />
        {submission.score !== null && (
          <span className="num">
            {t("task.score")}: {submission.score} / 100
          </span>
        )}
        <span className="meta">{date(submission.reviewed_at)}</span>
      </div>
      {submission.feedback && (
        <div className="stack-sm">
          <b className="small">{t("task.feedback")}</b>
          <p>{submission.feedback}</p>
        </div>
      )}
      {submission.feedback_audio_path && (
        <div className="stack-sm">
          <b className="small">{t("task.voiceReply")}</b>
          <StoredAudio path={submission.feedback_audio_path} />
        </div>
      )}
    </div>
  );
}
