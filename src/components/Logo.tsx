import { cn } from "@/lib/utils";
import buffaloIcon from "@/assets/buffalo-icon.png";
import logoWordmark from "@/assets/logo-wordmark.png";

const SIZES = {
  sm: { badge: "h-10 w-10", text: "text-sm", wordmark: "h-14" },
  md: { badge: "h-11 w-11", text: "text-base", wordmark: "h-11" },
};

export function Logo({
  size = "md",
  light = false,
  variant = "icon",
  className,
}: {
  size?: keyof typeof SIZES;
  light?: boolean;
  variant?: "icon" | "wordmark";
  className?: string;
}) {
  const { badge, text, wordmark } = SIZES[size];

  if (variant === "wordmark") {
    return (
      <img
        src={logoWordmark}
        alt="Trường Tiếng Việt Của Em"
        className={cn("w-auto object-contain", wordmark, className)}
      />
    );
  }

  return (
    <div className={cn("flex shrink-0 items-center gap-2.5", className)}>
      <img
        src={buffaloIcon}
        alt=""
        aria-hidden="true"
        className={cn("shrink-0 object-contain", badge)}
      />
      <div className="text-left leading-tight">
        <div
          className={cn(
            "font-display font-bold leading-none",
            text,
            light ? "text-white" : "text-primary",
          )}
        >
          Trường Tiếng Việt
        </div>
        <div
          className={cn(
            "font-display font-bold leading-none",
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
