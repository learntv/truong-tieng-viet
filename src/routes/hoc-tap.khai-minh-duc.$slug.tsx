import "@ttv/lesson-render/tokens.css";

import { createFileRoute, Link } from "@tanstack/react-router";
import { Lesson } from "@ttv/lesson-render";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useKmdLesson } from "@/hooks/useKmdLesson";

export const Route = createFileRoute("/hoc-tap/khai-minh-duc/$slug")({
  head: ({ params }) => {
    const title = `Khai Minh Đức: ${params.slug} — Trường Tiếng Việt Của Em`;
    const description = "Học đánh vần cùng chương trình Khai Minh Đức, cùng Trâu con.";
    const url = `/hoc-tap/khai-minh-duc/${params.slug}`;
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
  component: KhaiMinhDucLessonRoute,
});

function KhaiMinhDucLessonRoute() {
  const { slug } = Route.useParams();
  const { data: lesson, isLoading, error } = useKmdLesson(slug);

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <h1 className="mb-2 font-display text-2xl font-bold text-white">Bài học không có sẵn</h1>
        <p className="mb-6 text-slate-200">Bài học này không tồn tại.</p>
        <Link
          to="/hoc-tap/khai-minh-duc"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-display font-extrabold text-white shadow-bevel-primary transition-[transform,box-shadow,filter] ease-bounce hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-105 active:translate-y-[3px] active:scale-100 active:shadow-bevel-primary-active"
        >
          <ArrowLeft className="h-4 w-4" />
          Xem danh sách bài học
        </Link>
      </div>
    );
  }

  return <Lesson lesson={lesson} />;
}
