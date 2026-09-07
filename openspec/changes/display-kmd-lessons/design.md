## Context

See proposal.md — Why. What shapes the approach technically:

- The repo is two builds in one git repository: the site (`src/`, TanStack Start on Vite, React
  19, Tailwind) and the CMS (`cms/`, Next 16 + Payload 3, React 19). They already talk over the
  CMS's public REST API — `learning.ts` and `useSpeakingContent.ts` both read it with
  `VITE_CMS_URL` — and share no code today.
- The lesson renderer already exists and already anticipates this change.
  `cms/src/components/preview/LessonPreview.tsx` says so in its own comment: built "out of this
  component plus `lessonConverters` and nothing admin-specific, so the eventual public route can
  render the same two files against the same document."
- That renderer has three ties to the CMS: a type import from `@/payload-types`, `TONES` imported
  from the Payload block config `@/blocks/SyllableChain`, and its design tokens living in
  `app/(preview)/preview.css`.
- Those tokens are already a hand-kept copy. `preview.css` and `features/text-color/palette.ts`
  both carry the site's `#cc0000`/`#a30000`/`#fffbf7` palette, each with a comment saying it was
  copied from `src/styles.css` and asking the next person to keep it in sync. Three copies of one
  palette.
- The lesson body is lexical rich text with custom nodes (columns, text colour) and three inline
  blocks. Rendering it needs Payload's JSX converters.
- `bai-kmd` is `read: () => true` today with no draft or version machinery, and has no field that
  could serve as a URL — `baiSo` was dropped in favour of the drag `_order` fractional index.
- Site routes are client-side `useQuery` plus a `head:` block with canonical and og tags
  (`hoc-tap.luyen-noi.$chuDeId.tsx` is the pattern). `sitemap.xml` is a hand-maintained static
  list.

## Goals / Non-Goals

**Goals:**

- One rendering of a lesson, used by both halves of the repo, that cannot drift.
- A lesson address that survives being shared — through re-seeds, environments, and the later
  arrival of progress and navigation.
- Retire the copies: the tokens and the tone list get one home.
- Cost the site nothing it does not already pay: no server rendering of lessons, no new backend,
  no build step beyond what Vite and Next already do.

**Non-Goals:**

- A design of the eventual integrated programme (progress, unlocking, prev/next). This change must
  not make that harder, but does not shape it.
- Restyling the lesson body into Tailwind.
- Any change to how a lesson is composed in the CMS.

## Decisions

### A source-only workspace package, not a built one

`packages/lesson-render` joins the workspace as `@ttv/lesson-render`, with
`"exports": { ".": "./src/index.ts" }` — TypeScript source, no compile step, no `dist`. Vite
compiles workspace source natively; Next needs `transpilePackages: ['@ttv/lesson-render']` in
`cms/next.config.ts` and then does the same.

*Why over a built package:* a build step means a watch process during development, a stale-`dist`
failure mode, and an ordering constraint between two builds that are otherwise independent. The
package has one consumer on each side and both already compile TypeScript and CSS modules.

*Why over the alternatives to a package at all:* copying the four files into `src/` is what the
tokens already did twice, and the comments left behind show how that ends. Serving the lesson page
from the CMS instead would put student content on the CMS origin, outside the site's nav, auth and
theme, which the deferred integration would then have to undo.

### What moves into the package, and the three ties that have to be cut

```
  packages/lesson-render/src/
    Lesson.tsx            <- LessonPreview.tsx, renamed; it is no longer a preview
    lessonConverters.tsx  <- unchanged but for its imports
    Lesson.module.css     <- LessonPreview.module.css
    lessonContent.module.css
    tokens.css            <- the :root block from app/(preview)/preview.css
    tones.ts              <- TONES, moved out of blocks/SyllableChain.ts
    types.ts              <- LessonDoc
```

1. `import type { BaiKmd } from '@/payload-types'` becomes a structural `LessonDoc` the package
   declares: a title, an `amVan` list, and a list of sections each holding lexical JSON. Payload's
   generated `BaiKmd` satisfies it without either side importing the other, and the site never
   needs `payload-types` at all.
2. `TONES` moves into the package and `blocks/SyllableChain.ts` imports it back. Its own comment
   already explains it is exported "so the preview cannot drift from the stored values" — the
   package is a better guarantee of that than a block config, and the dependency now points from
   Payload config into the package rather than the reverse, which is what keeps Payload out of the
   site's bundle.
3. `tokens.css` becomes the palette's one home. `features/text-color/palette.ts` keeps its hex
   literals — they are written into stored content and must stay literal, which its comment
   explains — but derives them from the package rather than transcribing them, so a retuned token
   moves in one place.

*Consequence:* `app/(preview)/preview.css` shrinks to the font and body rules that are genuinely
the preview route's own.

### The site imports Payload's JSX converters directly

`@payloadcms/richtext-lexical` joins the root app's dependencies, for `/react` only.

*Why this is affordable:* that export is a leaf. The whole `lexicalToJSX` subtree is plain React
whose only external imports are `react` and `uuid` — no editor, no lexical core, no
`@payloadcms/ui`. The 14 MB of that package is the editing half and tree-shakes away.

*Why over writing our own walker:* a hand-written lexical-JSON walker starts at maybe 200 lines
and grows every time a lexical feature is added to the editor, and it would be a second renderer —
exactly what the package exists to prevent.

### Slug: derived on write, never re-derived

`slug` is a required, unique, indexed `text` field with a `beforeValidate` hook that fills it from
`title` when blank: lowercase, Vietnamese diacritics folded to ASCII (`đ` → `d`), everything else
collapsed to hyphens. The hook fills a blank slug and never overwrites one that is set.

*Why derive rather than require:* an editor entering fifty lessons should not have to invent fifty
addresses, and a slug typed by hand is the field most likely to end up with a stray diacritic.

*Why never re-derive on rename:* the address is the shared artefact. `learning.ts` already
documents what this costs when it is got wrong — chặng ids "appear in lesson URLs that have been
shared and bookmarked", which is why the whole positional-id scheme exists.

*Why not reinstate `baiSo` for the URL:* it would put a second notion of sequence next to
`_order`, which is the conflict `BaiKMD.ts` removed it to avoid. A slug is an address; `_order` is
the sequence.

### Visibility as one access-controlled checkbox, not drafts

`hienThi` is a `checkbox`, `defaultValue: false`, and the collection's `read` becomes: true for a
signed-in CMS user, `{ hienThi: { equals: true } }` for everyone else.

*Why over `versions: { drafts: true }`:* drafts add a second save button, a published/draft split
on every document and a version table, for a workflow whose whole requirement is "this one is
ready now". The checkbox is one boolean column and one access rule.

*Consequence, accepted:* there is no way to preview an edit before saving it, and no history to
roll back to. The preview route's existing "đã lưu" banner already tells editors the first part.

*Why it is needed at all:* the index page is what turns "no drafts" from harmless into a public
list of half-typed lessons. The gate and the index arrive together.

### Not-found is Payload's empty result, not a 403

The lesson page queries `?where[slug][equals]=…` and treats an empty `docs` array as not found.
Because `read` access filters invisible lessons out of the result rather than rejecting the
request, an invisible lesson and a nonexistent one are the same empty array — the spec's
indistinguishability requirement falls out of the access rule rather than needing its own handling.

### Two queries, two depths

The index asks for `?where[hienThi][equals]=true&sort=_order&depth=0&limit=…` with a `select` of
`title`, `slug` and `amVan`. The lesson asks for `?where[slug][equals]=…&depth=2&limit=1`.

`depth: 2` is what populates the media documents behind rich-text uploads and vocabulary-card
pictures — the preview page's comment records that they "render as nothing if they arrive as bare
ids". Without a `select`, the index would return every lesson's entire lexical body to render a
list of names. Same split as `learning.ts`, which separates structure from images for the same
reason.

### The preview route stays, and the preview button follows visibility

`app/(preview)/xem-truoc/bai-kmd/[id]` stays and now imports `Lesson` from the package.
`admin.preview` returns the public site URL for a lesson that is `hienThi`, and the internal
preview path otherwise — so the button opens the real page once there is one, and still works
before there is.

*Cost:* the CMS needs the site's origin, as a new environment variable. Absent, `admin.preview`
falls back to the internal route, so a missing variable degrades to today's behaviour rather than
producing a broken link.

## Risks / Trade-offs

- **The package is the first shared code between two independent builds; a mistake there breaks
  both** → It is source-only with no build ordering, its API is one component and one type, and
  both consumers are compiled by their own bundler as if the files were local. The blast radius is
  a type error at build time, not a runtime surprise.
- **`transpilePackages` plus CSS modules from `node_modules` is the fiddliest part of the setup**
  → It is a known Next requirement and fails loudly at build; verify the CMS preview route still
  renders before touching the site side.
- **This puts the first CSS modules and the first non-Tailwind styling into `src/`** → Confined to
  the lesson body, which is a self-contained document. The chrome around it stays Tailwind.
  Rewriting 269 working lines into utilities would buy nothing and risk the diagrams.
- **A lesson made visible before it is finished is public immediately, with no history to fall
  back on** → Clearing the checkbox withdraws it and leaves the content untouched. Accepted: a
  version history is a heavier answer than the failure warrants at this scale.
- **The main `kmd-lessons/lesson-model` spec is stale** — it still describes a `baiSo` bài number
  and a ten-type block vocabulary, neither of which the code has had since the editor was reworked
  → This change adds requirements rather than modifying the stale ones, so it neither depends on
  them nor deepens the drift. Correcting them is its own change.
- **Lessons are not in `sitemap.xml`, which is a hand-maintained static list** → Deliberate for
  now: lessons are reached from the index and from shared links. Making the sitemap dynamic is
  part of the deferred integration.

## Migration Plan

1. Create the package and move the four renderer files into it, cutting the three ties. The CMS
   preview route is the proof: it must render identically before anything else proceeds.
2. Add `slug` and `hienThi` to `BaiKMD.ts` with the derivation hook and the read rule; generate
   the additive migration with the R2 plugin off, as the config comments require.
3. Backfill: existing lessons get a slug from their title and stay invisible until an editor ticks
   them. Since `hienThi` defaults false, nothing becomes public by deploying.
4. Add the site routes and the programme card.
5. Point `admin.preview` at the public site and set the origin variable.

Rollback is per step: the site routes and the card are additive and can be removed; the migration
is additive and rolls back by dropping two columns; the package can be inlined back into the CMS
without touching the site, which would still have nothing depending on it until step 4.
