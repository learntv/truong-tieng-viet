/**
 * The six Vietnamese tones, in the order they are taught.
 *
 * `label` is what the editor picks from — the tone's name with its mark in brackets, which is how
 * the select has to read when the mark alone is a bare combining character.
 *
 * The rendered "tạo tiếng" chain (see `Lesson.tsx` / `lessonConverters.tsx`) draws the mark itself
 * as a small SVG rather than any text form of it — see `ToneMarkIcon.tsx`, keyed on `value`.
 *
 * The single home for this list — the CMS's `dauThanh` select (`cms/src/blocks/SyllableChain.ts`)
 * imports it back, so the admin form and the rendered chain cannot drift from each other.
 */
export const TONES = [
  { label: "Ngang", value: "ngang" },
  { label: "Huyền ( ` )", value: "huyen" },
  { label: "Sắc ( ́ )", value: "sac" },
  { label: "Hỏi ( ̉ )", value: "hoi" },
  { label: "Ngã ( ~ )", value: "nga" },
  { label: "Nặng ( . )", value: "nang" },
] as const;

export type ToneValue = (typeof TONES)[number]["value"];
