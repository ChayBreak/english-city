import { useEffect, useRef, useState } from "react";
import { Mic, RotateCcw, Send, Snail, Square, Volume2 } from "lucide-react";
import { backend } from "../lib/backend";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import { bestMatch, canRecognize, canRecord, canSpeak, comparePhrase, speak, stopSpeaking, type WordMark } from "../lib/speech";
import type { PhraseAttempt, Submission, Task } from "../lib/types";
import { useRecorder } from "../lib/useRecorder";
import { errorText } from "../lib/util";
import { Badge, Button, Notice, useToast } from "../ui";
import { Feedback, StoredAudio } from "./shared";

type Attempt = { blob: Blob; url: string; transcript: string; score: number | null; marks: WordMark[] | null };

export function scoreTone(score: number) {
  return score >= 85 ? "success" : score >= 60 ? "warning" : "danger";
}

export function MarkedPhrase({ marks }: { marks: WordMark[] }) {
  return (
    <>
      {marks.map((mark, index) => (
        <span key={index}>
          {index > 0 && " "}
          <span className={`word ${mark.ok ? "word-ok" : "word-miss"}`}>{mark.word}</span>
        </span>
      ))}
    </>
  );
}

export function PronunciationTask({ task, submission, onSubmitted }: { task: Task; submission?: Submission; onSubmitted: () => void }) {
  const { t, pick } = useI18n();
  const { profile } = useAuth();
  const toast = useToast();
  const phrases = task.data.phrases ?? [];
  const recognize = canRecognize();
  const recorder = useRecorder({ recognize });
  const [attempts, setAttempts] = useState<(Attempt | null)[]>(() => phrases.map(() => null));
  const [active, setActive] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [editingChoice, setEditing] = useState<boolean | null>(null);
  const editing = editingChoice ?? !submission;
  const [sending, setSending] = useState(false);
  const urls = useRef<string[]>([]);

  useEffect(() => () => {
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    stopSpeaking();
  }, []);

  const play = async (text: string, rate: number, key: string) => {
    setSpeaking(key);
    await speak(text, rate);
    setSpeaking((current) => (current === key ? null : current));
  };

  const record = async (index: number) => {
    stopSpeaking();
    setActive(index);
    await recorder.start();
  };

  const stop = async () => {
    const index = active;
    const result = await recorder.stop();
    if (index === null || !result) return;
    const url = URL.createObjectURL(result.blob);
    urls.current.push(url);
    const target = phrases[index].text;
    const match = recognize ? bestMatch(target, result.transcripts) : null;
    setAttempts((list) =>
      list.map((item, i) =>
        i === index
          ? {
              blob: result.blob,
              url,
              transcript: match?.transcript ?? "",
              score: match ? match.score : null,
              marks: match?.transcript ? match.marks : null,
            }
          : item,
      ),
    );
  };

  const recorded = attempts.filter(Boolean).length;

  const submit = async () => {
    if (!profile) return;
    setSending(true);
    try {
      const items: PhraseAttempt[] = [];
      for (let i = 0; i < phrases.length; i++) {
        const attempt = attempts[i]!;
        items.push({
          text: phrases[i].text,
          audio_path: await backend.uploadAudio(profile.id, attempt.blob),
          transcript: attempt.transcript,
          score: attempt.score,
        });
      }
      const scores = items.map((item) => item.score).filter((score): score is number => score !== null);
      const auto = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
      await backend.submitTask(profile.id, { task, answer: { items }, auto_score: auto });
      toast(t("task.sent"));
      setEditing(false);
      onSubmitted();
    } catch (error) {
      toast(errorText(error), true);
    } finally {
      setSending(false);
    }
  };

  if (!editing && submission) {
    return (
      <div className="stack">
        <Feedback submission={submission} />
        <div className="stack-sm">
          <b className="small">{t("task.yourAnswer")}</b>
          {(submission.answer.items ?? []).map((item, index) => (
            <div key={index} className="phrase">
              <div className="phrase-top">
                <span className="phrase-num">{index + 1}</span>
                <p className="phrase-text" lang="en">
                  {item.transcript ? <MarkedPhrase marks={comparePhrase(item.text, item.transcript).marks} /> : item.text}
                </p>
                {item.score !== null && <Badge tone={scoreTone(item.score)}>{t("pron.score", { n: item.score })}</Badge>}
              </div>
              <StoredAudio path={item.audio_path} />
            </div>
          ))}
        </div>
        <div>
          <Button icon={RotateCcw} onClick={() => setEditing(true)}>
            {t("task.tryAgain")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      {!canSpeak() && <Notice tone="warning">{t("pron.noTts")}</Notice>}
      {!canRecord() ? (
        <Notice tone="warning">{t("pron.noRecorder")}</Notice>
      ) : (
        !recognize && <Notice>{t("pron.noRecognition")}</Notice>
      )}
      {recorder.error && <Notice tone="danger">{t("pron.noMic")}</Notice>}
      {phrases.map((phrase, index) => {
        const attempt = attempts[index];
        const isActive = recorder.recording && active === index;
        return (
          <div key={index} className={`phrase ${isActive ? "active" : ""}`}>
            <div className="phrase-top">
              <span className="phrase-num">{index + 1}</span>
              <p className="phrase-text" lang="en">
                {attempt?.marks ? <MarkedPhrase marks={attempt.marks} /> : phrase.text}
              </p>
            </div>
            {pick(phrase, "hint") && <p className="phrase-hint">{pick(phrase, "hint")}</p>}
            <div className="phrase-actions">
              <Button
                size="sm"
                variant="soft"
                icon={Volume2}
                disabled={!canSpeak()}
                aria-pressed={speaking === `n${index}`}
                onClick={() => void play(phrase.text, 0.95, `n${index}`)}
              >
                {t("pron.listen")}
              </Button>
              <Button size="sm" variant="ghost" icon={Snail} disabled={!canSpeak()} onClick={() => void play(phrase.text, 0.6, `s${index}`)}>
                {t("pron.slow")}
              </Button>
              {isActive ? (
                <Button size="sm" className="btn-rec" icon={Square} onClick={() => void stop()}>
                  {t("pron.stop")}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant={attempt ? "secondary" : "primary"}
                  icon={Mic}
                  disabled={recorder.recording || !canRecord()}
                  onClick={() => void record(index)}
                >
                  {attempt ? t("pron.rerecord") : t("pron.record")}
                </Button>
              )}
              {isActive && (
                <span className="row meta">
                  <span className="rec-dot" />
                  {t("pron.recording")}
                </span>
              )}
            </div>
            {attempt && (
              <div className="stack-sm">
                <audio controls src={attempt.url} />
                {recognize && (
                  <div className="result-line">
                    {attempt.score !== null && attempt.transcript ? (
                      <>
                        <Badge tone={scoreTone(attempt.score)}>{t("pron.score", { n: attempt.score })}</Badge>
                        <span>
                          {t("pron.heard")}: «<span lang="en">{attempt.transcript}</span>»
                        </span>
                      </>
                    ) : (
                      <span>{t("pron.nothingHeard")}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      <div className="row">
        {profile ? (
          <Button
            variant="primary"
            icon={Send}
            loading={sending}
            disabled={recorded < phrases.length || recorder.recording}
            onClick={() => void submit()}
          >
            {submission ? t("task.resubmit") : t("pron.submit")}
          </Button>
        ) : null}
        <span className="meta">
          {!profile ? t("lesson.loginToSave") : recorded < phrases.length ? t("pron.needAll", { done: recorded, total: phrases.length }) : t("pron.ready")}
        </span>
        {submission && (
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
            {t("common.cancel")}
          </Button>
        )}
      </div>
    </div>
  );
}
