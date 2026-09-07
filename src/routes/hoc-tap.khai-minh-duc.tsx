import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useKmdLessons } from "@/hooks/useKmdLessons";
import { BackLink } from "@/components/BackLink";
import { PageBanner } from "@/components/site/PageBanner";

export const Route = createFileRoute("/hoc-tap/khai-minh-duc")({
  head: () => ({
    meta: [
      { title: "Khai Minh Đức — Trường Tiếng Việt Của Em" },
      {
        name: "description",
        content: "Học đánh vần cùng chương trình Khai Minh Đức: từng bài âm, vần cùng Trâu con.",
      },
      { property: "og:title", content: "Khai Minh Đức — Trường Tiếng Việt Của Em" },
      {
        property: "og:description",
        content: "Học đánh vần cùng chương trình Khai Minh Đức: từng bài âm, vần cùng Trâu con.",
      },
      { property: "og:url", content: "/hoc-tap/khai-minh-duc" },
    ],
    links: [{ rel: "canonical", href: "/hoc-tap/khai-minh-duc" }],
  }),
  component: KhaiMinhDucLayout,
});

function KhaiMinhDucLayout() {
  // This file is both the /hoc-tap/khai-minh-duc screen and the layout for
  // /hoc-tap/khai-minh-duc/$slug; when a child route matched, render only the child.
  const hasChild = useChildMatches().length > 0;

  return hasChild ? <Outlet /> : <KhaiMinhDucIndex />;
}

function KhaiMinhDucIndex() {
  const { data: lessons, isLoading, error } = useKmdLessons();

  return (
    <div>
      <PageBanner
        title="Khai Minh Đức 📖"
        subtitle="Chọn một bài học âm, vần để cùng Trâu con luyện đánh vần nhé."
        back={<BackLink to="/hoc-tap" label="Quay lại học tập" />}
      />

      <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error != null && !isLoading && (
          <p className="py-16 text-center text-sm font-semibold text-white/80">
            Chưa tải được danh sách bài học — em thử lại sau nhé!
          </p>
        )}

        {!isLoading && !error && lessons != null && lessons.length === 0 && (
          <p className="py-16 text-center text-sm font-semibold text-white/80">
            Chưa có bài học nào.
          </p>
        )}

        {!isLoading && !error && lessons != null && lessons.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  to="/hoc-tap/khai-minh-duc/$slug"
                  params={{ slug: lesson.slug }}
                  className="group block rounded-2xl border-2 border-black/10 bg-white p-5 shadow-[0_2px_0_0_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none"
                >
                  <h2 className="font-display text-lg font-bold text-ink group-hover:underline">
                    {lesson.title}
                  </h2>
                  {lesson.amVan.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {lesson.amVan.map((amVan) => (
                        <li
                          key={amVan}
                          className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary"
                        >
                          {amVan}
                        </li>
                      ))}
                    </ul>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
