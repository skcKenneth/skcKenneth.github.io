# Compulsory-course authoring and verification

The `src/data/senior-math/foundations.mjs` entry point exports the original bilingual material for the two supplied compulsory textbooks. It contains 43 section-entry lessons, 10 chapter descriptors and 10 chapter assessments. These are authored teaching materials, not a transcription of the textbook or its exercise answer book.

## Finite content inventory

| Book | Chapters | Main section entries | Worked examples | Independent lesson exercises | Chapter assessment items |
| --- | ---: | ---: | ---: | ---: | ---: |
| Compulsory 1 | 5 | 24 | 72 | 240 | 75 |
| Compulsory 2 | 5 | 19 | 57 | 190 | 75 |
| Total | 10 | 43 | 129 | 430 | 150 |

Every lesson has three worked examples, one at each labelled level, and ten practice items with a 4 foundation / 4 standard / 2 transfer distribution. Every chapter assessment contains 15 items with a 6 / 6 / 3 distribution. The assembled corpus has 709 question records: 129 examples, 338 automatically checkable numerical tasks, and 242 written tasks with explicit self-assessment rubrics. Written answers are not represented as automatically verified algebra or proofs.

Each section bank supplies seven different task families, with further original diagnostic questions replacing repeated constant tasks. Examples include set membership versus multiplicity, counterexamples to implications, open-domain extrema, inverse domains, phase divided by frequency, ambiguous triangle data, zero-vector and zero-complex direction, invalid spatial parallelism tests, and survey interpretation. Numeric parameter variants occur within families; the curriculum is not generated from a single number-substitution template.

Chapter assessments use new parameter instances across underlying section skills. When a constant conceptual question would exactly repeat a lesson task, the assessment instead asks a two-part, two-skill question, retaining the complete reasoning and conditions for both parts. There are currently 33 such assessment items. Their `skills` arrays point to the actual source sections rather than to the review container. All 709 assembled prompt-plus-expression signatures are distinct.

## Textbook provenance

The exact user-supplied files are:

- `高一必修 第一册(A版).pdf` — 270 PDF pages; exact identity is recorded in `curriculum-source-manifest.mjs`.
- `高一必修 第二册(A版).pdf` — 282 PDF pages; exact identity is recorded in `curriculum-source-manifest.mjs`.

Section sources record `documentId`, section number, printed start page and one-based PDF page. Both files use PDF page = printed page + 7 in the verified main-text mapping. Compulsory 1 is scanned: its PDF contents pages 6–7 yielded no text in this authoring pass, so the project’s visually verified contents-page mapping was retained. Compulsory 2 contents pages 6–7 were independently read with `pypdf`.

| Compulsory 1 section | Printed starts |
| --- | --- |
| 1.1–1.5 | 2, 7, 10, 17, 26 |
| 2.1–2.3 | 37, 44, 50 |
| 3.1–3.4 | 60, 76, 89, 93 |
| 4.1–4.5 | 104, 111, 122, 130, 142 |
| 5.1–5.7 | 168, 177, 188, 196, 215, 231, 242 |

| Compulsory 2 section | Printed starts |
| --- | --- |
| 6.1–6.4 | 2, 7, 25, 38 |
| 7.1–7.3 | 68, 75, 83 |
| 8.1–8.6 | 97, 107, 114, 124, 133, 146 |
| 9.1–9.3 | 173, 193, 220 |
| 10.1–10.3 | 228, 249, 254 |

Section 7.3 retains an explicit `optional: true` marker because the original contents mark complex-number trigonometric representation with a star. Section 9.3 uses an original anonymous commute investigation to teach the statistical-investigation process; it does not reproduce the textbook’s employee/body-mass-index dataset. Main section coverage is not a claim that every textbook reading, exploration sidebar or original exercise has been digitized.

The original PDFs were read without modification and are not copied into the public website. Every newly authored question is marked as an original question in the shared authoring contract. Neither school grade/stream assignments nor examination syllabus applicability is inferred merely from the compulsory-book number; those mappings belong to the separately sourced course catalogue.

## Teaching and inquiry fields

Each lesson includes bilingual objectives, at least two concept notes, conditions and misconceptions, prerequisite identifiers, teacher prompts, board content, anticipated correct reasoning/corrections, and a four-part marking rubric. Teacher board mathematics is held in separate `math` fields for rendering rather than appended as raw TeX inside prose. Each inquiry contains prediction, explanation and transfer prompts and a canonical capability type such as `sets`, `functions`, `trigonometry`, `vectors`, `complex`, `solids`, `statistics` or `probability`.

All examples and exercises have two hints, complete authored steps, a result and an explanation. The first hint identifies a strategy, and the second gives an intermediate relation or a more specific check. Written tasks retain bilingual model answers and rubrics. Difficulty labels are teaching judgments, not empirically calibrated item-response measurements.

## Reproducible checks

Run:

```powershell
node src/data/senior-math/foundation-checks.mjs
```

Latest result: 43 lessons, 10 chapters, 10 reviews, 709 questions, **1,385 mathematics fields passing strict KaTeX**, **all 417 numerical answers independently recalculated**, and **292 nonnumeric answers bound to the manual written-solution review**. Numeric coverage is 209 in compulsory 1 and 208 in compulsory 2, including worked examples and chapter assessments. Written coverage is 178 and 114 respectively. The recalculation uses 175 methods and fails if any numerical question ID is uncovered. The script also checks:

- required bilingual text, source offsets and document identifiers;
- unique IDs and exact prompt-plus-expression signatures across the whole foundational corpus;
- all lesson and review counts and level distributions;
- complete hints, steps, conditions and written-response rubrics;
- prerequisites/skill targets represented by actual section IDs;
- absence of accidental control characters and undecoded authoring markers;
- finite-set and probability-space enumeration, direct integer-inequality solution counting, constrained extrema, compound growth, trigonometric evaluation using radian library functions, vector-coordinate calculations, repeated complex multiplication, and independently integrated solids;
- original-equation/domain checks, numerical comparison with the authored answer only after deriving from the public givens, and explicit coverage of every numerical worked example and review item;
- every numerical question with inaccessible solution fields, then 417 deliberately corrupted answers, all rejected by independent recalculation;
- snapshot-bound written-solution review and regression witnesses for boundary, half-angle and attainability conditions.

The numerical checks verify finite answers; they do not prove universal mathematical statements. The [written-family audit ledger](senior-math-foundation-proof-audit.md) records manual agent review of derivations and restrictions, with fingerprints that require renewed review after a text change. This is not a theorem-prover result or an independent human teacher's certification. The global `tests/senior-math-content.test.mjs` covers integration with the wider catalogue. Site compilation, browser behaviour, deployment and official-paper review remain separate root-task checks.

## Owned modules

- `foundation-authoring.mjs`: compact bilingual authoring, section support and review construction.
- `foundation-c1-algebra.mjs`, `foundation-c1-functions.mjs`, `foundation-c1-trigonometry.mjs`: compulsory 1.
- `foundation-c2-vectors-complex.mjs`, `foundation-c2-geometry.mjs`, `foundation-c2-statistics.mjs`: compulsory 2; statistics/probability authored by the parallel content reviewer.
- `foundation-distinct-tasks.mjs`: extra diagnostic tasks and distinct mixed assessments.
- `foundations.mjs`: stable aggregate interface.
- `foundation-checks.mjs`: complete numerical-coverage gate, structural and rendering validation.
- `foundation-c1-verification.mjs`, `foundation-c2-verification.mjs`: independent recalculation from public question givens, with checked IDs and calculation records.
- `foundation-c1-proof-verification.mjs`, `foundation-c2-proof-verification.mjs`: snapshot-bound written-derivation audit ledgers and finite regression witnesses.

The compact source marker `§` denotes a TeX backslash only inside authored mathematical fields. Construction converts it before export; no marker is present in rendered mathematics. This avoids JavaScript interpreting TeX sequences such as `\frac`, `\theta` or `\varphi` as control escapes.
