'use client'

import { BlocksFeatureClient } from '@payloadcms/richtext-lexical/client'
import type React from 'react'

import { BLOCK_PREVIEWS } from './previews'
import { StickyDropdownPlugin } from './StickyDropdownPlugin'

/**
 * Client half of KmdBlocksFeature (see ../index.ts) — Payload's own blocks feature with one thing
 * changed: the entries for our lesson blocks in the insert menus show a miniature of the block
 * instead of the generic block glyph.
 *
 * It wraps `BlocksFeatureClient` rather than re-declaring a blocks group of its own because
 * everything else those entries need — resolving the client block configs out of the schema map,
 * the insert commands, the nodes, the markdown transformers — is that feature's work, and a second
 * group under the same `blocks` key would be concatenated onto Payload's, not replace it (see
 * sanitizeClientFeatures). So we let it build the groups and rewrite the icon of each item whose
 * slug we have a preview for; anything else passes through untouched.
 *
 * It also carries StickyDropdownPlugin, which keeps an open toolbar dropdown anchored to its
 * button while the lesson scrolls — see there for why that isn't a blocks-specific concern.
 */

// Both menus name their block entries `block-<slug>`; inline-block entries use a different prefix
// and are left alone (this editor has none).
const BLOCK_KEY_PREFIX = 'block-'

const previewFor = (itemKey: string): React.FC | undefined =>
  itemKey.startsWith(BLOCK_KEY_PREFIX)
    ? BLOCK_PREVIEWS[itemKey.slice(BLOCK_KEY_PREFIX.length)]
    : undefined

export const KmdBlocksFeatureClient: typeof BlocksFeatureClient = (props) => {
  const provider = BlocksFeatureClient(props)
  const baseFeature = provider.feature

  if (typeof baseFeature !== 'function') return provider

  return {
    ...provider,
    feature: (args) => {
      const feature = baseFeature(args)

      return {
        ...feature,
        // Payload's blocks feature ships the BlocksPlugin; ours is appended, not swapped in.
        plugins: [
          ...(feature.plugins ?? []),
          { Component: StickyDropdownPlugin, position: 'normal' as const },
        ],
        slashMenu: feature.slashMenu && {
          ...feature.slashMenu,
          groups: feature.slashMenu.groups?.map((group) => ({
            ...group,
            items: group.items?.map((item) => {
              const Preview = previewFor(item.key)
              return Preview ? { ...item, Icon: Preview } : item
            }),
          })),
        },
        toolbarFixed: feature.toolbarFixed && {
          ...feature.toolbarFixed,
          groups: feature.toolbarFixed.groups?.map((group) => ({
            ...group,
            items: group.items?.map((item) => {
              const Preview = previewFor(item.key)
              return Preview ? { ...item, ChildComponent: Preview } : item
            }),
          })),
        },
      }
    },
  }
}
