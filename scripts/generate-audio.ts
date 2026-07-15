// Pregenerates Google TTS audio for every `bai` row and warms the R2 cache, so lesson
// pages don't pay on-the-fly synthesis latency for their first visitor. Correctness does
// NOT depend on this script running — `/api/tts` hashes whatever text the client sends and
// uses the same `ensureAudioForText` cache-aside function, so a missed or stale run just
// means the first request for that text is a little slower, never wrong or stuck serving
// old audio (there's nothing to go stale: the cache key IS the text's hash).
//
// Reads `bai` rows with the plain public client — no service-role key needed, since this
// pipeline never writes to Supabase (see src/lib/tts/audio-cache.server.ts).
//
// Usage:
//   bun run scripts/generate-audio.ts          # warm the cache for all bai rows
//   bun run scripts/generate-audio.ts --prune   # also delete orphaned R2 objects

import { supabase } from "@/integrations/supabase/client";
import { ensureAudioForText } from "@/lib/tts/audio-cache.server";
import { audioCacheKey } from "@/lib/tts/hash";
import { headObject, listObjectKeys, deleteObject } from "@/lib/tts/r2.server";
import { baiTextsFromJson, joinForSpeech } from "@/lib/tts/text";

async function fetchBaiTexts(): Promise<string[]> {
  const { data: rows, error } = await supabase.from("bai").select("id, text");
  if (error) throw error;

  const texts = rows
    .map((row) => joinForSpeech(baiTextsFromJson(row.text)))
    .filter((t) => t.length > 0);
  console.log(`[generate-audio] ${rows.length} bài rows, ${texts.length} with text to speak`);
  return texts;
}

async function generate(texts: string[]) {
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  // Distinct texts only — identical sentences across different bài share one R2 object.
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
// current hash of some live bai's text. Catches storage bloat from edited/deleted bai rows
// — not needed for correctness, only for keeping R2 usage from growing unbounded.
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

const texts = await fetchBaiTexts();
await generate(texts);
if (process.argv.includes("--prune")) {
  await prune(texts);
}
