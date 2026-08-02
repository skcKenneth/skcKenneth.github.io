---
title: "美式認沽期權應在何時行使？"
slug: when-an-american-put-should-be-exercised
sourceSlug: when-an-american-put-should-be-exercised
summary: 將提早行使寫成自由邊界障礙問題，並以三種數值方法審核價格、希臘字母、收斂與互補條件。
date: 2026-08-02
lastUpdated: 2026-08-02
featured: true
topics: [美式期權, 最佳停止, 變分不等式, 數值分析, 量化金融]
heroImage: /science/american-option-free-boundary/free-boundary-surface.png
type: 研究筆記
archived: false
readingMinutes: 16
scienceProject: american-option-free-boundary
redirectFrom: []
---

歐式認沽只有一個決定日期；美式認沽在每一刻都要決定：現在行使，還是保留稍後行使的權利？這項自由改變了數學問題。未知量不再只有價格 $V(S,t)$，還包括分隔行使區與延續區的移動門檻。

本研究把這條邊界視為證據的一部分：求解障礙偏微分方程、檢查互補條件、觀察接觸位置附近的 Greeks，再與重組二項樹及最小二乘蒙地卡羅比較。整個實驗是受控合成設定，目的是理解數值方法，不是交易建議。

## 由最佳停止到自由邊界

在風險中性幾何布朗模型下，

$$
dS_t=(r-q)S_t\,dt+\sigma S_t\,dW_t,
$$

履約價 $K$、到期日 $T$ 的美式認沽價值為

$$
V(S,t)=\sup_{\tau\in[t,T]}
\mathbb E^{\mathbb Q}
\left[e^{-\int_t^\tau r(u)\,du}(K-S_\tau)^+
\mid S_t=S\right].
$$

以 $\theta=T-t$ 表示剩餘時間，則

$$
\min\left(V-(K-S)^+,\;V_\theta-\mathcal LV\right)=0,
$$

其中

$$
\mathcal LV=
\frac12\sigma^2S^2V_{SS}+(r-q)SV_S-rV.
$$

價格必須高於即時收益，延續算子亦不能違反不等式，而且兩者至少一項緊束。因此邊界 $S_f(t)$ 是由解發現，而不是事先指定。

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/free-boundary-surface.png" alt="美式認沽價值、提早行使溢價及移動最佳停止邊界。" width="960" height="470" loading="eager" decoding="async" />
  <figcaption><strong>圖 1。</strong>價值與提早行使溢價共享移動接觸邊界；設定個案在估值日的邊界為 $S_f(0)\approx71.7972$。</figcaption>
</figure>

當 $S_0=K=100$、$T=1$、$r=0.05$、$q=0.02$、$\sigma=0.25$，障礙求解器給出 $V_A(100,0)\approx8.56494$。這是聲明實驗數字，不是某張市場合約的校準價格。

## 為甚麼只驗價格並不足夠

在行使區內 $V=K-S$，所以 delta 約為 $-1$，gamma 約為零。跨過邊界後，延續價值平滑離開收益，而曲率集中在接觸附近。

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/value-and-greeks.svg" alt="跨越行使邊界的美式與歐式認沽價值、即時收益、delta 與 gamma。" width="960" height="380" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong>價值看似穩定時，邊界附近的 gamma 仍可能敏感；導數需要獨立驗證。</figcaption>
</figure>

到期收益在履約價有折點。直接以 Crank–Nicolson 起步會把它傳成曲率振盪。先做兩個後向 Euler 半步再切換的 Rannacher 處理可以抑制這個假象。

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/rannacher-smoothing.svg" alt="首個時間步的原始 Crank-Nicolson 與 Rannacher 平滑價值和 gamma。" width="960" height="390" loading="lazy" decoding="async" />
  <figcaption><strong>圖 3。</strong>起步平滑移除單看價格容易漏掉的非物理 gamma 振盪。</figcaption>
</figure>

## 求解並審核障礙

在履約價附近加密的網格上，每個時間步都是線性互補問題：

$$
AV^{n+1}\ge b,\qquad V^{n+1}\ge\Phi,\qquad
(AV^{n+1}-b)^\top(V^{n+1}-\Phi)=0.
$$

投影逐次超鬆弛把 Gauss–Seidel 更新投影回 $\Phi=(K-S)^+$，並記錄反覆次數與同時涵蓋原始可行、對偶可行及互補性的殘差。

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/solver-diagnostics.svg" alt="PSOR 反覆次數與互補殘差隨剩餘時間變化。" width="960" height="390" loading="lazy" decoding="async" />
  <figcaption><strong>圖 4。</strong>在此網格與容差下，最大互補殘差為 $1.20\times10^{-8}$，最大 PSOR 次數為 60。</figcaption>
</figure>

小代數殘差仍不足夠。網格細化把每個有限差分結果與更細參考比較，並把誤差與運算時間並列。

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/convergence-and-cost.svg" alt="美式認沽價格誤差隨價格網格細化與運算時間的變化。" width="960" height="400" loading="lazy" decoding="async" />
  <figcaption><strong>圖 5。</strong>收益折點與移動接觸集合會令收斂不完全單調，但最細設定顯著降低價格誤差。</figcaption>
</figure>

## 三條獨立數值路線

障礙 PDE、Cox–Ross–Rubinstein 二項樹及最小二乘蒙地卡羅回答同一經濟問題，但誤差來源不同：樹離散行使日期、蒙地卡羅加入抽樣與回歸誤差、PDE 截斷空間及時間。

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/method-comparison.svg" alt="障礙 PDE、二項樹與最小二乘蒙地卡羅的價格及誤差成本比較。" width="960" height="400" loading="lazy" decoding="async" />
  <figcaption><strong>圖 6。</strong>獨立方法一致，比單一求解器自洽更有說服力；縮短的軸標籤亦避免方法名稱重疊。</figcaption>
</figure>

## 參數同時改變價格與政策

波動通常透過凸性提高期權價值，較高利率則可能令較早收取履約價更有吸引力；價格與邊界不必在整個參數空間同向移動。

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/parameter-sensitivity.svg" alt="不同利率與波動率下的美式認沽價格及估值日行使邊界。" width="960" height="420" loading="lazy" decoding="async" />
  <figcaption><strong>圖 7。</strong>停止規則是一個政策面，不是標量價格的附帶產物。</figcaption>
</figure>

求解器亦容許確定性的 $r(\theta)$、$q(\theta)$ 與 $\sigma(\theta)$，每一步使用中點係數。

<figure class="article-figure">
  <img src="/science/american-option-free-boundary/term-structure-extension.svg" alt="固定與隨時間變動利率、股息及波動下的行使邊界。" width="960" height="400" loading="lazy" decoding="async" />
  <figcaption><strong>圖 8。</strong>今日輸入相近的模型，若未來係數曲線不同，仍可給出不同停止路徑。</figcaption>
</figure>

## 驗證範圍

鎖定環境通過三項自動測試。完整重現重新生成並校驗 34 個聲明輸出，包括八組圖像；快速設定亦可由空白輸出目錄成功執行。圖中標題、分圖標記、圖例及方法名稱均經重疊檢查，所有文字為黑色。

這證明聲明數值實驗可重現，並不證明幾何布朗運動適合某個市場。隨機波動、跳躍、隨機利率、離散股息、交易成本、流動性與校準不確定性均未納入。

下一個有價值的延伸，是把參數不確定性傳播成停止邊界分布，而不是只報一條銳利政策。核心教訓是：**美式期權應同時被審核為價格、停止政策與互補問題。**

## 參考文獻

1. Brennan, M. J., & Schwartz, E. S. (1977). The valuation of American put options. *The Journal of Finance, 32*(2), 449–462. [https://doi.org/10.1111/j.1540-6261.1977.tb03284.x](https://doi.org/10.1111/j.1540-6261.1977.tb03284.x)
2. Rannacher, R. (1984). Finite element solution of diffusion problems with irregular data. *Numerische Mathematik, 43*, 309–327. [https://doi.org/10.1007/BF01390130](https://doi.org/10.1007/BF01390130)
3. Longstaff, F. A., & Schwartz, E. S. (2001). Valuing American options by simulation: A simple least-squares approach. *The Review of Financial Studies, 14*(1), 113–147. [https://doi.org/10.1093/rfs/14.1.113](https://doi.org/10.1093/rfs/14.1.113)
4. Merton, R. C. (1976). Option pricing when underlying stock returns are discontinuous. *Journal of Financial Economics, 3*(1–2), 125–144. [https://doi.org/10.1016/0304-405X(76)90022-2](https://doi.org/10.1016/0304-405X(76)90022-2)
