/**
 * Red header band that sits behind the floating nav pill on sub-pages.
 *
 * The Navbar is `sticky top-4` in normal flow, so it occupies ~4.25rem at the
 * top of the page (1rem offset + the pill itself). The negative top margin here
 * pulls the band up under it; the matching top padding puts the title clear of
 * the pill again. Nothing about the Navbar needs to change.
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
  /** A <BackLink>. Pinned into the band's left gutter, level with the title. */
  back?: React.ReactNode;
}) {
  return (
    <div className="relative -mt-[4.5rem] overflow-hidden bg-gradient-to-br from-primary via-maroon to-maroon-deep px-4 pb-12 pt-32 sm:px-6 sm:pb-16 sm:pt-36">
      {/* Same squircle motif as the Lời cảm ơn band, bleeding off the corners. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-32 h-[24rem] w-[24rem] rotate-[20deg] rounded-[30%] bg-primary-glow/40 blur-[2px]" />
        <div className="absolute -bottom-44 -left-28 h-[20rem] w-[20rem] rotate-[20deg] rounded-[30%] bg-gold/20 blur-[2px]" />
      </div>

      <div className="relative mx-auto max-w-6xl text-center">
        {back && <div className="absolute left-0 top-0 z-10">{back}</div>}
        {illustration && <div className="mb-3 flex justify-center">{illustration}</div>}
        <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gold-soft/90 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
