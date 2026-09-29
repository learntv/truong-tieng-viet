import { Container } from "@/components/layout/Container";

// Loading placeholder for the chủ đề page (RoadmapList). It mirrors that layout — hero with the
// place photo, then the rail of chặng — so nothing jumps when the real content swaps in.

function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-full bg-ink-100 ${className}`} />;
}

export function RoadmapSkeleton() {
  return (
    <div className="w-full" aria-busy="true" aria-label="Đang tải chủ đề">
      <div className="bg-gradient-to-b from-brand-50 to-white">
        <Container className="pt-6 pb-10 sm:pt-8 lg:pb-14">
          <Bar className="h-5 w-56" />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-14">
            <div>
              <Bar className="h-6 w-24" />
              <Bar className="mt-5 h-11 w-72 max-w-full" />
              <div className="mt-5 space-y-2.5">
                <Bar className="h-4 w-full max-w-xl" />
                <Bar className="h-4 w-full max-w-md" />
              </div>
              <Bar className="mt-8 h-14 w-44" />
            </div>
            <div className="aspect-[16/11] w-full animate-pulse rounded-[2rem] bg-ink-100" />
          </div>
        </Container>
      </div>

      <Container width="content" className="pt-8 pb-16">
        <Bar className="h-8 w-48" />
        <ul className="mt-8 flex flex-col gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex gap-4 sm:gap-6">
              <div className="mt-3 size-11 shrink-0 animate-pulse rounded-full bg-ink-100 sm:size-[3.25rem]" />
              <div className="flex flex-1 items-center gap-4 rounded-3xl border border-ink-100 p-3 sm:p-4">
                <div className="size-16 shrink-0 animate-pulse rounded-2xl bg-ink-100 sm:size-20" />
                <div className="flex-1 space-y-2.5">
                  <Bar className="h-3 w-16" />
                  <Bar className="h-5 w-48 max-w-full" />
                  <Bar className="h-3 w-32" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
