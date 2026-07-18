import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Vietnam Quest vintage decorative primitives — the shared "airmail / postcard
 * scrapbook" motifs used throughout the site.
 */

/** Par-avion striped ribbon. Place at the very top edge of a page/header. */
export function AirmailStripe({ className }: { className?: string }) {
  return <div className={cn("airmail-stripe h-2 w-full", className)} aria-hidden />;
}

/** A round or rounded postage stamp with a dashed perforated edge. */
export function PostageStamp({
  children,
  className,
  round = false,
}: {
  children: ReactNode;
  className?: string;
  round?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "grid place-items-center border-2 border-dashed p-2 text-center leading-tight",
        round ? "rounded-full" : "rounded-lg",
        className,
      )}
      style={{ borderColor: "color-mix(in oklab, currentColor 55%, transparent)" }}
    >
      {children}
    </div>
  );
}

/** A tilted taped photo in a polaroid frame with an optional handwritten caption. */
export function Polaroid({
  children,
  caption,
  rotate = -2,
  tape = true,
  className,
}: {
  children: ReactNode;
  caption?: ReactNode;
  rotate?: number;
  tape?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("polaroid relative", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {tape && (
        <span
          aria-hidden
          className="washi-tape absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 rounded-[2px]"
        />
      )}
      <div className="overflow-hidden rounded-[2px]">{children}</div>
      {caption != null && (
        <div className="font-hand absolute inset-x-0 bottom-2 text-center text-xl text-foreground/70">
          {caption}
        </div>
      )}
    </div>
  );
}

/** A short strip of washi tape (decorative). */
export function WashiTape({
  className,
  color,
  rotate = -3,
}: {
  className?: string;
  color?: string;
  rotate?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn("washi-tape block h-6 w-24 rounded-[2px]", className)}
      style={{
        transform: `rotate(${rotate}deg)`,
        ...(color ? { ["--tape-color" as string]: color } : {}),
      }}
    />
  );
}

/** A handwritten script caption/accent. */
export function HandNote({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-hand text-foreground/70", className)}>{children}</span>;
}

/** A typewriter-style "photo: ..." placeholder caption pill. */
export function TypeCaption({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-type inline-block rounded-sm bg-white/70 px-2 py-0.5 text-[11px] tracking-tight text-foreground/60 shadow-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
