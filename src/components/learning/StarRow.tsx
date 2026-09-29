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
              ? "animate-pulse text-stone-300"
              : i <= stars
                ? ["fill-yellow-400 text-yellow-500", animated && "animate-hop"]
                    .filter(Boolean)
                    .join(" ")
                : "text-stone-300",
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
