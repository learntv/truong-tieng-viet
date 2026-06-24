import { Check, Star } from "lucide-react";

export const STAGE_COLORS = [
  {
    ring: "ring-green-400",
    bg: "bg-green-500",
    bgSoft: "bg-green-50",
    gradient: "bg-gradient-to-br from-green-400 to-green-600",
    border: "border-green-400",
    text: "text-green-700",
  },
  {
    ring: "ring-sky-400",
    bg: "bg-sky-500",
    bgSoft: "bg-sky-50",
    gradient: "bg-gradient-to-br from-sky-400 to-sky-600",
    border: "border-sky-400",
    text: "text-sky-700",
  },
  {
    ring: "ring-purple-400",
    bg: "bg-purple-500",
    bgSoft: "bg-purple-50",
    gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
    border: "border-purple-400",
    text: "text-purple-700",
  },
  {
    ring: "ring-amber-400",
    bg: "bg-amber-500",
    bgSoft: "bg-amber-50",
    gradient: "bg-gradient-to-br from-amber-400 to-amber-600",
    border: "border-amber-400",
    text: "text-amber-700",
  },
  {
    ring: "ring-pink-400",
    bg: "bg-pink-500",
    bgSoft: "bg-pink-50",
    gradient: "bg-gradient-to-br from-pink-400 to-pink-600",
    border: "border-pink-400",
    text: "text-pink-700",
  },
];

export function StageNode({
  index,
  xPercent,
  yPercent,
  title,
  isCurrent,
  isCompleted,
  onClick,
}: {
  index: number;
  xPercent: number;
  yPercent: number;
  title: string;
  isCurrent: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) {
  const color = STAGE_COLORS[index % STAGE_COLORS.length];
  const size = isCurrent ? 76 : 68;

  return (
    <button
      onClick={onClick}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105 focus:outline-none"
      style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
      aria-label={`Chặng ${index + 1}`}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className={[
            "grid place-items-center rounded-full text-white ring-[6px] ring-white drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]",
            color.bg,
            isCurrent ? "animate-pulse-glow" : "",
          ].join(" ")}
          style={{ width: size, height: size }}
        >
          {isCompleted ? (
            <Check className="h-8 w-8" strokeWidth={3.5} />
          ) : (
            <span className="font-display text-2xl font-extrabold">{index + 1}</span>
          )}
        </div>

        <div
          className={[
            "flex flex-col items-center gap-1 rounded-xl border-2 bg-white/95 px-3 py-1.5 text-center shadow-card backdrop-blur",
            color.border,
          ].join(" ")}
        >
          <span
            className={["font-display text-xs font-extrabold leading-tight", color.text].join(" ")}
          >
            Chặng {index + 1}
          </span>
          <span className="text-[11px] font-bold leading-tight text-stone-700">{title}</span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star
                key={i}
                className={
                  isCompleted ? "h-3 w-3 fill-yellow-400 text-yellow-400" : "h-3 w-3 text-stone-300"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
