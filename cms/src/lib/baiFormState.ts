/**
 * Reading bài out of Payload's live form state.
 *
 * Payload keeps a form as a flat map from field path to field — `changs.0.noiDungs.1.bais.2`
 * is not an object anywhere, it is a prefix shared by a handful of keys. The admin components
 * need whole bài to hand to the predicate in `baiContent`, and they need them from *live*
 * state rather than the saved document, because the spec requires the empty marker and the
 * counts to update before the document is saved.
 *
 * So this module does one job: turn a slice of that flat map back into the plain objects
 * `baiContent` understands. The rules for what counts as content stay over there — this file
 * never decides whether a bài is empty.
 */

import { isBaiEmpty, type BaiLike } from './baiContent'

/** Payload's form state, as far as this module cares. */
export type FormFields = Record<string, { value?: unknown } | undefined>

// The part of a field path below a bài: `hinhs.0.image`, `meta.audio`, `meta.videoUrl`,
// `meta.link`. Anything else about a bài — its title, the captions under a hình — has no
// bearing on whether it holds content.
const HINH_IMAGE = /^hinhs\.(\d+)\.image$/
const META_FIELDS = new Set(['meta.audio', 'meta.link', 'meta.videoUrl'])

// A bài path relative to a chặng (`noiDungs.3.bais.7.…`) and relative to the whole `changs`
// array (`2.noiDungs.3.bais.7.…`). Both capture the bài and, for the second, its chặng.
const BAI_IN_CHANG = /^(noiDungs\.\d+\.bais\.\d+)\.(.+)$/
const BAI_IN_ARRAY = /^(\d+)\.(noiDungs\.\d+\.bais\.\d+)\.(.+)$/

/** Records one field of a bài onto the object being rebuilt, ignoring anything irrelevant. */
const applyField = (bai: BaiLike, suffix: string, value: unknown): void => {
  const hinh = HINH_IMAGE.exec(suffix)
  if (hinh) {
    // Indexed rather than pushed: form state is a map, so the keys arrive in no particular
    // order, and a hình's position matters — the row shows the *first* one.
    ;(bai.hinhs ??= [])[Number(hinh[1])] = { image: value }
    return
  }

  if (META_FIELDS.has(suffix)) {
    ;(bai.meta ??= {})[suffix.slice('meta.'.length) as 'audio' | 'link' | 'videoUrl'] = value
  }
}

/**
 * The bài at `baiPath`, as a plain object the predicate can read. Absent fields simply stay
 * absent, which is what an untouched bài looks like in a saved document too.
 */
export const readBai = (fields: FormFields, baiPath: string): BaiLike => {
  const bai: BaiLike = {}

  for (const [fieldPath, field] of Object.entries(fields ?? {})) {
    if (!fieldPath.startsWith(`${baiPath}.`)) continue
    applyField(bai, fieldPath.slice(baiPath.length + 1), field?.value)
  }

  return bai
}

// A field path below a `bais` array itself: `7.meta.audio`, `7.hinhs.0.image`.
const BAI_IN_LIST = /^(\d+)\.(.+)$/

/**
 * Every bài in one `bais` array, keyed by its index — in one pass over form state.
 *
 * The flat-row list needs all of its rows judged on every keystroke anywhere in the document,
 * because that is what makes the empty marker clear before the document is saved. Asking per
 * row would walk the whole form once per row; this walks it once for the list.
 */
export const readBaisInArray = (fields: FormFields, arrayPath: string): Map<number, BaiLike> => {
  const bais = new Map<number, BaiLike>()

  for (const [fieldPath, field] of Object.entries(fields ?? {})) {
    if (!fieldPath.startsWith(`${arrayPath}.`)) continue

    const match = BAI_IN_LIST.exec(fieldPath.slice(arrayPath.length + 1))
    if (!match) continue

    const rowIndex = Number(match[1])
    let bai = bais.get(rowIndex)
    if (!bai) bais.set(rowIndex, (bai = {}))
    applyField(bai, match[2], field?.value)
  }

  return bais
}

/** Every bài under one chặng, keyed by its path — in one pass over form state. */
export const readBaisUnder = (fields: FormFields, changPath: string): Map<string, BaiLike> => {
  const bais = new Map<string, BaiLike>()

  for (const [fieldPath, field] of Object.entries(fields ?? {})) {
    if (!fieldPath.startsWith(`${changPath}.`)) continue

    const match = BAI_IN_CHANG.exec(fieldPath.slice(changPath.length + 1))
    if (!match) continue

    const baiPath = `${changPath}.${match[1]}`
    let bai = bais.get(baiPath)
    if (!bai) bais.set(baiPath, (bai = {}))
    applyField(bai, match[2], field?.value)
  }

  return bais
}

/** How many bài anywhere under `changPath` hold nothing. */
export const countEmptyBaiUnder = (fields: FormFields, changPath: string): number => {
  let empty = 0
  for (const bai of readBaisUnder(fields, changPath).values()) {
    if (isBaiEmpty(bai)) empty += 1
  }
  return empty
}

/**
 * The empty-bài count for every chặng in the `changs` array at `arrayPath`, indexed by chặng.
 *
 * One pass over form state for the whole array rather than one per chặng: the tab bar wants
 * all of them at once, and this runs inside a `useFormFields` selector that Payload re-runs
 * on every keystroke anywhere in the document.
 */
export const countEmptyBaiPerChang = (
  fields: FormFields,
  arrayPath: string,
  changCount: number,
): number[] => {
  const bais = new Map<string, { bai: BaiLike; changIndex: number }>()

  for (const [fieldPath, field] of Object.entries(fields ?? {})) {
    if (!fieldPath.startsWith(`${arrayPath}.`)) continue

    const match = BAI_IN_ARRAY.exec(fieldPath.slice(arrayPath.length + 1))
    if (!match) continue

    const [, changIndex, baiPath, suffix] = match
    const key = `${changIndex}.${baiPath}`
    let entry = bais.get(key)
    if (!entry) bais.set(key, (entry = { bai: {}, changIndex: Number(changIndex) }))
    applyField(entry.bai, suffix, field?.value)
  }

  const counts = new Array<number>(changCount).fill(0)
  for (const { bai, changIndex } of bais.values()) {
    if (changIndex < changCount && isBaiEmpty(bai)) counts[changIndex] += 1
  }
  return counts
}
