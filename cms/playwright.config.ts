import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import 'dotenv/config'

/*
 * Where this app serves. `package.json` runs the dev server on 3001 (3000 belongs to the app
 * half of the repo); the suite used to hardcode 3000 in five places while `next dev` bound
 * 3001, so nothing could connect.
 *
 * Deliberately duplicated from `tests/helpers/serverURL.ts` rather than imported from it:
 * Playwright treats anything the config imports as a config dependency, and a config that
 * reaches into `testDir` makes it refuse to collect those files as tests.
 */
const serverURL = process.env.PLAYWRIGHT_SERVER_URL || 'http://localhost:3001'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /*
   * One worker, everywhere. Every spec signs in as the same seeded user and `seedTestUser`
   * deletes it before recreating it, so two specs running at once delete each other's session
   * — and the admin specs share one database besides.
   */
  workers: 1,
  /*
   * Generous, because the first navigation to /admin in `next dev` compiles the whole admin
   * bundle before it answers, which is well past Playwright's 30s default — and that lands in
   * a `beforeAll` hook, which fails the entire file rather than one test.
   */
  timeout: 120_000,
  expect: { timeout: 15_000 },
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: serverURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    // The repo is on bun; `pnpm dev` here launched nothing that could answer.
    command: 'bun run dev',
    reuseExistingServer: true,
    // Booting Payload against a database it has to reconcile takes well over the 60s default.
    timeout: 180_000,
    url: serverURL,
  },
})
