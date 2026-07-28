---
title: 空間網格上的氣候驅動登革熱
slug: climate-driven-dengue
sourceSlug: climate-driven-dengue
summary: 以反應—擴散實驗結合溫度依賴蚊媒生態、長程移動、疫苗分配與數值檢查。
year: 2025
lastUpdated: 2026-07-28
status: Reproducible study
featured: true
topics: [環境建模, 可靠性與不確定性]
methods: [反應—擴散方程, 敏感度分析, 數值驗證]
researchQuestion: 氣候驅動與資源分配假設如何改變模擬登革熱發病？
dataType: 合成空間實驗矩陣
codeAvailable: true
dataAvailable: true
studentSuitable: true
heroImage: /science/climate-driven-dengue/incidence-matrix.png
period: 2025–2026
validation: 除情境實驗外，技術紀錄亦包含數值驗證入口與自動測試。
keyFindings:
  - 空間驅動可在模型內形成異質的模擬發病分布。
  - 不同分配策略可在相同合成假設下比較。
limitations:
  - 已發布的實驗矩陣是合成資料。
  - 輸出是情境比較，而非特定城市的預測。
  - 應用前需要以經驗資料校準生物參數。
redirectFrom: [/posts/2025/12/dengue-climate-reaction-diffusion/]
---

## 概覽

模型把人類與病媒動態連接到擴散、長程移動及溫度依賴的蚊媒生態。它是一個受控計算實驗室：研究者可改變假設、檢查數值行為，而不把結果誤寫成城市預測。

## 驗證

自動測試及數值驗證檢查實作和數值一致性，但不能代替流行病學校準或外部預測驗證。公開文章因而把結果寫成「在已聲明模型內的情境差異」。

## 重現與私隱

完整計算流程存放於私人 ScienceProject；網站只同步經核准的圖像及人工撰寫的結果解讀。

