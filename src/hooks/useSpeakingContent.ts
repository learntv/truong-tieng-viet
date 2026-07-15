import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SpeakingSentence } from "@/lib/speech";

export type SpeakingTopic = {
  id: string;
  emoji: string;
  title: string;
  sentences: SpeakingSentence[];
};

// Curated speaking-practice topics for /luyen-noi, alongside the ones derived
// from lesson content (see extractSpeakingSentences). Lives in speaking_topic/
// speaking_sentence rather than the chude/chang curriculum tables so it can't
// collide with curriculum ids in the /luyen-noi/$chuDeId param — sentence and
// topic ids keep the "noi-" prefix used since the content was hardcoded.
async function fetchSpeakingContent(): Promise<SpeakingTopic[]> {
  const [topicsRes, sentencesRes] = await Promise.all([
    supabase
      .from("speaking_topic")
      .select("id, emoji, title, position")
      .order("position", { ascending: true }),
    supabase
      .from("speaking_sentence")
      .select("id, topic_id, text, position")
      .order("position", { ascending: true }),
  ]);
  if (topicsRes.error) throw topicsRes.error;
  if (sentencesRes.error) throw sentencesRes.error;

  const sentencesByTopic = new Map<string, SpeakingSentence[]>();
  for (const s of sentencesRes.data ?? []) {
    const arr = sentencesByTopic.get(s.topic_id) ?? [];
    arr.push({ id: s.id, text: s.text });
    sentencesByTopic.set(s.topic_id, arr);
  }

  return (topicsRes.data ?? []).map((t) => ({
    id: t.id,
    emoji: t.emoji,
    title: t.title,
    sentences: sentencesByTopic.get(t.id) ?? [],
  }));
}

export const speakingContentQueryOptions = queryOptions({
  queryKey: ["speaking-content"],
  queryFn: fetchSpeakingContent,
  staleTime: 5 * 60_000,
});

export function useSpeakingContent() {
  const { data, isLoading, error } = useQuery(speakingContentQueryOptions);
  return { data, isLoading, error };
}
