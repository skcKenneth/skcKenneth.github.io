---
title: What Must a Traffic Model Remember?
slug: what-must-a-traffic-model-remember
summary: A synthetic ring-road study uses exact linear controls and held-out forecasts to distinguish omitted-state memory, projection effects, observation noise, and numerical sensitivity.
year: 2026
date: 2026-09-26
lastUpdated: 2026-09-26
period: 2026
status: Reproducible study
featured: false
draft: false
topics: [Traffic flow, Model reduction, Memory, Stability]
methods: [Optimal-velocity model, Fourier projection, Coordinate elimination, Vector autoregression, Spectral stability]
researchQuestion: When does a traffic model need history because its observation is incomplete, and when do forecast gains translate into a better diagnosis of linear stability?
dataType: Synthetic linear and nonlinear trajectories on a 24-vehicle ring; no measured traffic data
codeAvailable: false
dataAvailable: false
studentSuitable: false
heroImage: /images/mori-zwanzig-traffic-memory/01-hidden-velocity.svg
validation: Analytical closure and recurrence controls, independent memory reconstruction, trajectory-level train–validation–test splits, observation-noise replicates, nonlinear stress, and solver-tolerance sensitivity checks.
keyFindings:
  - The homogeneous first headway–velocity Fourier pair closes exactly; headway alone has an exact complex two-lag recurrence.
  - Permuting a fixed multiset of driver relaxation rates preserves the full linear spectrum in this model, while projected memory and observability can change.
  - Longer histories improve several held-out forecast and stability diagnostics in the tested heterogeneous and noisy settings, without establishing an exact learned memory kernel.
  - A representative long-history nonlinear forecast is sensitive to tiny solver errors at small amplitude; severe large-amplitude degradation persists under refinement.
limitations:
  - Synthetic, locally refitted models on a finite parameter grid do not establish real-traffic effectiveness or transfer across traffic conditions.
  - Jointly fitted autoregressive coefficients are finite-history proxies, not identified exact Mori–Zwanzig operators.
  - Noise diagnostics retain nonfinite TLS outcomes; zero errors in a tested subset are not stability guarantees.
  - Nonlinear results require separate checks of reference integration and forecast sensitivity to warmup errors.
---

## The question

A traffic forecast can need history because its observation omits velocity or spatial modes. It can also benefit from history when noise corrupts an otherwise closed state. This study separates those mechanisms before comparing predictive accuracy with the sign of linear growth.

The 24-vehicle optimal-velocity ring supplies exact controls: a closed homogeneous headway–velocity pair, a headway-only recurrence, and an explicit coordinate-elimination kernel with hidden-initial-state forcing. A direct characteristic-polynomial calculation also shows why changing the order of a fixed collection of driver relaxation rates preserves the full spectrum while changing its representation in retained coordinates.

## What the comparison found

The main experiment contains 297 parameter cells, 8,910 clean trajectories, and 23,463 fitted settings. Complete trajectories are split before fitting. Competing methods share observations and target times; the richer eight-coordinate model is scored on the same first four coordinates. The separate headway-only control is evaluated in two dimensions.

Supplementary checks vary observation noise, physical history duration, sampling interval, and nonlinear perturbation amplitude. Failed or nonfinite outcomes remain visible. A post-result solver diagnostic distinguishes numerical-history amplification from a robust representative finite-amplitude failure.

The [full research article](/writing/what-must-a-traffic-model-remember/) develops the derivations, explains the ten figures, and reports the comparison with its scientific limits. This is a synthetic modeling study, not a validated traffic-control system, a new Mori–Zwanzig algorithm, or evidence from a measured road network.
