import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one container the sky-theme pages are built from.
 *
 * Structure, top to bottom: an optional notched ribbon tab, a lighter header
 * half carrying the title and lede, then a darker body half carrying the
 * content. The whole thing sits inside a thick white border with a generous
 * radius, and is flat — no shadow; the white border alone separates it from
 * the sky. Nothing sits loose on the background.
 *
 * Every tone is a light/deep pair so the split reads as one colour in two
 * steps rather than two different colours stacked.
 */
const TONES = {
  lavender: { head: "bg-box-lavender", body: "bg-box-lavender-deep" },
  peach: { head: "bg-box-peach", body: "bg-box-peach-deep" },
  ice: { head: "bg-box-ice", body: "bg-box-ice-deep" },
  pink: { head: "bg-box-pink", body: "bg-box-pink-deep" },
  mint: { head: "bg-box-mint", body: "bg-box-mint-deep" },
  cream: { head: "bg-box-cream", body: "bg-box-cream-deep" },
  red: { head: "bg-box-red", body: "bg-box-red-deep" },
  white: { head: "bg-white", body: "bg-box-white-deep" },
} as const;

export type SkyBoxTone = keyof typeof TONES;

/**
 * The full container. `title` (with optional `ribbon` and `lede`) renders the
 * lighter header half; `children` render the darker body half below it.
 * Omit `title` for a box that is body only.
 *
 * overflow-hidden is what lets the body run edge to edge and still pick up the
 * box's bottom corner radius, so the split needs no corner handling of its own.
 */
export function SkyBox({
  tone = "white",
  ribbon,
  title,
  lede,
  className,
  bodyClassName,
  children,
}: {
  tone?: SkyBoxTone;
  ribbon?: ReactNode;
  title?: ReactNode;
  lede?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
}) {
  const t = TONES[tone];

  return (
    <div
      className={cn(
        // 6px border on phones so it stays visible at small sizes, 8px from sm
        // up where the boxes are wide enough to carry it.
        "relative overflow-hidden rounded-[1.75rem] border-[6px] border-white sm:rounded-[2.25rem] sm:border-[8px]",
        t.head,
        className,
      )}
    >
      {(ribbon || title || lede) && (
        <div className="px-4 pt-5 pb-5 text-center sm:px-6">
          {ribbon && <SkyBoxRibbon>{ribbon}</SkyBoxRibbon>}
          {title && (
            <h2 className="font-display text-xl font-extrabold text-sky-ink sm:text-2xl">
              {title}
            </h2>
          )}
          {lede && (
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-sky-ink-soft">
              {lede}
            </p>
          )}
        </div>
      )}

      {children && <div className={cn(t.body, "px-4 py-5 sm:px-5", bodyClassName)}>{children}</div>}
    </div>
  );
}

/**
 * The yellow banner tab above the title — a rectangle with a triangular notch
 * cut into each end, the way a cloth banner tail is cut.
 */
function SkyBoxRibbon({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex justify-center">
      {/* Three nested spans, because clip-path cuts away both a border and a
        box-shadow. Outermost carries the drop-shadow filter, which traces the
        finished clipped silhouette; the middle is a white shape whose padding
        shows through as the keyline; the innermost is the yellow fill, clipped
        to the same notch so the white follows the tails. */}
      <span className="shadow-ribbon inline-block">
        <span className="clip-ribbon block bg-white p-[3px]">
          <span className="clip-ribbon block bg-ribbon px-10 py-2.5 font-display text-sm font-extrabold tracking-[0.1em] text-indigo-deep uppercase sm:px-14 sm:text-base">
            {children}
          </span>
        </span>
      </span>
    </div>
  );
}

/**
 * A white card nested inside a box's body — same border language one level
 * down, thinner so the box stays the dominant frame.
 */
export function SkyCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-xl border-[3px] border-white bg-white/75 p-4", className)}>
      {children}
    </div>
  );
}
