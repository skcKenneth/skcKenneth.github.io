---
title: "Can a Mesh Preserve the Event?"
slug: can-a-mesh-preserve-the-event
summary: A frozen growing-domain reaction–diffusion benchmark reaches a convincing raw modal transition, yet the preregistered event remains null and the adaptive-mesh comparison must stop.
date: 2026-08-30
lastUpdated: 2026-08-30
featured: false
topics: [Numerical analysis, Finite elements, Reaction–diffusion, Event detection, Reproducibility]
heroImage: /science/can-a-mesh-preserve-the-event/p01_01_event_score.svg
type: Research Notes
archived: false
scienceProject: can-a-mesh-preserve-the-event
redirectFrom: []
---

A numerical pattern can look as if it has split while the event used to measure that split does not exist. That distinction decided this project before any adaptive mesh was compared.

The intended benchmark was straightforward to state. A one-dimensional Schnakenberg reaction–diffusion pattern evolves on a prescribed exponentially growing domain. A mode-one profile is expected to give way to a mode-two profile. Uniform finite elements, residual-based adaptivity, and event-goal adaptivity would then be compared by their error in the first modal-transfer time. The comparison was never reached.

The frozen event required more than a score crossing. Mode one first had to remain established for 50 continuous time units under two simultaneous amplitude and modal-purity conditions. Only after that establishment interval could an upward crossing of the modal-transfer score at $S=0.5$ count. Every growing-domain finite-element and finite-difference solve produced a raw crossing near time 540 and eventually reached $S=1$. Yet the longest simultaneous establishment run was only 16 time units. The formal analyzer therefore returned `event_time: null` for every solver.

That is the result. It is not a near miss converted into a success by shortening the window, moving the threshold, replacing the event with peak count, or reporting the raw crossing as $t^*$. The terminal verdict is **STOP_PHASE1A**. Residual adaptivity, the adjoint, goal marking, estimator effectivity, matched-resolution comparisons, and efficiency claims remain unimplemented and locked.

The null is useful because it exposes a dependency that is easy to hide in computational papers. Before asking which mesh preserves an event most accurately, one must show that the declared event is present, unique, persistent, transversal, and reproducible across independent numerical formulations. A sharp-looking transition in a plot satisfies none of those conditions by itself.

## The evidence boundary at a glance

| Item | Frozen Phase-1A record | What it supports |
|---|---:|---|
| Literature gate | **REFRAME** | A replication-extension benchmark is defensible; method novelty is not. |
| Domain and model | One prescribed-growth 1-D Schnakenberg system | A synthetic numerical case, not a biological calibration. |
| Horizon | $T=1200$ | One anticipated modal transition plus a persistence window. |
| FEM levels | $(128,0.2)$, $(256,0.1)$, $(512,0.05)$ | Nested uniform P1 FEM space-time resolutions. |
| Independent check | 1024-cell conservative FD, $dt=0.025$ | A separately assembled diagnostic reference, not an efficiency competitor. |
| Raw crossings | $539.45$ to $541.39$ | A refined diagnostic transition only. |
| Longest establishment | 16, with 50 required | The formal event is absent under the frozen definition. |
| Formal event time | `null` for all growing solves | No event-time error or adaptive comparison is admissible. |
| No-growth control | no raw crossing; no event | The identical detector does not manufacture a split when growth is removed. |
| Verification | first-order time, second-order space; zero constant residuals | Implemented operators behave as expected on independent checks. |
| Reproduction | two identical signatures `acc4a…7344` | The null is deterministic under the captured configuration. |
| Locked work | residual/goal adaptivity, adjoint, effectivity, efficiency | No result or claim exists for those stages. |

The table separates three ideas that are often collapsed. The computation is numerically verified at the operator level. The finite-element and finite-difference solutions agree closely on the visible transition. The declared event is nevertheless inadmissible. Verification and cross-method concordance cannot change a logical predicate that evaluates to false.

## Why the literature audit narrowed the claim

Growing-domain pattern formation is established territory. Crampin, Gaffney, and Maini derived reaction–diffusion equations on growing domains and demonstrated frequency-doubling behavior in the Schnakenberg system in 1999 ([DOI](https://doi.org/10.1006/bulm.1999.0131)). Their later piecewise-linear analysis examined mode doubling and tripling more directly ([DOI](https://doi.org/10.1007/s002850100112)), while nonuniform domain growth was treated in a related model family ([DOI](https://doi.org/10.1006/bulm.2002.0295)). A blog can use this canonical mechanism as a benchmark, but it cannot present peak splitting under growth as a new discovery.

Finite-element treatment of these systems is also mature. Madzvamuse, Wathen, and Maini applied moving-grid FEM to a biological pattern generator ([DOI](https://doi.org/10.1016/S0021-9991(03)00294-8)). Subsequent work examined moving-grid Turing simulations ([DOI](https://doi.org/10.1007/s10915-004-4617-7)), time stepping on fixed and growing domains ([DOI](https://doi.org/10.1016/j.jcp.2005.09.012)), and the effect of grid velocity on selected patterns ([DOI](https://doi.org/10.1016/j.jcp.2006.11.022)). The last point is especially important here: a plausible pattern is not automatically a mesh-independent pattern.

Verified evolving-domain discretizations create a further constraint. MacKenzie and Madzvamuse analyzed stability and convergence for finite differences on a one-dimensional growing domain ([DOI](https://doi.org/10.1093/imanum/drp030)). Lakkis, Madzvamuse, and Venkataraman established error results for an implicit-explicit finite-element approximation on evolving domains ([DOI](https://doi.org/10.1137/120880112)). MacKenzie, Rowlatt, and Insall later developed a conservative ALE finite-element scheme on evolving two-dimensional domains ([DOI](https://doi.org/10.1137/19M1298585)). A new benchmark must therefore verify its particular implementation rather than treating basic solver correctness as its contribution.

Nor is adaptivity new in this setting. Venkataraman, Lakkis, and Madzvamuse reported adaptive finite elements for semilinear reaction–diffusion systems on growing domains ([DOI](https://doi.org/10.1007/978-3-642-33134-3_8)). Xie and Hu applied adaptively moving finite elements to reaction–diffusion systems, including a growing-domain example ([DOI](https://doi.org/10.4208/nmtma.2016.m1229)). Li and Yi developed goal-oriented a posteriori estimators for nonlinear reaction–diffusion problems ([DOI](https://doi.org/10.1016/j.cam.2022.114362)). These works block claims of a first adaptive growing-domain solver or a first goal-oriented reaction–diffusion method.

Finally, first-threshold time is already recognized as a special quantity of interest. Chaudhry, Estep, Stevens, and Tavener derived error representations for first time to a threshold in differential equations ([DOI](https://doi.org/10.1007/s10543-020-00825-0)). The PDE extension gives adjoint-based error estimates for a functional of an evolutionary semilinear parabolic equation ([DOI](https://doi.org/10.1007/s10543-023-00947-1)). Cliffe, Collis, and Houston treated a nonsmooth travel-time functional in a goal-oriented framework ([DOI](https://doi.org/10.1137/140960499)). The correct contribution class here is therefore a controlled benchmark that combines established ingredients, not a new event-time theory.

The bounded search did not locate the exact conjunction of this one-dimensional frequency-doubling case, this smooth modal score, this establishment predicate, an independent reference, and a matched-resolution comparison of uniform, residual, and event-goal marking. That negative search does not prove absence. It leaves a narrow replication-extension question: under a declared protocol, can the prerequisite event be established well enough to support such a comparison?

## The frozen growing-domain system

The reference coordinate is $x\in[0,1]$. Homogeneous Neumann conditions apply at both ends. In the pulled-back coordinate, the two concentrations satisfy

$$
\partial_t \mathbf c
=\gamma(t)^{-1}
\operatorname{diag}(1,0.01)\,\partial_{xx}\mathbf c
+
\begin{bmatrix}
0.9-c_1c_2^2\\
0.1-c_2+c_1c_2^2
\end{bmatrix},
\qquad
\gamma(t)=e^{0.002t}.
$$

The growth-rate parameter is $\rho=0.001$, with $\gamma(t)=e^{2\rho t}$. Diffusion in the reference coordinate is therefore weakened by $\gamma^{-1}$ as the physical domain grows. The model follows the nondilute slow-growth benchmark selected from the primary literature. The neglected dilution term is part of that benchmark choice and is not silently restored.

The parameter naming deserves an explicit note. In the usual Schnakenberg notation used by this repository, $a=0.1$ and $b=0.9$, but the first reaction component has production $b=0.9$ and the second has production $a=0.1$:

$$
R_1=b-c_1c_2^2,
\qquad
R_2=a-c_2+c_1c_2^2.
$$

Writing the numerical values directly in the equation avoids swapping $a$ and $b$ when comparing implementations. The homogeneous state is $(\bar c_1,\bar c_2)=(0.9,1.0)$.

The initial condition is deterministic:

$$
c_1(x,0)=0.9\,[1-0.005\cos(\pi x)],
\qquad
c_2(x,0)=1.0\,[1+0.005\cos(\pi x)].
$$

This is a 0.5% opposed mode-one perturbation. It is not the random realization in the motivating paper. Fixing it removes seed variation from a feasibility test and makes two independent executions exactly comparable.

The physical language must stay modest. The variables are synthetic concentrations in a prescribed-growth pattern model. There is no organism, measured tissue, fitted growth law, estimated kinetic parameter, cell lineage, gene network, or experimental validation. The benchmark is inspired by developmental pattern formation; it does not make a developmental-biological claim.

## Why peak count was not used as the event

Counting peaks is intuitive but numerically brittle. A tiny shoulder may or may not be counted depending on smoothing, grid spacing, derivative noise, prominence settings, or the location of a mesh node. Integer peak count also changes discontinuously, which complicates an adjoint intended to target event-time error.

The benchmark instead projects the mean-subtracted activator $c_2$ onto cosine modes. Let $a_m(t)$ denote the coefficient of mode $m$. The smooth modal-transfer score is

$$
S(t)=\frac{a_2(t)^2}{a_1(t)^2+a_2(t)^2+10^{-16}}.
$$

When mode one dominates, $S$ is near zero. When mode two dominates, $S$ is near one. Squaring removes sign ambiguity. The small fixed denominator regularizer prevents division by zero without materially changing scores at established amplitudes.

A raw upward crossing $S=0.5$ means the squared contributions of modes one and two are equal at that instant. It does not say that a meaningful mode-one state existed beforehand. It does not say that mode two remains dominant afterward. It does not rule out several crossings. It does not establish a nonzero slope. Each of those omissions can make a threshold time unsuitable as a comparison target.

The protocol therefore separated establishment from transfer. Mode one was declared established only after a continuous 50-unit interval in which both

$$
|a_1(t)|\ge 0.1
$$

and

$$
\frac{a_1(t)^2}{a_1(t)^2+a_2(t)^2+10^{-16}}\ge0.8
$$

held simultaneously. Only after the end of such an interval could the first upward $S=0.5$ crossing be searched. The event also had to be unique, remain above the threshold for 50 subsequent units, and be transversal under

$$
T\,|S'(t^*)|\ge0.1.
$$

The medium and fine FEM event times then had to agree within $10^{-4}T=0.12$, while fine FEM and independent FD had to agree within $2\times10^{-4}T=0.24$. All states had to remain finite and above $-10^{-8}$. The no-growth control had to contain no admissible event, and a second unchanged execution had to reproduce the numerical signature.

This predicate is intentionally demanding because a later goal-adaptive comparison would optimize error in $t^*$. If the target itself is unstable, ambiguous, or definition-dependent, a smaller reported error is not meaningful.

## Why the horizon was 1200

For $\rho=0.001$, the motivating growth study identifies a characteristic interval $\log(2)/\rho\approx693$ between frequency doublings. A horizon of $T=1200$ was frozen before the nonlinear run. It was long enough to cover initial pattern establishment, one anticipated transition, and a 50-unit post-crossing persistence check without targeting a later cascade.

The horizon was not extended after the event failed. Extending it could reveal another transition, but that would be a new protocol answering a different question. Nor was the 50-unit establishment window shortened to fit the observed 16-unit run. A feasibility gate has value only when it remains fixed after inspection.

## Two numerical formulations, not two copies of one code path

The uniform finite-element method uses continuous piecewise-linear basis functions, consistent mass and stiffness matrices, nodal reaction evaluation, implicit diffusion, and explicit reaction. The three nested pairs are

$$
(N_e,\Delta t)=(128,0.2),(256,0.1),(512,0.05).
$$

The fine finite-difference calculation uses 1024 cell centers and $\Delta t=0.025$. It is assembled independently as a conservative flux-difference scheme with zero boundary fluxes and the same first-order implicit-explicit time treatment. It does not call the FEM matrix assembler, reuse FEM quadrature, or interpolate a FEM solution and label it a reference.

Both formulations use the same model parameters, deterministic initial condition, horizon, output record, event analyzer, and no post-hoc detector settings. Agreement between them is more informative than agreement between two resolutions of one code path because distinct spatial representations are less likely to share the same assembly mistake.

The independent FD solve is still not an absolute truth oracle. It is a cross-check at a finer declared resolution. The intended reference would have required a converged admissible event under the nested and cross-formulation tolerances. Since the event is null, no reference event time exists to subtract from a candidate mesh-strategy time.

## The raw crossing that does not count

<figure class="article-figure">
  <img src="/science/can-a-mesh-preserve-the-event/p01_01_event_score.svg" alt="Modal-transfer scores from four growing-domain solvers across the full horizon and near the raw S equals 0.5 crossing; every formal event time is null." loading="lazy" />
  <figcaption>Nested P1 FEM and independent conservative FD agree on a sharp raw score transition. The crossing remains diagnostic because the frozen 50-unit establishment condition failed.</figcaption>
</figure>

Across the full horizon, all four growing-domain curves are nearly indistinguishable at the displayed scale. The score rises early to roughly 0.25, drifts around 0.3, collapses near time 530, and then rises rapidly through 0.5 toward one. The zoom shows a refined shift in raw crossing time:

| Solver | Resolution | Diagnostic raw crossing |
|---|---:|---:|
| FEM | 128 elements, $dt=0.2$ | 541.3928 |
| FEM | 256 elements, $dt=0.1$ | 540.2555 |
| FEM | 512 elements, $dt=0.05$ | 539.7169 |
| FD | 1024 cells, $dt=0.025$ | 539.4518 |

Those values look like a respectable convergence sequence. It would be easy to report the finest number as an event time, or to extrapolate the sequence. Doing so would change the endpoint after seeing the data. In the formal analyzer, the search for $t^*$ never begins because the prerequisite establishment interval does not exist. Thus `crossing_count=0`, `established=false`, `persistent=false`, `transversal=false`, `unique=false`, and `event_time=null`. The raw-crossing field is stored separately and labeled diagnostic-only.

This distinction is not semantic bookkeeping. A future adjoint for first-threshold time would depend on the derivative of the event functional and on an identifiable crossing. Substituting an informal visual crossing after the formal predicate fails would sever the link between the mathematical quantity of interest and the reported number.

## The failure happens before the visible split

<figure class="article-figure">
  <img src="/science/can-a-mesh-preserve-the-event/p01_02_establishment_audit.svg" alt="Mode-one amplitude and modal fraction for fine FEM and independent FD; the simultaneous qualifying run lasts 16 time units rather than the required 50." loading="lazy" />
  <figcaption>The amplitude condition is satisfied for a long interval, but modal purity remains below its 0.8 threshold for most of that interval. Their simultaneous persistence lasts only 16 time units.</figcaption>
</figure>

Panel (a) explains why a quick amplitude check would pass. The absolute mode-one coefficient rapidly exceeds 0.1, stays near 1.5 for hundreds of time units, then collapses as the mode-two profile emerges. There is plainly a strong mode-one component.

Panel (b) supplies the missing condition. The mode-one fraction falls quickly from one to about 0.75, then spends most of the apparent mode-one plateau below the required 0.8. It briefly rises above 0.8 shortly before the transition, but the qualifying overlap with the amplitude condition lasts only 16 units. The required duration is 50.

The two conditions were designed to prevent a weak or strongly mixed state from serving as the predecessor to a clean transfer event. In this trajectory the amplitude is strong but the representation is already mixed. Whether the rule is the best scientific definition is a legitimate question for a future version. It cannot be answered by weakening the rule inside the completed frozen version.

The establishment failure also explains why the dramatic score rise is not enough. A transfer score can move from near zero to near one even when the source state did not satisfy the declared purity standard. The numerator and denominator define relative modal ownership, not the historical legitimacy of the state being left.

## FEM and FD agree on the null

<figure class="article-figure">
  <img src="/science/can-a-mesh-preserve-the-event/p01_03_null_concordance.svg" alt="Raw crossing diagnostics and longest establishment durations for three nested FEM solves, fine FD, and the no-growth control; all admissible event times are null." loading="lazy" />
  <figcaption>Refinement aligns the diagnostic crossing, while every growing solve reaches only a 16-unit establishment run and the no-growth control reaches seven. The admissible event is null throughout.</figcaption>
</figure>

The left panel preserves the numerical information without mislabeling it. Raw crossing times move from 541.39 toward 539.45 as the joint space-time resolution is refined. The right panel then shows the decisive gate: every growing-domain method has longest duration 16, far below the dashed line at 50. The no-growth fine FEM control has duration seven and no raw crossing.

This is concordance on a negative result. The solvers do not merely fail independently for unrelated reasons. They resolve nearly the same modal histories and apply the same unchanged predicate to those histories. The null remains after refinement and after changing the spatial discretization family.

The result is stronger than “the program did not find an event.” The machine-readable summaries state why: the required simultaneous condition does not persist. It is also narrower than “frequency doubling does not occur.” The spatial profile visibly moves from one dominant interior structure to another, and the raw score crosses. What fails is this specific admissibility definition on this initial condition and horizon.

## What the spatial profiles show

<figure class="article-figure">
  <img src="/science/can-a-mesh-preserve-the-event/p01_04_activator_profiles.svg" alt="Fine P1 FEM and conservative FD activator profiles at times 500, 540, and 600, showing the spatial structure before, near, and after the raw transition." loading="lazy" />
  <figcaption>Fine FEM and independent FD resolve the same activator profiles before, near, and after the raw modal transition. The visual agreement validates the diagnostic narrative, not the formal event.</figcaption>
</figure>

At $t=500$, the activator profile decreases across the reference interval. At $t=540$, a strong interior peak has formed. By $t=600$, the high region has shifted again. The cosine coefficients summarize this changing spatial structure, while the near-overlap of FEM and FD curves shows that the raw modal transition is not a plotting artifact from one solver.

The profiles also show why integer peak count would invite discretion. Depending on whether an endpoint shoulder, broad maximum, or emerging curvature change is counted, a peak-based event can move. The modal score gives a continuous diagnostic, but continuity alone does not supply establishment, uniqueness, persistence, or transversality. The event predicate needs all of them.

Nothing in this figure identifies a biological structure. The horizontal axis is a reference coordinate, not a measured tissue length. The vertical axis is a synthetic model state, not a concentration assay. Matching two numerical methods is evidence about numerical implementation, not evidence that the equations describe an organism.

## The negative control uses the identical detector

<figure class="article-figure">
  <img src="/science/can-a-mesh-preserve-the-event/p01_05_negative_control.svg" alt="Modal-transfer score and mode-one amplitude for the rho equals 0.001 growing run and rho equals zero control, using the same initial condition, horizon, and detector." loading="lazy" />
  <figcaption>Removing growth prevents the raw score crossing under the same fine-FEM grid, time step, initial condition, horizon, and event code. Neither run has an admissible event.</figcaption>
</figure>

The no-growth control changes only $\rho$ from 0.001 to zero. It retains the fine FEM discretization, initial condition, horizon, output schedule, and detector. Its score remains near 0.24 and its mode-one amplitude remains established. There is no raw crossing and no formal event.

The growing run behaves differently: its score eventually approaches one and its mode-one amplitude collapses. This supports a limited mechanistic statement inside the synthetic model: prescribed growth changes the modal trajectory under the frozen parameters. It does not rescue the event because the establishment history still fails.

A good negative control need not turn the primary result positive. Here it checks detector specificity. The detector does not create a crossing from numerical drift in a stationary-domain trajectory. It also shows that `event_time=null` has two distinct causes: the no-growth run lacks a raw transfer, while the growing run has a raw transfer but lacks the required predecessor establishment. Recording those causes prevents all nulls from being treated as equivalent.

## Numerical verification passes, and the event still fails

<figure class="article-figure">
  <img src="/science/can-a-mesh-preserve-the-event/p01_06_verification_orders.svg" alt="P1 FEM IMEX time error, FEM space error, and conservative FD Neumann-space RMS error with observed orders near one, two, and two." loading="lazy" />
  <figcaption>Manufactured and analytic checks recover the expected first-order time and second-order spatial behavior. These tests validate assembly and convergence trends; they do not alter the event predicate.</figcaption>
</figure>

The manufactured problem is

$$
u_t=0.1u_{xx}-0.3u,
\qquad
u(x,0)=\cos(\pi x),
$$

with homogeneous Neumann boundaries. FEM temporal errors at $dt=0.02,0.01,0.005$ yield observed orders 0.990 and 0.995. FEM spatial errors at 16, 32, and 64 elements yield orders 2.064 and 2.282. The conservative FD Neumann Laplacian at 32, 64, and 128 cells yields orders 1.9997 and 1.9999. Constant vectors lie in the nullspace to machine precision for both the FEM stiffness matrix and the FD flux Laplacian.

The nonlinear runs remain finite and nonnegative within the frozen $-10^{-8}$ tolerance. Global minima are around 0.110. These checks matter because an absent event caused by blow-up, negative concentrations, a broken Neumann flux, or a first-order spatial bug would be uninterpretable.

Passing them answers a narrower question: the implemented operators and time treatment behave consistently on selected verification problems. It does not prove the nonlinear trajectory is exact. It does not prove every output functional is converged. It certainly does not make an establishment interval appear where the recorded modal histories contain only 16 qualifying units.

This is a useful pattern for scientific software: verification failures can invalidate a scientific conclusion, but verification success does not force the hypothesis to pass. Software quality is a prerequisite for a credible null, not a mechanism for avoiding one.

## Why no event-time error can be reported

Suppose one were to call 539.45 the reference event time. A coarse FEM error could then be written as approximately $|541.39-539.45|=1.94$. That calculation is arithmetically correct and scientifically inadmissible. Both values are diagnostic raw crossings obtained before a prerequisite in the formal definition.

The absolute event-time error

$$
|t^*_{h,\Delta t}-t^*_{\mathrm{ref}}|
$$

is defined only when both event times exist under the same event definition. Here $t^*_{h,\Delta t}=t^*_{\mathrm{ref}}=\text{null}$ in the formal records. Null minus null is not zero, and it is not a small error. It means the endpoint is unavailable.

The same logic blocks estimator effectivity. A ratio between an adjoint estimate and a true event-time error has no denominator. It blocks missed-event and extra-crossing comparisons because there is no admissible reference crossing. It blocks a geometric-mean error ranking across matched budgets because each required error is undefined.

One might instead redefine the endpoint as raw crossing time and begin a new benchmark. That could be defensible if declared before its results are inspected, accompanied by a revised mathematical rationale and new controls for uniqueness and persistence. It is not a repair to Phase 1A. It is Phase 1B or another version with a new config hash and a new claim ledger.

## The planned adaptive comparison that did not run

The original comparison contained three primal strategies: uniform P1 FEM, a standard residual or field-norm adaptive FEM, and an adjoint-driven event-goal strategy. Fine fixed-grid FD would serve only as an independent reference check.

The primary fairness axis was cumulative primal space-time resolution,

$$
\sum_n \mathrm{ndof}_n,
$$

matched within 5% across strategies. Final degrees of freedom alone were forbidden because a method could use a fine mesh briefly or take many more time steps. This resolution measure still would not equal total computational cost. End-to-end wall-clock would have to include the primal solve, adjoint, estimator, field transfer, remeshing, and any rejected steps on a frozen single-thread environment.

The preregistered success condition was demanding: at three matched-resolution levels, the goal strategy's geometric-mean event-time error had to be no more than half that of both uniform and residual adaptivity, with no missed or extra crossing. Estimator effectivity had to lie in $[0.5,2.0]$ on the two finest non-reference goal-adaptive levels. A compute-efficiency claim would require a separately preregistered matched-wall-clock comparison.

None of those metrics exists. There is no hidden adaptive run summarized only in prose. No residual marker, adjoint, goal marker, remeshing study, effectivity table, or wall-clock ranking was executed after the prerequisite failed. The blog title is therefore a question whose answer remains untested for meshes: the completed result concerns whether there is an event to preserve.

## Reproducibility without pretending runtime is deterministic

Two canonical attempts used the same frozen configuration with SHA-256
`49dbc1cae23113a5562bc8fd5c24cb51cec86a55e0cfddd23193748a71a86691`.
Both produced the numerical signature
`acc4a406360bca26f89d032d5251c06e20b12f2153c557358ed3fa6175447344`.

The signature covers numerical arrays and summaries. Runtime is stored separately because wall-clock measurements vary with scheduling and system state. The two attempt totals were approximately 16.86 and 17.47 seconds. Their difference is not a reproducibility failure, and neither value supports an efficiency claim.

Attempt directories are immutable. The runner refuses to overwrite an existing attempt and appends lifecycle records to an attempts log. Each attempt captures its config snapshot, invocation, environment, numerical outputs, summary, signature, and separate runtime record. The top-level `p01_phase1a_results.json` then points to both immutable attempts and states the terminal null explicitly.

This design prevents a common failure mode: rerunning until a preferred result appears and retaining only the successful directory. A second identical signature shows that the null is reproducible. It does not enlarge the model's scientific scope.

## Figure QA is part of the evidence chain

All six scientific figures are generated from machine-readable results and exported as SVG, vector PDF, and 600-dpi PNG. The publish SVG files are byte-identical to their accepted canonical SVG counterparts. Color is paired with line style, marker, hatch, label, or panel structure so that meaning is not carried by hue alone. SVG files include accessible title and description elements, and figure text is black.

The accepted revision is `final-006`. Earlier layouts remain in the repository as rejected evidence. Among the corrected problems were annotation-data collisions, order labels too close to line segments, and a PDF-render panel heading clipped at the left edge. The final revision passed programmatic checks plus original-size review of every 600-dpi PNG and every rasterized PDF.

Retaining the rejection history matters. A manifest that simply says “PASS” cannot show whether visual QA was substantive. The preserved sequence shows specific defects, their revisions, and the accepted artifact hashes. The website copies only the accepted publish SVGs; it does not redraw, optimize, or silently edit scientific content.

## What the null teaches about event design

The 50-unit establishment rule did exactly what it was designed to do: it rejected a visually tempting transition whose predecessor state was not sufficiently pure for long enough. That outcome may indicate that the rule is too strict for this trajectory, that the initial perturbation produces a mixed modal state, or that the chosen score is not the right coordinate for a frequency-doubling event. Phase 1A cannot distinguish those explanations.

Several redesigns are conceivable. Establishment could be based on a different smooth functional, a relative growth-rate criterion, a neighborhood in modal state space, or a persistence concept less sensitive to a fixed purity level. One could study threshold sensitivity across a preregistered grid, use an event manifold defined from continuation, or formulate a first-passage condition in a two-dimensional $(a_1,a_2)$ plane. One could also choose raw crossing time as the endpoint and accept its weaker interpretation.

Each option changes the estimand. A defensible next phase would specify the scientific meaning first, use pilot data only for design, freeze the revised rule, and evaluate it on fresh canonical runs. It would preserve Phase 1A as a null rather than overwriting it. If several definitions are compared, multiplicity and selection rules would need to be explicit.

The null also recommends a staged workflow for other PDE events:

1. Define the event as a mathematical predicate, including history and persistence.
2. Check it on a fixed reference family before building an estimator around it.
3. Verify existence, uniqueness, transversality, and independent-discretization agreement.
4. Freeze interpolation and time-record rules, since they affect first-crossing estimates.
5. Preserve absent or ambiguous events as outcomes rather than missing data.
6. Only then compare mesh strategies or optimization methods on event-time error.

This sequence costs less than implementing an adjoint for an endpoint that later proves undefined.

## Claims that remain blocked

The completed evidence does not support any of the following statements:

- goal-oriented adaptivity beats uniform or residual refinement;
- an adaptive mesh preserves frequency-doubling time more accurately;
- the event estimator is effective;
- the method is computationally faster or more efficient;
- the raw transition time is a validated event time;
- the benchmark supplies a new adaptive FEM or DWR method;
- the result generalizes to two dimensions, arbitrary growth laws, other kinetics, or other initial conditions;
- the synthetic pattern describes a real developmental system.

It does support a smaller set of statements. Under the frozen configuration, the operators pass selected verification checks. Nested FEM and independent conservative FD resolve closely aligned modal and spatial diagnostics. The no-growth control lacks the raw transition. The preregistered establishment condition fails, so every formal event time is null. Two unchanged runs reproduce that null exactly at the numerical-signature level.

The smaller claims are not an embarrassment. They are the only claims tied directly to artifacts and gates.

## Exact reproduction boundary

The technical repository records the exact environment and commands. From the P01 project directory, the essential sequence is:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
.\.venv\Scripts\python.exe scripts\run_verification_metrics.py

$env:OMP_NUM_THREADS='1'
$env:OPENBLAS_NUM_THREADS='1'
$env:MKL_NUM_THREADS='1'
$env:NUMEXPR_NUM_THREADS='1'
.\.venv\Scripts\python.exe scripts\run_phase1a.py --config configs\phase1a.toml --results-root results\phase1a --attempt-id attempt-0001
.\.venv\Scripts\python.exe scripts\run_phase1a.py --config configs\phase1a.toml --results-root results\phase1a --attempt-id attempt-0002
.\.venv\Scripts\python.exe scripts\compare_phase1a_attempts.py --results-root results\phase1a --first attempt-0001 --second attempt-0002
```

The published attempt IDs already exist and are immutable, so a new reproduction should use new attempt names rather than overwrite them. Exact byte identity across environments is not promised for runtime or necessarily for every binary container. The repository's canonical claim concerns the captured runs, their signature rule, and the machine-readable comparison.

## A precise conclusion

The numerical trajectory contains a sharp and reproducible raw transfer from mode-one-dominated to mode-two-dominated behavior. Three nested uniform P1 FEM levels and an independently assembled conservative FD calculation place that diagnostic crossing near time 540. Fine spatial profiles agree. A no-growth control does not cross. Manufactured and analytic checks recover the expected time and space orders.

None of those facts creates the preregistered event. The mode-one amplitude condition is satisfied, but the simultaneous modal-purity condition persists for only 16 units rather than 50. The formal event is absent. `event_time` remains null. The correct endpoint of Phase 1A is STOP.

The project therefore answers a question that comes before the title question. It does not yet know whether a mesh can preserve this event, because this event definition does not produce an admissible reference on the frozen benchmark. The next honest action is not to report 539.45 as if the gate passed. It is to preserve the null, redesign only under a new protocol, and keep every adaptive superiority claim locked until a valid event exists.

## Primary works used in the literature gate

1. Crampin, Gaffney, and Maini, “Reaction and Diffusion on Growing Domains” (1999), [DOI 10.1006/bulm.1999.0131](https://doi.org/10.1006/bulm.1999.0131).
2. Crampin, Gaffney, and Maini, “Mode-Doubling and Tripling in Reaction-Diffusion Patterns on Growing Domains” (2002), [DOI 10.1007/s002850100112](https://doi.org/10.1007/s002850100112).
3. Madzvamuse, Wathen, and Maini, “A Moving Grid Finite Element Method Applied to a Model Biological Pattern Generator” (2003), [DOI 10.1016/S0021-9991(03)00294-8](https://doi.org/10.1016/S0021-9991(03)00294-8).
4. Madzvamuse and Maini, “Velocity-Induced Numerical Solutions of Reaction-Diffusion Systems on Continuously Growing Domains” (2007), [DOI 10.1016/j.jcp.2006.11.022](https://doi.org/10.1016/j.jcp.2006.11.022).
5. MacKenzie and Madzvamuse, “Analysis of Stability and Convergence of Finite-Difference Methods for a Reaction-Diffusion Problem on a One-Dimensional Growing Domain” (2011), [DOI 10.1093/imanum/drp030](https://doi.org/10.1093/imanum/drp030).
6. Lakkis, Madzvamuse, and Venkataraman, “Implicit-Explicit Timestepping with Finite Element Approximation of Reaction-Diffusion Systems on Evolving Domains” (2013), [DOI 10.1137/120880112](https://doi.org/10.1137/120880112).
7. Venkataraman, Lakkis, and Madzvamuse, “Adaptive Finite Elements for Semilinear Reaction-Diffusion Systems on Growing Domains” (2013), [DOI 10.1007/978-3-642-33134-3_8](https://doi.org/10.1007/978-3-642-33134-3_8).
8. Xie and Hu, “Finite Element Simulations with Adaptively Moving Mesh for the Reaction Diffusion System” (2016), [DOI 10.4208/nmtma.2016.m1229](https://doi.org/10.4208/nmtma.2016.m1229).
9. Chaudhry, Estep, Stevens, and Tavener, “Error Estimation and Uncertainty Quantification for First Time to a Threshold Value” (2021), [DOI 10.1007/s10543-020-00825-0](https://doi.org/10.1007/s10543-020-00825-0).
10. Li and Yi, “A Posteriori Error Estimates of Goal-Oriented Adaptive Finite Element Methods for Nonlinear Reaction-Diffusion Problems” (2022), [DOI 10.1016/j.cam.2022.114362](https://doi.org/10.1016/j.cam.2022.114362).
11. Chaudhry and colleagues, “Error Estimation for the Time to a Threshold Value in Evolutionary Partial Differential Equations” (2023), [DOI 10.1007/s10543-023-00947-1](https://doi.org/10.1007/s10543-023-00947-1).
12. Endtmayer, Langer, and Schafelner, “Goal-Oriented Adaptive Space-Time Finite Element Methods for Regularized Parabolic p-Laplace Problems” (2024), [DOI 10.1016/j.camwa.2024.05.017](https://doi.org/10.1016/j.camwa.2024.05.017).
