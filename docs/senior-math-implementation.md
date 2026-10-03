# Senior Mathematics Studio

The bilingual entry points are `/teaching/senior-math/` and `/zh/teaching/senior-math/`. The original JAE studio remains at its existing routes and retains all original question IDs and `jae-math-v1` records.

## Content inventory

- Five A-series textbooks:18 chapters and73 verified main section entries.
- 87 lesson banks:73 textbook entries and14 supplementary lessons. Each has3 worked examples and10 exercises (4 foundation,4 standard,2 transfer).
- 18 mixed chapter assessments of15 questions (6 foundation,6 standard,3 transfer).
- 1,401 newly authored question records, including870 scalar answers and531 written/diagram/proof results.
- Six separately sourced school learning/revision routes (T01–T06), with grade/stream independent of JM01/JM02 applicability. No semester boundary is inferred.
- All12 official2021–2026 JM01/JM02 papers:150 top-level questions and287 independently authored bilingual leaf-part explanations (90 MC,197 written). All optional JM02 questions are included.
- 26 records remain in the original two-topic studio (the18 original IDs plus8 added exercises). The combined bank has1,714 records.

Course, book, chapter, lesson, question, paper, route, teacher, source and revision pages have fixed URLs. Each lesson/question/paper embeds only its own content. The bank carries search/filter metadata rather than all solution bodies. Official PDFs remain at the official source URLs; textbook and school PDFs are not republished.

## Verification

`pnpm test:senior-math` runs the integrated content/route contract, independent answer recalculations, written-review fingerprints, bridge equation/domain checks, original-pilot answers, browser-model state and actual inquiry-initializer regressions. `pnpm test:senior-math:built` reads every bilingual generated course route and checks content isolation, rendered formulas, language pairing, local links, source distinction and question inventory. Both are required by `pnpm build`.

The compulsory checker recalculates417/417 scalar answers using175 methods. It rejects a deliberate mutation of each answer and cannot consult solution fields. The advanced checker recalculates512/512 scalar answers (including74 shared compulsory statistics answers); the4 bridge lessons add15 scalar answers. This covers all870 newly authored scalar answers. Written solutions use separate manual agent algebra/domain reviews and version fingerprints, rather than a claim of automated theorem proving or independent human certification. The [compulsory audit](senior-math-foundations.md), [advanced audit](senior-math-advanced.md) and [per-item official-paper audit](senior-math-papers.md) record the boundaries and source discrepancies.

The source manifest records the hashes and page counts of the11 supplied PDFs. Section source records distinguish one-based PDF pages from printed pages; school routes retain actual inner-text starts when a contents page omits or misnumbers material. The2027 syllabus map lists JM01's16 areas and JM02's9 additions, including inheritance from JM01.

## Browser behaviour

No account or remote progress service is required. Browser-local records are shared across both languages and all lesson routes. Saves merge only edited records; opening a page does not dirty an inquiry note. A changed answer is pending until checked again. Written answers remain self/teacher assessed. JSON and readable-text exports include all local records, including other-page work and inquiry notes, with a fresh storage snapshot. Unreadable prior data is preserved; denied reads/writes retain the current session for export.

There are24 reusable inquiry models, with lesson-specific overrides for lines/circles, conic forms, induction, matrices, polar coordinates, finance, binomial/hypergeometric/normal distributions, outcome scaling and independence tests. Numerical diagrams state modelling assumptions and degeneracies; probability simulations distinguish finite frequencies from exact probabilities. Inputs that change simulation parameters invalidate the earlier sample. The prediction/explanation/transfer prompts accompany each activity.

Local browser checks cover desktop and390×844 layouts, numeric/written answers, reload and language persistence, layered hints and keyboard navigation, question enlargement, pen/laser/clear controls, graph parameters/simulation, question-bank filtering, teacher links, both print editions, export payloads, denied/corrupt storage and native solution reading without scripts. Printing is exercised with a local output-sink fixture so no system print dialog is required; this does not certify every printer's pagination. The fixture/server and original downloaded PDFs remain under `.tmp/` and are excluded from the release.

## Maintenance

Edit curriculum data under `src/data/senior-math/`. A substantive change to a reviewed written family intentionally fails its fingerprint gate until the derivation and conditions are reviewed again. Do not regenerate audit fingerprints just to silence a failure. The official-paper full gate requires all12 inventories and all leaf parts before any full-paper completion label can be released. New textbook skills reuse existing lesson IDs where possible; new IDs must also be accepted by the shared progress model and fixed-route contract.

Run the complete repository build before release, preserve unrelated worktree files, and verify the matching GitHub Actions run, production routes and release asset hashes after push. A local build alone is not evidence of deployment.
