---
title: Real-Time sEMG Conditioning with Tracked Harmonic Cancellation
slug: semg-real-time-conditioning
summary: A reproducible synthetic implementation separates causal sample processing from gated mains-frequency tracking for harmonic cancellation and envelope extraction.
year: 2026
lastUpdated: 2026-07-30
status: Reproducible study
featured: true
topics: [Biomedical Signal Processing, Real-Time Systems]
methods: [SOS digital filtering, Tracked harmonic NLMS, Exponential RMS estimation]
researchQuestion: Can drifting power-line interference be tracked without placing a heavy spectral computation in every sample step?
dataType: Controlled synthetic multi-channel sEMG-like signals
codeAvailable: true
dataAvailable: false
studentSuitable: false
heroImage: /science/semg-real-time-conditioning/pipeline.svg
period: 2026
validation: Ten tests, deterministic synthetic benchmarks, machine-readable summaries, and separated host-Python timing.
keyFindings:
  - Tracked harmonic cancellation reached median synthetic reconstruction SNR 11.48 dB, compared with 8.80 dB for fixed harmonic cancellation.
  - The host-Python fast path measured 12.96 microseconds median and 24.94 microseconds p99; these are not embedded WCET results.
limitations:
  - All shipped performance results are synthetic; no real Ninapro participant result is claimed.
  - The implementation is not a clinical device or validated prosthetic controller.
redirectFrom: []
---

## Editorial overview

Read [Tracking Mains Noise without Losing the Muscle Signal](/writing/tracking-mains-noise-without-losing-the-muscle-signal/) for the architecture, adaptive equations, three custom figures, timing boundaries, explicit Ninapro provenance audit, and a staged route to real-data and embedded validation.
