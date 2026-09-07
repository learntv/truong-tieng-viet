import type { Block } from 'payload'

import { TONES } from '@ttv/lesson-render/tones'

// TONES now lives in the shared package (packages/lesson-render/src/tones.ts) so the rendered
// chain cannot drift from this select's stored values — see that file's own comment. Re-exported
// here so nothing outside this file has to know it moved.
//
// Imported from the package's `./tones` subpath rather than its main entry: the main entry also
// exports `Lesson`, which pulls in `RichText` and CSS modules — fine for a bundler, but this file
// is also loaded by `payload generate:types`, which runs under plain Node/tsx and cannot resolve
// a `.css` import.
export { TONES }
export type { ToneValue } from '@ttv/lesson-render/tones'

// One "âm đầu + vần + dấu thanh → tiếng" chain — a single row, not a repeatable list. An editor
// wanting a second chain (e.g. another example under the same "Hãy tạo tiếng có âm d" prompt)
// drops in another SyllableChain block rather than adding a row to this one; the prompt itself
// is just the surrounding FreeText paragraph, not a field here.
//
// Rendered in the admin editor as an actual chain of boxes with arrows (see
// SyllableChainBlock.tsx), embeddable inline in a FreeText section like VocabularyCard.ts.
export const SyllableChain: Block = {
  slug: 'syllableChain',
  labels: { singular: 'Tạo tiếng', plural: 'Tạo tiếng' },
  admin: {
    disableBlockName: true,
    components: {
      Block: '@/components/admin/blocks/SyllableChainBlock#SyllableChainBlock',
    },
  },
  fields: [
    {
      name: 'amDau',
      type: 'text',
      label: 'Âm đầu',
      admin: {
        className: 'syllable-chain-cell syllable-chain-cell--amDau',
        placeholder: 'd',
      },
    },
    {
      name: 'van',
      type: 'text',
      required: true,
      label: 'Vần',
      admin: { className: 'syllable-chain-cell syllable-chain-cell--van', placeholder: 'a' },
    },
    {
      name: 'dauThanh',
      type: 'select',
      label: 'Dấu thanh',
      required: true,
      defaultValue: 'ngang',
      // A closed set, unlike amDau/van/tieng, whose actual syllables can't be enumerated — so a
      // select is correct here where free text was a guess everywhere else in the chain.
      options: TONES.map(({ label, value }) => ({ label, value })),
      admin: {
        // Always has a value (required + defaultValue), so the clear (×) button react-select
        // shows by default would only ever produce an invalid empty state — off entirely.
        isClearable: false,
        className: 'syllable-chain-cell syllable-chain-cell--dauThanh',
      },
    },
    {
      name: 'tieng',
      type: 'text',
      required: true,
      label: 'Tiếng',
      admin: {
        className: 'syllable-chain-cell syllable-chain-cell--tieng',
        placeholder: 'dạ',
      },
    },
  ],
}
