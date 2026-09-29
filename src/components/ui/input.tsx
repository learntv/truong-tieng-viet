import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-ink-200 bg-white px-4 text-base text-ink-900 shadow-xs transition-[border-color,box-shadow] duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-400 hover:border-ink-300 focus-visible:border-brand-500 focus-visible:shadow-[0_0_0_4px_rgb(74_108_255/0.18)] focus-visible:outline-none aria-invalid:border-danger-500 aria-invalid:focus-visible:shadow-[0_0_0_4px_rgb(242_85_90/0.18)] disabled:cursor-not-allowed disabled:bg-ink-50 disabled:opacity-60",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
