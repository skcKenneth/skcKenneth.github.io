---
title: 系統發育模型錯置
slug: phylogenetic-model-misspecification
sourceSlug: phylogenetic-model-misspecification
summary: 一項已驗證的四物種實驗，顯示距離模型無法表示組成異質性時，更多序列資料可以令錯誤演化樹更穩定。
year: 2026
lastUpdated: 2026-07-30
status: Reproducible study
featured: true
topics: [數學生物學, 可靠性與不確定性]
methods: [非平穩序列模擬, Neighbor Joining, Bootstrap 診斷]
researchQuestion: 當推斷模型有結構性錯置時，更多 DNA 會否提高對錯誤拓撲的信心？
dataType: 受控合成核苷酸比對
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/phylogenetic-model-misspecification/heterogeneous-recovery.svg
period: 2026
validation: 六個測試、19 項必要輸出、44 個 manifest 檢查、同質對照及 250 次 bootstrap。
keyFindings:
  - 異質生成器在 5000 位點時，p-distance、JC69 與 K80 在 120 條比對中 0 次恢復真實分割；正則化 log-det 為 120 次。
  - 選定比對在不同距離模型下，對互不相容分割都可產生完整 bootstrap 支持。
limitations:
  - 四物種樹與異質過程是刻意設計的示範。
  - 研究沒有證明正則化 log-det 普遍優越。
redirectFrom: []
---

## 編輯導覽

〈[當更多 DNA 令錯誤的演化樹更確定](/zh/writing/when-more-dna-makes-the-wrong-tree-more-certain/)〉完整分開抽樣與模型誤差，展示組成嚴重度地圖、bootstrap 解讀、四幅核准圖及實用模型適足性流程。
