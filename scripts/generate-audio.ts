// Pregenerates Google TTS audio and warms the R2 cache for everything the app can speak —
// bài lesson text, image captions (word cloud + speaking practice), the static alphabet
// data, and the curated /luyen-noi topic sentences — so none of them pay on-the-fly
// synthesis latency on first click. Correctness does NOT depend on this script running —
// /api/tts hashes whatever text the client sends and uses the same `ensureAudioForText`
// cache-aside function, so a missed or stale run just means the first request for that text
// is a little slower, never wrong or stuck serving old audio (there's nothing to go stale:
// the cache key IS the text's hash).
//
// Reads `bai`/`hinh` rows with the plain public client — no service-role key needed, since
// this pipeline never writes to Supabase (see src/lib/tts/audio-cache.server.ts).
//
// Usage:
//   bun run scripts/generate-audio.ts          # warm the cache for everything speakable
//   bun run scripts/generate-audio.ts --prune   # also delete orphaned R2 objects

import { supabase } from "@/integrations/supabase/client";
import { ensureAudioForText } from "@/lib/tts/audio-cache.server";
import { audioCacheKey } from "@/lib/tts/hash";
import { headObject, listObjectKeys, deleteObject } from "@/lib/tts/r2.server";
import { baiTextsFromJson, joinForSpeech } from "@/lib/tts/text";
import { ALPHABET } from "@/data/alphabet";
import { SPEAKING_TOPICS } from "@/data/speaking-topics";

async function fetchDbTexts(): Promise<string[]> {
  const [baiRes, hinhRes] = await Promise.all([
    supabase.from("bai").select("id, text"),
    supabase.from("hinh").select("id, text"),
  ]);
  if (baiRes.error) throw baiRes.error;
  if (hinhRes.error) throw hinhRes.error;

  // Bài text is spoken as one joined clip per bài (matches how LessonPage's AudioButton
  // plays it); captions are spoken individually, one per word-cloud chip.
  const baiTexts = baiRes.data
    .map((row) => joinForSpeech(baiTextsFromJson(row.text)))
    .filter((t) => t.length > 0);
  const captionTexts = hinhRes.data.flatMap((row) => baiTextsFromJson(row.text));

  console.log(
    `[generate-audio] ${baiRes.data.length} bài rows, ${hinhRes.data.length} hình rows ` +
      `→ ${baiTexts.length} bài texts, ${captionTexts.length} captions`,
  );
  return [...baiTexts, ...captionTexts];
}

function staticTexts(): string[] {
  const alphabetTexts = ALPHABET.flatMap((letter) => [
    letter.soundName,
    ...letter.words.map((w) => w.vi),
  ]);
  const speakingTopicTexts = SPEAKING_TOPICS.flatMap((topic) => topic.sentences);
  console.log(
    `[generate-audio] ${alphabetTexts.length} alphabet texts, ${speakingTopicTexts.length} speaking-topic sentences`,
  );
  return [...alphabetTexts, ...speakingTopicTexts];
}

async function generate(texts: string[]) {
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  // Distinct texts only — identical sentences (e.g. a word that's also a bài caption) share
  // one R2 object.
  for (const text of new Set(texts)) {
    const { objectKey } = await audioCacheKey(text);
    if (await headObject(objectKey)) {
      skipped++;
      continue;
    }

    try {
      await ensureAudioForText(text);
      generated++;
      console.log(`[generate-audio] generated ${objectKey}`);
    } catch (err) {
      failed++;
      console.error(`[generate-audio] FAILED "${text.slice(0, 40)}...":`, err);
    }
  }

  console.log(
    `[generate-audio] done — generated ${generated}, skipped ${skipped} (already cached), failed ${failed}`,
  );
}

// Lists everything actually in R2 under audio/ and removes any object that isn't the
// current hash of some live, still-speakable text. Catches storage bloat from edited/deleted
// content — not needed for correctness, only for keeping R2 usage from growing unbounded.
async function prune(texts: string[]) {
  const expectedKeys = new Set<string>();
  for (const text of texts) {
    const { objectKey } = await audioCacheKey(text);
    expectedKeys.add(objectKey);
  }

  const actualKeys = await listObjectKeys("audio/");
  const orphans = actualKeys.filter((k) => !expectedKeys.has(k));

  console.log(
    `[generate-audio] prune: ${actualKeys.length} objects in R2, ${orphans.length} orphaned`,
  );
  for (const key of orphans) {
    await deleteObject(key);
    console.log(`[generate-audio] pruned ${key}`);
  }
}

const texts = [...(await fetchDbTexts()), ...staticTexts()];
await generate(texts);
if (process.argv.includes("--prune")) {
  await prune(texts);
}
