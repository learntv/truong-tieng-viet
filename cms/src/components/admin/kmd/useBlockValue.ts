'use client'

import { useFormFields } from '@payloadcms/ui'
import { useMemo } from 'react'

import { readBlockValue } from './blockFormState'

/**
 * A block's own sibling values, read live from form state, for a `ui` field that is that
 * block's last field. The `ui` field's own `path` is `<blockPath>.<uiFieldName>` — one segment
 * past the block itself — so the block's path is that path minus its final segment (see
 * design.md — "Previews are `ui` fields inside each block, not `afterInput`").
 *
 * Serialized to a string because `useFormFields`'s selector re-runs on every keystroke anywhere
 * in the document; a primitive lets React skip the re-render unless this block's own values
 * actually changed, the same trick `ChangTabs` and `BaiList` use for their per-row state.
 */
export const useBlockValue = <T extends Record<string, unknown>>(previewFieldPath: string): T => {
  const blockPath = useMemo(
    () => previewFieldPath.split('.').slice(0, -1).join('.'),
    [previewFieldPath],
  )

  const signature = useFormFields(([fields]) => JSON.stringify(readBlockValue(fields, blockPath)))

  return useMemo(() => JSON.parse(signature) as T, [signature])
}
