# CMS admin revamp — shell and identity

Design for a complete revamp of the Payload admin panel at `cms/`, so that
non-technical teachers can use it comfortably.

This document covers the decomposition of the whole revamp and specifies
**sub-project 1 (shell and identity)** in full. Sub-projects 2 and 3 get their
own specs later.

## Problem

The panel is stock Payload. Four things are wrong with it, all confirmed with
the product owner:

1. It looks generic — grey chrome, system fonts, nothing that says this is a
   Vietnamese children's school.
2. The structure confuses editors — the sidebar lists raw collections, there is
   no "start here", and the chủ đề → chặng → nội dung → bài nesting is hard to
   hold in your head.
3. The editing controls are fiddly — too many clicks, unclear buttons, schema
   vocabulary in the interface.
4. There is no sense of what you are making — nothing shows how a bài will look
   to a student.

Users are non-technical: teachers filling in bài content, a content team
building the tree, and teachers editing Luyện nói topics. **Desktop/laptop
only** — tablet and phone need only to be usable, not optimised.

## Approach

Keep Payload's admin and its form machinery, and replace its presentation.

The panel is themed through `custom.scss` and Payload's component slots; the
content-editing screens that hurt most later become purpose-built views
registered as Payload custom views, using Payload's own form hooks
(`useForm`, `useField`, `useDocumentInfo`) so autosave, validation and uploads
keep working underneath our layout. This is the same machinery the eight
existing components in `cms/src/components/admin/` already use — an extension
of a working pattern rather than a new architecture.

A bespoke editor app on Payload's API was considered and rejected: it would
re-implement auth, form state, autosave, uploads and validation, and leave a
second surface to keep in sync with the schema, to solve what is a presentation
problem.

## Decomposition

| # | Sub-project | Contents |
|---|---|---|
| 1 | **Shell and identity** (this spec) | Tokens, typography, branding, login, nav, dashboard, vocabulary pass |
| 2 | **The chủ đề workspace** | The tree editor rebuilt as a custom view, with the student preview pane and a work queue for gaps |
| 3 | **The lighter surfaces** | Quyển page, Luyện nói, media library, users |

Sub-project 1 first because the token layer restyles every screen the later
sub-projects touch, and because the existing field components read only
`--theme-*` variables (verified: no hardcoded colours in
`cms/src/components/admin/*.module.css`), so they inherit the new palette with
no code change.

---

# Sub-project 1 — Shell and identity

## 1. Design language

### The override budget

`cms/src/app/(payload)/custom.scss` (currently empty) is imported by
`app/(payload)/layout.tsx` after `@payloadcms/next/css`, and sits outside
`@layer payload-default`. Unlayered declarations beat layered ones, so
everything in that file wins without `!important`. That file plus per-component
CSS modules is the entire theming surface — Payload's SCSS is never forked.

The admin is already pinned to `theme: 'light'` in `payload.config.ts`. There
is no dark ramp to define or maintain.

### Brand colour

The CMS gets its own educational blue. It deliberately does not reuse the
public site's red: the two are different products, and a panel drenched in the
site's brand red is exhausting to work in for hours.

All hex values below were computed from the stated OKLCH coordinates and the
contrast ratios verified against WCAG 2.1. Ratios are symmetric, so each figure
holds both for the colour as ink on white and for white ink on the colour.

| Token | OKLCH | Hex | Contrast vs white | Job |
|---|---|---|---|---|
| `--ttv-blue-900` | `0.30 0.075 250` | `#092f52` | 13.64:1 | Nav sidebar ground, deep headers |
| `--ttv-blue-700` | `0.38 0.11 249` | `#004479` | 9.99:1 | Nav active item ground |
| `--ttv-blue-600` | `0.45 0.13 248` | `#005899` | 7.35:1 | Hover/pressed on primary |
| `--ttv-blue-500` | `0.52 0.14 248` | `#006cb4` | 5.52:1 | **Brand step** — primary buttons, links, focus rings, selection |
| `--ttv-blue-300` | `0.70 0.11 248` | `#64a4e0` | 2.65:1 | Borders and dividers on blue grounds only — never text |
| `--ttv-blue-100` | `0.93 0.04 248` | `#d4ebff` | 1.23:1 | Selected rows, active chips, drop targets |
| `--ttv-blue-50` | `0.975 0.018 248` | `#eef8ff` | 1.08:1 | Hover wash, panel tints |

`--ttv-blue-500` clears AA (4.5:1) both as ink on white and as a ground under
white text, and still clears it (5.13:1) against the page ground below.

### Warm accent

One amber for "needs your attention" states — empty sections, unsaved changes,
"add your first bài" prompts. It keeps the panel from reading cold-corporate
without introducing a second full palette.

| Token | OKLCH | Hex | Contrast vs white | Job |
|---|---|---|---|---|
| `--ttv-amber-700` | `0.50 0.115 70` | `#8c5500` | 6.15:1 | Attention **text** |
| `--ttv-amber-400` | `0.78 0.15 75` | `#efa831` | 2.04:1 | Fills, badges, left borders — never text on white |
| `--ttv-amber-100` | `0.94 0.06 80` | `#ffe8be` | 1.20:1 | Attention panel grounds |

`--color-base-800` ink on `--ttv-amber-400` is 7.06:1, so amber badges carry
dark text, never white.

### Neutral ramp

Payload aliases every light-theme `--theme-elevation-*` straight off
`--color-base-*`, so redefining that ramp repaints every surface, border,
divider and secondary label in one block. The new ramp is the same lightness
progression as Payload's, tinted cool at hue 250 (chroma 0.012 below step 500,
0.020 at and above it):

```
--color-base-0:    #ffffff    --color-base-500:  #77818c
--color-base-50:   #eff6fd    --color-base-550:  #6a737e
--color-base-100:  #e5ecf3    --color-base-600:  #5d6670
--color-base-150:  #d7dee5    --color-base-650:  #4f5862
--color-base-200:  #cad1d8    --color-base-700:  #424b55
--color-base-250:  #bec4cb    --color-base-750:  #343d46
--color-base-300:  #b0b6bd    --color-base-800:  #283039
--color-base-350:  #a3a9b0    --color-base-850:  #1b232b
--color-base-400:  #959ba1    --color-base-900:  #0d151d
--color-base-450:  #888e94    --color-base-950:  #03070f
                              --color-base-1000: #000000
```

`--color-base-0` stays pure white so cards and inputs stay white; the page
ground is set separately via `--theme-bg: #f3f7fc` (Payload declares
`--theme-bg` as its own variable, defaulting to `--theme-elevation-0`).

`--color-base-500` is 3.96:1 on white, below AA for small text. That is parity
with Payload's own default (grey 128, 3.95:1), not a regression, but our own
components use `--color-base-600` (5.83:1) for secondary label text.

### Where the blue lands

Payload's primary button is painted with `--theme-elevation-800`, not a brand
token, so brand colour is not a variable that can be swapped globally. It is an
explicit list:

- `.btn--style-primary` background → `--ttv-blue-500`, hover `--ttv-blue-600`
- the document save bar
- `--accessibility-outline` focus rings → `--ttv-blue-500`
- links
- `::selection` (currently Payload's own blue) → `--ttv-blue-100`
- selected list rows and active chips → `--ttv-blue-100`
- the nav sidebar ground → `--ttv-blue-900`, active item `--ttv-blue-700`

The sidebar is the structural move that does most of the work: it is what stops
the panel reading as stock Payload the moment it loads.

### Typography

Arimo via `next/font/google` at weights 400/500/600/700, bound to
`--font-body`, with fallback `system-ui, sans-serif`. `next/font` self-hosts
the files, so there is no runtime network dependency and no FOUT.

**Never a literal `Arial` anywhere in the stack.** When Arial is not installed
(common on Linux), browsers substitute one face for regular text and a
different one for synthesized bold; the bold substitute often lacks precomposed
Vietnamese diacritics, so bold Vietnamese renders with broken marks. Arimo is
metric-compatible with Arial and ships real bold weights with full Vietnamese
coverage. It is chosen for diacritic safety, not brand continuity — the public
site happens to use it too.

### Density

Body text goes 13px → 15px, and `--style-radius-s/m/l` are softened one step.
Desktop-only means the extra pixels can go to larger targets and roomier rows.

The mechanism is not the `--base-body-size` variable. Payload's root font size
comes from the Sass constant `$baseline-body-size: 13px`, compiled into the
`%body` placeholder; the `--base-body-size` CSS variable only feeds `--base`,
the spacing unit, via `calc((var(--base-px) / var(--base-body-size)) * 1rem)`.
So the change is `html { font-size: 15px }` in `custom.scss`, plus
`--base-px: 22` and `--base-body-size: 15` to keep `--base` at a deliberate
22px rather than letting it drift to 23px as a side effect of the larger root.

Typography is bound through `RootLayout`'s `htmlProps`, which accepts a
`className` — that is what carries `next/font`'s generated CSS variable onto
`<html>`, since `RootLayout` renders the `<html>` element itself.

## 2. Identity

### Assets

The CMS is a separate Next app and cannot import from the site's `src/assets`.
Copy four files into `cms/public/brand/`:

- `buffalo-icon.png` (RGBA, 512×512) — nav icon, favicon
- `logo-wordmark.png` (RGBA, 1462×589) — login screen
- `wave.png`, `pointing.png` — mascot poses for login and empty states

`cms/public/brand/README.md` records that these are copies of
`src/assets/{buffalo-icon,logo-wordmark}.png` and `src/assets/mascot/*.png` in
the root workspace, so a future logo change has a breadcrumb.

**The mascot PNGs are palette images with index transparency and light edge
pixels.** They fringe visibly on dark grounds. They are used on light grounds
only. Anything needing a mascot on blue must be re-exported to RGBA first.

### Component slots

| Slot | Component | Content |
|---|---|---|
| `admin.components.graphics.Logo` | `admin/brand/Logo.tsx` | Wordmark, login screen |
| `admin.components.graphics.Icon` | `admin/brand/Icon.tsx` | Buffalo, nav header (RGBA asset, safe on blue) |
| `admin.components.beforeLogin` | `admin/brand/BeforeLogin.tsx` | School name, one line of orientation, waving buffalo |
| `admin.meta` | config only | Title suffix `· Trường Tiếng Việt Của Em`, buffalo favicon and OG image |

### Voice

A single pass over every user-facing string, replacing schema vocabulary with a
teacher's vocabulary. Three rules:

1. No field names in prose — "Chưa có chủ đề nào", never "chuDes is empty".
2. Every empty state names the next action rather than the absence.
3. Every destructive confirmation says what is lost, concretely — "Xoá chặng
   này và 12 bài bên trong?", not "Are you sure?".

Strings are listed in the appendix so they are reviewable as text.

### Mascot budget

The buffalo appears in exactly three places: the login screen, the dashboard
header, and empty states. Not on every panel — a mascot that is always present
stops being warm and becomes noise.

## 3. Navigation

`admin.components.Nav` is replaced wholesale with a server component. It has to
be a replacement rather than `beforeNavLinks` because the design both groups
items and omits one: Chủ đề must stay routable — every chủ đề page lives at
`/admin/collections/chu-de/:id` — while never appearing in the sidebar.
Payload's `admin.hidden` flag would remove the routes too, so "reachable but
not listed" is only achievable by rendering the list ourselves.

Structure:

```
Trang chính

NỘI DUNG HỌC
  Quyển 1
  Quyển 2
  Luyện nói

THƯ VIỆN
  Hình & âm thanh

QUẢN TRỊ
  Người dùng
```

**Quyển items resolve by slug.** Document ids are Postgres-assigned and differ
between dev and production, so the Nav server component queries `quyen` by the
slugs in `QUYEN_ROSTER` and builds `/admin/collections/quyen/<id>` links at
render time. `QUYEN_ROSTER` stays the single source of truth: adding a third
quyển there makes a third nav item appear with no further edits.

Two renames go into the collection configs themselves, so list views and
breadcrumbs pick them up for free:

- `media` gains `labels: { singular: 'Hình & âm thanh', plural: 'Hình & âm thanh' }`
- `speaking-topics` gains `labels: { singular: 'Chủ đề luyện nói', plural: 'Luyện nói' }`
  (it currently has no Vietnamese label at all)

Alternatives considered and rejected: mirroring the learning tree in the
sidebar (scales badly past 40 chủ đề and duplicates the quyển page), and an
icon rail with a breadcrumb (icon-only rails are the least discoverable option
for non-technical users).

## 4. Dashboard

`admin.components.views.dashboard` is replaced with a server component — a
launchpad, not a report.

Contents, top to bottom:

1. Greeting with the buffalo — "Chào {name} 👋" and one line of orientation.
2. **Nội dung học** — three destination cards (Quyển 1, Quyển 2, Luyện nói),
   each showing how many chủ đề it holds and a button. Chủ đề count only: a
   bài count would mean walking every chủ đề's nested arrays, which is exactly
   the cost this dashboard is designed to avoid.
3. **Cô vừa sửa** — the five most recently updated chủ đề and speaking topics,
   merged, each linking to its own page.

Queries, all cheap — no nested-document walking:

- `payload.count` on `chu-de` grouped per quyển, and on `speaking-topics`
- `payload.find` on `chu-de` and `speaking-topics`, sorted `-updatedAt`,
  `limit: 5`, `depth: 0`, selecting title and `updatedAt` only

A gap-scan work queue ("chặng with no bài", "bài with no hình") was considered
and deferred to sub-project 2: the gaps live inside nested arrays, so it needs
a full scan of every chủ đề document plus caching, and a settled definition of
"incomplete".

### One schema change

`Users` currently has nothing but email, and "Chào cô
tranthanhphuc042@gmail.com" is worse than no greeting. Add an optional `name`
text field (label "Tên", one migration), falling back to the email's local part
when blank.

## 5. Code shape

Everything new lives under the existing `cms/src/components/admin/`, grouped
into folders since that directory is already eight files flat:

```
cms/src/
  app/(payload)/
    custom.scss                  rewritten — tokens, accent placement, density
    layout.tsx                   Arimo bound via next/font/google
    admin/importMap.js           regenerated, committed
  components/admin/
    brand/Logo.tsx  Icon.tsx  BeforeLogin.tsx  *.module.css
    nav/Nav.tsx  navModel.ts  Nav.module.css
    dashboard/Dashboard.tsx  dashboardData.ts  Dashboard.module.css
  collections/Users.ts           + name field
  collections/Media.ts           + labels
  collections/SpeakingTopics.ts  + labels
  payload.config.ts              component slots, meta
  migrations/                    + users.name
cms/public/brand/                copied assets + README.md
```

The eight existing field components stay where they are. Sub-project 2 rewrites
several of them, and moving files now would be churn that makes that diff
harder to read.

Adding components means re-running `pnpm generate:importmap` and committing
`app/(payload)/admin/importMap.js`. That file is generated but tracked, and
forgetting it breaks the panel at runtime rather than at build.

`navModel.ts` and `dashboardData.ts` hold the data shaping as plain modules so
they are testable without rendering React.

## 6. Failure modes

The nav renders on every page and both new components are server components, so
an uncaught throw is a 500 on the admin root rather than a broken widget.

- **Nav**: if the quyển lookup fails or a roster slug has no row yet, that
  group renders its items disabled with a quiet note; the rest of the sidebar
  is unaffected.
- **Dashboard**: each query is guarded independently. A failed count renders
  "—"; a failed recent-edits query degrades to the destination cards alone.
- **Fonts**: `next/font` self-hosts, so there is no request that can fail at
  runtime.

## 7. Testing

- **Integration (vitest)** — `navModel.ts`: roster plus fetched quyển rows
  produce the right items and links, and a missing slug produces a disabled
  item rather than throwing. `dashboardData.ts`: counts and merged recent-edits
  shape, and each query failing independently.
- **E2E (Playwright, already configured)** — login → dashboard shows the three
  destinations → click Quyển 1 → land on that quyển's page.
- **Theme smoke (Playwright)** — the computed `font-family` on `body` and the
  computed background of a primary button resolve to our tokens. Deliberately
  narrow: its job is to fail loudly if a Payload upgrade reverts the skin, not
  to police pixels.

## 8. Out of scope

Named explicitly so this sub-project cannot quietly grow:

- The chủ đề tree editor's behaviour — it inherits the new tokens and nothing
  more
- The student preview pane
- The work queue and its gap scan
- The quyển page's card grid beyond token inheritance
- The media library
- Tablet and phone layouts beyond remaining usable

## Appendix — Vietnamese strings

Reviewable as text. Wording is final unless changed here.

**Login (`beforeLogin`)**

> **Trường Tiếng Việt Của Em**
> Đây là nơi soạn nội dung bài học. Cô đăng nhập để bắt đầu.

**Dashboard**

| Where | String |
|---|---|
| Greeting | `Chào {name} 👋` |
| Greeting sub | `Chọn nơi cô muốn soạn bài hôm nay.` |
| Section | `Nội dung học` |
| Card buttons | `Mở quyển 1` · `Mở quyển 2` · `Mở luyện nói` |
| Card counts | `{n} chủ đề` |
| Section | `Cô vừa sửa` |
| Empty recents | `Cô chưa sửa gì gần đây. Bắt đầu từ một quyển ở trên nhé.` |
| Failed count | `—` |

**Nav**

| Where | String |
|---|---|
| Groups | `Nội dung học` · `Thư viện` · `Quản trị` |
| Items | `Trang chính` · `Quyển 1` · `Quyển 2` · `Luyện nói` · `Hình & âm thanh` · `Người dùng` |
| Quyển unavailable | `Chưa sẵn sàng` |

**Users**

| Where | String |
|---|---|
| `name` label | `Tên` |
| `name` description | `Tên hiển thị khi đăng nhập, ví dụ "cô Lan".` |

**Empty states and confirmations** (existing surfaces, reworded in this pass)

| Where | String |
|---|---|
| No chủ đề in a quyển | `Quyển này chưa có chủ đề nào. Bấm "Thêm chủ đề" để tạo cái đầu tiên.` |
| No chặng | `Chủ đề này chưa có chặng nào. Bấm "Thêm chặng" để bắt đầu.` |
| No phần in a chặng | `Chặng này chưa có phần nào. Bấm “Thêm phần” để bắt đầu.` |
| No hình in a bài | `Bài này chưa có hình. Bấm "Thêm hình" để tải ảnh lên.` |
| Delete chặng | `Xoá chặng "{tên}" và {n} bài bên trong? Không khôi phục được.` |
| Delete chủ đề | `Xoá chủ đề "{tên}" và toàn bộ chặng, bài, hình bên trong? Không khôi phục được.` |
| Delete bài | `Xoá bài "{tên}"? Không khôi phục được.` |
| Load failure | `Không tải được. Cô thử tải lại trang giúp nhé.` |
