// Turns whatever an editor pastes for a KMD lesson's Canva design into the one URL the site
// embeds: `https://www.canva.com/design/<id>/<token>/view?embed`.
//
// Canva's "Embed" dialog hands out an HTML snippet (a wrapper div, the iframe, then a credit
// link with its slashes written as `&#x2F;`), and its "Share" dialog a plain view link with
// tracking parameters. Editors can paste either; only the design id and view token are kept,
// so the site never renders pasted HTML and every lesson's URL has the same shape.
//
// An edit link (`/edit`) is refused rather than converted: its token grants editing, not
// viewing, and Canva won't embed it.
const CANVA_DESIGN = /canva\.com\/design\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)\/(?:view|watch)\b/

export function toCanvaEmbedUrl(input: string): string | null {
  const match = input.replace(/&#x2F;/gi, '/').match(CANVA_DESIGN)
  if (!match) return null
  const [, designId, token] = match
  return `https://www.canva.com/design/${designId}/${token}/view?embed`
}
