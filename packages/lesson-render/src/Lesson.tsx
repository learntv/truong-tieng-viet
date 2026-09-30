"use client";

import type { LessonDoc } from "./types";

import { RichText } from "@payloadcms/richtext-lexical/react";
import React, { useEffect, useRef, useState } from "react";

import { lessonConverters } from "./lessonConverters";
import contentStyles from "./lessonContent.module.css";
import styles from "./Lesson.module.css";

/**
 * A KMD lesson as a reader sees it: a title card above a slide deck — one
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
 * The section number is the editor's own "Mục n" from the slide rail, and a link to `#muc-<n>`
 * opens a lesson straight at the
 * section being edited — read on mount below, since only the active slide is ever in the DOM.
 */
export const SECTION_ID_PREFIX = "muc-";

const slideNumberFromHash = (hash: string): null | number => {
  const match = /^#muc-(\d+)$/.exec(hash);
  return match ? Number(match[1]) - 1 : null;
};

// How far a finger has to travel sideways across the slide before it counts as turning the page,
// and how much more sideways than vertical it has to be — so reading down a long slide on a phone
// never flips it by accident.
const SWIPE_MIN_DISTANCE = 60;
const SWIPE_DOMINANCE = 1.5;

// Breathing room kept between the active thumbnail and the rail's edge when the rail scrolls to it.
const RAIL_SCROLL_PADDING = 8;

/**
 * The title card's extras are the host's to supply, and all optional (the CMS preview passes none):
 * `thumbnail` on the card's left, `eyebrow` over the title, `aside` on the card's right, and
 * `back` beside the card, over the rail.
 */
export const Lesson: React.FC<{
  lesson: LessonDoc;
  thumbnail?: React.ReactNode;
  eyebrow?: React.ReactNode;
  aside?: React.ReactNode;
  back?: React.ReactNode;
}> = ({ lesson, thumbnail, eyebrow, aside, back }) => {
  const sections = lesson.blocks ?? [];
  const [rawIndex, setRawIndex] = useState(0);

  // A row removal elsewhere or a lesson with fewer sections than the previous one left the index
  // pointing past the end; clamped at read time rather than via an effect, so this render is
  // already correct instead of flashing the wrong slide first.
  const activeIndex = sections.length === 0 ? 0 : Math.min(rawIndex, sections.length - 1);

  const railRef = useRef<HTMLElement>(null);
  const slideRef = useRef<HTMLElement>(null);
  const touchStart = useRef<null | { x: number; y: number }>(null);

  const goPrevious = () => setRawIndex((i) => Math.max(0, Math.min(i, sections.length - 1) - 1));
  const goNext = () => setRawIndex((i) => Math.min(sections.length - 1, i + 1));

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
      if (event.key === "ArrowLeft") goPrevious();
      else if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.length]);

  // Turning the page keeps both ends of it in view. On a phone the slide grows with its content
  // and the arrows sit under it, so after reading down a long one and tapping "next" the new slide
  // would open already scrolled past its top — bring its top back (only if it is out of view, so
  // on a screen where the whole deck fits nothing moves). And the rail follows the active
  // thumbnail within its own scroll box, never the page's, so paging far through a long lesson
  // never leaves the highlighted one scrolled out of sight.
  useEffect(() => {
    const slide = slideRef.current;
    if (slide) {
      const topClearance = parseFloat(getComputedStyle(slide).scrollMarginTop) || 0;
      if (slide.getBoundingClientRect().top < topClearance) {
        slide.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    const rail = railRef.current;
    const item = rail?.children[activeIndex];
    if (rail && item) {
      const railBox = rail.getBoundingClientRect();
      const itemBox = item.getBoundingClientRect();
      const overflow = (start: number, end: number, boxStart: number, boxEnd: number) => {
        if (start < boxStart + RAIL_SCROLL_PADDING) return start - boxStart - RAIL_SCROLL_PADDING;
        if (end > boxEnd - RAIL_SCROLL_PADDING) return end - boxEnd + RAIL_SCROLL_PADDING;
        return 0;
      };
      const left = overflow(itemBox.left, itemBox.right, railBox.left, railBox.right);
      const top = overflow(itemBox.top, itemBox.bottom, railBox.top, railBox.bottom);
      if (left !== 0 || top !== 0) rail.scrollBy({ behavior: "smooth", left, top });
    }
  }, [activeIndex]);

  const activeSection = sections[activeIndex];

  return (
    <article className={styles.lesson}>
      <div className={styles.headerRow}>
        {back != null && <div className={styles.headerBack}>{back}</div>}
        <header className={styles.header}>
          {thumbnail != null && <div className={styles.headerThumb}>{thumbnail}</div>}
          <div className={styles.headerText}>
            {eyebrow != null && <p className={styles.eyebrow}>{eyebrow}</p>}
            <h1 className={styles.title}>{lesson.title}</h1>
          </div>
          {aside != null && <div className={styles.headerAside}>{aside}</div>}
        </header>
      </div>

      {sections.length === 0 ? (
        <p className={styles.empty}>Bài học này chưa có mục nào.</p>
      ) : (
        <div className={styles.deck}>
          <nav aria-label="Danh sách mục" className={styles.rail} ref={railRef}>
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
                className={`${styles.slideNavButton} ${styles.slidePrevious}`}
                disabled={activeIndex === 0}
                onClick={goPrevious}
                type="button"
              >
                <ArrowIcon direction="left" />
              </button>

              {activeSection && (
                <section
                  className={styles.slide}
                  id={`${SECTION_ID_PREFIX}${activeIndex + 1}`}
                  key={activeSection.id ?? activeIndex}
                  // Swiping the slide sideways turns it, the way a finger expects a deck to
                  // behave on a phone. Ignored while text is selected, since dragging a
                  // selection handle is a sideways drag too.
                  onTouchCancel={() => {
                    touchStart.current = null;
                  }}
                  onTouchEnd={(event) => {
                    const start = touchStart.current;
                    touchStart.current = null;
                    const touch = event.changedTouches[0];
                    if (!start || !touch) return;
                    if (window.getSelection()?.toString()) return;
                    const dx = touch.clientX - start.x;
                    const dy = touch.clientY - start.y;
                    if (Math.abs(dx) < SWIPE_MIN_DISTANCE) return;
                    if (Math.abs(dx) < Math.abs(dy) * SWIPE_DOMINANCE) return;
                    if (dx < 0) goNext();
                    else goPrevious();
                  }}
                  onTouchStart={(event) => {
                    const touch = event.touches[0];
                    touchStart.current =
                      event.touches.length === 1 && touch
                        ? { x: touch.clientX, y: touch.clientY }
                        : null;
                  }}
                  ref={slideRef}
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

              {/* Only shown on a phone, between the arrows under the slide (see the CSS): the
                  rail there is a sideways strip that can scroll the current thumbnail out of
                  view, so the arrows carry the "where am I" themselves. */}
              <span aria-hidden="true" className={styles.slideCounter}>
                {activeIndex + 1} / {sections.length}
              </span>

              <button
                aria-label="Mục tiếp theo"
                className={`${styles.slideNavButton} ${styles.slideNext}`}
                disabled={activeIndex === sections.length - 1}
                onClick={goNext}
                type="button"
              >
                <ArrowIcon direction="right" />
              </button>
            </div>
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
