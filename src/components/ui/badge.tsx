import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Pill labels. Soft by default — a wash with the hue's own ink — so a row of
 *  badges adds color without shouting over the content they annotate. */
const badgeVariants = cva(
  "inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-caption font-semibold [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-brand-50 text-brand-700",
        solid: "bg-brand-600 text-white",
        secondary: "bg-ink-50 text-ink-600",
        outline: "border border-ink-200 bg-white text-ink-700",
        destructive: "bg-danger-50 text-danger-700",
        success: "bg-leaf-50 text-leaf-700",
        warning: "bg-sun-50 text-sun-700",
        locked: "bg-ink-50 text-ink-500",
        "stage-1": "bg-stage-1-soft text-stage-1-deep",
        "stage-2": "bg-stage-2-soft text-stage-2-deep",
        "stage-3": "bg-stage-3-soft text-stage-3-deep",
        "stage-4": "bg-stage-4-soft text-stage-4-deep",
        "stage-5": "bg-stage-5-soft text-stage-5-deep",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
