---
title: "From Simulation to Certificate"
slug: from-simulation-to-certificate
summary: A frozen two-compartment positive-system benchmark separates finite spectral checks from verified all-parameter decay bounds and shows a benchmark-specific cost of restricting the quadratic certificate to be diagonal.
date: 2026-08-30
lastUpdated: 2026-08-30
featured: false
topics: [Positive systems, Robust control, Lyapunov certificates, Polytopic uncertainty, Reproducibility]
heroImage: /science/from-simulation-to-certificate/p09_02_certificate_decay_stress.svg
type: Research Notes
archived: false
scienceProject: from-simulation-to-certificate
redirectFrom: []
---

Twenty-five stable matrices are evidence about twenty-five matrices. A plot of 20,001 stable matrices is much stronger diagnostic evidence, but it is still evidence about a finite set. Neither statement, by itself, proves what happens at every unevaluated parameter value between the plotted points.

A certificate answers a different question. Instead of asking a simulator to visit many parameter values, it asks for one mathematical object whose inequality covers an entire uncertainty set. In this project that object is a positive-definite matrix $P$. If the same $P$ satisfies a quadratic Lyapunov inequality at both endpoints of an affine matrix segment, convexity carries the inequality to every matrix between those endpoints. The proof does not depend on whether the interior was sampled 25 times, 20,001 times, or not at all.

That distinction is the subject of P09. The benchmark uses one synthetic two-compartment leaky-transfer family. Its two endpoints are pulled apart through five frozen imbalance levels. At each level, four quantities are placed side by side: a dense spectral sweep, a 25-point seeded spectral sample, a verified quadratic certificate restricted to diagonal $P$, and a verified certificate constructed with a full symmetric $P$.

All six predeclared benchmark gates pass. At zero imbalance, the diagonal and full constructions agree to a relative $3.596327\times10^{-11}$. At full imbalance, the dense finite diagnostic is $0.2676586726$, the full certificate is $0.2676585204$, and the diagonal certificate is $0.1040795885$. The local diagonal gap relative to the dense diagnostic is $0.6111480807$. Canonical and rerun outputs are byte-identical.

Those numbers support a narrow conclusion: in this frozen two-state family, allowing an off-diagonal term in the constructed quadratic form retains a much less conservative robust decay lower bound at high imbalance. They do **not** establish a new theorem, a globally optimal semidefinite-program solution, a scaling result, a physical model, a safety guarantee, or a universal superiority law. The literature gate is **COMPLETE / REFRAME**, and the word **PASS** refers only to six frozen benchmark checks.

## The evidence ledger

| Item | Frozen record | Permitted interpretation |
|---|---:|---|
| Literature gate | **COMPLETE / REFRAME** | Positive-system stability and common copositive, diagonal, quadratic, and robust certificates are established fields. |
| State model | Synthetic two-compartment linear system | A transparent mathematical test family, not a calibrated physical process. |
| Uncertainty | One affine line segment at each of five stress levels | Endpoint inequalities can cover every convex mixture in this declared set. |
| Dense diagnostic | 20,001 uniformly spaced $\theta$ values | A fine finite check; explicitly not a certificate. |
| Sparse diagnostic | 25 fixed seeded $\theta$ values | A reproducible sample; explicitly not a certificate. |
| Certificate construction | Deterministic trace-normalized $2\times2$ grid, 241 coarse and 241 refined points per active axis | A search for feasible $P$, not a claim of global SDP optimality. |
| Direct verification | Both endpoint residuals checked after a $10^{-10}$ safety subtraction | The reported positive $\alpha$ values are feasible for the complete affine segment. |
| Main contrast at $s=1$ | Dense $0.2676586726$; full $0.2676585204$; diagonal $0.1040795885$ | A benchmark-specific certificate-quality gap. |
| Frozen verdict | **PASS**, 6/6 gates | The Phase-1 protocol behaved as predeclared; no wider research programme is certified. |
| Reproduction | Canonical and rerun SHA-256 `e4defd81…f637a7d` | The serialized scientific results are byte-identical in the recorded environment. |
| Visual review | Four SVG/PDF/600-dpi PNG triples; rev1 rejected, rev2 passed by two reviewers | Communication defects were corrected without changing data or gates. |

The ledger blocks several tempting substitutions. A high-resolution curve is not silently renamed a proof. A feasible matrix from a deterministic search is not silently renamed a globally optimal SDP solution. A decay bound for a synthetic two-state model is not silently renamed a physical time constant. And a successful frozen audit is not silently promoted to a theorem about all positive networks.

## Why the literature gate required a reframe

The broad idea is mature. Positive linear systems, Metzler matrices, Lyapunov functions, switching, robust stability, and convex performance analysis have decades of theory behind them. P09 therefore cannot claim that it invented positive-system certificates, diagonal Lyapunov functions, endpoint checking, or scalable convex analysis.

The historical overlap begins well before modern optimization software. Barker, Berman, and Plemmons studied positive diagonal solutions to Lyapunov equations in 1978 ([DOI](https://doi.org/10.1080/03081087808817203)). That work already makes a novelty claim based merely on “positive diagonal Lyapunov matrices” untenable.

The overlap becomes closer for uncertain or switching families. Gurvits, Shorten, and Mason analysed stability of switched positive linear systems ([DOI](https://doi.org/10.1109/TAC.2007.899057)). Mason and Shorten developed linear copositive Lyapunov conditions for switched positive systems ([DOI](https://doi.org/10.1109/TAC.2007.900857)). Knorn, Mason, and Shorten treated common linear copositive Lyapunov functions for sets of positive systems ([DOI](https://doi.org/10.1016/j.automatica.2009.04.013)), while Fornasini and Valcher addressed continuous-time positive switched systems ([DOI](https://doi.org/10.1109/TAC.2010.2049918)). These are not distant analogies. They directly occupy the conceptual territory of common certificates across families of positive dynamics.

The literature also extends beyond stability. Tanaka and Langbort gave bounded-real and structured-feedback results for internally positive systems ([DOI](https://doi.org/10.1109/TAC.2011.2157394)). Ding, Shu, and Liu further developed copositive Lyapunov conditions for switched positive systems ([DOI](https://doi.org/10.1016/j.jfranklin.2011.06.002)). Ebihara, Peaucelle, and Arzelier studied $L_1$-gain analysis for linear positive systems ([DOI](https://doi.org/10.1109/CDC.2011.6160692)). Briat treated robust stability, stabilization, and $L_1/L_\infty$ gain characterizations for uncertain positive systems ([DOI](https://doi.org/10.1002/rnc.2859)). A small numerical study cannot plausibly present convex positive-system performance analysis as new.

Later work tightens the boundary still further. Rantzer explicitly developed scalable control formulations for positive systems ([DOI](https://doi.org/10.1016/j.ejcon.2015.04.004)); a two-state benchmark has no basis for a new scalability claim. Colombino and Smith gave a convex characterization of robust stability for positive and positively dominated systems ([DOI](https://doi.org/10.1109/TAC.2015.2480549)). Gumus and Xu studied common diagonal Lyapunov solutions directly ([DOI](https://doi.org/10.1016/j.laa.2016.05.032)). Together, these twelve verified primary works make the direct-overlap risk high.

The literature decision is therefore **REFRAME**, not “proceed with a weaker novelty adjective.” The defensible contribution is pedagogical and evidential: build one small family whose complete calculation can be audited, keep finite diagnostics distinct from all-parameter certificates, and measure how a diagonal restriction behaves under a frozen stress path. The local question is:

> How does the restriction $P=\operatorname{diag}(p_1,p_2)$ change a constructed robust decay lower bound as two synthetic leaky-transfer endpoints become more imbalanced, and what exactly is certified by the endpoint inequalities?

That question is useful precisely because it is smaller than the established theory. A reader can follow every matrix, every grid choice, every gate, every residual, and every limitation without mistaking the exercise for a new characterization of robust positive systems.

## The synthetic leaky-transfer family

Let $x(t)=(x_1(t),x_2(t))^\top$ and consider

$$
\dot x=A x,
\qquad
A=
\begin{bmatrix}
-(r_1+k_{12}) & k_{21}\\
k_{12} & -(r_2+k_{21})
\end{bmatrix}.
$$

The quantities $k_{12}$ and $k_{21}$ are positive transfer rates, and $r_1,r_2$ are positive removal rates. The off-diagonal entries of $A$ are nonnegative, so $A$ is a Metzler matrix. For a linear system, that structure preserves the nonnegative orthant: a nonnegative initial state cannot instantly acquire a negative component through the cross-coupling terms.

The column sums are especially transparent:

$$
\mathbf 1^\top A=
\begin{bmatrix}-r_1 & -r_2\end{bmatrix}.
$$

Transfer moves state between the two coordinates, while the two removal terms leak it from the total. This makes the model structurally interpretable without turning it into a fitted physical system. The words “compartment,” “transfer,” and “removal” name the algebra. They do not identify a biological, chemical, ecological, electrical, epidemiological, or industrial process.

The two frozen full-stress endpoints use the following rates:

| Endpoint | $k_{12}$ | $k_{21}$ | $r_1$ | $r_2$ |
|---|---:|---:|---:|---:|
| Transfer toward compartment 1 dominant | $0.5643881501$ | $2.6493424810$ | $0.2831741517$ | $0.2028942643$ |
| Transfer toward compartment 2 dominant | $2.2068349885$ | $0.0228349675$ | $0.1264590483$ | $0.9070075626$ |

They generate

$$
A^{(1)}=
\begin{bmatrix}
-0.8475623018 & 2.6493424810\\
0.5643881501 & -2.8522367453
\end{bmatrix},
\quad
A^{(2)}=
\begin{bmatrix}
-2.3332940367 & 0.0228349675\\
2.2068349885 & -0.9298425301
\end{bmatrix}.
$$

Every declared transfer and removal rate is positive. The smallest column leakage anywhere on the five-level path is $0.1264590483$, above the frozen structural threshold $0.1$. This is a structural audit, not evidence that the numerical rates match any device or population.

## Two parameters with different jobs

The experiment uses two scalar parameters, and confusing them would change the design.

First define the midpoint

$$
\bar A=\frac{A^{(1)}+A^{(2)}}{2}.
$$

The **stress** parameter $s$ controls how far the two endpoints sit from that midpoint:

$$
A_i(s)=\bar A+s\bigl(A^{(i)}-\bar A\bigr),
\qquad i\in\{1,2\}.
$$

The protocol freezes exactly five values,

$$
s\in\{0,0.25,0.50,0.75,1.00\}.
$$

At $s=0$, both endpoints collapse to the same matrix $\bar A$. At $s=1$, they recover the original imbalanced pair. Thus $s$ is a controlled difficulty path, not an uncertain parameter inside one certificate.

At each fixed $s$, the **mixture** parameter $\theta$ spans the affine uncertainty segment:

$$
A(\theta,s)=(1-\theta)A_1(s)+\theta A_2(s),
\qquad 0\leq\theta\leq1.
$$

The certificate at a particular stress must cover every $\theta$ in that closed interval. The dense and seeded diagnostics evaluate selected $\theta$ values. Keeping $s$ and $\theta$ separate makes the scientific question clear: stress changes the family being studied; theta indexes the members that the robust statement must cover.

<figure>
  <img src="/science/from-simulation-to-certificate/p09_01_positive_network_protocol.svg" alt="Two leaky compartments and three evidence cards distinguish finite spectral checks from diagonal and full quadratic endpoint certificates." loading="lazy" />
  <figcaption>The frozen synthetic protocol separates evidence at sampled parameter values from inequalities that cover every convex mixture. Stress moves the endpoints apart; theta then spans the uncertainty segment at each fixed stress.</figcaption>
</figure>

## What a spectral simulation does and does not show

For one fixed matrix $A$, define its asymptotic spectral decay diagnostic as

$$
d_{\mathrm{spec}}(A)=-\max_j \operatorname{Re}\lambda_j(A).
$$

If this number is positive, that fixed matrix is Hurwitz. The dense calculation evaluates this quantity at 20,001 uniformly spaced theta values, so its spacing is $5\times10^{-5}$. At full stress, the smallest sampled value is

$$
0.26765867256228715
$$

at $\theta=0.04935$. The smaller 25-point seeded design finds $0.2676814323137071$ at $\theta\approx0.0423311$. That sparse value is slightly higher because the random design does not land exactly at the narrow minimum seen by the fine uniform grid.

Both calculations are legitimate diagnostics. The dense grid traces the shape of the parameter response and can expose implementation mistakes. The seeded design illustrates what a finite stress test happened to encounter under exact seeds. Neither covers the continuum between its points. Labelling the 20,001-point minimum a “certified worst case” would be a semantic error unless an additional argument bounded the unsampled intervals.

The machine-readable result prevents that promotion explicitly. Both diagnostic records contain `is_certificate: false`. That label is not decorative metadata. It preserves the difference when values later flow into tables, plots, or prose.

A grid can become part of a valid certification procedure if it is paired with an interval enclosure, a Lipschitz bound, a monotonicity proof, or another mechanism that covers what lies between nodes. P09 does none of those things for the spectral curve. Its robust proof follows a different route: a common Lyapunov inequality.

## From a quadratic energy to a decay certificate

Choose a symmetric positive-definite matrix $P$ and define

$$
V(x)=x^\top P x.
$$

Along $\dot x=Ax$,

$$
\dot V(x)=x^\top(A^\top P+PA)x.
$$

Suppose a number $\alpha>0$ satisfies

$$
A^\top P+PA+2\alpha P\preceq0.
$$

Then

$$
\dot V\leq-2\alpha V,
$$

and therefore

$$
V(x(t))\leq e^{-2\alpha t}V(x(0)).
$$

This is the certified statement. It bounds decay in the quadratic energy defined by the constructed $P$. Translating it into a Euclidean norm introduces factors involving the smallest and largest eigenvalues of $P$. P09 does not hide those geometric factors or reinterpret $\alpha$ as a measured physical half-life.

For one fixed $P$, the largest admissible alpha for one matrix can be expressed through a generalized eigenvalue calculation. The implementation forms

$$
Q(A,P)=-\frac12(A^\top P+PA)
$$

and takes the smallest generalized eigenvalue of $(Q,P)$. For a two-endpoint family, the common value is the smaller of the two endpoint values. The runner then subtracts a fixed $10^{-10}$ safety margin and checks the residual matrices directly.

## Why two endpoints cover every theta

At fixed stress, assume the same $P$ and $\alpha$ satisfy

$$
L_i=A_i^\top P+PA_i+2\alpha P\preceq0,
\qquad i=1,2.
$$

Because $A(\theta)=(1-\theta)A_1+\theta A_2$, the interior residual is

$$
\begin{aligned}
L(\theta)
&=A(\theta)^\top P+PA(\theta)+2\alpha P\\
&=(1-\theta)L_1+\theta L_2.
\end{aligned}
$$

The cone of negative-semidefinite matrices is convex. Therefore $L(\theta)\preceq0$ for every $\theta\in[0,1]$. This endpoint implication is standard robust-Lyapunov reasoning; it is not a new theorem contributed by P09.

It also explains why the certificate and the spectral sweep are logically different. The sweep asks for eigenvalues of many individual $A(\theta)$. The certificate verifies a shared $P$ at two endpoint matrices, then uses affinity and convexity to cover the complete segment. More samples may make the first picture smoother. They do not create the second implication.

## Diagonal versus full quadratic forms

Scaling $P$ by a positive constant does not change feasibility, so the search fixes

$$
\operatorname{trace}(P)=1.
$$

Every candidate is parameterized as

$$
P=
\begin{bmatrix}
p & q\\
q & 1-p
\end{bmatrix},
\qquad
q=t\sqrt{p(1-p)}.
$$

For the diagonal construction, $t=0$ and only $p$ varies. For the full construction, $t$ varies as well, allowing the quadratic energy to tilt relative to the coordinate axes. The coarse search uses 241 points per active axis over its frozen domain, and a second 241-point grid refines the neighbourhood of the best coarse candidate. A 121-plus-121 construction supplies the predeclared resolution sensitivity check.

This parameterization guarantees positive definiteness within the searched interior, but the search remains finite. It constructs a feasible trace-normalized matrix; it does not prove that no other positive-definite matrix yields a larger alpha. An actual global SDP claim would require an appropriate optimization formulation, solver evidence, tolerances, and ideally independent verification. None is asserted here.

The inclusion relation is still informative. The full parameterization contains diagonal candidates at $t=0$. In a perfectly solved optimization problem, the full optimum could not be worse than the diagonal optimum. In a finite grid search, even that expected ordering must be tested rather than assumed. A unit test checks that the deterministic full search contains and does not underperform the diagonal candidate within tolerance on the full-stress family.

At $s=1$, the reported diagonal matrix is

$$
P_{\mathrm{diag}}=
\begin{bmatrix}
0.4014333333 & 0\\
0 & 0.5985666667
\end{bmatrix},
$$

while the full construction is

$$
P_{\mathrm{full}}=
\begin{bmatrix}
0.4321333333 & 0.3933259267\\
0.3933259267 & 0.5678666667
\end{bmatrix}.
$$

The off-diagonal term is not a cosmetic embellishment. It rotates the level sets of $V$ so that one quadratic form can align better with both imbalanced endpoint dynamics. That geometric explanation is plausible and consistent with the constructed matrices. The numerical result still belongs only to this family; it is not a theorem that every imbalanced positive network needs a full $P$.

## Freezing the experiment before the canonical run

The configuration fixes the two endpoint rate records, five stress values, 20,001-point diagnostic, 25-point seeded diagnostic, seeds 90901 through 90905, certificate grids, correlation limit, safety margin, normalization, and six gates. The byte-level configuration SHA-256 is

`c1c20c5ed0e6ea0c2f781b3a10bbb9638e659593af1cd323304a35ec7ee1ebc4`.

The gates were not chosen after seeing the final table:

1. **Positive leaky structure:** every endpoint must be Metzler and the minimum column leakage must be at least $0.1$.
2. **Residual verification:** every diagonal and full endpoint certificate must pass the direct matrix check.
3. **Balanced-limit agreement:** at $s=0$, diagonal and full bounds may differ by at most $10^{-5}$ relative to the dense diagnostic.
4. **Full-certificate tracking:** across the five stresses, the maximum full-to-dense relative gap must be at most $0.005$.
5. **Visible diagonal restriction:** at $s=1$, the diagonal relative gap must be at least $0.4$, while the diagonal certified decay must remain at least $0.05$.
6. **Grid sensitivity:** changing the construction from 241-plus-241 to 121-plus-121 points may alter no reported bound by more than $0.001$.

G1 or G2 failure would yield **STOP** because the structural or certificate foundation would be invalid. Failure of another gate would yield **PARTIAL**. Only all six passing yields the local **PASS** verdict. Results were to be retained regardless of whether the outcome was STOP, PARTIAL, or PASS.

G3 is a manufactured limiting check, not a discovery. When $s=0$, the endpoints coincide, so the diagonal and full constructions ought to agree closely in this chosen midpoint case. G5 is deliberately a contrast gate: the family was selected during development to expose a nontrivial restriction gap. Calling it a prediction about naturally occurring networks would reverse the evidence order.

## Development search is not confirmatory evidence

Before the protocol freeze, a deterministic exploratory script used seed 90900 to generate 240 positive leaky-transfer pairs. It rejected candidates with weak sampled decay, invalid certificate checks, or little diagonal/full contrast and printed the strongest survivors. Candidate 104 became the frozen family.

This is a legitimate design step, but it changes the interpretation. The full-stress contrast is not an unbiased estimate of how often diagonal certificates are conservative in a population of systems. The candidate was intentionally selected because it makes the phenomenon visible while retaining positive leakage and feasible certificates. The attempts log and decision log preserve that fact.

The confirmatory content begins only after the selected family, stress path, grids, seeds, thresholds, and verdict rule were frozen. A future distributional statement would need a separately registered family-generation mechanism and held-out systems. Reusing the same exploratory pool would not provide such evidence.

## Results across the five stress levels

The complete frozen summary is:

| Stress $s$ | Dense finite diagnostic | Seeded 25-point diagnostic | Diagonal certificate | Full certificate |
|---:|---:|---:|---:|---:|
| $0.00$ | $0.3718322242$ | $0.3718322242$ | $0.3718322241$ | $0.3718322241$ |
| $0.25$ | $0.3200956966$ | $0.3283382702$ | $0.3200956960$ | $0.3200956965$ |
| $0.50$ | $0.2869918550$ | $0.2912084359$ | $0.2734436692$ | $0.2869918549$ |
| $0.75$ | $0.2703443004$ | $0.2746030790$ | $0.2007298053$ | $0.2703443003$ |
| $1.00$ | $0.2676586726$ | $0.2676814323$ | $0.1040795885$ | $0.2676585204$ |

At zero stress, all four quantities nearly coincide because every theta points to the same midpoint matrix. The relative difference between the diagonal and full constructions is $3.5963271593\times10^{-11}$, comfortably below the $10^{-5}$ gate.

At $s=0.25$, the full and diagonal certificates are still almost indistinguishable from the dense diagnostic. The 25-point minimum is visibly higher because those samples miss the worst region. At $s=0.50$, the diagonal restriction begins to lose bound quality: $0.2734436692$ versus a full bound of $0.2869918549$. At $s=0.75$, the diagonal value falls further to $0.2007298053$, while the full construction remains near $0.2703443003$.

At full stress, the contrast is largest. Relative to the dense finite minimum, the diagonal gap is

$$
\frac{0.26765867256228715-0.10407958854612244}
{0.26765867256228715}
=0.611148080688841.
$$

The full gap is only

$$
5.6865787729\times10^{-7}.
$$

That closeness is an empirical feature of the frozen family. It does not prove that the full construction found the exact robust decay optimum, nor that a dense spectral minimum is the objective value of a globally solved quadratic-certificate problem. The quantities answer related but distinct questions.

<figure>
  <img src="/science/from-simulation-to-certificate/p09_02_certificate_decay_stress.svg" alt="Decay rate versus endpoint-imbalance stress for dense and seeded finite diagnostics and verified diagonal and full quadratic certificates." loading="lazy" />
  <figcaption>Within the frozen two-compartment family, the diagonal certificate drops under stress while the full construction stays close to the dense diagnostic. This is a selected benchmark contrast, not a universal ranking of certificate classes.</figcaption>
</figure>

## Reading the main figure without overclaiming

Four lines appear on the same axes, but they do not have the same epistemic status.

The dense and seeded curves report minima over evaluated matrices. They are useful for checking shape and for showing how a sparse sample can sit above a narrow adverse region. The diagonal and full curves report positive alphas attached to explicitly stored $P$ matrices whose endpoint residuals were verified. Those two curves therefore support all-theta lower-bound statements for their respective quadratic forms.

The diagonal curve falling under stress does not mean the system becomes unstable. Its certified alpha stays positive, including $0.1040795885$ at full stress. The result says the chosen diagonal quadratic form produces a weaker guaranteed rate. A conservative certificate can be small even when every individual matrix appears to decay faster.

Likewise, the full curve tracking the dense diagnostic does not mean the full construction “predicts the truth.” The dense curve is itself finite. The agreement is best read as a consistency observation: a feasible common full quadratic form achieves nearly the smallest spectral decay encountered on the fine grid. It is not a proof that no unsampled matrix has a smaller spectral decay, and it is not a proof that no other $P$ improves the certificate.

The stress path also matters. It contracts one selected endpoint pair toward its midpoint. Another path could change leakage, rotate eigendirections differently, alter nonnormality, introduce more vertices, or leave the affine line-segment setting entirely. P09 has not tested those alternatives.

## The full-stress theta audit

The full-stress profile makes the evidence hierarchy especially visible. A 401-point curve shows the spectral decay as theta traverses the line segment. The 25 seeded points lie on that curve at their evaluated locations. Horizontal lines show the diagonal and full certificate bounds.

The dense 20,001-point diagnostic places its minimum near $\theta=0.04935$, close to the left endpoint but not at it. The smaller seeded set happens to include a point near $0.04233$, so its minimum is close but still optimistic. If the adverse region had been narrower or shifted between random points, the discrepancy could have been larger.

The full horizontal line does not depend on hitting that region. Its logical support comes from the two endpoint residuals. The diagonal horizontal line is supported in exactly the same way, but the restriction on $P$ forces it lower for this pair.

<figure>
  <img src="/science/from-simulation-to-certificate/p09_03_full_stress_theta_audit.svg" alt="Full-stress decay curve and seeded parameter points with horizontal full and diagonal robust certificate bounds across the entire uncertainty segment." loading="lazy" />
  <figcaption>A plotted parameter curve remains finite evidence; the verified endpoint inequalities support the horizontal all-theta certificate bounds. The visual density of a curve must not be confused with the logical coverage of a certificate.</figcaption>
</figure>

This figure also illustrates why a certificate may lie below a pointwise spectral curve. A single quadratic energy must work for every member of the family. It trades matrix-specific sharpness for a uniform statement. The diagonal restriction removes geometric freedom, so the price of a common form can become larger. None of that implies that quadratic certificates are always necessary, always sufficient for every desired property, or preferable to copositive and positive-system-specific alternatives developed in the literature.

## Direct residual checks

After the grid proposes a matrix, the runner recomputes its common generalized decay and subtracts $10^{-10}$. It then forms, for each endpoint,

$$
R_i=A_i^\top P+PA_i+2\alpha P
$$

and records the largest eigenvalue of the symmetric residual. A nonpositive largest eigenvalue means $R_i\preceq0$ up to the declared numerical check.

At full stress, the maximum endpoint residual eigenvalue is

$$
-8.6341489514\times10^{-11}
$$

for the diagonal construction and

$$
-1.2635535673\times10^{-10}
$$

for the full construction. The values are slightly negative, consistent with the deliberate safety subtraction. The stored eigenvalues of both $P$ matrices are positive; for the full matrix they are approximately $0.100862$ and $0.899138$.

Residual verification is essential because the grid-search formula and the serialization pipeline could contain mistakes. A candidate alpha is not a certificate merely because a maximization routine returned it. The final matrix must be positive definite, and the claimed inequality must be checked against the actual frozen endpoints.

The residual numbers should still be interpreted with numerical humility. This is binary64 arithmetic with direct eigenvalue calculations, not interval arithmetic or a formally verified proof assistant. The fixed safety margin and independent test cases reduce the risk of an inward rounding error, but they do not create machine-checked exact arithmetic.

## Grid sensitivity is not an optimality proof

The frozen construction is repeated with 121 coarse and 121 refined points per active axis. The largest absolute change across all diagonal and full values is

$$
6.76362408196\times10^{-5},
$$

below the predeclared $0.001$ threshold. The largest change occurs for the diagonal construction at $s=0.75$; at full stress the diagonal change is about $4.2041\times10^{-5}$ and the full change about $1.9873\times10^{-6}$.

This comparison is useful because an unstable grid search could produce a visually persuasive but resolution-dependent result. Passing G6 says the reported values do not move much under this one coarsening. It does not prove convergence as grid spacing tends to zero. It does not rule out a better candidate between both grids. And it does not replace an independent conic solver.

The language in the result file reflects that boundary: the search **constructs feasible trace-normalized $2\times2$ matrices**. It does not “solve the SDP.” This may sound like a small wording choice, but it prevents a common reproducibility failure in which an algorithmic aspiration is later remembered as a verified mathematical outcome.

## The six-gate audit

Every frozen gate passes:

- G1: all endpoint matrices are Metzler, with minimum leakage $0.1264590483\geq0.1$;
- G2: all 10 constructed certificate matrices pass both endpoint checks, for 20 verified inequalities in total;
- G3: zero-stress diagonal/full relative difference is $3.5963271593\times10^{-11}\leq10^{-5}$;
- G4: maximum full-certificate gap to the dense diagnostic is $5.6865787729\times10^{-7}\leq0.005$;
- G5: full-stress diagonal gap is $0.6111480807\geq0.4$, while its alpha is $0.1040795885\geq0.05$;
- G6: maximum 241-versus-121 absolute change is $6.7636240820\times10^{-5}\leq0.001$.

The verdict is therefore **PASS (6/6)**. The exact parenthetical qualifier matters: these are benchmark gates. They validate the frozen structure, feasibility, limiting check, selected contrast, finite-resolution sensitivity, and replay. They do not certify the truth of every sentence one might write about robust control.

<figure>
  <img src="/science/from-simulation-to-certificate/p09_04_predeclared_gate_audit.svg" alt="Six passed frozen gates, full-stress residual eigenvalues, byte-identical rerun status, and the narrow literature-reframed claim boundary." loading="lazy" />
  <figcaption>All six benchmark gates pass, without implying a new theorem, global SDP optimum, scaling result, physical validation, or universal superiority. The residual and replay panels show what was actually checked.</figcaption>
</figure>

## Tests, replay, and the technical record

Six substantive tests passed. They check that the rate parameterization is positive and leaky; verify convex mixtures and a manufactured spectral abscissa; recover the generalized decay of a known case and reject an invalid alpha; confirm that a verified endpoint certificate covers 101 checked interior mixtures; test that the full search contains the diagonal candidate and is deterministic; and rerun the complete experiment while preserving the `is_certificate: false` labels on both finite diagnostics.

The tests do not prove all numerical software correct. They target the claims most likely to be corrupted by an indexing, sign, normalization, or interpretation error. The manufactured case is important because reproducing only the final benchmark could allow the implementation and result to share the same bug.

The canonical and rerun files are serialized with sorted keys and no NaN values. Their common SHA-256 is

`e4defd81ca7ac3a11f6652414addf2fa2ecabf6eed543a3a756319dd8f637a7d`.

Byte identity is stronger than merely printing the same rounded headline. It confirms that the stored profiles, matrices, residuals, seeds, gates, and metadata match. It remains an environment-scoped determinism check, recorded under Python 3.12.13 and NumPy 2.3.5, not a guarantee of identical floating-point bytes on every future platform or library version.

From the P09 directory, the frozen sequence is:

```powershell
python -m unittest discover -s tests -v
python scripts/run_phase1.py
python scripts/run_phase1.py --output results/p09_phase1_rerun.json --signature results/p09_phase1_rerun_signature.json
python scripts/validate_phase1.py --compare results/p09_phase1_rerun.json
python scripts/plot_phase1.py
python scripts/check_repo.py
```

The runner appends attempt metadata, the validator checks the comparison, the plotting script binds figures to the canonical result hash, and the repository checker audits the literature gate, results, signatures, figures, accessibility metadata, and QA record. The command sequence is evidence only when run from the declared repository state; copying the commands into prose does not itself reproduce the study.

## A real visual failure was preserved

The first figure batch was not declared publication-ready. In revision 1, the bottom claim-boundary lines in Figure 2 sat too close to the x-axis label and lower page edge. That created a collision and clipping risk at the original $4296\times2160$ review size. The batch was rejected, and the rev1 SVG, PDF, PNG, and hashes were retained under the rejected-artifact directory.

Revision 2 reduced the relevant plot and side-panel height and separated the two bottom lines from the axis label and edge. The data, gates, and result hashes did not change. All four canonical PNGs and four PDF rasters were then reopened at original size. Two reviewers checked titles, panel labels, curves, markers, legends, audit boxes, axis labels, footers, and all four edges. The final record is PASS with no overlap or clipping.

This history matters for two reasons. First, vector output can be mathematically correct and still communicate badly. Second, a visual revision must not become an unlogged opportunity to alter an inconvenient result. Preserving rev1 and stating exactly what moved separates layout repair from scientific revision.

## What the benchmark does not establish

The evidence does not support any of the following claims:

- that the constructed full matrix is a globally optimal common quadratic certificate;
- that diagonal Lyapunov matrices are generally inferior, or inferior by $61.1\%$, across positive systems;
- that the dense 20,001-point minimum is an exact robust spectral minimum;
- that a 25-point sample estimates a failure probability or confidence level;
- that one two-vertex affine segment represents polytopic uncertainty in general;
- that endpoint checking covers nonlinear, non-affine, time-varying, or unmodelled uncertainty;
- that the approach scales to large sparse networks or competes computationally with established positive-system methods;
- that a common quadratic form is the best certificate class for positive systems;
- that the synthetic rates describe a physical compartment process;
- that the alpha values are measured decay times, safety margins, reliability levels, or controller guarantees;
- that a controller was designed, optimized, or validated;
- that the study supplies a new theorem, solver, convex characterization, or formal proof;
- that PASS unlocks a manuscript headline beyond the literature-reframed benchmark claim.

Positive leakage also makes broad “discovery of stability” language inappropriate. The family was constructed to be a leaky positive system, and its sampled matrices are comfortably stable. The interesting local quantity is the quality of a robust decay lower bound under a certificate restriction, not a surprise finding that two lossy compartments can decay.

## Why finite diagnostics still belong in a certificate study

It would be a mistake to respond to the evidence hierarchy by discarding simulation. The dense curve checks whether the certificate lies in a plausible range, locates the adverse theta region, and exposes the geometry hidden by a single bound. The seeded design demonstrates how finite coverage depends on where points fall. Manufactured cases and interior checks test implementation paths that the endpoint proof alone would not exercise.

The correct relationship is asymmetric. Diagnostics can challenge a certificate implementation: if a sampled matrix decays more slowly than a claimed valid lower bound, something is wrong. But diagnostics do not validate all unsampled matrices merely by becoming dense. A robust workflow uses both, assigns each the right burden of proof, and refuses to let a plot inherit the word “certificate” from the surrounding project title.

That distinction transfers beyond this example. Monte Carlo stress tests, parameter sweeps, scenario libraries, and simulation dashboards answer questions about evaluated cases. A certificate needs a set-wise argument: an invariant, enclosure, convex implication, formal proof, or other mechanism that reaches unevaluated cases. The mechanism may be conservative, but its scope is explicit.

## Locked next stages

A more ambitious study would need a new protocol, not a few extra points appended after the result. Useful extensions include larger positive networks, multiple uncertainty vertices, structured parameter blocks, non-affine uncertainty, alternative copositive or diagonal stability conditions, and an independent conic solver with recorded tolerances.

To study general diagonal conservatism, a protocol would need a declared distribution or deterministic library of families, a separation between development and held-out cases, and metrics defined before results are inspected. Candidate selection could then be treated as training, with generalization assessed on untouched networks. Without that separation, more examples selected for dramatic gaps would only reinforce selection bias.

A scaling study would need exact hardware and software environments, sparse versus dense formulations, solver failure accounting, residual checks at comparable tolerances, and sizes large enough to reveal computational structure. P09 contains none of that evidence.

A physical study would require a named system, dimensional units, parameter provenance, uncertainty justification, data or experimental validation, and domain review. A safety claim would require a hazard definition and assurance framework far beyond a quadratic decay bound. These stages remain locked for human review.

## Final lesson

Simulation and certification are complementary, but they are not synonyms. The 25-point and 20,001-point sweeps make the frozen family visible. The endpoint Lyapunov inequalities make an all-theta statement possible. The deterministic grid proposes $P$; the direct residual check gives each reported alpha its certificate status. The rerun and QA records make the evidence auditable.

Within this deliberately selected two-compartment family, the diagonal restriction matters. At full imbalance it certifies $0.1040795885$, while a constructed full quadratic form certifies $0.2676585204$ and the dense finite diagnostic is $0.2676586726$. That is a clear local contrast, and all six predeclared gates pass.

The durable methodological result is not that full matrices always win. It is that evidence should be named by the coverage it actually provides. A finite sweep reports what was evaluated. A feasible common inequality covers its declared set. A grid sensitivity check reports one resolution comparison. A byte-identical rerun reports deterministic replay. None should be promoted beyond its own logic.

## Technical record

The private ScienceProject repository's P09 workspace retains the source, tests, frozen research contract, COMPLETE / REFRAME literature gate with twelve verified DOI works, five-stress Phase-1 protocol, claim ledger, canonical machine-readable result, reproducibility record, and rejected figure revision. The public Blog contains only the reviewed interpretation and admitted SVGs; it deliberately avoids publishing an inaccessible private-repository link.

- Frozen config SHA-256: `c1c20c5ed0e6ea0c2f781b3a10bbb9638e659593af1cd323304a35ec7ee1ebc4`
- Canonical/rerun result SHA-256: `e4defd81ca7ac3a11f6652414addf2fa2ecabf6eed543a3a756319dd8f637a7d`
- Scientific verdict: **PASS (6/6 frozen benchmark gates)**
- Evidence boundary: synthetic two-state family; no new theorem, global SDP optimum, scaling, physical validation, safety claim, or universal ranking
