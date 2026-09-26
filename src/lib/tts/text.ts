// One audio clip per bài, spoken as its lines in order with a pause between each.
export function joinForSpeech(texts: string[]): string {
  return texts.join(". ");
}

// The one place that builds a /api/tts URL from text — every "tap to hear" button in the
// app (lesson narration, word-cloud captions, alphabet sounds, speaking-practice playback)
// goes through this so the query-param shape can't drift between call sites.
export function ttsSrc(text: string): string {
  return `/api/tts?text=${encodeURIComponent(text)}`;
}
