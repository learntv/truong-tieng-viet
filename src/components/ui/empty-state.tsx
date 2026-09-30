import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A centred "nothing here yet" message. Unframed: it sits straight on the
 * page's white card rather than in a box of its own.
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
  /** Rendered in place of the icon badge — e.g. a mascot pose. */
  illustration?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-4 px-8 py-6 text-center", className)}>
      {illustration ?? (
        <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-8 w-8" strokeWidth={2} />
        </span>
      )}
      <div className="space-y-2">
        <h3 className="font-display text-xl font-bold text-navy">{title}</h3>
        {description && (
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
