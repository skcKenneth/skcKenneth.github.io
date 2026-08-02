---
title: Differential Adhesion Cell-Sorting Audit
slug: differential-adhesion-cell-sorting
summary: A reproducible cellular Potts study separates neighbour sorting from engulfment and tests adhesion, motility, initial conditions, energetics, and cell-shape plausibility.
year: 2026
lastUpdated: 2026-08-02
status: Reproducible study
featured: true
topics: [Computational Biology, Morphogenesis]
methods: [Cellular Potts model, Parameter sweep, Replicate simulation]
researchQuestion: When can differential adhesion organise a mixed cell population, and which observations distinguish sorting from engulfment?
dataType: Controlled synthetic cell simulations
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/differential-adhesion-cell-sorting/sorting-sequence.svg
period: 2026
validation: Three automated tests passed in the pinned environment; all 35 declared outputs were regenerated and checksum-validated.
keyFindings:
  - The baseline effective A–B interfacial tension is 18 and the final sorting index is 0.5022.
  - The fitted finite-time coarsening exponent is 0.3001 across five configured replicates.
limitations:
  - The model is a synthetic two-dimensional system and represents no named tissue.
  - Chemotaxis, proliferation, extracellular matrix, and three-dimensional mechanics are outside scope.
redirectFrom: []
---

## Editorial overview

Read [Can Adhesion Alone Sort Cells into Tissues?](/writing/can-adhesion-alone-sort-cells-into-tissues/) for the model, trajectory, phase diagram, coarsening analysis, robustness checks, energy audit, and nine approved figures.

The public page interprets reviewed evidence without exposing the private simulator, notebooks, raw arrays, or intermediate calculations.
