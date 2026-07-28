---
title: 經得起單位改變的方程發現
slug: dimensional-equation-discovery
sourceSlug: dimensional-equation-discovery
summary: 一個受控 symbolic-regression 基準，研究量綱約束能否改善精確方程恢復、縮小搜尋空間及防止單位脆弱公式。
date: 2026-07-21
lastUpdated: 2026-07-28
featured: true
topics: [符號迴歸, 量綱分析, 科學機器學習]
heroImage: /science/dimensional-equation-discovery/equation_recovery_phase.svg
draft: false
type: 研究筆記
archived: false
readingMinutes: 20
scienceProject: dimensional-equation-discovery
redirectFrom: []
---

一條方程可以擬合所有訓練點，卻在物理上不連貫。把米改成厘米後，它的預測以無法由輸出單位轉換修補的方式改變。量綱分析提供強先驗：物理方程中的項必須量綱相容。

研究問：

> 當量測稀少且含噪聲，量綱不變量能把緊湊控制方程的恢復改善多少？

本文不發現新物理定律，而是用已知定律作受控目標，令精確恢復與失敗都可觀察。

## 透明 monomial 搜尋

候選方程為

$$
\hat y=c\prod_{j=1}^p x_j^{\alpha_j},
$$

指數由有限 grammar 選出。每個候選在 log space 擬合係數，再於留出樣本量度預測誤差。

Raw 方法搜尋所有指數組合；dimensional 方法只保留滿足

$$
[y]=\prod_j[x_j]^{\alpha_j}
$$

的候選，基本量綱為質量、長度與時間。

基準包括阻力尺度、單擺週期、擴散長度與完全無量綱相關式。最後一項是 negative control：若所有變數都無量綱，量綱篩選沒有任何東西可刪。

<figure class="article-figure">
  <img src="/science/dimensional-equation-discovery/equation_recovery_phase.svg" alt="不同樣本量與噪聲下 raw 及量綱約束搜尋的精確方程恢復。" loading="lazy" />
  <figcaption><strong>圖 1。</strong> 恢復相圖。量綱能移除看似合理的錯誤公式時才有幫助；對無量綱 control 不會憑空增加資訊。</figcaption>
</figure>

## 搜尋空間崩縮

阻力 raw search 評估 4,096 個指數組合，量綱篩選後只餘兩個；單擺及擴散由 512 個縮至一個；無量綱 control 兩種方法都維持 512。

<figure class="article-figure">
  <img src="/science/dimensional-equation-discovery/equation_complexity_units.svg" alt="量綱方程發現的候選數縮減與單位轉移穩健度。" loading="lazy" />
  <figcaption><strong>圖 2。</strong> 複雜度與單位壓力。量綱篩選既減少計算，也防止公式只在一套單位慣例有效。</figcaption>
</figure>

每個條件 24 次重複中，約束方法在所有聚合基準精確恢復指數向量。Raw 方法在擴散與無量綱 control 同樣完美，但阻力約 $0.966$、單擺約 $0.953$。

Raw 方法有時以錯誤指數取得稍低的同單位 RMSE。這警告我們不能把預測誤差當作唯一發現準則：噪聲可令無效公式在某一單位表示中略勝。

## 對抗性單位轉換

擬合後，輸入改用另一組單位而不重新 fit。正確量綱公式應協變。代表性錯誤 raw winner 在阻力與單擺的相對單位轉移誤差均約 $4.606$；約束 exact winner 約為 $0.138$ 與 $0.153$，主要來自觀察噪聲與係數估計。

測試之所以是對抗性，是因為只改變表示而沒有改變物理案例。它直接問學習關係是否尊重本應精確的對稱。

<figure class="article-figure">
  <img src="/science/dimensional-equation-discovery/equation_genealogy.svg" alt="候選 monomial 經擬合、量綱篩選與單位轉移後的方程族譜。" loading="lazy" />
  <figcaption><strong>圖 3。</strong> 方程族譜。驗證是一連串篩選：擬合、量綱相容、bootstrap 穩定及單位協變，而非單一 leaderboard。</figcaption>
</figure>

## Negative control 為何重要

在無量綱相關式，兩種方法都搜尋 512 個候選，以相同誤差恢復同一關係。這防止「加入 physics 永遠有幫助」的空泛結論。約束只有在能移除資料本身難以區分的 hypotheses 時才有作用。

量綱也不能區分所有物理上不同的定律；多個 monomial 可共享相同量綱，阻力案例留下兩個候選就是例子。無量綱群仍可能需要漸近知識、守恆、對稱或能改變正確組合的實驗。

## 聲稱界線

可支持結論是：

> 在已聲明有限 monomial grammar 中，量綱篩選把候選數最多減少三個數量級，改善含噪阻力與單擺的精確恢復，並防止嚴重單位轉移失敗；對無量綱 negative control 則沒有優勢。

這不自動推廣到無限制 symbolic regression、微分方程、隱藏變數或真正未知物理。本文 grammar 已包含目標定律；發現 grammar 以外關係需要更豐富表示及更強 complexity control。

## 參考文獻

1. E. Buckingham, “On physically similar systems,” *Physical Review*, 1914. [doi:10.1103/PhysRev.4.345](https://doi.org/10.1103/PhysRev.4.345).
2. S.-M. Udrescu and M. Tegmark, “AI Feynman,” *Science Advances*, 2020. [doi:10.1126/sciadv.aay2631](https://doi.org/10.1126/sciadv.aay2631).
3. M. Schmidt and H. Lipson, “Distilling free-form natural laws from experimental data,” *Science*, 2009. [doi:10.1126/science.1165893](https://doi.org/10.1126/science.1165893).
4. G. I. Barenblatt, *Scaling*, Cambridge University Press, 2003. [doi:10.1017/CBO9780511814921](https://doi.org/10.1017/CBO9780511814921).

