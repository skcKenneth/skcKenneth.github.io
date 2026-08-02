---
title: "簡單藥物釋放定律何時不再足夠？"
slug: when-simple-drug-release-laws-stop-being-enough
sourceSlug: when-simple-drug-release-laws-stop-being-enough
summary: 由經驗定律到機理模型的層級研究，揭示熟悉的釋放曲線何時遮蔽有限 sink 傳輸、參數權衡與轉變中的機制。
date: 2026-08-02
lastUpdated: 2026-08-02
featured: true
topics: [藥物溶出, 擴散, 模型選擇, 逆問題, 傳輸現象]
heroImage: /science/drug-dissolution-model-hierarchy/model-hierarchy.svg
type: 研究筆記
archived: false
readingMinutes: 17
scienceProject: drug-dissolution-model-hierarchy
redirectFrom: []
---

面對一條平滑累積釋放曲線，人很自然會問：哪條公式擬合得最好？更有用但更難的問題是：那條公式要在甚麼物理假設成立時才可以被解釋？

本研究把常見經驗定律與包含有限外部體積及清除的球形擴散模型放在同一層級中比較。模型只配對受控合成觀測，所以目的不是推薦配方或推斷臨床劑量，而是找出簡單定律何時仍有資訊、何時會遮蔽傳輸區域或不可辨識參數。

## 模型層級，不只是擬合競賽

以 $F(t)$ 表示已釋放比例，幾種常見關係為

$$
F_{\mathrm{Higuchi}}(t)=k_Ht^{1/2},\qquad
F_{\mathrm{Korsmeyer-Peppas}}(t)=kt^n,
$$

$$
F_{\mathrm{Hixson-Crowell}}(t)=1-(1-k_{HC}t)^3,
$$

以及依幾何而變的 Hopfenberg 表面侵蝕形式。它們是有用摘要，但參數不一定唯一對應擴散、質傳、溶解度或幾何。

機理模型追蹤球內濃度 $C(r,t)$：

$$
\frac{\partial C}{\partial t}
=D\,\frac{1}{r^2}\frac{\partial}{\partial r}
\left(r^2\frac{\partial C}{\partial r}\right),
$$

在中心使用對稱條件，表面則有有限質傳：

$$
-D\left.\frac{\partial C}{\partial r}\right|_R
=k_m[C(R,t)-C_b(t)].
$$

外部濃度 $C_b$ 亦按有限體積與清除率演化，因此離開基質的物質不會在質量平衡中憑空消失。

<figure class="article-figure">
  <img src="/science/drug-dissolution-model-hierarchy/model-hierarchy.svg" alt="由經驗釋放定律到有限 sink 球形擴散模型的層級。" width="960" height="430" loading="eager" decoding="async" />
  <figcaption><strong>圖 1。</strong>每一層加入更多物理結構及參數；只有數據能約束時，更多機理才真正有用。</figcaption>
</figure>

## 濃度場解釋累積曲線

累積比例把整個空間過程壓縮成一個數字。徑向剖面則顯示移動中的耗盡層、內部儲庫與外部 sink 的影響。

<figure class="article-figure">
  <img src="/science/drug-dissolution-model-hierarchy/radial-transport.png" alt="球形基質內不同時間的徑向濃度，連同累積釋放與外部濃度。" width="960" height="430" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong>相似累積釋放可來自不同內部濃度場。此密集場圖刻意保留點陣格式，其餘圖則保留 SVG 向量。</figcaption>
</figure>

兩個無因次量組織整體行為：

$$
\mathrm{Bi}_m=\frac{k_mR}{D},
$$

比較外部質傳與內部擴散；容量比則比較基質存量與接受相容量。低 $\mathrm{Bi}_m$ 顯示外部傳質瓶頸，有限容量則會削弱 sink 並改變後期釋放。

<figure class="article-figure">
  <img src="/science/drug-dissolution-model-hierarchy/regime-atlas.svg" alt="質傳 Biot 數與外部容量比下的藥物釋放區域圖。" width="960" height="430" loading="lazy" decoding="async" />
  <figcaption><strong>圖 3。</strong>「擴散控制」不能只靠曲線形狀命名；它取決於實驗在傳輸區域圖中的位置。</figcaption>
</figure>

## 擬合指數可以隨時間漂移

對 $F=kt^n$，局部對數斜率為

$$
n_{\mathrm{local}}(t)=\frac{d\log F}{d\log t}.
$$

若固定機制在有效區間主導，指數應近似不變；但在機理模擬中，耗盡、外部累積及清除會重新分配阻力，使它隨時間改變。

<figure class="article-figure">
  <img src="/science/drug-dissolution-model-hierarchy/local-release-exponent.svg" alt="不同傳輸區域下的局部對數釋放指數隨時間變化。" width="960" height="390" loading="lazy" decoding="async" />
  <figcaption><strong>圖 4。</strong>單一擬合指數只是窗口內的平均；移動窗口足以改變機理解釋。</figcaption>
</figure>

## 擬合質素是證據，不是裁決

研究以已聲明噪音生成 20 個合成觀測，讓候選模型在共同釋放區間內擬合，再比較殘差與

$$
\mathrm{AIC}=2k-2\log\hat L.
$$

<figure class="article-figure">
  <img src="/science/drug-dissolution-model-hierarchy/model-discrimination.svg" alt="觀測釋放、候選模型擬合、殘差與 AIC 比較。" width="960" height="430" loading="lazy" decoding="async" />
  <figcaption><strong>圖 5。</strong>有限 sink PDE 在這次設定中 AIC 最低，為 $-179.924$；它只是本次候選中最好，不是普遍優越。</figcaption>
</figure>

機理模型亦暴露逆問題：$D$ 與 $k_m$ 可以互相補償。不同參數配對產生近似曲線，形成似然山谷而非明確單點。

<figure class="article-figure">
  <img src="/science/drug-dissolution-model-hierarchy/identifiability-ridge.svg" alt="擴散與質傳參數上的目標函數面，顯示可辨識性山脊。" width="960" height="410" loading="lazy" decoding="async" />
  <figcaption><strong>圖 6。</strong>小殘差不代表每個物理參數都精確；獨立質傳或剖面量測，比在相同時間加密取樣更能打破山脊。</figcaption>
</figure>

## 粒徑變異會改變表觀動力學

真實配方通常不是完全等尺寸。擴散時間約按 $R^2/D$ 增長，因此半徑分布會轉化為釋放時間分布。

<figure class="article-figure">
  <img src="/science/drug-dissolution-model-hierarchy/polydispersity.svg" alt="粒子半徑分布及其集合釋放曲線，與單一粒徑模型比較。" width="960" height="400" loading="lazy" decoding="async" />
  <figcaption><strong>圖 7。</strong>即使微觀傳輸定律不變，多分散性亦會拉寬釋放曲線；單一有效半徑可能把異質性錯判為異常動力學。</figcaption>
</figure>

## 數值守恆也是科學結論的一部分

徑向 PDE 經多個網格尺度細化，並以封閉質量平衡審核。預設重現的最大平衡誤差為 $3.11\times10^{-13}$，最終釋放比例為 $0.9750$。

<figure class="article-figure">
  <img src="/science/drug-dissolution-model-hierarchy/numerical-validation.svg" alt="有限 sink 求解器的徑向網格收斂與藥物質量平衡誤差。" width="960" height="400" loading="lazy" decoding="async" />
  <figcaption><strong>圖 8。</strong>求解器收斂與模型擬合分開報告；由漏質量離散化得到的好曲線，仍不是有效證據。</figcaption>
</figure>

模型層級亦包含溶解度受限的移動前沿／縮核描述。與有限 sink 擴散比較，可見兩種早期相近的機制如何在後期分岔。

<figure class="article-figure">
  <img src="/science/drug-dissolution-model-hierarchy/finite-sink-and-moving-front.svg" alt="有限 sink 擴散與移動前沿釋放預測及其內部狀態。" width="960" height="420" loading="lazy" decoding="async" />
  <figcaption><strong>圖 9。</strong>早期吻合不等於機制相同；後期釋放與內部剖面有更強辨識力。</figcaption>
</figure>

## 驗證範圍與限制

鎖定環境通過三項自動測試。完整流程重新生成並校驗 41 個聲明輸出，包括九組圖像；快速設定亦可由空白輸出目錄成功重建。SVG 現由繪圖系統直接輸出，保留原有設計，亦不再依賴 CairoSVG 的本機 runtime。

在這個合成實驗中，證據支持三點：有限 sink PDE 是測試候選中 AIC 最佳；有限容量與質傳令表觀指數隨時間改變；良好機理擬合仍可能留下弱辨識參數。

結果不代表生體可用率、治療等效性、生產品質或安全性；這些需要模型以外的實驗與臨床證據。

## 如何設計更有資訊的實驗

若只有累積釋放，增加密集時間點未必最有效。少量內部濃度剖面、兩種外部體積，或獨立質傳量測，可能更有效地旋轉並收窄可辨識性山脊。

實際教訓不是放棄簡單定律，而是把它們放在正確層次：當科學問題要求、而數據亦足以支持時，才提升到機理解釋。

## 參考文獻

1. Noyes, A. A., & Whitney, W. R. (1897). The rate of solution of solid substances in their own solutions. *Journal of the American Chemical Society, 19*(12), 930–934. [https://doi.org/10.1021/ja02086a003](https://doi.org/10.1021/ja02086a003)
2. Higuchi, T. (1961). Rate of release of medicaments from ointment bases containing drugs in suspension. *Journal of Pharmaceutical Sciences, 50*(10), 874–875. [https://doi.org/10.1002/jps.2600501018](https://doi.org/10.1002/jps.2600501018)
3. Hixson, A. W., & Crowell, J. H. (1931). Dependence of reaction velocity upon surface and agitation. *Industrial & Engineering Chemistry, 23*(8), 923–931. [https://doi.org/10.1021/ie50260a018](https://doi.org/10.1021/ie50260a018)
4. Korsmeyer, R. W., Gurny, R., Doelker, E., Buri, P., & Peppas, N. A. (1983). Mechanisms of solute release from porous hydrophilic polymers. *International Journal of Pharmaceutics, 15*(1), 25–35. [https://doi.org/10.1016/0378-5173(83)90064-9](https://doi.org/10.1016/0378-5173(83)90064-9)
5. Hopfenberg, H. B. (1976). Controlled release from erodible slabs, cylinders, and spheres. In *Controlled Release Polymeric Formulations*. [https://doi.org/10.1021/bk-1976-0033.ch003](https://doi.org/10.1021/bk-1976-0033.ch003)
