// `bai.text` is stored as Supabase `Json` — either a single string or an array of strings.
// Mirrors `allTexts` in src/lib/learning.ts, duplicated here so this module has no
// dependency on the browser Supabase client (this is used from a standalone Bun script and
// from server-only route code, neither of which should import the client-side module).
export function baiTextsFromJson(json: unknown): string[] {
  if (Array.isArray(json))
    return json.filter((s): s is string => typeof s === "string" && s.trim().length > 0);
  if (typeof json === "string" && json.trim().length > 0) return [json];
  return [];
}

// One audio clip per bài, spoken as its lines in order with a pause between each.
export function joinForSpeech(texts: string[]): string {
  return texts.join(". ");
}
