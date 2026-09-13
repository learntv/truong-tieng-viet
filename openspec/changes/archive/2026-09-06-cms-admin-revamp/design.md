## Context

See proposal.md — Why. The constraints that shape the approach, each verified in the installed
Payload 3.88 build rather than assumed:

- **The theming surface is open and unused.** `cms/src/app/(payload)/custom.scss` is 0 bytes and
  `app/(payload)/layout.tsx` imports it *after* `@payloadcms/next/css`. Payload's compiled CSS
  opens with `@layer payload-default, payload;` and wraps every rule in that layer
  (`next/dist/prod/styles.css`), so an unlayered declaration outranks any layered one regardless
  of specificity or source order. Nothing here needs `!important` and Payload's SCSS is never
  forked. The corollary bites too: an unlayered rule also outranks our own CSS-module classes,
  so any broad selector has to be wrapped in `:where()` to zero its specificity.
- **The light theme derives from one ramp.** Payload aliases every light-theme
  `--theme-elevation-*` off `--color-base-*`, and the panel is pinned to `theme: 'light'` in
  `payload.config.ts`. There is no dark ramp to define.
- **`--theme-bg` is separable from the card surface.** `scss/app.scss:19` declares
  `--theme-bg: var(--theme-elevation-0)`, and `.template-default` and `.template-default__wrap`
  both paint it. Redefining it alone moves the page ground without touching white cards.
- **The default font stack literally names Arial.** `--font-body` in `scss/app.scss` is
  `-apple-system, …, Arial, sans-serif`. This is the exact trap that broke bold Vietnamese on
  the public site: with Arial absent the browser synthesises bold from a substitute face that
  drops precomposed marks (ệ, ẫ, ỡ).
- **Root font size is a Sass constant, not a variable.** `$baseline-body-size: 13px` in
  `scss/vars.scss:17` is compiled into `%body` at `scss/type.scss:97`. `--base-body-size` only
  feeds the spacing unit `--base` through
  `calc((var(--base-px) / var(--base-body-size)) * 1rem)`. Changing density means setting
  `html { font-size }` *and* keeping those two variables in step, or `--base` drifts as a side
  effect.
- **The shell has two component slots at different depths.**
  `next/dist/templates/Default/index.js` renders `admin.components.header` *outside* the nav
  grid, above everything; `admin.components.Nav` renders as the grid's first column, and
  Payload's own `AppHeader` — which carries the StepNav breadcrumbs — renders inside
  `.template-default__wrap` above the view.
- **An absent nav costs no layout.** `.template-default` is `grid-template-columns: 0 auto`
  and only becomes `var(--nav-width) auto` under `--nav-open`. A Nav that renders nothing
  reserves nothing.
- **`admin.hidden` would break chủ đề.** It removes the routes as well as the listing, and every
  chủ đề lives at `/admin/collections/chu-de/:id`. "Reachable but not listed" is only obtainable
  by rendering the nav ourselves.
- **The array primitives we need are already exposed.** `useForm()` gives `addFieldRow`,
  `removeFieldRow`, `moveFieldRow` and `dispatchFields`; Payload's own array field implements
  duplicate as `dispatchFields({ type: 'DUPLICATE_ROW', path, rowIndex })` followed by
  `setModified(true)` (`ui/dist/fields/Array/index.js:162`), which copies the whole subtree —
  hình, captions and attachments — with no hand-written state copying.
- **`Drawer`, `DrawerToggler` and `useDrawerSlug` are exported** from `@payloadcms/ui`.
- **Four components already exist and are wired to nothing:** `lib/baiContent.ts` (the empty
  predicate), `lib/baiFormState.ts` (rebuilding bài from Payload's flat form state),
  `endpoints/emptyBaiCounts.ts` (per-chủ-đề counts; not registered on the `ChuDe` collection),
  and `components/admin/RowMedia.tsx` (one batched media lookup per chặng). They were written
  for a superseded plan and are correct for this one.
- **Only the active chặng is mounted.** `ChangTabs` renders `{activeRow && …}`, so a per-chặng
  provider is scoped for free and the bài rows of inactive chặng cost nothing.
- **`Media` has no `imageSizes`.** The original file is the only variant: 141 images, average
  64 KB, largest 264 KB.

## Goals / Non-Goals

**Goals:**

- One file to change a colour, one file to change the nav, one function to decide "empty".
- A shell that is composed from Payload's own slots, so a framework upgrade is an upgrade and
  not a merge.
- Flat bài rows that cost one media request per chặng, not one per row.
- Reuse the four already-written modules rather than reinventing them.

**Non-Goals:**

- Any change to stored document shape, and therefore no database migration.
- Rewriting `HinhGallery`, `TextCloud`, `AudioPreview`, `YouTubePreview` or `LinkPreview`. They
  read only `--theme-*` variables, so they are repainted by inheritance.
- A generic "content health" framework. Exactly one condition is reported.
- Responsive/mobile design. This panel is used on laptops; below Payload's 768px breakpoint the
  shell falls back to whatever the framework does.

## Decisions

### 1. The whole design language is an unlayered block in `custom.scss`

Redefine `--color-base-0…900`, the brand and attention steps, `--theme-bg`, `--font-body` and
the density variables on `:root` in `custom.scss`. Because Payload derives every
`--theme-elevation-*` from `--color-base-*`, that block repaints surfaces, borders, dividers and
secondary text on every screen — including the media list and the account page, which have no
project components and never will.

Broad element selectors in this file (link colour, selection) are wrapped in `:where()` so they
keep specificity (0,0,0): they must beat Payload's layered defaults but lose to our own CSS
modules, which resolve to (0,1,0).

*Alternatives:* forking Payload's SCSS — rejected, every upgrade becomes a merge. Styling only
through per-component CSS modules — rejected, it cannot reach framework-owned screens, which the
visual-identity spec requires.

### 2. Palette: the CMS keeps its own blue

Not the public site's red. The site's red is what students and families see; the panel is an
internal tool a teacher sits in for hours, and a glance at the screen should say which of the
two products you are looking at.

The ramp holds hue 250 across brand and neutrals so the panel reads as one temperature. Chroma
at each step sits just inside the sRGB gamut boundary for that lightness — a more saturated blue
at these lightnesses cannot be displayed and would be silently clipped, so the stated OKLCH and
the stated hex would stop agreeing. Contrast is symmetric, so each figure holds both for the
colour as ink and for white ink on the colour.

| Token | OKLCH | Hex | vs white | vs `base-50` | Job |
|---|---|---|---|---|---|
| `--ttv-blue-800` | `0.38 0.100 250` | `#0a4475` | 10.01:1 | 9.45:1 | Pressed states, deep headings |
| `--ttv-blue-700` | `0.44 0.117 250` | `#0d5590` | 7.77:1 | 7.33:1 | Hover on primary |
| `--ttv-blue-600` | `0.48 0.127 250` | `#1260a2` | 6.54:1 | 6.17:1 | Links on tinted grounds |
| `--ttv-blue-500` | `0.52 0.138 250` | `#146bb4` | 5.51:1 | 5.20:1 | **Brand step** — primary buttons, links, focus ring, selection |
| `--ttv-blue-300` | `0.72 0.115 250` | `#6aaaea` | 2.47:1 | 2.33:1 | Borders on blue grounds only — **never text** |
| `--ttv-blue-100` | `0.92 0.038 250` | `#d2e7fe` | 1.26:1 | 1.19:1 | Selected rows, active chips, drop targets |
| `--ttv-blue-50` | `0.97 0.013 250` | `#eff6fe` | 1.09:1 | 1.03:1 | Hover wash, panel tints |

| Neutral | OKLCH | Hex | vs white | Job |
|---|---|---|---|---|
| `--color-base-0` | `1 0 0` | `#ffffff` | — | Cards, inputs |
| `--color-base-50` | `0.98 0.004 250` | `#f6f9fb` | 1.06:1 | Page ground (`--theme-bg`) |
| `--color-base-100` | `0.955 0.006 250` | `#edf0f4` | 1.14:1 | Section tints |
| `--color-base-150` | `0.925 0.008 250` | `#e2e7eb` | 1.25:1 | Hairlines |
| `--color-base-200` | `0.89 0.009 250` | `#d6dbe1` | 1.39:1 | Borders |
| `--color-base-300` | `0.80 0.011 250` | `#b9bec5` | 1.87:1 | Strong borders |
| `--color-base-400` | `0.70 0.013 250` | `#999fa6` | 2.67:1 | Disabled ink, placeholders |
| `--color-base-500` | `0.60 0.014 250` | `#7a8188` | 3.94:1 | Icons — **not a text colour** |
| `--color-base-600` | `0.50 0.014 250` | `#5d646b` | 5.99:1 | Secondary text |
| `--color-base-700` | `0.42 0.013 250` | `#484e54` | 8.45:1 | Body text |
| `--color-base-800` | `0.33 0.011 250` | `#31363b` | 12.20:1 | Headings |
| `--color-base-900` | `0.24 0.009 250` | `#1c2023` | 16.44:1 | Maximum ink |

Amber carries "needs your attention", a separate hue from the brand so an empty bài never reads
as merely *selected*.

| Attention | OKLCH | Hex | vs white | `base-900` on it | Job |
|---|---|---|---|---|---|
| `--ttv-amber-700` | `0.50 0.115 70` | `#8c5500` | 6.15:1 | — | "Chưa có gì" **text** |
| `--ttv-amber-400` | `0.78 0.15 75` | `#efa831` | 2.04:1 | 8.04:1 | Badge fill, left border — never text on white |
| `--ttv-amber-100` | `0.94 0.06 80` | `#ffe8be` | 1.20:1 | 13.70:1 | Empty-row ground |

Every pairing the specs require clears AA: body text `base-700` on `base-50` is 7.98:1, white on
the brand step 5.51:1, the focus ring 5.20:1 against the page ground, amber badges carry
`base-900` ink at 8.04:1 and never white. `base-500` and `blue-300` sit below 4.5:1 by design
and carry a comment in the token block saying so.

Payload paints its primary button with `--theme-elevation-800`, not a brand token, so brand
colour is not swappable through the ramp alone: `.btn--style-primary` is overridden explicitly.

*Alternative:* an accentless neutral panel — rejected, it leaves no consistent colour for focus,
selection and primary actions.

### 3. Typography: Arimo, self-hosted through `next/font/google`

The public site already uses Arimo, it has real 400/500/700 Vietnamese weight files, and it is
metric-compatible with Arial. `next/font/google` in the `(payload)` layout self-hosts the files
at build time — no external origin, no synthesised bold — and its generated variable reaches the
`<html>` element through `RootLayout`'s `htmlProps`, which is the only hook we have on an element
`RootLayout` owns.

*Alternatives:* keeping Payload's stack — rejected, it names Arial (see Context). A `<link>` to
Google Fonts — rejected: an extra origin and a flash of fallback text for nothing.

### 4. Density is set on `html`, with the spacing unit pinned

Set `html { font-size: 15px }` for a panel a teacher reads all day, and set `--base-px` /
`--base-body-size` together so `--base` lands on a deliberate value rather than drifting as a
side effect of the root change (see Context for why the two are unrelated mechanisms).

### 5. The top bar is `admin.components.header`; the Nav slot renders nothing

`header` is the only slot that renders outside the nav grid and above every view, which is
exactly where a full-width top bar belongs. It is a server component, so it can resolve the
quyển roster itself from the `payload` instance Payload passes it.

`admin.components.Nav` is replaced with a component that renders nothing. No column has to be
reserved or unreserved: the grid is already `0 auto` while the nav is closed. Payload's
hamburger wrapper is hidden in `custom.scss`.

*Alternatives:* forking `DefaultTemplate` — rejected, it is the one piece of the framework we
would then own forever. Keeping the sidebar and only restyling it — rejected by the design
direction.

### 6. Payload's `AppHeader` stays, and becomes the card's trail

`AppHeader` renders inside `.template-default__wrap` and already carries StepNav breadcrumbs —
"Quyển 1 › Chào hỏi" — which is the trail the reference screenshot puts at the top of its card.
Keeping it means the breadcrumb stays correct on every view Payload adds, for free. Its account
control is hidden, because the top bar now carries one and two would be confusing.

### 7. The card is applied to view containers, not to `__wrap`

`.template-default__wrap` already paints `--theme-bg`, so it is the ground with no change beyond
the token. The card — `--color-base-0`, a max width, auto margins, radius and a soft shadow —
goes on the view's own container (`.document-fields`, the list view's container, the dashboard).

Not on `__wrap` itself: Payload sets `.template-default .template-default__wrap { min-width: 100% }`,
which fights a max width, and `__wrap` also contains the nav overlay pseudo-element.

*Risk accepted:* this is a short list of Payload class names rather than a variable, and it is
where a framework upgrade would most plausibly break. It is guarded by e2e assertions, not by
hope — see Risks.

### 8. The bài list is a replacement `Field` component on the `bais` array

Take the whole array over the way `ChangTabs`, `NoiDungSections` and `HinhGallery` already do:
`admin.components.Field` on `bais`, driving Payload's own `useForm` / `useField` /
`RenderFields`. This is what buys flat always-open rows — Payload's array row is a collapsible
by construction, and the current `RowLabel` hook can only decorate its header.

`BaiRowLabel.tsx` and its CSS module are deleted; the rename input they own moves into the row.
The `NoField` placeholder on the bài `title` field goes with it — the new component chooses what
it renders, so a field does not need to render nothing to stay out of the way.

The cost is re-implementing add / delete / reorder / duplicate, and it is small because
`useForm()` already exposes all four primitives (see Context). Duplicate in particular is one
dispatch that copies the whole subtree.

*Alternative:* keep Payload's rows and force them open with CSS — rejected: the per-row control
cluster, the picture slot and the numbering all have to live in DOM Payload owns, and the
collapse toggle sits behind the header intercepting clicks.

### 9. The rest of a bài opens in a drawer

The bai-editing spec requires the list not to reorder, hide or collapse when a bài's detail is
opened, and to return to the same place. An in-row expander would reintroduce exactly the
collapsible this change removes, and would push every row below it down the page.

So: `Drawer` from `@payloadcms/ui`, holding the bài's remaining fields rendered through
`RenderFields` against the same row path — `HinhGallery` for the hình and captions, and the three
attachment editors with their existing previews. Nothing about those components changes; they
are rendered somewhere else.

*Alternative:* a separate route per bài — rejected: a bài is not a document, it is an array row
inside a chủ đề, and routing to one would mean leaving and re-entering the form.

### 10. One batched media lookup per chặng, via the existing provider

`RowMedia.tsx` is already written to do this: it collects the hình ids under one chặng from form
state and issues a single `GET /api/media?where[id][in]=…&select=url,filename,mimeType`. It is
mounted around the active chặng's panel in `ChangTabs`, and rows read the resolved URL from
context. Scoping is free because only the active panel is mounted.

*Alternative:* one fetch per row — rejected, ~40 requests per chặng.

### 11. Thumbnails come from the original files; no `imageSizes`, no migration

A chặng averages ~7 hình, so a tab costs roughly 450 KB of lazily-loaded images. Adding an
`imageSizes` thumbnail means a schema migration plus re-processing 141 existing production files
for a saving that does not change whether the feature is usable.

*Revisit if* a chặng grows past ~20 hình, or Quyển 2 arrives with much heavier artwork.

### 12. "Empty" stays one pure function, and the endpoint gets registered

`lib/baiContent.ts` already holds the predicate and `lib/baiFormState.ts` already rebuilds bài
from Payload's flat form state; the row marker and the chặng counts call them against live state
so they update before save, and `endpoints/emptyBaiCounts.ts` calls the same predicate
server-side. The only thing missing is registration: `ChuDe` has no `endpoints` array today, so
the endpoint is currently unreachable.

The quyển grid's counts come from that endpoint rather than a deeper REST `select`, because
`ChuDeGrid` deliberately asks for `title` alone — requesting the fields needed to judge emptiness
would pull most of the quyển's content down the wire to display four numbers.

*Alternative:* a stored, hook-maintained counter on the chủ đề — rejected: it needs a migration,
and a counter that can go stale is worse than one computed on demand for four documents.

## Risks / Trade-offs

- **Overriding `--color-base-*` reaches screens nobody looks at.** A framework component could
  pair two tokens whose new values fall below AA. → The ramp keeps Payload's own lightness
  progression, so relative relationships are preserved; an e2e check asserts computed contrast on
  framework-owned screens, not only on ours.
- **The shell depends on Payload's class names** (`.template-default__nav-toggler-wrapper`,
  `.document-fields`, `.app-header__*`) and on the two component slots keeping their positions.
  A minor upgrade could move any of them. → The e2e suite asserts the observable results — no
  sidebar, one top bar, a card narrower than the viewport — so a rename fails a test rather than
  quietly un-styling the panel. Overrides stay on documented custom properties wherever a
  property exists.
- **Taking over the `bais` array means owning its behaviour.** Add, delete, reorder, duplicate,
  validation display and the loading state of a freshly added row are ours now. → Every one is
  built on the primitives Payload's own array field uses, and `ChangTabs` / `NoiDungSections`
  are two working precedents in this repo, including the `row.isLoading` shimmer that keeps a
  new row from flashing the stock editor.
- **A drawer hides the list while it is open.** That is the trade for not disturbing it. →
  Acceptable: the spec's requirement is about returning to the same place, and a drawer returns
  exactly.
- **Full-size images as row thumbnails**, ~450 KB per chặng. → Lazy loading plus only the active
  chặng being mounted. Measured, not assumed; revisit trigger in decision 11.
- **A rare marker is a marker nobody looks for.** Twelve rows in 173 is the point, but it earns
  its keep only if the roll-up counts make them findable — which is why the counts are in this
  change and not a follow-up.
- **`worktree-cms-admin-shell` implements a different answer to the same question.** That branch
  builds a grouped *sidebar* and a slightly different blue. It is deliberately not a dependency
  of this change. → Whoever implements this should not merge it; if it is ever merged, these two
  shells conflict directly and one has to be dropped.

## Migration Plan

No database migration. No collection schema changes, so `cms/src/migrations/` is untouched and
production needs no migration step at deploy; `bun run generate:types` should produce no diff.

`bun run generate:importmap` must be re-run, because `admin.components` gains entries.

Deploy is a normal CMS deploy. Rollback is a revert: nothing is written to the database by this
change and no stored document is reshaped, so a revert restores the previous panel exactly.

Verification is `bun run test:int` and `bun run test:e2e` in `cms/`; no screenshot review is
expected of the implementer.

## Open Questions

- Whether the amber attention colour should later cover other unfinished states — a hình with no
  caption, or a chặng with no nội dung. Deferrable: it reuses tokens this change defines and
  would not alter these specs.
- Whether the top bar needs a search or a "recently edited" affordance once teachers use it.
  Cannot be answered before the shell exists.
