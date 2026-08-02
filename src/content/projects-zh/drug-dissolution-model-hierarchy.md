---
title: 藥物溶出模型層級
slug: drug-dissolution-model-hierarchy
sourceSlug: drug-dissolution-model-hierarchy
summary: 可重現比較經驗釋放定律、有限 sink 球形擴散與移動前沿動力學，並審核模型選擇及參數可辨識性。
year: 2026
lastUpdated: 2026-08-02
status: Reproducible study
featured: true
topics: [傳輸現象, 數學建模]
methods: [徑向擴散 PDE, 模型選擇, 可辨識性分析]
researchQuestion: 經驗藥物釋放定律在甚麼情況下不足以描述有限體積溶出？
dataType: 受控合成溶出觀測
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/drug-dissolution-model-hierarchy/model-hierarchy.svg
period: 2026
validation: 鎖定環境通過三項自動測試；41 個聲明輸出全部重新生成並通過校驗。
keyFindings:
  - 有限 sink PDE 在聲明候選中 AIC 最低，為 -179.924。
  - 最終釋放比例為 0.9750，最大數值質量平衡誤差為 3.11e-13。
limitations:
  - 結果使用合成觀測，不能支持臨床或配方結論。
  - 膨潤、降解、非 Fick 傳輸及實驗批次變異不在範圍內。
redirectFrom: []
---

## 編輯導讀

完整文章見[〈簡單藥物釋放定律何時不再足夠？〉](/zh/writing/when-simple-drug-release-laws-stop-being-enough/)，涵蓋模型層級、傳輸區域圖、局部指數、模型辨識、參數可辨識性、多分散性、守恆審核及九幅經批准圖像。

公開頁面只解釋經審核輸出，不公開私人 notebook、求解器源碼、原始觀測或計算筆記。
