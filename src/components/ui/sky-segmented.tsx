import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A pick-one row to sit beside the house button (see ./sky-button.ts): a pale
 * track holding the options, the chosen one lifted out as a white button with
 * the same radius and indigo shadow. For switching between views or settings,
 * not for actions.
 */
export function SkySegmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: readonly { value: T; label: string; icon?: LucideIcon | null }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex gap-1 rounded-[0.8rem] bg-box-white-deep p-1", className)}
    >
      {options.map((o) => {
        const Icon = o.icon;
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[0.6rem] px-3 py-1.5 font-display text-sm font-bold transition-[colors,box-shadow] sm:text-base",
              active
                ? "bg-white text-indigo-deep shadow-btn"
                : "text-sky-ink-soft hover:bg-white/60 hover:text-indigo-deep",
            )}
          >
            {Icon && <Icon className="h-4 w-4" strokeWidth={2.5} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
