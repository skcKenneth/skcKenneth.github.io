---
title: When a Reduced Ventilation Model Leaves Its Training Regime
slug: when-a-reduced-ventilation-model-leaves-its-training-regime
summary: A reproducible synthetic POD and POD-DEIM audit stops at nominal inadmissibility before any schedule, source-location, or ventilation-shift reliability claim can be made.
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [Reduced-order modeling, Indoor transport, Numerical reliability]
methods: [Proper orthogonal decomposition, Discrete empirical interpolation, Conservative finite-volume transport]
researchQuestion: Can nominally trained POD and POD-DEIM first pass a frozen nominal trust gate before schedule, source-location, and ventilation shifts are interpreted?
dataType: Synthetic two-dimensional passive-scalar trajectories, person-zone summaries, and reduced-model diagnostics
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_01_basis_nominal_gate.svg
period: 2026
validation: The full-order reference passes positivity and time-refinement gates; 20 tests pass, two canonical attempts have byte-equivalent numerical JSON and one signature, and all five PNG/PDF figure pairs pass original-size overlap and clipping review.
keyFindings:
  - Nominal POD and POD-DEIM field errors are 0.181929901217 and 0.364300559015 against the frozen 0.05 gate, so the phase stops before shift attribution.
  - The 24-point residual warning has Spearman correlation -0.50 against error, below the declared +0.60 gate, and fails the worst-case ranking test.
  - Median accepted-attempt POD-DEIM online speedup is 2.978205301x against a 5x gate; timing excludes offline construction and is environment-specific.
limitations:
  - Because nominal admissibility fails, shifted trajectories are diagnostic only and cannot establish that distribution shift caused additional reliability loss.
  - The five-case sampled-residual result refutes one frozen warning rule, not all residual diagnostics or all POD/DEIM models.
  - The benchmark is a deterministic synthetic passive-scalar surrogate, not a calibrated building, health, infection-risk, controller-safety, or deployment study.
redirectFrom: []
---

## Editorial overview

The literature gate returned **REFRAME** because POD for indoor fields, ventilation optimization, boundary interpolation, DEIM hyper-reduction, and DEIM error estimation already have direct precedents. The defensible project is a transparent trust-gate audit, not a new POD or DEIM method.

The full-order reference verifies, but both reduced models fail the nominal control. The terminal verdict is **STOP_REFERENCE_OR_ROM_INADMISSIBLE**. Read [When a Reduced Ventilation Model Leaves Its Training Regime](/writing/when-a-reduced-ventilation-model-leaves-its-training-regime/) for the frozen transport model, training and holdout design, exact nominal failure, non-attributable shift diagnostics, refuted warning and speed gates, two-run reproduction record, visual QA, and the real-building claims that remain outside scope.
