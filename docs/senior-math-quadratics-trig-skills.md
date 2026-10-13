# Quadratics and trigonometry: eight reviewed micro-lessons

This is original bilingual teaching content. Textbook references identify curriculum alignment; questions are not transcriptions of textbook pages.

## Scope and integration

The data module exports quadraticTrigSkills, with alias skillLessons. It imports only authoring.mjs, avoiding a catalog cycle.

| Skill ID | Textbook section | Printed / PDF page |
| --- | --- | --- |
| quadratics-vertex | Compulsory 1 §2.3 | 50 / 57 |
| quadratics-roots | Compulsory 1 §2.3 | 50 / 57 |
| quadratics-inequalities | Compulsory 1 §2.3 | 50 / 57 |
| quadratics-intervals | Compulsory 1 §3.2 | 76 / 83 |
| trig-unit-circle | Compulsory 1 §5.2 | 177 / 184 |
| trig-identities | Compulsory 1 §5.5 | 215 / 222 |
| trig-transformations | Compulsory 1 §5.6 | 231 / 238 |
| trig-equations | Compulsory 1 §5.4 | 196 / 203 |

All references use textbook-c1 and the exact existing section metadata. Parent links include related function-property, reduction-formula and function-application sections where relevant.

Each skill has:

- Three worked examples, ten exercises in a 4 foundation / 4 standard / 2 transfer progression, and two diagnostics: **120 questions total**.
- Two developed concepts with motivation, derivation, conditions, a counterexample and alternate representations.
- Ten explicit practice task types, covering reconstruction, interpretation, comparison, modelling, critique and proof rather than only changed coefficients.
- Two transfer exercises requiring an additional decision. Examples include parameter degeneration, minimax design, distinguishing continuous signals sharing every integer sample, and complete solution-count classification on a closed interval.
- Two hints, explicit decision/calculation steps, and item-specific written reasoning rubrics.
- A 40-minute 5/8/10/12/5 sequence with prompts, mathematical board entries, anticipated correct/incorrect responses, follow-up questions, remediation, an exit check and rubric sample responses.
- Explicit skill IDs, reviewed difficulty, original-content sources and JM01/JM02 examination scopes.
- Three wrong-choice explanations per diagnostic: **48 bilingual misconception explanations**.

Question IDs use skill-SKILL-ID-example-1..3, skill-SKILL-ID-exercise-1..10, and diagnostic-SKILL-ID-1..2.

## Matching inquiry models

The dedicated inquiry module exports controls(id) and scene(id, params), using the shared 640×360 SVG contract with no browser or storage dependencies.

| Skill | Model and boundaries |
| --- | --- |
| Vertex | a,h,k; vertex/symmetry table; a=0 constant case |
| Roots | a,b,c; discriminant/root table; quadratic, linear, nonzero constant and zero function distinguished |
| Inequalities | a,r1,r2, strict/weak target; full interval set and probe table; repeated roots and a=0 |
| Intervals | coefficient, vertex and endpoints; candidate extrema; crossed endpoints sorted; singleton and constant cases |
| Unit circle | signed degree angle and radius; equal pixel scales; normalised coordinates, radian equivalent and undefined tangent |
| Identities | original quotient versus tangent; extra holes at multiples of 180° versus common poles at odd multiples of 90° |
| Transformations | A,ω,φ,D; actual shift −φ/ω; degree/radian periods; A=0 or ω=0 has no least positive period |
| Equations | analytic complete roots of sin(nx)=k, n=1..4, on closed [0°,360°]; impossible heights, coincident branches and endpoint counting |

Degree-based controls are explicitly labelled; lesson formulas retain their stated radian or degree units.

## Verification

Command:

    node --test tests/senior-math-quadratics-trig.test.mjs

At handoff, all **eight test groups pass**:

1. Exact lesson/question progression, rich concepts, teacher timing/sample responses, bilingual diagnostics and **426 strict KaTeX fields**.
2. All **45 numeric or choice answers** independently recalculated. Derivations receive public givens without stored answers, solution steps, hints, results or correct-choice markers. Expression guards detect changed givens.
3. A deliberate corruption of each of the 45 answers is detected.
4. **75 written or worked-example derivations** each have a review note and content hash in tests/fixtures/skills-quadratics-trig-review.json. Changed reviewed items fail the gate.
5. Separate numerical witnesses for identities, equality cases, minimax bounds, integer sampling and model threshold endpoints.
6. Finite SVG geometry and bilingual results at every control's minimum/default/maximum.
7. Quadratic degeneration, repeated roots and restricted extrema.
8. Trigonometric phase scaling, constant functions, domain holes and complete analytic root counts for 36 frequency/target combinations.

The ledger is **per-item mathematical review by the authoring agent**, not external peer review. Finite numerical witnesses support examples and boundaries; they do not prove the written general arguments. Hashes preserve the reviewed content rather than certify mathematics.

The review explicitly covers cancellation domains, division losses, squaring extraneous roots, strict/weak bounds, integer restrictions, open interval attainment, parameter branches, angle units and exact-versus-rounded sensor assumptions.

This work unit does not modify shared catalog/UI/package files, prior pilot questions or progress storage. Site integration, browser verification and release remain the coordinating task's responsibility.
