import { createFileRoute } from "@tanstack/react-router";
import { LessonPage } from "@/components/learning/LessonPage";

export const Route = createFileRoute("/hoc-tap_/quyen-1_/$changId")({
  head: ({ params }) => {
    const title = `Bài học ${params.changId} — Quyển 1 — Trường Tiếng Việt Của Em`;
    const description = `Bài học tiếng Việt (chặng ${params.changId}) thuộc Quyển 1: nội dung, hình ảnh và luyện tập cho trẻ em kiều bào.`;
    const url = `/hoc-tap/quyen-1/${params.changId}`;
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
  const { changId } = Route.useParams();
  return <LessonPage changId={changId} />;
}
