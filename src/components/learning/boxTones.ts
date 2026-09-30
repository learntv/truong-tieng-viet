import type { SkyBoxTone } from "@/components/ui/sky-box";

/** The SkyBox tones, plus a pastel yellow livelier than cream. */
export type BoxTone = Exclude<SkyBoxTone, "white" | "red"> | "sun";

/**
 * The pastel card tones the Học tập pages share. `light` fills a card or an
 * art window, `deep` frames it or fills a pill on it, `bar` is a progress fill
 * that reads on `light`, and `outline` is the hover rim: a deeper, more
 * saturated shade of the tone.
 */
export const BOX_TONES: Record<
  BoxTone,
  { light: string; deep: string; bar: string; outline: string }
> = {
  lavender: {
    light: "bg-box-lavender",
    deep: "bg-box-lavender-deep",
    bar: "bg-[#8b74f0]",
    outline: "hover:outline-[#8b74f0]",
  },
  peach: {
    light: "bg-box-peach",
    deep: "bg-box-peach-deep",
    bar: "bg-[#e8903a]",
    outline: "hover:outline-[#e8903a]",
  },
  ice: {
    light: "bg-box-ice",
    deep: "bg-box-ice-deep",
    bar: "bg-[#3fa9e6]",
    outline: "hover:outline-[#3fa9e6]",
  },
  pink: {
    light: "bg-box-pink",
    deep: "bg-box-pink-deep",
    bar: "bg-[#e8629a]",
    outline: "hover:outline-[#e8629a]",
  },
  mint: {
    light: "bg-box-mint",
    deep: "bg-box-mint-deep",
    bar: "bg-[#3fa561]",
    outline: "hover:outline-[#3fa561]",
  },
  cream: {
    light: "bg-box-cream",
    deep: "bg-box-cream-deep",
    bar: "bg-[#b8962e]",
    outline: "hover:outline-[#b8962e]",
  },
  // Same lightness and saturation as peach, turned to yellow.
  sun: {
    light: "bg-[#f9d77e]",
    deep: "bg-[#f6cd62]",
    bar: "bg-[#e0a820]",
    outline: "hover:outline-[#e0a820]",
  },
};

/** The order a list of items cycles through the tones, by position. */
const TONE_CYCLE: BoxTone[] = ["pink", "mint", "ice", "peach", "lavender", "sun"];

export function toneAt(index: number) {
  return BOX_TONES[TONE_CYCLE[index % TONE_CYCLE.length]];
}
