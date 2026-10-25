import { Icon, type IconifyIcon } from "@iconify/react";
import { cn } from "@/lib/utils";

export function StatTile({
  icon,
  value,
  label,
  light = false,
  className,
}: {
  icon: IconifyIcon;
  value: string | number;
  label: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl px-6 py-8 text-center",
        light ? "bg-white/10" : "bg-card shadow-card",
        className,
      )}
    >
      <span
        className={cn(
          "grid h-12 w-12 place-items-center rounded-full",
          light ? "bg-white/15 text-white" : "bg-primary/10 text-primary",
        )}
      >
        <Icon icon={icon} className="h-6 w-6" aria-hidden />
      </span>
      <div className={cn("font-display text-3xl font-bold", light ? "text-white" : "text-navy")}>
        {value}
      </div>
      <p className={cn("text-sm", light ? "text-white/70" : "text-muted-foreground")}>{label}</p>
    </div>
  );
}
