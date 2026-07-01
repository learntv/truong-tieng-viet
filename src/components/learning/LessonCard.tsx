import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones } from "lucide-react";
import type { Chang, Hinh } from "@/lib/learning";
import { STAGE_COLORS } from "./StageCard";
import { ConfettiBurst } from "./ConfettiBurst";

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

/**
 * Inline blog-post style lesson content. Renders a single noidung as a
 * scrollable article. Parent controls navigation between noidungs / stages.
 */
export function LessonCard({
  chang,
  changIndex,
  noiDungIndex,
  isCompleted,
  isLastNoiDungOfLastChang,
  onComplete,
}: {
  chang: Chang;
  changIndex: number;
  noiDungIndex: number;
  isCompleted: boolean;
  isLastNoiDungOfLastChang?: boolean;
  onComplete: () => void;
}) {
  const noiDungs = chang.noiDungs;
  const total = noiDungs.length;
  const nd = noiDungs[noiDungIndex];
  const color = STAGE_COLORS[changIndex % STAGE_COLORS.length];
  const [showConfetti, setShowConfetti] = useState(false);
  const isLastNoiDung = noiDungIndex === total - 1;

  /* Cancel TTS and audio when switching noidung/chang */
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      document.querySelectorAll("audio").forEach((el) => el.pause());
    };
  }, [noiDungIndex, changIndex]);

  const handleComplete = () => {
    if (isCompleted) return;
    setShowConfetti(true);
    onComplete();
  };

  if (!nd) {
    return (
      <div className="rounded-3xl bg-card p-8 text-center text-sm text-muted-foreground shadow-card">
        Chặng này chưa có nội dung.
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-3xl bg-card shadow-card">
      {/* Header with stage info */}
      <header className={["px-6 py-5 sm:px-10 sm:py-6", color.gradient].join(" ")}>
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{chang.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-wider text-white/75">
              Chặng {changIndex + 1} · Trang {noiDungIndex + 1}/{total}
            </p>
            <h2 className="truncate font-display text-xl font-extrabold text-white sm:text-2xl">
              {chang.title}
            </h2>
          </div>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-500 ease-out"
            style={{ width: total > 0 ? `${((noiDungIndex + 1) / total) * 100}%` : "0%" }}
          />
        </div>
      </header>

      {/* Blog-style body */}
      <div className="px-5 py-8 sm:px-10 sm:py-10">
        {nd.title && (
          <div className={["mb-8 rounded-2xl px-5 py-4 text-center shadow-card", color.gradient].join(" ")}>
            <p className="font-display text-xl font-extrabold text-white sm:text-2xl">
              {nd.title}
            </p>
          </div>
        )}

        <div className="mx-auto flex max-w-3xl flex-col gap-8 divide-y divide-border/60">
          {nd.bais.map((bai, li) => {
            const hasAudio = !!bai.audioUrl;
            const hasVideo = !!bai.meta?.video_url;
            const hasEmbed = !!bai.meta?.embed;
            const hinhs = bai.hinhs;
            const isSingle = hinhs.length === 1;
            return (
              <section key={bai.id} className={li > 0 ? "pt-8" : ""}>
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
                      src={bai.meta!.embed!}
                      className="h-64 w-full sm:h-80"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : hinhs.length > 0 && (
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
                          colorIndex={changIndex + li}
                        />
                      );
                    })}
                  </div>
                )}

                {hasVideo && <VideoEmbed url={bai.meta!.video_url!} />}
              </section>
            );
          })}

          {nd.bais.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Nội dung đang được cập nhật.
            </p>
          )}
        </div>

        {/* Complete stage button on last noidung */}
        {isLastNoiDung && !isLastNoiDungOfLastChang && (
          <div className="relative mt-10 flex justify-center">
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
              {isCompleted ? "Đã hoàn thành ✓" : "Hoàn thành chặng 🎉"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
