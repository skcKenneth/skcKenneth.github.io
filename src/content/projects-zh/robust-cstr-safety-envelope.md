---
title: 穩健 CSTR 安全包絡
slug: robust-cstr-safety-envelope
sourceSlug: robust-cstr-safety-envelope
summary: 以合成放熱反應器情境，量化滿足穩健熱風險準則所付出的產率代價。
year: 2026
lastUpdated: 2026-07-28
status: Reproducible study
featured: true
topics: [可靠性與不確定性]
methods: [非線性平衡, 情境最佳化, 分岔分析]
researchQuestion: 當動力學與傳熱不確定性必須滿足熱風險限制時，名義產量需要犧牲多少？
dataType: 合成反應器情境
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/robust-cstr-safety-envelope/cstr_bifurcation.svg
period: 2026
validation: 根解析度檢查、完整 Jacobian 穩定性分析與獨立時間積分。
keyFindings:
  - 情境違規率由名義最優點的 0.8875 降至穩健選擇的 0.01875。
  - 名義產率代價為 27.88%。
limitations:
  - 壓力測試比例並非已校準的工廠事故風險。
  - 平衡模型未納入保護系統與瞬態危害。
redirectFrom: []
---

## 編輯導讀

專案清楚呈現生產與風險之間的取捨，但不會把合成情境冒充事故概率。完整文章見[〈在穩健 CSTR 安全包絡內生產〉](/zh/writing/robust-cstr-safety-envelope/)。
