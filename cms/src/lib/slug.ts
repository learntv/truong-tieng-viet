// Derives a URL-safe slug from a lesson title: lowercase, Vietnamese diacritics folded to plain
// ASCII (d/D handled separately from NFD decomposition — they are their own Unicode letters, not
// a base letter plus a combining mark like the rest of the diacritics), and everything that isn't
// a letter or digit collapsed to a single hyphen.
//
// Used by BaiKMD.ts's `beforeValidate` hook to fill a blank slug from the title — see the
// collection's own comment for why this only ever fills, never re-derives.
const D_WITH_STROKE_LOWER = /đ/g // đ
const D_WITH_STROKE_UPPER = /Đ/g // Đ
const COMBINING_MARKS = /[\u0300-\u036f]/g

export function deriveSlug(title: string): string {
  return title
    .replace(D_WITH_STROKE_LOWER, 'd')
    .replace(D_WITH_STROKE_UPPER, 'D')
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
