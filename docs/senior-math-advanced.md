# Selective curriculum and source-backed extensions

These lesson questions are newly authored. Source mappings identify the textbook, school or syllabus skill being taught; they do not claim to transcribe textbook exercises. Official past-paper questions are recorded separately.

## Delivered content

| Module | Lessons | Chapter reviews | Questions |
|---|---:|---:|---:|
| Selective compulsory 1 | 12 | 3 | 201 |
| Selective compulsory 2 | 7 | 2 | 121 |
| Selective compulsory 3 | 11 | 3 | 188 |
| Source-backed supplements | 10 | 0 | 130 |
| Compulsory 2 statistics and probability | 6 | 2 | 108 |
| Total owned content | 46 | 10 | 748 |

Each lesson contains three worked examples (foundation, standard, transfer) and ten exercises (4/4/2). Each review contains fifteen items (6/6/3). Total: 138 examples, 460 lesson exercises, 150 review items. Seven distinct task families per lesson cover definitions, computation, representations, exclusions, counterexamples, proofs and interpretation as appropriate to the topic. Practice values differ from example values.

Lessons include bilingual objectives, conceptual conditions, common errors, two hints per question, solution steps and results, classroom prompts, board relations, anticipated errors, marking criteria and prediction/explanation/transfer inquiries. Written answers and proofs require the rubric and human review.

## Textbook mapping

The supplied 2019 Renjiao A selective textbooks use PDF page = printed page + 5. Their contents are at PDF page 5. School grade/stream routes are assigned in the shared catalog from school sources rather than inferred solely from textbook filenames.

| Source chapter | Sections | Printed starts, in order |
|---|---|---|
| textbook-s1 chapter 1 | 1.1–1.4 | 2, 11, 16, 26 |
| textbook-s1 chapter 2 | 2.1–2.5 | 51, 59, 70, 82, 91 |
| textbook-s1 chapter 3 | 3.1–3.3 | 105, 118, 130 |
| textbook-s2 chapter 4 | 4.1–4.4 | 2, 12, 27, 44 |
| textbook-s2 chapter 5 | 5.1–5.3 | 59, 72, 84 |
| textbook-s3 chapter 6 | 6.1–6.3 | 2, 14, 29 |
| textbook-s3 chapter 7 | 7.1–7.5 | 44, 56, 62, 72, 83 |
| textbook-s3 chapter 8 | 8.1–8.3 | 93, 105, 124 |

Section 4.4 induction is starred in this textbook but remains included because JM01 expressly requires it. There is no invented section 5.4.

Compulsory 2 starts: 9.1=173, 9.2=193, 9.3=220, 10.1=228, 10.2=249, 10.3=254; PDF offset +7. For 9.3 Statistical case study, an original anonymous commute investigation replaces the textbook's employee-obesity case. It retains question → sampling → summary → interpretation and limitations, and is not described as textbook digitization.

## Supplement provenance

Official syllabuses checked 2026-10-03:
[JM01 2027](https://www.must.edu.mo/images/JAE/JM01_Exam_Syllabus_2027.pdf) and
[JM02 2027](https://www.must.edu.mo/images/JAE/JM02_Exam_Syllabus_2027.pdf).
School documents are the user-supplied T04 and T06 science thinking books; printed page = PDF page − 1.

| Lesson ID | Primary scope/source |
|---|---|
| sup-partial-fractions | JM01 PDF2 area4, polynomials/rational expressions/partial fractions |
| sup-variation-finance | JM01 PDF2 areas2/3/8, percentages/variation/finance |
| sup-euclidean-circles | JM01 PDF3 area12, Euclidean/circle geometry |
| sup-linear-programming | T04 PDF11 printed10 part III; also JM01 PDF2 |
| sup-matrices | JM02 PDF2 area3, matrices/determinants/systems |
| sup-polar | JM02 PDF2 area4, polar coordinates |
| sup-integrals | JM02 PDF2 area6, integration/area; disk volume explicitly marked T06 PDF6–10 school extension |
| sup-spatial-equations | T06 PDF15–18 lines/planes/spheres; PDF10–11 cross products |
| sup-parameter-equations | T04 PDF27–29 printed26–28, parameters and preserved ranges |
| sup-infinite-series | T04 PDF35 printed34 part III; also JM01 PDF2 area11 |

These do not replace the separate course algebra bridges addressing additional JM01 real-number, equation, inequality and exponential/logarithmic skills.

## Verification

Run: node src/data/senior-math/advanced-checks.mjs

The last run checks all 748 owned questions and 2457 decoded mathematical fields with strict KaTeX, scans for control characters, and rejects exact prompt/expression duplicates within a lesson/review. It independently recalculates all 512 numeric answers from the exported prompts and expressions, without importing authoring answer functions. The initial 104 checks use vectors, numerical differentiation, enumerated counting/probability, expanded polynomials, exact integer remainders, regression, contingency-table margins, determinant expansion and quadrature. The remaining 408 recompute the published data using geometry, sequence iteration, constrained objectives, probability models and descriptive statistics. The exported advancedNumericVerifiedIds records every covered question and the gate requires 512/512 coverage.

These numerical recalculations do not prove written solutions. The separate advanced-written-audit.mjs ledger records the independent algebra/domain inspection of all 236 written items in 95 task families across 37 skills. Its per-skill methods and question IDs describe the checks; SHA-256 digests of English mathematical semantics and formula/step fields detect changes that require a renewed review. Coverage must be 236/236. An additional 981 boundary checks corroborate circle intersection regimes, non-tangent hyperbola degree reduction, zero-slope parabola cases, finite induction identities and ray-origin/vertical polar cases.

Manual inspection checks zero-vector/undefined-angle exclusions; vertical lines and finite-slope exceptions; circle common-chord existence; conic degree reduction versus tangency; zero-slope parabola intersections; first sequence terms and index ranges; induction base/hypothesis/step; quotient/log domains; stationary points and constrained endpoints; positive conditional denominators; independence versus disjointness; nonlinear/constant-variable correlation; paired-data and expected-count test assumptions; parametric missing points/segments/half-curves; and convergence before infinite summation. This is an authored-content review record, not an automatic proof checker or an assertion that all student proofs can be marked by software.

Corrections made during checking include TeX coefficient concatenation, two unspecialized parameters in final results, fictitious batch/trial labels, unescaped percentages, exact fractional slope bounds, and retaining the origin without dividing by x in a ray derivation. Hints, board relations and written results use dedicated rendered math fields. No supplied PDF was changed.
