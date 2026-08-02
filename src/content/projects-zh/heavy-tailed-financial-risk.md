---
title: 厚尾金融風險壓力測試
slug: heavy-tailed-financial-risk
sourceSlug: heavy-tailed-financial-risk
summary: 在波動聚集、槓桿效應、Student-t 創新與罕見負跳躍下，可重現比較 VaR 及預期損失。
year: 2026
lastUpdated: 2026-08-02
status: Reproducible study
featured: true
topics: [金融風險, 時間序列]
methods: [GARCH 類模型, 極值理論, VaR 回測]
researchQuestion: 當波動聚集且損失包含厚尾與跳躍時，高斯預測可遮蔽多少尾部風險？
dataType: 受控合成金融回報
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/heavy-tailed-financial-risk/returns-and-volatility.svg
period: 2026
validation: 鎖定環境通過三項自動測試；37 個聲明輸出全部重新生成並通過校驗。
keyFindings:
  - 過濾歷史模擬最接近名義 1% 例外率，實際為 0.00972。
  - Student-t GARCH 擬合自由度為 4.2685，顯示創新分布具有實質厚尾。
limitations:
  - 回報為合成數據，結果不是投資建議。
  - 多變量依賴、流動性、交易成本與結構斷裂不在範圍內。
redirectFrom: []
---

## 編輯導讀

完整文章見[〈高斯模型隱藏了多少尾部風險？〉](/zh/writing/how-much-tail-risk-a-gaussian-model-hides/)，涵蓋壓力過程、尾部診斷、VaR 與 ES 預測、回測、校準、模型風險曲面、不確定性、銳度前沿及九幅經批准圖像。

公開頁面只解釋經審核證據，不公開私人源碼、擬合陣列、notebook 或中間計算。
