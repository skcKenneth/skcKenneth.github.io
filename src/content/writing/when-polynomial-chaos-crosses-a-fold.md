---
title: "When Polynomial Chaos Crosses a Fold"
slug: when-polynomial-chaos-crosses-a-fold
summary: A global polynomial and an oracle fold-aligned surrogate receive the same 16 model evaluations on one synthetic CSTR benchmark; the local construction is far more faithful, but the oracle cost is outside the comparison.
date: 2026-08-29
lastUpdated: 2026-08-29
featured: false
topics: [Uncertainty quantification, Polynomial chaos, Bifurcations, CSTR, Reproducibility]
heroImage: /science/when-polynomial-chaos-crosses-a-fold/p04_02_global_vs_fold_aligned_response.svg
type: Research Notes
archived: false
scienceProject: when-polynomial-chaos-crosses-a-fold
redirectFrom: []
---

A polynomial surrogate is attractive because it turns repeated nonlinear model solves into inexpensive algebra. But what happens when the model response does not merely curve, and instead jumps from one stable branch to another? A single smooth polynomial must then represent two smooth pieces and the discontinuity between them. Increasing its degree can sharpen the transition, but it can also spread oscillatory error away from the jump, move a threshold crossing, and assign mass to physically inadmissible response values.

This project tests that failure mode on one deliberately small, synthetic benchmark: a dimensionless non-isothermal continuous stirred-tank reactor (CSTR) with a saddle-node fold. The uncertain Damköhler number is centered exactly on the analytic ignition fold. A global degree-15 Legendre collocation surrogate and a two-element degree-7-plus-degree-7 surrogate each receive exactly 16 forward evaluations. The second construction places its element boundary at the known fold.

That last sentence is both the reason for the strong numerical result and its most important limitation. The fold is supplied by an **analytic oracle**. Its derivation and discovery cost are excluded from the matched 16-evaluation fit budget. The local construction is therefore **fold-aligned**, not adaptive. This is not a total-cost comparison, not a claim that an automatic algorithm found the discontinuity, and not evidence of universal superiority.

Within that narrow boundary, the Phase-1 outcome is clear. The global surrogate has response RMSE $0.0783280594$ and Wasserstein-1 error $0.0439521168$. The fold-aligned surrogate has RMSE $0.000248551855$ and Wasserstein-1 error $5.03489790\times10^{-5}$. Those are improvement factors of about $315.14$ and $872.95$. Under the declared cold-start, quasi-static, right-continuous history, the analytic hot-state probability is $0.5$; the global surrogate gives $0.4710647474$, while the fold-aligned surrogate gives $0.5$. The global surrogate also places $0.0531311035$ probability mass outside the valid response support, whereas the fold-aligned surrogate places none.

Those numbers are a reproducible result for one frozen benchmark. They do not establish an adaptive multi-element method, a cheaper end-to-end workflow, physical reactor fidelity, industrial safety, finite-rate ignition behavior, or a theorem about polynomial chaos. The literature gate was **REFRAME**, precisely because polynomial chaos near bifurcations, multi-element partitioning, discontinuity detection, and uncertain CSTR analysis are already established research areas. The local contribution is an auditable, history-explicit, matched-fit-budget stress test—not the invention of multi-element polynomial chaos.

## The evidence ledger

The most useful way to read this study is to separate what was measured from what might be tempting to infer.

| Item | Frozen Phase-1 record | Permitted interpretation |
|---|---:|---|
| Literature gate | **REFRAME** | The generic novelty claim was too broad; a single-case reliability benchmark remained defensible. |
| Physical scope | Synthetic dimensionless CSTR | A canonical numerical model, not a calibrated reactor. |
| History | Cold start, quasi-static increasing $Da$, right-continuous at ignition | A deterministic branch-selection operator, not a finite ramp-rate simulation. |
| Uncertainty | $Da=Da_{\mathrm{ign}}+0.008\xi$, $\xi\sim U[-1,1]$ | One symmetric fold-centered input law. |
| Global fit | Degree 15, 16 Gauss-Legendre evaluations | One global polynomial allocation. |
| Local fit | Two degree-7 elements, 8 evaluations per side | A fold-aligned oracle allocation, not automatic partitioning. |
| Setup accounting | Analytic fold cost excluded | Fit budgets match; total costs do not. |
| Decision | All 16 checks true, status **SUPPORTED** | The frozen smoke criteria passed, not a universal method ranking. |
| Reproducibility | Two complete reruns share signature 84359c…9043 | Deterministic numerical reproduction on the recorded setup. |
| Locked work | Wider sweeps, adaptive splitting, physical calibration, final evaluation | No result from these stages is claimed here. |

This separation matters because “same budget” has several meanings. The two fits use the same number of calls to the response model. Only one fit is told where to split. If locating a fold required continuation, additional solves, adjoints, experiments, or a classifier, those costs would belong in a total-cost study. Phase 1 intentionally does not estimate them.

## Why the literature gate said REFRAME

The initial project title suggested a broad claim: adaptive multi-element polynomial chaos could rescue uncertainty propagation across thermal bistability in a CSTR. The literature review made that headline indefensible before computation began.

Wan and Karniadakis introduced an adaptive multi-element generalized polynomial chaos method for stochastic differential equations in 2005, explicitly establishing random-space decomposition as a response to loss of global spectral regularity ([DOI](https://doi.org/10.1016/j.jcp.2005.03.023)). Venturi, Wan, and Karniadakis coupled polynomial-chaos ideas with stochastic bifurcation analysis for Rayleigh–Bénard convection in 2010 ([DOI](https://doi.org/10.1017/S0022112009993685)). Kuehn and Lux later treated uncertainty quantification of bifurcations in random ordinary differential equations with a systematic dynamical-systems perspective ([DOI](https://doi.org/10.1137/21M1392073)).

The overlap is even closer in recent work. Dréau, Magnain, and Batailly developed multi-element polynomial chaos based on automatic discontinuity detection for nonlinear systems ([DOI](https://doi.org/10.1016/j.jsv.2023.117920)). Kuehn, Piazzola, and Ullmann analyzed bifurcations of the Allen–Cahn equation with random coefficients ([DOI](https://doi.org/10.1016/j.physd.2024.134390)). Gonnella, Khamlich, Pichi, and Rozza studied a stochastic perturbation approach to nonlinear bifurcating problems ([DOI](https://doi.org/10.1007/s10915-026-03338-0)); Venier, Gonnella, Pichi, and Rozza addressed consistency and convergence of polynomial-chaos branch approximations in stochastic bifurcation analysis ([arXiv DOI](https://doi.org/10.48550/arXiv.2605.31288)).

There are also two adjacent lines of work that constrain the novelty claim. Bourgey, Gobet, and Rey compared polynomial-type chaos expansions for indicator functions, directly relevant whenever a smooth surrogate is converted into an event probability ([DOI](https://doi.org/10.1137/21M1413146)). CSTRs under uncertainty are not untouched territory: Ratto and Paladino analyzed controlled CSTR models with fluctuating and uncertain parameters in 2000 ([DOI](https://doi.org/10.1016/S1385-8947(00)00139-X)), while Du, Budman, and Duever used polynomial-chaos-based Markov models in probabilistic robust self-tuning control ([DOI](https://doi.org/10.1016/j.ifacol.2018.09.273)).

These ten primary works establish the broad landscape. Global polynomial approximation can struggle when a response loses smoothness. Partitioning random space is established. Adaptive or automatic discontinuity localization is established. Polynomial chaos has been combined with bifurcation analysis, and probabilistic methods have been applied to uncertain CSTRs. A local experiment cannot honestly be presented as discovering any of those facts.

The reframed question is narrower and more auditable:

> Under one frozen, fold-centered uncertainty law and one declared branch history, how different are a global polynomial and an oracle fold-aligned two-element polynomial when both fits spend 16 forward evaluations?

That question leaves a useful paper seed because it makes the comparison fully inspectable. It specifies the branch operator, the event definition, the fit budget, the oracle disclosure, the reference construction, and the pass/fail rule. The literature search supports the decision to narrow the question; it does not prove that no similar benchmark has ever existed, and the local smoke result does not overturn the established literature.

## The canonical CSTR model

The dimensionless state consists of reactant concentration $c$ and temperature rise $\theta$. With activation parameter $a$, heat-release parameter $B$, and Damköhler number $Da$, the model is

$$
\frac{dc}{dt}
=1-c-Da\,c\exp\!\left(\frac{a\theta}{a+\theta}\right),
$$

$$
\frac{d\theta}{dt}
=-\theta+B\,Da\,c\exp\!\left(\frac{a\theta}{a+\theta}\right).
$$

Phase 1 freezes $a=20$ and $B=8$. These are dimensionless benchmark values. There is no mapping to a particular reaction, vessel volume, cooling system, residence time, feed composition, or industrial operating envelope.

At equilibrium, add $B$ times the concentration equation to the temperature equation. The nonlinear reaction terms cancel, leaving

$$
B(1-c)-\theta=0,
$$

so every positive steady state satisfies

$$
c=1-\frac{\theta}{B}.
$$

Substituting this relation into either steady equation parameterizes the entire positive equilibrium curve by $\theta$:

$$
Da(\theta)
=\frac{\theta}{B-\theta}
\exp\!\left(-\frac{a\theta}{a+\theta}\right),
\qquad 0<\theta<B.
$$

There is an important typographic point in the previous display: the expression is a product, not a sum. Written unambiguously,

$$
Da(\theta)
=\frac{\theta}{B-\theta}
\;\times\;
\exp\!\left(-\frac{a\theta}{a+\theta}\right).
$$

The explicit multiplication symbol is included to prevent the line break from being misread; the implemented formula is $\frac{\theta}{B-\theta}\exp(-a\theta/(a+\theta))$.

Rather than trusting a nonlinear time integrator to reveal steady branches, the benchmark works directly with this exact scalar curve. That choice makes the branch reference and fold calculation independent of step-size or transient stopping rules.

## Deriving the two folds

A fold is a stationary point of $Da(\theta)$. It is numerically cleaner to differentiate its logarithm:

$$
\frac{d}{d\theta}\log Da(\theta)
=\frac{1}{\theta}
+\frac{1}{B-\theta}
-\frac{a^2}{(a+\theta)^2}.
$$

Setting this derivative to zero and clearing denominators gives the quadratic

$$
(a^2+B)\theta^2
+aB(2-a)\theta
+Ba^2=0.
$$

For $a=20$ and $B=8$, its two roots in $(0,B)$ produce two simple folds. The lower-temperature turning point is the ignition fold:

$$
\theta_{\mathrm{ign}}=1.3814801666464074,
\qquad
Da_{\mathrm{ign}}=0.057329640075221795.
$$

The higher-temperature turning point is the extinction fold:

$$
\theta_{\mathrm{ext}}=5.677343362765358,
\qquad
Da_{\mathrm{ext}}=0.029354991549934553.
$$

The apparently reversed ordering of the $Da$ values is exactly what produces the S-shaped equilibrium curve. Between $Da_{\mathrm{ext}}$ and $Da_{\mathrm{ign}}$, three equilibria coexist: a stable cold branch, an unstable middle saddle branch, and a stable hot branch. The Phase-1 code verifies stability with the Jacobian eigenvalues rather than assigning branch labels from temperature alone.

The analytic fold values were cross-checked by an independent scan for sign changes of the logarithmic derivative followed by bisection. The absolute $Da$ differences were $6.94\times10^{-18}$ for ignition and $0$ for extinction. The absolute temperature differences were $9.44\times10^{-14}$ and $2.30\times10^{-13}$. Fold derivative residuals were $2.22\times10^{-16}$ and $0$, and the finite-difference second derivatives had nonzero signs, confirming two simple folds under the frozen tolerances.

<figure>
  <img src="/science/when-polynomial-chaos-crosses-a-fold/p04_01_cstr_fold_protocol.svg" alt="Dimensionless non-isothermal CSTR equilibrium curve with stable cold and hot branches, the middle saddle branch, ignition and extinction folds, the uncertain Damkohler interval, and the declared cold-start jump." loading="lazy" />
  <figcaption>The canonical equilibrium curve and declared branch history. The response is a right-continuous quasi-static history operator, not a finite-rate ignition simulation.</figcaption>
</figure>

## History is part of the response definition

An S-curve does not define a unique response in the bistable interval. At one $Da$, both cold and hot stable equilibria may exist. Asking a root solver for “the equilibrium” without declaring a branch rule is therefore incomplete.

Phase 1 declares an idealized history:

1. Start at $Da_0=0.020$.
2. Increase $Da$ quasi-statically.
3. Follow the stable cold branch for $Da<Da_{\mathrm{ign}}$.
4. At the ignition fold, take the hot branch; the convention is right-continuous.

The initial value $Da_0=0.020$ is below the extinction value $0.02935499155$. Direct branch enumeration finds exactly one equilibrium there, and it is stable and cold. That check prevents an ambiguous starting branch from being silently built into the result.

Define the conversion-like response

$$
y(Da)=\frac{\theta(Da)}{B}.
$$

Under the declared history,

$$
y(Da)=
\begin{cases}
\theta_{\mathrm{cold}}(Da)/B, & Da<Da_{\mathrm{ign}},\\
\theta_{\mathrm{hot}}(Da)/B, & Da\ge Da_{\mathrm{ign}}.
\end{cases}
$$

The cold one-sided limit at the fold is $0.1726850208$, while the right-continuous hot value is $0.9279002591$. The jump is not numerical noise; it is the chosen history operator acting on a bistable equilibrium diagram.

This is not a dynamic ramp. The code does not integrate a finite-rate increase in $Da$, model delayed loss of stability, inject thermal noise, or calculate a random branch occupancy. Consequently, the “hot probability” below is a history-conditioned probability induced by uncertain $Da$. It is not a stationary probability of occupying the hot state and not a safety probability for a physical reactor.

## The fold-centered uncertainty law

The uncertain input is

$$
\xi\sim U[-1,1],
\qquad
Da=Da_{\mathrm{ign}}+0.008\xi.
$$

Thus the sampled interval is

$$
[0.049329640075221795,\;0.0653296400752218],
$$

with the ignition fold exactly at $\xi=0$. A state is called hot when $y\ge0.8$. Because the declared response is cold for $\xi<0$ and jumps to a hot value above $0.8$ for $\xi\ge0$, symmetry gives the analytic protocol probability

$$
\Pr(y\ge0.8)=\Pr(\xi\ge0)=\frac{1}{2}.
$$

This exact $0.5$ is a particularly transparent event audit. It is not a difficult probability calculation, and it should not be sold as one. Its purpose is to expose whether a surrogate shifts or smears a sharp branch transition enough to change an event measure.

## The global construction

For $\xi\sim U[-1,1]$, Legendre polynomials are a natural orthogonal basis. The global surrogate takes the form

$$
\widehat y_G(\xi)=\sum_{k=0}^{15}\alpha_kP_k(\xi).
$$

Sixteen Gauss-Legendre nodes provide the 16 forward evaluations and the quadrature projection for the degree-15 coefficients. The code checks that the Gauss weights sum to two, that the discrete Legendre inner products satisfy the expected orthogonality, and that the fitted polynomial reconstructs its collocation nodes. The largest node reconstruction error is $5.995\times10^{-15}$.

That is important: the global result does not fail because the linear algebra is visibly broken. It accurately interpolates or projects the values it was given at the collocation nodes. Its difficulty is representational. A continuous polynomial is being asked to approximate a discontinuous history-conditioned response across the whole interval.

The global approximation therefore oscillates near the jump. Its surrogate threshold occurs at $Da=0.05779260412$, about $4.63\times10^{-4}$ above the true right-continuous transition. That shift turns directly into event-probability error under a uniform input.

## The oracle fold-aligned construction

The local surrogate splits the physical input interval at the known analytic ignition fold:

$$
I_-=[Da_{\mathrm{ign}}-0.008,\;Da_{\mathrm{ign}}],
\qquad
I_+=[Da_{\mathrm{ign}},\;Da_{\mathrm{ign}}+0.008].
$$

On each element it fits a degree-7 Legendre expansion using eight Gauss-Legendre evaluations:

$$
\widehat y_{\mathrm{FA}}(Da)=
\begin{cases}
\sum_{k=0}^{7}\beta^-_kP_k(\eta_-(Da)), & Da<Da_{\mathrm{ign}},\\
\sum_{k=0}^{7}\beta^+_kP_k(\eta_+(Da)), & Da\ge Da_{\mathrm{ign}}.
\end{cases}
$$

Here $\eta_-$ and $\eta_+$ map their respective physical elements to $[-1,1]$. The response within either branch is smooth, so each polynomial only has to approximate one smooth piece. The element boundary carries the discontinuity instead of asking a global basis to synthesize it through oscillation.

The left and right collocation-node reconstruction errors are $1.055\times10^{-15}$ and $6.328\times10^{-15}$. The total count is $8+8=16$ response evaluations, matching the global fit.

However, the split is not discovered from those values. It is supplied by the analytic fold calculation. Calling this method “adaptive” would falsely attribute an unperformed detection step to the algorithm. Likewise, “same computational cost” would be too broad. Only the counted forward evaluations used to fit the surrogates are matched. The analytic-oracle setup cost is explicitly outside the budget.

<figure>
  <img src="/science/when-polynomial-chaos-crosses-a-fold/p04_02_global_vs_fold_aligned_response.svg" alt="Reference conversion curve across the ignition fold compared with a global degree-15 Legendre surrogate and an oracle fold-aligned two-element degree-7 plus degree-7 surrogate." loading="lazy" />
  <figcaption>Both fits use 16 forward evaluations. The global polynomial oscillates across the jump; the oracle-aligned elements remain branch-specific. Fold discovery cost is excluded.</figcaption>
</figure>

## Building an independent reference

The reference response does not come from either surrogate. For each audit input, the code solves the named branch by deterministic bisection on the exact scalar steady curve. Branch intervals are explicit: cold roots lie below the ignition temperature, middle roots between the fold temperatures, and hot roots above the extinction temperature. This prevents Newton iteration from converging to whichever nearby root happens to attract it.

The fine reference uses 32,768 midpoint cells; the coarse check uses 16,384. Moving from coarse to fine changes the global RMSE by $9.49\times10^{-9}$ and the global Wasserstein-1 error by $1.56\times10^{-9}$. The corresponding fold-aligned changes are $8.02\times10^{-8}$ and $2.65\times10^{-9}$. Every change is below the frozen $10^{-6}$ reference-convergence tolerance.

Across sampled outer branches, the largest real eigenvalue is $-0.0026092$, remaining negative. A representative middle-branch Jacobian determinant is $-0.6880$, consistent with a saddle. The maximum saved steady-state residual is $1.294\times10^{-11}$, below the $10^{-10}$ gate. These diagnostics do not validate reactor physics; they verify that the numerical reference implements the declared mathematical branches.

## What the matched-fit comparison found

The core metric table is:

| Metric | Global degree 15 | Fold-aligned degree 7+7 |
|---|---:|---:|
| Fit forward evaluations | 16 | 16 |
| RMSE | $0.0783280594$ | $0.000248551855$ |
| Wasserstein-1 error | $0.0439521168$ | $5.03489790\times10^{-5}$ |
| Saved absolute mean error | $0.000230612371$ | $8.60410194\times10^{-6}$ |
| Hot-state probability | $0.4710647474$ | $0.5$ |
| Absolute hot-probability error | $0.0289352526$ | $0$ |
| Branch classification error rate | $0.0289306641$ | $0$ |
| Invalid-support mass | $0.0531311035$ | $0$ |
| One-sided fold maximum error | $0.389895981$ | $0.00803041325$ |

The RMSE ratio is

$$
\frac{0.0783280594}{0.000248551855}=315.1376975,
$$

and the Wasserstein ratio is

$$
\frac{0.0439521168}{5.03489790\times10^{-5}}=872.9495157.
$$

These large factors are not mysterious. The experimental design gives the local method exactly the structural information that the global method lacks: the location of the jump. The fair conclusion is conditional—**given the analytic fold boundary, at the same fit-evaluation count, the fold-aligned representation is much more faithful on this case**. It would be unfair to convert that into “multi-element PCE is always 315 times better” or “the local method is 315 times cheaper.”

<figure>
  <img src="/science/when-polynomial-chaos-crosses-a-fold/p04_03_response_error_near_fold.svg" alt="Log-scale pointwise absolute errors for the global and fold-aligned response surrogates near standardized input zero, with the analytic ignition fold marked." loading="lazy" />
  <figcaption>The pointwise audit distinguishes grid-dependent maxima from stable one-sided fold-limit diagnostics and discloses the plotting floor used for zero errors.</figcaption>
</figure>

### Why RMSE is large while the saved absolute mean error looks smaller

A discontinuity concentrates very large pointwise errors in a narrow region. Squaring those errors makes RMSE sensitive to the oscillatory jump neighborhood. The JSON field named \`mean_absolute_error\` is implemented as the absolute difference between the predicted and reference sample means—not as the mean of pointwise absolute errors—so positive and negative oscillations can cancel before the absolute value is taken. The table therefore labels it “saved absolute mean error” and does not treat it as MAE.

The global absolute mean error of $2.306\times10^{-4}$ is not an argument that the event error is negligible. Its threshold shift produces a $0.02894$ absolute probability error, and $5.31\%$ of the surrogate distribution falls outside valid support. Wasserstein-1 asks whether the surrogate reproduces the response distribution; the hot probability tests a declared event; invalid-support mass checks whether the polynomial invents values outside the conversion range. This is exactly why a reliability benchmark needs several metrics rather than one average.

### Why the exact fold point needs special handling

The response is right-continuous and discontinuous at the fold. A dense grid usually samples close to, but not exactly at, the jump. Its maximum error therefore depends on the closest sample distance. Refining the grid can change that maximum without changing the underlying surrogate.

For this reason, the frozen decision rule does not use dense-grid maximum error as a pass/fail gate. The saved result reports it—$0.389750045$ globally and $0.00747760805$ locally—but treats the one-sided fold maximum as the more stable diagnostic. This is a small but important example of designing a metric around the mathematics rather than selecting whichever number looks most impressive.

### Event and support behavior

The analytic history-conditioned hot probability is $0.5$. The global polynomial crosses $y=0.8$ too late, giving $0.4710647474$. The fold-aligned representation uses the declared right element at the split and gives exactly $0.5$ under the implemented threshold calculation.

The global polynomial also overshoots the response support $[0,1]$. The measured input mass mapping to invalid values is $0.0531311035$. The fold-aligned surrogate has zero measured invalid-support mass on the audit grid. Again, that zero belongs to this one configuration; it is not a theorem that local polynomials preserve support.

<figure>
  <img src="/science/when-polynomial-chaos-crosses-a-fold/p04_04_matched_budget_reliability.svg" alt="Paired hatched bars comparing RMSE, Wasserstein-1 error, hot-state probability error, and invalid-support mass for global and fold-aligned surrogates with 16 fit evaluations each." loading="lazy" />
  <figcaption>The fold-aligned surrogate passes the frozen reliability gates. Zero values use a disclosed display floor; analytic fold-location cost is excluded, so this is not a total-cost comparison.</figcaption>
</figure>

## The frozen decision rule

The thresholds were written into the configuration before interpreting the final metrics:

- at least $10\times$ RMSE reduction;
- at least $5\times$ Wasserstein-1 reduction;
- fold-aligned hot-probability error no greater than $0.01$;
- zero fold-aligned invalid-support mass on the audit grid;
- all reference, residual, quadrature, reconstruction, fold, and stability checks true.

The observed factors $315.14$ and $872.95$ exceed the first two thresholds. The hot-probability error and invalid-support mass are both zero. All 16 named checks are true, so the machine-readable decision is **SUPPORTED** for “one frozen fold-centered CSTR smoke benchmark.”

The word “supported” is scoped by that final phrase. It is not a release gate for the wider research programme, and it does not unlock a final headline. It means that the predeclared Phase-1 smoke comparison behaved as required.

## Sixteen checks, not one favorable chart

The saved result records these 16 checks:

1. analytic and independently bisected folds agree;
2. both folds are simple;
3. fold derivative residuals satisfy tolerance;
4. the frozen initial state has a unique stable cold equilibrium;
5. sampled outer branches are stable;
6. the middle branch is a saddle;
7. steady-state residuals satisfy tolerance;
8. Gauss weights sum to two;
9. discrete Legendre orthogonality holds;
10. collocation nodes are reconstructed;
11. the reference grid is converged;
12. the forward-evaluation budgets match;
13. the RMSE improvement gate passes;
14. the Wasserstein improvement gate passes;
15. the fold-aligned hot-probability gate passes;
16. the fold-aligned valid-support gate passes.

Five focused pytest functions independently exercise the analytic folds, initial state, branch history and stability, matched collocation construction, and saved-result provenance. The repository check and result validator add policy and artifact checks. The automated test count is not the same as the 16 machine-readable scientific checks: several scientific assertions live within each focused test.

The numerical result carries signature

$$
\texttt{84359c190e22acad2352e1eb1b1cbd36d13895a91f009a6b94351ecc3f8a9043}.
$$

Two complete retained reruns have that signature. The plot script reproduced all 20 generated artifact hashes: four figures, each with SVG, PDF, 600-dpi PNG, manifest, and publish SVG. The publish SVG for every figure is hash-identical to its canonical SVG.

## Failures belong in the record

The first real attempt did not produce a scientific result. It directly invoked the Conda environment executable without activating the environment. NumPy failed during DLL startup inside a linear-algebra path, and Windows returned code $0xc06d007f$. The attempt record explicitly says that scientific evaluation had not begun.

Activating the intended environment fixed the startup path. The decision tolerances and scientific gates were not relaxed. The failed attempt remains the first line of the append-only attempt history, followed by passing canonical runs.

This distinction prevents two opposite mistakes. An environment failure should not be misdiagnosed as evidence against the mathematical method. But it also should not be erased merely because a later command works. Reproducibility includes the conditions required to start the computation.

The visual pipeline has its own failure history. Figure 1 was rejected because an in-axes legend obscured part of the cold-fold and protocol region; the legend was moved below the axes. Figure 3 was rejected because the fold line crossed a one-sided-limit annotation; the callout was shortened, backed in white, and moved to the right. Figure 4 was rejected twice: first because labels and footer crowded the plot, and again because the legend still crowded the invalid-mass label. The final revision reserves an empty log-scale decade and centers the legend.

All four final $4296\times2160$ PNGs were reviewed at original size for overlap, clipping, label clearance, and readability. Figure 2 passed on its first review; Figures 1 and 3 passed after one revision, and Figure 4 after two. The final visual-QA record is **PASS** and binds each reviewed image to its SHA-256 hash. “Rejected then revised” is stronger evidence than pretending the first layouts were publication-ready.

## Reproducing Phase 1

The verified environment used Python 3.12.13, NumPy 2.4.6, PyYAML 6.0.3, Pillow 12.3.0, Matplotlib 3.11.0, and pytest 9.1.1. Exact pins are in the technical repository. After activating that environment, run from the P04 project directory:

~~~powershell
python scripts/run_smoke.py
python scripts/plot_smoke.py
python -m pytest -q
python scripts/check_repo.py
python scripts/validate_smoke.py
~~~

The numerical script reads the frozen YAML configuration, writes a deterministic result JSON and a separate runtime record, and appends attempt history. The plot script reads the saved result rather than silently recomputing a different experiment. It regenerates all four accessible figure families and their manifests.

A successful reproduction should report **PASS**, all 16 checks true, and numerical signature 84359c…9043. Matching that signature verifies the frozen numerical material, not a particular wall-clock time. The recorded canonical runtime was about 22.50 seconds on one Windows 11 setup, but runtime is hardware- and environment-dependent and is not a scientific decision metric.

## What Phase 1 does not establish

The limitations are structural, not ceremonial.

First, fold knowledge is privileged information. The analytic split is supplied before the local fit, and its setup cost is excluded. An adaptive algorithm would have to infer where regularity is lost, decide whether to split, allocate samples, and possibly revise the partition. None of those operations was implemented.

Second, equal fit calls do not imply equal total cost. Algebraic fold derivation is inexpensive here because the canonical steady curve is explicit. In a large simulator, locating a bifurcation might be comparable to—or more expensive than—the surrogate fit. The correct accounting unit for that future experiment would include continuation, diagnostics, failed searches, and any pilot evaluations.

Third, the experiment freezes one polynomial order and one budget. Degree 15 versus degree 7+7 at 16 calls does not describe convergence across orders. It does not show where the global method becomes acceptable, whether another global basis performs better, or how a local method behaves with a misplaced split.

Fourth, the input law is symmetric and centered on the ignition fold. That makes the reference event probability exactly $0.5$. Off-center, skewed, correlated, or multi-parameter uncertainty could change both approximation and event behavior. No such sweep has been run.

Fifth, branch history is idealized. The response assumes a cold start and infinitely slow monotone increase, then imposes right continuity. A finite-rate system can exhibit delay and dependence on initial transients; a noisy system can switch before a deterministic fold. Those phenomena are absent.

Sixth, the model is dimensionless and synthetic. There is no data calibration, parameter-identification uncertainty, heat-transfer design, material constraint, controller, hazard analysis, or chemical safety case. “Hot” is merely the declared numerical condition $y\ge0.8$.

Seventh, the decision metrics are empirical on fixed audit constructions. Zero measured invalid-support mass is not an analytic positivity certificate. An exact event match at $0.5$ is not general probability accuracy. Large improvement factors on one discontinuity are not universal superiority.

Finally, the literature gate is a structured search result, not proof of exhaustive absence. It justifies the REFRAME verdict and the cautious local claim. It cannot certify novelty by itself.

## The locked next stages

The research contract leaves several natural questions deliberately locked:

- repeat the comparison across wider uncertainty widths, offsets from the fold, and polynomial budgets;
- perturb the supplied split to measure sensitivity to localization error;
- implement a genuinely adaptive or automatic element-discovery rule;
- charge pilot, fold-location, continuation, and failed-attempt costs;
- introduce multiple uncertain parameters and nonuniform input laws;
- compare finite-rate dynamics with the quasi-static history operator;
- calibrate a physical model only if traceable experimental evidence becomes available;
- perform a final evaluation only after its protocol is frozen;
- consider any public headline, paper claim, or venue submission only after those gates.

Listing these steps does not claim they have begun. They remain future work. In particular, there is no automatic split, no total-cost result, no calibrated physical reactor, no safety conclusion, and no final sweep hidden behind the Phase-1 figures.

## What survived the stress test

Several conclusions do survive careful qualification.

The canonical model has two independently cross-checked simple folds. The frozen initial point lies in a unique stable cold regime. The branch-explicit reference implements the declared right-continuous history and satisfies residual, stability, and grid-convergence checks.

At a matched fit budget of 16 forward evaluations, a degree-15 global Legendre polynomial has difficulty representing the discontinuous response. It shows large RMSE and distributional error, moves the hot threshold, misclassifies part of the input domain, and assigns nonzero probability mass outside the valid response range.

When the exact ignition fold is provided as an oracle element boundary, two degree-7 expansions represent the smooth one-sided branches accurately. On this frozen case they reduce RMSE and Wasserstein-1 error by factors of about $315$ and $873$, match the analytic history-conditioned hot probability, and show zero measured invalid-support mass.

The strongest lesson is not that local polynomial chaos “wins.” It is that a budget comparison must say what structural information each method receives and what costs are counted. Here, knowing where the response jumps is enormously valuable. Phase 1 measures that value under an intentionally favorable oracle construction. The next scientific question is how much of that value survives when the fold must be found, its cost is charged, and its location is imperfect.

Until those stages are run, the honest headline remains conditional: **when polynomial chaos crosses this fold, a global polynomial is unreliable; an oracle fold-aligned representation repairs the frozen fit, but the oracle is part of the answer.**

## Primary literature used by the gate

1. Isabella Carla Gonnella, Moaad Khamlich, Federico Pichi, and Gianluigi Rozza, “A Stochastic Perturbation Approach to Nonlinear Bifurcating Problems,” *Journal of Scientific Computing* (2026), [DOI 10.1007/s10915-026-03338-0](https://doi.org/10.1007/s10915-026-03338-0).
2. Giacomo Venier, Isabella Carla Gonnella, Federico Pichi, and Gianluigi Rozza, “Stochastic bifurcation analysis via polynomial chaos: consistency and convergence of branch-approximating solutions” (2026), [arXiv DOI 10.48550/arXiv.2605.31288](https://doi.org/10.48550/arXiv.2605.31288).
3. Juliette Dréau, Benoit Magnain, and Alain Batailly, “Multi-element polynomial chaos expansion based on automatic discontinuity detection for nonlinear systems,” *Journal of Sound and Vibration* 567 (2023), [DOI 10.1016/j.jsv.2023.117920](https://doi.org/10.1016/j.jsv.2023.117920).
4. Christian Kuehn, Chiara Piazzola, and Elisabeth Ullmann, “Uncertainty quantification analysis of bifurcations of the Allen–Cahn equation with random coefficients,” *Physica D* 470 (2024), [DOI 10.1016/j.physd.2024.134390](https://doi.org/10.1016/j.physd.2024.134390).
5. Daniele Venturi, Xiaoliang Wan, and George Em Karniadakis, “Stochastic bifurcation analysis of Rayleigh–Bénard convection,” *Journal of Fluid Mechanics* 650 (2010), [DOI 10.1017/S0022112009993685](https://doi.org/10.1017/S0022112009993685).
6. Xiaoliang Wan and George Em Karniadakis, “An adaptive multi-element generalized polynomial chaos method for stochastic differential equations,” *Journal of Computational Physics* 209 (2005), [DOI 10.1016/j.jcp.2005.03.023](https://doi.org/10.1016/j.jcp.2005.03.023).
7. Christian Kuehn and Kerstin Lux, “Uncertainty Quantification of Bifurcations in Random Ordinary Differential Equations,” *SIAM Journal on Applied Dynamical Systems* 20 (2021), [DOI 10.1137/21M1392073](https://doi.org/10.1137/21M1392073).
8. Florian Bourgey, Emmanuel Gobet, and Clément Rey, “A Comparative Study of Polynomial-Type Chaos Expansions for Indicator Functions,” *SIAM/ASA Journal on Uncertainty Quantification* 10 (2022), [DOI 10.1137/21M1413146](https://doi.org/10.1137/21M1413146).
9. Yuncheng Du, Hector Budman, and Thomas Duever, “Robust Self-Tuning Control Design under Probabilistic Uncertainty using Polynomial Chaos Expansion-based Markov Models,” *IFAC-PapersOnLine* 51 (2018), [DOI 10.1016/j.ifacol.2018.09.273](https://doi.org/10.1016/j.ifacol.2018.09.273).
10. M. Ratto and O. Paladino, “Analysis of controlled CSTR models with fluctuating parameters and uncertain parameters,” *Chemical Engineering Journal* 79 (2000), [DOI 10.1016/S1385-8947(00)00139-X](https://doi.org/10.1016/S1385-8947(00)00139-X).
