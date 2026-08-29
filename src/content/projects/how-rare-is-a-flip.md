---
title: How Rare Is a Flip?
slug: how-rare-is-a-flip
summary: A reproducible Phase-1 study checks a synthetic low-copy exclusive genetic toggle with an error-bounded finite-state reference and seeded direct SSA.
year: 2026
lastUpdated: 2026-08-29
status: Reproducible study
featured: true
topics: [Stochastic reaction networks, Genetic toggles, Uncertainty quantification]
methods: [Finite-state projection, Gillespie SSA, Wilson intervals]
researchQuestion: Can an independently bounded finite-state calculation and seeded direct simulation agree on one fixed-horizon flip event before a rare-event benchmark is attempted?
dataType: Synthetic low-copy exclusive-toggle CTMC
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/how-rare-is-a-flip/p03_02_fsp_vs_naive_ssa.svg
period: 2026
validation: Four focused tests, the repository policy check, and the documented Phase-1 reproduction all passed.
keyFindings:
  - At cap 20, the FSP bracket was 0.2575946379–0.2575946395 with overflow probability 1.62e-9.
  - Seeded naive SSA recorded 1580 hits in 6000 trajectories, or 0.26333, with a 95% Wilson interval of 0.25234–0.27463.
  - Thirty of 32 independently seeded batch intervals intersected the FSP bracket; this is a smoke diagnostic, not a definitive coverage study.
limitations:
  - This is only the synthetic low-copy Phase-1 smoke regime, not the final preregistered rarity ladder.
  - The retained cap-18 failure and the passing cap-20 truncation audit validate reference handling, not a biological model.
  - AMS and FFPilot were not implemented or evaluated, so the study makes no rare-event speedup or method-ranking claim.
redirectFrom: []
---

## Editorial overview

The literature gate returned **REFRAME**: efficient rare-event sampling for genetic switches is already established, so a generic “enhanced sampling beats direct simulation” claim would not be new. The defensible project is a reliability-boundary benchmark, but only its smallest Phase-1 foundation has been executed so far.

Read [How Rare Is a Flip?](/writing/how-rare-is-a-flip/) for the declared exclusive-toggle CTMC, the fixed first-hit event, the finite-state probability bracket, the seeded SSA comparison, the retained failed truncation, and the exact limits on interpretation.
