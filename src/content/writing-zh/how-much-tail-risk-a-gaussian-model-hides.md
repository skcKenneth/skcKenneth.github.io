---
title: "高斯模型隱藏了多少尾部風險？"
slug: how-much-tail-risk-a-gaussian-model-hides
sourceSlug: how-much-tail-risk-a-gaussian-model-hides
summary: 在波動聚集、槓桿效應、厚尾與跳躍下，以受控壓力測試比較高斯、Student-t、歷史及極值風險預測。
date: 2026-08-02
lastUpdated: 2026-08-02
featured: true
topics: [尾部風險, 風險值, 預期損失, GARCH, 極值理論]
heroImage: /science/heavy-tailed-financial-risk/returns-and-volatility.svg
type: 研究筆記
archived: false
readingMinutes: 17
scienceProject: heavy-tailed-financial-risk
redirectFrom: []
---

一個高斯風險模型可以寫得完全正確，卻仍然危險地平靜。問題不只是市場偶爾出現大幅回報；損失序列可能同時具有波動聚集、壞消息的非對稱反應、厚尾創新與罕見跳躍。把這些特徵壓縮成一個標準差，可能會為錯誤的尾部給出非常精確的數字。

本研究建立受控壓力環境，比較高斯 EWMA、高斯 GARCH、Student-$t$ GARCH、過濾歷史模擬與超閾值極值方法。整個實驗為合成數據，只檢驗模型行為，不代表任何投資組合、證券或投資策略。

## 壓力環境

回報由帶槓桿效應的波動過程生成：

$$
r_t=\sigma_tz_t+J_t,
$$

$$
\sigma_t^2
=\omega+\alpha r_{t-1}^2
+\gamma r_{t-1}^2\mathbf 1(r_{t-1}<0)
+\beta\sigma_{t-1}^2.
$$

$z_t$ 具有 Student-$t$ 厚尾，$J_t$ 加入罕見負跳躍。預設重現包含 7,600 個觀測，其中 3,200 個用於估計，3,600 個作樣本外評估。

<figure class="article-figure">
  <img src="/science/heavy-tailed-financial-risk/returns-and-volatility.svg" alt="顯示波動聚集、非對稱衝擊與負跳躍的合成回報和潛在波動。" width="960" height="420" loading="eager" decoding="async" />
  <figcaption><strong>圖 1。</strong>風險隨時間改變；單一無條件鐘形分布無法表達實驗中的聚集尺度與槓桿效應。</figcaption>
</figure>

在計算任何預測分數之前，尾部診斷先直接檢驗高斯假設。

<figure class="article-figure">
  <img src="/science/heavy-tailed-financial-risk/tail-diagnostics.svg" alt="厚尾回報的直方圖、分位數圖、平均超額與尾指數診斷。" width="960" height="430" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong>分位數偏離與尾部診斷說明，方差不足以描述極端損失。</figcaption>
</figure>

## VaR 畫界線，ES 觀察界線之外

在信心水平 $p$ 下，風險值是損失分位數：

$$
\Pr(L_t>\mathrm{VaR}_{p,t}\mid\mathcal F_{t-1})=1-p,
$$

預期損失則平均超越閾值的損失：

$$
\mathrm{ES}_{p,t}
=\mathbb E[L_t\mid L_t>\mathrm{VaR}_{p,t},\mathcal F_{t-1}].
$$

VaR 問界線應被跨越多少次，ES 問跨越後平均有多嚴重。

<figure class="article-figure">
  <img src="/science/heavy-tailed-financial-risk/var-forecasts.svg" alt="樣本外損失與多個模型的動態 99% VaR 預測。" width="960" height="430" loading="lazy" decoding="async" />
  <figcaption><strong>圖 3。</strong>平靜期的預測相近，衝擊後則明顯分岔；尾部假設在風險數字最重要時影響最大。</figcaption>
</figure>

## 覆蓋率必要，但並不足夠

名義 99% VaR 的例外率應接近 1%。在本次設定中，過濾歷史模擬最接近，為 $0.00972$。然而，同一例外數量可以是互相獨立，也可以集中在波動衝擊之後。

因此審核分開檢查無條件覆蓋、例外獨立性及聯合條件覆蓋。

<figure class="article-figure">
  <img src="/science/heavy-tailed-financial-risk/backtest-dashboard.svg" alt="不同模型的 VaR 例外率、覆蓋率、獨立性及條件覆蓋回測。" width="960" height="430" loading="lazy" decoding="async" />
  <figcaption><strong>圖 4。</strong>通過例外數量檢查，不代表預測動態正確；例外聚集是另一種失敗。</figcaption>
</figure>

只測一個信心水平亦可能獎勵幸運閾值。校準曲線同時檢查 95%、97.5%、99% 與 99.5%。

<figure class="article-figure">
  <img src="/science/heavy-tailed-financial-risk/calibration-curves.svg" alt="多個信心水平下觀測與名義 VaR 例外率比較。" width="960" height="400" loading="lazy" decoding="async" />
  <figcaption><strong>圖 5。</strong>若模型只在 99% 正確，鄰近水平卻持續偏離，它仍未學懂整條尾部。</figcaption>
</figure>

## 高斯假設可以遮蔽多少風險？

受控曲面同時改變 Student-$t$ 自由度與跳躍機率。自由度愈大愈接近高斯；自由度小則尾部更厚。

<figure class="article-figure">
  <img src="/science/heavy-tailed-financial-risk/tail-model-risk-surface.svg" alt="不同尾厚度與跳躍機率下，高斯 VaR 和預期損失低估曲面。" width="960" height="430" loading="lazy" decoding="async" />
  <figcaption><strong>圖 6。</strong>尾部分布錯置與跳躍互相增強；高斯誤差不是固定修正比例。</figcaption>
</figure>

Student-$t$ GARCH 的擬合自由度為 $\nu\approx4.2685$，與高斯極限相距甚遠，表示尾部形狀不是小數點後的修飾，而是實質結構。

## 風險估計亦有抽樣不確定性

風險數字本身也是估計量。移動區塊 bootstrap 在重抽樣時保留短期依賴，從而建立 VaR 與 ES 區間。

<figure class="article-figure">
  <img src="/science/heavy-tailed-financial-risk/bootstrap-uncertainty.svg" alt="VaR 與預期損失的移動區塊 bootstrap 分布及區間。" width="960" height="400" loading="lazy" decoding="async" />
  <figcaption><strong>圖 7。</strong>ES 通常較不精確，因為它依賴更少、更極端的觀測；只報點估計會遮蔽這種脆弱性。</figcaption>
</figure>

因此模型既要校準，也要有足夠銳度。風險—銳度前沿展示兩者權衡；圖中把模型名稱移到獨立圖例，避免點標註互相重疊。

<figure class="article-figure">
  <img src="/science/heavy-tailed-financial-risk/risk-sharpness-frontier.svg" alt="候選尾部模型的風險校準與預測銳度前沿。" width="960" height="410" loading="lazy" decoding="async" />
  <figcaption><strong>圖 8。</strong>沒有單一分數可以概括一切；保守但噪音大的預測，與精確但錯置的預測，是兩種不同失敗。</figcaption>
</figure>

## 必須同時檢查動態與尾部

最後，條件尺度與標準化殘差可顯示模型是否因正確原因適應數據。

<figure class="article-figure">
  <img src="/science/heavy-tailed-financial-risk/fitted-dynamics.svg" alt="高斯與 Student-t 模型的條件波動擬合及標準化殘差診斷。" width="960" height="430" loading="lazy" decoding="async" />
  <figcaption><strong>圖 9。</strong>動態尺度模型可以移除波動聚集，卻仍留下厚尾殘差；波動擬合與創新分布擬合是兩項檢查。</figcaption>
</figure>

## 驗證範圍

鎖定環境通過三項自動測試。完整重現重新生成並校驗 37 個聲明輸出，包括九組圖像；快速設定亦可由空白目錄成功執行。長標題、分圖字母、圖例、前沿標籤及窄螢幕顯示均經重疊檢查，所有圖中文字為黑色。

在這個聲明實驗中：過濾歷史模擬最接近 1% 例外率；Student-$t$ 擬合自由度約為 $4.27$；高斯低估隨尾厚度與跳躍頻率共同惡化；覆蓋、獨立性、ES 嚴重度與不確定性會給出不同排名。

這些是受控數據生成過程的性質，不估計任何真實資產風險，也不是投資建議。

## 下一個研究問題

自然延伸是制度轉變下的分布穩健性：不選定單一創新分布，而是建立一組經校準的合理尾部，針對最壞成員設計資本或決策規則。另一方向是多變量依賴；壓力期的相關性往往增強，因此邊際 VaR 校準良好亦可能漏掉聯合損失。

持久的教訓是：尾部風險並非一個數字，而是一條由動態、分布、閾值、超額嚴重度與不確定性組成的假設鏈；每一環都可以被檢驗。

## 參考文獻

1. Engle, R. F. (1982). Autoregressive conditional heteroscedasticity with estimates of the variance of United Kingdom inflation. *Econometrica, 50*(4), 987–1007. [https://doi.org/10.2307/1912773](https://doi.org/10.2307/1912773)
2. Bollerslev, T. (1986). Generalized autoregressive conditional heteroskedasticity. *Journal of Econometrics, 31*(3), 307–327. [https://doi.org/10.1016/0304-4076(86)90063-1](https://doi.org/10.1016/0304-4076(86)90063-1)
3. Glosten, L. R., Jagannathan, R., & Runkle, D. E. (1993). On the relation between the expected value and the volatility of the nominal excess return on stocks. *The Journal of Finance, 48*(5), 1779–1801. [https://doi.org/10.1111/j.1540-6261.1993.tb05128.x](https://doi.org/10.1111/j.1540-6261.1993.tb05128.x)
4. Merton, R. C. (1976). Option pricing when underlying stock returns are discontinuous. *Journal of Financial Economics, 3*(1–2), 125–144. [https://doi.org/10.1016/0304-405X(76)90022-2](https://doi.org/10.1016/0304-405X(76)90022-2)
5. McNeil, A. J., & Frey, R. (2000). Estimation of tail-related risk measures for heteroscedastic financial time series. *Journal of Empirical Finance, 7*(3–4), 271–300. [https://doi.org/10.1016/S0927-5398(00)00012-8](https://doi.org/10.1016/S0927-5398(00)00012-8)
6. Christoffersen, P. F. (1998). Evaluating interval forecasts. *International Economic Review, 39*(4), 841–862. [https://doi.org/10.2307/2527341](https://doi.org/10.2307/2527341)
