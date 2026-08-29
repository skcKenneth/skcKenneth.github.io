---
title: 當有效擴散係數不再足夠有效
slug: when-effective-diffusivity-stops-being-effective
sourceSlug: when-effective-diffusivity-stops-being-effective
summary: 這項可重現的第一階段基準，標出單一調和係數何時能保留固定一維週期薄板的合成釋放，以及 finite-cell transient 何時跨過凍結誤差門檻。
year: 2026
lastUpdated: 2026-08-29
status: Reproducible study
featured: false
topics: [傳輸現象, 數值分析, 均質化]
methods: [Periodic homogenization, Conservative finite-volume diffusion, Held-out calibration audit]
researchQuestion: 對一個凍結的對稱週期薄板 family，有限週期數與擴散率對比如何改變調和均質模型的釋放曲線準確度？
dataType: 合成一維週期擴散與釋放曲線
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/when-effective-diffusivity-stops-being-effective/p02_03_harmonic_reliability_map.svg
period: 2026
validation: 凍結結果通過全部九個 top-level scientific checks、24 個 joint space-time refinement checks、九個 mathematical unit tests、repository 與 deterministic two-run reproducibility checks，以及 original-size visual QA。
keyFindings:
  - 在 18 個異質案例中，調和模型按預先宣告的 trajectory、t50、t90 gates 分為七個 adequate、兩個 grey、九個 breakdown。
  - 每個已測 contrast 在 N=1、2、4 都是 breakdown；N=8 時 contrast 10 adequate，而 100 與 1000 是 grey；N=16、32 時全部已測 contrasts 都 adequate。
  - 恰好三個 N=1 案例通過 early-window fit-error gate，卻令 held-out t90 偏差 11.11% 至 12.17%；後期釋放沒有參與 fitting。
limitations:
  - 這是合成 diffusion-only 第一階段 benchmark，只涵蓋一種一維週期二元 geometry、一個慢相 boundary phase、固定 perfect sinks 與 24-case grid。
  - 它沒有 swelling、erosion、degradation、dissolution、binding、reaction、moving interfaces、finite external mass transfer、random 或 imaged morphology，也沒有 physical calibration。
  - Release fractions 與 t50/t90 只是合成曲線事件；不支持 clinical、dose、efficacy、safety、general homogenization 或 universal cell-count claim。
redirectFrom: []
---

## 編輯導讀

文獻 gate 結論是 **REFRAME**：periodic homogenization、effective-diffusivity release model、microstructure-resolved transport、connectivity effects 與 finite-transient deviations 均已有先行研究。可辯護的本地貢獻是一個可審計的 finite-scale replication-extension benchmark，不是新有效係數或一般藥物模型。

完整文章請閱讀[當有效擴散係數不再足夠有效](/zh/writing/when-effective-diffusivity-stops-being-effective/)，內容包括 model derivation、凍結 24-case protocol、精確 reliability map、early-fit holdout witnesses、失敗嘗試紀錄、numerical 與 visual audits、重現命令，以及仍被鎖定的下一階段。
