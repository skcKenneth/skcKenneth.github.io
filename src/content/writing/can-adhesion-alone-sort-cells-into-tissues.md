---
title: "Can Adhesion Alone Sort Cells into Tissues?"
slug: can-adhesion-alone-sort-cells-into-tissues
summary: A cellular Potts study tests when differential adhesion produces sorting, engulfment, arrested mixtures, or misleadingly similar end states.
date: 2026-08-02
lastUpdated: 2026-08-02
featured: true
topics: [Cell sorting, differential adhesion, cellular Potts model, morphogenesis, computational biology]
heroImage: /science/differential-adhesion-cell-sorting/sorting-sequence.svg
type: Research Notes
archived: false
readingMinutes: 16
scienceProject: differential-adhesion-cell-sorting
redirectFrom: []
---

Cells can separate into domains even when no cell is given a map. One possible explanation is differential adhesion: rearrangements that reduce interfacial energy gradually replace unfavourable contacts with favourable ones. But a rounded cluster is not, by itself, proof of this mechanism. Motility, boundary affinity, kinetic trapping, and the initial arrangement can all change what we see.

This study treats cell sorting as a model-discrimination problem. A two-dimensional cellular Potts model generates controlled experiments; nine approved figures expose the trajectory, energy budget, parameter regimes, robustness, and competing interpretations. The system is synthetic and represents no named tissue.

## A mechanical hypothesis in lattice form

Each cell occupies a connected set of lattice sites with identity $\sigma_i$ and type $\tau(\sigma_i)$. The configured Hamiltonian is

$$
H =
\sum_{\langle i,j\rangle}
J_{\tau(\sigma_i),\tau(\sigma_j)}
\lambda_A\sum_c(A_c-A_0)^2
\lambda_P\sum_c(P_c-P_0)^2
+H_{\mathrm{motility}}.
$$

The contact energies $J$ penalise unlike or unfavourable neighbours; the area and perimeter terms stop cells from disappearing or becoming arbitrarily distorted. A proposed copy is accepted with probability

$$
P(\mathrm{accept})=\min\{1,\exp(-\Delta H/T)\},
$$

so the effective temperature $T$ controls stochastic rearrangement rather than physical temperature.

For the baseline contact matrix, the effective A–B interfacial tension is

$$
\gamma_{AB}
=J_{AB}-\frac{J_{AA}+J_{BB}}{2}=18.
$$

Positive $\gamma_{AB}$ makes heterotypic contacts expensive. The hypothesis is therefore precise: if the dynamics can explore the state space, the system should reduce A–B contact and coarsen into domains.

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/sorting-sequence.svg" alt="Time sequence of two cell populations reorganising from a mixed state into separated domains." width="960" height="430" loading="eager" decoding="async" />
  <figcaption><strong>Figure 1.</strong> The baseline trajectory turns a random mixture into organised domains. The sequence matters: a final snapshot alone cannot distinguish sorting from a favourable initial condition.</figcaption>
</figure>

## Measure sorting, do not merely recognise it

The analysis follows heterotypic boundary length, a neighbour-based sorting index, energy, and the fraction of type A cells at the exterior. In the declared run the final sorting index is $0.5022$. This is substantial reorganisation, not perfect segregation.

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/sorting-diagnostics.svg" alt="Sorting index, heterotypic boundary, energy, and exterior composition through Monte Carlo sweeps." width="960" height="420" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 2.</strong> Structural and energetic diagnostics evolve together, but not identically. Plateaus can reveal kinetic arrest even when the image still looks dynamic.</figcaption>
</figure>

The distinction is important. An image-based conclusion can be dominated by colour choice or cluster size; a scalar index can also hide topology. Keeping several diagnostics prevents either representation from becoming the entire argument.

## Adhesion competes with activity

Differential adhesion predicts regimes rather than a universal outcome. The phase scan varies $\gamma_{AB}$ and active motility. Stronger interfacial tension encourages separation; activity can accelerate exploration at moderate levels but can also continually disrupt interfaces.

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/adhesion-motility-phase-diagram.svg" alt="Phase diagram of sorting outcomes across effective interfacial tension and cell motility." width="960" height="430" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 3.</strong> Sorting is conditional on both the energetic drive and the ability of cells to rearrange. The same adhesion contrast need not give the same morphology under different activity.</figcaption>
</figure>

Two extensions make that competition explicit: persistent motility and altered affinity for the surrounding medium.

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/model-extensions.svg" alt="Comparisons of baseline differential adhesion with active motility and altered medium affinity." width="960" height="420" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 4.</strong> Similar cell–cell parameters can lead to different outer layers once cell–medium affinity or persistent forcing changes.</figcaption>
</figure>

This is where “sorting” and “engulfment” diverge. Sorting measures whether like cells become neighbours. Engulfment asks which population occupies the exterior. A system can score well on one and poorly on the other.

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/sorting-versus-engulfment.svg" alt="Comparison of neighbour sorting and spatial engulfment across model variants." width="960" height="390" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 5.</strong> Neighbour segregation and radial ordering are separate observables. Treating them as synonyms would erase a biologically meaningful distinction.</figcaption>
</figure>

## Coarsening carries dynamical information

If a characteristic domain size obeys

$$
L(t)\propto t^\alpha,
$$

then $\alpha$ summarises how quickly small domains disappear and larger ones grow. Across five configured replicates, the fitted exponent is $\alpha\approx0.3001$ over the declared fitting window.

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/coarsening-law.svg" alt="Domain size over time for replicate simulations and a fitted power-law coarsening exponent." width="960" height="390" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 6.</strong> The exponent is an effective finite-time descriptor, not a universal constant. Replicate spread and the fit window are part of the result.</figcaption>
</figure>

## Initial conditions test whether the endpoint is inevitable

Four starts—random, A-core, B-core, and striped—probe path dependence. If all routes converge, the energy landscape is strongly organising on the simulated timescale. If they do not, metastability is scientifically informative rather than an inconvenience.

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/initial-condition-robustness.svg" alt="Sorting metrics and final patterns from random, core-shell, and striped initial conditions." width="960" height="430" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 7.</strong> Different starts expose kinetic barriers that a single random initialisation would miss.</figcaption>
</figure>

The Hamiltonian can also be decomposed. A fall in contact energy may be offset by area or perimeter penalties, and a visually smooth boundary may be purchased through unrealistic cell distortion.

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/energy-decomposition.svg" alt="Contact, area, perimeter, and motility contributions to the cellular Potts energy." width="960" height="390" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 8.</strong> Decomposing energy makes it possible to see which mechanism is actually driving the apparent organisation.</figcaption>
</figure>

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/cell-shape-distributions.svg" alt="Cell area, perimeter, and shape distributions across model variants." width="960" height="390" loading="lazy" decoding="async" />
  <figcaption><strong>Figure 9.</strong> Shape distributions provide a plausibility check: a successful sorting score should not rely on pathological geometries.</figcaption>
</figure>

## What the computation supports

The pinned environment passes three automated tests. The complete reproduction regenerates and checksum-validates 35 declared outputs, including all nine figure groups. A second quick run was rebuilt from an empty output directory. Panel labels, legends, long titles, and axis annotations were visually audited; text is black and the palette remains distinguishable without relying on red–green contrast.

The evidence supports a bounded conclusion: differential adhesion can produce sorting in this controlled two-dimensional model, while motility, medium affinity, initial state, and finite simulation time materially affect the observed morphology.

It does **not** show that adhesion is sufficient in every tissue. Real morphogenesis may involve chemotaxis, polarity, proliferation, extracellular matrix, active stresses, three-dimensional geometry, and time-varying adhesion.

## A useful next experiment

The next research step is not simply a larger grid. It is an identifiability test: generate several mechanisms that match the same endpoint, then ask which time-resolved measurements distinguish them. Interface fluctuations, neighbour-exchange rates, radial composition, and shape statistics are promising candidates.

The broader lesson is that a pattern becomes evidence only after we ask what other mechanisms could have drawn it.

## References

1. Steinberg, M. S. (1963). Reconstruction of tissues by dissociated cells. *Journal of Experimental Zoology, 173*(4), 395–434. [https://doi.org/10.1002/jez.1401730406](https://doi.org/10.1002/jez.1401730406)
2. Graner, F., & Glazier, J. A. (1992). Simulation of biological cell sorting using a two-dimensional extended Potts model. *Physical Review Letters, 69*, 2013–2016. [https://doi.org/10.1103/PhysRevLett.69.2013](https://doi.org/10.1103/PhysRevLett.69.2013)
3. Glazier, J. A., & Graner, F. (1993). Simulation of the differential adhesion driven rearrangement of biological cells. *Physical Review E, 47*, 2128–2154. [https://doi.org/10.1103/PhysRevE.47.2128](https://doi.org/10.1103/PhysRevE.47.2128)
4. Niculescu, I., Textor, J., & de Boer, R. J. (2015). Crawling and gliding: A computational model for shape-driven cell migration. *PLoS Computational Biology, 11*(10), e1004280. [https://doi.org/10.1371/journal.pcbi.1004280](https://doi.org/10.1371/journal.pcbi.1004280)
5. Durand, M., & Guesnet, E. (2021). An efficient Cellular Potts Model algorithm that forbids cell fragmentation. *PLoS Computational Biology, 17*(2), e1008576. [https://doi.org/10.1371/journal.pcbi.1008576](https://doi.org/10.1371/journal.pcbi.1008576)
