import type { ChuDeWithChangs } from "@/lib/learning";

// Speech helpers for the speaking-coach feature (/luyen-noi).
// Everything here runs in the browser only — recorded audio never leaves the
// device. Note: Chrome's SpeechRecognition itself transcribes on Google's
// servers (browser behavior we can't change); recognition is therefore an
// optional enhancement, never a requirement.

// ─── Text-to-speech ───────────────────────────────────────────────────────────

export function getVietnameseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang.toLowerCase().startsWith("vi")) ?? null;
}

export function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "vi-VN";
  // Slow and slightly high-pitched reads friendlier for young kids.
  u.rate = 0.85;
  u.pitch = 1.05;
  const voice = getVietnameseVoice();
  if (voice) u.voice = voice;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

export function cancelSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// ─── Speech recognition (Chrome/Edge only — optional enhancement) ─────────────

type RecognitionResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

export function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function canRecordAudio(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined"
  );
}

export type RecognitionSession = {
  /** Stops listening and resolves with the final transcript ("" if nothing heard). */
  finish: () => Promise<string>;
  abort: () => void;
};

// Runs alongside MediaRecorder: recognition and getUserMedia can share the mic
// on Chrome. Any error just yields an empty transcript — the UI falls back to
// self-assessment, it never blocks the practice loop.
export function startRecognition(): RecognitionSession | null {
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) return null;

  const rec = new Ctor();
  rec.lang = "vi-VN";
  rec.continuous = true;
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  let transcript = "";
  let settled = false;
  let resolveEnd: (t: string) => void = () => {};
  const done = new Promise<string>((resolve) => {
    resolveEnd = resolve;
  });
  const settle = () => {
    if (!settled) {
      settled = true;
      resolveEnd(transcript.trim());
    }
  };

  rec.onresult = (e) => {
    const parts: string[] = [];
    for (let i = 0; i < e.results.length; i++) {
      parts.push(e.results[i][0]?.transcript ?? "");
    }
    transcript = parts.join(" ");
  };
  rec.onerror = settle;
  rec.onend = settle;

  try {
    rec.start();
  } catch {
    return null;
  }

  return {
    finish: () => {
      try {
        rec.stop();
      } catch {
        settle();
      }
      // onend can lag or never fire after tab switches — don't hang the UI.
      setTimeout(settle, 1500);
      return done;
    },
    abort: () => {
      try {
        rec.abort();
      } catch {
        /* ignore */
      }
      settle();
    },
  };
}

// ─── Sentence comparison / scoring ────────────────────────────────────────────

// Lowercases and strips punctuation but KEEPS Vietnamese diacritics — tones are
// exactly what the child is practicing.
export function normalizeSpoken(s: string): string {
  return s
    .toLocaleLowerCase("vi")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type WordMatch = { word: string; matched: boolean };

export function compareSentence(
  target: string,
  spoken: string,
): { ratio: number; words: WordMatch[] } {
  const pool = new Map<string, number>();
  for (const w of normalizeSpoken(spoken).split(" ").filter(Boolean)) {
    pool.set(w, (pool.get(w) ?? 0) + 1);
  }

  let considered = 0;
  let matchedCount = 0;
  const words: WordMatch[] = target
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => {
      const norm = normalizeSpoken(raw);
      // Pure-punctuation tokens don't count toward the score.
      if (!norm) return { word: raw, matched: true };
      considered++;
      const left = pool.get(norm) ?? 0;
      if (left > 0) {
        pool.set(norm, left - 1);
        matchedCount++;
        return { word: raw, matched: true };
      }
      return { word: raw, matched: false };
    });

  return { ratio: considered > 0 ? matchedCount / considered : 0, words };
}

export type Stars = 0 | 1 | 2 | 3;

// Deliberately forgiving: a kid who spoke at all always gets at least one star.
export function starsFromRatio(ratio: number, spokeAnything: boolean): Stars {
  if (!spokeAnything) return 0;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

// ─── Practice-sentence extraction from the existing curriculum ────────────────

export type SpeakingSentence = { id: string; text: string; imageUrl?: string };

const MIN_WORDS = 2;
const MAX_WORDS = 10;
const MAX_PER_TOPIC = 24;

// Pulls speakable sentences out of a topic's lesson content (bai texts + image
// captions). IDs are derived from DB row ids so saved practice stats stay
// stable across sessions and content re-ordering.
export function extractSpeakingSentences(topic: ChuDeWithChangs): SpeakingSentence[] {
  const out: SpeakingSentence[] = [];
  const seen = new Set<string>();

  const push = (id: string, text: string, imageUrl?: string) => {
    if (out.length >= MAX_PER_TOPIC) return;
    const clean = text.replace(/\s+/g, " ").trim();
    if (/https?:\/\//i.test(clean)) return;
    const norm = normalizeSpoken(clean);
    const wordCount = norm ? norm.split(" ").length : 0;
    if (wordCount < MIN_WORDS || wordCount > MAX_WORDS) return;
    if (seen.has(norm)) return;
    seen.add(norm);
    out.push({ id, text: clean, imageUrl });
  };

  for (const chang of topic.changs) {
    for (const nd of chang.noiDungs) {
      for (const bai of nd.bais) {
        const baiImage = bai.hinhs[0]?.url || undefined;
        bai.texts.forEach((t, i) => push(`${bai.id}#t${i}`, t, baiImage));
        for (const hinh of bai.hinhs) {
          hinh.captions.forEach((c, i) => push(`${hinh.id}#c${i}`, c, hinh.url || baiImage));
        }
      }
    }
  }

  return out;
}
