---
title: "當更多 DNA 令錯誤的演化樹更確定"
slug: when-more-dna-makes-the-wrong-tree-more-certain
sourceSlug: when-more-dna-makes-the-wrong-tree-more-certain
summary: 四物種合成實驗把抽樣誤差與模型誤差分開，顯示一條很長的序列比對仍可對錯誤演化樹產生百分之百 bootstrap 支持度。
date: 2026-07-22
lastUpdated: 2026-07-26
featured: true
topics: [系統發育學, 模型錯置, 鄰接法, bootstrap 支持度, 組成趨同]
heroImage: /images/writing/july-biology/phylo-recovery.svg
type: Research Notes
archived: false
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
  <img src="/images/writing/july-biology/phylo-recovery.svg" alt="在組成趨同情境下，比較 p-distance、JC69、K80 與正則化 log-det 的拓撲恢復率隨序列長度變化的折線圖。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 1。</strong> 設計異質過程下的恢復機率。在 5,000 個位點時，log-det 在 120/120 次模擬恢復真實分割；p-distance、JC69 和 K80 則為 0/120。這是合成 Monte Carlo 結果，不是實證基準。</figcaption>
</figure>

在 100 個位點時，真實拓撲的恢復機率分別為：p-distance \(0.158\)、JC69 \(0.292\)、K80 \(0.267\)、log-det \(0.600\)。序列變長後，抽樣雜訊確實下降；但三種同質距離只是更穩定地集中到錯誤分割 \(AC\mid BD\)。到 5,000 個位點時，每次模擬都選擇錯誤分割。Log-det 則朝相反方向移動，並在每次模擬選中真實分割。

因此，結果不只是「簡單方法表現較差」。錯誤答案會變得更可重複，因為估計器收斂到受組成趨同扭曲的距離。

## 百分之百 bootstrap 支持亦可能是錯的

Bootstrap 會重抽序列比對的欄位、重建演化樹，再計算每個分割重現的頻率。它衡量的是整條分析流程在位點重抽下是否穩定。

示範比對有 5,000 個位點，隨機種子為 1729。JC69 與 K80 推斷 \(AC\mid BD\)；log-det 則推斷真實的 \(AB\mid CD\)。每種方法再進行 250 次 bootstrap。

<figure class="article-figure">
  <img src="/images/writing/july-biology/phylo-bootstrap.svg" alt="三幅演化樹示意圖，顯示 JC69 與 K80 對錯誤分割有百分之百支持，而正則化 log-det 對真實分割有百分之百支持。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong> 同一條 5,000 位點比對對不同歷史產生 100% bootstrap 支持。重抽樣衡量的是在距離模型條件下的可重複性，並不是替換模型適足性的直接檢驗。</figcaption>
</figure>

JC69 與 K80 對錯誤分割的支持度都是 \(1.000\)，log-det 對真實分割的支持度亦是 \(1.000\)。這並不矛盾：三種分析都高度內部穩定，只是在如何把序列模式映射成演化距離上彼此不同。

所以，高支持度不能取代模型檢查。模型選擇問的是候選者之中誰最好；模型適足性問的則是，即使是獲選模型，能否重現資料的重要特徵。

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
