---
title: "When Publication Count Selects the Method"
slug: when-publication-count-selects-the-method
summary: A cultural-evolution model shows how publication bias and visible output can select low-effort methods, and when replication audits change that selection pressure.
date: 2026-07-30
lastUpdated: 2026-07-30
featured: true
topics: [metascience, agent-based modelling, publication bias, replication, institutional incentives]
heroImage: /science/publish-or-perish-method-selection/effort-evolution.svg
type: Research Notes
archived: false
readingMinutes: 20
scienceProject: publish-or-perish-method-selection
redirectFrom: []
---

Institutions often say they value reliable knowledge while rewarding what they can count quickly. Publications are visible; methodological care is harder to observe. If laboratories copy practices associated with career success, that measurement gap can change which practices persist.

This article examines the mechanism with an agent-based model. It does **not** claim that scientists consciously maximise false discovery, and its numbers are not estimates for a discipline. Every laboratory in the model follows the same declared rules honestly. The question is structural:

> If successful methods are culturally inherited, what does a publication-centred reward system select?

The model compares publication-count selection with institutions that audit positive findings and reduce the future success of laboratories whose claims fail independent replication.

## One inherited trait: methodological effort

Laboratory \(i\) has effort

$$
e_i\in[0,1].
$$

Higher effort raises statistical power and lowers the false-positive probability:

$$
\operatorname{power}(e)=0.20+0.75e,
$$

$$
\alpha(e)=0.01+0.35(1-e).
$$

Care also costs time. Expected study production is

$$
\lambda(e)=\lambda_0 e^{-ce},
$$

with default cost \(c=1.6\). The base rate that a newly tested hypothesis is true is \(\pi=0.10\). A low base rate matters because the false-discovery fraction depends on both test behaviour and the composition of the hypothesis pool:

$$
\operatorname{FDR}
=
\frac{(1-\pi)\alpha}
{\pi\,\operatorname{power}+(1-\pi)\alpha}.
$$

Even a moderate false-positive rate can dominate published positives when false hypotheses are common.

Each cultural generation contains 200 laboratories. Successful laboratories are more likely to seed the next generation; offspring inherit parental effort with Gaussian mutation and clipping to the allowed interval. “Inheritance” represents training, prestige-biased imitation, hiring, and institutional copying—not biological reproduction.

## Publication and audit rules

Positive findings are always publishable. A negative result is published with probability \(1-\rho\), where the default publication-bias parameter is \(\rho=0.80\).

Without auditing, laboratory score is driven by publication count. Under an audit policy,

$$
F_i=N_{\mathrm{pub},i}
-P\,N_{\mathrm{failed\ replication},i},
$$

where a positive claim is audited with probability \(a\), and \(P\) is the consequence of failure. In the model, true claims replicate with probability \(0.85\); false claims replicate with probability \(0.05\).

This creates competing gradients:

- low effort produces more studies and more chances to publish;
- high effort improves power and reduces false positives;
- audits expose unreliable positive claims;
- consequences make those exposures relevant to future cultural selection.

The mechanism is deliberately simple enough to inspect. That transparency is important: an agent-based result is difficult to interpret if update order, selection, mutation, and publication rules are hidden.

## Institutions change the direction of selection

The default study follows 180 generations and compares three regimes across 14 stochastic populations:

1. publication count: no audits and no failed-replication consequence;
2. moderate audit: \(a=0.30\), \(P=8\);
3. strong replication policy: \(a=0.55\), \(P=12\).

<figure class="article-figure">
  <img src="/science/publish-or-perish-method-selection/effort-evolution.svg" alt="Mean methodological effort over 180 generations under publication-count, moderate-audit, and strong-replication institutions." width="960" height="580" loading="eager" decoding="async" />
  <figcaption><strong>Figure 1.</strong> Shaded intervals summarise replicate populations. Mean final effort was \(0.0493\) under publication-count selection and \(0.8584\) under the configured strong policy.</figcaption>
</figure>

The result does not require fraud. Low effort receives an output advantage when publications are rewarded and failed claims have no future cost. Once replication failure changes reproductive success in the cultural model, the selection gradient reverses.

This is a conditional mechanism claim: **given these functions and institutional rules**, practices evolve in opposite directions. It is not evidence that a real laboratory has effort \(0.05\) or \(0.86\).

## Paper volume and reliable information are different objectives

The model records publications, false-discovery fraction among positive findings, and expected probability that a positive claim will replicate.

<figure class="article-figure">
  <img src="/science/publish-or-perish-method-selection/reliability-outcomes.svg" alt="Publication output, false-discovery fraction, and expected replication outcomes for three simulated institutional regimes." width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 2.</strong> The publication-count regime ended near an FDR of \(0.9302\); the strong policy ended near \(0.4187\). Higher reliability is accompanied by lower study throughput in this model.</figcaption>
</figure>

The strong-policy FDR remains substantial. With only ten percent of hypotheses true, reliable inference is difficult even after effort improves. A policy cannot manufacture a favourable hypothesis base rate.

The output trade-off also prevents a simplistic policy conclusion. High-effort laboratories conduct fewer studies under \(\lambda(e)\). The simulation can display a Pareto problem—reliability versus paper throughput—but cannot decide how society should value those outcomes.

The meaningful comparison is therefore not “which policy produces the most papers?” It is “what information objective do the papers serve, at what audit cost, and with what error profile?”

## A two-lever policy surface

Auditing has two separable components: the probability that a claim is checked and the consequence when it fails. The experiment sweeps

$$
a\in\{0,0.10,0.20,0.30,0.40,0.55\}
$$

and

$$
P\in\{0,2,4,8,12,16\},
$$

using five replicate populations per cell.

<figure class="article-figure">
  <img src="/science/publish-or-perish-method-selection/policy-effort-heatmap.svg" alt="Heat map of final methodological effort across audit probability and failed-replication penalty." width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 3.</strong> Frequent audits with negligible consequences are weak; severe consequences that are almost never applied are also weak. The transition depends on their interaction.</figcaption>
</figure>

The strongest tested cell, \(a=0.55\) and \(P=16\), produced mean final effort near \(0.891\). The surface is threshold-like because selection must overcome the productivity advantage of low effort. Small changes around that boundary can move the population toward different long-run regions.

<figure class="article-figure">
  <img src="/science/publish-or-perish-method-selection/policy-fdr-heatmap.svg" alt="Heat map of final false-discovery fraction across the same audit probability and penalty grid." width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 4.</strong> Reliability improves where policy changes selected effort. The strongest tested cell reached an FDR near \(0.374\), not zero.</figcaption>
</figure>

An audit system also consumes resources, creates appeal and governance problems, and can be gamed. None of those costs appears in the score. A real policy study would include audit accuracy, administrative cost, heterogeneous fields, strategic adaptation, and consequences of false accusation.

## Publication bias changes the competitive environment

The bias experiment varies the probability that a negative result remains unpublished:

$$
\rho\in\{0,0.2,0.4,0.6,0.8,0.95\}.
$$

<figure class="article-figure">
  <img src="/science/publish-or-perish-method-selection/publication-bias-sweep.svg" alt="Final methodological effort over publication-bias levels, comparing publication-count selection with a strong replication policy." width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 5.</strong> Suppressing negative results strengthens low-effort selection when positive output is the main visible reward. Consequential replication reduces sensitivity to that bias but does not solve it.</figcaption>
</figure>

Publication bias and weak methodology interact. If positive findings are preferentially visible, practices that generate more positives receive more cultural exposure. Auditing changes the payoff of fragile positives, but it does not make negative results visible, remove selective reporting within studies, or correct a distorted research agenda.

Registered reports, rewards for informative negative findings, data and code review, post-publication verification, and random audits act on different parts of the system. The model should therefore be read as a component experiment, not a complete reform package.

## How this differs from the earlier reliability model

The site already contains [a model of incentives and scientific-field reliability](/writing/scientific-incentives-reliability/). That project studies how rewards for novelty, rigour, and replication move a field through a broader policy simplex.

The present study asks a narrower question. It gives laboratories one inherited methodological-effort trait, introduces explicit publication bias, and treats auditing as detection plus consequence. Its contribution is the selection surface over audit frequency and penalty, not another retelling of the novelty-versus-rigour model.

The distinction matters editorially. Similar themes do not require duplicate articles when the mechanisms, experiments, and decisions differ.

## What was verified

Three automated tests passed. They check the monotonic relationships between effort, power, and false-positive probability; reproduce a population run exactly under a fixed seed; and confirm that the strong configured audit policy selects greater effort than the publication-count baseline.

The output manifest contains 23 checksum-validated files. The default-run values quoted here—effort \(0.0493\) versus \(0.8584\), and FDR \(0.9302\) versus \(0.4187\)—were read from the validated metadata and cross-checked against summary tables.

This verification establishes deterministic software behaviour where expected and reproducible stochastic summaries under declared seeds. It does not empirically identify any causal effect of audits, publication bias, or career incentives.

## What the model leaves out

Real research systems contain features absent here:

- fields with different hypothesis base rates and measurement technologies;
- collaboration, citation, prestige, funding, and hiring networks;
- career stages, resource inequality, and laboratory closure;
- preregistration, registered reports, open data, and correction;
- selective analyses within a study;
- honest disagreement about methods;
- strategic gaming of audit targets;
- learning from failed replications;
- audit errors and disproportionate penalties.

The scalar effort trait is especially restrictive. Higher effort simultaneously raises power and reduces false positives, although real methods have multiple dimensions and trade-offs. A richer model should allow laboratories to allocate resources among sample size, measurement quality, transparency, robustness checks, and replication.

## From mechanism experiment to research programme

A stronger next stage would combine three forms of evidence:

1. **formal analysis:** derive when the expected score gradient with respect to effort changes sign;
2. **simulation robustness:** vary truth base rates, productivity costs, mutation, selection strength, audit error, and network structure;
3. **empirical calibration:** use transparent metascientific datasets to constrain publication delay, replication outcomes, or audit costs without pretending one field represents all science.

Policy evaluation should report reliability, throughput, cost, inequality, and unintended adaptation. No single heat-map cell should be labelled “optimal” without a declared social objective.

The durable lesson is not that punishment fixes science. It is that selection responds to realised rewards. If reliability is costly and mostly invisible while publication count is cheap to observe, institutions can select practices that undermine their stated aim without requiring bad intentions from any individual.

## References

1. Smaldino, P. E., & McElreath, R. (2016). The natural selection of bad science. *Royal Society Open Science, 3*, 160384. [https://doi.org/10.1098/rsos.160384](https://doi.org/10.1098/rsos.160384)
2. Nissen, S. B., Magidson, T., Gross, K., & Bergstrom, C. T. (2016). Publication bias and the canonization of false facts. *eLife, 5*, e21451. [https://doi.org/10.7554/eLife.21451](https://doi.org/10.7554/eLife.21451)
3. Barnett, A. G., Zardo, P., & Graves, N. (2018). Randomly auditing research labs could be an affordable way to improve research quality: A simulation study. *PLOS ONE, 13*, e0195613. [https://doi.org/10.1371/journal.pone.0195613](https://doi.org/10.1371/journal.pone.0195613)
4. Smaldino, P. E. (2023). *Modeling Social Behavior*. Princeton University Press.
