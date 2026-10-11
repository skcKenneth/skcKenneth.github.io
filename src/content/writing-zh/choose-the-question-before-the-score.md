---
title: "先選問題，再選分數"
slug: choose-the-question-before-the-score
sourceSlug: choose-the-question-before-the-score
summary: 誤差小或平均表現改善，都只回答各自的問題。到達時間與最弱群組的可靠性，需要直接對應的檢查。
date: 2026-10-11
lastUpdated: 2026-10-11
draft: false
featured: false
archived: false
type: 教學筆記
topicIds: [risk-decisions, cities-engineering, data-ai]
topics: [評估設計, 事件時間, 預測區間]
relatedSlugs: [when-a-traffic-solver-invents-a-jam, when-solar-power-changes-fast]
---

分數要有用，先要知道它支持哪個問題。選指標前，可以先問：**這項比較必須支持哪個輸出？**

## 最終狀態，不等於到達時間

[〈當交通求解器製造出一場塞車〉](/zh/writing/when-a-traffic-solver-invents-a-jam/)中，一個數值解在最後時刻因激波剛好對齊網格邊界，得到很小的整體誤差。但較早時，已被抹平的前緣較遲才跨過固定感測器門檻。

兩個量度都有效：最終範數比較某一刻的網格平均值，事件指標則檢查感測軌跡何時跨過指定門檻，彼此不能代替。如果到達時間重要，就要交代對應檢查、門檻與插值規則。這是無量綱合成基準，不是真實道路延誤證據或求解器的普遍排名。

## 平均改善，困難群組仍可未過關

[〈當太陽能發電急升急跌：預測區間改善了，為甚麼仍不夠可靠？〉](/zh/writing/when-solar-power-changes-fast/)分開比較改善與絕對可靠性。Descriptor CQR 在每個確認站點都改善所比較的最弱群組端點，整體適當區間分數亦改善，但所有可部署候選方法仍未通過研究的全站絕對準則。

較闊區間可以改善覆蓋率，同時令其他情況付出效率代價。一起報告寬度、覆蓋率、適當分數與合資格群組的樣本支持，才能看清取捨；這並未建立研究沒有評估的調度決策效益。

兩例的模型與資料不同，不能合併分數。可共用的是評估習慣：先指定輸出、比較對象與合資格群體，再定準則，並保留改善旁邊的失敗。整體分數可以是答案的一部分，卻不應取代最初真正關心的量。
