// Loading placeholders. Each mirrors the layout it stands in for, so the page doesn't jump when
// the real content swaps in.

/** Shimmering block, sized by the caller. `onDark` tints it for the coloured stat band. */
function Bar({ className, onDark }: { className: string; onDark?: boolean }) {
  return (
    <div
      className={`animate-pulse rounded-sm ${onDark ? "bg-white/25" : "bg-black/[0.06]"} ${className}`}
    />
  );
}

/**
 * Placeholder for the chủ đề page (RoadmapList): full-bleed hero band with the place photo, the
 * coloured stat band, then the grid of chặng cards.
 */
export function RoadmapSkeleton() {
  return (
    <div className="w-full">
      {/* Hero band */}
      <div className="w-full bg-rose-tint">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
          <Bar className="h-4 w-56" />

          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
            <div className="min-w-0">
              <Bar className="h-9 w-64 max-w-full sm:h-10 lg:h-12 lg:w-80" />
              <div className="mt-4 space-y-2.5">
                <Bar className="h-4 w-full max-w-xl" />
                <Bar className="h-4 w-full max-w-md" />
              </div>
              <Bar className="mt-7 h-11 w-40" />
            </div>

            <Bar className="aspect-[16/10] w-full rounded-none" />
          </div>
        </div>
      </div>

      {/* Stat band */}
      <div className="w-full bg-teal-deep">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-10 gap-y-5 px-6 py-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-3">
            <Bar onDark className="h-6 w-6 shrink-0 rounded-full" />
            <div className="min-w-0">
              <Bar onDark className="h-4 w-48" />
              <Bar onDark className="mt-1.5 h-1 w-48" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Bar onDark className="h-9 w-9 shrink-0 rounded-full" />
            <Bar onDark className="h-4 w-52" />
          </div>
        </div>
      </div>

      {/* Chặng grid */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-12">
        <Bar className="h-6 w-52 sm:h-7" />

        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="flex flex-col border border-border bg-card">
              {/* Cover */}
              <div className="aspect-[16/9] w-full animate-pulse bg-black/[0.06]" />

              <div className="flex flex-1 flex-col p-5">
                <Bar className="h-3 w-20" />
                <div className="mt-3 space-y-2">
                  <Bar className="h-4 w-28" />
                  <Bar className="h-4 w-36" />
                </div>
                <Bar className="mt-5 h-8 w-28 self-start" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
