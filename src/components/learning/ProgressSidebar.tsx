import { BookOpenCheck, ChevronLeft, ChevronRight, Lock, Star } from "lucide-react";
import type { ChuDe } from "@/data/topics";

export function ProgressSidebar({
  chuDes,
  currentChuDeIndex,
  completedCount,
  totalChangs,
  allCurrentDone,
  isLast,
  onAdvance,
  isCollapsed,
  onToggleCollapsed,
}: {
  chuDes: ChuDe[];
  currentChuDeIndex: number;
  completedCount: number;
  totalChangs: number;
  allCurrentDone: boolean;
  isLast: boolean;
  onAdvance: () => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const canAdvance = allCurrentDone && !isLast;

  return (
    <>
      {isCollapsed && (
        <div className="hidden h-fit flex-col items-center gap-3 rounded-3xl border-4 border-white bg-card p-3 shadow-soft lg:flex">
          <button onClick={onToggleCollapsed} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-navy shadow-card transition hover:scale-105" aria-label="Mở rộng tiến độ chương trình">
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <BookOpenCheck className="h-6 w-6 shrink-0 text-primary" />
          <span className="text-xs font-extrabold text-navy">
            {currentChuDeIndex + 1}/{chuDes.length}
          </span>
        </div>
      )}

      <div
        className={[
          "flex h-full flex-col rounded-3xl border-4 border-white bg-card p-4 shadow-soft sm:p-5",
          isCollapsed ? "lg:hidden" : "",
        ].join(" ")}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="font-display text-base font-extrabold text-navy">Tiến độ chương trình</p>
            <p className="text-xs font-bold text-muted-foreground">
              {chuDes.length} chủ đề • {chuDes.length * totalChangs} bài học
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <BookOpenCheck className="h-7 w-7 text-primary" />
            <button onClick={onToggleCollapsed} className="hidden h-7 w-7 place-items-center rounded-full bg-muted text-navy shadow-card transition hover:scale-105 lg:grid" aria-label="Thu gọn tiến độ chương trình">
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <ul className="flex flex-col gap-1.5">
          {chuDes.map((t, i) => {
            const isCurrent = i === currentChuDeIndex;
            const isNext = i === currentChuDeIndex + 1 && allCurrentDone;
            const isLocked = !isCurrent && !isNext && i > currentChuDeIndex;
            const label = t.title.split(":")[1]?.trim() || t.title;

            return (
              <li key={t.id} className={["flex items-center gap-3 rounded-xl px-2.5 py-2 transition", isCurrent ? "bg-purple/15" : ""].join(" ")}>
                <span className={["grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold", isCurrent ? "bg-purple text-white" : isNext ? "bg-primary text-white" : "bg-stone-200 text-stone-400"].join(" ")}>
                  {i + 1}
                </span>
                <span className={["min-w-0 flex-1 truncate text-sm font-bold", isLocked ? "text-stone-400" : "text-navy"].join(" ")}>
                  {label}
                </span>
                {isCurrent ? (
                  <span className="flex shrink-0 items-center gap-1 text-xs font-extrabold text-stone-500">
                    {completedCount}/{totalChangs} chặng
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  </span>
                ) : isNext ? (
                  <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <Lock className="h-4 w-4 shrink-0 text-stone-300" />
                )}
              </li>
            );
          })}
        </ul>

        <button
          onClick={onAdvance}
          disabled={!canAdvance}
          className={["mt-4 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-display text-sm font-extrabold shadow-card transition", canAdvance ? "bg-gradient-sunset text-navy hover:scale-[1.02]" : "cursor-not-allowed bg-muted text-muted-foreground"].join(" ")}
        >
          <BookOpenCheck className="h-4 w-4" />
          Lật sang trang tiếp theo
        </button>

        <p className="mt-3 text-center text-xs font-bold text-muted-foreground">
          {canAdvance ? (
            <><span className="text-primary">Chúc mừng!</span> Bạn đã mở khóa chủ đề tiếp theo!</>
          ) : isLast && allCurrentDone ? (
            "Bạn đã hoàn thành toàn bộ lộ trình!"
          ) : (
            <>Hoàn thành đủ <span className="text-primary">{totalChangs} chặng</span> để mở khóa trang tiếp theo nhé!</>
          )}
        </p>
      </div>
    </>
  );
}
