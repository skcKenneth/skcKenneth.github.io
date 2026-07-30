---
title: "當同一個反應器有三個溫度"
slug: when-one-reactor-has-three-temperatures
sourceSlug: when-one-reactor-has-three-temperatures
summary: 非等溫連續攪拌反應器可以記住操作路徑，在冷、熱狀態之間跳轉，並在熱失穩折點前愈來愈慢地恢復。
date: 2026-07-30
lastUpdated: 2026-07-30
featured: true
topics: [非線性動力學, CSTR, 滯後, 分岔, 臨界減速]
heroImage: /science/nonisothermal-cstr-hysteresis/equilibrium-branch.svg
type: Research Notes
archived: false
readingMinutes: 20
scienceProject: nonisothermal-cstr-hysteresis
redirectFrom: []
---

同一個反應器，即使使用相同進料、相同停留時間與相同冷卻條件，也可以長期停留在不止一個溫度。若我們習慣把系統理解為「一個輸入必然對應一個輸出」，這件事似乎矛盾；但對具有正回饋的非線性系統而言，多重穩態反而是自然結果。

放熱反應形成一條回饋鏈：溫度上升令反應加快，反應加快又釋放更多熱量，熱量再推高溫度。冷卻系統與這條回饋抗衡，但放熱曲線與散熱曲線形狀不同，兩者可相交三次，形成低溫穩態、高溫穩態，以及夾在中間的不穩定平衡。

這項研究不只問「穩態方程有幾多個根」，而是追問哪些根實際可達、為甚麼升溫和降溫不會沿同一路徑返回、擾動如何把系統推入另一個吸引域，以及恢復變慢能否提示反應器正接近點火。

研究使用無因次合成模型，目的在於展示機制與可重現分析流程，並非任何指定工廠的安全計算。

## 反應與熱回饋的二狀態模型

以 \(x\) 表示未反應物的無因次濃度，\(T\) 表示反應器無因次溫度：

$$
\frac{dx}{dt}=1-x-k(T)x,
$$

$$
\frac{dT}{dt}
=\varepsilon_T\left[T_f-T+B\,k(T)x-h(T-T_c)\right],
$$

其中

$$
k(T)=\mathrm{Da}\,e^{\gamma T}.
$$

濃度方程比較進料補充與反應消耗；溫度方程則比較進料焓、反應放熱，以及向冷卻介質的熱傳。預設參數為

$$
\mathrm{Da}=1,\quad \gamma=2,\quad B=8,\quad
h=1,\quad \varepsilon_T=0.1,\quad T_f=0.
$$

這組參數是為了清楚呈現非線性幾何，不應解讀為已配適的反應動力學或熱傳係數。

在平衡時，

$$
x^*(T)=\frac{1}{1+k(T)},
$$

代入能量平衡，可直接把整條平衡分支寫成

$$
T_c(T)=
\frac{(1+h)T-T_f-B\,k(T)/(1+k(T))}{h}.
$$

這種參數化方法比反覆交給局部求根器更可靠。局部求根器往往只返回最接近初值的一個解，使其他操作狀態被隱藏；完整分支則把全部候選平衡與折點放在同一幅圖。

<figure class="article-figure">
  <img src="/science/nonisothermal-cstr-hysteresis/equilibrium-branch.svg" alt="非等溫反應器的 S 形平衡溫度分支，標示低溫與高溫穩定段、中間不穩定段及兩個折點。" width="960" height="580" loading="eager" decoding="async" />
  <figcaption><strong>圖 1。</strong> 已核證的兩個折點位於冷卻參數 \(-5.06568\) 與 \(-2.93432\)。在兩者之間，同一輸入有三個平衡，但只有外側兩段穩定。</figcaption>
</figure>

## 三個平衡並不等於三個可選操作點

局部穩定性由 Jacobian 決定：

$$
J=
\begin{pmatrix}
-1-k(T) & -xk'(T)\\
\varepsilon_T Bk(T) &
\varepsilon_T\left[Bxk'(T)-(1+h)\right]
\end{pmatrix}.
$$

若兩個特徵值的實部均為負，平衡才會把小擾動拉回去。低溫與高溫外側分支符合此條件，中間分支則不穩定。軌跡稍微離開中間狀態，偏差便會增大，最終落入其中一個穩定吸引域。

因此，穩態圖上的三個代數根並非三個同樣可用的 set-point。不穩定根更像是分隔兩種長期結果的幾何骨架。到達折點時，一個穩定平衡與一個不穩定平衡碰撞並消失；正在追蹤的操作分支就此終止，再慢的控制亦無法停留於已不存在的狀態。

## 為甚麼升溫與降溫不同路

延拓實驗先從低溫穩態開始，以小步改變冷卻參數，每一步都用上一個已收斂狀態作新初值。第二次則從高溫分支開始，反方向掃描。

<figure class="article-figure">
  <img src="/science/nonisothermal-cstr-hysteresis/hysteresis-loop.svg" alt="升溫與降溫延拓沿不同穩定分支移動，然後分別出現突然點火與熄火。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong> 低溫狀態會維持至上方折點才點火；返回時，高溫狀態則維持至下方折點才熄火。輸入與狀態的關係具有記憶。</figcaption>
</figure>

升溫掃描約在 \(T_c=-2.885\) 跳轉，接近解析定位的低溫分支折點 \(-2.93432\)；降溫掃描約在 \(T_c=-5.115\) 熄火，亦接近高溫分支折點 \(-5.06568\)。偏差來自有限收斂時間與離散參數網格。

這裏的滯後完全是確定性的，無需任何隨機衝擊。兩個反應器即使面對同一冷卻設定，也可因為過往路徑不同而停在不同溫度。

操作上的含意是：只觀察當前輸入未必足以辨認內部狀態。系統由冷端還是熱端進入當前位置，是靜態查表無法保留的重要資訊。

## 動態冷卻循環

準靜態掃描會在每一步等待收斂，但真實控制通常持續改變。下一個實驗使用三角形冷卻週期：以固定速率升溫，再以相同速率降溫。

<figure class="article-figure">
  <img src="/science/nonisothermal-cstr-hysteresis/dynamic-cycle.svg" alt="三角形冷卻週期及反應器溫度軌跡，顯示延遲的點火與熄火跳轉。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 3。</strong> 溫度長時間平滑改變，然後突然跳轉。已核證模擬由約 \(-2.8\) 的低溫狀態開始，最高達 \(2.6317\)。</figcaption>
</figure>

動態軌跡不會完全貼住平衡曲線。接近折點時，恢復速度下降，但控制參數仍在移動，因此實際跳轉可落後於靜態分岔位置。升降速率、熱時間尺度與離折點距離會共同決定延遲。

這正是「靜態安全範圍」與「動態轉變」的差異：分支圖回答哪些平衡存在，時間模擬則回答在指定控制速度下，系統是否追得上這些平衡。

## 把輸入復原，不等於把狀態復原

在多重穩態區間選取 \(T_c=-4\)，由不同初始濃度與溫度出發，把每條軌跡積分至低溫或高溫吸引子。

<figure class="article-figure">
  <img src="/science/nonisothermal-cstr-hysteresis/basin-of-attraction.svg" alt="初始濃度與溫度平面被分成低溫與高溫兩個吸引域。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 4。</strong> 同一外部設定有兩種穩定結果；不穩定平衡及其穩定流形組織出兩個吸引域的邊界。</figcaption>
</figure>

這幅圖把路徑依賴說得更精確：擾動可以在冷卻參數不變的情況下把狀態推過邊界。擾動結束後，即使輸入恢復原值，反應器也可能留在另一條穩定分支。

吸引域圖不是工業操作圖，因為它假設完全混合與精確參數。它的作用是指出校準研究還需要回答甚麼：邊界的不確定性有多大、哪些擾動可達、感測器能否辨認接近邊界，以及控制器如何保證狀態返回，而不只是把輸入調回原值。

## 恢復時間是一種距離訊號

在穩定平衡附近加入小擾動，線性化系統為

$$
\dot{\delta z}=J\,\delta z.
$$

若 \(\lambda_{\max}\) 是實部最大的特徵值，一個代表性的恢復時間為

$$
\tau_{\mathrm{rec}}
\approx-\frac{1}{\operatorname{Re}(\lambda_{\max})}.
$$

低溫分支接近 saddle-node 折點時，\(\operatorname{Re}(\lambda_{\max})\) 由負值趨近零。系統仍然穩定，卻愈來愈無力迅速消除擾動。

<figure class="article-figure">
  <img src="/science/nonisothermal-cstr-hysteresis/critical-slowing.svg" alt="低溫平衡接近點火折點時，線性恢復時間持續增加。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 5。</strong> 恢復變慢是折點幾何的機制結果，可啟發擾動反應監測，但本身並不是已驗證的工業警報。</figcaption>
</figure>

絕對溫度仍在熟悉範圍內，動態韌性卻可能已下降。恢復速度提供的是另一種資訊：系統偏離後，拉回原狀的力量還剩多少。

不過，臨界減速並非萬能預警。量測延遲、有色噪聲、未觀察狀態、參數漂移與閉迴路控制都可能遮蔽或模仿這個訊號。可信警報需要估計恢復率的不確定性、結合多個指標，並在代表性擾動下驗證誤報率。

## 已核證的是甚麼

本專案並非只畫一條 S 形曲線。它包括完整平衡分支參數化、Jacobian 特徵值分類、Radau 剛性積分、冷熱兩方向延拓、\(55\times55\) 初始條件吸引域，以及沿穩定分支計算恢復時間。

三項自動測試全部通過：分支點是否滿足平衡方程、是否正確出現兩個折點，以及代表性的低溫與高溫平衡是否穩定。輸出 manifest 含 23 個檔案，checksum 已重新驗證。文章的數值均取自該預設運行。

這些檢查證明內部可重現性，卻不等於實驗驗證、工業安全邊界或現場預警效能。

## 下一個有用研究

最有價值的延伸不是單純增加更多反應，而是圍繞折點建立不確定性與控制研究：

1. 以實驗數據校準反應與熱傳參數；
2. 用 pseudo-arclength continuation 搜尋平衡與 Hopf 分岔；
3. 把參數不確定性傳播到折點與吸引域位置；
4. 加入感測延遲、致動器飽和與冷卻擾動；
5. 比較固定溫度門檻與恢復率警報；
6. 設計對不安全轉變保留機率距離的控制器。

簡單模型最重要的訊息不是「非線性方程有時有三個根」，而是**穩定性、歷史與恢復速度決定哪一個根真正重要**。反應器可以看似平穩，卻正逐步走向現有操作分支突然消失的位置。

## 參考文獻

1. Chidambaram, M. (2018). *Mathematical Modelling and Simulation in Chemical Engineering*. Cambridge University Press. [https://doi.org/10.1017/9781108672887](https://doi.org/10.1017/9781108672887)
2. Aris, R. (1965). *Introduction to the Analysis of Chemical Reactors*. Prentice-Hall.
3. Strogatz, S. H. (2015). *Nonlinear Dynamics and Chaos* (2nd ed.). Westview Press.
4. Berezowski, M. (1994). Continuous reactions in a non-isothermal CSTR—I. Multiplicity of steady states. *Chemical Engineering Science, 49*, 1789–1799. [https://doi.org/10.1016/0009-2509(94)85008-9](https://doi.org/10.1016/0009-2509(94)85008-9)
