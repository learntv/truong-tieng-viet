import { createFileRoute } from "@tanstack/react-router";

// Text-to-speech for lesson audio, purely content-addressed — no database lookup at all.
// The caller (LessonPage) already has the exact text on screen, so it sends that text
// directly (`/api/tts?text=...`) instead of a bài id; the route hashes it, resolves the
// current content-hash key via the same `ensureAudioForText` cache-aside path the
// pregeneration script uses (see src/lib/tts/audio-cache.server.ts) — so this route IS the
// fallback, not a separate one — then 302s to the object's public R2 URL. The bucket is
// public, so it can serve the actual bytes directly (cheaper than the Worker proxying
// them), and because the R2 URL is content-hashed it's safe to hand out with a year-long
// immutable cache (set at upload time in r2.server.ts) without risking staleness.
//
// A stateless, unauthenticated endpoint that synthesizes arbitrary caller-supplied text
// would otherwise be an open door to running up the Google Cloud TTS bill — MAX_TEXT_LENGTH
// keeps that bounded to roughly "one bài's worth of lines" without needing to reintroduce a
// database check.
const MAX_TEXT_LENGTH = 1000;

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
        if (!publicBaseUrl) {
          console.error("[api/tts] Missing R2_PUBLIC_BASE_URL environment variable.");
          return new Response("Audio not configured", { status: 502 });
        }

        const text = new URL(request.url).searchParams.get("text")?.trim() ?? "";
        if (!text) {
          return new Response("Missing 'text' query parameter", { status: 400 });
        }
        if (text.length > MAX_TEXT_LENGTH) {
          return new Response(`'text' exceeds ${MAX_TEXT_LENGTH} characters`, { status: 400 });
        }

        try {
          // `.server.ts` modules are import-protected from the client bundle, so they're
          // loaded dynamically here rather than at module scope (this route file itself
          // still ships to the client bundle as part of the isomorphic route tree).
          const { ensureAudioForText } = await import("@/lib/tts/audio-cache.server");
          const objectKey = await ensureAudioForText(text);
          return new Response(null, {
            status: 302,
            headers: {
              location: `${publicBaseUrl}/${objectKey}`,
              // The redirect itself must NOT be cached long-term — it's keyed by request
              // text, and a different request could reuse this URL for different text later
              // (e.g. proxied/cached by an intermediary keyed only on path). Only the R2
              // object it points to is immutable.
              "cache-control": "no-store",
            },
          });
        } catch (err) {
          console.error(`[api/tts] synthesis failed:`, err);
          return new Response("Audio generation failed", { status: 502 });
        }
      },
    },
  },
});
