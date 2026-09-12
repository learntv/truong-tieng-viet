import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container, type ContainerWidth } from "./Container";

/**
 * The red header band every sub-page opens with.
 *
 * It is the first block inside the page card, so it runs to the card's edges
 * and its top corners are clipped by the card's radius — nothing here needs to
 * know about the navbar. (Its predecessor, PageBanner, carried a negative top
 * margin to tuck under a floating nav pill that no longer exists.)
 */
export function PageHeader({
  title,
  subtitle,
  illustration,
  back,
  width = "wide",
  align = "center",
  children,
  className,
}: {
  title: string;
  subtitle?: ReactNode;
  /** Artwork shown above the title. */
  illustration?: ReactNode;
  /** A <BackLink>. Sits above the title, in the band's left gutter. */
  back?: ReactNode;
  width?: ContainerWidth;
  align?: "center" | "left";
  /** Actions or metadata rendered under the subtitle. */
  children?: ReactNode;
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-primary via-indigo to-indigo-deep py-10 sm:py-14",
        className,
      )}
    >
      {/* Soft radial washes rather than hard-edged blobs: each fades to fully
        transparent, so the band reads as light falling across it instead of
        two shapes sitting on top of it. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 26rem at 78% -20%, color-mix(in oklab, var(--primary-glow) 55%, transparent) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(40rem 22rem at 12% 120%, color-mix(in oklab, var(--gold) 22%, transparent) 0%, transparent 60%)",
          }}
        />
      </div>

      <Container width={width} className="relative">
        {back && <div className="mb-5 flex">{back}</div>}
        <div className={cn(centered && "text-center")}>
          {illustration && (
            <div className={cn("mb-3 flex", centered ? "justify-center" : "justify-start")}>
              {illustration}
            </div>
          )}
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          {subtitle && (
            <p
              className={cn(
                "mt-3 max-w-2xl text-sm leading-relaxed text-gold-soft/90 sm:text-base",
                centered && "mx-auto",
              )}
            >
              {subtitle}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </Container>
    </div>
  );
}
