// Tracks which letters a child has opened in /hoc-tap/bang-chu-cai.
// Stored in localStorage only, same pattern as speaking-progress.ts.

export type AlphabetProgress = Record<string, true>;

const STORAGE_KEY = "vui-hoc-bang-chu-cai";

export function loadAlphabetProgress(): AlphabetProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as AlphabetProgress;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function markLetterSeen(id: string): AlphabetProgress {
  const all = loadAlphabetProgress();
  all[id] = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // localStorage unavailable (private browsing, quota) — progress just doesn't persist.
  }
  return all;
}
