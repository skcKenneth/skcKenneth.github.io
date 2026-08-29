---
title: Assimilating What You Can Observe
slug: assimilating-what-you-can-observe
summary: A frozen six-patch EnKF benchmark shows that the declared aggregate-and-delay observation operator improves synthetic state and peak forecasts but undercovers the latent state, limiting the conclusion to PARTIAL.
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [Data assimilation, Spatial epidemics, Uncertainty calibration]
methods: [Ensemble Kalman filter, Observation-operator stress test, Held-out peak diagnostics]
researchQuestion: How much state and held-out peak performance can a known aggregate-and-delay observation operator recover, and does its latent uncertainty pass predeclared calibration gates?
dataType: Deterministic synthetic six-patch SIR truth and frozen noisy observation streams
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/assimilating-what-you-can-observe/p06_01_observation_operator_protocol.svg
period: 2026
validation: Five evidence tests, the project and portfolio checkers, identical canonical and rerun result hashes, conservation and operator checks, and independent original-size PNG/PDF visual QA passed; the predeclared latent-state coverage gate remains a preserved failure.
keyFindings:
  - The correct aggregate-and-delay arm reduces infected-state RMSE from 264.255 open loop and 126.335 under the wrong operator to 36.090.
  - It predicts the held-out day-62 total-infected peak with zero-day timing error and 0.743 percent intensity error, compared with five days and 4.726 percent for the wrong operator.
  - Its nominal 90 percent latent-state interval covers only 0.562963, below the frozen 0.70 minimum, so the machine verdict is PARTIAL rather than fully supported.
limitations:
  - The evidence uses one deterministic six-patch synthetic SIR truth, one ensemble design and one jointly misspecified comparator.
  - The study does not isolate grouping, delay and reporting-fraction effects or compare alternative filters, smoothing, inflation or localisation.
  - No dengue records, patients, districts, clinical decisions, operational forecasts or public-health recommendations are involved.
redirectFrom: []
---

## Editorial overview

The literature gate returned **REFRAME** because epidemic ensemble filtering, reporting delay and observation-function mismatch are established topics. The defensible contribution is a frozen, failure-preserving replication-extension audit—not a new EnKF, dengue model or field validation.

Read [Assimilating What You Can Observe](/writing/assimilating-what-you-can-observe/) for the observation model, matched four-arm protocol, point and calibration diagnostics, held-out peak comparison, preserved coverage failure, reproduction hashes and evidence boundary.
