import type { Block } from 'payload'

import { TEXT_COLORS } from '@/features/text-color/palette'

// The colour a part is drawn in when the editor hasn't picked one. Black rather than the red the
// first part usually gets — see the `parts` defaultValue below, which seeds that instead.
const INK = '#1c293f'

// One "đánh vần" diagram: the pieces of a syllable across the top, the whole syllable in a wider
// box below them. The classic đ + a → đa drill, drawn the way it appears on the board.
//
// The parts are an array rather than a fixed âm đầu/vần pair (SyllableChain.ts already covers that
// shape) because the same diagram is used for two-, three- and four-way breakdowns depending on
// what the lesson is teaching. Each part carries its own colour so a lesson can put the sound
// being taught in red and leave the rest black, which is the whole point of the diagram.
//
// Rendered in the admin editor as the diagram itself (see SyllableBlendBlock.tsx), embeddable
// inline in a FreeText section like VocabularyCard.ts and SyllableChain.ts.
export const SyllableBlend: Block = {
  slug: 'syllableBlend',
  labels: { singular: 'Đánh vần', plural: 'Đánh vần' },
  admin: {
    disableBlockName: true,
    components: {
      Block: '@/components/admin/blocks/SyllableBlendBlock#SyllableBlendBlock',
    },
  },
  fields: [
    {
      name: 'parts',
      type: 'array',
      label: 'Các phần',
      minRows: 2,
      maxRows: 6,
      // Two rows, the first already red: the two-part red-then-black breakdown is what nearly
      // every one of these diagrams is, so an inserted block starts as a filled-in example
      // rather than an empty array the editor has to build up.
      defaultValue: [{ color: '#cc0000' }, { color: INK }],
      fields: [
        { name: 'text', type: 'text', required: true, label: 'Chữ' },
        {
          name: 'color',
          type: 'select',
          label: 'Màu',
          required: true,
          defaultValue: INK,
          // The same palette the rich text colour picker offers, so a syllable coloured inside a
          // diagram and the same syllable coloured in a sentence are the same red.
          options: TEXT_COLORS.map(({ label, value }) => ({ label, value })),
        },
      ],
    },
    {
      name: 'result',
      type: 'text',
      required: true,
      label: 'Tiếng',
      // Kept in step with `parts` by the editor component until an editor types something else
      // into it — "đ" + "a" writes "đ a" here, but a lesson blending to "đá" can say so.
      admin: { placeholder: 'đ a' },
    },
  ],
}
