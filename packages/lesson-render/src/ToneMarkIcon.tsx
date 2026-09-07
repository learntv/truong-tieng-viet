import type { ToneValue } from "./tones";

import React from "react";

/**
 * The tone mark itself, drawn — the glyph a child sees written over a syllable — sized to fill
 * its cell in the "tạo tiếng" chain (lessonConverters.tsx), rather than shown as its spoken name
 * ("dấu nặng") or a bare Unicode combining character, which most fonts don't render as a clean
 * standalone symbol.
 *
 * `ngang` has no mark and returns `null` — its cell in the chain is dropped, same as any other
 * empty cell.
 */
export const ToneMarkIcon: React.FC<{ className?: string; value: ToneValue }> = ({
  className,
  value,
}) => {
  const path = PATHS[value];
  if (!path) return null;

  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      {path}
    </svg>
  );
};

const STROKE = {
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 3,
};

const PATHS: Partial<Record<ToneValue, React.ReactNode>> = {
  // Falling: a stroke that drops left to right, same direction the tone itself falls.
  huyen: <line x1="6" x2="18" y1="6" y2="18" {...STROKE} />,
  // A question mark's hook, minus the dot — the actual shape of the hỏi mark itself.
  hoi: <path d="M7 7c0-4 10-4 10-0.5c0 3.5-5 3-5 7" {...STROKE} />,
  // A single wave, breaking partway through — ngã's own creaky rise.
  nga: <path d="M4 15c0-6 5-9 8-6s6 3 8-3" {...STROKE} />,
  // A single low weight, the tone that drops and stays down.
  nang: <circle cx="12" cy="17" fill="currentColor" r="4" />,
  // Rising: a stroke that climbs left to right, same direction the tone itself rises.
  sac: <line x1="6" x2="18" y1="18" y2="6" {...STROKE} />,
};
