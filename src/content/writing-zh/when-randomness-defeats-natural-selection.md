---
title: "當隨機性戰勝自然選擇"
slug: when-randomness-defeats-natural-selection
sourceSlug: when-randomness-defeats-natural-selection
summary: Wright–Fisher 計算實驗說明：有利等位基因由單一拷貝開始時為何仍多數消失、遷移如何抵消局部適應，以及短暫瓶頸為何會留下長期遺傳缺口。
date: 2026-07-20
lastUpdated: 2026-07-26
featured: true
topics: [族群遺傳學, Wright–Fisher 模型, 遺傳漂變, 自然選擇, 遷移, 族群瓶頸]
heroImage: /images/writing/july-biology/genetic-fixation.svg
type: Research Notes
archived: false
redirectFrom: []
---

自然選擇有方向，但有限族群中的演化並不是確定性的。

一個能提高預期繁殖成功率的新等位基因，仍可能在最初數代便消失；一個在當地環境有利的基因，可能因持續遷入而長期維持在低頻；族群數量可以在瓶頸後恢復，但遺傳多樣性仍然不足。這些現象不是附加在確定性理論上的少數例外，而是抽樣本身帶來的結果。

本研究以二倍體 Wright–Fisher 模型，把遺傳漂變、選擇、遷移和瓶頸放進同一組可重現的合成實驗。目的不是推斷任何真實物種的歷史，而是分辨哪些定性結論由模型直接支持，哪些必須依靠實證資料。

## 模型從拷貝數開始，而不只是百分比

設二倍體族群大小為 \(N\)。若等位基因 \(A\) 在第 \(t\) 代的頻率為 \(p_t\)，繁殖前便有 \(2Np_t\) 個拷貝。採用基因型無顯隱性的選擇係數 \(s\)，選擇後的預期頻率為

$$
p_t^\star=\frac{p_t(1+s)}{1+s p_t}.
$$

下一代不是直接取預期值，而是經過抽樣：

$$
X_{t+1}\sim\operatorname{Binomial}(2N,p_t^\star),
\qquad
p_{t+1}=\frac{X_{t+1}}{2N}.
$$

二項抽樣就是漂變的來源，其條件變異數為

$$
\operatorname{Var}(p_{t+1}\mid p_t)
=\frac{p_t^\star(1-p_t^\star)}{2N}.
$$

當 \(N\) 增大，逐代波動會縮小；但只要族群有限，波動便不會完全消失。在沒有突變和遷移時，\(p=0\) 與 \(p=1\) 都是吸收狀態，一條軌跡最終會以基因消失或固定結束。

這也說明「有利突變的選擇係數為 \(0.05\)」仍是不完整的描述。初始頻率同樣重要。本實驗每次固定模擬都只由一個新拷貝開始：

$$
p_0=\frac{1}{2N}.
$$

較大的族群降低每代漂變，但亦令單一拷貝佔族群的初始比例更小。

## 選擇改變勝算，而不是保證命運

固定機率實驗使用五個族群大小和六個選擇係數，每組參數進行 2,500 次獨立模擬。在中性情況下，單一拷貝的固定機率理應是 \(1/(2N)\)。模擬結果與此基準接近：當 \(N=20\)、100 和 500 時，估計值分別為 \(0.0248\)、\(0.0056\) 和 \(0.0008\)，理論值則為 \(0.025\)、\(0.005\) 和 \(0.001\)。

<figure class="article-figure">
  <img src="/images/writing/july-biology/genetic-fixation.svg" alt="比較中性與有利新等位基因在五個二倍體族群大小下固定機率的折線圖。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 1。</strong> 每組參數 2,500 次模擬所得的固定機率。當 \(s=0.05\) 時，固定機率提升至約 0.09–0.10，但約十個新拷貝仍有九個最終消失。數值均為合成模型輸出。</figcaption>
</figure>

在 \(s=0.05\) 時，當 \(N\) 由 20 增至 500，固定機率依次為 \(0.0952\)、\(0.1016\)、\(0.0868\)、\(0.0924\) 和 \(0.0992\)。這種近似穩定的水平符合「選擇較強而新拷貝罕見」的區域：選擇抵消了初始頻率下降的部分影響，卻沒有令固定成為大概率事件。

因此，實際教訓不只是「小族群漂變較強」。即使一個有利基因的預期軌跡向上，它由單一拷貝開始時仍很可能早期消失。若只報告確定性遞推式，便會掩蓋大部分模擬真正發生的事件。

## 遷移可以抵消局部適應

兩個亞族群的模型先進行遷移，再進行選擇和抽樣。若對稱遷移比例為 \(m\)，則

$$
\widetilde p_1=(1-m)p_1+mp_2,\qquad
\widetilde p_2=(1-m)p_2+mp_1.
$$

之後，兩個棲地施加方向相反的選擇。問題便變成：當遷入者不斷帶來另一種等位基因時，當地有利基因能否維持差異？

這不是一個普遍「好基因」與隨機雜訊的比賽，因為適合度取決於環境。較弱遷移可以補充變異並減少局部消失；較強遷移則可能令兩地同質化，削弱分歧選擇的效果。真正重要的不是單獨看 \(m\) 或 \(s\)，而是比較它們相對於漂變及彼此的尺度。

合成結果支持一個權衡關係，而不是一條通用遷移門檻。若應用到真實族群，還需要有效族群大小、具方向性的遷移、顯性、連鎖位點，以及基因型抽樣的觀察模型。

## 族群數量恢復後，瓶頸仍會被記住

預期雜合度

$$
H_t=2p_t(1-p_t)
$$

衡量位點內的遺傳多樣性。在中性 Wright–Fisher 漂變下，

$$
\mathbb E[H_t]
=H_0\left(1-\frac{1}{2N}\right)^t.
$$

模擬先以每個族群大小 8,000 個獨立位點檢查這條衰減律，再把 \(N=500\) 的族群暫時縮小至 \(N_b\) 十代，之後立即把族群數量恢復至 500。

<figure class="article-figure">
  <img src="/images/writing/july-biology/genetic-bottleneck.svg" alt="比較無瓶頸與暫時縮小至 50、25 和 10 個體時，平均雜合度隨世代變化的折線圖。" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong> 10,000 個合成位點的平均雜合度。陰影區表示十代瓶頸。族群數量回復至 500，並不會令已消失的變異自動回來。</figcaption>
</figure>

在第 180 代，沒有瓶頸時的平均雜合度約為 \(0.417\)；瓶頸降至 \(N_b=10\) 後只有 \(0.252\)。若瓶頸為 \(N_b=25\) 和 50，終值分別約為 \(0.345\) 和 \(0.381\)。

這個結果把兩種狀態變數清楚分開。模型可以命令族群數量在一代內回升，但等位基因多樣性不能在沒有突變、遷移或保留變異的情況下復原。人口學復甦與遺傳復甦是兩個不同的命題。

## 計算驗證了甚麼

完整運算包括五乘六的固定機率網格、中性多樣性檢查、遷移實驗和瓶頸實驗。每個固定機率格點使用 2,500 次模擬；中性驗證使用 8,000 個位點；每組遷移參數使用 1,800 次模擬；每個瓶頸情境使用 10,000 個位點。六項單元測試和輸出清單檢查均通過。

這些檢查支持程式正確實現所述模型，卻不等於模型已適用於某個真實物種。實驗沒有包括突變、顯性、世代重疊、連鎖、瓶頸以外的族群大小變化，以及 \(N_e\) 的估計不確定性；各位點亦被視為獨立。

下一步因此不只是把模擬再放大。一個更強的研究會加入觀察層，檢驗有限時間序列或基因組樣本能否識別 \(N_e\)、\(s\) 與 \(m\) 的組合，再在後驗不確定性下比較保育政策。

## 結語

自然選擇提供方向，漂變則提供一組可能的歷史分佈；遷移把空間上的歷史互相連結，瓶頸則刪去日後單靠數量增長無法自動恢復的選項。

本模型最重要的結果並非某一個固定機率，而是一套解讀紀律：把預期變化與實際軌跡、族群數量與遺傳多樣性、程式驗證與實證驗證清楚分開。

## 參考文獻

1. Wright, S. (1931). Evolution in Mendelian populations. *Genetics, 16*(2), 97–159. [https://doi.org/10.1093/genetics/16.2.97](https://doi.org/10.1093/genetics/16.2.97)
2. Kimura, M. (1962). On the probability of fixation of mutant genes in a population. *Genetics, 47*(6), 713–719. [https://doi.org/10.1093/genetics/47.6.713](https://doi.org/10.1093/genetics/47.6.713)
3. Shafiey, H., & Waxman, D. (2017). Exact results for the probability and stochastic dynamics of fixation in the Wright–Fisher model. *Journal of Theoretical Biology, 430*, 64–77. [https://doi.org/10.1016/j.jtbi.2017.06.026](https://doi.org/10.1016/j.jtbi.2017.06.026)
4. Whitlock, M. C. (2003). Fixation probability and time in subdivided populations. *Genetics, 164*(2), 767–779. [https://doi.org/10.1093/genetics/164.2.767](https://doi.org/10.1093/genetics/164.2.767)
5. Nei, M., Maruyama, T., & Chakraborty, R. (1975). The bottleneck effect and genetic variability in populations. *Evolution, 29*(1), 1–10. [https://doi.org/10.1111/j.1558-5646.1975.tb00807.x](https://doi.org/10.1111/j.1558-5646.1975.tb00807.x)
