import { queryOptions, useQuery } from "@tanstack/react-query";

export type KmdLessonSummary = {
  id: string;
  slug: string;
  title: string;
  amVan: string[];
};

type CmsKmdLessonSummary = {
  id: string | number;
  slug: string;
  title: string;
  amVan?: string[] | null;
};

// Khai Minh Đức lessons are managed in the Payload CMS (cms/ workspace, "bai-kmd" collection)
// and read here over its public REST API, the same way the learning tree and speaking topics are
// (see learning.ts / useSpeakingContent.ts). Every lesson is public — there is no visibility gate.
const CMS_URL: string = import.meta.env.VITE_CMS_URL || process.env.CMS_URL || "";

async function fetchKmdLessons(): Promise<KmdLessonSummary[]> {
  const params = new URLSearchParams([
    ["sort", "_order"],
    ["depth", "0"],
    ["pagination", "false"],
    ["select[title]", "true"],
    ["select[slug]", "true"],
    ["select[amVan]", "true"],
  ]);
  const res = await fetch(`${CMS_URL}/api/bai-kmd?${params}`);
  if (!res.ok) throw new Error(`CMS bai-kmd request failed: ${res.status}`);
  const { docs } = (await res.json()) as { docs: CmsKmdLessonSummary[] };

  return docs.map((doc) => ({
    id: String(doc.id),
    slug: doc.slug,
    title: doc.title,
    amVan: doc.amVan ?? [],
  }));
}

export const kmdLessonsQueryOptions = queryOptions({
  queryKey: ["kmd-lessons"],
  queryFn: fetchKmdLessons,
  staleTime: 5 * 60_000,
});

export function useKmdLessons() {
  const { data, isLoading, error } = useQuery(kmdLessonsQueryOptions);
  return { data, isLoading, error };
}
