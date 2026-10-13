# Calculus, probability and statistics skill expansion

The eight original micro-lessons each contain three worked examples (foundation, standard, transfer), ten exercises (4/4/2) and two diagnostic choices. This adds **120 bilingual records**: 57 scalar answers, 16 diagnostic choices and 47 written derivations. The two final exercises in each lesson require a change of representation, an unknown-parameter regime, a counterexample, a dependence argument, a mechanism choice or an interpretation of model limitations. They are not seed-generated numerical repetitions.

Every question has two hints, connected solution relations, a stated condition, a result and a specific common error. Wrong diagnostic choices carry bilingual misconception explanations. Each teacher flow has five timed stages of 5/8/10/12/5 minutes, actual correct and wrong response examples, follow-up prompts, remediation, an exit action and sample responses for three rubric criteria. Concept records include why the idea is useful, a derivation, applicability conditions, a counterexample and representations.

## Source alignment and exam scope

Source references indicate the verified section which motivates an **original** question. They do not claim transcription of textbook exercises. The PDFs of the selective books have a five-page offset between their printed pages and PDF pages.

| Skill ID | Textbook section | Printed / PDF page | Parent route |
| --- | --- | --- | --- |
| calculus-tangent | Selective compulsory 2, 5.1 | 59 / 64 | s2-5-1 |
| calculus-rules | Selective compulsory 2, 5.2 | 72 / 77 | s2-5-2 |
| calculus-extrema | Selective compulsory 2, 5.3 | 84 / 89 | s2-5-3 |
| calculus-inflection | Selective compulsory 2, 5.3 | 84 / 89 | s2-5-3 |
| probability-conditional | Selective compulsory 3, 7.1 | 44 / 49 | s3-7-1; c2-10-2 |
| probability-moments | Selective compulsory 3, 7.3 | 62 / 67 | s3-7-2; s3-7-3 |
| probability-models | Selective compulsory 3, 7.4 and 7.5 | 72 / 77; 83 / 88 | s3-7-4; s3-7-5 |
| statistics-regression | Selective compulsory 3, 8.1 and 8.2 | 93 / 98; 105 / 110 | s3-8-1; s3-8-2 |

Normal-distribution questions point specifically to 7.5. Correlation and observational-association questions point specifically to 8.1. The other regression questions point to 8.2. Source references and the parent routes retain these distinctions.

The actual 2027 JM01 syllabus, PDF page 5, section 16, lists elementary experiments/events, probability addition and multiplication, central tendency, and dispersion. The actual JM02 supplementary syllabus, PDF page 4, section 6, includes sums, differences, products and **quotients of polynomials**, extrema and inflections; section 4 names tangent and normal, and section 1 names inverse functions. Accordingly polynomial calculus, including the rational quotient of polynomial expressions, is tagged `JM02`. Elementary conditional counts and independence comparisons use `JM01` and `JM02` tags. Bayes, random-variable moments, count-distribution models, normal distributions, regression and transcendental derivatives use the explicit `extension` tag: textbook coverage does not automatically imply JAE exam coverage. Every question includes a bilingual scope note. No third-party exercises or solutions were copied.

## Independent verification and its limits

Run:

```powershell
node src/data/senior-math/skills-calculus-statistics-checks.mjs
node --test tests/skills-calculus-statistics.test.mjs
```

The checker derives all 57 scalar values from separately transcribed stated data with fresh arithmetic, polynomial differentiation, probability enumeration/formulas and centered regression calculations. It derives all 16 diagnostic answers independently and then compares them with the stored answer. It does not use an authoring bank answer function. The explicit 120-record review ledger locks the published question, data, choices, answer, derivation and conditions to the reviewed payload. A hash detects a changed record; it is not a mathematical proof.

All 47 written records were reviewed for both-language meaning, algebra, definition/domain conditions and the claimed conclusion. The checker additionally exercises each written derivation family. Polynomial product identities, tangent constraints, signs at stationary/curvature candidates, distribution support and least-squares normal equations have independent calculation checks. Logarithmic/trigonometric/exponential numerical differences are corroboration only; their written chain-rule derivations and domain assumptions were checked separately. A few selected input values do not prove a general identity or a causal conclusion. The causal limitation is justified by nonidentifiability from observational associations, including a shared-cause construction, rather than by a test claiming to establish causality.

The previous `advanced.mjs` probability task now states its generated threshold `t` in the expression; its original answer remains 3/4. It is numeric, so no written-answer ledger update was necessary. The existing advanced verification gate passes 512/512 scalar recalculations and its unchanged 236 written review records.

## Skill-specific interactive models

The renderer contract is `controls(id)` and `scene(id, parameters)` from `src/lib/skill-calculus-statistics-inquiry.mjs`. The probability-models skill also exports `simulate(id, parameters, seed=37, trials=200)`: it actually samples both mechanisms with a local seeded generator, returns both count arrays and empirical means, and labels the effective N/K/n/trials/seed. Trial count is capped at 2000. Simulated frequencies remain distinct from the exact distribution table; a changed parameter must clear an earlier sample in the parent UI. Scenes use a 640×360 view box, clipped mathematical paths, bilingual labels and a serializable table which can be printed. The models are deterministic and require no server.

| Skill | Exact investigation | Boundary exposed |
| --- | --- | --- |
| tangent | x² secants, tangent and local error h² | h=0 quotient undefined; derivative remains defined |
| rules | (kx+1)³, correct derivative and missing inner k | k=0 gives a constant; omitting k still predicts 3 |
| extrema | x³−kx with a chosen closed interval | k=0 stationary non-extremum; coinciding endpoints |
| inflection | x⁴+kx² and its second derivative | k=0 double second-derivative root without sign change |
| conditional | prior, two flag likelihoods, joint contributions and posterior | zero flag mass produces an undefined posterior |
| moments | fair X=0 or 2 transformed to aX+b | a=0 merges the outcomes into one probability-one value |
| models | six-object exact sampling with/without replacement | drawing all six fixes the red count; monochrome/zero-draw cases |
| regression | five original pairs, changed last response and overall shift | unchanged slope/residuals under a pure response shift |

The dedicated tests check defaults, every control endpoint and endpoint combination, invalid parameter fallback, bounded finite SVG coordinates and printable tables. Every one of the 49 finite-bag K/n configurations is independently verified by subset and binary-sequence enumeration. The tests also verify probability normalization, posterior zero-denominator behavior, secant identities, chain rates, extrema, concavity cases, transformed variance, and independent regression normal equations. They do not certify browser rendering, classroom delivery, learning gains or deployment; the parent task owns those checks.
