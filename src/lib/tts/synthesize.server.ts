import { VOICE_NAME, VOICE_LANGUAGE_CODE, synthesisAudioConfig } from "./voice";

const SYNTHESIZE_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

export async function synthesizeSpeech(text: string): Promise<Uint8Array> {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_TTS_API_KEY environment variable.");
  }

  // API key auth: simpler than a service account (no JWT signing/token exchange), at the
  // cost of being a static, harder-to-scope credential. Restrict it in the Google Cloud
  // Console to the Cloud Text-to-Speech API only — this call is server-only, so the key
  // never reaches a browser, but restricting it still limits the blast radius of a leak.
  const url = new URL(SYNTHESIZE_URL);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: VOICE_LANGUAGE_CODE, name: VOICE_NAME },
      audioConfig: synthesisAudioConfig(VOICE_NAME),
    }),
  });

  if (!res.ok) {
    throw new Error(`Google TTS synthesize failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { audioContent: string };
  const binary = atob(json.audioContent);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
