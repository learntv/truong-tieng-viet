# New branded social preview image

## Goal
Replace the current social preview image with a fresh, on-brand 1200×630 illustration that uses the project's mascot, Vietnamese cultural symbols, and red/gold palette, then update `__root.tsx` so the new image is used for `og:image`, `twitter:image`, and JSON-LD.

## Plan

1. Generate the image
   - Size: 1200×630 (standard OG share image)
   - Style: Warm, kid-friendly, clean vector-like illustration
   - Content: Trâu Con (the buffalo mascot) holding a small Vietnamese flag, surrounded by subtle Vietnamese motifs (nón lá, hoa sen, chim lạc, tre). Soft radial red/gold glow behind the mascot. Site title "Trường Tiếng Việt Của Em" in bold friendly display type, and the tagline "Hành trình học tiếng Việt vui nhộn dành cho trẻ em kiều bào."
   - Save to a temporary path for upload

2. Upload to Lovable assets
   - Use `lovable-assets create` to upload the generated PNG
   - Write the resulting `.asset.json` pointer to `src/assets/og-image.png.asset.json`
   - Use the CDN URL from the pointer file

3. Update metadata
   - In `src/routes/__root.tsx`, replace the `OG_IMAGE` constant with the new CDN URL
   - Update the `image` field in the JSON-LD `WebSite` and `Organization` blocks
   - Leave `og:title`, `og:description`, `twitter:title`, `twitter:description` unchanged

4. Verify
   - Run the TypeScript/build check to confirm no broken imports
   - Confirm the new image URL is visible in the rendered `<head>` tags

## Outcome
The social share preview will show a unified branded image across Facebook, Twitter, Zalo, and other platforms that embed the homepage link.