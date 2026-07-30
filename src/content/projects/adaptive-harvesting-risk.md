---
title: Adaptive Harvesting under Allee-Effect Risk
slug: adaptive-harvesting-risk
summary: A verified stochastic population study compares fixed, proportional, and refuge-based harvesting near a nonlinear collapse threshold.
year: 2026
lastUpdated: 2026-07-30
status: Reproducible study
featured: true
topics: [Environmental Modeling, Reliability and Uncertainty]
methods: [Strong-Allee difference equation, Monte Carlo risk estimation, Feedback-policy comparison]
researchQuestion: Which feedback rule preserves useful harvest while limiting finite-horizon collapse risk near a strong Allee threshold?
dataType: Controlled synthetic population trajectories
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/adaptive-harvesting-risk/risk-yield-frontier.svg
period: 2026
validation: Six source tests, output validation, shared-noise Monte Carlo comparison, and checked summary hashes.
keyFindings:
  - Fixed quota 8 produced 28 collapses in 150 runs, compared with 1 at quota 7.
  - No collapse was observed across the tested threshold-adaptive grid; the finite-sample upper risk bound remains non-zero.
limitations:
  - The model is not calibrated to a species or fishery.
  - Observation error, delayed control, age structure, and spatial dynamics are omitted.
redirectFrom: []
---

## Editorial overview

The project studies a policy mechanism rather than offering a management recommendation. Read the complete bilingual research note, [When Sustainable Harvesting Becomes a Trap](/writing/when-sustainable-harvesting-becomes-a-trap/), for the model, Monte Carlo uncertainty, four reviewed figures, and the route from a perfect state variable to a monitorable policy.
