import { ArrowLeft, Check, Compass, Info, Lock, X } from "lucide-react";
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
import { QUYEN1_LANDMARKS, type Discovery } from "@/data/overworld";
import { badgeForChuDe } from "@/data/badges";
import { BadgeMedal } from "./BadgeMedal";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";

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
function placeForChuDe(chuDeIndex: number): {
  name: string;
  blurb: string;
  photo?: string;
  discovery?: Discovery;
} {
  const landmark = QUYEN1_LANDMARKS.find((l) => l.chuDeIndex === chuDeIndex);
  if (landmark) {
    return {
      name: landmark.name,
      blurb: landmark.description,
      photo: landmark.photo,
      discovery: landmark.discovery,
    };
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
  const discovery = location.discovery;
  const [showOverview, setShowOverview] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();
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
    <div className="w-full px-4 pt-8 pb-12 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header: flat surface — overline, title, blurb and action on the left, a plain
            photo block, badge and progress meter on the right. */}
        <div className="rounded-lg border border-border bg-card p-5 sm:p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
            {/* Left column */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                {/* Back to the overworld map — the only way to another chủ đề. */}
                <Link
                  to="/hoc-tap/quyen-1"
                  aria-label="Về bản đồ"
                  className="-ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink/70 transition-colors hover:bg-muted hover:text-ink"
                >
                  <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
                </Link>
                <span className={["text-xs font-bold uppercase tracking-[0.12em]", accent.text].join(" ")}>
                  Địa điểm {chuDeIndex + 1}
                </span>
                {isLocked && (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-muted px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    <Lock className="h-3 w-3" strokeWidth={2.5} />
                    Sắp có
                  </span>
                )}
              </div>

              <h1 className="mt-4 flex items-center gap-2 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
                <span className="shrink-0 text-2xl sm:text-3xl">{chuDe.emoji}</span>
                <span className="min-w-0">{location.name}</span>
              </h1>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                {location.blurb}
              </p>

              <button
                type="button"
                onClick={() => setShowOverview(true)}
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-sm border border-border bg-card px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-muted"
              >
                <Info className="h-4 w-4" strokeWidth={2.5} />
                Khám phá {location.name}
              </button>
            </div>

            {/* Right column: flat photo block, badge, progress meter. */}
            <div className="min-w-0">
              <div className="flex items-center gap-5">
                {photo && (
                  <div className="min-w-0 flex-1 overflow-hidden rounded-sm border border-border">
                    <img
                      src={photo}
                      alt={location.name}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                )}

                {/* The chủ đề's collectible badge, greyed out with a lock until every chặng is done. */}
                {badge && (
                  <div className="shrink-0">
                    <BadgeMedal badge={badge} earned={allDone} size="md" />
                  </div>
                )}
              </div>

              {/* Progress meter */}
              {!isLocked && (
                <div className="mt-5 border-t border-border pt-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Tiến độ chủ đề
                    </span>
                    <span className="text-xs font-bold text-ink">
                      {doneStages}/{totalStages} chặng
                    </span>
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden bg-muted">
                    <div
                      className={[
                        "h-full transition-all duration-500",
                        allDone ? "bg-green" : accent.solid,
                      ].join(" ")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Says out loud what the badge beside the photo is for. */}
                  {badge && (
                    <p
                      className={[
                        "mt-3 flex items-start gap-2 text-xs leading-snug",
                        allDone ? "text-green" : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {allDone ? (
                        <>
                          <Check className="mt-px h-4 w-4 shrink-0" strokeWidth={3} aria-hidden />
                          <span>
                            Em đã sưu tầm được huy hiệu{" "}
                            <span className="font-bold">{badge.name}</span>!
                          </span>
                        </>
                      ) : (
                        <>
                          <Lock className="mt-px h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                          <span>
                            Hoàn thành cả {totalStages} chặng để sưu tầm huy hiệu{" "}
                            <span className="font-bold">{badge.name}</span>.
                          </span>
                        </>
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>


        {isLocked ? (
          /* Coming-soon panel for a chủ đề that has no content yet */
          <div className="mt-6 rounded-lg border border-border bg-card p-8 text-center">
            <div
              className={[
                "mx-auto grid h-16 w-16 place-items-center rounded-full text-3xl",
                accent.soft,
              ].join(" ")}
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
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            {/* The chặng list — replaces the old node map. */}
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <h2 className="min-w-0 truncate font-display text-lg font-bold text-ink">
                  Chủ đề: {titleName}
                </h2>
                <span className="shrink-0 text-xs font-bold text-muted-foreground">
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
                          isStageLocked ? "bg-border" : color.bg,
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
                            "grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold text-white",
                            isStageLocked ? "bg-muted-foreground/50" : color.bg,
                          ].join(" ")}
                        >
                          {i + 1}
                        </span>
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-muted text-2xl ring-1 ring-black/[0.05] sm:h-12 sm:w-12">
                          {changEmojis[i] ?? "📖"}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate font-display text-sm font-bold text-ink sm:text-base">
                              {title}
                            </span>
                            {isCurrent && (
                              <span
                                className={[
                                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white",
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
                              <span className="text-[11px] font-bold text-ink/55">
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
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                            <Lock className="h-4 w-4" strokeWidth={2.5} />
                          </span>
                        ) : (
                          <span
                            className={[
                              "hidden shrink-0 rounded-full px-3 py-1.5 font-display text-xs font-bold text-white sm:block",
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
                  <div className="font-display text-sm font-bold text-ink">
                    Nhận con dấu {location.name}
                  </div>
                  <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                    Hoàn thành cả {totalStages} chặng để đoạt được con dấu này nhé!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-xl">
                  🔥
                </span>
                <div>
                  <div className="font-display text-sm font-bold text-ink">Giữ chuỗi ngày học!</div>
                  <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                    Học một chặng hôm nay để giữ ngọn lửa chuỗi ngày của em.
                  </p>
                </div>
              </div>
              {!user && (
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-xl">
                    👤
                  </span>
                  <div>
                    <div className="font-display text-sm font-bold text-ink">Đăng nhập để lưu tiến độ</div>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      Lưu bài học và đua cùng bạn bè nhé!
                    </p>
                    <Button
                      variant="bevel"
                      tone="primary"
                      size="sm"
                      className="mt-2"
                      onClick={() => setAuthOpen(true)}
                    >
                      Đăng nhập
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* "Khám phá <địa điểm>" — a two-part read about the real place. Part 2 stays locked until
          every chặng is done, so finishing the chủ đề buys the rest of the story. */}
      <Dialog open={showOverview} onOpenChange={setShowOverview}>
        <DialogContent
          hideCloseButton
          className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-3xl gap-0 overflow-y-auto border-0 bg-card p-0"
        >
          {/* Cover: a photo of the real place, title laid over the bottom of it. */}
          <div className="relative">
            <img
              src={location.photo ?? sceneForChuDe(chuDeIndex)}
              alt={location.name}
              className="h-44 w-full object-cover sm:h-60"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10"
            />
            <DialogClose className="absolute right-3 top-3 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/90 text-ink shadow-[0_2px_0_0_rgba(0,0,0,0.15)] ring-1 ring-black/10 transition hover:scale-105">
              <X className="h-5 w-5" strokeWidth={2.5} />
              <span className="sr-only">Đóng</span>
            </DialogClose>
            <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                <Compass className="h-3 w-3" strokeWidth={2.75} />
                Khám phá
              </span>
              <DialogTitle className="mt-2 font-display text-2xl font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] sm:text-4xl">
                {location.name}
              </DialogTitle>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-7 sm:py-6">
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {location.blurb}
            </DialogDescription>

            {discovery && (
              <>
                {/* Postcard stats */}
                <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  {discovery.facts.map((f) => (
                    <div
                      key={f.label}
                      className="rounded-xl border border-border bg-muted/40 px-2 py-3 text-center"
                    >
                      <div className="text-lg sm:text-xl">{f.icon}</div>
                      <div className="mt-1 font-display text-sm font-bold leading-tight text-ink">
                        {f.value}
                      </div>
                      <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        {f.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Part 1 — always readable. */}
                <section className="mt-6">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-white">
                      1
                    </span>
                    {discovery.intro.heading}
                  </h3>
                  <div className="mt-2.5 space-y-3 text-sm leading-relaxed text-ink/80">
                    {discovery.intro.paragraphs.map((p) => (
                      <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                  </div>
                </section>

                {/* Part 2 — the payoff for finishing every chặng. */}
                <section className="mt-6">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                    <span
                      className={[
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white",
                        allDone ? "bg-green" : "bg-muted-foreground/50",
                      ].join(" ")}
                    >
                      2
                    </span>
                    {allDone ? discovery.deep.heading : "Phần 2 còn khoá"}
                  </h3>

                  {allDone ? (
                    <div className="mt-2.5 space-y-3 text-sm leading-relaxed text-ink/80">
                      {discovery.deep.paragraphs.map((p) => (
                        <p key={p.slice(0, 24)}>{p}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="relative mt-2.5 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/40">
                      {/* A couple of blurred dummy lines so it reads as text hiding behind the lock. */}
                      <div aria-hidden className="space-y-2.5 p-4 blur-[5px] select-none">
                        <div className="h-2.5 w-full rounded-full bg-navy/15" />
                        <div className="h-2.5 w-11/12 rounded-full bg-navy/15" />
                        <div className="h-2.5 w-9/12 rounded-full bg-navy/15" />
                        <div className="h-2.5 w-full rounded-full bg-navy/15" />
                        <div className="h-2.5 w-8/12 rounded-full bg-navy/15" />
                      </div>
                      <div className="absolute inset-0 grid place-items-center bg-card/70 px-4 text-center backdrop-blur-[2px]">
                        <div>
                          <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-navy/10 text-ink">
                            <Lock className="h-5 w-5" strokeWidth={2.5} />
                          </span>
                          <p className="mt-2.5 max-w-sm font-display text-sm font-bold text-ink">
                            “{discovery.deep.teaser}”
                          </p>
                          <p className="mt-1.5 text-xs font-bold text-muted-foreground">
                            Học nốt {totalStages - doneStages} chặng nữa để mở khoá phần này.
                          </p>
                          <div className="mx-auto mt-3 h-2 w-40 overflow-hidden rounded-full bg-navy/10">
                            <div
                              className={["h-full rounded-full", accent.solid].join(" ")}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="mt-1.5 text-[11px] font-bold text-ink/55">
                            {doneStages}/{totalStages} chặng
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
