import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { chuDesOfQuyen, learningStructureQueryOptions, parseQuyenNumber } from "@/lib/learning";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { OverworldMap } from "@/components/learning/OverworldMap";

// "/hoc-tap/quyen-N" is the hub of the book: an overworld map of Việt Nam with one landmark per
// chủ đề. Moving between chủ đề goes through this map rather than a stepper, so the child always
// sees where they are in the journey.
export const Route = createFileRoute("/hoc-tap/quyen-{$quyenNumber}/")({
  head: ({ params }) => {
    const n = params.quyenNumber;
    const title = `Bản đồ Quyển ${n} — Trường Tiếng Việt Của Em`;
    const description = `Bản đồ Việt Nam với các chủ đề của Quyển ${n}: chọn địa danh để bắt đầu hành trình học tiếng Việt cùng con.`;
    const url = `/hoc-tap/quyen-${n}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(learningStructureQueryOptions),
  component: RouteComponent,
});

function RouteComponent() {
  const { quyenNumber } = Route.useParams();
  const { data, error } = useQuery(learningStructureQueryOptions);
  // Progress isn't awaited here — the map (background art + pins) renders as soon as the
  // lesson structure is in, using whichever progress is available yet (empty on first paint
  // for a still-resolving session). Statuses correct themselves a beat later instead of the
  // whole map staying behind a skeleton while auth/progress resolve.
  const { activeProgressMap } = useLearningProgress();

  // The parent route has already redirected anything outside the roster, so this can only be
  // null while that redirect is in flight.
  const quyen = parseQuyenNumber(quyenNumber);
  const chuDes = quyen ? chuDesOfQuyen(data, quyen) : [];

  // Only a failed fetch is an error state. A quyển the CMS has no chủ đề for yet is *not*: the
  // map draws every landmark as "sắp có", which is exactly what a book being written looks like.
  if (error || !quyen) {
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

  return <OverworldMap quyenNumber={quyen} chuDes={chuDes} progressMap={activeProgressMap} />;
}
