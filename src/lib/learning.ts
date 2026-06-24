import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Topic } from "@/data/topics";

const STAGE_EMOJIS = ["👋", "📚", "💬", "📖", "✏️"];
const TOPIC_EMOJIS = ["👨‍👩‍👧", "🏫", "🧑‍🤝‍🧑", "🧸", "🌳", "🏞️", "👩‍⚕️", "🌏"];
const ACCENTS: Topic["accent"][] = ["purple", "primary", "green", "yellow", "pink"];
const SIGNED_URL_TTL = 60 * 60;

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

export type LessonImage = { id: string; caption: string; url: string };
export type Lesson = { id: string; texts: string[]; images: LessonImage[] };
export type Section = { id: string; title: string; lessons: Lesson[] };
export type LearningStage = {
  id: string;
  title: string;
  emoji: string;
  sections: Section[];
};
export type TopicWithStages = {
  topic: Topic;
  stages: LearningStage[];
};

async function fetchLearningData(): Promise<TopicWithStages[]> {
  const [chudeRes, changRes, ndRes, baiRes, hinhRes] = await Promise.all([
    supabase.from("chude").select("id, position, text").order("position", { ascending: true }),
    supabase.from("chang").select("id, position, text, chude_id").order("position", { ascending: true }),
    supabase.from("noidung").select("id, position, text, chang_id").order("position", { ascending: true }),
    supabase.from("bai").select("id, position, text, noidung_id").order("position", { ascending: true }),
    supabase.from("hinh").select("id, position, text, bai_id, storage_bucket, storage_path").order("position", { ascending: true }),
  ]);

  for (const r of [chudeRes, changRes, ndRes, baiRes, hinhRes]) {
    if (r.error) throw r.error;
  }

  const chude = chudeRes.data ?? [];
  const chang = changRes.data ?? [];
  const noidung = ndRes.data ?? [];
  const bai = baiRes.data ?? [];
  const hinh = hinhRes.data ?? [];

  // Batch sign URLs per bucket
  const byBucket = new Map<string, string[]>();
  for (const h of hinh) {
    const arr = byBucket.get(h.storage_bucket) ?? [];
    arr.push(h.storage_path);
    byBucket.set(h.storage_bucket, arr);
  }
  const urlByKey = new Map<string, string>();
  await Promise.all(
    Array.from(byBucket.entries()).map(async ([bucket, paths]) => {
      const unique = Array.from(new Set(paths));
      const { data, error } = await supabase.storage.from(bucket).createSignedUrls(unique, SIGNED_URL_TTL);
      if (error) throw error;
      for (const item of data ?? []) {
        if (item.path && item.signedUrl) urlByKey.set(`${bucket}/${item.path}`, item.signedUrl);
      }
    }),
  );

  const hinhByBai = new Map<string, LessonImage[]>();
  for (const h of hinh) {
    const url = urlByKey.get(`${h.storage_bucket}/${h.storage_path}`) ?? "";
    const arr = hinhByBai.get(h.bai_id) ?? [];
    arr.push({ id: h.id, caption: firstText(h.text), url });
    hinhByBai.set(h.bai_id, arr);
  }

  const baiByNd = new Map<string, Lesson[]>();
  for (const b of bai) {
    const arr = baiByNd.get(b.noidung_id) ?? [];
    arr.push({
      id: b.id,
      texts: allTexts(b.text),
      images: hinhByBai.get(b.id) ?? [],
    });
    baiByNd.set(b.noidung_id, arr);
  }

  const ndByChang = new Map<string, Section[]>();
  for (const n of noidung) {
    const arr = ndByChang.get(n.chang_id) ?? [];
    arr.push({
      id: n.id,
      title: firstText(n.text),
      lessons: baiByNd.get(n.id) ?? [],
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
    const topicTitle = titleCase(firstText(cd.text));
    const topic: Topic = {
      id: cd.id,
      title: `Chủ đề ${ti + 1}: ${topicTitle}`,
      emoji: TOPIC_EMOJIS[ti % TOPIC_EMOJIS.length],
      accent: ACCENTS[ti % ACCENTS.length],
    };

    const stages: LearningStage[] = (changByChude.get(cd.id) ?? []).map((ch, si) => ({
      id: ch.id,
      title: titleCase(firstText(ch.text)),
      emoji: STAGE_EMOJIS[si % STAGE_EMOJIS.length],
      sections: ndByChang.get(ch.id) ?? [],
    }));

    return { topic, stages };
  });
}

export const learningDataQueryOptions = queryOptions({
  queryKey: ["learning-data"],
  queryFn: fetchLearningData,
  staleTime: 5 * 60_000,
});
