---
title: "追蹤市電噪聲，同時保留肌電訊號"
slug: tracking-mains-noise-without-losing-the-muscle-signal
sourceSlug: tracking-mains-noise-without-losing-the-muscle-signal
summary: 一項可重現的合成實作研究，把因果 sEMG 快速路徑與帶閘門的頻率追蹤器分開，測試諧波消除、包絡保真度與主機 Python 計時，而不冒充參與者或嵌入式裝置驗證。
date: 2026-07-30
lastUpdated: 2026-07-30
featured: true
topics: [表面肌電, 生物醫學訊號處理, 自適應濾波, 市電干擾, 即時系統, 包絡估計]
heroImage: /science/semg-real-time-conditioning/pipeline.svg
type: Research Notes
archived: false
readingMinutes: 20
scienceProject: semg-real-time-conditioning
redirectFrom: []
---

表面肌電（sEMG）難以處理，因為要保留的訊號與要移除的干擾並非存在於完全分離的頻帶。

有用波形具有隨機性、非平穩性，並分佈於一段頻譜；市電干擾（PLI）雖然窄頻，卻不是固定不變。名義上的 50 Hz 可以漂移、產生諧波，亦會因電極與導線狀況而以不同方式耦合。很深的固定 notch 可移除干擾，同時也會挖走附近生理訊號；每個樣本都做重型頻譜估計又會破壞低延遲設計。

所以本研究問的是一個架構問題：

> 可否由較慢的監督程序追蹤會漂移的諧波干擾，同時令逐樣本 sEMG 路徑保持因果、簡單而可量度？

這是一項可重現的實作實驗，不是醫療器材研究。所有隨附效能數字均來自受控合成訊號，沒有參與者、臨床、義肢控制、電池或微控制器效能聲稱。

## 先設計架構，再談演算法

管線以 \(f_s=2000\) Hz 運作，並把工作分成兩條路徑。

**快速路徑**逐樣本執行：四個 second-order section 組成的八階 Butterworth band-pass、可選固定 notch 或諧波 normalized LMS，以及 exponential RMS 包絡。

**監督路徑**保存 rolling buffer，定期做 8192 點 FFT，估計市電峰值，只在信心與最大變動規則通過時接受更新。它只改變振盪器頻率，不會把每個樣本的運算換成 Fourier transform。

<figure class="article-figure">
  <img src="/science/semg-real-time-conditioning/pipeline.svg" alt="由電極、band-pass、追蹤式諧波消除到 exponential RMS 的串流 sEMG 管線，並具有分開的監督頻率追蹤器。" width="960" height="544" loading="lazy" decoding="async" />
  <figcaption><strong>圖 1。</strong> 把監督追蹤器與因果快速路徑分開，是整個設計的核心。「低延遲」針對快速路徑量度；已接受的追蹤器更新時間另外報告。</figcaption>
</figure>

這個分隔亦避免錯誤報告。把偶爾一次昂貴 FFT 平均到數千個便宜樣本，可能得到很小平均值，卻隱藏監督尖峰；反過來把 FFT 時間當成每個樣本成本，又會低估吞吐量。實作因此分別記錄快速路徑、同步總時間與已接受更新的時間。

## 由共模電壓到差模干擾

理想電極前端會拒絕兩個輸入共同擁有的電壓，但有限 common-mode rejection 會把一部分轉成差模污染。若兩端增益為 \(G_1,G_2\)，簡化關係為

$$
v_{\mathrm{out}}=G_dv_d+G_cv_c,\qquad
\mathrm{CMRR}=20\log_{10}\left|\frac{G_d}{G_c}\right|.
$$

高 CMRR 有幫助，卻不是完整 PLI 模型。電極阻抗不平衡、導線移動、電容耦合、reference 位置與前端頻率響應都會影響結果。專案內的 CMRR 圖只是一項敏感度檢查，用來解釋共模正弦為何可能在差分量測後殘留，而不是辨識一套具名硬件。

數碼消除位於這項類比限制之後。它無法恢復已令放大器飽和的資訊，也不應成為忽略電極與前端設計的理由。

## 固定 notch 為何不完整

以 \(\omega_0\) 為中心的二階 notch 可寫成

$$
H(z)=
\frac{1-2\cos(\omega_0)z^{-1}+z^{-2}}
{1-2r\cos(\omega_0)z^{-1}+r^2z^{-2}},
$$

其中 \(r<1\) 控制極點半徑與帶寬。窄 notch 保留較多鄰近頻譜，卻對漂移敏感；寬 notch 容忍漂移，但會移除更多 sEMG 內容並增加相位影響。

100 Hz 等諧波即使在 50 Hz 已壓低後仍可能存在。串接多個寬 notch 會形成一列被刪除的生理頻帶。本研究改為按追蹤基頻及其諧波合成 reference，再自適應估計各分量振幅。

## 諧波 normalized LMS

第 \(k\) 個諧波的 reference pair 為

$$
\mathbf x_{k,n}=
\begin{bmatrix}
\sin(k\phi_n)\\
\cos(k\phi_n)
\end{bmatrix},
\qquad
\phi_{n+1}=\phi_n+\frac{2\pi\widehat f_n}{f_s}.
$$

遞迴 quadrature oscillator 避免每個樣本重新計算正弦與餘弦。合併 reference 後，

$$
\widehat i_n=\mathbf w_n^\top\mathbf x_n,\qquad
e_n=y_n-\widehat i_n,
$$

而權重更新為

$$
\mathbf w_{n+1}
=\mathbf w_n+
\mu\frac{e_n\mathbf x_n}
{\varepsilon+\lVert\mathbf x_n\rVert^2}.
$$

正規化減低 reference 幅度對步長的影響，但 \(\mu\) 仍有真實取捨。太小會慢慢追蹤振幅，太大則可能開始配合與 reference 偶然相關的肌電內容。敏感度實驗比較 \(\mu\in\{0.005,0.02,0.08\}\)，沒有把一個數值宣稱為普遍最優。

## 追蹤器可以回答「不確定」

監督追蹤器在名義市電附近搜尋，以頻譜集中程度評估信心。候選更新只有在信心高於 2.5、套用 0.5 平滑，以及每次接受變動不超過 0.25 Hz 時才生效。低信心視窗維持上一個頻率。

這個閘門很重要。若每個含噪視窗都被迫輸出新值，頻率抖動會被注入消除器，令其追逐寬頻 sEMG。8192 點 FFT 亦不表示估計只能落在原始 bin；峰值內插可提供 sub-bin 值，但視窗長度仍決定歷史記憶與可追蹤速度。

合成追蹤實驗的真實干擾約在 \(49.859\) 至 \(50.516\) Hz 之間，追蹤 RMSE 為 \(0.118\) Hz。

## 合成 ablation 告訴我們甚麼

兩個受控 benchmark 回答不同問題。12-channel ablation 以已知 clean reference 比較消除模式：

| 模式 | 重建 SNR 中位數 |
|---|---:|
| 不消除 | \(-11.19\) dB |
| 固定諧波 | \(8.80\) dB |
| 追蹤諧波 | \(11.48\) dB |

按聲明的 lag convention 對齊後，包絡相關為 \(0.9943\)，normalized RMSE 為 \(0.0693\)。

漂移市電實驗則專注追蹤。活動時段的重建 SNR 在 static notch、固定諧波、追蹤諧波下分別為 \(-15.68,-2.33,3.53\) dB；休息包絡中位數分別為 \(492.7,88.6,74.6\ \mu\mathrm V\)。

<figure class="article-figure">
  <img src="/science/semg-real-time-conditioning/synthetic-ablation.svg" alt="不消除、固定諧波與追蹤諧波模式的合成重建 SNR 及殘餘休息包絡比較。" width="960" height="544" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong> 追蹤諧波在兩個隨附合成 benchmark 表現最好。兩個 panel 來自不同實驗及 metric，均不是參與者證據。</figcaption>
</figure>

因此不能把結果壓縮成「演算法改善 sEMG 11.5 dB」。數值取決於合成干擾、clean reference、振幅分佈、startup 排除與重建 metric；真實錄音沒有完美 clean counterfactual。

## 包絡估計本身就是延遲選擇

指數平均平方狀態為

$$
q_n=(1-\alpha)q_{n-1}+\alpha e_n^2,\qquad
\mathrm{EMRMS}_n=\sqrt{q_n},
$$

其中

$$
\alpha=1-\exp\left(-\frac{1}{f_s\tau}\right).
$$

在 2000 Hz 與 \(\tau=25\) ms 下，等效記憶約為 100 個樣本。較小 \(\tau\) 反應更快但包絡較嘈；較大 \(\tau\) 較穩定，卻延遲 onset 與 offset。

Startup correction 亦要明確處理索引。零起始樣本 \(n\) 的累積權重為 \(1-(1-\alpha)^{n+1}\)；錯用 \(n\) 會製造可避免的瞬態誤差。

本研究亦以 rolling sum 實作 rectangular RMS。兩者都可以每個樣本固定算術量運作；分別在時間權重、記憶與延遲，而不是其中一個「即時」、另一個不是。

## 計時究竟量度了甚麼

主機 Python reference benchmark 處理 30,000 個樣本：

| 工作 | 中位數 | 第 99 百分位 |
|---|---:|---:|
| 樣本快速路徑 | \(12.96\ \mu s\) | \(24.94\ \mu s\) |
| 同步總呼叫 | \(13.64\ \mu s\) | \(26.56\ \mu s\) |
| 已接受 tracker 更新 | \(161.15\ \mu s\) | 分開報告 |

該次有 57 個已接受更新，tracker 最大時間 \(375.45\ \mu s\)。這些是 Python 3.13.5 在一部 Linux 主機上的 reference 值，不是 worst-case execution time、RTOS jitter、中斷延遲、功耗、熱或電池量度。

<figure class="article-figure">
  <img src="/science/semg-real-time-conditioning/timing-envelope.svg" alt="主機 Python 樣本快速路徑計時區間，以及 25 毫秒 exponential RMS 記憶的圖示。" width="960" height="544" loading="lazy" decoding="async" />
  <figcaption><strong>圖 3。</strong> 計時與平滑回答不同設計問題。主機 reference 的快速路徑低於 500 微秒取樣週期，但只有目標嵌入式實作才能證明裝置 deadline。</figcaption>
</figure>

## Ninapro 的證據邊界

私人來源工作區提供真正資料驗證命令，要求合法本地 Ninapro DB2 MAT 檔，找不到資料便退出；隨附效能摘要則明確是合成實驗。

一個舊輸出雖名為 `ninapro_summary.json`，其 `data_source` 自己寫明是 “Ninapro-like synthetic stand-in”。本文不把它視為 Ninapro 驗證，也不引用其中數字作參與者證據。檔名不是 provenance。

有效真實資料研究需要記錄 dataset 版本與授權、subject-level 分割、單位縮放、channel 與 exercise 選擇、artefact policy，並採用不依賴未知 clean signal 的 metric。若聲稱跨人泛化，cross-validation 必須按 subject 或 session 分割，而不能隨機混合相鄰視窗。

## 十個測試能證明與不能證明的事

來源實作十個測試全部通過，涵蓋濾波器行為、exponential RMS 定義、correction 索引與管線運作。確定性圖像生成與機器可讀 JSON 減少抄寫錯誤。

測試只證明實作與聲明數值設計一致，不證明臨床效用、硬件安全、電磁兼容，亦不涵蓋汗水、電極脫落、movement artefact、飽和與對抗性頻譜重疊。

## 走向更強證據的具體路線

下一階段應在查看真實結果前凍結目前合成管線，然後：

1. 合法取得具名資料集並核實物理單位；
2. 定義 subject-level training、tuning 與 held-out split；
3. 比較 static notch、固定諧波、追蹤諧波與不消除基線；
4. 報告在沒有 clean reference 時仍有意義的訊號品質 proxy；
5. 把凍結快速路徑移植至目標 MCU，量度 WCET、jitter、記憶體、能耗與數值精度；
6. 測試低信心、缺視窗、clipping 與快速頻移的 failure gate；
7. 最後才評估 gesture classification 或 proportional control 等任務結果。

這條路線可把可重現機制研究轉化成特定量測與部署情境的證據。在此之前，較窄而有用的結論是：監督式頻率追蹤可在受控諧波干擾中改善消除，而不用把頻譜估計放入每個樣本步驟。

## 參考文獻

1. Widrow, B., Glover, J. R., McCool, J. M., et al. (1975). Adaptive noise cancelling: Principles and applications. *Proceedings of the IEEE, 63*(12), 1692–1716. [https://doi.org/10.1109/PROC.1975.10036](https://doi.org/10.1109/PROC.1975.10036)
2. De Luca, C. J., Donald Gilmore, L., Kuznetsov, M., & Roy, S. H. (2010). Filtering the surface EMG signal: Movement artifact and baseline noise contamination. *Journal of Biomechanics, 43*(8), 1573–1579. [https://doi.org/10.1016/j.jbiomech.2010.01.027](https://doi.org/10.1016/j.jbiomech.2010.01.027)
3. Clancy, E. A., Morin, E. L., & Merletti, R. (2002). Sampling, noise-reduction and amplitude estimation issues in surface electromyography. *Journal of Electromyography and Kinesiology, 12*(1), 1–16. [https://doi.org/10.1016/S1050-6411(01)00033-5](https://doi.org/10.1016/S1050-6411(01)00033-5)
4. Merletti, R., & Farina, D. (Eds.). (2016). *Surface Electromyography: Physiology, Engineering, and Applications*. Wiley. [https://doi.org/10.1002/9781119082934](https://doi.org/10.1002/9781119082934)
5. Atzori, M., Gijsberts, A., Castellini, C., et al. (2014). Electromyography data for non-invasive naturally-controlled robotic hand prostheses. *Scientific Data, 1*, 140053. [https://doi.org/10.1038/sdata.2014.53](https://doi.org/10.1038/sdata.2014.53)
