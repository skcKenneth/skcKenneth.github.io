---
title: 當數值方法創造出負物質
slug: positive-conservative-time-stepping
sourceSlug: positive-conservative-time-stepping
summary: 一個剛性轉移網絡基準，比較標準顯式積分器與保持非負性及總質量的線性隱式更新。
date: 2026-07-25
lastUpdated: 2026-07-28
featured: true
topics: [數值分析, 正值, 守恆]
heroImage: /science/positive-conservative-time-stepping/positive_integrator_trajectories.svg
draft: false
type: 研究筆記
archived: false
readingMinutes: 20
scienceProject: positive-conservative-time-stepping
redirectFrom: []
---

負人口、負濃度、負艙室質量常被歸咎於模型。有時微分方程本身完全容許物理解，反而是時間積分器製造不可能狀態。

本研究問：

> 在剛性與粗觀察間隔下，標準顯式格式何時會產生不可能的負狀態？一個保持正值與質量的更新又要付出多少準確度及計算成本？

基準只使用線性守恆轉移網絡。範圍窄是刻意選擇：矩陣指數提供精確參考，正值與守恆可清楚分析，失敗可歸因於數值方法，而非含糊應用模型。

## 守恆轉移網絡

設 $y_i(t)\ge0$ 是第 $i$ 個艙室的物質。轉移由生成矩陣 $Q$ 編碼：

$$
\frac{dy}{dt}=Qy.
$$

$Q$ 的非對角元素非負，所以一個艙室不會向另一個提供負流入；各列總和為零，因此

$$
\frac{d}{dt}\mathbf1^\top y=\mathbf1^\top Qy=0.
$$

精確解 $y(t)=e^{tQ}y(0)$ 保持非負及總質量。數值方法理想上也應保留這些結構。

Forward Euler 為

$$
y_{n+1}=(I+\Delta tQ)y_n.
$$

由於列總和仍互相抵消，公式在精確算術下守恆；但正值要求 $I+\Delta tQ$ 每個元素非負，令步長受最快流出率限制。對剛性網絡，安全步長可遠小於報告間隔。

經典 RK4 對平滑非剛性問題局部精度較高，但並非無條件保持正值。若 $\Delta tQ$ 超出穩定區，對矩陣指數的高階多項式近似仍可出現負元素或爆炸。

比較方法是線性隱式 Patankar 型更新：

$$
y_{n+1}=(I-\Delta tQ)^{-1}y_n.
$$

對守恆 Metzler 生成矩陣，逆矩陣具有所需非負結構並保持質量和。它類似 backward Euler：只有一階，但有很強的可行性。

<figure class="article-figure">
  <img src="/science/positive-conservative-time-stepping/positive_integrator_trajectories.svg" alt="剛性守恆網絡上精確、Euler、RK4 及正值隱式方法的軌跡。" loading="lazy" />
  <figcaption><strong>圖 1。</strong> 同一微分方程，不同數值現實。顯式軌跡可穿過零或發散；精確解與正值隱式解仍保持可行。</figcaption>
</figure>

## 基準網格

研究在 429 個案例改變速率尺度、剛性比與步長。每個方法由相同非負初值開始，並與矩陣指數比較。每次運行記錄：

- 是否有狀態變成負數；
- 最大總質量誤差；
- 相對軌跡誤差；
- 計算工作量；
- 計算是否保持有限。

這個設計避免由一個精心選擇圖例承擔全部聲稱；主要結果是一張失敗率曲面。

<figure class="article-figure">
  <img src="/science/positive-conservative-time-stepping/positive_integrator_feasibility.svg" alt="三種積分器在不同剛性與步長下的負狀態頻率圖。" loading="lazy" />
  <figcaption><strong>圖 2。</strong> 可行性圖譜。Euler 在 38.46% 測試案例出現負值，RK4 為 25.17%，正值隱式更新為零。</figcaption>
</figure>

429 個案例中，Euler 有 $38.46\%$ 至少出現一次負值，RK4 為 $25.17\%$，正值隱式方法沒有任何負值。

顯式方法一旦不穩定，質量誤差可變得極大：Euler 最大約 $1.0\times10^{27}$，RK4 約 $3.7\times10^{75}$。代數公式在精確算術下仍保留列和；但軌跡增長成巨大正負數後，浮點消去與 overflow 會摧毀實際計算的守恆。正值隱式方法最大質量漂移約 $8.7\times10^{-14}$。

因此，「公式代數上守恆」不等於「測試區域的計算軌跡守恆」。

## 正值不等於準確

正值方法避免不可能狀態，但只有一階。大步長可過度平滑快速暫態；一條保持正值與質量的軌跡仍可有顯著誤差。

研究加入 step doubling：一個完整步與兩個半步比較，以差異估計局部誤差並調整 $\Delta t$。Tolerance 由 $2\times10^{-2}$ 收緊到 $5\times10^{-4}$ 時，接受步數由 15 增至 75，相對誤差由約 $0.0312$ 降至 $0.00626$；所有適應性運行均非負，質量誤差接近機器精度。

<figure class="article-figure">
  <img src="/science/positive-conservative-time-stepping/positive_integrator_error_cost.svg" alt="固定與適應性正值時間步進的誤差成本比較。" loading="lazy" />
  <figcaption><strong>圖 3。</strong> 可行性有成本。收緊 tolerance 會降低誤差並增加線性求解；不命名目標便不能稱任何方法為最佳。</figcaption>
</figure>

取捨因而清楚：

- Euler 每步便宜，但正值與穩定步長限制嚴格；
- RK4 在穩定區準確，但需要四次導數評估，而且不保證正值；
- 隱式更新需要線性求解且只有一階，但在測試生成矩陣族保持可行；
- step doubling 改善誤差控制，代價是多次求解。

## 為何 clipping 不是同一個解法

常見修補是每步把負值截成零。Clipping 恢復肉眼可見的不等式，卻通常改變總質量並隱藏數值失敗大小。若 clipping 後再正規化，雖恢復總和，卻把誤差重新分配到所有艙室，形成另一個沒有聲明的方法。

結構保持積分的差別是更新本身尊重不變量，剩餘誤差主要可解讀為時間離散誤差，而不是積分、截斷及重新正規化的混合。

若 clipping 是明確定義的觀察或投影模型，可以有合理用途；不應靜靜用它令不穩定積分器看似物理。

## 剛性在做甚麼

剛性表示網絡含相差很遠的時間尺度。快速轉移可在慢循環明顯改變前已接近平衡。即使只關心慢尺度輸出，顯式方法仍不能忽略快速穩定限制。

基準中，速率比增加會縮小 Euler 安全步長。RK4 穩定區較大但非無限。隱式更新可阻尼快速模態，不要求步長解析它們的穩定尺度；但如果快速暫態形狀本身有科學意義，仍然需要足夠細步長。

因此方法選擇必須跟隨問題。若只關心長時間艙室總量，阻尼快速暫態可能可接受；若暫態峰會觸發決策，一階隱式平滑即使保持正值也可能不合適。

## 驗證策略

矩陣指數為線性基準提供獨立參考。測試亦檢查：

- $Q$ 各列總和為零；
- 非對角速率非負；
- 固定步比較使用相同時間網格；
- 質量與最小狀態由未四捨五入軌跡計算；
- 在已報告範圍，收緊適應性 tolerance 令參考誤差下降。

本基準刻意不把結果寫成非線性化學動力學定理。非線性 production–destruction 系統需要更細緻 Patankar 權重，階數條件也更複雜。

## 聲稱界線

可支持的聲明是：

> 在已聲明剛性線性守恆轉移網絡族，粗步長 Euler 與 RK4 經常產生負值或不穩定軌跡；線性隱式更新在 429 個案例全部保持非負與質量，step doubling 則以增加求解成本換取較低參考誤差。

這不表示它勝過所有高階正值保持、指數、分裂或非線性求解器，也不表示所有負狀態都是數值問題——部分控制方程本身就不保持正值。

## 實用選擇清單

1. **寫出不變量。** 連續系統保留哪些總和、界線或符號？
2. **檢查方法是有條件還是無條件保留它們。**
3. **估計最快時間尺度，** 不只看輸出間隔。
4. **在代表性小問題使用獨立參考。**
5. **普通誤差以外，同時報告最小狀態與不變量漂移。**
6. **不要靜默修補。** 投影或 clipping 若屬演算法，必須命名及測試。
7. **令誤差配合決策。** 長時間質量與暫態峰值是不同目標。

## 參考文獻

1. E. Hairer, C. Lubich, and G. Wanner, *Geometric Numerical Integration*, 2nd ed., Springer, 2006. [doi:10.1007/3-540-30666-8](https://doi.org/10.1007/3-540-30666-8).
2. S. Kopecz and A. Meister, “On order conditions for modified Patankar–Runge–Kutta schemes,” *Applied Numerical Mathematics*, 2018. [doi:10.1016/j.apnum.2018.01.004](https://doi.org/10.1016/j.apnum.2018.01.004).
3. R. J. LeVeque, *Finite Difference Methods for Ordinary and Partial Differential Equations*, SIAM, 2007. [doi:10.1137/1.9780898717839](https://doi.org/10.1137/1.9780898717839).

