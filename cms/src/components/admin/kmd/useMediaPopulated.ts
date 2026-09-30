'use client'

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { useConfig } from '@payloadcms/ui'
import { useEffect, useMemo, useState } from 'react'

type MediaDoc = { id: number | string; url?: null | string } & Record<string, unknown>
type Node = { [key: string]: unknown; children?: Node[] }

/**
 * In the form, a rich-text image (an `upload` node) and a thẻ từ vựng's picture (a block's
 * `fields.image`) are stored as bare media ids — the editor fetches the document itself when it
 * draws them. `lessonConverters` renders from populated documents, the way the saved lesson
 * arrives at `depth: 2`, and draws nothing for an id. So the rail's miniatures fetch those
 * documents and swap them in before rendering.
 *
 * Shared across every thumbnail on the page: a lesson reuses the same few pictures, and an image
 * does not change under the editor, so each id is fetched once.
 */
const cache = new Map<string, MediaDoc>()
// One request per id however many thumbnails show it; each of them waits on the same promise.
const pending = new Map<string, Promise<void>>()

const fetchMedia = (ids: string[], baseURL: string): Promise<void> => {
  const params = new URLSearchParams({ depth: '0', limit: String(ids.length) })
  ids.forEach((id, index) => params.append(`where[id][in][${index}]`, id))

  const request = fetch(`${baseURL}/media?${params}`, { credentials: 'include' })
    .then((res) => (res.ok ? res.json() : { docs: [] }))
    .then(({ docs }: { docs: MediaDoc[] }) => {
      docs.forEach((doc) => cache.set(String(doc.id), doc))
    })
    .catch(() => {})
    .finally(() => ids.forEach((id) => pending.delete(id)))

  ids.forEach((id) => pending.set(id, request))
  return request
}

const unresolvedId = (value: unknown): null | string => {
  if (typeof value === 'number' || typeof value === 'string') return String(value)
  if (value && typeof value === 'object' && !('url' in value) && 'id' in value) {
    return String((value as { id: unknown }).id)
  }
  return null
}

const collectIds = (node: Node, ids: Set<string>) => {
  if (node.type === 'upload' && node.relationTo === 'media') {
    const id = unresolvedId(node.value)
    if (id) ids.add(id)
  }
  const fields = node.fields as Record<string, unknown> | undefined
  if ((node.type === 'block' || node.type === 'inlineBlock') && fields) {
    const id = unresolvedId(fields.image)
    if (id) ids.add(id)
  }
  node.children?.forEach((child) => collectIds(child, ids))
}

const substitute = (node: Node): Node => {
  let next = node
  if (node.type === 'upload' && node.relationTo === 'media') {
    const id = unresolvedId(node.value)
    const doc = id ? cache.get(id) : undefined
    if (doc) next = { ...next, value: doc }
  }
  const fields = node.fields as Record<string, unknown> | undefined
  if ((node.type === 'block' || node.type === 'inlineBlock') && fields) {
    const id = unresolvedId(fields.image)
    const doc = id ? cache.get(id) : undefined
    if (doc) next = { ...next, fields: { ...fields, image: doc } }
  }
  if (node.children) next = { ...next, children: node.children.map(substitute) }
  return next
}

export const useMediaPopulated = (
  content: SerializedEditorState | undefined,
): SerializedEditorState | undefined => {
  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()
  // Bumped when a fetch lands, so the substitution below re-runs against the filled cache.
  const [fetched, setFetched] = useState(0)

  const ids = useMemo(() => {
    const found = new Set<string>()
    if (content) collectIds(content.root as unknown as Node, found)
    return [...found]
  }, [content])

  const missingKey = ids.filter((id) => !cache.has(id)).join(',')

  useEffect(() => {
    if (!missingKey) return
    const missing = missingKey.split(',')
    const toFetch = missing.filter((id) => !pending.has(id))
    if (toFetch.length > 0) fetchMedia(toFetch, `${serverURL ?? ''}${api}`)

    let cancelled = false
    void Promise.all(missing.map((id) => pending.get(id))).then(() => {
      if (!cancelled) setFetched((n) => n + 1)
    })
    return () => {
      cancelled = true
    }
  }, [api, missingKey, serverURL])

  return useMemo(() => {
    if (!content || ids.length === 0) return content
    return { ...content, root: substitute(content.root as unknown as Node) } as SerializedEditorState
    // `fetched` is the signal that the cache changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, ids.length, fetched])
}
