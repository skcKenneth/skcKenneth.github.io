---
title: "CUT-AUDIT-ER: When the Highest Score Is Not the Best Repair"
slug: cut-audit-er
summary: A study of verification-only entity repair separates finding the highest score from choosing a useful repair, and fewer complete evaluations from lower total cost.
year: 2026
date: 2026-09-27
lastUpdated: 2026-09-27
period: 2026
status: Manuscript in preparation
featured: true
draft: false
topics: [Entity resolution, Graph repair, Decision quality, Verification]
methods: [Structural analysis, Constructed controls, Natural-data diagnostics, Certified proxy search]
researchQuestion: When can a search certificate identify the highest computed proxy score without establishing the best repair or a lower overall computational cost?
dataType: Aggregate natural-data evidence and constructed known-law controls; full natural inputs are not all publicly reconstructible
codeAvailable: true
dataAvailable: false
studentSuitable: false
repositoryUrl: https://github.com/skcKenneth/cut-audit-er
projectUrl: https://skckenneth.github.io/cut-audit-er/
heroImage: /images/cut-audit-er/four-node-choice.svg
validation: Finite correctness checks, exact known-law control arithmetic, retained natural-data comparisons, and permitted saved-answer replay.
keyFindings:
  - All 241 retained natural-data Full choices maximize the computed proxy within the pool searched at that state; this does not certify optimal repair quality.
  - In a constructed four-node example, the proxy selects an action with expected benefit 1.05 instead of an available action with expected benefit 1.20.
  - Full and Raw have identical outcomes and paid-query sequences in nine retained natural cohort–budget comparisons; Full has higher recorded aggregate costs.
limitations:
  - Constructed probability laws are not evidence of a perfectly calibrated natural-data matcher.
  - Natural states and budgets are dependent, not independent statistical replications.
  - WDC evidence is aggregate-only; public material cannot reconstruct all historical graphs or independently rerun every audit.
  - Native TransClean and GraphCR comparisons remain incomplete; no general superiority or successful new external validation is claimed.
---

## Which connection is worth checking?

Imagine a catalogue in which several records have been grouped as the same book. One mistaken connection can join different books into a single cluster. Checking whether two records really belong together costs time or money, so checking everything is not an option. Which connection should be verified next?

CUT-AUDIT-ER studies this question under a restricted repair rule: query a pair, then delete an existing edge only when the answer confirms that its endpoints represent different entities. Records remain in the graph; the procedure does not freely add links or rebuild clusters. Removing an edge matters through the connectivity it changes, not just the two endpoints it touches. This makes the value of a query a structural question.

## Three questions that should not become one

The research separates candidate search, the quality of the score used to rank candidates, and the repair obtained after verification. A search certificate can establish that no candidate in the searched pool has a higher computed proxy score. It cannot, by itself, establish that this score represents expected repair benefit correctly.

The cover illustrates a constructed four-node path with a specified probability law. The proxy chooses an outer edge whose expected benefit is **1.05**, while the central edge offers **1.20**. These are expected reductions in erroneous connected record pairs per paid query, not observations from a real catalogue. The example is small enough to check exactly: searching more accurately cannot fix a ranking that already favours the wrong objective.

Other controls distinguish this expected decision gap from hindsight. Seeing a better action after the answers are known does not automatically prove that a choice was unreasonable with the information available beforehand.

## What the retained evidence shows

All **241** retained natural-data choices made by the Full variant are certified computed-proxy maximizers within their respective searched pools. Verification answers are simulated from reference labels; this is not a human-user study, and a paid query denotes a charged budget unit. Across those states, the pools contain **73,292** candidates, whereas **256** complete proxy evaluations were recorded. This is a comparison of evaluation counts, not a claim of an equivalent speedup: generating candidates, checking legality and computing bounds still require work.

In **nine** retained natural cohort–budget comparisons, Full and the simpler Raw variant have identical outcomes and paid-query sequences. Full nevertheless has higher recorded aggregate selector and worker-wall times. The useful result is therefore a distinction between a valid search certificate and demonstrated practical benefit, not a general claim that the more elaborate procedure repairs data better or runs faster. These states and budgets are dependent observations, not independent experimental replications.

## Explore the study and its limits

The [bilingual research website](https://skckenneth.github.io/cut-audit-er/) explains the six figure families; its language button switches between English and Traditional Chinese. The [public repository](https://github.com/skcKenneth/cut-audit-er) provides research code, finite checks, retained evidence and permitted saved-answer replay. WDC material is aggregate-only, so these resources cannot reconstruct every natural-data graph or rerun every historical audit. Native TransClean and GraphCR comparisons remain incomplete, and new external validation has not been established.

The manuscript is **in preparation**, with **ACIIDS 2027 as the intended submission venue**. This is not a submission or acceptance announcement. A longer bilingual explanation is planned after formal submission; the current public entry introduces the research without distributing the manuscript.
