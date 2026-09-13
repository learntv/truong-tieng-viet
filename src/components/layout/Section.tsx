import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container, type ContainerWidth } from "./Container";

/**
 * Background bands. A band paints the full width of the page card and is
 * clipped by its rounded corners — inside a boxed layout there is no such thing
 * as a "full-bleed" band any more, so pages never need the old
 * `-mx-4 sm:-mx-6` escape hatches.
 */
const BAND = {
  /** Inherit whatever is behind — the default. */
  none: "",
  /** The card's own white. */
  plain: "bg-background",
  /** Warm off-white, for quietly separating a band from the one above. */
  subtle: "bg-surface-subtle",
  /** Red-tinted band from the brand theme. */
  tint: "bg-sky-tint",
  /** Deep red band, white ink. */
  indigo: "bg-indigo text-white",
  /** Navy band, white ink. */
  navy: "bg-navy text-white",
} as const;

/**
 * Vertical rhythm. Four steps, so stacked sections on different pages breathe
 * the same way.
 */
const SPACE = {
  none: "",
  tight: "py-6 sm:py-8",
  default: "py-10 sm:py-14",
  loose: "py-16 sm:py-24",
} as const;

export type SectionBand = keyof typeof BAND;
export type SectionSpace = keyof typeof SPACE;

/**
 * One horizontal band of a page: a background, the standard vertical rhythm,
 * and a centred <Container> for its contents.
 *
 * Pass `bare` when the children need to control their own container (a section
 * with a full-width image beside a narrow column, say); otherwise the children
 * are wrapped for you and a page body is just a stack of <Section>s.
 */
export function Section({
  band = "none",
  space = "default",
  width = "wide",
  bare = false,
  className,
  containerClassName,
  children,
  ...rest
}: {
  band?: SectionBand;
  space?: SectionSpace;
  width?: ContainerWidth;
  bare?: boolean;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">) {
  return (
    <section className={cn("w-full", BAND[band], SPACE[space], className)} {...rest}>
      {bare ? (
        children
      ) : (
        <Container width={width} className={containerClassName}>
          {children}
        </Container>
      )}
    </section>
  );
}
