import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import kmdCover from "@/assets/khai-minh-duc-reading.png";
import { useKmdLessons, type KmdLessonSummary } from "@/hooks/useKmdLessons";
import { BackLink } from "@/components/BackLink";
import { PageBanner } from "@/components/site/PageBanner";
import type { SkyBoxTone } from "@/components/ui/sky-box";

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
        title="Khai Minh Đức"
        back={<BackLink to="/hoc-tap" label="Quay lại học tập" />}
      />

      <div className="relative mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error != null && !isLoading && (
          <p className="py-16 text-center text-sm font-semibold text-muted-foreground">
            Chưa tải được danh sách bài học — em thử lại sau nhé!
          </p>
        )}

        {!isLoading && !error && lessons != null && lessons.length === 0 && (
          <p className="py-16 text-center text-sm font-semibold text-muted-foreground">
            Chưa có bài học nào.
          </p>
        )}

        {!isLoading && !error && lessons != null && lessons.length > 0 && (
          <ul className="flex flex-col gap-3 sm:gap-4">
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
 * The tones cycle down the list so a long roll of otherwise identical rows
 * still has a rhythm — the same trick the luyện nói cards play with
 * STAGE_COLORS. Mint leads because that is the tone the Khai Minh Đức tile
 * carries on the học tập bento, so arriving here lands on the colour you
 * clicked.
 */
const ROW_TONES = [
  "mint",
  "ice",
  "peach",
  "lavender",
  "pink",
  "cream",
] as const satisfies readonly SkyBoxTone[];

const TONE_BG: Record<(typeof ROW_TONES)[number], { light: string; deep: string }> = {
  mint: { light: "bg-box-mint", deep: "bg-box-mint-deep" },
  ice: { light: "bg-box-ice", deep: "bg-box-ice-deep" },
  peach: { light: "bg-box-peach", deep: "bg-box-peach-deep" },
  lavender: { light: "bg-box-lavender", deep: "bg-box-lavender-deep" },
  pink: { light: "bg-box-pink", deep: "bg-box-pink-deep" },
  cream: { light: "bg-box-cream", deep: "bg-box-cream-deep" },
};

/**
 * One lesson in the roll: a SkyBox laid on its side. The lighter half on the
 * left holds the preview art, the deeper half on the right holds the number,
 * title and its âm/vần. No white border here — these rows sit on SkyPage's
 * white card, where a white keyline would be invisible; the soft shadow does
 * the separating instead.
 *
 * Every lesson shares one preview image for now: the CMS has no per-bài
 * artwork yet, so `lesson` carries no cover and this falls back to the
 * programme's own illustration.
 */
function LessonRow({ lesson, index }: { lesson: KmdLessonSummary; index: number }) {
  const tone = TONE_BG[ROW_TONES[index % ROW_TONES.length]];

  return (
    <Link
      to="/hoc-tap/khai-minh-duc/$slug"
      params={{ slug: lesson.slug }}
      className="group block rounded-[1.25rem] shadow-[0_4px_16px_rgba(12,58,110,0.14)] transition-transform duration-150 hover:scale-[1.015] active:scale-100 sm:rounded-[1.5rem]"
    >
      <div className="flex items-stretch overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem]">
        <div className={["relative w-24 shrink-0 sm:w-36", tone.light].join(" ")}>
          <img
            src={kmdCover}
            alt=""
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        <div
          className={[
            "flex min-w-0 flex-1 items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4",
            tone.deep,
          ].join(" ")}
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-sky-ink-soft">
              Bài {index + 1}
            </p>
            <h2 className="mt-1 font-display text-base font-bold leading-tight text-sky-ink sm:text-lg">
              {lesson.title}
            </h2>
            {lesson.amVan.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {lesson.amVan.map((amVan) => (
                  <li
                    key={amVan}
                    className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-bold text-sky-ink"
                  >
                    {amVan}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <ArrowRight
            className="h-5 w-5 shrink-0 text-sky-ink-soft transition-transform group-hover:translate-x-0.5"
            strokeWidth={2.5}
          />
        </div>
      </div>
    </Link>
  );
}
