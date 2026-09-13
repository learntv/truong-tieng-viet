/**
 * The blue-sky page background: one continuous gradient from the navbar's blue
 * down to a pale haze, with soft white clouds scattered through it and a band
 * of rolling green hills closing it off above the footer.
 *
 * Everything here is decoration — the whole layer is aria-hidden and
 * pointer-events-none, and the page content renders above it.
 */

/** A cloud is four overlapping ellipses on a flat base — no gradients, no edges. */
function Cloud({ className, opacity = 1 }: { className?: string; opacity?: number }) {
  return (
    <svg
      viewBox="0 0 200 80"
      className={className}
      style={{ opacity }}
      fill="white"
      aria-hidden="true"
    >
      <ellipse cx="60" cy="52" rx="46" ry="26" />
      <ellipse cx="104" cy="38" rx="38" ry="30" />
      <ellipse cx="140" cy="54" rx="34" ry="22" />
      <rect x="24" y="50" width="150" height="26" rx="13" />
    </svg>
  );
}

/**
 * Cloud placement. `top` is a percentage of the whole page height, so the
 * clouds spread over the full scroll rather than bunching near the hero.
 * Sizes and opacities vary so the field reads as depth, not as a repeat.
 */
const CLOUDS: { top: string; left?: string; right?: string; w: string; opacity: number }[] = [
  { top: "6%", left: "-4%", w: "w-56 sm:w-72", opacity: 0.95 },
  { top: "9%", right: "-3%", w: "w-48 sm:w-64", opacity: 0.85 },
  { top: "17%", left: "8%", w: "w-32 sm:w-44", opacity: 0.7 },
  { top: "24%", right: "4%", w: "w-56 sm:w-80", opacity: 0.9 },
  { top: "33%", left: "-6%", w: "w-52 sm:w-72", opacity: 0.8 },
  { top: "44%", right: "-5%", w: "w-60 sm:w-80", opacity: 0.75 },
  { top: "53%", left: "4%", w: "w-36 sm:w-52", opacity: 0.65 },
  { top: "63%", right: "6%", w: "w-44 sm:w-60", opacity: 0.7 },
  { top: "72%", left: "-3%", w: "w-56 sm:w-72", opacity: 0.8 },
  { top: "82%", right: "2%", w: "w-40 sm:w-56", opacity: 0.7 },
];

/** A short field for pages whose content doesn't fill much height — the full
 *  ten-cloud set reads as clutter once it's compressed into a shorter sky. */
const CLOUDS_SPARSE = [CLOUDS[0], CLOUDS[3], CLOUDS[6], CLOUDS[9]];

export function SkyBackdrop({ density = "full" }: { density?: "full" | "sparse" }) {
  const clouds = density === "sparse" ? CLOUDS_SPARSE : CLOUDS;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-sky-page">
      {clouds.map((c, i) => (
        // The wrapper carries the data-driven position; the cloud itself carries
        // the drift, so the two transforms don't fight over the same element.
        <span key={i} className="absolute" style={{ top: c.top, left: c.left, right: c.right }}>
          <Cloud
            opacity={c.opacity}
            className={[
              "block animate-cloud-drift",
              c.w,
              // Alternating durations keep neighbouring clouds out of phase, so
              // the field never drifts as one block.
              i % 2 === 0 ? "[animation-duration:26s]" : "[animation-duration:38s]",
            ].join(" ")}
          />
        </span>
      ))}

      {/* Rolling hills — three layers, darkest at the back, sitting on the very
        bottom of the sky so the footer starts right where the grass ends. */}
      <svg
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-40 w-full sm:h-56"
        aria-hidden="true"
      >
        <path
          d="M0 150 C 180 84 300 96 460 138 C 620 180 760 96 940 110 C 1110 123 1250 176 1440 140 L1440 260 L0 260 Z"
          className="fill-grass-deep"
          opacity="0.55"
        />
        <path
          d="M0 178 C 200 122 340 140 520 172 C 700 204 840 152 1020 162 C 1200 172 1320 200 1440 178 L1440 260 L0 260 Z"
          className="fill-grass-deep"
        />
        <path
          d="M0 212 C 240 176 420 196 640 212 C 860 228 1060 196 1240 204 C 1340 208 1400 214 1440 212 L1440 260 L0 260 Z"
          className="fill-grass"
        />
      </svg>
    </div>
  );
}
