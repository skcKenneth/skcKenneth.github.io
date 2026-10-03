# JAE Mathematics Studio

The bilingual pilot is available at `/teaching/jae-math/` and `/zh/teaching/jae-math/`. It contains two complete foundational lessons aligned with selected parts of the 2027 JM01 syllabus: quadratic equations/functions and trigonometric ratios/function graphs. Each lesson has three original worked examples and six original exercises, with two layered hints, worked reasoning and misconception notes. Five official 2021–2025 JM01 papers and suggested-answer PDFs remain linked on their official hosts.

## Learning and classroom flows

The same stable question IDs serve both languages and both modes. Study mode supports multiple-choice and numerical checks, first-attempt notes, corrections and self-reported completion. Correctness is separate from completion. Numerical entry accepts a finite decimal or simple fraction; it does not evaluate algebraic expressions. Worked examples provide reasoning rather than automatic marking.

Classroom mode displays one question at a time and progressively reveals its hints and solution. New questions start with the answer hidden. The directory and keyboard navigation support projection. Zoom, fullscreen, a laser pointer and coloured drawing tools support discussion; drawings are kept per question for the current session, and clearing affects only that question. Keyboard shortcuts are inactive while editing an answer or note.

The quadratic graph handles linear and constant degeneracy explicitly, including the zero function. The sine/cosine graph keeps angle units explicit; a zero amplitude or frequency is treated as constant without assigning it a least positive period.

## Persistence and accessible fallbacks

Progress uses the locale-independent `jae-math-v1` localStorage key. It records inputs, attempts, first reasoning, corrections, completion and the last position. It contains no name, account or remote transmission. Corrupt records and denied storage are handled without stopping practice. An unavailable-storage notice means edits are held only in session memory and should be exported before leaving.

JSON and plain-text exports allow students to retain their work. Student print view excludes solutions; teacher print view includes them. Lessons and native hint/solution disclosures remain readable without JavaScript. Mobile layouts, labelled controls, visible focus and reduced-motion behaviour are part of the browser acceptance checks.

## Verification and maintenance

`pnpm run test:jae-math` checks the mathematical model, numeric input grammar, persistence of actual question IDs, bilingual content, KaTeX expressions and the five-year source catalogue. The independent answer ledger and official-source checks are in [jae-math-sources.md](./jae-math-sources.md). UI/runtime and release evidence are recorded separately; passing unit tests does not establish deployment.

For release, run the repository security gate and full build, then test both language routes in a real browser at desktop and 390px mobile width. Cover staged answer hiding, graph controls and degenerate cases, answer checking, reload/cross-language persistence, denied storage, annotations, zoom/fullscreen, export, print, keyboard navigation, entry links and exact-title search. Verify the deployed commit's Actions result, public routes and changed assets before claiming publication.

## Pilot acceptance record (2026-10-03)

The independent mathematical audit covers all 18 answers. Source/model tests pass (7 groups) and both built-language checks pass (2 groups). The repository security gate and dependency audit pass. The full repository build passes, including bilingual validation, mathematical rendering, internal links, output checks and search indexing.

Real-browser checks cover incorrect/correct/empty/invalid answers, decimal and fractional input, reasoning/correction/completion records, reload and cross-language retention, layered classroom hints and resets, keyboard navigation, graph parameter changes and constant-function cases, zoom/fullscreen, separate question annotations and laser, denied-storage practice, and native no-JavaScript disclosures. Actual downloaded JSON and UTF-8 text records were read back. The print fixture runs the actual print handlers and all print CSS: both editions expose 18 questions and 8 complete choice lists; the student edition hides solutions, the teacher edition opens all 54 disclosures, and returning restores the previous classroom state.

Responsive checks use a same-origin 390 × 844 browser frame because this desktop preview's viewport override did not take effect. Its real CSS viewport matches the mobile media query, and document client/scroll widths match; this verifies narrow-screen rendering, not a physical phone or touch-device emulation. Release status remains subject to the exact-commit Actions, public route, asset-hash and production-browser checks.
