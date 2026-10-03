# Compulsory 2: written-solution review

Reviewed on 2026-10-03. This is a manual mathematical derivation, bilingual wording, and condition review of all **114 nonnumeric answer records** in 19 lessons and five chapter reviews. Compound tasks are included, even when a stable historical ID contains "number". The 208 scalar numeric records are handled separately by auditFoundationC2, which independently calculates answers from public prompts and expressions using 87 methods.

The manual review inspected both language versions of prompts, answers/results, hints, steps, explanations, and conditions. It checked the actual displayed parameter values and both parts of compound review tasks. The foundation-c2-proof-verification.mjs module stores a SHA-256 fingerprint for those reviewed fields in each unit. A changed fingerprint requires another mathematical review; updating a hash alone does not verify a proof.

## Review ledger

| Unit | Nonnumeric records | Claims and conditions checked |
| --- | ---: | --- |
| c2-6-1 | 8 | Displacement is end minus start; normalization uses a positive nonzero norm; opposite coordinates reverse direction; equal lengths do not imply equal vectors; zero has no distinguished direction. Counterexamples now use the displayed magnitude rather than an undeclared parameter. |
| c2-6-2 | 4 | A dot product is scalar, so the proposed nested dot product is ill-typed; closed displacement paths telescope; the norm expansion has cross term twice the dot product; perpendicular lengths 3 and 4 give norm 5 rather than 7. Zero-dot-product wording covers zero vectors without assigning them an angle. |
| c2-6-3 | 1 | Substitution of the given dependent basis vector restricts all combinations to one linear span; no claim that the vectors span the whole plane follows. |
| c2-6-4 | 2 | The supplementary sine-rule candidate must satisfy the triangle angle/side conditions; lengths 1,1,3 violate the strict triangle inequality and yield no valid cosine angle. |
| c2-7-1 | 3 | Conjugation changes only the imaginary sign; a negative real and positive imaginary coordinate lies in quadrant II; both imaginary roots of the displayed quadratic satisfy the equation and are distinct. |
| c2-7-2 | 5 | Cancellation of 1+i is legal because it is nonzero; completing the square gives both conjugate roots; conjugating a real-coefficient polynomial preserves its coefficients and its zero equation. |
| c2-7-3 | 7 | Positive imaginary numbers have argument π/2 modulo full turns; zero has no argument direction; square and cube roots of unity are distinct and exhaust the corresponding degree; adding 2π changes neither sine nor cosine. |
| c2-8-1 | 3 | The prism counts V=2n, E=3n, F=n+2 verify Euler's relation for that convex family only; a pyramid frustum supplies the stated counterexample to parallel faces being sufficient for a prism. |
| c2-8-2 | 4 | Oblique drawing lengths and angles are not true spatial metrics; hidden edges depend on viewpoint; the horizontal area factor is (1/2)sin45°=√2/4 under the explicitly stated convention. |
| c2-8-3 | 0 | All 13 records in this lesson have scalar numeric answers and belong to the independent numeric audit, not this written ledger. |
| c2-8-4 | 7 | Collinear points give infinitely many planes; the displayed cube lines are nonparallel and have incompatible y coordinates, so are skew; distinct planes with a nonempty intersection meet along a whole line; concurrent coordinate axes refute pairwise intersection implying coplanarity. |
| c2-8-5 | 10 | Line-plane parallelism retains the outside-plane condition; nondegenerate tetrahedron midpoint arguments supply the needed independent directions; plane-plane tests require two intersecting directions; all coordinate counterexamples satisfy their stated incidences; a line can be contained in a second parallel plane. |
| c2-8-6 | 6 | Two intersecting in-plane directions are required for the normal test; projection direction is used only when nonzero; perpendicular planes do not make every in-plane line normal to the other; the perpendicular section identifies two independent directions; a nonzero scalar multiple preserves a normal direction. |
| c2-9-1 | 3 | Complete population coverage eliminates selection sampling error but not the given measurement bias; increasing voluntary response count does not establish representativeness. |
| c2-9-2 | 2 | The new mean formula includes the added observation; median movement cannot be deduced from the old mean alone. A sample consisting of three copies of k gives an explicit counterexample: adding 100k changes the mean while retaining median k. |
| c2-9-3 | 6 | Precision and representativeness require design/sample information; arrival-time restriction excludes part of the target frame; unit conversion precedes pooling; an observational association alone cannot establish causation. |
| c2-10-1 | 3 | The given positive k makes 1+1/k exceed one; exactly one head in two ordered tosses is the event {HT,TH}, distinct from its numerical probability. |
| c2-10-2 | 5 | Independence cannot be inferred from marginals or a shared-cause mechanism; conditional probability requires P(B)>0; positive-probability disjoint events have intersection probability zero but positive marginal product; removal changes the displayed bag probability. |
| c2-10-3 | 3 | Nonoccurrence in a finite sample does not imply zero model probability; the positive probability (1-p)^k is explicitly an independent-trial counterexample; replaying one deterministic seeded sequence does not add independent observations. |
| review-c2-6 | 5 | Rechecked normalization, SSA alternatives, displayed equal-length counterexample, closed-path zero vector, centroid coordinate 7, and the dependent-basis span. Both parts of each combined task were reviewed. |
| review-c2-7 | 7 | Rechecked cancellation, conjugate 8+3i, roots 8±i and ±11i, i^42=−1, four-power sum zero, and the positive-imaginary polar representation. |
| review-c2-8 | 8 | Rechecked incidence and plane parallelism conditions, right dihedral angle 90°, section area 1/4, point-plane distance 11, surface-area ratio 9, half-depth length 9, cone coefficient 81, prism vertices 20, and Euler counts 24−36+14=2 in their combined contexts. |
| review-c2-9 | 6 | Rechecked coverage, voluntary selection, census measurement bias, observational causation limits, seconds/minutes conversion, and the mean/median distinction at the displayed review parameters. |
| review-c2-10 | 6 | Rechecked positive-probability disjointness, fixed-seed repetition, probability upper bound, conditional independence with nonzero conditioning probability, ordered event outcomes and expected count 35, and shared-cause dependence. |
| **Total** | **114** | **All nonnumeric compulsory-2 records; no item omitted based on its historical ID or current question kind.** |

## Corrections and limits

The review identified and coordinated source corrections for undeclared k in vector counterexample results and complex-root explanations, the need to say *intersection probability* rather than *intersection* is zero, and the unstated independence condition in the finite-nonoccurrence example. A remaining simplified glyph in the oblique-drawing explanation was also corrected before fingerprints were taken.

Finite coordinate, complex-arithmetic, and probability witnesses in the verification module are regression evidence for selected family boundaries. They do not prove universal statements. The mathematical conclusions above come from the stated axioms, algebraic derivations, and manual review, not from a theorem prover or from hashing the content.
