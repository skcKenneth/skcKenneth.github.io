---
title: Random Stress Tests Are Not Certificates
slug: random-stress-tests-are-not-certificates
summary: A deterministic interval benchmark certifies one synthetic worst-case objective while fixed IID, Latin-hypercube and local-search designs remain feasible incumbents without global upper bounds.
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [Global optimization, Uncertainty, Numerical certification]
methods: [Interval branch-and-bound, Monotonicity reduction, Fixed seeded stress tests]
researchQuestion: On one declared bounded synthetic CSTR-like objective, what separates a valid worst-case certificate from a strong value found by sampling or multistart local search?
dataType: Synthetic dimensionless algebraic objective evaluations and deterministic bound traces
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/random-stress-tests-are-not-certificates/p07_02_certificate_convergence.svg
period: 2026
validation: The frozen certificate closed to a 4.1264291805731546e-07 gap, an independent 200001-point reference lay inside the certified interval, two runs had an identical scientific signature, mathematical tests and repository checks passed, and five publication figures passed original-size PNG and PDF-raster QA.
keyFindings:
  - Monotonicity reduces the three-variable bounded maximum exactly to the corner z=-20 and H=0.5, leaving a certified one-dimensional temperature problem.
  - The final interval is [1.4443773087849885, 1.4443777214279065], narrower than the frozen 1e-6 tolerance after 13 processed nodes.
  - Each fixed IID and Latin-hypercube budget recorded 0/32 hits, but that count has no population miss-probability meaning; local search supplies incumbents and never a global upper bound.
limitations:
  - The objective is a synthetic dimensionless algebraic thermal-drift proxy, not a dynamic, physical, experimental or plant CSTR model.
  - The zero-hit record applies only to the declared seeds, budgets and 1e-4 rule; no probability or confidence claim is made.
  - The certificate covers only the analytically reduced one-temperature interval at the proved corner and introduces no new global-optimization algorithm.
redirectFrom: []
---

## Editorial overview

The literature gate returned **REFRAME**. Deterministic global bounds, interval branch-and-bound, convex relaxations, Latin-hypercube designs, scenario methods and CSTR uncertainty analysis are established. The local contribution is a compact, inspectable certificate-versus-incumbent benchmark.

Read [Random Stress Tests Are Not Certificates](/writing/random-stress-tests-are-not-certificates/) for the reduction proof, valid upper enclosure, frozen sampling designs, exact 0/32 result boundary, local-search failure modes, reproducibility signature, figure audit and full literature record.
