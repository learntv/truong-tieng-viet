import { queryOptions, useQuery } from "@tanstack/react-query";
import type { LessonDoc } from "@ttv/lesson-render";

type CmsKmdLesson = LessonDoc & { id: string | number };

// A single KMD lesson, fetched by slug at depth 2 — deep enough to resolve the media documents
// behind rich-text uploads and vocabulary-card pictures (see useKmdLessons.ts for the index's
// shallower, structure-only query over the same collection).
const CMS_URL: string = import.meta.env.VITE_CMS_URL || process.env.CMS_URL || "";

async function fetchKmdLesson(slug: string): Promise<LessonDoc | null> {
  const params = new URLSearchParams([
    ["where[slug][equals]", slug],
    ["depth", "2"],
    ["limit", "1"],
  ]);
  const res = await fetch(`${CMS_URL}/api/bai-kmd?${params}`);
  if (!res.ok) throw new Error(`CMS bai-kmd request failed: ${res.status}`);
  const { docs } = (await res.json()) as { docs: CmsKmdLesson[] };
  return docs[0] ?? null;
}

export const kmdLessonQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["kmd-lesson", slug],
    queryFn: () => fetchKmdLesson(slug),
    staleTime: 5 * 60_000,
  });

export function useKmdLesson(slug: string) {
  const { data, isLoading, error } = useQuery(kmdLessonQueryOptions(slug));
  return { data, isLoading, error };
}
