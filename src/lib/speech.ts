import type { ChuDeWithChangs } from "@/lib/learning";

// Speech helpers for the speaking-coach feature (/luyen-noi).
// Text-to-speech playback lives in src/hooks/useSingletonAudio.ts + src/lib/tts/text.ts
// (Google Cloud TTS via /api/tts) — everything below is about the child's own voice, which
// runs in the browser only and never leaves the device. Note: Chrome's SpeechRecognition
// itself transcribes on Google's servers (browser behavior we can't change); recognition is
// therefore an optional enhancement, never a requirement.

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

// Vietnamese STT writes numbers as digits: say "ba" and Chrome transcribes "3",
// which then never matches the lesson's written "ba". Spelling digits back out
// (both sides, so a target written "3" works too) makes the two comparable.
const DIGIT_WORDS = [
  "không",
  "một",
  "hai",
  "ba",
  "bốn",
  "năm",
  "sáu",
  "bảy",
  "tám",
  "chín",
] as const;

function spellNumber(n: number): string {
  if (n < 10) return DIGIT_WORDS[n];
  if (n < 100) {
    const [tens, ones] = [Math.floor(n / 10), n % 10];
    const head = tens === 1 ? "mười" : `${DIGIT_WORDS[tens]} mươi`;
    if (ones === 0) return head;
    // Spoken quirks: 21 is "mốt" not "một", 25 is "lăm" not "năm".
    if (ones === 1 && tens > 1) return `${head} mốt`;
    if (ones === 5) return `${head} lăm`;
    return `${head} ${DIGIT_WORDS[ones]}`;
  }
  const hundreds = `${DIGIT_WORDS[Math.floor(n / 100)]} trăm`;
  const rest = n % 100;
  if (rest === 0) return hundreds;
  // 105 is "một trăm linh năm" — the zero tens slot gets a filler word.
  if (rest < 10) return `${hundreds} linh ${DIGIT_WORDS[rest]}`;
  return `${hundreds} ${spellNumber(rest)}`;
}

/** Replaces digit-only tokens (0–999) with their spoken Vietnamese words. */
export function expandNumeralsToWords(s: string): string {
  return s
    .split(/\s+/)
    .map((tok) => (/^\d{1,3}$/.test(tok) ? spellNumber(Number(tok)) : tok))
    .join(" ");
}

// "hai mươi tư" and "hai mươi bốn" are the same number; likewise "nhăm"/"lăm".
// Only folded right after a tens word, so the ordinary words "tư" and "năm"
// (as in "tư duy", "năm nay") are left alone.
function foldNumberVariants(tokens: string[]): string[] {
  const VARIANTS: Record<string, string> = { tư: "bốn", nhăm: "lăm", năm: "lăm" };
  return tokens.map((tok, i) => {
    const prev = tokens[i - 1];
    if (prev !== "mươi" && prev !== "mười") return tok;
    return VARIANTS[tok] ?? tok;
  });
}

// Comparison tokens must stay 1:1 with the sentence's words (the UI highlights
// per word), so only expansions that are a single word are folded in — "3" and
// "10" become "ba"/"mười", while "25" stays "25" and matches the other side's
// "25". Applied to target and transcript alike.
function comparableTokens(s: string): string[] {
  const tokens = normalizeSpoken(s)
    .split(" ")
    .filter(Boolean)
    .map((tok) => {
      const spelled = expandNumeralsToWords(tok);
      return spelled.includes(" ") ? tok : spelled;
    });
  return foldNumberVariants(tokens);
}

export type CharMatch = { char: string; ok: boolean };

export type WordMatch = {
  word: string;
  matched: boolean;
  // What the child said in this word's place, when it didn't match exactly.
  spokenWord?: string;
  // Per-character correctness of `word`, aligned against `spokenWord` — lets the
  // UI point at exactly which letter/tone mark was off, not just "wrong word".
  chars?: CharMatch[];
};

// Longest-common-subsequence mask: for each character of `a`, whether it's part
// of a subsequence shared with `b` (in order). Used to pinpoint which letters
// (incl. tone marks, which are their own codepoints) differ between two words.
function lcsMask(a: string[], b: string[]): boolean[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const mask = new Array<boolean>(n).fill(false);
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      mask[i - 1] = true;
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return mask;
}

// `display` keeps the sentence's original casing/punctuation for rendering;
// `compareBase` (same length as `display`) is what actually gets diffed
// against the spoken word so a case difference alone never reads as wrong.
function charDiff(display: string, compareBase: string, spokenWord: string): CharMatch[] {
  const base = Array.from(compareBase);
  const mask = lcsMask(base, Array.from(spokenWord));
  return Array.from(display).map((char, idx) => ({ char, ok: mask[idx] ?? false }));
}

function lcsLength(a: string[], b: string[]): number {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[n][m];
}

// Cost of pairing two different words in the alignment below. Plain edit
// distance charges a flat 1 for every substitution, which ties with
// delete+insert (cost 2 total) as soon as a sentence is a word short —
// and DP then breaks that tie arbitrarily, sometimes pairing up completely
// unrelated words. Scaling the cost by character overlap means lookalike
// words (e.g. "trời"/"troi") stay cheaper to pair than to split apart, while
// truly unrelated words still cost the same as delete+insert.
function wordSubCost(a: string, b: string): number {
  if (a === b) return 0;
  const ac = Array.from(a);
  const bc = Array.from(b);
  const maxLen = Math.max(ac.length, bc.length) || 1;
  return 2 * (1 - lcsLength(ac, bc) / maxLen);
}

// Weighted alignment between the target's words and the spoken words —
// unlike a bag-of-words count, this pairs each target word with whichever
// spoken word actually lines up with it (or nothing, if it was skipped),
// which is what lets us show *what was heard instead* per word.
function alignWords(
  target: string[],
  spoken: string[],
): Array<{ targetIdx: number | null; spokenIdx: number | null }> {
  const n = target.length;
  const m = spoken.length;
  const EPS = 1e-9;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const subCost = wordSubCost(target[i - 1], spoken[j - 1]);
      dp[i][j] = Math.min(dp[i - 1][j - 1] + subCost, dp[i - 1][j] + 1, dp[i][j - 1] + 1);
    }
  }

  const ops: Array<{ targetIdx: number | null; spokenIdx: number | null }> = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    const subCost = i > 0 && j > 0 ? wordSubCost(target[i - 1], spoken[j - 1]) : Infinity;
    if (i > 0 && j > 0 && Math.abs(dp[i][j] - (dp[i - 1][j - 1] + subCost)) < EPS) {
      ops.push({ targetIdx: i - 1, spokenIdx: j - 1 }); // match or substitution
      i--;
      j--;
    } else if (i > 0 && Math.abs(dp[i][j] - (dp[i - 1][j] + 1)) < EPS) {
      ops.push({ targetIdx: i - 1, spokenIdx: null }); // target word not said at all
      i--;
    } else {
      ops.push({ targetIdx: null, spokenIdx: j - 1 }); // extra spoken word, no target counterpart
      j--;
    }
  }
  return ops.reverse();
}

export type SpokenWord = { word: string; extra: boolean };

export function compareSentence(
  target: string,
  spoken: string,
): { ratio: number; words: WordMatch[]; spokenWords: SpokenWord[] } {
  const rawTokens = target.split(/\s+/).filter(Boolean);
  const spokenTokens = comparableTokens(spoken);
  // Original casing, for display — assumed to line up 1:1 with spokenTokens
  // (holds unless the transcript has a token that's pure punctuation, which
  // STT output essentially never produces).
  const rawSpokenTokens = spoken.split(/\s+/).filter(Boolean);

  // Punctuation-only tokens don't participate in alignment or scoring.
  const consideredIdx: number[] = [];
  const consideredNorms: string[] = [];
  rawTokens.forEach((raw, idx) => {
    const norm = comparableTokens(raw).join(" ");
    if (norm) {
      consideredIdx.push(idx);
      consideredNorms.push(norm);
    }
  });

  const ops = alignWords(consideredNorms, spokenTokens);
  const byConsideredIdx = new Map<number, { matched: boolean; spokenWord?: string }>();
  const usedSpokenIdx = new Set<number>();
  let extraCount = 0;
  for (const op of ops) {
    if (op.targetIdx == null) {
      extraCount++; // extra spoken word — no target word to attach it to
      continue;
    }
    const spokenWord = op.spokenIdx != null ? spokenTokens[op.spokenIdx] : undefined;
    if (op.spokenIdx != null) usedSpokenIdx.add(op.spokenIdx);
    byConsideredIdx.set(op.targetIdx, {
      matched: spokenWord === consideredNorms[op.targetIdx],
      spokenWord,
    });
  }

  let matchedCount = 0;
  const words: WordMatch[] = rawTokens.map((raw, idx) => {
    const norm = comparableTokens(raw).join(" ");
    if (!norm) return { word: raw, matched: true };

    const ci = consideredIdx.indexOf(idx);
    const info = byConsideredIdx.get(ci);
    if (!info || info.matched) {
      if (info?.matched) matchedCount++;
      return { word: raw, matched: !!info?.matched };
    }

    const chars = info.spokenWord
      ? charDiff(raw, raw.toLocaleLowerCase("vi"), info.spokenWord)
      : undefined;
    return { word: raw, matched: false, spokenWord: info.spokenWord, chars };
  });

  // Extra words the child added (that don't correspond to any target word)
  // count against the score too — saying the whole sentence plus a bunch of
  // unrelated chatter shouldn't score the same as saying it cleanly.
  const considered = consideredIdx.length;
  const ratio = considered > 0 ? matchedCount / (considered + extraCount) : 0;

  // Show the spelled-out form for anything the transcript wrote as digits —
  // the child said "ba", so echoing "3" back at them under "Con đã nói" reads
  // as a mistake they didn't make.
  const spokenWords: SpokenWord[] = spokenTokens.map((tok, j) => {
    const raw = rawSpokenTokens[j];
    return {
      word: raw == null || /\d/.test(raw) ? tok : raw,
      extra: !usedSpokenIdx.has(j),
    };
  });

  return { ratio, words, spokenWords };
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
