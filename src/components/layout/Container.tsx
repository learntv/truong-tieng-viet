import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The horizontal measures available inside the boxed page.
 *
 * The page card already caps the outer width at `--layout-max`, so these are
 * only ever *narrower* than that — they pick how wide a given block of content
 * is allowed to run, not how wide the page is. Use the name, never a raw
 * `max-w-*`: that is what keeps one page looking like the next.
 */
const WIDTH = {
  /** The full width of the card. Grids, maps, card decks, dashboards. */
  wide: "max-w-none",
  /** Mixed content that shouldn't run the whole card width. */
  content: "max-w-5xl",
  /** Long-form reading: policies, guides, FAQ, articles. */
  prose: "max-w-3xl",
  /** Single-column screens: leaderboard, profile, a lesson list. */
  narrow: "max-w-2xl",
  /** A form rendered as a whole page: sign-in, reset password. */
  form: "max-w-sm",
} as const;

export type ContainerWidth = keyof typeof WIDTH;

/**
 * Centres content inside the page card and applies the card's inner padding.
 *
 * Always reach for this instead of writing `mx-auto max-w-… px-4 sm:px-6` by
 * hand — the padding is a token, so the gutter stays identical on every page
 * even when the token changes.
 */
export function Container({
  width = "wide",
  className,
  children,
  ...rest
}: {
  width?: ContainerWidth;
  className?: string;
  children: ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--layout-pad)] sm:px-[var(--layout-pad-sm)]",
        WIDTH[width],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
