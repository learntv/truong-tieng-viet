import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Maximize2, Minimize2, X } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import type { Chang, Hinh } from "@/lib/learning";
import { STAGE_COLORS } from "./StageCard";
import { ConfettiBurst } from "./ConfettiBurst";
import { useIsMobile } from "@/hooks/use-mobile";

type StageColor = (typeof STAGE_COLORS)[number];

function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "vi-VN";
  u.rate = 0.85;
  u.pitch = 1.05;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

function CloudWord({ text, color }: { text: string; color: StageColor }) {
  const [playing, setPlaying] = useState(false);
  const onClick = useCallback(() => {
    setPlaying(true);
    speak(text, () => setPlaying(false));
  }, [text]);
  return (
    <button
      onClick={onClick}
      aria-label={`Nghe đọc: ${text}`}
      className={[
        "cursor-pointer rounded-full border-2 px-3 py-1.5 font-display text-base leading-tight transition active:scale-95",
        color.bgSoft,
        color.border,
        color.text,
        playing
          ? "animate-pulse scale-110"
          : "hover:-translate-y-0.5 hover:scale-110 hover:shadow-card",
      ].join(" ")}
    >
      {text}
    </button>
  );
}

function HinhBlock({
  hinh,
  captions,
  isSingle,
  colorIndex,
}: {
  hinh: Hinh;
  captions: string[];
  isSingle: boolean;
  colorIndex: number;
}) {
  const [isLandscape, setIsLandscape] = useState(false);
  const hasCaptions = captions.length > 0;
  const stackVertical = !isSingle || isLandscape || !hasCaptions;

  return (
    <figure
      className={
        stackVertical
          ? "flex flex-col items-center gap-3"
          : "flex flex-1 flex-col gap-3 sm:flex-row sm:items-start"
      }
    >
      <div className={stackVertical ? "w-full" : "sm:w-[60%]"}>
        {hinh.url ? (
          <img
            src={hinh.url}
            alt={captions[0] || "Hình minh họa"}
            loading="lazy"
            onLoad={(e) =>
              setIsLandscape(e.currentTarget.naturalWidth > e.currentTarget.naturalHeight)
            }
            className={[
              "mx-auto rounded-xl object-contain ring-1 ring-border/60",
              !isSingle ? "w-full" : stackVertical ? "w-[80%]" : "w-[85%]",
            ].join(" ")}
          />
        ) : (
          <div className="grid aspect-video w-full place-items-center rounded-xl bg-stone-50 text-xs text-muted-foreground ring-1 ring-border/60">
            (Không tải được hình)
          </div>
        )}
      </div>

      {hasCaptions && (
        <div
          className={
            stackVertical
              ? "flex flex-wrap items-center justify-center gap-2 pb-2"
              : "flex flex-1 flex-wrap items-center justify-center gap-2 self-center pb-2 sm:pl-2"
          }
        >
          {captions.map((c, ci) => (
            <CloudWord
              key={ci}
              text={c}
              color={STAGE_COLORS[(colorIndex + ci) % STAGE_COLORS.length]}
            />
          ))}
        </div>
      )}
    </figure>
  );
}

export function LessonCard({
  chang,
  changIndex,
  noiDungIndex,
  isCompleted,
  isFullscreen,
  onToggleFullscreen,
  onPrevNoiDung,
  onNextNoiDung,
  onNoiDungChange,
  onComplete,
  onClose,
}: {
  chang: Chang;
  changIndex: number;
  noiDungIndex: number;
  isCompleted: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onPrevNoiDung: () => void;
  onNextNoiDung: () => void;
  onNoiDungChange?: (i: number) => void;
  onComplete: () => void;
  onClose: () => void;
}) {
  const noiDungs = chang.noiDungs;
  const total = noiDungs.length;
  const isLastNoiDung = noiDungIndex === total - 1;
  const color = STAGE_COLORS[changIndex % STAGE_COLORS.length];
  const [showConfetti, setShowConfetti] = useState(false);
  const isMobile = useIsMobile();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });

  /* Sync parent index → carousel */
  useEffect(() => {
    emblaApi?.scrollTo(noiDungIndex, false);
  }, [emblaApi, noiDungIndex]);

  /* Sync swipe gesture → parent */
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const i = emblaApi.selectedScrollSnap();
      onNoiDungChange?.(i);
    };
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onNoiDungChange]);

  /* Cancel TTS on unmount / page change */
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [noiDungIndex, changIndex]);

  const handleComplete = () => {
    if (isCompleted) return;
    setShowConfetti(true);
    onComplete();
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-card shadow-2xl sm:rounded-3xl">

      {/* ── Gradient header ── */}
      <div
        className={[
          "relative shrink-0 px-5 pb-3 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pt-4",
          color.gradient,
        ].join(" ")}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none">{chang.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-wider text-white/70">
              Chặng {changIndex + 1}
            </p>
            <h3 className="truncate font-display text-lg font-extrabold text-white sm:text-xl">
              {chang.title}
            </h3>
          </div>
          {onToggleFullscreen && !isMobile && (
            <button
              onClick={onToggleFullscreen}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white/35"
              aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
            >
              {isFullscreen
                ? <Minimize2 className="h-4 w-4" strokeWidth={2.5} />
                : <Maximize2 className="h-4 w-4" strokeWidth={2.5} />
              }
            </button>
          )}
          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white/35"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Slim progress bar */}
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-500 ease-out"
            style={{ width: total > 0 ? `${((noiDungIndex + 1) / total) * 100}%` : "0%" }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] font-bold text-white/60">
          <span>Trang {noiDungIndex + 1}</span>
          <span>{total} trang</span>
        </div>
      </div>

      {/* ── Embla carousel (horizontal pages) ── */}
      <div ref={emblaRef} className="min-h-0 flex-1 overflow-hidden">
        <div className="flex h-full">
          {noiDungs.map((nd, pageIdx) => (
            <div
              key={nd.id}
              className="lesson-scroll flex-none w-full h-full overflow-y-auto overscroll-contain px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-7 sm:py-8"
              style={{ "--scroll-thumb": color.scrollThumb, "--scroll-track": color.scrollTrack } as React.CSSProperties}
            >
              {/* NoiDung title pill */}
              {nd.title && (
                <div
                  className={[
                    "mb-6 rounded-2xl px-5 py-4 text-center shadow-card",
                    color.gradient,
                  ].join(" ")}
                >
                  <p className="font-display text-xl font-extrabold text-white sm:text-2xl">
                    {nd.title}
                  </p>
                </div>
              )}

              {/* Bai items */}
              <div className="flex flex-col gap-6 divide-y divide-border/60">
                {nd.bais.map((bai, li) => {
                  const hinhs = bai.hinhs;
                  const isSingle = hinhs.length === 1;
                  return (
                    <article key={bai.id} className={li > 0 ? "pt-6" : ""}>
                      <div className="mb-4 flex items-start gap-3">
                        <span
                          className={[
                            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-sm font-extrabold text-white",
                            color.gradient,
                          ].join(" ")}
                        >
                          {li + 1}
                        </span>
                        <div className="flex-1 space-y-1.5">
                          {bai.texts.map((t, i) => (
                            <p
                              key={i}
                              className="whitespace-pre-line font-display text-base font-bold text-navy sm:text-lg"
                            >
                              {t}
                            </p>
                          ))}
                        </div>
                      </div>

                      {hinhs.length > 0 && (
                        <div
                          className={
                            isSingle
                              ? "flex flex-col gap-4 sm:flex-row sm:items-start"
                              : "grid grid-cols-2 gap-4"
                          }
                        >
                          {hinhs.map((hinh) => {
                            const captions = hinh.captions.filter((c) => c.trim().length > 1);
                            return (
                              <HinhBlock
                                key={hinh.id}
                                hinh={hinh}
                                captions={captions}
                                isSingle={isSingle}
                                colorIndex={changIndex + li}
                              />
                            );
                          })}
                        </div>
                      )}
                    </article>
                  );
                })}

                {nd.bais.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    Nội dung đang được cập nhật.
                  </p>
                )}
              </div>

              {/* Complete button on last page */}
              {pageIdx === total - 1 && (
                <div className="relative mt-10 flex justify-center pb-4">
                  {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}
                  <button
                    onClick={handleComplete}
                    disabled={isCompleted}
                    className={[
                      "relative flex items-center justify-center gap-2 overflow-hidden rounded-full px-10 py-4 text-lg font-extrabold tracking-wide shadow-glow-green transition sm:px-12 sm:py-5 sm:text-xl",
                      isCompleted
                        ? "cursor-not-allowed bg-green-100 text-green-600 shadow-none ring-0"
                        : "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-white ring-4 ring-white/70 hover:scale-105 active:scale-95",
                    ].join(" ")}
                  >
                    {!isCompleted && (
                      <span className="pointer-events-none absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    )}
                    <Check className="h-6 w-6 shrink-0" strokeWidth={3} />
                    {isCompleted ? "Đã hoàn thành ✓" : "Hoàn thành chặng 🎉"}
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Empty state */}
          {noiDungs.length === 0 && (
            <div className="flex-none w-full h-full flex items-center justify-center px-5 text-center text-sm text-muted-foreground">
              Chặng này chưa có nội dung.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
