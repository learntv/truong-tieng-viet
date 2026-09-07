'use client'

import type { ToolbarGroupItem } from '@payloadcms/richtext-lexical'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import React from 'react'

import { HIGHLIGHT_COLORS, TEXT_COLORS } from '../palette'
import { ColorPicker } from './ColorPicker'

const TextColorIcon: React.FC = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
    <path
      d="M8 2.5 4.2 12h1.7l.85-2.2h4.5L12.1 12h1.7L10 2.5H8Zm-.7 5.8L8.9 4.2l1.6 4.1h-3.2Z"
      fill="currentColor"
    />
  </svg>
)

const HighlightIcon: React.FC = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
    <path
      d="M9.9 2.3 4.4 7.8a1 1 0 0 0-.28.55L3.7 11l2.65-.42a1 1 0 0 0 .55-.28l5.5-5.5-2.5-2.5Zm1.06-1.06 2.5 2.5.7-.7a1.77 1.77 0 0 0-2.5-2.5l-.7.7Z"
      fill="currentColor"
    />
  </svg>
)

const items: ToolbarGroupItem[] = [
  {
    Component: () => (
      <ColorPicker
        clearLabel="Màu mặc định"
        Icon={TextColorIcon}
        property="color"
        swatches={TEXT_COLORS}
        title="Màu chữ"
      />
    ),
    key: 'textColor',
  },
  {
    Component: () => (
      <ColorPicker
        clearLabel="Không tô"
        Icon={HighlightIcon}
        property="background-color"
        swatches={HIGHLIGHT_COLORS}
        title="Màu nền chữ"
      />
    ),
    key: 'textBackgroundColor',
  },
]

// Sits immediately after the bold/italic format group (order 40) and before the link/upload
// buttons (order 50) — where the same pair of controls sits in every other editor an author has
// used.
const group = { items, key: 'textColor', order: 45, type: 'buttons' as const }

/**
 * Text colour and highlight for the lesson editor.
 *
 * Registered on both toolbars: the fixed one is where an author about to type reaches, the inline
 * one is where an author who has just selected a word reaches. It is the same control either way —
 * the picker reads and writes whatever the selection currently is.
 */
export const TextColorFeatureClient = createClientFeature({
  toolbarFixed: { groups: [group] },
  toolbarInline: { groups: [group] },
})
