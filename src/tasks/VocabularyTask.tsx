import { useState } from "react";
import { Check, List, Repeat, RotateCcw, Volume2 } from "lucide-react";
import { backend } from "../lib/backend";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import { canSpeak, speak } from "../lib/speech";
import type { Task, TaskResult, VocabWord } from "../lib/types";
import { Badge, Button, IconButton, Notice, ProgressBar } from "../ui";

export function VocabularyTask({ task, result, onSaved }: { task: Task; result?: TaskResult; onSaved: () => void }) {
  const { t, locale } = useI18n();
  const { profile } = useAuth();
  const list = task.data.words ?? [];
  const [queue, setQueue] = useState<number[]>(() => list.map((_, i) => i));
  const [flipped, setFlipped] = useState(false);
  const [showList, setShowList] = useState(false);
  const translation = (word: VocabWord) => (locale === "kk" ? word.kk || word.ru : word.ru || word.kk);

  const current = queue[0];
  const known = list.length - queue.length;

  const answer = async (knows: boolean) => {
    setFlipped(false);
    const rest = queue.slice(1);
    const next = knows ? rest : [...rest, current];
    setQueue(next);
    if (!next.length && profile) {
      await backend.saveTaskResult(profile.id, task.id, list.length, list.length).catch(() => undefined);
      onSaved();
    }
  };

  return (
    <div className="stack">
      <div className="row-between">
        <ProgressBar value={known} max={list.length} label={t("vocab.progress")} valueText={`${known}/${list.length}`} />
      </div>
      {queue.length ? (
        <div className="flashcard-wrap">
          <button
            type="button"
            className={`flashcard ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped((value) => !value)}
            aria-label={flipped ? translation(list[current]) : t("vocab.flip")}
          >
            <span className="flashcard-inner">
              <span className="flashcard-face">
                <span className="flashcard-term" lang="en">
                  {list[current].term}
                </span>
                <span className="caption">{t("vocab.tapToFlip")}</span>
              </span>
              <span className="flashcard-face back">
                <span className="flashcard-translation">{translation(list[current])}</span>
                {list[current].example && (
                  <span className="flashcard-example" lang="en">
                    {list[current].example}
                  </span>
                )}
              </span>
            </span>
          </button>
          <div className="row" style={{ justifyContent: "center" }}>
            <IconButton icon={Volume2} label={t("pron.listen")} disabled={!canSpeak()} onClick={() => void speak(list[current].term, 0.9)} />
            <Button icon={Repeat} onClick={() => void answer(false)}>
              {t("vocab.again")}
            </Button>
            <Button variant="primary" icon={Check} onClick={() => void answer(true)}>
              {t("vocab.know")}
            </Button>
          </div>
        </div>
      ) : (
        <Notice tone="success">
          <div className="row">
            {t("vocab.done")}
            <Button size="sm" icon={RotateCcw} onClick={() => setQueue(list.map((_, i) => i))}>
              {t("vocab.restart")}
            </Button>
          </div>
        </Notice>
      )}
      {result && result.score >= result.total && queue.length === list.length && (
        <Badge tone="success" icon={Check}>
          {t("vocab.learnedBefore")}
        </Badge>
      )}
      <div>
        <Button variant="ghost" size="sm" icon={List} aria-expanded={showList} onClick={() => setShowList((v) => !v)}>
          {t("vocab.list")}
        </Button>
      </div>
      {showList && (
        <table className="vocab-table">
          <tbody>
            {list.map((word) => (
              <tr key={word.term}>
                <td lang="en">{word.term}</td>
                <td>{translation(word)}</td>
                <td style={{ width: 44 }}>
                  <IconButton icon={Volume2} size="sm" ghost label={t("pron.listen")} onClick={() => void speak(word.term, 0.9)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
