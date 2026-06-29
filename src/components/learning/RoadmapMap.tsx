import { Sparkles } from "lucide-react";
import type { ChuDe } from "@/data/topics";
import { BuffaloMascot } from "./BuffaloMascot";
import { StageCard, STAGE_COLORS } from "./StageCard";
import { ProgressBadge } from "./ProgressBadge";
import halongScene from "@/assets/halong-scene.jpg";

const NODE_POSITIONS = [
  { x: 10, y: 58 },
  { x: 28, y: 30 },
  { x: 50, y: 52 },
  { x: 72, y: 26 },
  { x: 90, y: 52 },
];


function getLessonButtonLabel(
  index: number,
  completedChangs: Set<number>,
  startedChangs: Set<number>,
): string {
  if (completedChangs.has(index)) return "Ôn tập";
  if (startedChangs.has(index)) return "Tiếp tục";
  return "Bắt đầu";
}

export function RoadmapMap({
  chuDes,
  chuDe,
  chuDeIndex,
  changTitles,
  changEmojis,
  currentChangIndex,
  buffaloChangIndex,
  completedChangs,
  startedChangs,
  selectedChangIndex,
  onSelectStage,
  onOpenLesson,
  completedCount,
  allCurrentDone,
  isLast,
  onAdvance,
  changProgress,
}: {
  chuDes: ChuDe[];
  chuDe: ChuDe;
  chuDeIndex: number;
  changTitles: string[];
  changEmojis: string[];
  currentChangIndex: number;
  buffaloChangIndex: number;
  completedChangs: Set<number>;
  startedChangs: Set<number>;
  selectedChangIndex: number | null;
  onSelectStage: (i: number) => void;
  onOpenLesson: (i: number) => void;
  completedCount: number;
  allCurrentDone: boolean;
  isLast: boolean;
  onAdvance: () => void;
  changProgress: Map<number, { current: number; total: number }>;
}) {
  const bookNumber = chuDeIndex < 4 ? 1 : 2;
  const buffaloIndex = buffaloChangIndex;

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
      <div
        className="relative z-20 min-h-0 w-full flex-1 overflow-x-auto sm:overflow-x-hidden"
        style={{ marginTop: 'calc(0.5rem - 3.5rem)', paddingTop: '3.5rem' }}
      >
        <div className="relative h-full min-w-[760px] sm:min-w-0">
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

          {NODE_POSITIONS.map((p, i) => {
            const isLocked = i > 0 && !completedChangs.has(i - 1);
            return (
              <div
                key={i}
                className="absolute"
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translateX(-50%) translateY(-72px)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {i === currentChangIndex && !isLocked && (
                  <div className="animate-float-badge absolute -top-11 left-1/2 flex -translate-x-1/2 flex-col items-center whitespace-nowrap">
                    <div className={["rounded-xl px-3 py-1.5 text-[11px] font-extrabold text-white shadow-lg bg-gradient-to-r", STAGE_COLORS[i % STAGE_COLORS.length].stripe].join(" ")}>
                      Đang học
                    </div>
                    <div
                      className="h-0 w-0"
                      style={{
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: `8px solid ${STAGE_COLORS[i % STAGE_COLORS.length].scrollThumb}`,
                      }}
                    />
                  </div>
                )}
                <StageCard
                  index={i}
                  title={changTitles[i] ?? ""}
                  emoji={changEmojis[i] ?? "📖"}
                  isCurrent={i === currentChangIndex}
                  isCompleted={completedChangs.has(i)}
                  isLocked={isLocked}
                  isSelected={!isLocked && selectedChangIndex === i}
                  openLabel={getLessonButtonLabel(i, completedChangs, startedChangs)}
                  compact
                  noiDungProgress={changProgress.get(i)}
                  onClick={() => { if (!isLocked) onSelectStage(i); }}
                  onOpen={() => { if (!isLocked) onOpenLesson(i); }}
                />
              </div>
            );
          })}

          <BuffaloMascot
            xPercent={Math.max(6, (NODE_POSITIONS[buffaloIndex]?.x ?? 10) - 6)}
            yPercent={NODE_POSITIONS[buffaloIndex]?.y ?? 58}
          />
        </div>
      </div>

    </div>
  );
}
