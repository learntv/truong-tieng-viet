'use client'

import { useField } from '@payloadcms/ui'
import React from 'react'

import styles from './YouTubePreview.module.css'

/**
 * Turns whatever YouTube link was pasted into the video field into the embed it will become,
 * shown under the input. Confirms the right video was pasted without leaving the page, and makes
 * it obvious when a link isn't a YouTube one at all.
 *
 * Rendered as the field's `afterInput`, so it picks the path up from the field's own context.
 */
export const YouTubePreview: React.FC = () => {
  const { value } = useField<string>()
  const url = (value ?? '').trim()

  if (!url) return null

  const videoID = getYouTubeID(url)

  if (!videoID) {
    return <p className={styles.warning}>Không nhận ra liên kết YouTube.</p>
  }

  return (
    <iframe
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className={styles.embed}
      // nocookie serves the same player without YouTube's tracking cookies.
      src={`https://www.youtube-nocookie.com/embed/${videoID}`}
      title="Xem trước video"
    />
  )
}

/**
 * The id out of any of the shapes YouTube hands out: a watch link, a share link, an embed URL,
 * a Shorts link, or the bare id itself.
 */
function getYouTubeID(url: string): null | string {
  const bareID = /^[\w-]{11}$/
  if (bareID.test(url)) return url

  let parsed: URL

  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  const { hostname, pathname, searchParams } = parsed

  if (hostname.endsWith('youtu.be')) {
    const id = pathname.slice(1)
    return bareID.test(id) ? id : null
  }

  if (!hostname.endsWith('youtube.com') && !hostname.endsWith('youtube-nocookie.com')) {
    return null
  }

  const fromQuery = searchParams.get('v')
  if (fromQuery && bareID.test(fromQuery)) return fromQuery

  const fromPath = pathname.match(/^\/(?:embed|shorts|v|live)\/([\w-]{11})/)
  return fromPath ? fromPath[1] : null
}
