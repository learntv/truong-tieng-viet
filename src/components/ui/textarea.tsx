import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-24 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900 shadow-xs transition-[border-color,box-shadow] duration-150 placeholder:text-ink-400 hover:border-ink-300 focus-visible:border-brand-500 focus-visible:shadow-[0_0_0_4px_rgb(74_108_255/0.18)] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-ink-50 disabled:opacity-60",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
