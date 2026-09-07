'use client'

import React from 'react'

/**
 * Miniature, non-interactive renderings of the KMD lesson blocks, used as the icon of their
 * entries in the insert menus (see ./index.tsx).
 *
 * These are deliberately hand-written markup rather than the real block components: the real ones
 * (SyllableChainBlock.tsx and friends) are form editors bound to a Payload block form context that
 * does not exist inside a toolbar dropdown, and they would be the wrong size anyway. What matters
 * in a menu is that the shape and the colours match what gets inserted — the orange-bordered
 * tiếng box, the two greens of the đánh vần diagram, the tinted flashcard — so an editor picks by
 * recognising the diagram rather than by reading the label.
 *
 * The example content is the same one each block seeds itself with (đ + a, d → a → dạ), so the
 * preview reads as a picture of the block one click later.
 */

const ChainPreview: React.FC = () => (
  <span aria-hidden className="kmd-block-preview kmd-block-preview--chain">
    <span className="kmd-block-preview__cell">d</span>
    <span className="kmd-block-preview__arrow">→</span>
    <span className="kmd-block-preview__cell">a</span>
    <span className="kmd-block-preview__arrow">→</span>
    <span className="kmd-block-preview__cell kmd-block-preview__cell--tone">Nặng</span>
    <span className="kmd-block-preview__arrow">→</span>
    <span className="kmd-block-preview__cell kmd-block-preview__cell--result">dạ</span>
  </span>
)

const BlendPreview: React.FC = () => (
  <span aria-hidden className="kmd-block-preview kmd-block-preview--blend">
    <span className="kmd-block-preview__parts">
      <span className="kmd-block-preview__part kmd-block-preview__part--accent">đ</span>
      <span className="kmd-block-preview__part">a</span>
    </span>
    <span className="kmd-block-preview__blendResult">đ a</span>
  </span>
)

const VocabularyPreview: React.FC = () => (
  <span aria-hidden className="kmd-block-preview kmd-block-preview--vocab">
    <span className="kmd-block-preview__thumb" />
    <span className="kmd-block-preview__lines">
      <span className="kmd-block-preview__word">Từ</span>
      <span className="kmd-block-preview__meaning">Nghĩa của từ</span>
      <span className="kmd-block-preview__example">Đặt câu ví dụ…</span>
    </span>
  </span>
)

/**
 * Keyed by block slug. A block missing from here keeps whatever icon Payload gave it, so adding a
 * block to FreeText.ts without a preview degrades to the old menu entry rather than breaking.
 */
export const BLOCK_PREVIEWS: Record<string, React.FC> = {
  syllableBlend: BlendPreview,
  syllableChain: ChainPreview,
  vocabularyCard: VocabularyPreview,
}
