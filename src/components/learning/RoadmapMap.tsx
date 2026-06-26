import { Heart, Gift, Sparkles } from "lucide-react";
import type { ChuDe } from "@/data/topics";
import { BuffaloMascot } from "./BuffaloMascot";
import { StageCard } from "./StageCard";
import { ProgressBadge } from "./ProgressBadge";
import halongScene from "@/assets/halong-scene.jpg";

const NODE_POSITIONS = [
  { x: 10, y: 58 },
  { x: 28, y: 30 },
  { x: 50, y: 52 },
  { x: 72, y: 26 },
  { x: 90, y: 52 },
];

const TIPS = [
  { Icon: Heart, iconBg: "bg-rose-100 text-rose-600", lines: ["Học mỗi ngày một chút,", "Tiếng Việt thêm yêu hơn!"] },
  { Icon: Gift, iconBg: "bg-orange-100 text-orange-600", lines: ["Cố gắng hôm nay", "Tự tin ngày mai"] },
];

export function RoadmapMap({
  chuDes,
  chuDe,
  chuDeIndex,
  changTitles,
  changEmojis,
  currentChangIndex,
  completedChangs,
  onSelectStage,
  completedCount,
  allCurrentDone,
  isLast,
  onAdvance,
}: {
  chuDes: ChuDe[];
  chuDe: ChuDe;
  chuDeIndex: number;
  changTitles: string[];
  changEmojis: string[];
  currentChangIndex: number;
  completedChangs: Set<number>;
  onSelectStage: (i: number) => void;
  completedCount: number;
  allCurrentDone: boolean;
  isLast: boolean;
  onAdvance: () => void;
}) {
  const bookNumber = chuDeIndex < 4 ? 1 : 2;

  const pathD = NODE_POSITIONS.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} Q ${cx} ${prev.y}, ${p.x} ${p.y}`;
  }, "");

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl shadow-soft">
      <img
        src={halongScene}
        alt="Phong cảnh Việt Nam — Vịnh Hạ Long và Hội An"
        width={1600}
        height={1100}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky/60 via-transparent to-white/10" />

      {/* Top bar */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-4 pt-3 sm:px-6 sm:pt-4">
        <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-navy shadow-card backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
          <span>Quyển {bookNumber}</span>
          <span className="text-muted-foreground">›</span>
          <span>Vui học Tiếng Việt</span>
        </div>
        <ProgressBadge
          chuDes={chuDes}
          currentChuDeIndex={chuDeIndex}
          completedCount={completedCount}
          totalChangs={changTitles.length}
          allCurrentDone={allCurrentDone}
          isLast={isLast}
          onAdvance={onAdvance}
        />
      </div>

      {/* Title */}
      <div className="relative z-20 mx-auto mt-2 flex max-w-3xl shrink-0 items-center justify-center gap-2 px-4 text-center sm:mt-3">
        <Sparkles className="h-5 w-5 shrink-0 text-yellow-400 sm:h-7 sm:w-7" />
        <h1 className="font-display text-xl font-extrabold text-primary [text-shadow:0_2px_0_white,0_-1px_0_white,2px_0_0_white,-2px_0_0_white] sm:text-3xl">
          VUI HỌC TIẾNG VIỆT
        </h1>
        <Sparkles className="h-5 w-5 shrink-0 text-yellow-400 sm:h-7 sm:w-7" />
      </div>

      {/* ChuDe banner */}
      <div className="relative z-20 mx-auto mt-2 w-fit max-w-[90%] shrink-0">
        <div className="relative">
          <div className="relative rounded-2xl bg-gradient-to-b from-[oklch(0.88_0.15_80)] to-[oklch(0.75_0.18_55)] px-6 py-1.5 text-center shadow-card sm:px-10 sm:py-2">
            <div className="absolute inset-0 rounded-2xl ring-2 ring-inset ring-white/60" />
            <h2 className="relative font-display text-base font-extrabold text-white drop-shadow-[0_2px_2px_rgba(120,60,0,0.5)] sm:text-xl">
              {chuDe.title}
            </h2>
          </div>
          <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rotate-45 bg-[oklch(0.6_0.18_45)] opacity-70" />
          <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rotate-45 bg-[oklch(0.6_0.18_45)] opacity-70" />
        </div>
      </div>

      {/* Map area: SVG path + stage cards + buffalo */}
      <div className="relative z-20 mt-2 min-h-0 w-full flex-1">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d={pathD}
            fill="none"
            stroke="white"
            strokeWidth="1.4"
            strokeDasharray="2.5 2.5"
            strokeLinecap="round"
            opacity="0.95"
          />
        </svg>

        {NODE_POSITIONS.map((p, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <StageCard
              index={i}
              title={changTitles[i] ?? ""}
              emoji={changEmojis[i] ?? "📖"}
              isCurrent={i === currentChangIndex}
              isCompleted={completedChangs.has(i)}
              compact
              onClick={() => onSelectStage(i)}
            />
          </div>
        ))}

        <BuffaloMascot
          xPercent={Math.max(6, (NODE_POSITIONS[currentChangIndex]?.x ?? 10) - 6)}
          yPercent={NODE_POSITIONS[currentChangIndex]?.y ?? 58}
        />
      </div>

      {/* Tips bar */}
      <div className="relative z-20 hidden shrink-0 grid-cols-2 gap-3 p-4 sm:grid">
        {TIPS.map(({ Icon, iconBg, lines }, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-2.5 shadow-card backdrop-blur"
          >
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${iconBg}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold leading-tight text-stone-700">
              {lines.map((l, j) => (
                <p key={j}>{l}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
