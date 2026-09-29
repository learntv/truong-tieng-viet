import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The biggest square that fits the space left over in the popup. The outer box
 * takes whatever height the flex column leaves (the popup has a fixed height
 * and never scrolls) and becomes a size container, so the inner square can be
 * as wide as the smaller of its width and height.
 */
export function SquareStage({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-0 w-full flex-1 items-center justify-center [container-type:size]">
      <div className={cn("relative aspect-square w-[min(100cqw,100cqh)]", className)}>
        {children}
      </div>
    </div>
  );
}
