---
title: 拱北口岸無障礙多模式路線規劃
slug: accessible-multimodal-routing
sourceSlug: accessible-multimodal-routing
summary: 以人群差異為核心，研究斜坡、樓梯、轉乘、擠迫及升降機缺失如何改變口岸樞紐內的路線。
year: 2026
lastUpdated: 2026-07-28
status: Reproducible study
featured: true
topics: [城市與出行系統, 可靠性與不確定性]
methods: [多層網絡, 多目標路線規劃, Sobol 敏感度分析]
researchQuestion: 行動限制如何改變密集多模式樞紐內的最佳路線與改善優先次序？
dataType: 案例網絡及預設人群假設
codeAvailable: true
dataAvailable: true
studentSuitable: true
heroImage: /science/accessible-multimodal-routing/network.png
period: 2026
validation: 以變異為本的敏感度分析及移除邊線實驗，壓力測試不同人群的路線。
keyFindings:
  - 明確表示垂直障礙後，交通模式與路線選擇會隨之改變。
  - 在輪椅使用者設定中，斜坡及轉乘假設是模擬出行成本的重要驅動因素。
limitations:
  - 案例只涵蓋約一平方公里的單一樞紐。
  - 多項行為與無障礙成本仍需本地資料校準。
  - 政策含意源於模型，並非已部署介入的觀察證據。
redirectFrom: []
---

## 概覽

研究把步行、巴士、鐵路與的士表示成互相連接的網絡層，不再假設只有一位「平均旅客」，而是分別設定一般、長者、攜帶行李及輪椅使用者。

## 問題為何重要

地理上最短的路線若包含樓梯或不可達轉乘，實際上可能無法使用。忽略這些障礙的目標函數會把行動不便人士承受的額外成本隱藏起來。

## 模型、資料與假設

流程結合步行困難指數、廣義出行成本、按人口群體調整的 Dijkstra 路線、Pareto 標籤法及加權中介中心性。拱北網絡是案例表示；行為成本是模型假設，並非每名旅客的直接觀察。

## 驗證與結果

敏感度分析分解模擬出行成本的變異來源，連續移除邊線則測試路線冗餘。升降機及低地台轉乘在模型中降低輪椅使用者的成本，但尚未作為實際介入評估。

## 技術紀錄

計算、程式、設定及重現說明保留在私人技術工作區；公開頁只呈現經人工審閱的解釋與核准圖像。

