# Math Studio English practice and foundation audit

Reviewed source on 2026-10-13. `english-practice.js` contains authored English for all 1,099 distinct Chinese literals/templates extracted from the original question bank, plus practice controls, checking feedback, self-assessment labels and shortfall explanations. `english-learning.js` covers all 354 foundation/comparison entries and the scaffolding interface. The separate `english-challenge.js` supplies the enhanced challenge families. Dictionaries load after the authored definitions and before the app renders.

Localization changes displayed authored prose. Original generator formulas, parameter ranges, tolerance rules, question fingerprints and legacy storage keys stay unchanged. All dynamic placeholders in the original question-bank entries are retained in their English counterparts. Learner drafts remain in input/textarea values. Earlier comparison responses use an explicit user-content boundary with authored labels translated separately, so an answer coinciding with a known Chinese interface label is still preserved verbatim.

Source acceptance checks:

- Every original question family is generated across its 128 bounded seeds; prompts, steps, hints, choices and written rubrics have English without remaining Han text.
- The complete selectable bank is scanned: **38 chapters, 328 families, 16,076 questions, including 760 written tasks**. This count describes bounded variations, not 16,076 independently reviewed problem structures.
- Every foundation and controlled comparison is scanned across 80 seeds, including explanations, domain restrictions and wrong-equation warnings.
- Rendered practice controls, numerical/written feedback, answer units, choice markers and shortage summaries are scanned. Numeric answers and parameters are unchanged by selecting English.
- Learner text that matches Chinese interface vocabulary remains verbatim in previous comparison records.

Run:

```powershell
node --test tests/math-studio-practice-english.test.cjs tests/math-studio-learning-english.test.cjs tests/math-studio-challenge-english.test.cjs tests/math-studio-support.test.cjs tests/math-studio-inquiry.test.cjs
```

These are source/content checks. Final-page language switching, print layout, keyboard behavior, browser storage and deployed assets need the separate built-site browser acceptance run. No production parity or deployment is established by this document alone.
