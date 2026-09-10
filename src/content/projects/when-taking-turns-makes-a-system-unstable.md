---
title: FairChoice Dynamics — When Taking Turns Makes a System Unstable
slug: when-taking-turns-makes-a-system-unstable
summary: A delayed two-choice model separates equal update counts from stable feedback. Exact interval certification, exhaustive finite searches and synthetic experiments explain why one extra slot of scheduling freedom can matter.
year: 2026
date: 2026-09-10
lastUpdated: 2026-09-10
status: Reproducible study
featured: false
draft: false
topics: [Dynamical systems, Scheduling, Delayed feedback, Mathematical modeling]
methods: [Augmented-state linearization, Exact polynomial certification, Exhaustive enumeration, Paired synthetic experiments]
researchQuestion: With fixed cohorts, delayed observations and one update per slot, what is the smallest maximum cyclic update gap that admits a balanced locally stabilizing schedule?
dataType: Exact symbolic model calculations and synthetic trajectories; no human or field observations
codeAvailable: false
dataAvailable: false
studentSuitable: false
projectUrl: https://skckenneth.github.io/writing/when-taking-turns-makes-a-system-unstable/
heroImage: /images/fairchoice-dynamics/02-same-count-different-timing.svg
period: 2026
validation: Independent symbolic constructions of the period maps agree. Rational polynomial sign certificates cover the entire stated interval. Complete period-8 and bounded period-12 enumerations, deterministic sensitivity cases and seed-paired synthetic experiments retain negative outcomes.
keyFindings:
  - For four equal fixed cohorts and delay one, the smallest stabilizing maximum gap is five throughout beta in [3.75,4.25]. Round robin is unstable and the displayed gap-5 schedule is locally exponentially stable.
  - At beta=4, the best evaluated gap-5 per-slot radii are 0.97159 at period 8 and 0.90180 at period 12; these are finite-search results, not an unrestricted optimum.
  - IID updates have lower synthetic fluctuation in the tested cases but no deterministic hard update-gap bound. Delay two retains nonzero tail fluctuation for both fixed schedules.
limitations:
  - The theorem concerns local stability in a specified homogeneous model, not global attraction, actual waiting times or human behaviour.
  - Twenty exposed development seeds per policy and population are not a held-out confirmatory sample.
  - Novelty, a journal submission and student authorship are not claimed. The public article is a personal mathematical research explanation.
---

## Equal opportunities do not settle the timing question

Four fixed groups choose between two identical options using information that is one update old. A round-robin schedule looks fair: each group updates once every four slots. Yet, in this model, its regularity reinforces delayed overreaction. The balanced eight-slot sequence **1,2,3,1,4,3,2,4** changes the ordering without changing anyone's long-run frequency.

The exact result is confined to response strengths **3.75–4.25**. Across that whole interval, round robin is unstable and the displayed schedule is locally exponentially stable. A separate combinatorial lower bound rules out a smaller stabilizing maximum gap: every schedule with a gap bound of four must repeat a permutation of the groups. Thus the minimal feasible gap is five, not merely the smallest gap found in a numerical search.

## What the experiments add

All **2,520** balanced period-8 schedules were evaluated. The period-12 search screened **369,600** balanced candidates and evaluated the **1,488** with maximum gap at most five. The best evaluated gap-5 period-12 schedule contracts faster per slot than the period-8 construction, showing that the smallest fairness relaxation and the fastest convergence are different objectives.

Deterministic initial-state and phase checks and **320** finite-agent runs test specific extensions, not a global theorem. The comparison preserves inconvenient results: independent random updating has smaller fluctuation in the tested populations but cannot promise a fixed maximum update gap; changing the information delay can remove the stabilizing behaviour.

Read [When Taking Turns Makes a System Unstable](/writing/when-taking-turns-makes-a-system-unstable/) for the model, exact argument, eight research figures, paired comparisons and limits. This is a personal research study using synthetic data. It is not a student contribution record, an empirical service trial or a claim of a new published theorem.
