# Woven knot C — website assets

The selected refined C design is the source of the site's current icon set.

- Source: `concept-c-refined.png`, generated with imagegen and selected by the site owner.
- Source SHA-256: `06d80a45ed953518d76d6244c7a942eb3af34356cd4b6065452cf832a86cc915`.
- Regenerate after installing the site's dependencies: `node scripts/generate-woven-icon.mjs` from the repository root. The script uses Astro's installed sharp dependency; it makes no network requests.

The conversion traces the approved alpha silhouette, removes isolated raster specks smaller than 16 source pixels in area, and simplifies outlines with a 0.9-source-pixel tolerance. It does not generate a new design. The vector paths contain four contours; their rasterized silhouette overlaps the approved source with IoU 0.997309 at alpha threshold 128. Output colors are exact forest green `#1f6652` and ivory `#f5f3ed`.

## Outputs

- `public/images/kenneth-woven-knot.svg`: fixed green vector mark for the header and About pages; no embedded bitmap or external resource.
- `public/images/kenneth-woven-knot-{192,512}.png`: transparent PNG derivatives.
- `public/favicon.svg`: the same paths, green by default and ivory when the browser prefers a dark color scheme.
- `public/favicon-32x32.png`: opaque ivory fallback for browsers without SVG favicon support.
- `public/favicon.ico`: 16, 32, 48, and 64 px PNG frames, individually rendered on ivory.
- `public/apple-touch-icon.png`: opaque ivory 180 × 180 touch icon.

The favicon links include `?v=woven-c2` to refresh previously cached icons. The site header uses the fixed-color master so an operating-system dark preference does not turn the logo white on the site's ivory header. About captions and alternative text were updated in English and Traditional Chinese to describe the interwoven design.

## Validation

- All four ICO frames decode; PNG and Apple Touch Icon dimensions match their declared sizes.
- Full `npm run build` passed using committed fallback snapshots, matching the CI environment without the private sibling repository. The check covered 598 HTML files and 1,621 output files, along with the repository's policy, content, bilingual, asset, search, and link checks.
- The build's four generated manifest changes were restored; no unrelated content or assets are included in the icon change.
- Local rendered About page confirmed the new 44 px header mark, new About mark and caption, versioned favicon references, and no horizontal overflow.
- The English homepage at 390 × 844 also displayed the new 44 px mark correctly, with no horizontal overflow or browser console errors.

The prior attractor assets and generator are preserved as historical source material. Use the woven-icon generator above for the current site identity.
