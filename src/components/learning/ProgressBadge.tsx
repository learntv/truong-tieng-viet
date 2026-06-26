import { useEffect, useRef, useState } from "react";
import { BookOpenCheck, ChevronDown, ChevronRight, Lock, Star } from "lucide-react";
import type { ChuDe } from "@/data/topics";

export function ProgressBadge({
  chuDes,
  currentChuDeIndex,
  completedCount,
  totalChangs,
  allCurrentDone,
  isLast,
  onAdvance,
}: {
  chuDes: ChuDe[];
  currentChuDeIndex: number;
  completedCount: number;
  totalChangs: number;
  allCurrentDone: boolean;
  isLast: boolean;
  onAdvance: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const canAdvance = allCurrentDone && !isLast;
  const allDone = isLast && allCurrentDone;

  useEffect(() => {
    if (!expanded) return;
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [expanded]);

  return (
    <div ref={ref} className="relative z-30 inline-block">
      {/* Collapsed pill */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className={[
          "flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-navy shadow-card backdrop-blur transition hover:scale-105",
          allDone ? "animate-glow-gold" : "",
        ].join(" ")}
      >
        <BookOpenCheck className="h-4 w-4 text-primary" />
        <span>
          Chủ đề {currentChuDeIndex + 1}/{chuDes.length}
          &nbsp;•&nbsp;
          {completedCount}/{totalChangs} chặng
        </span>
        <ChevronDown
          className={[
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            expanded ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {/* Advance CTA (shows inline when ready) */}
      {canAdvance && !expanded && (
        <button
          onClick={onAdvance}
          className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-sunset px-3 py-1.5 text-xs font-extrabold text-navy shadow-card transition hover:scale-105"
        >
          <ChevronRight className="h-3.5 w-3.5" />
          Chủ đề tiếp theo
        </button>
      )}

      {/* Expanded topic list */}
      {expanded && (
        <div className="animate-badge-expand absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl bg-white shadow-soft">
          <div className="border-b border-border/60 px-4 py-3">
            <p className="font-display text-sm font-extrabold text-navy">Lộ trình học</p>
            <p className="text-xs text-muted-foreground">{chuDes.length} chủ đề · {chuDes.length * totalChangs} bài học</p>
          </div>
          <ul className="max-h-72 overflow-y-auto py-2">
            {chuDes.map((t, i) => {
              const isCurrent = i === currentChuDeIndex;
              const isPast = i < currentChuDeIndex;
              const isNext = i === currentChuDeIndex + 1 && allCurrentDone;
              const isLocked = i > currentChuDeIndex && !isNext;
              const label = t.title.split(":")[1]?.trim() || t.title;
              return (
                <li
                  key={t.id}
                  className={[
                    "flex items-center gap-3 px-4 py-2 text-sm",
                    isCurrent ? "bg-primary/8" : "",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-extrabold",
                      isCurrent
                        ? "bg-primary text-white"
                        : isPast
                          ? "bg-green-500 text-white"
                          : isNext
                            ? "bg-amber-400 text-white"
                            : "bg-stone-200 text-stone-400",
                    ].join(" ")}
                  >
                    {isPast ? <Star className="h-3 w-3 fill-white text-white" /> : i + 1}
                  </span>
                  <span className={["flex-1 truncate font-bold", isLocked ? "text-stone-400" : "text-navy"].join(" ")}>
                    {label}
                  </span>
                  {isLocked ? (
                    <Lock className="h-3.5 w-3.5 shrink-0 text-stone-300" />
                  ) : isCurrent ? (
                    <span className="text-xs font-bold text-primary">{completedCount}/{totalChangs}</span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {canAdvance && (
            <div className="border-t border-border/60 p-3">
              <button
                onClick={() => { onAdvance(); setExpanded(false); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-sunset px-4 py-2.5 font-display text-sm font-extrabold text-navy shadow-card transition hover:scale-[1.02]"
              >
                <BookOpenCheck className="h-4 w-4" />
                Lật sang chủ đề tiếp theo
              </button>
            </div>
          )}
          {allDone && (
            <div className="border-t border-border/60 px-4 py-3 text-center text-xs font-bold text-primary">
              🎉 Bạn đã hoàn thành toàn bộ lộ trình!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
