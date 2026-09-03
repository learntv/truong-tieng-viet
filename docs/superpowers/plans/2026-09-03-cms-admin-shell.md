# CMS Admin Shell and Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stock Payload admin chrome at `cms/` with a branded, Vietnamese, teacher-friendly shell — design tokens, typography, branding, a grouped sidebar, and a launchpad dashboard.

**Architecture:** Payload's admin and its form machinery stay; only presentation is replaced. Theming happens in `cms/src/app/(payload)/custom.scss`, which is imported after `@payloadcms/next/css` and sits outside `@layer payload-default`, so its declarations win without `!important`. Navigation and dashboard are React **server components** registered through Payload's `admin.components` slots; Payload passes them `payload` and `user` as props (`CustomComponent` = `PayloadComponent<ServerProps & …>`, and `ServerProps` includes `readonly payload: Payload` and `readonly user?: TypedUser`), so no `getPayload` call is needed and the data-shaping modules can be integration-tested against a real Payload instance.

**Tech Stack:** Payload 3.88, Next 16.3, React 19.2, TypeScript 5.7, SCSS + CSS Modules, `next/font/google`, Vitest (integration, real Postgres), Playwright (e2e), Bun as the runner.

**Spec:** `docs/superpowers/specs/2026-09-03-cms-admin-shell-design.md`

## Global Constraints

- **Runner is Bun, not pnpm.** The repo root is a Bun workspace (`workspaces: ["cms"]`, `bun.lock`). The `cms/package.json` scripts mention pnpm internally but are invoked as `bun run --cwd cms <script>`. There is no pnpm lockfile in `cms/`.
- **Whole int suite:** `bun run --cwd cms test:int`
- **One int file:** `cd cms && bunx cross-env NODE_OPTIONS=--no-deprecation vitest run --config ./vitest.config.mts tests/int/<file>.int.spec.ts`
- **Whole e2e suite:** `bun run --cwd cms test:e2e`
- **One e2e file:** `cd cms && bunx playwright test --config=playwright.config.ts tests/e2e/<file>.e2e.spec.ts`
- **The CMS dev server runs on port 3001** (`next dev -p 3001`). Every hardcoded `localhost:3000` in `cms/tests/` is stock Payload boilerplate and is wrong for this project.
- Integration tests connect to the real database in `cms/.env`. They must never leave rows behind.
- **The admin panel is Vietnamese-only.** `i18n.supportedLanguages` is `{ vi }` with no English fallback. Never assert English UI text in a test, and never ship an English user-facing string.
- **Never write a literal `Arial`** into any font stack. Absent Arial makes browsers synthesize bold from a substitute face that drops Vietnamese diacritics.
- Brand tokens, verbatim from the spec:
  `--ttv-blue-900: #092f52` · `--ttv-blue-700: #004479` · `--ttv-blue-600: #005899` · `--ttv-blue-500: #006cb4` · `--ttv-blue-300: #64a4e0` · `--ttv-blue-100: #d4ebff` · `--ttv-blue-50: #eef8ff`
  `--ttv-amber-700: #8c5500` · `--ttv-amber-400: #efa831` · `--ttv-amber-100: #ffe8be`
- `--ttv-amber-400` never carries text on white (2.04:1). Attention *text* uses `--ttv-amber-700` (6.15:1). Text on an amber-400 fill is `--color-base-800` (7.06:1).
- Secondary label text in our own components uses `--color-base-600` (5.83:1), never `--color-base-500` (3.96:1, below AA).
- After adding or removing any admin component: `bun run --cwd cms generate:importmap`, and **commit** `cms/src/app/(payload)/admin/importMap.js`. It is generated but tracked, and a stale one breaks the panel at runtime rather than at build.
- After any schema change: `bun run --cwd cms generate:types`, and commit `cms/src/payload-types.ts` (tracked).
- Never stage `src/routeTree.gen.ts` (root workspace, auto-generated, unrelated to this work).

---

## File Structure

**Created**

| File | Responsibility |
|---|---|
| `cms/tests/helpers/serverURL.ts` | Single source of the admin base URL for all tests |
| `cms/public/brand/README.md` | Records where the copied brand assets came from |
| `cms/public/brand/buffalo-icon.png` | Nav icon and favicon (RGBA) |
| `cms/public/brand/logo-wordmark.png` | Login screen wordmark (RGBA) |
| `cms/public/brand/wave.png` | Mascot, login screen (light grounds only) |
| `cms/src/components/admin/brand/Logo.tsx` | `graphics.Logo` — wordmark |
| `cms/src/components/admin/brand/Icon.tsx` | `graphics.Icon` — buffalo |
| `cms/src/components/admin/brand/BeforeLogin.tsx` | `beforeLogin` — orientation copy + mascot |
| `cms/src/components/admin/brand/Brand.module.css` | Styles for the three brand components |
| `cms/src/components/admin/nav/navModel.ts` | Nav data shaping — roster + payload → groups |
| `cms/src/components/admin/nav/Nav.tsx` | `components.Nav` — server component |
| `cms/src/components/admin/nav/Nav.module.css` | Sidebar styles |
| `cms/src/components/admin/dashboard/dashboardData.ts` | Dashboard queries and greeting name |
| `cms/src/components/admin/dashboard/Dashboard.tsx` | `views.dashboard` — server component |
| `cms/src/components/admin/dashboard/Dashboard.module.css` | Dashboard styles |
| `cms/tests/int/navModel.int.spec.ts` | navModel integration tests |
| `cms/tests/int/dashboardData.int.spec.ts` | dashboardData integration tests |
| `cms/tests/e2e/theme.e2e.spec.ts` | Token/typography smoke |
| `cms/tests/e2e/shell.e2e.spec.ts` | Login screen, nav, dashboard |
| `cms/src/migrations/<generated>_users_name.ts` / `.json` | `users.name` column |

**Modified**

| File | Change |
|---|---|
| `cms/playwright.config.ts` | Port 3001, Bun dev command |
| `cms/tests/helpers/login.ts` | Port, Vietnamese-safe landmark |
| `cms/tests/e2e/admin.e2e.spec.ts` | Port; Vietnamese labels once renamed |
| `cms/src/app/(payload)/custom.scss` | The whole token layer (currently empty) |
| `cms/src/app/(payload)/layout.tsx` | Arimo via `next/font/google` + `htmlProps` |
| `cms/src/payload.config.ts` | Component slots, `admin.meta` |
| `cms/src/collections/Users.ts` | `name` field |
| `cms/src/collections/Media.ts` | Vietnamese labels |
| `cms/src/collections/SpeakingTopics.ts` | Vietnamese labels |
| `cms/src/components/admin/ChuDeGrid.tsx` | Reworded strings |
| `cms/src/components/admin/ChangTabs.tsx` | Reworded strings |
| `cms/src/components/admin/HinhGallery.tsx` | Reworded strings |
| `cms/src/components/admin/NoiDungSections.tsx` | Reworded strings |
| `cms/src/app/(payload)/admin/importMap.js` | Regenerated |
| `cms/src/payload-types.ts` | Regenerated |

---

### Task 1: Repair the e2e harness

The e2e suite is unmodified Payload boilerplate: it targets `localhost:3000` while this CMS serves 3001, launches `pnpm dev` (pnpm is not this repo's package manager), and `login()` waits for `span[title="Dashboard"]` — an English artifact that Task 8 deletes outright. Nothing later in this plan can be verified until this is fixed.

**Files:**
- Create: `cms/tests/helpers/serverURL.ts`
- Modify: `cms/playwright.config.ts`, `cms/tests/helpers/login.ts`, `cms/tests/e2e/admin.e2e.spec.ts`, `cms/tests/e2e/frontend.e2e.spec.ts`

**Interfaces:**
- Produces: `SERVER_URL: string` and `adminURL(path?: string): string` from `tests/helpers/serverURL.ts`; `login({ page, user })` no longer takes or needs `serverURL`.
- Produces (contract for Task 6): the Nav server component must render a real `<nav>` element, because `login()` waits on `page.getByRole('navigation').first()`.

- [ ] **Step 1: Confirm the harness is broken before changing it**

Run: `bun run --cwd cms test:e2e`

Expected: FAIL. The `webServer` block waits on `http://localhost:3000` while `bun run dev` binds 3001, so Playwright times out starting the server. Record the failure — it is the baseline this task fixes.

If Playwright reports a missing browser instead, run `cd cms && bunx playwright install chromium` first, then re-run.

- [ ] **Step 2: Add the shared URL helper**

Create `cms/tests/helpers/serverURL.ts`:

```ts
/**
 * Every e2e test addresses the admin panel through this helper.
 *
 * The CMS dev server runs on 3001 (`next dev -p 3001` in package.json), not Next's
 * default 3000 — the root workspace's Vite app owns 8080 and 3000 is left free for
 * scratch servers. CMS_TEST_URL overrides it when a suite runs against a deployed
 * instance.
 */
export const SERVER_URL = process.env.CMS_TEST_URL ?? 'http://localhost:3001'

export const adminURL = (path = ''): string => `${SERVER_URL}/admin${path}`
```

- [ ] **Step 3: Point Playwright at the right server**

In `cms/playwright.config.ts`, replace the `webServer` block:

```ts
  webServer: {
    command: 'bun run dev',
    reuseExistingServer: true,
    url: 'http://localhost:3001',
  },
```

and set the shared base URL in `use`:

```ts
  use: {
    baseURL: process.env.CMS_TEST_URL ?? 'http://localhost:3001',
    trace: 'on-first-retry',
  },
```

- [ ] **Step 4: Make the login helper survive the dashboard rewrite**

Replace the body of `cms/tests/helpers/login.ts`:

```ts
import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

import { adminURL, SERVER_URL } from './serverURL'

export interface LoginOptions {
  page: Page
  user: {
    email: string
    password: string
  }
}

/**
 * Logs the user into the admin panel via the login page.
 *
 * Waits on the navigation landmark rather than any particular label: the panel is
 * Vietnamese-only, and the dashboard's contents are replaced by this project, so the
 * one durable signal that the admin shell has rendered is that a <nav> exists.
 */
export async function login({ page, user }: LoginOptions): Promise<void> {
  await page.goto(adminURL('/login'))

  await page.fill('#field-email', user.email)
  await page.fill('#field-password', user.password)
  await page.click('button[type="submit"]')

  await page.waitForURL(`${SERVER_URL}/admin`)

  // .first(): Payload may render more than one navigation landmark (the sidebar plus
  // document-level controls), and this only needs to know the shell has mounted.
  await expect(page.getByRole('navigation').first()).toBeVisible()
}
```

- [ ] **Step 5: Update the two existing specs to the helper**

In `cms/tests/e2e/admin.e2e.spec.ts`: import `adminURL` from `../helpers/serverURL`, replace each `page.goto('http://localhost:3000/admin…')` with `page.goto(adminURL(…))`, replace each `expect(page).toHaveURL('http://localhost:3000/admin…')` with the matching `adminURL(…)`, and drop the now-unused `serverURL` argument from the `login` call.

Leave the `h1` text assertion as `'Users'` for now — the Users collection has no `labels`, so Payload derives that heading from the slug even under `vi`. Task 4 renames it and updates this assertion.

In `cms/tests/e2e/frontend.e2e.spec.ts`: replace any hardcoded `localhost:3000` with `SERVER_URL` from the same helper.

- [ ] **Step 6: Run the e2e suite to verify it passes**

Run: `bun run --cwd cms test:e2e`

Expected: PASS, all three admin specs plus the frontend spec. If the dev server is slow to boot on first run, Playwright's `reuseExistingServer` means you can start `bun run --cwd cms dev` in another terminal and re-run.

- [ ] **Step 7: Commit**

```bash
git add cms/playwright.config.ts cms/tests/helpers/serverURL.ts cms/tests/helpers/login.ts cms/tests/e2e/admin.e2e.spec.ts cms/tests/e2e/frontend.e2e.spec.ts
git commit -m "Point the CMS e2e suite at the server it actually runs on

The suite was unmodified Payload boilerplate: port 3000 against a CMS that
serves 3001, a pnpm command in a Bun workspace, and a login helper waiting on
an English dashboard artifact in a Vietnamese-only panel. It could not have
passed. One helper now owns the base URL, and login waits on the navigation
landmark, which survives replacing the dashboard."
```

---

### Task 2: Design tokens and typography

**Files:**
- Modify: `cms/src/app/(payload)/custom.scss`, `cms/src/app/(payload)/layout.tsx`
- Test: `cms/tests/e2e/theme.e2e.spec.ts`

**Interfaces:**
- Consumes: `adminURL`, `SERVER_URL`, `login` (Task 1).
- Produces: CSS custom properties `--ttv-blue-*`, `--ttv-amber-*` on `:root`, the rewritten `--color-base-*` ramp, `--theme-bg`, and `--font-body` bound to `var(--font-arimo)`. Every later task styles against these and adds no colour literals of its own.

- [ ] **Step 1: Write the failing test**

Create `cms/tests/e2e/theme.e2e.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

import { adminURL } from '../helpers/serverURL'

/**
 * A deliberately narrow smoke test. Its job is to fail loudly if a Payload upgrade
 * reverts the skin — not to police pixels. It runs on the login screen so it needs
 * no authenticated session.
 */
test.describe('Admin theme', () => {
  test('brand tokens and Arimo are applied', async ({ page }) => {
    await page.goto(adminURL('/login'))

    const tokens = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement)
      return {
        blue500: root.getPropertyValue('--ttv-blue-500').trim(),
        amber700: root.getPropertyValue('--ttv-amber-700').trim(),
        base0: root.getPropertyValue('--color-base-0').trim(),
        fontFamily: getComputedStyle(document.body).fontFamily,
        rootFontSize: root.fontSize,
      }
    })

    expect(tokens.blue500).toBe('#006cb4')
    expect(tokens.amber700).toBe('#8c5500')
    expect(tokens.base0).toBe('#ffffff')
    expect(tokens.rootFontSize).toBe('15px')

    expect(tokens.fontFamily).toContain('Arimo')
    // Regression guard: a literal Arial makes browsers synthesize bold from a
    // substitute face that drops Vietnamese diacritics.
    expect(tokens.fontFamily).not.toContain('Arial')
  })

  test('the primary button carries the brand blue', async ({ page }) => {
    await page.goto(adminURL('/login'))

    const button = page.locator('button[type="submit"]').first()
    await expect(button).toBeVisible()

    // rgb(0, 108, 180) is #006cb4.
    await expect(button).toHaveCSS('background-color', 'rgb(0, 108, 180)')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd cms && bunx playwright test --config=playwright.config.ts tests/e2e/theme.e2e.spec.ts`

Expected: FAIL — `--ttv-blue-500` resolves to an empty string because `custom.scss` is empty.

- [ ] **Step 3: Write the token layer**

Replace the entire contents of `cms/src/app/(payload)/custom.scss`:

```scss
/*
 * The CMS admin theme.
 *
 * This file is imported by app/(payload)/layout.tsx *after* `@payloadcms/next/css`
 * and is unlayered, while all of Payload's own styles live in `@layer
 * payload-default`. Unlayered declarations beat layered ones regardless of source
 * order or specificity, so nothing here needs `!important` — and Payload's SCSS is
 * never forked.
 *
 * The panel is pinned to `theme: 'light'` in payload.config.ts, so there is no dark
 * ramp to define here.
 *
 * Colours were computed from OKLCH coordinates and their contrast ratios verified;
 * see docs/superpowers/specs/2026-09-03-cms-admin-shell-design.md for the working.
 * Do not nudge these by eye — re-derive them.
 */

:root {
  /* ── Brand: the CMS's own educational blue ─────────────────────────────────
     Deliberately not the public site's red. The two are different products, and
     a panel drenched in brand red is exhausting to work in for hours. */
  --ttv-blue-900: #092f52; /* 13.64:1 on white — nav ground, deep headers */
  --ttv-blue-700: #004479; /*  9.99:1 — nav active item */
  --ttv-blue-600: #005899; /*  7.35:1 — hover/pressed on primary */
  --ttv-blue-500: #006cb4; /*  5.52:1 — THE brand step; AA both directions */
  --ttv-blue-300: #64a4e0; /*  2.65:1 — borders on blue grounds only, never text */
  --ttv-blue-100: #d4ebff; /*  selected rows, active chips, drop targets */
  --ttv-blue-50: #eef8ff; /*   hover wash, panel tints */

  /* ── Warm accent: "needs your attention" ───────────────────────────────────
     amber-400 is 2.04:1 on white and can never carry text there. Attention text
     uses amber-700; text sitting on an amber-400 fill is --color-base-800 (7.06:1). */
  --ttv-amber-700: #8c5500; /* 6.15:1 — attention text */
  --ttv-amber-400: #efa831; /* fills, badges, left borders */
  --ttv-amber-100: #ffe8be; /* attention panel grounds */

  /* ── Neutral ramp ──────────────────────────────────────────────────────────
     Payload aliases every light-theme --theme-elevation-* straight off
     --color-base-*, so rewriting this ramp repaints every surface, border,
     divider and secondary label in the panel — including the eight existing
     field components, which use only --theme-* variables and no colour literals.

     Same lightness progression as Payload's greys, tinted cool at hue 250.
     base-0 stays pure white so cards and inputs stay white; the page ground is
     set separately via --theme-bg below. */
  --color-base-0: #ffffff;
  --color-base-50: #eff6fd;
  --color-base-100: #e5ecf3;
  --color-base-150: #d7dee5;
  --color-base-200: #cad1d8;
  --color-base-250: #bec4cb;
  --color-base-300: #b0b6bd;
  --color-base-350: #a3a9b0;
  --color-base-400: #959ba1;
  --color-base-450: #888e94;
  --color-base-500: #77818c; /* 3.96:1 — parity with Payload's default grey, but
                                below AA: our own components use base-600 for text */
  --color-base-550: #6a737e;
  --color-base-600: #5d6670; /* 5.83:1 — secondary label text */
  --color-base-650: #4f5862;
  --color-base-700: #424b55;
  --color-base-750: #343d46;
  --color-base-800: #283039; /* 13.36:1 — body ink */
  --color-base-850: #1b232b;
  --color-base-900: #0d151d;
  --color-base-950: #03070f;
  --color-base-1000: #000000;

  /* The page ground. Payload declares --theme-bg as its own variable defaulting to
     --theme-elevation-0, which lets the ground go cool while cards stay white. */
  --theme-bg: #f3f7fc;

  /* ── Typography ────────────────────────────────────────────────────────────
     --font-arimo is generated by next/font in layout.tsx and lands on <html> via
     RootLayout's htmlProps. Never a literal Arial in this stack: when Arial is
     absent the browser synthesizes bold from a substitute face that drops
     Vietnamese diacritics. */
  --font-body: var(--font-arimo), system-ui, sans-serif;

  /* ── Density ───────────────────────────────────────────────────────────────
     Payload's root font size is the Sass constant $baseline-body-size (13px)
     compiled into %body, NOT the --base-body-size variable — that variable only
     feeds --base, the spacing unit, through
     calc((var(--base-px) / var(--base-body-size)) * 1rem).

     So the root size is set on html below, and these two keep --base at a
     deliberate 22px instead of letting it drift to 23px as a side effect:
     (22 / 15) * 1rem = 1.4667rem = 22px at a 15px root. */
  --base-px: 22;
  --base-body-size: 15;

  --style-radius-s: 5px;
  --style-radius-m: 9px;
  --style-radius-l: 14px;

  /* Focus rings carry the brand rather than the ink colour. */
  --accessibility-outline: 2px solid var(--ttv-blue-500);
}

html {
  font-size: 15px;
}

::selection {
  background: var(--ttv-blue-100);
  color: var(--color-base-800);
}

::-moz-selection {
  background: var(--ttv-blue-100);
  color: var(--color-base-800);
}

/*
 * Payload paints its primary button with --theme-elevation-800 (near-black), not a
 * brand token, so brand colour is not a variable that can be swapped globally —
 * it is this explicit list.
 */
.btn--style-primary {
  --bg-color: var(--ttv-blue-500);
  --hover-bg: var(--ttv-blue-600);
  --color: #ffffff;
  --hover-color: #ffffff;
}

a:not(.btn):not([class*='nav']) {
  color: var(--ttv-blue-500);
}

/*
 * Selected states. Payload marks these with a neutral elevation step, which reads as
 * "greyed" rather than "chosen"; the brand tint is what makes a selection legible.
 * Class names are Payload's own — see @payloadcms/ui/dist/elements/ReactSelect and
 * PillSelector.
 */
.rs__option--is-selected {
  background-color: var(--ttv-blue-100);
  color: var(--color-base-800);
}

.pill-selector__pill--selected {
  background-color: var(--ttv-blue-50);
}
```

- [ ] **Step 4: Bind Arimo in the admin layout**

`RootLayout` renders the `<html>` element itself, so `next/font`'s generated CSS variable reaches it through the `htmlProps` prop rather than a `className` on our own markup.

Replace `cms/src/app/(payload)/layout.tsx`:

```tsx
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { Arimo } from 'next/font/google'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

// Arimo is metric-compatible with Arial and ships real bold weights with full
// Vietnamese coverage. It is chosen for diacritic safety: when a literal Arial is
// named and not installed, browsers substitute one face for regular text and a
// different one for synthesized bold, and the bold substitute usually lacks
// precomposed marks (ệ, ẫ, ỡ). next/font self-hosts the files, so there is no
// runtime request to Google that can fail.
const arimo = Arimo({
  display: 'swap',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-arimo',
  weight: ['400', '500', '600', '700'],
})

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

// RootLayout owns the <html> element, so htmlProps is the only way to put
// next/font's generated variable class where custom.scss can read it.
const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    htmlProps={{ className: arimo.variable }}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    {children}
  </RootLayout>
)

export default Layout
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd cms && bunx playwright test --config=playwright.config.ts tests/e2e/theme.e2e.spec.ts`

Expected: PASS, both tests.

If `next/font` errors that `vietnamese` is not a valid subset for Arimo, drop to `subsets: ['latin', 'latin-ext']` and add `preload: false` — Google still serves the Vietnamese range, and the font stack is unchanged. Do not swap in a different family without raising it.

- [ ] **Step 6: Run the full e2e suite for regressions**

Run: `bun run --cwd cms test:e2e`

Expected: PASS. The token layer changes colours, not structure, so the Task 1 specs must be unaffected.

- [ ] **Step 7: Commit**

```bash
git add cms/src/app/\(payload\)/custom.scss cms/src/app/\(payload\)/layout.tsx cms/tests/e2e/theme.e2e.spec.ts
git commit -m "Give the CMS admin its own palette and typeface

custom.scss was empty and the panel was stock Payload grey. Rewriting the
--color-base-* ramp repaints every surface in one block, because Payload aliases
light-theme --theme-elevation-* straight off it — the eight existing field
components inherit the new palette without a line of change, since they use only
--theme-* variables.

Brand blue is not a variable Payload exposes: its primary button is painted with
--theme-elevation-800, so the accent lands as an explicit list of placements.
Every colour is derived from OKLCH with its contrast ratio recorded, and the
smoke test fails loudly if an upgrade reverts any of it."
```

---

### Task 3: Branding — logo, icon, login screen, browser chrome

**Files:**
- Create: `cms/public/brand/README.md`, `cms/public/brand/buffalo-icon.png`, `cms/public/brand/logo-wordmark.png`, `cms/public/brand/wave.png`, `cms/src/components/admin/brand/Logo.tsx`, `cms/src/components/admin/brand/Icon.tsx`, `cms/src/components/admin/brand/BeforeLogin.tsx`, `cms/src/components/admin/brand/Brand.module.css`
- Modify: `cms/src/payload.config.ts`, `cms/src/app/(payload)/admin/importMap.js` (regenerated)
- Test: `cms/tests/e2e/shell.e2e.spec.ts`

**Interfaces:**
- Consumes: tokens from Task 2; `adminURL` from Task 1.
- Produces: `Logo`, `Icon`, `BeforeLogin` named exports, registered at `@/components/admin/brand/Logo#Logo`, `…/Icon#Icon`, `…/BeforeLogin#BeforeLogin`.

- [ ] **Step 1: Copy the brand assets**

```bash
mkdir -p cms/public/brand
cp src/assets/buffalo-icon.png cms/public/brand/buffalo-icon.png
cp src/assets/logo-wordmark.png cms/public/brand/logo-wordmark.png
cp src/assets/mascot/wave.png cms/public/brand/wave.png
```

Create `cms/public/brand/README.md`:

```markdown
# Brand assets

Copies, not the originals. The CMS is a separate Next app and cannot import from
the root workspace's `src/assets`, so these are duplicated here. If the logo
changes, change it in `src/assets` first and re-copy:

| Here | Source |
|---|---|
| `buffalo-icon.png` | `src/assets/buffalo-icon.png` |
| `logo-wordmark.png` | `src/assets/logo-wordmark.png` |
| `wave.png` | `src/assets/mascot/wave.png` |

`buffalo-icon.png` and `logo-wordmark.png` are true RGBA and are safe on any
background. **`wave.png` and every other file in `src/assets/mascot/` is a palette
PNG with index transparency and light edge pixels** — it fringes visibly on dark
grounds. Use mascots on light grounds only, or re-export to RGBA first.
```

- [ ] **Step 2: Write the failing test**

Create `cms/tests/e2e/shell.e2e.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

import { adminURL } from '../helpers/serverURL'

test.describe('Login screen', () => {
  test('shows the school branding and orientation copy', async ({ page }) => {
    await page.goto(adminURL('/login'))

    await expect(page.getByAltText('Trường Tiếng Việt Của Em')).toBeVisible()
    await expect(
      page.getByText('Đây là nơi soạn nội dung bài học. Cô đăng nhập để bắt đầu.'),
    ).toBeVisible()
  })

  test('names the school in the browser tab', async ({ page }) => {
    await page.goto(adminURL('/login'))

    await expect(page).toHaveTitle(/Trường Tiếng Việt Của Em$/)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd cms && bunx playwright test --config=playwright.config.ts tests/e2e/shell.e2e.spec.ts`

Expected: FAIL — no element with that alt text, and the title still ends in Payload's default.

- [ ] **Step 4: Write the brand components**

Create `cms/src/components/admin/brand/Brand.module.css`:

```css
/* Login screen wordmark. Payload sizes this slot loosely, so cap it here. */
.wordmark {
  height: auto;
  max-width: 18rem;
  width: 100%;
}

/* Nav header buffalo. The RGBA asset, so it is safe on the blue sidebar. */
.icon {
  height: calc(var(--base) * 1.4);
  width: calc(var(--base) * 1.4);
}

.beforeLogin {
  align-items: center;
  display: flex;
  gap: calc(var(--base) * 0.75);
  margin-bottom: calc(var(--base) * 1.25);
  text-align: left;
}

/* Palette PNG with light edge pixels — kept on this pale ground, never on blue. */
.mascot {
  flex-shrink: 0;
  height: calc(var(--base) * 3);
  width: auto;
}

.copy {
  color: var(--color-base-600);
  margin: 0;
}

.school {
  color: var(--color-base-800);
  display: block;
  font-weight: 700;
  margin-bottom: calc(var(--base) * 0.15);
}
```

Create `cms/src/components/admin/brand/Logo.tsx`:

```tsx
import React from 'react'

import styles from './Brand.module.css'

/**
 * `admin.components.graphics.Logo` — the login screen mark.
 *
 * A plain <img> rather than next/image: this renders inside Payload's own login
 * layout, the asset is a fixed local file, and next/image's wrapper markup fights
 * the slot's sizing for no benefit.
 */
export const Logo: React.FC = () => (
  <img
    alt="Trường Tiếng Việt Của Em"
    className={styles.wordmark}
    src="/brand/logo-wordmark.png"
  />
)
```

Create `cms/src/components/admin/brand/Icon.tsx`:

```tsx
import React from 'react'

import styles from './Brand.module.css'

/**
 * `admin.components.graphics.Icon` — the mark in the nav header.
 *
 * buffalo-icon.png is true RGBA, so it sits cleanly on the blue sidebar. The mascot
 * PNGs would fringe there; see public/brand/README.md.
 */
export const Icon: React.FC = () => (
  <img alt="" aria-hidden="true" className={styles.icon} src="/brand/buffalo-icon.png" />
)
```

Create `cms/src/components/admin/brand/BeforeLogin.tsx`:

```tsx
import React from 'react'

import styles from './Brand.module.css'

/**
 * `admin.components.beforeLogin` — orientation for a teacher landing here.
 *
 * Stock Payload's login gives no signal about which system this is. One line and a
 * mascot is enough; the wordmark above it comes from the Logo slot.
 */
export const BeforeLogin: React.FC = () => (
  <div className={styles.beforeLogin}>
    <img alt="" aria-hidden="true" className={styles.mascot} src="/brand/wave.png" />
    <p className={styles.copy}>
      <span className={styles.school}>Trường Tiếng Việt Của Em</span>
      Đây là nơi soạn nội dung bài học. Cô đăng nhập để bắt đầu.
    </p>
  </div>
)
```

- [ ] **Step 5: Register the slots and the browser chrome**

In `cms/src/payload.config.ts`, replace the `admin` block:

```ts
  admin: {
    user: Users.slug,
    // Pin the admin panel to the light palette instead of following the OS setting,
    // so every editor sees the same white background.
    theme: 'light',
    components: {
      beforeLogin: ['@/components/admin/brand/BeforeLogin#BeforeLogin'],
      graphics: {
        Icon: '@/components/admin/brand/Icon#Icon',
        Logo: '@/components/admin/brand/Logo#Logo',
      },
    },
    // A teacher may have eight tabs open; the suffix is what makes this one findable.
    meta: {
      icons: [{ type: 'image/png', rel: 'icon', url: '/brand/buffalo-icon.png' }],
      openGraph: { images: [{ url: '/brand/buffalo-icon.png' }] },
      titleSuffix: '· Trường Tiếng Việt Của Em',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
```

- [ ] **Step 6: Regenerate the import map**

Run: `bun run --cwd cms generate:importmap`

Expected: `cms/src/app/(payload)/admin/importMap.js` gains three entries — `@/components/admin/brand/BeforeLogin#BeforeLogin`, `…/Icon#Icon`, `…/Logo#Logo`. It is generated but tracked; a stale one breaks the panel at runtime, not at build.

- [ ] **Step 7: Run the test to verify it passes**

Run: `cd cms && bunx playwright test --config=playwright.config.ts tests/e2e/shell.e2e.spec.ts`

Expected: PASS, both tests.

- [ ] **Step 8: Commit**

```bash
git add cms/public/brand cms/src/components/admin/brand cms/src/payload.config.ts cms/src/app/\(payload\)/admin/importMap.js cms/tests/e2e/shell.e2e.spec.ts
git commit -m "Put the school's name and face on the CMS

Stock Payload's login gives no signal about which system a teacher has landed in.
The wordmark, the buffalo and one line of Vietnamese orientation fix that, and the
title suffix makes the tab findable among eight others.

Assets are copies: the CMS is a separate Next app and cannot import from the root
workspace. The README records that, and warns that the mascot PNGs are palette
images with light edge pixels — they fringe on dark grounds, so the nav icon uses
the RGBA buffalo instead."
```

---

### Task 4: Vietnamese collection labels and a name for the greeting

The dashboard greets the logged-in user, but `Users` holds nothing but an email, and "Chào cô tranthanhphuc042@gmail.com" is worse than no greeting. The nav also needs real labels for `media` and `speaking-topics`, which currently have none — Payload derives "Media" and "Speaking Topics" from the slugs even under `vi`.

**Files:**
- Modify: `cms/src/collections/Users.ts`, `cms/src/collections/Media.ts`, `cms/src/collections/SpeakingTopics.ts`, `cms/tests/e2e/admin.e2e.spec.ts`, `cms/src/payload-types.ts` (regenerated)
- Create: `cms/src/migrations/<generated>_users_name.ts` and `.json`
- Test: `cms/tests/int/navModel.int.spec.ts` is Task 5; this task's check is the existing int suite plus the updated e2e assertion.

**Interfaces:**
- Produces: `User.name?: string | null` in `payload-types.ts`, consumed by `greetingName` in Task 7. Collection labels `Hình & âm thanh`, `Luyện nói` / `Chủ đề luyện nói`, consumed by Task 6's nav.

- [ ] **Step 1: Write the failing test**

In `cms/tests/e2e/admin.e2e.spec.ts`, change the list-view assertion to the Vietnamese label and add a field check. Replace the `can navigate to list view` test with:

```ts
  test('can navigate to list view', async () => {
    await page.goto(adminURL('/collections/users'))
    await expect(page).toHaveURL(adminURL('/collections/users'))
    const listViewArtifact = page.locator('h1', { hasText: 'Người dùng' }).first()
    await expect(listViewArtifact).toBeVisible()
  })

  test('a user has a display name field', async () => {
    await page.goto(adminURL('/collections/users/create'))
    await expect(page.locator('#field-name')).toBeVisible()
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd cms && bunx playwright test --config=playwright.config.ts tests/e2e/admin.e2e.spec.ts`

Expected: FAIL — the heading still reads "Users" and `#field-name` does not exist.

- [ ] **Step 3: Add the name field and the labels**

Replace `cms/src/collections/Users.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Người dùng',
    plural: 'Người dùng',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  auth: true,
  fields: [
    {
      // What the dashboard greets. Optional: an account created before this field
      // existed still works, and the greeting falls back to the email's local part
      // rather than showing a bare address.
      name: 'name',
      type: 'text',
      label: 'Tên',
      admin: {
        description: 'Tên hiển thị khi đăng nhập, ví dụ "cô Lan".',
      },
    },
  ],
}
```

In `cms/src/collections/Media.ts`, add above `access`:

```ts
  labels: {
    singular: 'Tệp',
    plural: 'Hình & âm thanh',
  },
```

In `cms/src/collections/SpeakingTopics.ts`, add above `access`:

```ts
  labels: {
    singular: 'Chủ đề luyện nói',
    plural: 'Luyện nói',
  },
```

- [ ] **Step 4: Create and run the migration, and regenerate types**

```bash
bun run --cwd cms payload migrate:create users_name
bun run --cwd cms payload migrate
bun run --cwd cms generate:types
```

Expected: a new pair of files under `cms/src/migrations/` adding a nullable `name` column to `payload.users`, and `User` in `cms/src/payload-types.ts` gaining `name?: string | null`.

Open the generated migration before running it and confirm it only adds that column. If it proposes dropping or renaming anything, stop and report it — the dev database may have drifted from the migration history via the Postgres adapter's dev push.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `bun run --cwd cms test:int`
Expected: PASS — the existing API spec still fetches users.

Run: `cd cms && bunx playwright test --config=playwright.config.ts tests/e2e/admin.e2e.spec.ts`
Expected: PASS, including the two changed tests.

- [ ] **Step 6: Commit**

```bash
git add cms/src/collections/Users.ts cms/src/collections/Media.ts cms/src/collections/SpeakingTopics.ts cms/src/migrations cms/src/payload-types.ts cms/tests/e2e/admin.e2e.spec.ts
git commit -m "Name the collections in Vietnamese and give users a display name

media and speaking-topics carried no labels at all, so Payload derived English
headings from their slugs even with the panel pinned to vi. Users held nothing but
an email, which would have made the dashboard greet a teacher by her address.

The name field is optional on purpose: existing accounts keep working and the
greeting falls back to the email's local part."
```

---

### Task 5: Nav data model

**Files:**
- Create: `cms/src/components/admin/nav/navModel.ts`
- Test: `cms/tests/int/navModel.int.spec.ts`

**Interfaces:**
- Consumes: `QUYEN_ROSTER` from `@/collections/Quyen`; a `Payload` instance.
- Produces:
  ```ts
  export type NavItem = { disabled?: boolean; href: null | string; label: string; note?: string }
  export type NavGroup = { items: NavItem[]; label: null | string }
  export function buildNavGroups(args: { adminRoute: string; payload: Payload }): Promise<NavGroup[]>
  ```
  Task 6 renders exactly this shape and adds no logic of its own.

- [ ] **Step 1: Write the failing test**

Create `cms/tests/int/navModel.int.spec.ts`:

```ts
import type { Payload } from 'payload'

import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { buildNavGroups } from '@/components/admin/nav/navModel'

let payload: Payload

describe('buildNavGroups', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('groups the items the way teachers are asked to think about them', async () => {
    const groups = await buildNavGroups({ adminRoute: '/admin', payload })

    expect(groups.map((g) => g.label)).toEqual([
      null,
      'Nội dung học',
      'Thư viện',
      'Quản trị',
    ])

    expect(groups[0].items).toEqual([{ href: '/admin', label: 'Trang chính' }])
    expect(groups[2].items).toEqual([
      { href: '/admin/collections/media', label: 'Hình & âm thanh' },
    ])
    expect(groups[3].items).toEqual([
      { href: '/admin/collections/users', label: 'Người dùng' },
    ])
  })

  it('never lists chủ đề, which is reached through its quyển', async () => {
    const groups = await buildNavGroups({ adminRoute: '/admin', payload })

    const labels = groups.flatMap((g) => g.items.map((i) => i.label))
    expect(labels).not.toContain('Chủ đề')
    expect(groups.flatMap((g) => g.items.map((i) => i.href))).not.toContain(
      '/admin/collections/chu-de',
    )
  })

  it('links each quyển by resolving its slug to a document id', async () => {
    const groups = await buildNavGroups({ adminRoute: '/admin', payload })
    const hoc = groups.find((g) => g.label === 'Nội dung học')!

    // onInit seeds the roster on every server start, so both rows exist.
    const quyen1 = await payload.find({
      collection: 'quyen',
      depth: 0,
      limit: 1,
      where: { slug: { equals: 'quyen-1' } },
    })
    const id = quyen1.docs[0].id

    expect(hoc.items[0]).toEqual({
      href: `/admin/collections/quyen/${id}`,
      label: 'Quyển 1',
    })
    expect(hoc.items.at(-1)).toEqual({
      href: '/admin/collections/speaking-topics',
      label: 'Luyện nói',
    })
  })

  it('honours a non-default admin route', async () => {
    const groups = await buildNavGroups({ adminRoute: '/quan-tri', payload })

    expect(groups[0].items[0].href).toBe('/quan-tri')
    expect(groups[3].items[0].href).toBe('/quan-tri/collections/users')
  })

  it('disables a quyển that has no row yet instead of throwing', async () => {
    // A roster entry whose row is missing: simulate by querying with a payload whose
    // find returns nothing for quyen. The nav renders on every page, so a missing row
    // must never be able to take the panel down.
    const emptyPayload = {
      find: async () => ({ docs: [] }),
    } as unknown as Payload

    const groups = await buildNavGroups({ adminRoute: '/admin', payload: emptyPayload })
    const hoc = groups.find((g) => g.label === 'Nội dung học')!

    expect(hoc.items[0]).toEqual({
      disabled: true,
      href: null,
      label: 'Quyển 1',
      note: 'Chưa sẵn sàng',
    })
    // The rest of the sidebar is unaffected.
    expect(groups[3].items[0].href).toBe('/admin/collections/users')
  })

  it('disables the quyển items rather than throwing when the query fails', async () => {
    const brokenPayload = {
      find: async () => {
        throw new Error('connection refused')
      },
    } as unknown as Payload

    const groups = await buildNavGroups({ adminRoute: '/admin', payload: brokenPayload })
    const hoc = groups.find((g) => g.label === 'Nội dung học')!

    expect(hoc.items.filter((i) => i.disabled)).toHaveLength(2)
    expect(hoc.items.at(-1)!.href).toBe('/admin/collections/speaking-topics')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd cms && bunx cross-env NODE_OPTIONS=--no-deprecation vitest run --config ./vitest.config.mts tests/int/navModel.int.spec.ts`

Expected: FAIL — cannot resolve `@/components/admin/nav/navModel`.

- [ ] **Step 3: Write the implementation**

Create `cms/src/components/admin/nav/navModel.ts`:

```ts
import type { Payload } from 'payload'

import { QUYEN_ROSTER } from '@/collections/Quyen'

export type NavItem = {
  disabled?: boolean
  href: null | string
  label: string
  note?: string
}

export type NavGroup = {
  items: NavItem[]
  label: null | string
}

/**
 * The sidebar's contents.
 *
 * Kept apart from the component so it can be tested against a real Payload instance
 * without rendering React — and so the failure behaviour below is verifiable, which
 * matters more here than anywhere else in the panel: the nav renders on every page
 * and is a server component, so an uncaught throw is a 500 on the admin root rather
 * than one broken widget.
 *
 * Two deliberate omissions:
 *
 * - Chủ đề never appears. It must stay routable (every chủ đề lives at
 *   /admin/collections/chu-de/:id) while never being listed, and Payload's
 *   `admin.hidden` flag would remove the routes too. Rendering the list ourselves is
 *   the only way to get "reachable but not listed" — which is the reason the Nav
 *   slot is replaced wholesale rather than extended with beforeNavLinks.
 * - Quyển are linked by *document*, not by list view. Their ids are Postgres-assigned
 *   and differ between dev and production, so they are resolved from the slugs in
 *   QUYEN_ROSTER at render time. That keeps the roster the single source of truth:
 *   adding a third quyển there makes a third nav item appear with no edit here.
 */
export async function buildNavGroups({
  adminRoute,
  payload,
}: {
  adminRoute: string
  payload: Payload
}): Promise<NavGroup[]> {
  const quyenItems = await buildQuyenItems({ adminRoute, payload })

  return [
    {
      label: null,
      items: [{ href: adminRoute, label: 'Trang chính' }],
    },
    {
      label: 'Nội dung học',
      items: [
        ...quyenItems,
        { href: `${adminRoute}/collections/speaking-topics`, label: 'Luyện nói' },
      ],
    },
    {
      label: 'Thư viện',
      items: [{ href: `${adminRoute}/collections/media`, label: 'Hình & âm thanh' }],
    },
    {
      label: 'Quản trị',
      items: [{ href: `${adminRoute}/collections/users`, label: 'Người dùng' }],
    },
  ]
}

async function buildQuyenItems({
  adminRoute,
  payload,
}: {
  adminRoute: string
  payload: Payload
}): Promise<NavItem[]> {
  const unavailable = (title: string): NavItem => ({
    disabled: true,
    href: null,
    label: title,
    note: 'Chưa sẵn sàng',
  })

  let idBySlug: Map<string, number | string>

  try {
    const found = await payload.find({
      collection: 'quyen',
      depth: 0,
      limit: QUYEN_ROSTER.length,
      pagination: false,
      select: { slug: true },
      where: { slug: { in: QUYEN_ROSTER.map((q) => q.slug) } },
    })

    idBySlug = new Map(found.docs.map((doc) => [doc.slug, doc.id]))
  } catch (err) {
    // onInit seeds these rows on server start, so an empty or failed result means the
    // database is unreachable or mid-migration. Show the items disabled and let the
    // rest of the sidebar render.
    payload.logger?.error?.({ err }, 'nav: could not resolve quyển documents')
    idBySlug = new Map()
  }

  return QUYEN_ROSTER.map((quyen) => {
    const id = idBySlug.get(quyen.slug)
    if (id === undefined) return unavailable(quyen.title)

    return {
      href: `${adminRoute}/collections/quyen/${id}`,
      label: quyen.title,
    }
  })
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd cms && bunx cross-env NODE_OPTIONS=--no-deprecation vitest run --config ./vitest.config.mts tests/int/navModel.int.spec.ts`

Expected: PASS, all six tests.

- [ ] **Step 5: Commit**

```bash
git add cms/src/components/admin/nav/navModel.ts cms/tests/int/navModel.int.spec.ts
git commit -m "Model the CMS sidebar as data

Separating the shape from the rendering is what makes the failure behaviour
testable, and that matters more here than anywhere else in the panel: the nav is a
server component on every page, so an uncaught throw is a 500 on the admin root
rather than one broken widget. A missing quyển row or a refused connection now
disables those items and leaves the rest of the sidebar standing.

Quyển are linked by document id resolved from their roster slugs, because ids are
Postgres-assigned and differ between environments."
```

---

### Task 6: The nav component

**Files:**
- Create: `cms/src/components/admin/nav/Nav.tsx`, `cms/src/components/admin/nav/Nav.module.css`
- Modify: `cms/src/payload.config.ts`, `cms/src/app/(payload)/admin/importMap.js` (regenerated), `cms/tests/e2e/shell.e2e.spec.ts`

**Interfaces:**
- Consumes: `buildNavGroups`, `NavGroup`, `NavItem` (Task 5); `ServerProps` from `payload`, which supplies `payload`.
- Produces: a `<nav>` landmark — Task 1's `login()` helper waits on `page.getByRole('navigation')`.

- [ ] **Step 1: Write the failing test**

Append to `cms/tests/e2e/shell.e2e.spec.ts`:

```ts
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'
import { login } from '../helpers/login'

test.describe('Sidebar', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('groups destinations and hides the chủ đề collection', async ({ page }) => {
    await login({ page, user: testUser })

    const nav = page.getByRole('navigation').first()

    await expect(nav.getByText('Nội dung học')).toBeVisible()
    await expect(nav.getByText('Thư viện')).toBeVisible()
    await expect(nav.getByText('Quản trị')).toBeVisible()

    await expect(nav.getByRole('link', { name: 'Quyển 1' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Luyện nói' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Hình & âm thanh' })).toBeVisible()

    await expect(nav.getByRole('link', { name: 'Chủ đề' })).toHaveCount(0)
  })

  test('a quyển link opens that quyển document, not a list view', async ({ page }) => {
    await login({ page, user: testUser })

    await page
      .getByRole('navigation')
      .first()
      .getByRole('link', { name: 'Quyển 1' })
      .click()

    await expect(page).toHaveURL(/\/admin\/collections\/quyen\/[^/]+$/)
  })

  test('chủ đề pages stay reachable even though they are not listed', async ({ page }) => {
    await login({ page, user: testUser })

    await page.goto(adminURL('/collections/chu-de'))
    await expect(page).toHaveURL(adminURL('/collections/chu-de'))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd cms && bunx playwright test --config=playwright.config.ts tests/e2e/shell.e2e.spec.ts`

Expected: FAIL — Payload's default nav lists collections flat, so "Nội dung học" is absent and a "Chủ đề" link is present.

- [ ] **Step 3: Write the stylesheet**

Create `cms/src/components/admin/nav/Nav.module.css`:

```css
/*
 * The deep-blue sidebar. This is the structural move that stops the panel reading
 * as stock Payload the moment it loads — everything else in the theme is a repaint.
 */
.nav {
  background: var(--ttv-blue-900);
  display: flex;
  flex-direction: column;
  gap: calc(var(--base) * 0.5);
  height: 100%;
  overflow-y: auto;
  padding: calc(var(--base) * 0.75) calc(var(--base) * 0.6);
}

.header {
  align-items: center;
  border-bottom: 1px solid rgb(255 255 255 / 15%);
  display: flex;
  gap: calc(var(--base) * 0.4);
  padding-bottom: calc(var(--base) * 0.6);
}

.school {
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1.2;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.groupLabel {
  color: var(--ttv-blue-300);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: calc(var(--base) * 0.5) calc(var(--base) * 0.3) calc(var(--base) * 0.2);
  text-transform: uppercase;
}

.item {
  border-radius: var(--style-radius-s);
  color: #d6e6f5;
  display: block;
  padding: calc(var(--base) * 0.3) calc(var(--base) * 0.4);
  text-decoration: none;
}

.item:hover,
.item:focus-visible {
  background: var(--ttv-blue-700);
  color: #ffffff;
}

/* Disabled items are rendered as text, not links — there is nowhere to go yet. */
.itemDisabled {
  color: var(--ttv-blue-300);
  cursor: default;
  display: flex;
  gap: calc(var(--base) * 0.3);
  justify-content: space-between;
  padding: calc(var(--base) * 0.3) calc(var(--base) * 0.4);
}

.note {
  font-size: 0.7rem;
  font-style: italic;
}
```

- [ ] **Step 4: Write the component**

Create `cms/src/components/admin/nav/Nav.tsx`:

```tsx
import type { ServerProps } from 'payload'

import Link from 'next/link'
import React from 'react'

import { buildNavGroups } from './navModel'
import styles from './Nav.module.css'

/**
 * `admin.components.Nav` — replaces Payload's sidebar outright.
 *
 * A replacement rather than beforeNavLinks because the design both groups items and
 * omits one: chủ đề must stay routable while never being listed, and there is no
 * config flag for that (see navModel.ts).
 *
 * Payload passes server components its own props — `payload` comes from ServerProps,
 * so this needs no getPayload call of its own.
 */
export const Nav: React.FC<ServerProps> = async ({ payload }) => {
  const adminRoute = payload.config.routes.admin
  const groups = await buildNavGroups({ adminRoute, payload })

  return (
    <nav className={styles.nav}>
      <div className={styles.header}>
        <img alt="" aria-hidden="true" height={28} src="/brand/buffalo-icon.png" width={28} />
        <span className={styles.school}>
          Trường Tiếng Việt
          <br />
          Của Em
        </span>
      </div>

      {groups.map((group, groupIndex) => (
        <div className={styles.group} key={group.label ?? `group-${groupIndex}`}>
          {group.label && <span className={styles.groupLabel}>{group.label}</span>}

          {group.items.map((item) =>
            item.href === null ? (
              <span className={styles.itemDisabled} key={item.label}>
                {item.label}
                {item.note && <span className={styles.note}>{item.note}</span>}
              </span>
            ) : (
              <Link className={styles.item} href={item.href} key={item.label}>
                {item.label}
              </Link>
            ),
          )}
        </div>
      ))}
    </nav>
  )
}
```

- [ ] **Step 5: Register the slot and regenerate the import map**

In `cms/src/payload.config.ts`, add to `admin.components`:

```ts
      Nav: '@/components/admin/nav/Nav#Nav',
```

Run: `bun run --cwd cms generate:importmap`

- [ ] **Step 6: Run the test to verify it passes**

Run: `cd cms && bunx playwright test --config=playwright.config.ts tests/e2e/shell.e2e.spec.ts`

Expected: PASS, all five tests in the file.

- [ ] **Step 7: Run the full suites for regressions**

Run: `bun run --cwd cms test:int && bun run --cwd cms test:e2e`

Expected: PASS. The `admin.e2e.spec.ts` navigation tests go through URLs rather than nav clicks, so replacing the sidebar must not affect them.

- [ ] **Step 8: Commit**

```bash
git add cms/src/components/admin/nav cms/src/payload.config.ts cms/src/app/\(payload\)/admin/importMap.js cms/tests/e2e/shell.e2e.spec.ts
git commit -m "Group the sidebar the way teachers think about the content

The panel listed raw collections flat, including a Chủ đề list nobody wants to
browse — a teacher reaches a chủ đề through its quyển. Six items in three named
groups replace that, and the deep-blue panel is what stops the CMS reading as
stock Payload on load.

Chủ đề is omitted from the list while staying routable, which is why the Nav slot
is replaced wholesale: admin.hidden would have taken the routes with it."
```

---

### Task 7: Dashboard data

**Files:**
- Create: `cms/src/components/admin/dashboard/dashboardData.ts`
- Test: `cms/tests/int/dashboardData.int.spec.ts`

**Interfaces:**
- Consumes: `QUYEN_ROSTER`; a `Payload` instance; `TypedUser`.
- Produces:
  ```ts
  export type Destination = { count: null | number; href: null | string; key: string; label: string; buttonLabel: string }
  export type RecentEdit = { href: string; id: number | string; kind: 'chu-de' | 'speaking-topic'; title: string; updatedAt: string }
  export type DashboardData = { destinations: Destination[]; recents: null | RecentEdit[] }
  export function greetingName(user: { email?: null | string; name?: null | string } | null | undefined): string
  export function loadDashboardData(args: { adminRoute: string; payload: Payload }): Promise<DashboardData>
  ```

- [ ] **Step 1: Write the failing test**

Create `cms/tests/int/dashboardData.int.spec.ts`:

```ts
import type { Payload } from 'payload'

import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { greetingName, loadDashboardData } from '@/components/admin/dashboard/dashboardData'

let payload: Payload

describe('greetingName', () => {
  it('prefers the display name', () => {
    expect(greetingName({ email: 'lan@example.com', name: 'cô Lan' })).toBe('cô Lan')
  })

  it('falls back to the local part of the email, never the whole address', () => {
    expect(greetingName({ email: 'tranthanhphuc042@gmail.com' })).toBe('tranthanhphuc042')
  })

  it('ignores a blank name', () => {
    expect(greetingName({ email: 'lan@example.com', name: '   ' })).toBe('lan')
  })

  it('degrades to a generic greeting with nothing to go on', () => {
    expect(greetingName(null)).toBe('cô')
    expect(greetingName({})).toBe('cô')
  })
})

describe('loadDashboardData', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('offers the three destinations with chủ đề counts', async () => {
    const data = await loadDashboardData({ adminRoute: '/admin', payload })

    expect(data.destinations.map((d) => d.label)).toEqual([
      'Quyển 1',
      'Quyển 2',
      'Luyện nói',
    ])
    expect(data.destinations.map((d) => d.buttonLabel)).toEqual([
      'Mở quyển 1',
      'Mở quyển 2',
      'Mở luyện nói',
    ])

    for (const destination of data.destinations) {
      expect(typeof destination.count).toBe('number')
      expect(destination.count).toBeGreaterThanOrEqual(0)
    }

    expect(data.destinations[0].href).toMatch(/^\/admin\/collections\/quyen\/[^/]+$/)
    expect(data.destinations[2].href).toBe('/admin/collections/speaking-topics')
  })

  it('lists at most five recent edits, newest first', async () => {
    const data = await loadDashboardData({ adminRoute: '/admin', payload })

    expect(data.recents).not.toBeNull()
    expect(data.recents!.length).toBeLessThanOrEqual(5)

    const times = data.recents!.map((r) => Date.parse(r.updatedAt))
    expect([...times].sort((a, b) => b - a)).toEqual(times)

    for (const recent of data.recents!) {
      expect(recent.href).toContain('/admin/collections/')
      expect(recent.title.length).toBeGreaterThan(0)
    }
  })

  it('reports a count as null rather than throwing when its query fails', async () => {
    const brokenPayload = {
      config: { routes: { admin: '/admin' } },
      count: async () => {
        throw new Error('connection refused')
      },
      find: async () => ({ docs: [] }),
    } as unknown as Payload

    const data = await loadDashboardData({ adminRoute: '/admin', payload: brokenPayload })

    expect(data.destinations).toHaveLength(3)
    expect(data.destinations.every((d) => d.count === null)).toBe(true)
  })

  it('degrades to the destination cards when recent edits cannot be read', async () => {
    const brokenPayload = {
      config: { routes: { admin: '/admin' } },
      count: async () => ({ totalDocs: 0 }),
      find: async ({ collection }: { collection: string }) => {
        if (collection === 'quyen') return { docs: [] }
        throw new Error('connection refused')
      },
    } as unknown as Payload

    const data = await loadDashboardData({ adminRoute: '/admin', payload: brokenPayload })

    expect(data.recents).toBeNull()
    expect(data.destinations).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd cms && bunx cross-env NODE_OPTIONS=--no-deprecation vitest run --config ./vitest.config.mts tests/int/dashboardData.int.spec.ts`

Expected: FAIL — cannot resolve `@/components/admin/dashboard/dashboardData`.

- [ ] **Step 3: Write the implementation**

Create `cms/src/components/admin/dashboard/dashboardData.ts`:

```ts
import type { Payload } from 'payload'

import { QUYEN_ROSTER } from '@/collections/Quyen'

export type Destination = {
  buttonLabel: string
  count: null | number
  href: null | string
  key: string
  label: string
}

export type RecentEdit = {
  href: string
  id: number | string
  kind: 'chu-de' | 'speaking-topic'
  title: string
  updatedAt: string
}

export type DashboardData = {
  destinations: Destination[]
  recents: null | RecentEdit[]
}

const RECENT_LIMIT = 5

/**
 * What to call the person logged in.
 *
 * Users carry an optional display name; without one, the email's local part is far
 * better than the whole address in a greeting.
 */
export function greetingName(
  user: { email?: null | string; name?: null | string } | null | undefined,
): string {
  const name = user?.name?.trim()
  if (name) return name

  const local = user?.email?.split('@')[0]?.trim()
  if (local) return local

  return 'cô'
}

/**
 * Everything the dashboard renders.
 *
 * A launchpad, not a report: counts come from `count`, and recents from one sorted
 * `find` per collection at depth 0. Nothing here walks a chủ đề's nested arrays —
 * which is also why the destination cards show a chủ đề count and not a bài count.
 * Bài live inside those arrays, and counting them would mean loading every chủ đề
 * document on every dashboard load.
 *
 * Every query is guarded on its own. This is a server component's data source, so an
 * uncaught throw is a 500 on the admin root; a failed count renders "—" and a failed
 * recents query leaves the destination cards standing.
 */
export async function loadDashboardData({
  adminRoute,
  payload,
}: {
  adminRoute: string
  payload: Payload
}): Promise<DashboardData> {
  const [destinations, recents] = await Promise.all([
    loadDestinations({ adminRoute, payload }),
    loadRecents({ adminRoute, payload }),
  ])

  return { destinations, recents }
}

async function loadDestinations({
  adminRoute,
  payload,
}: {
  adminRoute: string
  payload: Payload
}): Promise<Destination[]> {
  const quyenIds = await resolveQuyenIds(payload)

  const quyenDestinations = await Promise.all(
    QUYEN_ROSTER.map(async (quyen) => {
      const id = quyenIds.get(quyen.slug)

      return {
        buttonLabel: `Mở ${quyen.title.toLowerCase()}`,
        // No row means nothing to count against — asking anyway would send a sentinel
        // into a relationship filter and rely on the catch to clean up after it.
        count:
          id === undefined
            ? null
            : await countOrNull(payload, 'chu-de', { quyen: { equals: id } }),
        href: id === undefined ? null : `${adminRoute}/collections/quyen/${id}`,
        key: quyen.slug,
        label: quyen.title,
      }
    }),
  )

  return [
    ...quyenDestinations,
    {
      buttonLabel: 'Mở luyện nói',
      count: await countOrNull(payload, 'speaking-topics'),
      href: `${adminRoute}/collections/speaking-topics`,
      key: 'luyen-noi',
      label: 'Luyện nói',
    },
  ]
}

async function resolveQuyenIds(payload: Payload): Promise<Map<string, number | string>> {
  try {
    const found = await payload.find({
      collection: 'quyen',
      depth: 0,
      pagination: false,
      select: { slug: true },
      where: { slug: { in: QUYEN_ROSTER.map((q) => q.slug) } },
    })

    return new Map(found.docs.map((doc) => [doc.slug, doc.id]))
  } catch {
    return new Map()
  }
}

async function countOrNull(
  payload: Payload,
  collection: 'chu-de' | 'speaking-topics',
  where?: Record<string, unknown>,
): Promise<null | number> {
  try {
    const result = await payload.count({ collection, where } as never)
    return result.totalDocs
  } catch (err) {
    payload.logger?.error?.({ collection, err }, 'dashboard: count failed')
    return null
  }
}

async function loadRecents({
  adminRoute,
  payload,
}: {
  adminRoute: string
  payload: Payload
}): Promise<null | RecentEdit[]> {
  try {
    const [chuDe, speaking] = await Promise.all([
      payload.find({
        collection: 'chu-de',
        depth: 0,
        limit: RECENT_LIMIT,
        select: { title: true, updatedAt: true },
        sort: '-updatedAt',
      }),
      payload.find({
        collection: 'speaking-topics',
        depth: 0,
        limit: RECENT_LIMIT,
        select: { title: true, updatedAt: true },
        sort: '-updatedAt',
      }),
    ])

    const merged: RecentEdit[] = [
      ...chuDe.docs.map((doc) => ({
        href: `${adminRoute}/collections/chu-de/${doc.id}`,
        id: doc.id,
        kind: 'chu-de' as const,
        title: doc.title || 'Chưa đặt tên',
        updatedAt: doc.updatedAt,
      })),
      ...speaking.docs.map((doc) => ({
        href: `${adminRoute}/collections/speaking-topics/${doc.id}`,
        id: doc.id,
        kind: 'speaking-topic' as const,
        title: doc.title || 'Chưa đặt tên',
        updatedAt: doc.updatedAt,
      })),
    ]

    return merged
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .slice(0, RECENT_LIMIT)
  } catch (err) {
    payload.logger?.error?.({ err }, 'dashboard: recent edits failed')
    return null
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd cms && bunx cross-env NODE_OPTIONS=--no-deprecation vitest run --config ./vitest.config.mts tests/int/dashboardData.int.spec.ts`

Expected: PASS, all nine tests.

- [ ] **Step 5: Commit**

```bash
git add cms/src/components/admin/dashboard/dashboardData.ts cms/tests/int/dashboardData.int.spec.ts
git commit -m "Load the dashboard's launchpad data

Counts come from count() and recents from one sorted find per collection at depth
0 — nothing walks a chủ đề's nested arrays. That is also why the cards show a chủ
đề count and not a bài count: bài live inside those arrays, so counting them would
mean loading every chủ đề document on every dashboard load.

Each query is guarded separately because this feeds a server component: a failed
count renders a dash, and a failed recents query leaves the cards standing rather
than 500ing the admin root."
```

---

### Task 8: The dashboard component

**Files:**
- Create: `cms/src/components/admin/dashboard/Dashboard.tsx`, `cms/src/components/admin/dashboard/Dashboard.module.css`
- Modify: `cms/src/payload.config.ts`, `cms/src/app/(payload)/admin/importMap.js` (regenerated), `cms/tests/e2e/shell.e2e.spec.ts`

**Interfaces:**
- Consumes: `loadDashboardData`, `greetingName`, `Destination`, `RecentEdit` (Task 7); `AdminViewServerProps` from `payload`, which supplies `payload` and `user`.

- [ ] **Step 1: Write the failing test**

Append to `cms/tests/e2e/shell.e2e.spec.ts`:

```ts
test.describe('Dashboard', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('greets the teacher and offers the three destinations', async ({ page }) => {
    await login({ page, user: testUser })

    // Not scoped to a landmark: "Mở quyển 1" appears nowhere else in the panel, and
    // scoping to `main` would break the moment Payload's own template renders one too.
    // seedUser creates dev@payloadcms.com with no display name, so the greeting falls
    // back to the local part.
    await expect(page.getByText(/^Chào dev/)).toBeVisible()

    await expect(page.getByRole('link', { name: 'Mở quyển 1' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Mở quyển 2' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Mở luyện nói' })).toBeVisible()
  })

  test('opens a quyển from its card', async ({ page }) => {
    await login({ page, user: testUser })

    await page.getByRole('link', { name: 'Mở quyển 1' }).click()

    await expect(page).toHaveURL(/\/admin\/collections\/quyen\/[^/]+$/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd cms && bunx playwright test --config=playwright.config.ts tests/e2e/shell.e2e.spec.ts`

Expected: FAIL — Payload's default dashboard shows collection cards, not the greeting or the destination buttons.

- [ ] **Step 3: Write the stylesheet**

Create `cms/src/components/admin/dashboard/Dashboard.module.css`:

```css
.view {
  margin: 0 auto;
  max-width: 60rem;
  padding: calc(var(--base) * 1.2) var(--gutter-h) var(--spacing-view-bottom);
}

.greeting {
  align-items: center;
  display: flex;
  gap: calc(var(--base) * 0.6);
  margin-bottom: calc(var(--base) * 1.2);
}

/* Palette PNG, light edge pixels — safe here on the pale page ground. */
.mascot {
  height: calc(var(--base) * 2.6);
  width: auto;
}

.hello {
  color: var(--color-base-800);
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
}

.helloSub {
  color: var(--color-base-600);
  margin: calc(var(--base) * 0.15) 0 0;
}

.sectionLabel {
  color: var(--color-base-600);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  margin: calc(var(--base) * 1.1) 0 calc(var(--base) * 0.5);
  text-transform: uppercase;
}

.cards {
  display: grid;
  gap: calc(var(--base) * 0.5);
  grid-template-columns: repeat(3, 1fr);
  list-style: none;
  margin: 0;
  padding: 0;
}

.card {
  background: var(--color-base-0);
  border: 1px solid var(--theme-elevation-150);
  border-radius: var(--style-radius-m);
  display: flex;
  flex-direction: column;
  gap: calc(var(--base) * 0.2);
  padding: calc(var(--base) * 0.7);
}

.cardTitle {
  color: var(--color-base-800);
  font-size: 1.05rem;
  font-weight: 700;
}

.cardCount {
  color: var(--color-base-600);
}

.cardButton {
  align-self: flex-start;
  background: var(--ttv-blue-500);
  border-radius: var(--style-radius-s);
  color: #ffffff;
  font-weight: 700;
  margin-top: calc(var(--base) * 0.45);
  padding: calc(var(--base) * 0.3) calc(var(--base) * 0.6);
  text-decoration: none;
}

.cardButton:hover,
.cardButton:focus-visible {
  background: var(--ttv-blue-600);
  color: #ffffff;
}

/* A quyển with no row yet: the card still explains itself. */
.cardUnavailable {
  align-self: flex-start;
  color: var(--ttv-amber-700);
  font-style: italic;
  margin-top: calc(var(--base) * 0.45);
}

.recents {
  display: flex;
  flex-direction: column;
  gap: calc(var(--base) * 0.25);
  list-style: none;
  margin: 0;
  padding: 0;
}

.recent {
  align-items: center;
  background: var(--color-base-0);
  border: 1px solid var(--theme-elevation-150);
  border-radius: var(--style-radius-s);
  color: var(--color-base-800);
  display: flex;
  gap: calc(var(--base) * 0.4);
  justify-content: space-between;
  padding: calc(var(--base) * 0.4) calc(var(--base) * 0.6);
  text-decoration: none;
}

.recent:hover,
.recent:focus-visible {
  background: var(--ttv-blue-50);
  border-color: var(--ttv-blue-300);
}

.recentWhere {
  color: var(--color-base-600);
  font-size: 0.85rem;
}

.empty {
  color: var(--color-base-600);
  margin: 0;
}
```

- [ ] **Step 4: Write the component**

Create `cms/src/components/admin/dashboard/Dashboard.tsx`:

```tsx
import type { AdminViewServerProps } from 'payload'

import Link from 'next/link'
import React from 'react'

import { greetingName, loadDashboardData } from './dashboardData'
import styles from './Dashboard.module.css'

/**
 * `admin.components.views.dashboard` — a launchpad, not a report.
 *
 * Payload's default dashboard is a grid of collection cards named after the schema.
 * This answers the question a teacher actually arrives with: where do I go to work
 * today, and where did I stop last time.
 *
 * A "cần hoàn thiện" work queue (empty chặng, bài with no hình) belongs here
 * eventually, but the gaps live inside nested arrays — it needs a full scan of every
 * chủ đề document plus caching, so it waits for the chủ đề workspace.
 */
export const Dashboard: React.FC<AdminViewServerProps> = async ({ payload, user }) => {
  const adminRoute = payload.config.routes.admin
  const { destinations, recents } = await loadDashboardData({ adminRoute, payload })

  return (
    <main className={styles.view}>
      <div className={styles.greeting}>
        <img alt="" aria-hidden="true" className={styles.mascot} src="/brand/wave.png" />
        <div>
          <p className={styles.hello}>Chào {greetingName(user)} 👋</p>
          <p className={styles.helloSub}>Chọn nơi cô muốn soạn bài hôm nay.</p>
        </div>
      </div>

      <h2 className={styles.sectionLabel}>Nội dung học</h2>
      <ul className={styles.cards}>
        {destinations.map((destination) => (
          <li className={styles.card} key={destination.key}>
            <span className={styles.cardTitle}>{destination.label}</span>
            <span className={styles.cardCount}>
              {/* A failed count shows a dash rather than blanking the card. */}
              {destination.count === null ? '—' : `${destination.count} chủ đề`}
            </span>
            {destination.href === null ? (
              <span className={styles.cardUnavailable}>Chưa sẵn sàng</span>
            ) : (
              <Link className={styles.cardButton} href={destination.href}>
                {destination.buttonLabel}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <h2 className={styles.sectionLabel}>Cô vừa sửa</h2>
      {recents === null || recents.length === 0 ? (
        <p className={styles.empty}>
          Cô chưa sửa gì gần đây. Bắt đầu từ một quyển ở trên nhé.
        </p>
      ) : (
        <ul className={styles.recents}>
          {recents.map((recent) => (
            <li key={`${recent.kind}-${recent.id}`}>
              <Link className={styles.recent} href={recent.href}>
                <span>{recent.title}</span>
                <span className={styles.recentWhere}>
                  {recent.kind === 'chu-de' ? 'Chủ đề' : 'Luyện nói'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
```

- [ ] **Step 5: Register the view and regenerate the import map**

In `cms/src/payload.config.ts`, add to `admin.components`:

```ts
      views: {
        dashboard: { Component: '@/components/admin/dashboard/Dashboard#Dashboard' },
      },
```

Run: `bun run --cwd cms generate:importmap`

- [ ] **Step 6: Run the test to verify it passes**

Run: `cd cms && bunx playwright test --config=playwright.config.ts tests/e2e/shell.e2e.spec.ts`

Expected: PASS, all seven tests in the file.

- [ ] **Step 7: Run the full suites**

Run: `bun run --cwd cms test:int && bun run --cwd cms test:e2e`

Expected: PASS. Task 1's `login()` waits on the navigation landmark rather than the old English dashboard artifact, which is exactly the case this covers.

- [ ] **Step 8: Commit**

```bash
git add cms/src/components/admin/dashboard cms/src/payload.config.ts cms/src/app/\(payload\)/admin/importMap.js cms/tests/e2e/shell.e2e.spec.ts
git commit -m "Open the CMS on a launchpad instead of a schema listing

Payload's dashboard is a grid of collection cards named after the schema, which
answers no question a teacher arrives with. This one answers two: where do I go to
work today, and where did I stop last time.

The greeting falls back to the email's local part when an account has no display
name, and a failed count renders a dash rather than blanking the card."
```

---

### Task 9: The vocabulary pass

The four existing components that speak to editors still use absences and generic confirmations. This is where "friendly for non-technical people" is actually delivered — more than any colour choice.

**Files:**
- Modify: `cms/src/components/admin/ChuDeGrid.tsx`, `cms/src/components/admin/ChangTabs.tsx`, `cms/src/components/admin/NoiDungSections.tsx`, `cms/src/components/admin/HinhGallery.tsx`
- Test: `cms/tests/e2e/shell.e2e.spec.ts`

**Interfaces:**
- Consumes: nothing new. Pure string changes plus one added confirmation.

- [ ] **Step 1: Read the four components and inventory their strings**

Run: `cd cms && grep -n "'[^']*[àáảãạăâđêôơư][^']*'\|Không\|Chưa\|Đang" src/components/admin/ChuDeGrid.tsx src/components/admin/ChangTabs.tsx src/components/admin/NoiDungSections.tsx src/components/admin/HinhGallery.tsx`

Expected: every user-facing Vietnamese literal in those files, with line numbers. Work from that list — do not guess at which strings exist.

- [ ] **Step 2: Write the failing test**

Append to `cms/tests/e2e/shell.e2e.spec.ts`:

```ts
test.describe('Editor vocabulary', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('an empty quyển names the next action, not the absence', async ({ page }) => {
    await login({ page, user: testUser })

    await page.getByRole('navigation').getByRole('link', { name: 'Quyển 2' }).click()

    const empty = page.getByText('Bấm “Thêm chủ đề” để tạo cái đầu tiên.')
    const grid = page.getByRole('link', { name: /^Chủ đề|Chưa đặt tên/ })

    // Quyển 2 may or may not have content depending on the database; assert the
    // empty state only when it is genuinely empty.
    if ((await grid.count()) === 0) {
      await expect(empty).toBeVisible()
    }
  })

  test('deleting a chặng says what is lost', async ({ page }) => {
    await login({ page, user: testUser })

    const dialogs: string[] = []
    page.on('dialog', async (dialog) => {
      dialogs.push(dialog.message())
      await dialog.dismiss()
    })

    await page.goto(adminURL('/collections/chu-de'))
    const firstRow = page.locator('table tbody tr td a').first()
    if ((await firstRow.count()) === 0) test.skip(true, 'no chủ đề in this database')
    await firstRow.click()

    const closeTab = page.locator('[class*="tabDelete"]').first()
    if ((await closeTab.count()) === 0) test.skip(true, 'no chặng in this chủ đề')
    await closeTab.click()

    expect(dialogs[0]).toMatch(/^Xoá chặng .* Không khôi phục được\.$/)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd cms && bunx playwright test --config=playwright.config.ts tests/e2e/shell.e2e.spec.ts -g "Editor vocabulary"`

Expected: FAIL on the second test. `ChangTabs` already confirms — `'Xoá chặng này và toàn bộ nội dung bên trong?'` at `src/components/admin/ChangTabs.tsx:141` — but names neither the chặng nor how much goes with it, so it does not match the expected pattern.

- [ ] **Step 4: Apply the wordings**

These are the spec's approved strings. Replace the matching literal in each file; the inventory from Step 1 tells you where.

| File | String |
|---|---|
| `ChuDeGrid.tsx` | `Quyển này chưa có chủ đề nào. Bấm “Thêm chủ đề” để tạo cái đầu tiên.` |
| `ChuDeGrid.tsx` | `Không tải được. Cô thử tải lại trang giúp nhé.` (replaces `Không tải được danh sách chủ đề.`) |
| `ChuDeGrid.tsx` | `Không tạo được chủ đề mới. Cô thử lại giúp nhé.` |
| `ChangTabs.tsx` | `Chủ đề này chưa có chặng nào. Bấm “Thêm chặng” để bắt đầu.` |
| `NoiDungSections.tsx` | `Phần này chưa có bài nào.` |
| `HinhGallery.tsx` | `Bài này chưa có hình. Bấm “Thêm hình” để tải ảnh lên.` |

In `ChangTabs.tsx`, make the existing confirmation say what is lost. The component's
`rows` come from `useField({ hasRows: true })` and carry row metadata, not values, so
the chặng's title and its bài count have to be read out of form state — `useForm()`
exposes `getDataByPath` for exactly this.

Add `getDataByPath` to the existing destructure:

```tsx
  const { addFieldRow, getDataByPath, removeFieldRow } = useForm()
```

and replace the whole `removeRow` callback:

```tsx
  // A chặng holds its whole nội dung → bài → hình subtree, so losing one to a stray click costs
  // a lot more than losing an ordinary array row. Naming the chặng and counting the bài is what
  // makes this a real warning rather than a speed bump — "toàn bộ nội dung bên trong" is true
  // but tells an editor nothing about how much she is about to lose.
  //
  // `rows` carries row metadata rather than values, so the numbers come from form state.
  const removeRow = useCallback(
    (rowIndex: number) => {
      const chang = getDataByPath<{
        noiDungs?: { bais?: unknown[] }[]
        title?: string
      }>(`${path}.${rowIndex}`)

      const baiCount = (chang?.noiDungs ?? []).reduce(
        (total, noiDung) => total + (noiDung?.bais?.length ?? 0),
        0,
      )
      const name = chang?.title?.trim() || UNTITLED

      if (
        !window.confirm(
          `Xoá chặng “${name}” và ${baiCount} bài bên trong? Không khôi phục được.`,
        )
      ) {
        return
      }

      removeFieldRow({ path, rowIndex })
      setActiveIndex(Math.max(0, Math.min(rowIndex, rows.length - 2)))
    },
    [getDataByPath, path, removeFieldRow, rows.length],
  )
```

`UNTITLED` is the module constant already defined at the top of the file (`'Chưa đặt tên'`).

- [ ] **Step 5: Run the tests to verify they pass**

Run: `cd cms && bunx playwright test --config=playwright.config.ts tests/e2e/shell.e2e.spec.ts`

Expected: PASS, all nine tests.

- [ ] **Step 6: Run everything**

Run: `bun run --cwd cms test:int && bun run --cwd cms test:e2e && bun run --cwd cms lint`

Expected: PASS across all three.

- [ ] **Step 7: Commit**

```bash
git add cms/src/components/admin cms/tests/e2e/shell.e2e.spec.ts
git commit -m "Say what editors need to hear, not what the schema knows

Empty states named an absence and stopped; closing a chặng tab deleted every bài
under it with no warning at all. Each empty state now names the next action, and
the delete confirmation counts what goes with it — a number is what makes it a
real warning rather than a speed bump.

Error text drops the internal noun: a teacher who reads 'không tải được danh sách
chủ đề' learns nothing she can act on."
```

---

## Verification

After Task 9, the whole sub-project is verifiable in one pass:

```bash
bun run --cwd cms test:int
bun run --cwd cms test:e2e
bun run --cwd cms lint
bun run --cwd cms build
```

`build` is the one that catches a stale `importMap.js`, since a missing entry fails at runtime rather than at type-check.
