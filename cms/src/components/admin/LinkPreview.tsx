'use client'

import { useField } from '@payloadcms/ui'
import React from 'react'

import styles from './LinkPreview.module.css'
import { getYouTubeID } from './YouTubePreview'

/**
 * The Liên kết field's preview: the linked activity, framed under the input. Nearly every link
 * here is a Wordwall exercise the app embeds in the lesson, so showing it in place is what tells
 * the editor the link points at the right game — and at a game at all.
 *
 * Rendered as the field's `afterInput`. A site is free to refuse being framed, and the browser
 * gives the page no way to detect that, so the link is always repeated underneath: a blank frame
 * then has an obvious next step instead of looking like a broken field.
 */
export const LinkPreview: React.FC = () => {
  const { value } = useField<string>()
  const url = (value ?? '').trim()

  if (!url) return null

  const embedURL = toEmbedURL(url)

  if (!embedURL) return <p className={styles.warning}>Không nhận ra liên kết.</p>

  return (
    <div className={styles.preview}>
      <iframe allowFullScreen className={styles.embed} src={embedURL} title="Xem trước liên kết" />
      <a className={styles.fallback} href={url} rel="noopener noreferrer" target="_blank">
        Mở liên kết trong tab mới
      </a>
    </div>
  )
}

/**
 * The URL to frame, which is not always the URL that was pasted: Wordwall and YouTube both serve
 * a page that refuses framing at their share URLs and an embeddable one elsewhere. Anything else
 * is framed as-is — the activities linked here are made to be embedded, and one that isn't shows
 * the fallback link instead.
 */
function toEmbedURL(url: string): null | string {
  let parsed: URL

  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null

  const videoID = getYouTubeID(url)
  if (videoID) return `https://www.youtube-nocookie.com/embed/${videoID}`

  // Wordwall hands out /resource/<id> (the activity's page) and /play/<id>; both frame only as
  // /embed/<id>, which is the form the links in the book already use.
  if (parsed.hostname.endsWith('wordwall.net')) {
    const match = parsed.pathname.match(/^\/(?:resource|play|embed)\/(\w+)/)
    if (match) return `${parsed.origin}/embed/${match[1]}${parsed.search}`
  }

  return parsed.href
}
