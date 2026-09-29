import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, HelpCircle, Lock, Map as MapIcon, MapPin } from "lucide-react";
import type { ChuDeWithChangs, QuyenNumber } from "@/lib/learning";
import { chuDeShortTitle, isChuDeComplete } from "@/lib/learning";
import type { ChangProgress } from "@/hooks/useUserProgress";
import type { ChuDe } from "@/data/topics";
import { landmarksForQuyen } from "@/data/overworld";
import { Button } from "@/components/ui/button";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { ConfettiBurst } from "./ConfettiBurst";
import { BuffaloMascot } from "./BuffaloMascot";
import { BackLink } from "@/components/BackLink";
import { loadBuffaloPos } from "@/components/tabs/LearningTab";
import overworldArt from "@/assets/quyen1-overworld.jpg";
import cachHocBanner from "@/assets/cach-hoc-3-buoc.png";

// Number of landmark completions the child has already been congratulated for on this map. Kept
// in sessionStorage (not local) so the confetti fires once per visit-after-a-win rather than
// every time they bounce back from a lesson.
// Namespaced per quyển: each book has its own map, so landmarks finished in Quyển 1 must not
// count as already-celebrated for Quyển 2.
const mapCelebratedKey = (quyenNumber: QuyenNumber) =>
  `vui-hoc-map-celebrated:quyen-${quyenNumber}`;

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
  primary: { solid: "bg-brand-500", text: "text-brand-700" },
  yellow: { solid: "bg-sun-500", text: "text-sun-700" },
  pink: { solid: "bg-rose-500", text: "text-rose-700" },
  purple: { solid: "bg-grape-500", text: "text-grape-700" },
  green: { solid: "bg-leaf-500", text: "text-leaf-700" },
};

export function OverworldMap({
  quyenNumber,
  chuDes,
  progressMap,
}: {
  quyenNumber: QuyenNumber;
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

  // Every landmark is drawn, including ones whose chủ đề hasn't been written yet — those show
  // as "sắp có" so the child can see the whole journey ahead of them, not a map that grows.
  const landmarks = landmarksForQuyen(quyenNumber);

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
    const saved = loadBuffaloPos(quyenNumber);
    if (saved && statuses[saved.chuDeIndex] === "current") return saved.chuDeIndex;
    const current = statuses.indexOf("current");
    return current === -1 ? Math.max(0, chuDes.length - 1) : current;
  }, [statuses, chuDes.length, quyenNumber]);

  // Fire confetti when the child lands back on the map having just finished a landmark.
  useEffect(() => {
    if (doneCount === 0) return;
    let seen = 0;
    try {
      seen = Number(sessionStorage.getItem(mapCelebratedKey(quyenNumber)) ?? "0");
    } catch {
      /* sessionStorage unavailable */
    }
    if (doneCount <= seen) return;
    setCelebrating(true);
    try {
      sessionStorage.setItem(mapCelebratedKey(quyenNumber), String(doneCount));
    } catch {
      /* ignore */
    }
  }, [doneCount, quyenNumber]);

  // Dashed route drawn through the landmarks in order. One path per segment so the stretches
  // already travelled can be tinted gold while the rest stay a faint dashed trail.
  const routeSegments = landmarks.slice(1).map((l, i) => {
    const prev = landmarks[i];
    const cx = (prev.x + l.x) / 2;
    return { d: `M ${prev.x} ${prev.y} Q ${cx} ${prev.y}, ${l.x} ${l.y}`, fromIndex: i };
  });

  const openChuDe = (index: number) => {
    navigate({
      to: "/hoc-tap/quyen-{$quyenNumber}/chu-de-{$chuDeIndex}",
      params: { quyenNumber: String(quyenNumber), chuDeIndex: String(index + 1) },
    });
  };

  return (
    <section className="relative w-full">
      <PageHeader
        icon={MapIcon}
        hue="brand"
        title={`Quyển ${quyenNumber} — Bản đồ hành trình`}
        lede="Mỗi địa danh là một chủ đề. Chạm vào địa danh để vừa khám phá vừa học nhé!"
        back={<BackLink to="/hoc-tap" label="Học tập" />}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink-800 shadow-xs">
            <Check className="size-4 text-leaf-600" strokeWidth={3} aria-hidden />
            <span className="tabular-nums">
              {doneCount}/{landmarks.length}
            </span>{" "}
            chủ đề đã xong
          </span>
          {/* Reopens the three-step tutorial for a child who dismissed it and wants it back. */}
          <Button variant="ghost" size="sm" onClick={() => setShowTutorial(true)}>
            <HelpCircle aria-hidden />
            Xem lại hướng dẫn
          </Button>
        </div>
      </PageHeader>

      <Container className="pb-16 sm:pb-24">
        <div className="relative z-20 flex flex-col overflow-hidden rounded-[2rem] border border-ink-100 bg-sky-50 shadow-lg">
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
                      stroke={travelled ? "var(--color-sun-500)" : "white"}
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
                const title = cd ? chuDeShortTitle(cd.title) : lm.name;
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
                            className="relative cursor-pointer rounded-full transition-transform duration-200 ease-spring hover:-translate-y-1 hover:scale-110 active:scale-95"
                          >
                            {/* Just the pin itself — no disc behind it. A white stroke keeps it
                                readable wherever it lands on the artwork. */}
                            <MapPin
                              className={[
                                "size-11 drop-shadow-[0_6px_8px_rgb(20_28_49/0.35)] sm:size-13",
                                isOpen ? "text-coral-600" : "text-ink-400",
                              ].join(" ")}
                              fill="currentColor"
                              stroke="white"
                              strokeWidth={1.75}
                            />
                            {status === "completed" ? (
                              <span className="absolute -right-1 top-0 grid size-5 place-items-center rounded-full border-2 border-white bg-leaf-600 text-white shadow-sm">
                                <Check className="h-3 w-3" strokeWidth={3.5} />
                              </span>
                            ) : !isOpen ? (
                              <span className="absolute -right-1 top-0 grid size-5 place-items-center rounded-full border-2 border-white bg-ink-500 text-white shadow-sm">
                                <Lock className="h-2.5 w-2.5" strokeWidth={3} />
                              </span>
                            ) : null}
                          </button>
                          <span className="mt-0.5 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-caption font-semibold text-ink-800 shadow-md">
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
                        className="w-72 overflow-hidden rounded-3xl p-0"
                      >
                        <div className="relative h-32 w-full">
                          <img
                            src={lm.photo}
                            alt={lm.name}
                            className={[
                              "h-full w-full object-cover",
                              isOpen ? "" : "saturate-[0.35] brightness-90",
                            ].join(" ")}
                          />
                          {status === "completed" && (
                            <span className="absolute top-3 right-3 grid size-7 place-items-center rounded-full bg-leaf-600 text-white shadow-md">
                              <Check className="size-4" strokeWidth={3.5} />
                            </span>
                          )}
                        </div>

                        <div className="p-5">
                          {/* Eyebrow sits above the title rather than floating on the photo —
                              the whole card reads as flat panels stacked, no overlays. */}
                          <p
                            className={[
                              "text-caption font-bold tracking-wide uppercase",
                              status === "coming-soon" ? "text-ink-500" : accent.text,
                            ].join(" ")}
                          >
                            {status === "coming-soon" ? "Sắp có" : `Chủ đề ${lm.chuDeIndex + 1}`}
                          </p>
                          <h2 className="mt-1 text-h3 text-ink-900">{lm.name}</h2>
                          <p className="mt-1 text-sm leading-snug text-ink-500">{lm.blurb}</p>

                          {status === "coming-soon" ? (
                            <p className="mt-4 rounded-2xl bg-ink-50 p-3 text-sm leading-snug text-ink-600">
                              Các cô đang biên soạn chủ đề này. Em học các chủ đề trước trong lúc
                              chờ nhé!
                            </p>
                          ) : status === "locked" ? (
                            <p className="mt-4 flex gap-2 rounded-2xl bg-ink-50 p-3 text-sm leading-snug text-ink-600">
                              <Lock className="mt-0.5 size-4 shrink-0 text-ink-400" aria-hidden />
                              Em hoàn thành chủ đề trước để mở khoá địa danh này nhé!
                            </p>
                          ) : (
                            <>
                              <div className="mt-4 flex items-center justify-between text-caption font-semibold text-ink-600">
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
                                      "h-2 flex-1 rounded-full",
                                      s < stats.done ? accent.solid : "bg-ink-100",
                                    ].join(" ")}
                                  />
                                ))}
                              </div>
                              <Button
                                className="mt-5 w-full"
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
      </Container>

      {/* First-visit tutorial: the three steps, gone for good once the child taps through. */}
      <Dialog open={showTutorial} onOpenChange={(open) => !open && dismissTutorial()}>
        <DialogContent className="max-w-2xl gap-6 p-4 sm:p-6">
          <DialogTitle className="sr-only">Cách học ba bước</DialogTitle>
          <img
            src={cachHocBanner}
            alt="Ba bước học: 1. Khám phá địa danh — 2. Hoàn thành bài học — 3. Nhận con dấu"
            className="w-full rounded-2xl"
          />
          <Button size="lg" autoFocus onClick={dismissTutorial} className="mx-auto px-10">
            Em đã hiểu
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
