// One-off dev tool: lists every vi-VN voice Google Cloud TTS actually offers (rather than
// guessing from docs, which go stale) and synthesizes the same sample sentence with each so
// you can compare them by ear before picking one for src/lib/tts/synthesize.server.ts.
// Not part of the app's runtime pipeline — run manually, delete anytime.
//
// Usage: bun run scripts/preview-voices.ts

import { synthesisAudioConfig } from "@/lib/tts/voice";

const SAMPLE_TEXT = "Chỉ vào hình, hỏi đáp. Đây là cây mít, phải không?";
const OUT_DIR = "./scripts/.voice-previews";

const apiKey = process.env.GOOGLE_TTS_API_KEY;
if (!apiKey) throw new Error("Missing GOOGLE_TTS_API_KEY environment variable.");

type Voice = { name: string; ssmlGender: string; naturalSampleRateHertz: number };

async function listVietnameseVoices(): Promise<Voice[]> {
  const url = new URL("https://texttospeech.googleapis.com/v1/voices");
  url.searchParams.set("key", apiKey!);
  url.searchParams.set("languageCode", "vi-VN");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`voices:list failed (${res.status}): ${await res.text()}`);

  const json = (await res.json()) as { voices: Voice[] };
  return json.voices.sort((a, b) => a.name.localeCompare(b.name));
}

async function synthesize(voiceName: string): Promise<Uint8Array> {
  const url = new URL("https://texttospeech.googleapis.com/v1/text:synthesize");
  url.searchParams.set("key", apiKey!);

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      input: { text: SAMPLE_TEXT },
      voice: { languageCode: "vi-VN", name: voiceName },
      audioConfig: synthesisAudioConfig(voiceName),
    }),
  });
  if (!res.ok)
    throw new Error(`synthesize(${voiceName}) failed (${res.status}): ${await res.text()}`);

  const json = (await res.json()) as { audioContent: string };
  const binary = atob(json.audioContent);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

const voices = await listVietnameseVoices();
console.log(`Found ${voices.length} vi-VN voices:\n`);

await Bun.$`mkdir -p ${OUT_DIR}`;

for (const voice of voices) {
  try {
    const audio = await synthesize(voice.name);
    await Bun.write(`${OUT_DIR}/${voice.name}.mp3`, audio);
    console.log(`  ✓ ${voice.name} (${voice.ssmlGender})`);
  } catch (err) {
    console.error(`  ✗ ${voice.name}:`, err instanceof Error ? err.message : err);
  }
}

console.log(`\nSaved previews to ${OUT_DIR}/ — have a listen and pick one.`);
