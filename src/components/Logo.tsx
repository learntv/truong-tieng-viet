import { cn } from "@/lib/utils";

const SIZES = {
  sm: { badge: "h-10 w-10 text-base", text: "text-sm" },
  md: { badge: "h-11 w-11 text-lg", text: "text-base" },
};

export function Logo({
  size = "md",
  light = false,
  className,
}: {
  size?: keyof typeof SIZES;
  light?: boolean;
  className?: string;
}) {
  const { badge, text } = SIZES[size];
  return (
    <div className={cn("flex shrink-0 items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid place-items-center rounded-full bg-primary text-white shadow-card",
          badge,
        )}
      >
        ★
      </span>
      <div className="text-left leading-tight">
        <div
          className={cn(
            "font-display font-extrabold leading-none",
            text,
            light ? "text-white" : "text-primary",
          )}
        >
          Trường Tiếng Việt
        </div>
        <div
          className={cn(
            "font-display font-extrabold leading-none",
            text,
            light ? "text-white/85" : "text-navy",
          )}
        >
          Của Em
        </div>
      </div>
    </div>
  );
}
