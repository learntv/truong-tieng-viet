import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A round button holding one icon, sized for a child's thumb; the label is for
 *  screen readers. `green` is the "done" action. */
export function IconButton({
  label,
  tone = "white",
  disabled,
  onClick,
  children,
}: {
  label: string;
  tone?: "white" | "green";
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-12 cursor-pointer place-items-center rounded-full transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 active:scale-90 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-6 [&_svg]:stroke-[2.5]",
        tone === "green"
          ? "bg-leaf-600 text-white shadow-[0_2px_4px_rgb(20_28_49/0.08),0_8px_18px_-6px_rgb(15_133_68/0.5)] hover:bg-leaf-700"
          : "border border-ink-100 bg-white text-ink-800 shadow-sm hover:shadow-md",
      )}
    >
      {children}
    </button>
  );
}
