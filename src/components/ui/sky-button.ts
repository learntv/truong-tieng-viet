import { cn } from "@/lib/utils";

/**
 * The house button, as a class string so it can be dropped onto a router
 * `<Link>` or a bare `<button>` without fighting Link's generics.
 *
 * Solid fill, no outline, and a soft indigo shadow that falls off underneath.
 * On :active the shadow collapses to a contact shadow and the button drops a
 * pixel, so it reads as pressed to the surface. The boxes are flat, so this is
 * the one thing on the page with depth — which makes the buttons the obvious
 * targets.
 *
 * Lives in its own module rather than alongside SkyBox so that file can stay
 * component-only and keep fast refresh working.
 */
const BUTTON_BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[0.6rem] px-5 py-2.5 font-display text-sm font-bold transition-[colors,transform,box-shadow] shadow-btn active:translate-y-[1px] active:shadow-btn-active sm:text-base";

const BUTTON_TONES = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-glow",
  /* The hover tint is the near-white tone, not --box-ice: since the box tones
     were saturated, ice is a full blue and a white button would flash to it. */
  white: "bg-white text-indigo-deep hover:bg-box-white-deep",
  green: "bg-nav-green text-white hover:bg-grass",
} as const;

export function skyButton(tone: keyof typeof BUTTON_TONES = "primary", className?: string) {
  return cn(BUTTON_BASE, BUTTON_TONES[tone], className);
}
