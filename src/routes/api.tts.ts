import { createFileRoute } from "@tanstack/react-router";

// Text-to-speech for lesson audio. Synthesizes MP3 directly from Google TTS and streams
// the bytes back to the client. No R2 cache — kept simple so it only depends on
// GOOGLE_TTS_API_KEY. Browsers cache the response by URL (text is the query param).
const MAX_TEXT_LENGTH = 1000;

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const text = new URL(request.url).searchParams.get("text")?.trim() ?? "";
        if (!text) {
          return new Response("Missing 'text' query parameter", { status: 400 });
        }
        if (text.length > MAX_TEXT_LENGTH) {
          return new Response(`'text' exceeds ${MAX_TEXT_LENGTH} characters`, { status: 400 });
        }

        try {
          const { synthesizeSpeech } = await import("@/lib/tts/synthesize.server");
          const audio = await synthesizeSpeech(text);
          return new Response(audio as BodyInit, {
            status: 200,
            headers: {
              "content-type": "audio/mpeg",
              "cache-control": "public, max-age=31536000, immutable",
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
