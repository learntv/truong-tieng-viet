import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

type LinkTo = React.ComponentProps<typeof Link>["to"];

/** The page's back action: a folded triangular corner in the white page's own
 *  top-left, same corner-flag treatment as the hoc-tap tiles' "Mới"/"Bắt đầu"
 *  ribbons, so leaving a page reads as peeling the same kind of tab rather
 *  than a separate button bolted on. `label` is not drawn — it's the
 *  accessible name, so screen readers still hear where it leads. */
export function BackLink({
  to,
  label,
  className,
}: {
  to: LinkTo;
  label: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={cn(
        "group absolute left-0 top-0 z-20 h-16 w-16 cursor-pointer overflow-hidden sm:h-20 sm:w-20",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-primary via-indigo to-indigo-deep transition group-hover:brightness-110"
        style={{
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          boxShadow: "inset -3px -3px 6px rgba(0,0,0,0.35), inset 2px 2px 3px rgba(255,255,255,0.25)",
        }}
      />
      <ArrowLeft
        className="absolute left-2 top-2 h-5 w-5 text-white drop-shadow-sm transition-transform group-hover:-translate-x-0.5 sm:left-2.5 sm:top-2.5"
        strokeWidth={2.5}
      />
    </Link>
  );
}
