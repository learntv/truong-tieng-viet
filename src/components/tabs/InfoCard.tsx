import type { LucideIcon } from "lucide-react";

const accentMap = {
  primary: "bg-primary text-white",
  green: "bg-green text-navy",
  purple: "bg-purple text-white",
  orange: "bg-[oklch(0.7_0.17_55)] text-white",
} as const;

export function InfoCard({
  heading,
  body,
  Icon,
  accent,
}: {
  heading: string;
  body: React.ReactNode;
  Icon: LucideIcon;
  accent: keyof typeof accentMap;
}) {
  return (
    <article className="group flex h-full gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-card transition-transform group-hover:scale-105 ${accentMap[accent]}`}>
        <Icon className="h-6 w-6" strokeWidth={2.4} />
      </span>
      <div className="min-w-0">
        <h3 className="font-display text-lg font-extrabold text-navy">{heading}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">{body}</p>
      </div>
    </article>
  );
}
