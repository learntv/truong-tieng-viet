import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        pill: "rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        bevel:
          "rounded-full font-display font-extrabold transition-[transform,box-shadow,filter] ease-bounce hover:brightness-105 active:translate-y-[3px]",
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
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        xl: "h-14 px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    compoundVariants: [
      {
        variant: "bevel",
        tone: "primary",
        class: "bg-primary text-primary-foreground shadow-bevel-primary active:shadow-bevel-primary-active",
      },
      {
        variant: "bevel",
        tone: "neutral",
        class:
          "border-2 border-input bg-background text-foreground shadow-bevel-neutral hover:bg-accent active:shadow-bevel-neutral-active",
      },
      {
        variant: "bevel",
        tone: "stage-1",
        class: "bg-stage-1 text-white shadow-bevel-stage-1 active:shadow-bevel-stage-1-active",
      },
      {
        variant: "bevel",
        tone: "stage-2",
        class: "bg-stage-2 text-white shadow-bevel-stage-2 active:shadow-bevel-stage-2-active",
      },
      {
        variant: "bevel",
        tone: "stage-3",
        class: "bg-stage-3 text-white shadow-bevel-stage-3 active:shadow-bevel-stage-3-active",
      },
      {
        variant: "bevel",
        tone: "stage-4",
        class: "bg-stage-4 text-white shadow-bevel-stage-4 active:shadow-bevel-stage-4-active",
      },
      {
        variant: "bevel",
        tone: "stage-5",
        class: "bg-stage-5 text-white shadow-bevel-stage-5 active:shadow-bevel-stage-5-active",
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
