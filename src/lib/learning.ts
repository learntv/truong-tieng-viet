import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ChuDe } from "@/data/topics";
import { LESSON_HIGHLIGHTS, type HighlightTarget } from "@/data/lessonHighlights";

const STAGE_EMOJIS = ["👋", "📚", "💬", "📖", "✏️"];
const TOPIC_EMOJIS = ["👨‍👩‍👧", "🏫", "🧑‍🤝‍🧑", "🧸", "🌳", "🏞️", "👩‍⚕️", "🌏"];
const ACCENTS: ChuDe["accent"][] = ["purple", "primary", "green", "yellow", "pink"];

function firstText(text: unknown): string {
  if (Array.isArray(text) && text.length > 0 && typeof text[0] === "string") return text[0];
  if (typeof text === "string") return text;
  return "";
}

function allTexts(text: unknown): string[] {
  if (Array.isArray(text)) return text.filter((s): s is string => typeof s === "string" && s.trim().length > 0);
  if (typeof text === "string" && text.trim().length > 0) return [text];
  return [];
}

function titleCase(s: string): string {
  return s
    .toLocaleLowerCase("vi")
    .replace(/(^|\s)\p{L}/gu, (m) => m.toLocaleUpperCase("vi"));
}

export type Hinh = { id: string; captions: string[]; url: string; highlightTargets?: HighlightTarget[] };
export type BaiMeta = { audio_url?: string; video_url?: string; link?: string };
export type Bai = { id: string; texts: string[]; hinhs: Hinh[]; meta?: BaiMeta | null; audioUrl?: string };
export type NoiDung = { id: string; title: string; bais: Bai[] };
export type Chang = {
  id: string;
  title: string;
  emoji: string;
  noiDungs: NoiDung[];
};
export type ChuDeWithChangs = {
  chuDe: ChuDe;
  changs: Chang[];
};

// Supabase caps PostgREST responses at 1000 rows by default. These queries fetch whole
// tables, so hitting the cap means rows were silently dropped — lessons would lose
// content with no error anywhere. Warn loudly so it's caught before users notice.
const SUPABASE_DEFAULT_ROW_LIMIT = 1000;

function warnIfTruncated(table: string, rowCount: number) {
  if (rowCount >= SUPABASE_DEFAULT_ROW_LIMIT) {
    console.warn(
      `[learning] Table "${table}" returned ${rowCount} rows — at Supabase's default ` +
        `${SUPABASE_DEFAULT_ROW_LIMIT}-row limit, so results are likely truncated and lesson ` +
        `content may be missing. Split the query (e.g. per chang) or raise the limit.`,
    );
  }
}

// Images (the `hinh` table) are split into their own query, keyed by bài id. The roadmap never
// needs them, so it fetches structure alone; the lesson/speech pages compose structure + images
// via `mergeHinhs`. Keeping them as two *non-overlapping* queries (structure = chude/chang/
// noidung/bai, images = hinh only) means every table is fetched exactly once and shared across
// pages — no table gets re-downloaded when moving from the roadmap into a lesson.
export type HinhByBai = Map<string, Hinh[]>;

// Structure only (chủ đề / chặng / nội dung / bài) with empty `hinhs`. This is all the roadmap
// needs to draw the map and progress bars, and it's the much smaller half of the payload — so
// skipping the image table here is what lets the roadmap skeleton clear quickly.
async function fetchLearningStructure(): Promise<ChuDeWithChangs[]> {
  const [chudeRes, changRes, ndRes, baiRes] = await Promise.all([
    supabase.from("chude").select("id, position, text").order("position", { ascending: true }),
    supabase.from("chang").select("id, position, text, chude_id").order("position", { ascending: true }),
    supabase.from("noidung").select("id, position, text, chang_id").order("position", { ascending: true }),
    supabase.from("bai").select("id, position, text, noidung_id, meta").order("position", { ascending: true }),
  ]);

  for (const r of [chudeRes, changRes, ndRes, baiRes]) {
    if (r.error) throw r.error;
  }

  warnIfTruncated("chude", chudeRes.data?.length ?? 0);
  warnIfTruncated("chang", changRes.data?.length ?? 0);
  warnIfTruncated("noidung", ndRes.data?.length ?? 0);
  warnIfTruncated("bai", baiRes.data?.length ?? 0);

  const chude = chudeRes.data ?? [];
  const chang = changRes.data ?? [];
  const noidung = ndRes.data ?? [];
  const bai = baiRes.data ?? [];

  const baiByNd = new Map<string, Bai[]>();
  for (const b of bai) {
    const meta = (b.meta && typeof b.meta === "object" && !Array.isArray(b.meta)) ? (b.meta as BaiMeta) : null;
    const arr = baiByNd.get(b.noidung_id) ?? [];
    arr.push({
      id: b.id,
      texts: allTexts(b.text),
      hinhs: [],
      meta,
      audioUrl: meta?.audio_url || undefined,
    });
    baiByNd.set(b.noidung_id, arr);
  }

  const ndByChang = new Map<string, NoiDung[]>();
  for (const n of noidung) {
    const arr = ndByChang.get(n.chang_id) ?? [];
    arr.push({
      id: n.id,
      title: firstText(n.text),
      bais: baiByNd.get(n.id) ?? [],
    });
    ndByChang.set(n.chang_id, arr);
  }

  const changByChude = new Map<string, typeof chang>();
  for (const c of chang) {
    const arr = changByChude.get(c.chude_id) ?? [];
    arr.push(c);
    changByChude.set(c.chude_id, arr);
  }

  return chude.map((cd, ti) => {
    const chuDeTitle = titleCase(firstText(cd.text));
    const chuDe: ChuDe = {
      id: cd.id,
      title: `Chủ đề ${ti + 1}: ${chuDeTitle}`,
      emoji: TOPIC_EMOJIS[ti % TOPIC_EMOJIS.length],
      accent: ACCENTS[ti % ACCENTS.length],
    };

    const changs: Chang[] = (changByChude.get(cd.id) ?? []).map((ch, si) => ({
      id: ch.id,
      title: titleCase(firstText(ch.text)),
      emoji: STAGE_EMOJIS[si % STAGE_EMOJIS.length],
      noiDungs: ndByChang.get(ch.id) ?? [],
    }));

    return { chuDe, changs };
  });
}

// Just the `hinh` table, grouped by bài id. storage_path is already a full public URL.
async function fetchLearningImages(): Promise<HinhByBai> {
  const hinhRes = await supabase
    .from("hinh")
    .select("id, position, text, bai_id, storage_path")
    .order("position", { ascending: true });
  if (hinhRes.error) throw hinhRes.error;
  warnIfTruncated("hinh", hinhRes.data?.length ?? 0);

  const hinhByBai: HinhByBai = new Map();
  for (const h of hinhRes.data ?? []) {
    const arr = hinhByBai.get(h.bai_id) ?? [];
    arr.push({ id: h.id, captions: allTexts(h.text), url: h.storage_path ?? "", highlightTargets: LESSON_HIGHLIGHTS[h.id] });
    hinhByBai.set(h.bai_id, arr);
  }
  return hinhByBai;
}

// Fold the image query's result into the structure tree, producing the full `ChuDeWithChangs[]`
// the lesson/speech pages consume. Pure and cheap (O(rows)); rebuilds only the bài level so the
// chủ đề/chặng objects are reused.
export function mergeHinhs(structure: ChuDeWithChangs[], hinhByBai: HinhByBai): ChuDeWithChangs[] {
  return structure.map((cd) => ({
    chuDe: cd.chuDe,
    changs: cd.changs.map((ch) => ({
      ...ch,
      noiDungs: ch.noiDungs.map((nd) => ({
        ...nd,
        bais: nd.bais.map((b) => ({ ...b, hinhs: hinhByBai.get(b.id) ?? [] })),
      })),
    })),
  }));
}

// Lightweight payload (structure only, no `hinh`) — for the roadmap map.
export const learningStructureQueryOptions = queryOptions({
  queryKey: ["learning-structure"],
  queryFn: fetchLearningStructure,
  staleTime: 5 * 60_000,
});

// Image records grouped by bài id — composed with the structure query (see `useLearningContent`)
// for the lesson/speech pages. Kept separate so it never re-fetches the structural tables and
// can be prefetched on its own while the roadmap is idle.
export const learningImagesQueryOptions = queryOptions({
  queryKey: ["learning-images"],
  queryFn: fetchLearningImages,
  staleTime: 5 * 60_000,
});

// The one shared definition of "is this the Quyển 1 roadmap" — used by both the immersive
// layout branch (src/routes/hoc-tap.tsx) and the scroll-restoration opt-out (src/router.tsx).
// A plain `pathname.startsWith("/hoc-tap/quyen-1")` would also match a future
// "/hoc-tap/quyen-10" or "/hoc-tap/quyen-1-preview" route; matching the exact segment avoids
// that, and keeping it in one place means both call sites can't drift out of sync.
export function isQuyen1Path(pathname: string): boolean {
  return pathname === "/hoc-tap/quyen-1" || pathname.startsWith("/hoc-tap/quyen-1/");
}
