---
title: "Michaelis-Menten 何時不再有效"
slug: when-michaelis-menten-stops-being-valid
sourceSlug: when-michaelis-menten-stops-being-valid
summary: 一個 243 組參數圖譜把 Michaelis-Menten 動力學視為可檢驗的模型降階，標示軌跡或事件時間誤差何時變得重要。
date: 2026-07-30
lastUpdated: 2026-07-30
featured: true
topics: [酶動力學, 模型降階, 準穩態近似, 奇異攝動, 慢流形]
heroImage: /science/michaelis-menten-qssa-validity/qssa-validity-atlas.svg
type: Research Notes
archived: false
readingMinutes: 20
scienceProject: michaelis-menten-qssa-validity
redirectFrom: []
---

Michaelis-Menten 速率律太常見，以致它有時看來像一條不需條件的構成定律：

$$
v(S)=\frac{V_{\max}S}{K_m+S}.
$$

其實它是由較完整反應機制降階而來，核心假設是酶–底物複合物會迅速接近一條準穩態關係，而底物與產物在較慢尺度上改變。

這個近似可以非常準確，但「準確」必須同時指定參數區域、輸出、時間範圍與容許誤差。降階模型可能準確預測最終轉化，卻錯估到達門檻的時間；亦可能配合後期產物數據，卻錯過最初的快速過渡。

本研究因此把 Michaelis-Menten 當作需要審核的模型，在 243 組合成參數上與完整質量作用動力學比較，量度不同誤差何時變得重要。

## 完整機制與降階定律

反應機制為

$$
E+S
\underset{k_{-1}}{\stackrel{k_1}{\rightleftharpoons}}
C
\stackrel{k_2}{\longrightarrow}
E+P.
$$

總酶守恆給出 \(E=E_0-C\)，所以

$$
\frac{dS}{dt}
=-k_1(E_0-C)S+k_{-1}C,
$$

$$
\frac{dC}{dt}
=k_1(E_0-C)S-(k_{-1}+k_2)C,
$$

$$
\frac{dP}{dt}=k_2C.
$$

Michaelis 常數是

$$
K_m=\frac{k_{-1}+k_2}{k_1}.
$$

標準準穩態近似令 \(dC/dt\approx0\)，得到

$$
C\approx\frac{E_0S}{K_m+S}
$$

與

$$
\frac{dS}{dt}
\approx-\frac{k_2E_0S}{K_m+S}.
$$

這個降階刪去一個動態變數，也刪去最初形成複合物的快速層。只有當被刪除過渡相對研究輸出既快且小，簡化才合理。

## 三個無因次控制量

圖譜改變

$$
\varepsilon=\frac{E_0}{S_0+K_m},
\qquad
\sigma=\frac{S_0}{K_m},
\qquad
\rho=\frac{k_2}{k_{-1}}.
$$

\(\varepsilon\) 比較酶量與底物加 Michaelis 尺度；\(\sigma\) 區分底物不足與飽和區域；\(\rho\) 改變催化與複合物解離的相對重要性。

時間以慢速底物消耗尺度

$$
t_s=\frac{K_m+S_0}{k_2E_0}
$$

無因次化。預設網格對 \(\varepsilon\) 使用由 \(0.002\) 至 \(0.60\) 的九個對數間距值，\(\sigma\) 由 \(0.05\) 至 \(20\) 亦有九值，再乘三個催化比 \(0.1,1,10\)：

$$
9\times9\times3=243
$$

次完整與降階模型比較。

## 有效性圖譜，而不是一句口號

每組參數都在共同無因次時間 \(0\le\tau\le6\) 上積分。主要指標是最大標準化產物誤差：

$$
E_P
=
\max_{0\le\tau\le6}
\frac{\left|P_{\mathrm{full}}(\tau)
-P_{\mathrm{QSSA}}(\tau)\right|}{S_0}.
$$

<figure class="article-figure">
  <img src="/science/michaelis-menten-qssa-validity/qssa-validity-atlas.svg" alt="在中間催化比切片上，最大標準化產物誤差隨 epsilon 與 sigma 變化的熱圖。" width="960" height="580" loading="eager" decoding="async" />
  <figcaption><strong>圖 1。</strong> 全部 243 組的最大產物誤差介乎 \(5.40\times10^{-4}\) 與 \(0.2662\)；最差測試點是 \(\varepsilon=0.60,\sigma=0.05\)。</figcaption>
</figure>

較差角落的酶量相對可用底物很高，而且底物遠低於飽和。此時複合物形成過渡相對整段轉化不再可以忽略。

熱圖迫使我們使用比「酶少時 Michaelis-Menten 有效」更精確的語句。有效性是一個漸變表面，亦會隨其他比例及上色指標改變。

## 小 \(\varepsilon\) 是否足夠

經典條件

$$
\varepsilon\ll1
$$

十分有用。圖譜亦確認 \(\varepsilon\) 下降時，誤差一般會下降；但它不支持脫離情境的固定 cutoff。

<figure class="article-figure">
  <img src="/science/michaelis-menten-qssa-validity/error-scaling.svg" alt="多個底物飽和水平下，最大產物誤差隨 epsilon 改變的曲線。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong> 誤差向小 \(\varepsilon\) 區下降，但大小與斜率取決於 \(\sigma\)。例如 \(\varepsilon&lt;0.1\) 的門檻必須配合特定輸出與容許誤差。</figcaption>
</figure>

一次近似決策至少有四個成分：

1. **參數區域：**哪些比例在問題中合理；
2. **輸出量：**產物、底物、複合物或事件時間；
3. **時間範圍：**最初過渡、主要消耗期或後期轉化；
4. **容許誤差：**多大偏差會改變科學或工程決策。

圖譜同時記錄最大與 RMS 產物誤差、底物誤差、複合物誤差，以及到達 50% 與 90% 轉化的相對時間誤差。沒有一個數字能支配所有用途。

## 初始層是兩個故事分開之處

完整系統由 \(C(0)=0\) 開始，先要形成酶–底物複合物才會有明顯產物。QSSA 則由代數關係

$$
C_{\mathrm{QSSA}}(S)
=\frac{E_0S}{K_m+S}
$$

直接開始。

<figure class="article-figure">
  <img src="/science/michaelis-menten-qssa-validity/representative-trajectories.svg" alt="良好、邊界與失效參數組合中的完整質量作用與 QSSA 產物軌跡。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 3。</strong> 良好案例的初始層短，對產物影響很小；失效案例中，形成複合物佔整個過程的重要部分，降階軌跡因此過早前進。</figcaption>
</figure>

這會影響推斷。如果觀察只在過渡後開始，降階模型可能很好地配合產物數據，同時錯誤描述早期複合物動態。受限時間窗內的好 fit 不能證明被刪除機制在所有時間都不重要。

反過來，若決策只關心後期轉化，而且誤差低於容許值，早期 mismatch 亦不必令模型完全無用。有效性是任務相對的，不是非黑即白。

## 軌跡看似接近，時間仍可出錯

若模型用來安排取樣、給藥間隔或反應器停留時間，事件時間可能比整體軌跡 norm 更重要。

定義半轉化相對誤差

$$
E_{t_{50}}
=
\frac{|t_{50}^{\mathrm{QSSA}}-t_{50}^{\mathrm{full}}|}
{t_{50}^{\mathrm{full}}}.
$$

<figure class="article-figure">
  <img src="/science/michaelis-menten-qssa-validity/t50-error-atlas.svg" alt="到達百分之五十轉化時間的相對誤差隨 epsilon 與 sigma 變化的熱圖。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 4。</strong> 半轉化時間邊界與最大產物誤差邊界不同；兩條軌跡看似接近，也可能在有操作意義的門檻上產生明顯時間差。</figcaption>
</figure>

這是模型降階的通用原則：應在真正驅動決策的量上定義誤差。小 \(L^2\) 軌跡誤差不保證門檻時間、峰值時間或控制動作誤差同樣小。

## QSSA 有效的幾何原因

在縮放變數中，QSSA 關係是

$$
c_{\mathrm{QSSA}}(s)
=\frac{\sigma s}{1+\sigma s}.
$$

它可視為一條吸引的低維關係，即慢流形近似。完整軌跡先快速靠近該關係，再隨底物消耗沿它緩慢演化。

<figure class="article-figure">
  <img src="/science/michaelis-menten-qssa-validity/slow-manifold.svg" alt="完整酶動力學軌跡快速接近並沿 QSSA 慢流形移動。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 5。</strong> 幾何上，降階是在快速過渡後把運動投影到慢動力學；當兩個時間尺度分隔不足，這個投影便失準。</figcaption>
</figure>

這幅圖比「複合物濃度是常數」更準確。複合物不是全程不變，而是迅速調整至由慢速底物決定、並隨時間移動的關係。

當 \(\varepsilon\) 很小，靠近慢流形遠快於底物消耗；當 \(\varepsilon\) 較大，快慢階段重疊，以受限於流形的運動取代完整路徑便會有明顯誤差。

## 已核證內容

小 \(\varepsilon\) 情況較 stiff，因此完整模型以 implicit Radau solver 積分。降階方程獨立求解，兩者再於相同無因次時間網格比較。

三項自動測試在指定 Python 3.12 與 SciPy 1.16 環境通過，驗證總底物守恆

$$
S+C+P=S_0,
$$

降階模型的底物單調下降，以及小 \(\varepsilon\) 的 QSSA 誤差低於一個大 \(\varepsilon\) 對照。全部 21 個生成輸出均通過 checksum 驗證。

圖譜沒有 Monte Carlo 不確定性，因為兩個系統都是確定性的。它的不確定性來自結構：參數覆蓋、誤差定義、數值 tolerance 與省略化學。

## 圖譜沒有證明甚麼

機制假設單一底物、單一中間複合物、不可逆產物形成、完全混合與固定速率係數。它省略：

- 產物與底物抑制；
- 酶失活；
- cooperative 或 allosteric binding；
- 多個複合物或競爭底物；
- 空間擴散與傳輸；
- 低分子數隨機效應；
- 參數估計不確定性。

最差測試點不是普遍最差，只是已聲明網格內最差。擴大範圍、改變初值或輸出，都可能移動失效區。

研究只評估 standard QSSA；total QSSA 與 reverse QSSA 在其他區域可能更適合。真正模型選擇流程應比較多種降階，而不是強迫一個近似覆蓋全部參數空間。

## 把圖譜變成決策工具

下一個實現可接受：

- 合理參數範圍或 posterior samples；
- \(P(t)\)、\(t_{50}\)、複合物峰值或 fitted parameter 等輸出；
- 時間範圍；
- 容許誤差。

系統再返回降階模型符合 tolerance 的機率，並展示代表性失效軌跡。Adaptive sampler 可集中細化有效性邊界，毋須在明顯安全與失效區平均花費計算。

推斷方面，可由完整模型生成 synthetic data，再用 QSSA fit。這能揭示的不只是預測誤差，還有參數偏差：降階模型可能透過扭曲 \(V_{\max}\) 或 \(K_m\) 去配合觀察。

核心結論超越酶動力學：**降階模型的有效性屬於任務，而不是來自名氣**。Michaelis-Menten 的力量正是把快慢機制壓縮成簡潔定律；亦因如此，我們更應在實際用途上檢驗這次壓縮。

## 參考文獻

1. Michaelis, L., & Menten, M. L. (1913). Die Kinetik der Invertinwirkung. *Biochemische Zeitschrift, 49*, 333–369.
2. Johnson, K. A., & Goody, R. S. (2011). The original Michaelis constant: Translation of the 1913 Michaelis-Menten paper. *Biochemistry, 50*, 8264–8269. [https://doi.org/10.1021/bi201284u](https://doi.org/10.1021/bi201284u)
3. Segel, L. A., & Slemrod, M. (1989). The quasi-steady-state assumption: A case study in perturbation. *SIAM Review, 31*, 446–477. [https://doi.org/10.1137/1031091](https://doi.org/10.1137/1031091)
4. Segel, L. A., & Edelstein-Keshet, L. (2013). *A Primer on Mathematical Models in Biology*. SIAM.
