# Phase 1 editorial media

Prepared on 2026-10-11 after the live-verified consolidation release `8858cb9`. This directory records local design and asset checks, not production verification or Web Vitals.

- `covers.png`: six editorial covers at 320 px and 128 px. Geometry stays distinct at the smaller size.
- `shares-zh.png`: all six Traditional Chinese sharing images. Full-size traffic and solar images were also inspected; the localized titles are readable, with no missing-glyph boxes or clipped text. The longest English solar title was inspected at full size too.
- Published media live in `public/images/reader-covers/` and `public/images/reader-shares/`.
- Six SVG sources and six 640×400 WebP covers use ivory, forest, sage, sand and copper. These are decorative editorial illustrations, not scientific diagrams or data. Scientific `heroImage` fields and figure files were not replaced.
- Twelve PNGs use each article's actual published English/Traditional Chinese title and are 1200×630. Their visible footer identifies the illustration as editorial and not research data.
- Covers are approximately 8.8–10.3 kB each; sharing PNGs are approximately 32.9–50.3 kB. The manifest records exact bytes and SHA-256 values.

The renderer reads both writing collections and pairs Chinese content using `sourceSlug`. `getReaderMedia(canonicalId, locale)` returns an editorial cover and localized sharing image only for the six registered IDs; all other IDs return `null`. The default site sharing image and scientific thumbnail pipeline are retained.

`reader-media-manifest.json` stores normalized semantic input hashes and reviewed output hashes. Unchanged valid images are reused across builds and operating systems, avoiding font-renderer changes. New or changed sharing images require a Noto Traditional Chinese font; set `READER_CJK_FONT_FILE` when the standard platform locations are unavailable. The font file is not distributed with the site. The receipt records the font family and file hash used to render each sharing PNG.

Validation:

```text
node scripts/generate-reader-media.mjs
node --test tests/reader-metadata.test.mjs tests/reader-asset-report.test.mjs
```

Seven local tests pass, including exact media dimensions, localized titles/alt text, manifest hashes, unchanged image mtimes on a repeat generation, and a fixture that distinguishes initial static imports from dynamic/candidate/share assets. Twelve additional built metadata checks run once the new dist is generated. Full build, responsive/browser checks and release verification are recorded by the integrating task.

The frozen pre-change baseline is `../performance/8858cb9/`. To measure a new local candidate after a successful build:

```text
node scripts/measure-reader-assets.mjs --label editorial-candidate --out design/site-refresh/performance/editorial-candidate
```

The report records the source HEAD, whether the working tree is dirty, page/asset hashes, declared local bytes and compression estimates. If dirty, HEAD is explicitly the base revision. It makes no requests and does not measure download speed, cache behaviour, LCP, CLS, INP or other Web Vitals.
