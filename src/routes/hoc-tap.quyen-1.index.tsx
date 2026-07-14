import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { learningStructureQueryOptions } from "@/lib/learning";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { loadBuffaloPos } from "@/components/tabs/LearningTab";
import { RoadmapSkeleton } from "@/components/learning/RoadmapSkeleton";

// Bare "/hoc-tap/quyen-1" has no chủ đề of its own — bounce to wherever the user is actually
// studying: the last-opened topic if it isn't finished yet, otherwise the first chủ đề that
// still has incomplete stages (so finishing chủ đề 1 lands you on chủ đề 2, not back on 1).
export const Route = createFileRoute("/hoc-tap/quyen-1/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { data } = useQuery(learningStructureQueryOptions);
  const { authIsLoading, activeProgressMap, isProgressLoading } = useLearningProgress();

  useEffect(() => {
    if (!data || data.length === 0 || authIsLoading || isProgressLoading) return;

    const isChuDeComplete = (i: number) => {
      const changs = data[i]?.changs ?? [];
      return changs.length > 0 && changs.every((ch) => activeProgressMap.get(ch.id)?.isCompleted);
    };

    const saved = loadBuffaloPos();
    let chuDeIndex: number;
    if (saved && saved.chuDeIndex >= 0 && saved.chuDeIndex < data.length && !isChuDeComplete(saved.chuDeIndex)) {
      chuDeIndex = saved.chuDeIndex;
    } else {
      const firstIncomplete = data.findIndex((_, i) => !isChuDeComplete(i));
      chuDeIndex = firstIncomplete !== -1 ? firstIncomplete : data.length - 1;
    }

    navigate({
      to: "/hoc-tap/quyen-1/chu-de-{$chuDeIndex}",
      params: { chuDeIndex: String(chuDeIndex + 1) },
      replace: true,
    });
  }, [data, authIsLoading, isProgressLoading, activeProgressMap, navigate]);

  return <RoadmapSkeleton />;
}
