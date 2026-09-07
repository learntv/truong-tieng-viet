import type { Metadata } from 'next'

import config from '@payload-config'
import { Lesson } from '@ttv/lesson-render'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import styles from './page.module.css'

/**
 * A KMD lesson rendered the way the site will render it, opened from the "Xem trước" button in the
 * lesson editor (see components/admin/kmd/KmdBlocksField.tsx).
 *
 * It reads the *saved* document — the editor's unsaved changes live in a form on another tab and
 * are not reachable from here — which the banner says out loud, because "I changed that" followed
 * by an unchanged preview is the one way this page can mislead.
 *
 * Fetched through the local API, so no HTTP round trip and no token; `depth: 2` is what populates
 * the media documents behind the images (both the upload nodes in the rich text and the picture on
 * a thẻ từ vựng), which render as nothing if they arrive as bare ids. The lesson collection is
 * `read: () => true` and already served publicly over REST, so this page discloses nothing that a
 * request to /api/bai-kmd would not.
 */

type Args = { params: Promise<{ id: string }> }

// Cached for the render pass, so the metadata and the page itself are one query rather than two.
const getLesson = cache(async (id: string) => {
  const payload = await getPayload({ config })

  try {
    return await payload.findByID({ collection: 'bai-kmd', depth: 2, disableErrors: true, id })
  } catch {
    // A non-numeric id in the URL is a bad request to the database adapter, not a 500 — the row
    // simply cannot exist, so it is the same answer as a missing lesson.
    return null
  }
})

export const generateMetadata = async ({ params }: Args): Promise<Metadata> => {
  const lesson = await getLesson((await params).id)
  return { title: lesson ? `Xem trước — ${lesson.title}` : 'Xem trước bài học' }
}

const LessonPreviewPage = async ({ params }: Args) => {
  const lesson = await getLesson((await params).id)

  if (!lesson) notFound()

  return (
    <>
      <div className={styles.banner}>
        <span className={styles.badge}>Bản xem trước</span>
        <span className={styles.note}>
          Đây là nội dung <strong>đã lưu</strong> của bài học. Lưu lại rồi tải lại trang này để xem
          những thay đổi mới nhất.
        </span>
        <a
          className={styles.back}
          href={`/admin/collections/bai-kmd/${lesson.id}`}
          rel="noreferrer"
          target="_blank"
        >
          Mở trong trình soạn thảo
        </a>
      </div>
      <Lesson lesson={lesson} />
    </>
  )
}

export default LessonPreviewPage
