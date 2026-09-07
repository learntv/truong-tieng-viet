/**
 * The subset of `tokens.css`'s palette that is also needed as plain hex, for code that cannot
 * consume a CSS custom property — `cms/src/features/text-color/palette.ts`, whose swatches are
 * written into stored lesson content and so must stay hex literals themselves (see that file's own
 * comment), but derives *these* three from here rather than transcribing them a second time.
 *
 * Kept in sync with `tokens.css` by hand: both describe the same three site tokens
 * (`--ttv-primary`, `--ttv-primary-deep`, `--ttv-primary-soft`), one as the oklch the CSS uses and
 * one as the sRGB hex that stored content and this file need.
 */
export const PRIMARY_HEX = "#cc0000";
export const PRIMARY_DEEP_HEX = "#a30000";
export const PRIMARY_SOFT_HEX = "#fff2f0";
