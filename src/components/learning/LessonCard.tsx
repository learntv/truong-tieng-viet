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
        "grid h-9 w-9 shrink-0 place-items-center rounded-full shadow-card ring-2 ring-primary/30 transition hover:scale-110 active:scale-95",
        playing ? "animate-pulse bg-primary text-white" : "bg-white text-primary",
      ].join(" ")}
    >
      <Volume2 className="h-4 w-4" strokeWidth={2.5} />
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
  const isLastSection = sectionIndex === sections.length - 1;
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
            <div className="mb-6 rounded-2xl bg-yellow-50/80 px-5 py-4 text-center shadow-card ring-1 ring-yellow-200">
              <p className="font-display text-xl font-extrabold text-navy sm:text-2xl">
                {section.title}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-6 divide-y divide-border/60">
            {section.lessons.map((lesson, li) => {
              const imgs = lesson.images;
              const isSingle = imgs.length === 1;
              return (
                <article key={lesson.id} className={li > 0 ? "pt-6" : ""}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-extrabold text-white">
                      {li + 1}
                    </span>
                    <div className="h-px flex-1 bg-border/60" />
                  </div>

                  {lesson.texts.length > 0 && (
                    <div className="mb-4 space-y-1.5">
                      {lesson.texts.map((t, i) => (
                        <p
                          key={i}
                          className="whitespace-pre-line font-display text-base font-bold text-navy sm:text-lg"
                        >
                          {t}
                        </p>
                      ))}
                    </div>
                  )}

                  {imgs.length > 0 && (
                    <div className={isSingle ? "flex flex-col gap-4 sm:flex-row sm:items-start" : "grid grid-cols-2 gap-4"}>
                      {imgs.map((img) => {
                        const captions = img.captions.filter((c) => c.trim().length > 1);
                        return (
                          <figure key={img.id} className={isSingle ? "flex flex-1 flex-col gap-3 sm:flex-row sm:items-start" : ""}>
                            <div className={isSingle ? "sm:w-1/2" : ""}>
                              {img.url ? (
                                <img
                                  src={img.url}
                                  alt={captions[0] || "Hình minh họa"}
                                  loading="lazy"
                                  className="h-auto w-full rounded-xl object-contain ring-1 ring-border/60"
                                />
                              ) : (
                                <div className="grid aspect-video w-full place-items-center rounded-xl bg-stone-50 text-xs text-muted-foreground ring-1 ring-border/60">
                                  (Không tải được hình)
                                </div>
                              )}
                            </div>

                            {captions.length > 0 && (
                              <figcaption className={isSingle ? "flex flex-1 flex-col gap-2 sm:pl-2" : "mt-2 flex flex-col gap-2"}>
                                {captions.map((c, ci) => (
                                  <div
                                    key={ci}
                                    className="flex items-center gap-2 rounded-lg bg-yellow-50/70 px-2.5 py-1.5 ring-1 ring-border/60"
                                  >
                                    <SpeakButton text={c} />
                                    <span className="flex-1 whitespace-pre-line font-display text-sm font-bold text-navy sm:text-base">
                                      {c}
                                    </span>
                                  </div>
                                ))}
                              </figcaption>
                            )}
                          </figure>
                        );
                      })}
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

        {isLastSection && (
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
