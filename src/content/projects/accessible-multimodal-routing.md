---
title: Accessible Multimodal Routing at Gongbei
slug: accessible-multimodal-routing
summary: A cohort-aware model of how slopes, stairs, transfers, crowding, and missing elevators change routes through a border hub.
year: 2026
lastUpdated: 2026-04-30
status: Reproducible study
featured: true
topics: [Urban and Mobility Systems, Reliability and Uncertainty]
methods: [Multi-layer networks, Multi-objective routing, Sobol sensitivity analysis]
researchQuestion: How do mobility constraints change optimal routes and intervention priorities in a dense multimodal hub?
dataType: Case-study network and configured cohort assumptions
codeAvailable: true
dataAvailable: true
studentSuitable: true
heroImage: /science/accessible-multimodal-routing/network.png
technicalUrl: https://github.com/skcKenneth/ScienceProject/tree/main/SJMMA2026/ProblemA
repositoryUrl: https://github.com/skcKenneth/ScienceProject/tree/main/SJMMA2026/ProblemA
period: 2026
validation: Cohort-specific routes are stress-tested with variance-based sensitivity analysis and edge-removal experiments.
keyFindings:
  - Mode and route choices change when vertical barriers are represented explicitly.
  - The model identifies slope and transfer assumptions as important drivers for the wheelchair cohort.
limitations:
  - The case study covers one 1 km² hub.
  - Several behavioral and accessibility costs require local calibration.
  - Policy implications are model-based rather than evidence from a deployed intervention.
redirectFrom: []
---

## Overview

This study represents pedestrian, bus, rail, and taxi layers as a coupled network. It replaces a single “average traveler” with configured regular, elderly, encumbered, and wheelchair cohorts.

## Why the problem matters

The geographically shortest path can be unusable when it contains a stair or an inaccessible transfer. A routing objective that ignores these barriers can hide the travel cost imposed on people with limited mobility.

## Model, data, and assumptions

The pipeline combines a Walking Difficulty Index, generalized travel cost, demographic-aware Dijkstra routing, Pareto label setting, and weighted betweenness. The Gongbei network is a case-study representation; behavioral costs are modeled assumptions rather than direct observations of every traveler.

## Validation and findings

Sensitivity analysis decomposes variation in modeled travel cost, while cascading edge removal tests route redundancy. The reported intervention comparison suggests that elevator and low-floor-transfer changes reduce modeled wheelchair travel cost, but this has not been evaluated as a deployed intervention.

## Reproduction

The technical repository provides bilingual reports, figures, configuration, and the command `python SJMMA2026/ProblemA/run.py --mode all`.
