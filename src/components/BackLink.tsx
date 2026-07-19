import { Link } from "@tanstack/react-router";
import { Undo2 } from "lucide-react";

import { cn } from "@/lib/utils";

type LinkTo = React.ComponentProps<typeof Link>["to"];

/** The round "go back up a level" arrow that sits above a page's header.
 *  Same treatment as the back button floating over the Quyển 1 overworld map,
 *  since it is the same action from the child's point of view.
 *  `label` is not drawn — it's the accessible name, so screen readers still
 *  hear where the arrow leads. */
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
      aria-label={label}
      className={cn(
        "grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full bg-white/90 text-primary shadow-[0_2px_0_0_rgba(0,0,0,0.15)] ring-1 ring-black/10 transition hover:scale-105 active:translate-y-[1px] sm:h-11 sm:w-11",
        className,
      )}
    >
      <Undo2 className="h-5 w-5" strokeWidth={2.5} />
    </Link>
  );
}
