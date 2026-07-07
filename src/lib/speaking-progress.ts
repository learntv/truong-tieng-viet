import type { Stars } from "@/lib/speech";

// Speaking-coach practice stats live in localStorage only — deliberately
// outside user_progress/leaderboard (per product decision). Keyed by the
// stable sentence ids from extractSpeakingSentences.

export type SpeakingStat = { attempts: number; bestStars: Stars };
export type SpeakingProgress = Record<string, SpeakingStat>;

const STORAGE_KEY = "vui-hoc-speaking";

export function loadSpeakingProgress(): SpeakingProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SpeakingProgress;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function recordSpeakingAttempt(id: string, stars: Stars): SpeakingProgress {
  const all = loadSpeakingProgress();
  const prev = all[id];
  all[id] = {
    attempts: (prev?.attempts ?? 0) + 1,
    bestStars: Math.max(prev?.bestStars ?? 0, stars) as Stars,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // localStorage unavailable (private browsing, quota) — stats just don't persist.
  }
  return all;
}
