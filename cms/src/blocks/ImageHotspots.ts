import type { Block } from 'payload'

// A lesson picture, optionally with boxes drawn on it that speak when tapped: the editor drags out a box over part
// of the image, types what it should say, and a student tapping that spot hears it read aloud
// through the site's TTS (src/lib/tts, /api/tts).
//
// Only the text is stored, never audio: /api/tts is content-addressed, so the first tap
// synthesizes and caches the clip and every tap after that is a CDN hit. Editing the text is
// simply a new clip.
//
// Boxes are stored as percentages of the image rather than pixels, so they stay over the same
// part of the picture at whatever width the image ends up drawn.
//
// `hotspots` is a json field rather than an `array`: the boxes are edited by dragging on the
// picture (ImageHotspotsBlock.tsx), never as a row-per-box form, and a plain value is one
// setValue per drag instead of juggling Payload's per-row form state. The block lives inside a
// rich text field's JSON anyway, so an array would buy no database columns either.
export type Hotspot = { h: number; id: string; text: string; w: number; x: number; y: number }

const isHotspot = (value: unknown): value is Hotspot => {
  if (!value || typeof value !== 'object') return false
  const { h, id, text, w, x, y } = value as Record<string, unknown>
  return (
    typeof id === 'string' &&
    typeof text === 'string' &&
    [x, y, w, h].every((n) => typeof n === 'number' && n >= 0 && n <= 100)
  )
}

export const ImageHotspots: Block = {
  slug: 'imageHotspots',
  // Just "Hình ảnh": this is the lesson editor's only image (FreeText.ts drops Payload's plain
  // upload node), and a picture with no boxes drawn on it is simply a picture.
  labels: { singular: 'Hình ảnh', plural: 'Hình ảnh' },
  admin: {
    disableBlockName: true,
    components: {
      Block: '@/components/admin/blocks/ImageHotspotsBlock#ImageHotspotsBlock',
    },
  },
  fields: [
    {
      // Named `image` like VocabularyCard's, so the section rail's miniatures populate it the
      // same way (components/admin/kmd/useMediaPopulated.ts looks for `fields.image`).
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Hình ảnh',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: { className: 'image-hotspots-field--image' },
    },
    {
      name: 'hotspots',
      type: 'json',
      label: 'Vùng bấm',
      defaultValue: [],
      validate: (value: unknown) => {
        if (value == null) return true
        if (!Array.isArray(value) || !value.every(isHotspot)) return 'Vùng bấm không hợp lệ.'
        if (value.some((spot) => spot.text.trim() === '')) return 'Mỗi vùng bấm cần có chữ để đọc.'
        return true
      },
    },
  ],
}
