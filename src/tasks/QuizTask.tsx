import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { backend } from "../lib/backend";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import type { Task, TaskResult } from "../lib/types";
import { Badge, Button, Notice } from "../ui";

export function QuizTask({ task, result, onSaved }: { task: Task; result?: TaskResult; onSaved: () => void }) {
  const { t, pick } = useI18n();
  const { profile } = useAuth();
  const questions = task.data.questions ?? [];
  const [answers, setAnswers] = useState<number[]>(() => questions.map(() => -1));
  const [checked, setChecked] = useState(false);
  const [warn, setWarn] = useState(false);

  const score = answers.filter((answer, index) => answer === questions[index].correct).length;

  const check = async () => {
    if (answers.some((answer) => answer < 0)) {
      setWarn(true);
      return;
    }
    setWarn(false);
    setChecked(true);
    if (profile) {
      await backend.saveTaskResult(profile.id, task.id, score, questions.length).catch(() => undefined);
      onSaved();
    }
  };

  return (
    <div className="stack">
      {result && !checked && (
        <span className="meta">{t("quiz.best", { score: result.score, total: result.total })}</span>
      )}
      {questions.map((question, qi) => (
        <fieldset key={qi} className="quiz-q" style={{ border: 0, margin: 0, padding: 0 }}>
          <legend className="quiz-title" style={{ padding: 0, marginBottom: 12 }}>
            <span>{qi + 1}.</span>
            <span lang="en" style={{ color: "var(--ink)" }}>
              {question.question}
            </span>
          </legend>
          <div className="quiz-options">
            {question.options.map((option, oi) => {
              const selected = answers[qi] === oi;
              const state = checked ? (oi === question.correct ? "correct" : selected ? "wrong" : "") : "";
              return (
                <button
                  key={oi}
                  type="button"
                  className={`quiz-option ${state}`}
                  aria-pressed={selected}
                  disabled={checked}
                  onClick={() => setAnswers((list) => list.map((value, i) => (i === qi ? oi : value)))}
                >
                  <span className="quiz-letter">{String.fromCharCode(65 + oi)}</span>
                  <span lang="en">{option}</span>
                  {state && <span className="mark">{state === "correct" ? <Check strokeWidth={2.25} /> : <X strokeWidth={2.25} />}</span>}
                </button>
              );
            })}
          </div>
          {checked && pick(question, "explanation") && <p className="quiz-expl">{pick(question, "explanation")}</p>}
        </fieldset>
      ))}
      {warn && <Notice tone="warning">{t("quiz.answerAll")}</Notice>}
      <div className="row">
        {checked ? (
          <>
            <Badge tone={score === questions.length ? "success" : score >= questions.length / 2 ? "warning" : "danger"}>
              {t("quiz.result", { score, total: questions.length })}
            </Badge>
            <Button
              icon={RotateCcw}
              onClick={() => {
                setAnswers(questions.map(() => -1));
                setChecked(false);
              }}
            >
              {t("quiz.retry")}
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => void check()}>
            {t("quiz.check")}
          </Button>
        )}
      </div>
    </div>
  );
}
