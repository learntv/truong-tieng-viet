// `/api/tts` on the CMS's own origin, so the shared lesson renderer (packages/lesson-render),
// which asks for `/api/tts?text=…` as a relative URL, speaks in the admin preview and the
// hotspot editor as well as on the site.
//
// The CMS doesn't synthesize anything itself. It hands the request to the site's route
// (src/routes/api.tts.ts), which owns the Google key and the R2 cache, so there is one
// synthesis path and one cache. A static segment beats Payload's `api/[...slug]` catch-all.
//
// SITE_URL is unset locally (see .env.example), where the site runs from `vite dev` on 8080.
const siteUrl = () => process.env.SITE_URL?.replace(/\/+$/, '') || 'http://localhost:8080'

export const GET = (request: Request) => {
  const { search } = new URL(request.url)
  return new Response(null, {
    status: 302,
    headers: { location: `${siteUrl()}/api/tts${search}`, 'cache-control': 'no-store' },
  })
}
