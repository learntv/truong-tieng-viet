'use client'

import { useConfig, useField } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

import styles from './AudioPreview.module.css'

type MediaDoc = { filename?: null | string; mimeType?: null | string; url?: null | string }

/**
 * A player under the bài's audio field. Payload's upload field shows the attached file as a
 * card with its filename and nothing else, so the only way to hear what is attached was to open
 * the media document in another tab — with 66 near-identically named lesson recordings that is
 * the difference between checking an attachment and guessing at it.
 *
 * Rendered as the field's `afterInput`, so it reads the media id out of the field's own context
 * and resolves it against the REST API. The URL the API returns is relative in development
 * (Payload serves the file itself) and absolute in production (R2's public hostname), so it is
 * only prefixed with the server URL when it is a path.
 */
export const AudioPreview: React.FC = () => {
  const { value } = useField<{ id?: number | string } | number | string>()
  const {
    config: {
      routes: { api: apiRoute },
      serverURL,
    },
  } = useConfig()

  // The form keeps the upload field's value as the media id, but a value that arrived populated
  // carries the whole document — take the id out of either shape.
  const id = value && typeof value === 'object' ? value.id : value

  const [doc, setDoc] = useState<MediaDoc | null>(null)

  useEffect(() => {
    if (!id) {
      setDoc(null)
      return
    }

    // A file swapped while an earlier request is still in flight would otherwise land last and
    // leave the player pointing at the file that was replaced.
    let current = true

    void (async () => {
      try {
        const res = await fetch(`${serverURL || ''}${apiRoute}/media/${id}?depth=0`, {
          credentials: 'include',
        })
        if (!res.ok) throw new Error(String(res.status))
        const media = (await res.json()) as MediaDoc
        if (current) setDoc(media)
      } catch {
        if (current) setDoc(null)
      }
    })()

    return () => {
      current = false
    }
  }, [apiRoute, id, serverURL])

  if (!id || !doc?.url) return null

  const src = doc.url.startsWith('/') ? `${serverURL || ''}${doc.url}` : doc.url

  return <audio className={styles.player} controls preload="none" src={src} />
}
