---
title: 從延遲總數框住隱藏疫情
slug: can-aggregate-observations-bound-an-epidemic
sourceSlug: can-aggregate-observations-bound-an-epidemic
summary: 以六區 SIR 合成基準比較中央 ensemble 區間與經驗證的受約束箱形外包絡，分清條件式包含與有用精度，並檢查停止接收觀測後還能預測甚麼。
year: 2026
date: 2026-09-12
lastUpdated: 2026-09-12
status: Reproducible study
featured: false
draft: false
topics: [動力系統, 集合成員估計, 資料同化, 不確定性]
methods: [經驗證區間積分, 守恆約束收縮, 集合卡爾曼濾波, 配對合成實驗]
researchQuestion: 在固定有界誤差疫情模型下，聚合程度與已知報告延遲如何影響隱藏狀態包含率、區間寬度及每日網格峰值預測？
dataType: 六區 SIR 合成軌跡及有界誤差觀測；沒有病人或實地資料
codeAvailable: false
dataAvailable: false
studentSuitable: false
projectUrl: https://skckenneth.github.io/zh/writing/can-aggregate-observations-bound-an-epidemic/
heroImage: /images/set-membership-epidemic-bounds/03-filtering-intervals.svg
period: 2026
validation: 條件式包含論證涵蓋初值集合、經驗證動力傳播、每日守恆擾動、正確日期的量測收縮及延遲推進；另檢查數值收斂、批次獨立性、未來資料排除及明確失敗案例。
keyFindings:
  - 單一群組總數容許不同地區分布，但這種單次量測歧義並不是動力系統不可觀測的定理。
  - 中央 95% ensemble 區間與確定性有界誤差外包絡，回答的是不同的不確定性問題。
  - 透明的一階箱形表示可能丟失足夠多的相依關係，以致即使包含真值，界限也幾乎沒有資訊。
  - 兩組報告、延遲五日的基準下，集合外包絡與 EnKF 的平均人口正規化寬度分別為 48.40% 與 0.951%；EnKF 分量包含率為 94.05%。
  - 第 20 日預測停止接收新觀測後，基準集合峰值界限仍涵蓋完整的 0–6,000 人與第 21–120 日，展示有包含性而無實用精度的情況。
limitations:
  - 速率、流動、延遲及誤差界限都是指定的合成輸入，不是真實疾病的估計性質。
  - 包含論證以這些輸入及經驗證運算成立為條件；有限樣本沒有漏掉真值，本身不是證明。
  - 本文比較兩個已聲明的實作，不代表最佳集合表示或最佳調校機率估計器，也不是公共衞生建議。
---

## 窄的估計與安全的界限，並不是同一種輸出

研究透過六組、兩組或一組報告觀察當時感染存量，並加入已知的整日延遲。兩個估計器使用相同初始資訊和已收到的觀測。人口流動會改變各區人口，即使六區總人口一直維持 6,000。

EnKF 利用模擬成員之間的分布資訊；受約束箱形估計器則保留符合有界誤差及經驗證動力學的狀態。科學問題不只是看哪一條陰影帶較窄，而是每一條帶代表甚麼、是否包含真值，以及還剩下多少有用資訊。

## 基準測試檢查甚麼

18 個主要設定及四個單因素設定，各有 50 次獨立重複。比較記錄分量包含率、整條軌跡同時包含率、人口正規化寬度及攤分更新時間。另在第 20 日發出一次停止同化新資料的預測，限制直到第 120 日每日網格上的總感染峰值。

研究同時保留反例：超出假設的量測可以在集合仍非空時排除真值；互相矛盾的量測可以令集合變空；即使解析真值一直沒有感染，長時間不收資料的箱形傳播仍可能變闊。這是三種不同失敗，需要不同解釋。

完整雙語研究、八幅數據圖、數值結果及限制見[《只見總數，能否框住看不見的疫情？》](/zh/writing/can-aggregate-observations-bound-an-epidemic/)。固定的合成模型讓我們檢查隱藏真值；其結果既不能驗證疫情政策，也不構成新估計方法的宣稱。
