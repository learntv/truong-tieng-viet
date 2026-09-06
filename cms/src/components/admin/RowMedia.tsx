'use client'

import { useConfig, useFormFields } from '@payloadcms/ui'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Resolves the media behind the hình ids in one chặng, in a single request, and hands the
 * results down to the bài rows that need them.
 *
 * Form state holds an upload field as a media **id**, not a URL, so a row that wants to show
 * its first hình has to look the document up. Doing that per row would mean roughly forty
 * requests on opening a chặng. Instead this provider watches form state for every hình id
 * under one chặng and issues one `GET /api/media?where[id][in]=…`, the same scoped-REST shape
 * ChuDeGrid already uses.
 *
 * Scoping to a chặng is free: ChangTabs mounts only the active panel, so the provider is
 * mounted per chặng and switching tabs remounts it against the new prefix. Form state itself
 * covers the whole document, which is why the prefix filter below is what does the scoping.
 */

export type ResolvedMedia = {
  filename?: null | string
  id: number | string
  mimeType?: null | string
  url?: null | string
}

/** Shared empty result, so "nothing resolved" is a stable reference across renders. */
const EMPTY: Map<string, ResolvedMedia> = new Map()

const MediaContext = createContext<Map<string, ResolvedMedia>>(EMPTY)

/**
 * The media document behind an upload value, or undefined while it is still loading, if the
 * id resolves to nothing, or if the request failed. Callers must render without it — a row
 * whose image cannot be fetched still shows its name, caption and markers.
 */
export const useResolvedMedia = (value: unknown): ResolvedMedia | undefined => {
  const resolved = useContext(MediaContext)
  if (typeof value === 'number' || typeof value === 'string') return resolved.get(String(value))
  // Already populated — a fetched document rather than live form state.
  if (value && typeof value === 'object' && 'url' in value) return value as ResolvedMedia
  return undefined
}

// `<chặng path>.noiDungs.3.bais.7.hinhs.0.image`, with the chặng path already stripped off.
const HINH_IMAGE_PATH = /^noiDungs\.\d+\.bais\.\d+\.hinhs\.\d+\.image$/

type Props = {
  readonly children: React.ReactNode
  /** Form-state path of the chặng whose rows are mounted, e.g. `changs.2`. */
  readonly pathPrefix: string
}

export const RowMediaProvider: React.FC<Props> = ({ children, pathPrefix }) => {
  const {
    config: {
      routes: { api: apiRoute },
      serverURL,
    },
  } = useConfig()

  // A sorted, comma-joined string rather than an array: useFormFields re-runs this selector on
  // every keystroke anywhere in the document, and a primitive lets React skip the re-render
  // unless the set of ids actually changed.
  const idsKey = useFormFields(([fields]) => {
    const ids = new Set<string>()

    for (const [fieldPath, field] of Object.entries(fields ?? {})) {
      if (!fieldPath.startsWith(`${pathPrefix}.`)) continue
      if (!HINH_IMAGE_PATH.test(fieldPath.slice(pathPrefix.length + 1))) continue

      const value = field?.value
      if (typeof value === 'number' || typeof value === 'string') ids.add(String(value))
    }

    return Array.from(ids).sort().join(',')
  })

  const [resolved, setResolved] = useState<Map<string, ResolvedMedia>>(new Map())

  useEffect(() => {
    // Nothing to resolve. The empty case is derived at render rather than written into state
    // here — clearing state synchronously inside an effect just schedules a second render to
    // undo the first one.
    if (!idsKey) return

    const ids = idsKey.split(',')
    const controller = new AbortController()
    const query = new URLSearchParams({
      depth: '0',
      limit: String(ids.length),
      // Only the three columns a row thumbnail needs; `alt` and the rest stay on the server.
      'select[filename]': 'true',
      'select[mimeType]': 'true',
      'select[url]': 'true',
      'where[id][in]': idsKey,
    })

    fetch(`${serverURL || ''}${apiRoute}/media?${query}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { docs?: ResolvedMedia[] }) => {
        setResolved(new Map((data.docs ?? []).map((doc) => [String(doc.id), doc])))
      })
      .catch(() => {
        // Deliberately silent. A row that cannot resolve its hình falls back to its name,
        // caption and markers; a banner over the editor would be a worse trade for an image
        // that failed to load.
      })

    return () => controller.abort()
  }, [apiRoute, idsKey, serverURL])

  // Whatever the last request resolved, but only while there is something to resolve: with no
  // hình ids under this chặng the answer is "nothing", not "the previous chặng's media".
  const value = useMemo(() => (idsKey ? resolved : EMPTY), [idsKey, resolved])

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
}
