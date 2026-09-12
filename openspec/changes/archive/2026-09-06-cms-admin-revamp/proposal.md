## Why

The CMS is stock Payload wearing a few custom fields. Its shell is Payload's dark sidebar and
schema-shaped nav; `cms/src/app/(payload)/custom.scss` is a 0-byte file that the layout already
imports after Payload's own stylesheet, so the whole theming surface sits unused. Teachers who
are not Payload users open a panel that looks like a developer tool and reads like a database.

The editing surface has the same problem one level down. A bài is a collapsible row
(`initCollapsed: true`) whose header shows only its title — and titles are instructions that
repeat: measured across Quyển 1, its 173 bài share 75 distinct titles, and the single string
"Nhìn hình, nghe và nhắc lại" labels 26 different rows. Finding a particular bài means opening
rows until the right one appears, and 12 of those 173 bài hold nothing at all — no hình, no
audio, no video, no link — with no way to see that without opening every one.

The reference the school wants is Wordwall's content editor: a thin top bar, one wide card on a
light ground, and the items you are editing as a flat numbered list of always-open rows, each
with its picture slot inline and its own reorder / duplicate / delete controls.

## What Changes

- **The panel gets a design language.** A token layer in `custom.scss` redefining Payload's
  `--color-base-*` ramp, brand steps and attention steps, plus a Vietnamese-safe self-hosted
  webfont — so every screen is repainted from one file, including the ones we will never write
  components for (media list, account page).
- **The sidebar is replaced by a top bar.** **BREAKING** for anyone used to Payload's nav:
  logo and school name at the left, a short set of horizontal links in the middle, account at
  the right. Below it, content sits on one centred card against a tinted ground instead of
  running edge-to-edge. Chủ đề stays routable but stops being listed — teachers reach one
  through its quyển, never through a collection list.
- **A bài becomes a flat row.** Bài stop being collapsibles you open. Each is one always-visible
  row in a numbered list: its name, an inline image slot showing the first hình, slots for the
  audio / video / link attachments, and a per-row control cluster — reorder, duplicate, delete —
  sitting outside the row the way the reference does. "Thêm bài" is a text button under the list.
  Duplicating a bài is new; there is no way to copy one today.
- **Empty bài are visible, and the count rolls upward.** A bài holding nothing is marked on its
  row; a chặng tab shows how many it holds; the chủ đề cards on a quyển page show the same count
  — so the 12 can be found without opening four documents.

Non-goals, so the change stays reviewable: no change to the stored shape of any document and no
database migration; no student-facing preview of a bài; no change to the quyển roster or the
access rules; the public site under `src/` is untouched.

## Capabilities

### New Capabilities

- `cms-admin/visual-identity`: The panel's design language — colour ramp, brand and attention
  steps, typography, density, and the override mechanism they are delivered through.
- `cms-admin/panel-shell`: The chrome every admin screen sits in — the top bar and what it
  carries, what is listed in it and what is deliberately not, and the page's card-on-ground
  layout.
- `cms-admin/bai-editing`: How a bài is edited — the flat always-open row, the inline image and
  attachment slots, the per-row reorder / duplicate / delete controls, and how bài are added.
- `cms-admin/content-gaps`: What counts as a bài that holds nothing, how it is marked, and how
  the count rolls up to chặng tabs and chủ đề cards.

### Modified Capabilities

<!-- None. openspec/specs/ is empty; all four capabilities above are new. -->

## Impact

**Code**

- `cms/src/app/(payload)/custom.scss` — 0 lines today; becomes the token layer plus the handful
  of Payload class overrides the shell needs.
- `cms/src/app/(payload)/layout.tsx` — loads the webfont and passes its variable to `RootLayout`.
- `cms/src/payload.config.ts` — gains `admin.components` entries for the replacement `Nav`,
  brand graphics and `meta`; `ChuDe` gains the counts endpoint.
- New: a top-bar `Nav` component and the nav model behind it; a flat-row bài list component.
- `cms/src/components/admin/BaiRowLabel.tsx` and its CSS module are superseded by the flat row —
  the rename input they own moves into it.
- `cms/src/components/admin/ChangTabs.tsx`, `NoiDungSections.tsx`, `ChuDeGrid.tsx` — gain gap
  counts; restyled by inheritance otherwise.
- `HinhGallery`, `TextCloud`, `AudioPreview`, `YouTubePreview`, `LinkPreview` keep their
  interaction model and are repainted through the tokens.

**Already on disk, unwired, and absorbed by this change**

`cms/src/lib/baiContent.ts` (the "is this bài empty" predicate), `cms/src/lib/baiFormState.ts`
(reading bài out of live form state), `cms/src/endpoints/emptyBaiCounts.ts` and
`cms/src/components/admin/RowMedia.tsx` (one batched media lookup per chặng) exist but nothing
imports them into the panel. They were written for a superseded plan; this change wires them up
rather than rewriting them.

**Data and dependencies**

No collection schema changes, so `cms/src/migrations/` is untouched and deploy needs no
migration step. `Media` declares `upload: true` with no `imageSizes`, so the original file is
the only image variant — whether the inline slots need a thumbnail size is settled in design.md.

**Verification**

`cms/tests/int/` and `cms/tests/e2e/` cover the admin; new behaviour is asserted there rather
than by screenshot review.
