// The five stage hues — leaf / sky / grape / coral / rose — as class strings, driven by the
// --color-stage-N tokens in src/styles.css. Indexed by chặng position and reused wherever a
// stage needs its own color (lesson pages, speaking practice, the alphabet grid, roadmaps).
//
// - bg        the AA fill (holds white text)
// - bgSoft    the -50 wash
// - border    a hairline in the hue
// - text      ink on the wash
// - gradient  a subtle two-step fill for large colored surfaces
// - bevel     the soft colored lift a filled button casts; bevelActive collapses it on press
// - hex       the fill as a CSS value, for inline styles and SVG
export type StageColor = {
  ring: string;
  bg: string;
  bgSoft: string;
  gradient: string;
  border: string;
  text: string;
  bevel: string;
  bevelActive: string;
  hex: string;
  scrollThumb: string;
  scrollTrack: string;
};

// Written out whole so Tailwind sees every class literally.
export const STAGE_COLORS: StageColor[] = [
  {
    ring: "ring-stage-1",
    bg: "bg-stage-1",
    bgSoft: "bg-stage-1-soft",
    gradient: "bg-gradient-to-br from-stage-1-bright to-stage-1",
    border: "border-stage-1",
    text: "text-stage-1-deep",
    bevel: "shadow-[0_2px_4px_rgb(20_28_49/0.08),0_8px_20px_-6px_rgb(15_133_68/0.45)]",
    bevelActive: "active:shadow-sm",
    hex: "var(--color-stage-1)",
    scrollThumb: "var(--color-stage-1)",
    scrollTrack: "var(--color-stage-1-soft)",
  },
  {
    ring: "ring-stage-2",
    bg: "bg-stage-2",
    bgSoft: "bg-stage-2-soft",
    gradient: "bg-gradient-to-br from-stage-2-bright to-stage-2",
    border: "border-stage-2",
    text: "text-stage-2-deep",
    bevel: "shadow-[0_2px_4px_rgb(20_28_49/0.08),0_8px_20px_-6px_rgb(10_127_166/0.45)]",
    bevelActive: "active:shadow-sm",
    hex: "var(--color-stage-2)",
    scrollThumb: "var(--color-stage-2)",
    scrollTrack: "var(--color-stage-2-soft)",
  },
  {
    ring: "ring-stage-3",
    bg: "bg-stage-3",
    bgSoft: "bg-stage-3-soft",
    gradient: "bg-gradient-to-br from-stage-3-bright to-stage-3",
    border: "border-stage-3",
    text: "text-stage-3-deep",
    bevel: "shadow-[0_2px_4px_rgb(20_28_49/0.08),0_8px_20px_-6px_rgb(116_66_232/0.45)]",
    bevelActive: "active:shadow-sm",
    hex: "var(--color-stage-3)",
    scrollThumb: "var(--color-stage-3)",
    scrollTrack: "var(--color-stage-3-soft)",
  },
  {
    ring: "ring-stage-4",
    bg: "bg-stage-4",
    bgSoft: "bg-stage-4-soft",
    gradient: "bg-gradient-to-br from-stage-4-bright to-stage-4",
    border: "border-stage-4",
    text: "text-stage-4-deep",
    bevel: "shadow-[0_2px_4px_rgb(20_28_49/0.08),0_8px_20px_-6px_rgb(217_60_23/0.45)]",
    bevelActive: "active:shadow-sm",
    hex: "var(--color-stage-4)",
    scrollThumb: "var(--color-stage-4)",
    scrollTrack: "var(--color-stage-4-soft)",
  },
  {
    ring: "ring-stage-5",
    bg: "bg-stage-5",
    bgSoft: "bg-stage-5-soft",
    gradient: "bg-gradient-to-br from-stage-5-bright to-stage-5",
    border: "border-stage-5",
    text: "text-stage-5-deep",
    bevel: "shadow-[0_2px_4px_rgb(20_28_49/0.08),0_8px_20px_-6px_rgb(214_36_111/0.45)]",
    bevelActive: "active:shadow-sm",
    hex: "var(--color-stage-5)",
    scrollThumb: "var(--color-stage-5)",
    scrollTrack: "var(--color-stage-5-soft)",
  },
];
