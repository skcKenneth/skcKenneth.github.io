---
title: When a Traffic Solver Invents a Jam
slug: when-a-traffic-solver-invents-a-jam
summary: A failure-preserving LWR benchmark shows how final shock-grid alignment can make a cell-average norm look exact while threshold arrival and queue accounting remain biased.
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [Traffic flow, Numerical analysis, Conservation laws]
methods: [Finite-volume methods, Exact Riemann reference, Operational event diagnostics]
researchQuestion: Can final shock-grid alignment make a cell-average refinement gate misleading while fixed operational event and queue metrics still expose numerical bias?
dataType: Synthetic dimensionless LWR Riemann trajectories and threshold-defined diagnostics
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/when-a-traffic-solver-invents-a-jam/p10_01_shock_profiles.svg
period: 2026
validation: Ten evidence tests, the repository checker, exact-reference and invariant checks, two identical numerical signatures, and original-size PNG/PDF visual QA passed; the predeclared final-L1 scientific gate remains a verified null.
keyFindings:
  - The exact backward shock speed is -0.05 and the fixed sensor arrival is 4.0; all twelve numerical cases remain finite, bounded and conservative.
  - At N=50, Godunov final cell-average L1 error is about 1.37e-11 because the final shock aligns with a cell boundary, while the threshold arrival remains 0.517647 late.
  - Arrival delay, transition width and threshold-defined queue errors improve with grid refinement, but the frozen strict final-L1 gate fails for both Godunov and Rusanov.
limitations:
  - The evidence covers one dimensionless Greenshields shock, one sensor, one threshold, one CFL and four grids.
  - No empirical road, detector, calibration, travel-time forecast, safety conclusion or transport-policy recommendation is involved.
  - The study derives no modified-equation coefficient, proves no new theorem and makes no universal ranking of finite-volume schemes.
redirectFrom: []
---

## Editorial overview

The literature gate returned **REFRAME** because LWR shocks, entropy selection, Godunov and cell-transmission methods, numerical diffusion and high-resolution comparisons are mature. The defensible contribution is a frozen replication-extension diagnostic with a preserved null, not a new solver or a real-traffic claim.

Read [When a Traffic Solver Invents a Jam](/writing/when-a-traffic-solver-invents-a-jam/) for the exact shock derivation, grid-alignment mechanism, four operational diagnostics, complete twelve-case result, failure record, reproduction signature and claim boundary.
