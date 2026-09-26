---
title: 交通模型要記住甚麼？少看一些狀態，會否判錯穩定性？
slug: what-must-a-traffic-model-remember
sourceSlug: what-must-a-traffic-model-remember
summary: 以環形最佳速度模型、精確線性消元與受控觀測雜訊，區分歷史資料何時補足隱藏狀態、何時改善估計，以及何時令模型變得過大或對數值誤差敏感。
year: 2026
date: 2026-09-26
lastUpdated: 2026-09-26
status: Reproducible study
featured: false
draft: false
topics: [Mori–Zwanzig, Model reduction, Traffic dynamics, Memory]
methods: [Optimal velocity model, Exact linear coordinate elimination, Fourier projection, Vector autoregression, Noise and numerical sensitivity controls]
researchQuestion: 隱藏速度、駕駛員反應率差異與觀測雜訊，如何分別影響縮小交通模型的預測與線性穩定邊界？
dataType: 24 輛車的合成環形交通軌跡，沒有真實道路量測或參數校準
codeAvailable: false
dataAvailable: false
studentSuitable: false
projectUrl: https://skckenneth.github.io/zh/writing/what-must-a-traffic-model-remember/
heroImage: /images/mori-zwanzig-traffic-memory/01-hidden-velocity.svg
period: 2026
validation: 以同質閉合解、解析 AR(2)、完整矩陣指數、獨立記憶重建、積分收斂、排列頻譜恆等式、守恆與碰撞測試核對核心；保存噪聲對照、非線性初值失敗及追加求解容差敏感性。
keyFindings:
  - 同質線性模型的第一車距與速度 Fourier 配對已經閉合，精確聯合記憶核為零。
  - 藏起速度或引入駕駛員差異，可產生可精確推導的隱藏狀態影響與記憶表示。
  - 主比較完成 297 個參數設定及 23,463 個模型設定；歷史在不少異質與含雜訊條件下改善預測，但改善不等於辨認物理記憶。
  - 固定反應率的組合後，駕駛員排列不改變完整線性頻譜，卻可以改變投影記憶與辨識難度。
  - 部分長歷史模型會放大微小數值誤差；大振幅壓力測試亦保留持續的外推失敗。
limitations:
  - 普通聯合 VAR 延遲係數不是經投影一致性辨識的精確 Mori–Zwanzig 核。
  - 模型在每個參數與排列重新擬合，只驗證獨立初值，不宣稱跨參數泛化。
  - 研究對象是均勻流的線性失穩與受控有限振幅測試，不是所有堵塞機制或真實道路成效。
  - 四維 VAR(16) 具有 64 維增廣狀態，超過完整模型的 47 維，不能單靠輸出維度宣稱壓縮。
---

## 相同的當前車距，可以有不同的未來

如果速度資訊被藏起來，兩個看似相同的車距波可以往不同方向演化。但若在同質線性環路中同時保留車距與速度的第一模態，這組觀測本身便已經閉合，不需要額外的物理記憶。

本研究由這對正、負控制開始，再加入駕駛員反應率差異、觀測雜訊與有限振幅。完整模型提供可核對的真值，縮小模型則只看部分空間資訊或最近歷史。比較同時追蹤預測誤差、增長符號、臨界位置及模型成本。

## 有用的歷史，需要適當的解釋

異質條件下，有限歷史在不少設定中改善預測與符號判斷；同質含雜訊控制也有改善，顯示其中一部分效益可以來自估計與濾波。這兩個結果需要共同閱讀，不能把較好的分數直接稱為找回物理記憶。

非線性壓力測試另外揭示數值敏感性：某些小振幅失敗會隨求解精度改變，而代表性大振幅失敗在細化後仍存在。所有結果都屬於這個指定模型與資料設計，沒有真實交通部署主張。

閱讀[《交通模型要記住甚麼？少看一些狀態，會否判錯穩定性？》](/zh/writing/what-must-a-traffic-model-remember/)，可查看完整雙語文章、十幅研究圖、解析推導及保留的失敗案例。
