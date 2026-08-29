---
title: "How Rare Is a Flip?"
slug: how-rare-is-a-flip
summary: A bounded finite-state calculation and seeded direct simulation agree on one synthetic low-copy genetic-toggle event—but that Phase-1 agreement is a starting point, not a rare-event victory.
date: 2026-08-29
lastUpdated: 2026-08-29
featured: true
topics: [Rare events, Stochastic reaction networks, Genetic toggles, Finite-state projection, Uncertainty]
heroImage: /science/how-rare-is-a-flip/p03_02_fsp_vs_naive_ssa.svg
type: Research Notes
archived: false
scienceProject: how-rare-is-a-flip
redirectFrom: []
---

A genetic switch can spend a long time looking stable and then change state in a short, noisy burst. That contrast makes the phrase “How often does it flip?” sound simpler than it is. The probability depends on what counts as a flip, when observation stops, which stochastic model is being simulated, and whether the numerical method can resolve an event that may occur only rarely.

This project began with an ambitious comparison: test adaptive multilevel splitting against direct Gillespie simulation and an error-controlled forward-flux baseline. The literature audit changed that plan before the comparison was run. Rare-event sampling on genetic and biochemical switches is not an empty field, and a generic demonstration that enhanced sampling can outperform brute force would repeat established work. The gate therefore returned **REFRAME**.

The defensible question is narrower: on one fixed exclusive-toggle continuous-time Markov chain, can a future benchmark expose where an estimator loses calibration as its progress coordinate is deliberately degraded, while charging every method for setup and sampling? That future question requires a trustworthy reference and a verified direct-simulation baseline first.

This article reports only that foundation. It is a **synthetic, low-copy Phase-1 smoke study**. A finite-state projection (FSP) at molecule cap 20 brackets the declared fixed-horizon hit probability between $0.2575946379$ and $0.2575946395$, with overflow probability $1.62\times10^{-9}$. A seeded direct SSA run records $1580$ hits among $6000$ trajectories, an estimate of $0.26333$, with a 95% Wilson interval from $0.25234$ to $0.27463$. In 32 smaller independently seeded batches, 30 Wilson intervals intersect the FSP bracket. Four focused tests, the repository check, and the documented reproduction pass.

Those are the complete positive claims. No adaptive multilevel splitting or FFPilot result appears here. There is no rare-event speedup, no biological validation, and no final rarity ladder. The event probability is roughly one quarter in this smoke configuration, so it would be especially misleading to present the calculation as evidence that a difficult rare-event regime has already been solved.

## A result ledger before interpretation

It helps to put the evidence boundary in one place before discussing the mathematics.

| Item | Phase-1 record | What it supports |
|---|---:|---|
| Literature gate | `REFRAME` | The generic efficiency question is already substantially answered; a reliability-boundary benchmark is the narrower defensible direction. |
| Model | Synthetic low-copy exclusive-toggle CTMC | A controlled numerical test case, not a named biological circuit. |
| Event | First entry into a declared $B$-dominant set by $T=12$ | A fixed-horizon hitting probability, not automatically a stationary switching rate or an MFPT. |
| FSP, cap 18 | Failed the fixed overflow/bracket tolerance | The failed truncation remains part of the audit trail. |
| FSP, cap 20 | $[0.2575946379,\,0.2575946395]$, overflow $1.62\times10^{-9}$ | A tight reference bracket for this one smoke event. |
| Seeded SSA | $1580/6000=0.26333$ | A direct Monte Carlo estimate for the same model and event. |
| SSA uncertainty | Wilson 95% interval $[0.25234,\,0.27463]$ | The direct estimate is statistically compatible with the narrow FSP bracket. |
| Batch diagnostic | 30 of 32 intervals intersect the FSP bracket | A small smoke diagnostic, not a high-precision coverage result. |
| Verification | Four tests, repository check, reproduction pass | Internal computational consistency for Phase 1. |

The wording in the last column is deliberate. An interval intersecting a reference does not prove that every implementation detail is correct. A passing test suite does not validate a biochemical mechanism. A very narrow truncation bracket does not turn a moderately probable event into a rare one. Each piece of evidence answers one question and leaves several others open.

## Why the literature gate changed the headline

The original attraction of the project was computational. If direct simulation waits through many ordinary reaction events before observing a transition, a splitting or importance-sampling method may concentrate effort near transition pathways. That idea is important, but it is not new.

Allen, Warren, and ten Wolde introduced forward-flux sampling for rare switching in biochemical networks and applied it to mutually repressing genetic switches [in 2005](https://doi.org/10.1103/PhysRevLett.94.018104). Allen, Frenkel, and ten Wolde then compared several interface and path-sampling schemes on a genetic switch [in 2006](https://doi.org/10.1063/1.2140273). Morelli and colleagues studied reaction-coordinate quality and committor structure for flips in general and exclusive genetic switches [in 2008](https://doi.org/10.1529/biophysj.107.116699). These papers already occupy the most obvious territory: access to rare flips, method comparison, and the role of a progress coordinate.

The overlap extends beyond forward-flux sampling. Roh and colleagues developed a state-dependent doubly weighted stochastic simulation algorithm for biochemical rare events, including a bistable lac-operon switch [in 2011](https://doi.org/10.1063/1.3668100). Cao and Liang compared adaptively biased sequential importance sampling with finite-buffer chemical-master-equation calculations [in 2013](https://doi.org/10.1063/1.4811286). Tse and colleagues used weighted-ensemble string sampling to study how DNA-binding kinetics changes noise-induced switching paths [in 2015](https://doi.org/10.1016/j.bpj.2015.08.035), and later combined rare-event sampling with coarse-grained landscape and phenotype-transition analysis [in 2018](https://doi.org/10.1371/journal.pcbi.1006336).

Two other strands matter directly to experimental design. Rolland and Simonnet showed in simple models that adaptive multilevel splitting can behave poorly when the reaction coordinate is inadequate [in 2015](https://doi.org/10.1016/j.jcp.2014.12.009). Cao, Terebus, and Liang developed multi-finite-buffer chemical-master-equation calculations with controlled truncation for systems that include genetic toggles [in 2016](https://doi.org/10.1137/15M1034180). Klein and Roberts added automatic full-phase error control to forward-flux sampling and tested it on master-equation models including a genetic toggle [in 2020](https://doi.org/10.1063/1.5129461).

Together, these ten primary works make three broad points established literature rather than local discoveries. First, rare switch events in biochemical and genetic networks can be sampled with interface, weighted-ensemble, or importance-sampling approaches. Second, error control, reaction-coordinate quality, and setup cost are central to a fair comparison. Third, a tractable low-copy toggle may admit a finite-state master-equation reference that is stronger than simply declaring a very large Monte Carlo run to be truth.

The remaining opening is therefore diagnostic, not triumphant. A useful benchmark could freeze several progress coordinates in advance, degrade them in a controlled way, compare empirical interval coverage and error at matched total compute, and record the boundary where the method becomes unreliable. Phase 1 does not execute that benchmark. It only asks whether the model, event, direct simulator, uncertainty calculation, and finite-state reference can agree in a tractable regime.

## The synthetic exclusive toggle

The state is

$$
X(t)=(N_A(t),N_B(t),S(t)),
$$

where $N_A$ and $N_B$ are total low-copy protein counts and the shared operator state is

$$
S(t)\in\{U,A,B\}.
$$

$U$ means the operator is unbound, $A$ means one $A$ protein is bound, and $B$ means one $B$ protein is bound. Because there is one shared operator, simultaneous $A$- and $B$-binding is excluded. A bound protein remains included in its species total. That accounting choice matters when degradation is defined: only free proteins degrade in this smoke model.

The reaction channels are production, free-protein degradation, monomer binding, and unbinding. In schematic form,

$$
\varnothing\rightarrow A,\qquad A\rightarrow\varnothing,
$$

$$
\varnothing\rightarrow B,\qquad B\rightarrow\varnothing,
$$

plus transitions among $U$, $A$-bound, and $B$-bound operator states. When $B$ is bound, $A$ production is multiplied by a leak fraction; when $A$ is bound, the same rule represses $B$ production. Binding to the shared operator therefore creates the mutually repressing architecture.

The fixed synthetic parameters are symmetric. Both unrepressed production rates are $1.5$; the leak fraction is $0.08$; both degradation rates are $0.55$; both binding coefficients are $0.8$; and both unbinding rates are $0.35$. The initial state is

$$
X(0)=(6,0,A),
$$

so the system begins $A$-dominant with $A$ bound to the operator.

<figure class="article-figure">
  <img src="/science/how-rare-is-a-flip/p03_01_exclusive_toggle_ctmc.svg" alt="Diagram of the synthetic exclusive genetic-toggle CTMC, with mutually repressive A and B production, one shared U/A/B operator, fixed initial state, and the declared B-dominant first-hit event." width="1031" height="454" loading="eager" decoding="async" />
  <figcaption><strong>Figure 1.</strong> The Phase-1 model is a synthetic low-copy exclusive-toggle CTMC. The diagram distinguishes reaction structure, the fixed A-dominant start, and the B-dominant first-hit condition; it is not a biological circuit validation.</figcaption>
</figure>

This model is intentionally small. It does not name an organism, promoter, plasmid, copy-number calibration, or experimentally measured rate. It omits mRNA, transcriptional bursts, translation delay, cell growth and division, extrinsic noise, resource competition, and evolutionary stability. Its purpose is numerical traceability: every legal state is discrete, every transition has a declared propensity, and the low copy numbers make an independently bounded finite-state calculation feasible.

That purpose is different from the earlier site study on qualitative noise-induced switching. Here the primary observable is not a stationary landscape or an unconstrained mean first-passage time. It is one sharply defined fixed-horizon event.

## What exactly counts as a flip?

Let the observation horizon be $T=12$. The target set is

$$
\mathcal B=
\{(n_A,n_B,s): n_B\ge 4,\ n_B-n_A\ge 2,\ s=B\}.
$$

The event is the first visit to $\mathcal B$ on or before $T$:

$$
H=\{\tau_{\mathcal B}\le T\},
\qquad
\tau_{\mathcal B}=\inf\{t\ge0:X(t)\in\mathcal B\}.
$$

All three clauses matter. Requiring $n_B\ge4$ prevents one or two molecules from being called a switched state. Requiring $n_B-n_A\ge2$ imposes an abundance margin rather than accepting a tie. Requiring $B$ to occupy the operator incorporates the regulatory state rather than classifying by protein counts alone.

Once a trajectory first enters $\mathcal B$, it is counted as a hit even if it would later leave. The quantity under study is therefore

$$
p_T=\Pr(\tau_{\mathcal B}\le12\mid X(0)=(6,0,A)).
$$

It is not the same object as a stationary transition rate. It is not automatically the reciprocal of a mean first-passage time. It is also not a probability per unit time. Those quantities may be related under additional assumptions or limiting regimes, but mixing them would make the numerical comparison ill posed.

Fixing the event before simulation is especially important in rare-event work. If a target threshold, time horizon, or basin definition is adjusted after seeing which trajectories succeed, the estimator is no longer answering the preregistered question. In this Phase-1 run, model parameters, initial state, event definition, truncation tolerance, seeds, and budgets were fixed in the smoke configuration.

## Direct Gillespie simulation as a baseline

For a continuous-time Markov chain with state-dependent reaction propensities $a_j(x)$, the direct stochastic simulation algorithm draws an exponential waiting time with total rate

$$
a_0(x)=\sum_j a_j(x)
$$

and chooses reaction $j$ with probability $a_j(x)/a_0(x)$. The state is updated and the process repeats until the trajectory hits $\mathcal B$ or reaches $T$.

For trajectory $i$, define the Bernoulli indicator

$$
Y_i=\mathbf 1\{\tau_{\mathcal B}^{(i)}\le T\}.
$$

The naive Monte Carlo estimator is

$$
\widehat p=\frac1N\sum_{i=1}^N Y_i.
$$

It is transparent and, for the declared CTMC, directly simulates the target event. Its sampling variance is

$$
\operatorname{Var}(\widehat p)=\frac{p_T(1-p_T)}{N}.
$$

The relative standard error behaves approximately like

$$
\frac{\sqrt{\operatorname{Var}(\widehat p)}}{p_T}
=\sqrt{\frac{1-p_T}{Np_T}}.
$$

This formula explains why direct Monte Carlo becomes unattractive when $p_T$ is extremely small: obtaining a useful number of hits requires $N$ to grow roughly like $1/p_T$. But Phase 1 does not demonstrate that difficulty. With $p_T\approx0.258$, the event is common enough for an ordinary baseline check.

The seeded aggregate run used $N=6000$ trajectories and obtained

$$
K=1580,\qquad
\widehat p=\frac{1580}{6000}=0.26333\ldots.
$$

A binomial interval is more informative than reporting only five decimal places. The study uses the Wilson interval. For confidence level $1-\alpha$, with normal quantile $z=z_{1-\alpha/2}$, the Wilson centre and half-width are

$$
c=\frac{\widehat p+z^2/(2N)}{1+z^2/N},
$$

$$
h=\frac{z}{1+z^2/N}
\sqrt{\frac{\widehat p(1-\widehat p)}{N}+\frac{z^2}{4N^2}}.
$$

At 95% confidence, the recorded interval is

$$
[c-h,c+h]=[0.25234,\,0.27463].
$$

This is sampling uncertainty for the direct estimator. It does not include model-form error, biological parameter uncertainty, or an unknown mismatch between the synthetic CTMC and a real genetic circuit.

## Building a reference without declaring Monte Carlo to be truth

To check the direct simulation, Phase 1 uses an independently assembled finite-state projection. Choose a cap $C$ and enumerate legal non-target states satisfying

$$
0\le n_A\le C,\qquad 0\le n_B\le C,
$$

along with valid $U$, $A$-bound, and $B$-bound occupancy states. Add two absorbing sinks. The first collects probability when a transition enters $\mathcal B$. The second collects probability when a path exits the rectangular molecule-count truncation.

If $Q_C$ is the resulting finite generator and $\pi_C(0)$ places all mass at $(6,0,A)$, then the transient distribution at time $T$ is obtained from the matrix exponential,

$$
\pi_C(T)=\pi_C(0)e^{Q_C T}.
$$

Let $p_{\mathrm{target}}(C)$ be mass in the target sink and $p_{\mathrm{overflow}}(C)$ be mass in the overflow sink. Every path counted in the target sink is a genuine hit of the untruncated CTMC, so it supplies a lower bound. In the most conservative case, every overflowed path could later hit the target before $T$. Therefore

$$
p_{\mathrm{target}}(C)
\le p_T
\le p_{\mathrm{target}}(C)+p_{\mathrm{overflow}}(C).
$$

The width of this bracket is exactly the overflow probability, apart from numerical rounding. This construction does not guess the unobserved tail. It records the maximum amount by which omitted states could change the hit probability.

That distinction is why the overflow tolerance was not relaxed after a failed attempt. A finite-state calculation is only useful as a reference if its declared error control survives contact with the chosen state space.

## The failed cap-18 attempt stays in the record

The first saved attempt used $C=18$. It produced the bracket

$$
[0.2575946336,\,0.2575947078]
$$

with overflow probability about $7.42\times10^{-8}$. The preregistered maximum bracket width was $10^{-8}$, so cap 18 failed. The calculation was not relabelled as “close enough,” and the tolerance was not enlarged after the result was seen.

The next attempt increased the count cap to 20. It produced

$$
p_{\mathrm{target}}(20)=0.2575946378813493,
$$

$$
p_{\mathrm{overflow}}(20)=1.6201573386\times10^{-9},
$$

and hence

$$
0.2575946378813493
\le p_T\le
0.2575946395015066.
$$

Rounded to ten decimal places, the Phase-1 reference bracket is

$$
[0.2575946379,\,0.2575946395].
$$

<figure class="article-figure">
  <img src="/science/how-rare-is-a-flip/p03_04_fsp_truncation_audit.svg" alt="Log-scale truncation audit showing cap 18 as a failed FSP attempt above the fixed overflow tolerance and cap 20 as a passing attempt below it." width="1031" height="454" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 2.</strong> The truncation tolerance stayed fixed. Cap 18 failed and remains visible; increasing the molecule cap to 20 reduced overflow below the unchanged Phase-1 threshold.</figcaption>
</figure>

Keeping the failure is more than housekeeping. If only the successful cap were shown, a reader could not tell whether the state space was enlarged according to a fixed rule or whether a tolerance was adjusted until the desired label appeared. The retained attempt documents which control failed and what changed: the cap increased; the criterion did not.

## Comparing the bounded reference with seeded SSA

The FSP midpoint is approximately $0.2575946387$. The seeded direct estimate is $0.26333$, about $0.00574$ above that midpoint. Reporting that absolute difference without sampling uncertainty would exaggerate its meaning. With only 6000 Bernoulli trials, an estimate need not land inside a reference bracket whose width is on the order of $10^{-9}$.

The appropriate smoke question is whether the direct interval is compatible with the reference. It is:

$$
[0.25234,\,0.27463]
\cap
[0.2575946379,\,0.2575946395]
\ne\varnothing.
$$

<figure class="article-figure">
  <img src="/science/how-rare-is-a-flip/p03_02_fsp_vs_naive_ssa.svg" alt="Comparison of the narrow cap-20 FSP probability bracket with the seeded naive-SSA point estimate and its 95 percent Wilson interval." width="1031" height="454" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 3.</strong> The seeded aggregate SSA estimate and its 95% Wilson interval intersect the cap-20 FSP bracket. This is agreement in the Phase-1 smoke regime, not evidence of rare-event acceleration.</figcaption>
</figure>

The two calculations fail differently. Direct SSA has Monte Carlo sampling error but does not truncate molecule counts. The FSP has a controlled state-space truncation whose omitted mass is made explicit, while the matrix-exponential calculation is deterministic for the declared finite generator. Agreement therefore checks more than running the same code twice. It compares independently structured routes to the same fixed-horizon probability.

Still, one agreement is not enough to calibrate an interval procedure. The aggregate interval could intersect the reference by chance, and a single seed hides run-to-run variation. Phase 1 therefore included a small batch diagnostic.

## Thirty intersections out of thirty-two

The diagnostic used 32 independent seeded batches, each containing 300 direct SSA trajectories. Every batch produced its own hit fraction and 95% Wilson interval. The predefined diagnostic called a batch an intersection when its interval overlapped the rigorous FSP bracket.

Thirty of the 32 intervals intersected. Two did not. In the figure, open circles distinguish intersections and cross markers retain the misses.

<figure class="article-figure">
  <img src="/science/how-rare-is-a-flip/p03_03_seeded_interval_calibration.svg" alt="Thirty-two independently seeded 300-trajectory SSA batch estimates with Wilson intervals; thirty intersect the FSP reference and two misses are marked with crosses." width="1031" height="454" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 4.</strong> Thirty of 32 independently seeded batch intervals intersect the FSP bracket. The two misses are preserved. With only 32 batches, this is a smoke diagnostic rather than a precise claim about long-run 95% coverage.</figcaption>
</figure>

Why not announce 93.75% empirical coverage? The arithmetic is correct,

$$
\frac{30}{32}=0.9375,
$$

but the word “coverage” carries a repeated-sampling meaning. Thirty-two batches are too few to estimate a nominal 95% coverage probability tightly. Moreover, the diagnostic is based on interval intersection with a narrow probability bracket, rather than an exactly represented scalar truth. Here the bracket is so tight that the difference is negligible for visual interpretation, yet the distinction should remain explicit.

The two misses are informative rather than embarrassing. At 300 trajectories per batch, binomial variation is large enough that some intervals need not include a fixed probability. Removing those seeds would convert a calibration check into selection on the outcome. Preserving them makes the diagnostic auditable and keeps the article from implying perfect behavior.

## What the four tests actually check

The focused suite contains four tests. One checks that emitted reaction channels have positive rates and preserve valid nonnegative states, including occupancy-dependent repression and free-protein degradation. A second checks that the finite generator is conservative, has nonnegative off-diagonal rates, and has nonpositive diagonal entries. A third compares the FSP implementation with an analytic single-birth first-hit probability,

$$
\Pr(\tau\le T)=1-e^{-\lambda T},
$$

in a special case where that answer is known. The fourth runs the seeded SSA twice in the same analytic case, checks deterministic regeneration under the fixed seed, and checks that its Wilson interval contains the analytic probability.

All four tests passed. The repository check passed, and the documented Phase-1 reproduction passed. These checks connect general invariants to a known special case and then to the saved smoke artifact.

They do not establish that the synthetic rates describe a real cell. They do not prove that every possible reaction-network implementation error has been excluded. They do not validate AMS or FFPilot, because those methods are not part of the Phase-1 result. They also do not unlock the final rarity ladder. Test success is evidence of internal computational consistency, not a license to widen the scientific claim.

## Established knowledge versus the local smoke result

This separation is the central editorial rule for the project.

**Established in the cited primary literature:** rare-event methods have been applied to biochemical and genetic switching; interface placement and reaction-coordinate quality matter; weighted and biased sampling can access transition probabilities and pathways; setup and sampling uncertainty require error control; and finite-state master-equation calculations can provide controlled references in tractable regimes.

**Observed locally in Phase 1:** for one synthetic low-copy exclusive toggle and one fixed-horizon $B$-dominant first-hit event, the cap-20 FSP bracket is $0.2575946379$–$0.2575946395$, seeded direct SSA gives $1580/6000=0.26333$ with Wilson interval $0.25234$–$0.27463$, 30 of 32 smaller batch intervals intersect the reference, and the stated verification checks pass.

**Not observed locally:** any result for adaptive multilevel splitting, FFPilot, importance sampling, progress-coordinate degradation, matched-compute efficiency, rare-event speedup, a preregistered rarity ladder, stationary switching rates, mean first-passage-time accuracy, or biological data.

The distinction blocks a subtle but common reasoning error. A method can be well established in literature without having been implemented in this repository. Conversely, a local baseline can be reproducible without being novel or biologically realistic. Combining the two into “we proved rare-event sampling works for genetic switches” would attribute other researchers’ results to a Phase-1 smoke run.

## Why this event is not yet the promised rare event

The title asks how rare a flip is, but the Phase-1 answer is intentionally mundane: under this configuration and horizon, the declared target is reached with probability about $0.258$. That is roughly one hit in four trajectories, not one in a million.

This moderate probability is useful for software validation. Direct simulation produces many hits, so implementation mistakes can be detected without an enormous compute budget. The finite-state truncation is also tractable, so its overflow mass can be driven below a tight fixed tolerance. These properties make the regime a good smoke test.

They make it a poor basis for a speedup claim. When events are common, a rare-event method can spend more on pilot runs, interfaces, replicas, or coordinate design than direct SSA spends collecting hits. The literature gate explicitly turned the study toward total-cost accounting, but Phase 1 does not measure that accounting. It would be invalid to take the passing reference comparison and infer that an enhanced sampler will later be faster.

Nor does the current probability define a “flip rate.” Shortening or lengthening $T$, changing the target margin, changing the required operator occupancy, or changing the starting state would produce a different probability. The future rarity ladder must freeze those design choices and alter only preregistered regime controls. Until that ladder is run, the project has no empirical statement about how estimator reliability changes with rarity.

## The benchmark that remains locked

The reframed research design calls for several ingredients that are future work, not implied results:

1. one fully specified exclusive-toggle CTMC and fixed event definition across a preregistered rarity ladder;
2. naive SSA, adaptive multilevel splitting, and an error-controlled forward-flux baseline evaluated at matched total compute;
3. a small fixed family of progress coordinates, ranging from mechanistically informed to deliberately misspecified;
4. reference probabilities from error-controlled finite-state calculations wherever tractable, with separately seeded direct simulation only where that reference is infeasible;
5. empirical interval coverage, relative bias or RMSE, variance per total compute, and failed-run rate as primary diagnostics;
6. all pilot, interface-selection, training, and tuning cost charged to the method that incurs it; and
7. a non-rare regime in which enhanced sampling is not assumed to help.

This is a plan, not an achievement list. No item involving AMS, FFPilot, coordinate stress testing, matched-compute comparison, or the final ladder has been executed in the evidence reported here. The literature gate supplies the reason to run such a benchmark; it does not supply its outcome.

The future benchmark could also fail to produce a useful boundary. If preregistered coordinate degradation does not lead to a reproducible change in calibration, or if total-cost accounting leaves no practically meaningful result beyond the established literature, the honest conclusion would be a null or stopped project. Reframing protects against manufacturing novelty from a generic speedup demonstration.

## What this Phase-1 foundation contributes

The contribution is procedural and bounded. The event is written as a first-hit set rather than an informal visual flip. The direct estimator has a named uncertainty interval rather than an unqualified decimal. The finite-state reference exposes overflow mass rather than hiding truncation. The failed cap-18 attempt remains visible. Independent seeds expose two missed batch intervals. Tests include both structural invariants and an analytic special case. The public article states what was not run alongside what passed.

These choices do not make the underlying methods new. They make the next decision easier to audit. If a later estimator disagrees with the cap-20 reference in a tractable regime, investigators can ask whether the problem lies in coordinate choice, sampling variance, interval construction, or implementation. If direct SSA and the reference had failed to agree here, building an elaborate rare-event comparison on top would have been premature.

The most important number may therefore be neither $0.26333$ nor $0.2575946387$. It may be 18: the cap that failed and was preserved. A reliability study earns credibility by retaining the point where a control did not pass, then changing one justified input—the state-space cap—without moving the threshold.

## Reading the figures as evidence

The four figures form a logical sequence rather than decoration. Figure 1 declares the synthetic state model and target event. Figure 2 compares two independently structured probability calculations. Figure 3 exposes run-to-run interval variation and retains the misses. Figure 4 records the truncation failure and the controlled correction. Read in that order, they move from question to comparison to uncertainty to audit trail.

None is a biological diagram in the experimental sense. The network schematic represents the code-level CTMC. None shows AMS particles, forward-flux interfaces, a rarity ladder, or a speedup curve, because those artifacts do not exist in Phase 1. The captions repeat this boundary so that an isolated image cannot easily inherit a stronger claim than the article.

## A compact answer to the title

For the declared synthetic low-copy model, start, target, and horizon, the best Phase-1 answer is the FSP bracket

$$
0.2575946379\le p_T\le0.2575946395.
$$

Seeded direct simulation is compatible with that reference at its stated uncertainty: $1580$ hits in $6000$ trajectories give $0.26333$, with a 95% Wilson interval of $[0.25234,\,0.27463]$. Thirty of 32 smaller batch intervals intersect the bracket.

That answer is about one smoke event. It does not say how often a real genetic switch flips, how fast an enhanced sampler would be, whether a progress coordinate is reliable, or what happens along the final rarity ladder. The literature gate says those broader computational questions have substantial precedent and require a narrower reliability test.

So the project ends Phase 1 with a useful asymmetry: the numerical reference is tight, while the scientific claim is intentionally small. That is the right direction. Precision in a calculation should narrow uncertainty about the declared model; it should not widen the scope of what the model is allowed to represent.

## Primary literature used in the gate

1. Allen, R. J., Warren, P. B., & ten Wolde, P. R. (2005). Sampling Rare Switching Events in Biochemical Networks. *Physical Review Letters, 94*, 018104. [https://doi.org/10.1103/PhysRevLett.94.018104](https://doi.org/10.1103/PhysRevLett.94.018104)
2. Allen, R. J., Frenkel, D., & ten Wolde, P. R. (2006). Simulating Rare Events in Equilibrium or Nonequilibrium Stochastic Systems. *The Journal of Chemical Physics, 124*, 024102. [https://doi.org/10.1063/1.2140273](https://doi.org/10.1063/1.2140273)
3. Morelli, M. J., Tanase-Nicola, S., Allen, R. J., & ten Wolde, P. R. (2008). Reaction Coordinates for the Flipping of Genetic Switches. *Biophysical Journal, 94*, 3413–3423. [https://doi.org/10.1529/biophysj.107.116699](https://doi.org/10.1529/biophysj.107.116699)
4. Roh, M. K., Daigle, B. J., Jr., Gillespie, D. T., & Petzold, L. R. (2011). State-Dependent Doubly Weighted Stochastic Simulation Algorithm for Automatic Characterization of Stochastic Biochemical Rare Events. *The Journal of Chemical Physics, 135*, 234108. [https://doi.org/10.1063/1.3668100](https://doi.org/10.1063/1.3668100)
5. Cao, Y., & Liang, J. (2013). Adaptively Biased Sequential Importance Sampling for Rare Events in Reaction Networks with Comparison to Exact Solutions from Finite Buffer dCME Method. *The Journal of Chemical Physics, 139*, 025101. [https://doi.org/10.1063/1.4811286](https://doi.org/10.1063/1.4811286)
6. Rolland, J., & Simonnet, E. (2015). Statistical Behaviour of Adaptive Multilevel Splitting Algorithms in Simple Models. *Journal of Computational Physics, 283*, 541–558. [https://doi.org/10.1016/j.jcp.2014.12.009](https://doi.org/10.1016/j.jcp.2014.12.009)
7. Tse, M. J., Chu, B. K., Roy, M., & Read, E. L. (2015). DNA-Binding Kinetics Determines the Mechanism of Noise-Induced Switching in Gene Networks. *Biophysical Journal, 109*, 1746–1757. [https://doi.org/10.1016/j.bpj.2015.08.035](https://doi.org/10.1016/j.bpj.2015.08.035)
8. Cao, Y., Terebus, A., & Liang, J. (2016). Accurate Chemical Master Equation Solution Using Multi-Finite Buffers. *Multiscale Modeling & Simulation, 14*, 923–963. [https://doi.org/10.1137/15M1034180](https://doi.org/10.1137/15M1034180)
9. Tse, M. J., Chu, B. K., Gallivan, C. P., & Read, E. L. (2018). Rare-Event Sampling of Epigenetic Landscapes and Phenotype Transitions. *PLOS Computational Biology, 14*, e1006336. [https://doi.org/10.1371/journal.pcbi.1006336](https://doi.org/10.1371/journal.pcbi.1006336)
10. Klein, M. C., & Roberts, E. (2020). Automatic Error Control during Forward Flux Sampling of Rare Events in Master Equation Models. *The Journal of Chemical Physics, 152*, 035102. [https://doi.org/10.1063/1.5129461](https://doi.org/10.1063/1.5129461)
