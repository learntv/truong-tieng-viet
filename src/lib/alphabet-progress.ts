// Progress store for the alphabet tab. Kept out of Supabase intentionally —
// this feature is designed to work for anonymous 3–6 year olds without login.
// Data persists in localStorage across reloads and survives SSR by lazy-reading.

const KEY = "vui-hoc-bang-chu-cai-v1";

export type LetterStat = {
  /** How many times the child opened the letter in Explore mode. */
  seen: number;
  /** How many times the child answered a quiz right for this letter. */
  correct: number;
  /** How many times the child got it wrong (only for gentle balancing). */
  wrong: number;
};

export type AlphabetProgress = Record<string, LetterStat>;

const empty: LetterStat = { seen: 0, correct: 0, wrong: 0 };

function safeParse(raw: string | null): AlphabetProgress {
  if (!raw) return {};
  try {
    const p = JSON.parse(raw);
    return p && typeof p === "object" ? (p as AlphabetProgress) : {};
  } catch {
    return {};
  }
}

export function loadAlphabetProgress(): AlphabetProgress {
  if (typeof window === "undefined") return {};
  try {
    return safeParse(window.localStorage.getItem(KEY));
  } catch {
    return {};
  }
}

export function saveAlphabetProgress(p: AlphabetProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore quota errors */
  }
}

export function getStat(progress: AlphabetProgress, upper: string): LetterStat {
  return progress[upper] ?? empty;
}

/** A letter is "thuộc" (mastered) after 3+ correct answers and at least 1 look. */
export function isMastered(stat: LetterStat): boolean {
  return stat.correct >= 3 && stat.seen >= 1;
}

export function masteryLevel(stat: LetterStat): 0 | 1 | 2 | 3 {
  if (stat.correct >= 5) return 3;
  if (stat.correct >= 3) return 2;
  if (stat.correct >= 1 || stat.seen >= 1) return 1;
  return 0;
}
