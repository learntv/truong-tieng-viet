import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { learningStructureQueryOptions, quyen1ChuDes } from "@/lib/learning";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { OverworldMap } from "@/components/learning/OverworldMap";
import { RoadmapSkeleton } from "@/components/learning/RoadmapSkeleton";

// "/hoc-tap/quyen-1" is the hub of the book: an overworld map of Việt Nam with one landmark per
// chủ đề. Moving between chủ đề goes through this map rather than a stepper, so the child always
// sees where they are in the journey.
export const Route = createFileRoute("/hoc-tap/quyen-1/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, error } = useQuery(learningStructureQueryOptions);
  const { authIsLoading, activeProgressMap, isProgressLoading } = useLearningProgress();

  if (isLoading || authIsLoading || isProgressLoading) return <RoadmapSkeleton />;

  const chuDes = quyen1ChuDes(data);

  if (error || chuDes.length === 0) {
    return (
      <section className="flex min-h-[60vh] w-full items-center justify-center px-4 text-center text-navy">
        <div>
          <p className="font-display text-lg font-bold">Chưa có dữ liệu bài học.</p>
          {error ? (
            <p className="mt-2 text-sm text-muted-foreground">{(error as Error).message}</p>
          ) : null}
        </div>
      </section>
    );
  }

  return <OverworldMap chuDes={chuDes} progressMap={activeProgressMap} />;
}
