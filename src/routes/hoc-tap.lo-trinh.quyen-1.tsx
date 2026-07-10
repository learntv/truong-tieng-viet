import { createFileRoute, Outlet, useChildMatches } from "@tanstack/react-router";
import { Quyen1Roadmap } from "@/components/tabs/LoTrinhTab";

export const Route = createFileRoute("/hoc-tap/lo-trinh/quyen-1")({
  component: Quyen1Layout,
});

function Quyen1Layout() {
  const childMatches = useChildMatches();
  const lessonMatch = childMatches.find((m) => m.routeId === "/hoc-tap/lo-trinh/quyen-1/$changId");
  const isLessonView = !!lessonMatch;
  const changId = lessonMatch ? (lessonMatch.params as { changId: string }).changId : null;

  return (
    <>
      <Quyen1Roadmap isLessonView={isLessonView} changId={changId} />
      <Outlet />
    </>
  );
}
