---
title: Drug Dissolution Model Hierarchy
slug: drug-dissolution-model-hierarchy
summary: A reproducible comparison of empirical release laws, finite-sink spherical diffusion, and moving-front dynamics with model-selection and identifiability audits.
year: 2026
lastUpdated: 2026-08-02
status: Reproducible study
featured: true
topics: [Transport Phenomena, Mathematical Modelling]
methods: [Radial diffusion PDE, Model selection, Identifiability analysis]
researchQuestion: When do empirical drug-release laws stop being adequate descriptions of finite-volume dissolution?
dataType: Controlled synthetic dissolution observations
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/drug-dissolution-model-hierarchy/model-hierarchy.svg
period: 2026
validation: Three automated tests passed in the pinned environment; all 41 declared outputs were regenerated and checksum-validated.
keyFindings:
  - The finite-sink PDE has the lowest AIC, -179.924, among the declared candidates.
  - The final released fraction is 0.9750 and maximum numerical mass-balance error is 3.11e-13.
limitations:
  - Results use synthetic observations and do not support clinical or formulation claims.
  - Swelling, degradation, non-Fickian transport, and experimental batch variability are outside scope.
redirectFrom: []
---

## Editorial overview

Read [When Do Simple Drug-Release Laws Stop Being Enough?](/writing/when-simple-drug-release-laws-stop-being-enough/) for the model hierarchy, transport atlas, local exponent, model discrimination, identifiability, polydispersity, conservation audit, and nine approved figures.

The public page interprets reviewed outputs without exposing private notebooks, solver source, raw observations, or calculation notes.
