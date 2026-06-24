import { ArrowLeft, ArrowRight, Check, Star, X } from "lucide-react";
import type { LearningStage } from "@/lib/learning";

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

  return (
    <div className="flex max-h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-7">
        <div className="flex min-w-0 items-center gap-2">
          <Star className="h-5 w-5 shrink-0 fill-yellow-400 text-yellow-400" />
          <h3 className="truncate font-display text-lg font-extrabold text-navy sm:text-xl">
            Chặng {stageIndex + 1}: {stage.title}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onPrevSection}
            disabled={!canPrev}
            className="grid h-9 w-9 place-items-center rounded-full bg-white text-navy shadow-card ring-1 ring-border transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Nội dung trước"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            onClick={onNextSection}
            disabled={!canNext}
            className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white shadow-card transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Nội dung kế"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-stone-100 text-stone-500 shadow-card transition hover:scale-105 hover:bg-stone-200 hover:text-stone-700"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {section ? (
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="font-display text-sm font-extrabold uppercase tracking-wide text-primary">
              {section.title || "Nội dung"}
            </p>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-navy">
              Nội dung {sectionIndex + 1} / {sections.length}
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {section.lessons.map((lesson, li) => (
              <article key={lesson.id} className="rounded-2xl border-2 border-border/70 bg-white p-4 shadow-card sm:p-5">
                <div className="mb-3 flex items-start gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-extrabold text-white">
                    {li + 1}
                  </span>
                  <p className="whitespace-pre-line font-display text-base font-bold text-navy sm:text-lg">
                    {lesson.text || "—"}
                  </p>
                </div>

                {lesson.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {lesson.images.map((img) => (
                      <figure key={img.id} className="overflow-hidden rounded-xl bg-stone-50">
                        {img.url ? (
                          <img
                            src={img.url}
                            alt={img.caption || `Hình minh họa ${li + 1}`}
                            loading="lazy"
                            className="h-auto w-full object-contain"
                          />
                        ) : (
                          <div className="grid aspect-video place-items-center text-xs text-muted-foreground">
                            (Không tải được hình)
                          </div>
                        )}
                        {img.caption && (
                          <figcaption className="whitespace-pre-line px-3 py-2 text-xs font-medium text-stone-600">
                            {img.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                )}
              </article>
            ))}

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

      <div className="border-t border-border/60 px-4 py-3 sm:px-6">
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={[
            "flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-extrabold shadow-card transition sm:w-auto",
            isCompleted ? "cursor-not-allowed bg-green/40 text-navy" : "bg-green text-navy hover:scale-105",
          ].join(" ")}
        >
          <Check className="h-4 w-4" strokeWidth={3} />
          {isCompleted ? "Đã hoàn thành chặng này" : "Hoàn thành chặng"}
        </button>
      </div>
    </div>
  );
}
