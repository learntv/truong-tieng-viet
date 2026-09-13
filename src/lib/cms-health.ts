// Debug only: one console line on startup saying whether the Payload CMS
// (cms/ workspace) is reachable, so a blank lesson page can be told apart from
// a backend that is simply down or pointed at the wrong origin.
const CMS_URL: string = import.meta.env.VITE_CMS_URL || process.env.CMS_URL || "";

let logged = false;

export function logCmsHealth() {
  // Once per page load — StrictMode mounts effects twice in dev.
  if (logged || typeof window === "undefined") return;
  logged = true;

  if (!CMS_URL) {
    console.log("[cms] ✖ not configured — VITE_CMS_URL is empty");
    return;
  }

  const started = performance.now();
  // The cheapest document read there is: proves the API answers and the
  // collection is publicly readable, without pulling a lesson down.
  fetch(`${CMS_URL}/api/chu-de?limit=1&depth=0`)
    .then((res) => {
      const ms = Math.round(performance.now() - started);
      console.log(
        res.ok
          ? `[cms] ✔ loaded — ${CMS_URL} (${res.status}, ${ms}ms)`
          : `[cms] ✖ failed — ${CMS_URL} responded ${res.status} ${res.statusText} (${ms}ms)`,
      );
    })
    .catch((err) => {
      console.log(`[cms] ✖ unreachable — ${CMS_URL}: ${err instanceof Error ? err.message : err}`);
    });
}
