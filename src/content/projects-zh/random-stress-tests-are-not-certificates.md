---
title: 隨機壓力測試不是最壞情況證書
slug: random-stress-tests-are-not-certificates
sourceSlug: random-stress-tests-are-not-certificates
summary: 一個 deterministic interval benchmark 為單一合成 worst-case objective 提供可驗證上界，而固定 IID、Latin-hypercube 及 local-search designs 仍只是沒有 global upper bound 的 feasible incumbents。
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [全局最優化, 不確定性, 數值證書]
methods: [Interval branch-and-bound, Monotonicity reduction, Fixed seeded stress tests]
researchQuestion: 對一個有界的合成 CSTR-like objective，有效 worst-case certificate 與 sampling 或 multistart local search 找到的高值究竟差在哪裡？
dataType: 合成無因次代數 objective evaluations 與 deterministic bound traces
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/random-stress-tests-are-not-certificates/p07_02_certificate_convergence.svg
period: 2026
validation: 凍結 certificate 以 4.1264291805731546e-07 gap 收斂，獨立 200001-point reference 位於 certified interval 內，兩次 run 的 scientific signature 完全一致，mathematical tests 與 repository checks 通過，五張 publication figures 亦通過 original-size PNG 及 PDF-raster QA。
keyFindings:
  - Monotonicity 把三變量 bounded maximum 精確縮減到 z=-20、H=0.5 的 corner，只留下可認證的一維 temperature problem。
  - 最終 interval 為 [1.4443773087849885, 1.4443777214279065]，13 個 processed nodes 後已小於凍結 1e-6 tolerance。
  - 每個固定 IID 與 Latin-hypercube budget 都是 0/32 hits，但此紀錄沒有 population miss-probability 意義；local search 只提供 incumbents，不提供 global upper bound。
limitations:
  - Objective 是合成無因次代數 thermal-drift proxy，不是 dynamic、physical、experimental 或 plant CSTR model。
  - Zero-hit 結果只適用於指定 seeds、budgets 與 1e-4 rule；不作 probability 或 confidence claim。
  - Certificate 只涵蓋已證 corner 上的一維 temperature interval，而且沒有提出新 global-optimization algorithm。
redirectFrom: []
---

## 編輯導讀

文獻 gate 結論是 **REFRAME**。Deterministic global bounds、interval branch-and-bound、convex relaxations、Latin-hypercube designs、scenario methods 與 CSTR uncertainty analysis 均有成熟先行研究。本地成果是一個小型、可逐步核對的 certificate-versus-incumbent benchmark。

完整文章請閱讀[隨機壓力測試不是最壞情況證書](/zh/writing/random-stress-tests-are-not-certificates/)，內容包括 reduction proof、有效 upper enclosure、固定 sampling designs、0/32 結果的精確邊界、local-search failure modes、reproducibility signature、figure audit 與完整文獻紀錄。
