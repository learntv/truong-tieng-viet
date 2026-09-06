/**
 * Where the e2e suite expects this app to be serving.
 *
 * `package.json` runs the dev server on 3001 (3000 belongs to the app half of the repo), so
 * the port lives here rather than being written out at each `page.goto` — the suite used to
 * hardcode 3000 in five places while `next dev` bound 3001, and nothing could connect.
 *
 * `playwright.config.ts` repeats this same expression instead of importing it: Playwright
 * treats whatever the config imports as a config dependency, and then refuses to collect
 * those files as tests. Keep the two in step.
 *
 * `PLAYWRIGHT_SERVER_URL` overrides it, for pointing the suite at a server on another port.
 */
export const serverURL = process.env.PLAYWRIGHT_SERVER_URL || 'http://localhost:3001'
