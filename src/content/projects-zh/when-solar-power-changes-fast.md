---
title: 當太陽能發電急升急跌
slug: when-solar-power-changes-fast
sourceSlug: when-solar-power-changes-fast
summary: 獲 ADMA 2026 接納的短論文，研究太陽能預測區間的條件可靠性。五站比較分開一致的校準改善，以及困難事件下仍未達到的絕對可靠性。
year: 2026
date: 2026-09-09
lastUpdated: 2026-09-09
status: Accepted
featured: false
draft: false
topics: [太陽能預測, 不確定性量化, 學生研究]
methods: [共形化分位數迴歸, 描述量分數校準, 時序評估, 站點級配對比較]
researchQuestion: 校準改善能否在不同太陽能站點的 ramp 與感測特徵移除情境中保留，而改善後的區間是否符合預設的條件可靠性檢查？
dataType: 中國國家電網公開太陽能數據，2019–2020 年、15 分鐘取樣；五個確認站點、四折、兩個預測期
codeAvailable: true
dataAvailable: true
studentSuitable: true
repositoryUrl: https://github.com/skcKenneth/solar-ramp-reliability/tree/19f6075edf642160be27e06692f4b78201d9ff57
projectUrl: https://skckenneth.github.io/zh/writing/when-solar-power-changes-fast/
teachingUrl: https://skckenneth.github.io/zh/teaching/student-research-studio/
heroImage: /images/adma-solar-intervals/04-paired-stations.svg
period: 2026
validation: 為雙語文章及圖像重新聚合論文引用公開版本的已保存結果，沒有重新訓練或修改已提交論文。重複單位是站點，不是時間戳或時間折。
keyFindings:
  - Descriptor CQR 令五站全部改善；15／60 分鐘的平均最差群組欠覆蓋減少 0.110／0.080。
  - 最差群組覆蓋率仍為 0.470／0.537，標稱目標為 0.90；沒有可部署候選符合所有站點的絕對可靠性準則。
  - Descriptor 區間更寬，但整體 proper score 改善；部分非 ramp 比較仍有不利的效率結果。
limitations:
  - 同一數據集的五個外部站點，不能建立地理、氣候或操作泛化；時間折會重用歷史。
  - 感測特徵移除不是完整現場停機。自然缺失分析排除當前功率缺失，且只有 CSGS5 有合資格群組。
  - 未來標籤參考不可部署，只是描述性診斷，不是因果分解或性能上界。
  - 2026-09-03 獲接納為 Short Paper，2026-09-09 已提交 camera-ready；不聲稱已完成報告、已有正式論文集條目、索引或論文 DOI。
---

## 有價值的改善，但仍然未夠

太陽能預測區間需要在功率快速變化及輸入退化時接受檢查，而不只是在普通與困難情況混合後，看一個平均數。本研究固定底層預測器，在五個確認站點比較按感測條件、風險分層、描述量及滾動歷史進行的校準。

核心結果是一個區別：Descriptor CQR 改善每個站點的最差群組端點，但所有可部署候選仍未符合絕對可靠性要求。該要求容許相對標稱 0.90 覆蓋率有 0.10 短缺，即 80% 底線。這是刻意寬鬆的研究檢查，不是業界標準，也不代表已足以應付操作需要。

詳見長文[當太陽能發電急升急跌：預測區間改善了，為甚麼仍不夠可靠？](/zh/writing/when-solar-power-changes-fast/)，包括模型、八幅研究圖、逐站結果、寬度—評分取捨與自然缺失資料限制。[公開研究版本](https://github.com/skcKenneth/solar-ramp-reliability/tree/19f6075edf642160be27e06692f4b78201d9ff57)提供論文引用的科學材料。

## 方法與證據

五個保留站點為 CSGS2、CSGS5、CSGS6、CSGS7 及 CSGS8。四個按時間排列的資料折、兩個預測期，共有 40 個評估組合，不是 40 次獨立重複。Descriptor 使用 LightGBM 分數分位數模型，再按時間順序進行殘差校準，不是近鄰方法。Risk-Mondrian 只在 15 分鐘符合比較準則；Descriptor 在兩個預測期符合；Rolling 兩者都未符合。

15／60 分鐘下，Descriptor 的平均最差群組短缺改善為 0.110／0.080，剩餘最差短缺仍為 0.430／0.363。不重新擬合的事件門檻敏感度與未來標籤診斷，有助提出下一個問題；自然缺失分析則只適用於樣本足夠、當前功率與未來目標均已觀測的 CSGS5 子集。

## 作者與接納紀錄

正式論文題目：*When Solar Power Changes Fast: A Multi-Site Audit of Prediction-Interval Reliability under Ramp Events and Sensor Degradation*。

正式作者次序：**Hong U Lo、Zibo Gao、Peng Chi Lam、Sok Kin Cheng**。所屬機構：St. Joseph Diocesan College (The Fifth School), Macao SAR, China。Sok Kin Cheng 為通訊作者及研究指導老師，教育背景可見[學生研究紀錄](/zh/teaching/student-research-studio/)。

研究於 **2026 年 9 月 3 日獲 ADMA 2026 Research Track 接納為 Short Paper**，並於 **2026 年 9 月 9 日完成 camera-ready 提交**。[會議預定於 2026 年 11 月 13–15 日在香港舉行](https://adma2026.github.io/)。這是一項接納紀錄，不是已完成報告或正式出版的聲稱；論文集及索引狀態，須以各自的實際紀錄為準。
