---
title: Phylogenetic Model Misspecification
slug: phylogenetic-model-misspecification
summary: A verified quartet experiment demonstrates how more sequence data can stabilise a wrong tree when the distance model cannot represent compositional heterogeneity.
year: 2026
lastUpdated: 2026-07-30
status: Reproducible study
featured: true
topics: [Mathematical Biology, Reliability and Uncertainty]
methods: [Nonstationary sequence simulation, Neighbor Joining, Bootstrap diagnostics]
researchQuestion: Can more DNA increase confidence in the wrong topology when the inference model is structurally misspecified?
dataType: Controlled synthetic nucleotide alignments
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/phylogenetic-model-misspecification/heterogeneous-recovery.svg
period: 2026
validation: Six tests, 19 required-output checks, 44 manifest checks, homogeneous controls, and 250 bootstrap replicates.
keyFindings:
  - At 5000 sites under the heterogeneous generator, p-distance, JC69, and K80 recovered the true split in 0 of 120 alignments; regularized log-det recovered it in 120.
  - The selected alignment gave complete bootstrap support to incompatible splits under different distance models.
limitations:
  - The quartet and heterogeneous process are designed demonstrations.
  - The study does not establish that regularized log-det is universally superior.
redirectFrom: []
---

## Editorial overview

Read [When More DNA Makes the Wrong Tree More Certain](/writing/when-more-dna-makes-the-wrong-tree-more-certain/) for a full separation of sampling and model error, a composition-severity map, bootstrap interpretation, four approved figures, and a practical model-adequacy workflow.
