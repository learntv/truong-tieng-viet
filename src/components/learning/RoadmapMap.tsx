import { Heart, Gift, Sparkles, Star, Volume2 } from "lucide-react";
import type { ChuDe } from "@/data/topics";
import { BuffaloMascot } from "./BuffaloMascot";
import { StageNode } from "./StageNode";
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
  { Icon: Star, iconBg: "bg-yellow-100 text-yellow-600", lines: ["Học vui – Hiểu sâu", "Tiến bộ mỗi ngày"] },
  { Icon: Gift, iconBg: "bg-orange-100 text-orange-600", lines: ["Cố gắng hôm nay", "Tự tin ngày mai"] },
];

export function RoadmapMap({
  chuDe,
  chuDeIndex,
  changTitles,
  currentChangIndex,
  completedChangs,
  onSelectStage,
  soundOn,
  onToggleSound,
}: {
  chuDe: ChuDe;
  chuDeIndex: number;
  changTitles: string[];
  currentChangIndex: number;
  completedChangs: Set<number>;
  onSelectStage: (i: number) => void;
  soundOn: boolean;
  onToggleSound: () => void;
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
      <img src={halongScene} alt="Phong cảnh Việt Nam — Vịnh Hạ Long và Hội An" width={1600} height={1100} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-sky/60 via-transparent to-white/10" />

      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-4 pt-3 sm:px-6 sm:pt-4">
        <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-navy shadow-card backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
          <span>Quyển {bookNumber}</span>
          <span className="text-muted-foreground">›</span>
          <span>Vui học Tiếng Việt</span>
        </div>
        <button onClick={onToggleSound} className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-navy shadow-card backdrop-blur transition hover:scale-105 sm:px-4 sm:py-2 sm:text-sm">
          <Volume2 className={["h-4 w-4", soundOn ? "text-primary" : "text-muted-foreground"].join(" ")} />
          Âm thanh
        </button>
      </div>

      <div className="relative z-20 mx-auto mt-2 flex max-w-3xl shrink-0 items-center justify-center gap-2 px-4 text-center sm:mt-3">
        <Sparkles className="h-5 w-5 shrink-0 text-yellow-400 sm:h-7 sm:w-7" />
        <h1 className="font-display text-xl font-extrabold text-primary [text-shadow:0_2px_0_white,0_-1px_0_white,2px_0_0_white,-2px_0_0_white] sm:text-3xl">
          VUI HỌC TIẾNG VIỆT
        </h1>
        <Sparkles className="h-5 w-5 shrink-0 text-yellow-400 sm:h-7 sm:w-7" />
      </div>

      <div className="relative z-20 mx-auto mt-2 w-fit max-w-[90%] shrink-0">
        <div className="relative">
          <div className="relative rounded-2xl bg-gradient-to-b from-[oklch(0.88_0.15_80)] to-[oklch(0.75_0.18_55)] px-6 py-1.5 text-center shadow-card sm:px-10 sm:py-2">
            <div className="absolute inset-0 rounded-2xl ring-2 ring-white/60 ring-inset" />
            <h2 className="relative font-display text-base font-extrabold text-white drop-shadow-[0_2px_2px_rgba(120,60,0,0.5)] sm:text-xl">
              {chuDe.title}
            </h2>
          </div>
          <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rotate-45 bg-[oklch(0.6_0.18_45)] opacity-70" />
          <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rotate-45 bg-[oklch(0.6_0.18_45)] opacity-70" />
        </div>
      </div>

      <div className="relative z-20 mx-auto mt-2 flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-white/95 px-4 py-1 text-xs font-extrabold text-navy shadow-card backdrop-blur sm:py-1.5 sm:text-sm">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        {completedChangs.size} chặng / {NODE_POSITIONS.length} chặng
      </div>

      <div className="relative mt-2 min-h-0 w-full flex-1">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={pathD} fill="none" stroke="white" strokeWidth="1.4" strokeDasharray="2.5 2.5" strokeLinecap="round" opacity="0.95" />
        </svg>

        {NODE_POSITIONS.map((p, i) => (
          <StageNode
            key={i}
            index={i}
            xPercent={p.x}
            yPercent={p.y}
            title={changTitles[i]}
            isCurrent={i === currentChangIndex}
            isCompleted={completedChangs.has(i)}
            onClick={() => onSelectStage(i)}
          />
        ))}

        <BuffaloMascot
          xPercent={Math.max(6, (NODE_POSITIONS[currentChangIndex]?.x ?? 10) - 6)}
          yPercent={NODE_POSITIONS[currentChangIndex]?.y ?? 58}
        />
      </div>

      <div className="relative z-20 hidden shrink-0 grid-cols-3 gap-3 p-4 sm:grid">
        {TIPS.map(({ Icon, iconBg, lines }, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-2.5 shadow-card backdrop-blur">
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${iconBg}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-xs font-bold leading-tight text-stone-700">
              {lines.map((l, j) => (<p key={j}>{l}</p>))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
