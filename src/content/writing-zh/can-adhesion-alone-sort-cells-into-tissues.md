---
title: "單靠黏附力能把細胞整理成組織嗎？"
slug: can-adhesion-alone-sort-cells-into-tissues
sourceSlug: can-adhesion-alone-sort-cells-into-tissues
summary: 以細胞 Potts 模型檢驗差異黏附何時導致分選、包覆、停滯混合，以及外表相似但機制不同的終態。
date: 2026-08-02
lastUpdated: 2026-08-02
featured: true
topics: [細胞分選, 差異黏附, 細胞 Potts 模型, 形態發生, 計算生物學]
heroImage: /science/differential-adhesion-cell-sorting/sorting-sequence.svg
type: 研究筆記
archived: false
readingMinutes: 16
scienceProject: differential-adhesion-cell-sorting
redirectFrom: []
---

細胞沒有地圖，也可以逐漸分成不同區域。差異黏附是一個可能解釋：細胞重排時減少高能量接觸，讓較相容的鄰接關係取代較不相容的界面。不過，一個圓滑的細胞團並不足以證明這個機制；運動性、外界介質親和力、動力學停滯與初始排列，都可能改變我們最後看到的圖案。

這個研究因此不把細胞分選當成一張漂亮圖片，而是當成模型辨識問題。二維細胞 Potts 模型提供受控實驗，九幅經審核圖像展示完整時間軌跡、能量來源、參數區域、初始條件敏感度與競爭解釋。模型是合成系統，並不代表某一種具名組織。

## 把機械假說寫成模型

每個細胞佔據一組格點，身份為 $\sigma_i$，類型為 $\tau(\sigma_i)$。本研究採用

$$
H =
\sum_{\langle i,j\rangle}
J_{\tau(\sigma_i),\tau(\sigma_j)}
\lambda_A\sum_c(A_c-A_0)^2
\lambda_P\sum_c(P_c-P_0)^2
+H_{\mathrm{motility}}.
$$

接觸能 $J$ 懲罰不利鄰接；面積與周長項防止細胞消失或過度變形。每次複製嘗試按

$$
P(\mathrm{accept})=\min\{1,\exp(-\Delta H/T)\}
$$

決定是否接受。這裡的 $T$ 是控制隨機重排的有效溫度，不是物理溫度。

基準接觸矩陣的有效 A–B 界面張力為

$$
\gamma_{AB}=J_{AB}-\frac{J_{AA}+J_{BB}}{2}=18.
$$

正值表示異型接觸較昂貴。因此假說可以被檢驗：只要動力學能探索足夠狀態，系統就應減少 A–B 邊界並形成較大的同型區域。

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/sorting-sequence.svg" alt="兩種細胞由隨機混合逐步形成分隔區域的時間序列。" width="960" height="430" loading="eager" decoding="async" />
  <figcaption><strong>圖 1。</strong>基準模擬由混合狀態逐漸形成有組織區域。時間序列很重要：單看終態，無法排除有利初始條件。</figcaption>
</figure>

## 不只「看起來像分選」

分析同時追蹤異型邊界長度、鄰居式分選指標、能量，以及 A 型細胞位於外圍的比例。完整設定下，最終分選指標為 $0.5022$：代表明顯重排，但不是完全分離。

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/sorting-diagnostics.svg" alt="分選指標、異型邊界、能量與外圍組成隨模擬步數的變化。" width="960" height="420" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong>結構與能量指標大致共同演化，但並不完全同步；平台期可揭示外觀看似仍有活動的動力學停滯。</figcaption>
</figure>

圖像容易受顏色與團塊大小影響，單一數值又可能遮蔽拓撲。多個互補指標可避免任何一種表示方式壟斷結論。

## 黏附與活動性的競爭

差異黏附預測的是參數區域，而不是必然結果。相圖同時改變 $\gamma_{AB}$ 與主動運動性。界面張力增強分離驅動；適度活動可協助系統跨越能障，但過強活動也會持續破壞界面。

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/adhesion-motility-phase-diagram.svg" alt="有效界面張力與細胞運動性下的分選相圖。" width="960" height="430" loading="lazy" decoding="async" />
  <figcaption><strong>圖 3。</strong>分選同時取決於能量驅動與細胞能否重排；相同黏附差異在不同活動性下未必產生相同形態。</figcaption>
</figure>

模型再加入持續運動與不同的細胞—介質親和力，直接測試這種競爭。

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/model-extensions.svg" alt="基準差異黏附、主動運動與介質親和力變體的比較。" width="960" height="420" loading="lazy" decoding="async" />
  <figcaption><strong>圖 4。</strong>即使細胞間參數相近，只要持續推動或介質親和力改變，外層排列亦會不同。</figcaption>
</figure>

「分選」與「包覆」因此不能混為一談。前者問同類細胞是否成為鄰居，後者問哪一類佔據外圍。

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/sorting-versus-engulfment.svg" alt="不同模型變體中的鄰居分選與空間包覆比較。" width="960" height="390" loading="lazy" decoding="async" />
  <figcaption><strong>圖 5。</strong>鄰接分離與徑向次序是兩個觀測量；把兩者當成同義詞會抹去重要機制差異。</figcaption>
</figure>

## 粗化速度包含動力學訊息

若特徵區域尺度滿足

$$
L(t)\propto t^\alpha,
$$

則 $\alpha$ 概括小區域消失、較大區域成長的速度。五次設定重複中，在預先聲明的擬合區間得到 $\alpha\approx0.3001$。

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/coarsening-law.svg" alt="多次重複模擬的區域尺度與冪律粗化指數。" width="960" height="390" loading="lazy" decoding="async" />
  <figcaption><strong>圖 6。</strong>這是有限時間內的有效指數，不是普適常數；重複間差異與擬合窗口同樣屬於結果。</figcaption>
</figure>

## 初始條件檢驗終態是否必然

隨機、A 核、B 核與條紋四種起點用來測試路徑依賴。若各路徑收斂，表示能量地景在模擬時間內具有強組織力；若不收斂，亞穩態本身就是科學訊息。

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/initial-condition-robustness.svg" alt="不同隨機、核殼與條紋初態所得的分選指標和終態。" width="960" height="430" loading="lazy" decoding="async" />
  <figcaption><strong>圖 7。</strong>多種起點揭示單一隨機初始化容易遺漏的動力學能障。</figcaption>
</figure>

能量分解亦很關鍵。接觸能下降可能由面積或周長懲罰抵銷；看似平滑的邊界，也可能靠不合理的細胞變形換來。

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/energy-decomposition.svg" alt="細胞 Potts 模型的接觸、面積、周長及運動能量分解。" width="960" height="390" loading="lazy" decoding="async" />
  <figcaption><strong>圖 8。</strong>分解能量後，才能判斷究竟是哪一個機制推動表面上的組織化。</figcaption>
</figure>

<figure class="article-figure">
  <img src="/science/differential-adhesion-cell-sorting/cell-shape-distributions.svg" alt="不同模型變體下的細胞面積、周長與形狀分布。" width="960" height="390" loading="lazy" decoding="async" />
  <figcaption><strong>圖 9。</strong>形狀分布是合理性檢查：高分選指標不應依賴病態幾何。</figcaption>
</figure>

## 我們驗證了甚麼

鎖定環境通過三項自動測試；完整重現會重新生成並核對 35 個聲明輸出，包括九組圖像。另一次快速設定亦由空白輸出目錄開始重建。所有分圖標記、圖例、長標題與軸註釋均經目視審核，文字統一為黑色，配色亦不依賴紅綠辨識。

證據支持一個有限度結論：差異黏附在這個受控二維模型中能產生分選，但運動性、介質親和力、初態及有限模擬時間都會實質改變形態。

它不證明黏附在每種真實組織中都足夠。化學趨向、極性、增殖、細胞外基質、主動應力、三維幾何與時間變化的黏附均未納入。

## 下一個有研究價值的問題

下一步不只是放大格點，而是做可辨識性實驗：讓數個不同機制產生相似終態，再找出能區分它們的時間序列觀測。界面波動、鄰居交換率、徑向組成與形狀統計都是可行候選。

更廣泛的教訓是：一個圖案只有在我們認真追問「還有甚麼機制能畫出它」之後，才會成為證據。

## 參考文獻

1. Steinberg, M. S. (1963). Reconstruction of tissues by dissociated cells. *Journal of Experimental Zoology, 173*(4), 395–434. [https://doi.org/10.1002/jez.1401730406](https://doi.org/10.1002/jez.1401730406)
2. Graner, F., & Glazier, J. A. (1992). Simulation of biological cell sorting using a two-dimensional extended Potts model. *Physical Review Letters, 69*, 2013–2016. [https://doi.org/10.1103/PhysRevLett.69.2013](https://doi.org/10.1103/PhysRevLett.69.2013)
3. Glazier, J. A., & Graner, F. (1993). Simulation of the differential adhesion driven rearrangement of biological cells. *Physical Review E, 47*, 2128–2154. [https://doi.org/10.1103/PhysRevE.47.2128](https://doi.org/10.1103/PhysRevE.47.2128)
4. Niculescu, I., Textor, J., & de Boer, R. J. (2015). Crawling and gliding: A computational model for shape-driven cell migration. *PLoS Computational Biology, 11*(10), e1004280. [https://doi.org/10.1371/journal.pcbi.1004280](https://doi.org/10.1371/journal.pcbi.1004280)
5. Durand, M., & Guesnet, E. (2021). An efficient Cellular Potts Model algorithm that forbids cell fragmentation. *PLoS Computational Biology, 17*(2), e1008576. [https://doi.org/10.1371/journal.pcbi.1008576](https://doi.org/10.1371/journal.pcbi.1008576)
