---
title: "After a Good Fit, What Should We Measure?"
slug: after-a-good-fit-what-to-measure
summary: A short note on choosing the next observation when several parameter explanations already fit the data.
date: 2026-10-11
lastUpdated: 2026-10-11
draft: false
featured: false
archived: false
type: Teaching Notes
topicIds: [data-ai, mathematical-thinking, teaching-research-practice]
topics: [Identifiability, Experimental design, Research practice]
relatedSlugs: [when-the-fit-is-not-the-model]
---

A close fit is a useful result. It becomes less informative when several very different parameter choices produce almost the same observed curve. The next question is then: **which observation would separate the explanations that already fit?**

## Look for disagreement

In [When the Fit Is Not the Model](/writing/when-the-fit-is-not-the-model/), a small saturation model illustrates the problem. Observations confined to its nearly linear region constrain a parameter ratio more strongly than either parameter separately. An optimizer can still return a precise-looking pair of numbers. That pair does not show how many other explanations remain plausible.

More observations in the same narrow range may improve precision while leaving that ambiguity largely intact. Extending the range toward the bend or plateau can supply a different kind of information. The useful location is where admissible explanations begin to disagree, subject to what can actually be measured.

## Keep the diagnosis specific

This is a practical identifiability problem: the experiment provides limited information. It is different from structural non-identifiability, where even ideal observations under the specified inputs and outputs cannot distinguish parameters. The article's finite-grid demonstration, with deterministic pseudo-noise, illustrates the practical case. Its near-optimal cells are neither a confidence region nor a proof of structural non-identifiability.

Before collecting more data, write down three things: the parameter or prediction that matters, the alternative explanations still compatible with the observations, and a feasible measurement on which those explanations disagree. Sometimes the honest target is an identifiable parameter combination rather than every parameter separately.

The [companion laboratory](/teaching/research-inquiry-studio/#identifiability) lets you vary observation range, noise and measurement count. It helps frame a design question; a complete uncertainty analysis still needs the model, observation process and statistical assumptions to be checked.
