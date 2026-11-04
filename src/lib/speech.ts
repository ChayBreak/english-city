// Browser speech: the reference voice (speechSynthesis) and the automatic
// pronunciation check (SpeechRecognition, available in Chrome and Edge).

type RecognitionResultList = ArrayLike<ArrayLike<{ transcript: string; confidence: number }> & { isFinal: boolean }>;
type RecognitionEvent = { results: RecognitionResultList };
export type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};
type RecognitionCtor = new () => Recognition;

export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const canRecognize = () => recognitionCtor() !== null;

export const canRecord = () =>
  typeof window !== "undefined" && "MediaRecorder" in window && Boolean(navigator.mediaDevices?.getUserMedia);

let cachedVoice: SpeechSynthesisVoice | null = null;

function englishVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  const rank = (voice: SpeechSynthesisVoice) =>
    (voice.lang === "en-US" ? 4 : voice.lang === "en-GB" ? 3 : 0) +
    (/natural|neural|google|samantha|aria|jenny/i.test(voice.name) ? 2 : 0) +
    (voice.localService ? 0 : 1);
  cachedVoice = voices.sort((a, b) => rank(b) - rank(a))[0] ?? null;
  return cachedVoice;
}

/** Speaks English text; resolves when finished or interrupted. */
export function speak(text: string, rate = 0.95): Promise<void> {
  if (!canSpeak()) return Promise.resolve();
  const synth = window.speechSynthesis;
  synth.cancel();
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = englishVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? "en-US";
    utterance.rate = rate;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    synth.speak(utterance);
  });
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

export function createRecognition(): Recognition | null {
  const Ctor = recognitionCtor();
  if (!Ctor) return null;
  const recognition = new Ctor();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;
  return recognition;
}

/** Collects every alternative transcript the recognizer produced. */
export function transcriptsFrom(event: RecognitionEvent): string[] {
  const finals = Array.from(event.results).filter((result) => result.isFinal);
  if (!finals.length) return [];
  const maxAlternatives = Math.max(...finals.map((result) => result.length));
  const out: string[] = [];
  for (let i = 0; i < maxAlternatives; i++) {
    out.push(
      finals
        .map((result) => result[Math.min(i, result.length - 1)].transcript.trim())
        .join(" ")
        .trim(),
    );
  }
  return out.filter(Boolean);
}

const NUMBERS: Record<string, string> = {
  "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven",
  "8": "eight", "9": "nine", "10": "ten", "11": "eleven", "12": "twelve", "13": "thirteen", "20": "twenty",
  "30": "thirty", "100": "hundred",
};
const CONTRACTIONS: Record<string, string[]> = {
  "i'm": ["i", "am"], "you're": ["you", "are"], "it's": ["it", "is"], "don't": ["do", "not"],
  "can't": ["can", "not"], "won't": ["will", "not"], "didn't": ["did", "not"], "i've": ["i", "have"],
  "that's": ["that", "is"], "let's": ["let", "us"], "isn't": ["is", "not"], "i'll": ["i", "will"],
};

/** Lowercase words without punctuation; contractions and digits expanded. */
export function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9'\s-]/g, " ")
    .split(/[\s-]+/)
    .map((word) => word.replace(/^'+|'+$/g, ""))
    .filter(Boolean)
    .flatMap((word) => CONTRACTIONS[word] ?? (NUMBERS[word] ? [NUMBERS[word]] : [word]));
}

export type WordMark = { word: string; ok: boolean };

/** Marks which words of the target phrase were heard (longest common subsequence). */
export function comparePhrase(target: string, heard: string): { marks: WordMark[]; score: number } {
  const display = target.split(/\s+/).filter(Boolean);
  const expected = display.map((token) => words(token));
  const flat = expected.flat();
  const got = words(heard);
  const dp = Array.from({ length: flat.length + 1 }, () => new Array<number>(got.length + 1).fill(0));
  for (let i = flat.length - 1; i >= 0; i--)
    for (let j = got.length - 1; j >= 0; j--)
      dp[i][j] = flat[i] === got[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const matched = new Array<boolean>(flat.length).fill(false);
  for (let i = 0, j = 0; i < flat.length && j < got.length; ) {
    if (flat[i] === got[j]) {
      matched[i] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  let cursor = 0;
  const marks = display.map((word, index) => {
    const parts = expected[index].length;
    const ok = parts === 0 || matched.slice(cursor, cursor + parts).every(Boolean);
    cursor += parts;
    return { word, ok };
  });
  const score = flat.length ? Math.round((matched.filter(Boolean).length / flat.length) * 100) : 0;
  return { marks, score };
}

/** Best match among the recognizer's alternatives. */
export function bestMatch(target: string, transcripts: string[]) {
  let best = { transcript: "", ...comparePhrase(target, "") };
  for (const transcript of transcripts) {
    const result = comparePhrase(target, transcript);
    if (result.score > best.score || !best.transcript) best = { transcript, ...result };
  }
  return best;
}
