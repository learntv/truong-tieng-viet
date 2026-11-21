// Debug only: one console line on startup saying whether the Payload CMS
// (cms/ workspace) is reachable, so a blank lesson page can be told apart from
// a backend that is simply down or pointed at the wrong origin.
import { cmsApiBase } from "@/lib/cms-url";

let logged = false;

export function logCmsHealth() {
  // Once per page load — StrictMode mounts effects twice in dev.
  if (logged || typeof window === "undefined") return;
  logged = true;

  // Empty means same-origin: the CMS is routed under this site's /api (vercel.json).
  const base = cmsApiBase();
  const where = base || "same origin";

  const started = performance.now();
  // The cheapest document read there is: proves the API answers and the
  // collection is publicly readable, without pulling a lesson down.
  fetch(`${base}/api/chu-de?limit=1&depth=0`)
    .then((res) => {
      const ms = Math.round(performance.now() - started);
      console.log(
        res.ok
          ? `[cms] ✔ loaded — ${where} (${res.status}, ${ms}ms)`
          : `[cms] ✖ failed — ${where} responded ${res.status} ${res.statusText} (${ms}ms)`,
      );
    })
    .catch((err) => {
      console.log(`[cms] ✖ unreachable — ${where}: ${err instanceof Error ? err.message : err}`);
    });
}
