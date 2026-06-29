import { useEffect, useRef } from "react";
import { Check, Lock } from "lucide-react";

export const STAGE_COLORS = [
  {
    ring: "ring-green-400",
    bg: "bg-green-500",
    bgSoft: "bg-green-50",
    gradient: "bg-gradient-to-br from-green-400 to-green-600",
    gradientHover: "from-green-300 to-green-500",
    border: "border-green-400",
    text: "text-green-700",
    stripe: "from-green-400 to-green-600",
    glow: "shadow-[0_8px_24px_rgba(74,222,128,0.55)]",
    scrollThumb: "#4ade80",
    scrollTrack: "#dcfce7",
  },
  {
    ring: "ring-sky-400",
    bg: "bg-sky-500",
    bgSoft: "bg-sky-50",
    gradient: "bg-gradient-to-br from-sky-400 to-sky-600",
    gradientHover: "from-sky-300 to-sky-500",
    border: "border-sky-400",
    text: "text-sky-700",
    stripe: "from-sky-400 to-sky-600",
    glow: "shadow-[0_8px_24px_rgba(56,189,248,0.55)]",
    scrollThumb: "#38bdf8",
    scrollTrack: "#e0f2fe",
  },
  {
    ring: "ring-purple-400",
    bg: "bg-purple-500",
    bgSoft: "bg-purple-50",
    gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
    gradientHover: "from-purple-300 to-purple-500",
    border: "border-purple-400",
    text: "text-purple-700",
    stripe: "from-purple-400 to-purple-600",
    glow: "shadow-[0_8px_24px_rgba(192,132,252,0.55)]",
    scrollThumb: "#c084fc",
    scrollTrack: "#f3e8ff",
  },
  {
    ring: "ring-amber-400",
    bg: "bg-amber-500",
    bgSoft: "bg-amber-50",
    gradient: "bg-gradient-to-br from-amber-400 to-amber-600",
    gradientHover: "from-amber-300 to-amber-500",
    border: "border-amber-400",
    text: "text-amber-700",
    stripe: "from-amber-400 to-amber-600",
    glow: "shadow-[0_8px_24px_rgba(251,191,36,0.55)]",
    scrollThumb: "#fbbf24",
    scrollTrack: "#fef3c7",
  },
  {
    ring: "ring-pink-400",
    bg: "bg-pink-500",
    bgSoft: "bg-pink-50",
    gradient: "bg-gradient-to-br from-pink-400 to-pink-600",
    gradientHover: "from-pink-300 to-pink-500",
    border: "border-pink-400",
    text: "text-pink-700",
    stripe: "from-pink-400 to-pink-600",
    glow: "shadow-[0_8px_24px_rgba(244,114,182,0.55)]",
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
  isLocked = false,
  isSelected = false,
  compact = false,
  openLabel,
  noiDungProgress,
  onClick,
  onOpen,
}: {
  index: number;
  title: string;
  emoji: string;
  isCurrent: boolean;
  isCompleted: boolean;
  isLocked?: boolean;
  isSelected?: boolean;
  compact?: boolean;
  openLabel?: string;
  noiDungProgress?: { current: number; total: number };
  onClick: () => void;
  onOpen?: () => void;
}) {
  const color = STAGE_COLORS[index % STAGE_COLORS.length];
  const wasCompletedRef = useRef(isCompleted);
  const justCompleted = isCompleted && !wasCompletedRef.current;

  useEffect(() => {
    wasCompletedRef.current = isCompleted;
  });

  if (isLocked) {
    return (
      <div
        className={[
          "relative overflow-hidden rounded-2xl bg-white cursor-not-allowed select-none transition-transform duration-300 hover:scale-105",
          "ring-[3px] ring-white/60",
          "shadow-[0_6px_20px_rgba(0,0,0,0.3)]",
          compact ? "w-36" : "w-44",
        ].join(" ")}
      >
        {/* Greyed gradient header */}
        <div className="w-full bg-gradient-to-br from-stone-300 to-stone-400 text-center">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/10 to-transparent" />
          <div className="flex flex-col items-center gap-1.5 px-3 pb-4 pt-5">
            <Lock className="h-9 w-9 text-white/80 drop-shadow-sm" strokeWidth={2.5} />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">
              Chặng {index + 1}
            </span>
          </div>
        </div>
        {/* White body */}
        <div className="px-3 pb-3 pt-2.5 text-center">
          <p className="line-clamp-2 font-display text-sm font-extrabold leading-tight text-stone-400">
            {title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl bg-white transition-all duration-300 cursor-pointer",
        "ring-[3px] ring-white/90",
        "shadow-[0_6px_20px_rgba(0,0,0,0.45)]",
        compact ? "w-36" : "w-44",
        isCurrent
          ? `ring-4 ${color.ring} animate-pulse-glow ${color.glow} scale-105`
          : `hover:scale-105 hover:${color.glow}`,
        isCompleted ? "opacity-75" : "",
      ].join(" ")}
    >
      {/* Gradient header with emoji */}
      <button
        onClick={onClick}
        className={["w-full cursor-pointer text-center", color.gradient].join(" ")}
      >
        {/* Sheen overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/20 to-transparent" />
        <div className="flex flex-col items-center gap-1.5 px-3 pb-4 pt-5">
          <span className="text-4xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">{emoji}</span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/90 drop-shadow-sm">
            Chặng {index + 1}
          </span>
        </div>
      </button>

      {/* White body: title + status */}
      <button
        onClick={onClick}
        className="w-full cursor-pointer px-3 pb-3 pt-2.5 text-center"
      >
        <p className="line-clamp-2 font-display text-sm font-extrabold leading-tight text-navy">
          {title}
        </p>
        {noiDungProgress && !isCompleted && (
          <div className="mt-1.5 px-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
              <div
                className={["h-full rounded-full transition-all", color.bg].join(" ")}
                style={{ width: `${(noiDungProgress.current / noiDungProgress.total) * 100}%` }}
              />
            </div>
            <p className={["mt-0.5 text-[9px] font-bold", color.text].join(" ")}>
              {noiDungProgress.current}/{noiDungProgress.total} trang
            </p>
          </div>
        )}
      </button>

      {/* Expanding action section */}
      <div
        className={[
          "overflow-hidden transition-all duration-300 ease-out",
          isSelected ? "max-h-14" : "max-h-0",
        ].join(" ")}
      >
        <div className="px-3 pb-3">
          <button
            onClick={onOpen}
            className={[
              "w-full cursor-pointer rounded-xl py-2 text-sm font-extrabold text-white transition hover:brightness-110 active:scale-95",
              "shadow-[0_3px_10px_rgba(0,0,0,0.25)]",
              color.gradient,
            ].join(" ")}
          >
            {openLabel ?? "Bắt đầu"}
          </button>
        </div>
      </div>

      {/* Completion stamp overlay */}
      {isCompleted && (
        <div
          className={[
            "pointer-events-none absolute inset-0 flex items-center justify-center",
            justCompleted ? "animate-stamp-in" : "",
          ].join(" ")}
          style={{ transform: justCompleted ? undefined : "scale(1) rotate(-15deg)", opacity: 0.8 }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-green-500 bg-white/90 shadow-lg">
            <Check className="h-8 w-8 text-green-500" strokeWidth={3} />
          </div>
        </div>
      )}
    </div>
  );
}
