import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
  Maximize,
  Undo2,
  X,
} from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { ChuDe } from "@/data/topics";
import { BuffaloMascot } from "./BuffaloMascot";
import { StageCard, STAGE_COLORS } from "./StageCard";
import { Button } from "@/components/ui/button";
import quyen1Cover from "@/assets/quyen_1_cover.jpg";
import { locationForChuDe, sceneForChuDe } from "@/data/scenes";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

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
const ACCENT: Record<
  ChuDe["accent"],
  {
    text: string;
    soft: string;
    solid: string;
    bevel: string;
    bevelActive: string;
    ring: string;
    borderColor: string;
    glow: string;
  }
> = {
  primary: {
    text: "text-primary",
    soft: "bg-primary/10",
    solid: "bg-primary",
    bevel: "shadow-bevel-primary",
    bevelActive: "active:shadow-bevel-primary-active",
    ring: "ring-primary",
    borderColor: "border-primary",
    glow: "var(--primary)",
  },
  yellow: {
    text: "text-[oklch(0.58_0.14_70)]",
    soft: "bg-yellow/20",
    solid: "bg-[oklch(0.72_0.17_55)]",
    bevel: "shadow-bevel-yellow",
    bevelActive: "active:shadow-bevel-yellow-active",
    ring: "ring-[oklch(0.72_0.17_55)]",
    borderColor: "border-[oklch(0.72_0.17_55)]",
    glow: "var(--yellow)",
  },
  pink: {
    text: "text-pink",
    soft: "bg-pink/15",
    solid: "bg-pink",
    bevel: "shadow-[0_4px_0_0_#be185d]",
    bevelActive: "active:shadow-[0_1px_0_0_#be185d]",
    ring: "ring-pink",
    borderColor: "border-pink",
    glow: "var(--pink)",
  },
  purple: {
    text: "text-purple",
    soft: "bg-purple/15",
    solid: "bg-purple",
    bevel: "shadow-[0_4px_0_0_#7e22ce]",
    bevelActive: "active:shadow-[0_1px_0_0_#7e22ce]",
    ring: "ring-purple",
    borderColor: "border-purple",
    glow: "var(--purple)",
  },
  green: {
    text: "text-green",
    soft: "bg-green/15",
    solid: "bg-green",
    bevel: "shadow-bevel-green",
    bevelActive: "active:shadow-bevel-green-active",
    ring: "ring-green",
    borderColor: "border-green",
    glow: "var(--green)",
  },
};

// One node layout per chủ đề so the trail doesn't look identical every time the child
// switches topics. Layouts cycle if there are more chủ đề than defined layouts.
const NODE_LAYOUTS: { x: number; y: number }[][] = [
  [
    { x: 10, y: 58 },
    { x: 28, y: 30 },
    { x: 50, y: 52 },
    { x: 72, y: 26 },
    { x: 90, y: 52 },
  ],
  [
    { x: 10, y: 28 },
    { x: 30, y: 56 },
    { x: 52, y: 30 },
    { x: 74, y: 60 },
    { x: 90, y: 34 },
  ],
];

export function getNodePositions(chuDeIndex: number): { x: number; y: number }[] {
  return NODE_LAYOUTS[chuDeIndex % NODE_LAYOUTS.length];
}

export const NODE_POSITIONS = NODE_LAYOUTS[0];

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
  const nodePositions = getNodePositions(chuDeIndex);
  const location = locationForChuDe(chuDeIndex);
  const [showLocationInfo, setShowLocationInfo] = useState(false);

  // Track which way the child navigated (prev/next) so the map content can push in from
  // that side, while the outgoing map (snapshotted below) pushes out the other side —
  // otherwise the old map would just vanish and flash the empty backdrop before the new one
  // slides in. Direction is derived during render (not an effect) so the very first paint
  // after a chủ đề change already carries the right direction — no stale-direction flash.
  const [prevChuDeIndex, setPrevChuDeIndex] = useState(chuDeIndex);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const lastMapContentRef = useRef<ReactNode>(null);
  const [outgoingMap, setOutgoingMap] = useState<{
    content: ReactNode;
    direction: "left" | "right";
  } | null>(null);
  if (chuDeIndex !== prevChuDeIndex) {
    const direction = chuDeIndex > prevChuDeIndex ? "right" : "left";
    setSlideDirection(direction);
    setPrevChuDeIndex(chuDeIndex);
    setOutgoingMap({ content: lastMapContentRef.current, direction });
  }
  const pushInClass =
    slideDirection === "right" ? "animate-push-in-from-right" : "animate-push-in-from-left";
  const pushOutClass =
    outgoingMap?.direction === "right" ? "animate-push-out-to-left" : "animate-push-out-to-right";

  // Drop the outgoing snapshot once its exit animation has finished playing.
  useEffect(() => {
    if (!outgoingMap) return;
    const timer = window.setTimeout(() => setOutgoingMap(null), 550);
    return () => window.clearTimeout(timer);
  }, [outgoingMap]);

  const prevItem = chuDeIndex > 0 ? chuDeNav[chuDeIndex - 1] : undefined;
  const nextItem = chuDeIndex + 1 < chuDeNav.length ? chuDeNav[chuDeIndex + 1] : undefined;
  const nextIsLocked = nextItem?.status === "locked";

  // Only the first upcoming ("coming soon") chủ đề is reachable — the rest of the locked
  // topics are shown for context but can't be opened yet.
  const firstLockedIndex = chuDeNav.findIndex((t) => t.status === "locked");
  const isReachable = (t: ChuDeNavItem) => t.status !== "locked" || t.index === firstLockedIndex;

  const dotBase =
    "relative grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-xs font-extrabold transition sm:h-8 sm:w-8";
  const dotClass = (t: ChuDeNavItem) => {
    if (t.status === "current")
      return [
        dotBase,
        "z-10 h-9 w-9 scale-125 cursor-default border-white text-white ring-4 animate-pulse-glow sm:h-10 sm:w-10",
        accent.solid,
        accent.ring,
      ].join(" ");
    if (t.status === "completed")
      return [dotBase, "cursor-pointer border-white text-white hover:scale-105", accent.solid].join(
        " ",
      );
    if (t.status === "available")
      return [
        dotBase,
        "cursor-pointer border-black/15 bg-white text-navy hover:scale-105 hover:border-black/30",
      ].join(" ");
    // locked
    return [
      dotBase,
      "border-dashed border-black/20 bg-black/[0.03] text-navy/35",
      isReachable(t)
        ? "cursor-pointer hover:scale-105 hover:border-black/35"
        : "cursor-not-allowed",
    ].join(" ");
  };

  // One path per segment (rather than a single combined path) so each stretch of the trail
  // can be tinted with the color of the lesson it leads away from.
  const pathSegments = nodePositions.slice(1).map((p, i) => {
    const prev = nodePositions[i];
    const cx = (prev.x + p.x) / 2;
    return `M ${prev.x} ${prev.y} Q ${cx} ${prev.y}, ${p.x} ${p.y}`;
  });

  // Backdrop scene + tint/shadow + path/nodes/buffalo (or the locked preview) for the chủ đề
  // currently being shown. Kept as its own node (rather than inlined below) so a snapshot of
  // it can be kept around as the "outgoing" layer when the chủ đề changes — see
  // lastMapContentRef above.
  const mapContent = (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${sceneForChuDe(chuDeIndex)})` }}
      />
      {/* Soft tint over the scene */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-200/25 via-transparent to-white/10" />
      {/* Bottom drop shadow — grounds the buffalo/path against the card's lower edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/25 to-transparent" />

      {!isLocked && (
        <>
          {/* Typewriter scene caption */}
          <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-4">
            <span className="font-type rounded-sm bg-white/80 px-2.5 py-0.5 text-[11px] text-navy/70 shadow-sm">
              illustration: {location.name}
            </span>
          </div>
          {/* Postage stamp */}
          <div className="pointer-events-none absolute right-4 top-10 z-20 grid h-16 w-16 rotate-6 place-items-center rounded-lg border-2 border-dashed border-white/70 bg-white/80 text-center text-navy/70 shadow-card sm:right-6">
            <span className="font-type text-[8px] font-bold uppercase leading-tight">
              {location.name.split(" ")[0]}
              <br />★<br />
              Việt Nam
            </span>
          </div>
          {/* Legend */}
          <div className="pointer-events-none absolute bottom-4 left-4 z-20 flex items-center gap-3 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-bold text-navy/70 shadow-card">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              Xong
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Đang học
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-stone-400" />
              Khóa
            </span>
          </div>
          {/* Handwritten place note */}
          <div className="font-hand pointer-events-none absolute bottom-3 right-4 z-20 text-2xl text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
            {location.name} ♥
          </div>
        </>
      )}

      {isLocked ? (
        /* Coming-soon preview for a chủ đề that has no content yet */
        <div className="relative flex h-full items-center justify-center p-5">
          <div className="max-w-sm rounded-3xl border-2 border-black/10 bg-white p-6 text-center shadow-[0_4px_0_0_rgba(0,0,0,0.1)] sm:p-8">
            <div
              className={[
                "mx-auto grid h-20 w-20 place-items-center rounded-full text-4xl ring-4 ring-white",
                accent.solid,
              ].join(" ")}
            >
              {chuDe.emoji}
            </div>
            <div className="mx-auto mt-3 inline-flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-xs font-extrabold text-navy/60">
              <Lock className="h-3 w-3" strokeWidth={2.5} /> Sắp có
            </div>
            <h3 className="mt-2 font-display text-xl font-extrabold text-navy">{chuDe.title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
              Các cô đang biên soạn chủ đề này. Em quay lại chủ đề trước để luyện tập trong lúc chờ
              nhé! ✨
            </p>
            <Button variant="bevel-primary" onClick={onPrevChuDe} className="mx-auto mt-5">
              <ArrowLeft className="h-4 w-4" strokeWidth={3} />
              Quay lại {prevItem?.shortTitle ?? "chủ đề trước"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Each segment's halo takes the color of the lesson it leads away from, but only
                once that lesson is actually done — segments past an unfinished chặng stay
                neutral grey instead of implying progress that hasn't happened yet. */}
            {pathSegments.map((d, i) => (
              <path
                key={`halo-${i}`}
                d={d}
                fill="none"
                stroke={
                  completedChangs.has(i) ? STAGE_COLORS[i % STAGE_COLORS.length].hex : "#a3a3a3"
                }
                strokeWidth="1.8"
                strokeDasharray="2.5 2.5"
                strokeLinecap="round"
                opacity="0.75"
              />
            ))}
            {pathSegments.map((d, i) => (
              <path
                key={`line-${i}`}
                d={d}
                fill="none"
                stroke="white"
                strokeWidth="1.4"
                strokeDasharray="2.5 2.5"
                strokeLinecap="round"
                opacity="0.95"
              />
            ))}
          </svg>

          {nodePositions.map((p, i) => {
            const isLocked = i > 0 && !completedChangs.has(i - 1);
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translateX(-50%) translateY(-72px)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {i === currentChangIndex && !isLocked && (
                  <div className="animate-float-badge absolute -top-11 left-1/2 flex -translate-x-1/2 flex-col items-center whitespace-nowrap">
                    <div
                      className={[
                        "rounded-xl px-3 py-1.5 text-[11px] font-extrabold text-white shadow-[0_2px_0_0_rgba(0,0,0,0.2)]",
                        STAGE_COLORS[i % STAGE_COLORS.length].bg,
                      ].join(" ")}
                    >
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
                  isSelected={selectedChangIndex === i}
                  openLabel={getLessonButtonLabel(i, completedChangs, startedChangs)}
                  compact
                  noiDungProgress={changProgress.get(i)}
                  onClick={() => onSelectStage(i)}
                  onOpen={() => {
                    if (!isLocked) onOpenLesson(i);
                  }}
                />
              </div>
            );
          })}

          <BuffaloMascot
            xPercent={Math.max(6, (nodePositions[buffaloIndex]?.x ?? 10) - 6)}
            yPercent={nodePositions[buffaloIndex]?.y ?? 58}
          />
        </>
      )}
    </>
  );

  // Snapshot the just-rendered content after each commit so the *next* time chủ đề changes,
  // the outgoing layer above can show exactly what was on screen a moment ago.
  useEffect(() => {
    lastMapContentRef.current = mapContent;
  });

  return (
    <div className="relative w-full">
      {/* Combined card: the header bar (back button, current book, active chủ đề, chủ đề
          navigation) sits on top of the map, all inside one clearly-bounded card that
          matches the navbar's width (max-w-7xl inside px-3/px-4). */}
      <div className="w-full px-3 pt-8 pb-8 sm:px-4 sm:pt-12">
        <div className="relative z-20 mx-auto flex max-w-7xl flex-col overflow-hidden rounded-[1.75rem] border border-border shadow-card ring-1 ring-black/[0.03]">
          {/* Header: top row (back, book, current chủ đề, prev/next) + a progress stepper. */}
          <div className="flex flex-col gap-2.5 bg-card p-3 sm:gap-3 sm:p-4">
            {/* Top row */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Back to học tập */}
              <Link
                to="/hoc-tap"
                aria-label="Quay lại"
                className={[
                  "grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-[1.15rem] shadow-bevel-neutral transition-[transform,box-shadow] ease-bounce active:translate-y-[2px] active:shadow-bevel-neutral-active sm:h-12 sm:w-12",
                  accent.soft,
                  accent.text,
                ].join(" ")}
              >
                <Undo2 className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
              </Link>

              {/* Current book cover */}
              <div className="shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-black/5">
                <img
                  src={quyen1Cover}
                  alt="Quyển 1"
                  className="h-12 w-9 object-cover sm:h-14 sm:w-11"
                />
              </div>

              {/* Current chủ đề */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "text-[10px] font-extrabold uppercase tracking-[0.15em] sm:text-xs",
                      accent.text,
                    ].join(" ")}
                  >
                    Vùng {chuDeIndex + 1}
                  </span>
                  {isLocked && (
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide",
                        accent.soft,
                        accent.text,
                      ].join(" ")}
                    >
                      <Lock className="h-3 w-3" strokeWidth={2.5} />
                      Sắp có
                    </span>
                  )}
                </div>
                <h1 className="flex items-center gap-1.5 truncate font-display text-base font-extrabold text-navy sm:text-2xl">
                  <span className="shrink-0">{chuDe.emoji}</span>
                  <span className="truncate">{chuDe.title}</span>
                </h1>
              </div>

              {/* Chặng progress readout (hidden on the smallest screens) */}
              {!isLocked &&
                (() => {
                  const totalStages = nodePositions.length;
                  const doneStages = Math.min(completedChangs.size, totalStages);
                  const pct = totalStages ? Math.round((doneStages / totalStages) * 100) : 0;
                  return (
                    <div className="hidden shrink-0 sm:block sm:w-40">
                      <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-navy/70">
                        <span>
                          {doneStages}/{totalStages} chặng
                        </span>
                        <span className={accent.text}>{pct}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted ring-1 ring-black/[0.04]">
                        <div
                          className={[
                            "h-full rounded-full transition-all duration-500",
                            accent.solid,
                          ].join(" ")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}

              {/* Prev / next chủ đề */}
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <button
                  onClick={onPrevChuDe}
                  disabled={!canGoPrevChuDe}
                  aria-label={prevItem ? `Chủ đề trước: ${prevItem.shortTitle}` : "Chủ đề trước"}
                  className={[
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-[transform,box-shadow] ease-bounce sm:h-10 sm:w-10",
                    canGoPrevChuDe
                      ? "cursor-pointer bg-white text-navy shadow-bevel-neutral ring-1 ring-black/10 active:translate-y-[2px] active:shadow-bevel-neutral-active"
                      : "cursor-not-allowed bg-black/[0.03] text-navy/30",
                  ].join(" ")}
                >
                  <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={3} />
                </button>
                <button
                  onClick={onNextChuDe}
                  disabled={!canGoNextChuDe}
                  aria-label={
                    nextItem ? `Chủ đề tiếp theo: ${nextItem.shortTitle}` : "Chủ đề tiếp theo"
                  }
                  className={[
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-[transform,box-shadow] ease-bounce sm:h-10 sm:w-10",
                    canGoNextChuDe
                      ? [
                          "cursor-pointer text-white active:translate-y-[2px]",
                          accent.solid,
                          accent.bevel,
                          accent.bevelActive,
                        ].join(" ")
                      : "cursor-not-allowed bg-black/[0.03] text-navy/30",
                  ].join(" ")}
                >
                  {nextIsLocked && canGoNextChuDe ? (
                    <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={3} />
                  )}
                </button>
              </div>
            </div>

            {/* Progress stepper — the whole 8-chủ-đề journey at a glance, on a soft cream track
                with a dashed "postal route" feel between the numbered stops. */}
            <div className="flex items-center rounded-full border border-border bg-muted/40 px-3 py-2 sm:px-3.5">
              {chuDeNav.map((t, i) => (
                <Fragment key={t.index}>
                  {i > 0 &&
                    (t.index <= chuDeIndex ? (
                      <div className={["h-1.5 flex-1 rounded-full", accent.solid].join(" ")} />
                    ) : (
                      <div className="mx-0.5 h-0 flex-1 border-t-2 border-dashed border-navy/15" />
                    ))}
                  <button
                    onClick={() => onSelectChuDe(t.index)}
                    disabled={t.status === "current" || !isReachable(t)}
                    aria-label={`Chủ đề ${t.index + 1}: ${t.shortTitle}${t.status === "locked" ? " (sắp có)" : ""}`}
                    aria-current={t.status === "current" ? "step" : undefined}
                    title={t.title}
                    className={dotClass(t)}
                    style={
                      t.status === "current"
                        ? ({ "--glow-color": accent.glow } as React.CSSProperties)
                        : undefined
                    }
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

          {/* Map: backdrop scene + SVG path + stage cards + buffalo. Switching chủ đề pushes
              the whole map sideways — the outgoing snapshot slides out one side while the new
              content slides in the other, clipped to this width-clamped wrapper so the push
              stays contained within the card and scrolls together with the map on mobile
              instead of stopping short and exposing blank page background past the edge. */}
          <div className="relative h-[78vh] min-h-[560px] w-full overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x touch-pan-y sm:overflow-x-hidden">
            <div
              className={["relative h-full", isLocked ? "w-full" : "min-w-[760px] sm:min-w-0"].join(
                " ",
              )}
              style={{ paddingTop: "4rem" }}
            >
              {/* "Learn about this place" — bottom-right info button that opens a fullscreen
                  overlay with the backdrop's real-world name and a short history blurb, so kids
                  can learn a bit about the place their lesson map is set in. Stays fixed in the
                  corner (doesn't push/slide) like the rest of the chrome. */}
              <button
                type="button"
                onClick={() => setShowLocationInfo(true)}
                aria-label={`Tìm hiểu về ${location.name}`}
                className="absolute bottom-4 right-4 z-20 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-navy/50 text-white shadow-[0_2px_0_0_rgba(0,0,0,0.25)] transition hover:scale-105 active:translate-y-[1px] sm:h-11 sm:w-11"
              >
                <Maximize className="h-5 w-5" strokeWidth={2.5} />
              </button>

              <div className="absolute inset-0 overflow-hidden">
                {outgoingMap && (
                  <div className={["absolute inset-0", pushOutClass].join(" ")}>
                    {outgoingMap.content}
                  </div>
                )}
                <div key={chuDeIndex} className={["absolute inset-0", pushInClass].join(" ")}>
                  {mapContent}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reward / streak / cultural info cards below the map — scrapbook note cards. */}
        {!isLocked && (
          <div className="mx-auto mt-4 grid max-w-7xl gap-3 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary/25 text-xl">
                🏅
              </span>
              <div>
                <div className="font-display text-sm font-extrabold text-navy">
                  Phần thưởng chủ đề
                </div>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                  Hoàn thành cả 5 chặng để nhận con dấu{" "}
                  <strong className="text-primary">{chuDe.title}</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-xl">
                🔥
              </span>
              <div>
                <div className="font-display text-sm font-extrabold text-navy">
                  Giữ chuỗi ngày học!
                </div>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                  Học một chặng hôm nay để giữ ngọn lửa chuỗi ngày của em.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#2b6ea3]/12 text-xl">
                🗺️
              </span>
              <div>
                <div className="font-display text-sm font-extrabold text-navy">
                  Khám phá văn hóa
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
                  {location.blurb}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen "learn about this place" overlay, triggered by the info button on the map. */}
      <Dialog open={showLocationInfo} onOpenChange={setShowLocationInfo}>
        <DialogContent
          hideCloseButton
          className="left-0 top-0 h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden border-0 bg-transparent p-0 sm:rounded-none"
        >
          <div
            className="relative h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${sceneForChuDe(chuDeIndex)})` }}
          >
            <DialogClose className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-navy shadow-[0_2px_0_0_rgba(0,0,0,0.15)] ring-1 ring-black/10 transition hover:scale-105">
              <X className="h-5 w-5" strokeWidth={2.5} />
              <span className="sr-only">Đóng</span>
            </DialogClose>
            <div className="absolute inset-x-4 bottom-4 z-10 max-w-2xl sm:inset-x-8 sm:bottom-8">
              <DialogTitle
                className="font-display text-2xl font-extrabold text-white sm:text-4xl"
                style={{ WebkitTextStroke: "1.5px black", paintOrder: "stroke fill" }}
              >
                {location.name}
              </DialogTitle>
              <DialogDescription
                className="mt-2 text-sm leading-relaxed text-white sm:text-base"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 1px 8px rgba(0,0,0,0.6)" }}
              >
                {location.blurb}
              </DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
