---
title: 可解釋的電動車調度與補能
slug: intelligent-ev-dispatch
sourceSlug: intelligent-ev-dispatch
summary: 一條白箱流程，把能源預測、公平調度與由中斷觸發的重新規劃連在一起。
year: 2026
lastUpdated: 2026-07-28
status: Reproducible study
featured: true
topics: [城市與出行系統, 可靠性與不確定性]
methods: [物理資訊迴歸, 多目標最佳化, CUSUM 與 EWMA]
researchQuestion: 可審核模型能否在車隊能源、利潤、公平與中斷反應之間取得可解釋的平衡？
dataType: 專案本地營運紀錄；不聲稱可重新分發
codeAvailable: true
dataAvailable: false
studentSuitable: false
heroImage: /science/intelligent-ev-dispatch/pareto-frontier.png
period: 2026
validation: 報告同時評估預測誤差、調度取捨、警報 precision／recall 與中斷成本。
keyFindings:
  - 在已報告運行中，路線及環境特徵主導設定的殘差修正。
  - 調度實驗呈現非退化的利潤—能源—公平前沿。
limitations:
  - 儘管 R² 較高，報告的能源 MAPE 仍為 42.512%。
  - 調度採用簡化分派結構，不是完整精確 MILP。
  - 中斷由風格化模擬產生。
redirectFrom: []
---

## 概覽

專案先以物理關係估計能源，再用可解釋殘差模型修正，最後把估計放入多目標調度搜尋。EWMA 與 CUSUM 在殘差改變時觸發滾動重新規劃。

## 證據與解讀

高 R² 與 42.512% MAPE 必須一起閱讀：模型捕捉到主要變化，但相對誤差仍然可觀。因此，最佳化結果是計算研究，不是量產調度保證。

## 技術紀錄

雙語報告、設定、程式與完整結果保留於私人工作區。公開頁只整理已核對的發現與限制。

