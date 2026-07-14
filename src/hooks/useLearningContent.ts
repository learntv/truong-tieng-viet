import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  learningImagesQueryOptions,
  learningStructureQueryOptions,
  mergeHinhs,
  type ChuDeWithChangs,
  type HinhByBai,
} from "@/lib/learning";

const EMPTY_HINH: HinhByBai = new Map();

// The full lesson payload (structure + images), composed from two independent queries so the
// structural tables are shared with the roadmap and never re-fetched. Mirrors the shape of a
// single `useQuery` ({ data, isLoading, error }) so it's a drop-in for the pages that render
// images. `data` is only defined once *both* halves are in, so consumers can rely on `hinhs`
// being populated whenever they have data.
export function useLearningContent() {
  const structure = useQuery(learningStructureQueryOptions);
  const images = useQuery(learningImagesQueryOptions);

  const data = useMemo<ChuDeWithChangs[] | undefined>(
    () => (structure.data && images.data ? mergeHinhs(structure.data, images.data ?? EMPTY_HINH) : undefined),
    [structure.data, images.data],
  );

  return {
    data,
    isLoading: structure.isLoading || images.isLoading,
    error: structure.error ?? images.error,
  };
}
