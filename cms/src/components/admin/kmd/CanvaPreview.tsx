'use client'

import { useField } from '@payloadcms/ui'
import React from 'react'

import { toCanvaEmbedUrl } from '@/lib/canva'

import styles from './CanvaPreview.module.css'

/**
 * The Canva design a KMD lesson's link points at, embedded under the field the way the site will
 * show it. Reads the field's live value, so a pasted snippet or share link previews before the
 * save hook has normalised it, and a link that isn't a Canva design says so straight away.
 *
 * Rendered as the field's `afterInput`, so it picks the path up from the field's own context.
 */
export const CanvaPreview: React.FC = () => {
  const { value } = useField<string>()
  const input = (value ?? '').trim()

  if (!input) return null

  const embedUrl = toCanvaEmbedUrl(input)

  if (!embedUrl) {
    return <p className={styles.warning}>Không nhận ra link Canva.</p>
  }

  return (
    <iframe
      allow="fullscreen"
      allowFullScreen
      className={styles.embed}
      loading="lazy"
      src={embedUrl}
      title="Xem trước bài học"
    />
  )
}
