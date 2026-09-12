/**
 * The centred column the whole site is built on.
 *
 * The page card and the navbar's contents both use it, which is what makes the
 * navbar line up with the card's edges. It lives in its own module so the
 * navbar can use it without importing the shell that renders the navbar.
 *
 * Note the gutter is zero on phones: there the card goes edge-to-edge, while
 * the navbar keeps a 1rem gutter of its own so its contents still line up with
 * the card's inner padding.
 */
export const LAYOUT_COLUMN = "mx-auto w-full max-w-[var(--layout-max)]";

/** Column + the gutter that separates the card from the viewport. */
export const LAYOUT_COLUMN_PADDED = `${LAYOUT_COLUMN} px-0 sm:px-[var(--layout-gutter)]`;

/** Column + the navbar's own gutter (never zero — the bar is edge-to-edge). */
export const LAYOUT_COLUMN_BAR = `${LAYOUT_COLUMN} px-4 sm:px-[var(--layout-gutter)]`;
