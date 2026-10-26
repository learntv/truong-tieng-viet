import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import roundArrowForward from "@iconify-icons/ic/round-arrow-forward";
import mdiLoading from "@iconify-icons/mdi/loading";
import { KmdThumb } from "@/components/kmd/KmdThumb";
import { useKmdLessons, type KmdLessonSummary } from "@/hooks/useKmdLessons";
import { PageBanner } from "@/components/site/PageBanner";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/hoc-tap/khai-minh-duc")({
  head: () => ({
    meta: [
      { title: "Khai Minh Đức | Trường Tiếng Việt Của Em" },
      { name: "description", content: m.learn_meta_kmd_description() },
      { property: "og:title", content: "Khai Minh Đức | Trường Tiếng Việt Của Em" },
      { property: "og:description", content: m.learn_meta_kmd_description() },
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
      <PageBanner title="Khai Minh Đức" back={{ label: m.learn_learning(), to: "/hoc-tap" }} />

      <div className="relative px-4 pb-10 pt-8 sm:px-8">
        {isLoading && (
          <div className="flex justify-center py-16">
            <Icon icon={mdiLoading} className="h-8 w-8 animate-spin text-primary" aria-hidden />
          </div>
        )}

        {error != null && !isLoading && (
          <p className="py-16 text-center text-sm font-semibold text-muted-foreground">
            {m.learn_kmd_load_failed()}
          </p>
        )}

        {!isLoading && !error && lessons != null && lessons.length === 0 && (
          <p className="py-16 text-center text-sm font-semibold text-muted-foreground">
            {m.learn_kmd_empty()}
          </p>
        )}

        {!isLoading && !error && lessons != null && lessons.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {lessons.map((lesson, i) => (
              <li key={lesson.id}>
                <LessonRow lesson={lesson} index={i} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/**
 * One lesson in the grid: a white card with the preview art inset on the
 * left, the number and title in the middle, and a round arrow button on the
 * right.
 */
function LessonRow({ lesson, index }: { lesson: KmdLessonSummary; index: number }) {
  return (
    <Link
      to="/hoc-tap/khai-minh-duc/$slug"
      params={{ slug: lesson.slug }}
      className="group flex h-full items-center gap-3 rounded-2xl border border-border/70 bg-card p-2.5 shadow-[0_2px_10px_rgba(15,23,42,0.05)] transition-shadow duration-150 hover:shadow-[0_6px_20px_rgba(15,23,42,0.09)] sm:gap-4"
    >
      <KmdThumb index={index} className="w-24 sm:w-28" />

      <div className="min-w-0 flex-1">
        <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-green">
          {m.learn_lesson_n({ n: index + 1 })}
        </p>
        <h2 className="mt-1 font-display text-base font-bold leading-snug text-foreground">
          {lesson.title}
        </h2>
      </div>

      <span className="mr-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-green group-hover:text-white">
        <Icon
          icon={roundArrowForward}
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
