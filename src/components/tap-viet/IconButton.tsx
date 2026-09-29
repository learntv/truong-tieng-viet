import type { ReactNode } from "react";
import { skyButton } from "@/components/ui/sky-button";

/** A square house button holding one icon; the label is for screen readers. */
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
      className={skyButton(
        tone,
        "h-12 w-12 p-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none [&_svg]:h-6 [&_svg]:w-6 [&_svg]:stroke-[2.5]",
      )}
    >
      {children}
    </button>
  );
}
