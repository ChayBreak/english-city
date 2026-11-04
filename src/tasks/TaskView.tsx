import type { Progress } from "../lib/backend";
import { useI18n } from "../lib/i18n";
import type { Task } from "../lib/types";
import { PronunciationTask } from "./PronunciationTask";
import { QuizTask } from "./QuizTask";
import { StatusBadge, TASK_META } from "./shared";
import { VocabularyTask } from "./VocabularyTask";
import { WritingTask } from "./WritingTask";

export function TaskView({ task, progress, onChange }: { task: Task; progress: Progress | null; onChange: () => void }) {
  const { t, pick } = useI18n();
  const meta = TASK_META[task.kind];
  const submission = progress?.submissions.find((item) => item.task_id === task.id);
  const result = progress?.results.find((item) => item.task_id === task.id);
  const prompt = pick(task, "prompt");

  return (
    <article className="task-card">
      <header className="task-head">
        <span className={`task-icon tone-${meta.tone}`}>
          <meta.icon strokeWidth={1.75} />
        </span>
        <div className="task-head-text">
          <span className="caption">{t(`task.kind.${task.kind}`)}</span>
          <h3 className="h4">{pick(task, "title") || t(`task.kind.${task.kind}`)}</h3>
          {prompt && <p className="muted small">{prompt}</p>}
        </div>
        {submission && (
          <span className="task-status">
            <StatusBadge status={submission.status} />
          </span>
        )}
      </header>
      {task.kind === "pronunciation" && <PronunciationTask task={task} submission={submission} onSubmitted={onChange} />}
      {task.kind === "quiz" && <QuizTask task={task} result={result} onSaved={onChange} />}
      {task.kind === "writing" && <WritingTask task={task} submission={submission} onSubmitted={onChange} />}
      {task.kind === "vocabulary" && <VocabularyTask task={task} result={result} onSaved={onChange} />}
    </article>
  );
}
