import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

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
    bevel: "shadow-[0_4px_0_0_#16a34a]",
    hex: "#16a34a",
    bevelActive: "active:shadow-[0_1px_0_0_#16a34a]",
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
    bevel: "shadow-[0_4px_0_0_#0284c7]",
    hex: "#0284c7",
    bevelActive: "active:shadow-[0_1px_0_0_#0284c7]",
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
    bevel: "shadow-[0_4px_0_0_#9333ea]",
    hex: "#9333ea",
    bevelActive: "active:shadow-[0_1px_0_0_#9333ea]",
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
    bevel: "shadow-[0_4px_0_0_#d97706]",
    hex: "#d97706",
    bevelActive: "active:shadow-[0_1px_0_0_#d97706]",
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
    bevel: "shadow-[0_4px_0_0_#db2777]",
    hex: "#db2777",
    bevelActive: "active:shadow-[0_1px_0_0_#db2777]",
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
  }, [isCompleted]);

  if (isLocked) {
    return (
      <div
        className={[
          "overflow-hidden rounded-2xl border-2 border-black/10 bg-stone-400 transition-[box-shadow,border-color] duration-200",
          "shadow-[0_4px_0_0_#78716c]",
          compact ? "w-36" : "w-44",
        ].join(" ")}
      >
        <button
          onClick={onClick}
          aria-label={`Chặng ${index + 1}: ${title} — đang khóa`}
          className="grid w-full cursor-pointer place-items-center gap-1 py-4 text-center"
        >
          <span className="text-4xl leading-none opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">🔒</span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/80 drop-shadow-sm">
            Chặng {index + 1}
          </span>
        </button>

        {/* Expanding hint — friendly nudge instead of a dead end */}
        <div
          className={[
            "overflow-hidden transition-all duration-300 ease-out",
            isSelected ? "max-h-24" : "max-h-0",
          ].join(" ")}
        >
          <div className="px-1.5 pb-1.5">
            <div className="rounded-xl bg-stone-500 px-2 py-1.5 shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)]">
              <p className="text-center text-xs font-bold leading-snug text-white">
                Hoàn thành chặng trước để mở khóa nhé!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div
        className={[
          "overflow-hidden rounded-2xl border-2 border-black/10 transition-[box-shadow,border-color] duration-200",
          color.bevel,
          color.bg,
          compact ? "w-36" : "w-44",
        ].join(" ")}
      >
        <button
          onClick={onClick}
          aria-label={`Chặng ${index + 1}: ${title} — đã hoàn thành`}
          className="grid w-full cursor-pointer place-items-center gap-1 py-4 text-center"
        >
          <Check
            className={["h-11 w-11 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]", justCompleted ? "animate-stamp-in" : ""].join(" ")}
            strokeWidth={4}
          />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/90 drop-shadow-sm">
            Chặng {index + 1}
          </span>
        </button>

        {/* Expanding action section — same reveal-on-select pattern as the in-progress card */}
        <div
          className={[
            "overflow-hidden transition-all duration-300 ease-out",
            isSelected ? "max-h-28" : "max-h-0",
          ].join(" ")}
        >
          <div className="px-3 pb-3">
            <p className="line-clamp-2 pb-2 text-center font-display text-sm font-extrabold leading-tight text-white drop-shadow-sm">
              {title}
            </p>
            <button
              onClick={onOpen}
              className="w-full cursor-pointer rounded-xl bg-white py-2 text-sm font-extrabold text-navy shadow-bevel-neutral transition-[transform,box-shadow] ease-bounce hover:brightness-95 active:translate-y-[2px] active:shadow-bevel-neutral-active"
            >
              {openLabel ?? "Ôn tập"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border-2 border-black/10 bg-white transition-[box-shadow,border-color] duration-200 cursor-pointer",
        "shadow-[0_4px_0_0_rgba(0,0,0,0.15)]",
        compact ? "w-36" : "w-44",
        isCurrent
          ? `ring-4 ${color.ring} animate-pulse-glow`
          : "hover:border-black/20",
      ].join(" ")}
      style={isCurrent ? ({ "--glow-color": color.hex } as React.CSSProperties) : undefined}
    >
      {/* Flat color header with emoji */}
      <button
        onClick={onClick}
        className={["w-full cursor-pointer text-center", color.bg].join(" ")}
      >
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
        {noiDungProgress && (
          <div className="mt-1.5 px-1">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
              <div
                className={["h-full rounded-full transition-all", color.bg].join(" ")}
                style={{ width: `${(noiDungProgress.current / noiDungProgress.total) * 100}%` }}
              />
            </div>
            <p className={["mt-1 text-[9px] font-bold", color.text].join(" ")}>
              {noiDungProgress.current}/{noiDungProgress.total} bài
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
              "w-full cursor-pointer rounded-xl py-2 text-sm font-extrabold text-white transition-[transform,box-shadow,filter] ease-bounce hover:brightness-110 active:translate-y-[2px]",
              color.bevelActive,
              color.bevel,
              color.bg,
            ].join(" ")}
          >
            {openLabel ?? "Bắt đầu"}
          </button>
        </div>
      </div>
    </div>
  );
}
