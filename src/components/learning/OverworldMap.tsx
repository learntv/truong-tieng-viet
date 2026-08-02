import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, HelpCircle, Lock, MapPin, Undo2 } from "lucide-react";
import type { ChuDeWithChangs } from "@/lib/learning";
import { isChuDeComplete } from "@/lib/learning";
import type { ChangProgress } from "@/hooks/useUserProgress";
import type { ChuDe } from "@/data/topics";
import { QUYEN1_LANDMARKS } from "@/data/overworld";
import { Button } from "@/components/ui/button";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { ConfettiBurst } from "./ConfettiBurst";
import { BuffaloMascot } from "./BuffaloMascot";
import { loadBuffaloPos } from "@/components/tabs/LearningTab";
import overworldArt from "@/assets/quyen1-overworld.jpg";
import cachHocBanner from "@/assets/cach-hoc-3-buoc.png";

// Number of landmark completions the child has already been congratulated for on this map. Kept
// in sessionStorage (not local) so the confetti fires once per visit-after-a-win rather than
// every time they bounce back from a lesson.
const MAP_CELEBRATED_KEY = "vui-hoc-map-celebrated";

// The three-step "how this works" tutorial is a first-visit-only overlay. Once the child taps
// "Khám phá ngay" it never comes back, so this flag lives in localStorage (survives reloads and
// new sessions), unlike the per-visit celebration flag above.
const TUTORIAL_SEEN_KEY = "vui-hoc-map-tutorial-seen";

function hasSeenTutorial(): boolean {
  try {
    return localStorage.getItem(TUTORIAL_SEEN_KEY) === "1";
  } catch {
    // localStorage unavailable (private mode) — show the tutorial rather than hiding it
    return false;
  }
}

// "locked" = the content exists but an earlier chủ đề gates it; "coming-soon" = the chủ đề
// hasn't been written yet. Both read as closed, but they need different copy — telling a child
// to "finish the previous chủ đề" for a lesson that doesn't exist would be a dead end.
type PinStatus = "completed" | "current" | "locked" | "coming-soon";

const ACCENT: Record<ChuDe["accent"], { solid: string; text: string }> = {
  primary: { solid: "bg-primary", text: "text-primary" },
  yellow: { solid: "bg-[oklch(0.72_0.17_55)]", text: "text-[oklch(0.58_0.14_70)]" },
  pink: { solid: "bg-pink", text: "text-pink" },
  purple: { solid: "bg-purple", text: "text-purple" },
  green: { solid: "bg-green", text: "text-green" },
};

function shortTitle(title: string): string {
  return title.replace(/^Chủ đề\s*\d+\s*[:：]\s*/i, "").trim() || title;
}

export function OverworldMap({
  chuDes,
  progressMap,
}: {
  chuDes: ChuDeWithChangs[];
  progressMap: Map<string, ChangProgress>;
}) {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  // Starts closed — `hasSeenTutorial` reads localStorage, which doesn't exist during SSR, so
  // deciding this eagerly would bake "show" into the server HTML and mismatch on hydration.
  // Checked once after mount instead, client-side only.
  const [showTutorial, setShowTutorial] = useState(false);
  useEffect(() => {
    if (!hasSeenTutorial()) setShowTutorial(true);
  }, []);
  const dismissTutorial = () => {
    setShowTutorial(false);
    try {
      localStorage.setItem(TUTORIAL_SEEN_KEY, "1");
    } catch {
      // localStorage unavailable — the tutorial will show again next visit
    }
  };

  // Escape closes it too, the same as tapping the backdrop or the button.
  useEffect(() => {
    if (!showTutorial) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissTutorial();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showTutorial]);

  // Every landmark is drawn, including ones whose chủ đề hasn't been written yet — those show
  // as "sắp có" so the child can see the whole journey ahead of them, not a map that grows.
  const landmarks = QUYEN1_LANDMARKS;

  // A chủ đề unlocks when the one before it is finished; the first is always open. `current` is
  // the earliest unfinished one — that's where the buffalo waits.
  const statuses = useMemo<PinStatus[]>(() => {
    const done = chuDes.map((cd) => isChuDeComplete(cd.changs, progressMap));
    const currentIdx = done.findIndex((d) => !d);
    return chuDes.map((_, i) => {
      if (done[i]) return "completed";
      if (i === currentIdx) return "current";
      return "locked";
    });
  }, [chuDes, progressMap]);

  const doneCount = statuses.filter((s) => s === "completed").length;

  // Per-chủ-đề chặng tallies for the popup's mini progress bar.
  const changStats = useMemo(
    () =>
      chuDes.map((cd) => ({
        total: cd.changs.length,
        done: cd.changs.filter((ch) => progressMap.get(ch.id)?.isCompleted).length,
      })),
    [chuDes, progressMap],
  );

  // Park the buffalo at the chủ đề the child was last studying if that one is still open,
  // otherwise at the earliest unfinished landmark.
  const buffaloIndex = useMemo(() => {
    const saved = loadBuffaloPos();
    if (saved && statuses[saved.chuDeIndex] === "current") return saved.chuDeIndex;
    const current = statuses.indexOf("current");
    return current === -1 ? Math.max(0, chuDes.length - 1) : current;
  }, [statuses, chuDes.length]);

  // Fire confetti when the child lands back on the map having just finished a landmark.
  useEffect(() => {
    if (doneCount === 0) return;
    let seen = 0;
    try {
      seen = Number(sessionStorage.getItem(MAP_CELEBRATED_KEY) ?? "0");
    } catch {
      /* sessionStorage unavailable */
    }
    if (doneCount <= seen) return;
    setCelebrating(true);
    try {
      sessionStorage.setItem(MAP_CELEBRATED_KEY, String(doneCount));
    } catch {
      /* ignore */
    }
  }, [doneCount]);

  // Dashed route drawn through the landmarks in order. One path per segment so the stretches
  // already travelled can be tinted gold while the rest stay a faint dashed trail.
  const routeSegments = landmarks.slice(1).map((l, i) => {
    const prev = landmarks[i];
    const cx = (prev.x + l.x) / 2;
    return { d: `M ${prev.x} ${prev.y} Q ${cx} ${prev.y}, ${l.x} ${l.y}`, fromIndex: i };
  });

  const openChuDe = (index: number) => {
    navigate({
      to: "/hoc-tap/quyen-1/chu-de-{$chuDeIndex}",
      params: { chuDeIndex: String(index + 1) },
    });
  };

  return (
    <section className="w-full">
      <div className="w-full px-3 pt-8 pb-8 sm:px-4 sm:pt-12">
        <p className="mx-auto mb-4 flex max-w-7xl items-center justify-center gap-2 text-center text-xs text-muted-foreground sm:text-sm">
          <span>Mỗi địa danh là một chủ đề — chạm vào địa danh để vừa khám phá vừa học nhé!</span>
          {/* Reopens the three-step tutorial for a child who dismissed it and wants it back. */}
          <button
            type="button"
            onClick={() => setShowTutorial(true)}
            aria-label="Xem lại hướng dẫn"
            title="Xem lại hướng dẫn"
            className="grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20 active:translate-y-[1px]"
          >
            <HelpCircle className="h-4 w-4" strokeWidth={2.75} />
          </button>
        </p>

        <div className="relative z-20 mx-auto flex max-w-7xl flex-col overflow-hidden rounded-[1.75rem] border border-border shadow-card ring-1 ring-black/[0.03]">
          {/* Map stage. On phones the artwork keeps a readable size and the card scrolls
              sideways, the same affordance the chủ đề roadmap already uses. */}
          <div className="relative w-full overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x touch-pan-y sm:overflow-x-hidden">
            <div
              className="relative aspect-[3/2] min-w-[720px] sm:min-w-0"
              onClick={() => setOpenIndex(null)}
            >
              {/* The stage matches the artwork's own aspect ratio and the image is `contain`,
                  so the whole painting is always visible — nothing gets cropped off the top. */}
              <img
                src={overworldArt}
                alt="Bản đồ Việt Nam với các địa danh"
                className="absolute inset-0 h-full w-full object-contain"
              />

              {/* Back to học tập — floats over the map now that there's no header bar. */}
              <Link
                to="/hoc-tap"
                aria-label="Quay lại"
                onClick={(e) => e.stopPropagation()}
                className="absolute left-3 top-3 z-30 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/90 text-primary shadow-[0_2px_0_0_rgba(0,0,0,0.15)] ring-1 ring-black/10 transition hover:scale-105 active:translate-y-[1px] sm:h-11 sm:w-11"
              >
                <Undo2 className="h-5 w-5" strokeWidth={2.5} />
              </Link>

              {/* Journey progress, kept on the map itself rather than in a header bar. */}
              <div className="absolute right-3 top-3 z-30 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-navy shadow-card">
                {doneCount}/{landmarks.length} chủ đề
              </div>

              {/* Route between landmarks */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
              >
                {routeSegments.map((seg) => {
                  const travelled = statuses[seg.fromIndex] === "completed";
                  return (
                    <path
                      key={seg.fromIndex}
                      d={seg.d}
                      fill="none"
                      stroke={travelled ? "oklch(0.87 0.16 75)" : "white"}
                      strokeWidth={travelled ? 1.4 : 1}
                      strokeDasharray="2.5 2.5"
                      strokeLinecap="round"
                      opacity={travelled ? 0.95 : 0.6}
                    />
                  );
                })}
              </svg>

              {/* Buffalo waits at the landmark the child is currently on. */}
              {landmarks[buffaloIndex] && (
                <BuffaloMascot
                  xPercent={Math.max(8, landmarks[buffaloIndex].x - 9)}
                  yPercent={landmarks[buffaloIndex].y + 6}
                />
              )}

              {landmarks.map((lm) => {
                const cd = chuDes[lm.chuDeIndex]?.chuDe;
                const status: PinStatus = cd ? statuses[lm.chuDeIndex] : "coming-soon";
                const isOpen = status === "completed" || status === "current";
                const accent = (cd && ACCENT[cd.accent]) ?? ACCENT.primary;
                const stats = changStats[lm.chuDeIndex];
                // A chủ đề with no content yet has no title of its own — name it after the place.
                const title = cd ? shortTitle(cd.title) : lm.name;
                const label = `Chủ đề ${lm.chuDeIndex + 1}: ${title} — ${
                  status === "completed"
                    ? "đã hoàn thành"
                    : status === "current"
                      ? "đang học"
                      : status === "coming-soon"
                        ? "sắp có"
                        : "chưa mở khoá"
                }`;
                return (
                  <div
                    key={lm.chuDeIndex}
                    className="absolute z-20"
                    style={{
                      left: `${lm.x}%`,
                      top: `${lm.y}%`,
                      transform: "translate(-50%, -100%)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Popover
                      open={openIndex === lm.chuDeIndex}
                      onOpenChange={(o) => setOpenIndex(o ? lm.chuDeIndex : null)}
                    >
                      <PopoverAnchor asChild>
                        <div className="flex flex-col items-center">
                          <button
                            type="button"
                            aria-label={label}
                            aria-expanded={openIndex === lm.chuDeIndex}
                            onClick={() =>
                              setOpenIndex(openIndex === lm.chuDeIndex ? null : lm.chuDeIndex)
                            }
                            className="relative cursor-pointer transition-transform ease-bounce hover:scale-110 active:translate-y-[2px]"
                          >
                            {/* Just the pin itself — no disc behind it. A white stroke keeps it
                                readable wherever it lands on the artwork. */}
                            <MapPin
                              className={[
                                "h-11 w-11 drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)] sm:h-13 sm:w-13",
                                isOpen ? "text-destructive" : "text-stone-400",
                              ].join(" ")}
                              fill="currentColor"
                              stroke="white"
                              strokeWidth={1.75}
                            />
                            {status === "completed" ? (
                              <span className="absolute -right-1 top-0 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-green text-white shadow-sm">
                                <Check className="h-3 w-3" strokeWidth={3.5} />
                              </span>
                            ) : !isOpen ? (
                              <span className="absolute -right-1 top-0 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-stone-500 text-white shadow-sm">
                                <Lock className="h-2.5 w-2.5" strokeWidth={3} />
                              </span>
                            ) : null}
                          </button>
                          <span className="whitespace-nowrap rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-navy shadow-card">
                            {lm.name}
                          </span>
                        </div>
                      </PopoverAnchor>

                      {/* Landmark card: a photo of the real place as the cover, then its name,
                          a one-line blurb, and the way in. Locked places still show the photo —
                          seeing where they're headed is the point of the map. */}
                      <PopoverContent
                        side="bottom"
                        sideOffset={10}
                        collisionPadding={16}
                        className="w-64 overflow-hidden rounded-3xl border-2 border-black/10 bg-card p-0 shadow-[0_6px_0_0_rgba(0,0,0,0.1)]"
                      >
                        <div className="relative h-28 w-full">
                          <img
                            src={lm.photo}
                            alt={lm.name}
                            className={[
                              "h-full w-full object-cover",
                              isOpen ? "" : "saturate-[0.35] brightness-90",
                            ].join(" ")}
                          />
                          {/* Scrim so the chủ đề badge stays legible over any photo. */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy">
                            {status === "coming-soon" ? "Sắp có" : `Chủ đề ${lm.chuDeIndex + 1}`}
                          </span>
                          {status === "completed" && (
                            <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-green text-white shadow-sm">
                              <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                            </span>
                          )}
                        </div>

                        <div className="p-4">
                          <h2 className="font-display text-base font-bold leading-tight text-navy">
                            {lm.name}
                          </h2>
                          <p className="mt-1 text-xs leading-snug text-muted-foreground">
                            {lm.blurb}
                          </p>

                          {status === "coming-soon" ? (
                            <p className="mt-3 rounded-xl bg-muted/60 px-3 py-2 text-xs leading-snug text-muted-foreground">
                              Các cô đang biên soạn chủ đề này. Em học các chủ đề trước trong lúc
                              chờ nhé! ✨
                            </p>
                          ) : status === "locked" ? (
                            <p className="mt-3 rounded-xl bg-muted/60 px-3 py-2 text-xs leading-snug text-muted-foreground">
                              Em hoàn thành chủ đề trước để mở khoá địa danh này nhé! ✨
                            </p>
                          ) : (
                            <>
                              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-navy/70">
                                <span>
                                  {stats.done}/{stats.total} chặng
                                </span>
                                <span className={accent.text}>
                                  {stats.total ? Math.round((stats.done / stats.total) * 100) : 0}%
                                </span>
                              </div>
                              <div className="mt-1 flex gap-1">
                                {Array.from({ length: stats.total }, (_, s) => (
                                  <span
                                    key={s}
                                    className={[
                                      "h-1.5 flex-1 rounded-full",
                                      s < stats.done ? accent.solid : "bg-muted",
                                    ].join(" ")}
                                  />
                                ))}
                              </div>
                              <Button
                                variant="bevel" tone="primary"
                                className="mt-4 w-full"
                                onClick={() => openChuDe(lm.chuDeIndex)}
                              >
                                Khám phá ngay
                              </Button>
                            </>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                );
              })}

              {celebrating && <ConfettiBurst onDone={() => setCelebrating(false)} />}
            </div>
          </div>
        </div>
      </div>

      {/* First-visit tutorial: dims the whole page, shows the three steps, and goes away for
          good once the child taps through. */}
      {showTutorial && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cách học ba bước"
          className="animate-modal-overlay-in fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={dismissTutorial}
        >
          <div
            className="animate-modal-pop-in flex w-full max-w-2xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={cachHocBanner}
              alt="Ba bước học: 1. Khám phá địa danh — 2. Hoàn thành bài học — 3. Nhận con dấu"
              className="w-full rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
            />
            <Button
              variant="bevel" tone="primary"
              autoFocus
              onClick={dismissTutorial}
              className="mt-6 px-8 text-base"
            >
              Em đã hiểu
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
