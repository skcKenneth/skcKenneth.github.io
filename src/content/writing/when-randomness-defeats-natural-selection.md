---
title: "When Randomness Defeats Natural Selection"
slug: when-randomness-defeats-natural-selection
summary: A Wright–Fisher experiment shows why a beneficial allele is usually lost when it begins as one copy, how migration can oppose local adaptation, and why a brief bottleneck leaves a lasting genetic deficit.
date: 2026-07-20
lastUpdated: 2026-07-30
featured: true
topics: [population genetics, Wright–Fisher model, genetic drift, selection, migration, bottlenecks]
heroImage: /science/genetic-drift-selection-migration/fixation-landscape.svg
type: Research Notes
archived: false
readingMinutes: 20
scienceProject: genetic-drift-selection-migration
redirectFrom: []
---

Natural selection is directional, but evolution in a finite population is not deterministic.

A new allele can increase expected reproductive success and still disappear in its first few generations. A locally favourable allele can be held at low frequency by migration. A population can recover numerically after a bottleneck while remaining genetically depleted. These outcomes are not exceptions added to an otherwise deterministic theory. They follow from sampling.

This study uses a diploid Wright–Fisher model to connect four ideas—drift, selection, migration, and bottlenecks—inside one reproducible synthetic experiment. The purpose is not to infer the history of a real population. It is to show which qualitative claims survive explicit simulation and which require empirical data.

## The model starts with copies, not percentages

Consider a diploid population of size \(N\). If allele \(A\) has frequency \(p_t\), there are \(2N p_t\) copies before reproduction. With genic selection coefficient \(s\), the expected frequency after selection is

$$
p_t^\star=\frac{p_t(1+s)}{1+s p_t}.
$$

The next generation is sampled rather than assigned:

$$
X_{t+1}\sim\operatorname{Binomial}(2N,p_t^\star),
\qquad
p_{t+1}=\frac{X_{t+1}}{2N}.
$$

The binomial step is the source of drift. Its conditional variance,

$$
\operatorname{Var}(p_{t+1}\mid p_t)
=\frac{p_t^\star(1-p_t^\star)}{2N},
$$

shrinks as \(N\) grows, but it never vanishes in a finite population. The states \(p=0\) and \(p=1\) are absorbing when mutation and migration are absent. A trajectory eventually loses or fixes the allele.

That formulation also clarifies why “a beneficial mutation has selection coefficient \(0.05\)” is incomplete. Starting frequency matters. In this experiment every fixation run begins from one copy,

$$
p_0=\frac{1}{2N}.
$$

Larger populations reduce drift per generation, but they also make a single copy a smaller initial fraction of the population.

## Selection changes odds, not destiny

The fixation grid used five population sizes and six selection coefficients, with 2,500 independent replicates for every parameter pair. Under neutrality, the fixation probability of one copy should equal \(1/(2N)\). The simulation recovered that benchmark closely: \(0.0248\) for \(N=20\), \(0.0056\) for \(N=100\), and \(0.0008\) for \(N=500\), compared with theoretical values \(0.025\), \(0.005\), and \(0.001\).

<figure class="article-figure">
  <img src="/science/genetic-drift-selection-migration/fixation-landscape.svg" alt="Heat map of simulated fixation probability across five population sizes and six selection coefficients." width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 1.</strong> Fixation probabilities from 2,500 replicates per parameter pair. A selection coefficient of \(s=0.05\) raises fixation to roughly 0.09–0.10 across the tested population sizes, yet about nine out of ten new copies are still lost. Values are synthetic model outputs.</figcaption>
</figure>

At \(s=0.05\), fixation increased to \(0.0952\), \(0.1016\), \(0.0868\), \(0.0924\), and \(0.0992\) as \(N\) ranged from 20 to 500. The approximate constancy is consistent with the strong-selection, rare-copy regime: selection offsets the declining initial frequency, but it does not make fixation likely.

The practical lesson is sharper than “small populations have more drift.” A beneficial allele introduced once has a high probability of early loss even when its expected trajectory points upward. Reporting only the deterministic recurrence hides the event that dominates most realizations.

## Migration can oppose local adaptation

The model extends to two demes by applying migration before selection and sampling. If \(m\) is the symmetric migration fraction,

$$
\widetilde p_1=(1-m)p_1+mp_2,\qquad
\widetilde p_2=(1-m)p_2+mp_1.
$$

Selection then acts with opposite signs in the two habitats. The experiment therefore asks whether a locally favoured allele can remain differentiated when migrants continually import the alternative.

This is not a contest between a universally “good” allele and random noise. Fitness is environment-specific. Weak migration can replenish variation and reduce local loss; stronger migration can homogenize the demes and erode the response to divergent selection. The relevant dimensionless comparison is not \(m\) or \(s\) alone, but their scale relative to drift and to one another.

The synthetic results support a trade-off, not a universal migration threshold. An empirical application would require defensible effective population sizes, direction-specific migration, dominance, linked loci, and an observation model for sampled genotypes.

## A bottleneck is remembered after abundance recovers

Expected heterozygosity,

$$
H_t=2p_t(1-p_t),
$$

measures within-locus diversity. Under neutral Wright–Fisher drift,

$$
\mathbb E[H_t]
=H_0\left(1-\frac{1}{2N}\right)^t.
$$

The simulation checked this decay law using 8,000 independent loci per population size. It then imposed a ten-generation bottleneck from \(N=500\) to \(N_b\), after which census size returned immediately to 500.

<figure class="article-figure">
  <img src="/science/genetic-drift-selection-migration/bottleneck.svg" alt="Line chart showing mean heterozygosity through time for no bottleneck and temporary bottlenecks to population sizes 50, 25, and 10." width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 2.</strong> Mean heterozygosity across 10,000 synthetic loci. The shaded interval marks the ten-generation bottleneck. Returning population size to 500 does not restore variants already lost.</figcaption>
</figure>

At generation 180, mean heterozygosity was approximately \(0.417\) without a bottleneck and \(0.252\) after a bottleneck to \(N_b=10\). Intermediate bottlenecks ended at \(0.345\) for \(N_b=25\) and \(0.381\) for \(N_b=50\).

This is a useful separation of state variables. Census size can rebound in one generation because the model instructs it to do so. Allele-frequency diversity cannot rebound without mutation, migration, or stored variation. Demographic recovery and genetic recovery are different claims.

## One simulation, four different clocks

Fixation, local adaptation, migration balance, and diversity loss are often discussed together, but they run on different clocks.

The **copy-number clock** is one generation long: parents produce a finite sample of \(2N\) copies. The **fixation clock** can run for many generations until an allele reaches 0 or 1. The **migration-selection clock** concerns a balance that may persist without either boundary being reached. The **diversity clock** averages over many loci and responds strongly to short periods of small effective population size.

Confusing these clocks leads to statements such as “selection is strong, so fixation will be rapid” or “the census recovered, so genetic diversity recovered.” Neither follows. Selection can increase eventual fixation probability while most new copies are still lost immediately. Census size can rebound in one generation while lost alleles require mutation or immigration to return.

For a neutral diploid Wright–Fisher population, a new single copy starts at

$$
p_0=\frac{1}{2N},
$$

and its probability of eventual fixation is also \(p_0\). The verified simulations give \(0.0248\) at \(N=20\), \(0.0056\) at \(N=100\), and \(0.0008\) at \(N=500\), compared with theoretical values \(0.0250\), \(0.0050\), and \(0.0010\). With 2,500 replicates per cell, differences of a few events are expected; agreement should be assessed with binomial uncertainty, not decimal matching.

## A theoretical curve is a diagnostic

For a new allele with additive selective advantage \(s\), a common diffusion approximation is

$$
u(p_0)
\approx
\frac{1-\exp(-4Ns p_0)}
{1-\exp(-4Ns)}.
$$

With \(p_0=1/(2N)\), increasing \(s\) raises fixation probability, but the initial copy remains exposed to sampling while rare. At \(s=0.05\), the verified grid gives fixation around \(0.09\)–\(0.10\): a substantial increase over neutrality, yet still a loss probability near 90%.

<figure class="article-figure">
  <img src="/science/genetic-drift-selection-migration/kimura-validation.svg" alt="Wright-Fisher fixation simulations compared with the Kimura diffusion approximation across selection coefficients and population sizes." width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 3.</strong> Agreement with the Kimura approximation checks the implementation and parameterisation. It does not eliminate Monte Carlo uncertainty or make the approximation exact at every finite population size.</figcaption>
</figure>

The comparison catches mistakes that a plausible trajectory may not: treating \(N\) rather than \(2N\) as the copy count, applying selection in the wrong order, failing to absorb at 0 and 1, or assigning fitness to the wrong genotype. Theory becomes an executable expectation.

It also marks the model boundary. Dominance, frequency dependence, linked backgrounds, changing population size, and interference among selected loci can alter fixation. Passing a single-locus check is necessary, not sufficient, for a genomic claim.

## Migration can maintain what selection removes

Consider two demes. After local selection transforms \(p_i\) into \(p_i^\ast\), symmetric migration at rate \(m\) gives

$$
\widetilde p_1=(1-m)p_1^\ast+mp_2^\ast,
\qquad
\widetilde p_2=(1-m)p_2^\ast+mp_1^\ast.
$$

Sampling then adds drift. If the allele is favoured in one deme and disfavoured in the other, migration moves copies against both local gradients. When \(m\) is small relative to the selective contrast, differentiation can persist. As \(m\) increases, gene flow homogenises the demes and can prevent the locally favoured allele from approaching fixation.

<figure class="article-figure">
  <img src="/science/genetic-drift-selection-migration/migration-selection.svg" alt="Synthetic allele-frequency outcomes showing migration opposing local selection in a two-population Wright-Fisher experiment." width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 4.</strong> Migration is neither inherently beneficial nor harmful. It can rescue rare variation, swamp local adaptation, or maintain a polymorphism, depending on rate, direction, and fitness contrast.</figcaption>
</figure>

The relevant comparison depends on the quantity of interest: mean frequency, between-deme differentiation, local load, probability of loss, or time to equilibrium. One time series cannot support a universal claim that migration is “stronger” than selection.

## Why bottlenecks leave a mathematical scar

Under neutral random mating, expected heterozygosity approximately follows

$$
\mathbb E[H_{t+1}]
=
\left(1-\frac{1}{2N_t}\right)\mathbb E[H_t].
$$

Across a changing demographic history,

$$
\mathbb E[H_T]
\approx
H_0\prod_{t=0}^{T-1}
\left(1-\frac{1}{2N_t}\right).
$$

The product explains why ten generations at \(N=10\) matter disproportionately. The retention factor is about \(0.95\) per generation, so the cumulative factor is \(0.95^{10}\approx0.60\). Returning to \(N=500\) changes subsequent loss to about \(0.999\) per generation, but it does not multiply diversity back upward.

In the supplied 10,000-locus experiment, the severe bottleneck ends around \(H\approx0.252\), compared with about \(0.417\) in the no-bottleneck control at the same final time. These are averages over independent synthetic loci, not estimates for a real species.

## Designing a simulation that answers the question

The project uses different replication units for different tasks:

- 2,500 trajectories per fixation-grid cell for rare absorbing events;
- 8,000 independent loci for the neutral heterozygosity check;
- 1,800 replicates for each migration combination;
- 10,000 loci for the bottleneck comparison;
- 5,000 trajectories per population size for the distribution animation.

More trajectories reduce Monte Carlo error, but they do not correct a wrong biological model. A defensible analysis separates process uncertainty from Mendelian sampling, Monte Carlo uncertainty from finitely many runs, and model uncertainty about demography, selection, dominance, migration, and linkage. Only the second necessarily disappears by pressing “run” more times.

## Research extensions with inferential value

A next version could add dominance, recessive beneficial alleles, asymmetric migration, time-varying population size, linked loci with recombination, and background selection. Approximate Bayesian computation or a likelihood-based state-space model could then ask whether distinct demographic histories produce distinguishable summaries.

For empirical use, begin with sampling design and data provenance, specify which effective population size the model represents, account for genotype uncertainty, and validate the observation model. Fixation experiments are most informative when they expose the conditions under which intuition fails—not when one stylised trajectory is treated as a forecast.

## What the computation validates

The supplied run completed a five-by-six fixation grid, neutral diversity checks, migration experiments, and bottleneck experiments. It used 2,500 fixation replicates per cell, 8,000 loci for the neutral validation, 1,800 replicates per migration setting, and 10,000 loci per bottleneck scenario. Six unit tests and the output-manifest checks passed.

Those checks support the implementation of the stated model. They do not validate the model for a particular species. The experiment omits mutation, dominance, overlapping generations, linkage, changing population size outside the bottleneck, and uncertainty in \(N_e\). It also treats loci as independent.

The next research step is therefore not simply a larger simulation. A stronger study would add an observation layer and ask which combinations of \(N_e\), \(s\), and \(m\) are identifiable from finite time-series or genomic samples. It could then compare conservation policies under posterior uncertainty rather than under known parameters.

## Conclusion

Selection supplies a direction; drift supplies a distribution of possible histories. Migration couples those histories across space, and bottlenecks remove options that later demographic growth cannot automatically recreate.

The model’s most important result is not a single fixation probability. It is a discipline for interpretation: distinguish expected change from realized trajectories, abundance from diversity, and model validation from empirical validation.

## References

1. Wright, S. (1931). Evolution in Mendelian populations. *Genetics, 16*(2), 97–159. [https://doi.org/10.1093/genetics/16.2.97](https://doi.org/10.1093/genetics/16.2.97)
2. Kimura, M. (1962). On the probability of fixation of mutant genes in a population. *Genetics, 47*(6), 713–719. [https://doi.org/10.1093/genetics/47.6.713](https://doi.org/10.1093/genetics/47.6.713)
3. Shafiey, H., & Waxman, D. (2017). Exact results for the probability and stochastic dynamics of fixation in the Wright–Fisher model. *Journal of Theoretical Biology, 430*, 64–77. [https://doi.org/10.1016/j.jtbi.2017.06.026](https://doi.org/10.1016/j.jtbi.2017.06.026)
4. Whitlock, M. C. (2003). Fixation probability and time in subdivided populations. *Genetics, 164*(2), 767–779. [https://doi.org/10.1093/genetics/164.2.767](https://doi.org/10.1093/genetics/164.2.767)
5. Nei, M., Maruyama, T., & Chakraborty, R. (1975). The bottleneck effect and genetic variability in populations. *Evolution, 29*(1), 1–10. [https://doi.org/10.1111/j.1558-5646.1975.tb00807.x](https://doi.org/10.1111/j.1558-5646.1975.tb00807.x)
