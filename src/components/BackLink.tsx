import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

type LinkTo = React.ComponentProps<typeof Link>["to"];

/** "← Học tập": a quiet pill naming where it goes back to. */
export function BackLink({
  to,
  label,
  className,
}: {
  to: LinkTo;
  label: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex h-9 items-center gap-1.5 rounded-full border border-ink-100 bg-white/80 pr-4 pl-3 text-sm font-semibold text-ink-700 shadow-xs backdrop-blur-sm transition-colors hover:border-ink-200 hover:text-ink-900",
        className,
      )}
    >
      <ArrowLeft
        className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
        strokeWidth={2.5}
        aria-hidden
      />
      {label}
    </Link>
  );
}
