---
title: Can a Mesh Preserve the Event?
slug: can-a-mesh-preserve-the-event
summary: A reproducible Phase-1A audit stops before adaptive-mesh comparison because the frozen modal-transfer event never satisfies its 50-unit establishment rule.
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [Numerical analysis, Mathematical biology, Adaptive finite elements]
methods: [Uniform P1 finite elements, Conservative finite differences, Event admissibility audit]
researchQuestion: Does one frozen modal-transfer definition admit a converged independent reference before any goal-adaptive finite-element comparison is attempted?
dataType: Synthetic one-dimensional growing-domain reaction-diffusion trajectories and event diagnostics
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/can-a-mesh-preserve-the-event/p01_01_event_score.svg
period: 2026
validation: Two unchanged canonical attempts share one numerical signature; all 17 tests and independent assembly/order checks pass, and all six canonical PNG/PDF figure pairs pass original-size overlap and clipping review.
keyFindings:
  - Every growing-domain FEM and FD solve has a diagnostic raw S=0.5 crossing near time 539.45 to 541.39, but no solve satisfies the frozen 50-unit establishment rule.
  - The longest simultaneous amplitude-and-modal-fraction run is 16 time units, so every formal event time remains null and the terminal verdict is STOP_PHASE1A.
  - Residual adaptivity, the adjoint, goal marking, estimator effectivity, matched-resolution comparisons, and efficiency claims remain locked and were not executed.
limitations:
  - The result is a reference-feasibility null for one synthetic one-dimensional prescribed-growth Schnakenberg benchmark and one event definition.
  - Passing solver verification cannot rescue the failed event gate, and a raw score crossing cannot be substituted after seeing the result.
  - No biological calibration, adaptive-mesh result, general finite-element ranking, or computational-efficiency conclusion is supported.
redirectFrom: []
---

## Editorial overview

The literature gate returned **REFRAME**: growing-domain reaction–diffusion patterns, adaptive FEM, nonlinear reaction–diffusion goal adaptivity, and first-threshold-time error estimation all have direct precedents. The project therefore began with a narrower prerequisite: establish that one smooth modal-transfer event exists and has an independently reproducible reference.

That prerequisite failed. Read [Can a Mesh Preserve the Event?](/writing/can-a-mesh-preserve-the-event/) for the frozen event definition, the raw crossing that cannot be promoted to an event, FEM/FD concordance, the no-growth control, numerical verification, rejected-to-accepted visual history, exact reproduction record, and the adaptive claims that remain locked.
