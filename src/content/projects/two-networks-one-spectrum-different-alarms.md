---
title: Two Networks, One Spectrum, Different Alarms
slug: two-networks-one-spectrum-different-alarms
summary: A controlled positive-network benchmark separates asymptotic stability from finite-horizon sensor alarms, comparing exact transfer, classical phase-type calculations and rigorous decision margins.
year: 2026
date: 2026-10-11T10:00:00+08:00
lastUpdated: 2026-10-11T10:00:00+08:00
period: 2026
status: Reproducible study
featured: true
draft: false
topics: [Network dynamics, Positive systems, Transient response, Decision robustness]
methods: [Positive compartment generators, Matrix exponential, Phase-type path evaluation, Duhamel bounds, Markov coupling, Interval verification]
researchQuestion: When physically matched isospectral routing changes alter a finite-horizon source-to-sensor alarm, which exact calculations and rigorous bounds can resolve the decision?
dataType: Constructed acyclic transport networks with matched mass, transfer rates and uniform removal; no calibrated environmental measurements
codeAvailable: false
dataAvailable: false
studentSuitable: false
projectUrl: https://skckenneth.github.io/writing/two-networks-one-spectrum-different-alarms/
heroImage: /images/spectral-blind-spots/fig-01.svg
validation: Independent matrix-exponential and phase-type references, positivity and mass identities, exact routing coefficients, interval peak verification and held-out structure and parameter comparisons.
keyFindings:
  - Fixed eigenvalues cannot by themselves distinguish routing-dependent source-to-sensor responses.
  - In 6,912 paired threshold queries, 172 alarms changed and 6,740 remained unchanged.
  - The path envelope certified 6,473 queries (93.65% of all queries), versus 3,147 (45.53%) for the basic Duhamel bound.
  - All formal peaks and response gaps were verified; a separate near-boundary control remained unresolved.
limitations:
  - Constructed linear compartment models do not establish real-world contamination safety or environmental calibration.
  - Sensor occupancy is an amount, not automatically concentration, flux or dose.
  - Nonnormality is a diagnostic, not an isolated causal mechanism or calibrated risk score.
  - Phase-type mathematics and the star-chain counterexample are established background, not novelty claims.
---

## Same decay rates, a different monitoring question

A stable spectrum answers whether a linear model eventually decays. A finite-time alarm asks whether a localized release puts too much material at a particular sensor before a deadline. Those questions can have different answers even when every state stays nonnegative and every network loses exactly the same total mass.

This project fixes a source, a terminal sensor, unit injected mass, transient transfer rates and uniform removal. It changes only forward routing. The resulting triangular generators share all eigenvalues, while their travel-time distributions and terminal occupancy can differ. A direct-versus-chain example introduces the mechanism without being presented as a new research result.

## Exact response and useful guarantees are different achievements

The comparison uses the full matrix exponential and an independent classical phase-type/path-length calculation. It then asks whether Duhamel, total-variation, coupling and path-specific bounds are tight enough to protect a threshold decision. The analysis separates a true inequality from a useful certificate: a bound may hold everywhere while remaining too wide to classify the cases that matter.

Held-out structures and parameter regimes test a frozen protocol rather than examples chosen because they give dramatic alarms. Continuous-time peak enclosures keep threshold equality and numerical uncertainty visible. Unchanged alarms, loose bounds, unresolved cases and verification costs remain part of the result.

The held-out evaluation crossed 72 networks with eight rate–removal–horizon regimes, four routing mixture weights and three thresholds. Its 2,880 responses yielded 2,304 routing pairs and 6,912 paired threshold queries. There were 172 alarm reversals. The path-specific envelope certified 6,473 unchanged decisions, but still left 267 unchanged cases inconclusive alongside the reversals. Two complete runs agreed on the scientific records, and independent matrix-exponential checks differed by at most $7.33\times10^{-15}$. These are benchmark counts, not independent field observations or a population risk estimate.

## A bounded contribution

The contribution is a verified decision audit and mechanism explanation, not a new theory of phase-type distributions, nonnormality or network transients. The model is synthetic and deliberately restricted. Equal volumes or an explicit normalization would be needed to interpret compartment amounts as concentration; real safety decisions would additionally require calibration and an appropriate standard.

Read [*Two Networks, One Spectrum, Different Alarms*](/writing/two-networks-one-spectrum-different-alarms/) for the model, ten research figures, independent calculations, held-out comparisons and the difference between a prediction, an inconclusive bound and a conditional guarantee.
