import { useCallback, useEffect, useRef, useState } from "react";
import { createRecognition, transcriptsFrom, type Recognition } from "./speech";

export type Recording = { blob: Blob; transcripts: string[] };

/** Microphone recording, optionally with live speech recognition alongside. */
export function useRecorder({ recognize = false, maxSeconds = 45 } = {}) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<"mic" | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const recognition = useRef<Recognition | null>(null);
  const chunks = useRef<Blob[]>([]);
  const transcripts = useRef<string[]>([]);
  const recognitionDone = useRef<Promise<void>>(Promise.resolve());
  const timer = useRef<number | undefined>(undefined);
  const pending = useRef<((value: Recording | null) => void) | null>(null);

  const cleanup = useCallback(() => {
    window.clearTimeout(timer.current);
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }, []);

  const stop = useCallback((): Promise<Recording | null> => {
    const active = recorder.current;
    if (!active || active.state === "inactive") return Promise.resolve(null);
    return new Promise((resolve) => {
      pending.current = resolve;
      recognition.current?.stop();
      active.stop();
    });
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      stream.current = media;
      chunks.current = [];
      transcripts.current = [];
      const next = new MediaRecorder(media);
      next.ondataavailable = (event) => event.data.size && chunks.current.push(event.data);
      next.onstop = async () => {
        cleanup();
        setRecording(false);
        // Give the recognizer a moment to deliver its final result.
        await Promise.race([recognitionDone.current, new Promise((r) => setTimeout(r, 1800))]);
        const blob = new Blob(chunks.current, { type: next.mimeType || "audio/webm" });
        pending.current?.({ blob, transcripts: transcripts.current });
        pending.current = null;
      };
      recorder.current = next;

      if (recognize) {
        const rec = createRecognition();
        recognition.current = rec;
        if (rec) {
          recognitionDone.current = new Promise((resolve) => {
            rec.onresult = (event) => {
              transcripts.current = transcriptsFrom(event);
            };
            rec.onerror = () => resolve();
            rec.onend = () => resolve();
          });
          try {
            rec.start();
          } catch {
            recognitionDone.current = Promise.resolve();
          }
        }
      }
      next.start();
      setRecording(true);
      timer.current = window.setTimeout(() => void stop(), maxSeconds * 1000);
    } catch {
      cleanup();
      setError("mic");
    }
  }, [cleanup, maxSeconds, recognize, stop]);

  useEffect(
    () => () => {
      recognition.current?.abort();
      if (recorder.current?.state === "recording") recorder.current.stop();
      cleanup();
    },
    [cleanup],
  );

  return { recording, error, start, stop };
}
