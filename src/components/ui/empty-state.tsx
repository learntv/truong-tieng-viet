import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A friendly "nothing here yet" block: art or an icon tile, a heading, one
 * line of explanation and the action that fills the gap. It sits on a soft
 * dotted wash rather than in a card, so it reads as a space waiting for
 * content, not as content itself.
 */
export function EmptyState({
  icon: Icon,
  illustration,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  /** Rendered in place of the icon tile — e.g. a mascot pose. */
  illustration?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl border border-dashed border-ink-200 bg-ink-25 px-6 py-14 text-center",
        className,
      )}
    >
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]"
      />
      <div className="relative">
        {illustration ?? (
          <span className="grid size-16 place-items-center rounded-2xl bg-white text-brand-600 shadow-sm">
            <Icon className="size-8" strokeWidth={2} />
          </span>
        )}
      </div>
      <div className="relative flex max-w-sm flex-col gap-2">
        <h3 className="text-h3 text-ink-900">{title}</h3>
        {description && <p className="text-sm leading-relaxed text-ink-500">{description}</p>}
      </div>
      {action && <div className="relative">{action}</div>}
    </div>
  );
}
