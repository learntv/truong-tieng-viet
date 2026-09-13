import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A titled block of body copy — the unit the policy and terms pages are built
 * from. Kept out of the layout primitives on purpose: <Section> decides where a
 * band sits on the page, this decides how a paragraph of prose reads inside it.
 */
export function ProseSection({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("mb-10", className)}>
      <h2 className="mb-3 font-display text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {children}
      </div>
    </section>
  );
}
