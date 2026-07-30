---
title: 追蹤式諧波消除的即時 sEMG 處理
slug: semg-real-time-conditioning
sourceSlug: semg-real-time-conditioning
summary: 一項可重現的合成實作，把因果逐樣本處理與帶閘門的市電頻率追蹤分開，用於諧波消除與包絡抽取。
year: 2026
lastUpdated: 2026-07-30
status: Reproducible study
featured: true
topics: [生物醫學訊號處理, 即時系統]
methods: [SOS 數碼濾波, 追蹤式諧波 NLMS, Exponential RMS 估計]
researchQuestion: 可否追蹤會漂移的市電干擾，而不用在每個樣本步驟放入重型頻譜計算？
dataType: 受控合成多通道 sEMG 類訊號
codeAvailable: true
dataAvailable: false
studentSuitable: false
heroImage: /science/semg-real-time-conditioning/pipeline.svg
period: 2026
validation: 十個測試、確定性合成 benchmark、機器可讀摘要及分開報告的主機 Python 計時。
keyFindings:
  - 追蹤式諧波消除的合成重建 SNR 中位數為 11.48 dB，固定諧波為 8.80 dB。
  - 主機 Python 快速路徑中位數 12.96 微秒、p99 為 24.94 微秒；這不是嵌入式 WCET。
limitations:
  - 所有隨附效能結果均為合成，沒有聲稱真實 Ninapro 參與者結果。
  - 實作不是臨床器材或已驗證義肢控制器。
redirectFrom: []
---

## 編輯導覽

〈[追蹤市電噪聲，同時保留肌電訊號](/zh/writing/tracking-mains-noise-without-losing-the-muscle-signal/)〉完整介紹架構、自適應方程、三幅自製圖、計時邊界、Ninapro provenance 審核，以及走向真實資料與嵌入式驗證的分階段路線。
