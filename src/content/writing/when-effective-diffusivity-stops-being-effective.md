---
title: "When Effective Diffusivity Stops Being Effective"
slug: when-effective-diffusivity-stops-being-effective
summary: A verified 24-case synthetic slab benchmark maps where a harmonic effective diffusivity preserves release curves and where finite-cell transients make it miss t50 and t90.
date: 2026-08-29
lastUpdated: 2026-08-29
featured: false
topics: [Homogenization, Diffusion, Drug release, Multiscale modeling, Reproducibility]
heroImage: /science/when-effective-diffusivity-stops-being-effective/p02_03_harmonic_reliability_map.svg
type: Research Notes
archived: false
scienceProject: when-effective-diffusivity-stops-being-effective
redirectFrom: []
---

An effective diffusivity compresses fine spatial structure into one coefficient. In the right limit, that compression is extraordinarily useful: instead of resolving every alternating material layer, one solves a homogeneous diffusion equation with a coefficient derived from the unit cell. But a correct asymptotic coefficient does not promise that every finite specimen, every transient release curve, or every event time will already behave as if the microstructure were infinitely fine.

This study asks a deliberately narrow question. In one synthetic, nondimensional, one-dimensional binary laminate with perfect sinks at both ends, when does the analytic harmonic coefficient preserve the resolved release trajectory and the synthetic event times $t_{50}$ and $t_{90}$? The benchmark freezes four diffusivity contrasts, six periodic-cell counts, one symmetric slow–fast–slow cell, one boundary phase, and one reporting horizon before looking at the answers.

The resulting 24-case grid contains six homogeneous controls and 18 heterogeneous cases. Among those 18, the harmonic model is **adequate in seven**, **grey in two**, and in **breakdown in nine** under thresholds fixed in advance. At every non-control contrast, $N=1,2,4$ are breakdown cases. At $N=8$, contrast $\kappa=10$ is adequate while $\kappa=100$ and $1000$ are grey. All three contrasts are adequate at $N=16$ and $32$.

The early-window comparator supplies a second warning. A scalar diffusivity fitted only where the resolved release fraction satisfies $0.1\le F\le0.5$ meets the early error gate yet misses held-out $t_{90}$ by more than $5\%$ in exactly three declared witnesses: $(\kappa,N)=(10,1),(100,1),(1000,1)$. Their early maximum errors are $0.752\%$, $0.845\%$, and $0.856\%$, while their held-out $t_{90}$ errors are $11.11\%$, $12.09\%$, and $12.17\%$.

These findings are numerical evidence for one frozen family. They are not a theorem about homogenization, not a general connectivity map, not a calibrated pharmaceutical model, and not a claim about swelling, erosion, degradation, binding, dissolution, reaction, moving interfaces, non-Fickian transport, clinical response, dose, efficacy, or safety. The literature gate returned **REFRAME** because periodic homogenization, microstructure-resolved release, connectivity effects, apparent diffusivity, and finite-transient deviations are all established. The local contribution is an auditable replication-extension benchmark, not a new effective-diffusivity formula.

## The claim ledger in one page

| Item | Frozen Phase-1 evidence | What it supports |
|---|---:|---|
| Literature gate | **REFRAME** | A controlled validity chart is defensible; generic novelty is not. |
| Geometry | One 1-D periodic slow–fast–slow laminate | A single connected transverse barrier family, not general morphology. |
| Boundaries | Perfect sinks at both ends | One fixed boundary condition and boundary phase. |
| Grid | $\kappa\in\{1,10,100,1000\}$, $N\in\{1,2,4,8,16,32\}$ | Exactly 24 preregistered cases; six at $\kappa=1$ are controls. |
| Harmonic result | 7 adequate, 2 grey, 9 breakdown among 18 heterogeneous cases | An empirical finite-scale boundary on this grid. |
| Early-fit result | Three $N=1$ witnesses | Early calibration can pass while held-out $t_{90}$ fails in these cases. |
| Verification | Nine scientific checks true; 24 refinement checks pass | Discrepancies exceed the recorded numerical uncertainty. |
| Reproduction | Two latest PASS runs share signature 97e221…41e2e | Deterministic regeneration of the frozen numerical material. |
| Locked scope | Other phases, morphologies, mechanisms, data, final evaluation | No claim about them appears here. |

The distinction between “finite-scale boundary” and “homogenization fails” matters. The harmonic coefficient is the correct periodic coefficient for the declared 1-D cell problem. The benchmark asks whether a *finite transient response* is already close enough for specific trajectory and event tolerances. A breakdown label means that one comparator crossed one frozen numerical gate. It does not invalidate homogenization theory.

## Why the literature audit changed the project

Heterogeneous polymer release and effective transport are not new combinations. Chandrasekaran and Hillman modeled release from a heterogeneous polymeric matrix in 1980 ([DOI](https://doi.org/10.1002/jps.2600691119)). Auriault and Lewandowska connected periodic homogenization, an effective diffusion coefficient, and experiment while emphasizing the conditions under which a medium can be homogenized ([DOI](https://doi.org/10.1023/A:1006599410942)). Rim, Pinsky, and van Osdol used three-dimensional homogenization to calculate effective diffusivity in the stratum corneum ([DOI](https://doi.org/10.1016/j.memsci.2007.02.018)).

Resolved pharmaceutical microstructure is also mature prior art. Saylor and colleagues coupled evolving drug–polymer microstructure to release kinetics and examined connectivity changes ([DOI](https://doi.org/10.1002/jps.21416)). Laaksonen and colleagues constructed an explicit two-dimensional cellular-automata model for binary matrix and reservoir devices ([DOI](https://doi.org/10.1016/j.biomaterials.2008.12.028)). Kimber, Kazarian, and Štěpánek combined microstructure-based tablet dissolution modeling with spectroscopic imaging and UV measurements ([DOI](https://doi.org/10.1016/j.compchemeng.2010.07.008)). Barman and Bolin fitted stochastic three-dimensional models to imaged porous polymer films and evaluated diffusion observables ([DOI](https://doi.org/10.1111/jmi.12623)).

Several papers constrain the interpretation of a scalar coefficient even more directly. Brandl and colleagues compared independently measured hydrogel diffusivities with release kinetics and found agreement in selected systems, so a benchmark must permit an adequate outcome rather than manufacture failure ([DOI](https://doi.org/10.1016/j.jconrel.2009.10.030)). Tabor and colleagues showed that transient effective diffusivity in finite inclusion-modified polymer systems can differ from stationary or infinite-medium predictions ([DOI](https://doi.org/10.1063/1.4818579)). Grund, Körber, and Bodmeier related apparent diffusivity and matrix-tablet release to porosity and a polymer percolation threshold ([DOI](https://doi.org/10.1016/j.ejpb.2013.08.007)). Donovan and colleagues used periodic homogenization for obstructed solute diffusion and checked it against Monte Carlo and experimental macromolecular-solution data ([DOI](https://doi.org/10.1371/journal.pone.0146093)).

The constitutive limitations are equally established. Salehi and colleagues derived a multicomponent stress–diffusion model for hydrophilic matrix release, showing why a static scalar Fickian coefficient cannot simply be transferred to swelling and composition-dependent transport ([DOI](https://doi.org/10.1016/j.jconrel.2015.12.045)). Wang and Tsai compared one- and two-diffusion-coefficient models for heterogeneous PVA hydrogels and polymer–drug conjugates ([DOI](https://doi.org/10.1016/j.jtice.2022.104395)). Giolando and colleagues built an open mechanistic model incorporating nonuniform drug distribution, porosity, degradation, and geometry and compared it experimentally ([DOI](https://doi.org/10.1002/adma.202301698)). Graham and Klinge computed homogenized diffusion in strongly heterogeneous, enzymatically calcified hydrogels with finite elements ([DOI](https://doi.org/10.1016/j.jmbbm.2023.106244)).

Together, these 15 primary works block a broad headline. Periodic diffusion homogenization is established. Effective-diffusivity release is established. Connectivity, percolation, image-derived microstructure, transient deviations, multicomponent transport, and experimental validation are established. A one-dimensional synthetic chart cannot be advertised as a general drug–polymer discovery.

The literature audit did not find, in its bounded search, the exact combination of the frozen symmetric 1-D cell, finite period count, contrast grid, and joint $F$, $t_{50}$, $t_{90}$ classification protocol. That negative search is not proof of absence. It merely leaves room for a transparent benchmark that can be independently reproduced and later extended.

## The frozen diffusion problem

The slab occupies

$$
x\in[0,1].
$$

Its concentration $c(x,t)$ obeys a diffusion-only conservation law,

$$
\frac{\partial c}{\partial t}
=\frac{\partial}{\partial x}
\left(D(x)\frac{\partial c}{\partial x}\right).
$$

The initial concentration is uniform,

$$
c(x,0)=1,
$$

and both surfaces are perfect sinks for $t>0$,

$$
c(0,t)=c(1,t)=0.
$$

There is no source, reaction, binding, dissolution front, degradation, erosion, swelling, advection, stress coupling, or moving boundary. “Drug release” is the motivating language for the conserved scalar leaving this idealized slab; it is not a formulation-specific simulation.

The cumulative release fraction is

$$
F(t)=1-\int_0^1 c(x,t)\,dx.
$$

The synthetic event times are first crossings:

$$
t_{50}=\inf\{t:F(t)\ge0.5\},
\qquad
t_{90}=\inf\{t:F(t)\ge0.9\}.
$$

In the computation, crossings are linearly interpolated between adjacent output times. They summarize the shape of a release curve. They are not clinical endpoints and carry no pharmacokinetic or dose-response interpretation.

## One symmetric cell and one boundary phase

The microstructure has $N$ identical periods. In each period, the first quarter is slow, the middle half is fast, and the final quarter is slow. Thus each phase occupies one half of the slab:

$$
\phi_{\mathrm{slow}}=\phi_{\mathrm{fast}}=\frac12.
$$

The fast diffusivity is fixed at

$$
D_{\mathrm{fast}}=1,
$$

while the slow diffusivity is

$$
D_{\mathrm{slow}}=\frac{1}{\kappa},
\qquad
\kappa\in\{1,10,100,1000\}.
$$

Because the unit cell is slow–fast–slow and repeats exactly, both perfect-sink boundaries meet the slow phase. That phase placement was frozen before evaluation. A different shift of the same periodic pattern could change finite-$N$ transients near the surfaces. Phase 1 does not average over shifts or perform a boundary-phase ablation.

In a one-dimensional slab, each slow layer spans the transverse cross-section. There are no paths around it. The study therefore represents connected transverse barriers, not tortuous two-dimensional routes, disconnected inclusions, random pores, or percolating three-dimensional networks.

<figure>
  <img src="/science/when-effective-diffusivity-stops-being-effective/p02_01_frozen_microstructure.svg" alt="Four repeated slow-fast-slow binary cells between perfect sinks, followed by harmonic and arithmetic coefficient ratios over contrasts one to one thousand." loading="lazy" />
  <figcaption>The frozen one-dimensional cell and its preregistered scalar comparators. Interfaces coincide with finite-volume faces; the boundary phase and perfect sinks are not varied.</figcaption>
</figure>

## Why the harmonic coefficient is the benchmark

For steady one-dimensional diffusion through layers in series, flux $J$ is constant across a cell. A local gradient therefore satisfies

$$
\frac{dc}{dx}=-\frac{J}{D(x)}.
$$

Integrating over one cell shows that total resistance is the average of $1/D$, so the periodic effective coefficient is

$$
D_h
=\left(\int_{\text{cell}}\frac{dx}{D(x)}\right)^{-1}.
$$

With equal slow and fast fractions,

$$
D_h
=\left(\frac{1/2}{D_{\mathrm{slow}}}
+\frac{1/2}{D_{\mathrm{fast}}}\right)^{-1}
=\frac{2}{\kappa+1}.
$$

This is not fitted to the release curves. It follows analytically from the frozen cell problem.

The naive arithmetic comparator is

$$
D_a
=\frac12D_{\mathrm{slow}}+\frac12D_{\mathrm{fast}}
=\frac12\left(1+\frac1\kappa\right).
$$

Its ratio to the harmonic value is

$$
\frac{D_a}{D_h}
=\frac{(\kappa+1)^2}{4\kappa}.
$$

That ratio is $3.025$ at $\kappa=10$, $25.5025$ at $\kappa=100$, and $250.50025$ at $\kappa=1000$. In a series-layer geometry, the arithmetic mixture increasingly ignores the bottleneck imposed by the slow layers. It is included as a deliberately naive baseline, not as a serious homogenization formula for this orientation.

## One locked nondimensional clock

All curves are reported against

$$
\tau=D_h t.
$$

The output grid is fixed at $\Delta\tau=0.001$ through $\tau=0.6$. The horizon is not extended case by case after seeing whether an event is reached. All 24 resolved references reach both events before the locked horizon, so none is right-censored.

For a homogeneous slab with coefficient $D$, define $r=D/D_h$. The exact perfect-sink release series is

$$
F_{\mathrm{hom}}(\tau;r)
=1-\frac{8}{\pi^2}\sum_{m=0}^{\infty}
\frac{\exp\!\left[-(2m+1)^2\pi^2r\tau\right]}{(2m+1)^2}.
$$

The implementation uses 512 terms. For the harmonic comparator, $r=1$. Therefore its curve in normalized time is the same for all contrasts; the resolved finite-cell curves are what change with $N$ and $\kappa$. For the arithmetic comparator, $r=D_a/D_h$. For the calibrated scalar, $r=D_{\mathrm{fit}}/D_h$.

## The resolved microscale reference

The reference uses a conservative cell-centered finite-volume discretization. Every phase interface lies exactly on a control-volume face. The coefficient at an interior face is the harmonic face value

$$
D_{i+1/2}
=\frac{2D_iD_{i+1}}{D_i+D_{i+1}},
$$

which is the correct series resistance for two half-cells. The canonical grid uses 256 cells and the refined grid 512. Because both counts are divisible by $4N$ for every declared $N$, the slow-quarter, fast-half, slow-quarter geometry is never blurred through a cell average.

Time evolution uses fixed-step backward Euler. The canonical run has 128 internal substeps per output interval; the refined run has 256. The symmetric implicit matrix is diagonalized once, then its eigenvalues are powered to reproduce repeated backward-Euler updates without configuration-specific step tuning.

The solver records concentration bounds, monotonicity of $F$, a backward-Euler recurrence residual, matrix symmetry and positive off-diagonal face coefficients, and a spatial conservation audit. The conservation check assembles face fluxes in extended precision and verifies that cell divergences telescope to the two perfect-sink outflows.

## Verification before classification

No adequate, grey, or breakdown label is accepted unless the numerical checks pass.

First, a homogeneous negative control compares a 1024-cell finite-volume solution with the independent analytic slab series. Its maximum absolute release error is

$$
2.1678142\times10^{-5},
$$

well below the frozen $2\times10^{-4}$ gate.

Second, every one of the 24 cases receives a joint space–time refinement. Across all cases, the largest canonical-to-refined release change is

$$
1.0718674\times10^{-4},
$$

against a $2\times10^{-3}$ limit. The largest relative $t_{50}$ change is $6.1278\times10^{-5}$ and the largest relative $t_{90}$ change is $3.3340\times10^{-5}$, both far below the $0.005$ event-refinement limit.

Third, the recorded concentrations remain within the $10^{-10}$ floating-point tolerance around $[0,1]$. The largest saved concentration is $1.0000000000320508$ and the smallest is positive. Release increments remain positive; the smallest audited increment is $2.1552\times10^{-5}$. Maximum operator asymmetry is zero, the smallest off-diagonal coefficient is positive, the maximum mass-balance residual is $2.274\times10^{-13}$, and the largest audited backward-Euler recurrence residual is $4.091\times10^{-12}$.

The nine top-level scientific checks are all true:

1. homogeneous finite volume matches the analytic series;
2. all cases pass joint space–time refinement;
3. all concentrations stay within tolerance;
4. all release curves are monotone;
5. all mass audits pass;
6. all backward-Euler recurrence audits pass;
7. all operators are symmetric with positive face couplings;
8. all material interfaces are exact;
9. all reference $t_{50}$ and $t_{90}$ events occur before the locked horizon.

<figure>
  <img src="/science/when-effective-diffusivity-stops-being-effective/p02_05_numerical_verification.svg" alt="Two-panel numerical audit showing homogeneous finite-volume error below the analytic-series gate and small canonical-to-refined release changes for every contrast and period count." loading="lazy" />
  <figcaption>The independent homogeneous control and joint space-time refinement separate finite-scale model discrepancy from a trivial under-resolution artifact.</figcaption>
</figure>

## Classification gates were fixed before results

For every heterogeneous case, the harmonic model is **adequate** only if

$$
\max_\tau|F_h-F_{\mathrm{FV}}|\le0.02
$$

and both

$$
\frac{|t_{50,h}-t_{50,\mathrm{FV}}|}{t_{50,\mathrm{FV}}}\le0.02,
\qquad
\frac{|t_{90,h}-t_{90,\mathrm{FV}}|}{t_{90,\mathrm{FV}}}\le0.02.
$$

It is in **breakdown** if maximum release error is at least $0.05$ or either relative event error is at least $0.05$. Any verified case between those rules is **grey**. The inequalities are inclusive.

This joint rule prevents a misleading classification based only on a trajectory norm. For example, at $N=4$, the maximum harmonic release errors are about $3.7\%$ to $4.2\%$, below the $5\%$ trajectory breakdown threshold. Yet relative $t_{50}$ errors range from $5.96\%$ to about $7\%$, so all three $N=4$ heterogeneous cases are still breakdown cases.

The gate also permits a null outcome. If every verified case had been adequate, or none had been, the protocol would have reported that result rather than changing the grid or thresholds.

## The 18-case harmonic reliability map

The exact classification is:

| Contrast | $N=1$ | $N=2$ | $N=4$ | $N=8$ | $N=16$ | $N=32$ |
|---:|---|---|---|---|---|---|
| $\kappa=10$ | breakdown | breakdown | breakdown | adequate | adequate | adequate |
| $\kappa=100$ | breakdown | breakdown | breakdown | grey | adequate | adequate |
| $\kappa=1000$ | breakdown | breakdown | breakdown | grey | adequate | adequate |

At $\kappa=10$, maximum harmonic release error falls from $14.90\%$ at $N=1$ to $7.39\%$, $3.70\%$, $1.85\%$, $0.803\%$, and $0.184\%$ as $N$ doubles. At $\kappa=100$, the corresponding $N=1$, $8$, and $16$ values are $17.11\%$, $2.098\%$, and $0.923\%$. At $\kappa=1000$, they are $17.35\%$, $2.123\%$, and $0.935\%$.

The $N=8$ contrast dependence is exactly where the grey category earns its place. For $\kappa=10$, maximum error $1.8535\%$, $t_{50}$ error $1.4473\%$, and $t_{90}$ error $0.4988\%$ all satisfy the adequate rule. At $\kappa=100$, maximum error is $2.0983\%$: just above the adequate trajectory threshold but far below breakdown, while the event errors are $1.6828\%$ and $0.6224\%$. At $\kappa=1000$, maximum error is $2.1229\%$ and event errors are $1.7079\%$ and $0.6365\%$. Both are therefore grey, not breakdown.

At $N=16$, all three contrasts are adequate. Even the $\kappa=1000$ case has maximum release error $0.9349\%$, relative $t_{50}$ error $0.4344\%$, and relative $t_{90}$ error $0.1625\%$. At $N=32$, all three remain adequate, with maximum errors near $0.2\%$.

This grid empirically supports the first hypothesis: at each frozen contrast, harmonic accuracy improves as more periods fit into the same slab. It does not prove a convergence rate or give an error bound beyond the sampled $N$ values.

<figure>
  <img src="/science/when-effective-diffusivity-stops-being-effective/p02_03_harmonic_reliability_map.svg" alt="Reliability map for eighteen heterogeneous cases, showing breakdown at one, two, and four periods; grey at eight periods for contrasts one hundred and one thousand; and adequate cases at finer scale separation." loading="lazy" />
  <figcaption>Seven adequate, two grey, and nine breakdown outcomes under joint trajectory, t50, and t90 gates. The map covers one symmetric boundary phase and one periodic binary family only.</figcaption>
</figure>

## Reading two representative release curves

At $\kappa=1000$ and $N=1$, the resolved reference reaches normalized $\tau_{50}=0.0911202$ and $\tau_{90}=0.3626978$. The harmonic homogeneous curve reaches the same thresholds at $0.0491835$ and $0.2120215$, producing relative errors of $46.02\%$ and $41.54\%$. Its maximum release-fraction error is $17.35\%$. This is a clear breakdown case.

At the same contrast but $N=32$, the fine-period resolved curve nearly overlays the harmonic curve and the case is adequate. The coefficient has not changed: $D_h=2/1001$. What changes is scale separation. Thirty-two repeated cells distribute the same slow and fast fractions much more finely across the slab, so the finite transient resembles the homogenized limit.

The arithmetic curve behaves very differently because $D_a/D_h=250.50025$ at this contrast. In normalized time it releases almost immediately and is in breakdown across the non-control grid. That result confirms the expected importance of series resistance in this geometry; it is not evidence that arithmetic averaging is always wrong in every orientation or morphology.

<figure>
  <img src="/science/when-effective-diffusivity-stops-being-effective/p02_02_release_trajectories.svg" alt="Resolved, harmonic, arithmetic, and early-fitted release curves at contrast one thousand for one period and thirty-two periods, illustrating breakdown and adequate harmonic regimes." loading="lazy" />
  <figcaption>At fixed harmonic coefficient, changing only finite cell count changes the transient agreement. The comparison uses one locked normalized-time grid and event interpolation rule.</figcaption>
</figure>

## The early-window fit and its held-out test

The calibrated comparator chooses a scalar $D_{\mathrm{fit}}$ within

$$
[D_{\mathrm{slow}},D_{\mathrm{fast}}]
$$

by minimizing mean squared release error only at resolved samples satisfying

$$
0.1\le F_{\mathrm{FV}}\le0.5.
$$

The search is performed in log diffusivity with 96 fixed golden-section iterations. Samples with $F>0.5$ and the entire $t_{90}$ event are held out from fitting and tuning. A unit test modifies the held-out curve while keeping the early window fixed and verifies that the fitted coefficient does not change.

The early-fit/late-failure gate requires an early-window maximum error no greater than $0.02$ and a held-out $t_{90}$ relative error at least $0.05$. Exactly three cases pass both sides:

| Witness | $D_{\mathrm{fit}}/D_h$ | Early max error | Held-out max error | Held-out $t_{90}$ error |
|---|---:|---:|---:|---:|
| $\kappa=10,\;N=1$ | $0.5690$ | $0.7522\%$ | $2.6573\%$ | $11.1090\%$ |
| $\kappa=100,\;N=1$ | $0.5254$ | $0.8447\%$ | $2.8870\%$ | $12.0918\%$ |
| $\kappa=1000,\;N=1$ | $0.5212$ | $0.8564\%$ | $2.9041\%$ | $12.1668\%$ |

These witnesses show a specific form of non-identifiability: a homogeneous scalar can be tuned to look good during early release yet use a coefficient roughly half the harmonic value and still miss a late event. They do not prove that early fitting always fails. Several other cases miss the early error gate, while finer cases fit early and remain acceptably close late.

The fitting cost and resolved calibration data are not free. $D_{\mathrm{fit}}$ is an empirical comparator, not an a-priori homogenized coefficient and not a deployable parameter-estimation result.

<figure>
  <img src="/science/when-effective-diffusivity-stops-being-effective/p02_04_early_fit_holdout.svg" alt="Scatter plot of early-window maximum error against held-out t90 error for eighteen heterogeneous cases, with gate lines and the three one-period witnesses labeled." loading="lazy" />
  <figcaption>The three filled N equals one points pass the early-window gate yet exceed the held-out late-event gate. Calibration indices stop at resolved release fraction 0.5.</figcaption>
</figure>

## What the result says—and what it does not

The strongest supported statement is conditional:

> For this fixed diffusion-only periodic slab, harmonic-model agreement improves empirically with cell count, and the frozen 24-case grid contains both adequate and breakdown regimes after independent numerical verification.

The map also shows that contrast matters near the boundary. Eight cells are enough for the $\kappa=10$ case to meet all adequate gates, but the two higher contrasts remain just outside the maximum-trajectory threshold and are grey. Sixteen cells are adequate for all tested contrasts.

The result does not identify a universal number of cells. Change the boundary phase, volume fraction, layer ordering, event thresholds, sink condition, reporting norm, time horizon, or dimensionality and the map may move. The study has not performed those ablations.

The early-fit result is similarly narrow. It establishes three frozen witnesses in which a curve-calibrated scalar passes the declared early window and fails held-out $t_{90}$. It does not prove that all fitted diffusivities are untrustworthy or that $t_{90}$ is clinically meaningful.

## Failures preserved before the PASS

The environment history contains four failed starts. A system Python lacked NumPy. A bundled runtime lacked SciPy, which prompted a NumPy-only implementation rather than an undeclared installation. A research virtual environment failed while importing NumPy’s compiled extension. A Conda environment printed six passing test dots and then crashed in a NumPy eigensolver with Windows code $0xc06d007f$. These are classified as environment failures, not scientific evidence.

The first two canonical scientific attempts also returned **FAIL** because the original mass audit did not pass. Their provisional adequate/grey/breakdown lists and early-fit witnesses were recorded but explicitly marked **BLOCKED**. The final solver audits spatial conservation by assembling interface and boundary fluxes in extended precision and checking telescoping independently of reconstructed time-layer subtraction. The model, 24-case grid, thresholds, and fit window were not relaxed to obtain a pass.

After that correction, two latest canonical attempts returned **PASS** with identical numerical signature

$$
\texttt{97e2212131f533a38d79897966c3cfdd028b16f8868e922c73eb6ab853141e2e}.
$$

Their measured runtimes were approximately $4.11$ and $3.80$ seconds on the recorded Windows/Python setup. Runtime is excluded from the deterministic signature and is not used to rank methods.

Nine mathematical unit tests pass. They cover effective coefficients, exact-interface volume fraction, harmonic face flux, the analytic slab series, event interpolation and censoring, operator structure, spectral backward Euler against a direct solve, held-out-fit leakage, and inclusive classification thresholds. Repository and two-run reproducibility checks also pass.

## Figure integrity and visual review

The five publication figures are generated from the saved result JSON, frozen configuration, and reproducibility record. Each has native SVG, vector PDF, 600-dpi PNG, a manifest, and a publish SVG. The current publish SVGs are hash-identical to their canonical SVG counterparts. Text remains live in SVG, black text is explicit, and color is backed by line styles, markers, fill codes, or labels.

At original $4296\times2160$ size, the final PNGs were inspected for title and panel separation, legend clearance, annotation collisions, axis-label clipping, footer placement, and edge clipping. The microstructure labels and comparator legend remain clear; the two trajectory panels and shared legend do not collide; every reliability-map cell is readable; the three early-fit witness labels remain separated; and the two verification panels, gates, legend, and footer are contained within the canvas. Only final publication assets are embedded here.

This visual check establishes layout integrity, not scientific validity. Numerical claims still come from the machine-readable result, not pixel measurement.

## Reproducing the benchmark

The private technical repository contains the frozen configuration, source, unit tests, results, attempt history, figure generator, and hashes. Its P02 directory retains the machine-readable Phase-1 result, research contract, literature gate, and claim ledger. The public Blog deliberately exposes only the reviewed interpretation and admitted figure assets, while the technical record remains the reproducibility source of truth.

Using the verified Python environment from the P02 directory, the core commands are:

~~~powershell
python scripts/run_phase1.py --config configs/phase1.json
python -m unittest discover -s tests -v
python scripts/check_repo.py
python scripts/check_reproducibility.py --config configs/phase1.json
python scripts/plot_phase1.py
~~~

A successful reproduction should return the nine tests as OK, repository and reproducibility checks as PASS, identical signatures for the two latest successful runs, and the frozen scientific signature 97e221…41e2e. Exact runtime need not match.

## Limitations that cannot be averaged away

**One dimension.** Slow layers span the cross-section. There is no path connectivity choice, tortuosity distribution, random pore network, or percolation topology. A 2-D or 3-D material can behave differently even at the same phase fractions.

**One phase arrangement.** Every cell is slow-quarter, fast-half, slow-quarter, and both sinks meet slow material. Boundary-phase effects are a known finite-cell risk but are intentionally not explored.

**One constitutive mechanism.** $D(x)$ is static and concentration-independent. The model excludes swelling, erosion, degradation, dissolution, binding, reaction, stress coupling, moving fronts, and non-Fickian memory.

**Perfect sinks.** Both boundary concentrations drop to zero immediately. Finite external mass transfer, asymmetric reservoirs, surface resistance, and changing sink conditions are absent.

**Synthetic time and events.** $\tau$, $t_{50}$, and $t_{90}$ are nondimensional release-curve quantities. There is no mapping to exposure, efficacy, toxicity, dose, treatment schedule, or patient outcome.

**Finite parameter grid.** Four contrasts and six cell counts do not provide a theorem, convergence rate, or universal validity boundary. The classifications depend on the fixed $2\%$ and $5\%$ gates.

**Comparator asymmetry.** $D_h$ is analytic, $D_a$ is naive, and $D_{\mathrm{fit}}$ consumes resolved calibration data and optimization. They answer different questions and do not have matched setup costs.

**No final evaluation.** Wider geometries, boundary shifts, random or imaged structures, external calibration, and final evaluation remain locked. Phase 1 is a reproducible benchmark, not a formulation recommendation.

## Locked next stages

A stronger research programme could preregister, then separately unlock:

- boundary-phase shifts for the same one-dimensional cell;
- unequal phase fractions and alternative layer orderings;
- an empirical or theoretical finite-$N$ error scaling study;
- two-dimensional connected versus disconnected microstructures;
- random or image-derived morphology with traceable data;
- finite mass-transfer boundary conditions;
- concentration-dependent or multicomponent constitutive models;
- swelling, degradation, erosion, binding, reaction, or moving boundaries;
- physical calibration and external experimental validation;
- a final held-out evaluation and any venue-specific claim.

Nothing in this article claims that those stages have been run. Their results cannot be inferred from the 24-case chart.

## The useful lesson

An effective coefficient answers a scale-limit question. A finite release experiment asks a transient, boundary-conditioned question. When those scales are well separated in this frozen slab, the two answers agree within the declared gates. When only one, two, or four coarse cells span the slab, they do not.

The study therefore does not conclude that effective diffusivity is ineffective. It identifies where the harmonic coefficient is already effective enough for one release trajectory and two event tolerances—and where it is not—while keeping numerical error below the observed discrepancy.

The early-fit witnesses add a complementary caution: good calibration on the first half of a curve does not guarantee a correct late event. That result is especially valuable because the held-out boundary was set before fitting.

The honest ending is conditional and reproducible: **in this one synthetic diffusion-only laminate, effective diffusivity becomes reliable as scale separation improves, while coarse finite-cell transients and early-only calibration can cross predeclared failure gates.**

## Primary literature retained by the gate

1. S. K. Chandrasekaran and R. Hillman, “Heterogeneous model of drug release from polymeric matrix,” *Journal of Pharmaceutical Sciences* 69 (1980), [DOI 10.1002/jps.2600691119](https://doi.org/10.1002/jps.2600691119).
2. Jean-Louis Auriault and Jolanta Lewandowska, “Effective Diffusion Coefficient: From Homogenization to Experiment,” *Transport in Porous Media* 27 (1997), [DOI 10.1023/A:1006599410942](https://doi.org/10.1023/A:1006599410942).
3. Jee E. Rim, Peter M. Pinsky, and William W. van Osdol, “Using the method of homogenization to calculate the effective diffusivity of the stratum corneum,” *Journal of Membrane Science* 293 (2007), [DOI 10.1016/j.memsci.2007.02.018](https://doi.org/10.1016/j.memsci.2007.02.018).
4. David M. Saylor, Chang-Soo Kim, Dinesh V. Patwardhan, and James A. Warren, “Modeling microstructure development and release kinetics in controlled drug release coatings,” *Journal of Pharmaceutical Sciences* 98 (2009), [DOI 10.1002/jps.21416](https://doi.org/10.1002/jps.21416).
5. Timo Johannes Laaksonen, Hannu Mikael Laaksonen, Jouni Tapio Hirvonen, and Lasse Murtomäki, “Cellular automata model for drug release from binary matrix and reservoir polymeric devices,” *Biomaterials* 30 (2009), [DOI 10.1016/j.biomaterials.2008.12.028](https://doi.org/10.1016/j.biomaterials.2008.12.028).
6. Ferdinand Brandl, Fritz Kastner, Ruth M. Gschwind, Torsten Blunk, Jörg Tessmar, and Achim Göpferich, “Hydrogel-based drug delivery systems: comparison of drug diffusivity and release kinetics,” *Journal of Controlled Release* 142 (2010), [DOI 10.1016/j.jconrel.2009.10.030](https://doi.org/10.1016/j.jconrel.2009.10.030).
7. James A. Kimber, Sergei G. Kazarian, and František Štěpánek, “Microstructure-based mathematical modelling and spectroscopic imaging of tablet dissolution,” *Computers & Chemical Engineering* 35 (2011), [DOI 10.1016/j.compchemeng.2010.07.008](https://doi.org/10.1016/j.compchemeng.2010.07.008).
8. Zbisław Tabor, Paweł Nowak, Małgorzata Krzak, and Piotr Warszyński, “Effective diffusivity in transient state,” *The Journal of Chemical Physics* 139 (2013), [DOI 10.1063/1.4818579](https://doi.org/10.1063/1.4818579).
9. Julia Grund, Martin Körber, and Roland Bodmeier, “Predictability of drug release from water-insoluble polymeric matrix tablets,” *European Journal of Pharmaceutics and Biopharmaceutics* 85 (2013), [DOI 10.1016/j.ejpb.2013.08.007](https://doi.org/10.1016/j.ejpb.2013.08.007).
10. Ali Salehi, Jin Zhao, Tim D. Cabelka, and Ronald G. Larson, “A unified multicomponent stress-diffusion model of drug release from non-biodegradable polymeric matrix tablets,” *Journal of Controlled Release* 224 (2016), [DOI 10.1016/j.jconrel.2015.12.045](https://doi.org/10.1016/j.jconrel.2015.12.045).
11. Preston Donovan, Yasaman Chehreghanianzabi, Muruhan Rathinam, and Silviya Petrova Zustiak, “Homogenization Theory for the Prediction of Obstructed Solute Diffusivity in Macromolecular Solutions,” *PLOS ONE* 11 (2016), [DOI 10.1371/journal.pone.0146093](https://doi.org/10.1371/journal.pone.0146093).
12. Sandra Barman and David Bolin, “A three-dimensional statistical model for imaged microstructures of porous polymer films,” *Journal of Microscopy* 269 (2018), [DOI 10.1111/jmi.12623](https://doi.org/10.1111/jmi.12623).
13. T.-C. Wang and Wei-Bor Tsai, “A biphasic mathematical model for the release of polymer-drug conjugates from poly(vinyl alcohol) hydrogels,” *Journal of the Taiwan Institute of Chemical Engineers* 135 (2022), [DOI 10.1016/j.jtice.2022.104395](https://doi.org/10.1016/j.jtice.2022.104395).
14. Patrick A. Giolando and colleagues, “Mechanistic Computational Modeling of Implantable, Bioresorbable Drug Release Systems,” *Advanced Materials* 35 (2023), [DOI 10.1002/adma.202301698](https://doi.org/10.1002/adma.202301698).
15. Marc Graham and Sandra Klinge, “Multiscale homogenisation of diffusion in enzymatically-calcified hydrogels,” *Journal of the Mechanical Behavior of Biomedical Materials* 149 (2024), [DOI 10.1016/j.jmbbm.2023.106244](https://doi.org/10.1016/j.jmbbm.2023.106244).
