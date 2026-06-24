import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Star, Volume2, X } from "lucide-react";
import type { Chang } from "@/lib/learning";

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

function SpeakButton({ text }: { text: string }) {
  const [playing, setPlaying] = useState(false);
  const onClick = useCallback(() => {
    setPlaying(true);
    speak(text, () => setPlaying(false));
  }, [text]);
  return (
    <button
      onClick={onClick}
      aria-label="Nghe đọc"
      className={[
        "grid h-9 w-9 shrink-0 place-items-center rounded-full shadow-card ring-2 ring-primary/30 transition hover:scale-110 active:scale-95",
        playing ? "animate-pulse bg-primary text-white" : "bg-white text-primary",
      ].join(" ")}
    >
      <Volume2 className="h-4 w-4" strokeWidth={2.5} />
    </button>
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
    <div className="flex max-h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-7">
        <div className="flex min-w-0 items-center gap-2">
          <Star className="h-5 w-5 shrink-0 fill-yellow-400 text-yellow-400" />
          <h3 className="truncate font-display text-lg font-extrabold text-navy sm:text-xl">
            Chặng {changIndex + 1}: {chang.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-stone-100 text-stone-500 shadow-card transition hover:scale-105 hover:bg-stone-200 hover:text-stone-700"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>

      {noiDung ? (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          {noiDung.title && (
            <div className="mb-6 rounded-2xl bg-primary px-5 py-4 text-center shadow-card">
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
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-extrabold text-white">
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
                    <div className={isSingle ? "flex flex-col gap-4 sm:flex-row sm:items-start" : "grid grid-cols-2 gap-4"}>
                      {hinhs.map((hinh) => {
                        const captions = hinh.captions.filter((c) => c.trim().length > 1);
                        return (
                          <figure key={hinh.id} className={isSingle ? "flex flex-1 flex-col gap-3 sm:flex-row sm:items-start" : ""}>
                            <div className={isSingle ? "sm:w-1/2" : ""}>
                              {hinh.url ? (
                                <img
                                  src={hinh.url}
                                  alt={captions[0] || "Hình minh họa"}
                                  loading="lazy"
                                  className="mx-auto w-[70%] rounded-xl object-contain ring-1 ring-border/60"
                                />
                              ) : (
                                <div className="grid aspect-video w-full place-items-center rounded-xl bg-stone-50 text-xs text-muted-foreground ring-1 ring-border/60">
                                  (Không tải được hình)
                                </div>
                              )}
                            </div>

                            {captions.length > 0 && (
                              <ul className={isSingle ? "flex flex-1 flex-col gap-2 sm:pl-2" : "mt-2 flex flex-col gap-2"}>
                                {captions.map((c, ci) => (
                                  <li key={ci} className="flex items-center gap-2">
                                    <SpeakButton text={c} />
                                    <span className="flex-1 whitespace-pre-line font-display text-sm text-navy sm:text-base">
                                      {c}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </figure>
                        );
                      })}
                    </div>
                  )}
                </article>
              );
            })}

            {noiDung.bais.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">Nội dung đang được cập nhật.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 px-5 py-10 text-center text-sm text-muted-foreground">
          Chặng này chưa có nội dung.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 px-4 py-3 sm:px-6">
        <button
          onClick={onPrevNoiDung}
          disabled={!canPrev}
          className="rounded-full bg-white px-4 py-2 text-sm font-bold text-navy shadow-card ring-1 ring-border transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Trước
        </button>

        {isLastNoiDung && (
          <button
            onClick={onComplete}
            disabled={isCompleted}
            className={[
              "flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-extrabold shadow-card transition",
              isCompleted ? "cursor-not-allowed bg-green/40 text-navy" : "bg-green text-navy hover:scale-105",
            ].join(" ")}
          >
            <Check className="h-4 w-4" strokeWidth={3} />
            {isCompleted ? "Đã hoàn thành" : "Hoàn thành chặng"}
          </button>
        )}

        <button
          onClick={onNextNoiDung}
          disabled={!canNext}
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-card transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
}
