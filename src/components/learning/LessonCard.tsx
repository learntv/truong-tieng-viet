import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Star, Volume2, X } from "lucide-react";
import type { LearningStage } from "@/lib/learning";

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
        "grid h-10 w-10 shrink-0 place-items-center rounded-full shadow-card ring-2 ring-primary/30 transition hover:scale-110 active:scale-95",
        playing ? "animate-pulse bg-primary text-white" : "bg-white text-primary",
      ].join(" ")}
    >
      <Volume2 className="h-5 w-5" strokeWidth={2.5} />
    </button>
  );
}

export function LessonCard({
  stage,
  stageIndex,
  sectionIndex,
  isCompleted,
  onPrevSection,
  onNextSection,
  onComplete,
  onClose,
}: {
  stage: LearningStage;
  stageIndex: number;
  sectionIndex: number;
  isCompleted: boolean;
  onPrevSection: () => void;
  onNextSection: () => void;
  onComplete: () => void;
  onClose: () => void;
}) {
  const sections = stage.sections;
  const section = sections[sectionIndex];
  const canPrev = sectionIndex > 0;
  const canNext = sectionIndex < sections.length - 1;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [sectionIndex, stageIndex]);

  return (
    <div className="flex max-h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-7">
        <div className="flex min-w-0 items-center gap-2">
          <Star className="h-5 w-5 shrink-0 fill-yellow-400 text-yellow-400" />
          <h3 className="truncate font-display text-lg font-extrabold text-navy sm:text-xl">
            Chặng {stageIndex + 1}: {stage.title}
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

      {section ? (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          {section.title && (
            <p className="mb-6 text-center font-display text-sm font-extrabold uppercase tracking-wider text-primary">
              {section.title}
            </p>
          )}

          <div className="flex flex-col gap-8">
            {section.lessons.map((lesson, li) => {
              const imgs = lesson.images;
              const isSingle = imgs.length === 1;
              const gridCols = imgs.length >= 2 ? "grid-cols-2" : "grid-cols-1";
              return (
                <article
                  key={lesson.id}
                  className="rounded-2xl border-2 border-border/70 bg-white p-4 shadow-card sm:p-5"
                >
                  {lesson.texts.length > 0 && (
                    <div className="mb-4 flex items-start gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-extrabold text-white">
                        {li + 1}
                      </span>
                      <div className="flex-1 space-y-2">
                        {lesson.texts.map((t, i) => (
                          <p
                            key={i}
                            className="whitespace-pre-line font-display text-base font-bold text-navy sm:text-lg"
                          >
                            {t}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {imgs.length > 0 && (
                    <div className={`mt-3 grid gap-3 ${gridCols} ${isSingle ? "mx-auto w-[70%]" : ""}`}>
                      {imgs.map((img) => (
                        <figure key={img.id} className="overflow-hidden rounded-xl bg-stone-50 ring-1 ring-border/60">
                          {img.url ? (
                            <img
                              src={img.url}
                              alt={img.caption || "Hình minh họa"}
                              loading="lazy"
                              className="h-auto w-full object-contain"
                            />
                          ) : (
                            <div className="grid aspect-video place-items-center text-xs text-muted-foreground">
                              (Không tải được hình)
                            </div>
                          )}
                          {img.caption && (
                            <figcaption className="flex items-center gap-2 px-3 py-2">
                              <SpeakButton text={img.caption} />
                              <span className="flex-1 whitespace-pre-line text-center font-display text-lg font-extrabold text-navy">
                                {img.caption}
                              </span>
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}

            {section.lessons.length === 0 && (
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
          onClick={onPrevSection}
          disabled={!canPrev}
          className="rounded-full bg-white px-4 py-2 text-sm font-bold text-navy shadow-card ring-1 ring-border transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Trước
        </button>

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

        <button
          onClick={onNextSection}
          disabled={!canNext}
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-card transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
}
