// Loading placeholders. Each mirrors the layout it stands in for, so the page doesn't jump when
// the real content swaps in.

/** Shimmering block, sized by the caller. */
function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-full bg-black/[0.06] ${className}`} />;
}

/**
 * Placeholder for the chủ đề page (RoadmapList): header spread with photo and progress panel,
 * then the chặng list.
 */
export function RoadmapSkeleton() {
  return (
    <div className="w-full px-3 pt-8 pb-10 sm:px-4 sm:pt-12">
      <div className="mx-auto max-w-7xl">
        {/* Header spread */}
        <div className="rounded-[1.75rem] border border-border bg-card p-4 shadow-card ring-1 ring-black/[0.03] sm:p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
            <div className="min-w-0">
              <Bar className="h-6 w-28 rounded-md" />
              <Bar className="mt-3 h-9 w-64 sm:h-11" />
              <div className="mt-4 space-y-2">
                <Bar className="h-3.5 w-full max-w-md" />
                <Bar className="h-3.5 w-full max-w-sm" />
                <Bar className="h-3.5 w-40" />
              </div>
              <Bar className="mt-5 h-10 w-44" />
            </div>

            <div className="min-w-0">
              <div className="animate-pulse rounded-[3px] bg-black/[0.06] p-2 pb-3">
                <div className="h-40 w-full rounded-[2px] bg-black/[0.05] sm:h-48" />
              </div>
              <div className="mt-6 rounded-xl border border-navy/10 bg-muted/40 px-4 py-3.5">
                <Bar className="h-4 w-32" />
                <Bar className="mt-2 h-2.5 w-full" />
                <Bar className="mt-2 h-3 w-40" />
              </div>
            </div>
          </div>
        </div>

        {/* Chặng list + side notes */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <Bar className="h-5 w-48" />
              <Bar className="h-3.5 w-24" />
            </div>
            <ul className="divide-y divide-border/60">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="relative">
                  <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-black/[0.06]" />
                  <div className="flex items-center gap-3 py-3 pl-5 pr-3 sm:gap-4 sm:pl-6 sm:pr-4">
                    <Bar className="h-8 w-8 shrink-0" />
                    <Bar className="h-11 w-11 shrink-0 rounded-2xl sm:h-12 sm:w-12" />
                    <div className="min-w-0 flex-1">
                      <Bar className="h-4 w-40 sm:w-56" />
                      <Bar className="mt-2 h-3 w-28" />
                    </div>
                    <Bar className="h-8 w-8 shrink-0" />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:content-start">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card"
              >
                <Bar className="h-10 w-10 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <Bar className="h-4 w-32" />
                  <Bar className="mt-2 h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Placeholder for the overworld map hub — one big card at the artwork's aspect ratio. */
export function OverworldSkeleton() {
  return (
    <section className="w-full">
      <div className="w-full px-3 pt-8 pb-8 sm:px-4 sm:pt-12">
        <Bar className="mx-auto mb-4 h-4 w-80 max-w-full" />
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-border shadow-card ring-1 ring-black/[0.03]">
          <div className="aspect-[3/2] w-full animate-pulse bg-black/[0.06]" />
        </div>
      </div>
    </section>
  );
}
