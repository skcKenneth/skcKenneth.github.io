# Independent vector/conic peer review

Reviewed on 2026-10-08 by the calculus/statistics author, independently of the vector/conic authoring and verification helpers.

The reviewer first inspected the 120 published prompts, givens and choice expressions, derived the requested results, and then compared the authored answers and bilingual derivations. The dedicated peer test recalculates all **42 scalar answers and 16 diagnostic answers** from separately transcribed stated data and fresh dot products, norms, determinants, projections, conic parameters and intersections. Every expected value is derived without reading the stored answer. It checks diagnostic uniqueness as well as the key. All five peer tests pass:

```powershell
node --test tests/skills-vectors-conics-peer.test.mjs
```

The **62 written records** were separately inspected for result, reasoning, bilingual equivalence, assumptions and domain/degenerate cases. Their claims agree with independent algebra and geometry. Particular attention was paid to:

- zero vectors, nonunique bases, directed vectors versus distance, constrained segment projection and the physical river-crossing model;
- centroid reconstruction, all three orthocenter conditions, the median identity and both directions of the rhombus diagonal argument;
- ellipse focal-distance bounds, vertical major axes, the degenerate closed focal segment, infeasible focal sums and attainment of the linear objective maximum;
- absolute versus signed hyperbola focal differences, the empty/line/exterior-ray degeneracies, asymptote nonmembership and a degree-reduced single intersection which is not tangent;
- parabola focal factor, reversed openings, translated directrices, vertex versus symmetry centre, the degenerate focal model and the unique equality case for minimizing PF+PQ;
- a retained zero intersection root, a vertical tangent, complete midpoint locus including the vertical chord, and inverse-chord endpoints with matching signs.

Independently derived transfer results include the ellipse maximum **6√5 at (2/√5,6/√5)**; the parabola distance minimum **10 only at its vertex**; the complete midpoint ellipse **h²/(9/16)+(k−1/2)²/(1/4)=1**; and inverse chord **2x−y=3** with endpoints **(2±√7/2,1±√7)**. The peer tests include independent algebraic/numerical witnesses for these results and boundary cases. Such witnesses corroborate the inspected proofs; finite samples alone do not prove a general statement. The vector/conic owner's separate payload ledger is responsible for detecting later changes to reviewed written records.

The author resolved four explanation issues raised during review: explicitly defining u,v in the median derivation and ellipse optimization, obtaining the orthocenter's x=2 from the first altitude condition, and stating that the degenerate parabola focus lies on its directrix. The ellipse translation prompt now explicitly requests its major-axis vertices.

No mathematical answer defect remains in the reviewed question corpus. The owner corrected both inquiry presentation findings: geometric vectors now share an adaptive equal-aspect scale that keeps both complete arrows visible at allowed slider extremes, and printable table prose labels/status values now include both languages. The exact physical components are retained in the table. These fixes were independently re-inspected separately from question-answer correctness. This peer report does not claim browser QA or production deployment.
