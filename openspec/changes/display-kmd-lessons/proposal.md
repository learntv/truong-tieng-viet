## Why

The Khai Minh Đức lessons can now be composed in the CMS, but nothing reads them. The only
rendering that exists is an admin-only preview behind the Payload login, so a teacher who has
digitalized a bài has no way to put it in front of a student. The renderer for a lesson is already
written and was deliberately built free of anything admin-specific for exactly this moment — what
is missing is a public page to run it in, and a stable address to link to.

## What Changes

- KMD lessons become **readable on the public site**: an index at `/hoc-tap/khai-minh-duc` and a
  lesson page at `/hoc-tap/khai-minh-duc/<slug>`, reached from a new programme card on `/hoc-tap`
  alongside Quyển 1, Quyển 2, Bảng chữ cái and Luyện nói.
- A lesson gains a **slug** — unique, indexed, derived from its title when left blank, editable —
  so its URL is a readable, stable address rather than a database id. Ordering stays with the
  existing drag `_order`; the slug is an address, not a sequence.
- A lesson gains a **visibility flag** (`hienThi`), off by default, which gates public reads. An
  editor ticks it when the lesson is ready. This is a single checkbox, **not** Payload drafts or
  version history: entry of 50+ lessons happens over weeks, and without a gate the index would
  list whatever an editor started typing this morning.
- The lesson renderer moves out of the CMS into a **shared workspace package** consumed by both
  halves of the repo, so the admin preview and the public page are the same code and cannot drift.
  The package also becomes the single home for the design tokens and the tone list that are
  currently transcribed by hand into three files, each carrying a comment asking the next person
  to keep them in sync.
- The admin **preview button** points at the public page once a lesson is visible, and the
  existing `/xem-truoc/bai-kmd/<id>` route stays for checking a lesson that is not yet visible.

Deferred, explicitly out of scope: learning progress, unlocking, prev/next navigation between
bài, sitemap entries, and any tie between KMD lessons and the quyển → chủ đề → chặng tree.

## Capabilities

### New Capabilities

- `kmd-lessons/lesson-page`: how a reader reaches a KMD lesson and what the site shows them — the
  programme card, the index of visible lessons, the lesson page at its own address, and what
  happens when a lesson is missing or not visible.

### Modified Capabilities

- `kmd-lessons/lesson-model`: a lesson gains a unique slug that is its public address, and a
  visibility flag that decides whether the public can read it.

## Impact

- New `packages/lesson-render` workspace holding the lesson renderer, its stylesheet, the design
  tokens and the tone list, moved out of `cms/src/components/preview/` and
  `cms/src/app/(preview)/preview.css`. Root `package.json` gains `packages/*`; `cms/next.config.ts`
  gains `transpilePackages`.
- `cms/src/collections/BaiKMD.ts` gains two fields, a slug hook and a read-access rule; one
  additive migration under `cms/src/migrations/`.
- `cms/src/blocks/SyllableChain.ts` and `cms/src/features/text-color/palette.ts` import from the
  package instead of holding their own copies.
- New routes and a lesson-content hook under `src/routes/` and `src/hooks/`, reading the existing
  public `/api/bai-kmd` endpoint the same way `useSpeakingContent.ts` reads speaking topics. The
  root app gains `@payloadcms/richtext-lexical` for its JSX converters — a leaf export pulling in
  only `react` and `uuid`, not the editor.
- `src/components/tabs/HocTapHome.tsx` gains a card.
- No change to the quyển → chủ đề → chặng → nội dung → bài tree, to student progress, or to any
  existing route.
