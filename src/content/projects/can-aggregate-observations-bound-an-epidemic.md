---
title: Bounding a Hidden Epidemic from Delayed Aggregates
slug: can-aggregate-observations-bound-an-epidemic
summary: A synthetic six-region SIR benchmark compares central ensemble intervals with validated constrained-box enclosures, separating conditional containment from useful precision and testing what remains predictable after observations stop.
year: 2026
date: 2026-09-12
lastUpdated: 2026-09-12
status: Reproducible study
featured: false
draft: false
topics: [Dynamical systems, Set-membership estimation, Data assimilation, Uncertainty]
methods: [Validated interval integration, Conservation contractors, Ensemble Kalman filtering, Paired synthetic experiments]
researchQuestion: How do aggregation and known reporting delay affect hidden-state containment, interval width and daily-grid peak forecasts under a fixed bounded-error epidemic model?
dataType: Synthetic six-region SIR trajectories and bounded-error observations; no patient or field data
codeAvailable: false
dataAvailable: false
studentSuitable: false
projectUrl: https://skckenneth.github.io/writing/can-aggregate-observations-bound-an-epidemic/
heroImage: /images/set-membership-epidemic-bounds/03-filtering-intervals.svg
period: 2026
validation: Conditional containment is argued through initial sets, validated flow, conservative daily disturbances, correctly timed observation contractions and delay propagation. Tests also check numerical convergence, batch independence, future-data exclusion and explicit failure cases.
keyFindings:
  - A single grouped total admits different regional allocations; this snapshot ambiguity is not a dynamical unobservability theorem.
  - Central 95% ensemble intervals and deterministic bounded-error enclosures answer different uncertainty questions.
  - The transparent first-order box representation can lose enough dependence to become uninformative even while retaining the true state.
  - In the two-group, five-day-delay baseline, mean population-normalised width is 48.40% for the set enclosure and 0.951% for EnKF; EnKF component inclusion is 94.05%.
  - Once observations stop for the day-20 forecast, baseline set peak bounds retain the full 0–6,000 size range and days 21–120, illustrating containment without useful precision.
limitations:
  - Rates, mobility, delays and uncertainty bounds are specified synthetic inputs, not inferred properties of a real disease.
  - A containment argument is conditional on those inputs and validated arithmetic; empirical no-miss counts alone are not a proof.
  - This compares two declared implementations, not the best possible set representation or tuned probabilistic estimator, and is not public-health advice.
---

## A narrow estimate and a safe bound are not the same output

The study observes current infected stocks through six, two or one reporting groups, with known whole-day delays. Both estimators use the same initial information and received observations. Regional populations change under movement even though their total remains 6,000.

An EnKF uses distributional information across simulated members. A constrained-box estimator retains states consistent with bounded errors and validated dynamics. The scientific question is not simply which shaded band looks smaller: it is what each band means, whether it contains truth, and how much useful information survives.

## What the benchmark examines

Eighteen primary settings and four one-factor settings each use 50 replicates. The comparison records component and simultaneous trajectory inclusion, population-normalised width and amortised update time. At day 20, a separate forecast stops assimilating data and bounds the total-infection peak on the daily grid through day 120.

The study also preserves counterexamples: an out-of-assumption measurement can exclude truth without producing an empty set, mutually contradictory measurements can produce an empty set, and long unobserved box propagation can become wide even for a disease-free analytic trajectory. These are different failures with different explanations.

Read [If You Only Observe Aggregates, Can You Still Bound the Hidden Epidemic?](/writing/can-aggregate-observations-bound-an-epidemic/) for the full bilingual study, eight data-driven figures, numerical results and limitations. The fixed synthetic model lets us inspect hidden truth; its outcomes neither validate epidemic policy nor establish a new estimation method.
