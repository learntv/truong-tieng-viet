/**
 * One definition of "this bài holds nothing", shared by everything that reports it.
 *
 * Three surfaces answer this question — the marker on a bài's row, the count on a chặng tab,
 * and the count on a chủ đề card — and two of them run in the browser against unsaved form
 * state while the third runs on the server against stored documents. If each computed it for
 * itself they would eventually disagree, and a marker that sometimes means something else is
 * worse than no marker. So: one pure function, no I/O, no Payload imports, callable from both
 * sides.
 */

/**
 * The subset of a bài this module reads. Deliberately structural rather than
 * `payload-types`' `ChuDe['changs'][n]['noiDungs'][n]['bais'][n]`: live form state holds
 * uploads as bare ids where a fetched document holds the populated media object, and both
 * have to be judged by the same rules.
 */
export type BaiLike = {
  hinhs?: null | { image?: unknown }[]
  meta?: {
    audio?: unknown
    link?: unknown
    videoUrl?: unknown
  } | null
}

/**
 * True when the value is a media reference of some kind. An upload field is an id in form
 * state, a populated document once Payload has resolved it, and `null` / `undefined` / `''`
 * when nothing is attached. Whether the file behind the id can actually be *fetched* is not
 * part of this: a hình whose image 404s is still a hình the teacher put there, and marking
 * that bài empty would send them looking for content that already exists.
 */
const isAttached = (value: unknown): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'number') return true
  if (typeof value === 'string') return value.length > 0
  if (typeof value === 'object') return true
  return false
}

/** True when a text attachment holds a URL rather than an empty or blank string. */
const isFilledText = (value: unknown): boolean => typeof value === 'string' && value.trim().length > 0

/**
 * True when the bài holds at least one hình the student would see.
 *
 * A row with no `image` set does not count. `image` is `required`, so such a row can only
 * exist transiently in form state — the moment after "add hình" and before the upload lands —
 * and treating that as content would clear the marker before anything was actually added.
 */
export const hasHinh = (bai: BaiLike): boolean =>
  (bai.hinhs ?? []).some((hinh) => isAttached(hinh?.image))

/**
 * The three meta attachments, each asked separately — the row markers show one per attachment
 * that is set, and they have to agree with the predicate about what "set" means.
 */
export const hasAudio = (bai: BaiLike): boolean => isAttached(bai.meta?.audio)
export const hasVideo = (bai: BaiLike): boolean => isFilledText(bai.meta?.videoUrl)
export const hasLink = (bai: BaiLike): boolean => isFilledText(bai.meta?.link)

/** True when the bài has any of the three meta attachments set. */
export const hasMetaAttachment = (bai: BaiLike): boolean =>
  hasAudio(bai) || hasVideo(bai) || hasLink(bai)

/**
 * A bài is empty when it holds nothing a student could use: no hình, and no audio, video or
 * link. Any one of those makes it non-empty, whatever else it lacks — a bài with only a link
 * is unfinished in some other sense, but that is not the condition this reports.
 */
export const isBaiEmpty = (bai: BaiLike): boolean => !hasHinh(bai) && !hasMetaAttachment(bai)

/** The shape of a chủ đề as far as counting empty bài is concerned. */
export type ChangLike = {
  noiDungs?: null | { bais?: BaiLike[] | null }[]
}

/** Every bài inside a chặng, flattened out of its nội dung. */
export const baisInChang = (chang: ChangLike | null | undefined): BaiLike[] =>
  (chang?.noiDungs ?? []).flatMap((noiDung) => noiDung?.bais ?? [])

/** How many bài anywhere inside this chặng hold nothing. */
export const countEmptyBaiInChang = (chang: ChangLike | null | undefined): number =>
  baisInChang(chang).filter(isBaiEmpty).length

/** How many bài anywhere inside this chủ đề hold nothing. */
export const countEmptyBaiInChuDe = (chuDe: { changs?: ChangLike[] | null } | null | undefined): number =>
  (chuDe?.changs ?? []).reduce((total, chang) => total + countEmptyBaiInChang(chang), 0)
