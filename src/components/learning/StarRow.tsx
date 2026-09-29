import { Star } from "lucide-react";
import type { Stars } from "@/lib/speech";

export function StarRow({
  stars,
  size = "h-9 w-9",
  animated = true,
  loading = false,
}: {
  stars: Stars;
  size?: string;
  animated?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="flex justify-center gap-1.5">
      {([1, 2, 3] as const).map((i) => (
        <Star
          key={i}
          className={[
            size,
            "transition-transform",
            loading
              ? "animate-pulse fill-ink-100 text-ink-200"
              : i <= stars
                ? ["fill-sun-500 text-sun-600", animated && "animate-hop"].filter(Boolean).join(" ")
                : "fill-ink-50 text-ink-200",
          ].join(" ")}
          style={
            !loading && animated && i <= stars
              ? { animationDelay: `${(i - 1) * 120}ms` }
              : undefined
          }
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
