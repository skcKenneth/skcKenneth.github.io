---
title: Equation Discovery That Survives a Change of Units
slug: dimensional-equation-discovery
summary: A controlled symbolic-regression benchmark asks whether dimensional constraints improve exact equation recovery, shrink the search space, and prevent unit-fragile formulas.
date: 2026-07-21
lastUpdated: 2026-07-28
featured: true
topics: [symbolic regression, dimensional analysis, scientific machine learning]
heroImage: /science/dimensional-equation-discovery/equation_recovery_phase.svg
draft: false
type: Research Notes
archived: false
readingMinutes: 20
scienceProject: dimensional-equation-discovery
redirectFrom: []
---

An equation can fit every training point and still be physically incoherent. Change metres to centimetres and its prediction changes in a way that cannot be repaired by converting the output. Dimensional analysis supplies a strong prior: terms in a physical equation must have compatible dimensions.

This benchmark asks:

> How much do dimensional invariants improve recovery of compact governing equations when measurements are scarce and noisy?

The study does not discover new physical laws. It uses known laws as controlled targets so exact recovery and failure are observable.

## Transparent monomial search

Candidate equations have the form

$$
\hat y=c\prod_{j=1}^p x_j^{\alpha_j},
$$

with exponents drawn from a finite grammar. For each candidate, the coefficient is fitted in log space and prediction error is measured on held-out samples.

The raw method searches every exponent combination. The dimensional method retains only candidates satisfying

$$
[y]=\prod_j[x_j]^{\alpha_j}
$$

in the base dimensions of mass, length, and time.

Benchmarks include drag scaling, pendulum period, diffusion length, and a fully dimensionless correlation. The final case is a negative control: if every variable is dimensionless, dimensional filtering has nothing to remove.

<figure class="article-figure">
  <img src="/science/dimensional-equation-discovery/equation_recovery_phase.svg" alt="Exact equation recovery across sample size and noise for raw and dimensionally constrained search." loading="lazy" />
  <figcaption><strong>Figure 1.</strong> Recovery phase map. Constraints help where dimensions eliminate plausible-looking wrong formulas; they cannot add information to the dimensionless control.</figcaption>
</figure>

## Search-space collapse

For drag, raw search evaluates 4,096 exponent combinations, while the dimensional filter leaves two. For pendulum and diffusion, 512 candidates collapse to one. The dimensionless control remains at 512 for both methods.

<figure class="article-figure">
  <img src="/science/dimensional-equation-discovery/equation_complexity_units.svg" alt="Candidate-count reduction and unit-shift robustness for dimensional equation discovery." loading="lazy" />
  <figcaption><strong>Figure 2.</strong> Complexity and unit stress. Dimensional filtering is both a computational reduction and a defense against formulas that only work in one unit convention.</figcaption>
</figure>

Across 24 replicates per condition, the constrained method recovers the exact exponent vector in every aggregate benchmark. Raw recovery is also perfect for diffusion and the dimensionless control, but falls to approximately $0.966$ for drag and $0.953$ for the pendulum.

The raw method can achieve slightly lower in-unit RMSE while selecting a wrong exponent. This is a warning against using prediction error as the only discovery criterion: noise can make an invalid formula look marginally better on one unit representation.

## The adversarial unit-change test

After fitting, inputs are converted to alternative units without refitting. A correct dimensional formula should transform consistently. For representative wrong raw winners, unit-shift relative error is about $4.606$ for both drag and pendulum. Constrained exact winners give approximately $0.138$ and $0.153$, values dominated by observational noise and coefficient estimation.

The test is adversarial because it changes representation rather than the physical cases. It asks whether the learned relation respects a symmetry that should be exact.

<figure class="article-figure">
  <img src="/science/dimensional-equation-discovery/equation_genealogy.svg" alt="Genealogy of surviving monomial equations through fit, dimensional filtering and unit-shift testing." loading="lazy" />
  <figcaption><strong>Figure 3.</strong> Equation genealogy. Validation is a sequence of filters—fit, dimensional compatibility, bootstrap stability, and unit covariance—not a single leaderboard.</figcaption>
</figure>

## Why the negative control matters

In the dimensionless correlation, both methods search 512 candidates and recover the same relation with the same error. This prevents a vague “physics always helps” conclusion. A constraint helps only when it removes hypotheses that data alone cannot reliably distinguish.

Dimensions also cannot distinguish all physically different laws. Several monomials can share the same dimension, as the two surviving drag candidates demonstrate. Dimensionless groups may still require asymptotic knowledge, conservation, symmetry, or experiments designed to vary the right combinations.

## Claim boundary

The supported statement is:

> In the declared finite monomial grammar, dimensional filtering reduces candidate counts by up to three orders of magnitude, improves exact recovery for noisy drag and pendulum benchmarks, and prevents severe unit-shift failure; it gives no advantage in the dimensionless negative control.

This does not generalize automatically to unrestricted symbolic regression, differential equations, hidden variables, or genuinely unknown physics. The selected grammar contains the target laws; discovering a relation outside that grammar would require a richer representation and stronger complexity control.

## References

1. E. Buckingham, “On physically similar systems,” *Physical Review*, 1914. [doi:10.1103/PhysRev.4.345](https://doi.org/10.1103/PhysRev.4.345).
2. S.-M. Udrescu and M. Tegmark, “AI Feynman: A physics-inspired method for symbolic regression,” *Science Advances*, 2020. [doi:10.1126/sciadv.aay2631](https://doi.org/10.1126/sciadv.aay2631).
3. M. Schmidt and H. Lipson, “Distilling free-form natural laws from experimental data,” *Science*, 2009. [doi:10.1126/science.1165893](https://doi.org/10.1126/science.1165893).
4. G. I. Barenblatt, *Scaling*, Cambridge University Press, 2003. [doi:10.1017/CBO9780511814921](https://doi.org/10.1017/CBO9780511814921).

