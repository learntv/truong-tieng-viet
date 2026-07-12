import { createFileRoute } from "@tanstack/react-router";
import { LessonPage } from "@/components/learning/LessonPage";

export const Route = createFileRoute("/hoc-tap_/quyen-1_/$changId")({
  component: LessonRoute,
});

function LessonRoute() {
  const { changId } = Route.useParams();
  return <LessonPage changId={changId} />;
}
