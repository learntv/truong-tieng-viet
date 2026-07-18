import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

// Muted vintage "Vietnam Quest" stage palette — jade / postal-blue / plum / gold / dusty-rose.
export const STAGE_COLORS = [
  {
    ring: "ring-[#2f8a63]",
    bg: "bg-[#2f8a63]",
    bgSoft: "bg-[#2f8a63]/10",
    gradient: "bg-gradient-to-br from-[#3ba073] to-[#236b4c]",
    gradientHover: "from-[#45b080] to-[#2f8a63]",
    border: "border-[#2f8a63]",
    text: "text-[#236b4c]",
    stripe: "from-[#3ba073] to-[#236b4c]",
    glow: "shadow-[0_8px_24px_rgba(47,138,99,0.5)]",
    bevel: "shadow-[0_4px_0_0_#1f5d42]",
    hex: "#2f8a63",
    bevelActive: "active:shadow-[0_1px_0_0_#1f5d42]",
    scrollThumb: "#2f8a63",
    scrollTrack: "#dbeee5",
  },
  {
    ring: "ring-[#2b6ea3]",
    bg: "bg-[#2b6ea3]",
    bgSoft: "bg-[#2b6ea3]/10",
    gradient: "bg-gradient-to-br from-[#3480ba] to-[#1f4f75]",
    gradientHover: "from-[#4090ca] to-[#2b6ea3]",
    border: "border-[#2b6ea3]",
    text: "text-[#1f4f75]",
    stripe: "from-[#3480ba] to-[#1f4f75]",
    glow: "shadow-[0_8px_24px_rgba(43,110,163,0.5)]",
    bevel: "shadow-[0_4px_0_0_#1a4363]",
    hex: "#2b6ea3",
    bevelActive: "active:shadow-[0_1px_0_0_#1a4363]",
    scrollThumb: "#2b6ea3",
    scrollTrack: "#dbe8f2",
  },
  {
    ring: "ring-[#7857a6]",
    bg: "bg-[#7857a6]",
    bgSoft: "bg-[#7857a6]/10",
    gradient: "bg-gradient-to-br from-[#8968b7] to-[#5c4082]",
    gradientHover: "from-[#9878c5] to-[#7857a6]",
    border: "border-[#7857a6]",
    text: "text-[#5c4082]",
    stripe: "from-[#8968b7] to-[#5c4082]",
    glow: "shadow-[0_8px_24px_rgba(120,87,166,0.5)]",
    bevel: "shadow-[0_4px_0_0_#4d356e]",
    hex: "#7857a6",
    bevelActive: "active:shadow-[0_1px_0_0_#4d356e]",
    scrollThumb: "#7857a6",
    scrollTrack: "#e9e2f2",
  },
  {
    ring: "ring-[#cf9526]",
    bg: "bg-[#cf9526]",
    bgSoft: "bg-[#cf9526]/10",
    gradient: "bg-gradient-to-br from-[#dda12e] to-[#a5751a]",
    gradientHover: "from-[#e6ac38] to-[#cf9526]",
    border: "border-[#cf9526]",
    text: "text-[#9c6f18]",
    stripe: "from-[#dda12e] to-[#a5751a]",
    glow: "shadow-[0_8px_24px_rgba(207,149,38,0.5)]",
    bevel: "shadow-[0_4px_0_0_#9c6f18]",
    hex: "#cf9526",
    bevelActive: "active:shadow-[0_1px_0_0_#9c6f18]",
    scrollThumb: "#cf9526",
    scrollTrack: "#f5ead1",
  },
  {
    ring: "ring-[#bf5f66]",
    bg: "bg-[#bf5f66]",
    bgSoft: "bg-[#bf5f66]/10",
    gradient: "bg-gradient-to-br from-[#cc6d74] to-[#994b51]",
    gradientHover: "from-[#d67a81] to-[#bf5f66]",
    border: "border-[#bf5f66]",
    text: "text-[#994b51]",
    stripe: "from-[#cc6d74] to-[#994b51]",
    glow: "shadow-[0_8px_24px_rgba(191,95,102,0.5)]",
    bevel: "shadow-[0_4px_0_0_#8a4247]",
    hex: "#bf5f66",
    bevelActive: "active:shadow-[0_1px_0_0_#8a4247]",
    scrollThumb: "#bf5f66",
    scrollTrack: "#f2dde0",
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
          <span className="text-4xl leading-none opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            🔒
          </span>
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
            className={[
              "h-11 w-11 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]",
              justCompleted ? "animate-stamp-in" : "",
            ].join(" ")}
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
        isCurrent ? `ring-4 ${color.ring} animate-pulse-glow` : "hover:border-black/20",
      ].join(" ")}
      style={isCurrent ? ({ "--glow-color": color.hex } as React.CSSProperties) : undefined}
    >
      {/* Flat color header with emoji */}
      <button
        onClick={onClick}
        className={["w-full cursor-pointer text-center", color.bg].join(" ")}
      >
        <div className="flex flex-col items-center gap-1.5 px-3 pb-4 pt-5">
          <span className="text-4xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            {emoji}
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/90 drop-shadow-sm">
            Chặng {index + 1}
          </span>
        </div>
      </button>

      {/* White body: title + status */}
      <button onClick={onClick} className="w-full cursor-pointer px-3 pb-3 pt-2.5 text-center">
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
