## Context

- TanStack Start (React 19, TanStack Router) with SSR, deployed to Cloudflare via nitro. `src/server.ts` wraps the Start handler and renders a static HTML fallback (`src/lib/error-page.ts`) for catastrophic SSR failures. `src/start.ts` has a request middleware that renders the same page.
- `src/routes/__root.tsx` owns `<html lang="vi">`, the site-wide `head()` (title, description, OG/Twitter, JSON-LD), Navbar, Footer, and the `Toaster`.
- About 20 routes set their own `head()` title in the form `"<Page> | Trường Tiếng Việt Của Em"`.
- UI strings are inline literals spread across roughly 60 files under `src/routes`, `src/components`, `src/hooks`, and `src/lib`. Some live in module-level constants (`tabs` in Navbar, `ABOUT_LINKS` in Footer, zod schemas in `dang-nhap.tsx`), and some are raised outside React (toasts in hooks).
- `src/data/*` and `@ttv/lesson-render` hold learning content, which stays Vietnamese (see specs/i18n).
- Project conventions for any new copy, including English: no em dashes in UI text, minimal copy with no invented subtitles, never a literal Arial font.

## Goals / Non-Goals

**Goals:**
- One typed, dependency-free message layer usable from components, `head()`, module-level config, and non-React code.
- Locale known before the first byte of HTML is rendered, on both the server and the client, so nothing flashes or mismatches.
- Migration can land page by page: an unmigrated page keeps working, it's just still in Vietnamese.

**Non-Goals:**
- ICU/plural engine, RTL, or more than two locales. The design leaves room to add a third locale later but doesn't build for it.
- `Accept-Language` detection. Without a cookie the site renders English (the default, changed from Vietnamese during implementation), so crawlers, cached responses, and shared links stay deterministic. First-time visitors then choose in a mandatory welcome dialog.
- Syncing the preference to the Supabase profile. The cookie is per-browser. This can be added later without spec changes.
- Translating the Payload admin or any CMS field.

## Decisions

### 1. In-house typed catalogs instead of i18next or Paraglide
`src/i18n/messages/vi.ts` is the source of truth: a nested object `as const`, namespaced by area (`nav`, `footer`, `auth`, `errors`, `home`, `hocTap`, `leaderboard`, `profile`, `dashboard`, `pages.faq`, …). `en.ts` is typed as `Messages`, which is derived from `vi` with the leaf string literals widened to `string`, or to the same function signature for parameterized messages. A missing or extra key is then a `tsc` error, which is how the spec's catalog-completeness requirement is met.

Parameterized messages are plain functions, for example `studentsCount: (n: number) => \`${fmtNumber(n)} học sinh\``. This handles plurals and word order per language with no ICU parser. Long static pages (terms, privacy, guide, FAQ) are catalog entries holding arrays of `{ title, body }` sections, so the route renders structure and the catalog holds prose.

- *Alternative: i18next + react-i18next.* It adds a runtime dependency and string keys with weak typing, and its interpolation and plural features aren't needed for two locales.
- *Alternative: Paraglide JS.* It has compile-time tree-shaking and an official TanStack Start example, but it adds a compiler step to a Lovable-managed Vite config that says not to add plugins, and it pulls in an `AsyncLocalStorage` middleware. Its tree-shaking gain is small at this size.
- Both catalogs ship to the client. Their estimated size is a few tens of KB before gzip, which is acceptable. Lazy-loading `en` is a possible later optimization.

### 2. Locale is resolved in root `beforeLoad` and carried in router context
A `getLocale` built with `createIsomorphicFn()` reads the `locale` cookie with `getCookie` from `@tanstack/react-start/server` on the server, and parses `document.cookie` on the client. Either way it normalizes the value to `"vi" | "en"` and falls back to `vi`. The root route's `beforeLoad` returns `{ locale }`, so every route's `head({ match })` and loader can read `match.context.locale`, and components read it through the provider below.

- *Alternative: a server function called from `beforeLoad`.* That costs an RPC on every client navigation just to read a cookie the browser already has.
- *Alternative: React state only.* `head()` can't read React context, and the SSR pass needs the value before render.

### 3. `I18nProvider` + `useT()` for components; `messagesFor(locale)` for everything else
`RootComponent` wraps the tree in `I18nProvider value={locale}` using the route context. `useT()` returns the active catalog (`t.nav.home`), and `useLocale()` returns the code plus formatters (`fmtDate`, `fmtNumber`, built on `Intl` with `vi-VN` or `en-US`). `RootShell` renders `<html lang={locale}>`.

Module-level constants that hold labels (Navbar `tabs`, Footer link groups) keep their structure (routes, icons) and swap `label: string` for a key or a `(t) => string` accessor, resolved at render time. Zod schemas that carry messages become `makeSchema(t)` factories inside the component, wrapped in `useMemo` on `t`.

Hooks that fire toasts (for example `useSpeakingUserProgress`) call `useT()` in the hook body and close over `t`. Toasts raised from non-hook functions receive the message as an argument from their caller.

### 4. Localized `head()` through a helper
`src/i18n/head.ts` exports `pageTitle(locale, t => t.titles.leaderboard)`, which appends the localized site name, and `siteMeta(locale)` for the root description, OG, and Twitter tags. The JSON-LD `inLanguage` stays `"vi"` because it describes the organization and its content, not the interface.

### 5. Switching: write cookie, then `router.invalidate()`
The `LanguageSwitcher` sets `document.cookie = "locale=en; Path=/; Max-Age=31536000; SameSite=Lax"` and calls `router.invalidate()`. That re-runs root `beforeLoad`, which reads the new cookie, updates context, re-renders with the new catalog, and re-evaluates `head()`. It then sets `document.documentElement.lang`, since the shell `<html>` doesn't re-render on the client.

Data queries don't depend on locale, so the React Query cache survives the switch and in-page state is preserved.

UI: a compact control in the Navbar, next to the sign-in link or the avatar on desktop and as a row in the mobile sidebar. It shows the current language and a menu that labels each option in its own language ("Tiếng Việt", "English"). It reuses the existing DropdownMenu primitives and the Navbar's white-on-green styling. There's no flag icon, because a language isn't a country.

### 6. Fallback error page reads the cookie from the raw request
`renderErrorPage(locale)` takes a locale. `src/server.ts` and `src/start.ts` parse `locale` from the request's `Cookie` header with a tiny shared `parseLocaleCookie(header)` helper in `src/i18n/locale.ts`. They can't use `getCookie` because in `server.ts` the Start handler, and its request context, may have failed. The strings come from the same catalog (`t.errors.generic`), so there's one source.

### 7. Migration order
Phase 1 is the infrastructure, the switcher, the root shell and head, Navbar, Footer, error and 404 screens, and the fallback page. That's enough to ship: the frame is bilingual and everything else is still Vietnamese. Later phases migrate one area per commit, as listed in tasks.md. Each commit leaves the app building and every page rendering.

## Risks / Trade-offs

- **[HTML varies by cookie, so a shared cache could serve the wrong language]** → SSR HTML isn't cached at the edge today (only `api.tts`, `api.avatar`, and the sitemap set Cache-Control). If HTML caching is ever added, it has to include `Vary: Cookie` or bypass the cache when a `locale` cookie is present. Add a comment next to the root `beforeLoad` noting this.
- **[Hydration mismatch if server and client read different cookies]** → Both read the same cookie through one normalization function, and the switcher writes the cookie before invalidating. An HttpOnly cookie would break the client read, so the cookie is deliberately not HttpOnly (it isn't sensitive).
- **[Strings missed during migration show up in Vietnamese on English pages]** → After each phase, run a grep for Vietnamese diacritics in the changed files, excluding comments and `src/data`. Any remaining hits have to be learning content. Add the grep command to tasks.md.
- **[English copy quality and tone]** → The Vietnamese copy addresses the child as "em". English uses a plain, friendly second person. The user reviews the English catalog before the phase ships.
- **[`head()` title flicker on switch]** → `router.invalidate()` recomputes `head()` in the same pass, so the title changes together with the content.
- **[Bundle size]** → Both catalogs ship. This is acceptable now. Lazy-loading `en` is a later option if the bundle size ever matters.

## Migration Plan

This is additive and deploys with the app. There's no data migration. Without a cookie the site now renders English, so the first deploy changes the language existing visitors see until they choose (the welcome dialog asks each of them once). Rollback is a normal revert. Leftover `locale` cookies do nothing once the code is gone.

## Open Questions

- Should the English site name be translated ("My Vietnamese School") or kept as the proper noun "Trường Tiếng Việt Của Em"? The default is to keep the proper noun. Either way this is one catalog value, and nothing else depends on it.
