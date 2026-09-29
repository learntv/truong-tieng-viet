import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Headphones,
  Image as ImageIcon,
  Link2,
  Menu,
  PenLine,
  Play,
  SearchX,
  X,
} from "lucide-react";
import { Link, useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import { useLearningContent } from "@/hooks/useLearningContent";
import { useSingletonAudio } from "@/hooks/useSingletonAudio";
import type { Bai, Hinh, NoiDung, QuyenNumber } from "@/lib/learning";
import { chuDesOfQuyen } from "@/lib/learning";
import { joinForSpeech, ttsSrc } from "@/lib/tts/text";
import { STAGE_COLORS } from "./stageColors";
import { ConfettiBurst } from "./ConfettiBurst";
import { ImageHighlightOverlay } from "./ImageHighlightOverlay";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/page-loader";
import mapPinIcon from "@/assets/map-pin-icon.png";

type StageColor = (typeof STAGE_COLORS)[number];

const STAGE_TONES = ["stage-1", "stage-2", "stage-3", "stage-4", "stage-5"] as const;

// Shared by the mobile inline bar and the desktop fixed pill (see their call sites below) —
// only sizing/positioning differs between the two, passed in via className.
function BackToMapButton({
  color,
  quyenNumber,
  topicIndex,
  className,
  arrowClassName,
  iconClassName,
}: {
  color: StageColor;
  quyenNumber: QuyenNumber;
  topicIndex: number;
  className: string;
  arrowClassName: string;
  iconClassName: string;
}) {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <Link
      to="/hoc-tap/quyen-{$quyenNumber}/chu-de-{$chuDeIndex}"
      params={{ quyenNumber: String(quyenNumber), chuDeIndex: String(topicIndex + 1) }}
      // The child almost always arrives here from the map, so the map is already sitting
      // one step back in history. Pop that entry rather than pushing (or replacing with)
      // another chủ đề entry — otherwise the browser's own back button either re-enters
      // the chặng or lands on a duplicate map entry that looks like nothing happened.
      // Kept as a real <Link> so the href, middle-click and right-click still work; only
      // the plain left-click is intercepted, and direct-load (no history) falls through.
      onClick={(e) => {
        if (!canGoBack) return;
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        )
          return;
        e.preventDefault();
        router.history.back();
      }}
      aria-label="Quay lại bản đồ"
      className={[className, color.bgSoft].join(" ")}
    >
      <ArrowLeft className={[arrowClassName, color.text].join(" ")} strokeWidth={3} />
      <img src={mapPinIcon} alt="" className={iconClassName} />
    </Link>
  );
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
  const { playing, play, pause, audioRef, onEnded, onPause, onError } = useSingletonAudio(src);
  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onEnded={onEnded}
        onPause={onPause}
        onError={onError}
      />
      <button
        onClick={playing ? pause : play}
        aria-label={playing ? "Dừng" : "Nghe"}
        className={[
          "grid size-10 shrink-0 cursor-pointer place-items-center rounded-full transition-[transform,background-color,color] duration-200 active:scale-90",
          playing
            ? "animate-pulse-ring bg-stage-2 text-white [--ring-color:var(--color-stage-2)]"
            : "bg-stage-2-soft text-stage-2-deep hover:bg-stage-2 hover:text-white",
        ].join(" ")}
      >
        <Headphones className="size-5" strokeWidth={2.25} />
      </button>
    </>
  );
}

function VideoEmbed({ url }: { url: string }) {
  const embedUrl = toYouTubeEmbed(url);
  if (embedUrl) {
    return (
      <div className="flex flex-col gap-1.5 sm:h-full">
        <div className="aspect-video w-full overflow-hidden rounded-none bg-ink-900 sm:aspect-auto sm:min-h-0 sm:flex-1 sm:rounded-2xl">
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
          className="inline-flex shrink-0 items-center gap-1 self-start px-3 text-caption font-medium text-brand-600 hover:underline sm:px-0"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Video không phát được? Mở trên YouTube
        </a>
      </div>
    );
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-none bg-ink-900 sm:aspect-auto sm:h-full sm:rounded-2xl">
      <video src={url} controls className="h-full w-full object-contain" />
    </div>
  );
}

function CloudWord({ text, color }: { text: string; color: StageColor }) {
  const { playing, play, audioRef, src, onEnded, onPause, onError } = useSingletonAudio(
    ttsSrc(text),
  );
  return (
    <>
      {/* Same content-addressed /api/tts pipeline as AudioButton — if this exact word's audio
          was already generated (e.g. as another bài's text, or by a previous click anywhere
          in the app), R2 already has it and this is a cache hit; only genuinely new text
          triggers synthesis. preload="none" so idle word clouds don't fetch audio no one asked for. */}
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onEnded={onEnded}
        onPause={onPause}
        onError={onError}
      />
      <button
        onClick={play}
        aria-label={`Nghe đọc: ${text}`}
        className={[
          "relative cursor-pointer overflow-hidden rounded-full px-4 py-2 text-lg leading-tight font-semibold transition-[transform,box-shadow,background-color,color] duration-200 ease-out hover:-translate-y-0.5 active:scale-95",
          playing
            ? ["text-white", color.bg, color.bevel].join(" ")
            : [color.bgSoft, color.text, "shadow-xs hover:shadow-sm"].join(" "),
        ].join(" ")}
      >
        {playing && (
          <span className="pointer-events-none absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        )}
        {text}
      </button>
    </>
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
              !isLoaded ? "min-h-48 animate-pulse bg-ink-50 sm:min-h-64" : "",
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
                  "w-full max-w-full rounded-none object-contain transition-opacity duration-300 sm:h-full sm:max-h-full sm:rounded-2xl",
                  isLoaded ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
              {hasHighlights && isLoaded && <ImageHighlightOverlay targets={highlightTargets} />}
            </div>
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 place-items-center rounded-none bg-ink-50 text-sm text-ink-500 sm:rounded-2xl">
            (Không tải được hình)
          </div>
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

// Khan-style content-item icon: what kind of thing this slide is, at a glance.
function slideIcon(slide: Slide) {
  if (slide.bai?.meta?.video_url) return Play;
  if (slide.bai?.meta?.link) return Link2;
  if (slide.bai?.hinhs.some((h) => h.url)) return ImageIcon;
  return PenLine;
}

function slideLabel(slide: Slide, index: number): string {
  const title = slide.nd.title?.trim();
  const base = title || `Trang ${index + 1}`;
  return slide.baiCount > 1 ? `${base} (${slide.baiIndex + 1}/${slide.baiCount})` : base;
}

/** Back to the map + how far through the chặng the learner is. */
function ChangProgressHeader({
  color,
  quyenNumber,
  chuDeIndex,
  slideIndex,
  total,
  isCompleted,
  className,
}: {
  color: StageColor;
  quyenNumber: QuyenNumber;
  chuDeIndex: number;
  slideIndex: number;
  total: number;
  isCompleted: boolean;
  className: string;
}) {
  return (
    <div className={["shrink-0 items-center gap-3 p-3", className].join(" ")}>
      <BackToMapButton
        color={color}
        quyenNumber={quyenNumber}
        topicIndex={chuDeIndex}
        className="flex size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200 hover:-translate-x-0.5 active:scale-95"
        arrowClassName="h-5 w-5 shrink-0"
        iconClassName="hidden"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-caption font-bold tracking-wide text-ink-500 uppercase">
            {isCompleted ? "Đã hoàn thành" : "Tiến độ chặng"}
          </span>
          <span className="shrink-0 text-sm font-bold text-ink-800 tabular-nums">
            {slideIndex + 1}/{total}
          </span>
        </div>
        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
          <div
            className={[
              "h-full rounded-full transition-[width] duration-500 ease-out",
              color.gradient,
            ].join(" ")}
            style={{ width: `${total > 0 ? ((slideIndex + 1) / total) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/** Left rail: the chặng's content items, the way Khan lists a lesson's videos/exercises. */
function LessonSidebar({
  chuDe,
  quyenNumber,
  chuDeIndex,
  chang,
  changIndex,
  changCount,
  slides,
  slideIndex,
  furthestIndex,
  isCompleted,
  color,
  prevChang,
  nextChang,
  onSelect,
  onGoChang,
}: {
  chuDe: { title: string; emoji: string };
  quyenNumber: QuyenNumber;
  chuDeIndex: number;
  chang: { title: string; emoji: string };
  changCount: number;
  changIndex: number;
  slides: Slide[];
  slideIndex: number;
  /** Furthest slide actually reached — everything before it counts as read. */
  furthestIndex: number;
  isCompleted: boolean;
  color: StageColor;
  prevChang: { id: string } | null;
  nextChang: { id: string } | null;
  onSelect: (i: number) => void;
  onGoChang: (id: string) => void;
}) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  // Keep the current item in view when arriving mid-lesson or jumping with the footer nav.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [slideIndex]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-none bg-white lg:rounded-3xl lg:border lg:border-ink-100 lg:shadow-sm">
      {/* Desktop only: on mobile this same bar is pinned at the top of the page, outside
          the drawer, so the way back and the progress stay visible without opening it. */}
      <ChangProgressHeader
        color={color}
        quyenNumber={quyenNumber}
        chuDeIndex={chuDeIndex}
        slideIndex={slideIndex}
        total={slides.length}
        isCompleted={isCompleted}
        className="hidden lg:flex"
      />

      {/* Breadcrumb + chặng stepper */}
      <div className="shrink-0 border-b border-ink-100 px-3 py-3">
        {/* Quyển › Chủ đề, each crumb its own link. */}
        <nav
          aria-label="Đường dẫn"
          className="flex items-center justify-center gap-1 text-caption font-bold tracking-wide uppercase"
        >
          <Link
            to="/hoc-tap/quyen-{$quyenNumber}"
            params={{ quyenNumber: String(quyenNumber) }}
            className={["shrink-0 hover:underline", color.text].join(" ")}
          >
            Quyển {quyenNumber}
          </Link>
          <ChevronRight className="size-3 shrink-0 text-ink-300" strokeWidth={3} />
          <Link
            to="/hoc-tap/quyen-{$quyenNumber}/chu-de-{$chuDeIndex}"
            params={{ quyenNumber: String(quyenNumber), chuDeIndex: String(chuDeIndex + 1) }}
            className={["min-w-0 truncate hover:underline", color.text].join(" ")}
          >
            {chuDe.title}
          </Link>
        </nav>
        <div className="mt-1 flex items-center gap-1">
          <button
            onClick={() => prevChang && onGoChang(prevChang.id)}
            disabled={!prevChang}
            aria-label="Chặng trước"
            className={[
              "grid size-9 shrink-0 place-items-center rounded-full text-ink-700 transition-colors",
              prevChang ? "cursor-pointer hover:bg-ink-50" : "cursor-not-allowed opacity-30",
            ].join(" ")}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={3} />
          </button>
          <p className="min-w-0 flex-1 truncate text-center text-sm font-bold text-ink-900">
            Chặng {changIndex + 1}/{changCount}: {chang.title}
          </p>
          <button
            onClick={() => nextChang && onGoChang(nextChang.id)}
            disabled={!nextChang}
            aria-label="Chặng kế tiếp"
            className={[
              "grid size-9 shrink-0 place-items-center rounded-full text-ink-700 transition-colors",
              nextChang ? "cursor-pointer hover:bg-ink-50" : "cursor-not-allowed opacity-30",
            ].join(" ")}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Content items */}
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {slides.map((s, i) => {
          const Icon = slideIcon(s);
          const isActive = i === slideIndex;
          // Read = behind the furthest point reached, not merely behind the open slide —
          // paging back must not un-learn the pages already gone through.
          const isDone = isCompleted || i < furthestIndex;
          return (
            <button
              key={`${s.ndIndex}-${s.baiIndex}`}
              ref={isActive ? activeRef : undefined}
              onClick={() => onSelect(i)}
              className={[
                "flex w-full cursor-pointer items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition-colors duration-150",
                isActive ? color.bgSoft : "hover:bg-ink-25",
              ].join(" ")}
            >
              {/* The item keeps its own kind icon once done — the tick is a small badge
                  pinned to the tile's corner, not a replacement for it. */}
              <span className="relative shrink-0">
                <span
                  className={[
                    "grid size-9 place-items-center rounded-xl",
                    isActive
                      ? [color.bg, "text-white shadow-sm"].join(" ")
                      : isDone
                        ? "bg-stage-1-soft text-stage-1-deep"
                        : "bg-ink-50 text-ink-400",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.5} />
                </span>
                {isDone && (
                  <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-stage-1 text-white ring-2 ring-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={4} />
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={[
                    "block truncate text-sm font-semibold",
                    isActive ? color.text : "text-ink-800",
                  ].join(" ")}
                >
                  {slideLabel(s, i)}
                </span>
                <span className="block truncate text-caption text-ink-500">
                  {isActive ? "Đang học" : isDone ? "Đã học" : "Chưa học"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LessonPage({
  quyenNumber,
  changId,
}: {
  quyenNumber: QuyenNumber;
  changId: string;
}) {
  const { data, isLoading, error } = useLearningContent();
  const navigate = useNavigate();
  const {
    authIsLoading,
    activeProgressMap,
    isProgressLoading,
    markChangComplete,
    saveChangPosition,
  } = useLearningProgress();

  // Scoped to this quyển: chủ đề are numbered from 1 inside each book, so `topicIndex` — which
  // is what the links back to the map are built from — has to be an index within the quyển in
  // the URL, not into the whole tree.
  const found = useMemo(() => {
    if (!data) return null;
    const chuDes = chuDesOfQuyen(data, quyenNumber);
    for (let topicIndex = 0; topicIndex < chuDes.length; topicIndex++) {
      const topic = chuDes[topicIndex];
      const changIndex = topic.changs.findIndex((c) => c.id === changId);
      if (changIndex !== -1) {
        return {
          chuDe: topic.chuDe,
          changs: topic.changs,
          chang: topic.changs[changIndex],
          changIndex,
          topicIndex,
        };
      }
    }
    return null;
  }, [data, changId, quyenNumber]);

  const savedNoiDungIndex = found ? (activeProgressMap.get(found.chang.id)?.noiDungIndex ?? 0) : 0;
  const isCompleted = found ? !!activeProgressMap.get(found.chang.id)?.isCompleted : false;

  const slides = useMemo(() => (found ? buildSlides(found.chang.noiDungs) : []), [found]);

  const [slideIndex, setSlideIndex] = useState(0);
  // High-water mark of how far into the chặng the learner has actually got. Everything
  // behind it is read; everything from it on is not. Seeded from the saved position on
  // entry and only ever moves forward, so paging backwards doesn't reset the rail's
  // "đã học" marks. (The stored progress row keeps a single noidung_index rather than a
  // per-slide set, so this is the finest resolution available without a schema change.)
  const [furthestIndex, setFurthestIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showNextPrompt, setShowNextPrompt] = useState(false);

  // Content rail: pinned open on desktop (collapsible via the divider handle), and an
  // overlay drawer on mobile where there's no room for it beside the lesson card.
  const [railOpen, setRailOpen] = useState(true);
  const [mobileRailOpen, setMobileRailOpen] = useState(false);

  // Picking an item on mobile closes the drawer, so it never covers the slide it opened.
  useEffect(() => {
    setMobileRailOpen(false);
  }, [slideIndex, changId]);

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
      setFurthestIndex(slides.length - 1);
      return;
    }
    const firstOfStep = slides.findIndex((s) => s.ndIndex === savedNoiDungIndex);
    const start = firstOfStep !== -1 ? firstOfStep : 0;
    setSlideIndex(start);
    setFurthestIndex(start);
  }, [changId, found, slides, isCompleted, savedNoiDungIndex]);

  // Walk the water mark forward with the learner; never backwards. The changId guard skips
  // the pass right after a lesson switch, where `slideIndex` is still the previous lesson's
  // (higher) value and would otherwise carry that reach over into the new chặng.
  const markedChangIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (markedChangIdRef.current !== changId) {
      markedChangIdRef.current = changId;
      return;
    }
    setFurthestIndex((f) => Math.max(f, slideIndex));
  }, [slideIndex, changId]);

  useEffect(
    () => () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    },
    [],
  );

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

  // Stop any playing audio on step change / unmount
  useEffect(() => {
    return () => {
      document.querySelectorAll("audio").forEach((el) => el.pause());
    };
  }, [slideIndex, changId]);

  // Save reading position as the user moves through steps (skip if already completed)
  const isFirstPositionSave = useRef(true);
  useEffect(() => {
    if (isFirstPositionSave.current) {
      isFirstPositionSave.current = false;
      return;
    }
    if (!found || isCompleted) return;
    const ndIndex = slides[slideIndex]?.ndIndex ?? 0;
    saveChangPosition(found.chang.id, ndIndex, isCompleted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIndex]);

  if (isLoading || authIsLoading || isProgressLoading) {
    return (
      <div className="flex h-dvh w-full bg-ink-25">
        <PageLoader label="Đang mở bài học" />
      </div>
    );
  }

  if (error || !found) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-ink-25 px-4">
        <EmptyState
          icon={SearchX}
          className="w-full max-w-lg bg-white"
          title="Không tìm thấy bài học"
          description="Chặng học này không tồn tại hoặc đã bị xóa."
          action={
            <Button asChild>
              <Link
                to="/hoc-tap/quyen-{$quyenNumber}"
                params={{ quyenNumber: String(quyenNumber) }}
              >
                <ArrowLeft aria-hidden />
                Quay lại lộ trình
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  const { chuDe, changs, chang, changIndex, topicIndex } = found;
  const total = slides.length;
  const currentSlide = slides[slideIndex];
  const currentNoiDung = currentSlide?.nd;
  const bai = currentSlide?.bai ?? null;
  // Some bài carry only instruction text ("nhìn lại hình ở trang trước") without images of
  // their own. When a bài has nothing visual to show, fall back to the most recent previous
  // slide's images so the learner still sees what the text refers to.
  const fallbackHinhs = (() => {
    for (let i = slideIndex - 1; i >= 0; i--) {
      const prev = slides[i]?.bai;
      if (prev && !prev.meta?.video_url && !prev.meta?.link) {
        const imgs = prev.hinhs.filter((h) => h.url);
        if (imgs.length > 0) return imgs;
      }
    }
    return [];
  })();
  const hasSpeakableText = !!bai && bai.texts.some((t) => t.trim().length > 0);
  // A manually-curated narration takes priority over TTS (skip synthesis entirely when
  // someone already recorded/uploaded real audio for this bài), and — same as before TTS
  // existed — its presence is also what hides the per-word cloud below: a full narration
  // already reads everything, so the individual tap-to-hear captions would be redundant.
  // TTS-fallback audio is NOT curated narration, so it must NOT suppress the word cloud
  // the same way.
  const manualAudioUrl = bai?.meta?.audio_url || undefined;
  const color = STAGE_COLORS[changIndex % STAGE_COLORS.length];
  const canPrev = slideIndex > 0;
  const canNext = slideIndex < total - 1;
  const isLastSlide = slideIndex === total - 1;
  const nextChang = changs[changIndex + 1] ?? null;
  const prevChang = changs[changIndex - 1] ?? null;
  const nextColor = STAGE_COLORS[(changIndex + 1) % STAGE_COLORS.length];

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(total - 1, i));
    if (clamped === slideIndex || fading) return;

    document.querySelectorAll("audio").forEach((el) => el.pause());

    setFading(true);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => {
      setSlideIndex(clamped);
      requestAnimationFrame(() => setFading(false));
    }, 160);
  };
  const handleComplete = async () => {
    if (isCompleted) return;
    const ok = await markChangComplete(chang.id, currentSlide?.ndIndex ?? 0);
    setShowConfetti(true);
    if (ok) {
      toast.success(`Chặng ${changIndex + 1} hoàn thành! 🎉`, {
        description: "Tiếp tục giỏi nhé!",
        duration: 3000,
      });
    }
    if (nextChang) setShowNextPrompt(true);
  };

  // Same replace-not-push reasoning as goToNextChang below — the sidebar stepper hops
  // between chặng of the same chủ đề, so the map must stay exactly one entry back.
  const goToChang = (id: string) => {
    setShowNextPrompt(false);
    navigate({
      to: "/hoc-tap/quyen-{$quyenNumber}/$changId",
      params: { quyenNumber: String(quyenNumber), changId: id },
      replace: true,
    });
  };

  const goToNextChang = () => {
    if (!nextChang) return;
    setShowNextPrompt(false);
    // Replace (not push) so the history stack stays flat across consecutive "next lesson"
    // clicks — otherwise each click stacks another chặng entry between the map and the
    // current page, and BackToMapButton's router.history.back() (which assumes the map is
    // always exactly one entry back) lands on the previous chặng instead of the map.
    navigate({
      to: "/hoc-tap/quyen-{$quyenNumber}/$changId",
      params: { quyenNumber: String(quyenNumber), changId: nextChang.id },
      replace: true,
    });
  };

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-ink-25">
      {/* Mobile drawer for the rail. It lives at the page root, not inside the two-pane
          row: the row is its own stacking context (z-10), so a drawer nested in there
          could never rise above the z-20 progress bar below, however high its own z. */}
      {mobileRailOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-[3px] animate-in fade-in"
            onClick={() => setMobileRailOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-hidden rounded-r-3xl shadow-xl animate-in slide-in-from-left duration-200">
            <LessonSidebar
              chuDe={chuDe}
              quyenNumber={quyenNumber}
              chuDeIndex={topicIndex}
              chang={chang}
              changIndex={changIndex}
              changCount={changs.length}
              slides={slides}
              slideIndex={slideIndex}
              furthestIndex={furthestIndex}
              isCompleted={isCompleted}
              color={color}
              prevChang={prevChang}
              nextChang={nextChang}
              onSelect={goTo}
              onGoChang={goToChang}
            />
          </div>
        </div>
      )}

      {/* Mobile: the rail is a drawer, so its back button and progress bar are pinned here
          at the top of the page instead, where they're visible without opening it. */}
      <ChangProgressHeader
        color={color}
        quyenNumber={quyenNumber}
        chuDeIndex={topicIndex}
        slideIndex={slideIndex}
        total={total}
        isCompleted={isCompleted}
        className="z-20 flex border-b border-ink-100 bg-white lg:hidden"
      />

      {/* No padding on the row itself: any vertical padding here would also shorten the
          lesson pane, which has to run flush from the strip to the bottom of the window.
          The breathing room around the rail card lives on the rail alone. */}
      <div className="relative z-10 mx-auto flex w-full min-h-0 max-w-[90rem] flex-1 items-stretch gap-0 p-0 lg:gap-4 lg:p-4">
        {/* Left rail: the chặng's content items (desktop, collapsible) */}
        <aside
          className={[
            "hidden shrink-0 transition-[width] duration-300 ease-out lg:block",
            railOpen ? "w-96 xl:w-104" : "w-0 overflow-hidden",
          ].join(" ")}
        >
          <LessonSidebar
            chuDe={chuDe}
            quyenNumber={quyenNumber}
            chuDeIndex={topicIndex}
            chang={chang}
            changIndex={changIndex}
            changCount={changs.length}
            slides={slides}
            slideIndex={slideIndex}
            furthestIndex={furthestIndex}
            isCompleted={isCompleted}
            color={color}
            prevChang={prevChang}
            nextChang={nextChang}
            onSelect={goTo}
            onGoChang={goToChang}
          />
        </aside>

        {/* Main content */}
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white lg:rounded-3xl lg:border lg:border-ink-100 lg:shadow-sm">
          {/* Collapse handle: an oval tab riding the lesson panel's own left edge. */}
          <button
            onClick={() => setRailOpen((v) => !v)}
            aria-label={railOpen ? "Ẩn danh sách bài" : "Hiện danh sách bài"}
            // Flush D-tab: square against the panel's own left edge (no radius, no border
            // there), rounded only on the side that pokes into the content.
            className="absolute top-1/2 left-0 z-20 hidden h-12 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-r-full border border-l-0 border-ink-100 bg-white text-ink-600 shadow-sm transition-colors hover:bg-ink-50 hover:text-ink-900 lg:grid"
          >
            {railOpen ? (
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            )}
          </button>

          {/* Lesson header strip: slide number, nội dung title, and the bài instruction
              text with its audio button — plus the rail toggle while the rail is a drawer
              (the way back to the map lives inside that drawer). */}
          <div className="flex shrink-0 items-center gap-3 border-b border-ink-100 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4">
            <button
              onClick={() => setMobileRailOpen(true)}
              aria-label="Danh sách bài"
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink-700 transition-colors hover:bg-ink-50 lg:hidden"
            >
              <Menu className="h-4 w-4" strokeWidth={2.5} />
            </button>

            <span
              className={[
                "grid size-8 shrink-0 place-items-center rounded-xl text-sm font-extrabold text-white sm:size-9",
                color.bg,
              ].join(" ")}
            >
              {slideIndex + 1}
            </span>
            {/* Text and its audio button are one wrapping flex line, so the button hugs the
                end of the text instead of being flung to the row's far edge — and when the
                text takes the full width the button drops flush to the left, not indented. */}
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
              <div className="min-w-0">
                {bai?.texts.map((t, i) => (
                  <p
                    key={i}
                    className="text-[0.9375rem] leading-snug font-semibold whitespace-pre-line text-ink-900 sm:text-lg"
                  >
                    {currentNoiDung?.title && i === 0 && (
                      <span className="mr-1 inline-flex items-center gap-1 align-middle font-semibold text-stage-2-deep">
                        {currentNoiDung.title}
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      </span>
                    )}
                    {t}
                  </p>
                ))}
              </div>
              {hasSpeakableText && (
                <AudioButton src={manualAudioUrl ?? ttsSrc(joinForSpeech(bai.texts))} />
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3 sm:overflow-hidden sm:px-8 sm:py-5">
            <div
              key={`${currentNoiDung?.id}-${currentSlide?.baiIndex}`}
              className={[
                "flex min-h-0 flex-1 flex-col justify-center-safe transition-all duration-200 ease-out",
                fading ? "-translate-y-1.5 opacity-0" : "translate-y-0 opacity-100",
              ].join(" ")}
            >
              {bai ? (
                (() => {
                  const hasVideo = !!bai.meta?.video_url;
                  const hasEmbed = !!bai.meta?.link;
                  // A bài "has its own image" only if some hình actually carries a URL — many
                  // bài hold caption-only hình (words to learn) whose text says "nhìn lại hình
                  // ở trang trước". When there's no image of our own (and no video/embed), borrow
                  // the nearest previous slide's image and keep our own caption words beside it.
                  const hasOwnImage = bai.hinhs.some((h) => h.url);
                  const useFallback =
                    !hasVideo && !hasEmbed && !hasOwnImage && fallbackHinhs.length > 0;
                  const ownCaptions = bai.hinhs.flatMap((h) => h.captions);
                  const hinhs = useFallback
                    ? fallbackHinhs.map((h, i) => ({ ...h, captions: i === 0 ? ownCaptions : [] }))
                    : bai.hinhs;
                  const isSingle = hinhs.length === 1;
                  return (
                    <article className="flex flex-col gap-2 sm:min-h-0 sm:flex-1">
                      {hasEmbed ? (
                        <div className="-mx-3 aspect-video w-auto overflow-hidden rounded-none bg-ink-50 sm:mx-0 sm:aspect-auto sm:min-h-0 sm:w-full sm:flex-1 sm:rounded-2xl">
                          <iframe
                            src={bai.meta!.link!}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        !hasVideo &&
                        hinhs.length > 0 && (
                          <div
                            className={[
                              "-mx-3 sm:mx-0 sm:min-h-0 sm:flex-1",
                              isSingle
                                ? "flex flex-col justify-center gap-4 sm:flex-row sm:items-stretch"
                                : // Many images at once now stack in the (scrollable) card on mobile
                                  // instead of their own nested scroll box, reverting to the
                                  // fixed-height 2-column grid at sm+ where there's more room.
                                  "grid grid-cols-1 gap-4 sm:grid-cols-2",
                            ].join(" ")}
                          >
                            {hinhs.map((hinh) => {
                              const captions =
                                manualAudioUrl || hasVideo
                                  ? []
                                  : hinh.captions.filter((c) => c.trim().length > 1);
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
                        )
                      )}

                      {hasVideo && (
                        <div className="-mx-3 sm:mx-0 sm:min-h-0 sm:flex-1">
                          <VideoEmbed url={bai.meta!.video_url!} />
                        </div>
                      )}
                    </article>
                  );
                })()
              ) : (
                <p className="text-center text-sm text-ink-500">Nội dung đang được cập nhật.</p>
              )}
            </div>
          </div>

          {/* Action bar — back on the left, where we are in the middle, the one primary
              action (tiếp tục / hoàn thành) on the right. */}
          <div className="relative flex shrink-0 items-center gap-2 border-t border-ink-100 bg-white px-3 py-3 sm:gap-4 sm:px-6">
            <Button
              variant="outline"
              onClick={() => goTo(slideIndex - 1)}
              disabled={!canPrev}
              aria-label="Bài trước"
              className="px-3 sm:px-5"
            >
              <ChevronLeft aria-hidden />
              <span className="hidden sm:inline">Bài trước</span>
            </Button>

            <div className="flex min-w-0 flex-1 items-center justify-center">
              <span className="truncate text-sm font-semibold text-ink-600 tabular-nums">
                Trang {slideIndex + 1} / {total}
              </span>
            </div>

            {isLastSlide ? (
              <>
                {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}
                {isCompleted ? (
                  <span className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-stage-1-soft px-5 text-[0.9375rem] font-semibold text-stage-1-deep">
                    <Check className="size-4" strokeWidth={3} aria-hidden />
                    Đã hoàn thành
                  </span>
                ) : (
                  <Button
                    tone="stage-1"
                    onClick={handleComplete}
                    className="overflow-hidden px-6 sm:px-8"
                  >
                    <span className="pointer-events-none absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    <Check strokeWidth={3} aria-hidden />
                    Hoàn thành
                  </Button>
                )}
              </>
            ) : (
              <Button
                tone={STAGE_TONES[changIndex % STAGE_TONES.length]}
                onClick={() => goTo(slideIndex + 1)}
                disabled={!canNext}
                className="px-6 sm:px-8"
              >
                Tiếp tục
                <ChevronRight strokeWidth={3} aria-hidden />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* "Next lesson" prompt — slides in from the right after completing a chặng. Raised
          clear of the card's own footer buttons on mobile (no dedicated slot for this one,
          since it's transient/dismissible rather than a persistent nav element). */}
      {showNextPrompt && nextChang && (
        <div className="fixed right-3 bottom-20 z-20 max-w-[calc(100vw-1.5rem)] animate-in slide-in-from-right fade-in duration-300 sm:right-6 sm:bottom-24">
          <div className="relative flex items-stretch overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-xl">
            <button
              onClick={() => setShowNextPrompt(false)}
              aria-label="Đóng"
              className="absolute top-2 right-2 grid size-7 cursor-pointer place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-800"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
            <button
              onClick={goToNextChang}
              className="flex cursor-pointer items-center gap-3 py-3 pr-10 pl-3 text-left transition-colors hover:bg-ink-25 sm:py-4 sm:pl-4"
            >
              <span
                className={[
                  "grid size-12 shrink-0 place-items-center rounded-2xl text-2xl sm:size-14",
                  nextColor.bgSoft,
                ].join(" ")}
              >
                {nextChang.emoji}
              </span>
              <span className="min-w-0">
                <span className="block text-caption font-bold tracking-wide text-ink-500 uppercase">
                  Bài kế tiếp
                </span>
                <span className="block truncate font-semibold text-ink-900">{nextChang.title}</span>
              </span>
              <ChevronRight
                className={["h-5 w-5 shrink-0", nextColor.text].join(" ")}
                strokeWidth={3}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
