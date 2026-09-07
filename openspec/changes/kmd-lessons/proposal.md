## Why

The Khai Minh Đức (KMD) curriculum — over 50 phonics lessons — exists only as PowerPoint decks.
Each deck is 20–25 slides walking the same pedagogical script (nhận biết âm/vần → đánh vần →
luyện đọc → luyện nói → luyện viết → phiếu bài tập → trò chơi → dặn dò), repeated once per âm or
vần the lesson teaches. Nothing in the CMS can hold that shape: a bài carries one image gallery
and three optional attachments, which cannot express a lesson made of a dozen distinct
instructional sections. Digitalizing KMD needs a home of its own.

## What Changes

- A new standalone collection holds one document per KMD bài. It is **independent of the existing
  quyển → chủ đề → chặng → nội dung → bài tree** and does not modify it.
- A KMD lesson is composed as an **ordered, reorderable list of typed blocks**, one block type per
  recurring instructional section. Editors pick from a fixed vocabulary of section types named
  after the pedagogy they already know, rather than filling a blank canvas.
- Ten block types cover the sections observed across the source decks:
  `wordList` (ôn bài cũ, luyện đọc từ, trò chơi, đọc nhanh), `letterIntro` (nhận biết âm/vần),
  `spellingSteps` (đánh vần, tạo tiếng), `toneTable` (phiếu luyện đọc sáu thanh),
  `sentenceReading` (luyện đọc câu/đoạn), `speakingPrompt` (luyện nói),
  `writingPractice` (luyện viết), `worksheet` (phiếu bài tập), `recap` (củng cố),
  `homework` (dặn dò).
- Lessons are a **flat list ordered by bài number** — no grouping level above them.
- Each block type renders a **live inline preview** beneath its fields, so an editor sees the
  shape of what they are building instead of typing into labelled inputs blindly. The preview is a
  loose functional mockup, not a facsimile of the original slide styling.
- Images in blocks are uploads against the **existing `media` collection**; no new upload
  infrastructure.
- Content is entered **by hand**. No importer parses the `.pptx` files.

Deferred, explicitly out of scope: the "Lên Sáu / Lên Tám" poem excerpts and their illustrations
that open each deck; a whole-lesson preview mode that renders every block in sequence; any
student-facing frontend that reads these lessons.

## Capabilities

### New Capabilities

- `kmd-lessons/lesson-model`: what a KMD lesson document is — its identity and ordering, the
  block vocabulary it is composed from, and what each block type holds.
- `kmd-lessons/block-previews`: how each block shows an editor what it will look like while they
  fill it in.

### Modified Capabilities

None. The existing `cms-admin` capabilities are untouched — this change adds a parallel
collection and changes nothing about how quyển, chủ đề, chặng, nội dung or bài are edited.

## Impact

- New collection config under `cms/src/collections/`, registered in `cms/src/payload.config.ts`.
- New block definitions and per-block preview components under `cms/src/components/admin/`,
  following the existing `AudioPreview` / `YouTubePreview` / `LinkPreview` pattern.
- A Payload migration adding the collection's tables (`cms/src/migrations/`).
- Reuses the `media` collection and its R2-backed storage unchanged.
- No change to the Supabase-facing shape of the existing learning tree, and no consumer of the
  existing collections is affected.
