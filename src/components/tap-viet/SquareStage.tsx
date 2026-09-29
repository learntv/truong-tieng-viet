import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The biggest square that fits the space left over in the popup. The outer box
 * takes whatever height its grid row (or flex column) leaves (the popup has a fixed height
 * and never scrolls) and becomes a size container, so the inner square can be
 * as wide as the smaller of its width and height — times `fill`, which leaves
 * some breathing room so it doesn't press against the controls around it.
 */
export function SquareStage({
  className,
  // One size for both, so the video and the drawing pad beside it always match.
  fill = 0.78,
  children,
}: {
  className?: string;
  /** Share of the available space the square takes, 0–1. */
  fill?: number;
  children: ReactNode;
}) {
  const pct = fill * 100;
  return (
    <div className="flex h-full min-h-0 w-full flex-1 items-center justify-center [container-type:size]">
      <div
        className={cn("relative aspect-square", className)}
        style={{ width: `min(${pct}cqw, ${pct}cqh)` }}
      >
        {children}
      </div>
    </div>
  );
}
