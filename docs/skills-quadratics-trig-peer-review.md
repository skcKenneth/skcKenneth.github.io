# Independent quadratic/trigonometric peer review

Reviewed on 2026-10-08 by the calculus/statistics author, separately from the authoring and author-verification helpers. The 120 bilingual public tasks were read before comparing their answers and explanations.

`tests/skills-quadratics-trig-peer.test.mjs` independently recalculates all **29 numerical results and 16 diagnostic keys** from separately transcribed givens, fresh quadratic solving, admissible candidates, unit-vector coordinates and trigonometric evaluations. Its expected-result functions receive no answer, worked step, result, hint or explanation fields. Each diagnostic has exactly one option matching the independently derived mathematical result. All four peer tests pass.

```powershell
node --test tests/skills-quadratics-trig-peer.test.mjs
```

All **75 written/null-answer records** were inspected separately in English and Traditional Chinese. The reviewed algebra and proofs agree with independent derivations. The review particularly checks these conditions and transfer tasks:

| Skill | Conditions and independently derived transfer results |
| --- | --- |
| Vertex form | Compensation after extracting the leading coefficient; attaining input versus extremum; perimeter-20 rectangle area at most 25; uniquely determined zeros/minimum; the integer pack minimisers are both 4 and 5 with cost 10. |
| Roots | Distinct versus repeated roots; retained zero roots; original denominator exclusions; positive-length filtering; parameter equation has one real root exactly at k=1 or 2, including the linear branch; two distinct positive monic roots require discriminant>0, b<0 and c>0. |
| Inequalities | Negative leading signs, strict versus included endpoints, repeated-root singletons, nonzero quotient denominators and simultaneous restrictions; the rectangle's shorter side is in [3,5]; global nonnegativity of (a−1)x²+2x+1 holds exactly for a≥2. |
| Interval optimisation | Only admissible vertices; attainment on closed/open intervals; complete piecewise moving-interval minimum; minimax centre a=1/2 gives 9/4; integer controller setting 2 uniquely gives loss 1.16. |
| Unit circle | Nonzero terminal rays; signed coordinates and quadrant restrictions; undefined tangent; clockwise radius-2 rotation gives (−1,−√3); exact readings 0.8,0.8 violate the unit norm in every quadrant. |
| Identities | Every original-domain hole survives cancellation; tangent addition cannot divide by zero; sine is not additive; the bound |3sin x+4cos x|≤5 has a feasible equality case; the simplified quotient graph retains holes at kπ/2. |
| Transformations | Phase divided by frequency; signed amplitude versus physical amplitude; nonconstant assumptions for the least period; direction of a midline crossing; tide intervals [4,8] and [16,20] hours; integer samples do not distinguish a constant from 2+sin(2πt). |
| Equations | Complete periodic and reflected branches; correct transformed intervals; closed versus half-open endpoints; safe division only after a zero-divisor check; rejected squared-equation candidates; wheel height exceeds 4 only for t∈(2/3,10/3). |

The two practice transfer tasks in each lesson require modelling, synthesis, proof, diagnosis or a change of representation, rather than merely replacing numerical constants. The worked transfer examples similarly combine conditions and representations. The revised cosine diagnostic correctly uses 60° and 300° and cosine-specific feedback for all three wrong options.

Fresh algebra and exact candidate tests corroborate representative written claims; finite numerical samples do not prove general statements. The author's separate 75-item payload ledger protects the exact reviewed written content against later edits. This review found no mathematical answer defect in the frozen question corpus. It also independently checks all eight scene families at their control endpoints and selected degenerate cases. It does not claim native-browser visual QA or production deployment.
