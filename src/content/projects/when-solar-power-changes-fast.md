---
title: When Solar Power Changes Fast
slug: when-solar-power-changes-fast
summary: An accepted ADMA 2026 short paper on conditional solar prediction-interval reliability. Five-station comparisons distinguish consistent calibration improvement from the absolute reliability that difficult events still lack.
year: 2026
date: 2026-09-09
lastUpdated: 2026-09-09
status: Accepted
featured: false
draft: false
topics: [Solar forecasting, Uncertainty quantification, Student research]
methods: [Conformalized quantile regression, Descriptor score calibration, Chronological evaluation, Station-level paired comparisons]
researchQuestion: Do calibration improvements persist across solar stations during ramps and sensor-feature removal, and are the resulting intervals sufficiently reliable under a prespecified conditional check?
dataType: Public Chinese State Grid solar observations from 2019–2020 at 15-minute resolution; five confirmation stations, four folds and two horizons
codeAvailable: true
dataAvailable: true
studentSuitable: true
repositoryUrl: https://github.com/skcKenneth/solar-ramp-reliability/tree/19f6075edf642160be27e06692f4b78201d9ff57
projectUrl: https://skckenneth.github.io/writing/when-solar-power-changes-fast/
teachingUrl: https://skckenneth.github.io/teaching/student-research-studio/
heroImage: /images/adma-solar-intervals/04-paired-stations.svg
period: 2026
validation: Saved results from the paper-cited public version were reaggregated for the bilingual article and figures without retraining or modifying the submitted paper. Stations, not timestamps or folds, are the replication units.
keyFindings:
  - Descriptor CQR improves all five stations, reducing mean worst-group undercoverage by 0.110 and 0.080 at 15 and 60 minutes.
  - Worst-group coverage remains 0.470 and 0.537 against a nominal 0.90 target; no deployable candidate meets the all-station absolute reliability criterion.
  - Wider Descriptor intervals improve aggregate proper score, but selected non-ramp comparisons retain adverse efficiency results.
limitations:
  - Five external stations from one dataset do not establish geographic, climatic or operational generalization; folds reuse history.
  - Sensor-feature ablations are not complete field outages. Natural-missingness evaluation excludes missing current power and has eligible groups only at CSGS5.
  - The future-label reference is non-deployable and descriptive, not a causal decomposition or performance bound.
  - Accepted as a Short Paper on 2026-09-03 and camera-ready submitted on 2026-09-09; a completed presentation, proceedings entry, indexing and paper DOI are not claimed.
---

## A useful improvement that is not yet enough

Solar prediction intervals should be checked when power changes rapidly and forecast inputs are degraded, not only after averaging together ordinary and difficult conditions. This study holds a forecasting base fixed and compares condition-based, risk-stratified, descriptor-conditioned and rolling calibration across five confirmation stations.

The central result is a distinction: Descriptor CQR improves every station's worst-group endpoint, but none of the deployable candidates meets the absolute reliability requirement. That requirement allows a 0.10 shortfall from nominal 0.90 coverage—an 80% floor. It is a deliberately permissive research check, not an industry standard or a statement of operational sufficiency.

Read [When Solar Power Changes Fast: Why Better Intervals Are Still Not Reliable Enough](/writing/when-solar-power-changes-fast/) for the model, eight research figures, station-level results, width–score trade-offs and the limits of naturally missing data. The [public research version](https://github.com/skcKenneth/solar-ramp-reliability/tree/19f6075edf642160be27e06692f4b78201d9ff57) provides the scientific materials cited by the paper.

## Methods and evidence

The five retained stations are CSGS2, CSGS5, CSGS6, CSGS7 and CSGS8. Four chronological folds and two horizons give 40 evaluation combinations, not 40 independent replications. Descriptor calibration uses a LightGBM score-quantile model followed by chronological residual calibration; it is not a nearest-neighbour method. Risk-Mondrian meets comparative criteria only at 15 minutes, Descriptor at both horizons, and Rolling at neither.

At 15 and 60 minutes, Descriptor's mean worst-group shortfall improvements are 0.110 and 0.080. Remaining worst shortfalls are 0.430 and 0.363. No-refit event-threshold sensitivity and a future-label diagnostic help define further questions, while the natural-missingness analysis is restricted to sufficiently supported CSGS5 subsets with observed current power and future targets.

## Authors and acceptance

Formal paper title: *When Solar Power Changes Fast: A Multi-Site Audit of Prediction-Interval Reliability under Ramp Events and Sensor Degradation*.

Authors, in formal order: **Hong U Lo, Zibo Gao, Peng Chi Lam, and Sok Kin Cheng**. Affiliation: St. Joseph Diocesan College (The Fifth School), Macao SAR, China. Sok Kin Cheng is corresponding author and research mentor. See the [student research record](/teaching/student-research-studio/).

The ADMA 2026 Research Track accepted the work as a **Short Paper on 3 September 2026**. The **camera-ready was submitted on 9 September 2026**. The [conference is scheduled for 13–15 November 2026 in Hong Kong](https://adma2026.github.io/). This is an acceptance record, not a claim of completed presentation or formal publication. Proceedings and indexing status will require their own actual records.
