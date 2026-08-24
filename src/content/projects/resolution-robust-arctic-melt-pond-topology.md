---
title: Topology at the Edge of Resolution
slug: resolution-robust-arctic-melt-pond-topology
summary: A controlled false-threshold audit of melt-pond connectivity under blur, downsampling, segmentation error, finite windows, and morphology shift.
year: 2026
lastUpdated: 2026-08-24
status: Reproducible study
featured: true
topics: [Arctic Sea Ice, Topological Data Analysis, Observation Error]
methods: [Paired synthetic benchmark, Persistent homology, Finite-size and observation stress tests]
researchQuestion: Which image diagnostic can recover a high-resolution latent melt-pond spanning threshold after blur, downsampling, segmentation error, boundary perturbation, and cropping?
dataType: Controlled synthetic latent fields with a bounded CC BY 4.0 MOSAiC observational case
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/resolution-robust-arctic-melt-pond-topology/observation-pipeline.svg
period: 2026
validation: "Frozen v4 evidence marker verified: all numerical-validation and source-verification gates passed under configuration SHA-256 835f530ab02e9a0fd22b55c53b1d10a49e0ffb27172cb98c983460804fe3aacd."
keyFindings:
  - No diagnostic passed every generator-by-observation robustness gate, so the benchmark abstains from naming a universally resolution-robust threshold signal.
  - Raw spanning had the lowest pooled median absolute error at 0.0144 [95% bootstrap interval 0.0124–0.0163], but its p90 was 0.0666 and the worst Matérn segmentation-displacement stratum reached median 0.08555 and p90 0.12913.
  - The bounded MOSAiC case reports aggregate topology on one 71,875-cell common domain; it is not latent truth, and Sentinel-2 was excluded after HTTP 503 requests because its metadata did not declare the floe-motion/co-registration transform needed for controlled pixelwise comparison.
limitations:
  - The synthetic Matérn, germ–grain, and random-field Ising families are controlled morphology tests, not calibrated Arctic climate or drainage models.
  - The latent truth is a finite-window, four-connected pond spanning threshold; other hydraulic, radiative, or ecological definitions can produce different thresholds.
  - The two-date MOSAiC case tests representation sensitivity and cannot identify latent percolation truth, seasonal timing, or a causal melt mechanism.
redirectFrom: []
---

## Editorial overview

Read [Topology at the Edge of Resolution](/writing/topology-at-the-edge-of-resolution/) for the complete mathematical model, literature review, frozen experiment, observation-error audit, failure analysis, limitations, and ten approved figures.

The study holds each latent pond field fixed while blur, pixel size, a paired one-pixel segmentation-boundary displacement, boundary texture error, and crop change its observed representation. Direct spanning, a discovery-calibrated pond-fraction constant, a fractal-gradient breakpoint, Euler and Betti curves, exact persistence-pruned Betti curves, and a pond-interior distance bottleneck throat are compared against the same high-resolution oracle.

Use the [Melt-Pond Topology Lab](/teaching/melt-pond-topology-lab/) to explore how nearly unchanged pond area can coexist with a reversed connectivity decision. The public article and lab expose no private source, notebook, raw geospatial file, or coordinate-level image.
