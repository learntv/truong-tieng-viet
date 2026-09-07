/**
 * The colours a lesson author can pick from.
 *
 * A fixed palette rather than a free colour picker, and hex literals rather than CSS variables.
 * Both for the same reason: what is chosen here is written into the lesson's stored content and
 * rendered on the public site, so it has to be a value that still means something outside this
 * admin panel, and it has to be one of a small set the lessons can share — a teacher reaching for
 * "the green" three lessons apart should get the same green both times.
 *
 * The values are the public site's own tokens (src/styles.css), resolved to sRGB. Text colours are
 * the steps that clear 4.5:1 on white; highlights are the soft tints, which are light enough that
 * ordinary body ink stays readable on top of them.
 */

export type Swatch = {
  /** Vietnamese name, shown as the swatch's tooltip and accessible name. */
  label: string
  /** The CSS colour written into the node's `style`. */
  value: string
}

export const TEXT_COLORS: Swatch[] = [
  { label: 'Đen', value: '#1c293f' },
  { label: 'Xám', value: '#626975' },
  { label: 'Đỏ', value: '#cc0000' },
  { label: 'Đỏ đậm', value: '#a30000' },
  { label: 'Cam', value: '#8e3d00' },
  { label: 'Xanh lá', value: '#267b4c' },
  { label: 'Xanh dương', value: '#287aa3' },
  { label: 'Tím', value: '#7457a3' },
  { label: 'Hồng', value: '#8e3642' },
]

export const HIGHLIGHT_COLORS: Swatch[] = [
  { label: 'Vàng', value: '#fff3b0' },
  { label: 'Cam nhạt', value: '#ffe5ca' },
  { label: 'Xanh lá nhạt', value: '#d7f4e0' },
  { label: 'Xanh dương nhạt', value: '#d9effd' },
  { label: 'Tím nhạt', value: '#eee6ff' },
  { label: 'Hồng nhạt', value: '#fff2f0' },
  { label: 'Xám nhạt', value: '#eff2f6' },
]
