/**
 * Every e2e test addresses the admin panel through this helper.
 *
 * The CMS dev server runs on 3001 by default (`next dev -p ${CMS_PORT:-3001}` in
 * package.json), not Next's default 3000 — the root workspace's Vite app owns 8080 and
 * 3000 is left free for scratch servers. Precedence, outermost first: CMS_TEST_URL (a
 * full URL, for a suite running against an already-deployed instance) overrides
 * CMS_PORT (just the port, e.g. to dodge a dev server already running for another
 * checkout of this repo), which overrides the 3001 default.
 */
export const SERVER_URL =
  process.env.CMS_TEST_URL ?? `http://localhost:${process.env.CMS_PORT ?? '3001'}`

export const adminURL = (path = ''): string => `${SERVER_URL}/admin${path}`
