import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Share of the available space the square takes, leaving breathing room around
// the controls. One value for every stage, so the video and the pad always match.
const FILL = "78";

/**
 * The biggest square that fits the space its grid row leaves in the popup (which
 * has a fixed height and never scrolls): the outer box is a size container, so
 * the square can be FILL% of the smaller of its width and height.
 */
export function SquareStage({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 items-center justify-center [container-type:size]">
      <div
        className={cn("relative aspect-square", className)}
        style={{ width: `min(${FILL}cqw, ${FILL}cqh)` }}
      >
        {children}
      </div>
    </div>
  );
}
