---
title: Interpretable EV Dispatch and Replenishment
slug: intelligent-ev-dispatch
summary: A white-box pipeline links energy prediction, fairness-aware scheduling, and disruption-triggered replanning.
year: 2026
lastUpdated: 2026-04-30
status: Reproducible study
featured: true
topics: [Sustainable Urban and Mobility Systems, Reliability and Uncertainty]
methods: [Physics-informed regression, Multi-objective optimization, CUSUM and EWMA]
researchQuestion: Can an auditable model balance fleet energy, profit, fairness, and disruption response?
dataType: Project-local operational records; redistribution status is not asserted
codeAvailable: true
dataAvailable: false
studentSuitable: false
heroImage: /science/intelligent-ev-dispatch/pareto-frontier.png
technicalUrl: https://github.com/skcKenneth/ScienceProject/tree/main/SJMMA2026/ProblemE
repositoryUrl: https://github.com/skcKenneth/ScienceProject/tree/main/SJMMA2026/ProblemE
period: 2026
validation: The report evaluates prediction error, schedule trade-offs, alarm precision/recall, and disruption overhead.
keyFindings:
  - Route and environment features dominate the configured residual correction in the reported run.
  - The schedule experiment exposes a non-degenerate profit-energy-fairness frontier.
limitations:
  - The reported energy MAPE is 42.512%, despite a high R².
  - Scheduling uses a simplified assignment structure rather than a full exact MILP.
  - Disruptions are generated with a stylized simulation.
redirectFrom: []
---

## Overview

This project links a physics-based energy estimate to an interpretable residual model, then uses the estimates inside a multi-objective dispatch search. EWMA and CUSUM statistics trigger receding-horizon replanning when residual behavior changes.

## Evidence and interpretation

The reported run has a high coefficient of determination but a 42.512% MAPE. Both numbers matter: the model captures broad variation while retaining substantial relative error. The optimization results are therefore a computational study, not a production dispatch guarantee.

## Reproduction

Run the light pipeline with `python SJMMA2026/ProblemE/run.py --mode all --scope light`. The repository contains bilingual reports and stable generated figures.
