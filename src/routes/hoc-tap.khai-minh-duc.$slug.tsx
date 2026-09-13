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
        {/* Dark, not white: the sky has white clouds drifting through it. */}
        <Loader2 className="h-10 w-10 animate-spin text-sky-ink" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="mx-auto max-w-lg rounded-[1.75rem] border-[6px] border-white bg-white px-6 py-12 text-center shadow-[0_10px_28px_rgba(12,58,110,0.22)] sm:rounded-[2.25rem] sm:border-[8px]">
        <div className="mb-4 text-6xl">🔍</div>
        <h1 className="mb-2 font-display text-2xl font-bold text-sky-ink">Bài học không có sẵn</h1>
        <p className="mb-6 text-sky-ink-soft">Bài học này không tồn tại.</p>
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

  // The lesson is a deck of already-framed pieces on the bare sky (see __root's
  // BARE_SKY_ROUTES), so the only chrome the route adds is the way back — a
  // floating white pill rather than BackLink's folded corner, which needs a
  // white card corner to fold out of and there is none here.
  return (
    <div className="mx-auto w-full max-w-[90rem]">
      {/* ml-4 lines the pill up with the lesson's own 1rem gutter below it. */}
      <Link
        to="/hoc-tap/khai-minh-duc"
        className="ml-4 inline-flex items-center gap-2 rounded-full border-[3px] border-white bg-white/85 px-4 py-1.5 font-display text-sm font-extrabold text-sky-ink shadow-[0_4px_12px_rgba(12,58,110,0.2)] transition hover:bg-ribbon hover:text-indigo-deep"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
        Danh sách bài học
      </Link>

      <Lesson lesson={lesson} />
    </div>
  );
}
