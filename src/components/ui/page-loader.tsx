import { Mascot } from "@/components/Mascot";

/** Whole-page loading: Trâu con bobbing over three pulsing dots in the
 *  stage hues. `label` is announced to screen readers. */
export function PageLoader({ label = "Đang tải" }: { label?: string }) {
  return (
    <div role="status" className="flex flex-1 flex-col items-center justify-center gap-5 py-28">
      <Mascot pose="reading" size="md" decorative className="animate-bob" />
      <span aria-hidden className="flex gap-1.5">
        {["bg-brand-500", "bg-coral-500", "bg-sun-500"].map((c, i) => (
          <span
            key={c}
            className={`size-2.5 animate-pulse rounded-full ${c}`}
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}
