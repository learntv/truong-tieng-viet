'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'

import { JsonViewButton } from './JsonViewButton'

/**
 * Fixed toolbar only, and last in the row: it is a debugging window onto the stored shape of the
 * content, not an editing tool, so it has no business appearing in the inline toolbar that pops up
 * over a selection.
 */
export const JsonViewFeatureClient = createClientFeature({
  toolbarFixed: {
    groups: [
      {
        items: [{ Component: JsonViewButton, key: 'jsonView' }],
        key: 'jsonView',
        order: 100,
        type: 'buttons',
      },
    ],
  },
})
