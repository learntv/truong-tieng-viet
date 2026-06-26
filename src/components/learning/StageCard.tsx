import { useEffect, useRef } from "react";
import { Check, Star } from "lucide-react";

export const STAGE_COLORS = [
  {
    ring: "ring-green-400",
    bg: "bg-green-500",
    bgSoft: "bg-green-50",
    gradient: "bg-gradient-to-br from-green-400 to-green-600",
    border: "border-green-400",
    text: "text-green-700",
    stripe: "from-green-400 to-green-600",
    scrollThumb: "#4ade80",
    scrollTrack: "#dcfce7",
  },
  {
    ring: "ring-sky-400",
    bg: "bg-sky-500",
    bgSoft: "bg-sky-50",
    gradient: "bg-gradient-to-br from-sky-400 to-sky-600",
    border: "border-sky-400",
    text: "text-sky-700",
    stripe: "from-sky-400 to-sky-600",
    scrollThumb: "#38bdf8",
    scrollTrack: "#e0f2fe",
  },
  {
    ring: "ring-purple-400",
    bg: "bg-purple-500",
    bgSoft: "bg-purple-50",
    gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
    border: "border-purple-400",
    text: "text-purple-700",
    stripe: "from-purple-400 to-purple-600",
    scrollThumb: "#c084fc",
    scrollTrack: "#f3e8ff",
  },
  {
    ring: "ring-amber-400",
    bg: "bg-amber-500",
    bgSoft: "bg-amber-50",
    gradient: "bg-gradient-to-br from-amber-400 to-amber-600",
    border: "border-amber-400",
    text: "text-amber-700",
    stripe: "from-amber-400 to-amber-600",
    scrollThumb: "#fbbf24",
    scrollTrack: "#fef3c7",
  },
  {
    ring: "ring-pink-400",
    bg: "bg-pink-500",
    bgSoft: "bg-pink-50",
    gradient: "bg-gradient-to-br from-pink-400 to-pink-600",
    border: "border-pink-400",
    text: "text-pink-700",
    stripe: "from-pink-400 to-pink-600",
    scrollThumb: "#f472b6",
    scrollTrack: "#fce7f3",
  },
];

export function StageCard({
  index,
  title,
  emoji,
  isCurrent,
  isCompleted,
  compact = false,
  onClick,
}: {
  index: number;
  title: string;
  emoji: string;
  isCurrent: boolean;
  isCompleted: boolean;
  compact?: boolean;
  onClick: () => void;
}) {
  const color = STAGE_COLORS[index % STAGE_COLORS.length];
  const wasCompletedRef = useRef(isCompleted);
  const justCompleted = isCompleted && !wasCompletedRef.current;

  useEffect(() => {
    wasCompletedRef.current = isCompleted;
  });

  return (
    <button
      onClick={onClick}
      className={[
        "relative overflow-hidden rounded-2xl bg-white text-left shadow-card transition-all duration-300",
        compact ? "w-36" : "w-44",
        isCurrent
          ? `ring-4 ${color.ring} animate-pulse-glow shadow-glow-yellow scale-105`
          : "hover:scale-105 hover:shadow-soft",
        isCompleted ? "opacity-80" : "",
      ].join(" ")}
    >
      {/* Colored top stripe */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${color.stripe}`} />

      <div className={compact ? "px-2 pb-2 pt-1.5" : "px-3 pb-3 pt-2"}>
        {/* Header row: emoji + "Chặng N" */}
        <div className="flex items-center justify-between">
          <span className="text-2xl leading-none">{emoji}</span>
          <span className={`text-xs font-extrabold uppercase tracking-wide ${color.text}`}>
            Chặng {index + 1}
          </span>
        </div>

        {/* Title */}
        <p className="mt-1.5 line-clamp-2 font-display text-sm font-extrabold leading-tight text-navy">
          {title}
        </p>

        {/* Bottom: stars or state chip */}
        <div className="mt-2 flex items-center gap-1">
          {isCurrent ? (
            <span
              className={`rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-extrabold text-white ${color.stripe}`}
            >
              Đang học
            </span>
          ) : isCompleted ? (
            <div className="flex gap-0.5">
              {[0, 1, 2].map((s) => (
                <Star key={s} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          ) : (
            <div className="flex gap-0.5">
              {[0, 1, 2].map((s) => (
                <Star key={s} className="h-3.5 w-3.5 text-stone-300" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Completion stamp overlay */}
      {isCompleted && (
        <div
          className={[
            "pointer-events-none absolute inset-0 flex items-center justify-center",
            justCompleted ? "animate-stamp-in" : "",
          ].join(" ")}
          style={{ transform: justCompleted ? undefined : "scale(1) rotate(-15deg)", opacity: 0.75 }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-green-500 bg-white/90">
            <Check className="h-8 w-8 text-green-500" strokeWidth={3} />
          </div>
        </div>
      )}
    </button>
  );
}
