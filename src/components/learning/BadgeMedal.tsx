import { Lock } from "lucide-react";
import type { Badge } from "@/data/badges";

const SIZES = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
  // The artwork is 256px square, so this is the largest size that still renders it crisply on a
  // high-density screen.
  xl: "h-44 w-44",
} as const;

/**
 * A single landmark badge. Earned badges show in full colour; uncollected ones are desaturated
 * and dimmed with a lock over them, so the artwork still reads as a goal worth reaching rather
 * than an empty slot.
 */
export function BadgeMedal({
  badge,
  earned,
  size = "md",
  className = "",
}: {
  badge: Badge;
  earned: boolean;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <div
      className={["relative shrink-0", SIZES[size], className].join(" ")}
      title={earned ? `Đã sưu tầm: ${badge.name}` : `Chưa mở khoá: ${badge.name}`}
    >
      <img
        src={badge.art}
        alt={earned ? `Huy hiệu ${badge.name}` : `Huy hiệu ${badge.name} (chưa mở khoá)`}
        className={[
          "h-full w-full object-contain transition-all duration-500",
          earned ? "" : "opacity-40 grayscale",
        ].join(" ")}
      />
      {!earned && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-1/3 w-1/3 place-items-center rounded-full bg-navy/70 text-white">
            <Lock className="h-1/2 w-1/2" strokeWidth={3} aria-hidden />
          </div>
        </div>
      )}
    </div>
  );
}
