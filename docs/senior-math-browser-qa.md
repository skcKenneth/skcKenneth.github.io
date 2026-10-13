# Senior Mathematics Studio: isolated browser and PDF acceptance evidence

The browser harness serves the existing `dist/` directory from its own ephemeral loopback HTTP server. It starts a fresh headless Microsoft Edge process and a new browser context per case. It does not connect to the user's browser, use a personal profile, contact production, or modify application source or published files.

## Reproduction

Run the complete site build first, then run these commands from the repository root:

```powershell
node scripts/senior-math-browser-qa.mjs
& 'C:\Users\kenneth\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts/senior-math-pdf-audit.py
node scripts/senior-math-pdf-preview.mjs
```

The browser run uses the already-installed Codex dependency bundle's Playwright 1.62.1, plus installed Edge. The PDF audit uses bundled `pypdf` and `pdfplumber`; previews use installed PDF.js and `@napi-rs/canvas`. No dependency installation is performed by these scripts. Set `PLAYWRIGHT_RUNTIME` to another installed Node package-manifest path, and `QA_BROWSER_EXECUTABLE` to another compatible installed Chromium executable, if necessary.

On this Windows host, sandboxed Edge failed with Crashpad pipe/profile access errors. The same isolated test command succeeded with the narrowly scoped execution escalation. The sandbox server at port 4391 could not be reached from that process, so the harness owns and closes its own loopback server. Neither condition is treated as an application defect.

Artifacts are written under `.tmp/senior-math-v2/browser-qa/`. `report.json` records the timestamp, browser version, tested built-route SHA-256, case outcomes, page errors, selected request URLs, and PDF filenames. `pdf-audit.json` records each physical page size, text bounds, content sentinels, and pass/fail result. These reports, rather than old failure screenshots or this narrative, identify the latest run.

## Browser cases

| Case | Observable acceptance evidence |
| --- | --- |
| Public skill index | At least 24 distinct skill links; full-page desktop screenshot. |
| 390 × 844 viewport | Actual `innerWidth`, client width and scroll width are 390; answer checking, independent evidence label, separate attempt/correction draft persistence, and a live inquiry parameter update. |
| JavaScript disabled | Real browser context with scripting disabled; 50 readable rows on each of two distinct server pages; native worked-solution disclosure opens. |
| Selected classroom | Exactly the selected question HTML pages are fetched; DOM/directory order matches selection, moving a question and reloading changes order, and new questions start with their hints hidden. |
| Rapid bilingual filtering | Skill/difficulty/type changes survive an immediate language click; matching question IDs persist in both languages; pending search text survives another immediate language click. |
| Import preview and conflict policy | Preview makes no storage writes; v1 defaults to keeping the current draft; v2 explicitly selected overwrite affects the selected draft; history merges, unknown IDs survive, classroom list remains local, and a pre-import backup downloads. |
| Storage denied / quota exhausted | A fresh disposable context throws on storage access or writes. Checking and separate drafts remain usable, the page says saving is unavailable, and a real downloaded v2 backup contains session work. |
| Immediate export | Draft input and the export click are dispatched in the same JavaScript turn, before the debounce can run. The downloaded JSON contains that draft. |
| Keyboard | Left/right navigate while a toolbar button is focused, preserve text-input editing, Space on an input does not reveal a hint, Space on the reveal button opens exactly one stage, and Escape closes the question dialog. |
| Print preparation | The actual application print buttons prepare teacher/student/work views. Teacher print leaves recorded hint use unchanged and print completion restores safe student defaults and the classroom card visibility. |
| Simulation | An actual 200-trial simulation creates the numerical frequency table, which is captured in the real A4 PDF. |

The harness captures browser `pageerror` events. A passing run requires every case to pass and zero such errors.

## Actual A4 PDF checks

`page.pdf()` invokes Chromium's print renderer with the site's real print CSS. Only `window.print()` is replaced with a nonblocking flag so that the application's own print-preparation handler can be exercised before producing the PDF. This is not a screenshot or a substitute stylesheet.

The selected long reasoning item is `review-c1-3-written-11`: a nine-step domain/range and function-evaluation solution. It is printed together with the five-option official question `jm01-2026-i-1-choice-1`. Both English and Traditional Chinese teacher versions are produced. The audit checks the first and final substantive proof sentences occur on different physical pages, and all nine Chinese prose steps survive extraction. It also checks:

- Every page is A4, with no extracted non-whitespace glyph outside the paper bounds and no empty page.
- Student and work versions hide the teacher's proof and preserve all five multiple-choice options.
- The work PDF contains separate first-attempt and correction markers.
- The simulation PDF preserves assumptions, the seed and all three frequency rows.

PDF text extraction checks are supplemented by PNG previews of the two proof pages and the simulation pages. Inspection checks readable equations, Chinese glyphs, continuation across the page boundary, and table rows. PDF.js may report unsupported decorative shading; the original Chromium PDF and its extracted content remain the primary artifact.

## Current evidence and limits

The latest 13 October classroom-source run passed all 13 cases with zero page errors, including the previously failing native two-tab history case. The five actual PDFs passed all 26 extraction/layout checks. The interim results below are historical diagnostics; they do not supersede the latest generated reports. Production verification is recorded separately after publishing the merged release.

The interim build passed 9 of 10 original browser cases, with zero page errors. Its only application failure was the already-reproduced rapid filter/language race, which was repaired in source and awaits the final built-site rerun. The original four PDFs passed 21 extraction/layout checks: teacher 4 pages, student 2 pages, saved work 2 pages, and simulation 12 pages. English proof steps 1–2 appeared on page 1 and steps 3–9 on page 2. Chinese PDF, explicit keyboard and immediate-export checks were added subsequently and must be included in the final result below before release acceptance.

These checks do not establish the mathematical accuracy of every exercise, assess every browser engine, print every lesson, or prove all possible font/layout combinations. Mathematical verification is reported in the separate content audits; the parent task separately performs ordinary interactive browser review. This document makes no production-deployment claim.
