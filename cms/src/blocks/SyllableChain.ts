import type { Block } from 'payload'

/**
 * The six Vietnamese tones, in the order they are taught.
 *
 * `label` is what the editor picks from — the tone's name with its mark in brackets, which is how
 * the select has to read when the mark alone is a bare combining character. `display` is what a
 * reader sees in the rendered chain (see components/preview), where the box is a step in
 * "âm đầu + vần + dấu thanh → tiếng" and wants the phrase a teacher would say out loud.
 *
 * Exported so the preview cannot drift from the stored values: these six strings are the closed
 * set the `dauThanh` field validates against.
 */
export const TONES = [
  { display: 'thanh ngang', label: 'Ngang', value: 'ngang' },
  { display: 'dấu huyền', label: 'Huyền ( ` )', value: 'huyen' },
  { display: 'dấu sắc', label: 'Sắc ( ́ )', value: 'sac' },
  { display: 'dấu hỏi', label: 'Hỏi ( ̉ )', value: 'hoi' },
  { display: 'dấu ngã', label: 'Ngã ( ~ )', value: 'nga' },
  { display: 'dấu nặng', label: 'Nặng ( . )', value: 'nang' },
] as const

export type ToneValue = (typeof TONES)[number]['value']

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
