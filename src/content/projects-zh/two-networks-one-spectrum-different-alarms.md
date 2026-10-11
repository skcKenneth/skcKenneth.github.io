---
title: 兩個網絡，同一組特徵值，不同警報
slug: two-networks-one-spectrum-different-alarms
sourceSlug: two-networks-one-spectrum-different-alarms
summary: 以受控正值網絡分清長期穩定與有限時間感測警報，比較精確轉移、經典 phase-type 計算及嚴格決策 margin，並保留無法認證與警報不變的結果。
year: 2026
date: 2026-10-11T10:00:00+08:00
lastUpdated: 2026-10-11T10:00:00+08:00
period: 2026
status: Reproducible study
featured: true
draft: false
topics: [Network dynamics, Positive systems, Transient response, Decision robustness]
methods: [Positive compartment generators, Matrix exponential, Phase-type path evaluation, Duhamel bounds, Markov coupling, Interval verification]
researchQuestion: 當物理一致、等頻譜的路由變化改變有限時間來源至感測器警報，哪些精確計算與嚴格界限足以判定？
dataType: 共同物質量、轉移速率及統一移除的構造無環運輸網絡；沒有經校準的環境量測
codeAvailable: false
dataAvailable: false
studentSuitable: false
projectUrl: https://skckenneth.github.io/zh/writing/two-networks-one-spectrum-different-alarms/
heroImage: /images/spectral-blind-spots/fig-01.svg
validation: 獨立矩陣指數與 phase-type 參照、非負與物質收支恆等式、精確路由係數、區間峰值驗證，以及預留結構和參數比較。
keyFindings:
  - 固定特徵值本身，不能區分路由相關的來源至感測器響應。
  - 在 6,912 筆配對門檻查詢中，172 筆警報改變，6,740 筆保持不變。
  - 路徑包絡認證 6,473 筆查詢，佔全部 93.65%；基本 Duhamel 上界為 3,147 筆，佔 45.53%。
  - 正式峰值及響應差全部通過驗證，另設的近邊界控制保留為未定。
limitations:
  - 構造的線性區室模型，不建立真實污染安全或環境校準。
  - 感測區室物質量，不自動等於濃度、通量或劑量。
  - Nonnormality 是診斷，不是被單獨隔離的因果機制或經校準風險分數。
  - Phase-type 數學及直接／鏈式反例是既有背景，不是新穎性主張。
---

## 相同衰減速率，不同監測問題

穩定頻譜回答線性模型最終是否衰減；有限時間警報問一次局部釋放，會否在期限內讓指定感測器積聚太多物質。即使所有物質量保持非負、每個網絡損失完全相同總量，兩個問題仍可能有不同答案。

這個研究固定來源、終端感測器、一單位注入量、非終端轉移速率與統一移除，只改變向前路由。三角生成矩陣因此保留所有特徵值，但旅行時間分布和終端物質量可以不同。直接與鏈式例子用來解釋機制，不當作新的研究發現。

## 精確響應與有用保證，是兩種成果

比較使用完整矩陣指數，以及獨立的經典 phase-type／路徑長度計算，再問 Duhamel、total-variation、coupling 與路徑特定界限，是否夠緊而保護門檻決策。有效不等式不等於有用證書：一條界限可以處處成立，卻寬得無法判定真正重要的個案。

預留結構及參數區域測試固定規則，不按戲劇化警報挑例子。連續時間峰值包圍保留門檻相等與數值不確定性；警報不變、很鬆界限、未能判定與驗證成本，全部屬於結果，而不是應刪去的雜訊。

預留評估把 72 個網絡，與八個速率／移除／期限區域、四個路由混合權重及三個門檻交叉比較。2,880 條響應形成 2,304 對路由及 6,912 筆配對門檻查詢，其中 172 筆警報翻轉。路徑特定包絡認證 6,473 筆不變決策，但除了實際翻轉，仍對 267 筆其實不變的個案無法判定。兩次完整運算的科學記錄一致；獨立矩陣指數核對最大差異為 $7.33\times10^{-15}$。這些是基準數目，不是獨立實地觀測或母體風險估計。

## 有界線的研究貢獻

成果定位為經驗證的決策審核與機制解說，不是新的 phase-type、nonnormality 或網絡暫態理論。模型是合成而刻意受限的。把物質量解讀成濃度，需要相同區室體積或明確正規化；真實安全決策還需要校準與合適標準。

閱讀[《兩個網絡，同一組特徵值，不同警報》](/zh/writing/two-networks-one-spectrum-different-alarms/)，了解模型、十幅研究圖、獨立計算、預留比較，以及預測、未能判定的界限和條件式保證之間的分別。
