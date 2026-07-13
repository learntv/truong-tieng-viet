import { Fragment } from "react";
import halongScene from "@/assets/halong-scene.jpg";

const NODE_POSITIONS = [
  { x: 10, y: 58 },
  { x: 28, y: 30 },
  { x: 50, y: 52 },
  { x: 72, y: 26 },
  { x: 90, y: 52 },
];

const pathSegments = NODE_POSITIONS.slice(1).map((p, i) => {
  const prev = NODE_POSITIONS[i];
  const cx = (prev.x + p.x) / 2;
  return `M ${prev.x} ${prev.y} Q ${cx} ${prev.y}, ${p.x} ${p.y}`;
});

// Mirrors RoadmapMap's card/header/map layout so the loading state doesn't jump when real
// content swaps in.
export function RoadmapSkeleton() {
  return (
    <div className="relative w-full">
      <div className="w-full px-3 pt-8 pb-8 sm:px-4 sm:pt-12">
        <div className="relative z-20 mx-auto flex max-w-7xl flex-col overflow-hidden rounded-[1.75rem] border-2 border-black/10 shadow-[0_4px_0_0_rgba(0,0,0,0.1)]">
          {/* Header */}
          <div className="flex flex-col gap-2.5 bg-white p-3 sm:gap-3 sm:p-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-[1.15rem] bg-black/[0.06] sm:h-12 sm:w-12" />
              <div className="h-12 w-9 shrink-0 animate-pulse rounded-lg bg-black/[0.06] sm:h-14 sm:w-11" />
              <div className="min-w-0 flex-1">
                <div className="h-5 w-40 animate-pulse rounded-full bg-black/[0.06] sm:h-7 sm:w-56" />
              </div>
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-black/[0.06] sm:h-10 sm:w-10" />
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-black/[0.06] sm:h-10 sm:w-10" />
              </div>
            </div>

            {/* Progress stepper */}
            <div className="flex items-center rounded-full border-2 border-black/10 bg-black/[0.04] px-3 py-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] sm:px-3.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <Fragment key={i}>
                  {i > 0 && <div className="h-1.5 flex-1 rounded-full bg-black/10" />}
                  <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-black/[0.08] sm:h-8 sm:w-8" />
                </Fragment>
              ))}
            </div>
          </div>

          {/* Map */}
          <div
            className="relative h-[78vh] min-h-[560px] w-full overflow-x-auto overflow-y-hidden bg-cover bg-center bg-no-repeat sm:overflow-x-hidden"
            style={{ backgroundImage: `url(${halongScene})`, paddingTop: "4rem" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-200/25 via-transparent to-white/10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/25 to-transparent" />

            <div className="relative h-full min-w-[760px] sm:min-w-0">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {pathSegments.map((d, i) => (
                  <path
                    key={`halo-${i}`}
                    d={d}
                    fill="none"
                    stroke="#a3a3a3"
                    strokeWidth="1.8"
                    strokeDasharray="2.5 2.5"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                ))}
                {pathSegments.map((d, i) => (
                  <path
                    key={`line-${i}`}
                    d={d}
                    fill="none"
                    stroke="white"
                    strokeWidth="1.4"
                    strokeDasharray="2.5 2.5"
                    strokeLinecap="round"
                    opacity="0.95"
                  />
                ))}
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
                  <div className="flex w-20 flex-col items-center gap-2 sm:w-24">
                    <div className="h-16 w-16 animate-pulse rounded-2xl border-2 border-black/10 bg-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] sm:h-20 sm:w-20" />
                    <div className="h-3 w-14 animate-pulse rounded-full bg-white/70" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
