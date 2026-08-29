---
title: "When a Traffic Solver Invents a Jam"
slug: when-a-traffic-solver-invents-a-jam
summary: A failure-preserving LWR benchmark shows how final shock-grid alignment can make a cell-average norm look exact while threshold arrival and queue accounting remain biased.
date: 2026-08-30
lastUpdated: 2026-08-30
featured: false
topics: [Traffic flow, Conservation laws, Finite-volume methods, Numerical diffusion, Reproducibility]
heroImage: /science/when-a-traffic-solver-invents-a-jam/p10_01_shock_profiles.svg
type: Research Notes
archived: false
scienceProject: when-a-traffic-solver-invents-a-jam
redirectFrom: []
---

A traffic simulation can conserve every vehicle, keep density inside its admissible range, and still report a queue too late. The problem is not necessarily a coding bug. A shock-capturing method represents an abrupt traffic front over a finite number of cells. If an operational rule says that congestion has arrived when density at a sensor first exceeds a threshold, a smeared front changes the reported crossing time. The same smearing changes any queue length or accumulated congestion measure defined by another threshold.

There is a second, more treacherous effect. A global cell-average error can look exceptionally small when the exact discontinuity happens to land on a grid boundary at the final reporting time. That alignment says almost nothing about how accurately the numerical front crossed a sensor earlier. In the frozen example studied here, the coarsest Godunov solution has a final cell-average $L^1$ error of only $1.37\times10^{-11}$, yet it reports the threshold arrival $0.517647$ time units late. Refining once to 100 cells makes the final $L^1$ error *larger*, $4.60\times10^{-4}$, even while the arrival delay is cut in half.

That is why this project retains a scientific null. Its preregistered-style Phase-1 gate required strictly refining final $L^1$ error for Godunov and Rusanov across all four grids. Both checks failed. The result file therefore says `phase1_pass=false`. Nothing was tuned after seeing the anomaly, and no failed criterion was deleted. The useful conclusion is not that the solvers are invalid. It is that a single global norm, sampled at a single fortunate time, is not an adequate operational audit of a moving discontinuity.

The benchmark is deliberately synthetic and dimensionless. It contains no road geometry, detector feed, vehicle trajectory, calibrated fundamental diagram, travel-time validation, safety threshold, or policy intervention. Words such as “queue,” “arrival,” and “congestion area-time” name mathematical functionals of the simulated density. They must not be mistaken for observed vehicle delay. Within that boundary, the experiment is exact enough to expose the measurement problem and small enough to reproduce line by line.

## The evidence ledger

Before discussing numerical methods, it helps to separate the machine record from the interpretation.

| Item | Frozen Phase-1 record | What it permits us to say |
|---|---:|---|
| Literature gate | **REFRAME** | LWR shocks and shock-capturing methods are mature; this is a replication-extension diagnostic, not a new traffic solver. |
| Model | Scalar LWR with $q(\rho)=\rho(1-\rho)$ | One dimensionless concave flux, not an empirically calibrated fundamental diagram. |
| Initial states | $\rho_L=0.1$, $\rho_R=0.95$ at $x_0=1$ | One backward-moving Riemann shock. |
| Domain and horizon | $x\in[0,2]$, $T=6$ | One closed numerical experiment with fixed boundary states. |
| Exact speed | $s=-0.05$ | The discontinuity reaches the fixed sensor $x_s=0.8$ at $t=4$. |
| Operational threshold | $\rho_s=0.8$ | A declared numerical event definition, not a statutory congestion standard. |
| Numerical design | Three schemes, $N=50,100,200,400$, CFL $0.8$ | Twelve conservative finite-volume cases under a matched grid ladder. |
| Invariant checks | All finite, bounded, conservative, and observed | Necessary implementation checks passed; they do not by themselves prove accuracy. |
| Frozen scientific gate | **NULL / FAIL** | Strict final-$L^1$ refinement failed for Godunov and Rusanov and remains failed. |
| Reproducibility | Two runs share signature `62029d…eee4` | The recorded numerical outputs reproduce deterministically on the frozen setup. |
| Visual QA | Four SVG/PDF/600-dpi PNG triples passed | Final exports were checked at original size for overlap and four-edge clipping. |

The distinction in the last column is the core editorial rule. A conservation residual near machine precision is evidence that the discrete accounting closes. It is not evidence that a sensor event is timely. A small final norm is evidence about a particular state comparison. It is not automatically evidence about a moving threshold crossing. A deterministic signature shows that the computation can be repeated; it does not convert a synthetic experiment into empirical traffic validation.

## Why the literature gate required a reframe

The starting idea suggested that a modified-equation view might reveal how a traffic solver “invents” congestion through artificial viscosity. That is a reasonable teaching motivation, but it is not a defensible novelty claim. The relevant mathematical and transportation literature is much older and broader than this experiment.

Lighthill and Whitham formulated kinematic waves for long crowded roads in 1955 ([DOI](https://doi.org/10.1098/rspa.1955.0089)), and Richards independently developed the highway shock-wave model in 1956 ([DOI](https://doi.org/10.1287/opre.4.1.42)). Godunov's 1959 construction supplied the conservative Riemann-solver framework used by the baseline here ([official MathNet record](https://www.mathnet.ru/eng/sm4873)). Ansorge later made the entropy condition explicit in traffic-flow computation ([DOI](https://doi.org/10.1016/0191-2615(90)90024-S)).

Daganzo's cell-transmission model connected a practical discrete traffic representation to hydrodynamic theory in Part I ([DOI](https://doi.org/10.1016/0191-2615(94)90002-7)) and extended it to networks in Part II ([DOI](https://doi.org/10.1016/0191-2615(94)00022-R)). Jin and Zhang treated an inhomogeneous LWR model as a resonant nonlinear system and used a Godunov formulation ([DOI](https://doi.org/10.1287/trsc.37.3.294.16046)). Daganzo's variational formulation ([DOI](https://doi.org/10.1016/j.trb.2004.04.003)) and the analytical, grid-free solutions of Mazaré and colleagues ([DOI](https://doi.org/10.1016/j.trb.2011.07.004)) show that grid-based finite-volume output is not the only available reference language.

High-resolution shock computation is also established territory. Harten's high-resolution schemes for hyperbolic conservation laws ([DOI](https://doi.org/10.1016/0021-9991(83)90136-5)) and the central schemes of Kurganov and Tadmor ([DOI](https://doi.org/10.1006/jcph.2000.6459)) long predate this benchmark. Friedrich, Kolb, and Göttlich provide a more recent Godunov-type traffic-flow comparison in a non-local LWR setting ([DOI](https://doi.org/10.3934/nhm.2018024)).

The evidence therefore cannot support “we discovered numerical diffusion in traffic flow,” “we invented a better shock solver,” or “we derived a new universal modified-equation coefficient.” The literature gate returns **REFRAME**, not because the problem is uninteresting, but because the honest local question is narrower:

> For one frozen backward LWR shock, can final shock-grid alignment make a cell-average refinement gate misleading while fixed sensor-arrival and threshold-defined queue metrics still expose numerical bias?

This question is a replication-extension diagnostic. Its value comes from binding an exact solution, a sensor definition, several error functionals, an unchanged pass/fail rule, and a complete failure record. It does not depend on pretending that mature theory is novel.

## The exact LWR problem

The scalar Lighthill–Whitham–Richards conservation law is

$$
\frac{\partial \rho}{\partial t}
+\frac{\partial q(\rho)}{\partial x}=0,
$$

where $\rho(x,t)$ is a dimensionless density and the frozen Greenshields flux is

$$
q(\rho)=\rho(1-\rho).
$$

The flux is concave, reaches its maximum at $\rho=0.5$, and is defined here only as a canonical test function. No units are attached to density, distance, time, or flow. The initial condition is a Riemann jump at $x_0=1$:

$$
\rho(x,0)=
\begin{cases}
0.1, & x<1,\\
0.95, & x>1.
\end{cases}
$$

Because $\rho_L<\rho_R$ for a concave flux, the entropy solution is a shock rather than a rarefaction. The Rankine–Hugoniot speed is the flux jump divided by the density jump:

$$
s=\frac{q(\rho_R)-q(\rho_L)}{\rho_R-\rho_L}.
$$

Here

$$
q(0.1)=0.09,
\qquad
q(0.95)=0.0475,
$$

so

$$
s=\frac{0.0475-0.09}{0.95-0.1}=-0.05.
$$

The negative sign means the dense state propagates upstream, toward smaller $x$. The exact shock position is

$$
x_{\mathrm{shock}}(t)=1-0.05t.
$$

At the final time $T=6$, it is at $x=0.7$. A sensor is fixed at $x_s=0.8$, so the exact front reaches it when

$$
1-0.05t_s=0.8,
\qquad t_s=4.
$$

Those two exact locations—$x=0.8$ at the event and $x=0.7$ at final time—are the geometric skeleton of the test. They let us distinguish error in the final cell averages from error in the time at which a thresholded sensor sees the front.

<figure>
  <img src="/science/when-a-traffic-solver-invents-a-jam/p10_01_shock_profiles.svg" alt="Exact backward LWR shock and three finite-volume density profiles over the full synthetic road and a zoomed sensor neighbourhood, with the fixed sensor and queue threshold marked." loading="lazy" />
  <figcaption>The exact discontinuity and the three frozen numerical profiles. The sensor threshold reacts to the smeared front even when final cell-average alignment makes a global norm unusually small.</figcaption>
</figure>

## Exact cell averages are not point samples

Discontinuous solutions require care when defining error. A numerical finite-volume value represents the average density over a cell, not the value at its center. The correct final reference is therefore the exact average of the step function over every numerical cell.

For a cell $C_i=[x_{i-1/2},x_{i+1/2}]$ of width $\Delta x$, the exact reference is

$$
\bar\rho_i^{\mathrm{exact}}(T)
=\frac{1}{\Delta x}
\int_{C_i}\rho(x,T)\,dx.
$$

If the shock lies outside the cell, this average is simply $0.1$ or $0.95$. If the shock cuts the cell, the average is the length-weighted mixture of the two states. That is the appropriate reference for

$$
E_{L^1}(T)
=\sum_i \Delta x
\left|
\bar\rho_i(T)-\bar\rho_i^{\mathrm{exact}}(T)
\right|.
$$

At $T=6$, the exact shock lies at $x=0.7$. On the $N=50$ grid over $[0,2]$, $\Delta x=0.04$, and $0.7$ is a cell boundary in the implemented mesh convention. The first-order Godunov update happens to reproduce the final cell-average step to almost floating-point precision in this case. The resulting $L^1$ error, $1.37\times10^{-11}$, is real. It is not a corrupted file and not a plotting mistake.

But it is a geometric coincidence. The front was numerically smeared while travelling. A thresholded sensor at $x=0.8$ did not see density $0.8$ at the exact time $4$; the interpolated numerical event occurred at $4.517647$. The final alignment rewards the state norm for being evaluated at a fortunate location and time, while the earlier event metric retains the travel-history bias.

This is not a paradox. Two diagnostics ask two different questions:

- The final $L^1$ norm asks how close all cell averages are to the exact state at $T=6$.
- The arrival delay asks when one interpolated sensor trajectory first crossed a fixed density threshold.

Neither is intrinsically superior. The mistake would be to use the first as a complete substitute for the second when the intended output is an event time.

## Three schemes under one frozen protocol

The experiment compares Godunov, Rusanov, and MUSCL–Godunov finite-volume schemes. Each uses the same domain, boundary states, horizon, CFL number $0.8$, and grid ladder $N\in\{50,100,200,400\}$. This matched design is important: changing the time-step policy, boundary treatment, reconstruction limiter, or event interpolation between schemes would confound the diagnostic.

For a conservative cell update,

$$
\bar\rho_i^{n+1}
=\bar\rho_i^n
-\frac{\Delta t}{\Delta x}
\left(
F_{i+1/2}^n-F_{i-1/2}^n
\right),
$$

the numerical flux $F$ determines how information crosses a cell interface. Godunov uses the exact scalar Riemann flux for the concave $q(\rho)$. Rusanov uses a central average plus dissipation proportional to a local speed bound. MUSCL–Godunov reconstructs limited piecewise-linear interface states before applying the Godunov flux, with twice as many recorded flux evaluations in this implementation.

One might expect the nominally higher-resolution reconstruction always to beat a first-order method. The frozen result warns against that simplistic ranking. For this single discontinuity-dominated Riemann case, Godunov and MUSCL–Godunov produce nearly coincident operational curves. Their $N=400$ arrival delays are both about $0.064706$, their final queue errors are $0.001652$ and $0.001693$, and their transition widths are $0.003905$ and $0.004001$. This does not prove equivalence; it only reports that the reconstruction provides no visible advantage on these declared metrics and settings.

Rusanov is more diffusive in the same design. At $N=50$, its arrival delay is $0.651582$, compared with $0.517647$ for Godunov; its transition width is $0.074893$, compared with $0.061176$. At $N=400$, those figures decrease to $0.081450$ and $0.010031$, but they remain above the Godunov values. This is a conditional comparison for one flux and one shock. It is not a universal league table for traffic solvers.

## Operational diagnostics must be declared, not improvised

The arrival event is defined before running the grid study. At the fixed sensor $x_s=0.8$, the numerical density is interpolated in time, and arrival is the first upcrossing of

$$
\rho(x_s,t)=0.8.
$$

The arrival error is

$$
E_{\mathrm{arrival}}
=t_{\mathrm{arrival}}^{\mathrm{num}}-4.
$$

The sign matters: every frozen case is late. A method that smears a high-density state into a gradual ramp may cross a high threshold only after the exact discontinuity has passed the sensor.

The transition width is the spatial distance between the locations where the final profile crosses $\rho=0.2$ and $\rho=0.85$. It is a direct description of numerical smearing. The two values are not physical traffic standards; they are fixed diagnostic levels spanning most of the jump from $0.1$ to $0.95$.

<figure>
  <img src="/science/when-a-traffic-solver-invents-a-jam/p10_02_operational_bias.svg" alt="Log-scale threshold-arrival delay and transition-width refinement for Godunov, Rusanov and MUSCL-Godunov schemes across four cell counts." loading="lazy" />
  <figcaption>Arrival delay and transition width shrink regularly under grid doubling for all three frozen schemes, even though the preregistered global-$L^1$ gate returns a null.</figcaption>
</figure>

Two additional functionals translate the density field into threshold-defined bookkeeping. The final queue length measures the spatial extent classified as congested at $T=6$. The congestion area-time integrates that classified extent over the whole horizon. Their exact reference values are $1.3$ and $6.9$ in the dimensionless experiment. The code evaluates numerical counterparts consistently on every grid and reports signed and absolute errors.

These metrics are operational only in a mathematical sense. The “queue” is not a counted line of vehicles; the threshold is not estimated from a detector; the area-time is not a welfare or emissions measure. Their purpose is to expose how a blurred interface changes downstream functionals even when mass conservation is exact.

## What the twelve cases actually show

For Godunov, grid doubling reduces the arrival delay from $0.517647$ to $0.258824$, $0.129412$, and $0.064706$. The absolute final queue-length error falls from $0.025882$ to $0.006650$, $0.003304$, and $0.001652$. The absolute congestion area-time error falls from $0.120317$ to $0.060119$, $0.030058$, and $0.015029$. Transition width shrinks from $0.061176$ to $0.015719$, $0.007809$, and $0.003905$.

Rusanov follows the same broad refinement pattern but with larger errors: arrival delays $0.651582$, $0.325801$, $0.162900$, $0.081450$; queue errors $0.031758$, $0.013933$, $0.006989$, $0.003495$; area-time errors $0.180281$, $0.090374$, $0.045157$, $0.022571$; and transition widths $0.074893$, $0.040088$, $0.020061$, $0.010031$.

MUSCL–Godunov closely tracks Godunov: arrival delays $0.517647$, $0.258824$, $0.129412$, $0.064706$; queue errors $0.025882$, $0.006720$, $0.003386$, $0.001693$; area-time errors $0.120534$, $0.060229$, $0.030115$, $0.015058$; and transition widths $0.061177$, $0.015883$, $0.008003$, $0.004001$.

<figure>
  <img src="/science/when-a-traffic-solver-invents-a-jam/p10_03_queue_metrics.svg" alt="Log-scale absolute final queue-length and congestion area-time errors for three frozen finite-volume schemes across four grids." loading="lazy" />
  <figcaption>The threshold-defined queue functionals converge with refinement. They are synthetic numerical diagnostics and must not be reported as empirical vehicle delays or real-road congestion impacts.</figcaption>
</figure>

Several patterns deserve precise wording.

First, every scheme shows regular improvement in the fixed arrival metric under each grid doubling. The delay is approximately halved. Second, transition width also shrinks regularly. Third, the threshold-defined queue functionals improve, though the first Godunov queue-length reduction is especially large because geometry affects the final threshold intersection. Fourth, Rusanov is consistently more diffusive than Godunov on these metrics. Fifth, MUSCL reconstruction does not materially separate itself from Godunov in this test.

None of those statements rescues the frozen global gate. The gate did not ask whether *some* operational metrics improve. It asked whether final $L^1$ error decreases strictly for all refinements in Godunov and Rusanov. It does not.

## The frozen null, in full

The Godunov final $L^1$ sequence is

$$
1.37\times10^{-11},\quad
4.60\times10^{-4},\quad
1.76\times10^{-4},\quad
8.82\times10^{-5}.
$$

The first step increases because $N=50$ receives the alignment windfall. The Rusanov sequence is

$$
6.75\times10^{-3},\quad
8.04\times10^{-3},\quad
4.02\times10^{-3},\quad
2.01\times10^{-3}.
$$

It also increases at the first step before entering a regular refinement regime. Both booleans `godunov_l1_refines` and `rusanov_l1_refines` are therefore false. Since they are part of the declared checks, `phase1_pass` is false.

<figure>
  <img src="/science/when-a-traffic-solver-invents-a-jam/p10_04_gate_null.svg" alt="Side-by-side final cell-average L1 error and threshold-arrival delay, highlighting an N equals 50 grid-alignment anomaly and the retained scientific null." loading="lazy" />
  <figcaption>The null is the result: a near-zero coarse-grid final norm caused by alignment coexists with a 0.517647 late threshold arrival, while arrival error refines under every grid doubling.</figcaption>
</figure>

There were several tempting but invalid ways to make the dashboard green. The study could have started the refinement check at $N=100$, moved the final time so the $N=50$ shock no longer aligned, weakened “strictly monotone” to “eventually decreasing,” changed the error to point samples, or replaced the gate with arrival delay after inspecting the output. Each change might define a sensible *new* experiment. None is a legitimate repair to this frozen one.

Preserving the failure is more informative. It documents a counterexample to the implicit assumption that a coarse-to-fine final norm must be monotone in a discontinuity problem. It also shows why validation criteria should be chosen to match the intended output before the numerical results are known.

## Reference and invariant checks still matter

A null scientific gate does not mean the implementation is unconstrained. All twelve cases pass several lower-level checks:

- every stored quantity is finite;
- density remains inside the declared interval $[0.1,0.95]$;
- the mass-balance residual is at most $2.22\times10^{-16}$;
- every sensor trajectory crosses the event threshold;
- the analytic speed calculation matches $-0.05$ to the $10^{-14}$ tolerance;
- exact cell averages are used for the final state comparison.

These checks make the null interpretable. If mass leaked, density became negative, or the event detector missed a crossing, the failed refinement sequence could be an implementation defect. Instead, the consistency checks isolate the failure to the relationship between grid geometry and the chosen final-time norm.

The hierarchy is worth keeping explicit:

1. **Reference checks** establish the exact shock and event quantities for the canonical problem.
2. **Invariant checks** establish conservative, bounded numerical execution.
3. **Metric checks** quantify state, event, interface, and threshold-functional errors.
4. **Scientific gates** decide whether the predeclared claim survived.

Passing levels one and two does not force level four to pass. Good scientific software must be able to report “the computation is valid and the claim is unsupported.”

## Why “invents a jam” is a diagnostic title

The title is intentionally provocative but needs a precise translation. The solver does not create mass. It creates a *numerical transition layer* around an exact discontinuity. A threshold applied to that layer may classify some cells or times differently from a threshold applied to the exact step. The apparent extra or delayed congestion is therefore a joint product of discretization and measurement definition.

Suppose a reporting system records a queue wherever $\rho$ exceeds a threshold $\rho_q$. For an exact shock, the classified region changes abruptly at one location. For a smeared profile, there is a finite band in which the classification depends on the chosen threshold. A lower threshold may make congestion appear to extend ahead of the exact front; a high sensor threshold may make arrival appear late. Both effects can occur without violating conservation.

This observation applies beyond traffic. Front arrival in combustion, wetting, epidemics, phase change, reactive transport, and ecological invasion is often extracted from threshold crossings. Whenever the front is numerically diffuse, the solver and the operational definition interact. The transferable lesson is methodological, not empirical: validate the functional that will be reported, not only the field norm that is convenient to compute.

## Global norms and event errors answer different questions

An $L^1$ norm is attractive for conservation laws because it is robust to pointwise shock displacement and has strong theoretical relevance. But a small $L^1$ error can arise from different error geometries. A front may be slightly displaced but sharp, correctly located but smeared, or aligned with cell boundaries at the reporting time. These cases can have similar norms and very different event times.

For an ideal step of height $\Delta\rho$ displaced by $\delta x$, the continuous $L^1$ difference is roughly $|\Delta\rho|\,|\delta x|$. That relation makes a state norm useful for tracking shock position in generic configurations. Yet a finite-volume cell-average comparison introduces mesh geometry, and a thresholded time event adds interpolation and profile-shape dependence. The $N=50$ result is an extreme reminder that a particular discrete norm can receive a cancellation or alignment advantage not shared by the event functional.

This does not argue for abandoning norms. A robust validation panel can include:

- an exact or independently resolved state norm;
- shock-location error;
- threshold-arrival error at declared sensors;
- transition width or total variation diagnostics;
- conservation and admissibility residuals;
- application-specific integral functionals;
- sensitivity to thresholds, sensor positions, final times, and grid offsets in a later, separately declared stage.

The list becomes dangerous if it is assembled after seeing the answer and only favorable metrics are reported. The point of the frozen Phase-1 design is that even an inconvenient norm remains visible.

## What this experiment does not establish

The benchmark supports a narrow numerical statement. It does **not** establish any of the following:

1. **A real traffic forecast.** There are no loop detectors, probe vehicles, cameras, travel times, road capacities, lane changes, incidents, signals, or boundary-demand data.
2. **A calibrated fundamental diagram.** The Greenshields flux is dimensionless and chosen for analytic transparency.
3. **A policy or safety conclusion.** The threshold values are numerical definitions, not legal, engineering, or operational standards.
4. **A universal scheme ranking.** One Riemann shock at CFL $0.8$ cannot rank methods across smooth waves, interacting shocks, rarefactions, networks, sources, non-local fluxes, or heterogeneous roads.
5. **A new convergence theorem.** The study records four-grid behavior; it proves no asymptotic rate.
6. **A derived modified-equation coefficient.** No general artificial-viscosity formula is fitted or claimed.
7. **The superiority of MUSCL reconstruction.** Its near-coincidence with Godunov here is a case result, not a method verdict.
8. **That global norms are useless.** The result shows incompleteness for an event-focused audit, not irrelevance.

Those limitations are part of the result rather than boilerplate. They prevent a clean synthetic counterexample from being inflated into a transportation claim.

## Reproducibility and preserved failures

The frozen configuration has SHA-256

`7035d72b80f7057f168c75a6be0033a15ba1d0fc7cc924bb2e894bd04fa5e88f`.

Two complete executions produce the identical numerical signature

`62029daa5d8d2185c5cdf1ad30bf7f3279db448f480cc233169466019a22eee4`.

Ten evidence tests pass after replaying the canonical $T=6$ protocol, and the repository checker validates the literature record, configuration hash, result structure, expected null, figure inventory, accessibility metadata, and reproduction signature. The technical repository contains the exact command sequence, machine-readable JSON, tests, reference ledger, decision log, and figure manifests.

The failure log also records problems that do not change the science. The source prompt contained several incorrect or unrelated DOI records; they were repaired against primary metadata and the rejected identifiers remain documented. One plotting environment hung during `savefig`; a project-local Python environment generated the canonical figures without regenerating the numerical result JSON. An early regression test accidentally replayed $T=1$ instead of the frozen $T=6$ alignment case; the test was corrected to test the already-declared protocol, with no parameter, result, gate, or signature change.

Visual QA produced another useful rejection. The first Figure 4 callout sat too close to the steep Godunov segment. That export was rejected. The annotation was moved into an empty axes-coordinate region and placed in a light box. The final four PNG files and all four independently rasterized PDF files were reopened one by one at original size. Legends, data, annotations, panel titles, tick labels, and all four edges were checked for overlap and clipping before the SVG copies were admitted to the public site.

This record matters because “reproducible” should describe more than a successful final command. It should include what failed, why the accepted correction did not alter the scientific protocol, and which outputs were regenerated.

## A better validation question

The most productive change is not to ask, “Which scheme has the smallest number?” It is to ask, “Which numerical property must be accurate for the decision or scientific statement we intend to make?”

If the output is total vehicle count, conservation deserves priority. If it is density reconstruction, state norms and spatial structure matter. If it is the time a front reaches a detector, the event definition and interpolation require direct verification. If it is a queue duration above a threshold, sensitivity to that threshold and to numerical transition width becomes part of the validation problem.

This functional-first view avoids two common errors. The first is proxy substitution: validating a convenient state norm and assuming every downstream metric is therefore valid. The second is dashboard shopping: computing many metrics after the run and highlighting whichever ones support the desired claim. A frozen hierarchy avoids both. Declare the intended functional, retain reference and invariant checks, and specify what combination constitutes success before computation.

For teaching, the $N=50$ alignment case is especially useful because the contradiction is visible without advanced machinery. The coarse grid appears “perfect” in one number and clearly late in another. Students can trace both results back to exact geometry rather than treating them as mysterious software behavior.

## What a responsible next stage would test

The current evidence should not be expanded by silently adding more favorable cases. A separate Phase 2 could freeze a broader robustness design with several deliberate axes:

- shift the initial discontinuity relative to the mesh;
- vary final time so the exact front samples different grid phases;
- move sensors and change declared thresholds;
- include rarefactions and shock interactions;
- compare smooth and discontinuous initial conditions;
- vary CFL under matched work or accuracy budgets;
- add independent variational or grid-free references;
- evaluate flux and reconstruction choices under declared work accounting;
- separate interpolation error from evolution error;
- report distributions across grid offsets rather than one fortunate phase.

An empirical traffic study would require a different evidence layer altogether: a real site, units, detector metadata, data-quality rules, calibration and holdout periods, uncertainty in demand and capacity, and a predeclared link between simulated functionals and measured outcomes. Nothing in this synthetic Phase 1 substitutes for that work.

The modified-equation idea could also be revisited, but only with an explicit derivation and a claim matched to what is proved. Fitting an “effective viscosity” after observing four curves would not establish a general coefficient. A serious analysis would distinguish scheme, flux, limiter, solution regime, grid, and time-step dependence, and it would test predictions on held-out configurations.

## Final reading of the null

The headline result is intentionally uncomfortable: the coarsest Godunov grid is almost exact in the final cell-average $L^1$ norm and still late at the sensor. The next grid has a worse final norm and a better arrival time. Rusanov shows its own non-monotone first refinement. The preregistered-style gate therefore fails, while conservation, boundedness, reference checks, deterministic reruns, and operational refinement all remain valid.

That combination is not a broken study. It is the study's contribution. It demonstrates, in one exact synthetic case, why numerical validation needs a portfolio of declared diagnostics tied to the intended output. A solver can preserve mass without preserving an event time. A norm can be small for a geometric reason that does not benefit an operational functional. A higher-resolution label does not guarantee a visible advantage in every discontinuity-dominated test. And a null result can teach more than a retuned success.

So when the title says that a traffic solver “invents a jam,” the precise meaning is modest: numerical smearing changes threshold-defined congestion bookkeeping. It does not mean that simulated vehicles appeared from nowhere, and it does not describe a real road. The honest lesson is broader and more durable: whenever a scientific conclusion depends on a moving front, validate the front-dependent conclusion directly.

## Technical record

- Technical record: private P10 modified-equation traffic shocks workspace in the ScienceProject repository
- Literature verdict: **REFRAME**
- Scientific verdict: **verified null**, with `phase1_pass=false`
- Canonical exact quantities: shock speed $-0.05$, sensor arrival $4.0$, final queue length $1.3$, congestion area-time $6.9$
- Numerical design: Godunov, Rusanov, and MUSCL–Godunov; $N=50,100,200,400$; CFL $0.8$
- Reproduction signature: `62029daa5d8d2185c5cdf1ad30bf7f3279db448f480cc233169466019a22eee4`
- Evidence boundary: synthetic and dimensionless; no empirical traffic, policy, safety, or universal ranking claim
