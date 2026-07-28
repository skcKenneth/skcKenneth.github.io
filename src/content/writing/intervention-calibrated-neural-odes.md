---
title: A Neural ODE Can Be Physically Plausible and Still Miscalibrated
slug: intervention-calibrated-neural-odes
summary: A synthetic gene-circuit benchmark compares an unconstrained neural vector field with a sign-structured model under unseen interventions, and finds that feasibility does not guarantee honest uncertainty.
date: 2026-07-22
lastUpdated: 2026-07-28
featured: true
topics: [neural ODE, interventions, uncertainty calibration]
heroImage: /science/intervention-calibrated-neural-odes/neural_ode_interventions.svg
draft: false
type: Research Notes
archived: false
readingMinutes: 20
scienceProject: intervention-calibrated-neural-odes
redirectFrom: []
---

A learned differential equation can interpolate observed trajectories while getting the mechanism wrong. The weakness becomes visible under intervention: change an input more strongly than training did, suppress one component, or start from an unusual state. A second problem then appears. Even an ensemble that varies across fits may not widen its uncertainty enough where the intervention is unfamiliar.

This benchmark asks:

> Can structural sign constraints and ensemble uncertainty make a learned neural vector field more honest when predicting unseen interventions on a bistable gene circuit?

The answer is mixed. Structure improves physical feasibility and slightly lowers trajectory error, but its uncertainty intervals are poorly calibrated under the held-out interventions.

## Synthetic toggle-switch world

The data generator is a two-state mutually repressing switch:

$$
\dot x=\frac{\alpha_x}{1+y^{n_y}}-d_xx+u_x(t),
\qquad
\dot y=\frac{\alpha_y}{1+x^{n_x}}-d_yy+u_y(t).
$$

Production is positive, self-decay is negative, each state represses the other, and interventions $u_x,u_y$ have declared directions. Thirty training trajectories provide 1,350 state–intervention–derivative samples.

Two learned vector fields compete:

1. an unconstrained multilayer perceptron;
2. a structured production–decay network whose cross-repression, input effects, decay, and production terms are forced to the declared signs.

Six bootstrap members form each ensemble. Calibration uses only in-domain data; stronger pulses and knockout-like interventions are held out.

<figure class="article-figure">
  <img src="/science/intervention-calibrated-neural-odes/neural_ode_interventions.svg" alt="True and learned toggle-switch trajectories with uncertainty bands under held-out interventions." loading="lazy" />
  <figcaption><strong>Figure 1.</strong> Intervention rollouts. Bands are calibrated before the strong held-out perturbations; the structured model remains non-negative but often under-covers the truth.</figcaption>
</figure>

## Structure changes the hypothesis class

The unconstrained network can represent flexible local derivatives, including biologically implausible sign patterns. The structured model builds production and decay separately and constrains weights through positive transforms. This does not prove the true generator has been identified. It only excludes some vector fields known to violate the declared qualitative mechanism.

On held-out interventions, structured mean RMSE is $0.237$, compared with $0.259$ for the unconstrained family. Its minimum prediction remains positive at $0.0146$. The unconstrained model reaches $-1.178$, an impossible concentration in the simulator.

<figure class="article-figure">
  <img src="/science/intervention-calibrated-neural-odes/neural_ode_phase_fields.svg" alt="True, unconstrained and sign-structured learned vector fields over the gene-circuit phase plane." loading="lazy" />
  <figcaption><strong>Figure 2.</strong> Phase-field comparison. Similar training loss can hide different global geometry; sign structure rules out some impossible flows but does not recover every separatrix correctly.</figcaption>
</figure>

The error improvement is modest. The stronger result is feasibility: the structural architecture prevents negative rollouts in this benchmark. Yet feasibility alone is insufficient. A positive wrong trajectory is still wrong.

## Calibration delivers the negative finding

Ensemble standard deviations are multiplied by a scale chosen on in-domain calibration trajectories. The unconstrained ensemble needs scale $3.52$ and reaches held-out coverage $0.983$. The structured ensemble needs a much larger scale, $39.57$, yet reaches only $0.721$ coverage.

<figure class="article-figure">
  <img src="/science/intervention-calibrated-neural-odes/neural_ode_calibration.svg" alt="Coverage, error, uncertainty association and abstention curves for two neural ODE families." loading="lazy" />
  <figcaption><strong>Figure 3.</strong> Calibration diagnostics. Lower RMSE and better physical signs do not imply valid predictive intervals under intervention shift.</figcaption>
</figure>

Why can a structured ensemble be overconfident? All members share the same restrictive architecture and similar training support. They can agree with one another while sharing the same extrapolation bias. Bootstrap spread measures variation induced by resampling; it does not automatically represent uncertainty about missing mechanisms or intervention shift.

The structured error–uncertainty correlation is $0.514$, whereas the unconstrained value is $0.953$. Removing high-uncertainty cases reduces structured RMSE from $0.237$ to about $0.198$, so its uncertainty is not useless. It is simply not calibrated enough to be interpreted as a valid interval.

## Solver error is checked separately

Neural ODE predictions combine vector-field error with numerical integration error. Tightening solver tolerance reduces relative trajectory difference from about $9.55\times10^{-4}$ at $10^{-3}$ tolerance to $3.09\times10^{-6}$ at $2\times10^{-6}$. This places integration error well below the reported model RMSE.

That separation matters. Changing the ODE solver cannot repair a learned vector field that extrapolates incorrectly; conversely, a good learned field can look poor if integrated too coarsely.

## What “intervention-calibrated” should require

A scientifically useful interval under intervention should be evaluated on the intervention family of interest, not only observational trajectories. Ideally the protocol would:

- declare intervention classes before training;
- separate weak calibration interventions from stronger test interventions;
- report marginal and trajectory-wise coverage;
- examine interval width and failure localization;
- include misspecified-mechanism simulations;
- and allow abstention when support is insufficient.

The present title describes the goal, while the result shows it has not been fully achieved. That negative finding is more informative than quietly reporting only RMSE.

## Claim boundary

All trajectories are synthetic. The learned weights do not identify a real gene circuit. The supported conclusion is:

> In this toggle-switch benchmark, sign structure lowers mean held-out RMSE and prevents negative predictions, but the bootstrap ensemble remains severely under-covered under strong interventions.

Structure and calibration are separate design problems. A future model might combine sign constraints with mechanism ensembles, conformal calibration over intervention families, explicit epistemic priors, or a reject option.

## References

1. R. T. Q. Chen *et al.*, “Neural ordinary differential equations,” *NeurIPS*, 2018. [Proceedings](https://proceedings.neurips.cc/paper/2018/hash/69386f6bb1dfed68692a24c8686939b9-Abstract.html).
2. P. Kidger *et al.*, “Neural controlled differential equations for irregular time series,” *NeurIPS*, 2020. [Proceedings](https://proceedings.neurips.cc/paper/2020/hash/4a5876b450b45371f6cfe5047ac8cd45-Abstract.html).
3. Y. Gal and Z. Ghahramani, “Dropout as a Bayesian approximation,” *ICML*, 2016. [Proceedings](https://proceedings.mlr.press/v48/gal16.html).
4. A. Guo *et al.*, “On calibration of modern neural networks,” *ICML*, 2017. [Proceedings](https://proceedings.mlr.press/v70/guo17a.html).

