---
title: "留下那個改變問題的結果"
slug: keep-the-result-that-changes-the-question
sourceSlug: keep-the-result-that-changes-the-question
summary: 檢查失敗可以收窄研究能回答的問題。兩項已發布數值研究說明，為何後來的發現不能抹去原本的失敗。
date: 2026-10-11
lastUpdated: 2026-10-11
draft: false
featured: false
archived: false
type: 教學筆記
topicIds: [teaching-research-practice, computation-code, risk-decisions]
topics: [負面結果, 數值驗證, 研究實踐]
relatedSlugs: [how-many-equilibria-did-the-optimizer-miss, when-a-reduced-ventilation-model-leaves-its-training-regime]
---

一次檢查失敗，可能改變實驗能回答甚麼。把失敗留下，讀者才能分清原本的比較與後來學到的事。

## 後來找到，不等於原先已找到

[〈優化器漏掉了多少個平衡態？〉](/zh/writing/how-many-equilibria-did-the-optimizer-miss/)中，快速事件掃描漏掉兩個摺點，但分支軌跡已保存。後續檢查利用那些軌跡驗證了轉折，支持指定有限模型與範圍內的事件存在。

這不代表原先掃描已找到它們。補充驗證沒有事後加入新初值，也沒有改寫原來的覆蓋分數。找回根、偵測事件與後續驗證是不同工作，應各自交代。

## 先看控制，再解釋轉移

[〈當降階通風模型離開訓練範圍〉](/zh/writing/when-a-reduced-ventilation-model-leaves-its-training-regime/)有另一條界線：兩個降階模型在預先指定的名義 holdout 已未過關。因此，轉移軌跡可診斷誤差位置，卻不能把誤差歸因於轉移本身；研究欠缺通過名義準則的降階模型控制。

失敗支持對這些固定模型與測試的判斷，不代表所有降階模型都失敗；合成數值參照亦未建立真實房間表現。新的基底或警告規則，需要新的預先設計與評估。

兩項研究不是共同基準，但提醒同一個報告習慣：保留原問題與準則，列明失敗，分清後續檢查證明了甚麼，以及哪個結論需要新實驗。收窄了的答案，往往比隱去缺失控制的故事更有用。
