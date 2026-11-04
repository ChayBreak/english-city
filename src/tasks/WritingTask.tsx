import { useState } from "react";
import { PencilLine, Send } from "lucide-react";
import { backend } from "../lib/backend";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import { words } from "../lib/speech";
import type { Submission, Task } from "../lib/types";
import { errorText } from "../lib/util";
import { Button, useToast } from "../ui";
import { Feedback } from "./shared";

export function WritingTask({ task, submission, onSubmitted }: { task: Task; submission?: Submission; onSubmitted: () => void }) {
  const { t } = useI18n();
  const { profile } = useAuth();
  const toast = useToast();
  const [editingChoice, setEditing] = useState<boolean | null>(null);
  const editing = editingChoice ?? !submission;
  // Until the student types, the draft is their previous answer (which may load late).
  const [draft, setText] = useState<string | null>(null);
  const text = draft ?? submission?.answer.text ?? "";
  const [sending, setSending] = useState(false);
  const { min_words: min = 0, max_words: max = 0, checklist = [] } = task.data;
  const count = words(text).length;
  const enough = count >= (min || 1);

  const submit = async () => {
    if (!profile) return;
    setSending(true);
    try {
      await backend.submitTask(profile.id, { task, answer: { text: text.trim() }, auto_score: null });
      toast(t("task.sent"));
      setEditing(false);
      onSubmitted();
    } catch (error) {
      toast(errorText(error), true);
    } finally {
      setSending(false);
    }
  };

  if (!editing && submission)
    return (
      <div className="stack">
        <Feedback submission={submission} />
        <div className="sunken stack-sm">
          <b className="small">{t("task.yourAnswer")}</b>
          <p lang="en" style={{ whiteSpace: "pre-wrap" }}>
            {submission.answer.text}
          </p>
        </div>
        <div>
          <Button icon={PencilLine} onClick={() => setEditing(true)}>
            {t("writing.edit")}
          </Button>
        </div>
      </div>
    );

  return (
    <div className="stack">
      <textarea
        className="input"
        rows={8}
        lang="en"
        spellCheck
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("writing.placeholder")}
        aria-label={t("task.yourAnswer")}
      />
      <div className="row-between">
        <span className={`word-count ${enough && (!max || count <= max) ? "ok" : ""}`}>
          {t("writing.words", { n: count })}
          {min && max ? ` · ${t("writing.range", { min, max })}` : min ? ` · ${t("writing.min", { min })}` : ""}
        </span>
      </div>
      {checklist.length > 0 && (
        <div className="sunken stack-sm">
          <b className="small">{t("writing.checklist")}</b>
          {checklist.map((item) => (
            <label key={item} className="check" lang="en">
              <input type="checkbox" /> {item}
            </label>
          ))}
        </div>
      )}
      <div className="row">
        {profile && (
          <Button variant="primary" icon={Send} loading={sending} disabled={!enough} onClick={() => void submit()}>
            {submission ? t("task.resubmit") : t("pron.submit")}
          </Button>
        )}
        {!profile && <span className="meta">{t("lesson.loginToSave")}</span>}
        {submission && (
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
            {t("common.cancel")}
          </Button>
        )}
      </div>
    </div>
  );
}
