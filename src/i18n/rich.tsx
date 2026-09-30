import type { ReactNode } from "react";

/**
 * The inline tags messages may use with t.rich(): <b> for plain emphasis,
 * <hl> for emphasis in the indigo accent, and <accent> for the indigo colour
 * alone (in headings, which are already heavy). Keeping the styling here means
 * a translator (or the CMS later) only ever writes the tag, never a class.
 */
export const richTags = {
  b: (chunks: ReactNode) => <strong>{chunks}</strong>,
  hl: (chunks: ReactNode) => <strong className="text-indigo">{chunks}</strong>,
  accent: (chunks: ReactNode) => <span className="text-indigo">{chunks}</span>,
};
