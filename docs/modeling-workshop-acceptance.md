# Workshop acceptance — 12 September 2026

Status: release candidate verified locally before deployment. Six bilingual core lessons are complete, with advanced topics explicitly presented as reading roadmaps.

| Check | Evidence / result |
|---|---|
| Source map | 20 supplied PDFs and all 27 Notes; selected chapter citations distinguish printed and PDF pages; solution manual internal-only |
| Scientific unit/property tests | 16 passed: analytic solutions, hand calculations, conservation, convergence, optimization and intentionally wrong student functions |
| Baseline experiments | All six reference runs passed their checks |
| Reference notebooks | All six executed top-to-bottom in separate fresh CPython kernels |
| Actual learner notebook | Downloaded through the Notebook button, then executed successfully in a fresh kernel |
| Browser Python | All six run in actual Pyodide workers; default runs match CPython across 39 metrics and 409 CSV rows within recorded tolerances |
| Incorrect implementation | Missing tank balance triggers failure; correct balance plus student Euler loop passes the independent two-step check |
| Failure scenario | Diffusion lambda=1 explicitly fails stability; fixed and periodic boundaries exercise loss and conservation respectively |
| End-to-end task flow | Each lesson navigated through all eight steps with labeled QA responses, self-marked complete and exported as a Markdown report |
| Persistence | Reload restored the selected step and eight marks; Traditional Chinese question and prediction persisted on the English page |
| Import/export | Actual JSON download/import restored Unicode, code and settings; imported checks marked stale without execution; notebook, Python, CSV, PNG and report downloads checked |
| Reset confirmation | In-page confirmation avoids host-native modal blocking. Cancel preserved 8/8 marks; confirm downloaded a backup and reset to 0/8. Wrong-lesson imports were rejected. QA drafts were reset after evidence collection |
| Exceptions and stop | Intentional ValueError displayed; infinite loop stopped by Stop; worker restart and valid rerun succeeded |
| Automatic limit | Infinite loop terminated by the 30-second timer; observed timeout message and retained draft |
| Storage/runtime failure | Local-only QA server served the production build with an IndexedDB SecurityError and worker startup error injected. Session-only notice, Chinese error, draft export and labeled reference material remained usable |
| Code editor and comparison | CodeMirror 6 opened on mobile; baseline/learner modal showed separate settings, figures and metrics |
| Responsive and keyboard | Desktop and 390px mobile viewport inspected; mobile document width 375px including scrollbar allowance, no horizontal overflow. Task/Python/Results panels and KaTeX checked. Tab moved between step buttons |
| Snapshot independence | `SCIENCEPROJECT_DIR` pointing to an absent checkout verified all 41 committed public assets |
| Existing search | Chinese `混合槽` and English `modeling workshop` return relevant pages. Full Chinese `數學建模學習工坊` now returns the course through a bilingual title catalogue supplementing Pagefind; catalogue matching and URL deduplication tests pass |
| Full existing build | Exit 0; Astro: 0 errors, 0 warnings, 0 hints. Existing regression suite, Pagefind, internal links in 614 HTML files and output scan of 1709 files passed |

Machine-readable scientific and browser records are in the independent `ScienceProject/modeling-workshop/validation` directory. The committed release manifest identifies the exact public bytes. The failure injection was confined to a separate local QA server and is absent from website assets. Numerical checking and the storage-failure simulation do not claim formal accessibility certification or validation with actual learners.

![Desktop course map](modeling-workshop-qa/desktop.png)

![Mobile course map](modeling-workshop-qa/mobile.png)

The hero diagram uses separate grid rows for labels and central text; 390px, 762px, 900px and 1280px viewports passed overlap and horizontal-overflow checks. Release assets disable Git text conversion so manifest hashes remain valid across Windows and Linux checkouts.

First startup still requires a network connection to fetch scientific packages. Browser-local drafts do not synchronize across origins or devices; learners can export JSON. No account, AI tutor or formal grading was added. This document records pre-deployment acceptance.
