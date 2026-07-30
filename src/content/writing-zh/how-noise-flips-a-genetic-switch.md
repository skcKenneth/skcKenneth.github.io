---
title: "噪聲如何翻轉一個基因開關"
slug: how-noise-flips-a-genetic-switch
sourceSlug: how-noise-flips-a-genetic-switch
summary: 確定性雙穩態建立兩個記憶狀態，但有限分子數決定隨機基因開關能在每個狀態停留多久。
date: 2026-07-30
lastUpdated: 2026-07-30
featured: true
topics: [隨機過程, 合成生物學, 雙穩態, Gillespie 模擬, 首達時間]
heroImage: /science/stochastic-genetic-toggle-switching/deterministic-bistability.svg
type: Research Notes
archived: false
readingMinutes: 20
scienceProject: stochastic-genetic-toggle-switching
redirectFrom: []
---

確定性基因開關可以有兩個穩定狀態。普通微分方程的軌跡一旦進入某個吸引域，除非外來擾動令它越過 separatrix，否則便會永遠留在該狀態。

細胞卻不是一個平滑濃度場。分子數有限，生產與降解事件逐次發生。一連串看似普通的單分子事件，偶爾可以把迴路推過確定性的吸引域邊界。

本研究把兩種描述放在一起：ODE 顯示雙穩態的幾何；精確事件 Gillespie 模擬則顯示分子系統大小如何控制自發切換、記憶壽命、穩態機率分佈與誘導脈衝成功率。

模型是合成抽象，以互相抑制的 toggle 架構為靈感，並未校準至任何指定生物或 plasmid。

## 確定性記憶

以 \(u\) 與 \(v\) 表示兩種互相抑制蛋白的濃度：

$$
\frac{du}{dt}
=\frac{\alpha_u}{1+v^{n_v}}-\delta_u u,
$$

$$
\frac{dv}{dt}
=\frac{\alpha_v}{1+u^{n_u}}-\delta_v v.
$$

對稱預設參數是

$$
\alpha_u=\alpha_v=3,\qquad
n_u=n_v=2,\qquad
\delta_u=\delta_v=1.
$$

每條 nullcline 表示一種蛋白的生產與降解剛好平衡。兩條曲線相交於三個平衡：

$$
(u,v)\approx(2.618,0.382),\quad(1,1),\quad(0.382,2.618).
$$

Jacobian 特徵值把兩個不對稱平衡分類為穩定，中央對稱平衡則是 saddle。

<figure class="article-figure">
  <img src="/science/stochastic-genetic-toggle-switching/deterministic-bistability.svg" alt="互相抑制基因 toggle 的 nullcline、三個平衡點與確定性軌跡。" width="960" height="580" loading="eager" decoding="async" />
  <figcaption><strong>圖 1。</strong> ODE 有 \(U\)-high 與 \(V\)-high 兩個穩定表達狀態，由 saddle 的穩定流形分隔；在確定性模型內，每個吸引域都是永久的。</figcaption>
</figure>

互相抑制形成有效正回饋：較多 \(U\) 壓低 \(V\)，較少 \(V\) 又解除對 \(U\) 的抑制。合作性的 Hill 指數令轉換足夠陡峭，產生兩個穩定不對稱狀態。

相圖解釋了記憶為何可能存在，卻沒有告訴我們它在隨機世界可以維持多久。

## 由濃度變成反應事件

加入系統大小 \(\Omega\)，分子數為

$$
U=\Omega u,\qquad V=\Omega v.
$$

隨機模型有四個反應通道：

$$
\varnothing\rightarrow U,\quad
U\rightarrow\varnothing,\quad
\varnothing\rightarrow V,\quad
V\rightarrow\varnothing.
$$

propensity 為

$$
a_1=\Omega\frac{\alpha_u}{1+(V/\Omega)^{n_v}},
\qquad a_2=\delta_u U,
$$

$$
a_3=\Omega\frac{\alpha_v}{1+(U/\Omega)^{n_u}},
\qquad a_4=\delta_v V.
$$

每個 Gillespie 步驟中，總 propensity 決定指數分佈等待時間，各通道的相對 propensity 決定下一個事件。分子數保持為非負整數。

增大 \(\Omega\) 會增加分子數，同時保留濃度尺度上的平均漂移；相對波動約按 \(\Omega^{-1/2}\) 下降。因此 ODE 是大系統近似，但任何有限 \(\Omega\) 都仍有罕見跨域可能。

定義表達次序參數

$$
m(t)=\frac{U(t)-V(t)}{U(t)+V(t)}.
$$

接近 \(+1\) 代表 \(U\)-high，接近 \(-1\) 代表 \(V\)-high。

<figure class="article-figure">
  <img src="/science/stochastic-genetic-toggle-switching/stochastic-trajectories.svg" alt="系統大小 3、6、8 與 14 下的代表性隨機基因開關軌跡。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong> 小系統頻繁跨越兩種表達狀態；大系統會在一個確定性吸引子附近停留更久，即使 ODE 相圖完全沒有改變。</figcaption>
</figure>

分類器要求軌跡越過離 separatrix 有一段距離的門檻，避免在 \(m=0\) 附近快速來回被誤算成多次獨立切換。

## 記憶是一個首達時間問題

每條軌跡由 \(U\)-high 平衡附近開始，記錄首次到達 \(V\)-high 區域的時間。首達時間分佈同時包含是否在觀察窗內切換，以及切換需要多久。

預設實驗對

$$
\Omega\in\{3,5,8,12,18\}
$$

各生成 20 條獨立軌跡，觀察 240 個無因次時間單位。

<figure class="article-figure">
  <img src="/science/stochastic-genetic-toggle-switching/switching-time.svg" alt="五個分子系統大小下的平均首達時間，以及觀察窗內至少切換一次的機率。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 3。</strong> 平均首達時間隨 \(\Omega\) 增加。當 \(\Omega=3\)，全部軌跡切換且平均時間為 \(11.99\)；當 \(\Omega=18\)，平均為 \(99.64\)，有 85% 在觀察窗內切換。</figcaption>
</figure>

| \(\Omega\) | 平均首達時間 | 240 時間內切換 |
|---:|---:|---:|
| 3 | 11.99 | 1.00 |
| 5 | 16.77 | 1.00 |
| 8 | 25.30 | 1.00 |
| 12 | 44.41 | 1.00 |
| 18 | 99.64 | 0.85 |

最後一行含 right censoring：20 條軌跡中有三條到時間 240 仍未切換。因此，只計已發生事件的平均值不是完整壽命估計。後續研究應使用 survival curve、信賴區間、更長觀察窗或 rare-event 方法。

可靠結論是趨勢，而非某條精確 scaling law：分子系統變大會延長記憶，雖然確定性平衡完全相同。

## 隨機穩態是一個分佈

ODE 平衡是一個點；隨機穩態則是分子數上的機率分佈。

研究在 \(\Omega=8\) 使用十二條長軌跡，移除 burn-in，再對樣本作 thinning。

<figure class="article-figure">
  <img src="/science/stochastic-genetic-toggle-switching/stationary-distribution.svg" alt="具有兩個峰的隨機基因開關穩態分佈，峰值接近兩個確定性穩定平衡。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 4。</strong> 機率集中於兩個穩定 ODE 狀態附近；中央 saddle 會組織轉換路徑，卻不會成為第三個持久 phenotype。</figcaption>
</figure>

這個分別可避免一個常見概念錯置。隨機模型的「穩態」不是軌跡停止，而是可能狀態的分佈不再隨時間改變；個別路徑仍會波動，偶爾亦會切換。

兩峰之間的低谷包含轉換狀態，其機率深度與切換稀有程度有關，但目前有限樣本不足以識別 quasipotential 或 Kramers rate。

## 用有限脈衝控制切換

控制實驗由 \(V\)-high 狀態開始，暫時在 \(U\) 的生產加入誘導 \(A\)：

$$
a_1^{\mathrm{pulse}}
=\Omega\left[
\frac{\alpha_u}{1+(V/\Omega)^{n_v}}+A
\right].
$$

在 \(\Omega=12\) 下，脈衝強度與持續時間形成 \(5\times5\) 網格，每格八次隨機重複。脈衝結束後讓系統鬆弛，再分類最終狀態。

<figure class="article-figure">
  <img src="/science/stochastic-genetic-toggle-switching/pulse-control.svg" alt="基因 toggle 切換成功率隨誘導脈衝強度與持續時間變化的熱圖。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 5。</strong> 強度與持續時間共同決定成功率。最佳觀察格為 \(0.75\)，但每格八次重複不足以推斷平滑最佳邊界。</figcaption>
</figure>

脈衝必須把隨機狀態推入另一吸引域足夠深的位置，才不會立即被普通波動拉回。強度不足時，延長時間作用有限；時間太短時，再強的瞬時誘導也未必完成狀態重組。

有限分子數控制應寫成機率問題：

$$
\Pr(\text{評估時處於目標狀態}\mid A,d,\Omega).
$$

實際設計還需加入能量、毒性、時間不確定性與目標可靠度，並以 binomial interval 或 sequential simulation 量化成功表面的不確定性。

## 已核證內容

整條 pipeline 包括網格初值求根、Jacobian 穩定性分類、確定性 ODE 積分、精確事件模擬、首達時間、穩態抽樣與脈衝控制 Monte Carlo。

三項自動測試通過，檢查平衡點數目及穩定性、分子數保持非負整數，以及固定 seed 路徑可重現。輸出 manifest 有 24 個 checksum 驗證檔案。

本文數值——三個平衡、兩個穩定、最小 \(\Omega\) 的切換機率 \(1.0\)、最大 \(\Omega\) 的平均首達時間 \(99.6431\)——均來自已核證預設運行。

這證明內部一致性，不等於生物驗證。Hill propensity 是 phenomenological，沒有顯式描述 promoter binding、transcription 與 translation。

## 抽象模型省略了甚麼

模型假設調控即時發生、兩種蛋白降解率相同，亦沒有顯式 mRNA。它省略：

- promoter-state switching 與 transcriptional bursting；
- transcription、translation 與 repression 之間的延遲；
- 細胞生長、分裂、稀釋與分子分配；
- 同時影響兩個基因的 extrinsic noise；
- 不對稱生產與降解；
- 資源競爭與生長回饋；
- 迴路突變與演化穩定性。

每項省略都可能改變切換統計。細胞分裂會週期性減半並隨機分配分子；轉錄爆發產生非 Poisson 噪聲；延遲則可能引入振盪或改變吸引域。

## 超越 brute-force Monte Carlo

下一研究可分三個尺度：

1. 計算兩吸引子之間的 quasipotential 或 minimum-action path；
2. 在大 \(\Omega\) 使用 importance sampling 或 weighted ensemble 估計罕見切換；
3. 在直接模擬仍可行的範圍，驗證預測的壽命 scaling。

控制方面可用 adaptive design 取代粗網格，在切換機率最不確定或接近目標可靠度的位置選取下一個 amplitude–duration 組合。再加入 promoter switching 與細胞分裂，檢查同一脈衝能否跨 cell-cycle phase 保持穩健。

核心結論是：**雙穩態建立記憶架構，有限分子數噪聲決定記憶壽命**。確定性與隨機模型回答不同問題；只用其中一個，便會失去幾何或可靠性。

## 參考文獻

1. Gardner, T. S., Cantor, C. R., & Collins, J. J. (2000). Construction of a genetic toggle switch in *Escherichia coli*. *Nature, 403*, 339–342. [https://doi.org/10.1038/35002131](https://doi.org/10.1038/35002131)
2. Gillespie, D. T. (1977). Exact stochastic simulation of coupled chemical reactions. *The Journal of Physical Chemistry, 81*, 2340–2361. [https://doi.org/10.1021/j100540a008](https://doi.org/10.1021/j100540a008)
3. Segel, L. A., & Edelstein-Keshet, L. (2013). *A Primer on Mathematical Models in Biology*. SIAM.
4. McAdams, H. H., & Arkin, A. (1997). Stochastic mechanisms in gene expression. *Proceedings of the National Academy of Sciences, 94*, 814–819. [https://doi.org/10.1073/pnas.94.3.814](https://doi.org/10.1073/pnas.94.3.814)
