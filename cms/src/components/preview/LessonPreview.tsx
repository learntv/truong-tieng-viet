import type { BaiKmd } from '@/payload-types'

import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { lessonConverters } from './lessonConverters'
import contentStyles from './lessonContent.module.css'
import styles from './LessonPreview.module.css'

/**
 * A KMD lesson as a reader sees it: the title and the âm/vần it teaches, then every section in
 * order, each on its own card.
 *
 * This is the whole rendering of a lesson — there is no student-facing page for these yet (the
 * kmd-lessons proposal deferred one), so what an editor previews here is also the definition of
 * what the site will show. It is deliberately built out of this component plus `lessonConverters`
 * and nothing admin-specific, so the eventual public route can render the same two files against
 * the same document.
 *
 * The section number is the editor's own "Mục n" from the slide rail (KmdBlocksField.tsx), and
 * each card carries that as its id so the preview can be opened straight at the section being
 * edited.
 */
export const SECTION_ID_PREFIX = 'muc-'

export const LessonPreview: React.FC<{ lesson: BaiKmd }> = ({ lesson }) => {
  const sections = lesson.blocks ?? []

  return (
    <article className={styles.lesson}>
      <header className={styles.header}>
        <h1 className={styles.title}>{lesson.title}</h1>
        {lesson.amVan && lesson.amVan.length > 0 && (
          <ul className={styles.amVan}>
            {lesson.amVan.map((amVan) => (
              <li className={styles.amVanItem} key={amVan}>
                {amVan}
              </li>
            ))}
          </ul>
        )}
      </header>

      {sections.length === 0 ? (
        <p className={styles.empty}>Bài học này chưa có mục nào.</p>
      ) : (
        sections.map((section, index) => (
          <section
            className={styles.section}
            id={`${SECTION_ID_PREFIX}${index + 1}`}
            key={section.id ?? index}
          >
            <span className={styles.sectionIndex} aria-hidden>
              {index + 1}
            </span>
            {section.content && (
              <RichText
                className={contentStyles.content}
                converters={lessonConverters}
                data={section.content}
              />
            )}
          </section>
        ))
      )}
    </article>
  )
}
