import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const BAND_CLASS = {
  white: "bg-background",
  subtle: "bg-surface-subtle",
  navy: "bg-navy text-white",
  sky: "bg-gradient-sky",
  night: "bg-gradient-night text-white",
};

export function Section({
  band = "white",
  className,
  children,
}: {
  band?: keyof typeof BAND_CLASS;
  className?: string;
  children: ReactNode;
}) {
  return <section className={cn("py-16 sm:py-24", BAND_CLASS[band], className)}>{children}</section>;
}

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("mx-auto max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}
