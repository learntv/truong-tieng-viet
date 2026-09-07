## 1. The shared package

The order here is deliberate: the CMS preview route is the proof the move was lossless, so it
keeps working at every step and the site is not touched until it does.

- [x] 1.1 Add `packages/*` to the root `package.json` workspaces and scaffold
  `packages/lesson-render` as `@ttv/lesson-render` — source-only, `"exports": { ".":
  "./src/index.ts" }`, `react` as a peer dependency, `@payloadcms/richtext-lexical` as a
  dependency — and verify `bun install` links it into both `node_modules` trees
- [x] 1.2 Move `TONES` and `ToneValue` from `cms/src/blocks/SyllableChain.ts` into
  `packages/lesson-render/src/tones.ts`, have the block import them back, and verify
  `bun run --cwd cms lint` and `generate:types` still pass and the `dauThanh` select still offers
  the six tones in the admin
- [x] 1.3 Add `packages/lesson-render/src/types.ts` declaring the structural `LessonDoc`, and
  verify Payload's generated `BaiKmd` is assignable to it (a type-level assertion that fails the
  CMS type-check if the shapes diverge)
- [x] 1.4 Move `LessonPreview.tsx` → `Lesson.tsx`, `lessonConverters.tsx`, and both CSS modules
  into the package, repointing the type import at `LessonDoc` and the tone import at `./tones`,
  and export `Lesson`, `lessonConverters`, `SECTION_ID_PREFIX` and `LessonDoc` from
  `src/index.ts`
- [x] 1.5 Move the `:root` token block out of `cms/src/app/(preview)/preview.css` into
  `packages/lesson-render/src/tokens.css`, leaving `preview.css` with only the font and body rules
  that are the route's own
- [x] 1.6 Add `transpilePackages: ['@ttv/lesson-render']` to `cms/next.config.ts`, repoint the
  preview page at the package, and verify `/xem-truoc/bai-kmd/<id>` renders an existing lesson
  pixel-identically to before the move — colours, columns, vocabulary card, tạo tiếng chain and
  đánh vần diagram all intact
- [x] 1.7 Derive `cms/src/features/text-color/palette.ts`'s swatches from the package's tokens
  rather than transcribing them, keeping the stored values byte-identical, and verify the colour
  palette in the editor toolbar is unchanged and existing coloured text still renders in its
  original colour
- [x] 1.8 Run `bun run --cwd cms lint` and `bun run --cwd cms build` and verify both pass

## 2. Slug and visibility in the CMS

- [x] 2.1 Add the `slug` field to `cms/src/collections/BaiKMD.ts` — required, unique, indexed,
  Vietnamese label and description — with a `beforeValidate` hook deriving it from `title` when
  blank (lowercase, `đ` → `d`, diacritics folded to ASCII, everything else collapsed to hyphens)
  and never overwriting a slug that is set; verify types generate
- [x] 2.2 Unit-test the slug derivation against the lesson names that exercise it —
  "ONG – ÔNG – UNG – ƯNG" → `ong-ong-ung-ung`, a name with `đ`, a name with punctuation and
  double spaces — and verify the tests pass
- [x] 2.3 Add the `hienThi` checkbox (`defaultValue: false`, Vietnamese label explaining it
  controls public visibility, positioned in the sidebar) and verify a newly created lesson starts
  unticked
- [x] 2.4 Replace `read: () => true` with a rule returning `true` for a signed-in user and
  `{ hienThi: { equals: true } }` otherwise, and verify by unauthenticated request that
  `/api/bai-kmd` lists only ticked lessons and that fetching an unticked lesson by id returns
  nothing rather than a 403
- [x] 2.5 Generate the migration with the R2 plugin off (`NODE_ENV` unset, per the config
  comments) and verify it only adds two columns and their index to the existing lesson table and
  alters nothing else
- [x] 2.6 Apply the migration locally and backfill slugs for lessons already entered, verifying
  each existing lesson has a slug derived from its title and remains unticked
- [x] 2.7 Verify a duplicate slug is rejected on save with a message naming the conflict, and that
  renaming a lesson leaves its existing slug unchanged

## 3. The lesson list

- [x] 3.1 Add `@payloadcms/richtext-lexical` and `@ttv/lesson-render` to the root
  `package.json`, and verify a trivial import of `Lesson` type-checks and that `bun run build`
  succeeds with the lesson CSS modules bundled
- [x] 3.2 Add `src/hooks/useKmdLessons.ts` fetching
  `?where[hienThi][equals]=true&sort=_order&depth=0` with a `select` of `title`, `slug` and
  `amVan`, following `useSpeakingContent.ts`'s `queryOptions` shape, and verify the response
  carries no lexical bodies
- [x] 3.3 Add the index route at `/hoc-tap/khai-minh-duc` listing each lesson by name and âm/vần,
  linking to its slug, with `head:` title, description, og tags and canonical matching
  `hoc-tap.luyen-noi.$chuDeId.tsx`; verify the visible lessons appear in `_order` and unticked
  ones do not
- [x] 3.4 Verify the index shows a "chưa có bài học" message rather than an empty page or an error
  when no lesson is visible, and a loading state consistent with the other `/hoc-tap` pages
- [x] 3.5 Add the Khai Minh Đức card to `src/components/tabs/HocTapHome.tsx` following the existing
  `Item` shape, and verify it renders alongside the four existing programmes and opens the index

## 4. The lesson page

- [x] 4.1 Add `src/hooks/useKmdLesson.ts` fetching `?where[slug][equals]=…&depth=2&limit=1`, and
  verify media behind rich-text uploads and vocabulary-card pictures arrive as documents with
  usable URLs rather than bare ids
- [x] 4.2 Add the lesson route at `/hoc-tap/khai-minh-duc/$slug` rendering `<Lesson>` from the
  package with the package's tokens applied, plus `head:` title from the lesson name, description,
  og tags and canonical; verify a real lesson renders identically to the CMS preview of the same
  lesson
- [x] 4.3 Verify the not-found path: a slug matching nothing and the slug of an unticked lesson
  both show the same "bài học không có sẵn" page with a way back to the index
- [x] 4.4 Verify a visible lesson with no sections shows its name and says it has no sections yet
- [x] 4.5 Verify the page is readable signed out, opens directly without visiting the index first,
  and that its Vietnamese renders with correct diacritics in bold — no literal Arial anywhere in
  the font stack

## 5. Closing the loop

- [x] 5.1 Add the site-origin environment variable to the CMS config and its documented example,
  and make `admin.preview` return the public URL for a `hienThi` lesson and the internal
  `/xem-truoc/bai-kmd/<id>` path otherwise; verify both branches, and that an unset variable falls
  back to the internal route rather than producing a broken link
- [ ] 5.2 Verify end to end with one real lesson: enter it in the CMS, preview it unticked, tick
  it, confirm it appears on the index and renders at its slug, then untick it and confirm the page
  and the index entry both disappear
- [ ] 5.3 Run `bun run lint` and `bun run build` at the root and `bun run --cwd cms lint` and
  `bun run --cwd cms build`, and verify all four pass
