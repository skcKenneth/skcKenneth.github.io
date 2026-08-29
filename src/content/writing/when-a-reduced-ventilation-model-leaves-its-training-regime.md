---
title: "When a Reduced Ventilation Model Leaves Its Training Regime"
slug: when-a-reduced-ventilation-model-leaves-its-training-regime
summary: A frozen synthetic POD and POD-DEIM audit verifies its full-order reference, then stops because both reduced models fail before any declared ventilation shift is applied.
date: 2026-08-30
lastUpdated: 2026-08-30
featured: false
topics: [Reduced-order modeling, POD, DEIM, Passive-scalar transport, Reliability]
heroImage: /science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_01_basis_nominal_gate.svg
type: Research Notes
archived: false
scienceProject: when-a-reduced-ventilation-model-leaves-its-training-regime
redirectFrom: []
---

A reduced model cannot fail “under shift” if it already fails before the shift. That single ordering rule controls the interpretation of this study.

The benchmark trains proper orthogonal decomposition (POD) and POD with discrete empirical interpolation (POD-DEIM) on four synthetic passive-scalar transport cases. It then evaluates a nominal holdout, three single shifts, and one combined shift. The planned question is whether schedule, source location, or ventilation changes degrade person-zone exposure and threshold-duration predictions beyond frozen tolerances.

The full-order reference passes its numerical gate. The reduced models do not pass the nominal holdout. POD has a space-time relative field error of 0.181929901217 and POD-DEIM has 0.364300559015 against a preregistered nominal limit of 0.05. Their nominal maximum person-zone exposure-integral errors are 0.103855579185 and 0.324698734984 against a limit of 0.08. POD-DEIM also misses the threshold duration by 60 seconds against a 40-second limit.

The terminal verdict is therefore **STOP_REFERENCE_OR_ROM_INADMISSIBLE**. The reference is admissible; the ROMs are not. Shifted-case trajectories remain useful diagnostics, but Phase 1 cannot attribute their errors to distribution shift because the control condition already fails.

Two additional hypotheses fail. A 24-point sampled-residual warning is anti-correlated with actual POD-DEIM field error at Spearman $-0.50$, below the frozen $+0.60$ gate, and it does not place the two worst cases in its top three. The accepted-attempt median POD-DEIM online speedup is 2.978205301, below a $5\times$ gate. These failures are retained rather than repaired.

This is a deterministic synthetic transport benchmark. It is not a calibrated room, a computational-fluid-dynamics validation, a carbon-dioxide exposure study, an infection-risk model, a building-control safety assessment, or a deployment claim.

## What was tested and what stopped

| Item | Frozen Phase-1 record | Interpretation |
|---|---:|---|
| Literature gate | **REFRAME** | Indoor POD, ventilation ROMs, DEIM, and diagnostics have direct precedents. |
| Domain | $8\,\mathrm m\times5\,\mathrm m$, $36\times24$ cells | One coarse synthetic two-dimensional surrogate. |
| Time grid | $T=1800$ s, $dt=2$ s | One backward-Euler reference schedule. |
| Training | four nominal cases | A fixed source-location and pulse-time design. |
| Evaluation | nominal, schedule, source, ventilation, combined | Five locked cases; only three are single shifts. |
| POD rank | 6, energy 0.999386845565 | Compact training basis, not a trust certificate. |
| Source-DEIM rank | 4, energy 1.0 | Exact energy capture for saved source snapshots, not state accuracy. |
| Reference refinement | relative $L_2=0.002520990049$ | Passes the frozen 0.03 reference gate. |
| Minimum reference state | 0 | Passes the nonnegativity gate. |
| Nominal POD field error | 0.181929901217 | Fails the 0.05 field gate. |
| Nominal POD-DEIM field error | 0.364300559015 | Fails the 0.05 field gate. |
| Warning correlation | $-0.50$ | Refutes the declared $+0.60$ sampled-residual rule on five cases. |
| Median POD-DEIM speedup | $2.9782\times$ | Fails the $5\times$ implementation-specific gate. |
| Reproduction | two identical signatures `8591af…5cfc` | Frozen numerical JSON is reproducible; runtime is separate. |
| Verdict | **STOP_REFERENCE_OR_ROM_INADMISSIBLE** | No causal shift-reliability conclusion is admitted. |

The stop rule prevents a familiar story from being told backwards. Large source-shift and combined-shift errors are visible. It would be tempting to call them evidence that the model “breaks out of distribution.” Yet the nominal control already violates the trust gate by a wide margin. The correct conclusion is not that shift caused failure. It is that this training and reduction design never established a trustworthy baseline from which an additional shift effect could be identified.

## Why the literature gate returned REFRAME

POD has a long history in indoor-environment simulation. Sempey, Inard, Ghiaus, and Allery used POD for fast temperature-field simulation in air-conditioned rooms in 2009 ([DOI](https://doi.org/10.1016/j.buildenv.2008.03.004)). Li, Su, Chu, and Xu developed a fast POD model for indoor thermal-environment simulation and control ([DOI](https://doi.org/10.1016/j.buildenv.2012.11.020)). Li and colleagues also combined POD with a genetic algorithm to optimize office ventilation operation ([DOI](https://doi.org/10.1016/j.enbuild.2013.07.075)). A project cannot claim that indoor POD or POD-based ventilation optimization is new.

Field reconstruction and flow mixing are likewise occupied. Meyer and Tan combined POD with linear stochastic estimation to provide detailed indoor information from limited measurements ([DOI](https://doi.org/10.1016/j.enbuild.2014.01.015)). Christ and Sattelmayer studied reduced-order flow and mixing in an automobile HVAC system ([DOI](https://doi.org/10.1016/j.applthermaleng.2018.01.023)). Liu, Pan, and Long optimized stratum-ventilation supply parameters with POD ([DOI](https://doi.org/10.1016/j.scs.2021.103291)). Wei, Zhang, and Jin predicted airborne gaseous-pollutant transport in aircraft cabins using POD and a Markov-chain method ([DOI](https://doi.org/10.1016/j.buildenv.2022.109816)).

Changing boundaries or operating conditions is not untouched territory either. Luo and colleagues predicted indoor temperature and velocity fields under complex boundaries ([DOI](https://doi.org/10.1016/j.buildenv.2023.109987)). Jiang and Tominaga used POD-based prediction for cross-ventilation under different wind directions ([DOI](https://doi.org/10.1016/j.buildenv.2025.113673)). The broad idea of testing or interpolating a ventilation ROM away from one nominal condition therefore does not establish novelty.

The hyper-reduction layer has even clearer foundations. Chaturantabut and Sorensen introduced DEIM for nonlinear model reduction ([DOI](https://doi.org/10.1137/090766498)) and later derived a state-space error estimate for POD-DEIM ([DOI](https://doi.org/10.1137/110822724)). Wirtz, Sorensen, and Haasdonk developed a posteriori error estimation for DEIM-reduced nonlinear systems ([DOI](https://doi.org/10.1137/120899042)). Drmač and Gugercin proposed a selection operator with improved error bounds and extensions ([DOI](https://doi.org/10.1137/15M1019271)). Oxberry and colleagues studied adaptive snapshot selection under limited memory ([DOI](https://doi.org/10.1002/nme.5283)).

These primary works block a broad method claim. POD for indoor fields is established. POD for ventilation design is established. Reduced prediction across operating conditions is established. DEIM and its error analysis are established. The narrow defensible contribution here is a preregistered, failure-preserving audit that asks whether one nominally trained reduction first passes field and person-zone gates, then tests one cheap warning rule across declared synthetic shifts.

The literature audit is targeted, not systematic. It does not prove that no paper has the exact same five-case layout or warning score. It supports the decision to frame the work as a transparent benchmark rather than a new POD-DEIM method.

## The synthetic transport equation

Let $c(x,y,t)$ denote a passive scalar in the rectangle

$$
(x,y)\in[0,8]\times[0,5].
$$

The model has rightward advection, isotropic diffusion, first-order removal, and a localized time-dependent source:

$$
\frac{\partial c}{\partial t}
+u\frac{\partial c}{\partial x}
=D\nabla^2c-\lambda c+q(x,y,t).
$$

The nominal velocity is $u=0.04\ \mathrm{m\,s^{-1}}$, nominal removal is $\lambda=0.0025\ \mathrm{s^{-1}}$, and diffusivity is $D=0.03\ \mathrm{m^2\,s^{-1}}$. The localized source has a Gaussian spatial width of 0.42 m, amplitude 0.08 per second, a 360-second pulse width, and 24-second smoothed edges.

The units make the synthetic setup readable; they do not turn it into a validated building model. There are no walls, furniture, buoyancy, turbulence closure, supply jets, return geometry, thermal coupling, occupancy dynamics, sensor error, or measured boundary conditions. A constant horizontal velocity and first-order removal are surrogates chosen for a controlled ROM audit.

The cell-centered full-order model uses a $36\times24$ finite-volume grid, first-order upwind advection, conservative diffusive fluxes, and backward Euler with $dt=2$ seconds over 1800 seconds. Snapshots are saved every six steps. The state dimension is therefore 864 cells, small enough for a transparent reference but large enough to exhibit moving source plumes and transport delays.

Two synthetic “person zones” are Gaussian spatial averages centered at $(6.2,1.7)$ and $(6.2,3.3)$ m with width 0.45 m. They are observation functionals, not people and not breathing-zone measurements. The event threshold is a scalar concentration level of 0.12 synthetic units. For each zone, the benchmark records peak concentration, time integral, and total duration above the threshold.

The word “exposure” in the figures means the time integral of this synthetic zone average. It has no toxicological, infectious-dose, or health interpretation. No safe or unsafe threshold is being estimated.

## Training cases and the locked evaluation ladder

The four training cases all use the nominal velocity and removal rate. Their source locations and pulse starts are:

| Training case | Source $(x,y)$ m | Pulse start s |
|---|---:|---:|
| train A | $(2.2,1.7)$ | 240 |
| train B | $(2.2,3.3)$ | 720 |
| train C | $(3.0,1.7)$ | 720 |
| train D | $(3.0,3.3)$ | 240 |

The nominal holdout sits between these locations at $(2.6,2.5)$ and starts at 480 seconds. It uses the same $u=0.04$ and $\lambda=0.0025$ as training. Passing this interpolation-like control is a prerequisite for interpreting harder cases.

The schedule shift keeps the nominal-holdout source and transport parameters but moves the pulse start to 1020 seconds. The source shift moves the source to $(5.7,4.1)$ while keeping the nominal schedule and transport. The ventilation shift keeps the nominal source and schedule but changes velocity to $0.075$ and removal to $0.0060$. The combined case places the source at $(6.1,4.1)$, starts at 1020 seconds, and uses $u=0.080$ and $\lambda=0.0065$.

Only the schedule, source, and ventilation cases are declared single shifts. The combined case has no acceptance gate because several factors change at once. It is an exploratory stress diagnostic inside the frozen evaluation set, not part of the single-shift success rule.

This ladder creates a causal ordering. First verify the numerical reference. Then require both ROMs to pass nominal gates. Only if nominal admissibility holds may a single-shift failure be described as a shift-induced loss under this benchmark. Phase 1 stops at the second step.

## What POD compresses

Collect centered training snapshots as columns of a matrix $X$. Its singular value decomposition is

$$
X=U\Sigma V^\top.
$$

POD retains the first $r$ columns of $U$ and represents the full state as

$$
c(t)\approx \bar c+U_r a(t).
$$

The rank is selected by a frozen energy rule, constrained to lie between four and 20. The chosen rank is six, and the retained singular values capture 0.999386845565 of the saved training snapshot energy.

That fraction answers one question: how much squared training-snapshot variance lies in the selected linear subspace? It does not bound the error of a new trajectory. It does not guarantee local accuracy at a person zone. It does not preserve a threshold duration. It does not account for errors introduced by projecting dynamics. A compact spectrum is a compression diagnostic, not a certificate.

The POD model uses Galerkin projection of the transport dynamics onto the six-dimensional basis. It still evaluates the localized source in the full representation before projection. POD-DEIM adds a four-point source approximation so that the localized source is evaluated only at interpolation indices and reconstructed in its DEIM basis.

The selected source-DEIM rank is four and captures 1.0 of the saved source-snapshot energy under the numerical rule. Again, exact captured energy on the training source snapshots does not imply exact forcing for new source locations. A translated Gaussian can be difficult for a low-rank linear source basis even when every training pulse is represented exactly.

## The baseline that does no dynamics

A static lookup baseline selects the nearest nominal training trajectory and reuses it for the evaluation case. It is intentionally simple. It asks whether the reduced dynamical models improve on a cheap stored-trajectory rule under the same endpoint metrics.

The lookup is not expected to preserve shifted spatial fields, especially for a moved source. It nevertheless matters because a sophisticated model should be compared with a minimally viable shortcut, not only with the full-order solver. In the nominal holdout, the lookup has very poor field error but its zone summaries can occasionally appear competitive because one stored plume happens to pass near a monitor.

That mismatch illustrates why several metrics are necessary. A method can miss the field while approximating one integral through cancellation. It can approximate exposure but move the threshold crossing. It can reproduce duration but miss the peak. No single endpoint stands in for the others.

## Frozen trust gates

Nominal admissibility requires each reduced model to satisfy all three:

$$
E_{\mathrm{field}}\le0.05,
\qquad
E_{\mathrm{exposure}}\le0.08,
\qquad
E_{\mathrm{duration}}\le40\ \mathrm s.
$$

For declared single shifts, the limits are 0.10, 0.15, and 80 seconds. These looser shift gates acknowledge a harder task without allowing arbitrary degradation. The combined case is plotted but has no pass/fail threshold.

The field metric is a relative space-time $L_2$ error. The exposure metric is the maximum relative time-integral error over the two zones. The event metric is the maximum absolute error in duration above the 0.12 threshold. Relative duration error is avoided because a short reference duration could make a modest absolute difference appear enormous.

The reference itself must have a time-refinement relative difference below 0.03 and a minimum state no lower than $-10^{-12}$. The diagnostic warning must have Spearman correlation at least $+0.60$ with POD-DEIM field error across the five cases and must place the two worst-error cases within its three largest scores. Median POD-DEIM online speedup must be at least five. Runtime excludes offline snapshot generation, basis construction, and DEIM selection.

All ranks, cases, thresholds, monitor points, and gates were frozen before the canonical attempt. None changed after the nominal failure.

## A compact basis that fails the nominal gate

<figure class="article-figure">
  <img src="/science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_01_basis_nominal_gate.svg" alt="Nominal training POD spectrum and gate-normalized holdout errors; the selected rank is six, but POD and POD-DEIM both exceed the frozen field gate." loading="lazy" />
  <figcaption>The training singular values decay rapidly and the selected rank captures more than 99.9% of snapshot energy. Nevertheless, POD and POD-DEIM both exceed at least one nominal trust gate, so Phase 1 stops.</figcaption>
</figure>

Panel (a) gives the reassuring part of the story. Normalized singular values decay over several orders of magnitude, and rank six lies after a clear early decline. A six-dimensional representation appears plausible for the four training trajectories.

Panel (b) normalizes each nominal error by its frozen gate. A bar below one passes. POD field error is about 3.64 times the limit, its exposure error about 1.30 times the limit, and its duration error 0.45 times the limit. POD-DEIM is about 7.29 times the field limit, 4.06 times the exposure limit, and 1.5 times the duration limit. The static lookup is worse in field error and also fails exposure, although its duration happens to pass.

This is why an energy threshold cannot serve as a trust threshold. Training variance is dominated by common large-scale plume structures. A small fraction of omitted or misrepresented variance can be concentrated where a holdout source differs, where a zone functional is sensitive, or near a threshold crossing. Galerkin dynamics add another error channel even if the holdout state has a good instantaneous projection.

The source-DEIM result is more severe. Hyper-reduction does not merely preserve the POD error at lower cost. It roughly doubles the nominal field error and triples the exposure-integral error relative to POD. Exact source-energy capture on the training source snapshots does not transfer to the intermediate holdout forcing and coupled dynamics.

## The nominal time series show the failure mechanism

<figure class="article-figure">
  <img src="/science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_03_nominal_timeseries.svg" alt="Two person-zone concentration traces and instantaneous field error for the nominal holdout, with redundant encodings for the reference, POD, POD-DEIM, static lookup, and threshold." loading="lazy" />
  <figcaption>On the nominal holdout, POD overshoots the reference peaks, POD-DEIM undershoots them, and the static lookup shifts the plume response. Field error remains above the frozen 0.05 line for most of the active trajectory.</figcaption>
</figure>

The reference reaches a symmetric peak of 0.333267535058 in both zones and remains above the synthetic threshold for 410 seconds. POD peaks at 0.362682472446 and stays above threshold for 428 seconds. Its zone integral is 134.577198548326 against the reference 121.915584869943. Those differences produce an 8.83% peak error, 10.39% exposure error, and 18-second duration error.

POD-DEIM moves in the opposite direction. It peaks at 0.221810733410, integrates to 82.329748687854, and stays above threshold for 350 seconds. The corresponding errors are 33.44% in peak, 32.47% in exposure, and 60 seconds in duration.

The static lookup illustrates accidental endpoint agreement. Its two stored zone trajectories are asymmetric. One duration is 388 seconds and the other 422, so the maximum duration error is only 22 seconds. Yet its relative field error is 1.149357880209. A duration pass does not make the spatial prediction trustworthy.

Panel (c) shows time-resolved field error on a logarithmic scale. During the active plume, the ROM errors are not isolated spikes that integrate away. POD and POD-DEIM remain above the 0.05 field threshold over substantial intervals, while the lookup error becomes much larger. The nominal failure is structural enough to trigger the declared stop.

## Shifted results are diagnostics, not attributed effects

<figure class="article-figure">
  <img src="/science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_02_shift_metrics.svg" alt="Field, exposure, and duration errors for POD, POD-DEIM, and static lookup across five locked cases, with nominal and single-shift gates marked." loading="lazy" />
  <figcaption>Errors across the five frozen cases reveal difficult source and combined trajectories. Because nominal admissibility already fails, the shifted values cannot be interpreted as additional error caused by shift.</figcaption>
</figure>

The saved metrics are:

| Case | POD field / exposure / duration | POD-DEIM field / exposure / duration | Static field / exposure / duration |
|---|---:|---:|---:|
| Nominal | 0.1819 / 0.1039 / 18 s | 0.3643 / 0.3247 / 60 s | 1.1494 / 0.1650 / 22 s |
| Schedule | 0.1819 / 0.1022 / 18 s | 0.3643 / 0.3258 / 60 s | 1.2585 / 0.1645 / 22 s |
| Source | 0.3618 / 0.2339 / 38 s | 1.0000 / 1.0000 / 418 s | 1.1923 / 0.9686 / 134 s |
| Ventilation | 0.3590 / 0.1446 / 12 s | 0.3898 / 0.2908 / 100 s | 1.8964 / 1.0044 / 88 s |
| Combined | 0.5567 / 1.1821 / 6 s | 1.0000 / 1.0000 / 356 s | 2.4005 / 9.8400 / 390 s |

The source-shift POD-DEIM trajectory is particularly poor. A field error reported as 1.0, exposure error 1.0, and duration miss of 418 seconds indicate that the reduced trajectory does not preserve the relevant plume at all. The combined case is similarly poor. These observations identify where this frozen ROM is unreliable.

They do not identify why. The nominal POD-DEIM field error is already 0.3643, so the source case's error cannot be decomposed into a trusted baseline plus a shift penalty under this protocol. Training-basis truncation, projection dynamics, source interpolation, and shift can interact. The experiment lacks a nominally admissible control needed to isolate the latter.

Schedule shift produces almost the same ROM errors as nominal because the system is time invariant and the pulse is moved within a horizon that still captures its response. That is a useful internal diagnostic. Ventilation shift changes transport and removal, raising field and duration errors. Yet even these patterns remain descriptive, not causal shift-reliability conclusions.

The combined case has no acceptance gate. Its six-second POD duration error looks excellent beside large field and exposure errors. This is another cancellation warning: a threshold duration can match while the trajectory and spatial field do not.

## The cheap warning points in the wrong direction

<figure class="article-figure">
  <img src="/science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_04_diagnostic_failure.svg" alt="Actual POD-DEIM field-error ranking compared with the 24-point sampled-residual warning ranking; Spearman correlation is minus 0.50 against a plus 0.60 gate." loading="lazy" />
  <figcaption>The sampled residual assigns large scores to nominal and schedule cases while assigning small scores to the worst source and combined errors. Its rank correlation is negative, so the frozen warning rule is refuted.</figcaption>
</figure>

The warning uses residual evaluations at 24 fixed monitor points. It is intended to be deployable without reconstructing or comparing the full state. Across the five cases, POD-DEIM field errors are approximately 0.36, 0.36, 1.00, 0.39, and 1.00 for nominal, schedule, source, ventilation, and combined. The sampled residual RMS values are 6.89, 6.89, 1.00, 9.17, and 1.00.

The ordering is almost perverse for the intended use. The two worst cases receive the smallest warning scores. Ventilation receives the largest score despite having far lower field error than source or combined. Spearman correlation is $-0.50$, not merely below $+0.60$. The worst-two-within-top-three condition also fails.

This directly refutes one warning rule on one five-case synthetic audit. It does not prove that residual diagnostics are impossible. The sampled locations may miss the translated source, the normalization may be unsuitable, or the DEIM structure may make sampled residual small where reconstruction error is large. A new diagnostic would need a new frozen design and fresh evaluation cases.

The full-state subspace angle and projection error are saved only as oracle audits. Largest angles are near 90 degrees across cases, while projection errors range from 0.1526 nominal to 0.4666 combined. These quantities use information unavailable to a cheap online warning, so they are not presented as deployable detectors.

## Spatial fields at the nominal pulse midpoint

<figure class="article-figure">
  <img src="/science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_05_nominal_fields.svg" alt="Full-order reference, POD, and POD-DEIM concentration fields at 660 seconds for the nominal holdout, plus absolute DEIM-minus-reference error." loading="lazy" />
  <figcaption>The POD plume is displaced and broadened, while POD-DEIM suppresses much of the nominal source response. The error map is a synthetic numerical field, not a room measurement or risk map.</figcaption>
</figure>

At 660 seconds, the reference plume has a localized high-concentration region downstream of the source and a broader transported tail. POD reproduces the broad direction but shifts and smooths the high region. POD-DEIM greatly reduces the peak and changes the downstream field. The absolute-error panel localizes the discrepancy around the source plume and its advected wake.

The image explains why person-zone endpoints differ. Both zones lie near the right side of the domain. A small change in plume amplitude and arrival can alter peak, integral, and threshold duration together. A global field norm averages error over every cell and time, while a zone functional emphasizes a particular region. A useful ROM must be checked against both.

The field plot cannot support statements about indoor air quality. The scalar has arbitrary synthetic source amplitude. The velocity field is constant. The domain has no physical room features. The person zones are Gaussian weights, not occupants. The image exists to diagnose the numerical reduction.

## The full-order reference passes its gate

The terminal verdict contains “REFERENCE_OR_ROM” because either layer could have stopped the phase. Here the reference passes. Halving the time step changes the saved full-order trajectory by a relative $L_2$ value of 0.002520990049, below the 0.03 limit. The minimum concentration is exactly zero within the stored precision and satisfies the $-10^{-12}$ nonnegativity floor.

Focused tests cover grid geometry, conservative operator behavior, source evaluation, POD orthogonality, DEIM interpolation, exposure functionals, case freezing, signature construction, and result validation. All 20 tests pass in the captured environment.

These checks justify treating the finite-volume trajectory as the declared Phase-1 reference. They do not establish a grid-converged CFD solution or real-flow fidelity. The grid is only $36\times24$, advection is first-order upwind, and the velocity field is prescribed. “Reference” means reference within this synthetic benchmark and its frozen verification criteria.

That boundary is important. A reduced model can be accurately compared with a synthetic full-order model even when neither represents a building. Numerical-model reduction fidelity and physical-model validity are separate layers.

## Why the speed gate also fails

The accepted attempt records a median POD-DEIM online speedup of 2.978205301 relative to the full-order finite-volume solve. The gate is five. Individual values vary: roughly 2.80 for nominal, 8.99 for schedule, 3.61 for source, 2.93 for ventilation, and 2.98 for combined.

These timings are tiny, with full-order cases taking only a few hundredths of a second in the captured implementation. Fixed Python and linear-algebra overhead therefore matters. The schedule case's unusually high ratio is not enough to move the median above five. A different machine, compiled kernel, batch size, or state dimension could change the numbers substantially.

Offline costs are excluded by design. Snapshot generation, SVD, DEIM basis construction, point selection, and any model-management cost are not in the online ratio. The saved speedup is therefore not an end-to-end economic claim. It asks only whether this implementation meets one preregistered online threshold. It does not.

Failure of the speed gate does not cause the scientific STOP, because nominal accuracy already does. It remains a separate refuted claim. Reporting it prevents an inaccurate ROM from being advertised as successful solely because it runs faster.

## Two identical numerical runs, separate runtime records

The frozen configuration SHA-256 is
`228dec8f69ca5d02adfcd2e7e94242d29bc5184359947446a4ee48d501ff6f4b`.
Canonical attempts 0001 and 0002 both produce numerical signature
`8591afc2f1727654ac264197fc24939e81d44d1ccead8e6cbff16093ca05dcfc`.
Their machine-readable numerical JSON is byte-equivalent.

Runtime is excluded from the signature. That choice permits genuine timing variation without making deterministic numerical reproduction appear to fail. Each attempt records environment, invocation, config snapshot, per-case series, fields, basis data, metrics, summary, numerical signature, and a separate runtime file.

The second attempt did not trigger rank changes, threshold tuning, source-grid changes, or a new monitor selection. It reproduces the null under the same protocol. Immutable attempt directories and append-only lifecycle records preserve the order of work.

Reproducibility does not convert a failed gate into a positive result. It shows that the failure is not a one-run accident under the captured numerical pipeline.

## Visual evidence and rejected revisions

Five canonical figures are exported as SVG, vector PDF, and 600-dpi PNG. Publish SVGs are byte-identical to accepted canonical SVGs. Lines, markers, hatches, direct labels, and panel structure provide redundant encodings. SVGs contain title and description metadata, all text is black, and source metrics are linked through per-figure manifests.

The accepted source revision is `final-003`. The initial layout was rejected for legend-data, annotation-data, and colorbar-axis collisions, as well as layout-bound failures and rasterized field content inside SVG. A second revision fixed geometry but retained raster colorbars, so it was also rejected. The third revision uses vector colorbar solids and passes programmatic checks plus original-size review of all five 600-dpi PNGs and five 2.5-times PDF renders.

The rejected versions are preserved in the technical repository. The site copies only the accepted publish assets and verifies their hashes. No scientific plot is edited in the blog repository.

## What can be claimed

The evidence supports four narrow statements.

First, the declared finite-volume reference passes its Phase-1 time-refinement and nonnegativity checks. Second, the selected rank-six POD and rank-four source-DEIM construction do not pass the nominal trust gate. Third, the frozen 24-point sampled-residual score fails to rank the five cases by POD-DEIM field error. Fourth, the accepted implementation does not meet the five-times median online-speed gate.

The evidence does not support these broader statements:

- distribution shift caused the source or ventilation failures;
- POD or POD-DEIM is generally unreliable for ventilation;
- DEIM cannot approximate moving sources;
- the sampled residual can never be repaired;
- the ROM is ready for real-time control;
- synthetic threshold duration is a health or safety endpoint;
- the full-order model is validated CFD;
- any result applies to a real building, aircraft, classroom, or occupant;
- the work introduces POD, DEIM, an error estimator, or a new indoor-ROM method.

The distinction between a refuted frozen claim and a universal impossibility is essential. A rank-six basis built from four source cases failed this holdout. Another basis, transport-aware coordinate transform, localized library, shifted mode, nonlinear manifold, larger training design, or different hyper-reduction may work. Phase 1 tests none of them.

## What a defensible next phase would change

A next phase should first repair nominal admissibility without using the existing evaluation cases as an unacknowledged tuning set. Possible model-development directions include expanding nominal training locations, separating transport and source bases, using translated or localized bases, increasing rank under a frozen selection rule, or treating source location parametrically rather than asking one linear source basis to represent translations.

The repaired design would need new training, validation, and untouched evaluation partitions. The old nominal holdout has now influenced diagnosis and cannot serve as a pristine final test. Ranks, gates, monitor points, and hyper-reduction choices would be frozen before opening the new evaluation results.

Only after both POD and POD-DEIM pass a nominal control could single shifts be interpreted. Then a factorial design could separate schedule, source, velocity, and removal effects instead of relying on one case per factor. Repeated parameter points would permit uncertainty estimates around correlations and rankings. A five-case Spearman statistic is deliberately fragile and should not be treated as a stable population measure.

Warning design also needs separation from oracle analysis. A deployable score may use sampled residuals, conservation defects, coefficient extrapolation, local basis distances, or ensemble disagreement, but its thresholds must be selected on validation cases and assessed on untouched shifts. Full-state projection error and subspace angle can help explain failures, not serve as online warnings when full states are unavailable.

For a physical ventilation claim, the entire evidence layer would change. A dimensional geometry, boundary conditions, turbulence or flow model, mesh study, measurements, sensor uncertainty, calibration split, external validation, and application-specific endpoint would be required. Health language would require still more evidence and domain review. None of that can be inferred from this synthetic surrogate.

## Reproduction boundary

The technical repository contains the frozen config, lock file, exact attempts, tests, and plotting pipeline. The intended sequence from the P05 project root is:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
.\.venv\Scripts\python.exe scripts\run_phase1.py --config configs\phase1.toml --attempt-id attempt-0001
.\.venv\Scripts\python.exe scripts\run_phase1.py --config configs\phase1.toml --attempt-id attempt-0002
.\.venv\Scripts\python.exe scripts\check_reproducibility.py
.\.venv\Scripts\python.exe scripts\plot_phase1.py
.\.venv\Scripts\python.exe scripts\check_repo.py
```

Published attempt IDs are immutable; a fresh execution should use new IDs or a separate results root. Environment-specific runtime should not be expected to match byte for byte. The canonical numerical signature and saved JSON define the recorded reproduction claim.

## A precise conclusion

The full-order finite-volume reference is admissible under the frozen synthetic checks. Its time-refinement difference is 0.002520990049 and its state stays nonnegative. The training spectrum is compact, with six POD modes capturing 0.999386845565 of snapshot energy. Four source-DEIM modes capture the saved source energy.

Those compression facts do not produce a reliable nominal ROM. POD field and exposure errors exceed their gates. POD-DEIM field, exposure, and duration errors exceed theirs by larger margins. The correct experiment therefore stops before attributing error to schedule, source-location, or ventilation shift.

The shifted diagnostics still reveal where the frozen model performs poorly. Source and combined cases are catastrophic for POD-DEIM, and the cheap residual warning ranks them as low-risk. That warning is refuted on the five locked cases. The implementation also misses its median online-speed target.

The useful lesson is procedural, not promotional. A shift study needs a trustworthy nominal control. A compact singular-value spectrum is not that control. A cheap warning must be tested against actual error rather than assumed informative. A speedup matters only after accuracy and scope are stated. Here every gate is allowed to fail, and the failures determine the only defensible headline: **the reference verifies, the nominal reduced models do not, so the training-regime question remains blocked rather than answered by the shifted plots.**

## Primary works used in the literature gate

1. Sempey, Inard, Ghiaus, and Allery, “Fast simulation of temperature distribution in air conditioned rooms by using proper orthogonal decomposition” (2009), [DOI 10.1016/j.buildenv.2008.03.004](https://doi.org/10.1016/j.buildenv.2008.03.004).
2. Li, Su, Chu, and Xu, “A fast-POD model for simulation and control of indoor thermal environment of buildings” (2013), [DOI 10.1016/j.buildenv.2012.11.020](https://doi.org/10.1016/j.buildenv.2012.11.020).
3. Li, Xue, Xu, and Su, “Optimization of ventilation system operation in office environment using POD model reduction and genetic algorithm” (2013), [DOI 10.1016/j.enbuild.2013.07.075](https://doi.org/10.1016/j.enbuild.2013.07.075).
4. Meyer and Tan, “Provide detailed and real-time indoor environmental information using POD-LSE and limited measurements” (2014), [DOI 10.1016/j.enbuild.2014.01.015](https://doi.org/10.1016/j.enbuild.2014.01.015).
5. Christ and Sattelmayer, “Reduced order modelling of flow and mixing in an automobile HVAC system using proper orthogonal decomposition” (2018), [DOI 10.1016/j.applthermaleng.2018.01.023](https://doi.org/10.1016/j.applthermaleng.2018.01.023).
6. Liu, Pan, and Long, “Optimization of air supply parameters for stratum ventilation based on proper orthogonal decomposition” (2021), [DOI 10.1016/j.scs.2021.103291](https://doi.org/10.1016/j.scs.2021.103291).
7. Wei, Zhang, and Jin, “Rapid prediction of airborne gaseous pollutant transport in aircraft cabins based on proper orthogonal decomposition and the Markov chain method” (2023), [DOI 10.1016/j.buildenv.2022.109816](https://doi.org/10.1016/j.buildenv.2022.109816).
8. Luo and colleagues, “Fast and accurate prediction of air temperature and velocity field in non-uniform indoor environment under complex boundaries” (2023), [DOI 10.1016/j.buildenv.2023.109987](https://doi.org/10.1016/j.buildenv.2023.109987).
9. Jiang and Tominaga, “Proper orthogonal decomposition-based prediction of the flow field and ventilation rate of cross-ventilation under various wind directions” (2025), [DOI 10.1016/j.buildenv.2025.113673](https://doi.org/10.1016/j.buildenv.2025.113673).
10. Chaturantabut and Sorensen, “Nonlinear model reduction via discrete empirical interpolation” (2010), [DOI 10.1137/090766498](https://doi.org/10.1137/090766498).
11. Chaturantabut and Sorensen, “A state space error estimate for POD-DEIM nonlinear model reduction” (2012), [DOI 10.1137/110822724](https://doi.org/10.1137/110822724).
12. Wirtz, Sorensen, and Haasdonk, “A posteriori error estimation for DEIM reduced nonlinear dynamical systems” (2014), [DOI 10.1137/120899042](https://doi.org/10.1137/120899042).
13. Drmač and Gugercin, “A new selection operator for the discrete empirical interpolation method” (2016), [DOI 10.1137/15M1019271](https://doi.org/10.1137/15M1019271).
14. Oxberry, Kostova-Vassilevska, Arrighi, and Chand, “Limited-memory adaptive snapshot selection for proper orthogonal decomposition” (2017), [DOI 10.1002/nme.5283](https://doi.org/10.1002/nme.5283).
