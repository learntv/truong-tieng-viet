import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import type { Chang, Hinh } from "@/lib/learning";
import { STAGE_COLORS } from "./StageNode";

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
}: {
  hinh: Hinh;
  captions: string[];
  isSingle: boolean;
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
              : "flex flex-1 flex-wrap items-center justify-center gap-2 self-center sm:pl-2 pb-2"
          }
        >
          {captions.map((c, ci) => (
            <CloudWord key={ci} text={c} color={STAGE_COLORS[ci % STAGE_COLORS.length]} />
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
  onPrevNoiDung,
  onNextNoiDung,
  onComplete,
  onClose,
}: {
  chang: Chang;
  changIndex: number;
  noiDungIndex: number;
  isCompleted: boolean;
  onPrevNoiDung: () => void;
  onNextNoiDung: () => void;
  onComplete: () => void;
  onClose: () => void;
}) {
  const noiDungs = chang.noiDungs;
  const noiDung = noiDungs[noiDungIndex];
  const canPrev = noiDungIndex > 0;
  const canNext = noiDungIndex < noiDungs.length - 1;
  const isLastNoiDung = noiDungIndex === noiDungs.length - 1;
  const color = STAGE_COLORS[changIndex % STAGE_COLORS.length];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [noiDungIndex, changIndex]);

  return (
    <div className="relative flex h-full w-full items-stretch justify-center">
      <button
        onClick={onPrevNoiDung}
        disabled={!canPrev}
        aria-label="Trước"
        className="absolute left-1 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-card ring-1 ring-border transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30 sm:left-0 sm:h-14 sm:w-14 sm:-translate-x-1/2"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <div
        className={[
          "flex max-h-full w-full flex-col overflow-hidden rounded-none shadow-soft sm:rounded-3xl",
          color.bgSoft,
        ].join(" ")}
      >
        <div
          className={[
            "flex items-center justify-between gap-3 px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-7 sm:pt-4",
            color.gradient,
          ].join(" ")}
        >
          <div className="flex min-w-0 items-center gap-2">
            <Star className="h-5 w-5 shrink-0 fill-yellow-400 text-yellow-400" />
            <h3 className="truncate font-display text-lg font-extrabold text-white sm:text-xl">
              Chặng {changIndex + 1}: {chang.title}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {noiDungs.map((_, i) => (
              <div
                key={i}
                className={[
                  "h-1.5 w-3 rounded-full transition",
                  i <= noiDungIndex ? "bg-white" : "bg-white/30",
                ].join(" ")}
              />
            ))}
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/90 text-stone-600 shadow-card transition hover:scale-105 hover:bg-white"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        {noiDung ? (
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-8"
          >
            {noiDung.title && (
              <div
                className={[
                  "mb-6 rounded-2xl px-5 py-4 text-center shadow-card",
                  color.gradient,
                ].join(" ")}
              >
                <p className="font-display text-xl font-extrabold text-white sm:text-2xl">
                  {noiDung.title}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-6 divide-y divide-border/60">
              {noiDung.bais.map((bai, li) => {
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
                            />
                          );
                        })}
                      </div>
                    )}
                  </article>
                );
              })}

              {noiDung.bais.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  Nội dung đang được cập nhật.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 px-5 py-10 text-center text-sm text-muted-foreground">
            Chặng này chưa có nội dung.
          </div>
        )}

        {isLastNoiDung && (
          <div className="flex items-center justify-center border-t border-border/60 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-5">
            <button
              onClick={onComplete}
              disabled={isCompleted}
              className={[
                "relative flex items-center justify-center gap-2 overflow-hidden rounded-full px-10 py-4 text-lg font-extrabold tracking-wide transition sm:px-12 sm:py-5 sm:text-xl",
                isCompleted
                  ? "cursor-not-allowed bg-green/40 text-navy"
                  : "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-white shadow-glow-green ring-4 ring-white/70 hover:scale-105 active:scale-95",
              ].join(" ")}
            >
              {!isCompleted && (
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine" />
              )}
              <Check className="h-6 w-6 shrink-0" strokeWidth={3} />
              {isCompleted ? "Đã hoàn thành" : "Hoàn thành chặng"}
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onNextNoiDung}
        disabled={!canNext}
        aria-label="Tiếp"
        className={[
          "absolute right-1 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-white shadow-card transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30 sm:right-0 sm:h-14 sm:w-14 sm:translate-x-1/2",
          color.gradient,
        ].join(" ")}
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
