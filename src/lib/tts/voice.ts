// Single source of truth for voice config — imported by both synthesize.server.ts (to call
// Google TTS) and hash.ts (folded into the cache key). Keeping it here means changing the
// voice automatically invalidates every previously-cached object instead of silently
// leaving old audio, synthesized in the old voice, sitting under an unchanged key.
//
// Picked by ear via scripts/preview-voices.ts, which synthesizes a sample sentence with
// every vi-VN voice Google offers — easiest way to compare before touching this constant.
export const VOICE_NAME = "vi-VN-Wavenet-C";
export const VOICE_LANGUAGE_CODE = "vi-VN";

// Rate/pitch tuned for kids, mirroring what the browser-speechSynthesis fallback
// (src/lib/speech.ts) already uses, so pregenerated/TTS and browser-fallback audio sound
// consistent with each other.
export const SPEAKING_RATE = 0.7;
export const PITCH = 1.05;

// Chirp3-HD voices reject the `pitch` parameter outright (400 INVALID_ARGUMENT) — every
// other tier (Wavenet/Standard/Neural2) accepts it.
export function voiceSupportsPitch(voiceName: string): boolean {
  return !voiceName.includes("Chirp3-HD");
}

export type SynthesisAudioConfig = { audioEncoding: "MP3"; speakingRate: number; pitch?: number };

// The actual set of params sent to Google AND folded into the cache key — one function so
// the two can't drift apart on which knobs are in effect for the configured voice (e.g. if
// this reverts to a Chirp3-HD voice, both the API call and the hash silently drop `pitch`
// together, instead of the hash still claiming credit for a pitch that was never applied).
export function synthesisAudioConfig(voiceName: string): SynthesisAudioConfig {
  return voiceSupportsPitch(voiceName)
    ? { audioEncoding: "MP3", speakingRate: SPEAKING_RATE, pitch: PITCH }
    : { audioEncoding: "MP3", speakingRate: SPEAKING_RATE };
}
