## Goal

Redesign the topic page (`/hoc-tap/quyen-1/chu-de-N` — the "Địa điểm" screen in your screenshot) into a flat, Material-style layout that matches the flat card grid now used on `/hoc-tap`.

Today that screen is a "scrapbook" design: rounded-[1.75rem] cards, drop shadows, washi-tape strips, a rotated taped photo, a dashed rubber-stamp tag, and a wax-seal medal. Those decorative devices are what read as non-flat.

## What changes

**Header block**
- Flat white surface: 1px border, `rounded-lg`, no shadow, no ring, no rotation.
- Back control becomes a standard flat icon button; the dashed "ĐỊA ĐIỂM 1" stamp becomes a plain uppercase overline label in the accent color.
- Title stays large and bold, with a tighter, more consistent type scale (overline → h1 → body → action).
- "Khám phá <địa điểm>" becomes a Material-style filled/outlined button with a leading icon, not a shadowed pill.

**Photo + badge**
- Photo loses the tape, rotation and white polaroid frame: a full-width, fixed-ratio flat image block with square-ish corners at the top of the right column.
- The seal/medal renders as a flat circular chip (locked = muted surface + lock icon, earned = accent fill), removing the embossed wax look.

**Progress panel**
- Flat bordered row: label, thin linear progress bar (Material-style track + indicator), count text, and the badge hint as a single quiet info line — no nested tinted boxes with their own shadows.

**Chặng list**
- Flat list surface: 1px border, dividers, no shadow, no oversized radius.
- Each row: numbered circle, emoji tile (flat, no ring), title, thin progress bar, and a right-side state affordance (check / lock / text action button).
- Hover/active use background tint only, no lift or bevel.

**Side cards (reward / streak / culture)**
- Same flat card treatment, uniform padding and icon-tile size.

**Overview dialog**
- Flat dialog surface, consistent radius, flat close button, same type scale.

**Spacing & typography**
- One spacing rhythm across the page (`p-5` cards, `gap-4` grid, consistent section spacing) and a single type scale (overline 11px bold uppercase, h1 30/36px, h2 18px, body 14px, meta 12px).

## Shared components

To keep the rest of the app consistent (the `Card` is already flat):
- Buttons on this page use flat `default` / `outline` / `ghost` variants instead of the `bevel` 3D variant. The bevel variant stays defined for other screens unless you want it removed everywhere.
- Badges keep the existing soft-tone variants but are used with square-ish radius on this page's labels.

## Technical notes

- Files: `src/components/learning/RoadmapList.tsx` (main), `src/components/learning/BadgeMedal.tsx` (flat variant), and the `washi-tape` utility in `src/styles.css` (unused after this, can be removed).
- Purely presentational: no changes to progress logic, routing, data hooks or unlock rules.
- Verified with a Playwright screenshot at desktop and mobile widths after the change.

## Not included

Lesson viewer (`LessonPage`), the overworld map, and other routes stay as-is — say the word and I'll extend the same flat pass to them.
