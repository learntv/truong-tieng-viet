# Brand assets

Copies, not the originals. The CMS is a separate Next app and cannot import from
the root workspace's `src/assets`, so these are duplicated here. If the logo
changes, change it in `src/assets` first and re-copy:

| Here | Source |
|---|---|
| `buffalo-icon.png` | `src/assets/buffalo-icon.png` |
| `logo-wordmark.png` | `src/assets/logo-wordmark.png` |
| `wave.png` | `src/assets/mascot/wave.png` |

`buffalo-icon.png` and `logo-wordmark.png` are true RGBA and are safe on any
background. **`wave.png` and every other file in `src/assets/mascot/` is a palette
PNG with index transparency and light edge pixels** — it fringes visibly on dark
grounds. Use mascots on light grounds only, or re-export to RGBA first.
