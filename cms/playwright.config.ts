import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import 'dotenv/config'

/**
 * The CMS dev server's port. CMS_PORT lets a suite run against a non-default port (for
 * example, to avoid colliding with a dev server already running for another checkout of
 * this repo); CMS_TEST_URL below is the outermost override and takes precedence over
 * this when a suite runs against a fully separate, already-deployed instance.
 */
const PORT = process.env.CMS_PORT ?? '3001'
const BASE_URL = process.env.CMS_TEST_URL ?? `http://localhost:${PORT}`

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
   * These e2e tests share one database and one seeded admin user
   * (dev@payloadcms.com, from tests/helpers/seedUser.ts). Playwright runs separate
   * spec files on separate workers by default, so parallel workers race on
   * seedTestUser/cleanupTestUser — one file's cleanup deletes the account another
   * file is still logged in as. The suite is small enough that serialising it
   * costs little next to the flakiness it removes.
   */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: BASE_URL,

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
    command: 'bun run dev',
    reuseExistingServer: true,
    url: BASE_URL,
  },
})
