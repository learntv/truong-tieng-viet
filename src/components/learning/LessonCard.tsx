import { ArrowLeft, ArrowRight, Check, Star, Volume2, X } from "lucide-react";
import type { Stage } from "@/data/topics";
import kidsAodai from "@/assets/kids-aodai.jpg";

export function LessonCard({
  stage,
  stageIndex,
  totalStages,
  isCompleted,
  onPrev,
  onNext,
  onComplete,
  onClose,
}: {
  stage: Stage;
  stageIndex: number;
  totalStages: number;
  isCompleted: boolean;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
  onClose: () => void;
}) {
  const canPrev = stageIndex > 0;
  const canNext = stageIndex < totalStages - 1;

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
          <button onClick={onPrev} disabled={!canPrev} className="grid h-9 w-9 place-items-center rounded-full bg-white text-navy shadow-card ring-1 ring-border transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Chặng trước">
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button onClick={onNext} disabled={!canNext} className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white shadow-card transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Chặng kế">
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-stone-100 text-stone-500 shadow-card transition hover:scale-105 hover:bg-stone-200 hover:text-stone-700" aria-label="Đóng">
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto p-4 sm:grid-cols-2 sm:gap-5 sm:p-6">
        <div className="relative overflow-hidden rounded-2xl">
          <img src={kidsAodai} alt="Hai bạn nhỏ mặc áo dài chào nhau" width={768} height={768} loading="lazy" className="h-44 w-full object-cover sm:h-full" />
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-stone-700 shadow-card">
            Hình minh họa bài học
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-center font-display text-sm font-extrabold text-primary">
            ✦ Từ vựng Tiếng Việt ✦
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {stage.sampleVocabulary.slice(0, 8).map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-1 rounded-xl border-2 border-border bg-white px-2 py-3 text-center shadow-card">
                <span className="text-2xl">{stage.imageEmoji}</span>
                <p className="font-display text-base font-extrabold text-navy">{v.vi}</p>
              </div>
            ))}
          </div>
          <button onClick={() => console.log("[audio]", stage.sampleVocabulary.map((v) => v.vi))} className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-extrabold text-white shadow-card transition hover:scale-[1.02] hover:bg-primary/90">
            <Volume2 className="h-4 w-4" />
            Nghe phát âm
          </button>
          <p className="text-center text-xs font-medium text-muted-foreground">
            Bấm vào loa để nghe và đọc theo nhé!
          </p>
        </div>
      </div>

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
