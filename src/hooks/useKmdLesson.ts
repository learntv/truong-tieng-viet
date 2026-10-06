import { queryOptions, useQuery } from "@tanstack/react-query";

export type KmdLesson = {
  id: string;
  slug: string;
  title: string;
  canvaUrl: string;
};

type CmsKmdLesson = Omit<KmdLesson, "id"> & { id: string | number };

// A single KMD lesson, fetched by slug. Its body is one Canva design, stored by the CMS as an
// already-normalised embed URL (cms/src/lib/canva.ts), so nothing here needs depth.
const CMS_URL: string = import.meta.env.VITE_CMS_URL || process.env.CMS_URL || "";

async function fetchKmdLesson(slug: string): Promise<KmdLesson | null> {
  const params = new URLSearchParams([
    ["where[slug][equals]", slug],
    ["depth", "0"],
    ["limit", "1"],
  ]);
  const res = await fetch(`${CMS_URL}/api/bai-kmd?${params}`);
  if (!res.ok) throw new Error(`CMS bai-kmd request failed: ${res.status}`);
  const { docs } = (await res.json()) as { docs: CmsKmdLesson[] };
  const doc = docs[0];
  return doc ? { ...doc, id: String(doc.id) } : null;
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
