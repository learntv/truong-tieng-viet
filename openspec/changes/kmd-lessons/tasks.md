## 1. Collection skeleton

- [x] 1.1 Create `cms/src/collections/BaiKMD.ts` with the lesson document's own fields — `baiSo`
  (number, required, unique, indexed), `title` (text, required), `amVan` (text, `hasMany`) — plus
  Vietnamese labels, `useAsTitle: 'title'`, `defaultSort: 'baiSo'` and `defaultColumns`; verify
  `bun run --cwd cms generate:types` succeeds and the generated types carry the new collection
- [x] 1.2 Register the collection in `cms/src/payload.config.ts` and verify
  `bun run --cwd cms lint` passes and the config type-checks
- [x] 1.3 Add an empty `blocks` field for the lesson body to the collection, wired to a
  `cms/src/blocks/index.ts` barrel that starts out exporting nothing, and verify types still
  generate

## 2. Block definitions and their previews

Each task below delivers one block type *and* its preview component together, per design.md's
"treat block-plus-preview as one unit of work". Each block lives in `cms/src/blocks/<Name>.ts`
with a `ui` field rendering `cms/src/components/admin/kmd/<Name>Preview.tsx` and a co-located CSS
module. Verify each by generating types, running `generate:importmap`, and confirming in the admin
that the block can be added, filled, reordered and removed, and that its preview reflects what was
typed, including when empty.

- [x] 2.1 Build a shared preview shell (the read-only frame and the hook that reads a block's
  sibling values from its own `path`) under `cms/src/components/admin/kmd/`, and verify it renders
  for a block with no values without erroring
- [x] 2.2 `wordList` — heading, guidance note, and a list of words each with an optional `media`
  image (mimeType-filtered); preview shows the words as cards, with pictures where set
- [x] 2.3 `letterIntro` — uppercase form, lowercase form, example tiếng; preview shows the
  letterform pair with its examples
- [x] 2.4 `spellingSteps` — steps of parts → resulting tiếng; preview shows each step's breakdown
- [x] 2.5 `toneTable` — base âm/vần and its six thanh forms; preview shows them as a table
- [x] 2.6 `sentenceReading` — sentences, optional paragraph, optional image; preview shows them in
  reading order
- [x] 2.7 `speakingPrompt` — image and prompting questions; preview shows the picture with its
  numbered questions
- [x] 2.8 `writingPractice` — forms to trace and a guidance note; preview shows the forms
- [x] 2.9 `worksheet` — a lexical `richText` field; preview renders the rich text read-only
- [x] 2.10 `recap` — list of points learned; preview shows them as a list
- [x] 2.11 `homework` — instructions and a completion checklist; preview shows both

## 3. Schema migration

- [x] 3.1 Generate the Payload migration with the R2 plugin off (`NODE_ENV` unset, per the config
  comments) via `bun run --cwd cms payload migrate:create`, and verify the generated file only
  creates new tables — the lesson table and one per block type — and alters no existing table
- [x] 3.2 Apply the migration against a local database and verify a lesson with several blocks
  saves, reloads with its blocks in order, and survives a reorder

## 4. Verification

- [ ] 4.1 Enter one real lesson end to end from a source deck (Bài 48 — it exercises `wordList`
  repeated four times, a vần-group `letterIntro`, and every other block type) and verify each
  section round-trips and previews correctly
- [x] 4.2 Verify a duplicate `baiSo` is rejected on save with a message naming the conflict
- [x] 4.3 Verify the lessons list shows lessons in `baiSo` order with `baiSo` and `amVan` as
  columns, and that filtering by an âm/vần finds the lessons that teach it
- [x] 4.4 Run `bun run --cwd cms lint` and `bun run --cwd cms build` and verify both pass
