import { VOICE_NAME, synthesisAudioConfig } from "./voice";

// Content-addressed cache keys for lesson audio. Keyed by text AND the full resolved voice
// config (name + speakingRate + pitch, whichever of those actually apply to this voice) —
// not by which bài it belongs to — so identical sentences across different bài share one R2
// object, a text edit always produces a new key with no separate "is this stale" tracking
// needed anywhere (not even in the DB), and changing anything in voice.ts automatically
// invalidates every cached object instead of silently serving audio synthesized under the
// old settings.
export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Short prefix is enough entropy for a cache key (collision risk is negligible at this
// scale) and keeps R2 object keys/URLs readable.
export async function audioCacheKey(text: string): Promise<{ hash: string; objectKey: string }> {
  const configKey = JSON.stringify(synthesisAudioConfig(VOICE_NAME));
  const hash = (await sha256Hex(`${VOICE_NAME}\n${configKey}\n${text}`)).slice(0, 16);
  return { hash, objectKey: `audio/${hash}.mp3` };
}
