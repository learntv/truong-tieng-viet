/**
 * The named hues of the design system as ready-made class strings.
 *
 * Tailwind only emits classes it can see written out whole, so every hue's
 * classes are spelled here once and components pick a hue by name instead of
 * assembling `bg-${hue}-50` at runtime (which would compile to nothing).
 *
 * - `wash`   the -50 background for a tinted surface
 * - `tint`   the -100 step, for chips and hover on a wash
 * - `fill`   the AA fill that holds white text
 * - `bright` the vivid -500 fill, for decoration and large type only
 * - `ink`    text on the wash, or a colored heading on white
 * - `ring`   a 1px border in the hue
 * - `from`   gradient start for a soft wash-to-white band
 */
export const HUES = {
  brand: {
    wash: "bg-brand-50",
    tint: "bg-brand-100",
    fill: "bg-brand-600",
    bright: "bg-brand-500",
    ink: "text-brand-700",
    ring: "border-brand-200",
    from: "from-brand-50",
  },
  coral: {
    wash: "bg-coral-50",
    tint: "bg-coral-100",
    fill: "bg-coral-600",
    bright: "bg-coral-500",
    ink: "text-coral-700",
    ring: "border-coral-100",
    from: "from-coral-50",
  },
  sun: {
    wash: "bg-sun-50",
    tint: "bg-sun-100",
    // Sun never carries white type: its "fill" is the bright step with ink.
    fill: "bg-sun-500 text-ink-900",
    bright: "bg-sun-300",
    ink: "text-sun-700",
    ring: "border-sun-100",
    from: "from-sun-50",
  },
  leaf: {
    wash: "bg-leaf-50",
    tint: "bg-leaf-100",
    fill: "bg-leaf-600",
    bright: "bg-leaf-500",
    ink: "text-leaf-700",
    ring: "border-leaf-100",
    from: "from-leaf-50",
  },
  sky: {
    wash: "bg-sky-50",
    tint: "bg-sky-100",
    fill: "bg-sky-600",
    bright: "bg-sky-500",
    ink: "text-sky-700",
    ring: "border-sky-100",
    from: "from-sky-50",
  },
  grape: {
    wash: "bg-grape-50",
    tint: "bg-grape-100",
    fill: "bg-grape-600",
    bright: "bg-grape-500",
    ink: "text-grape-700",
    ring: "border-grape-100",
    from: "from-grape-50",
  },
  rose: {
    wash: "bg-rose-50",
    tint: "bg-rose-100",
    fill: "bg-rose-600",
    bright: "bg-rose-500",
    ink: "text-rose-700",
    ring: "border-rose-100",
    from: "from-rose-50",
  },
} as const;

export type Hue = keyof typeof HUES;

/** The order hues cycle in when a list needs one color per item. */
export const HUE_CYCLE: Hue[] = ["brand", "coral", "leaf", "grape", "sun", "sky", "rose"];

export const hueAt = (i: number): Hue =>
  HUE_CYCLE[((i % HUE_CYCLE.length) + HUE_CYCLE.length) % HUE_CYCLE.length];
