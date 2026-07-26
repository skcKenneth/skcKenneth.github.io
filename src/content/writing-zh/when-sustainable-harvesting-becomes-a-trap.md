---
title: "當永續採收變成陷阱"
slug: when-sustainable-harvesting-becomes-a-trap
sourceSlug: when-sustainable-harvesting-becomes-a-trap
summary: 具有強 Allee 效應的隨機模型說明：平均永續產量如何掩蓋崩潰門檻，以及帶保護線的回饋政策如何改變有限期風險—產量前沿。
date: 2026-07-24
lastUpdated: 2026-07-26
featured: true
topics: [族群動力學, Allee 效應, 隨機模擬, 採收政策, 風險, 回饋控制]
heroImage: /images/writing/july-biology/harvest-risk-frontier.svg
type: Research Notes
archived: false
redirectFrom: []
---

一套在「平均年份」看似永續的採收規則，仍然可能十分危險。

問題不只是環境條件會波動。如果族群具有強 Allee 效應——低於臨界數量時，人均增長率變成負值——一次短暫下跌便可能跨過無法預期自行恢復的邊界。只依平均承載量設計的政策，可能因季節性、隨機衝擊和僵化抽取互相作用而失效。

本合成研究比較固定配額、比例採收，以及帶保護線的門檻自適應規則。它提出一個風險導向問題：哪套政策能提供有用產量，同時把有限期崩潰的估計機率控制在可接受水平？

這不是任何物種的資源評估，亦沒有用實際漁業資料校準。模型刻意保持精簡，讓作用機制和限制都清楚可見。

## 一個具有兩種密度門檻的族群

設 \(P_t\) 為第 \(t\) 期採收後的族群數量，更新式為

$$
P_{t+1}
=
\max\left\{
0,\;
P_t+
rP_t\left(1-\frac{P_t}{K_t}\right)
\left(\frac{P_t}{L}-1\right)
-H_t
\right\}.
$$

Logistic 因子 \(1-P_t/K_t\) 限制接近承載量時的增長；Allee 因子 \(P_t/L-1\) 在臨界值 \(L\) 以下為負。因此，模型在低數量區有兩種不同狀態：高於 \(L\) 時，下降後仍可能恢復；低於 \(L\) 時，確定性增長會繼續把族群推向更低水平。

環境承載量按下式變化：

$$
K_t=K_0\left[
1+A\sin\left(\frac{2\pi t}{T}\right)+\sigma\varepsilon_t
\right],
\qquad \varepsilon_t\sim N(0,1),
$$

並設數值下限以保持 \(K_t>0\)。正弦項產生可預期季節，Gaussian 項則改變每個季節實際有多惡劣。

預設實驗採用

$$
P_0=70,\quad r=0.2,\quad K_0=100,\quad
A=0.25,\quad T=12,\quad \sigma=0.06,\quad L=20.
$$

每個政策強度以 150 條隨機軌跡評估 200 個時間步。不同政策共用相同環境隨機數，使比較不會被不同衝擊序列混淆。

## 三套政策代表三種回應

固定配額每期要求相同絕對數量：

$$
H_t=H.
$$

目標容易預測，但族群下降時，人均負擔會上升。

比例採收要求當前數量的一個比例：

$$
H_t=hP_t.
$$

族群較小時，絕對採收會自動下降，但沒有任何數量被明確保護。

門檻自適應規則只抽取高於保護線 \(P_s\) 的部分：

$$
H_t=h\max(P_t-P_s,0),
$$

預設實驗設 \(P_s=60\)。當族群到達或低於保護線時，採收停止。

<figure class="article-figure">
  <img src="/images/writing/july-biology/harvest-feedback.svg" alt="比較固定配額、比例採收與門檻自適應採收在族群下降至 Allee 門檻時反應的三欄示意圖。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 1。</strong> 三套政策的回饋結構不同：固定配額維持相同絕對抽取，比例規則隨族群下降而減少採收，保護線規則則在受保護水平前停止抽取。此圖為機制示意。</figcaption>
</figure>

這個分法很重要，因為政策不只是一個參數，而是把觀察狀態映射成行動的規則。保護線只有在數量觀察準確、行動沒有過度延遲時，才真正能緩衝 Allee 門檻。

## 風險懸崖

實驗記錄兩項輸出：

$$
\widehat p_{\mathrm{ext}}
=
\frac{\text{到達 }P_t<1\text{ 的模擬次數}}
{\text{模擬總數}},
$$

以及每個時間步的平均實現採收量 \(\overline Y\)。兩者必須分開報告。若族群早期崩潰，很高的要求配額也可能產生很低的長期實現產量。

固定配額網格出現明顯跳變：\(H=7\) 時 150 次中只有一次滅絕；\(H=8\) 時有 28 次；\(H=9\) 時 150 次全部滅絕。配額由 7 增至 8，平均產量由 \(6.98\) 升至 \(7.23\)；但配額 9 的平均產量跌至 \(1.89\)，因為崩潰後再沒有未來採收。

比例政策亦跨過尖銳邊界：\(h=0.14\) 時 150 次中有三次滅絕，平均產量 \(8.86\)；\(h=0.16\) 時每次都滅絕，平均產量只剩 \(1.63\)。

在測試的門檻自適應網格內，沒有軌跡滅絕；當 \(h=0.8\) 時，平均產量達 \(10.27\)。這是所提供有限期網格中最強的一點，不是政策對所有參數與所有時間都安全的證明。

<figure class="article-figure">
  <img src="/images/writing/july-biology/harvest-risk-frontier.svg" alt="顯示固定配額與比例採收的滅絕風險懸崖，以及三套政策有限期風險—產量位置的雙欄圖。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong> 每個政策強度 150 次模擬所得的風險與實現產量。門檻自適應規則在本網格佔較有利位置；另外兩套規則只需小幅增加強度便跨過崩潰邊界。零次觀察滅絕不等於真實風險為零。</figcaption>
</figure>

決策問題更適合寫成

$$
\max_\theta\ \mathbb E[Y(\theta)]
\quad\text{subject to}\quad
\Pr(\tau_{\mathrm{ext}}\le N)\le\alpha,
$$

其中 \(\theta\) 包括政策類型及其控制強度，\(N\) 是規劃期，\(\alpha\) 是可接受風險。最大平均產量與穩健永續並不是同一個目標。

## 保護線不是免費保證

自適應規則使用沒有延遲的真實 \(P_t\)，但管理者實際觀察的可能是帶誤差代理：

$$
\widehat P_t=P_t e^{\eta_t}.
$$

正誤差可能在真實族群已過低時仍觸發採收；延遲調查亦可造成相同問題。保護線政策對資訊要求很高，其表面穩健性可能依賴監測質素。

實驗亦假設環境衝擊互相獨立，沒有年齡或空間結構，只使用一種強 Allee 方程。它省略人口學隨機性、價格變化、執行誤差和參數不確定性。最重要的是，200 步風險估計並非無限期持續性的定理。150 條有限軌跡沒有觀察到崩潰，長期滅絕機率仍可能大於零。

## 驗證與下一個研究問題

完整設定產生 34 行風險—產量摘要、代表軌跡、四組圖與動畫。六項單元測試、輸出驗證和 SHA-256 清單檢查均通過。這些證據支持程式及所報告的合成摘要。

更強的研究可把族群數量視為隱藏狀態，在濾波不確定性下比較政策；亦可加入自相關環境、延遲控制、其他 Allee 機制，以及對 \(r\)、\(L\) 和 \(\sigma\) 不確定性的穩健最佳化。政策排名應在多個時間尺度上作樣本外評估，而不只依賴一個固定參數網格。

## 結語

環境變化不只是圍繞永續平均值的雜訊。在 Allee 門檻附近，它可以揭露恢復與崩潰之間的非線性邊界。

核心建模教訓是：應在軌跡分佈上評估回饋規則，而不只看平均平衡點。政策要按明確容許風險下能產生的產量，以及維持安全機制所需的資訊來判斷。

## 參考文獻

1. Ricker, W. E. (1954). Stock and recruitment. *Journal of the Fisheries Research Board of Canada, 11*(5), 559–623. [https://doi.org/10.1139/f54-039](https://doi.org/10.1139/f54-039)
2. May, R. M. (1976). Simple mathematical models with very complicated dynamics. *Nature, 261*, 459–467. [https://doi.org/10.1038/261459a0](https://doi.org/10.1038/261459a0)
3. Stephens, P. A., Sutherland, W. J., & Freckleton, R. P. (1999). What is the Allee effect? *Oikos, 87*(1), 185–190. [https://doi.org/10.2307/3547011](https://doi.org/10.2307/3547011)
4. Lande, R. (1993). Risks of population extinction from demographic and environmental stochasticity and random catastrophes. *The American Naturalist, 142*(6), 911–927. [https://doi.org/10.1086/285580](https://doi.org/10.1086/285580)
5. Reed, W. J. (1979). Optimal escapement levels in stochastic and deterministic harvesting models. *Journal of Environmental Economics and Management, 6*(4), 350–363. [https://doi.org/10.1016/0095-0696(79)90014-7](https://doi.org/10.1016/0095-0696(79)90014-7)
6. Hilker, F. M., & Liz, E. (2020). Threshold harvesting as a conservation or exploitation strategy in population management. *Theoretical Ecology, 13*, 519–536. [https://doi.org/10.1007/s12080-020-00465-8](https://doi.org/10.1007/s12080-020-00465-8)
