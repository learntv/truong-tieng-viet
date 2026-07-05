import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ChuDe } from "@/data/topics";

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

export type Hinh = { id: string; captions: string[]; url: string };
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

async function fetchLearningData(): Promise<ChuDeWithChangs[]> {
  const [chudeRes, changRes, ndRes, baiRes, hinhRes] = await Promise.all([
    supabase.from("chude").select("id, position, text").order("position", { ascending: true }),
    supabase.from("chang").select("id, position, text, chude_id").order("position", { ascending: true }),
    supabase.from("noidung").select("id, position, text, chang_id").order("position", { ascending: true }),
    supabase.from("bai").select("id, position, text, noidung_id, meta").order("position", { ascending: true }),
    supabase.from("hinh").select("id, position, text, bai_id, storage_path").order("position", { ascending: true }),
  ]);

  for (const r of [chudeRes, changRes, ndRes, baiRes, hinhRes]) {
    if (r.error) throw r.error;
  }

  const chude = chudeRes.data ?? [];
  const chang = changRes.data ?? [];
  const noidung = ndRes.data ?? [];
  const bai = baiRes.data ?? [];
  const hinh = hinhRes.data ?? [];

  // storage_path and meta.audio_url are already full public URLs (sgk bucket is public).
  const hinhByBai = new Map<string, Hinh[]>();
  for (const h of hinh) {
    const arr = hinhByBai.get(h.bai_id) ?? [];
    arr.push({ id: h.id, captions: allTexts(h.text), url: h.storage_path ?? "" });
    hinhByBai.set(h.bai_id, arr);
  }

  const baiByNd = new Map<string, Bai[]>();
  for (const b of bai) {
    const meta = (b.meta && typeof b.meta === "object" && !Array.isArray(b.meta)) ? (b.meta as BaiMeta) : null;
    const arr = baiByNd.get(b.noidung_id) ?? [];
    arr.push({
      id: b.id,
      texts: allTexts(b.text),
      hinhs: hinhByBai.get(b.id) ?? [],
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

export const learningDataQueryOptions = queryOptions({
  queryKey: ["learning-data"],
  queryFn: fetchLearningData,
  staleTime: 5 * 60_000,
});
