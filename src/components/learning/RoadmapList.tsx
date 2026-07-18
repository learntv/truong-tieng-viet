import { ArrowLeft, Check, Info, Lock, X } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ChuDe } from "@/data/topics";
import { STAGE_COLORS } from "./stageColors";
import { Button } from "@/components/ui/button";
import { locationForChuDe, sceneForChuDe } from "@/data/scenes";
import { QUYEN1_LANDMARKS } from "@/data/overworld";

// Per-topic accent so the page gently recolors as the child moves between chủ đề — keyed by
// ChuDe.accent. `soft`/`text` tint the "về bản đồ" button, `solid` the progress fill.
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
  currentChangIndex: number;
  completedChangs: Set<number>;
  startedChangs: Set<number>;
  onOpenLesson: (i: number) => void;
  changProgress: Map<number, { current: number; total: number }>;
}) {
  const accent = ACCENT[chuDe.accent] ?? ACCENT.primary;
  const location = placeForChuDe(chuDeIndex);
  const photo = location.photo;
  const [showOverview, setShowOverview] = useState(false);

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
    <div className="w-full px-3 pt-8 pb-10 sm:px-4 sm:pt-12">
      <div className="mx-auto max-w-7xl">
        {/* Header: the open-scrapbook spread — stamped tag + title on the left, a taped photo
            and rubber stamp on the right, progress panel underneath. */}
        <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-4 shadow-card ring-1 ring-black/[0.03] sm:p-6 lg:p-8">
          {/* Faint map linework printed into the paper, like the reference spread. */}
          <svg
            aria-hidden
            className="pointer-events-none absolute -left-8 top-2 h-44 w-56 text-navy/[0.07]"
            viewBox="0 0 200 160"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M28 12c14 18 6 34 18 48s34 10 40 28-10 30-2 46 26 18 34 24" />
            <path d="M74 4c10 22 30 26 44 42s10 34 26 44" />
            <path d="M8 62c22-6 40 6 58 2s28-18 46-16" />
            <circle cx="120" cy="96" r="26" strokeDasharray="4 6" />
          </svg>

          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
            {/* Left page: tag, title, blurb, overview button. */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {/* Back to the overworld map — the only way to another chủ đề. */}
                <Link
                  to="/hoc-tap/quyen-1"
                  aria-label="Về bản đồ"
                  className={[
                    "grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full transition hover:brightness-95 active:translate-y-[1px]",
                    accent.soft,
                    accent.text,
                  ].join(" ")}
                >
                  <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.75} />
                </Link>
                <span className="rounded-md border-2 border-dashed border-primary/60 bg-white/70 px-2.5 py-1 font-type text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                  Địa điểm {chuDeIndex + 1}
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

              <h1 className="mt-3 flex items-center gap-2 font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
                <span className="shrink-0 text-2xl sm:text-3xl">{chuDe.emoji}</span>
                <span className="min-w-0">{location.name}</span>
              </h1>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                {location.blurb}
              </p>

              <button
                type="button"
                onClick={() => setShowOverview(true)}
                className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-navy/15 bg-muted/50 px-4 py-2 font-display text-sm font-extrabold text-navy shadow-sm transition hover:bg-muted active:translate-y-[1px]"
              >
                <Info className="h-4 w-4" strokeWidth={2.5} />
                Tổng quan chủ đề
              </button>
            </div>

            {/* Right page: taped photo + rubber stamp, then the progress panel. */}
            <div className="min-w-0">
              <div className="relative flex items-start justify-center gap-2 sm:justify-start">
                {photo && (
                  <div className="relative w-full max-w-md rotate-[1.2deg]">
                    <span
                      aria-hidden
                      className="washi-tape absolute -top-2 left-8 z-10 h-6 w-24 -rotate-6 rounded-[2px]"
                    />
                    <span
                      aria-hidden
                      className="washi-tape absolute -top-2 right-10 z-10 h-6 w-20 rotate-6 rounded-[2px]"
                    />
                    <div className="rounded-[3px] bg-white p-2 pb-3 shadow-[0_14px_30px_-12px_rgba(30,32,60,0.35)]">
                      <img
                        src={photo}
                        alt={location.name}
                        className="h-40 w-full rounded-[2px] object-cover sm:h-48"
                      />
                    </div>
                  </div>
                )}

                {/* Round rubber stamp, overlapping the photo's corner like a passport mark. */}
                <div
                  aria-hidden
                  className="absolute -right-1 top-2 grid h-20 w-20 rotate-[-12deg] place-items-center rounded-full border-[3px] border-dashed border-primary/50 bg-white/45 text-center text-primary/80 sm:h-24 sm:w-24"
                >
                  <span className="font-type text-[8px] font-bold uppercase leading-[1.35] tracking-wide sm:text-[9px]">
                    ★ ★ ★
                    <br />
                    {location.name.split(" ").slice(-1)[0]}
                    <br />
                    Việt Nam
                  </span>
                </div>
              </div>

              {/* Progress panel */}
              {!isLocked && (
                <div className="relative mt-6 rounded-xl border border-navy/10 bg-muted/40 px-4 py-3.5 shadow-sm">
                  <div className="pr-24">
                    <div className="font-display text-sm font-extrabold text-navy sm:text-base">
                      Tiến độ chủ đề
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-navy/10">
                      <div
                        className={[
                          "h-full rounded-full transition-all duration-500",
                          allDone ? "bg-green" : accent.solid,
                        ].join(" ")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-2 text-xs font-bold text-navy/65">
                      {doneStages}/{totalStages} chặng đã hoàn thành
                    </div>
                  </div>

                  {/* "Hoàn thành" rubber stamp, slapped on once every chặng is done. */}
                  {allDone && (
                    <div
                      aria-hidden
                      className="absolute right-3 top-1/2 grid -translate-y-1/2 rotate-[-8deg] place-items-center rounded-lg border-[3px] border-double border-green px-2.5 py-1.5 text-green"
                    >
                      <span className="font-type text-[10px] font-bold uppercase leading-tight tracking-wide">
                        ★★★
                        <br />
                        Hoàn thành
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {isLocked ? (
          /* Coming-soon panel for a chủ đề that has no content yet */
          <div className="mt-4 rounded-[1.75rem] border-2 border-dashed border-border bg-card p-8 text-center shadow-card">
            <div
              className={[
                "mx-auto grid h-20 w-20 place-items-center rounded-full text-4xl ring-4 ring-white",
                accent.solid,
              ].join(" ")}
            >
              {chuDe.emoji}
            </div>
            <p className="mx-auto mt-4 max-w-sm text-sm text-muted-foreground">
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
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
            {/* The chặng list — replaces the old node map. */}
            <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                <h2 className="flex min-w-0 items-center gap-2 font-display text-base font-extrabold text-navy sm:text-lg">
                  <span className="shrink-0">📖</span>
                  <span className="truncate">Chủ đề: {titleName}</span>
                </h2>
                <span className="text-xs font-bold text-navy/60">
                  {doneStages}/{totalStages} hoàn thành
                </span>
              </div>

              <ul className="divide-y divide-border/60">
                {changTitles.map((title, i) => {
                  const color = STAGE_COLORS[i % STAGE_COLORS.length];
                  const isDone = completedChangs.has(i);
                  const isStageLocked = i > 0 && !completedChangs.has(i - 1);
                  const isCurrent = i === currentChangIndex && !isStageLocked;
                  const prog = changProgress.get(i);
                  return (
                    <li key={i} className="relative">
                      {/* Left color rail marks the chặng's place in the journey. */}
                      <span
                        aria-hidden
                        className={[
                          "absolute inset-y-0 left-0 w-1.5",
                          isStageLocked ? "bg-stone-300" : color.bg,
                        ].join(" ")}
                      />
                      <button
                        type="button"
                        disabled={isStageLocked}
                        onClick={() => onOpenLesson(i)}
                        className={[
                          "flex w-full cursor-pointer items-center gap-3 py-3 pl-5 pr-3 text-left transition-colors sm:gap-4 sm:pl-6 sm:pr-4",
                          isStageLocked
                            ? "cursor-not-allowed opacity-60"
                            : "hover:bg-muted/40 active:bg-muted/60",
                          isCurrent ? "bg-secondary/10" : "",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-sm font-extrabold text-white",
                            isStageLocked ? "bg-stone-400" : color.bg,
                          ].join(" ")}
                        >
                          {i + 1}
                        </span>
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-muted text-2xl ring-1 ring-black/[0.05] sm:h-12 sm:w-12">
                          {changEmojis[i] ?? "📖"}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate font-display text-sm font-extrabold text-navy sm:text-base">
                              {title}
                            </span>
                            {isCurrent && (
                              <span
                                className={[
                                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white",
                                  color.bg,
                                ].join(" ")}
                              >
                                Đang học
                              </span>
                            )}
                          </span>
                          {prog && !isStageLocked ? (
                            <span className="mt-1.5 flex items-center gap-2">
                              <span className="h-1.5 w-24 overflow-hidden rounded-full bg-muted ring-1 ring-black/[0.04] sm:w-36">
                                <span
                                  className={["block h-full rounded-full", color.bg].join(" ")}
                                  style={{
                                    width: `${Math.round((prog.current / prog.total) * 100)}%`,
                                  }}
                                />
                              </span>
                              <span className="text-[11px] font-bold text-navy/55">
                                {prog.current}/{prog.total} bài
                              </span>
                            </span>
                          ) : (
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {isStageLocked ? "Xong chặng trước để mở khóa" : "Chưa bắt đầu"}
                            </span>
                          )}
                        </span>

                        {/* Status: done check, lock, or the call to action. */}
                        {isDone ? (
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green text-white">
                            <Check className="h-5 w-5" strokeWidth={3} />
                          </span>
                        ) : isStageLocked ? (
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-stone-200 text-stone-500">
                            <Lock className="h-4 w-4" strokeWidth={2.5} />
                          </span>
                        ) : (
                          <span
                            className={[
                              "hidden shrink-0 rounded-full px-3 py-1.5 font-display text-xs font-extrabold text-white sm:block",
                              color.bg,
                            ].join(" ")}
                          >
                            {getLessonButtonLabel(i, completedChangs, startedChangs)}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Reward / streak / culture note cards, stacked beside the list on wide screens. */}
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:content-start">
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary/25 text-xl">
                  🏅
                </span>
                <div>
                  <div className="font-display text-sm font-extrabold text-navy">
                    Phần thưởng chủ đề
                  </div>
                  <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                    Hoàn thành cả {totalStages} chặng để nhận con dấu{" "}
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
                  <p className="mt-0.5 line-clamp-3 text-xs leading-snug text-muted-foreground">
                    {location.blurb}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* "Tổng quan chủ đề" — fullscreen look at the place this chủ đề is set in. */}
      <Dialog open={showOverview} onOpenChange={setShowOverview}>
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
