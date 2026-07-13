---
title: Resilient Water-Network Leak Localisation
slug: resilient-water-leak-localization
summary: A dropout-aware pressure-sensor placement study for distinguishing leak zones when measurements are noisy and one sensor may be unavailable.
year: 2026
lastUpdated: 2026-07-13
status: Exploratory study
featured: true
topics: [Reliability and Uncertainty, Infrastructure Monitoring]
methods: [Graph-based hydraulic proxy, Greedy sensor placement, Monte Carlo evaluation]
researchQuestion: Can pressure sensors selected for lower-tail leak-signature separation retain localisation performance when measurements are noisy and one sensor may fail?
dataType: Synthetic hydraulic-inspired network and generated Monte Carlo benchmark
codeAvailable: true
dataAvailable: true
studentSuitable: false
heroImage: /science/resilient-water-leak-localization/robustness-comparison.svg
technicalUrl: https://github.com/skcKenneth/ScienceProject/blob/main/resilient-water-leak-localization/paper/ieee-conference-draft.md
repositoryUrl: https://github.com/skcKenneth/ScienceProject/tree/main/resilient-water-leak-localization
period: 2026
validation: Four placement strategies are compared with common random numbers over 45 method-condition combinations and 1,225 Monte Carlo trials per combination.
keyFindings:
  - Under the designated 8% noise and 40% single-sensor-dropout stress test, the proposed layout reached 88.8% top-1 accuracy versus 85.9% for its nominal ablation.
  - Worst-zone accuracy in that stress test was 65.7% for the proposed layout and 51.4% for the nominal ablation.
  - The advantage was not uniform across all noise levels, so the current evidence supports benchmark extension rather than a field-performance claim.
limitations:
  - The graph-Laplacian response is a controlled proxy rather than an EPANET or field-calibrated hydraulic model.
  - Only one unavailable sensor, independent Gaussian noise, and one leak at a time are represented.
  - Aggregate Wilson intervals do not replace a paired significance analysis or account for every within-zone dependence.
redirectFrom: []
---

## Overview

This study treats pressure-sensor placement as a fault-tolerant design problem. Instead of asking only whether leak signatures are distinguishable when all sensors work, it scores each layout after every possible one-sensor removal.

## Why the problem matters

A leak-localisation pipeline can depend on a small number of pressure sensors. A layout chosen for the intact system may become ambiguous during communications loss, maintenance, power interruption, or sensor rejection. Redundancy therefore needs to be represented in placement, not added only after a failure occurs.

## Model, data, and assumptions

The pilot uses a 36-node synthetic meshed network with one fixed-head reservoir and 35 candidate leak zones. A damped graph Laplacian supplies hydraulic-inspired pressure signatures. Seven sensors are chosen by random placement, node degree, nominal greedy separation, or the proposed dropout-aware greedy objective.

Leak magnitude varies from 0.65 to 1.35. The benchmark adds five relative noise levels and three probabilities of losing one sensor. Localisation fits a non-negative magnitude to every candidate signature and ranks the residuals.

## Validation and findings

Every method-condition pair contains 1,225 trials. Common random seeds make the strategy comparison paired at each condition. The designated stress test shows a modest aggregate top-1 improvement and a larger worst-zone improvement over the nominal ablation. At 12% noise and 40% dropout, however, the two greedy methods are effectively level; extreme-noise fairness remains unresolved.

## Reproduction

The technical repository contains the source, tests, complete metric table, approved vector figures, long-form technical write-up, and a project-local reproduction guide. A natural follow-up would be to replace the graph proxy with EPANET benchmark hydraulics and add demand and topology uncertainty.
