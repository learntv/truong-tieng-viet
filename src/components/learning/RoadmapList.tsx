import { ArrowLeft, BookOpen, Check, CircleDot, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ChuDe } from "@/data/topics";
import { STAGE_COLORS } from "./stageColors";
import { Button } from "@/components/ui/button";
import { locationForChuDe } from "@/data/scenes";
import { QUYEN1_LANDMARKS } from "@/data/overworld";
import { badgeForChuDe } from "@/data/badges";
import { BadgeMedal } from "./BadgeMedal";

// Per-topic accent, keyed by ChuDe.accent — tints the coming-soon emoji plate.
const ACCENT_SOFT: Record<ChuDe["accent"], string> = {
  primary: "bg-primary/10",
  yellow: "bg-yellow/20",
  pink: "bg-pink/15",
  purple: "bg-purple/15",
  green: "bg-green/15",
};

function getLessonButtonLabel(
  index: number,
  completedChangs: Set<number>,
  startedChangs: Set<number>,
): string {
  if (completedChangs.has(index)) return "Ôn tập";
  if (startedChangs.has(index)) return "Tiếp tục";
  return "Bắt đầu";
}

/**
 * The place this chủ đề is set in. `QUYEN1_LANDMARKS` is the authority on *which* place that is,
 * because it's what the overworld map pins the child clicked to get here — `CHU_DE_LOCATIONS` in
 * scenes.ts only tracks which backdrop *artwork* exists, and its indices don't line up with the
 * journey (chủ đề 2 is Hội An, but its backdrop is the golden-bridge painting). Fall back to the
 * scenes entry only for chủ đề the landmark list doesn't cover.
 */
function placeForChuDe(chuDeIndex: number): { name: string; blurb: string; photo?: string } {
  const landmark = QUYEN1_LANDMARKS.find((l) => l.chuDeIndex === chuDeIndex);
  if (landmark) {
    return { name: landmark.name, blurb: landmark.description, photo: landmark.photo };
  }
  return locationForChuDe(chuDeIndex);
}

export function RoadmapList({
  chuDe,
  chuDeIndex,
  isLocked,
  changTitles,
  changEmojis,
  changTotals,
  currentChangIndex,
  completedChangs,
  startedChangs,
  onOpenLesson,
  changProgress,
}: {
  chuDe: ChuDe;
  chuDeIndex: number;
  isLocked: boolean;
  changTitles: string[];
  changEmojis: string[];
  /** Total bài per chặng, for the card's "N bài học" line. */
  changTotals: number[];
  currentChangIndex: number;
  completedChangs: Set<number>;
  startedChangs: Set<number>;
  onOpenLesson: (i: number) => void;
  changProgress: Map<number, { current: number; total: number }>;
}) {
  const accentSoft = ACCENT_SOFT[chuDe.accent] ?? ACCENT_SOFT.primary;
  const location = placeForChuDe(chuDeIndex);
  const photo = location.photo;
  const badge = badgeForChuDe(chuDeIndex);

  const totalStages = changTitles.length;
  const doneStages = Math.min(completedChangs.size, totalStages);
  const pct = totalStages ? Math.round((doneStages / totalStages) * 100) : 0;
  const allDone = totalStages > 0 && doneStages === totalStages;

  // "Chủ đề 3: Bạn bè" reads as a heading + kicker in this layout: the number becomes the
  // stamped tag, the name the big title. Titles without the "N:" prefix fall through whole.
  const titleName = chuDe.title.includes(":")
    ? chuDe.title.slice(chuDe.title.indexOf(":") + 1).trim()
    : chuDe.title;

  return (
    <div className="w-full">
      {/* ── Hero band: full-bleed, flat, no card. Breadcrumb, title, one line of blurb and the
          primary action on the left; a plain photo of the place on the right. ── */}
      <div className="w-full bg-rose-tint">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
          <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/hoc-tap" className="font-semibold text-ink hover:underline">
              Học tập
            </Link>
            <span className="px-1.5">&gt;</span>
            <Link to="/hoc-tap/quyen-1" className="font-semibold text-ink hover:underline">
              Quyển 1
            </Link>
            <span className="px-1.5">&gt;</span>
            <span>{location.name}</span>
          </nav>

          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
            <div className="min-w-0">
              {isLocked && (
                <span className="mb-3 inline-flex items-center gap-1 bg-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <Lock className="h-3 w-3" strokeWidth={2.5} />
                  Sắp có
                </span>
              )}

              <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
                {location.name}
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                {location.blurb}
              </p>

              {!isLocked && (
                <button
                  type="button"
                  onClick={() => onOpenLesson(currentChangIndex)}
                  className="mt-7 cursor-pointer bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:text-base"
                >
                  {doneStages === 0 ? "Bắt đầu học" : allDone ? "Ôn tập lại" : "Tiếp tục học"}
                </button>
              )}
            </div>

            {photo && (
              <img src={photo} alt={location.name} className="aspect-[16/10] w-full object-cover" />
            )}
          </div>
        </div>
      </div>

      {/* ── Stat band: full-bleed colour strip carrying progress and the badge in one line each
          — replaces the note cards that used to sit beside the list. ── */}
      {!isLocked && (
        <div className="w-full bg-teal-deep text-white">
          {/* Two items only, so they're spread to the band's edges rather than packed into the
              left half of a grid. */}
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-10 gap-y-5 px-6 py-6 sm:px-10 lg:px-16">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 shrink-0" strokeWidth={2} aria-hidden />
              <div className="min-w-0">
                <div className="text-sm font-semibold sm:text-base">
                  {doneStages}/{totalStages} chặng đã hoàn thành
                </div>
                <div className="mt-1.5 h-1 w-full max-w-48 overflow-hidden bg-white/25">
                  <div
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>

            {badge && (
              <div className="flex items-center gap-3">
                <BadgeMedal badge={badge} earned={allDone} size="sm" className="shrink-0" />
                <div className="min-w-0 text-sm font-semibold sm:text-base">
                  {allDone
                    ? `Em đã sưu tầm huy hiệu ${badge.name}!`
                    : `Huy hiệu ${badge.name} đang chờ em`}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Chặng grid: flat cards, each led by an image from the chặng itself. ── */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-12">
        {isLocked ? (
          <div className="py-10 text-center">
            <div
              className={["mx-auto grid h-16 w-16 place-items-center text-3xl", accentSoft].join(
                " ",
              )}
            >
              {chuDe.emoji}
            </div>
            <p className="mx-auto mt-4 max-w-sm text-sm text-muted-foreground">
              Các cô đang biên soạn chủ đề này. Em quay lại chủ đề trước để luyện tập trong lúc chờ
              nhé!
            </p>
            <Button asChild className="mx-auto mt-5">
              <Link to="/hoc-tap/quyen-1">
                <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                Về bản đồ
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
              Chủ đề: {titleName}
            </h2>

            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {changTitles.map((title, i) => {
                const color = STAGE_COLORS[i % STAGE_COLORS.length];
                const isDone = completedChangs.has(i);
                const isCurrent = i === currentChangIndex;
                const prog = changProgress.get(i);
                const total = changTotals[i] ?? prog?.total ?? 0;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => onOpenLesson(i)}
                      className="flex h-full w-full cursor-pointer flex-col overflow-hidden border border-border bg-card text-left transition-colors hover:border-ink/40"
                    >
                      {/* Cover: typographic, not photographic — the chặng title set fat on the
                          stage's soft colour, over an oversized ghost numeral. */}
                      <span
                        className={[
                          "relative flex aspect-[16/9] w-full flex-col justify-end overflow-hidden p-5",
                          color.bgSoft,
                        ].join(" ")}
                      >
                        <span
                          aria-hidden
                          className={[
                            "pointer-events-none absolute -right-3 -top-8 font-display text-[8rem] font-bold leading-none opacity-15",
                            color.text,
                          ].join(" ")}
                        >
                          {i + 1}
                        </span>

                        {/* Emoji centred in whatever room the title leaves. */}
                        <span className="relative grid flex-1 place-items-center text-5xl sm:text-6xl">
                          {changEmojis[i] ?? "📖"}
                        </span>

                        <span
                          className={[
                            "relative line-clamp-2 font-display text-2xl font-bold leading-[1.15] tracking-tight sm:text-3xl",
                            color.text,
                          ].join(" ")}
                        >
                          {title}
                        </span>

                        {isCurrent && (
                          <span
                            className={[
                              "absolute left-0 top-0 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white",
                              color.bg,
                            ].join(" ")}
                          >
                            Đang học
                          </span>
                        )}
                        {isDone && (
                          <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-green text-white">
                            <Check className="h-5 w-5" strokeWidth={3} />
                          </span>
                        )}
                      </span>

                      <span className="flex flex-1 flex-col p-5">
                        <span
                          className={[
                            "text-xs font-semibold uppercase tracking-wide",
                            color.text,
                          ].join(" ")}
                        >
                          Chặng {i + 1}
                        </span>
                        <span className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                            {total} bài học
                          </span>
                          <span className="flex items-center gap-2">
                            <CircleDot className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                            {isDone
                              ? "Đã hoàn thành"
                              : prog
                                ? `Đang học: ${prog.current}/${prog.total} bài`
                                : "Chưa bắt đầu"}
                          </span>
                        </span>

                        {prog && !isDone && (
                          <span className="mt-3 block h-1 w-full overflow-hidden bg-muted">
                            <span
                              className={["block h-full", color.bg].join(" ")}
                              style={{
                                width: `${Math.round((prog.current / prog.total) * 100)}%`,
                              }}
                            />
                          </span>
                        )}

                        <span
                          className={[
                            "mt-5 inline-block self-start px-4 py-2 font-display text-xs font-semibold uppercase tracking-wide text-white",
                            color.bg,
                          ].join(" ")}
                        >
                          {getLessonButtonLabel(i, completedChangs, startedChangs)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
