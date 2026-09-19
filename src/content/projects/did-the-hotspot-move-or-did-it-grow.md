---
title: Movement or Growth? An Unbalanced Transport Interpretation Study
slug: did-the-hotspot-move-or-did-it-grow
summary: A controlled periodic-field study tests whether an entropic unbalanced transport cost allocation can be read as the mechanism that generated two maps, using known histories, explicit ambiguity and independent numerical checks.
year: 2026
date: 2026-09-19
lastUpdated: 2026-09-19
status: Reproducible study
featured: false
draft: false
topics: [Optimal transport, Inverse problems, Identifiability, Uncertainty]
methods: [Entropic unbalanced optimal transport, Balanced Sinkhorn baseline, Known generating histories, Deterministic sensitivity analysis]
researchQuestion: When does a static transport-versus-marginal-change cost share agree with a known generating action, and when do identical endpoints admit incompatible histories?
dataType: Synthetic smooth positive densities on a one-dimensional circle; no field observations
codeAvailable: false
dataAvailable: false
studentSuitable: false
projectUrl: https://skckenneth.github.io/writing/did-the-hotspot-move-or-did-it-grow/
heroImage: /images/uot-move-or-grow/02-two-histories-one-endpoint.svg
period: 2026
validation: Analytic single-site solutions, independent convex minimization and POT comparisons, primal-dual checks, exact repeated solves, selected mesh refinement and generating-path continuity tests. Balanced iteration-cap failures and a failed coarse-grid comparison remain recorded.
keyFindings:
  - All 4,320 main entropic UOT fits converge, but convergence does not identify the physical history.
  - Static allocation and generating dynamic action are distinct quantities; their agreement is tested rather than assumed.
  - Equal-mass endpoint pairs admit both moving and stationary-reaction histories, imposing a worst-history fraction error of at least one half for any endpoint-only diagnostic.
  - Identical maps can produce positive regularized transport cost, including a 99.29% static share in the illustrated no-change control.
  - Fourteen of 540 normalized balanced fits reach the fixed iteration cap and are not treated as converged baseline solutions.
limitations:
  - The static quadratic-cost KL formulation is not exactly the dynamic Wasserstein–Fisher–Rao metric.
  - Deterministic parameter grids are not independent samples; category cutoffs and cost prices are conventions.
  - This is an established-method synthetic interpretation study, not a new solver, novelty claim or ecological validation.
---

## A correspondence is not a witnessed history

Two maps may show a hotspot changing location without revealing whether material moved or local density changed. This study supplies known histories to a controlled benchmark, then lets the estimator see only their endpoints.

Four scenario families cover translation, uniform growth, mixed movement and local growth, and swapped two-peak weights. Three geometries, 256-cell periodic fields and fixed penalty and entropy settings make the comparison explicit. A normalized balanced baseline shows what is lost when total mass is removed before fitting.

## What is established

The sharpest example is structural: the same endpoint pair comes from a moving history and a stationary reaction history. No endpoint-only estimator can distinguish those histories without additional assumptions or observations.

Numerical checks support the implemented objective and the selected main-grid precision. They do not convert a minimum-cost correspondence into a causal explanation. The study retains negative controls, parameter sensitivity and nonconverged baseline entries instead of using endpoint fit alone as evidence of mechanism recovery.

Read [Did the Hotspot Move, or Did It Grow?](/writing/did-the-hotspot-move-or-did-it-grow/) for the bilingual long-form explanation, eight data-driven figures and the next testable question: what extra observation would exclude the competing history?
