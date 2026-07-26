---
title: "When Sustainable Harvesting Becomes a Trap"
slug: when-sustainable-harvesting-becomes-a-trap
summary: A stochastic strong-Allee model shows why average sustainable yield can conceal a collapse threshold and why a feedback refuge changes the finite-horizon risk–yield frontier.
date: 2026-07-24
lastUpdated: 2026-07-26
featured: true
topics: [population dynamics, Allee effect, stochastic simulation, harvesting, risk, feedback control]
heroImage: /images/writing/july-biology/harvest-risk-frontier.svg
type: Research Notes
archived: false
redirectFrom: []
---

A harvesting rule can appear sustainable in an average year and still be dangerous.

The difficulty is not merely that environmental conditions fluctuate. If a population experiences a strong Allee effect—negative per-capita growth below a critical abundance—a temporary decline can cross a boundary after which recovery is no longer expected. A policy designed around mean carrying capacity may therefore fail through the interaction of seasonality, random shocks, and inflexible extraction.

This synthetic study compares a fixed quota, proportional harvesting, and a threshold-adaptive refuge rule. It asks a risk-aware question: which policy delivers useful harvest while keeping the estimated probability of finite-horizon collapse below an acceptable level?

It is not a stock assessment and is not calibrated to a named species. The model is deliberately compact so that the mechanism and the limitations remain visible.

## A population with two density thresholds

Let \(P_t\) denote population abundance after harvesting at time \(t\). The update is

$$
P_{t+1}
=
\max\left\{
0,\;
P_t+
rP_t\left(1-\frac{P_t}{K_t}\right)
\left(\frac{P_t}{L}-1\right)
-H_t
\right\}.
$$

The logistic factor \(1-P_t/K_t\) limits growth near carrying capacity. The Allee factor \(P_t/L-1\) is negative below the critical level \(L\). Thus the model has two qualitatively different low-population regimes: above \(L\), reduced abundance may recover; below \(L\), deterministic growth pushes downward.

Environmental capacity varies as

$$
K_t=K_0\left[
1+A\sin\left(\frac{2\pi t}{T}\right)+\sigma\varepsilon_t
\right],
\qquad \varepsilon_t\sim N(0,1),
$$

with a numerical lower bound to keep \(K_t\) positive. The sinusoid creates predictable seasons; the Gaussian term changes how severe each season becomes.

The default experiment uses

$$
P_0=70,\quad r=0.2,\quad K_0=100,\quad
A=0.25,\quad T=12,\quad \sigma=0.06,\quad L=20.
$$

Each policy-intensity setting is evaluated with 150 stochastic replicates over 200 time steps. Common random numbers are used so that policy comparisons share environmental sequences.

## Three policies encode three responses

A fixed quota requests the same absolute amount:

$$
H_t=H.
$$

Its operational target is predictable, but the per-capita burden rises as the stock falls.

Proportional harvesting requests a fraction of current abundance:

$$
H_t=hP_t.
$$

Absolute extraction decreases automatically when the stock is small, although no abundance is explicitly protected.

The threshold-adaptive rule removes a fraction of the surplus above refuge \(P_s\):

$$
H_t=h\max(P_t-P_s,0),
$$

with \(P_s=60\) in the default experiment. Harvest stops at or below the refuge.

<figure class="article-figure">
  <img src="/images/writing/july-biology/harvest-feedback.svg" alt="Three-panel schematic comparing fixed-quota, proportional, and threshold-adaptive harvesting as a population declines toward an Allee threshold." width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 1.</strong> The policies differ in feedback structure. A fixed quota keeps the same absolute removal, a proportional rule reduces catch with abundance, and the refuge rule stops extraction before the protected level. The diagram is schematic.</figcaption>
</figure>

This framing matters because a policy is not just a parameter. It is a mapping from observed state to action. The refuge rule can buffer the Allee threshold only if abundance is observed accurately and action is timely.

## The risk cliff

Two outputs are recorded:

$$
\widehat p_{\mathrm{ext}}
=
\frac{\text{runs reaching }P_t<1}
{\text{simulation runs}},
$$

and mean realized harvest per time step, \(\overline Y\). These metrics must remain separate. A large requested catch can produce little realized long-run yield if the stock collapses early.

The fixed-quota grid shows an abrupt transition. Quota \(H=7\) produced one extinction in 150 runs; \(H=8\) produced 28; \(H=9\) produced 150. Mean yield rose from \(6.98\) to \(7.23\) between quotas 7 and 8, then fell to \(1.89\) at quota 9 because future catch disappeared.

The proportional rule also crossed a sharp boundary: \(h=0.14\) produced three extinctions in 150 runs and mean yield \(8.86\); \(h=0.16\) produced extinction in every run and mean yield only \(1.63\).

Across the tested threshold-adaptive grid, no run became extinct. At \(h=0.8\), mean yield reached \(10.27\). This is the strongest finite-horizon point in the supplied grid, not a proof that the policy is safe for all parameters or all time.

<figure class="article-figure">
  <img src="/images/writing/july-biology/harvest-risk-frontier.svg" alt="Two-panel figure showing extinction-risk cliffs and the finite-horizon risk-yield positions of fixed-quota, proportional, and threshold-adaptive harvesting." width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 2.</strong> Estimated risk and realized yield from 150 replicates per policy intensity. The threshold-adaptive rule occupies a favourable part of this tested grid, while small increases in the other controls cross a collapse boundary. Zero observed extinctions does not imply zero true risk.</figcaption>
</figure>

The decision problem is better written as

$$
\max_\theta\ \mathbb E[Y(\theta)]
\quad\text{subject to}\quad
\Pr(\tau_{\mathrm{ext}}\le N)\le\alpha,
$$

where \(\theta\) includes the policy family and its control, \(N\) is the planning horizon, and \(\alpha\) is a tolerated risk. Maximum average yield and robust sustainability are not the same objective.

## Why the refuge is not a free guarantee

The adaptive rule uses true \(P_t\) without delay. A real manager observes a noisy proxy, perhaps

$$
\widehat P_t=P_t e^{\eta_t}.
$$

Positive error can trigger harvesting when true abundance is already too low. Delayed surveys can have the same effect. A refuge policy is therefore information-intensive: its apparent robustness may depend on monitoring quality.

The experiment also treats environmental shocks as independent, contains no age or spatial structure, and uses one strong-Allee equation. It omits demographic stochasticity, economic price variation, implementation error, and parameter uncertainty. Most importantly, the 200-step risk estimate is not an infinite-horizon persistence theorem. A policy with no observed collapse in 150 finite trajectories can still have positive long-run extinction probability.

## Verification and the next research question

The full configuration produced 34 risk–yield summary rows, representative trajectories, four figure families, and an animation. Six unit tests, output validation, and the SHA-256 manifest check passed. These checks support the code and the reported synthetic summaries.

A stronger study would treat abundance as a hidden state and compare policies under filtering uncertainty. It could introduce autocorrelated environments, delayed control, alternative Allee mechanisms, and robust optimization over uncertain \(r\), \(L\), and \(\sigma\). Policy ranking should then be evaluated out of sample over several horizons rather than on one fixed parameter grid.

## Conclusion

Environmental variation does not merely add noise around a sustainable mean. Near an Allee threshold, it can expose a nonlinear boundary between recovery and collapse.

The central modeling lesson is to evaluate a feedback rule over distributions of trajectories, not only at an average equilibrium. A policy should be judged by the yield it produces at an explicitly tolerated level of risk—and by the information required to keep its safeguards functioning.

## References

1. Ricker, W. E. (1954). Stock and recruitment. *Journal of the Fisheries Research Board of Canada, 11*(5), 559–623. [https://doi.org/10.1139/f54-039](https://doi.org/10.1139/f54-039)
2. May, R. M. (1976). Simple mathematical models with very complicated dynamics. *Nature, 261*, 459–467. [https://doi.org/10.1038/261459a0](https://doi.org/10.1038/261459a0)
3. Stephens, P. A., Sutherland, W. J., & Freckleton, R. P. (1999). What is the Allee effect? *Oikos, 87*(1), 185–190. [https://doi.org/10.2307/3547011](https://doi.org/10.2307/3547011)
4. Lande, R. (1993). Risks of population extinction from demographic and environmental stochasticity and random catastrophes. *The American Naturalist, 142*(6), 911–927. [https://doi.org/10.1086/285580](https://doi.org/10.1086/285580)
5. Reed, W. J. (1979). Optimal escapement levels in stochastic and deterministic harvesting models. *Journal of Environmental Economics and Management, 6*(4), 350–363. [https://doi.org/10.1016/0095-0696(79)90014-7](https://doi.org/10.1016/0095-0696(79)90014-7)
6. Hilker, F. M., & Liz, E. (2020). Threshold harvesting as a conservation or exploitation strategy in population management. *Theoretical Ecology, 13*, 519–536. [https://doi.org/10.1007/s12080-020-00465-8](https://doi.org/10.1007/s12080-020-00465-8)
