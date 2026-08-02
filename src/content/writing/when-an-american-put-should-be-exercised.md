---
title: "When Should an American Put Be Exercised?"
slug: when-an-american-put-should-be-exercised
summary: A free-boundary study turns early exercise into an obstacle problem, then audits price, Greeks, convergence, and complementarity across three numerical methods.
date: 2026-08-02
lastUpdated: 2026-08-02
featured: true
topics: [American options, optimal stopping, variational inequalities, numerical analysis, quantitative finance]
heroImage: /science/american-option-free-boundary/free-boundary-surface.png
type: Research Notes
archived: false
readingMinutes: 16
scienceProject: american-option-free-boundary
redirectFrom: []
---

A European put has one decision date. An American put has a decision at every instant: exercise now, or preserve the right to exercise later. That extra freedom changes the mathematical object. The unknown is no longer only a price $V(S,t)$; it also includes the moving threshold separating exercise from continuation.

This study treats that threshold as evidence. It solves an obstacle partial differential equation, checks complementarity, inspects the Greeks near contact, and compares the result with a recombining binomial tree and least-squares Monte Carlo. The experiment is controlled and synthetic, so it builds numerical understanding rather than giving a trading recommendation.

## From optimal stopping to a free boundary

Under a risk-neutral geometric-Brownian model,

$$
dS_t=(r-q)S_t\,dt+\sigma S_t\,dW_t,
$$

an American put with strike $K$ and maturity $T$ has value

$$
V(S,t)=\sup_{\tau\in[t,T]}
\mathbb E^{\mathbb Q}
\left[
e^{-\int_t^\tau r(u)\,du}(K-S_\tau)^+
\mid S_t=S
\right].
$$

With time to maturity $\theta=T-t$, it satisfies

$$
\min\left(V-(K-S)^+,\;V_\theta-\mathcal LV\right)=0,
$$

where

$$
\mathcal LV=
\frac12\sigma^2S^2V_{SS}+(r-q)SV_S-rV.
$$

Thus $V\ge(K-S)^+$, $V_\theta-\mathcal LV\ge0$, and their product is zero. At each state, either the payoff obstacle binds or the continuation PDE holds. The boundary $S_f(t)$ is discovered by the solution rather than prescribed.

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/free-boundary-surface.png" alt="American put value and early-exercise premium over stock price and time, with an optimal-stopping boundary." width="960" height="470" loading="eager" decoding="async" />
  <figcaption><strong>Figure 1.</strong> The value and early-exercise premium share a moving contact boundary. In the configured case, the valuation-date boundary is $S_f(0)\approx71.7972$.</figcaption>
</figure>

For $S_0=K=100$, $T=1$, $r=0.05$, $q=0.02$, and $\sigma=0.25$, the obstacle solver gives $V_A(100,0)\approx8.56494$. These numbers describe the declared experiment, not a calibrated traded contract.

## Why price alone is incomplete

Inside the exercise region, $V=K-S$, so delta is about $-1$ and gamma about zero. Across the boundary, the continuation value separates smoothly while curvature concentrates near contact.

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/value-and-greeks.svg" alt="American and European put values, intrinsic payoff, delta, and gamma across the exercise boundary." width="960" height="380" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 2.</strong> Value can look stable while gamma remains sensitive near the boundary. Derivatives therefore need their own validation.</figcaption>
</figure>

The terminal payoff has a kink at the strike. A direct Crank–Nicolson start can transmit it into oscillatory curvature. Two backward-Euler half steps before Crank–Nicolson—the Rannacher treatment—damp that artefact.

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/rannacher-smoothing.svg" alt="Raw Crank-Nicolson and Rannacher-smoothed value and gamma after the first time step." width="960" height="390" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 3.</strong> Startup smoothing removes a nonphysical gamma oscillation that a scalar price check could miss.</figcaption>
</figure>

## Solving and auditing the obstacle

On a strike-clustered grid, each time step is a linear complementarity problem:

$$
AV^{n+1}\ge b,\qquad V^{n+1}\ge\Phi,\qquad
(AV^{n+1}-b)^\top(V^{n+1}-\Phi)=0.
$$

Projected successive over-relaxation combines a Gauss–Seidel update with projection onto $\Phi=(K-S)^+$. The computation records iteration counts and a residual spanning primal feasibility, dual feasibility, and complementarity.

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/solver-diagnostics.svg" alt="PSOR iteration counts and complementarity residual over time to maturity." width="960" height="390" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 4.</strong> The maximum complementarity residual is $1.20\times10^{-8}$ and the maximum PSOR count is 60 for this grid and tolerance.</figcaption>
</figure>

A small algebraic residual is not enough. Grid refinement compares each finite-difference value with a finer reference and places error beside runtime.

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/convergence-and-cost.svg" alt="American put price error against stock-grid refinement and runtime." width="960" height="400" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 5.</strong> Refinement is not perfectly monotone because the payoff kink and moving contact set interact with the grid, but the finest solution sharply reduces price error.</figcaption>
</figure>

## Three numerical routes

The obstacle PDE, Cox–Ross–Rubinstein trees, and least-squares Monte Carlo answer the same economic question with different error structures. Trees discretise exercise dates; Monte Carlo adds sampling and regression error; the PDE truncates space and time.

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/method-comparison.svg" alt="Price and error-cost comparison for obstacle PDE, binomial trees, and least-squares Monte Carlo." width="960" height="400" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 6.</strong> Agreement across independent routes is stronger evidence than self-consistency inside one solver. Compact axis labels prevent the method names from colliding.</figcaption>
</figure>

## Parameters change both price and policy

Volatility usually raises option value through convexity, while higher interest rates can make earlier receipt of the strike more attractive. Price and boundary need not move in the same way throughout parameter space.

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/parameter-sensitivity.svg" alt="American put price and valuation-date exercise boundary across rates and volatilities." width="960" height="420" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 7.</strong> The stopping rule is a policy surface, not a decorative by-product of the scalar price.</figcaption>
</figure>

The solver also permits deterministic $r(\theta)$, $q(\theta)$, and $\sigma(\theta)$, using midpoint coefficients at each step.

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/term-structure-extension.svg" alt="Exercise boundaries under constant and time-varying rates, dividends, and volatility." width="960" height="400" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 8.</strong> Similar present-day inputs can imply different stopping paths when their future coefficient curves differ.</figcaption>
</figure>

## What has been verified

The pinned environment passes three automated tests. The complete reproduction regenerates and checksum-validates 34 declared outputs, including all eight figure groups; a quick configuration also succeeds from an empty output directory. Figure titles, panel labels, legends, and method names were visually checked for overlap, and all text is black.

The study establishes reproducibility of this numerical experiment. It does not establish that geometric Brownian motion describes a particular market. Stochastic volatility, jumps, stochastic rates, discrete dividends, transaction costs, liquidity, and calibration uncertainty remain outside scope.

A useful next step is to propagate parameter uncertainty into a distribution over stopping boundaries rather than report one sharp policy. The central lesson is already clear: **an American option should be audited as a price, a stopping policy, and a complementarity problem at the same time.**

## References

1. Brennan, M. J., & Schwartz, E. S. (1977). The valuation of American put options. *The Journal of Finance, 32*(2), 449–462. [https://doi.org/10.1111/j.1540-6261.1977.tb03284.x](https://doi.org/10.1111/j.1540-6261.1977.tb03284.x)
2. Rannacher, R. (1984). Finite element solution of diffusion problems with irregular data. *Numerische Mathematik, 43*, 309–327. [https://doi.org/10.1007/BF01390130](https://doi.org/10.1007/BF01390130)
3. Longstaff, F. A., & Schwartz, E. S. (2001). Valuing American options by simulation: A simple least-squares approach. *The Review of Financial Studies, 14*(1), 113–147. [https://doi.org/10.1093/rfs/14.1.113](https://doi.org/10.1093/rfs/14.1.113)
4. Merton, R. C. (1976). Option pricing when underlying stock returns are discontinuous. *Journal of Financial Economics, 3*(1–2), 125–144. [https://doi.org/10.1016/0304-405X(76)90022-2](https://doi.org/10.1016/0304-405X(76)90022-2)
