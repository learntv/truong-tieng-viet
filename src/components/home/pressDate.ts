import { getLocale } from "@/paraglide/runtime";

/**
 * A press item's date. Vietnamese keeps the papers' own day-first dateline,
 * "2026-09-07" → "07-09-2026"; English spells the month out, since a bare
 * 07-09 reads as July to an American eye.
 */
export function formatPressDate(iso: string) {
  if (getLocale() === "vi") return iso.split("-").reverse().join("-");
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
