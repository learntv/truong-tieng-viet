// Where the Payload CMS (cms/ workspace) answers, for its REST API and its media files.
//
// On Vercel the app and the CMS are two services of one project on one domain (vercel.json):
// the CMS's paths (/api/*, /admin, /_next/*, /brand/*) are routed to it, everything else to
// the app. So in the browser the CMS is same-origin and a site-relative URL is all it takes.
// On the server (SSR loaders) a relative URL has nothing to resolve against, so it uses
// CMS_URL instead, which Vercel injects at runtime through the service binding on the app.
//
// VITE_CMS_URL still wins when it is set: a CMS on its own origin, like the local dev server
// on http://localhost:3001 (bun run dev:cms). Origin only, no trailing slash.
const PUBLIC_CMS_URL: string = import.meta.env.VITE_CMS_URL || "";

// Base for API requests. Read per call, not at module load: the binding is a runtime value.
export function cmsApiBase(): string {
  if (PUBLIC_CMS_URL) return PUBLIC_CMS_URL;
  if (typeof window !== "undefined") return "";
  return (process.env.CMS_URL ?? "").replace(/\/$/, "");
}

// Base for URLs that end up in the page (images, audio). Never the internal binding, since the
// browser has to be able to load them.
export function cmsPublicBase(): string {
  return PUBLIC_CMS_URL;
}
