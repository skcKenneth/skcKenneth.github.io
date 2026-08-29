---
title: "One Integrator Across the Fast-Slow Boundary"
slug: one-integrator-across-the-fast-slow-boundary
summary: A frozen Michaelis-Menten audit separates exact conservation, positivity, and a fixed-step asymptotic limit from accuracy, stiffness failures, and solver-superiority claims.
date: 2026-08-30
lastUpdated: 2026-08-30
featured: false
topics: [Enzyme kinetics, Singular perturbations, Numerical analysis, Reproducibility, Null results]
heroImage: /science/one-integrator-across-the-fast-slow-boundary/p08_03_null_error_advantage.svg
type: Research Notes
archived: false
scienceProject: one-integrator-across-the-fast-slow-boundary
redirectFrom: []
---

A numerical method can preserve mass, keep every concentration nonnegative, and approach the correct reduced update as a stiffness parameter vanishes. It can still be less accurate than ordinary backward Euler on every case in a frozen comparison. Those statements do not conflict. They answer different questions.

This distinction matters in fast-slow kinetics because several desirable properties are often compressed into one label. A method is called asymptotic-preserving, robust, physical, or uniformly accurate, and the reader is left to infer that all four descriptions travel together. They do not. Conservation is an algebraic identity. Positivity is a domain property. A fixed-step asymptotic limit concerns what happens when the stiffness parameter tends to zero while the step is held fixed. Accuracy concerns distance from a reference trajectory. Uniform accuracy needs an error statement whose constants do not deteriorate with the small parameter. Runtime superiority requires a controlled cost study. Each claim needs its own evidence.

P08 is a deliberately small audit of those separations. It uses one synthetic, dimensionless, irreversible Michaelis-Menten family, one first-order linearly implicit update, ten values of the singular parameter, four fixed step sizes, and one ill-prepared initial condition. It compares the update with a physical backward-Euler solve, classical fixed-step RK4, an exact reduced implicit law, and an internally tightened Radau-IIA-5 reference. The protocol was locked before the final run.

The structural part succeeds. The update conserves the exact weighted invariant by algebra, stays nonnegative with complex concentration at most one, and has the declared fixed-step reduced limit. Every predeclared reference, structure, convergence-envelope, and event gate passes. The comparative headline does not. At the finest frozen step, the audited update has higher weighted error than backward Euler for all ten values of the stiffness parameter. The error ratio ranges from 1.0143 to 2.0444. That result is retained as

`NULL_NO_UNIFORM_ERROR_ADVANTAGE_OVER_BACKWARD_EULER`.

The useful conclusion is narrower than a new-solver story. On this model, analytic properties and finite-grid accuracy can be audited separately, and a clean property result does not authorize an accuracy or efficiency claim.

## Read the evidence ledger first

The main findings fit in one table. The table also marks what each number does not establish.

| Question | Frozen evidence | Allowed interpretation |
|---|---:|---|
| Was the literature space clear? | 15 DOI-verified primary sources; **COMPLETE / REFRAME** | The method-development headline overlaps established work. This is a replication and property audit. |
| Did the tightened reference agree? | Maximum refinement difference $2.5892\times10^{-12}$ | The internal reference passed its declared consistency gate; it is not an external solver benchmark. |
| Did the audited update preserve structure? | Invariant drift $4.2188\times10^{-15}$; minimum state $0$ | The algebraic and numerical property checks pass for the declared model and feasible input domain. |
| Did it approach the fixed-step reduced update? | Maximum discrepancy $3.4480\times10^{-7}$ | The frozen epsilon sweep supports the stated fixed-step asymptotic limit. |
| Did fixed-step error converge? | Minimum last-pair order $0.7885$ | Finite-grid empirical convergence passes; no epsilon-uniform theorem is claimed. |
| Was the finest-step envelope bounded? | Maximum weighted error $0.0053654$ | The predeclared grid passes its $0.025$ gate only. |
| Did it beat backward Euler? | AP/BE error ratio $1.0143$ to $2.0444$ | No. The comparative hypothesis is null on every frozen epsilon. |
| Did fixed RK4 remain physical? | 28 of 40 cases failed or became nonphysical | This is a scoped stiff negative control, not a ranking of adaptive explicit methods. |
| Did the reduced model replace the full state? | Initial complex discrepancy $0.5$ | No. Slow and event agreement improves as epsilon shrinks, but the initial layer remains visible. |

The protocol configuration has SHA-256

`c26804359e5034cef43dbfb51eb6b82a7b26b5b96d20036a220b978b3c55cfed`.

The canonical run and the independent rerun have the same scientific signature:

`1394e842cd8d6d4ac9ba135c45a16dc5c339ca130c1b0ddaf80e9d5709d44945`.

Runtime strings, timestamps, and environment labels are excluded from that signature. The numerical inputs and scientific outputs are included.

## The literature gate removed the novelty headline

Michaelis-Menten reduction is not a new setting for singular perturbation analysis. Heineken, Tsuchiya, and Aris treated the quasi-steady-state approximation as a singular limit in 1967. Segel and Slemrod later clarified the fast transient, small parameter, and approximation scales. Modern work by Eilertsen, Schnell, and Walcher maps validity, anti-QSSA regions, initial transients, and error bounds with considerably more care than the familiar textbook derivation.

The numerical side is equally occupied. IMEX and asymptotic-preserving constructions for stiff relaxation have established order conditions and failure modes. Boscarino and Russo studied uniformly accurate IMEX conditions. Schütz and Kaiser developed splitting methods for singularly perturbed ODEs and analyzed order reduction. Most decisively for P08, Kaiser and Schütz published a 2018 analysis of IMEX Runge-Kutta asymptotic error on the Michaelis-Menten singularly perturbed ODE itself, including epsilon sweeps and the differential-algebraic limit. Schütz and Seal later developed a high-order asymptotic-preserving semi-implicit multiderivative method for the broader class.

Positivity and conservation are also established research areas. Sandu studied positive integration for chemical kinetics, while Burchard, Deleersnijder, and Meister gave positive conservative Patankar discretizations for stiff production-destruction systems. Classical IMEX Runge-Kutta, Rosenbrock, VODE/BDF, and Radau methods provide mature comparator families.

The direct overlap is decisive. P08 cannot claim the first AP or IMEX Michaelis-Menten integrator, a first epsilon sweep, novelty of positivity and conservation, or a new uniformly accurate scheme. Keeping such a headline would require stopping the project. The retained question is more modest and more testable:

> For one frozen synthetic dimensionless Michaelis-Menten family, can a dependency-free audit distinguish proved conservation, positivity, and a correct fixed-step slow limit from empirical accuracy and stiff-solver performance?

That reframe changes the role of the computation. The code is not trying to win a method race. It is trying to keep claim types separate and make a null comparison publishable instead of silently tuning it away.

<figure>
  <img src="/science/one-integrator-across-the-fast-slow-boundary/p08_01_fastslow_property_audit.svg" alt="Cards showing the dimensionless fast-slow enzyme model, its exact invariant, the linearly implicit update, the fixed-step reduced limit, and the evidence boundaries of the audit." />
  <figcaption>The model and update are small enough for the structural claims to be checked directly. The cards separate algebraic properties from the finite numerical sweep.</figcaption>
</figure>

## The full model and the initial layer

The dimensionless irreversible Michaelis-Menten system is

$$
\begin{aligned}
s' &= -s+(s+\alpha)c,\\
\varepsilon c' &= s-(s+\alpha+\beta)c,\\
p' &= \beta c,
\end{aligned}
$$

with

$$
\alpha=0.4,\qquad \beta=0.6,\qquad (s(0),c(0),p(0))=(1,0,0).
$$

Here $s$ is the substrate-like slow variable, $c$ is the fast complex-like variable, and $p$ is product. These labels describe the mathematical roles only. No biochemical units, fitted rate constants, measurement errors, or experimental system are attached to them.

Adding the three equations after weighting the complex equation by $\varepsilon$ gives

$$
\frac{d}{dt}\left(s+\varepsilon c+p\right)=0.
$$

The initial value is one, so the exact invariant is

$$
s(t)+\varepsilon c(t)+p(t)=1.
$$

The small parameter multiplies the complex derivative. When $\varepsilon$ is small, $c$ moves rapidly toward the algebraic slow manifold

$$
c=\frac{s}{s+\alpha+\beta}.
$$

Substituting that relation into the slow equation gives the reduced law

$$
s'=-\frac{\beta s}{s+\alpha+\beta},\qquad p=1-s.
$$

The chosen initial condition is ill-prepared because $c(0)=0$ while the algebraic manifold gives

$$
c_{\mathrm{qss}}(0)=\frac{1}{1+0.4+0.6}=0.5.
$$

The initial complex discrepancy is therefore exactly $0.5$ for every epsilon. It does not vanish merely because epsilon is small. Instead, it is confined to a progressively shorter fast layer, and its contribution to the weighted invariant is multiplied by epsilon. This is why a reduced model may approximate slow quantities and event times well while failing to reproduce the unweighted fast state near time zero.

That point matters for error definitions. If an error metric gives $s$, $p$, and $c$ equal unweighted importance at the initial instant, the reduced model begins with an $O(1)$ discrepancy. If the complex component is weighted by epsilon in line with the invariant and singular scaling, its contribution shrinks. Neither metric is universally correct. P08 declares its weighted metric before evaluation and reports the raw complex discrepancy separately so that the weighting cannot hide the initial layer.

## A closed-form linearly implicit step

Let $K=\alpha+\beta$. From state $(s_n,c_n,p_n)$ and positive step $h$, the audited update is

$$
D=\varepsilon+h(s_n+K+\varepsilon)+h^2\beta,
$$

$$
c_{n+1}=\frac{\varepsilon c_n(1+h)+hs_n}{D},
$$

$$
s_{n+1}=s_n+\varepsilon c_n-(\varepsilon+h\beta)c_{n+1},
$$

$$
p_{n+1}=p_n+h\beta c_{n+1}.
$$

The formula is first order and linearly implicit in its derivation, but its implemented step is closed form. There is no Newton iteration and no branch whose convergence depends on an initial guess. That convenience does not make it a new method. The literature gate treats it as a simple object for a property audit.

### Conservation is an identity

Add the new substrate and product values and then include the weighted complex:

$$
\begin{aligned}
s_{n+1}+\varepsilon c_{n+1}+p_{n+1}
&=s_n+\varepsilon c_n-(\varepsilon+h\beta)c_{n+1}\\
&\quad+\varepsilon c_{n+1}+p_n+h\beta c_{n+1}\\
&=s_n+\varepsilon c_n+p_n.
\end{aligned}
$$

All new-state terms cancel exactly on paper. In binary64 arithmetic the measured maximum drift is $4.2188\times10^{-15}$. The sweep verifies the implementation, but the finite sweep is not the proof. The proof is the cancellation for every feasible input and positive $h,\varepsilon$.

### Positivity follows from the same denominator

For nonnegative $s_n,c_n,p_n$ and positive parameters, $D$ is positive and the numerator of $c_{n+1}$ is nonnegative, so $c_{n+1}\geq0$. The denominator is large enough to bound the new complex by one on the declared feasible set. Rearranging the update with the definition of $D$ gives nonnegative forms for $s_{n+1}$ and $p_{n+1}$. Product positivity is immediate because it only receives $h\beta c_{n+1}$.

The tests do more than sample random states. They check the derived identities and inequalities over constructed boundary cases, including zero substrate, zero complex, limiting faces of the invariant set, and the frozen parameter grid. The observed minimum state is exactly zero within the stored results. Still, the allowed claim is tied to this update and its feasible input domain. It is not a theorem about arbitrary IMEX schemes or arbitrary reaction networks.

### The fixed-step asymptotic limit is explicit

Hold $h$ fixed and let $\varepsilon\to0$. The formula becomes

$$
c_{n+1}=\frac{s_n}{s_n+K+h\beta},
$$

$$
s_{n+1}=s_n-h\beta c_{n+1},\qquad
p_{n+1}=p_n+h\beta c_{n+1}.
$$

This is the declared reduced discrete update. The limit is obtained directly from the formula, not inferred from a log-log plot. On the frozen epsilon grid the maximum discrepancy between the full update and this fixed-step limit is $3.4480\times10^{-7}$, comfortably below the $2\times10^{-4}$ gate.

Calling this property asymptotic-preserving is precise only at the level proved here: for fixed $h$, the scheme has a well-defined epsilon-to-zero update consistent with the chosen reduced discretization. It does not prove uniform accuracy. It does not say that the error constant is independent of epsilon. It does not say the method resolves the fast layer. It does not say that the chosen $h$ is appropriate for a biological experiment.

## Reference construction and frozen comparisons

The reference is an internal adaptive implementation of three-stage fifth-order Radau IIA. Each implicit stage system is solved with damped Newton iterations. Step doubling controls local error. Reference outputs are generated at all points needed by the fixed-grid comparisons and at extra off-grid times.

An internal solver needs its own audit. P08 repeats the reference with tolerances tightened by a factor of ten and compares the trajectories with the same weighted metric used by the study. The maximum refinement difference is $2.5892155086637556\times10^{-12}$, far below the frozen $5\times10^{-8}$ gate. Reference invariant drift is $2.4424906541753444\times10^{-15}$, and the reference minimum state is zero. Off-final-grid checks reduce the risk that agreement is an artifact of observing only at $t=4$.

This is strong enough for the Phase-1 comparison, but its scope remains limited. The dependency-free Radau implementation is not a substitute for a work-precision study using mature Radau, BDF, VODE, Rosenbrock, or modern differential-equation libraries. It does not establish speed, robustness across other models, or parity with production software.

The frozen parameter grid contains

- ten epsilon values from $1$ through $10^{-6}$;
- four fixed steps $h\in\{0.2,0.1,0.05,0.025\}$;
- final time $t=4$;
- the initial condition $(1,0,0)$;
- a product event defined by $p=0.5$.

The audited method and backward Euler use exactly the same fixed steps. Backward Euler solves the full nonlinear system through a bracketed physical scalar root, avoiding calibration leakage from the AP formula. Classical RK4 is included as a deliberately simple explicit negative control. The reduced comparator uses the exact scalar implicit Michaelis-Menten update rather than a fitted surrogate.

No tolerance, step, epsilon, metric, or gate was changed after the canonical output was inspected. A new grid would be a new protocol and would need a new lock and evidence record.

## What the cross-regime trajectories show

<figure>
  <img src="/science/one-integrator-across-the-fast-slow-boundary/p08_02_crossregime_trajectories.svg" alt="Two trajectory panels comparing reference, linearly implicit audit method, backward Euler, reduced dynamics, and fixed RK4 from nonstiff to strongly stiff epsilon values." />
  <figcaption>The same fixed-step update remains feasible from $\varepsilon=1$ to $10^{-6}$. The reduced curve becomes useful for slow variables at small epsilon but does not reproduce the ill-prepared fast state at the initial instant.</figcaption>
</figure>

At epsilon one, the complex evolves on a comparable time scale to the slow variables, so replacing it by the algebraic relation is not appropriate. The full reference, audited update, and backward Euler trace the three-state evolution, while the reduced curve visibly represents a different approximation.

At epsilon $10^{-6}$, the reference complex moves through a very short initial layer. The slow substrate and product curves quickly align with their reduced counterparts. A fixed output grid can make the fast transient look almost vertical, which is why the property claim is not based on visual smoothness. The full update remains nonnegative and conserves the weighted invariant; those facts come from the formula and tests.

RK4 supplies a useful contrast. With the same fixed steps it can produce a negative or otherwise nonphysical state when the fast eigenvalue is far outside its stability region. The plot marks that failure instead of clipping the bad trajectory or replacing it with a smaller unregistered step. Yet the result applies only to classical fixed RK4 on this forty-case grid. An adaptive explicit code with stiffness detection is a different algorithm and was not tested.

## The comparison that returned a null result

<figure>
  <img src="/science/one-integrator-across-the-fast-slow-boundary/p08_03_null_error_advantage.svg" alt="Weighted finest-step errors of the audited AP update and backward Euler across ten epsilon values, plus their error ratio above a baseline of one." />
  <figcaption>Every AP-to-backward-Euler ratio is greater than one on the frozen $h=0.025$ grid. Structural success is retained, but the proposed uniform error advantage is rejected.</figcaption>
</figure>

The original comparative hypothesis asked whether the audited update would have lower weighted error than backward Euler throughout the epsilon grid at the finest fixed step. It does not. For all ten epsilon values,

$$
\frac{E_{\mathrm{audit}}}{E_{\mathrm{BE}}}>1.
$$

The minimum ratio is 1.0142693 and the maximum is 2.0444392. In the most favorable case the methods are close, but backward Euler still has the smaller stored error. In the least favorable case the audited update has roughly double the error.

It would be easy to obscure this result. One could emphasize only the invariant, switch to a component where the curves look closer, choose another step after seeing the table, or present the two methods on a plot whose scale hides the separation. The frozen ledger prevents those moves. The comparative claim is marked REFUTED and the machine-readable disposition remains `NULL_NO_UNIFORM_ERROR_ADVANTAGE_OVER_BACKWARD_EULER`.

The null does not erase the property result. Backward Euler also has strong stability properties, and on this particular nonlinear system its fully implicit solve is accurate at the selected steps. The audited update has a simpler closed-form step and a transparent fixed-step limit, but P08 does not measure enough to convert those conveniences into a cost claim. There are no reliable wall-clock comparisons, function-evaluation budgets, linear-solve counts, or production-library baselines.

The proper conclusion is therefore two-part. The linearly implicit update passes the declared structural and finite-grid gates. It does not outperform backward Euler in finest-step weighted error on the declared grid. Both clauses must remain together.

## Convergence is empirical, not a uniform theorem

<figure>
  <img src="/science/one-integrator-across-the-fast-slow-boundary/p08_04_convergence_slowlimit.svg" alt="Log-log fixed-step convergence curves over selected epsilon values beside the discrepancy between the full update and its reduced fixed-step limit." />
  <figcaption>The observed last-pair orders and slow-limit discrepancy pass the frozen gates. They are finite-grid diagnostics, not an epsilon-uniform convergence proof.</figcaption>
</figure>

For each epsilon, errors are computed at $h=0.2,0.1,0.05,0.025$. The last-pair observed order is

$$
q=\log_2\!\left(\frac{E(h=0.05)}{E(h=0.025)}\right).
$$

The smallest stored value is $0.7885474783868782$, above the preregistered 0.55 floor. First-order behavior is plausible, but four steps and one final time do not prove an asymptotic theorem. Pre-asymptotic effects, reference error, component weighting, and the initial layer can all influence the estimated slope.

The finest-step error envelope takes the maximum weighted error over all ten epsilon values. Its value is $0.005365433451822332$, below the frozen 0.025 gate. This is an empirical uniform envelope over a finite list. The adjective uniform here describes the aggregation across the listed epsilon values, not a mathematical bound for every $0<\varepsilon\leq1$.

The slow-limit panel asks a different question. With $h$ fixed, it measures the distance between the full audited update and the exact limiting discrete update as epsilon decreases. The maximum terminal discrepancy at the smallest registered epsilon is $3.448014616047601\times10^{-7}$. That diagnostic supports the formula-derived limit and catches implementation errors. It does not measure distance from the continuous reduced solution unless the time discretization error is treated separately.

These distinctions keep three limits from being mixed:

1. $h\to0$ at fixed epsilon tests time-discretization convergence.
2. $\varepsilon\to0$ at fixed $h$ tests the discrete asymptotic limit.
3. Sending both to zero under a relation between them is a joint-limit question and is not established here.

A uniformly accurate theorem would need bounds with constants controlled independently of epsilon, a precise norm, assumptions on initial preparation, and proof over a continuous parameter interval. P08 supplies none of those ingredients and does not use the phrase as a positive result.

## Event timing, feasibility, and the reduced-model boundary

<figure>
  <img src="/science/one-integrator-across-the-fast-slow-boundary/p08_05_event_and_feasibility.svg" alt="Product-event timing errors across epsilon beside a method-by-step feasibility matrix, with 28 of 40 fixed RK4 cases marked failed or nonphysical." />
  <figcaption>The headline-step event error stays below its frozen threshold, while fixed RK4 fails in 28 of 40 cases. Both statements are limited to this model, grid, event, and implementation.</figcaption>
</figure>

The event is the first time product reaches $p=0.5$. Event times are obtained consistently from stored trajectories, with the same interpolation convention for each fixed-step method. The maximum audited-update event error at the headline step is $0.03040719917476009$, below the frozen 0.08 gate.

As epsilon shrinks, the reduced model's product event approaches the full reference event. That agreement is useful because the event depends on the slow accumulation of product. It does not imply full-state agreement at early time. The complex still starts half a unit away from its algebraic value. A paper that reports only event agreement could hide this discrepancy, so Figure 2 and the claim ledger retain the ill-prepared initial state explicitly.

The feasibility matrix records whether each fixed method completed without a numerical exception and without violating the declared physical state conditions. Classical fixed-step RK4 fails or becomes nonphysical in 28 of 40 epsilon-step combinations. The failures cluster as stiffness increases and the step becomes too large for the explicit stability region.

This is a negative control with a precise denominator. It is not evidence that explicit integration generally fails for enzyme kinetics. Smaller fixed steps, stabilized explicit methods, adaptive control, exponential integration, or automatic switching can change the result. Nor is the 28/40 count a probability: the forty cells are a deterministic parameter grid, not random draws from a biological population.

Backward Euler remains physical in the stored comparison because the scalar nonlinear solve is bracketed on the physical interval. That design choice is part of the comparator, not a favor given to the audited method. The study does not tune the bracket with reference answers, and failed roots would be preserved rather than replaced.

## Tests separate proof obligations from sweeps

The repository contains eleven mathematical and numerical tests. They cover the exact invariant, nonnegative update, the $c\leq1$ bound, the fixed-step epsilon limit, the physical backward-Euler root, reference refinement, event interpolation, deterministic result structure, and scientific-signature reproducibility. A test that samples a finite grid cannot prove a statement for all admissible states, so the analytic derivations remain in the model code and methods document. The tests verify that the implementation matches those derivations.

The canonical experiment and rerun produce byte-identical scientific signatures. The signature deliberately excludes elapsed time and local environment strings. Including those fields would make two scientifically identical runs appear different merely because processor load or installation path changed. Conversely, the signature includes the protocol-relevant inputs and outputs so that a changed epsilon grid or result cannot pass as the same experiment.

Environment attempts are logged separately. A shared project environment had a broken NumPy DLL, and another environment crashed inside a linear-algebra call. Those are runtime-layer failures, not scientific counterexamples. A bundled Python runtime completed all eleven tests, the canonical run, the rerun, repository checking, plotting, and reproducibility validation. Preserving failed environment attempts avoids both extremes: hiding operational problems and mislabeling them as model failures.

## Figure evidence includes rejected exports

Five figures were generated from machine-readable results as native SVG, vector PDF, and 600-dpi PNG. The public SVG for each figure is byte-identical to its canonical SVG. Colors are paired with line styles, markers, panel positions, or text so that color is not the sole encoding. SVG text is black, and every SVG contains a title and description.

Visual QA was performed on all five 4296 by 2280 PNG files at original detail and on 300-dpi rasters of every PDF. The checks cover text-text, text-data, legend-data, and panel-label collisions, plus clipping at all four edges.

The history records failures instead of presenting a frictionless final state. The first P08_03 export put legend text against the x-axis label. The first P08_04 export crowded the legend and lost part of the `(a)` panel marker in its PDF raster. An independent review then rejected the P08_05 PDF because two footer lines were too close and one began at the left edge. Layout-only revisions moved the affected elements into safe regions and regenerated every format and manifest. The final PNGs and PDF rasters passed both implementation and independent review.

This QA validates readability and source consistency. It does not validate the differential equation, reference method, or mathematical claim. A clean chart can display an invalid computation, so figure QA and scientific QA stay as separate records.

## Reproduce the frozen evidence

The private technical repository's P08 directory retains the research contract, literature gate, claim ledger, canonical result, source, tests, and figure-QA history. The public Blog contains the reviewed interpretation and admitted SVGs without exposing an inaccessible private-repository link.

From the project directory, run:

~~~powershell
python -m unittest discover -s tests -v
python scripts/run_experiment.py --output results/canonical.json
python scripts/run_experiment.py --output results/rerun.json
python scripts/check_reproducibility.py
python scripts/plot_results.py
python scripts/rasterize_pdf_qa.py
python scripts/check_repo.py
~~~

A valid rerun should reproduce the scientific signature, gate values, null disposition, and method-status grid. Figure bytes require the recorded renderer stack; a compatible font or compression change can alter SVG or PDF bytes without changing the scientific signature. Source manifests keep those layers distinct.

Changing alpha, beta, the epsilon list, time steps, final time, initial condition, event, error weights, reference tolerances, or gates creates a new protocol. It should not overwrite the frozen result or inherit its PASS label.

## What this study does not establish

The system is synthetic and dimensionless. It has no fitted enzyme, substrate, assay, temperature, pH, uncertainty model, or experimental data. The state variables should not be converted into concentrations, doses, clinical endpoints, or process limits.

The update is not presented as a new solver. The direct literature overlap rules out that headline. There is no general theorem of uniform accuracy, no high-order construction, no arbitrary-network result, and no proof for other initial conditions.

The error comparison does not establish backward Euler as universally superior. It concerns one weighted error, one final time, four common fixed steps, and ten epsilon values. Runtime, memory, nonlinear-solve cost, adaptive step selection, tolerance-to-error efficiency, and large-system linear algebra are absent.

The RK4 failures do not rank all explicit methods. The reduced-model agreement does not erase the initial layer. The event result does not validate a biological event. The reference consistency test does not turn an internal Radau implementation into a certified exact solution.

These exclusions are part of the result, not disclaimers added after it.

## A useful next phase

A stronger follow-up would start with an externally maintained stiff solver and a published AP or IMEX tableau. It would predeclare tolerance-to-error work-precision metrics, count right-hand-side, Jacobian, factorization, and rejected-step costs, and test well-prepared as well as ill-prepared data. It would include regimes identified by the anti-QSSA literature rather than restricting itself to the present parameter choice.

For a method contribution, the next phase would need a genuinely new construction or theorem after another novelty audit. For an application contribution, it would need physical units, parameter provenance, experimental observations, calibration, validation, and domain review. Those are different projects and should not be merged under one convenient simulation.

P08's narrower lesson is already useful. A numerical method can have a correct asymptotic limit and exact structural properties without winning an error comparison. A reduced model can predict a slow event while missing the initial fast state. An explicit negative control can fail on most of a frozen grid without supporting a universal claim about explicit algorithms. Keeping those sentences separate produces a more reliable account than selecting a single flattering label.

## Primary literature retained by the gate

1. Heineken, Tsuchiya, and Aris, “On the Mathematical Status of the Pseudo-Steady State Hypothesis of Biochemical Kinetics,” *Mathematical Biosciences* (1967), [DOI 10.1016/0025-5564(67)90029-6](https://doi.org/10.1016/0025-5564(67)90029-6).
2. Segel and Slemrod, “The Quasi-Steady-State Assumption: A Case Study in Perturbation,” *SIAM Review* (1989), [DOI 10.1137/1031091](https://doi.org/10.1137/1031091).
3. Eilertsen and Schnell, “The Quasi-Steady-State Approximations Revisited,” *Mathematical Biosciences* (2020), [DOI 10.1016/j.mbs.2020.108339](https://doi.org/10.1016/j.mbs.2020.108339).
4. Eilertsen, Schnell, and Walcher, work on anti-QSSA regions, *Mathematical Biosciences* (2022), [DOI 10.1016/j.mbs.2022.108870](https://doi.org/10.1016/j.mbs.2022.108870).
5. Eilertsen, Schnell, and Walcher, rigorous initial-transient and approximation-error analysis (2024), [DOI 10.1016/j.nonrwa.2024.104088](https://doi.org/10.1016/j.nonrwa.2024.104088).
6. Boscarino and Russo, uniformly accurate IMEX conditions for stiff relaxation, *SIAM Journal on Scientific Computing* (2009), [DOI 10.1137/080713562](https://doi.org/10.1137/080713562).
7. Schütz and Kaiser, RS-IMEX splitting for singularly perturbed ODEs, *Applied Numerical Mathematics* (2016), [DOI 10.1016/j.apnum.2016.04.004](https://doi.org/10.1016/j.apnum.2016.04.004).
8. Kaiser and Schütz, IMEX-RK asymptotic error analysis for Michaelis-Menten kinetics, *Journal of Computational and Applied Mathematics* (2018), [DOI 10.1016/j.cam.2018.04.044](https://doi.org/10.1016/j.cam.2018.04.044).
9. Schütz and Seal, a high-order AP semi-implicit multiderivative solver, *Applied Numerical Mathematics* (2021), [DOI 10.1016/j.apnum.2020.09.004](https://doi.org/10.1016/j.apnum.2020.09.004).
10. Sandu, positive numerical integration for chemical kinetic systems, *Journal of Computational Physics* (2001), [DOI 10.1006/jcph.2001.6750](https://doi.org/10.1006/jcph.2001.6750).
11. Burchard, Deleersnijder, and Meister, positive conservative Patankar discretization, *Applied Numerical Mathematics* (2003), [DOI 10.1016/S0168-9274(03)00101-6](https://doi.org/10.1016/S0168-9274(03)00101-6).
12. Ascher, Ruuth, and Spiteri, implicit-explicit Runge-Kutta methods for time-dependent PDEs, *Applied Numerical Mathematics* (1997), [DOI 10.1016/S0168-9274(97)00056-1](https://doi.org/10.1016/S0168-9274(97)00056-1).
13. Rosenbrock, “Some General Implicit Processes for the Numerical Solution of Differential Equations,” *The Computer Journal* (1963), [DOI 10.1093/comjnl/5.4.329](https://doi.org/10.1093/comjnl/5.4.329).
14. Brown, Byrne, and Hindmarsh, “VODE: A Variable-Coefficient ODE Solver,” *SIAM Journal on Scientific and Statistical Computing* (1989), [DOI 10.1137/0910062](https://doi.org/10.1137/0910062).
15. Hairer and Wanner, “Stiff Differential Equations Solved by Radau Methods,” *Journal of Computational and Applied Mathematics* (1999), [DOI 10.1016/S0377-0427(99)00134-X](https://doi.org/10.1016/S0377-0427(99)00134-X).

The final claim stays deliberately narrow: for this frozen dimensionless family, the audited update has proved conservation, positivity, and a correct fixed-step reduced limit, while the finite experiment rejects a uniform error advantage over backward Euler. No biological or solver-superiority conclusion follows.
