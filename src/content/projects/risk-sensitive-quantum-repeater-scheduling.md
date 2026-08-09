---
title: When Entanglement Expires
slug: risk-sensitive-quantum-repeater-scheduling
summary: A reproducible synthetic study of memory decay, cutoff scheduling, tail latency, and evidence-aware abstention in a four-link quantum repeater chain.
year: 2026
lastUpdated: 2026-08-09
status: Reproducible study
featured: true
topics: [Quantum Networks, Reliability and Uncertainty]
methods: [Discrete-event Monte Carlo, Werner-visibility model, Reliability-constrained CVaR selection]
researchQuestion: Can a frozen span-aware cutoff policy satisfy a scenario-wide fidelity reliability gate while controlling mean and tail delivery latency?
dataType: Controlled synthetic protocol-level quantum-repeater episodes
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/risk-sensitive-quantum-repeater-scheduling/mechanism-timeline.svg
period: 2026
validation: Analytical waiting-time and renewal checks, fixed event-trace fixtures, a small exact MDP oracle, seeded Monte Carlo, bootstrap intervals, and a zero-censoring audit all passed.
keyFindings:
  - No screened policy satisfied the declared global reliability gate; the selector abstained instead of reporting a false winner.
  - Nine of 27 training scenarios were below a policy-independent fidelity ceiling; at lifetime 8, the fastest admissible path reaches only about 0.772 fidelity against a 0.80 threshold.
  - A cutoff of two slots at every span passed only a declared high-memory training stratum; none of the 40 heterogeneous held-out scenarios qualified for certification under that same stratum rule, so the analysis abstained on all 40.
limitations:
  - The study is synthetic and is not calibrated to measured quantum-network hardware.
  - Instantaneous classical knowledge, one memory qubit per neighbour, and no same-slot cascading swaps are modelling assumptions.
  - The high-memory sensitivity result is not a globally certified scheduling rule, hardware benchmark, or quantum-key-distribution security claim.
redirectFrom: []
---

## Editorial overview

Read [When Entanglement Expires](/writing/when-entanglement-expires/) for the complete model, literature review, analytical feasibility bound, policy experiment, uncertainty analysis, limitations, and eight approved figures.

The central result is an abstention: under the declared scenario grid, the global fidelity constraint has no certified policy. The public article explains why this is scientifically useful without exposing private code, raw episode traces, notebooks, or intermediate calculations.

Use the [Quantum Repeater Lab](/teaching/quantum-repeater-lab/) to explore the event order, memory lifetime, fidelity threshold, generation and swap probabilities, cutoffs, and seeded policy behaviour interactively.
