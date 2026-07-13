import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, ExternalLink, Headphones, Loader2, X } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { learningDataQueryOptions } from "@/lib/learning";
import type { Bai, Hinh, NoiDung } from "@/lib/learning";
import { STAGE_COLORS } from "./StageCard";
import { ConfettiBurst } from "./ConfettiBurst";
import { ImageHighlightOverlay } from "./ImageHighlightOverlay";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { Button } from "@/components/ui/button";
import { sceneForChuDe } from "@/data/scenes";
import mapPinIcon from "@/assets/map-pin-icon.png";

type StageColor = (typeof STAGE_COLORS)[number];

// Shared by the mobile inline bar and the desktop fixed pill (see their call sites below) —
// only sizing/positioning differs between the two, passed in via className.
function BackToMapButton({
  color,
  topicIndex,
  className,
  arrowClassName,
  iconClassName,
}: {
  color: StageColor;
  topicIndex: number;
  className: string;
  arrowClassName: string;
  iconClassName: string;
}) {
  return (
    <Link
      to="/hoc-tap/quyen-1/chu-de-{$chuDeIndex}"
      params={{ chuDeIndex: String(topicIndex + 1) }}
      aria-label="Quay lại bản đồ"
      className={[className, color.bgSoft, color.bevel, color.bevelActive].join(" ")}
    >
      <ArrowLeft className={[arrowClassName, color.text].join(" ")} strokeWidth={3} />
      <img src={mapPinIcon} alt="" className={iconClassName} />
    </Link>
  );
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
  if (!m) return null;
  // youtube-nocookie.com + an explicit origin cut down on the third-party-cookie /
  // storage-access checks that cause the embedded player to intermittently fail with
  // "An error occurred" in browsers with strict tracking protection or ad blockers.
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `https://www.youtube-nocookie.com/embed/${m[1]}?origin=${encodeURIComponent(origin)}`;
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
          "cursor-pointer grid h-8 w-8 shrink-0 place-items-center rounded-full transition-[transform,box-shadow,background-color] ease-bounce active:translate-y-[1px]",
          playing
            ? "animate-pulse bg-blue-500 text-white shadow-[0_2px_0_0_#1d4ed8] active:shadow-[0_0px_0_0_#1d4ed8]"
            : "bg-blue-100 text-blue-600 shadow-[0_2px_0_0_#93c5fd] hover:bg-blue-200 active:shadow-[0_0px_0_0_#93c5fd]",
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
      <div className="flex flex-col gap-1.5 sm:h-full">
        <div className="aspect-video w-full overflow-hidden rounded-none ring-1 ring-border/60 sm:aspect-auto sm:min-h-0 sm:flex-1 sm:rounded-xl">
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {/* Embedded playback can fail transiently (cookie/storage blocking, ad blockers) even
            though the video itself is fine — this link always gives a way to actually watch it. */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 self-start text-xs font-bold text-sky-600 hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Video không phát được? Mở trên YouTube
        </a>
      </div>
    );
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-none ring-1 ring-border/60 sm:aspect-auto sm:h-full sm:rounded-xl">
      <video src={url} controls className="h-full w-full object-contain" />
    </div>
  );
}

function useHasVietnameseVoice(): boolean {
  const [hasVoice, setHasVoice] = useState<boolean>(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
    return window.speechSynthesis.getVoices().some((v) => v.lang?.toLowerCase().startsWith("vi"));
  });
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const check = () => {
      const ok = window.speechSynthesis.getVoices().some((v) => v.lang?.toLowerCase().startsWith("vi"));
      setHasVoice(ok);
    };
    check();
    window.speechSynthesis.addEventListener("voiceschanged", check);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", check);
  }, []);
  return hasVoice;
}

function CloudWord({ text, color }: { text: string; color: StageColor }) {
  const [playing, setPlaying] = useState(false);
  const hasVietnameseVoice = useHasVietnameseVoice();
  const onClick = useCallback(() => {
    setPlaying(true);
    speak(text, () => setPlaying(false));
  }, [text]);
  if (!hasVietnameseVoice) {
    return (
      <span
        className={[
          "rounded-full border-2 px-3 py-1.5 font-display text-base leading-tight",
          color.bgSoft,
          color.border,
          color.text,
        ].join(" ")}
      >
        {text}
      </span>
    );
  }
  return (
    <button
      onClick={onClick}
      aria-label={`Nghe đọc: ${text}`}
      className={[
        "cursor-pointer rounded-full border-2 px-3 py-1.5 font-display text-base leading-tight transition-[transform,box-shadow] ease-bounce",
        color.bgSoft,
        color.border,
        color.text,
        playing
          ? "animate-pulse scale-110"
          : [color.bevel, color.bevelActive, "active:translate-y-[3px]"].join(" "),
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
  const highlightTargets = hinh.highlightTargets ?? [];
  const hasHighlights = highlightTargets.length > 0;
  const hasCaptions = captions.length > 0;
  const stackVertical = !isSingle || isLandscape || !hasCaptions;
  // On mobile the image is always content-sized (natural aspect ratio) so it never gets
  // squeezed by flex when the surrounding text/captions push the available height down —
  // the card scrolls instead. Only at sm+, where the layout has a stable fixed-height row,
  // does it stretch to fill available space. Shared by every wrapper down to the image
  // itself so they all agree on whether to stretch.
  const growClass = "sm:flex-1";

  return (
    <figure
      className={[
        "min-h-0",
        growClass,
        // Tighter gap on mobile so the word cloud sits close under the image (both branches
        // still stack into a single column below sm, regardless of stackVertical).
        stackVertical
          ? "flex flex-col items-center gap-1 sm:gap-3"
          : "flex flex-col gap-1 sm:flex-row sm:items-stretch sm:gap-3",
      ].join(" ")}
    >
      <div
        className={[
          "flex min-h-0 flex-col",
          growClass,
          stackVertical ? "w-full" : "sm:w-[72%]",
        ].join(" ")}
      >
        {hinh.url ? (
          <div
            className={[
              "relative min-h-0 overflow-hidden rounded-none sm:rounded-xl",
              growClass,
              !isLoaded ? "min-h-48 animate-pulse bg-stone-100 sm:min-h-64" : "",
            ].join(" ")}
          >
            {/* Relative wrapper hugging the image exactly, so the %-based highlight
                overlay stays aligned with the image at every screen size. */}
            <div className="relative mx-auto w-full sm:flex sm:h-full sm:items-center sm:justify-center">
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
                  "w-full max-w-full rounded-none object-contain ring-1 ring-border/60 transition-opacity duration-300 sm:h-full sm:max-h-full sm:rounded-xl",
                  isLoaded ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
              {hasHighlights && isLoaded && (
                <ImageHighlightOverlay targets={highlightTargets} />
              )}
            </div>
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 place-items-center rounded-none bg-stone-50 text-xs text-muted-foreground ring-1 ring-border/60 sm:rounded-xl">
            (Không tải được hình)
          </div>
        )}

        {hasHighlights && hinh.url && (
          <p className="mt-3 shrink-0 text-center text-sm font-bold text-amber-600">
            🔍 Rê chuột hoặc chạm vào hình để xem gợi ý
          </p>
        )}
      </div>

      {hasCaptions && (
        <div
          className={
            stackVertical
              ? "flex shrink-0 flex-wrap items-center justify-center gap-2 pb-2"
              : "flex shrink-0 flex-wrap items-center justify-center gap-2 self-center pb-2 sm:pl-2"
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
  const navigate = useNavigate();
  const {
    authIsLoading,
    activeProgressMap,
    isProgressLoading,
    markChangComplete,
    saveChangPosition,
  } = useLearningProgress();

  const found = useMemo(() => {
    if (!data) return null;
    for (let topicIndex = 0; topicIndex < data.length; topicIndex++) {
      const topic = data[topicIndex];
      const changIndex = topic.changs.findIndex((c) => c.id === changId);
      if (changIndex !== -1) {
        return { chuDe: topic.chuDe, changs: topic.changs, chang: topic.changs[changIndex], changIndex, topicIndex };
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

  const [showConfetti, setShowConfetti] = useState(false);
  const [showNextPrompt, setShowNextPrompt] = useState(false);

  // Dismiss any lingering "next lesson" prompt / confetti as soon as the lesson changes,
  // regardless of whether data for the new lesson has loaded yet.
  useEffect(() => {
    setShowNextPrompt(false);
    setShowConfetti(false);
  }, [changId]);

  // Resets to the right starting slide once per lesson — continuing from the saved position,
  // or from the start if this is a review of an already-completed lesson. Guarded by the ref
  // (not just `[changId]` deps) because `found`/`slides` can still be null/empty on the first
  // run after a cold load or hard refresh (react-query hasn't resolved yet); without the guard,
  // that early bail-out would never be retried once the data arrives, silently stranding the
  // lesson at slide 0 instead of the saved position. Runs before paint so switching lessons
  // never flashes the previous lesson's slide index against the new lesson's content.
  const initializedChangIdRef = useRef<string | null>(null);
  useLayoutEffect(() => {
    if (!found || slides.length === 0) return;
    if (initializedChangIdRef.current === changId) return;
    initializedChangIdRef.current = changId;
    if (isCompleted) {
      setSlideIndex(0);
      return;
    }
    const firstOfStep = slides.findIndex((s) => s.ndIndex === savedNoiDungIndex);
    setSlideIndex(firstOfStep !== -1 ? firstOfStep : 0);
  }, [changId, found, slides, isCompleted, savedNoiDungIndex]);

  useEffect(() => () => { if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current); }, []);

  // Preload the next couple of slides' images so they're already cached by the time
  // the user clicks next, avoiding a blank/loading flash on navigation.
  useEffect(() => {
    for (const s of slides.slice(slideIndex + 1, slideIndex + 3)) {
      for (const hinh of s.bai?.hinhs ?? []) {
        if (!hinh.url) continue;
        const img = new Image();
        img.src = hinh.url;
      }
    }
  }, [slideIndex, slides]);

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
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !found) {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center bg-background px-4 text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <h1 className="mb-2 font-display text-2xl font-extrabold text-navy">Không tìm thấy bài học</h1>
        <p className="mb-6 text-muted-foreground">Chặng học này không tồn tại hoặc đã bị xóa.</p>
        <Button variant="bevel-primary" asChild>
          <Link to="/hoc-tap/quyen-1">
            <ArrowLeft className="h-4 w-4" />
            Quay lại lộ trình
          </Link>
        </Button>
      </div>
    );
  }

  const { chuDe, changs, chang, changIndex, topicIndex } = found;
  const total = slides.length;
  const currentSlide = slides[slideIndex];
  const currentNoiDung = currentSlide?.nd;
  const bai = currentSlide?.bai ?? null;
  const color = STAGE_COLORS[changIndex % STAGE_COLORS.length];
  const canPrev = slideIndex > 0;
  const canNext = slideIndex < total - 1;
  const isLastSlide = slideIndex === total - 1;
  const nextChang = changs[changIndex + 1] ?? null;
  const nextColor = STAGE_COLORS[(changIndex + 1) % STAGE_COLORS.length];

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(total - 1, i));
    if (clamped === slideIndex || fading) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    document.querySelectorAll("audio").forEach((el) => el.pause());

    setFading(true);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => {
      setSlideIndex(clamped);
      requestAnimationFrame(() => setFading(false));
    }, 160);
  };
  const handleComplete = () => {
    if (isCompleted) return;
    setShowConfetti(true);
    markChangComplete(chang.id, currentSlide?.ndIndex ?? 0);
    toast.success(`Chặng ${changIndex + 1} hoàn thành! 🎉`, {
      description: "Tiếp tục giỏi nhé!",
      duration: 3000,
    });
    if (nextChang) setShowNextPrompt(true);
  };

  const goToNextChang = () => {
    if (!nextChang) return;
    setShowNextPrompt(false);
    navigate({ to: "/hoc-tap/quyen-1/$changId", params: { changId: nextChang.id } });
  };

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-navy">
      <img
        src={sceneForChuDe(topicIndex)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
      />
      <div className="absolute inset-0 bg-black/45" />

      {/* Breadcrumb bar */}
      <div className={["relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6", color.bg].join(" ")}>
        <div className="flex min-w-0 items-center gap-1.5 text-xs font-bold text-white/90 sm:text-sm">
          <span className="shrink-0">Sách giáo khoa</span>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-70" />
          <span className="shrink-0">Quyển 1</span>
          <ChevronRight className="hidden h-3 w-3 shrink-0 opacity-70 sm:block" />
          <span className="hidden truncate text-white/90 sm:inline">{chuDe.title}</span>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-70" />
          <span className="truncate text-white">{chang.emoji} {chang.title}</span>
        </div>
        <div className="shrink-0 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-navy">
          Chặng {changIndex + 1}/{changs.length}
        </div>
      </div>

      {/* Mobile-only back-to-map bar: sits between the breadcrumb and the card, in normal
          flow. On sm+ the fixed floating button below (near the back-to-map Link further
          down) is used instead, since there's enough margin around the card there. */}
      <div className="relative z-10 flex shrink-0 px-2 pt-2 sm:hidden">
        <BackToMapButton
          color={color}
          topicIndex={topicIndex}
          className="flex h-11 items-center gap-1 rounded-full px-3 transition-[transform,box-shadow] ease-bounce active:translate-y-[2px]"
          arrowClassName="h-5 w-5 shrink-0"
          iconClassName="h-7 w-7 shrink-0 object-contain"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full min-h-0 max-w-4xl flex-1 gap-3 p-0 sm:gap-4 sm:p-4">

        {/* Left: numbered slide pills */}
        <aside className="hidden w-14 shrink-0 overflow-y-auto sm:flex sm:flex-col sm:items-center">
          <div className="flex flex-col items-center gap-2 rounded-full border-2 border-black/10 bg-white p-2 shadow-[0_3px_0_0_rgba(0,0,0,0.1)]">
            {slides.map((s, i) => {
              const isActive = i === slideIndex;
              const isDone = isCompleted || i < slideIndex;
              return (
                <button
                  key={`${s.ndIndex}-${s.baiIndex}`}
                  onClick={() => goTo(i)}
                  aria-label={`Trang ${i + 1}`}
                  className={[
                    "grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full font-display text-sm font-extrabold transition",
                    isActive
                      ? [color.bg, "scale-110 text-white", color.bevel].join(" ")
                      : isDone
                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                        : "bg-white text-muted-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  {isDone && !isActive ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-none border-2 border-black/10 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] sm:rounded-3xl">

          {/* Card header strip */}
          <div className="flex shrink-0 flex-wrap items-center gap-2 bg-amber-50 px-4 py-2">
            <span className={["shrink-0 rounded-full px-3 py-1 font-display text-xs font-extrabold text-white sm:text-sm", color.bg].join(" ")}>
              Bài {slideIndex + 1}
            </span>
            {currentNoiDung?.title && (
              <>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                <span className="truncate text-sm font-bold text-sky-600">{currentNoiDung.title}</span>
              </>
            )}
            {/* Mobile step indicator */}
            <span className="ml-auto shrink-0 text-xs font-extrabold text-muted-foreground sm:hidden">
              {slideIndex + 1}/{total}
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white p-3 sm:overflow-hidden sm:p-4">

            <div
              key={`${currentNoiDung?.id}-${currentSlide?.baiIndex}`}
              className={[
                "flex min-h-0 flex-1 flex-col justify-center-safe transition-all duration-200 ease-out",
                fading ? "-translate-y-1.5 opacity-0" : "translate-y-0 opacity-100",
              ].join(" ")}
            >
              {bai ? (() => {
                const hasAudio = !!bai.audioUrl;
                const hasVideo = !!bai.meta?.video_url;
                const hasEmbed = !!bai.meta?.link;
                const hinhs = bai.hinhs;
                const isSingle = hinhs.length === 1;
                return (
                  <article className="flex flex-col gap-2 sm:min-h-0 sm:flex-1">
                    <div className="flex shrink-0 items-start gap-3">
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
                      <div className="-mx-3 aspect-video w-auto overflow-hidden rounded-none ring-1 ring-border/60 sm:mx-0 sm:aspect-auto sm:min-h-0 sm:w-full sm:flex-1 sm:rounded-xl">
                        <iframe
                          src={bai.meta!.link!}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : !hasVideo && hinhs.length > 0 && (
                      <div
                        className={[
                          "-mx-3 sm:mx-0 sm:min-h-0 sm:flex-1",
                          isSingle
                            ? "flex flex-col justify-center gap-4 sm:flex-row sm:items-stretch"
                            // Many images at once now stack in the (scrollable) card on mobile
                            // instead of their own nested scroll box, reverting to the
                            // fixed-height 2-column grid at sm+ where there's more room.
                            : "grid grid-cols-1 gap-4 sm:grid-cols-2",
                        ].join(" ")}
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

                    {hasVideo && (
                      <div className="-mx-3 sm:mx-0 sm:min-h-0 sm:flex-1">
                        <VideoEmbed url={bai.meta!.video_url!} />
                      </div>
                    )}
                  </article>
                );
              })() : (
                <p className="text-center text-sm text-muted-foreground">
                  Nội dung đang được cập nhật.
                </p>
              )}
            </div>

          </div>

          {/* Bottom nav — three equal thirds spanning the card's full width */}
          <div className="flex shrink-0 divide-x divide-border/60 border-t border-border/60 bg-white">
            <button
              onClick={() => goTo(slideIndex - 1)}
              disabled={!canPrev}
              className={[
                "flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-bold text-navy transition",
                canPrev ? "cursor-pointer hover:bg-muted" : "cursor-not-allowed opacity-40",
              ].join(" ")}
            >
              <ChevronLeft className="h-4 w-4" />
              Bài trước
            </button>

            <div className="relative flex-1">
              {isLastSlide && (
                <>
                  {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}
                  <button
                    onClick={handleComplete}
                    disabled={isCompleted}
                    className={[
                      "relative flex h-full w-full items-center justify-center gap-1.5 overflow-hidden text-sm font-bold transition-[transform,border-color] ease-bounce",
                      isCompleted
                        ? "cursor-not-allowed bg-green-100 text-green-600"
                        : "cursor-pointer border-b-4 border-emerald-700 bg-green text-white hover:brightness-110 active:translate-y-1 active:border-b-0",
                    ].join(" ")}
                  >
                    {!isCompleted && (
                      <span className="pointer-events-none absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    )}
                    <Check className="h-4 w-4" strokeWidth={3} />
                    {isCompleted ? "Đã hoàn thành" : "Hoàn thành"}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => goTo(slideIndex + 1)}
              disabled={!canNext}
              className={[
                "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-bold transition",
                canNext ? "cursor-pointer text-navy hover:bg-muted" : "cursor-not-allowed text-muted-foreground opacity-40",
              ].join(" ")}
            >
              Bài kế tiếp
              <span
                className={[
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full",
                  canNext ? color.bg : "bg-muted-foreground/20",
                ].join(" ")}
              >
                <ChevronRight className={["h-4 w-4", canNext ? "text-white" : "text-muted-foreground"].join(" ")} strokeWidth={3} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Back-to-map button — desktop only (pinned to the viewport edge, not the centered
          column); mobile uses the inline bar above the card instead. */}
      <BackToMapButton
        color={color}
        topicIndex={topicIndex}
        className="fixed bottom-4 left-4 z-20 hidden h-16 items-center gap-1 rounded-full px-4 transition-[transform,box-shadow,filter] ease-bounce hover:brightness-95 active:translate-y-[2px] sm:flex"
        arrowClassName="h-7 w-7 shrink-0"
        iconClassName="h-12 w-12 shrink-0 object-contain"
      />

      {/* "Next lesson" prompt — slides in from the right after completing a chặng. Raised
          clear of the card's own footer buttons on mobile (no dedicated slot for this one,
          since it's transient/dismissible rather than a persistent nav element). */}
      {showNextPrompt && nextChang && (
        <div className="fixed bottom-16 right-2 z-20 max-w-[calc(100vw-1rem)] animate-in slide-in-from-right fade-in duration-300 sm:bottom-4 sm:right-4">
          <div className="relative flex items-stretch overflow-hidden rounded-3xl border-2 border-black/10 bg-white shadow-[0_4px_0_0_rgba(0,0,0,0.12)]">
            <button
              onClick={() => setShowNextPrompt(false)}
              aria-label="Đóng"
              className="absolute right-1.5 top-1.5 grid h-6 w-6 cursor-pointer place-items-center rounded-full text-muted-foreground transition hover:bg-muted"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
            <button
              onClick={goToNextChang}
              className="flex cursor-pointer items-center gap-2 py-2.5 pl-3 pr-7 text-left transition hover:brightness-105 sm:gap-3 sm:py-3 sm:pl-4 sm:pr-8"
            >
              <span
                className={["grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-xl sm:h-12 sm:w-12 sm:text-2xl", nextColor.bg].join(" ")}
              >
                {nextChang.emoji}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                  Bài kế tiếp
                </span>
                <span className="block truncate font-display text-sm font-extrabold text-navy">
                  {nextChang.title}
                </span>
              </span>
              <ChevronRight className={["h-5 w-5 shrink-0", nextColor.text].join(" ")} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
