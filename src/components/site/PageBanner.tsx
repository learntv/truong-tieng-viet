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

      <div className="relative mx-auto max-w-6xl text-center">
        {back && <div className="absolute left-0 top-0 z-10">{back}</div>}
        {illustration && <div className="mb-3 flex justify-center">{illustration}</div>}
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gold-soft/90 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
