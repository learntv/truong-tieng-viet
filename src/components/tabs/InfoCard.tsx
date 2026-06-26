import type { LucideIcon } from "lucide-react";

const accentMap = {
  primary: { icon: "bg-primary text-white", card: "bg-red-50 border-red-200", heading: "text-red-900" },
  green:   { icon: "bg-green text-navy",    card: "bg-emerald-50 border-emerald-200", heading: "text-emerald-900" },
  purple:  { icon: "bg-purple text-white",  card: "bg-violet-50 border-violet-200", heading: "text-violet-900" },
  orange:  { icon: "bg-[oklch(0.7_0.17_55)] text-white", card: "bg-orange-50 border-orange-200", heading: "text-orange-900" },
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
  const a = accentMap[accent];
  return (
    <article className={`group flex h-full gap-4 rounded-2xl border-2 p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg ${a.card}`}>
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-card transition-transform group-hover:scale-105 ${a.icon}`}>
        <Icon className="h-6 w-6" strokeWidth={2.4} />
      </span>
      <div className="min-w-0">
        <h3 className={`font-display text-lg font-extrabold ${a.heading}`}>{heading}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{body}</p>
      </div>
    </article>
  );
}
