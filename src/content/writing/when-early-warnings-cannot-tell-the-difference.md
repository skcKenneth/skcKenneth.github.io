---
title: "When Early Warnings Cannot Tell the Difference"
slug: when-early-warnings-cannot-tell-the-difference
summary: A system that recovers slowly and an environment that persists can leave the same statistical signature. An exactly sampled stochastic experiment shows what passive monitoring can identify, and which extra observations change the question.
date: 2026-09-09
lastUpdated: 2026-09-09
featured: false
draft: false
topics: [Environmental modeling, Stochastic dynamics, Early warning signals, Identifiability, AI for science]
heroImage: /images/early-warnings/01-mechanisms.svg
type: Research Notes
archived: false
---

A lake-monitoring team sees something unsettling. Deviations in a water-quality indicator are becoming larger. Successive measurements resemble one another more strongly. Once the indicator moves away from its usual level, it seems to remain there longer.

One explanation is that the ecosystem is losing its ability to recover. Another is that the disturbances arriving from outside the lake have become more persistent. A sequence of prolonged weather anomalies could keep pushing a healthy recovery mechanism in the same direction.

This lake is a hypothetical example, not a monitored field site. Its purpose is to pose a question that matters whenever observations combine a system's response with an incompletely measured environment: **whose memory are we seeing?**

The distinction matters for what happens next. If recovery has weakened, investigating internal feedbacks may be urgent. If external forcing has changed, measuring that forcing becomes essential. Both situations can justify concern, but they support different explanations and potentially different actions.

This article builds a small mathematical experiment in which the two explanations cannot be separated using the observed indicator alone. The ambiguity survives longer records, extra summary statistics, and any classifier given only the same kind of observations. It disappears when the experiment supplies the right additional information.

## What the experiment found

The result is an exact property of a stationary linear Gaussian model, illustrated by ten independently simulated ensembles. Each ensemble contains 1,000 paths, with 2,048 observations per path.

Two relaxation rates shape the observed process: the ecosystem's own recovery rate and the rate at which environmental forcing forgets its past. Interchanging these rates leaves the entire stationary probability law of the observed process unchanged. The hidden physical interpretation changes; the distribution of the measured record does not.

For one pair of mechanisms, the recovery rates differ by a factor of ten, yet the theoretical variance is the same, about 0.181818, and lag-1 autocorrelation at the chosen sampling interval is about 0.997144. Independent simulations fluctuate around the same theoretical structure. A known displacement of the system alone, however, produces different recovery curves.

This is a mechanism explanation and synthetic experiment, not a claim of a newly discovered theorem. It does not estimate a real lake's resilience or forecast a tipping date. Its useful contribution is to make one particular inferential limitation visible enough that we can design a better measurement.

## Why slower recovery looks like a warning

Begin with a deterministic system near a stable equilibrium. Let $X$ be a small deviation from that equilibrium, so zero denotes the reference state. A first-order approximation is

$$
\frac{dX}{dt}=-kX,\qquad k>0.
$$

After a displacement $\delta$, the response is $X(t)=\delta e^{-kt}$. The recovery time $1/k$ is the time required for the displacement to fall to $1/e$ of its initial size. A large $k$ removes deviations quickly; a small $k$ leaves them visible for longer.

This local rate can emerge from a nonlinear model. If the full dynamics are $\dot x=f(x,\mu)$ and $x_*(\mu)$ is an equilibrium, then linearizing around it gives $k=-\partial_x f(x_*,\mu)$ on a stable branch. Near certain bifurcations this slope approaches zero. Small disturbances then decay more slowly, a phenomenon called critical slowing down.

The classical early-warning literature develops this connection between local recovery and observable fluctuations. Scheffer and colleagues' review provides the broad starting point for using such signals to investigate approaching critical transitions. The connection is conditional: a statistical symptom acquires its physical meaning through assumptions about the dynamics and disturbances. [Scheffer et al., 2009](https://doi.org/10.1038/nature08227).

To see those assumptions explicitly, add idealized white-noise forcing:

$$
dX_t=-kX_t\,dt+\sigma\,dW_t.
$$

Here $W_t$ is Brownian motion. Its increment over a time interval of length $dt$ has variance $dt$; $\sigma$ scales the strength of those random innovations. White noise is a useful limiting model for disturbances whose memory is short compared with the response being studied. It is not a claim that weather literally has no temporal structure.

In stationarity, the variance and normalized autocorrelation are

$$
\operatorname{Var}(X)=\frac{\sigma^2}{2k},
\qquad
\rho_X(\tau)=e^{-k|\tau|}.
$$

The variance relation follows by balancing the injection of random fluctuation against deterministic dissipation. Applying the stochastic product rule to $X^2$ gives

$$
\frac{d}{dt}\mathbb E[X^2]=-2k\mathbb E[X^2]+\sigma^2.
$$

Stationarity sets the left side to zero. For the autocorrelation, the component inherited from an earlier state decays by $e^{-k\tau}$, while future Brownian increments are independent of that earlier state.

If $\sigma$ and the sampling interval $\Delta$ remain fixed, decreasing $k$ therefore increases both variance and $\rho_X(\Delta)$. This is the familiar reasoning behind two common indicators. It is persuasive precisely because the assumptions make the mechanism transparent.

<figure>
  <img src="/images/early-warnings/02-white-noise.svg" alt="Two analytic panels show increasing stationary variance and lag-one autocorrelation as the recovery rate decreases in a white-noise model." loading="lazy" />
  <figcaption>Figure 1. The white-noise benchmark holds the innovation amplitude at 0.2 and observation spacing at 0.25. Read both panels from right to left to follow slower recovery. These curves describe the one-state benchmark, not the coloured-noise experiment introduced below.</figcaption>
</figure>

An autocorrelation value is also inseparable from its lag. A value near one at a very short sampling interval can simply mean that consecutive measurements are close together in time. Comparing daily and monthly lag-1 correlations without matching their physical lag confuses the observation schedule with the system.

Variance has its own ambiguity. Increasing $\sigma$ raises variance even when $k$ does not change. Autocorrelation seems to offer a way around that problem in this particular white-noise model, because its formula does not contain $\sigma$. But that apparent robustness depends on how the noise enters.

## The environment also has a memory

Real disturbances often persist. A wet period can last several days; a nutrient input can remain elevated; a temperature anomaly can influence successive observations. Instead of putting independent innovations directly into $X$, give the environment a state of its own:

$$
\begin{aligned}
dX_t&=(-kX_t+Z_t)\,dt,\\
dZ_t&=-aZ_t\,dt+q\,dW_t.
\end{aligned}
$$

The environmental driver $Z$ is an Ornstein–Uhlenbeck process. Its memory time is $1/a$, while $1/k$ remains the intrinsic recovery time of $X$ when the forcing is held unchanged. All variables and times in this experiment are dimensionless.

The coupling coefficient from $Z$ into $X$ has been set to one by the choice of units. That choice is part of the model. An unknown coupling or an unknown sensor gain would introduce additional scaling questions; neither is being silently estimated here.

Consider two mechanisms:

| Mechanism | System recovery | Environmental memory |
|---|---|---|
| A: $(k,a)=(0.1,1)$ | Slow: recovery time 10 | Short: memory time 1 |
| B: $(k,a)=(1,0.1)$ | Fast: recovery time 1 | Long: memory time 10 |

Both have $q=0.2$. Mechanism A retains disturbances because the response relaxes slowly. Mechanism B retains them in the observed record because the input keeps pushing, even though the response itself relaxes quickly.

There is a further physical detail: fixing $q$ does not fix the variance of $Z$. In this model $\operatorname{Var}(Z)=q^2/(2a)$. Lowering $a$ makes the environment both more persistent and more variable. The comparison holds the amplitude of fresh innovations fixed, not the environmental variance. This is an explicit modeling choice, and it prevents an overly narrow interpretation of B as “memory changed and absolutely nothing else did.”

<figure>
  <img src="/images/early-warnings/01-mechanisms.svg" alt="Random weather innovations pass through an environmental memory filter and a system recovery filter before producing the observed record; the two mechanisms exchange their rates." loading="lazy" />
  <figcaption>Figure 2. One observed record contains the effect of two filters. A and B exchange the rates associated with environmental memory and intrinsic recovery. The diagram describes the synthetic mechanism; no lake measurements are used.</figcaption>
</figure>

The model contains only a stable local response and a stochastic driver. For every positive $k$ and $a$ tested here, the joint deterministic system has two negative eigenvalues. There is no second ecological state, collapsing population, or threshold crossing built into the experiment.

Calling A “slow recovery” is therefore exact; calling it “an imminent ecosystem collapse” would add information the model does not contain. The first claim concerns a local slope. The second would require a nonlinear mechanism, a changing control parameter, and an event definition.

## Two mechanisms, the same observed process

Frequency space makes the ambiguity unusually clear. A linear relaxation equation acts as a filter: slowly varying inputs pass through differently from rapidly varying inputs. At angular frequency $\omega$, the environment contributes a factor $1/(a+i\omega)$ and the system contributes $1/(k+i\omega)$.

Their product gives the transfer function from the white-noise innovations to the observable:

$$
H_X(\omega)=\frac{q}{(a+i\omega)(k+i\omega)}.
$$

Using the convention that covariance is the inverse Fourier transform with factor $1/(2\pi)$, its two-sided power spectral density is

$$
S_X(\omega)=
\frac{q^2}{(\omega^2+a^2)(\omega^2+k^2)}.
$$

The two factors multiply. Exchanging $a$ and $k$ leaves their product unchanged. Thus A and B have the same spectrum at every frequency, rather than merely sharing one selected summary.

At low frequencies, both filters can contribute substantially to long excursions. At high frequencies, their combined attenuation produces an $\omega^{-4}$ decay. The spectrum can reveal the presence of two characteristic rates, but the ordering of those rates in this cascade is absent from the observed output.

What exactly does “the same” mean? Both stationary outputs have mean zero and are Gaussian processes. A Gaussian process is determined by its mean and covariance function. Equal spectra imply equal covariance functions, and therefore equal joint distributions for every finite collection of observation times.

In particular, the vector $(X_{t_1},\ldots,X_{t_n})$ has the same distribution under A and B for any fixed times. This is stronger than equal variance, equal lag-1 correlation, or an inability to distinguish two finite datasets in one statistical test.

It does not require two independently simulated paths to lie on top of each other. Independent draws from the same distribution will usually look different. Equality of laws describes which patterns occur with which probabilities; it does not prescribe identical random outcomes.

Nor does a simulation prove the equality. The argument rests on the transfer function and Gaussian assumptions. Simulation checks that the implementation is consistent with that argument and shows how an analyst encounters the result through finite records.

<figure>
  <img src="/images/early-warnings/03-spectra.svg" alt="The analytic spectra of A and B coincide, their relative difference is zero, and independent finite-record ensemble spectra fluctuate around the sampled theoretical spectrum." loading="lazy" />
  <figcaption>Figure 3. Open circles keep the second analytic curve visible where it coincides with the first. The middle panel checks their relative difference explicitly. The lower panel uses independently simulated ensembles; its theoretical comparison includes the effect of discrete sampling. Small disagreements in this panel include finite-record spectral leakage and Monte Carlo variation.</figcaption>
</figure>

### Checking the result without a spectrum

The same conclusion appears in the stationary moments. Write

$$
\begin{aligned}
v_Z&=\mathbb E[Z^2],\\
c_{XZ}&=\mathbb E[XZ],\\
v_X&=\mathbb E[X^2].
\end{aligned}
$$

Balancing these quantities gives three equations:

$$
\begin{aligned}
2av_Z&=q^2,\\
(k+a)c_{XZ}&=v_Z,\\
kv_X&=c_{XZ}.
\end{aligned}
$$

Solving them yields

$$
\begin{aligned}
v_Z&=\frac{q^2}{2a},\\
c_{XZ}&=\frac{q^2}{2a(k+a)},\\
v_X&=\frac{q^2}{2ak(a+k)}.
\end{aligned}
$$

Only the last quantity is symmetric in the two rates. This is important: the joint process $(X,Z)$ is not observationally equivalent once $Z$ is measured with a known scale. Information capable of separating the mechanisms exists, but the original sensor does not collect it.

The normalized autocorrelation of $X$ is

$$
\rho_X(\tau)=
\frac{a e^{-k|\tau|}-k e^{-a|\tau|}}{a-k},
\qquad a\ne k.
$$

The apparent singularity at $a=k$ is removable. Taking the limit gives

$$
\rho_X(\tau)=(1+k|\tau|)e^{-k|\tau|}.
$$

This equal-rate case matters in practice. A formula that divides by $a-k$ without handling the limit can produce numerical failure exactly where the two mechanisms meet. Here it provides a useful analytic control, and it is included in the experiment.

The output covariance can also be understood as the result of two exponential filters in series. The order of scalar convolution does not change the final filter. However, the intermediate state and the response to an intervention applied between those filters do depend on which filter is where. That distinction is why passive equivalence and different intervention responses can coexist.

## What the finite-record experiment shows

The parameter grid uses five separate stationary conditions,

$$
\begin{gathered}
r\in\{0.1,0.2,0.4,0.7,1\},\\
A:(k,a)=(r,1),\\
B:(k,a)=(1,r).
\end{gathered}
$$

Each condition has 1,000 independent paths, observed 2,048 times at interval $\Delta=0.25$. The elapsed time from the first observation to the last is 511.75. Fresh random streams are used for every ensemble.

The grid is not a time-varying trajectory. Moving across its columns does not represent a lake gradually approaching a threshold. Concatenating the records would create changes in the data-generating process that are absent from the stationary proof.

The simulator samples the linear stochastic system exactly at the observation times. In matrix form, with $Y=(X,Z)^\mathsf T$,

$$
\begin{gathered}
A=\begin{pmatrix}
-k&1\\
0&-a
\end{pmatrix},\quad F=e^{A\Delta},\\
Y_{j+1}=F Y_j+\eta_j.
\end{gathered}
$$

If $P$ is the stationary covariance matrix, the innovation covariance is

$$
Q_\Delta=P-FPF^\mathsf T.
$$

The initial state is drawn from the stationary Gaussian law with covariance $P$. There is no artificial warm-up transient to be confused with changing resilience. Exact sampling removes time-stepping bias for this linear model; it does not remove finite-sample uncertainty.

Independent checks compare the analytic covariance with the continuous Lyapunov equation, integrate the spectrum back to the variance, and compare the covariance formula with a matrix-exponential calculation. Two half-steps reproduce one full step in both transition and innovation covariance. The equal-rate case is tested alongside the other pairs.

The stationary values shared by A and B are:

| $r$ | Variance of $X$ | Lag-1 autocorrelation |
|---:|---:|---:|
| 0.1 | 0.181818 | 0.997144 |
| 0.2 | 0.083333 | 0.994337 |
| 0.4 | 0.035714 | 0.988862 |
| 0.7 | 0.016807 | 0.980988 |
| 1.0 | 0.010000 | 0.973501 |

The large autocorrelations partly reflect the short observation spacing relative to both filters. They are not stand-alone numerical thresholds for danger. In particular, an analyst applying the white-noise formula $-\log(\rho_X(\Delta))/\Delta$ here would obtain an apparent rate that generally equals neither of the two physical rates.

For $r=0.1$, the average known-zero-mean second moment was 0.182640 under A and 0.181439 under B. Their Monte Carlo standard errors, calculated across independent paths, were 0.001239 and 0.001207 respectively. Both are consistent with the population variance 0.181818.

Across all ten ensembles, the largest absolute standardized discrepancy of this second-moment estimate from theory was about 1.15 Monte Carlo standard errors. The computation checked a predeclared tolerance of five standard errors. This is an implementation consistency check, not evidence that the mechanisms are scientifically distinguishable or an estimate of a forecasting method's accuracy.

### Why the sample variance sits below theory

A real analyst rarely knows the population mean exactly. For each path, the plotted estimator subtracts its own sample mean:

$$
\widehat v=\frac1N\sum_{j=1}^N(X_j-\overline X)^2.
$$

Because the true mean is zero,

$$
\mathbb E[\widehat v]=v_X-\operatorname{Var}(\overline X).
$$

Positive serial correlation makes the second term appreciable. A long, slowly wandering excursion shifts the record's estimated mean; subtracting that mean removes part of the low-frequency variability we wanted to measure.

Writing the covariance as $C_X(\tau)=v_X\rho_X(\tau)$, the exact mean-estimation penalty is

$$
\begin{aligned}
\operatorname{Var}(\overline X)
&=\frac{v_X}{N}\\
&\quad+\frac{2}{N^2}\sum_{h=1}^{N-1}(N-h)C_X(h\Delta).
\end{aligned}
$$

At $r=0.1$, the expected demeaned variance is about 0.174160, although the population variance is 0.181818. The simulated ensemble means are 0.175033 and 0.173840. This discrepancy has a predictable finite-record explanation; it need not signal a faulty simulation or a different ecological mechanism.

Changing the denominator from $N$ to $N-1$ only applies the usual independent-data correction. It does not generally cancel the contribution from correlated observation pairs. Likewise, collecting measurements more frequently over the same total duration is not equivalent to observing more independent recovery episodes.

<figure>
  <img src="/images/early-warnings/04-estimator-distributions.svg" alt="Medians and central 95 percent intervals of sample variance and lag-one autocorrelation from 1,000 paths per mechanism at five separate stationary conditions, with shared population values marked in black." loading="lazy" />
  <figcaption>Figure 4. Circles and squares show independent ensembles for A and B. Bars span the 2.5th to 97.5th percentiles across paths; they describe variability between records, not confidence intervals for an ensemble mean. Black marks show the shared stationary population values. Demeaning and finite-record estimation explain why the sample distributions need not be centered exactly on those marks.</figcaption>
</figure>

The autocorrelation estimator uses the adjacent centered-product sum divided by the full centered sum of squares. Its finite-record behavior depends on that definition, including the missing last adjacent product. It is not an unbiased estimate of the population correlation. Both mechanisms use the same estimator, so the comparison is fair without pretending that its median must equal theory.

For the spectrum, an additional distinction matters. The continuous-time analytic curve and the spectrum of a sampled sequence are not identical objects. Sampling folds contributions from higher frequencies into the observed frequency band. The ensemble periodograms are therefore compared with the spectrum implied by the exact sampled covariance. Finite record length still introduces leakage; averaging paths reduces random spectral scatter, not that deterministic finite-window effect.

## Why a stronger AI cannot manufacture the missing label

Suppose a classifier receives a full record of $X$ and must decide between these two fixed mechanisms. Under equal prior probabilities and the stationary design, the likelihoods are identical:

$$
p(x_1,\ldots,x_N\mid A)=p(x_1,\ldots,x_N\mid B).
$$

Bayes' rule therefore leaves the posterior odds equal to the prior odds. With equal priors, optimal expected classification accuracy is 50%. This is an analytic consequence of the experimental setup; no neural network was trained to produce a 50% benchmark result.

The argument does not depend on the classifier's architecture. A transformer, a recurrent model, or a hand-designed indicator receives a random object with the same law under both labels. Applying a function to that object cannot make its two distributions different.

Training can nevertheless produce confident predictions. Imagine a simulator that labels every low-frequency record “weak recovery” while never generating persistent forcing. A model can learn that association accurately within the training distribution. Its confidence then reflects a restricted set of possibilities supplied by the simulator.

When the deployment environment admits the second mechanism, confidence alone does not establish identification. The missing question is whether the training distribution included scientifically plausible alternatives with similar observable behavior. A held-out split of the same restricted simulator would not answer that question.

The same caution applies to apparently helpful features. Variance, autocorrelation at several lags, power in low-frequency bands, and wavelet coefficients are all transformations of the original record. Under the exact equivalence here, none supplies a new physical label.

That does not make them useless. They can estimate the observed process more accurately, support forecasts of $X$, reveal departures from the assumed model, or help compare hypotheses that are not observationally equivalent. The limitation concerns the particular question “which of these two rates belongs to intrinsic recovery?”

In fact, forecasting and mechanism identification can separate cleanly. If A and B imply the same joint law for the observed past and future, they also imply the same conditional forecast distribution for future $X$ given past $X$. A model can forecast the next readings well while remaining unable to identify the mechanism.

This is a useful lesson for AI for science. Prediction error is evidence about the prediction task. It becomes evidence about a hidden mechanism only when the observation model, hypothesis space, and identification conditions connect those tasks.

### What a longer record would still accomplish

More observations can reduce uncertainty about variance, correlation shape, and the unordered pair of characteristic rates. They can make the two spectral bends easier to estimate if both fall within the observable frequency range.

But locating two rates is not the same as assigning their physical roles. Even with arbitrarily precise output statistics, the likelihood retains its exchange symmetry. Reporting only one optimum can hide another equally supported interpretation.

An optimizer may select one mode because of its initial values or parameter bounds. A posterior sampler may explore only one mode because transitions between modes are difficult. Neither computational behavior creates scientific evidence favoring that mode.

Ordering the rates, for example imposing $k\le a$, is a legitimate parameterization of an unordered pair. Calling the smaller rate “ecosystem recovery” then requires an additional assumption that the environment relaxes faster. That assumption should come from external knowledge, not from the output record that cannot distinguish the order.

## Which additional observations change the answer?

There are two especially direct ways to break the symmetry: observe the driver, or perturb the system at a known point in the causal chain.

If $Z$ can be measured with an understood observation model, its covariance is no longer symmetric under the parameter exchange. Its own autocorrelation decays at rate $a$. Having estimated the environmental time scale, an analyst has information for assigning the other observed time scale to the response.

In an ideal noise-free continuous record of both variables, the equation $\dot X=-kX+Z$ supplies a direct relation for $k$. Real discrete and noisy data require joint state-space estimation; simply differentiating a noisy sensor record can amplify measurement noise badly.

A rain gauge is not automatically a measurement of $Z$. The effective driver in the lake could combine runoff, nutrient transport, temperature, and delayed catchment response. A useful sensor must measure a variable whose relationship to the modeled input is physically understood.

Sensor placement should therefore follow the ambiguous mechanism. Collecting a second copy of the same water-quality indicator can reduce instrument error, but it does not necessarily reveal whether memory sits in the environment or in the ecosystem. Measuring a forcing-related variable can be more informative even if its readings are less frequent.

The second possibility is a known initial displacement of $X$ that leaves $Z$ unchanged. Compare perturbed and unperturbed systems exposed to the same subsequent forcing. Their difference obeys

$$
\frac{d}{dt}\Delta X=-k\Delta X,\qquad
\Delta X(0)=\delta.
$$

so

$$
\Delta X(t)=\delta e^{-kt}.
$$

The environment cancels from this difference because the intervention did not change it. An ensemble experiment with matched initial environmental distributions and independent zero-mean forcing has the same mean-response difference, although individual noisy paths do not cancel exactly.

Under A the response decays with time constant 10; under B it decays with time constant 1. That distinction was absent from the passive law of $X$, but it appears in the intervention response because the intervention targets the state between the two filters.

<figure>
  <img src="/images/early-warnings/05-intervention.svg" alt="Identical passive autocorrelation curves appear above distinct analytic mean recovery curves after a known perturbation of X alone." loading="lazy" />
  <figcaption>Figure 5. Passive memory cannot label the rates, while an ideal known displacement of X can. The lower curves are analytic responses, normalized by the initial displacement. They are not outcomes from a real ecological intervention, and they assume the intervention leaves the environmental driver unchanged.</figcaption>
</figure>

This thought experiment does not recommend perturbing an actual lake. A controlled microcosm, an independently justified natural experiment, or an existing management intervention with suitable observations might offer relevant information. Whether any of these represents the local dynamics of interest needs its own evidence.

A natural storm is particularly easy to misinterpret as the required experiment. It may change $Z$ for a prolonged period rather than create an isolated displacement of $X$. Fitting an exponential to the subsequent trajectory can then estimate the combined response to continuing forcing instead of intrinsic recovery.

The intervention amplitude also matters. The derivation uses a linear local response. A large manipulation can alter background conditions, activate nonlinear feedbacks, or change the very rate being measured. Repeated small perturbations with stable conditions address a different scientific question from a single large disturbance.

Even in an ideal design, estimating a decay rate requires observations over useful lags. If all measurements occur long after recovery has finished, the signal is gone. If they cover only a tiny fraction of the recovery time, different decay rates may be practically hard to separate despite being theoretically identifiable.

## From a statistical change to a scientific explanation

There are several steps between detecting a change in a monitoring record and claiming that a tipping point is approaching. The measured process might change because recovery changes, because forcing changes, because the sensor changes, or because the preprocessing changes.

The 2025 perspective by Rietkerk and colleagues discusses both theoretical and statistical ambiguities in early-warning interpretation, including slowing without the tipping behavior of interest and alternative explanations for detected indicators. It motivates comparing plausible mechanisms rather than equating a significant trend with a tipping probability. [Rietkerk et al., 2025](https://doi.org/10.1038/s41558-025-02328-8).

Our exchange-symmetric example isolates one of these questions in a form that can be solved exactly. It does not reproduce that paper's climate experiments, assess any named Earth-system component, or imply that all environmental data are equally uninformative.

A separate problem arises when we select records because something dramatic happened at their end. Boettiger and Hastings show how conditioning on observed transitions can bias assessments of common warning statistics. A retrospective pattern before a selected collapse need not demonstrate prospective forecasting ability. [Boettiger and Hastings, 2012](https://arxiv.org/abs/1210.1204).

The present experiment avoids that selection by retaining every simulated path and by defining no collapse event. Consequently, it does not report false-alarm rates, missed-collapse rates, or warning lead times. Those quantities require an event definition and a prospective evaluation design that this stationary study does not contain.

A future forecasting experiment would need both transition and non-transition cases sampled according to a stated population. Its processing choices would need to use only information available when an alarm is issued. Thresholds would be calibrated separately from evaluation, and performance would be reported at a defined forecast horizon.

That future experiment should also contain alternative drivers, not merely multiple random seeds of the same tipping mechanism. Otherwise it tests robustness to noise within a preferred explanation while leaving the more consequential ambiguity untouched.

## What to ask of the next monitoring campaign

Return to the hypothetical lake. The team should first establish what changed in the measured record and over which physical time scales. A stable sampling schedule, documented sensor changes, and a transparent treatment of seasonality are prerequisites for comparing those records meaningfully.

Next, the team can write down competing explanations before selecting a forecasting method. If slow recovery and persistent forcing are both plausible, a useful study asks what each would predict for an additional environmental measurement or an independently characterized perturbation.

The practical target is a contrast: an observation expected to behave differently under the alternatives. More precise measurements of an identical prediction can be valuable for monitoring, but they are an inefficient way to choose between those alternatives.

This distinction changes how uncertainty is communicated. An honest report can say that variability and persistence increased, quantify the uncertainty in those estimates, and explain why intrinsic recovery has not yet been separated from environmental forcing. It can then identify the extra measurement most likely to resolve the question.

Scientific uncertainty does not determine a management decision by itself. A decision can depend on the consequences of delayed action, the costs of monitoring, and measures that are beneficial under multiple plausible explanations. Those are additional inputs, not numbers hidden inside an autocorrelation coefficient.

The model also suggests a constructive use for AI: help integrate measurements of the driver and response, design informative observations, or estimate complex likelihoods under clearly stated alternatives. The value comes from connecting computation to information that distinguishes mechanisms.

## Conclusion

An observed system can remember because its own recovery is slow, because its environment is persistent, or because both mechanisms contribute. In the stationary Gaussian cascade studied here, exchanging the two relaxation rates leaves the entire observed process unchanged.

The simulation makes finite-record uncertainty visible; the mathematics explains why more accurate output statistics cannot assign the hidden labels. A known perturbation or a suitable measurement of the driver changes the information available and can separate the rates.

For environmental modeling, the useful question is therefore not only whether an indicator rises. It is whether the observations distinguish the mechanism that would make that rise scientifically meaningful—and what we should measure next if they do not.

## References

1. Scheffer, M., et al. (2009). [Early-warning signals for critical transitions](https://doi.org/10.1038/nature08227). *Nature*, 461, 53–59.
2. Rietkerk, M., Skiba, V., Weinans, E., Hébert, R., and Laepple, T. (2025). [Ambiguity of early warning signals for climate tipping points](https://doi.org/10.1038/s41558-025-02328-8). *Nature Climate Change*, 15, 479–488.
3. Boettiger, C., and Hastings, A. (2012). [Early warning signals and the prosecutor's fallacy](https://doi.org/10.1098/rspb.2012.2085). *Proceedings of the Royal Society B*, 279, 4734–4739. [Author manuscript](https://arxiv.org/abs/1210.1204).
