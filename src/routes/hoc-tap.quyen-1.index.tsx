import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { learningStructureQueryOptions, quyen1ChuDes } from "@/lib/learning";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { OverworldMap } from "@/components/learning/OverworldMap";

// "/hoc-tap/quyen-1" is the hub of the book: an overworld map of Việt Nam with one landmark per
// chủ đề. Moving between chủ đề goes through this map rather than a stepper, so the child always
// sees where they are in the journey.
export const Route = createFileRoute("/hoc-tap/quyen-1/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(learningStructureQueryOptions),
  component: RouteComponent,
});

function RouteComponent() {
  const { data, error } = useQuery(learningStructureQueryOptions);
  // Progress isn't awaited here — the map (background art + pins) renders as soon as the
  // lesson structure is in, using whichever progress is available yet (empty on first paint
  // for a still-resolving session). Statuses correct themselves a beat later instead of the
  // whole map staying behind a skeleton while auth/progress resolve.
  const { activeProgressMap } = useLearningProgress();

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
