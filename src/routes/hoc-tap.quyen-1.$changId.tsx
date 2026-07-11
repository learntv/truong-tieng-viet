import { createFileRoute } from "@tanstack/react-router";
import { LessonPage } from "@/components/learning/LessonPage";

export const Route = createFileRoute("/hoc-tap/quyen-1/$changId")({
  component: LessonRoute,
});

function LessonRoute() {
  const { changId } = Route.useParams();

  return (
    <main className="flex-1 animate-in fade-in duration-300">
      <LessonPage changId={changId} />
    </main>
  );
}
