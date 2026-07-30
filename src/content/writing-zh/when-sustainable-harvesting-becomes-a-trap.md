---
title: "當永續採收變成陷阱"
slug: when-sustainable-harvesting-becomes-a-trap
sourceSlug: when-sustainable-harvesting-becomes-a-trap
summary: 具有強 Allee 效應的隨機模型說明：平均永續產量如何掩蓋崩潰門檻，以及帶保護線的回饋政策如何改變有限期風險—產量前沿。
date: 2026-07-24
lastUpdated: 2026-07-30
featured: true
topics: [族群動力學, Allee 效應, 隨機模擬, 採收政策, 風險, 回饋控制]
heroImage: /science/adaptive-harvesting-risk/risk-yield-frontier.svg
type: Research Notes
archived: false
readingMinutes: 20
scienceProject: adaptive-harvesting-risk
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
  <img src="/science/adaptive-harvesting-risk/collapse-mechanism.svg" alt="固定配額、比例採收與門檻自適應採收的族群軌跡，並標出 Allee 門檻與保護線。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 1。</strong> 代表性軌跡顯示三套回饋結構的分別。固定抽取一旦把族群推過強 Allee 門檻，模型本身的動力會加速下降；保護線規則則較早停止抽取。</figcaption>
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
  <img src="/science/adaptive-harvesting-risk/risk-yield-frontier.svg" alt="固定配額、比例採收與門檻自適應採收的估計有限期崩潰機率與平均實現產量。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong> 每個政策強度 150 次模擬所得的風險與實現產量。門檻自適應規則在本網格佔較有利位置；另外兩套規則只需小幅增加強度便跨過崩潰邊界。零次觀察滅絕不等於真實風險為零。</figcaption>
</figure>

決策問題更適合寫成

$$
\max_\theta\ \mathbb E[Y(\theta)]
\quad\text{subject to}\quad
\Pr(\tau_{\mathrm{ext}}\le N)\le\alpha,
$$

其中 \(\theta\) 包括政策類型及其控制強度，\(N\) 是規劃期，\(\alpha\) 是可接受風險。最大平均產量與穩健永續並不是同一個目標。

## 把模擬讀成一項決策研究

這個參數網格不只是在比較三條曲線，而是在依次回答幾個問題。第一，未採收模型在 Allee 門檻上下是否呈現預期動力？第二，每套控制器是否真的執行其聲稱的「狀態到行動」規則？第三，政策比較是否使用相同的環境擾動？本研究以 common random numbers 讓政策面對同一批 150 條環境序列，減少無關的 Monte Carlo 差異。

通過機制檢查後，34 列風險—產量摘要才有決策意義。每列雖然聚合 150 條軌跡，原始崩潰次數、實現產量與代表性時間序列仍分開保留，因為相同平均採收可以來自完全不同的歷史。

| 政策 | 控制值 | 崩潰次數 | 估計風險 | 平均實現產量 |
|---|---:|---:|---:|---:|
| 固定配額 | 7.00 | 1 / 150 | 0.0067 | 6.984 |
| 固定配額 | 8.00 | 28 / 150 | 0.1867 | 7.233 |
| 固定配額 | 9.00 | 150 / 150 | 1.0000 | 1.894 |
| 比例採收 | 0.14 | 3 / 150 | 0.0200 | 8.864 |
| 比例採收 | 0.16 | 150 / 150 | 1.0000 | 1.630 |
| 門檻自適應 | 0.80 | 0 / 150 | 觀察值 0 | 10.274 |

最後一列只表示有限樣本內沒有觀察到崩潰，不表示未知的真實機率等於零。

## 零次事件仍有不確定性

若 \(X\sim\mathrm{Binomial}(n,p)\)，\(\hat p=X/n\) 只是估計的一部分。當 \(X=0\) 時，95% 上界的簡單近似是

$$
p_{\mathrm{upper}}\approx\frac{3}{n}.
$$

取 \(n=150\)，上界約為 \(0.02\)；Wilson 區間亦給出約 \(0.025\) 的相近上界。因此 0/150 仍可與一個細小但非零的有限期風險相容。如果決策容許值是 \(\alpha=0.01\)，這個樣本量不足以作出認證。

比例控制由 \(0.14\) 的 3/150 躍升至 \(0.16\) 的 150/150，差異顯然不只是抽樣噪聲；但轉折位置仍受網格間距限制。加入 \(0.145\)、\(0.150\)、\(0.155\) 等點，才可分辨它是很窄的過渡帶，還是包含不同延遲崩潰時間的混合。

<figure class="article-figure">
  <img src="/science/adaptive-harvesting-risk/extinction-risk.svg" alt="固定配額、比例採收與門檻自適應政策在標準化控制強度下的有限期崩潰機率。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 3。</strong> 標準化控制強度方便比較，卻不代表三套政策的實際行動相同。風險急變區應加密參數網格，並為每個點報告區間估計。</figcaption>
</figure>

額外模擬應優先放在決策邊界，而不是已經每次崩潰的設定。序列式模擬亦可在某控制明顯不安全時提早停止，把運算資源轉到信賴區間仍跨越風險容許值的點。

## 為何回饋會改寫前沿

自適應規則改變的不是生物參數，而是抽取時機：

$$
\frac{\partial H_t}{\partial P_t}
=
\begin{cases}
0, & P_t\le P_s,\\
h, & P_t>P_s.
\end{cases}
$$

在保護線以下，採收不再增加向下的作用力；在保護線以上，抽取只隨剩餘量上升。\(P_s=60\) 與 \(L=20\) 之間形成緩衝，讓季節與隨機損失未必立即把系統推入自然增長為負的區域。

固定配額則相反：絕對移除量不變，但族群下降時 \(H/P_t\) 反而上升。比例採收會自動減少絕對抽取，卻沒有任何具有生物意義的停止線。

<figure class="article-figure">
  <img src="/science/adaptive-harvesting-risk/policy-comparison.svg" alt="固定配額、比例採收與門檻自適應政策的合成表現比較。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 4。</strong> 要求採收量與最終實現產量並不相同。過度進取的政策在崩潰後失去未來產量；保護線在本參數設定內同時保留族群與後續抽取。</figcaption>
</figure>

合理結論不是「門檻政策永遠勝出」，而是：在存在強 Allee 門檻、族群可被及時正確觀察的條件下，保護線可避免採收放大低密度動力。這並未證明目前的保護線最優，也未計入執法成本。

## 從完美狀態變數到可用政策

現實政策看到的是估計而非 \(P_t\)。若有對數尺度觀察誤差與一個時間步延遲，

$$
\widehat P_t=P_t\exp(\eta_t),\qquad
H_t=h\max(\widehat P_{t-1}-P_s,0),
$$

安全距離便要同時吸收保護線與 Allee 門檻的距離、向上估計偏差，以及延遲期間的下跌。即使名義保護線很高，調查偏差或頻率太低仍可在錯誤時間觸發採收。

所以至少有三個設計變數：生物保護線、監測與觀察模型、保護線以上的控制強度。只最佳化第三項並不完整。後續可從不確定集合抽取 \((r,L,\sigma)\)，加入延遲與觀察噪聲，在產量限制下最小化最壞情境或上尾崩潰風險；若把族群當作隱藏狀態，亦可依保守的 posterior quantile 而不是單一點估計作決策。

## 甚麼才算更強證據？

這項研究回答的是機制問題。若要接近實際管理分析，至少要：

- 由具名族群估計增長率、門檻與環境項，並保留參數不確定性；
- 在不同 Allee 形式、年齡結構與空間保護區下重做比較；
- 加入調查噪聲、缺測、行動延遲與不完全執行；
- 在一組環境上選政策，再以獨立衝擊評估凍結後的政策；
- 報告不同規劃期的風險；
- 明確列出監測成本、產量變異、崩潰損失與恢復時間。

這些改動可能推翻目前排序。因此本文把結果定位為已驗證的合成研究，而不是對真實漁業的建議。

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
