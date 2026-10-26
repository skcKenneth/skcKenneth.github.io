# Senior 1 short inquiry collection

The collection follows the existing Math Studio Senior 1 map: 14 chapters, including the four additional-mathematics chapters. Its 85 authored tasks are not a claim to digitize every textbook exercise or to measure student attainment. Complex numbers, probability and statistics remain in their existing courses.

Public entry: `/zh/teaching/senior-math/inquiries/` and `/teaching/senior-math/inquiries/`. Each activity has a stable `g10-CC-NN` identifier, an original-school chapter link, unified inquiry catalog entry, bilingual search aliases and student/teacher print routes. The same activity number appears on screen and paper. Counts by chapter are 4,4,4,4,15,9,12,6,5,6,4,3,4,5.

The legacy `sets`, `quadratic`, `exponential` and `trig` activities and their evidence remain accessible through their original URLs and IDs. They are not cloned into new subsection evidence. Function tasks 05-01 to 05-14 use the existing direct-manipulation state/reducer/renderer and worksheet notebook identities; 05-15 adds squaring and extraneous roots. Full function worksheets remain available as extensions.

## Classroom design

Each short inquiry has one core question, at least three executable comparison cases (including a counterexample or boundary), meaningful controls, an accessible results table, a paper prediction, mathematical explanation with conditions, teacher prompt, misconception, extension and independent exit question/answer. Suggested timing is 1 minute prediction, 3 comparison, 2 explanation, 1 exit check. The model starts hidden; no typed prediction is required. Finite observations are distinguished from mathematical justification.

All controls, task text and teacher material have complete English and Traditional Chinese versions. Student prints contain two cards per A4 page and no teacher answer markup. Teacher reference prints explicitly disclose answers and use one activity per page for legibility. The pedagogical sequence is an original adaptation informed by NRICH's trial, conjecture and generalization approach: https://nrich.maths.org/articles/low-threshold-high-ceiling-tasks-secondary-classrooms . No educational-effectiveness claim is made.

## Records and compatibility

The collection uses the existing `math-system-notebook-v1` store and coordinated writer, not a new independent evidence database. Optional saved notes and comparison records are included in existing complete backup/restore. Unsaved drafts stay in sessionStorage in the current tab, with notebook export available. Function short views share the original `senior:function-worksheet:NN` note identity. Unified activity IDs remain distinct navigation entries, with `noteId` explicitly mapping shared evidence. Language switches preserve model URLs and per-tab drafts. Visits are not marked as learning completion.

## Verification and release

`pnpm run test:g10-inquiries` checks the exact required ID map, bilingual fields, contrasting cases, valid/invalid boundaries, finite SVGs, independent mathematics, catalog/search identities and backup compatibility. Existing Math Studio and full-site tests remain required. `node scripts/g10-inquiries-browser-qa.mjs` exercises all activities and print routes using a disposable real Chromium context; reports are kept under `.tmp/g10-inquiries-qa/`. Production mode uses the public origin and preserves the distinction between local checks, deployed checks and future classroom feedback.

Before reporting publication, record the exact commit, successful Pages Actions run, live routes and matching asset hashes; then run production interaction and A4 PDF checks. Keep evidence and any unresolved limitation in the release report.
