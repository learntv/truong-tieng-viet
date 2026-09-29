"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const TONE_FILL: Record<string, string> = {
  primary: "bg-brand-500",
  "stage-1": "bg-stage-1-bright",
  "stage-2": "bg-stage-2-bright",
  "stage-3": "bg-stage-3-bright",
  "stage-4": "bg-stage-4-bright",
  "stage-5": "bg-stage-5-bright",
};

export interface ProgressProps extends React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> {
  tone?: keyof typeof TONE_FILL;
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, tone = "primary", ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-ink-100", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 rounded-full transition-transform duration-500 ease-out",
          TONE_FILL[tone],
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  ),
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
