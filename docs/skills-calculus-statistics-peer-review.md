# Independent calculus/statistics peer review

Review date: 2026-10-08. Reviewer: the vector/conic author, independently of the calculus/statistics author.

Scope: all 120 bilingual question records: 57 numeric answers, 16 diagnostic choices, and 47 written examples/exercises. Public prompts, expressions, options and conditions were read first. The numeric checker uses independently transcribed givens and fresh polynomial, finite-distribution, Bayes and least-squares calculations; it does not import the author's verification functions or derive results from authored answers or steps. Its public-input proxy rejects private-field access. A frozen bilingual public-statement hash ties each transcribed calculation to the actual current question, so a changed prompt requires review.

All 73 computed answers agree. Each diagnostic has exactly one justified option. The written methods, bilingual conclusions and domain restrictions listed below were manually checked; hashes detect later edits and do not constitute mathematical proof certificates. Additional finite boundary checks corroborate, rather than prove, the symbolic arguments.

Two review findings were fixed by the content owner before freezing this ledger:

- The quadratic tangent error is nonnegative, with equality at zero increment: English now says “never overestimates,” consistent with the Chinese statement and h².
- A total-probability partition can include a zero-probability cell. The solution now begins with joint probabilities; conditional factors are evaluated only for positive-probability cells. A zero cell contributes zero jointly, without evaluating 0/0.

## Written item ledger

Each task type occurs once in this 120-record group. The JSON fixture associates the note below with its exact stable question ID and complete bilingual written-payload hash.

| Task type | Independent derivation and condition review |
|---|---|
| tangent-equation | At a=2, slope 2a=4 and ordinate a²=4 give y−4=4(x−2). Both point and slope are required. |
| corner-test | The difference quotient of absolute value at zero is −1 for negative h and +1 for positive h; continuity does not make the two limits equal. |
| tangent-through-point | A general tangent y=2ax−a² contains (0,−4) exactly when a²=4; the two real contacts give both lines and exhaust all tangents. |
| zero-slope-normal | The tangent at the parabola's vertex is horizontal y=0 and its perpendicular normal is vertical x=0, whose slope is not a finite reciprocal. |
| parameter-tangency | The intersection polynomial x²−x−c has a double root iff 1+4c=0; hence c=−1/4 and contact x=1/2 uniquely. |
| product-rule | Expanding (x²+1)(x−2)=x³−2x²+x−2 and differentiating gives 3x²−4x+1; the displayed product rule agrees term by term. |
| log-domain | A real logarithm needs 3x−2>0; differentiating gives 3/(3x−2) on x>2/3, not the larger nonzero-denominator domain. |
| trig-radians | For a radian variable, chain differentiation gives 2cos(2x); a degree variable would supply the additional π/180 conversion factor. |
| exponential | Differentiating exp(−x) yields −exp(−x) for every real x; the negative rate does not imply a negative function value. |
| rule-comparison | The increment (x+h)²−x² equals 2xh+h²; dividing by nonzero h and limiting proves 2x and refutes multiplying derivatives. |
| sign-change | The roots of 3x²−3 are −1 and 1, with signs +,−,+; substitution gives local maximum (−1,2) and minimum (1,−2). |
| increasing-sign | The derivative 2x is negative for x<0. The supplied open decreasing interval is valid; endpoint inclusion is not asserted to be impossible. |
| stationary-not-extreme | The derivative 3x² vanishes at zero but is positive on either side, so x³ passes through a stationary point without an extremum. |
| nondifferentiable-minimum | Absolute value is nonnegative with equality at zero; this establishes the minimum by definition despite unequal one-sided derivatives. |
| derivative-sign-chart | Away from x=1, the squared factor is positive, so the derivative has the sign of x+2. The sign changes only at −2, which is a minimum. |
| global-vs-local | The cubic tends to positive infinity as x tends to positive infinity; its finite local maximum cannot be a global maximum over the real line. |
| stationary-inflection | For x⁴, the second derivative test at zero is inconclusive, while x⁴≥0 and the first-derivative sign change establish a minimum. |
| parameter-regimes | For x³−kx, 3x²=k has two simple roots and alternating signs exactly when k>0. At k=0 the root has no extremum; k<0 gives positive derivative. |
| open-domain-optimum | On 0<x<1, 2x−x²=1−(x−1)²<1 and approaches 1 from below. This proves supremum 1 without an attained maximum. |
| curvature-sign | The second derivative of x³ is 6x, negative left and positive right; the curve contains the resulting inflection (0,0). |
| shifted-inflection | For x³−6x²+3x, the simple second-derivative root is x=2 and direct function substitution gives −10, rather than substituting into the derivative. |
| nonstationary-inflection | For x³+x, curvature changes at zero while the derivative there is 1. Its tangent is y=x, confirming that inflection need not mean stationary. |
| convex-quadratic | The second derivative of x² is the positive constant 2; a minimum at zero does not imply a concavity change. |
| zero-second-no-change | For x⁴ the second derivative 12x² is positive on both sides of its zero, so the candidate fails the sign-change condition. |
| curvature-interval | Twice differentiating x³−3x² gives 6x−6. Strictly positive curvature occurs for x>1, independently of the sign of the first derivative. |
| two-inflections | For x⁴−6x², 12(x²−1) has signs +,−,+ and simple roots −1 and 1; both abscissae are genuine concavity changes. |
| derivative-graph | Increasing then decreasing first derivative, with the stated second-derivative signs, gives concave up then down at x=2. The solution retains the actual-point/continuity requirement. |
| domain-hole | Although 2/x³ changes sign across zero, 1/x is undefined there; an excluded input is not an inflection point on the curve. |
| parameter-curvature | The roots of 12x²+2k are two simple real roots ±√(−k/6) exactly for k<0. At k=0 the double root has no sign change. |
| tangent-crossing | Both x³ and x⁴ have tangent y=0 at zero, but only x³ crosses it and changes curvature. The explanation correctly avoids claiming a universal visual crossing theorem. |
| undefined-condition | P(B)=0 forces P(A∩B)=0; the elementary conditional ratio is 0/0, not probability zero. No assertion about advanced regular conditional probabilities is needed. |
| independence-test | Multiplying the given marginals 0.4 and 0.5 gives 0.2, exactly the supplied intersection. This verifies independence while allowing overlap. |
| partition-validation | Overlapping positive-probability cases do not form a partition. A and its complement are disjoint and exhaustive; sum joint probabilities, and use conditional factors only for positive-probability cells. |
| invalid-distribution | The listed numbers sum to one but include −0.1; normalization does not repair the violation of probability nonnegativity. |
| zero-variance | A finite sum of nonnegative weighted squared deviations vanishes only if every positive-weight value equals the mean. Zero-weight labels do not change the probability-one conclusion. |
| moment-feasibility | E(X²)−E(X)²=3−4<0 contradicts variance nonnegativity, so the two proposed moments cannot hold simultaneously. |
| model-comparison | Independent replacement gives (3/5)²=9/25. Removing a first red gives (3/5)(2/4)=3/10. The first-draw marginal agrees but the joint probability differs. |
| model-conditions | Fixed sample size alone does not imply a binomial count. In a mixed finite bag, (K−1)/(N−1) generally differs from K/N; deterministic monochrome exceptions do not invalidate “not necessarily.” |
| hypergeometric-support | Three draws from four red and one blue must include at least two reds and can include three; thus support is exactly {2,3}. |
| sampling-collapse | Drawing the whole six-object bag fixes the count at two; a point mass has mean 2 and variance zero, unlike the inappropriate nondegenerate binomial model. |
| undefined-predictor | Constant x=2 gives Sxx=0. Every pair satisfying intercept+2·slope=mean response gives the same fitted values, so the slope is not identifiable. |
| correlation-not-causation | An observational association does not identify a tutoring effect; prior attainment and selection provide concrete possible confounding paths, even with a precisely estimated slope. |
| nonlinear-zero-correlation | The centered products for (−1,1),(0,0),(1,1) cancel, Sxx=2 and Syy=2/3 are positive, so r=0 despite the deterministic quadratic relation. |
| residual-sum | Fresh least-squares calculation for (0,1),(1,3),(2,2) gives slope 1/2 and intercept 3/2. Residuals −1/2,1,−1/2 sum to zero because an intercept is fitted. |
| extrapolation | The proposed input 100 lies far outside observed [1,5]; a close in-range fit supplies no evidence that the same response form remains valid there. |
| paired-data-transfer | Original and reversed y pairings have Sxx=2 but cross-products +2 and −2, so slopes are +1 and −1 although marginal lists agree. |
| fit-objective-transfer | For responses 0,0,3, squared loss is 3(c−1)²+6 and is minimized at mean 1; absolute loss is minimized at median 0. The displayed losses 6/9 and 3/4 agree. |

## Scalar items with additional explanation requests

The numeric answer check is supplemented by manual review of the nonnumeric clauses: inverse rate uses the invertible t>0 branch; composite recovery includes inner derivative 4; tangent error is exactly h²; rectangle optimization has positive-side domain 0<x<10 and the interior square; posterior bag selection conditions on positive evidence; the posterior-prior equation has the feasible unique solution; dependent variance uses the constant sum rather than independence; equal-mean comparison names Y as the more variable distribution; reliability checks both n=5 and failure at n=4; unit conversion preserves fitted responses and residuals at equivalent physical inputs.

## Inquiry review and reproducible checks

The eight inquiry models are checked against independent polynomial algebra, full finite probability distributions and fresh least-squares fits at control minima, defaults, maxima and zero boundaries. This includes zero secant increment, zero chain multiplier, collapsed closed interval, zero curvature parameter, zero-probability conditioning, collapsed outcome distribution, finite-bag census/monochrome/no-draw boundaries, and regression response shifts/outliers. All paths, points and text anchors must remain finite; text anchors must stay inside the 640×360 viewport.

The sampling simulation is separately checked for repeatability and exact support for all 49 integer combinations of red count and draw count in a bag of six. Deterministic boundary counts are verified. This does not claim that empirical frequencies equal the exact distribution or prove the quality of a pseudorandom generator.

Run: node --test tests/skills-calculus-statistics-peer.test.mjs.

The public release gate also runs node scripts/senior-math-paper-context-checks.mjs without private scratch PDFs. A separate local-source invocation can verify the original PDF hashes.
