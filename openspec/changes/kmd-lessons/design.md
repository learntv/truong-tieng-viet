## Context

See proposal.md — Why. What shapes the approach technically:

- Payload 3 with the Postgres adapter and generated migrations under `cms/src/migrations/`.
  Schema changes are not automatic in production; a migration must be generated and committed.
- No collection in this CMS uses a `blocks` field yet. The existing tree (`ChuDe.ts`) is built
  from nested `array` fields with custom `Field` components replacing the default UI.
- There is an established preview pattern: `AudioPreview`, `YouTubePreview`, `LinkPreview` are
  client components hung off a field's `admin.components.afterInput`, reading their own value via
  `useField()` and styling themselves with a co-located CSS module.
- There is also an established pattern for components that read *other* fields' values:
  `type: 'ui'` fields with a custom `Field` component (`ChuDeGrid`, `ChangTabs`, `BaiList`).
- The `media` collection is R2-backed in production and local disk in dev; `lexicalEditor` is
  already configured as the rich text editor.
- Admin UI language is Vietnamese throughout — labels, descriptions and placeholders.

## Goals / Non-Goals

**Goals:**

- One collection whose document shape survives ~50 lessons of hand entry without editors having
  to remember which field means what.
- Section previews that cost little: one small client component per block type, no frontend route,
  no build step, no server render of student-facing markup.
- Nothing in the existing tree changes — no shared fields, no shared components that would have to
  grow a second mode.

**Non-Goals:**

- A student-facing renderer. The previews are admin-only mockups; when a real frontend arrives it
  will render from the same data but is not designed here.
- Reproducing the source decks' visual design.
- Any `.pptx` parsing, one-off or otherwise.
- A whole-lesson sequential preview view.

## Decisions

### A `blocks` field for the lesson body, not nested arrays

The body is a `blocks` field on the lesson document. Each of the ten section types is a block
definition with its own `slug`, Vietnamese `labels`, and fields.

*Why over the alternative:* the existing tree models everything as nested `array` fields, which
works when every row has the same shape. Lesson sections do not — a `toneTable` and a
`speakingPrompt` share no fields. Modelling them as one array would mean a row full of optional
fields where nine in ten are blank and irrelevant, and no way to show an editor only what applies.
`blocks` gives per-type fields, a native type picker at insert time, reordering, and repetition of
a type within one lesson, which the source decks do (four drill sections in Bài 48).

*Cost accepted:* the Postgres adapter creates one table per block type, so this adds ten-plus
tables in a single migration. That is a one-time schema cost, not a per-lesson one.

### Block definitions live in their own directory

Block definitions go under `cms/src/blocks/` (new), one file per block, imported by the collection
config. Ten inline block definitions in a collection file would make it far longer than any
existing collection, and each block pairs with a preview component that is easier to keep beside
its definition's field names.

### Previews are `ui` fields inside each block, not `afterInput`

Each block gets, as its last field, a `type: 'ui'` field whose `Field` component renders that
block's preview. The component reads the block's own values out of form state and renders the
mockup.

*Why over `afterInput`:* `afterInput` hangs a component off one field and `useField()` gives it
that field's value only. A `letterIntro` preview needs the uppercase form, the lowercase form and
the example tiếng together, so the preview must read sibling values — which is what the existing
`ui`-field components (`ChuDeGrid`, `ChangTabs`, `BaiList`) already do. A `ui` field also stores
nothing, so it adds no column and no migration surface.

*Mechanism:* the `Field` component receives its own `path`; the parent block's path is that path
minus the final segment, and sibling values are read from form state under that prefix. This keeps
each preview independent of where its block sits in the list, which matters because blocks are
reorderable.

*Consequence:* previews are read-only and update as form state changes, satisfying the spec's
live-update and partial-render requirements without a save round-trip.

### Fixed fields per block, rich text only for `worksheet`

Nine block types get concrete typed fields. `worksheet` gets a lexical `richText` field, because
worksheet slides vary the most between lessons (numbered task lists mixing reading rows, sentences
and instructions) and pinning them to a schema would fight the editor rather than help.

*Trade-off:* rich text is the one block whose content is not queryable in a structured way. Judged
acceptable — nothing downstream is planned to read worksheet internals.

### Identity: `baiSo` as the unique sort key, `title` as the display name

`baiSo` is a required unique indexed number; `title` is the human name ("ONG – ÔNG – UNG – ƯNG")
and serves as `useAsTitle`. `defaultSort` is `baiSo`, with `baiSo` and `amVan` in
`defaultColumns`.

*Why not `orderable: true`* (the `_order` fractional index used by `Quyen` and `ChuDe`): these
lessons have an inherent number that already appears in the source filenames and on every slide
footer. Drag ordering would introduce a second, conflicting notion of sequence.

*Why unique:* two lessons numbered 48 would make the flat list ambiguous, and the number is how
editors and the source material both refer to a lesson.

### `amVan` as a `hasMany` text field

The âm/vần a lesson teaches is a `text` field with `hasMany: true` — a lesson teaches one letter
(Bài 7: n, r), a pair (Bài 4: d, đ), or four vần (Bài 48). A `select` with fixed options was
rejected: the full inventory of âm and vần across 50+ lessons is not known up front, and a wrong
option list blocks an editor mid-entry.

### Images reuse `media` with a mimeType filter

Every image field is `type: 'upload'`, `relationTo: 'media'`, with
`filterOptions: { mimeType: { contains: 'image' } }` — the same guard `hinh.image` uses, since the
media collection also holds audio.

## Risks / Trade-offs

- **Ten block tables land in one migration** → Generate and review the migration before it reaches
  production, as with any schema change here; it is additive only, creating new tables and
  touching no existing one.
- **Ten preview components is real UI work, and they can drift from their block's fields** →
  Keep each preview beside its block definition and derive it from the same field names; a block
  whose preview is not built yet is worse than no preview, so treat block-plus-preview as one unit
  of work rather than shipping all blocks then all previews.
- **The vocabulary was derived from four decks, not all fifty** → The four sampled decks span both
  lesson shapes (single letters, letter pairs, vần groups) and the script is visibly the same
  across them, but a later deck may need a section type that does not exist yet. Adding a block
  type is additive — a new definition plus a migration — and does not disturb existing lessons.
- **Previews are mockups, so an editor could still be surprised by the eventual student view** →
  Accepted deliberately (see the spec): the preview's job is to show content and arrangement, and
  a facsimile would have to be rebuilt anyway once a real frontend exists.
- **Hand entry of 50+ lessons is slow, and the decision to skip an importer is not free** → Out of
  scope by choice; if entry proves too slow, an importer can be added later against a schema that
  already exists, which is the cheaper order.

## Migration Plan

1. Add block definitions, preview components and the collection config; register the collection in
   `payload.config.ts`.
2. Generate the Payload migration locally (R2 plugin off, as the config comments require) and
   commit it.
3. Deploy; the migration creates the lesson table and the per-block tables. Purely additive — no
   existing table is altered, so rollback is dropping the new tables.
4. No data backfill: the collection starts empty and editors fill it.
