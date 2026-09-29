import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The one button family. Pill-shaped, bold, and physical in a quiet way: a
 * soft offset shadow at rest, a one-pixel lift on hover, a press on :active.
 *
 * `variant` picks the role (primary action, secondary, outline, ghost, link,
 * destructive); `tone` recolors the solid variant for the lesson screens,
 * where a stage's own hue is the primary action.
 */
const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold",
    "transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out",
    "active:translate-y-px active:duration-75",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:size-[1.15em] [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "text-white shadow-[0_1px_2px_rgb(20_28_49/0.12),0_4px_12px_-2px_var(--btn-glow)] hover:-translate-y-px hover:shadow-[0_2px_4px_rgb(20_28_49/0.1),0_10px_22px_-4px_var(--btn-glow)]",
        secondary: "bg-brand-50 text-brand-700 hover:bg-brand-100",
        outline:
          "border border-ink-200 bg-white text-ink-800 shadow-xs hover:border-ink-300 hover:bg-ink-25",
        ghost: "text-ink-700 hover:bg-ink-50 hover:text-ink-900",
        link: "h-auto! rounded-sm px-0! text-brand-600 underline-offset-4 hover:underline",
        destructive:
          "bg-danger-600 text-white shadow-sm hover:-translate-y-px hover:bg-danger-700 hover:shadow-md",
        white: "bg-white text-ink-900 shadow-sm hover:-translate-y-px hover:shadow-md",
      },
      tone: {
        primary: "",
        neutral: "",
        "stage-1": "",
        "stage-2": "",
        "stage-3": "",
        "stage-4": "",
        "stage-5": "",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        default: "h-11 px-5 text-[0.9375rem]",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-[1.0625rem]",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        tone: "primary",
        class: "bg-brand-600 [--btn-glow:rgb(48_86_245/0.4)] hover:bg-brand-700",
      },
      {
        variant: "default",
        tone: "neutral",
        class:
          "border border-ink-200 bg-white text-ink-800! [--btn-glow:rgb(20_28_49/0.08)] hover:bg-ink-25",
      },
      {
        variant: "default",
        tone: "stage-1",
        class: "bg-stage-1 [--btn-glow:rgb(15_133_68/0.4)] hover:bg-stage-1-deep",
      },
      {
        variant: "default",
        tone: "stage-2",
        class: "bg-stage-2 [--btn-glow:rgb(10_127_166/0.4)] hover:bg-stage-2-deep",
      },
      {
        variant: "default",
        tone: "stage-3",
        class: "bg-stage-3 [--btn-glow:rgb(116_66_232/0.4)] hover:bg-stage-3-deep",
      },
      {
        variant: "default",
        tone: "stage-4",
        class: "bg-stage-4 [--btn-glow:rgb(217_60_23/0.4)] hover:bg-stage-4-deep",
      },
      {
        variant: "default",
        tone: "stage-5",
        class: "bg-stage-5 [--btn-glow:rgb(214_36_111/0.4)] hover:bg-stage-5-deep",
      },
    ],
    defaultVariants: {
      variant: "default",
      tone: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, tone, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, tone, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
