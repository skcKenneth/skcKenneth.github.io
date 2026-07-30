---
title: "When More DNA Makes the Wrong Tree More Certain"
slug: when-more-dna-makes-the-wrong-tree-more-certain
summary: A synthetic quartet experiment separates sampling error from model error and shows how a long alignment can give complete bootstrap support to the wrong phylogenetic tree.
date: 2026-07-22
lastUpdated: 2026-07-30
featured: true
topics: [phylogenetics, model misspecification, Neighbor Joining, bootstrap support, compositional convergence]
heroImage: /science/phylogenetic-model-misspecification/heterogeneous-recovery.svg
type: Research Notes
archived: false
readingMinutes: 20
scienceProject: phylogenetic-model-misspecification
redirectFrom: []
---

More data usually reduce uncertainty. They do not automatically reduce model error.

That distinction matters in phylogenetics because sequence analysis never converts nucleotides into a tree without assumptions. A distance formula decides how observed differences represent evolutionary change. A reconstruction algorithm then decides which topology best matches those distances. If the distance model cannot represent the process that generated the sequences, longer alignments may estimate the wrong population-level distances with increasing precision.

This project constructs a four-taxon experiment where that failure is visible. The true unrooted split is

$$
AB\mid CD.
$$

Taxa \(A\) and \(C\) are not sisters, but the heterogeneous scenario drives their nucleotide compositions toward similar targets on long branches. The study asks whether p-distance, JC69, K80, and a regularized log-det distance recover the true split as sequence length increases.

## The data-generating process

Sequence evolution is simulated as a continuous-time Markov chain. For a branch of length \(t\) with rate matrix \(Q\), the transition matrix is

$$
P(t)=e^{Qt}.
$$

The homogeneous scenario uses a shared substitution process across all branches. The heterogeneous scenario changes branch-specific equilibrium compositions so that non-sister taxa \(A\) and \(C\) become compositionally convergent.

This design separates two error sources:

1. **sampling error**: two finite alignments differ even under the same model;
2. **model error**: an estimator assumes a substitution process that does not include the generating mechanism.

The same simulated alignment is passed to all four distance estimators. Differences between methods therefore do not come from different random sequences.

## Four ways to turn sites into distances

The uncorrected p-distance is the observed mismatch fraction. JC69 corrects multiple substitutions under equal base frequencies and equal rates:

$$
\widehat d_{\mathrm{JC}}
=-\frac34\log\left(1-\frac43p\right).
$$

K80 separates transitions \(P\) from transversions \(Q\):

$$
\widehat d_{\mathrm{K80}}
=-\frac12\log(1-2P-Q)-\frac14\log(1-2Q).
$$

Both corrections remain compositionally homogeneous. The regularized log-det distance instead uses the determinant of the \(4\times4\) joint-frequency matrix \(F_{xy}\):

$$
\widehat d_{\log\det}
=-\frac14\log
\left[
\frac{\det(F_{xy})}
{\sqrt{\prod_i f_{i\cdot}\prod_j f_{\cdot j}}}
\right].
$$

Log-det was developed for a broader class of nonstationary Markov processes. Regularization is needed when finite samples make the joint table nearly singular. This extra generality does not make it universally optimal: short alignments can give noisy determinants, and other forms of heterogeneity can still cause failure.

The project implements Neighbor Joining directly. For \(n\) active taxa or clusters,

$$
Q_{ij}=(n-2)d_{ij}-\sum_k d_{ik}-\sum_k d_{jk},
$$

and the pair minimizing \(Q_{ij}\) is joined. For a quartet, recovery reduces to selecting the correct nontrivial split.

## When longer alignments converge to different answers

The main experiment uses 120 independently simulated alignments at each of six sequence lengths, from 100 to 5,000 sites. In the homogeneous scenario, all four methods improve with more data. At 5,000 sites, every method recovered the true split in all 120 replicates.

The heterogeneous scenario reverses the pattern for three methods.

<figure class="article-figure">
  <img src="/science/phylogenetic-model-misspecification/heterogeneous-recovery.svg" alt="Line chart showing topology recovery versus sequence length for p-distance, JC69, K80, and regularized log-det under compositional convergence." width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 1.</strong> Recovery probability under the designed heterogeneous process. At 5,000 sites, log-det recovered the true split in 120/120 replicates, while p-distance, JC69, and K80 recovered it in 0/120. These are synthetic Monte Carlo results, not an empirical benchmark.</figcaption>
</figure>

At 100 sites, the true topology was recovered with probabilities \(0.158\) for p-distance, \(0.292\) for JC69, \(0.267\) for K80, and \(0.600\) for log-det. With increasing length, sampling noise decreased. The three homogeneous distances became more consistent—but around the wrong split \(AC\mid BD\). By 5,000 sites they selected it in every replicate. Log-det moved in the opposite direction and selected the true split in every replicate.

This result is stronger than “a simple method performs badly.” The wrong answer becomes more reproducible because the estimator converges to distances distorted by compositional convergence.

## Complete bootstrap support can still be wrong

Bootstrap analysis resamples alignment columns, rebuilds the tree, and counts how often each split reappears. It measures the stability of the fitted pipeline under site resampling.

The demonstration alignment contains 5,000 sites and uses seed 1729. JC69 and K80 infer \(AC\mid BD\); log-det infers the true \(AB\mid CD\). Each method then receives 250 bootstrap replicates.

<figure class="article-figure">
  <img src="/science/phylogenetic-model-misspecification/bootstrap-support.svg" alt="Bootstrap support for true and wrong quartet splits under JC69, K80, and regularized log-det distances." width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 2.</strong> The same 5,000-site alignment produces 100% bootstrap support for different histories. Resampling measures repeatability conditional on the distance model; it is not a direct test of substitution-model adequacy.</figcaption>
</figure>

JC69 and K80 gave support \(1.000\) to the wrong split. Log-det gave support \(1.000\) to the true split. There is no contradiction: all three analyses are internally stable. They disagree about the mapping from patterns to evolutionary distance.

This is why high support cannot substitute for model checking. Model selection asks which candidate fits best among those considered. Model adequacy asks whether even the selected candidate reproduces important features of the observed data.

## Sampling error and model error point in different directions

Let \(D^\star\) denote the expected pairwise distance matrix under the true sequence-generating process, and let \(\widehat D_L\) be the matrix estimated from an alignment of length \(L\). A law-of-large-numbers argument suggests

$$
\widehat D_L \longrightarrow D^\star
\qquad\text{as }L\to\infty.
$$

That convergence is reassuring only if the transformation used to create \(D^\star\) is compatible with the evolutionary process and if the limiting matrix is additive on the true tree. Under misspecification, the estimator may converge perfectly to a matrix whose four-point relation favours the wrong split.

This gives two distinct failure modes:

- **sampling error:** \(\widehat D_L\) fluctuates around an appropriate limit because the alignment is finite;
- **model error:** the limit itself encodes the wrong geometry because the analysis cannot represent the generating process.

More DNA attacks the first problem. It can intensify the second by removing the random variation that occasionally allowed the correct split to win.

The design makes this distinction visible with a control. Under the homogeneous generator, all four distances improve with length and reach 120/120 correct reconstructions at 5,000 sites. Under the heterogeneous generator, p-distance, JC69, and K80 move toward 0/120 correct, while regularized log-det moves toward 120/120. The Neighbor Joining code is unchanged; only the relation between generator and distance changes.

<figure class="article-figure">
  <img src="/science/phylogenetic-model-misspecification/recovery-heatmap.svg" alt="Tree-recovery rates by homogeneous or heterogeneous generating scenario, distance estimator, and sequence length." width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 3.</strong> The homogeneous control separates an implementation failure from deliberate misspecification. A method can be statistically consistent in one model family and positively misleading outside it.</figcaption>
</figure>

## Why compositional convergence distorts distance

The true internal split is \(AB\mid CD\). The heterogeneous process independently shifts non-sisters \(A\) and \(C\) toward a GC-rich terminal composition. Their observed similarity is therefore partly caused by convergent composition rather than recent common ancestry.

JC69 assumes equal equilibrium base frequencies and equal exchange tendencies. K80 distinguishes transitions from transversions but retains a stationary, compositionally symmetric structure. When those assumptions are violated, their corrections cannot know whether shared GC content came from common descent or parallel directional change.

Log-det uses the determinant of the empirical joint-frequency matrix \(F_{ij}\), schematically

$$
d_{\mathrm{LD}}(i,j)
=
-\frac{1}{4}\log\det(F_{ij})
+\text{composition correction}.
$$

Its motivation is different: determinant relationships can accommodate lineage-specific composition under a broader class of general Markov processes. The implementation regularises small or unstable determinants, which introduces another modelling choice. It is more robust in the tested region, not assumption-free.

The severity grid confirms that boundary. Across many combinations of terminal composition and branch length, regularized log-det retains the true split after JC69 fails. At an extreme tested setting—GC target \(0.45\) and long-terminal length \(0.6\)—its recovery falls to \(0.35\).

<figure class="article-figure">
  <img src="/science/phylogenetic-model-misspecification/logdet-phase-map.svg" alt="JC69 and regularized log-det recovery across composition contrast and long-terminal branch length." width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 4.</strong> The phase map prevents a universal ranking. It identifies a region where composition-aware distance helps and an extreme region where even the more robust estimator degrades.</figcaption>
</figure>

## What bootstrap support conditions on

A site bootstrap samples alignment columns with replacement, rebuilds a tree for each resample, and reports how often a split reappears. If the original alignment is long, every resample inherits approximately the same composition pattern. A stable misspecified signal can recur almost every time.

For the selected 5,000-site alignment, 250 resamples give:

| Distance | Dominant split | Bootstrap support |
|---|---|---:|
| JC69 | \(AC\mid BD\) | 1.000 |
| K80 | \(AC\mid BD\) | 1.000 |
| Regularized log-det | \(AB\mid CD\) | 1.000 |

The values mean that each pipeline is internally stable under its own transformation of the columns. Bootstrap support is not a posterior probability that a split is true, and it does not compare the adequacy of incompatible substitution models.

## A more useful adequacy workflow

Before interpreting support, an analysis can ask whether the model reproduces features that matter for topology:

1. inspect composition by taxon and partition;
2. simulate under the fitted model and compare composition, site patterns, saturation, and distance residuals;
3. repeat inference across plausible model families;
4. localise influential signal with prefix, site-stripping, taxon-removal, and partition analyses;
5. report incompatible highly supported topologies as a result to explain.

The prefix diagnostic follows this logic. As the synthetic alignment grows, the margin favouring \(AC\mid BD\) under JC69 becomes more stable rather than wandering randomly. That is consistent with convergence to a biased limit.

## Scale and reproducibility

The main study contains two scenarios, six sequence lengths, and 120 alignments per scenario-length cell: 1,440 alignments and 5,760 reconstructions. The severity study adds 1,000 alignments and 2,000 reconstructions over a \(5\times5\) grid. The example contributes 750 bootstrap reconstructions.

Six unit tests check transition matrices, zero distance for identical sequences, exact Neighbor Joining recovery on an additive quartet, split extraction, seed reproducibility, and finite symmetric distance matrices. Nineteen required-output checks and 44 manifest entries also passed. These checks make computation auditable; they do not turn a designed quartet into evidence about a clade.

## From demonstration to empirical study

An empirical extension requires more than replacing the FASTA file. Taxon sampling, alignment uncertainty, recombination, gene-tree discordance, partition choice, and site dependence can all change the question. A careful study would preregister the focal violation, use simulation-based calibration matched to the empirical composition and branch-length regime, and test whether observed method disagreement is reproduced.

The enduring lesson is methodological: uncertainty quantification is conditional on the model that generates the quantity being resampled. When assumptions shape the limiting answer, collecting more observations and resampling them more often can produce precision without accuracy.

## What is verified—and what remains open

The supplied computation generated 1,440 main-experiment alignments and 5,760 tree reconstructions, plus 1,000 severity-grid alignments and 750 bootstrap reconstructions. Output validation, 19 required-artifact checks, 44 manifest checksum checks, and six unit tests passed.

The tests verify stochastic transition matrices, zero distance for identical sequences, exact recovery from an additive quartet, deterministic seeds, and finite symmetric distance matrices. They establish computational reproducibility of this synthetic experiment.

They do not show that log-det is always best, that JC69 or K80 are generally useless, or that a quartet captures empirical phylogenomics. The model omits indels, alignment uncertainty, recombination, incomplete lineage sorting, gene-tree discordance, and among-site rate variation.

A stronger next study would fit candidate models and perform parametric adequacy checks on base-composition dispersion and site-pattern counts. It would also compare distance methods with likelihood and Bayesian approaches under larger trees. The most useful extension is analytic: derive the infinite-sequence joint-frequency matrices and show exactly where the four-point inequality changes sign.

## Conclusion

Longer sequences answer the question posed by an analysis pipeline more precisely. They do not guarantee that the pipeline poses the right evolutionary question.

The broader modeling lesson extends well beyond phylogenetics: sampling uncertainty can shrink around a biased limit. Confidence should therefore be reported together with the assumptions that define the estimator and evidence that those assumptions can represent the data-generating process.

## References

1. Jukes, T. H., & Cantor, C. R. (1969). Evolution of protein molecules. In *Mammalian Protein Metabolism* (Vol. 3, pp. 21–132). [https://doi.org/10.1016/B978-1-4832-3211-9.50009-7](https://doi.org/10.1016/B978-1-4832-3211-9.50009-7)
2. Kimura, M. (1980). A simple method for estimating evolutionary rates of base substitutions through comparative studies of nucleotide sequences. *Journal of Molecular Evolution, 16*, 111–120. [https://doi.org/10.1007/BF01731581](https://doi.org/10.1007/BF01731581)
3. Saitou, N., & Nei, M. (1987). The Neighbor-Joining method: A new method for reconstructing phylogenetic trees. *Molecular Biology and Evolution, 4*, 406–425. [https://doi.org/10.1093/oxfordjournals.molbev.a040454](https://doi.org/10.1093/oxfordjournals.molbev.a040454)
4. Lake, J. A. (1994). Reconstructing evolutionary trees from DNA and protein sequences: Paralinear distances. *Proceedings of the National Academy of Sciences, 91*, 1455–1459. [https://doi.org/10.1073/pnas.91.4.1455](https://doi.org/10.1073/pnas.91.4.1455)
5. Felsenstein, J. (1978). Cases in which parsimony or compatibility methods will be positively misleading. *Systematic Zoology, 27*, 401–410. [https://doi.org/10.1093/sysbio/27.4.401](https://doi.org/10.1093/sysbio/27.4.401)
6. Doerr, D., Gronau, I., Moran, S., & Yavneh, I. (2012). Stochastic errors versus modeling errors in distance-based phylogenetic reconstructions. *Algorithms for Molecular Biology, 7*, 22. [https://doi.org/10.1186/1748-7188-7-22](https://doi.org/10.1186/1748-7188-7-22)
7. Ripplinger, J., & Sullivan, J. (2010). Assessment of substitution model adequacy using frequentist and Bayesian methods. *Molecular Biology and Evolution, 27*, 2790–2803. [https://doi.org/10.1093/molbev/msq168](https://doi.org/10.1093/molbev/msq168)
