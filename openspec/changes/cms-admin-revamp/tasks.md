## 1. The design language

- [x] 1.1 Write the token block into `cms/src/app/(payload)/custom.scss` — the blue ramp, neutral
      ramp, amber attention steps and `--theme-bg` from design.md decision 2, on `:root`, with
      the `base-500` / `blue-300` "not a text colour" comments. Verify the media list — a screen
      with no project components — is repainted, and that no `!important` was needed anywhere.
- [x] 1.2 Override `.btn--style-primary` to the brand step, and add the `:where()`-wrapped link
      and `::selection` rules. Verify a primary button is blue, and that a CSS-module class
      setting its own link colour still wins over the `:where()` rule.
- [x] 1.3 Load Arimo through `next/font/google` in `cms/src/app/(payload)/layout.tsx` with the
      `vietnamese` subset and weights 400/500/700, pass its variable via `htmlProps`, and point
      `--font-body` at it. Verify no font is requested from an outside origin and that a bold
      string containing ệ, ẫ and ỡ renders every diacritic from the same face as regular text.
- [x] 1.4 Set `html { font-size: 15px }` and pin `--base-px` / `--base-body-size` per design.md
      decision 4. Verify the computed value of `--base` is the intended one and did not drift.
- [x] 1.5 Add an e2e check under `cms/tests/e2e/` that reads computed styles on a
      framework-owned screen and asserts body text ≥ 4.5:1 and focus indication ≥ 3:1 against
      their actual backgrounds. Verify with `bun run test:e2e` in `cms/`.

## 2. The shell

- [x] 2.1 Add the nav model — a tested module that returns the top bar's entries: Trang chính,
      one entry per quyển resolved from `QUYEN_ROSTER` slugs, Luyện nói, and the media library;
      chủ đề deliberately absent. Verify with an integration test against a real Payload
      instance that every quyển in the roster produces an entry pointing at that quyển's
      document, and that adding a roster entry adds a nav entry with no other edit.
- [x] 2.2 Build the top-bar component and register it as `admin.components.header`: school mark
      and name at the left, the nav entries in the middle, account control at the right. Verify
      it appears above the content on the dashboard, a collection list and a document edit view.
- [x] 2.3 Register an `admin.components.Nav` that renders nothing, and hide
      `.template-default__nav-toggler-wrapper` in `custom.scss`. Verify no sidebar and no
      hamburger appear at any viewport width above Payload's 768px breakpoint, and that the
      content starts at the left edge of the ground — no reserved empty column.
- [x] 2.4 Confirm a chủ đề is still reachable: follow a chủ đề card from a quyển page, and open
      a chủ đề URL directly. Verify both open the edit screen, and that no chủ đề entry appears
      in the top bar.
- [x] 2.5 Apply the card treatment to the view containers per design.md decision 7 — max width,
      `--color-base-0`, radius, shadow, auto margins — leaving `.template-default__wrap` as the
      ground. Verify on a display wider than the max width that the card is centred with ground
      visible on both sides, and that no view's content is clipped or overflows horizontally.
- [x] 2.6 Restyle Payload's `AppHeader` as the card's breadcrumb trail and hide its account
      control. Verify the trail still shows the correct path on a chủ đề opened from a quyển,
      and that exactly one account control exists on the page.
- [x] 2.7 Add the school branding: `admin.components.graphics.Icon` and `Logo`, a `beforeLogin`
      component, and `admin.meta` with the favicon and title suffix. Verify the sign-in screen
      shows the school's mark and the browser tab shows the icon and the suffix.
- [x] 2.8 Run `bun run generate:importmap` and verify the new `admin.components` entries appear
      in `cms/src/app/(payload)/admin/importMap.js`.

## 3. Bài as flat rows

- [x] 3.1 Add the bài list component as `admin.components.Field` on the `bais` array in
      `ChuDe.ts`, rendering every row always-visible and numbered within its nội dung, with the
      rename input inline. Verify no bài is collapsed on opening a chặng, that typing a name
      does not disturb the row, and that moving a row renumbers both it and the rows it passed.
- [x] 3.2 Delete `BaiRowLabel.tsx`, `BaiRowLabel.module.css`, the `RowLabel` registration, and
      the `NoField` component on the bài `title` field. Verify the panel builds, the rename
      still works from the row, and no orphaned import or importMap entry remains.
- [x] 3.3 Mount `RowMediaProvider` around the active chặng's panel in `ChangTabs.tsx` and render
      each row's first hình from it, lazily, with an empty slot when there is none. Verify in
      the network panel that opening a chặng issues exactly one media request and switching
      chặng issues one more — never one per row.
- [x] 3.4 Add the attachment indications to the row — one each for audio, video and link, shown
      only when set. Verify a bài with audio and a link shows exactly two and no video
      indication, using the same `hasAudio` / `hasVideo` / `hasLink` helpers the predicate uses.
- [x] 3.5 Add the per-row control cluster: move up, move down, duplicate, delete. Wire duplicate
      to `dispatchFields({ type: 'DUPLICATE_ROW', path, rowIndex })` plus `setModified(true)`.
      Verify duplicating a bài with two captioned hình and an audio file produces an independent
      copy directly below it, that renaming the copy leaves the original alone, that move-up on
      the first row is unavailable, and that delete asks for confirmation first.
- [x] 3.6 Add the "Thêm bài" control beneath each nội dung's list. Verify a new row appears at
      the end of that nội dung, is marked as holding nothing, and can be typed into immediately —
      including the `isLoading` shimmer so a fresh row never flashes Payload's stock array UI.
- [x] 3.7 Add the picture slot's set-an-image action, reusing `HinhGallery`'s upload-then-add-row
      pattern. Verify choosing an image for a bài with no hình makes it that bài's first hình and
      shows it in the slot without a save.
- [x] 3.8 Add the bài detail drawer per design.md decision 9, rendering the remaining fields
      through `RenderFields` at the same row path — `HinhGallery` plus the three attachment
      editors with their existing previews. Verify that opening the tenth bài of a long chặng,
      adding a caption and closing returns to the same list, same order, same scroll position,
      with the row reflecting the change.
- [x] 3.9 Restyle `NoiDungSections.module.css` and `ChangTabs.module.css` for the new row height
      and the card's width. Verify rows do not overlap, section headings still read as dividers,
      and a row whose media fails to resolve still renders its number, name, indications and
      controls.

## 4. Gaps

- [x] 4.1 Mark a bài that holds nothing on its row, using `isBaiEmpty` from
      `lib/baiContent.ts` against live form state via `lib/baiFormState.ts` and the amber tokens.
      Verify the marker shows on a bài with nothing, is absent on a bài with only a link, is
      absent on a bài whose image fails to load, and clears the instant a hình is added — before
      saving. Verify it is visually distinct from a selected row.
- [x] 4.2 Show the empty-bài count on each chặng tab in `ChangTabs.tsx` via
      `countEmptyBaiPerChang`. Verify a chặng with none shows no count rather than a zero, and
      that the count clears immediately when the last empty bài is filled — before saving.
- [x] 4.3 Register `emptyBaiCounts` on the `ChuDe` collection's `endpoints`. Verify
      `GET /api/chu-de/empty-bai-counts?quyen=<id>` returns the counts, and that
      `cms/tests/int/emptyBaiCounts.int.spec.ts` passes with `bun run test:int` in `cms/`.
- [x] 4.4 Show that count on each card in `ChuDeGrid.tsx`, leaving cards with none uncounted.
      Verify in the network panel that opening a quyển still fetches only `title` for the chủ đề
      list plus the one counts request — the content tree is not transferred.

## 5. Verification

- [x] 5.1 Add e2e coverage for the journeys the specs describe: telling two same-named bài apart
      without opening either; duplicating a bài and editing the copy independently; walking quyển
      card → chặng tab → empty bài using only the counts; and confirming the shell has a top bar,
      no sidebar, and a card narrower than a wide viewport. Verify with `bun run test:e2e`.
- [x] 5.2 Run `bun run test:int` and `bun run test:e2e` in `cms/` and confirm both pass in full,
      including the pre-existing suites — the token and shell changes touch every screen they
      assert on.
- [x] 5.3 Run `bun run lint` and `bun run generate:types` in `cms/`; confirm lint is clean, the
      types produce no diff, and `cms/src/migrations/` is unchanged — proving no collection
      schema moved.
