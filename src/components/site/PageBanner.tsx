import { cn } from "@/lib/utils";

/**
 * The plain title block every sub-page opens with — the first thing inside
 * the white page card, so it carries no background of its own.
 */
export function PageBanner({
  title,
  subtitle,
  illustration,
  back,
}: {
  title: string;
  subtitle?: string;
  illustration?: React.ReactNode;
  /** A <BackLink>, folded into the card's own top-left corner. Extra top
   *  clearance is added below so the centered title never runs under it. */
  back?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative px-4 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10",
        back && "pt-20 sm:pt-24",
      )}
    >
      {back}
      <div className="mx-auto max-w-2xl text-center">
        {illustration && <div className="mb-3 flex justify-center">{illustration}</div>}
        <h1 className="font-display text-2xl font-bold text-sky-ink sm:text-3xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-sky-ink-soft sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
