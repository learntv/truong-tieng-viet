import type { Locator } from '@playwright/test'

/**
 * Contrast measurement against what is *actually* painted behind an element.
 *
 * The visual-identity spec asks for ratios on real screens, not for the ratios the palette was
 * designed to. Those two can differ: a token is only as good as the surface a framework
 * component happens to pair it with, and this change substitutes the whole ramp underneath
 * components nobody here wrote. So these read `getComputedStyle` in the browser and walk up
 * the ancestor chain for the first background that is not transparent — which is what the eye
 * does too.
 */

type Rgb = [number, number, number]

const parseRgb = (value: string): null | Rgb => {
  const match = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?/.exec(value)
  if (!match) return null
  // A fully transparent colour is not a background; it is a hole to look through.
  if (match[4] !== undefined && Number(match[4]) === 0) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

const relativeLuminance = ([r, g, b]: Rgb): number => {
  const channel = (value: number) => {
    const c = value / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export const contrastRatio = (a: Rgb, b: Rgb): number => {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x)
  return (lighter + 0.05) / (darker + 0.05)
}

/** An element's own colour, and the first opaque background painted behind it. */
export const paintedColours = async (
  locator: Locator,
): Promise<{ background: Rgb; boxShadow: string; color: Rgb; outlineColor: string }> => {
  const raw = await locator.evaluate((element) => {
    const own = getComputedStyle(element as Element)

    let node: Element | null = element as Element
    let background = 'rgba(0, 0, 0, 0)'
    while (node) {
      const value = getComputedStyle(node).backgroundColor
      if (value && !/rgba\(0,\s*0,\s*0,\s*0\)|transparent/.test(value)) {
        background = value
        break
      }
      node = node.parentElement
    }
    // Nothing opaque anywhere up the tree means the canvas itself, which the UA paints white.
    if (background === 'rgba(0, 0, 0, 0)') background = 'rgb(255, 255, 255)'

    return {
      background,
      boxShadow: own.boxShadow,
      color: own.color,
      outlineColor: own.outlineColor,
    }
  })

  const color = parseRgb(raw.color)
  const background = parseRgb(raw.background)
  if (!color || !background) {
    throw new Error(`Could not read colours: color=${raw.color} background=${raw.background}`)
  }

  return { background, boxShadow: raw.boxShadow, color, outlineColor: raw.outlineColor }
}

/** Every opaque colour named in a `box-shadow` / `outline-color` pair, for focus indication. */
export const indicationColours = (boxShadow: string, outlineColor: string): Rgb[] =>
  [...boxShadow.matchAll(/rgba?\([^)]*\)/g)]
    .map((match) => match[0])
    .concat(outlineColor)
    .map(parseRgb)
    .filter((rgb): rgb is Rgb => rgb !== null)
