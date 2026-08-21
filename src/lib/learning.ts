import { queryOptions } from "@tanstack/react-query";
import type { ChuDe } from "@/data/topics";
import { LESSON_HIGHLIGHTS, type HighlightTarget } from "@/data/lessonHighlights";

const STAGE_EMOJIS = ["👋", "📚", "💬", "📖", "✏️"];
const TOPIC_EMOJIS = ["👨‍👩‍👧", "🏫", "🧑‍🤝‍🧑", "🧸", "🌳", "🏞️", "👩‍⚕️", "🌏"];
const ACCENTS: ChuDe["accent"][] = ["purple", "primary", "green", "yellow", "pink"];

// The learning tree — quyển → chủ đề → chặng → nội dung → bài → hình — is edited in the Payload
// CMS (cms/ workspace) and read here over its public REST API, the same way speaking practice is
// (see useSpeakingContent.ts). It used to come from the app's Supabase public.* tables; those are
// no longer read, and teachers now change lessons from the admin panel instead of the database.
const CMS_URL: string = import.meta.env.VITE_CMS_URL || process.env.CMS_URL || "";

export type Hinh = {
  id: string;
  captions: string[];
  url: string;
  highlightTargets?: HighlightTarget[];
};
export type BaiMeta = { audio_url?: string; video_url?: string; link?: string };
export type Bai = { id: string; texts: string[]; hinhs: Hinh[]; meta?: BaiMeta | null };
export type NoiDung = { id: string; title: string; bais: Bai[] };
export type Chang = {
  id: string;
  title: string;
  emoji: string;
  noiDungs: NoiDung[];
};
export type ChuDeWithChangs = {
  /** Slug of the quyển this chủ đề belongs to, e.g. "quyen-1". */
  quyenSlug: string;
  chuDe: ChuDe;
  changs: Chang[];
};

// --- CMS payload ---------------------------------------------------------------------------

// Only the fields the queries below ask for. Everything is optional because the two queries
// select different slices of the same document and share one parser.
type CmsMedia = { url?: string | null };
type CmsUpload = CmsMedia | number | null;
type CmsQuyen = { slug: string } | number | null;

type CmsHinh = { id: string; image?: CmsUpload; captions?: { text: string }[] | null };
type CmsBai = {
  id: string;
  title?: string | null;
  meta?: { audio?: CmsUpload; videoUrl?: string | null; link?: string | null } | null;
  hinhs?: CmsHinh[] | null;
};
type CmsNoiDung = { id: string; title?: string | null; bais?: CmsBai[] | null };
type CmsChang = { id: string; title?: string | null; noiDungs?: CmsNoiDung[] | null };
type CmsChuDe = {
  id: number;
  title?: string | null;
  quyen?: CmsQuyen;
  changs?: CmsChang[] | null;
};

// A relationship/upload comes back as a bare id at depth 0 and as the document at depth 1; every
// query here uses depth 1, so an object is what we expect. In dev the CMS serves media from its
// own /api/media/file/… route (a site-relative path); in production the s3Storage plugin hands
// back an absolute R2 URL. Relative paths are resolved against the CMS origin, not the app's.
function mediaUrl(value: CmsUpload | undefined): string {
  if (!value || typeof value !== "object") return "";
  const url = value.url;
  if (!url) return "";
  return /^https?:\/\//.test(url) ? url : `${CMS_URL}${url}`;
}

// --- legacy ids ----------------------------------------------------------------------------

// Ids are *not* taken from the CMS. Payload mints its own (a numeric id per chủ đề document,
// a random hex string per array row), while the ids the app already depends on are positional
// strings inherited from the Supabase tables the content came from:
//
//   quyen_1:chude01.chang03.noidung01.bai01.hinh01
//
// They are load-bearing outside this file: public.user_progress rows are keyed by chặng id, so
// switching to Payload's ids would silently reset every student's progress; hình ids key the
// hotspot overlays in src/data/lessonHighlights.ts; and chặng ids appear in lesson URLs that
// have been shared and bookmarked. Every level is numbered 1-based within its parent, exactly
// as the old tables were, so rebuilding them from position reproduces the same strings — and
// keeps producing them for content added in the CMS.
const pad = (n: number) => String(n).padStart(2, "0");

// public.quyen used an underscore ("quyen_1"), the CMS roster a dash ("quyen-1").
function quyenSlugOf(quyen: CmsQuyen | undefined): string {
  return quyen && typeof quyen === "object" ? quyen.slug : "";
}

// --- parsing -------------------------------------------------------------------------------

// Turns a /api/chu-de response into the app's tree. Both queries below run it over their own
// slice of the document, which is what guarantees they agree on ids: the numbering depends only
// on order and nesting, never on the fields that were selected. Fields a query didn't ask for
// come out empty — the structure query has no `hinhs`, the image query no titles.
function parseChuDes(docs: CmsChuDe[]): ChuDeWithChangs[] {
  // Chủ đề are numbered within their quyển, so quyển 2 starts at chude01 again.
  const indexByQuyen = new Map<string, number>();

  return docs.map((doc) => {
    const quyenSlug = quyenSlugOf(doc.quyen);
    const ti = indexByQuyen.get(quyenSlug) ?? 0;
    indexByQuyen.set(quyenSlug, ti + 1);

    const chuDeId = `${quyenSlug.replace(/-/g, "_")}:chude${pad(ti + 1)}`;

    const chuDe: ChuDe = {
      id: chuDeId,
      title: `Chủ đề ${ti + 1}: ${doc.title ?? ""}`,
      emoji: TOPIC_EMOJIS[ti % TOPIC_EMOJIS.length],
      accent: ACCENTS[ti % ACCENTS.length],
    };

    const changs: Chang[] = (doc.changs ?? []).map((ch, si) => {
      const changId = `${chuDeId}.chang${pad(si + 1)}`;
      return {
        id: changId,
        title: ch.title ?? "",
        emoji: STAGE_EMOJIS[si % STAGE_EMOJIS.length],
        noiDungs: (ch.noiDungs ?? []).map((nd, ni) => {
          const noiDungId = `${changId}.noidung${pad(ni + 1)}`;
          return {
            id: noiDungId,
            title: nd.title ?? "",
            bais: (nd.bais ?? []).map((b, bi) => {
              const baiId = `${noiDungId}.bai${pad(bi + 1)}`;
              const audioUrl = mediaUrl(b.meta?.audio);
              const meta: BaiMeta = {};
              if (audioUrl) meta.audio_url = audioUrl;
              if (b.meta?.videoUrl) meta.video_url = b.meta.videoUrl;
              if (b.meta?.link) meta.link = b.meta.link;

              return {
                id: baiId,
                // public.bai.text was a jsonb array of lines; the CMS keeps a single title, so
                // the array the lesson page renders has at most one entry.
                texts: b.title ? [b.title] : [],
                meta: Object.keys(meta).length > 0 ? meta : null,
                hinhs: (b.hinhs ?? []).flatMap((h, hi) => {
                  const url = mediaUrl(h.image);
                  // The image is required in the CMS, so a hình without one only happens if the
                  // upload row went missing; drop it rather than render a broken <img>.
                  if (!url) return [];
                  const hinhId = `${baiId}.hinh${pad(hi + 1)}`;
                  return [
                    {
                      id: hinhId,
                      captions: (h.captions ?? [])
                        .map((c) => c.text)
                        .filter((t) => t.trim().length > 0),
                      url,
                      highlightTargets: LESSON_HIGHLIGHTS[hinhId],
                    },
                  ];
                }),
              };
            }),
          };
        }),
      };
    });

    return { quyenSlug, chuDe, changs };
  });
}

// `select` is a list of field paths ([["changs", "noiDungs", "title"]] → select[changs]
// [noiDungs][title]=true). Payload returns only the named fields, plus the id at every level —
// which is all the sibling levels are needed for here.
async function fetchChuDes(select: string[][]): Promise<CmsChuDe[]> {
  const params = new URLSearchParams([
    // depth 1 resolves the quyển relationship and the media uploads (hình images, bài audio)
    // into documents, which is where their public URLs come from.
    ["depth", "1"],
    ["pagination", "false"],
    ["sort", "_order"],
    ...select.map(
      (path) => [`select${path.map((f) => `[${f}]`).join("")}`, "true"] as [string, string],
    ),
  ]);

  const res = await fetch(`${CMS_URL}/api/chu-de?${params}`);
  if (!res.ok) throw new Error(`CMS chu-de request failed: ${res.status}`);
  const { docs } = (await res.json()) as { docs: CmsChuDe[] };
  return docs;
}

// Structure only (chủ đề / chặng / nội dung / bài) with empty `hinhs`. This is all the roadmap
// needs to draw the map and progress bars, and it's the much smaller half of the payload — so
// skipping the hình here is what lets the roadmap skeleton clear quickly.
function fetchLearningStructure(): Promise<ChuDeWithChangs[]> {
  return fetchChuDes([
    ["title"],
    ["quyen"],
    ["changs", "title"],
    ["changs", "noiDungs", "title"],
    ["changs", "noiDungs", "bais", "title"],
    ["changs", "noiDungs", "bais", "meta"],
  ]).then(parseChuDes);
}

// Hình are split into their own query, keyed by bài id. The roadmap never needs them, so it
// fetches structure alone; the lesson page composes structure + images via `mergeHinhs`. The two
// selections don't overlap, so nothing is downloaded twice when moving from the roadmap into a
// lesson.
export type HinhByBai = Map<string, Hinh[]>;

async function fetchLearningImages(): Promise<HinhByBai> {
  // `quyen` is selected here too: it is what the chủ đề half of every id is built from, so
  // without it this query's bài ids wouldn't match the structure query's.
  const docs = await fetchChuDes([["quyen"], ["changs", "noiDungs", "bais", "hinhs"]]);

  const hinhByBai: HinhByBai = new Map();
  for (const cd of parseChuDes(docs)) {
    for (const ch of cd.changs) {
      for (const nd of ch.noiDungs) {
        for (const b of nd.bais) {
          if (b.hinhs.length > 0) hinhByBai.set(b.id, b.hinhs);
        }
      }
    }
  }
  return hinhByBai;
}

// Fold the image query's result into the structure tree, producing the full `ChuDeWithChangs[]`
// the lesson/speech pages consume. Pure and cheap (O(rows)); rebuilds only the bài level so the
// chủ đề/chặng objects are reused.
export function mergeHinhs(structure: ChuDeWithChangs[], hinhByBai: HinhByBai): ChuDeWithChangs[] {
  return structure.map((cd) => ({
    ...cd,
    changs: cd.changs.map((ch) => ({
      ...ch,
      noiDungs: ch.noiDungs.map((nd) => ({
        ...nd,
        bais: nd.bais.map((b) => ({ ...b, hinhs: hinhByBai.get(b.id) ?? [] })),
      })),
    })),
  }));
}

// Lightweight payload (structure only, no hình) — for the roadmap map.
export const learningStructureQueryOptions = queryOptions({
  queryKey: ["learning-structure"],
  queryFn: fetchLearningStructure,
  staleTime: 5 * 60_000,
});

// Hình grouped by bài id — composed with the structure query (see `useLearningContent`) for the
// lesson/speech pages. Kept separate so it never re-fetches the structural fields and can be
// prefetched on its own while the roadmap is idle.
export const learningImagesQueryOptions = queryOptions({
  queryKey: ["learning-images"],
  queryFn: fetchLearningImages,
  staleTime: 5 * 60_000,
});

// `chuDe.title` carries the "Chủ đề N: " prefix the roadmap headings want; strip it wherever
// the number is already implied by the context (map pins, dashboard tables).
export function chuDeShortTitle(title: string): string {
  return title.replace(/^Chủ đề\s*\d+\s*[:：]\s*/i, "").trim() || title;
}

export const QUYEN_1_SLUG = "quyen-1";

// The chủ đề of Quyển 1. Which quyển a chủ đề belongs to is a real relationship in the CMS, so
// this is a filter rather than the positional slice it had to be when every chủ đề lived in one
// flat table: adding a fifth chủ đề to Quyển 1 in the admin panel is enough to make it appear.
export function quyen1ChuDes(data: ChuDeWithChangs[] | undefined): ChuDeWithChangs[] {
  return (data ?? []).filter((cd) => cd.quyenSlug === QUYEN_1_SLUG);
}

// A chủ đề counts as finished only when it has chặng *and* every one of them is complete — an
// empty chủ đề must not read as "done", or the map would unlock the whole journey on missing
// content. Shared so the map, the index route and the roadmap can't drift apart.
export function isChuDeComplete(
  changs: { id: string }[],
  progressMap: Map<string, { isCompleted: boolean }>,
): boolean {
  return changs.length > 0 && changs.every((ch) => progressMap.get(ch.id)?.isCompleted);
}
