---
title: "Keep the Result That Changes the Question"
slug: keep-the-result-that-changes-the-question
summary: A failed check can narrow a useful question. Two published numerical studies show why the original failure must remain visible.
date: 2026-10-11
lastUpdated: 2026-10-11
draft: false
featured: false
archived: false
type: Teaching Notes
topicIds: [teaching-research-practice, computation-code, risk-decisions]
topics: [Negative results, Numerical verification, Research practice]
relatedSlugs: [how-many-equilibria-did-the-optimizer-miss, when-a-reduced-ventilation-model-leaves-its-training-regime]
---

A failed check can change which question an experiment is able to answer. Keeping it visible helps readers distinguish the original comparison from what was learned afterward.

## Separate recovery from the original score

In [How Many Equilibria Did the Optimizer Miss?](/writing/how-many-equilibria-did-the-optimizer-miss/), a quick event scan missed two folds even though branch tracks had been saved. Supplementary checks of those tracks later verified the turns. That supports the existence of the checked events within the declared finite model and range.

It does not mean the original scan found them. The later verification did not supply new seeds retroactively or change the original coverage score. Root recovery, event detection and subsequent verification are different tasks. Reporting each one preserves the information needed to compare workflows fairly.

## Check the control before explaining the shift

[When a Reduced Ventilation Model Leaves Its Training Regime](/writing/when-a-reduced-ventilation-model-leaves-its-training-regime/) raises a different boundary. Both reduced models already fail the declared nominal holdout gate. Their shifted trajectories reveal where errors occur, but the protocol cannot attribute those errors to the shift alone. It lacks a nominally admissible reduced-model control for that claim.

The failure is useful evidence about these frozen models and tests. It is not evidence that all reduced models fail, and the synthetic numerical reference does not establish real-room performance. A new basis or warning rule would need a new declared design and evaluation.

These studies are separate examples, not a combined benchmark. Together they suggest a simple reporting habit: preserve the original question and criterion, state what failed, identify what later checks establish, and mark which claim now requires a new experiment. A narrower answer can be more useful than a broader story whose missing control has disappeared from view.
