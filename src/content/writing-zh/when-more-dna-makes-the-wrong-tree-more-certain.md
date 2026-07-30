---
title: "當更多 DNA 令錯誤的演化樹更確定"
slug: when-more-dna-makes-the-wrong-tree-more-certain
sourceSlug: when-more-dna-makes-the-wrong-tree-more-certain
summary: 四物種合成實驗把抽樣誤差與模型誤差分開，顯示一條很長的序列比對仍可對錯誤演化樹產生百分之百 bootstrap 支持度。
date: 2026-07-22
lastUpdated: 2026-07-30
featured: true
topics: [系統發育學, 模型錯置, 鄰接法, bootstrap 支持度, 組成趨同]
heroImage: /science/phylogenetic-model-misspecification/heterogeneous-recovery.svg
type: Research Notes
archived: false
readingMinutes: 20
scienceProject: phylogenetic-model-misspecification
redirectFrom: []
---

更多資料通常會降低不確定性，卻不會自動降低模型誤差。

這個分別在系統發育研究尤其重要，因為序列分析從來不會在沒有假設的情況下把核苷酸直接變成演化樹。距離公式決定觀察到的差異如何代表演化變化；重建演算法再決定哪個拓撲最配合這些距離。如果距離模型不能表示真正產生序列的過程，較長的序列比對可能只是更精確地估計一組錯誤的母體距離。

本專案構造一個四物種實驗，令這種失敗清楚可見。真實的無根分割為

$$
AB\mid CD.
$$

物種 \(A\) 與 \(C\) 並非姊妹群，但異質情境使它們在長分支上的核苷酸組成朝相近目標趨同。研究比較 p-distance、JC69、K80 與正則化 log-det 距離，檢查序列長度增加時能否恢復真實分割。

## 資料生成過程

序列演化以連續時間馬可夫鏈模擬。對長度為 \(t\)、速率矩陣為 \(Q\) 的分支，轉移矩陣為

$$
P(t)=e^{Qt}.
$$

同質情境在所有分支使用同一替換過程；異質情境則改變分支特定的平衡組成，使非姊妹群 \(A\) 與 \(C\) 出現組成趨同。

這個設計把兩種誤差分開：

1. **抽樣誤差**：即使模型相同，兩條有限序列比對亦會不同；
2. **模型誤差**：估計器假設的替換過程並不包括真正的生成機制。

同一條模擬比對會交給四種距離估計器，因此方法間差異並非來自不同的隨機序列。

## 四種把位點轉成距離的方法

未校正 p-distance 就是觀察到的不匹配比例。JC69 在鹼基頻率和替換率相等的假設下校正多重替換：

$$
\widehat d_{\mathrm{JC}}
=-\frac34\log\left(1-\frac43p\right).
$$

K80 把轉換比例 \(P\) 與顛換比例 \(Q\) 分開：

$$
\widehat d_{\mathrm{K80}}
=-\frac12\log(1-2P-Q)-\frac14\log(1-2Q).
$$

兩者仍假設組成同質。正則化 log-det 距離則使用 \(4\times4\) 聯合頻率矩陣 \(F_{xy}\) 的行列式：

$$
\widehat d_{\log\det}
=-\frac14\log
\left[
\frac{\det(F_{xy})}
{\sqrt{\prod_i f_{i\cdot}\prod_j f_{\cdot j}}}
\right].
$$

Log-det 原本就是為較廣泛的非平穩馬可夫過程而提出；當有限樣本令聯合表接近奇異時，仍需加入正則化。這種一般性不代表它永遠最佳：短序列的行列式可以很嘈雜，其他類型的異質性亦可能令它失效。

專案直接實作鄰接法。對 \(n\) 個活躍物種或群集，

$$
Q_{ij}=(n-2)d_{ij}-\sum_k d_{ik}-\sum_k d_{jk},
$$

每一步合併令 \(Q_{ij}\) 最小的一對。對四物種而言，恢復問題可簡化為選出正確的非平凡分割。

## 較長比對收斂到不同答案

主要實驗在六個序列長度下各模擬 120 條獨立比對，長度由 100 至 5,000 個位點。同質情境中，四種方法都會隨資料增加而改善；在 5,000 個位點時，所有方法在 120 次模擬中都恢復真實分割。

異質情境卻令三種方法出現相反趨勢。

<figure class="article-figure">
  <img src="/science/phylogenetic-model-misspecification/heterogeneous-recovery.svg" alt="在組成趨同情境下，比較 p-distance、JC69、K80 與正則化 log-det 的拓撲恢復率隨序列長度變化的折線圖。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 1。</strong> 設計異質過程下的恢復機率。在 5,000 個位點時，log-det 在 120/120 次模擬恢復真實分割；p-distance、JC69 和 K80 則為 0/120。這是合成 Monte Carlo 結果，不是實證基準。</figcaption>
</figure>

在 100 個位點時，真實拓撲的恢復機率分別為：p-distance \(0.158\)、JC69 \(0.292\)、K80 \(0.267\)、log-det \(0.600\)。序列變長後，抽樣雜訊確實下降；但三種同質距離只是更穩定地集中到錯誤分割 \(AC\mid BD\)。到 5,000 個位點時，每次模擬都選擇錯誤分割。Log-det 則朝相反方向移動，並在每次模擬選中真實分割。

因此，結果不只是「簡單方法表現較差」。錯誤答案會變得更可重複，因為估計器收斂到受組成趨同扭曲的距離。

## 百分之百 bootstrap 支持亦可能是錯的

Bootstrap 會重抽序列比對的欄位、重建演化樹，再計算每個分割重現的頻率。它衡量的是整條分析流程在位點重抽下是否穩定。

示範比對有 5,000 個位點，隨機種子為 1729。JC69 與 K80 推斷 \(AC\mid BD\)；log-det 則推斷真實的 \(AB\mid CD\)。每種方法再進行 250 次 bootstrap。

<figure class="article-figure">
  <img src="/science/phylogenetic-model-misspecification/bootstrap-support.svg" alt="JC69、K80 與正則化 log-det 對真實及錯誤四物種分割的 bootstrap 支持度。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong> 同一條 5,000 位點比對對不同歷史產生 100% bootstrap 支持。重抽樣衡量的是在距離模型條件下的可重複性，並不是替換模型適足性的直接檢驗。</figcaption>
</figure>

JC69 與 K80 對錯誤分割的支持度都是 \(1.000\)，log-det 對真實分割的支持度亦是 \(1.000\)。這並不矛盾：三種分析都高度內部穩定，只是在如何把序列模式映射成演化距離上彼此不同。

所以，高支持度不能取代模型檢查。模型選擇問的是候選者之中誰最好；模型適足性問的則是，即使是獲選模型，能否重現資料的重要特徵。

## 抽樣誤差與模型誤差會指向不同方向

設 \(D^\star\) 為真實生成過程下的期望距離矩陣，\(\widehat D_L\) 為長度 \(L\) 比對所估計的矩陣。大數定律只保證

$$
\widehat D_L\longrightarrow D^\star
\qquad (L\to\infty).
$$

只有當距離轉換與演化過程相容，而且極限矩陣在真實樹上具有可加性時，這個收斂才令人放心。模型錯置下，估計可以非常精確地收斂到一個在 four-point relation 上偏向錯誤分割的矩陣。

因此要分開：

- **抽樣誤差：** 有限比對令 \(\widehat D_L\) 在合適極限附近波動；
- **模型誤差：** 分析模型不能表示生成機制，所以極限本身已有錯誤幾何。

更多 DNA 會處理第一項，卻可能放大第二項，因為它移除了偶然讓真實分割勝出的隨機波動。

同質對照令差異清楚可見：在 5,000 位點，四種距離都達到 120/120 正確；異質情境下，p-distance、JC69 與 K80 走向 0/120，正則化 log-det 則走向 120/120。Neighbor Joining 程式完全相同，改變的是生成器與距離假設的關係。

<figure class="article-figure">
  <img src="/science/phylogenetic-model-misspecification/recovery-heatmap.svg" alt="同質與異質生成情境、不同距離估計器及序列長度下的演化樹恢復率。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 3。</strong> 同質對照把程式錯誤與刻意模型錯置分開。一個方法可在某模型族內一致，離開該族後卻穩定地誤導。</figcaption>
</figure>

## 為何組成趨同會扭曲距離

真實分割為 \(AB\mid CD\)。異質生成器令非姊妹物種 \(A\) 與 \(C\) 的末端組成分別走向富 GC 平衡；兩者相似的一部分來自平行方向改變，而不是較近期共同祖先。

JC69 假設相同平衡鹼基頻率與交換傾向。K80 區分 transition 與 transversion，但仍具有平穩、組成對稱結構。假設被破壞時，修正公式無法分辨共同 GC 來自共同祖先還是組成趨同。

Log-det 以聯合頻率矩陣 \(F_{ij}\) 的行列式建立距離，概念上為

$$
d_{\mathrm{LD}}(i,j)
=-\frac14\log\det(F_{ij})
+\text{組成修正}.
$$

它可在較廣義 Markov 過程下容納譜系特異組成，但本實作要對很小或不穩定的行列式作正則化，這本身又是一項模型選擇。因此結論只能是「在測試區域較穩健」，而不是「沒有假設」。

嚴重度網格亦顯示界線：很多組成差異與長枝組合下，log-det 在 JC69 失敗後仍保留真實分割；但在 GC 目標 \(0.45\)、長末端枝 \(0.6\) 的極端測試點，其恢復率跌至 \(0.35\)。

<figure class="article-figure">
  <img src="/science/phylogenetic-model-misspecification/logdet-phase-map.svg" alt="不同組成差異與長末端枝設定下，JC69 與正則化 log-det 的恢復率比較。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 4。</strong> phase map 避免把方法作普遍排名：它同時指出組成感知距離有幫助的區域，以及較穩健方法仍會退化的極端區域。</figcaption>
</figure>

## Bootstrap 支持度究竟以甚麼為條件

位點 bootstrap 從原比對有放回抽取欄位，每次重建演化樹，再計算分割重現比例。若原比對很長，每次重抽樣都會繼承近乎相同的組成模式，所以一個穩定但錯置的訊號可以幾乎每次重現。

選定的 5,000 位點比對在 250 次重抽樣中得到：

| 距離 | 主要分割 | Bootstrap 支持度 |
|---|---|---:|
| JC69 | \(AC\mid BD\) | 1.000 |
| K80 | \(AC\mid BD\) | 1.000 |
| 正則化 log-det | \(AB\mid CD\) | 1.000 |

三個 1.000 表示各自流程在自身轉換下很穩定，不表示三段歷史同樣可信。Bootstrap 不是某分割為真的 posterior probability，亦不會自動比較互不相容模型的適足性。

## 更有用的適足性工作流程

解讀支持度之前，可以先問模型能否重現與拓撲相關的資料特徵：

1. 按物種與 partition 檢查組成；
2. 在已擬合模型下模擬，對照組成、site pattern、飽和與距離殘差；
3. 在多個合理模型族重做推斷；
4. 用 prefix、site stripping、移除物種與分區分析定位訊號；
5. 把互相矛盾而各自高支持的拓撲當作需要解釋的結果。

本專案的 prefix diagnostic 顯示：比對增長時，JC69 偏向 \(AC\mid BD\) 的 margin 變得更穩定，而不是隨機游走，與收斂到有偏極限一致。

## 實驗規模與可重現性

主實驗包括兩個情境、六個序列長度、每格 120 條比對，共 1,440 條比對與 5,760 次重建。嚴重度研究再加入 1,000 條比對與 \(5\times5\) 網格中的 2,000 次重建；示例另有 750 次 bootstrap 重建。

六個單元測試檢查轉移矩陣、相同序列的零距離、可加四物種樹的精確 Neighbor Joining、分割抽取、固定種子重現，以及有限對稱距離矩陣。另有 19 項必要輸出與 44 個 manifest 項目通過。這些檢查令計算可審核，卻不會把設計四物種例子變成任何具名類群的證據。

## 由示範走向實證

實證延伸不是把 FASTA 換掉便完成。物種抽樣、比對不確定性、重組、gene-tree discordance、partition 選擇與位點相依都可能改變問題。較嚴謹做法是預先定義所關注的模型違反，使用與實證組成和枝長區域相配的 simulation-based calibration，再檢查觀察到的方法分歧能否被重現。

核心教訓是：不確定性量度永遠以產生該量的模型為條件。當假設決定極限答案時，收集更多觀測並增加重抽樣，只可能帶來沒有準確度的精密度。

## 已驗證的部分與仍未解決的問題

完整運算產生 1,440 條主要實驗比對和 5,760 次樹重建，另有 1,000 條嚴重度網格比對及 750 次 bootstrap 重建。輸出驗證、19 項必要產物檢查、44 項清單雜湊檢查與六項單元測試均通過。

測試涵蓋轉移矩陣的隨機性質、相同序列距離為零、加性四物種資料的精確恢復、固定種子的可重現性，以及距離矩陣的有限、對稱與零對角性。這些證據建立的是合成實驗的計算可重現性。

它們不表示 log-det 永遠最好，也不表示 JC69 或 K80 普遍無用，更不表示四物種能代表實際系統發育基因組學。模型沒有包括插入刪除、比對不確定性、重組、不完全譜系排序、基因樹衝突與位點間速率變化。

下一步可在擬合候選模型後，以鹼基組成離散度和位點模式計數進行參數式適足性檢查；亦應在較大演化樹上把距離法與最大似然及貝葉斯方法比較。最有解釋力的延伸是解析推導無限序列下的聯合頻率矩陣，指出四點不等式究竟在哪裡改變符號。

## 結語

較長序列會更精確地回答分析流程所提出的問題，卻不保證流程提出的是正確的演化問題。

這個教訓超越系統發育學：抽樣不確定性可以在一個有偏極限附近收縮。因此，可信度必須與定義估計器的假設，以及這些假設能否表示資料生成過程的證據一同報告。

## 參考文獻

1. Jukes, T. H., & Cantor, C. R. (1969). Evolution of protein molecules. In *Mammalian Protein Metabolism* (Vol. 3, pp. 21–132). [https://doi.org/10.1016/B978-1-4832-3211-9.50009-7](https://doi.org/10.1016/B978-1-4832-3211-9.50009-7)
2. Kimura, M. (1980). A simple method for estimating evolutionary rates of base substitutions through comparative studies of nucleotide sequences. *Journal of Molecular Evolution, 16*, 111–120. [https://doi.org/10.1007/BF01731581](https://doi.org/10.1007/BF01731581)
3. Saitou, N., & Nei, M. (1987). The Neighbor-Joining method: A new method for reconstructing phylogenetic trees. *Molecular Biology and Evolution, 4*, 406–425. [https://doi.org/10.1093/oxfordjournals.molbev.a040454](https://doi.org/10.1093/oxfordjournals.molbev.a040454)
4. Lake, J. A. (1994). Reconstructing evolutionary trees from DNA and protein sequences: Paralinear distances. *Proceedings of the National Academy of Sciences, 91*, 1455–1459. [https://doi.org/10.1073/pnas.91.4.1455](https://doi.org/10.1073/pnas.91.4.1455)
5. Felsenstein, J. (1978). Cases in which parsimony or compatibility methods will be positively misleading. *Systematic Zoology, 27*, 401–410. [https://doi.org/10.1093/sysbio/27.4.401](https://doi.org/10.1093/sysbio/27.4.401)
6. Doerr, D., Gronau, I., Moran, S., & Yavneh, I. (2012). Stochastic errors versus modeling errors in distance-based phylogenetic reconstructions. *Algorithms for Molecular Biology, 7*, 22. [https://doi.org/10.1186/1748-7188-7-22](https://doi.org/10.1186/1748-7188-7-22)
7. Ripplinger, J., & Sullivan, J. (2010). Assessment of substitution model adequacy using frequentist and Bayesian methods. *Molecular Biology and Evolution, 27*, 2790–2803. [https://doi.org/10.1093/molbev/msq168](https://doi.org/10.1093/molbev/msq168)
