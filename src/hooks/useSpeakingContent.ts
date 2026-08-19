import { queryOptions, useQuery } from "@tanstack/react-query";
import type { SpeakingSentence } from "@/lib/speech";

export type SpeakingTopic = {
  id: string;
  emoji: string;
  title: string;
  sentences: SpeakingSentence[];
};

type CmsSpeakingTopic = {
  id: string;
  emoji: string;
  title: string;
  sentences: { id: string; text: string }[] | null;
};

// Curated speaking-practice topics for /luyen-noi, managed in the Payload CMS
// (cms/ workspace, "speaking-topics" collection) and read over its public REST
// API. Topic and sentence ids keep the "noi-" prefix used since the content was
// hardcoded — topic ids are the /luyen-noi/$chuDeId param and sentence ids key
// user progress, so the CMS preserves them verbatim.
const CMS_URL: string = import.meta.env.VITE_CMS_URL || process.env.CMS_URL || "";

async function fetchSpeakingContent(): Promise<SpeakingTopic[]> {
  const res = await fetch(`${CMS_URL}/api/speaking-topics?sort=_order&pagination=false&depth=0`);
  if (!res.ok) throw new Error(`CMS speaking-topics request failed: ${res.status}`);
  const { docs } = (await res.json()) as { docs: CmsSpeakingTopic[] };

  return docs.map((t) => ({
    id: t.id,
    emoji: t.emoji,
    title: t.title,
    sentences: (t.sentences ?? []).map((s) => ({ id: s.id, text: s.text })),
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
