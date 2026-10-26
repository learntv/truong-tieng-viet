import type { ReactNode } from "react";
import { SkyBackdrop } from "@/components/home/SkyBackdrop";

/**
 * The sky background every non-home page sits on, holding one flat card of
 * pale lawn for its content: PageBanner's grass fades down into it, so a
 * sub-page reads as one meadow, sky on top and grass under the content. Same
 * backdrop as the homepage, but a single plain card instead of a stack of
 * tinted SkyBoxes.
 *
 * `card={false}` drops that lawn sheet and lets the page lay its own pieces
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
          // --muted-foreground only manages 2.7:1 on the full --grass at the top
          // of PageBanner's fade, so inside the card it becomes the footer's
          // grass ink (4.8:1 there, darker still on the lawn and on white).
          <div className="mx-auto w-full max-w-6xl overflow-hidden bg-meadow-lawn shadow-sheet [--muted-foreground:var(--grass-ink-soft)]">
            {children}
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
