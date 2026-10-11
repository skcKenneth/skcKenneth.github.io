# Classroom PDF review

Reviewed the eight final PDFs from `render-manifest.json`, rendered at
`2026-10-11T07:52:21.211Z`. The manifest explicitly records working-tree sources
on base commit `9446e5330f594f021677490ba2675c7c28c706ac`.

Result: no unresolved document blocker. `inspect-classroom-pdfs.py` exited 0;
the complete machine report is `classroom-pdf-inspection.json`.

| Pack | Role | English pages | Traditional Chinese pages |
|---|---|---:|---:|
| Sampling bias | Student | 4 | 4 |
| Sampling bias | Teacher | 4 | 3 |
| Mixing tank | Student | 5 | 5 |
| Mixing tank | Teacher | 4 | 4 |

## Checks

- All eight PDF hashes and their built HTML hashes match the final render
  manifest; all four declared classroom source hashes match the frozen files.
- All 33 pages are A4. No visible text glyph lies outside the physical page or
  the declared CSS margins. No replacement character or unmapped CID was found.
- Both the guide URL and the original-activity URL appear in every document.
- Student PDFs contain none of the corresponding teacher reasoning paragraphs
  or reference exit answers. Both teacher PDFs for the tank contain the mass
  balance, steady-state formula and worked Euler values. Student PDFs retain
  the prescribed initial-value exercise and Euler scaffold, without the
  teacher-only balance or steady-state formula.
- All four student PDFs print their default parameter labels and values,
  including seed 2026. Sampling shows 20, whole-school random, zero chart
  baseline. Tank shows flow 2, volume 20, reaction 0.05, inlet 10, initial 0,
  time step 0.5. Labels and values were also checked visually.
- Print/projection/copy controls are absent. The empty tail of each final page
  contains zero pixels matching the former ivory paper background; the white
  background correction is visible in the final rasters.

## Visual evidence

PDFium generated 28 selected-page PNGs and eight contact sheets. All eight
contact sheets were inspected, including first pages, worksheet pages, selected
settings/formula pages and final source pages. No clipping or overlap was seen.

The following pages were additionally inspected at the larger raster size:

- `sampling-bias-student-en-page-2.png`
- `sampling-bias-student-zh-Hant-page-2.png`
- `mixing-tank-student-en-page-2.png`
- `mixing-tank-student-en-page-3.png`
- `mixing-tank-student-zh-Hant-page-2.png`
- `mixing-tank-teacher-en-page-2.png`
- `mixing-tank-teacher-en-page-3.png`
- `mixing-tank-teacher-zh-Hant-page-2.png`

## Scope

The renderer uses default routes without a preset/seed query. These eight PDFs
therefore verify default settings; custom-setting UI/print verification is a
separate check owned by the parent task. Text/font/bounds checks cover every
page; visual inspection covers the selected rasters, not every page at full
size. This review does not establish tagged-PDF screen-reader behavior or
physical-printer output. PDF text matching normalizes compatibility characters
and the font's visually equivalent `⻑`/`長` mapping; the Chinese formula/text
pages were inspected visually as well.
