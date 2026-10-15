# Lower-volume classroom release acceptance

Scope: 25 fixed bilingual packs, 400 original questions, 11 supplied textbook chapters. Year 7 contributes 13 packs / 208 questions; Year 8 contributes 12 / 192. The complete upper/lower registry contains 53 packs / 848 questions. Questions retain stable IDs; the original 28-pack data is bound to the formula-release baseline by an independent digest test.

## Independent mathematical checks

`tests/guided-practice-lower.test.mjs` checks all 400 questions from original givens with an independent test kernel. It covers exact rational systems and substitution into every original equation, rank and infeasible contextual solutions, signed inequalities and integer endpoints, exact square-free radical arithmetic and real domains, translations, strict triangle existence and Pythagoras, declared quadrilateral hypotheses and coordinate counterexamples, functions and model domains, frequency density, weighted summaries, multiple modes and variance divided by n. Unknown audit kinds/rules fail. Negative probes reject wrong arithmetic, changed display expressions and lost hypotheses.

The source contract checks the closed 25-pack inventory, the complete 53/848 registry, all referenced lower-volume lesson ranges and printed-to-PDF page offset +8, exact 40-minute routes, question roles, source coverage, specific half-completed guided attempts and solution privacy. It does not claim the source textbooks' original answers were all checked; lower-volume questions are original and no separate foundation/answer books were supplied.

`tests/guided-practice-inquiry.test.mjs` separately checks all twelve detailed Year 8 investigations, their bilingual formulas and 18-minute allocations, exact geometry counterexamples and variance transformations. It runs the actual native tariffs and outlier calculations with the stated parameters. The one-line engine is not represented as a simultaneous two-line renderer; the tariffs activity is used for the two-plan comparison. Static paper investigations do not imply newly implemented interactive engines.

## Presentation and preservation

The shared authored-math renderer preserves escaped learner text and renders only explicit author formulas. Release 2 additionally distinguishes a TeX row break before a parenthesised matrix coefficient from an inline opening delimiter. The first formula release was formally deployed at `42e269e0b812bbbb870e12738198dc79199e93af`; see `formula-rendering-qa.md` for its production evidence.

Lower-volume source labels identify actual textbook chapters and正文課時; they do not reuse the upper foundation labels. Existing native IDs and upper deep links remain stable. Native selectable question fingerprints are unchanged. The paper runtime creates no learning scores or paper-answer records. Reveals remain in the current page; reload hides them. Student print and JSON export are independently generated without answers, audit metadata or solution geometry.

The new SVG views support given data tables, frequency and density histograms, sector charts, signed coordinate grids, unnumbered translation grids, interval endpoints and clipped function lines. Blank construction axes retain labelled scales. Teacher solution layers are separate. Lower coordinate plots have larger printed grids; teacher PDFs include prerequisites, route timing and investigation instructions.

## Reproducible release gates

```powershell
pnpm run test:guided-practice:lower
pnpm run build
node scripts/guided-practice-lower-browser-qa.mjs --serve dist --output .tmp/lower-acceptance
python scripts/guided-practice-lower-pdf-audit.py .tmp/lower-acceptance
node scripts/guided-practice-browser-qa.mjs --serve dist --output .tmp/lower-pilot-regression
python scripts/guided-practice-pdf-audit.py .tmp/lower-pilot-regression
node scripts/guided-practice-upper-browser-qa.mjs --serve dist --output .tmp/lower-upper-regression
python scripts/guided-practice-upper-pdf-audit.py .tmp/lower-upper-regression
python scripts/package-guided-practice-worksheets.py .tmp/math-lower-core-20261015.zip .tmp/lower-acceptance --scope lower
python scripts/package-guided-practice-worksheets.py .tmp/math-all-core-20261015.zip .tmp/lower-pilot-regression .tmp/lower-upper-regression .tmp/lower-acceptance --scope all
```

Use the configured Python runtime with pypdf, pdfplumber and pypdfium2. Browser gates use disposable contexts and explicitly synthetic legacy records. They test actual downloads, both classroom routes and languages, keyboard/mobile/projection controls, reload behaviour, source navigation, forced two-tab writer overlap and backup restoration. They do not establish preservation of a real learner profile that was not available for inspection.

Paper audit examines actual Chromium PDFs without modifying them: all 50 lower student editions must be exactly two A4 pages; bilingual questions and teacher answers must match the same registry, answer disclosures must not leak into student output, and question cards must clear the footer. Packaging requires complete passing browser and physical PDF reports, exactly six editions per registered pack, identity/file binding and CRC validation. Fixtures, backups and original textbook PDFs are excluded.

After a scoped commit/push, require successful Actions build/deploy, then run `guided-practice-live-verify.mjs` with the confirmed commit SHA and the native browser/search harnesses against production. Local build, browser and paper acceptance are distinct from production acceptance. Failed diagnostic reports remain alongside the accepted run and are never relabelled as passes. Classroom effectiveness remains a teacher trial outcome, not a software acceptance claim.

## Final evidence

The release owner records the frozen build, browser/PDF counts, ZIP hashes and exact deployment evidence here or in the delivered local release report after completing the gates above. This section must not be read as a claim that a planned gate has passed.

The first lower collection is retained in `.tmp/lower-acceptance` as failed evidence. Independent physical inspection found two real collisions: both square-classification student languages on page 1 (7.125 pt overlap), and the English parallelogram student page 2 (8.625 pt). The fixes are narrowly scoped: the square guided task already supplies three fill-in lines, so its additional blank area is reduced by 6 mm; the parallelogram practice page repeats the scale warning once in the footer instead of below each figure, preserving the diagram and proof-writing sizes. The later accepted collection must regenerate these papers.

Separate harness corrections preserve the actual requirements: a supplied profit relation is not a leaked requested model; language assertions wait for client initialization; point labels compare complete text rather than substrings such as Q and Q′. Two visually verified PDF ToUnicode punctuation aliases are normalized (en dash/figure dash and fullwidth slash/division slash). A short supplement page is accepted as nonblank only with its complete authored question and physical card; the student core still requires exactly two A4 pages. These corrections do not alter question answers, formulas or the failed baseline files.
