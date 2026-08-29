---
title: 同化你真正觀察得到的量
slug: assimilating-what-you-can-observe
sourceSlug: assimilating-what-you-can-observe
summary: 一個固定六區 EnKF benchmark 顯示，正確 aggregate-and-delay observation operator 改善合成狀態與峰值預測，但 latent-state coverage 不及門檻，因此結論只能是 PARTIAL。
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [資料同化, 空間流行病模型, 不確定性校準]
methods: [Ensemble Kalman filter, Observation-operator stress test, Held-out peak diagnostics]
researchQuestion: 已知的 aggregate-and-delay observation operator 可以恢復多少狀態與 held-out peak performance，而 latent uncertainty 是否通過預先申明的 calibration gates？
dataType: Deterministic synthetic 六區 SIR truth 與固定 noisy observation streams
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/assimilating-what-you-can-observe/p06_01_observation_operator_protocol.svg
period: 2026
validation: 五個 evidence tests、project 與 portfolio checkers、canonical/rerun 相同 result hashes、conservation/operator checks 及 independent original-size PNG/PDF visual QA 均通過；predeclared latent-state coverage gate 保留為 failure。
keyFindings:
  - Correct aggregate-and-delay arm 把 infected-state RMSE 由 open loop 的 264.255 及 wrong operator 的 126.335 降至 36.090。
  - 它對 held-out day-62 total-infected peak 的 timing error 是零日、intensity error 是 0.743%，相對 wrong operator 的五日及 4.726%。
  - Nominal 90% latent-state interval 只覆蓋 0.562963，低於 frozen minimum 0.70，所以 machine verdict 是 PARTIAL，而非 fully supported。
limitations:
  - Evidence 只涵蓋一條 deterministic 六區 synthetic SIR truth、一個 ensemble design 及一個 jointly misspecified comparator。
  - 研究沒有分離 grouping、delay 與 reporting-fraction effects，亦沒有比較 alternative filters、smoothing、inflation 或 localisation。
  - 沒有 dengue records、patients、districts、clinical decisions、operational forecasts 或 public-health recommendations。
redirectFrom: []
---

## 編輯導讀

文獻 gate 是 **REFRAME**，因為 epidemic ensemble filtering、reporting delay 與 observation-function mismatch 都有成熟研究。可辯護的貢獻是一個固定、保留失敗的 replication-extension audit，不是新 EnKF、dengue model 或 field validation。

完整文章請閱讀[同化你真正觀察得到的量](/zh/writing/assimilating-what-you-can-observe/)，內容包括 observation model、四個 matched arms、point 與 calibration diagnostics、held-out peak comparison、保留的 coverage failure、reproduction hashes 及 evidence boundary。
