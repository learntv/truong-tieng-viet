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
