---
title: "當有效擴散係數不再足夠有效"
slug: when-effective-diffusivity-stops-being-effective
sourceSlug: when-effective-diffusivity-stops-being-effective
summary: 一個經驗證的 24 案例合成週期薄板基準，標出調和有效擴散係數何時能保留釋放曲線，以及有限單元瞬態何時令 t50 與 t90 超出預先鎖定的誤差門檻。
date: 2026-08-29
lastUpdated: 2026-08-29
featured: false
topics: [均質化, 擴散, 藥物釋放, 多尺度建模, 可重現研究]
heroImage: /science/when-effective-diffusivity-stops-being-effective/p02_03_harmonic_reliability_map.svg
type: 研究筆記
archived: false
scienceProject: when-effective-diffusivity-stops-being-effective
redirectFrom: []
---

有效擴散係數的魅力，在於它把細小而重複的空間結構壓縮成一個數字。當尺度分離足夠清楚時，我們不必逐層解析每一片快、慢材料，只要解一個係數固定的均質擴散方程，就可能保留宏觀通量與濃度演化。可是，「某個係數是正確的週期極限」與「一塊只含有限數目週期的薄板，在有限時間內已經像極限模型」並不是同一句話。前者是漸近結構，後者則受邊界、瞬態與可接受誤差共同限制。

本研究只問一個狹窄而可否證的問題：在一個合成、無因次、一維、兩端皆為完美吸收邊界的二元週期薄板中，解析調和係數何時能把解析微結構的釋放曲線，以及合成事件時間 $t_{50}$ 與 $t_{90}$，保留在預先宣告的容差內？協議在查看答案前固定四個擴散率對比、六個週期數、一種對稱慢–快–慢單元、一個邊界相位、一個時間範圍，以及 adequate、grey、breakdown 三種分類規則。

完整網格有 24 個案例，其中 $\kappa=1$ 的六個案例是均質負控制；真正比較的異質案例有 18 個。調和模型在其中七個案例被判為 **adequate**、兩個為 **grey**、九個為 **breakdown**。對每個非控制對比，$N=1,2,4$ 都是 breakdown；在 $N=8$ 時，$\kappa=10$ 已 adequate，但 $\kappa=100$ 與 $1000$ 仍是 grey；到了 $N=16$ 與 $32$，三個對比全部 adequate。這是凍結網格上的經驗分類，不是「十六個週期永遠足夠」的定理。

第二個結果針對早期校準。研究另以解析微結構曲線中 $0.1\le F\le0.5$ 的資料，擬合一個標量 $D_{\mathrm{fit}}$，之後才在未參與擬合的後半段檢查誤差。在恰好三個預先定義的見證案例 $(\kappa,N)=(10,1),(100,1),(1000,1)$ 中，早期最大誤差分別只有 $0.752\%$、$0.845\%$、$0.856\%$，卻在 held-out $t_{90}$ 產生 $11.11\%$、$12.09\%$、$12.17\%$ 的相對誤差。這證明的是三個固定見證，不是所有經擬合的擴散係數都會失敗。

整個項目只提供單一合成族群的數值證據。它不是均質化失效的普遍定理，不是藥物配方模型，也沒有包含膨潤、侵蝕、降解、結合、溶解、反應、移動界面、非 Fick 傳輸、臨床反應、劑量、療效或安全。文獻 gate 的結論是 **REFRAME**：週期均質化、微結構解析釋放、連通性、表觀擴散率與有限瞬態偏差已有充分先行工作；本地貢獻應被寫成可審計的 replication-extension benchmark，而不是新的有效係數公式。

## 一頁讀懂證據帳本

| 項目 | 凍結的第一階段證據 | 可以支持甚麼 |
|---|---:|---|
| 文獻 gate | **REFRAME** | 可做受控可靠性圖，但不能宣稱一般性新穎發現。 |
| 幾何 | 一種一維週期慢–快–慢薄板 | 只代表連接兩側的橫向障礙，不代表一般形貌。 |
| 邊界 | 兩端完美吸收 | 只測一種邊界條件及一個邊界相位。 |
| 網格 | $\kappa\in\{1,10,100,1000\}$，$N\in\{1,2,4,8,16,32\}$ | 恰好 24 個預註冊案例，其中六個是均質控制。 |
| 調和結果 | 18 個異質案例中 7 adequate、2 grey、9 breakdown | 此有限網格上的經驗尺度邊界。 |
| 早期擬合 | 三個 $N=1$ 見證 | 在這三例中，早期合格仍可伴隨 held-out $t_{90}$ 失敗。 |
| 數值驗證 | 九個科學檢查為真；24 個 refinement 檢查通過 | 觀察到的模型差異大於已記錄的離散不確定性。 |
| 重現 | 最近兩次 PASS 有相同 signature 97e221…41e2e | 凍結數值材料可確定性再生。 |
| 仍鎖定 | 其他相位、形貌、機制、資料及 final evaluation | 本文不提前聲稱其結果。 |

「有限尺度 breakdown」與「均質化理論錯誤」必須分開。對宣告的一維週期 cell problem，調和係數正是其解析有效係數。本研究檢查的不是這個極限係數是否成立，而是一個只含有限 $N$ 個週期的瞬態曲線，是否已接近到能通過指定的軌跡及事件容差。breakdown 標籤只表示某個 comparator 跨過某個凍結門檻；它不推翻週期均質化。

## 文獻審核為何令題目必須改寫

異質聚合物釋放與有效傳輸並非新的組合。Chandrasekaran 與 Hillman 在 1980 年已建立異質聚合物矩陣釋放模型（[DOI](https://doi.org/10.1002/jps.2600691119)）。Auriault 與 Lewandowska 把週期均質化、有效擴散係數與實驗連在一起，並強調介質能否被均質化所需的尺度條件（[DOI](https://doi.org/10.1023/A:1006599410942)）。Rim、Pinsky 與 van Osdol 則使用三維均質化計算角質層的有效擴散率（[DOI](https://doi.org/10.1016/j.memsci.2007.02.018)）。

直接解析藥物材料微結構亦已有成熟先例。Saylor 等人把藥物–聚合物微結構的演化與釋放動力學耦合，並研究連通性改變（[DOI](https://doi.org/10.1002/jps.21416)）。Laaksonen 等人為二元矩陣與儲庫型聚合物裝置建立顯式二維 cellular-automata 模型（[DOI](https://doi.org/10.1016/j.biomaterials.2008.12.028)）。Kimber、Kazarian 與 Štěpánek 把微結構藥片溶解模型、光譜成像與紫外量測放在同一研究框架（[DOI](https://doi.org/10.1016/j.compchemeng.2010.07.008)）。Barman 與 Bolin 對成像得到的多孔聚合物薄膜擬合三維隨機模型，再評估相應擴散觀測量（[DOI](https://doi.org/10.1111/jmi.12623)）。

另一些研究更直接限制了「單一標量係數」可承擔的解釋。Brandl 等人把獨立量測的水凝膠擴散率與釋放動力學比較，並在部分系統中找到一致性（[DOI](https://doi.org/10.1016/j.jconrel.2009.10.030)）。因此，一個誠實 benchmark 必須容許 adequate 結果，不能為了吸引眼球而只尋找失敗。Tabor 等人顯示，在有限且含 inclusions 的聚合物系統中，瞬態有效擴散率可以偏離穩態或無限介質預測（[DOI](https://doi.org/10.1063/1.4818579)）。Grund、Körber 與 Bodmeier 把表觀擴散率及矩陣藥片釋放連到孔隙率與聚合物 percolation threshold（[DOI](https://doi.org/10.1016/j.ejpb.2013.08.007)）。Donovan 等人則以週期均質化預測受阻溶質擴散，並用 Monte Carlo 與高分子溶液實驗作比較（[DOI](https://doi.org/10.1371/journal.pone.0146093)）。

構成機制的限制也早已建立。Salehi 等人推導親水矩陣釋放的多組分 stress–diffusion 模型，說明靜態 Fickian 標量不能直接移植到膨潤與組成相關傳輸（[DOI](https://doi.org/10.1016/j.jconrel.2015.12.045)）。Wang 與 Tsai 比較異質 PVA 水凝膠與 polymer–drug conjugate 的單、雙擴散係數模型（[DOI](https://doi.org/10.1016/j.jtice.2022.104395)）。Giolando 等人建立含非均勻藥物分佈、孔隙、降解與幾何的開放機理模型，並加入實驗比較（[DOI](https://doi.org/10.1002/adma.202301698)）。Graham 與 Klinge 以有限元素計算強烈異質、酵素鈣化水凝膠中的均質擴散（[DOI](https://doi.org/10.1016/j.jmbbm.2023.106244)）。

這 15 篇 primary works 共同阻止一個過度寬廣的標題：週期擴散均質化已建立；有效擴散率描述釋放已建立；連通性、percolation、影像導出的微結構、瞬態偏差、多組分傳輸及實驗驗證也都已有研究。P02 的受限搜尋沒有找到「同一對稱一維 cell、有限週期數、同一 contrast grid，再以 $F$、$t_{50}$、$t_{90}$ 聯合分類」的完全相同協議，但搜尋不到不是不存在的證明。可辯護的位置只是：把這個窄問題做成透明、可再生、可被後續擴展的基準。

## 凍結的一維擴散問題

薄板的無因次空間域為

$$
x\in[0,1].
$$

濃度 $c(x,t)$ 服從純擴散守恆律

$$
\frac{\partial c}{\partial t}
=\frac{\partial}{\partial x}
\left(D(x)\frac{\partial c}{\partial x}\right).
$$

初始濃度均勻：

$$
c(x,0)=1.
$$

對所有 $t>0$，兩個表面均為 perfect sink：

$$
c(0,t)=c(1,t)=0.
$$

方程沒有 source、reaction、binding、dissolution front、degradation、erosion、swelling、advection、stress coupling 或 moving boundary。「藥物釋放」在這裡只是描述一個守恆標量離開理想薄板的動機用語，不是特定配方的模擬。

累積釋放分率定義為

$$
F(t)=1-\int_0^1 c(x,t)\,dx.
$$

兩個合成事件時間是首次交叉：

$$
t_{50}=\inf\{t:F(t)\ge0.5\},
\qquad
t_{90}=\inf\{t:F(t)\ge0.9\}.
$$

程式在相鄰輸出時間之間以線性插值找交叉點。這兩個量只是曲線形狀摘要，不是臨床終點，亦沒有藥代動力、劑量或患者結果的含義。

## 一種對稱 cell 與一個邊界相位

微結構由 $N$ 個完全相同的週期組成。每一週期的首四分之一是慢材料，中間二分之一是快材料，末四分之一再回到慢材料，所以兩相各佔薄板一半：

$$
\phi_{\mathrm{slow}}=\phi_{\mathrm{fast}}=\frac12.
$$

快相擴散率固定為

$$
D_{\mathrm{fast}}=1,
$$

慢相則為

$$
D_{\mathrm{slow}}=\frac{1}{\kappa},
\qquad
\kappa\in\{1,10,100,1000\}.
$$

因為 cell 是慢–快–慢並且恰好重複，兩個 perfect-sink 邊界接觸的都是慢相。這個相位在評估前已鎖定。若把相同週期圖案平移，有限 $N$ 下靠近表面的瞬態可能改變；第一階段沒有對相位平均，也沒有做 boundary-phase ablation。

一維幾何還帶來很強的拓撲限制：每一層慢材料都橫跨整個截面，沒有任何繞路。因此本研究代表的是連續橫向障礙，而不是二維曲折路徑、孤立 inclusions、隨機孔隙或三維 percolating network。

<figure>
  <img src="/science/when-effective-diffusivity-stops-being-effective/p02_01_frozen_microstructure.svg" alt="繁中示意圖：四個重複的慢快慢二元單元置於兩個完美吸收邊界之間，右側列出對比一至一千時的調和與算術有效係數比值。" loading="lazy" />
  <figcaption>凍結的一維 cell 與兩個預先指定的標量 comparator。每個材料界面均對準 finite-volume face；邊界相位及 perfect sinks 沒有被改動。</figcaption>
</figure>

## 為何以調和係數作基準

對一維串聯層的穩態擴散，通量 $J$ 穿過每一層時保持不變，因此局部梯度滿足

$$
\frac{dc}{dx}=-\frac{J}{D(x)}.
$$

沿一個 cell 積分後，總阻力等於 $1/D$ 的空間平均倒數，所以週期有效係數是

$$
D_h=\left(\int_{\mathrm{cell}}\frac{dx}{D(x)}\right)^{-1}.
$$

代入快慢各半，可得

$$
D_h=\left(\frac{1/2}{D_{\mathrm{slow}}}+\frac{1/2}{D_{\mathrm{fast}}}\right)^{-1}
=\frac{2}{\kappa+1}.
$$

這個 $D_h$ 不是從釋放曲線擬合而來，而是由凍結 cell problem 解析推出。換言之，研究不是拿數據調出一個有利的「harmonic」答案。

### 同一個係數為何仍可有不同瞬態

把 cell resistance 相加，有助看清「係數正確」與「有限樣本已達極限」的差別。一個週期內，慢相雖只佔一半，卻以 $1/D_{\mathrm{slow}}=\kappa$ 的權重貢獻阻力；快相的對應權重只有一。因此 $\kappa$ 增大時，總阻力主要由慢層控制，$D_h$ 自然趨近 $2/\kappa$。這是 cell 尺度的串聯計算，沒有用到 $N$，所以只要 phase fractions 與 ordering 不變，不論薄板放一個還是三十二個 cell，解析 $D_h$ 都相同。

有限時間的濃度場卻知道 $N$。當 $N=1$，左右兩側各有一段相對厚的慢層，中央快層亦很厚；由均勻初值突然切換到兩端 perfect sinks 後，boundary depletion、內部重新分佈與跨慢層傳輸發生在可分辨的不同空間尺度。均質方程只有一個平滑濃度場，不能表示這些 cell-scale transients。當 $N$ 增加，每層厚度按比例變小，許多局部阻力在宏觀距離內重複，解析場才較容易接近以 $D_h$ 表示的平均場。

這段機理解釋與可靠性圖相容，但本文沒有把它冒充證明。六個離散 $N$ 值不能建立 asymptotic error bound，也沒有量測 boundary-layer corrector 或證明某個 convergence order。相同 resistance argument 對這個一維 series geometry 很自然；若層方向改成與主要通量平行，或在二、三維加入可繞過慢相的路徑，effective coefficient 會成為不同的平均或 tensor。正因如此，P02 的問題是「此 family 在此 gate 下何時足夠」，不是「所有異質材料應選哪個平均數」。

故意保留的 naive baseline 是算術係數

$$
D_a=\frac12D_{\mathrm{slow}}+\frac12D_{\mathrm{fast}}
=\frac12\left(1+\frac1\kappa\right).
$$

它相對調和值的比率為

$$
\frac{D_a}{D_h}=\frac{(\kappa+1)^2}{4\kappa}.
$$

在 $\kappa=10,100,1000$ 時，比率分別是 $3.025$、$25.5025$ 與 $250.50025$。對串聯層幾何，算術混合會愈來愈忽略慢層造成的瓶頸；它在這裡是刻意簡單的負向 baseline，不是這個方向上的嚴肅均質化公式。它在異質網格上表現很差，亦不能推導成「算術平均在所有方向和所有形貌都錯」。

## 鎖定同一個無因次時鐘

所有曲線都使用

$$
\tau=D_h t
$$

作橫軸。輸出間隔固定為 $\Delta\tau=0.001$，終點固定為 $\tau=0.6$。程式不會看到某案例較慢才為它延長 horizon。24 個解析 reference 都在這個鎖定終點前到達 $t_{50}$ 與 $t_{90}$，所以沒有 right censoring。

若均質薄板的係數是 $D$，定義 $r=D/D_h$。兩端 perfect sink 的解析釋放級數為

$$
F_{\mathrm{hom}}(\tau;r)
=1-\frac{8}{\pi^2}\sum_{m=0}^{\infty}
\frac{\exp\!\left[-(2m+1)^2\pi^2r\tau\right]}{(2m+1)^2}.
$$

實作使用 512 項。調和 comparator 有 $r=1$，所以在 normalized time 上，它對所有 contrast 都是同一條曲線；真正隨 $N$ 與 $\kappa$ 變化的是 finite-cell resolved curve。算術 comparator 使用 $r=D_a/D_h$，而經校準的 comparator 使用 $r=D_{\mathrm{fit}}/D_h$。

## 解析微結構 reference 如何計算

reference 採用守恆的 cell-centred finite-volume 離散。每個相界面都恰好落在 control-volume face 上，內部 face 的係數採用

$$
D_{i+1/2}=\frac{2D_iD_{i+1}}{D_i+D_{i+1}},
$$

也就是兩個半格的正確串聯阻力。canonical grid 有 256 cells，refined grid 有 512 cells。兩個數都能被每個宣告 $N$ 的 $4N$ 整除，因此慢四分之一、快二分之一、慢四分之一的結構不會被模糊成跨界面的 cell average。

時間推進使用 fixed-step backward Euler。canonical run 每個輸出間隔內有 128 個 substeps，refined run 有 256 個。對稱 implicit matrix 只被對角化一次，再透過 eigenvalue powers 重現重複的 backward-Euler 更新；不同案例不會得到事後調整的步長。

solver 同時記錄濃度上下界、$F$ 的單調性、backward-Euler recurrence residual、matrix symmetry、正的 off-diagonal face coefficients，以及空間守恆 audit。守恆檢查以 extended precision 組合 interior 與 boundary face fluxes，獨立驗證所有 cell divergences 會 telescopically 化成兩側 perfect-sink outflow。

## 先驗證，再容許分類

任何 adequate、grey 或 breakdown 標籤，都要等數值檢查全部過關才可被視為證據。

第一個檢查是均質負控制：以 1024-cell finite volume 對獨立解析薄板級數。最大絕對釋放誤差是

$$
2.1678142\times10^{-5},
$$

明顯低於凍結門檻 $2\times10^{-4}$。

第二個檢查是所有 24 案例的 joint space–time refinement。全網格最大的 canonical-to-refined release change 是

$$
1.0718674\times10^{-4},
$$

而門檻是 $2\times10^{-3}$。最大的相對 $t_{50}$ 變化為 $6.1278\times10^{-5}$，最大的相對 $t_{90}$ 變化為 $3.3340\times10^{-5}$，兩者都遠低於 $0.005$ 的事件 refinement 限制。

第三組是結構與守恆檢查。所有已保存濃度都留在 $[0,1]$ 外加 $10^{-10}$ 浮點容差內；最大值是 $1.0000000000320508$，最小值仍為正。release increments 全為正，最小值 $2.1552\times10^{-5}$。最大 operator asymmetry 為零，最小 off-diagonal coefficient 為正，最大 mass-balance residual 是 $2.274\times10^{-13}$，最大 backward-Euler recurrence residual 是 $4.091\times10^{-12}$。

九個 top-level scientific checks 均為 true：

1. 均質 finite-volume 解符合獨立解析級數；
2. 所有案例通過 joint space–time refinement；
3. 所有濃度保持在容差內；
4. 所有 release curves 單調；
5. 所有 mass audits 通過；
6. 所有 backward-Euler recurrence audits 通過；
7. 所有 operators 對稱且 face couplings 為正；
8. 所有材料 interfaces 都被精確表示；
9. 所有 reference $t_{50}$、$t_{90}$ 在鎖定 horizon 前發生。

### 數值誤差與模型誤差如何分開

這三層檢查各自回答不同的反駁。解析均質控制檢查的是：同一 solver 在沒有異質界面時，是否能重現已知 slab series；如果連這一步都失敗，後面的 harmonic discrepancy 可能只是 boundary implementation 或 time integration 錯誤。exact-interface 及 operator audits 檢查的是：binary coefficient 是否真的以宣告方式進入離散式，而沒有把 interface 錯置、把 arithmetic face value 當成 harmonic resistance，或破壞離散守恆。

joint space–time refinement 則問：把 cell 數與 protocol 保持不變，只同時加密 spatial cells 及 backward-Euler substeps，reference curve 與事件時間會不會顯著移動。全網格最大的 release change 只有 $1.0718674\times10^{-4}$，而分類涉及的 adequate threshold 是 $0.02$、breakdown threshold 是 $0.05$；事件 refinement changes 也遠低於相應 event gates。這種數量級分離並不證明 reference 是連續方程的精確解，卻足以排除「分類主要由目前離散誤差驅動」這個較簡單解釋。

濃度 bounds、monotone release、positive face coupling 與 mass telescoping 也不是裝飾性 tests。擴散方程在本設定下應保留非負濃度，兩端 perfect sinks 應令總質量只減不增；如果 numerical curve 出現負濃度、釋放倒退或無法由 boundary flux 解釋的質量消失，即使圖形看似平滑，也不能用來判讀有效係數。P02 先把這些 invariants 寫進機器可讀 check，再容許 C1–C3 claims 轉為 supported，正是把「程式跑完」與「結果可進入文章」分成兩個 gate。

<figure>
  <img src="/science/when-effective-diffusivity-stops-being-effective/p02_05_numerical_verification.svg" alt="繁中數值核查圖：左圖把均質 finite-volume 誤差與解析級數門檻比較，右圖顯示所有對比與週期數的聯合空間時間加密變化均很小。" loading="lazy" />
  <figcaption>獨立均質控制與 joint space–time refinement 把 finite-scale model discrepancy 與單純 under-resolution artifact 分開。圖中門檻在查看分類前已固定。</figcaption>
</figure>

## adequate、grey、breakdown 的凍結規則

對每一個異質案例，只有在最大曲線誤差

$$
\max_\tau|F_h-F_{\mathrm{FV}}|\le0.02
$$

並且兩個事件誤差同時滿足

$$
\frac{|t_{50,h}-t_{50,\mathrm{FV}}|}{t_{50,\mathrm{FV}}}\le0.02,
\qquad
\frac{|t_{90,h}-t_{90,\mathrm{FV}}|}{t_{90,\mathrm{FV}}}\le0.02
$$

時，調和模型才是 adequate。若最大曲線誤差至少 $0.05$，或任何一個事件誤差至少 $0.05$，案例就是 breakdown；落在兩組規則之間的是 grey。所有不等號都包含等號。

聯合規則避免只看一個 trajectory norm 而得出誤導分類。例如在 $N=4$，三個 contrast 的最大調和曲線誤差約為 $3.7\%$ 至 $4.2\%$，尚未觸及 $5\%$ 的曲線 breakdown 門檻；可是其相對 $t_{50}$ 誤差由 $5.96\%$ 起，因此三例仍全部是 breakdown。事件 gate 在這裡捕捉到曲線摘要所關心的時間偏移。

協議也容許沒有漂亮邊界的結果。如果所有案例都 adequate，或者所有案例都 breakdown，程式仍須報告，而不是改動 $N$、$\kappa$ 或門檻去製造更有故事性的圖片。

### grey 類別不是含糊帶過

二元 pass/fail 很容易把不同程度的偏差擠成同一結論。這裡的 grey 有明確集合定義：案例沒有同時通過全部 $2\%$ adequate conditions，但亦沒有任何指標到達 $5\%$ breakdown condition。它不是研究者憑視覺覺得「差不多」，也不是允許事後挑選最有利 metric 的保留區。以 $N=8$ 的兩個高 contrast 案例為例，真正阻止 adequate 的只是最大 trajectory error 稍高於 $2\%$；兩個 event errors 仍低於 $2\%$，而所有指標離 $5\%$ breakdown 還很遠。把它們寫成 breakdown 會誇大結果，把它們寫成 adequate 又會違反 protocol。

grey 的存在亦提醒讀者，「effective enough」必須相對一個用途及 tolerance 定義。本研究選擇 whole-curve maximum error 加兩個 event errors，是因為只看平均平方誤差可能掩蓋局部時間偏移；但另一個應用若關心 flux peak、特定早期區間或不同 crossing level，可靠性地圖可合理地不同。本文沒有證明這組 gates 是臨床或工業標準，它們只是一組在結果前鎖定、能被一致重算的 benchmark decision rules。

此外，24-case 表中的 $\kappa=1$ controls 不會被偷偷加入「七個 adequate」來提高成功比例。七、二、九的分母固定為 18 個 heterogeneous cases；六個 homogeneous controls 的角色是確認 geometry generator 與 comparators 在沒有 contrast 時回到相同問題。這種分母與 control 分工若不說清楚，很容易把方法驗證和研究發現混在一起。

## 18 個異質案例的完整可靠性圖

精確分類如下：

| 對比 | $N=1$ | $N=2$ | $N=4$ | $N=8$ | $N=16$ | $N=32$ |
|---:|---|---|---|---|---|---|
| $\kappa=10$ | breakdown | breakdown | breakdown | adequate | adequate | adequate |
| $\kappa=100$ | breakdown | breakdown | breakdown | grey | adequate | adequate |
| $\kappa=1000$ | breakdown | breakdown | breakdown | grey | adequate | adequate |

在 $\kappa=10$，最大調和 release error 隨 $N$ 倍增，依序由 $14.90\%$ 降到 $7.39\%$、$3.70\%$、$1.85\%$、$0.803\%$、$0.184\%$。在 $\kappa=100$，$N=1,8,16$ 的對應數字是 $17.11\%$、$2.098\%$、$0.923\%$。在 $\kappa=1000$，三個數字是 $17.35\%$、$2.123\%$、$0.935\%$。這個下降是凍結 family 上的數值趨勢，本文沒有從六個 $N$ 值擬合或宣稱普遍收斂率。

$N=8$ 清楚顯示 contrast 為何會在邊界附近重要。對 $\kappa=10$，最大曲線誤差 $1.8535\%$、$t_{50}$ 誤差 $1.4473\%$、$t_{90}$ 誤差 $0.4988\%$，全部通過 adequate gate。對 $\kappa=100$，最大誤差為 $2.0983\%$，剛超過 adequate 的 $2\%$ trajectory threshold，但離 breakdown 很遠；事件誤差是 $1.6828\%$ 與 $0.6224\%$。對 $\kappa=1000$，最大誤差 $2.1229\%$，事件誤差 $1.7079\%$ 與 $0.6365\%$。後兩例因此必須叫 grey，而不能寫成失敗。

到 $N=16$，三個 contrast 全部 adequate。即使 $\kappa=1000$，最大 release error 也只有 $0.9349\%$，相對 $t_{50}$ 誤差 $0.4344\%$，相對 $t_{90}$ 誤差 $0.1625\%$。在 $N=32$，三個最大誤差均約為 $0.2\%$ 或更低。這些數字說明「在本網格上愈細愈接近」，但不能把 $N$ 單獨抽離於 cell geometry、邊界及 tolerance 使用。

<figure>
  <img src="/science/when-effective-diffusivity-stops-being-effective/p02_03_harmonic_reliability_map.svg" alt="繁中可靠性圖：18 個異質案例按調和模型的 adequate、grey 與 breakdown 分類；一、二、四週期全為 breakdown，八週期有一個 adequate 與兩個 grey，更細週期全部 adequate。" loading="lazy" />
  <figcaption>在 trajectory、$t_{50}$、$t_{90}$ 的聯合門檻下共有七個 adequate、兩個 grey、九個 breakdown。此圖只涵蓋一個對稱邊界相位與一個週期二元 family。</figcaption>
</figure>

## 兩條代表曲線應如何閱讀

最粗且最高對比的 $(\kappa,N)=(1000,1)$ 是明確 breakdown。其最大調和 release error 為 $0.1734715347$，相對 $t_{50}$ 與 $t_{90}$ 誤差分別為 $0.4602346733$ 與 $0.4154322382$。解析微結構 reference 在 normalized time 的事件是 $\tau_{50}=0.09112022838$、$\tau_{90}=0.36269782418$；調和曲線則在 $0.04918353984$ 與 $0.21202145529$ 到達，明顯過早釋放。

同一 $\kappa=1000$ 但 $N=32$ 時，resolved curve 幾乎與 harmonic curve 疊合，並通過 adequate gate。係數仍然是 $D_h=2/1001$；改變的是 scale separation。同樣的慢、快相各佔一半，但 32 個重複 cell 把兩相分佈得更細，有限瞬態因而更接近週期極限。

算術曲線則因 $\kappa=1000$ 時 $D_a/D_h=250.50025$，在 normalized time 幾乎立即釋放。這與串聯阻力的預期一致，卻仍然只針對這種 orientation。若材料改成平行層、可繞行 inclusions 或三維 connected pores，適當的 effective tensor 及 averaging structure 都可能不同。

<figure>
  <img src="/science/when-effective-diffusivity-stops-being-effective/p02_02_release_trajectories.svg" alt="繁中雙 panel 釋放曲線：在對比一千下比較一個與三十二個週期的解析 reference、調和、算術及早期擬合曲線，展示 breakdown 與 adequate 兩個 regime。" loading="lazy" />
  <figcaption>調和係數固定不變，只改 finite cell count，瞬態協議便由 breakdown 走到 adequate。所有曲線沿用同一 normalized-time grid 與事件插值規則。</figcaption>
</figure>

## 早期擬合與真正的 held-out 檢查

校準 comparator 在

$$
D_{\mathrm{fit}}\in[D_{\mathrm{slow}},D_{\mathrm{fast}}]
$$

內搜尋一個標量，只使用 resolved curve 滿足

$$
0.1\le F_{\mathrm{FV}}\le0.5
$$

的 indices。目標是該早期 window 上的均方誤差；搜尋以 bounded log-scale golden-section 完成 96 次 iteration。$F>0.5$ 的曲線點與 $t_{90}$ 完全不進入 objective，因此後段是實際 held-out audit，不是同一資料上的重新命名。

預先宣告的見證條件是：早期最大誤差不超過 $0.02$，但 held-out 相對 $t_{90}$ 誤差至少 $0.05$。結果只有三個案例符合，而且全是 $N=1$：

| 見證 | $D_{\mathrm{fit}}/D_h$ | 早期最大誤差 | held-out 最大誤差 | held-out $t_{90}$ 誤差 |
|---|---:|---:|---:|---:|
| $(10,1)$ | $0.5690446013$ | $0.0075218043$ | $0.0265728009$ | $0.1110904572$ |
| $(100,1)$ | $0.5254371462$ | $0.0084467229$ | $0.0288701020$ | $0.1209184151$ |
| $(1000,1)$ | $0.5211597085$ | $0.0085640715$ | $0.0290409401$ | $0.1216676927$ |

三個 fitted ratios 都約為 $0.52$ 至 $0.57$，表示 optimizer 用一個比 $D_h$ 更慢的 scalar 去追上 coarse-cell 的早期形狀；然而單一 homogeneous curve 仍不能同時重現後段事件。這是一個 model-form mismatch 的具體表現，但因為只有三個見證、單一 fit window 與單一 geometry，不能上升成所有 calibration 的一般結論。

校準成本與 resolved calibration data 亦不是免費的。$D_h$ 由 cell problem 解析取得，$D_a$ 是 naive mixture，$D_{\mathrm{fit}}$ 則消耗解析曲線資料及 optimization。三者回答不同問題，setup cost 不匹配；本文沒有做 efficiency ranking，也沒有聲稱 early fitting 是可部署的 parameter-estimation 方法。

<figure>
  <img src="/science/when-effective-diffusivity-stops-being-effective/p02_04_early_fit_holdout.svg" alt="繁中散點圖：18 個異質案例的早期 window 最大誤差對 held-out t90 誤差，並以門檻線及標籤突出三個一週期見證。" loading="lazy" />
  <figcaption>三個填色的 $N=1$ 點通過 early-window gate，卻跨過 held-out late-event gate。所有 calibration indices 都在 resolved release fraction $0.5$ 或之前停止。</figcaption>
</figure>

## 結果真正說了甚麼

最強而仍被證據支持的句子是：

> 對這個固定的 diffusion-only periodic slab，harmonic-model agreement 在凍結網格上隨 cell count 增加而改善；經獨立數值驗證後，24 案例網格同時包含 adequate 與 breakdown regimes。

可靠性圖也顯示 boundary 附近的 contrast effect。八個 cell 已足以令 $\kappa=10$ 通過全部 adequate gates，但兩個較高 contrast 仍稍微超過 trajectory 的 $2\%$ threshold，因而是 grey。十六個 cell 對三個已測 contrast 都 adequate。

不過，結果沒有識別一個 universal cell count。改動 boundary phase、volume fraction、layer ordering、event thresholds、sink condition、reporting norm、time horizon 或 dimensionality，地圖都可能移動。P02 沒有完成這些 ablations。它更沒有由 24 個 synthetic cases 推論真實製劑、患者或臨床結果。

早期擬合結論同樣狹窄：存在三個凍結見證，curve-calibrated scalar 可通過宣告的 early window，卻在 held-out $t_{90}$ 失敗。這不是「所有 fitted diffusivity 不可信」，也不表示 $t_{90}$ 具有臨床意義；$t_{90}$ 在此只是未參與擬合的晚期曲線事件。

## PASS 前保留的失敗紀錄

環境紀錄有四次失敗起步。system Python 缺少 NumPy；bundled runtime 缺少 SciPy，促使實作改為 NumPy-only solver，而不是私下安裝未聲明依賴；research virtual environment 在載入 NumPy compiled extension 時失敗；Conda environment 印出六個通過的 test dots，之後在 NumPy eigensolver 以 Windows code $0xc06d007f$ crash。這些被分類為 environment failures，不是科學結果。

更重要的是，最初兩次 canonical scientific attempts 也回傳 **FAIL**，因為原先 mass audit 未通過。當時暫時生成的 adequate、grey、breakdown lists 與 early-fit witnesses 都被保存，但明確標成 **BLOCKED**，不得進入 claim ledger。最終 solver 以 extended precision 組裝 interface 及 boundary fluxes，檢查空間 divergence 是否 telescope，並把這個 audit 與 reconstructed time-layer subtraction 分開。為了取得 PASS，model、24-case grid、thresholds 與 fit window 都沒有放寬。

修正 audit 後，最近兩次 canonical attempts 均為 **PASS**，而且有完全相同的 numerical signature：

$$
\texttt{97e2212131f533a38d79897966c3cfdd028b16f8868e922c73eb6ab853141e2e}.
$$

兩次在記錄的 Windows/Python 環境所量得 runtime 約為 $4.11$ 與 $3.80$ 秒。runtime 不包含在 deterministic signature 中，也沒有被用作方法速度比較。

九個 mathematical unit tests 通過，覆蓋 effective coefficients、exact-interface volume fraction、harmonic face flux、analytic slab series、event interpolation 與 censoring、operator structure、spectral backward Euler 對 direct solve、held-out-fit leakage，以及 inclusive classification thresholds。repository checker 與 two-run reproducibility checker 亦通過。

## 圖像完整性與實際視覺檢查

五張 publication figures 均由 saved result JSON、frozen configuration 及 reproducibility record 生成。每張都有 native SVG、vector PDF、600-dpi PNG、manifest 與 publish SVG；受管 publish SVG 的 hash 與 canonical source 相符。SVG 文字保持 live text，黑色文字有明確設定，顏色亦配合 line style、marker、fill code 或文字標籤，不以顏色作唯一編碼。

最終 PNG 以原始 $4296\times2160$ 尺寸檢查 title 與 panel 分隔、legend clearance、annotation collisions、axis-label clipping、footer placement 及邊緣 clipping。微結構 labels 與 comparator legend 清楚；兩個 trajectory panels 與 shared legend 沒有碰撞；可靠性地圖每格可讀；三個 early-fit witness labels 互相分開；兩個 verification panels、門檻、legend 與 footer 都在畫布內。本文只嵌入已通過的最終 revision。

視覺檢查只能證明 layout integrity，不能替代科學驗證。所有數值主張仍來自 machine-readable result，而不是從圖上量像素。

## 如何重現這個基準

私人技術 repository 的 P02 目錄保留 frozen configuration、source、unit tests、results、attempt history、figure generator、hashes、machine-readable Phase-1 result、research contract、literature gate 及 claim ledger。公開 Blog 刻意只展示經審閱的詮釋與獲准圖像；可重現證據仍以技術紀錄為準，亦不向訪客提供失效的私人連結。

在 P02 目錄及已驗證 Python 環境中，核心命令是：

~~~powershell
python scripts/run_phase1.py --config configs/phase1.json
python -m unittest discover -s tests -v
python scripts/check_repo.py
python scripts/check_reproducibility.py --config configs/phase1.json
python scripts/plot_phase1.py
~~~

成功重現應顯示九個 tests 為 OK、repository 與 reproducibility checks 為 PASS、最近兩次成功 run 的 signatures 相同，並保留 frozen scientific signature 97e221…41e2e。實際 runtime 可以因硬件與系統負載不同而改變。

## 無法被一個平均數消除的限制

**只有一維。** 慢層橫跨截面，沒有 path-connectivity choice、tortuosity distribution、random pore network 或 percolation topology。即使 phase fractions 相同，二維或三維材料也可能不同。

**只有一個相位配置。** 每個 cell 都是 slow-quarter、fast-half、slow-quarter，兩個 sinks 都碰到慢材料。boundary-phase effects 是已知的 finite-cell 風險，但本階段刻意沒有探索。

**只有一種 constitutive mechanism。** $D(x)$ 靜態而且與 concentration 無關。model 排除 swelling、erosion、degradation、dissolution、binding、reaction、stress coupling、moving fronts 與 non-Fickian memory。

**只有 perfect sinks。** 兩側 boundary concentration 立即降至零。finite external mass transfer、asymmetric reservoirs、surface resistance 與 changing sink conditions 都不存在。

**時間及事件是合成量。** $\tau$、$t_{50}$、$t_{90}$ 只是無因次曲線量，沒有被映射到 exposure、efficacy、toxicity、dose、treatment schedule 或 patient outcome。

**網格有限。** 四個 contrasts 與六個 cell counts 不能提供 theorem、convergence rate 或 universal validity boundary。分類亦依賴已固定的 $2\%$ 與 $5\%$ gates。

**comparator 成本不對稱。** $D_h$ 是解析量，$D_a$ 是 naive baseline，$D_{\mathrm{fit}}$ 消耗 resolved calibration data 及 optimization。三者沒有 matched setup cost，因此結果不是 efficiency 或 total-cost comparison。

**沒有 final evaluation。** 更廣幾何、boundary shifts、random 或 imaged structures、external calibration 及 final held-out evaluation 仍被鎖定。第一階段是 reproducible benchmark，不是 formulation recommendation。

## 仍然鎖定的下一階段

較完整的研究計劃可以先預註冊，再逐項解鎖：

- 在同一一維 cell 上系統改動 boundary phase；
- 改變 phase fractions 與 layer ordering；
- 研究 finite-$N$ error 的經驗或理論 scaling；
- 比較二維 connected 與 disconnected microstructures；
- 使用有 provenance 的 random 或 image-derived morphology；
- 改用 finite mass-transfer boundary conditions；
- 加入 concentration-dependent 或 multicomponent constitutive models；
- 分別研究 swelling、degradation、erosion、binding、reaction 或 moving boundaries；
- 進行 physical calibration 與 external experimental validation；
- 保留真正 final held-out evaluation，再決定可刊登 claim。

本文沒有暗示這些階段已經運行，也不能從 24-case chart 推算它們的答案。這種鎖定不是缺點包裝，而是把第一階段證據與未來研究清楚分界。

## 最有用而不誇大的結論

有效係數回答的是尺度極限問題；有限釋放實驗回答的是瞬態、邊界條件化問題。在這個 frozen slab 中，當尺度分離足夠清楚，兩者在宣告門檻內一致；當整塊薄板只包含一、二或四個粗 cell，兩者就不一致。

因此，研究不是說「effective diffusivity 沒有效」。它實際標出調和係數何時已足以重現一條釋放曲線及兩個事件容差，以及何時未達標，同時把 numerical error 壓在觀察差異以下。

三個 early-fit witnesses 補充另一層警告：曲線前半段校準良好，不能保證晚期事件正確。這項證據之所以有意義，是因為 held-out boundary 在擬合前已固定，而非看到結果後才切資料。

最誠實的結尾必須保持條件式：**在這一個合成、diffusion-only 的週期薄板中，scale separation 改善時調和有效擴散率逐漸可靠；粗的 finite-cell transient 與只用早期資料的 calibration，則可跨過預先宣告的 failure gates。**

## 文獻 gate 保留的 primary literature

1. S. K. Chandrasekaran 與 R. Hillman，〈Heterogeneous model of drug release from polymeric matrix〉，*Journal of Pharmaceutical Sciences* 69（1980），[DOI 10.1002/jps.2600691119](https://doi.org/10.1002/jps.2600691119)。
2. Jean-Louis Auriault 與 Jolanta Lewandowska，〈Effective Diffusion Coefficient: From Homogenization to Experiment〉，*Transport in Porous Media* 27（1997），[DOI 10.1023/A:1006599410942](https://doi.org/10.1023/A:1006599410942)。
3. Jee E. Rim、Peter M. Pinsky 與 William W. van Osdol，〈Using the method of homogenization to calculate the effective diffusivity of the stratum corneum〉，*Journal of Membrane Science* 293（2007），[DOI 10.1016/j.memsci.2007.02.018](https://doi.org/10.1016/j.memsci.2007.02.018)。
4. David M. Saylor、Chang-Soo Kim、Dinesh V. Patwardhan 與 James A. Warren，〈Modeling microstructure development and release kinetics in controlled drug release coatings〉，*Journal of Pharmaceutical Sciences* 98（2009），[DOI 10.1002/jps.21416](https://doi.org/10.1002/jps.21416)。
5. Timo Johannes Laaksonen、Hannu Mikael Laaksonen、Jouni Tapio Hirvonen 與 Lasse Murtomäki，〈Cellular automata model for drug release from binary matrix and reservoir polymeric devices〉，*Biomaterials* 30（2009），[DOI 10.1016/j.biomaterials.2008.12.028](https://doi.org/10.1016/j.biomaterials.2008.12.028)。
6. Ferdinand Brandl、Fritz Kastner、Ruth M. Gschwind、Torsten Blunk、Jörg Tessmar 與 Achim Göpferich，〈Hydrogel-based drug delivery systems: comparison of drug diffusivity and release kinetics〉，*Journal of Controlled Release* 142（2010），[DOI 10.1016/j.jconrel.2009.10.030](https://doi.org/10.1016/j.jconrel.2009.10.030)。
7. James A. Kimber、Sergei G. Kazarian 與 František Štěpánek，〈Microstructure-based mathematical modelling and spectroscopic imaging of tablet dissolution〉，*Computers & Chemical Engineering* 35（2011），[DOI 10.1016/j.compchemeng.2010.07.008](https://doi.org/10.1016/j.compchemeng.2010.07.008)。
8. Zbisław Tabor、Paweł Nowak、Małgorzata Krzak 與 Piotr Warszyński，〈Effective diffusivity in transient state〉，*The Journal of Chemical Physics* 139（2013），[DOI 10.1063/1.4818579](https://doi.org/10.1063/1.4818579)。
9. Julia Grund、Martin Körber 與 Roland Bodmeier，〈Predictability of drug release from water-insoluble polymeric matrix tablets〉，*European Journal of Pharmaceutics and Biopharmaceutics* 85（2013），[DOI 10.1016/j.ejpb.2013.08.007](https://doi.org/10.1016/j.ejpb.2013.08.007)。
10. Ali Salehi、Jin Zhao、Tim D. Cabelka 與 Ronald G. Larson，〈A unified multicomponent stress-diffusion model of drug release from non-biodegradable polymeric matrix tablets〉，*Journal of Controlled Release* 224（2016），[DOI 10.1016/j.jconrel.2015.12.045](https://doi.org/10.1016/j.jconrel.2015.12.045)。
11. Preston Donovan、Yasaman Chehreghanianzabi、Muruhan Rathinam 與 Silviya Petrova Zustiak，〈Homogenization Theory for the Prediction of Obstructed Solute Diffusivity in Macromolecular Solutions〉，*PLOS ONE* 11（2016），[DOI 10.1371/journal.pone.0146093](https://doi.org/10.1371/journal.pone.0146093)。
12. Sandra Barman 與 David Bolin，〈A three-dimensional statistical model for imaged microstructures of porous polymer films〉，*Journal of Microscopy* 269（2018），[DOI 10.1111/jmi.12623](https://doi.org/10.1111/jmi.12623)。
13. T.-C. Wang 與 Wei-Bor Tsai，〈A biphasic mathematical model for the release of polymer-drug conjugates from poly(vinyl alcohol) hydrogels〉，*Journal of the Taiwan Institute of Chemical Engineers* 135（2022），[DOI 10.1016/j.jtice.2022.104395](https://doi.org/10.1016/j.jtice.2022.104395)。
14. Patrick A. Giolando 等人，〈Mechanistic Computational Modeling of Implantable, Bioresorbable Drug Release Systems〉，*Advanced Materials* 35（2023），[DOI 10.1002/adma.202301698](https://doi.org/10.1002/adma.202301698)。
15. Marc Graham 與 Sandra Klinge，〈Multiscale homogenisation of diffusion in enzymatically-calcified hydrogels〉，*Journal of the Mechanical Behavior of Biomedical Materials* 149（2024），[DOI 10.1016/j.jmbbm.2023.106244](https://doi.org/10.1016/j.jmbbm.2023.106244)。
