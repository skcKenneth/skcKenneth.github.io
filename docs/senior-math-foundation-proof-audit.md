# Compulsory-course mathematical audit ledger

Review date: 2026-10-03. This records an agent review of the published original teaching corpus. It is not an independent human teacher's approval or a machine-checked formal proof.

## Compulsory 1: numerical answers

`foundation-c1-verification.mjs` recalculates **all 209 numerical answers**, including worked examples and chapter assessments, through 88 verification methods. Each method receives only the published English prompt and mathematical expression. The authored answer is read afterwards for comparison; hints, solution steps and results are not calculation inputs. The return value contains every checked ID, method, derived value and published value. Uncovered numerical IDs are a failing condition.

Checks include explicit subset/integer enumeration, constructed finite sets and their Venn regions, feasible integer models, direct original-equation evaluation, constrained one-dimensional minimization, natural-log evaluation, radian-library trigonometry, geometric coordinates, and extrema/period/domain boundaries. Their agreement checks the finite numerical answers; it does not turn numerical sampling into a proof of universal claims.

## Compulsory 1: written derivation families

All **178 nonnumeric question records** in the 24 sections and five chapter assessments were read with their prompts, expressions, model results and complete steps. The section ledger below includes number variants and the separately authored diagnostic tasks. Numeric components inside a mixed written assessment were also inspected during this reading.

`foundation-c1-proof-verification.mjs` binds this review to a SHA-256 fingerprint of each unit's reviewed prompt, expression, answer, hints, steps, result, explanation and conditions. Changed text fails the snapshot check and requires re-review. A matching fingerprint only establishes that the reviewed text has not changed; the mathematical review is the reasoning recorded here.

| Unit | Written records | Families and conditions checked |
| --- | ---: | --- |
| c1-1-1 | 5 | Objective membership criterion; repeated root versus singleton cardinality; extensional equality independent of order/repetition; set-builder integer restriction. |
| c1-1-2 | 3 | Singleton inclusion versus element membership; empty-set inclusion by impossible counterexample; arbitrary-element transitivity. |
| c1-1-3 | 2 | Complement-of-union via negated disjunction within the universal set; open/closed intersection endpoints. |
| c1-1-4 | 13 | Both implication directions for nested bounds and squaring; positive-product counterexample; zero-product inclusive disjunction; nonzero cancellation; valid isosceles counterexample; square-bound equivalence; positive reciprocal equivalence; strict integer/rational inclusion. |
| c1-1-5 | 12 | Quantifier negation with unchanged domain/equality boundary; integer versus real square-root witnesses; nonnegative-square universal proof; integer counterexample; quantifier-order witnesses and no greatest real; absolute-value proof covering both signs. |
| c1-2-1 | 11 | Negative multiplication reverses strict order; positive reciprocal comparison; positive/negative/zero multiplier cases; negative interval mapping; squaring counterexample; absolute-distance interval; failure of shared-upper-bound transitivity; invalid subtraction; reciprocal signs across zero. |
| c1-2-2 | 2 | AM–GM from a nonnegative square with nonnegative inputs and exact equality case; excluded minimizer gives a strict bound, while an explicit one-sided limit proves the infimum. |
| c1-2-3 | 7 | Sign intervals and equality endpoints for positive/negative quadratics; separate linear case at zero leading coefficient; completed-square condition for strict positivity at every real input. |
| c1-3-1 | 7 | Square-root denominator domain including zero radicand but excluding denominator zero; shifted-input substitution; unequal natural domains after cancellation; one input with two outputs violates the function definition. |
| c1-3-2 | 10 | Linear monotonicity by signed output difference; odd polynomial and domain symmetry; asymmetric restricted domain defeats parity; constant translation cancels from differences; nonzero constant is not odd; reciprocal oddness on the punctured real line. |
| c1-3-3 | 7 | Reciprocal-square domain and every positive output's preimage; positive reciprocal inequality; square-root range attainability; powers on (0,1); even integer exponent; real-cube-root interpretation for negative inputs and every nonnegative output's preimage. |
| c1-3-4 | 2 | Two observations do not validate unlimited extrapolation; ticket counts must be integers bounded by capacity. |
| c1-4-1 | 5 | Reciprocal-base power comparison; exponent quotient with nonzero base; the stated zero-exponent derivation does not define 0⁰; principal square root of x² is absolute value. |
| c1-4-2 | 5 | Base-one degeneracy; decreasing exponential for a base in (0,1); open shifted range and horizontal asymptote; oddness of the difference of opposite exponentials. |
| c1-4-3 | 2 | Strictly positive logarithm argument; valid positive-input counterexample to distribution over addition. |
| c1-4-4 | 12 | Monotonicity for base greater than one with positive inputs; shifted domain and one-sided vertical asymptote; inverse reflection and exchanged domain/range; decreasing-base inequality with positive argument; endpoint condition for a logarithm defined over all [0,1]; reciprocal-log restrictions on both bases. |
| c1-4-5 | 4 | A straight log plot does not prove mechanism or global validity; continuity establishes a zero and strict increase establishes uniqueness; additive versus multiplicative change; continuous model output versus discrete observation. |
| c1-5-1 | 1 | Negative-angle normalization and terminal-ray quadrant. |
| c1-5-2 | 4 | Undefined tangent as division by zero; simultaneous sine/cosine compatibility; strict quadrant signs exclude axes; a positive sine contradicts quadrant IV. |
| c1-5-3 | 5 | Counterexample to missing reflection sign; exact sine at 225°; complementary-angle identity; cotangent reduction retains nonzero sine restriction; three-quarter-turn coordinate/sign transformation. |
| c1-5-4 | 8 | Attained affine-cosine range; sine monotonicity counterexample; all tangent poles; parity on symmetric punctured domain; all sine maxima separated by full turns; cosine minimum at the included endpoint. |
| c1-5-5 | 5 | Rational trigonometric identities retain original denominator exclusions; exact addition formula; half-angle sign uses the explicit interval π<α<3π/2 in both languages; product-to-sum is valid for all real inputs without forbidden division. |
| c1-5-6 | 5 | Negative amplitude represented by a half-turn; horizontal shift is phase divided by frequency; zero-frequency constant has arbitrarily small periods and no least positive one. |
| c1-5-7 | 3 | Two observations do not uniquely determine a sinusoid; degree/radian repair; negative modeled height violates an always-above-ground requirement. |
| review-c1-1 | 9 | Rechecked the set/logical arguments and both components of each combined item; numeric components include explicit set enumeration, subsets and integer witnesses. |
| review-c1-2 | 7 | Rechecked inequality sign/counterexample arguments, excluded minimizer and completed-square conditions at the larger parameters; mixed discriminant component recomputed. |
| review-c1-3 | 7 | Rechecked parity, translation, shifted-input substitution, monotonicity, inverse-square attainability and model limits; the exponent is now explicitly the authored even integer. |
| review-c1-4 | 7 | Rechecked decreasing-base bounds, continuous-zero uniqueness, exponent quotient, inverse domain/reflection and reciprocal-base power order; mixed growth and log-difference calculations recomputed. |
| review-c1-5 | 8 | Rechecked half-angle interval, zero-frequency degeneracy, model non-identifiability, sine/cosine incompatibility and monotonicity counterexample; combined exact values, coterminal counts and geometric height components recomputed. |

## Corrections identified by this audit

- The power-function expression contained an unexpanded `2*k`, although its worked solution used an actual even integer. The published expression now matches that integer.
- The English half-angle question omitted an angle-interval restriction that the Chinese question already stated. Both languages and the mathematical givens now specify π<α<3π/2. Adding 2π preserves the terminal-ray quadrant but reverses the half-angle sine, so the restriction is essential.
- Reciprocal-square and cube-root-square ranges now exhibit a preimage for every claimed output. The excluded-minimizer argument now explicitly shows the one-sided limiting value.
- Numeric substitutions replaced unexplained template parameter references in hints, frequency comparisons and answers. Shifted-input results no longer display the awkward `+-` combination.

The separate supplementary bridge audit covers 52 additional tasks in `tests/senior-math-bridges.test.mjs`. It detected two mathematical rendering errors: `2${k}x` concatenated digits instead of multiplying, and the exponential-quadratic coefficient lacked an explicit multiplication sign before `2^x`. Regression checks now evaluate the printed equations, domains and inverse branches.

## Compulsory 2

The parallel source reviewer completed all **208 numerical answers** with 87 methods and all **114 nonnumeric records** across 24 units. See [the compulsory-2 written-family ledger](senior-math-foundation-c2-proof-audit.md). Its `foundation-c2-proof-verification.mjs` uses the same fingerprint schema and explicit distinction between manual reasoning review and finite regression evidence.

The final `foundation-checks.mjs` gate passes **417 numerical answers, 292 written records, zero uncovered numerical IDs, and 1,385 strict KaTeX fields**. It also runs every scalar question with solution fields inaccessible, then changes each stored numerical answer by one and requires rejection: all **417 corrupted answers are rejected**. The detailed verification records are returned by the two numeric modules; the complete reviewed-ID lists and fingerprints are returned by the proof modules.
