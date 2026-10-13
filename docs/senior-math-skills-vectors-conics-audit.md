# Vector and conic skill content audit

Review date: 2026-10-08. This module contains eight original bilingual micro-lessons, each with three worked examples, ten practice tasks (4 foundation, 4 standard, 2 transfer), and two diagnostic items. The 120 records comprise 58 scalar/choice answers and 62 written answers. Each diagnostic distractor has a specific misconception explanation.

## Source and scope

The lesson references were copied from the existing verified textbook lesson records, not invented from topic names:

| Skill | Parent | Document | PDF page (one based) | Printed page | Section |
|---|---|---|---:|---:|---|
| vectors-geometric | c2-6-1 | textbook-c2 | 9 | 2 | 6.1 |
| vectors-coordinates | c2-6-3 | textbook-c2 | 32 | 25 | 6.3 |
| vectors-dot | c2-6-2 | textbook-c2 | 14 | 7 | 6.2 |
| vectors-proof-triangles | c2-6-4 | textbook-c2 | 45 | 38 | 6.4 |
| conics-ellipse | s1-3-1 | textbook-s1 | 110 | 105 | 3.1 |
| conics-hyperbola | s1-3-2 | textbook-s1 | 123 | 118 | 3.2 |
| conics-parabola | s1-3-3 | textbook-s1 | 135 | 130 | 3.3 |
| conics-intersections | all three conic lessons | all three conic references | as above | as above | as above |

These references establish curriculum placement. All questions, diagrams, explanations and teacher activities are independently authored, with original-question source metadata. Vector methods are tagged JM02. Elementary numeric triangle area, cosine-rule, median and centroid tasks also carry JM01. Conic lessons carry JM01/JM02 at the agreed curriculum scope; the tags do not claim that every extension method is explicitly named in the official syllabus. These are teaching materials, not official marking rubrics.

## Independent recalculation

The verification module derives all 58 scalar/choice answers from public prompt/expression/options. It does not use stored answer, result, explanation, steps or hints to derive an expected value. The comparison layer subsequently checks the stored answer. Numeric methods use endpoint arithmetic, norms, dot products, determinants, side identities and coefficients extracted from the stated conic equation. Choice methods parse candidate numbers, coordinates or coefficients and demand exactly one matching option. All 58 answers are subject to mutation rejection, and protected solution-field access tests check the public-only derivation boundary.

The nontrivial scalar results include signed projection -3, projection coefficient 3/2, dot product -3/2 from three norms, triangle square-side 19, ellipse focal maximum 9, ellipse point ordinate square 256/25, hyperbola ordinate square 256/9, eccentricity 5/3 and chord-square 27.

## Per-item written review

The separate frozen manifest records every reviewed written item by its stable ID, task type and SHA-256 of the bilingual prompt, expression, answer, hints, steps, result, explanation and conditions. The descriptions below are the manual derivation and condition ledger. Hashes detect subsequent text changes; they are not mathematical proof certificates. Numerical boundary regressions support, but do not replace, the algebraic review.

### vectors-geometric (7)

- translated-arrow: B−A=(3,4), C+(3,4)=(1,5); free-vector translation preserves both components.
- counterexample: opposing unit vectors sum to zero while their norms sum to two, refuting additivity of norm.
- closed-path: (B−A)+(C−B)+(A−C)=0 by telescoping; travelled distance need not vanish.
- normalization: dividing (0,-5) by its positive norm 5 gives (0,-1), preserving direction.
- diagonal-decomposition: with A as origin, C=u+v and D−B=v−u; orientation of BD is retained.
- degenerate-case: the zero vector has zero denominator and no unit direction.
- physical-model: horizontal cancellation forces boat speed component -3, the positive north component is 4, and time is 20/4=5; ground and water-relative velocities are distinguished.

### vectors-coordinates (9)

- endpoint-subtraction: (3,-4)−(-1,2)=(4,-6).
- basis-system: a+b=6 and a−b=2 give (4,2); substitution recovers (6,2).
- collinearity-proof: AC=2AB, so the three distinct points are collinear and C lies beyond B.
- endpoint-reconstruction: (3,-1)+(-5,4)=(-2,3); reverse subtraction confirms the arrow.
- internal-division: t=2/(2+1), hence P=(6,4), correctly closer to B.
- basis-degeneracy: the second row is twice the first; a+2b=3 yields the full family (3−2t,t).
- basis-condition: determinant 4−2k is nonzero exactly when k≠2.
- inverse-centroid: C=3G−A−B=(2,8); determinant of AB,AC is 30, yielding nonzero area 15.
- affine-location: P=(1/3,5/2); determinant 14 ensures independent sides, and both affine edge coefficients lie strictly between zero and one.

### vectors-dot (4)

- orthogonality-proof: the mixed products cancel in (u+v)·(u−v); the result is zero for equal norms. An angle statement additionally needs both sum and difference nonzero.
- zero-angle-error: the angle quotient has zero denominator at u=0; zero dot product alone does not define an angle.
- closest-point-segment: squared distance is (x−3)^2+16 on [0,2], decreasing there; endpoint B is closest with distance sqrt(17).
- locus-proof: expansion yields x²+y²=4. The algebraic locus includes A and B even though a subtended-angle interpretation at them is undefined.

### vectors-proof-triangles (8)

- midpoint-proof: midpoint displacement is (v−u)/2; nondegeneracy makes the direction and half-length interpretation valid.
- cosine-rule-derivation: BC=v−u and u·v=bc cos(A), giving the full cosine rule.
- median-length: explicitly introduce u=AB,v=AC; eliminate u·v with the side-length identity and divide the squared sum norm by four.
- right-angle-check: (2,1)·(-1,2)=0 and both sides are nonzero.
- median-concurrency: G−A=(2/3)(M−A), with cyclic versions, locates the same point on all medians in ratio 2:1.
- rhombus-diagonals: (u+v)·(v−u)=|v|²−|u|²=0; nondegenerate rhombus diagonals are nonzero.
- converse-proof: in a nondegenerate parallelogram the same identity forces equal adjacent side lengths, and opposite sides are already equal.
- orthocenter-construction: horizontal AB first gives H_x=2; AH·BC=0 then gives H_y=2, and BH·AC=0 verifies the third altitude.

### conics-ellipse (8)

- axis-reading: semiaxes 5,3 give c=4 on the horizontal major axis and e=4/5.
- definition-to-equation: distance sum 10 gives a=5; foci give c=3, hence b²=16.
- vertical-orientation: the larger denominator belongs to y²; c=4 and foci lie at (0,±4).
- parameter-feasibility: k>0 is necessary for a nondegenerate ellipse; k=9 is the excluded circle, with both remaining axis orientations allowed.
- translation: centre (2,-1), major-axis vertices (-2,-1),(6,-1), and translated foci (-1,-1),(5,-1).
- degenerate-definition: equality in the triangle inequality gives exactly the closed focal segment, not an ellipse with positive minor semiaxis.
- ellipse-linear-optimization: u=x/2,v=y/3 gives u²+v²=1. Cauchy bounds 6u+12v by 6sqrt(5); the equality point yields (2/sqrt(5),6/sqrt(5)).
- locus-recovery: symmetry at x=0 gives each focal distance 5 and positive y=4; sum 5 violates the focal separation lower bound 6.

### conics-hyperbola (9)

- hyperbola-parameters: a=3,b=4,c=5; horizontal vertices/foci and slopes ±4/3 are consistent with the equation.
- hyperbola-definition: absolute difference 6 gives a=3, and c=5 gives b²=16; both branches are included.
- one-intersection-warning: substitution of y=x+1 produces x=-1,y=0; the tangent there is vertical, so the line is not tangent.
- hyperbola-vertical: y²/4−x²/9 has vertical vertices (0,±2), and homogeneous asymptotes y=±2x/3.
- hyperbola-domain: x²≥9 is necessary and sufficient for real y, including both vertices.
- asymptote-nonmembership: exact substitution of y=4x/3 gives 0=1, excluding every finite point.
- signed-branch: on the right branch the left focus is farther, with difference +6; the left branch has the opposite sign.
- recover-from-asymptotes: b²=4a²; the stated point gives a²=1 and b²=4.
- hyperbola-feasibility: absolute difference 0 gives the perpendicular bisector; 6 gives the hyperbola; 10 gives both exterior rays including foci; 12 is impossible by reverse triangle inequality.

### conics-parabola (8)

- focus-directrix: coefficient 12 equals 4a, giving a=3, focus (3,0), directrix x=-3.
- locus-derivation: equate nonnegative distances before squaring; cancellation gives y²=8x, which also enforces x≥0 and makes the reverse implication valid.
- negative-opening: a=-2 gives focus (-2,0) and directrix x=2.
- parabola-translation: vertex (-2,1), focus (0,1) and directrix x=-4 preserve the two-unit focal parameter.
- vertex-not-centre: rotating (2,4) about the origin gives (-2,-4), which fails the equation.
- degenerate-parabola: a=0 yields y²=0, the x-axis; the focus lies on the directrix, violating the nondegenerate definition.
- reverse-focus-directrix: midpoint between (1,3) and its perpendicular foot (1,-1) is vertex (1,1); a=2 upward, and squared distances verify (x−1)²=8(y−1).
- distance-minimization: on the parabola PF=x+2; PQ≥|x−8| gives lower bound 10. Equality requires y=0, so x=0; the vertex is the unique minimizer.

### conics-intersections (9)

- line-substitution: y=1 gives x²=27/4 and the two paired intersections.
- parabola-secant: x(x−4)=0 retains x=0; each root is returned to y=x.
- degree-loss-classification: substitution gives -2kx−k²=1. At k=0 there is no point; otherwise the stated unique point follows. Tangent slope 1 would force x=y, impossible on x²−y²=1.
- repeated-root: substituting y=x+1 yields (x−1)²=0, contact (1,2), and derivative slope 1 confirms tangency.
- central-chord: central symmetry pairs the two endpoints as A and -A; their midpoint is the centre.
- vieta-midpoint: quadratic 13x²+18x−27 gives mean x=-9/13; line substitution gives mean y=4/13.
- vertical-tangent: the right vertex has x=3; the tangent x=3 has no finite slope representation.
- midpoint-locus: Vieta gives h=-9m/(4+9m²), k=4/(4+9m²). Elimination gives h²/9+k(k−1)/4=0; the completed ellipse is correct. Finite m covers k>0, reverse m=-4h/(9k) proves sufficiency, and the vertical chord adds (0,0).
- inverse-chord: midpoint gives y₁+y₂=2 and y₁²+y₂²=16, hence product -6 and roots 1±sqrt(7). Matching x=y²/4 gives the linked signs and line 2x−y=3.

## Inquiry verification boundary

Eight dedicated 640×360 scenes compute the displayed quantities from the actual controls. Tests include signed scaling, zero vectors, affine external division, perpendicular residuals, collinear triangles, ellipse axis exchange and zero semiaxes, invalid hyperbola parameters, asymptote-parallel degree loss, both parabola openings and a=0, vertical ellipse chords and tangent/external cases. Display rounding never changes the underlying calculations.

Teacher materials contain specific anticipated correct and incorrect student responses and a rubric sample for every skill. A second agent independently rederived the nontrivial transfer results and reviewed written domains; no answer defect was found. The three proof-introduction gaps identified in both reviews were corrected before the frozen written manifest was recorded.
