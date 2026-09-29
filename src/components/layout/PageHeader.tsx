import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HUES, type Hue } from "@/lib/hues";
import { Container, type ContainerWidth } from "./Container";

/**
 * How every inner page opens: a soft wash in the page's hue fading to white,
 * an icon tile in that hue, the title, one line of lede, and room on the right
 * for art or actions. The hue is the page's identity — học tập is brand blue,
 * luyện nói rose, the leaderboard sun — and it is the only place the header
 * spends color, so the content below stays calm.
 */
export function PageHeader({
  title,
  lede,
  icon: Icon,
  hue = "brand",
  back,
  aside,
  width = "wide",
  children,
  className,
}: {
  title: ReactNode;
  lede?: ReactNode;
  icon?: LucideIcon;
  hue?: Hue;
  /** A <BackLink>, above the title. */
  back?: ReactNode;
  /** Art or a summary card on the right from md up; stacks below on phones. */
  aside?: ReactNode;
  width?: ContainerWidth;
  /** Actions or metadata under the lede. */
  children?: ReactNode;
  className?: string;
}) {
  const h = HUES[hue];
  return (
    <header className={cn("relative overflow-hidden bg-gradient-to-b to-white", h.from, className)}>
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <Container width={width} className="relative pt-8 pb-10 sm:pt-10 sm:pb-14">
        {back && <div className="mb-6">{back}</div>}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-2xl flex-col gap-4">
            {Icon && (
              <span
                className={cn(
                  "grid size-12 place-items-center rounded-2xl text-white shadow-sm",
                  h.fill,
                )}
              >
                <Icon className="size-6" strokeWidth={2.25} aria-hidden />
              </span>
            )}
            <h1 className="text-h1 text-ink-900">{title}</h1>
            {lede && <p className="text-lede text-ink-600">{lede}</p>}
            {children && <div className="mt-2">{children}</div>}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      </Container>
    </header>
  );
}
