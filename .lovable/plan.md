## Fix build errors

Delete `src/components/Footer.test.tsx` — the project has no vitest/testing-library setup and this stray test file is breaking the typecheck.

## Simpler social preview

Regenerate `/tmp/og-image.jpg` with PIL:

- 1200×630 canvas with a diagonal red→amber gradient using existing theme colors (primary red + gold accent).
- Centered composition mirroring the navbar Logo:
  - `src/assets/buffalo-icon.png` on the left, ~360px tall.
  - Wordmark to the right: "Trường Tiếng Việt" (white) over "Của Em" (soft cream), Noto Serif Display extra-bold, tight leading — same two-line stack as `Logo.tsx`.
- No badges, no URL, no tagline, no bench-scene background.

Then:
- Delete the previous asset pointer `src/assets/og-image-new.png.asset.json` (leftover, unused).
- Overwrite `src/assets/og-image.jpg.asset.json` via `lovable-assets create` so `__root.tsx` picks up the new URL automatically (it already imports that pointer).

Note to user: social platforms cache previews, so they can force-refresh via their link debugger to see it immediately.