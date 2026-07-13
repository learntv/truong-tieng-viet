import { ArrowLeft, Check, ChevronLeft, ChevronRight, Lock, Undo2 } from "lucide-react";
import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import type { ChuDe } from "@/data/topics";
import { BuffaloMascot } from "./BuffaloMascot";
import { StageCard, STAGE_COLORS } from "./StageCard";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import halongScene from "@/assets/halong-scene.jpg";

// One entry per planned chủ đề, tagged with its progress state — drives the header stepper.
export type ChuDeNavItem = {
  index: number;
  title: string;
  shortTitle: string;
  emoji: string;
  status: "completed" | "current" | "available" | "locked";
};

// Per-topic accent so the header gently recolors as the child moves between chủ đề — keyed
// by ChuDe.accent. `grad` feeds the "next" button + progress fill, `ring`/`text` the stepper.
const ACCENT: Record<ChuDe["accent"], { text: string; soft: string; grad: string; ring: string }> = {
  primary: { text: "text-primary", soft: "bg-primary/10", grad: "from-[oklch(0.62_0.2_28)] to-[oklch(0.52_0.22_22)]", ring: "ring-primary" },
  yellow: { text: "text-[oklch(0.58_0.14_70)]", soft: "bg-yellow/20", grad: "from-[oklch(0.82_0.16_75)] to-[oklch(0.72_0.17_55)]", ring: "ring-[oklch(0.72_0.17_55)]" },
  pink: { text: "text-pink", soft: "bg-pink/15", grad: "from-[oklch(0.75_0.17_5)] to-[oklch(0.65_0.19_10)]", ring: "ring-pink" },
  purple: { text: "text-purple", soft: "bg-purple/15", grad: "from-[oklch(0.68_0.13_295)] to-[oklch(0.6_0.15_300)]", ring: "ring-purple" },
  green: { text: "text-green", soft: "bg-green/15", grad: "from-[oklch(0.72_0.17_150)] to-[oklch(0.6_0.18_150)]", ring: "ring-green" },
};

export const NODE_POSITIONS = [
  { x: 10, y: 58 },
  { x: 28, y: 30 },
  { x: 50, y: 52 },
  { x: 72, y: 26 },
  { x: 90, y: 52 },
];


function getLessonButtonLabel(
  index: number,
  completedChangs: Set<number>,
  startedChangs: Set<number>,
): string {
  if (completedChangs.has(index)) return "Ôn tập";
  if (startedChangs.has(index)) return "Tiếp tục";
  return "Bắt đầu";
}

export function RoadmapMap({
  chuDe,
  chuDeIndex,
  chuDeNav,
  isLocked,
  onSelectChuDe,
  canGoPrevChuDe,
  canGoNextChuDe,
  onPrevChuDe,
  onNextChuDe,
  changTitles,
  changEmojis,
  currentChangIndex,
  buffaloChangIndex,
  completedChangs,
  startedChangs,
  selectedChangIndex,
  onSelectStage,
  onOpenLesson,
  changProgress,
}: {
  chuDe: ChuDe;
  chuDeIndex: number;
  chuDeNav: ChuDeNavItem[];
  isLocked: boolean;
  onSelectChuDe: (i: number) => void;
  canGoPrevChuDe: boolean;
  canGoNextChuDe: boolean;
  onPrevChuDe: () => void;
  onNextChuDe: () => void;
  changTitles: string[];
  changEmojis: string[];
  currentChangIndex: number;
  buffaloChangIndex: number;
  completedChangs: Set<number>;
  startedChangs: Set<number>;
  selectedChangIndex: number | null;
  onSelectStage: (i: number) => void;
  onOpenLesson: (i: number) => void;
  changProgress: Map<number, { current: number; total: number }>;
}) {
  const buffaloIndex = buffaloChangIndex;
  const accent = ACCENT[chuDe.accent] ?? ACCENT.primary;

  const prevItem = chuDeIndex > 0 ? chuDeNav[chuDeIndex - 1] : undefined;
  const nextItem = chuDeIndex + 1 < chuDeNav.length ? chuDeNav[chuDeIndex + 1] : undefined;
  const nextIsLocked = nextItem?.status === "locked";

  // Only the first upcoming ("coming soon") chủ đề is reachable — the rest of the locked
  // topics are shown for context but can't be opened yet.
  const firstLockedIndex = chuDeNav.findIndex((t) => t.status === "locked");
  const isReachable = (t: ChuDeNavItem) => t.status !== "locked" || t.index === firstLockedIndex;

  const dotBase = "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold transition sm:h-8 sm:w-8";
  const dotClass = (t: ChuDeNavItem) => {
    if (t.status === "current")
      return [dotBase, "scale-110 cursor-default bg-white shadow-sm ring-2", accent.ring, accent.text].join(" ");
    if (t.status === "completed")
      return [dotBase, "cursor-pointer bg-gradient-to-br text-white shadow-sm ring-2 ring-white hover:scale-105", accent.grad].join(" ");
    if (t.status === "available")
      return [dotBase, "cursor-pointer bg-white text-navy ring-1 ring-black/10 hover:scale-105 hover:ring-black/25"].join(" ");
    // locked
    return [
      dotBase,
      "border border-dashed border-black/20 bg-black/[0.03] text-navy/35",
      isReachable(t) ? "cursor-pointer hover:scale-105 hover:border-black/35" : "cursor-not-allowed",
    ].join(" ");
  };

  const pathD = NODE_POSITIONS.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} Q ${cx} ${prev.y}, ${p.x} ${p.y}`;
  }, "");

  return (
    <div className="relative w-full">

      {/* Combined card: the header bar (back button, current book, active chủ đề, chủ đề
          navigation) sits on top of the map, all inside one clearly-bounded card that
          matches the navbar's width (max-w-7xl inside px-3/px-4). */}
      <div className="w-full px-3 pt-8 pb-8 sm:px-4 sm:pt-12">
        <div className="relative z-20 mx-auto flex max-w-7xl flex-col overflow-hidden rounded-[1.75rem] border-2 border-white shadow-card">

          {/* Header: top row (back, book, current chủ đề, prev/next) + a progress stepper. */}
          <div className="flex flex-col gap-2.5 bg-white/85 p-3 backdrop-blur-md sm:gap-3 sm:p-4">

            {/* Top row */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Back to học tập */}
              <Link
                to="/hoc-tap"
                aria-label="Quay lại"
                className={["grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-[1.15rem] transition ease-bounce hover:scale-105 active:scale-95 sm:h-12 sm:w-12", accent.soft, accent.text].join(" ")}
              >
                <Undo2 className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
              </Link>

              {/* Current book cover */}
              <div className="shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-black/5">
                <img src={quyen1Cover} alt="Quyển 1" className="h-12 w-9 object-cover sm:h-14 sm:w-11" />
              </div>

              {/* Current chủ đề */}
              <div className="min-w-0 flex-1">
                {isLocked && (
                  <div className={["inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide sm:text-xs", accent.soft, accent.text].join(" ")}>
                    <Lock className="h-3 w-3" strokeWidth={2.5} />
                    Sắp có
                  </div>
                )}
                <h1 className="flex items-center gap-1.5 truncate font-display text-base font-extrabold text-navy sm:text-2xl">
                  <span className="shrink-0">{chuDe.emoji}</span>
                  <span className="truncate">{chuDe.title}</span>
                </h1>
              </div>

              {/* Prev / next chủ đề */}
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <button
                  onClick={onPrevChuDe}
                  disabled={!canGoPrevChuDe}
                  aria-label={prevItem ? `Chủ đề trước: ${prevItem.shortTitle}` : "Chủ đề trước"}
                  className={[
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full transition ease-bounce sm:h-10 sm:w-10",
                    canGoPrevChuDe
                      ? "cursor-pointer bg-white text-navy shadow-sm ring-1 ring-black/10 hover:scale-105 active:scale-95"
                      : "cursor-not-allowed bg-black/[0.03] text-navy/30",
                  ].join(" ")}
                >
                  <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={3} />
                </button>
                <button
                  onClick={onNextChuDe}
                  disabled={!canGoNextChuDe}
                  aria-label={nextItem ? `Chủ đề tiếp theo: ${nextItem.shortTitle}` : "Chủ đề tiếp theo"}
                  className={[
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full transition ease-bounce sm:h-10 sm:w-10",
                    canGoNextChuDe
                      ? ["cursor-pointer bg-gradient-to-br text-white shadow-md ring-2 ring-white/80 hover:scale-105 active:scale-95", accent.grad].join(" ")
                      : "cursor-not-allowed bg-black/[0.03] text-navy/30",
                  ].join(" ")}
                >
                  {nextIsLocked && canGoNextChuDe
                    ? <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                    : <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={3} />}
                </button>
              </div>
            </div>

            {/* Progress stepper — the whole 8-chủ-đề journey at a glance, set into a recessed
                grey track so it reads as a distinct element inset into the banner. */}
            <div className="flex items-center rounded-full bg-black/[0.04] px-3 py-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] sm:px-3.5">
              {chuDeNav.map((t, i) => (
                <Fragment key={t.index}>
                  {i > 0 && (
                    <div
                      className={[
                        "h-1 flex-1 rounded-full",
                        t.index <= chuDeIndex ? ["bg-gradient-to-r", accent.grad].join(" ") : "bg-black/10",
                      ].join(" ")}
                    />
                  )}
                  <button
                    onClick={() => onSelectChuDe(t.index)}
                    disabled={t.status === "current" || !isReachable(t)}
                    aria-label={`Chủ đề ${t.index + 1}: ${t.shortTitle}${t.status === "locked" ? " (sắp có)" : ""}`}
                    aria-current={t.status === "current" ? "step" : undefined}
                    title={t.title}
                    className={dotClass(t)}
                  >
                    {t.status === "completed" ? (
                      <Check className="h-4 w-4" strokeWidth={3} />
                    ) : t.status === "locked" ? (
                      <Lock className="h-3 w-3" strokeWidth={2.5} />
                    ) : (
                      <span>{t.index + 1}</span>
                    )}
                  </button>
                </Fragment>
              ))}
            </div>
          </div>

          {/* Map: SVG path + stage cards + buffalo. The Halong scene is a background on the
              scroll container so it stays fully covered during horizontal scroll. */}
          <div
            className="relative h-[78vh] min-h-[560px] w-full overflow-x-auto overflow-y-hidden bg-cover bg-center bg-no-repeat sm:overflow-x-hidden"
            style={{ backgroundImage: `url(${halongScene})`, paddingTop: '4rem' }}
          >
            {/* Soft tint over the scene */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-200/25 via-transparent to-white/10" />
            {/* Bottom drop shadow — grounds the buffalo/path against the card's lower edge */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/25 to-transparent" />
            {isLocked ? (
              /* Coming-soon preview for a chủ đề that has no content yet */
              <div className="relative flex h-full items-center justify-center p-5">
                <div className="max-w-sm rounded-3xl border-2 border-white bg-white/90 p-6 text-center shadow-card backdrop-blur-md sm:p-8">
                  <div className={["mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br text-4xl ring-4 ring-white", accent.grad].join(" ")}>
                    {chuDe.emoji}
                  </div>
                  <div className="mx-auto mt-3 inline-flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-xs font-extrabold text-navy/60">
                    <Lock className="h-3 w-3" strokeWidth={2.5} /> Sắp có
                  </div>
                  <h3 className="mt-2 font-display text-xl font-extrabold text-navy">{chuDe.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                    Các cô đang biên soạn chủ đề này. Em quay lại chủ đề trước để luyện tập trong lúc chờ nhé! ✨
                  </p>
                  <button
                    onClick={onPrevChuDe}
                    className="mx-auto mt-5 flex cursor-pointer items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-glow-primary ring-2 ring-white/80 transition ease-bounce hover:scale-105 active:scale-95"
                  >
                    <ArrowLeft className="h-4 w-4" strokeWidth={3} />
                    Quay lại {prevItem?.shortTitle ?? "chủ đề trước"}
                  </button>
                </div>
              </div>
            ) : (
            <div className="relative h-full min-w-[760px] sm:min-w-0">
              <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d={pathD}
              fill="none"
              stroke="white"
              strokeWidth="1.4"
              strokeDasharray="2.5 2.5"
              strokeLinecap="round"
              opacity="0.95"
            />
          </svg>

          {NODE_POSITIONS.map((p, i) => {
            const isLocked = i > 0 && !completedChangs.has(i - 1);
            return (
              <div
                key={i}
                className="absolute"
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translateX(-50%) translateY(-72px)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {i === currentChangIndex && !isLocked && (
                  <div className="animate-float-badge absolute -top-11 left-1/2 flex -translate-x-1/2 flex-col items-center whitespace-nowrap">
                    <div className={["rounded-xl px-3 py-1.5 text-[11px] font-extrabold text-white shadow-lg bg-gradient-to-r", STAGE_COLORS[i % STAGE_COLORS.length].stripe].join(" ")}>
                      Đang học
                    </div>
                    <div
                      className="h-0 w-0"
                      style={{
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: `8px solid ${STAGE_COLORS[i % STAGE_COLORS.length].scrollThumb}`,
                      }}
                    />
                  </div>
                )}
                <StageCard
                  index={i}
                  title={changTitles[i] ?? ""}
                  emoji={changEmojis[i] ?? "📖"}
                  isCurrent={i === currentChangIndex}
                  isCompleted={completedChangs.has(i)}
                  isLocked={isLocked}
                  isSelected={!isLocked && selectedChangIndex === i}
                  openLabel={getLessonButtonLabel(i, completedChangs, startedChangs)}
                  compact
                  noiDungProgress={changProgress.get(i)}
                  onClick={() => { if (!isLocked) onSelectStage(i); }}
                  onOpen={() => { if (!isLocked) onOpenLesson(i); }}
                />
              </div>
            );
          })}

          <BuffaloMascot
            xPercent={Math.max(6, (NODE_POSITIONS[buffaloIndex]?.x ?? 10) - 6)}
            yPercent={NODE_POSITIONS[buffaloIndex]?.y ?? 58}
          />
            </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
