"use client";

import type { LessonDoc } from "./types";

import { RichText } from "@payloadcms/richtext-lexical/react";
import React, { useEffect, useState } from "react";

import { lessonConverters } from "./lessonConverters";
import contentStyles from "./lessonContent.module.css";
import styles from "./Lesson.module.css";

/**
 * A KMD lesson as a reader sees it: the title and the âm/vần it teaches above a slide deck — one
 * section showing at a time, a "Mục n" rail on the left to jump between them, and prev/next arrows
 * on the right — the same powerpoint-style layout the editor already composes in
 * (cms/src/components/admin/kmd/KmdBlocksField.tsx), so a reader browses a lesson the way an
 * editor built it.
 *
 * The single rendering of a lesson, used by the CMS's admin preview and the public site's lesson
 * page alike — the two cannot drift because they render this same component against the same
 * document. Deliberately built out of this component plus `lessonConverters` and nothing
 * admin-specific.
 *
 * The section number is the editor's own "Mục n" from the slide rail, and the admin's "Xem trước"
 * link (KmdBlocksField.tsx's `PreviewLink`) points at `#muc-<n>` to open a lesson straight at the
 * section being edited — read on mount below, since only the active slide is ever in the DOM.
 */
export const SECTION_ID_PREFIX = "muc-";

const slideNumberFromHash = (hash: string): null | number => {
  const match = /^#muc-(\d+)$/.exec(hash);
  return match ? Number(match[1]) - 1 : null;
};

export const Lesson: React.FC<{ lesson: LessonDoc }> = ({ lesson }) => {
  const sections = lesson.blocks ?? [];
  const [rawIndex, setRawIndex] = useState(0);

  // A row removal elsewhere or a lesson with fewer sections than the previous one left the index
  // pointing past the end; clamped at read time rather than via an effect, so this render is
  // already correct instead of flashing the wrong slide first.
  const activeIndex = sections.length === 0 ? 0 : Math.min(rawIndex, sections.length - 1);

  useEffect(() => {
    const target = slideNumberFromHash(window.location.hash);
    if (target !== null && target >= 0 && target < sections.length) setRawIndex(target);
    // Only on mount: this is where the editor's "Xem trước" link lands, and the slide the reader
    // navigates to afterward is theirs to control, not the URL's.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sections.length <= 1) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      // Don't steal arrow keys from a form control elsewhere on the page.
      if (
        target instanceof HTMLElement &&
        ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)
      ) {
        return;
      }
      if (event.key === "ArrowLeft") setRawIndex((i) => Math.max(0, i - 1));
      else if (event.key === "ArrowRight") {
        setRawIndex((i) => Math.min(sections.length - 1, i + 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sections.length]);

  const activeSection = sections[activeIndex];

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
        <div className={styles.deck}>
          <nav aria-label="Danh sách mục" className={styles.rail}>
            {sections.map((section, index) => (
              <div
                aria-current={index === activeIndex}
                aria-label={`Mục ${index + 1}`}
                className={styles.railItem}
                data-active={index === activeIndex}
                key={section.id ?? index}
                onClick={() => setRawIndex(index)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  setRawIndex(index);
                }}
                role="button"
                tabIndex={0}
              >
                <div className={styles.railThumb}>
                  <span className={styles.railIndex}>{index + 1}</span>
                  {section.content && (
                    // A miniature of the real slide, not a redrawn stand-in: the same
                    // `RichText`/`lessonConverters` the slide itself uses, shrunk with a CSS
                    // transform. `inert` takes the whole thing out of the tab order and the
                    // accessibility tree — the thumbnail is a picture of the slide, not a second
                    // copy of its links, checkboxes and images to interact with.
                    <div className={styles.railThumbScale} inert>
                      <RichText
                        className={contentStyles.content}
                        converters={lessonConverters}
                        data={section.content}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </nav>

          <div className={styles.slideArea}>
            <div className={styles.slideRow}>
              <button
                aria-label="Mục trước"
                className={styles.slideNavButton}
                disabled={activeIndex === 0}
                onClick={() => setRawIndex((i) => Math.max(0, i - 1))}
                type="button"
              >
                <ArrowIcon direction="left" />
              </button>

              {activeSection && (
                <section
                  className={styles.slide}
                  id={`${SECTION_ID_PREFIX}${activeIndex + 1}`}
                  key={activeSection.id ?? activeIndex}
                >
                  {activeSection.content && (
                    <RichText
                      className={contentStyles.content}
                      converters={lessonConverters}
                      data={activeSection.content}
                    />
                  )}
                </section>
              )}

              <button
                aria-label="Mục tiếp theo"
                className={styles.slideNavButton}
                disabled={activeIndex === sections.length - 1}
                onClick={() => setRawIndex((i) => Math.min(sections.length - 1, i + 1))}
                type="button"
              >
                <ArrowIcon direction="right" />
              </button>
            </div>

            <span className={styles.slideCounter}>
              Mục {activeIndex + 1} / {sections.length}
            </span>
          </div>
        </div>
      )}
    </article>
  );
};

const ArrowIcon: React.FC<{ direction: "left" | "right" }> = ({ direction }) => (
  <svg aria-hidden="true" height="20" viewBox="0 0 24 24" width="20">
    <path
      d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
    />
  </svg>
);
