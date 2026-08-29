---
title: One Integrator Across the Fast-Slow Boundary
slug: one-integrator-across-the-fast-slow-boundary
summary: A frozen Michaelis-Menten property audit verifies conservation, non-negativity and the fixed-step slow limit while preserving the null result that its AP update does not beat backward Euler on error.
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [Enzyme kinetics, Singular perturbations, Numerical analysis]
methods: [Linearly implicit AP integration, Radau IIA reference, Backward Euler and RK4 audit]
researchQuestion: Can one simple linearly implicit update preserve proved structure and the correct fixed-step slow limit across a frozen stiffness grid without implying error or runtime superiority?
dataType: Synthetic dimensionless irreversible Michaelis-Menten trajectories and numerical-property diagnostics
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/one-integrator-across-the-fast-slow-boundary/p08_03_null_error_advantage.svg
period: 2026
validation: All frozen reference, invariant, non-negativity, slow-limit, order, uniform-envelope and event gates passed; eleven mathematical tests and repository checks passed; canonical and rerun signatures were identical; five figure triples passed original-size PNG and PDF-raster QA.
keyFindings:
  - The closed-form linearly implicit update analytically preserves the exact weighted invariant, remains nonnegative with c at most one, and has the correct fixed-step epsilon-to-zero update.
  - The minimum last-pair order is 0.7885, the maximum fixed-step AP-limit discrepancy is 3.4480e-7, and the finest-step uniform weighted-error envelope is 0.0053654 on the frozen grid.
  - "The comparative hypothesis is null: AP error exceeds backward-Euler error at every frozen epsilon by factors from 1.0143 to 2.0444; RK4 fails or becomes nonphysical in 28/40 fixed cases."
limitations:
  - The evidence covers one synthetic dimensionless irreversible Michaelis-Menten family, ten epsilon values, four fixed steps and one ill-prepared initial condition.
  - The project introduces no new AP/IMEX solver or uniform-accuracy theorem and contains no external Radau/BDF/VODE work-precision comparison.
  - There is no biochemical parameter fit, experiment, biological validation, clinical claim or runtime-superiority result.
redirectFrom: []
---

## Editorial overview

The literature gate returned **REFRAME** because Michaelis-Menten singular perturbations, IMEX/AP error analysis, uniformly accurate conditions and positive conservative kinetics integrators are established. Kaiser and Schutz (2018) directly overlaps the proposed method headline.

Read [One Integrator Across the Fast-Slow Boundary](/writing/one-integrator-across-the-fast-slow-boundary/) for the model, update equations, algebraic property audit, tightened Radau reference, frozen error grid, preserved backward-Euler comparison null, RK4 failures, reduced-model boundary and reproduction record.
