# Local A4 print verification

Generated on 2026-10-11 from the final local Batch 2 `dist`, before release. `render-manifest.json` records each PDF hash and its exact built HTML hash. All eight pairs were rechecked after rendering. `sourceBaseCommit` identifies the existing HEAD; `sourceState: working-tree` means these artifacts include the pending Batch 2 changes.

Rendering uses a fresh workspace-local headless Edge profile for each document and the local HTTP preview. It does not attach to the user's browser. These are actual PDFs, with selected pages rasterized for visual review.

| Document | English pages | Traditional Chinese pages |
|---|---:|---:|
| Traffic model memory | 29 | 27 |
| Fast changes in solar power | 27 | 26 |
| Stress tests and certificates | 20 | 22 |
| Spatial dengue/code example | 2 | 1 |

All eight PDFs have A4 geometry, the canonical article URL, and no extracted replacement characters or hidden reader controls. The documents retain article titles, publication/update dates, body figures and captions, references, formulas, tables and code. Selected rasters confirm readable Traditional Chinese, an intact traffic figure/caption, continued solar table headers, and black code on a white background.

The initial certificate table exposed an overlap that a page-edge-only check did not detect. The corrected final `certificate-zh-Hant-page-3.png` shows the full numeric interval within its table column. Its base digits measure 8.550 pt in the Chinese PDF and 8.557 pt in the English PDF. The smallest KaTeX glyph across these PDFs is 5.947 pt; this includes subscript/superscript glyphs and is **not** a measurement of the smallest base formula font. All per-document glyph ranges and the selected interval measurements are in `pdf-inspection.json`.

One character crosses the conservative horizontal-margin threshold: a hanging closing Chinese quote on traffic ZH page 23 ends at 554.81 pt on a 594.96 pt-wide sheet. It remains approximately 40 pt inside the physical page and is not clipped. No other character crosses that threshold. Selected-page visual review supplements the geometry checks; it does not establish that every page or every browser/printer has identical pagination.

Reproduce against a running final local preview:

```powershell
node design/site-refresh/reading-previews/print/render.mjs http://127.0.0.1:8767/
& 'C:/Users/kenneth/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' design/site-refresh/reading-previews/print/inspect-pdf.py
```

`render.mjs` uses the installed Edge executable explicitly; the inspection script uses pdfplumber and PDFium from the bundled runtime. `render-manifest.json` is the PDF/build receipt; `pdf-inspection.json` is the page/text/font report. Retained PNGs are first-page previews and selected figure/table continuation pages. Four redundant exploratory solar ZH rasters (pages 2, 3, 11 and 18) and a generated Python cache were removed.
