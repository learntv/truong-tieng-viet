import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Topic, Stage, Vocab } from "@/data/topics";

const STAGE_EMOJIS = ["👋", "📚", "💬", "📖", "✏️"];
const TOPIC_EMOJIS = ["👨‍👩‍👧", "🏫", "🧑‍🤝‍🧑", "🧸", "🌳", "🏞️", "👩‍⚕️", "🌏"];
const ACCENTS: Topic["accent"][] = ["purple", "primary", "green", "yellow", "pink"];

function firstText(text: unknown): string {
  if (Array.isArray(text) && text.length > 0 && typeof text[0] === "string") return text[0];
  if (typeof text === "string") return text;
  return "";
}

function titleCase(s: string): string {
  return s
    .toLocaleLowerCase("vi")
    .replace(/(^|\s)\p{L}/gu, (m) => m.toLocaleUpperCase("vi"));
}

export type TopicWithStages = {
  topic: Topic;
  stages: Stage[];
};

async function fetchLearningData(): Promise<TopicWithStages[]> {
  const { data: chude, error: chudeErr } = await supabase
    .from("chude")
    .select("id, position, text")
    .order("position", { ascending: true });
  if (chudeErr) throw chudeErr;

  const { data: chang, error: changErr } = await supabase
    .from("chang")
    .select("id, position, text, chude_id")
    .order("position", { ascending: true });
  if (changErr) throw changErr;

  const { data: noidung, error: ndErr } = await supabase
    .from("noidung")
    .select("id, position, chang_id")
    .order("position", { ascending: true });
  if (ndErr) throw ndErr;

  const { data: bai, error: baiErr } = await supabase
    .from("bai")
    .select("id, position, text, noidung_id")
    .order("position", { ascending: true });
  if (baiErr) throw baiErr;

  const baiByNd = new Map<string, typeof bai>();
  for (const b of bai ?? []) {
    const arr = baiByNd.get(b.noidung_id) ?? [];
    arr.push(b);
    baiByNd.set(b.noidung_id, arr);
  }

  const ndByChang = new Map<string, typeof noidung>();
  for (const n of noidung ?? []) {
    const arr = ndByChang.get(n.chang_id) ?? [];
    arr.push(n);
    ndByChang.set(n.chang_id, arr);
  }

  const changByChude = new Map<string, typeof chang>();
  for (const c of chang ?? []) {
    const arr = changByChude.get(c.chude_id) ?? [];
    arr.push(c);
    changByChude.set(c.chude_id, arr);
  }

  return (chude ?? []).map((cd, ti) => {
    const topicTitle = titleCase(firstText(cd.text));
    const topic: Topic = {
      id: cd.id,
      title: `Chủ đề ${ti + 1}: ${topicTitle}`,
      emoji: TOPIC_EMOJIS[ti % TOPIC_EMOJIS.length],
      accent: ACCENTS[ti % ACCENTS.length],
    };

    const stages: Stage[] = (changByChude.get(cd.id) ?? []).map((ch, si) => {
      const stageTitle = titleCase(firstText(ch.text));
      const nds = ndByChang.get(ch.id) ?? [];
      const vocab: Vocab[] = [];
      for (const nd of nds) {
        for (const b of baiByNd.get(nd.id) ?? []) {
          const t = firstText(b.text);
          if (t) vocab.push({ vi: t, en: "" });
        }
      }
      return {
        id: ch.id,
        title: stageTitle,
        imageEmoji: STAGE_EMOJIS[si % STAGE_EMOJIS.length],
        sampleVocabulary: vocab,
      };
    });

    return { topic, stages };
  });
}

export const learningDataQueryOptions = queryOptions({
  queryKey: ["learning-data"],
  queryFn: fetchLearningData,
  staleTime: 5 * 60_000,
});
