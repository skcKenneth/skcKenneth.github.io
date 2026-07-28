---
title: Sequential Nonlinear Model Discrimination
slug: sequential-nonlinear-model-discrimination
summary: Adaptive forcing experiments distinguish Van der Pol, Rayleigh, and Duffing oscillator families under a six-round budget.
year: 2026
lastUpdated: 2026-07-28
status: Reproducible study
featured: true
topics: [Reliability and Uncertainty]
methods: [Bayesian experimental design, Nonlinear oscillators, Particle model selection]
researchQuestion: Which forcing experiments most efficiently distinguish competing nonlinear mechanisms?
dataType: Synthetic closed-world benchmark
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/sequential-nonlinear-model-discrimination/model_design_landscape.svg
period: 2026
validation: Repeated trials, fixed and oracle baselines, Brier score, and solver tolerance checks.
keyFindings: [Adaptive design reaches 100% accuracy and Brier 0.00287., Fixed design reaches 96.19% and Brier 0.0509.]
limitations: [Posterior probabilities are conditional on three candidate families., No real oscillator is identified.]
redirectFrom: []
---

## Editorial overview

The adaptive strategy chooses experiments for predictive separation, not response magnitude. Read [Ask the Oscillator the Experiment That Separates Its Models](/writing/sequential-nonlinear-model-discrimination/).

