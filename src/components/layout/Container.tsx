import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The site's horizontal measures. Pick by name, never with a raw `max-w-*`,
 * so one page's column lines up with the next page's and with the navbar.
 */
const WIDTH = {
  /** The full site column — navbar, footer, grids, maps, dashboards. */
  wide: "max-w-7xl",
  /** Mixed content that shouldn't run the full column. */
  content: "max-w-5xl",
  /** Long-form reading: policies, guides, FAQ. ~70ch of body copy. */
  prose: "max-w-3xl",
  /** Single-column screens: leaderboard, profile. */
  narrow: "max-w-2xl",
  /** A form as a whole page: sign-in, reset password. */
  form: "max-w-md",
} as const;

export type ContainerWidth = keyof typeof WIDTH;

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
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", WIDTH[width], className)} {...rest}>
      {children}
    </div>
  );
}
