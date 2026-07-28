---
title: Can a Scientific Field Reward Novelty Without Losing Reliability?
slug: scientific-incentives-reliability
summary: An evolutionary agent-based model treats novelty, rigour, and replication credit as competing institutional incentives and maps their discovery–reliability frontier.
date: 2026-07-24
lastUpdated: 2026-07-28
featured: true
topics: [agent-based model, metascience, institutional design]
heroImage: /science/scientific-incentives-reliability/science_policy_simplex.svg
draft: false
type: Research Notes
archived: false
readingMinutes: 20
scienceProject: scientific-incentives-reliability
redirectFrom: []
---

“Reward better science” sounds simple until the reward must be defined. Novel findings can open new directions, rigorous methods can reduce false claims, and replications can correct the record. A field has limited attention and career credit, so strengthening one incentive can weaken another.

This study asks:

> Which mixes of novelty reward, preregistration or rigour credit, and replication credit improve the reliability of a competitive research field without collapsing its discovery rate?

It is an institutional thought experiment, not an estimate of a real discipline. Its role is to make feedback loops explicit and to expose trade-offs that a verbal argument can hide.

## Laboratories as evolving strategies

Each simulated laboratory carries three continuous traits: preference for novel questions, investment in methodological rigour, and willingness to replicate. Original hypotheses may be true or false. Higher novelty has lower prior truth in this declared world; higher rigour increases power and reduces false-positive rate. Published work earns credit, and successful laboratories are more likely to be imitated, with mutation.

Replications preferentially target influential but uncertain claims. They use resources that could otherwise produce new claims, but they can update the reliability of the published record.

Policy weights lie on a simplex:

$$
w_N+w_R+w_P=1,
$$

where $w_N$ rewards novelty, $w_R$ rewards rigour, and $w_P$ rewards replication. The novelty-only corner is the baseline.

<figure class="article-figure">
  <img src="/science/scientific-incentives-reliability/science_policy_simplex.svg" alt="Simplex map of scientific policy weights with reliability and discovery results annotated." loading="lazy" />
  <figcaption><strong>Figure 1.</strong> Policy simplex. Every point is a complete reward mix; contours and numeric labels show that the result is not a one-dimensional “more replication is better” story.</figcaption>
</figure>

## What “reliability” and “discovery” mean

Reliability is the proportion of supported original claims in the model’s record that are true in the simulator. Discovery rate counts true original findings per unit activity. Publication and replication rates are also retained.

These are model observables, not direct measures of scientific quality. A real claim can be partly true, a replication can differ in design, and publication can change belief without a binary verdict. The simplified metrics are useful only because their definitions remain fixed across policy comparisons.

## The novelty-only failure case

Across 14 seeds, the novelty-only corner yields mean reliability approximately $0.463$, discovery rate $0.171$, mean rigour $0.271$, and mean novelty $0.916$. A mean-field positive predictive value calculation gives $0.440$, reasonably close to the agent-based result.

That corner is not intended as a caricature of any actual journal. It tests a feedback mechanism: if credit follows surprising positive claims while costly rigour receives no direct reward, lower-rigour high-novelty strategies can reproduce institutionally even when they degrade the record.

## The highest reliability is not automatically the best policy

The replication-only corner reaches reliability about $0.995$, but discovery rate falls to $0.065$. It spends most activity revisiting existing claims, so the record is dependable but new true findings arrive slowly.

More interesting points lie on the nondominated frontier. A mix with approximately $0.833$ rigour and $0.167$ replication achieves reliability $0.992$ and discovery rate $0.451$. Increasing replication to one third gives reliability $0.993$ and discovery $0.442$. A balanced rigour–replication mix gives reliability $0.994$ and discovery $0.342$.

<figure class="article-figure">
  <img src="/science/scientific-incentives-reliability/science_reliability_frontier.svg" alt="Pareto frontier between reliability and discovery rate for alternative scientific incentive policies." loading="lazy" />
  <figcaption><strong>Figure 2.</strong> Reliability–discovery frontier. Policies below and left of the frontier are dominated inside this simulator; choosing among frontier points still requires values and costs outside the model.</figcaption>
</figure>

The surprising model-specific result is that strong rigour credit can improve both reliability and discovery relative to novelty-only reward. Better methods raise the fraction of genuine findings enough to compensate for reduced novelty. Replication then supplies additional correction, but excessive replication eventually crowds out original work.

## Evolution matters

The policy does not simply change one generation of publications. It changes which laboratory strategies receive credit, which changes the strategy distribution, which changes future evidence.

<figure class="article-figure">
  <img src="/science/scientific-incentives-reliability/science_strategy_evolution.svg" alt="Evolution of mean novelty, rigour and replication strategies under selected incentive policies." loading="lazy" />
  <figcaption><strong>Figure 3.</strong> Strategy evolution. Institutional weights alter the population of research behaviours over repeated selection cycles; endpoint averages hide this path.</figcaption>
</figure>

This endogenous adaptation is why a static cost–benefit table is insufficient. A rule rewarding rigorous outcomes may initially reduce publication volume, then change the population toward methods that produce more true positives. Conversely, a rule can be gamed in a richer model; the present implementation does not include strategic relabeling or metric manipulation.

## Checks against one-run storytelling

The analysis uses 28 policy points and 14 independent seeds per policy. Standard deviations are shown rather than smoothing away stochastic variation. Population-size sensitivity tests whether the result is driven by a very small laboratory population. Limiting cases verify that increasing power and lowering false-positive rate move positive predictive value in the expected direction.

The mean-field calculation is especially useful. It removes evolutionary selection and claim-network history, so it cannot reproduce the whole agent model. Its agreement with the broad reliability scale indicates that the simulator’s basic truth–power–false-positive arithmetic is coherent.

## What the model omits

Real scientific institutions include heterogeneous fields, collaboration, prestige networks, funding constraints, career stages, selective reporting, measurement error, theory development, data reuse, and disagreement about what counts as replication. Truth is not a simulator bit visible to an evaluator.

The policy weights also assume credits are commensurable and enforceable. In practice, a nominal reward for rigour can become paperwork, and a replication incentive can favour easy targets. Goodhart-style adaptation is absent.

Accordingly, the study does not recommend a journal scorecard. It establishes a conditional mechanism:

> When laboratory strategies evolve in response to publication credit, directly rewarding rigour and some replication can move the simulated field to a better reliability–discovery frontier than novelty-only credit.

## Research extensions

A research-facing next version would add:

- field heterogeneity in base rates and experimental cost;
- explicit publication bias and file drawers;
- network diffusion of influential claims;
- strategic effort allocation and imperfect auditing;
- replication designs with heterogeneous validity;
- shocks that change methods or available instrumentation;
- calibration to empirical metascience summaries with held-out targets.

The current result is valuable precisely because these are listed as missing mechanisms rather than silently assumed away.

## References

1. P. E. Smaldino and R. McElreath, “The natural selection of bad science,” *Royal Society Open Science*, 2016. [doi:10.1098/rsos.160384](https://doi.org/10.1098/rsos.160384).
2. L. Tiokhin *et al.*, “Competition for priority harms the reliability of science, but reforms can help,” *Nature Human Behaviour*, 2021. [doi:10.1038/s41562-020-01040-1](https://doi.org/10.1038/s41562-020-01040-1).
3. M. Gordon *et al.*, “Examining the replicability of online experiments selected by a decision market,” *Nature Human Behaviour*, 2024. [doi:10.1038/s41562-024-01879-8](https://doi.org/10.1038/s41562-024-01879-8).
4. J. P. A. Ioannidis, “Why most published research findings are false,” *PLoS Medicine*, 2005. [doi:10.1371/journal.pmed.0020124](https://doi.org/10.1371/journal.pmed.0020124).

