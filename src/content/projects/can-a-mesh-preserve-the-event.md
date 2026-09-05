---
title: Can a Mesh Preserve the Event?
slug: can-a-mesh-preserve-the-event
summary: A matched-work Phase-1 experiment finds that a uniform mesh preserves a growing-domain modal-transition time better than one-shot residual and DWR meshes at 36 elements.
year: 2026
lastUpdated: 2026-09-05
status: Reproducible study
featured: false
topics: [Numerical analysis, Mathematical biology, Adaptive finite elements]
methods: [Uniform P1 finite elements, Residual mesh adaptation, Dual-weighted residual adaptation]
researchQuestion: At matched production work, does one-shot goal-oriented adaptation preserve a smooth modal-transition time better than uniform or residual meshes?
dataType: Synthetic one-dimensional growing-domain reaction-diffusion trajectories, meshes, and modal-transition diagnostics
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/can-a-mesh-preserve-the-event/phase1_reference_event.svg
period: 2026
validation: The spectral reference changes by only 0.000641 under simultaneous space-time refinement; the event is transversal, the adjoint sensitivity matches finite differences to 8.24e-9 relative difference, and all four figures pass original-size overlap and clipping review.
keyFindings:
  - The independent reference event is 46.7916; refinement moves it by 0.000641 and the crossing slope is 0.0584.
  - At equal 36-element production work, uniform has event-time error 2.6001, DWR 3.2752, and residual adaptation 4.4030.
  - All errors exceed the registered 1.5 ceiling, so the retained Phase-1 verdict is REFRAME rather than a method-superiority claim.
limitations:
  - This is one deterministic 36-element smoke experiment, not a convergence study or a general ranking of adaptive methods.
  - The one-shot DWR mesh inherits a late coarse-pilot event and its residual mixes spatial, temporal, and splitting effects.
  - The synthetic one-dimensional model has no biological calibration, and estimator overhead is excluded from matched primal work.
redirectFrom: []
---

## Editorial overview

The experiment now reaches the adaptive comparison. A verified independent reference gives a smooth mode-6 to mode-7 crossing, then uniform, residual, and DWR meshes receive identical production degrees of freedom. Uniform is least inaccurate, while every method misses the registered error ceiling.

Read [Can a Mesh Preserve the Event?](/writing/can-a-mesh-preserve-the-event/) for the model, event sensitivity, matched-work design, four publication figures, the coarse-pilot diagnosis, and the refinement ladder needed before any broader claim.
