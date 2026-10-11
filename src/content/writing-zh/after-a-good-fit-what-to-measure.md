---
title: "擬合得好之後，下一個量度甚麼？"
slug: after-a-good-fit-what-to-measure
sourceSlug: after-a-good-fit-what-to-measure
summary: 當多組參數都能擬合觀測，下一步未必是換一個最佳化器，而是找出能分辨解釋的新量度。
date: 2026-10-11
lastUpdated: 2026-10-11
draft: false
featured: false
archived: false
type: 教學筆記
topicIds: [data-ai, mathematical-thinking, teaching-research-practice]
topics: [可識別性, 實驗設計, 研究實踐]
relatedSlugs: [when-the-fit-is-not-the-model]
---

擬合得好是有用的結果。不過，多組差異很大的參數也可能畫出幾乎相同的觀測曲線。這時值得問：**下一個甚麼量度，能分辨已經擬合得好的解釋？**

## 找出解釋分歧的地方

[〈當擬合不等於模型本身〉](/zh/writing/when-the-fit-is-not-the-model/)用一個簡單飽和模型說明：觀測若只落在近似線性區，主要約束的可能是參數比值，而非每個參數。最佳化器仍可給出看似精確的一組數字，卻沒有交代還有多少相近解釋。

在同一狹窄範圍增加量度，可能改善精度，但保留原有歧義；把範圍延伸至彎曲或飽和區，則可能加入不同資訊。應尋找可行、而且候選解釋開始分歧的位置。

## 分清診斷支持甚麼

這是實際實驗資訊不足的「實務可識別性」問題，與理想觀測也無法分辨參數的「結構不可識別性」不同。原文的有限網格與確定性偽雜訊只示範前者；近似最優格點不是置信區域，也不是結構證明。

收集更多資料前，先寫清楚：關心哪個參數或預測、哪些解釋仍符合觀測，以及哪個可行量度能分辨它們。有時誠實的目標是可識別的參數組合，而非逐一估計全部參數。

[配套英文互動實驗](/teaching/research-inquiry-studio/#identifiability)可改變觀測範圍、雜訊及量度數目，幫助構思設計；完整不確定性分析仍須檢查模型、觀測程序與統計假設。
