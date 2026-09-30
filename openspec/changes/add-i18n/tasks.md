Verification conventions for every task:
- **typecheck**: `bunx tsc --noEmit` passes.
- **leftover grep**: `grep -nP '[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ]' <files> | grep -v '//'`. Every remaining hit is a comment, learning content, or the name "Trường Tiếng Việt Của Em".
- Visual checks in the browser are left to the user. No dev server or screenshots.

## 1. i18n infrastructure

- [x] 1.1 Create `src/i18n/locale.ts` with `LOCALES = ["vi", "en"]`, `DEFAULT_LOCALE = "vi"`, `normalizeLocale(value)`, `parseLocaleCookie(cookieHeader)`, and `LOCALE_COOKIE` attributes (`Path=/; Max-Age=31536000; SameSite=Lax`). Verify with typecheck.
- [x] 1.2 Create `src/i18n/messages/vi.ts` (the `as const` source of truth, starting with `site`, `nav`, `footer`, `errors`, `titles`, and `lang` namespaces) and the `Messages` type that widens leaf literals to `string`. Create `src/i18n/messages/en.ts` typed as `Messages`. Verify that typecheck passes, and that removing one key from `en.ts` makes it fail.
- [x] 1.3 Create `src/i18n/index.tsx` with `messagesFor(locale)`, `I18nProvider`, `useT()`, and `useLocale()` (which returns `{ locale, fmtDate, fmtNumber }` using `Intl` with `vi-VN` or `en-US`). Verify with typecheck.
- [x] 1.4 Create `getLocale` with `createIsomorphicFn()`: `getCookie("locale")` on the server, `document.cookie` on the client, both passed through `normalizeLocale`. Verify with typecheck.
- [x] 1.5 Create `src/i18n/head.ts` with `pageTitle(locale, pick)` and `siteMeta(locale)`. Verify with typecheck.

## 2. Root shell, switcher, and frame (shippable on its own)

- [x] 2.1 In `__root.tsx`, add `beforeLoad: () => ({ locale: getLocale() })`, a comment about `Vary: Cookie` if HTML ever gets cached, and `head: ({ match }) => …` built with `siteMeta(match.context.locale)`. Render `<html lang={locale}>` in `RootShell` and wrap `RootComponent` in `I18nProvider`. Keep JSON-LD `inLanguage: "vi"`. Verify: typecheck passes, and with no cookie `curl -s localhost:<port>/ | grep '<html lang="vi"'` matches. With `-H 'Cookie: locale=en'`, `lang="en"` and the English title are present.
- [x] 2.2 Build `src/components/LanguageSwitcher.tsx` from the existing DropdownMenu primitives: it shows the current language, and the options are "Tiếng Việt" and "English". On select it writes the cookie, calls `router.invalidate()`, and sets `document.documentElement.lang`. Verify with typecheck and lint (`bun run lint`).
- [x] 2.3 Migrate `Navbar.tsx`: resolve the `tabs` labels, "Đăng nhập", the "Học sinh" fallback, dropdown items, `aria-label`s, and the mobile sidebar through `useT()`. Place the switcher on desktop next to the sign-in link or avatar, and add a row for it in the mobile sidebar. Verify with typecheck and a leftover grep on the file.
- [x] 2.4 Migrate `Footer.tsx`: link group titles and labels, the copyright line, and the sponsor text. Verify with typecheck and a leftover grep on the file.
- [x] 2.5 Migrate `ErrorScreen.tsx` (the error and not-found screens). Change `renderErrorPage` to take `(locale)` and read strings from `messagesFor(locale).errors`. Pass `parseLocaleCookie(request.headers.get("cookie"))` from `src/server.ts` and from the `errorMiddleware` in `src/start.ts`. Verify with typecheck and leftover grep on the three files.
- [ ] 2.6 Integration check of phase 2: run `bun run build` successfully and do a curl smoke test of `/`, `/hoc-tap`, and a 404 path with and without `Cookie: locale=en` (check `lang`, `<title>`, and nav labels). Ask the user to check the switcher in the browser, on both desktop and mobile widths.

## 3. Auth and account

- [x] 3.1 Migrate `dang-nhap.tsx`: headings, labels, placeholders, buttons, tab names, zod schemas as `makeSchema(t)` in a `useMemo`, and every `toast.*` title and description. Use `pageTitle` for the title. Verify with typecheck and leftover grep.
- [x] 3.2 Migrate `reset-password.tsx` and `ProfileSetupModal.tsx` in the same way, including validation and toasts. Verify with typecheck and leftover grep.

## 4. Home page

- [x] 4.1 Migrate `index.tsx` (the title) and `components/home/*` (`HomePage`, `MissionCarousel`, `PressNews`, `PressVideo`): headings, body copy, button labels, and `alt` or `aria` text that isn't learning content. Verify with typecheck and leftover grep on each file.

## 5. Học tập hub and learning chrome

- [x] 5.1 Migrate `hoc-tap.tsx`, `hoc-tap.index.tsx`, `components/tabs/*` (`HocTapHome`, `InfoTab`, `InfoHero`, `InfoStats`, `InfoCarousel`, `LearningTab`, `LoTrinhTab`, `ComingSoonTab`), and `components/Mascot.tsx` (if its strings are UI and not content). Verify with typecheck and leftover grep. *Note: `InfoTab` is imported nowhere, and `InfoHero`, `InfoStats`, and `InfoCarousel` are only used by `InfoTab`, so none of them ever render. They were left untouched. `hoc-tap.tsx` and `LoTrinhTab` have no strings.*
- [x] 5.2 Migrate the Quyển routes (`hoc-tap.quyen-{$quyenNumber}.tsx`, `.index.tsx`, `.chu-de-{$chuDeIndex}.tsx`, `hoc-tap_.quyen-{$quyenNumber}_.$changId.tsx`) and the chrome in `components/learning/*` (`LessonPage`, `RoadmapList`, `OverworldMap`, `ImageHighlightOverlay`, `RoadmapSkeleton`, `StarRow`): buttons, progress labels, and lock or empty states. Lesson text, topic and place names, and `src/data/*` stay unchanged. Verify with typecheck, and a leftover grep where every hit left is content.
- [x] 5.3 Migrate `lib/learning.ts`, keeping only its user-facing UI labels (for example status or stage labels). Content labels stay. Verify with typecheck and leftover grep. *Note: the only UI text in this file is the "Chủ đề N: " prefix, which is built into the cached lesson-structure query data. The data is left unchanged, so the cache doesn't depend on locale. Render sites strip the prefix with `chuDeShortTitle` and add the localized `t.learning.topicTitle` instead.*
- [x] 5.4 Migrate `hoc-tap.bang-chu-cai.tsx`, `hoc-tap.tap-viet.tsx` and `components/tap-viet/*`, keeping the letters, words, and TTS text unchanged. Verify with typecheck and leftover grep.
- [x] 5.5 Migrate `hoc-tap.luyen-noi.tsx`, `hoc-tap.luyen-noi.$chuDeId.tsx`, `components/speaking/*`, and the toasts in `hooks/useSpeakingUserProgress.ts`. Check whether the strings in `lib/speech.ts` are UI (error messages) or speech content, and migrate only the UI ones. Verify with typecheck and leftover grep. *Note: `lib/speech.ts` only contains Vietnamese number words used to match speech, which is content, so it's unchanged.*
- [x] 5.6 Migrate `hoc-tap.khai-minh-duc.tsx`, `hoc-tap.khai-minh-duc.$slug.tsx`, and `components/kmd/*`. The `@ttv/lesson-render` package stays untouched. Verify with typecheck and leftover grep.

## 6. Community and data pages

- [x] 6.1 Migrate `bang-xep-hang.tsx` and `san-pham-cua-em.tsx`. Verify with typecheck and leftover grep.
- [x] 6.2 Migrate `u.$username.tsx`, replacing both `toLocaleDateString("vi-VN", …)` calls with `fmtDate`. Verify with typecheck and leftover grep, and that `grep -n '"vi-VN"\|"en-US"' src/routes/u.\$username.tsx` returns nothing. *Note: the three "Học sinh" name fallbacks stay. Each is either written to `profiles.display_name` or slugged into the username (a URL), so it's data, not interface text. The account-deletion confirmation word comes from the catalog ("XÓA" / "DELETE").*
- [x] 6.3 Migrate `dashboard.tsx`, `components/dashboard/StudentReport.tsx`, and `hooks/useStudentReport.ts`, replacing every `toLocaleString("en-US")` with `fmtNumber` and using parameterized messages for counts such as "N học sinh". Verify with typecheck, leftover grep, and the same `"vi-VN"`/`"en-US"` grep over the three files.

## 7. Static information pages

- [x] 7.1 Move the prose of `huong-dan-su-dung.tsx`, `cau-hoi-thuong-gap.tsx`, and `lien-he.tsx` into `pages.*` catalog entries as arrays of sections, then write the English versions. Verify with typecheck and leftover grep.
- [x] 7.2 Do the same for `dieu-khoan-su-dung.tsx` and `chinh-sach-bao-mat.tsx`. ~~Mark the English legal text as a translation, with the Vietnamese version authoritative.~~ *Revised with the user during implementation: both pages already carried the organization's own English version below the Vietnamese one. Each locale now shows only its own version, rendered by a shared `components/site/LegalPage.tsx`. The English uses the existing text as-is, except for a new intro paragraph (the English version never had one). The "last updated" date now appears at the top of both versions and is formatted per locale.* Verify with typecheck and leftover grep.

## 8. Final sweep

- [x] 8.1 Run the leftover grep over all of `src/routes`, `src/components` (excluding `ui/`), `src/hooks`, and `src/lib`. Confirm every remaining hit is a comment, learning content, or the site name, and list any deliberate exceptions in the commit message. Also confirm `grep -rn '—' src/i18n/messages/` returns nothing (no em dashes in copy). *Result: the sweep found two misses, the toasts in `hooks/useUserProgress.ts` and the "Trang chủ" crumb in `site/PageBanner.tsx`, plus the dialog primitive's sr-only "Close". All three are migrated. The remaining hits are deliberate: comments; the site name (logo, curtain, JSON-LD); learning content (`src/data`, spelling words, stroke names, `lib/speech.ts` number words, the "Chủ đề N:" data prefix); press headlines and excerpts quoted verbatim; the "Việt Nam" country name; the stored "Học sinh" name fallbacks; and the dead `tabs/Info*` components. No em dashes are in the catalogs.*
- [ ] 8.2 Run `bunx tsc --noEmit`, `bun run lint`, and `bun run build` successfully. Then hand the English catalog (`src/i18n/messages/en.ts`) to the user for a copy review, and ask them to check a sample of pages in both languages in the browser.

## 9. Added during implementation (user requests)

- [x] 9.1 Rename the "Sản phẩm của em" / "My work" nav item and page to "Góc của em" / "My corner" (catalog keys `nav.myCorner`, `meta.myCorner`). The URL `/san-pham-cua-em` is unchanged. Verified with typecheck.
- [x] 9.2 First-visit language prompt (`components/LanguageWelcome.tsx`, mounted in `__root`): it opens after hydration when there's no `locale` cookie. It's bilingual and shows the hiking Trâu con with flagcdn flags (VN, GB). A choice persists through the shared `i18n/useSwitchLocale`. `FlagImg` gained a 2x `srcSet`. Verified with typecheck and build.
- [x] 9.3 Make the prompt mandatory (no close button, and Escape and outside clicks are blocked), and change `DEFAULT_LOCALE` to `en`. The fallback error page follows the default, and English is listed first in the prompt. The spec, proposal, and design were updated to match. Verified with typecheck and lint.
