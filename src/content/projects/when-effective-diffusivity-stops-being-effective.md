---
title: When Effective Diffusivity Stops Being Effective
slug: when-effective-diffusivity-stops-being-effective
summary: A reproducible Phase-1 benchmark maps where one harmonic coefficient preserves synthetic release from a fixed one-dimensional periodic slab and where finite-cell transients cross frozen error gates.
year: 2026
lastUpdated: 2026-08-29
status: Reproducible study
featured: false
topics: [Transport phenomena, Numerical analysis, Homogenization]
methods: [Periodic homogenization, Conservative finite-volume diffusion, Held-out calibration audit]
researchQuestion: For one frozen symmetric periodic slab family, how do finite period count and diffusivity contrast change the release-curve accuracy of the harmonic homogenized model?
dataType: Synthetic one-dimensional periodic diffusion and release trajectories
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/when-effective-diffusivity-stops-being-effective/p02_03_harmonic_reliability_map.svg
period: 2026
validation: The frozen result passed all nine top-level scientific checks, all 24 joint space-time refinement checks, nine mathematical unit tests, repository and deterministic two-run reproducibility checks, and original-size visual QA.
keyFindings:
  - Among 18 heterogeneous cases, the harmonic model was adequate in seven, grey in two, and in breakdown in nine under predeclared trajectory, t50, and t90 gates.
  - Every tested contrast was in breakdown at N=1, 2, and 4; at N=8 contrast 10 was adequate while contrasts 100 and 1000 were grey; all tested contrasts were adequate at N=16 and 32.
  - Exactly three N=1 cases passed the early-window fit-error gate yet missed held-out t90 by 11.11% to 12.17%; later release was excluded from fitting.
limitations:
  - This is a synthetic diffusion-only Phase-1 benchmark for one one-dimensional periodic binary geometry, one slow boundary phase, fixed perfect sinks, and a 24-case grid.
  - It omits swelling, erosion, degradation, dissolution, binding, reaction, moving interfaces, finite external mass transfer, random or imaged morphology, and physical calibration.
  - Its release fractions and t50/t90 are synthetic curve events; it supports no clinical, dose, efficacy, safety, general homogenization, or universal cell-count claim.
redirectFrom: []
---

## Editorial overview

The literature gate returned **REFRAME**: periodic homogenization, effective-diffusivity release models, microstructure-resolved transport, connectivity effects, and finite-transient deviations are established. The local contribution is an auditable finite-scale replication-extension benchmark, not a new effective coefficient or a general pharmaceutical model.

Read [When Effective Diffusivity Stops Being Effective](/writing/when-effective-diffusivity-stops-being-effective/) for the model derivation, frozen 24-case protocol, exact reliability map, early-fit holdout witnesses, failed-attempt history, numerical and visual audits, reproduction commands, and locked next stages.
