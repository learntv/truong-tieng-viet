## Why

Every piece of UI text is hardcoded in Vietnamese, so parents and children abroad who don't read Vietnamese yet can't find their way around the site: they can't sign in, pick a lesson, or read the help and policy pages. An English interface around the Vietnamese lessons fixes that. The lessons themselves stay in Vietnamese because they are the thing being learned.

## What Changes

- Add a locale layer with two locales, `vi` and `en` (default; changed from `vi` at the user's request during implementation). UI strings move out of components into typed message catalogs. The English catalog must have every key the Vietnamese one has, and the build fails if a key is missing.
- Resolve the locale from a `locale` cookie in the root route, on both the server and the client. SSR renders the chosen language directly, including `<html lang>`, `<title>` and meta descriptions, so no Vietnamese text flashes before English loads. URLs don't change: `/hoc-tap` serves both languages.
- Add a language switcher to the Navbar (desktop and mobile sidebar). It writes the cookie and re-renders the current page in place, without a full reload.
- Migrate UI chrome to the catalogs, page by page: Navbar, Footer, error and 404 screens (including the static `renderErrorPage` fallback), sign-in and reset-password forms and their validation messages, toasts, profile setup, the home page, the Học tập hub pages, the leaderboard, profile pages, the dashboard, and the static pages (guide, FAQ, contact, terms, privacy).
- Format dates and numbers with the active locale instead of the hardcoded `"vi-VN"` and `"en-US"` values.
- Out of scope: lesson and CMS content (Payload collections, `@ttv/lesson-render`), learning data in `src/data/*` (alphabet, words, topic and place names), TTS and speech, and Payload admin localization. These stay in Vietnamese in both locales.

## Capabilities

### New Capabilities
- `i18n`: locale resolution and persistence via cookie, SSR-consistent rendering in the chosen locale, the language switcher, message catalogs with vi/en parity, locale-aware formatting, and the rule for what gets translated (UI chrome) and what stays Vietnamese (learning content).

### Modified Capabilities
<!-- None. The existing specs (cms-admin, kmd-lessons) cover CMS/lesson content, which stays Vietnamese-only. -->

## Impact

- **New code**: `src/i18n/` (locale config, cookie helpers, `vi`/`en` catalogs, `useT` hook and provider), plus a `LanguageSwitcher` component.
- **Root route** (`src/routes/__root.tsx`): `beforeLoad` resolves the locale into router context, `RootShell` renders `lang={locale}`, and `head()` reads localized titles and descriptions. Every route `head()` that sets a title moves to localized titles.
- **Static error page** (`src/lib/error-page.ts`): takes a locale read from the request cookie in `src/server.ts` and `src/start.ts`.
- **Most files under `src/components` and `src/routes`**: string literals are replaced with catalog lookups. Hooks that raise toasts (e.g. `useSpeakingUserProgress`) get messages through the catalog.
- **Dependencies**: none new. The catalogs are plain typed TS modules (see design.md).
- **Caching and SEO**: HTML now varies by the `locale` cookie. Crawlers and first-time visitors have no cookie, so they get English (first-time visitors are then asked to choose). **This changes what search engines index: English instead of the current Vietnamese.** No `hreflang` alternates because there are no per-locale URLs.
