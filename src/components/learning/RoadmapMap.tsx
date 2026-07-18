import { ArrowLeft, Lock, Map as MapIcon, Maximize, X } from "lucide-react";
import { useState } from "react";
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

// Per-topic accent so the header gently recolors as the child moves between chủ đề — keyed
// by ChuDe.accent. `soft`/`text` tint the "về bản đồ" button, `solid` the progress fill.
const ACCENT: Record<ChuDe["accent"], { text: string; soft: string; solid: string }> = {
  primary: { text: "text-primary", soft: "bg-primary/10", solid: "bg-primary" },
  yellow: {
    text: "text-[oklch(0.58_0.14_70)]",
    soft: "bg-yellow/20",
    solid: "bg-[oklch(0.72_0.17_55)]",
  },
  pink: { text: "text-pink", soft: "bg-pink/15", solid: "bg-pink" },
  purple: { text: "text-purple", soft: "bg-purple/15", solid: "bg-purple" },
  green: { text: "text-green", soft: "bg-green/15", solid: "bg-green" },
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
  isLocked,
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
  isLocked: boolean;
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

  // One path per segment (rather than a single combined path) so each stretch of the trail
  // can be tinted with the color of the lesson it leads away from.
  const pathSegments = nodePositions.slice(1).map((p, i) => {
    const prev = nodePositions[i];
    const cx = (prev.x + p.x) / 2;
    return `M ${prev.x} ${prev.y} Q ${cx} ${prev.y}, ${p.x} ${p.y}`;
  });

  // Backdrop scene + tint/shadow + path/nodes/buffalo (or the locked preview) for this chủ đề.
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
            <Button variant="bevel-primary" asChild className="mx-auto mt-5">
              <Link to="/hoc-tap/quyen-1">
                <ArrowLeft className="h-4 w-4" strokeWidth={3} />
                Về bản đồ
              </Link>
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

  return (
    <div className="relative w-full">
      {/* Combined card: the header bar (back button, current book, active chủ đề, chủ đề
          navigation) sits on top of the map, all inside one clearly-bounded card that
          matches the navbar's width (max-w-7xl inside px-3/px-4). */}
      <div className="w-full px-3 pt-8 pb-8 sm:px-4 sm:pt-12">
        <div className="relative z-20 mx-auto flex max-w-7xl flex-col overflow-hidden rounded-[1.75rem] border border-border shadow-card ring-1 ring-black/[0.03]">
          {/* Header: back to the overworld map, the book, and this chủ đề's progress. Switching
              chủ đề happens on the map, so there's no stepper here. */}
          <div className="flex flex-col gap-2.5 bg-card p-3 sm:gap-3 sm:p-4">
            {/* Top row */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Back to the overworld map — the only way to another chủ đề. */}
              <Link
                to="/hoc-tap/quyen-1"
                aria-label="Về bản đồ"
                className={[
                  "flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-[1.15rem] px-3 font-display text-sm font-extrabold shadow-bevel-neutral transition-[transform,box-shadow] ease-bounce active:translate-y-[2px] active:shadow-bevel-neutral-active sm:h-12 sm:px-4",
                  accent.soft,
                  accent.text,
                ].join(" ")}
              >
                <MapIcon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
                <span className="hidden sm:inline">Về bản đồ</span>
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
            </div>
          </div>

          {/* Map: backdrop scene + SVG path + stage cards + buffalo. Clipped to this
              width-clamped wrapper so it scrolls together with the card on mobile instead of
              stopping short and exposing blank page background past the edge. */}
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

              <div className="absolute inset-0 overflow-hidden">{mapContent}</div>
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
