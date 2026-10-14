# Upper-volume chapter-core acceptance

The approved expansion contains 21 new selections (nine Year 7 and twelve Year 8), with sixteen fixed original questions each. `src/data/upper-core-plan.mjs` is the closed inventory. These are forty-minute consolidation selections after the cited textbook teaching, not ninety-five complete lesson-period replacements. The seven original pilots and their acceptance files remain separate and unchanged.

## Independent source checks

Run `node --test tests/guided-practice.test.mjs tests/guided-practice-upper.test.mjs`.

The new QA helper uses reduced `BigInt` rational numbers and its own parser, without importing production answer computation. Powers precede a leading minus. Polynomial identities are verified by exact sparse multivariate coefficients, rather than a few sampled substitutions. Rational-function identities use cross multiplication while retaining the zeros of every original denominator and divisor, including nonzero bases for zero or negative integer powers. Equation candidates are checked in the original expressions; cancelled and extraneous points remain excluded. The root checker solves linear/quadratic equations exactly and handles higher-degree factored LCDs with a bounded rational-root search and exact division. Unsupported irrational or unfactored higher-degree real-root cases fail explicitly. Integer factorisation also checks that the remaining supported linear/quadratic factors are primitive and irreducible.

Congruence checks use named vertex correspondence and only the declared side, angle and right-angle givens. SSS, SAS, ASA, AAS and HL are checked for the correct positions; coordinates corroborate the claim but cannot supply an unstated hypothesis. AAA and SSA require actual noncongruent counterexamples. Other concept questions have explicit rule-specific checks; unknown audit kinds and unknown conceptual rules fail.

Condition-completion tasks distinguish `providedGivens` from `requestedAdditional`: the baseline must be insufficient for the named requested criterion, the proposed addition must complete that criterion, and student diagram marks must show only the original premises. A baseline may already support another criterion: the criterion-comparison extension explicitly starts with SAS and asks for an additional fact permitting direct SSS. Both SSS completion tasks have regression guards against marking BC=EF before asking learners to identify it.

The source gate also checks the approved IDs, both languages, three hints, worked steps, rubric, exact roles, source-lesson tags, fixed versions and preservation of the original pilot test's SHA-256.

## Real browser and paper

Use the installed Chromium headless shell and the frozen build:

```powershell
node scripts/guided-practice-upper-browser-qa.mjs --serve dist --output .tmp/guided-practice-upper-acceptance
& 'C:\Users\kenneth\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts/guided-practice-upper-pdf-audit.py .tmp/guided-practice-upper-acceptance
```

`--base https://skckenneth.github.io` targets a confirmed deployed release. `QA_CASES` is for focused diagnosis only; a filtered run is not full acceptance. Each run uses disposable contexts and synthetic legacy records, including malformed and unknown records. It does not read or modify personal browser profiles.

The complete expansion run creates 126 PDFs: every new pack in both languages with separate student, teacher and supplementary editions. All 42 student core documents must have exactly two A4 pages, with the four opening questions on page one and the six independent/exit questions on page two. All sixteen teacher reference answers must survive extraction. Supplementary and teacher editions may span more pages. Printing explicitly resets media emulation, uses the real application print-selection path, and checks that the next default print is the blank student edition even after all screen answers were revealed.

The PDF auditor checks size, page breaks, prompt/reference text, answer privacy, glyph bounds and English text. It also compares actual PDF card borders with footer-word positions on every student page, and checks neighbouring B/D option markers against preceding body-font glyphs. These physical checks complement browser print-layout measurements, whose viewport can differ from A4 wrapping. It renders every page for visual inspection. NFKC is applied to extracted text, with one precise documented font alias: U+2ED1 CJK RADICAL LONG maps to U+9577 長. No other missing character is ignored. Automated text and bounds checks do not replace visual review of diagrams and handwriting space.

Correct multiple-choice options are legitimate student question content. The forbidden-answer text scan exempts a complete reference-answer string only when it already appears in an authored prompt, option or scaffold in that printed edition. It does not exempt reference-answer labels, solution markup or forbidden answer fields in student exports; those remain separately checked. Printed formula overflow is retained per PDF and fails full acceptance after the complete document collection, so one layout error does not hide later worksheets.

The browser also checks every new route, trusted native chapter entry, both languages, 390×844 layout, language switching with the inquiry route retained, keyboard controls, session-only answer reveals, scrubbed student exports, actual SVG coordinates and given proof marks. A forced common-writer overlap checks two new classroom selections and native backup/restore. No paper answers, roster, login, backend or new practice storage key is introduced by these presentations.

## Evidence boundaries

Keep failed reports and PDFs in distinct directories. A source pass is not a browser pass; a local frozen-build pass is not production deployment. Record the exact built/deployed revision separately. Publication requires the root release process to verify build, deployment, live routes/assets and the relevant production browser cases. Do not weaken an assertion to make a mathematical, privacy or paper-layout failure disappear.

## Accepted local frozen build: 14 October 2026

The final replacement evidence is `.tmp/guided-practice-upper-acceptance-text-release/report.json`, `pdf-manifest.json` and `pdf-audit.json`. The browser served the frozen `dist` itself at `http://127.0.0.1:55751`, using disposable Chromium 149.0.7827.55 contexts. The complete run began at `2026-10-14T12:49:56.742Z` and both browser and PDF processes exited zero.

| Gate | Actual result |
| --- | --- |
| Real browser cases | 8/8 passed; zero page errors and print-layout issues |
| Bilingual paper editions | 126 actual PDFs for all 21 new packs |
| Physical PDF checks | 1,200/1,200 passed |
| Student core pagination | 42/42 documents contain exactly two A4 pages |
| Native JSON downloads | 84; student solutions scrubbed, teacher content matches the fixed source |
| Responsive and language controls | All 42 pack/language layouts at 390×844; trusted language switches retain the inquiry route |
| Existing records and classroom | Synthetic legacy bytes unchanged, forced two-tab overlap passed, native backup restored into a fresh context |
| Rendered diagrams | 87 actual SVGs checked for coordinates, declared givens and hidden solution points |

The final full `pnpm` build is recorded in `.tmp-upper-final-text-build.log`. The accepted G8 authored source `src/data/guided-practice/g8-upper.mjs` has SHA-256 `89910835d9ff040f6ea66b41032b234611f198896d85b76b3fccc7f000754540`. The original pilot checks remain separate; the combined independent source gate passed 16/16. The release owner also visually reviewed final English HL and rational-equations student page two at 1.4×, confirming word spacing, line wrapping, diagrams and footer clearance.

Earlier evidence remains intact. `.tmp/guided-practice-upper-acceptance` records the original three-page overflow in three student editions. `.tmp/guided-practice-upper-acceptance-final` passed the older 990 checks, but subsequent manual inspection found a footer/answer-line collision and overlapping option glyphs. Before accepting a replacement, the new read-only `--probe-collisions` guard rejected its preserved HL English PDF: page-one footer clearance was −1.125 pt, page two was −12.375 pt, and three B/D marker glyph overlaps were reported. In the corrected replacement, both HL English pages have 1.875 pt clearance and no option collisions. `.tmp/guided-practice-upper-acceptance-release` then passed the stronger 1,200 checks, but remained a candidate after manual review found missing spaces in English word-model prose. The final text-release directory replaces that candidate after the whitespace correction and a complete fresh run; no earlier report was overwritten.

These results establish local acceptance of the approved fixed selections and their printed/exported forms. Inquiry-entry checks confirm navigation and HTTP success for sixteen distinct destinations; they do not rerun every existing inquiry engine. Synthetic disposable storage checks do not inspect personal browser records. Deployment and production acceptance are recorded by the release owner after publication.
