import { Sparkles } from "lucide-react";
import halongScene from "@/assets/halong-scene.jpg";

const NODE_POSITIONS = [
  { x: 10, y: 58 },
  { x: 28, y: 30 },
  { x: 50, y: 52 },
  { x: 72, y: 26 },
  { x: 90, y: 52 },
];

const pathD = NODE_POSITIONS.reduce((acc, p, i, arr) => {
  if (i === 0) return `M ${p.x} ${p.y}`;
  const prev = arr[i - 1];
  const cx = (prev.x + p.x) / 2;
  return `${acc} Q ${cx} ${prev.y}, ${p.x} ${p.y}`;
}, "");

export function RoadmapSkeleton() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl shadow-soft">
      <img
        src={halongScene}
        alt=""
        width={1600}
        height={1100}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky/60 via-transparent to-white/10" />

      {/* Top bar */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-4 pt-3 sm:px-6 sm:pt-4">
        <div className="h-8 w-40 animate-pulse rounded-full bg-white/70 sm:h-9 sm:w-52" />
        <div className="h-8 w-28 animate-pulse rounded-full bg-white/70 sm:h-9 sm:w-36" />
      </div>

      {/* Title */}
      <div className="relative z-20 mx-auto mt-2 flex max-w-3xl shrink-0 items-center justify-center gap-2 px-4 text-center sm:mt-3">
        <Sparkles className="h-5 w-5 shrink-0 text-yellow-400 sm:h-7 sm:w-7" />
        <h1 className="font-display text-xl font-extrabold text-primary [text-shadow:0_2px_0_white,0_-1px_0_white,2px_0_0_white,-2px_0_0_white] sm:text-3xl">
          VUI HỌC TIẾNG VIỆT
        </h1>
        <Sparkles className="h-5 w-5 shrink-0 text-yellow-400 sm:h-7 sm:w-7" />
      </div>

      {/* ChuDe banner skeleton */}
      <div className="relative z-20 mx-auto mt-2 w-fit max-w-[90%] shrink-0">
        <div className="h-9 w-48 animate-pulse rounded-2xl bg-amber-300/70 sm:h-11 sm:w-64" />
      </div>

      {/* Map area */}
      <div
        className="relative z-20 min-h-0 w-full flex-1 overflow-x-auto sm:overflow-x-hidden"
        style={{ marginTop: "calc(0.5rem - 3.5rem)", paddingTop: "3.5rem" }}
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

          {NODE_POSITIONS.map((p, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translateX(-50%) translateY(-72px)",
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="h-16 w-16 animate-pulse rounded-2xl bg-white/70 shadow-card sm:h-20 sm:w-20" />
                <div className="h-3 w-14 animate-pulse rounded-full bg-white/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
