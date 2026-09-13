import type { ReactNode } from "react";
import { SkyBackdrop } from "@/components/home/SkyBackdrop";

/**
 * The sky background every non-home page sits on, holding one flat white
 * card for its content. Same backdrop as the homepage, but a single plain
 * card instead of a stack of tinted SkyBoxes — sub-pages don't need the tone
 * system, just somewhere readable to put their content.
 *
 * `card={false}` drops that white sheet and lets the page lay its own pieces
 * straight onto the sky — for pages that are already a set of framed tiles and
 * would only be boxed in twice.
 *
 * pb-44/pb-56 repeats HomePage's own clearance so the card never overlaps the
 * backdrop's grass band at the bottom.
 */
export function SkyPage({ children, card = true }: { children: ReactNode; card?: boolean }) {
  return (
    <div className="relative isolate overflow-hidden">
      <SkyBackdrop density="sparse" />
      <main className="relative w-full px-4 pb-44 pt-6 sm:px-6 sm:pb-56 sm:pt-10">
        {card ? (
          <div className="mx-auto w-full max-w-5xl overflow-hidden border-[6px] border-white bg-white shadow-2xl sm:border-[8px]">
            {children}
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
