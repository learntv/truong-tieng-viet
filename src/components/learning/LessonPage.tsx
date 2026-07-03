import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Headphones, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { learningDataQueryOptions } from "@/lib/learning";
import type { Bai, Hinh, NoiDung } from "@/lib/learning";
import { STAGE_COLORS } from "./StageCard";
import { ConfettiBurst } from "./ConfettiBurst";
import { useLearningProgress } from "@/hooks/useLearningProgress";

type StageColor = (typeof STAGE_COLORS)[number];

const SIDEBAR_TOP_OFFSET = 16;

// `position: sticky` doesn't work here because a global `overflow-x: hidden` on
// html/body forces `overflow-y: auto` too, making <body> (not the viewport) the
// sticky containing block — and body never scrolls internally since its own
// box is always exactly as tall as its content. So the sidebar is pinned manually.
function useStickySidebar(wrapRef: React.RefObject<HTMLElement | null>, boxRef: React.RefObject<HTMLDivElement | null>) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const wrap = wrapRef.current;
      const box = boxRef.current;
      if (!wrap || !box) return;
      const wrapRect = wrap.getBoundingClientRect();
      const boxHeight = box.offsetHeight;

      if (wrapRect.top > SIDEBAR_TOP_OFFSET) {
        setStyle({});
      } else if (wrapRect.bottom < SIDEBAR_TOP_OFFSET + boxHeight) {
        setStyle({ position: "absolute", bottom: 0, left: 0, right: 0, top: "auto" });
      } else {
        setStyle({ position: "fixed", top: SIDEBAR_TOP_OFFSET, left: wrapRect.left, width: wrapRect.width });
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [wrapRef, boxRef]);

  return style;
}

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

function toYouTubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function AudioButton({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play(); setPlaying(true); }
  };
  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" onEnded={() => setPlaying(false)} onPause={() => setPlaying(false)} />
      <button
        onClick={toggle}
        aria-label={playing ? "Dừng" : "Nghe"}
        className={[
          "cursor-pointer grid h-8 w-8 shrink-0 place-items-center rounded-full transition active:scale-95",
          playing ? "animate-pulse bg-blue-500 text-white" : "bg-blue-100 text-blue-600 hover:bg-blue-200",
        ].join(" ")}
      >
        <Headphones className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </>
  );
}

function VideoEmbed({ url }: { url: string }) {
  const embedUrl = toYouTubeEmbed(url);
  if (embedUrl) {
    return (
      <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl ring-1 ring-border/60">
        <iframe
          src={embedUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl ring-1 ring-border/60">
      <video src={url} controls className="h-full w-full" />
    </div>
  );
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
  const [isLoaded, setIsLoaded] = useState(false);
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
          <div
            className={[
              "overflow-hidden rounded-xl",
              !isLoaded ? "min-h-48 animate-pulse bg-stone-100 sm:min-h-64" : "",
            ].join(" ")}
          >
            <img
              src={hinh.url}
              alt={captions[0] || "Hình minh họa"}
              loading="eager"
              decoding="async"
              onLoad={(e) => {
                setIsLandscape(e.currentTarget.naturalWidth > e.currentTarget.naturalHeight);
                setIsLoaded(true);
              }}
              className={[
                "mx-auto rounded-xl object-contain ring-1 ring-border/60 transition-opacity duration-300",
                isLoaded ? "opacity-100" : "opacity-0",
                !isSingle ? "w-full" : stackVertical ? "w-[80%]" : "w-[85%]",
              ].join(" ")}
            />
          </div>
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

export type Slide = {
  ndIndex: number;
  nd: NoiDung;
  bai: Bai | null;
  baiIndex: number;
  baiCount: number;
};

export function buildSlides(noiDungs: NoiDung[]): Slide[] {
  return noiDungs.flatMap((nd, ndIndex): Slide[] =>
    nd.bais.length > 0
      ? nd.bais.map((bai, baiIndex) => ({ ndIndex, nd, bai, baiIndex, baiCount: nd.bais.length }))
      : [{ ndIndex, nd, bai: null, baiIndex: 0, baiCount: 0 }],
  );
}

export function LessonPage({ changId }: { changId: string }) {
  const { data, isLoading, error } = useQuery(learningDataQueryOptions);
  const {
    authIsLoading,
    activeProgressMap,
    isProgressLoading,
    markChangComplete,
    saveChangPosition,
  } = useLearningProgress();

  const found = useMemo(() => {
    if (!data) return null;
    for (const topic of data) {
      const changIndex = topic.changs.findIndex((c) => c.id === changId);
      if (changIndex !== -1) {
        return { chuDe: topic.chuDe, changs: topic.changs, chang: topic.changs[changIndex], changIndex };
      }
    }
    return null;
  }, [data, changId]);

  const savedNoiDungIndex = found ? activeProgressMap.get(found.chang.id)?.noiDungIndex ?? 0 : 0;
  const isCompleted = found ? !!activeProgressMap.get(found.chang.id)?.isCompleted : false;

  const slides = useMemo(() => (found ? buildSlides(found.chang.noiDungs) : []), [found]);

  const [slideIndex, setSlideIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const sidebarWrapRef = useRef<HTMLElement>(null);
  const sidebarBoxRef = useRef<HTMLDivElement>(null);
  const sidebarStyle = useStickySidebar(sidebarWrapRef, sidebarBoxRef);

  // Resets to the right starting slide every time the lesson changes (not just on first
  // mount) — continuing from the saved position, or from the start if this is a review of
  // an already-completed lesson. Runs before paint so switching lessons never flashes the
  // previous lesson's slide index against the new lesson's content.
  useLayoutEffect(() => {
    if (!found || slides.length === 0) return;
    if (isCompleted) {
      setSlideIndex(0);
      return;
    }
    const firstOfStep = slides.findIndex((s) => s.ndIndex === savedNoiDungIndex);
    setSlideIndex(firstOfStep !== -1 ? firstOfStep : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changId]);

  useEffect(() => () => { if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current); }, []);

  const [showConfetti, setShowConfetti] = useState(false);

  // Cancel TTS and audio on step change / unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      document.querySelectorAll("audio").forEach((el) => el.pause());
    };
  }, [slideIndex, changId]);

  // Save reading position as the user moves through steps (skip if already completed)
  const isFirstPositionSave = useRef(true);
  useEffect(() => {
    if (isFirstPositionSave.current) { isFirstPositionSave.current = false; return; }
    if (!found || isCompleted) return;
    const ndIndex = slides[slideIndex]?.ndIndex ?? 0;
    saveChangPosition(found.chang.id, ndIndex, isCompleted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIndex]);

  if (isLoading || authIsLoading || isProgressLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !found) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <h1 className="mb-2 font-display text-2xl font-extrabold text-navy">Không tìm thấy bài học</h1>
        <p className="mb-6 text-muted-foreground">Chặng học này không tồn tại hoặc đã bị xóa.</p>
        <Link to="/hoc-tieng-viet" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90">
          <ArrowLeft className="h-4 w-4" />
          Quay lại lộ trình
        </Link>
      </div>
    );
  }

  const { chuDe, changs, chang, changIndex } = found;
  const noiDungs = chang.noiDungs;
  const total = slides.length;
  const currentSlide = slides[slideIndex];
  const currentNoiDung = currentSlide?.nd;
  const bai = currentSlide?.bai ?? null;
  const color = STAGE_COLORS[changIndex % STAGE_COLORS.length];
  const canPrev = slideIndex > 0;
  const canNext = slideIndex < total - 1;
  const isLastSlide = slideIndex === total - 1;

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(total - 1, i));
    if (clamped === slideIndex || fading) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    document.querySelectorAll("audio").forEach((el) => el.pause());
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });

    setFading(true);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => {
      setSlideIndex(clamped);
      requestAnimationFrame(() => setFading(false));
    }, 160);
  };
  const goToStep = (ndIndex: number) => {
    const first = slides.findIndex((s) => s.ndIndex === ndIndex);
    if (first !== -1) goTo(first);
  };

  const handleComplete = () => {
    if (isCompleted) return;
    setShowConfetti(true);
    markChangComplete(chang.id, currentSlide?.ndIndex ?? 0);
    toast.success(`Chặng ${changIndex + 1} hoàn thành! 🎉`, {
      description: "Tiếp tục giỏi nhé!",
      duration: 3000,
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

      <div className="mb-5">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground transition-colors hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại lộ trình
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{chang.emoji}</span>
          <h1 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">{chang.title}</h1>
        </div>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          Bài {changIndex + 1}/{changs.length} · {currentNoiDung?.title || chuDe.title}
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">

        {/* Sidebar */}
        <aside ref={sidebarWrapRef} className="relative hidden shrink-0 lg:block lg:w-72">
          <div ref={sidebarBoxRef} style={sidebarStyle} className="rounded-2xl bg-card p-4 shadow-card">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Tiến độ bài học
            </p>
            <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={["h-full rounded-full transition-[width] duration-500 ease-out", color.gradient].join(" ")}
                style={{ width: total > 0 ? `${((slideIndex + 1) / total) * 100}%` : "0%" }}
              />
            </div>
            <p className="mb-4 text-xs font-bold text-muted-foreground">{slideIndex + 1}/{total}</p>

            <ol className="flex flex-col gap-1">
              {noiDungs.map((nd, i) => {
                const isActive = i === currentSlide?.ndIndex;
                return (
                  <li key={nd.id}>
                    <button
                      onClick={() => goToStep(i)}
                      className={[
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                        isActive ? [color.bgSoft, "ring-1", color.border].join(" ") : "hover:bg-muted/60",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "grid h-7 w-7 shrink-0 place-items-center rounded-full font-display text-xs font-extrabold",
                          isActive ? [color.gradient, "text-white"].join(" ") : "bg-muted text-muted-foreground",
                        ].join(" ")}
                      >
                        {i + 1}
                      </span>
                      <span className={["truncate text-sm font-bold", isActive ? "text-navy" : "text-muted-foreground"].join(" ")}>
                        {nd.title || `Bước ${i + 1}`}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div ref={cardRef} className="rounded-2xl bg-card p-5 shadow-card sm:p-8">

            {/* Mobile step indicator */}
            <p className="mb-4 text-xs font-extrabold uppercase tracking-wider text-muted-foreground lg:hidden">
              {slideIndex + 1} / {total}
            </p>

            <div
              key={`${currentNoiDung?.id}-${currentSlide?.baiIndex}`}
              className={[
                "transition-all duration-200 ease-out",
                fading ? "-translate-y-1.5 opacity-0" : "translate-y-0 opacity-100",
              ].join(" ")}
            >
              {currentNoiDung?.title && (
                <div className={["mb-6 rounded-2xl px-5 py-4 text-center shadow-card", color.gradient].join(" ")}>
                  <p className="font-display text-xl font-extrabold text-white sm:text-2xl">
                    {currentNoiDung.title}
                  </p>
                </div>
              )}
              {bai ? (() => {
                const hasAudio = !!bai.audioUrl;
                const hasVideo = !!bai.meta?.video_url;
                const hasEmbed = !!bai.meta?.link;
                const hinhs = bai.hinhs;
                const isSingle = hinhs.length === 1;
                return (
                  <article>
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex-1 space-y-1.5">
                        {bai.texts.map((t, i) => (
                          <p
                            key={i}
                            className="whitespace-pre-line font-display text-base font-bold text-navy sm:text-lg"
                          >
                            {t}
                            {hasAudio && i === bai.texts.length - 1 && (
                              <span className="ml-2 inline-flex align-middle">
                                <AudioButton src={bai.audioUrl!} />
                              </span>
                            )}
                          </p>
                        ))}
                      </div>
                    </div>

                    {hasEmbed ? (
                      <div className="mt-3 w-full overflow-hidden rounded-xl ring-1 ring-border/60">
                        <iframe
                          src={bai.meta!.link!}
                          className="h-80 w-full sm:h-[30rem]"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : !hasVideo && hinhs.length > 0 && (
                      <div
                        className={
                          isSingle
                            ? "flex flex-col gap-4 sm:flex-row sm:items-start"
                            : "grid grid-cols-2 gap-4"
                        }
                      >
                        {hinhs.map((hinh) => {
                          const captions = (hasAudio || hasVideo) ? [] : hinh.captions.filter((c) => c.trim().length > 1);
                          return (
                            <HinhBlock
                              key={hinh.id}
                              hinh={hinh}
                              captions={captions}
                              isSingle={isSingle}
                              colorIndex={changIndex + (currentSlide?.baiIndex ?? 0)}
                            />
                          );
                        })}
                      </div>
                    )}

                    {hasVideo && <VideoEmbed url={bai.meta!.video_url!} />}
                  </article>
                );
              })() : (
                <p className="text-center text-sm text-muted-foreground">
                  Nội dung đang được cập nhật.
                </p>
              )}
            </div>

            {isLastSlide && (
              <div className="relative mt-10 flex justify-center pb-2">
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

          {/* Bottom nav */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              onClick={() => goTo(slideIndex - 1)}
              disabled={!canPrev}
              className={[
                "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold text-navy shadow-sm transition",
                canPrev ? "hover:bg-muted" : "cursor-not-allowed opacity-40",
              ].join(" ")}
            >
              <ChevronLeft className="h-4 w-4" />
              Bài trước
            </button>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={`${s.ndIndex}-${s.baiIndex}`}
                  onClick={() => goTo(i)}
                  aria-label={`Trang ${i + 1}`}
                  className={[
                    "h-2 rounded-full transition-all",
                    i === slideIndex ? ["w-5", color.bg].join(" ") : "w-2 bg-muted hover:bg-muted-foreground/40",
                  ].join(" ")}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(slideIndex + 1)}
              disabled={!canNext}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-sm transition",
                canNext ? [color.gradient, "hover:brightness-110"].join(" ") : "cursor-not-allowed bg-muted text-muted-foreground opacity-60",
              ].join(" ")}
            >
              Bài tiếp theo
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
