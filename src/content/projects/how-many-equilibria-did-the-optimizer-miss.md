---
title: How Many Equilibria Did the Optimizer Miss?
slug: how-many-equilibria-did-the-optimizer-miss
summary: A controlled folding-energy study audits the difference between finding the lowest known energy, recovering every stable family, and tracing unstable equilibrium branches.
year: 2026
date: 2026-10-03T16:20:00+08:00
lastUpdated: 2026-10-03T16:20:00+08:00
period: 2026
status: Reproducible study
featured: true
draft: false
topics: [Nonlinear mechanics, Numerical continuation, Metastability, Mathematical modeling]
methods: [Sine-Galerkin energy, Analytic gradient and Hessian, Independent polynomial census, Multistart minimization, Pseudo-arclength continuation, Shifted deflation]
researchQuestion: When does a pointwise energy-minimization atlas miss verified stable folding families, and when do additional root methods merely fill in unstable stationary structure?
dataType: Synthetic stationary states of a declared heterogeneous folding energy; no material calibration or specimen data
codeAvailable: false
dataAvailable: false
studentSuitable: false
projectUrl: https://skckenneth.github.io/writing/how-many-equilibria-did-the-optimizer-miss/
heroImage: /images/deflated-continuation-folding/01-energy-landscape.svg
validation: Independent two-mode algebraic and interval-Sturm controls, analytic derivatives, original-gradient and Hessian checks, preserved failed attempts, and matched mode, quadrature, initialization and step sensitivity.
keyFindings:
  - The original 42–60 load comparison recovered all stable reference states with independent multistart; added deflation found no new accepted root.
  - All five main workflows recover every stable reference in the sixteen-setting extension; the legacy natural workflow alone loses some stationary coverage, and deflation adds no roots beyond pseudo-arclength.
  - A zero-phase two-mode census verifies a higher-load metastable pair for C=4,S=1, but not for the earlier C=14000,S=42 coefficients over the selected window.
  - At load 76, pure Gaussian starts recovered all four minima in 3/10, 6/10 and 10/10 initialization replicates at budgets 32, 64 and 128; structured starts recovered them in 10/10 at each budget.
  - The secondary event shifts from 75.546888 with two modes to 77.992739 with twelve; the new two-mode minima at load 76 become higher-mode saddles.
  - Phase shifts break spatial reflection without breaking the energy's global sign symmetry.
  - Correct residuals and complete slice coverage do not establish that each continuation trace preserved its branch.
limitations:
  - Completeness is confined to certified nondegenerate two-mode controls; larger-mode references are empirical discovery unions.
  - Local energetic stability in a Galerkin space does not establish continuum stability or physical realization.
  - Saddle-to-minimum energy differences are not certified transition barriers without continuous path evidence.
  - Work summaries disclose shared discovery and extra searches rather than claiming equal-budget universal efficiency.
---

## A beautiful shape map can answer only part of the question

A folding optimizer can reliably find the deepest known configuration while leaving the surrounding equilibrium structure undescribed. Additional stationary states may be unstable saddles, or they may be higher-energy local minima. Those two outcomes have different consequences: more saddles do not by themselves show that minimization failed at finding stable shapes.

This project revisits the [earlier weak-heterogeneity folding study](/projects/heterogeneous-morphoelastic-folding/) using analytic energy derivatives, independent low-dimensional root counts and branch-aware methods. It separates the small benchmark's nonlinear coefficients from the earlier model instead of comparing them as if they were identical.

## A negative result makes the comparison more precise

In the first fixed-phase comparison, multistart recovered every stable reference state between loads 42 and 60. Continuation filled in some stationary states missing from optimizer outputs, while additional deflation supplied no incremental root. The result supports the simpler method over that bounded window.

The extension compares two nonlinear settings, two mode counts and four load phases on 193 slices from loads 42 to 90. All five workflows recover every stable reference. Tangent-predictor natural continuation, pseudo-arclength and the deflated workflow also recover all stationary references; the legacy natural workflow falls to 5/9 in the zero-phase four-mode benchmark. Extra deflated anchor searches accept no new roots in 16,384 attempts. The independent two-mode control identifies a higher-load metastable pair and mixed saddles for the small benchmark, but not for the older nonlinear coefficients. Small load-pattern shifts change the secondary event while preserving sign-paired shapes.

Initialization changes the result without changing the energy. At load 76, ten pure-Gaussian initialization replicates recovered every two-mode minimum in 3/10 cases with 32 starts, 6/10 with 64, and 10/10 with 128. The structured banks recovered all minima in 10/10 at each budget. At load 80, corresponding Gaussian counts are 8/10, 9/10 and 10/10: failures miss one sign partner, not a whole family. Local twelve-mode corrections retain the higher-energy pair as minima, but are not a twelve-mode initialization experiment. The fixed main bank recovered the pair: multistart does not inevitably fail.

Mode refinement gives the sharper warning. The zero-phase secondary event moves from 75.546888 with two modes to 78.740022 with four and 77.992739 with twelve. At load 76, the additional two-mode minima correct to index-1 saddles in twelve modes; at load 80, they remain minima. Verified roots in a restricted shape space are therefore not automatically stable in a richer space. Higher-mode discovery unions are empirical references, not complete inventories or physical-accessibility certificates.

Read [*How Many Equilibria Did the Optimizer Miss?*](/writing/how-many-equilibria-did-the-optimizer-miss/) for the full model, ten research figures, solver-information comparison and the distinction between equilibrium coverage, branch preservation and transition evidence. The article places the calculations alongside established deflation, beam-continuation and solution-landscape work rather than presenting those methods as new.
