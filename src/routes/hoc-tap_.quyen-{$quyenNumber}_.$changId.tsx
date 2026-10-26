import { createFileRoute } from "@tanstack/react-router";
import { LessonPage } from "@/components/learning/LessonPage";
import { parseQuyenNumber } from "@/lib/learning";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/hoc-tap_/quyen-{$quyenNumber}_/$changId")({
  head: ({ params }) => {
    const vars = { id: params.changId, book: params.quyenNumber };
    const title = m.learn_meta_lesson_title(vars);
    const description = m.learn_meta_lesson_description(vars);
    const url = `/hoc-tap/quyen-${params.quyenNumber}/${params.changId}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: LessonRoute,
});

function LessonRoute() {
  const { quyenNumber, changId } = Route.useParams();
  const quyen = parseQuyenNumber(quyenNumber);
  // This route is outside the /hoc-tap/quyen-{$quyenNumber} layout (the lesson is full-screen),
  // so it does its own roster check; LessonPage renders its "không tìm thấy bài học" state.
  if (!quyen) return <LessonPage quyenNumber={1} changId="" />;
  return <LessonPage quyenNumber={quyen} changId={changId} />;
}
