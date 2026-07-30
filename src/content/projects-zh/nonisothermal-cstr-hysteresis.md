---
title: 非等溫連續攪拌反應器的滯後
slug: nonisothermal-cstr-hysteresis
sourceSlug: nonisothermal-cstr-hysteresis
summary: 一項非線性反應器研究，分析多重穩態、點火與熄火滯後、吸引域，以及接近熱失穩折點時的臨界減速。
year: 2026
lastUpdated: 2026-07-30
status: Reproducible study
featured: true
topics: [非線性動力學, 化學反應器建模]
methods: [平衡分支延拓, Jacobian 穩定性分析, 剛性常微分方程模擬]
researchQuestion: 非等溫反應器接近熱點火或熄火時，其穩定性、路徑記憶與恢復速度如何改變？
dataType: 受控的無因次反應器模擬
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/nonisothermal-cstr-hysteresis/equilibrium-branch.svg
period: 2026
validation: 已重新通過三項自動測試及 23 個輸出的 checksum manifest 驗證。
keyFindings:
  - 預設平衡分支在冷卻參數 -5.06568 與 -2.93432 出現折點，兩者之間存在三個平衡態。
  - 升溫與降溫沿不同穩定分支演化；接近點火折點時，系統恢復時間顯著增加。
limitations:
  - 模型是無因次的合成機制研究，並非工業反應器校準。
  - 未包含傳輸延遲、不完全混合、多重反應、致動器限制與參數不確定性。
redirectFrom: []
---

## 編輯導讀

完整文章請閱讀[當同一個反應器有三個溫度](/zh/writing/when-one-reactor-has-three-temperatures/)，內容包括模型推導、穩定性幾何、已核證的滯後實驗、吸引域、臨界減速診斷與五幅公開圖。

計算、程式與 notebook 保留於私有 ScienceProject；本頁只展示經人工編輯的解讀與核准公開的視覺證據。
