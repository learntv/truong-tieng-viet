import { audioCacheKey } from "./hash";
import { headObject, putObject } from "./r2.server";
import { synthesizeSpeech } from "./synthesize.server";

const CONTENT_TYPE = "audio/mpeg";

// Cache-aside, purely content-addressed: R2 existence at hash(text) IS the source of truth
// for "is this current" — no database involved, no bookkeeping to keep in sync, no orphan
// risk to guard against (an object is either the audio for its own key's text, or it
// doesn't exist yet). A text edit is a different key, full stop.
//
// Called from both the pregeneration script (warms the cache ahead of time) and the
// runtime API route (so correctness never depends on the script having been run). Returns
// the R2 object key rather than bytes — the bucket is public, so callers just need the key
// to redirect to; a HEAD is enough to confirm a cache hit.
export async function ensureAudioForText(text: string): Promise<string> {
  const { objectKey } = await audioCacheKey(text);

  if (await headObject(objectKey)) return objectKey;

  const audio = await synthesizeSpeech(text);
  await putObject(objectKey, audio, CONTENT_TYPE);

  return objectKey;
}
