---
title: 保持正值與守恆的時間步進
slug: positive-conservative-time-stepping
sourceSlug: positive-conservative-time-stepping
summary: 以剛性轉移網絡基準，比較顯式方法與保持正值、質量守恆的線性隱式更新。
year: 2026
lastUpdated: 2026-07-28
status: Reproducible study
featured: true
topics: [可靠性與不確定性, 數學建模教育]
methods: [幾何積分, 剛性常微分方程, 自適應步長加倍]
researchQuestion: 標準顯式方法何時會產生負狀態，而維持可行性需要犧牲多少精度？
dataType: 合成守恆網絡基準
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/positive-conservative-time-stepping/positive_integrator_trajectories.svg
period: 2026
validation: 矩陣指數參考解、不變量檢查、可行性圖譜與容差研究。
keyFindings:
  - 在 429 個測試個案中，Euler 法有 38.46%、RK4 有 25.17% 出現負值。
  - 正值隱式法沒有負值個案，質量漂移低於 9e-14。
limitations:
  - 只測試線性守恆轉移網絡。
  - 不宣稱涵蓋所有高階結構保持求解器。
redirectFrom: []
---

## 編輯導讀

研究區分代數守恆、計算守恆、正值性與準確度。完整文章見[〈當數值方法創造出負物質〉](/zh/writing/positive-conservative-time-stepping/)。
