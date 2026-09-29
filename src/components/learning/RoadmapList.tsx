import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ChuDe } from "@/data/topics";
import type { QuyenNumber } from "@/lib/learning";
import { STAGE_COLORS } from "./stageColors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { Container } from "@/components/layout/Container";
import { locationForChuDe } from "@/data/scenes";
import { landmarksForQuyen } from "@/data/overworld";

// Per-topic accent, keyed by ChuDe.accent — tints the coming-soon emoji plate.
const ACCENT_SOFT: Record<ChuDe["accent"], string> = {
  primary: "bg-brand-50",
  yellow: "bg-sun-50",
  pink: "bg-rose-50",
  purple: "bg-grape-50",
  green: "bg-leaf-50",
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
 * The place this chủ đề is set in. The quyển's landmark list is the authority on *which* place
 * that is, because it's what the overworld map pins the child clicked to get here —
 * `CHU_DE_LOCATIONS` in scenes.ts only tracks which backdrop *artwork* exists, and its indices
 * don't line up with the journey (chủ đề 2 is Hội An, but its backdrop is the golden-bridge
 * painting). Fall back to the scenes entry only for chủ đề the landmark list doesn't cover.
 */
function placeForChuDe(
  quyenNumber: QuyenNumber,
  chuDeIndex: number,
): { name: string; blurb: string; photo?: string } {
  const landmark = landmarksForQuyen(quyenNumber).find((l) => l.chuDeIndex === chuDeIndex);
  if (landmark) {
    return { name: landmark.name, blurb: landmark.description, photo: landmark.photo };
  }
  return locationForChuDe(chuDeIndex);
}

export function RoadmapList({
  quyenNumber,
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
  quyenNumber: QuyenNumber;
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
  const location = placeForChuDe(quyenNumber, chuDeIndex);
  const photo = location.photo;

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
      {/* ── Hero: where this chủ đề is set, the way in, and how far along it is. ── */}
      <header className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div
          aria-hidden
          className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        <Container className="relative pt-6 pb-10 sm:pt-8 lg:pb-14">
          <nav
            aria-label="Đường dẫn"
            className="flex flex-wrap items-center gap-1 text-sm font-medium text-ink-500"
          >
            <Link
              to="/hoc-tap"
              className="rounded-full px-2 py-1 hover:bg-white hover:text-ink-900"
            >
              Học tập
            </Link>
            <ChevronRight className="size-4 text-ink-300" aria-hidden />
            <Link
              to="/hoc-tap/quyen-{$quyenNumber}"
              params={{ quyenNumber: String(quyenNumber) }}
              className="rounded-full px-2 py-1 hover:bg-white hover:text-ink-900"
            >
              Quyển {quyenNumber}
            </Link>
            <ChevronRight className="size-4 text-ink-300" aria-hidden />
            <span aria-current="page" className="px-2 py-1 text-ink-800">
              {location.name}
            </span>
          </nav>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-14">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">Chủ đề {chuDeIndex + 1}</Badge>
                {isLocked && (
                  <Badge variant="locked">
                    <Lock aria-hidden />
                    Sắp có
                  </Badge>
                )}
              </div>

              <h1 className="mt-4 text-h1 text-ink-900">{location.name}</h1>
              <p className="mt-4 max-w-xl text-lede text-ink-600">{location.blurb}</p>

              {!isLocked && (
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Button size="xl" onClick={() => onOpenLesson(currentChangIndex)}>
                    {doneStages === 0 ? "Bắt đầu học" : allDone ? "Ôn tập lại" : "Tiếp tục học"}
                    <ArrowRight aria-hidden />
                  </Button>
                  <div className="min-w-44">
                    <p className="text-sm font-semibold text-ink-700">
                      <span className="tabular-nums">
                        {doneStages}/{totalStages}
                      </span>{" "}
                      chặng đã hoàn thành
                    </p>
                    <Progress value={pct} className="mt-2 h-2" aria-label="Tiến độ chủ đề" />
                  </div>
                </div>
              )}
            </div>

            {photo && (
              <div className="relative">
                <img
                  src={photo}
                  alt={location.name}
                  className="aspect-[16/11] w-full rounded-[2rem] object-cover shadow-lg"
                />
                {!isLocked && (
                  <span className="absolute -bottom-4 left-5 inline-flex items-center gap-2 rounded-full bg-white py-2 pr-4 pl-2 text-sm font-semibold text-ink-800 shadow-md">
                    <span className="grid size-8 place-items-center rounded-full bg-brand-50 text-lg">
                      {chuDe.emoji}
                    </span>
                    {titleName}
                  </span>
                )}
              </div>
            )}
          </div>
        </Container>
      </header>

      <Container width="content" className="pt-8 pb-16 sm:pb-24">
        {isLocked ? (
          <EmptyState
            icon={Lock}
            illustration={
              <span
                className={[
                  "grid size-16 place-items-center rounded-2xl text-3xl",
                  accentSoft,
                ].join(" ")}
              >
                {chuDe.emoji}
              </span>
            }
            title="Chủ đề này sắp có"
            description="Các cô đang biên soạn chủ đề này. Em quay lại chủ đề trước để luyện tập trong lúc chờ nhé!"
            action={
              <Button asChild>
                <Link
                  to="/hoc-tap/quyen-{$quyenNumber}"
                  params={{ quyenNumber: String(quyenNumber) }}
                >
                  <ArrowLeft aria-hidden />
                  Về bản đồ
                </Link>
              </Button>
            }
          />
        ) : (
          <>
            <h2 className="text-h2 text-ink-900">Các chặng học</h2>

            {/* The chặng as a journey: a rail of nodes down the left joins each stop to the
              next — filled when done, ringed when current, numbered when ahead. */}
            <ol className="relative mt-8">
              {changTitles.map((title, i) => {
                const color = STAGE_COLORS[i % STAGE_COLORS.length];
                const isDone = completedChangs.has(i);
                const isCurrent = i === currentChangIndex;
                const prog = changProgress.get(i);
                const total = changTotals[i] ?? prog?.total ?? 0;
                const isLast = i === changTitles.length - 1;
                return (
                  <li key={i} className="relative flex gap-4 pb-5 sm:gap-6">
                    {!isLast && (
                      <span
                        aria-hidden
                        className={[
                          "absolute top-12 bottom-0 left-[1.3rem] w-0.5 sm:left-[1.55rem]",
                          isDone ? color.bg : "bg-ink-100",
                        ].join(" ")}
                      />
                    )}

                    <span
                      aria-hidden
                      style={
                        isCurrent
                          ? ({ "--ring-color": color.hex } as React.CSSProperties)
                          : undefined
                      }
                      className={[
                        "relative z-10 mt-3 grid size-11 shrink-0 place-items-center rounded-full text-base font-extrabold sm:size-[3.25rem]",
                        isDone
                          ? [color.bg, "text-white"].join(" ")
                          : isCurrent
                            ? [color.bg, "animate-pulse-ring text-white"].join(" ")
                            : "border-2 border-ink-100 bg-white text-ink-400",
                      ].join(" ")}
                    >
                      {isDone ? <Check className="size-5" strokeWidth={3} /> : i + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => onOpenLesson(i)}
                      aria-label={`Chặng ${i + 1}: ${title} — ${getLessonButtonLabel(i, completedChangs, startedChangs)}`}
                      className={[
                        "group flex min-w-0 flex-1 cursor-pointer items-center gap-4 rounded-3xl border bg-white p-3 text-left transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md sm:gap-5 sm:p-4",
                        isCurrent
                          ? [color.border, "shadow-md"].join(" ")
                          : "border-ink-100 shadow-xs",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "grid size-16 shrink-0 place-items-center rounded-2xl text-3xl transition-transform duration-300 group-hover:scale-105 sm:size-20 sm:text-4xl",
                          color.bgSoft,
                        ].join(" ")}
                      >
                        {changEmojis[i] ?? "📖"}
                      </span>

                      <span className="flex min-w-0 flex-1 flex-col">
                        <span
                          className={[
                            "text-caption font-bold tracking-wide uppercase",
                            color.text,
                          ].join(" ")}
                        >
                          Chặng {i + 1}
                          {isCurrent && !isDone && " · Đang học"}
                        </span>
                        <span className="mt-1 line-clamp-2 text-h3 text-ink-900">{title}</span>
                        <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-500">
                          <span className="inline-flex items-center gap-1.5">
                            <BookOpen className="size-4" aria-hidden />
                            {total} bài học
                          </span>
                          <span>
                            {isDone
                              ? "Đã hoàn thành"
                              : prog
                                ? `Đã học ${prog.current}/${prog.total}`
                                : "Chưa bắt đầu"}
                          </span>
                        </span>
                        {prog && !isDone && (
                          <span className="mt-2.5 block h-1.5 w-full max-w-60 overflow-hidden rounded-full bg-ink-100">
                            <span
                              className={["block h-full rounded-full", color.bg].join(" ")}
                              style={{ width: `${Math.round((prog.current / prog.total) * 100)}%` }}
                            />
                          </span>
                        )}
                      </span>

                      <span
                        className={[
                          "hidden h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors sm:inline-flex",
                          isDone
                            ? "bg-ink-50 text-ink-700 group-hover:bg-ink-100"
                            : [color.bg, "text-white"].join(" "),
                        ].join(" ")}
                      >
                        {getLessonButtonLabel(i, completedChangs, startedChangs)}
                      </span>
                      <ChevronRight
                        className="size-5 shrink-0 text-ink-300 sm:hidden"
                        aria-hidden
                      />
                    </button>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </Container>
    </div>
  );
}
