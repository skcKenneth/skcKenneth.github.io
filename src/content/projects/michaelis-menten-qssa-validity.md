---
title: Michaelis-Menten QSSA Validity Atlas
slug: michaelis-menten-qssa-validity
summary: A 243-case parameter atlas measures where the Michaelis-Menten quasi-steady-state reduction agrees with full mass-action kinetics and where timing or trajectory error becomes material.
year: 2026
lastUpdated: 2026-07-30
status: Reproducible study
featured: true
topics: [Enzyme Kinetics, Model Reduction]
methods: [Fast-slow ODE analysis, Parameter-space audit, Task-specific error metrics]
researchQuestion: For which parameter regimes, outputs, and time horizons is the Michaelis-Menten QSSA an accurate replacement for full mass-action kinetics?
dataType: Controlled deterministic enzyme-kinetic parameter sweeps
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/michaelis-menten-qssa-validity/qssa-validity-atlas.svg
period: 2026
validation: Three tests passed in the pinned Python 3.12 and SciPy 1.16 environment; all 21 output checksums were revalidated.
keyFindings:
  - Across 243 cases, maximum product error ranged from 0.000540 to 0.266198.
  - The worst tested case used epsilon 0.6 and sigma 0.05; timing and trajectory accuracy did not share one universal boundary.
limitations:
  - The atlas is synthetic and does not estimate kinetic constants for a named enzyme.
  - Product inhibition, cooperative binding, diffusion, inactivation, and stochastic copy-number effects are outside scope.
redirectFrom: []
---

## Editorial overview

Read [When Michaelis-Menten Stops Being Valid](/writing/when-michaelis-menten-stops-being-valid/) for the full mass-action mechanism, nondimensionalisation, 243-case validity atlas, event-time diagnostics, slow-manifold geometry, and five approved figures.

The public article reports reviewed conclusions without exposing the private atlas table, notebook, code, or raw trajectories.
