import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container, type ContainerWidth } from "./Container";

/** Background bands — white is the default; tint and wash separate a band
 *  from its neighbours without a rule. */
const BAND = {
  none: "",
  white: "bg-white",
  tint: "bg-ink-25",
  wash: "bg-wash",
} as const;

/** Vertical rhythm: four steps, so stacked sections breathe the same way on
 *  every page. */
const SPACE = {
  none: "",
  tight: "py-8 sm:py-10",
  default: "py-12 sm:py-16",
  loose: "py-16 sm:py-24",
} as const;

export type SectionBand = keyof typeof BAND;
export type SectionSpace = keyof typeof SPACE;

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
  /** Children lay out their own container. */
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

/** A section's heading row: title, optional one-line lede, optional action on
 *  the right. More space above than below, so it belongs to what follows. */
export function SectionHeading({
  title,
  lede,
  action,
  id,
  align = "left",
  className,
}: {
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:mb-10",
        centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("flex max-w-2xl flex-col gap-3", centered && "items-center")}>
        <h2 id={id} className="text-h2 text-ink-900">
          {title}
        </h2>
        {lede && <p className="text-lede text-ink-600">{lede}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
