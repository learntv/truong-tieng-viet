import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { KmdThumb } from "@/components/kmd/KmdThumb";
import { Mascot } from "@/components/Mascot";
import { Skeleton } from "@/components/ui/skeleton";
import { useKmdLesson } from "@/hooks/useKmdLesson";
import { useKmdLessons } from "@/hooks/useKmdLessons";

export const Route = createFileRoute("/hoc-tap/khai-minh-duc/$slug")({
  head: ({ params }) => {
    const title = `Khai Minh Đức: ${params.slug} | Trường Tiếng Việt Của Em`;
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
  // The lesson's place in the list, for its "Bài n" and thumbnail colour. Usually already cached
  // from the list page; until it arrives the title card simply shows neither.
  const { data: lessons } = useKmdLessons();
  const position = lessons?.findIndex((l) => l.slug === slug) ?? -1;

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

  // One white card on the bare sky (see __root's BARE_SKY_ROUTES): the title row on top, the
  // lesson's Canva design under it. The way back is a round arrow button at the title row's
  // left edge, centred against it, rather than BackLink's folded corner.
  return (
    <article className="mx-auto max-w-5xl px-0 pb-6 pt-3 sm:px-4 sm:pb-10 sm:pt-4">
      <div className="rounded-[1.25rem] bg-white p-2 pb-6 shadow-[0_10px_28px_rgba(12,58,110,0.22)] sm:rounded-[1.75rem] sm:p-2.5 sm:pb-10">
        <header className="mb-6 flex items-center gap-3 sm:mb-10 sm:gap-4">
          <Link
            to="/hoc-tap/khai-minh-duc"
            aria-label="Danh sách bài học"
            className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sky-ink transition-colors hover:bg-green hover:text-white sm:ml-1.5 sm:h-11 sm:w-11"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Link>
          {position >= 0 && <KmdThumb index={position} className="w-[5.5rem] sm:w-[7.5rem]" />}
          <div className="min-w-0 flex-1">
            {position >= 0 && (
              <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.08em] text-green">
                Bài {position + 1}
              </p>
            )}
            <h1 className="font-display text-[clamp(1.35rem,2.6vw,1.9rem)] font-bold leading-tight text-sky-ink">
              {lesson.title}
            </h1>
          </div>
          <Mascot
            pose="reading-sitting"
            decorative
            className="mr-2 hidden h-20 shrink-0 -scale-x-100 sm:block"
          />
        </header>

        {/* Inner radius = the card's radius less its padding, so the two curves stay parallel. */}
        <div className="overflow-hidden rounded-xl sm:rounded-[1.125rem]">
          {/* Only a Canva design URL is ever framed: the CMS stores nothing else in this field, and
           * checking again here keeps an arbitrary page from being embedded if that ever changes.
           * Lessons created before the switch to Canva have an empty one until an editor adds it. */}
          {lesson.canvaUrl.startsWith("https://www.canva.com/design/") ? (
            // Keyed by URL so moving to another lesson starts from the skeleton again.
            <CanvaEmbed key={lesson.canvaUrl} src={lesson.canvaUrl} title={lesson.title} />
          ) : (
            <p className="flex aspect-video items-center justify-center px-6 text-center font-semibold text-sky-ink-soft">
              Bài học này đang được soạn.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * The design in its 16:9 frame, with a pulsing skeleton in its place until the iframe's load
 * event, so a slow Canva embed shows a placeholder rather than an empty white box. The iframe
 * is only ever rendered on the client (the lesson arrives through useQuery), so its load event
 * can't fire before React is listening.
 */
function CanvaEmbed({ src, title }: { src: string; title: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-video">
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <iframe
        src={src}
        title={title}
        allow="fullscreen"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
