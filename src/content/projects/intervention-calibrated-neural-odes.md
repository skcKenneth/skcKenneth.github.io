---
title: Intervention-Calibrated Neural ODEs
slug: intervention-calibrated-neural-odes
summary: Sign-structured and unconstrained neural vector fields are tested on strong held-out interventions in a synthetic toggle switch.
year: 2026
lastUpdated: 2026-07-28
status: Reproducible study
featured: true
topics: [Reliability and Uncertainty]
methods: [Neural ODEs, Structural constraints, Ensemble calibration]
researchQuestion: Do sign constraints improve both intervention prediction and uncertainty honesty?
dataType: Synthetic gene-circuit trajectories
codeAvailable: true
dataAvailable: false
studentSuitable: false
heroImage: /science/intervention-calibrated-neural-odes/neural_ode_interventions.svg
period: 2026
validation: Held-out intervention families, bootstrap ensembles, abstention diagnostics, and solver tolerance checks.
keyFindings: [Structured RMSE is 0.237 versus 0.259 for the unconstrained model., Structured coverage is only 0.721 despite preventing negative predictions.]
limitations: [Synthetic toggle switch only., Ensemble spread does not cover missing-mechanism uncertainty.]
redirectFrom: []
---

## Editorial overview

The central result is deliberately negative: physical structure does not guarantee calibrated uncertainty. Read [A Neural ODE Can Be Physically Plausible and Still Miscalibrated](/writing/intervention-calibrated-neural-odes/).

