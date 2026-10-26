import { Link, type LinkProps } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import roundArrowBack from "@iconify-icons/ic/round-arrow-back";
import type { ReactNode } from "react";
import { Cloud } from "@/components/home/SkyBackdrop";

/**
 * The title band every sub-page opens with: a little meadow across the white
 * page card's top edge. Pale sky with a couple of drifting clouds, rolling
 * grass along the bottom dotted with flowers, and the art standing in the
 * grass. Same clouds and grass as the page's SkyBackdrop, so the card's top
 * reads as a window onto the sky around it.
 *
 * A page under another one gets a round back arrow at the title's left edge,
 * the same one the KMD lesson page uses, pointing at its parent.
 */
export function PageBanner({
  title,
  gloss,
  back,
  art,
}: {
  title: string;
  /** A translation of a Vietnamese title, shown smaller beneath it (see lib/localized.ts). */
  gloss?: string;
  /** The page this one sits under. `label` is the arrow's accessible name. */
  back?: { label: string; to: LinkProps["to"] };
  /** Optional picture on the right of the band, standing in the grass. */
  art?: ReactNode;
}) {
  return (
    <>
      {/* A fixed minimum height, so every banner matches whether or not it has art. */}
      <div className="relative flex min-h-36 gap-3 overflow-hidden bg-gradient-to-b from-meadow-sky-top to-meadow-sky-bottom px-4 pt-6 sm:min-h-52 sm:gap-5 sm:px-8 sm:pt-8">
        <span aria-hidden="true" className="absolute -top-3 right-[18%] sm:right-[26%]">
          <Cloud opacity={0.95} className="block w-28 animate-cloud-drift sm:w-40" />
        </span>
        <span aria-hidden="true" className="absolute right-[-2.5rem] top-10 sm:top-12">
          <Cloud
            opacity={0.8}
            className="block w-24 animate-cloud-drift [animation-duration:38s] sm:w-32"
          />
        </span>
        <span aria-hidden="true" className="absolute left-[44%] top-2 hidden sm:block">
          <Cloud
            opacity={0.6}
            className="block w-20 animate-cloud-drift [animation-duration:32s]"
          />
        </span>

        <Meadow />

        {/* pb clears the grass, so the title never sits on it. */}
        <div className="relative flex min-w-0 flex-1 items-center gap-3 self-center pb-14 sm:gap-5 sm:pb-20">
          {back && (
            <Link
              to={back.to}
              aria-label={back.label}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/85 text-sky-ink shadow-sm transition-colors hover:bg-sky-ink hover:text-white sm:h-11 sm:w-11"
            >
              <Icon icon={roundArrowBack} className="h-5 w-5" aria-hidden />
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <h1
              lang={gloss ? "vi" : undefined}
              className="font-display text-[1.75rem] font-bold leading-tight text-sky-ink sm:text-[2.5rem]"
            >
              {title}
            </h1>
            {gloss && (
              <p className="mt-1 text-base font-semibold text-sky-ink-soft sm:text-lg">{gloss}</p>
            )}
          </div>
        </div>

        {art && <div className="relative shrink-0 self-end pb-1 sm:pb-2">{art}</div>}
      </div>

      {/* The grass carries on past the band, fading from the front hill's --grass
      into the card's paler lawn. The negative margin cancels its height, so
      the page's content flows over it as if it weren't there. */}
      <div
        aria-hidden="true"
        className="pointer-events-none -mb-48 h-48 bg-gradient-to-b from-grass to-transparent sm:-mb-64 sm:h-64"
      />
    </>
  );
}

/**
 * Where the flowers grow: `left` across the band, `bottom` up into the front
 * hill. Kept out of the right edge, where the art stands.
 */
const FLOWERS: { left: string; bottom: string; petal: string; size: string }[] = [
  { left: "4%", bottom: "0.5rem", petal: "#ff9cc4", size: "w-3.5 sm:w-4" },
  { left: "11%", bottom: "1.6rem", petal: "#ffffff", size: "w-2.5 sm:w-3" },
  { left: "19%", bottom: "0.4rem", petal: "#ffd23f", size: "w-3 sm:w-4" },
  { left: "30%", bottom: "1.5rem", petal: "#ff9cc4", size: "w-2.5 sm:w-3" },
  { left: "38%", bottom: "0.5rem", petal: "#ff8a7a", size: "w-3.5 sm:w-4" },
  { left: "49%", bottom: "1.8rem", petal: "#ffffff", size: "w-2.5 sm:w-3" },
  { left: "57%", bottom: "0.6rem", petal: "#c9a8ff", size: "w-3 sm:w-3.5" },
  { left: "66%", bottom: "1.6rem", petal: "#ffd23f", size: "w-2.5 sm:w-3" },
];

/**
 * Two rolling hills along the band's bottom, dotted with flowers. The front
 * one is --grass, the page card's own colour, so the grass runs on down into
 * the page below instead of stopping at the band's edge.
 */
function Meadow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-12 sm:h-16"
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M0 40 C 200 6 380 14 560 38 C 760 66 920 10 1120 20 C 1270 28 1360 48 1440 36 L1440 120 L0 120 Z"
          className="fill-grass-deep"
        />
        <path
          d="M0 66 C 260 36 460 48 700 64 C 940 80 1140 42 1440 56 L1440 120 L0 120 Z"
          className="fill-grass"
        />
      </svg>
      {FLOWERS.map((f, i) => (
        <Flower
          key={i}
          petal={f.petal}
          className={`absolute ${f.size}`}
          style={{ left: f.left, bottom: f.bottom }}
        />
      ))}
    </div>
  );
}

/** Five round petals around a sunny centre. */
function Flower({
  petal,
  className,
  style,
}: {
  petal: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="-10 -10 20 20" className={className} style={style}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <circle key={deg} cx="0" cy="-5" r="4" fill={petal} transform={`rotate(${deg})`} />
      ))}
      <circle r="3.2" fill={petal === "#ffd23f" ? "#f28c28" : "#ffd23f"} />
    </svg>
  );
}
