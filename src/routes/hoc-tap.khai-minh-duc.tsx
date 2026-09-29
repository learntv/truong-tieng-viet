import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { ArrowRight, BookA, CloudOff, Inbox } from "lucide-react";
import kmdCover from "@/assets/khai-minh-duc-reading.png";
import { useKmdLessons, type KmdLessonSummary } from "@/hooks/useKmdLessons";
import { BackLink } from "@/components/BackLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/empty-state";

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
    <>
      <PageHeader
        icon={BookA}
        hue="leaf"
        title="Khai Minh Đức"
        lede="Học đánh vần cùng chương trình Khai Minh Đức: từng bài âm, vần cùng Trâu con."
        back={<BackLink to="/hoc-tap" label="Học tập" />}
        width="content"
      />

      <Container width="content" className="pb-16 sm:pb-24">
        {isLoading && (
          <ul className="grid gap-4 md:grid-cols-2" aria-busy="true" aria-label="Đang tải bài học">
            {Array.from({ length: 6 }, (_, i) => (
              <li
                key={i}
                className="flex h-28 animate-pulse gap-4 rounded-3xl border border-ink-100 p-3"
              >
                <span className="w-24 rounded-2xl bg-ink-100" />
                <span className="flex flex-1 flex-col justify-center gap-2">
                  <span className="h-3 w-12 rounded-full bg-ink-100" />
                  <span className="h-4 w-3/4 rounded-full bg-ink-100" />
                </span>
              </li>
            ))}
          </ul>
        )}

        {error != null && !isLoading && (
          <EmptyState
            icon={CloudOff}
            title="Chưa tải được danh sách bài học"
            description="Có thể mạng đang chập chờn. Em thử tải lại trang sau một lát nhé!"
          />
        )}

        {!isLoading && !error && lessons != null && lessons.length === 0 && (
          <EmptyState
            icon={Inbox}
            title="Chưa có bài học nào"
            description="Các bài Khai Minh Đức đang được soạn. Em quay lại sau nhé!"
          />
        )}

        {!isLoading && !error && lessons != null && lessons.length > 0 && (
          <ol className="grid gap-4 md:grid-cols-2">
            {lessons.map((lesson, i) => (
              <li
                key={lesson.id}
                className="animate-rise"
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
              >
                <LessonRow lesson={lesson} index={i} />
              </li>
            ))}
          </ol>
        )}
      </Container>
    </>
  );
}

/**
 * One lesson: the programme's art on a leaf wash, then the number, title and
 * the âm/vần it teaches as chips. Every lesson shares one preview image for
 * now — the CMS has no per-bài artwork yet.
 */
function LessonRow({ lesson, index }: { lesson: KmdLessonSummary; index: number }) {
  return (
    <Link
      to="/hoc-tap/khai-minh-duc/$slug"
      params={{ slug: lesson.slug }}
      className="group flex h-full items-stretch gap-4 rounded-3xl border border-ink-100 bg-white p-3 shadow-xs transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-leaf-100 hover:shadow-md"
    >
      <span className="relative w-20 shrink-0 overflow-hidden rounded-2xl bg-leaf-50 sm:w-24">
        <img
          src={kmdCover}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </span>

      <span className="flex min-w-0 flex-1 flex-col justify-center py-1">
        <span className="text-caption font-bold tracking-wide text-leaf-700 uppercase">
          Bài {index + 1}
        </span>
        <span className="mt-1 text-h3 text-ink-900">{lesson.title}</span>
        {lesson.amVan.length > 0 && (
          <span className="mt-2.5 flex flex-wrap gap-1.5">
            {lesson.amVan.map((amVan) => (
              <span
                key={amVan}
                className="rounded-lg bg-leaf-50 px-2 py-0.5 text-sm font-bold text-leaf-700"
              >
                {amVan}
              </span>
            ))}
          </span>
        )}
      </span>

      <span className="grid size-9 shrink-0 self-center place-items-center rounded-full bg-ink-50 text-ink-500 transition-colors duration-200 group-hover:bg-leaf-600 group-hover:text-white">
        <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden />
      </span>
    </Link>
  );
}
