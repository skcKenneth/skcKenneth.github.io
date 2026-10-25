---
title: When Local Precision Hides the Wrong Heat Source
slug: when-local-precision-hides-the-wrong-source
topicIds: [data-ai, risk-decisions, computation-code]
summary: A verified synthetic heat-sensing comparison separates local information, structural reflection ambiguity and noisy inverse errors under the same two-sensor, eight-reading budget.
year: 2026
date: 2026-10-25T15:15:00+08:00
lastUpdated: 2026-10-25T15:15:00+08:00
period: 2026
status: Reproducible study
featured: true
draft: false
topics: [Inverse problems, Heat equation, Identifiability, Experimental design, Uncertainty]
methods: [Neumann heat kernel, Analytic sensitivities, Local and globalized design criteria, Nuisance profiling, Paired held-out evaluation, Outward-rounded interval verification]
researchQuestion: Can a locally informative heat-source experiment still admit distant alternatives, and how do matched-budget sensor/time designs compare when source strength and diffusivity are unknown?
dataType: Synthetic one-dimensional reflecting heat model with a known initial pulse time, ideal labeled point sensors and independent Gaussian noise; no field calibration
codeAvailable: false
dataAvailable: false
studentSuitable: false
projectUrl: https://skckenneth.github.io/writing/when-local-precision-hides-the-wrong-source/
heroImage: /images/heat-sensor-global-aliasing/fig-01.svg
validation: Reflection parity, independent cosine/images kernels, source and diffusivity derivatives, total-heat conservation, mode sensitivity, exact amplitude profiling, matched budgets and paired held-out noise; numerical inverse fits remain distinct from interval enclosures.
keyFindings:
  - A midpoint sensor has an exact reflected-source alias even when the local three-parameter information matrix has three positive eigenvalues.
  - The finite comparison enumerates 1,925 admissible two-sensor/four-time layouts per dead time and evaluates six criteria without held-out truth.
  - At zero delay and noise 0.05, all six methods have zero large location errors among 2,048 fits each; equal-spacing median error 0.00246372 is smaller than maximin 0.00311622.
  - At delay four, large-error counts are 31 for local D, local E and extended-E, 72 for equal spacing, 124 for the fixed center-plus-off-center control and 29 for maximin, each out of 2,048.
  - The benchmark preserves 61,440 inverse fits and 92,160 composite decisions, with 391 selected unsuccessful inverse statuses and 902 unsuccessful refinement attempts.
  - Eight continuous separation audits retain five positive lower bounds and three unresolved zero lower bounds; none establishes the sufficient 5% ideal-estimator error target.
limitations:
  - This is an established-method, model-specific benchmark, not a new general theorem or optimal-design algorithm.
  - The parameter bounds, positive amplitude floor, source-separation scale, known pulse time and Gaussian noise are essential assumptions.
  - Finite-grid separation is an upper bound on the continuous minimum; a numerical inverse fit is not a certified global estimator.
  - No result establishes reliability for real fires, sensor response lag, unknown calibration, correlated noise or arbitrary heat-source models.
---

## A small uncertainty ellipse can miss another explanation

A thermometer halfway along a reflecting interval cannot tell a pulse at one position from its mirror. The heat-kernel identity is exact, while the same experiment can have independent local parameter derivatives. This project uses that established counterexample to distinguish local precision from global uniqueness, then asks how to spend a limited observation budget more effectively.

The physical model is a single initial pulse, not a continuously operating heater. Source amplitude lies in [0.7,1.3], position in [0.15,0.85] and diffusivity in [0.04,0.06]. Alternative explanations may use different nuisance values. The main layouts use two distinct labeled sensors and four common sampling times, always eight readings. A symmetric pair of labeled sensors is not automatically blind: reflection exchanges its channels rather than necessarily preserving the ordered output.

## What the comparison tests

The study enumerates 1,925 layouts per startup delay and compares local D-optimal, local E-optimal, equal spacing, a pre-fixed center-plus-off-center control, a discretized existing extended-E criterion and maximin separation. Design selection uses a frozen parameter grid; 64 off-grid Sobol cases with paired noise provide a separate finite benchmark. They are not treated as independent samples from a population of real rods.

Three questions remain distinct. A Gaussian oracle classifies two fully specified means. A composite classifier profiles unknown strength and diffusivity at two possible locations. Continuous inversion estimates an arbitrary position and both nuisance parameters. Success on the simpler task does not automatically establish the harder one.

## A conditional result, not a forced winner

The zero-delay comparison does not support a story that elaborate global design is always necessary: ordinary layouts avoid the declared large errors, and equal spacing has the smallest reported median location error at the main noise level. Delay increases errors, but the small difference between 29 and 31 large-error cases is not promoted into a universal superiority claim.

All finite fits, boundary solutions and unsuccessful refinement records remain visible. Eight continuous interval audits separately check entire parameter regions: five retain positive separation lower bounds and three remain unresolved at zero. None reaches the sufficient 5% ideal-estimator error target. A positive grid minimum cannot certify continuous separation, and a statistically uninformative sufficient bound does not prove classification impossible.

Read [*When Local Precision Hides the Wrong Heat Source*](/writing/when-local-precision-hides-the-wrong-source/) for the derivations, ten Burgundy research figures, matched comparisons and limits of the inference.
