---
title: Positive and Conservative Time Stepping
slug: positive-conservative-time-stepping
summary: A stiff transfer-network benchmark compares explicit methods with a positivity- and mass-preserving linearly implicit update.
year: 2026
lastUpdated: 2026-07-28
status: Reproducible study
featured: true
topics: [Reliability and Uncertainty, Mathematical Modeling Education]
methods: [Geometric integration, Stiff ODEs, Adaptive step doubling]
researchQuestion: When do standard explicit schemes create negative states, and what accuracy is traded for feasibility?
dataType: Synthetic conservative-network benchmark
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/positive-conservative-time-stepping/positive_integrator_trajectories.svg
period: 2026
validation: Matrix-exponential reference, invariant checks, feasibility atlas, and tolerance study.
keyFindings: [Euler is negative in 38.46% and RK4 in 25.17% of 429 tested cases., The positive implicit method has zero negative cases and mass drift below 9e-14.]
limitations: [Linear conservative transfer networks only., No universal comparison with all high-order structure-preserving solvers.]
redirectFrom: []
---

## Editorial overview

The benchmark distinguishes algebraic conservation, computed conservation, positivity, and accuracy. Read [When a Numerical Method Creates Negative Matter](/writing/positive-conservative-time-stepping/).

