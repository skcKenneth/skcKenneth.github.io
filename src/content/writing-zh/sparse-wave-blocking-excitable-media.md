---
title: 一個局部脈衝能否阻止行進中的激發波？
slug: sparse-wave-blocking-excitable-media
sourceSlug: sparse-wave-blocking-excitable-media
summary: 一個 FitzHugh–Nagumo 基準凍結事件觸發局部介入，再測試它能否在未見傳導速度與感測延遲下阻擋行進波。
date: 2026-07-20
lastUpdated: 2026-07-28
featured: true
topics: [可激發介質, 反應—擴散控制, 穩健介入]
heroImage: /science/sparse-wave-blocking-excitable-media/excitable_wave_story.svg
draft: false
type: 研究筆記
archived: false
readingMinutes: 20
scienceProject: sparse-wave-blocking-excitable-media
redirectFrom: []
---

可激發介質可以長時間安靜，直至一個足夠大的擾動產生行進脈衝。波前之後，較慢 recovery variable 暫時防止重新激發。這種 activator–recovery 結構出現在神經脈衝、化學反應、生態波與心臟組織模型，但不同應用的解讀與參數相差甚遠。

本文控制問題刻意保持一般：

> 在傳導速度與感測延遲不確定下，少量局部、事件觸發介入能否穩健阻止行進激發波？

研究不是醫療方案，而是以一維 FitzHugh–Nagumo 型模型作稀疏時空控制基準。

## 模型與控制幾何

設 $u(x,t)$ 為快速活化場，$v(x,t)$ 為慢 recovery 場：

$$
\frac{\partial u}{\partial t}
=D\frac{\partial^2u}{\partial x^2}+u(u-a)(1-u)-v+I(x,t),
$$

$$
\frac{\partial v}{\partial t}=\varepsilon(u-\gamma v).
$$

局部初始擾動發射脈衝。$x_s=24$ 的 sensor 檢測波；通訊延遲後，中心在 $x_a=34$、寬度 5 的 actuator 施加指定振幅及持續時間的負電流；$x_m=48$ 的下游 monitor 判斷波是否通過。

這個分隔避免 trivial solution。Actuator 不能在上游證據到達前行動，monitor 亦遠到令無控制波通常有時間抵達。

<figure class="article-figure">
  <img src="/science/sparse-wave-blocking-excitable-media/excitable_wave_story.svg" alt="顯示 sensor 觸發、局部介入、波衰減與下游 monitor 的時空激發場。" loading="lazy" />
  <figcaption><strong>圖 1。</strong> 代表性控制歷程。Sensor、延遲觸發、actuator 範圍與 monitor 全部可見，因果時間可以檢查。</figcaption>
</figure>

## 開發期間找到的假成功

早期設定即使沒有控制也報告接近完美「阻擋」。原因是波在到達 monitor 前自行衰減，或模擬太早結束。這不是控制器成功，而是評估幾何缺陷。

修正改變 recovery 參數、monitor 位置及 travel-time logic，令一般無控制波在大部分留出案例可到達。最終 no-control success 為 $0.233$，不是一。這段失敗很重要：基準可以因錯誤理由變得容易，高分本身不會診斷問題。

任何 wave-blocking 基準都應有三項檢查：

1. 無控制 positive control 在目標區域必須傳播；
2. 強 global intervention 要顯示動力學上確實可阻擋；
3. 時間範圍要超過保守 travel-time estimate。

## 訓練局部政策

候選網格改變負電流振幅與持續時間。每組在不同擴散、recovery rate 與 sensor delay 下模擬。目標偏好高阻擋概率及低 integrated squared current：

$$
E=\int_0^{t_f}\int_0^L I(x,t)^2\,dx\,dt.
$$

選出政策振幅 $0.325$、持續 $7.2$；訓練 ensemble 阻擋率 $95.24\%$，平均能量 $4.183$。

<figure class="article-figure">
  <img src="/science/sparse-wave-blocking-excitable-media/excitable_wave_policy_map.svg" alt="局部介入振幅與持續時間的阻擋率及能量政策圖。" loading="lazy" />
  <figcaption><strong>圖 2。</strong> 振幅—持續時間政策圖。高成功區域並不狹窄，但更強更長介入消耗更多能量；所選點是折衷而非最強點。</figcaption>
</figure>

## 凍結後的留出比較

選擇後振幅與持續時間不再改動，在 36 組未見擴散、recovery rate 及 delay 下評估：

- **無控制：** 成功 $0.233$，能量 $0$；
- **周期 global forcing：** 成功 $1.000$，能量 $29.428$；
- **事件觸發 local forcing：** 成功 $0.944$，能量 $4.183$。

局部政策只用約 global baseline 七分之一能量，但阻擋率少約 5.6 個百分點。

<figure class="article-figure">
  <img src="/science/sparse-wave-blocking-excitable-media/excitable_wave_frontier.svg" alt="無控制、周期 global 與事件觸發 local 政策的留出阻擋率能量前沿。" loading="lazy" />
  <figcaption><strong>圖 3。</strong> 留出成功—能量前沿。Global forcing 在基準中更可靠但昂貴得多；local control 是另一個折衷。</figcaption>
</figure>

這是多目標結果。若一次通過都不可接受而能量便宜，模擬器內 global forcing 較好；若能量或介入面積重要，local policy 較吸引。數學不會代替讀者選擇價值。

## 「阻擋」如何定義

足夠 travel time 後，下游 activator 最大值低於門檻便計作阻擋。操作定義可有兩種錯誤：延遲弱波可能在觀察窗後才通過；無害 subthreshold remnant 又可因界線太低被計作失敗。

研究因此同時報告 monitor peak 與二元成功，並以 travel-time forecast 設定 horizon。更強分析可連續估計 wave-front position，分開 extinction、reflection、delay 與 fragmentation。

## 數值加密

代表政策分別在 101、161、241 點網格及 $0.08$、$0.04$、$0.025$ 步長重跑，三者均判定阻擋。Monitor peak 與細解差由 $0.0380$ 降至 $0.0134$，再按定義到零。

能量由 $3.65$、$4.21$ 到 $3.82$ 波動，因矩形 actuator 在不同網格的離散表示有別。這點沒有被隱藏。若要求更強收斂，應以 grid-independent quadrature 積分 footprint，或使用平滑空間控制。

## 機制解讀

負脈衝在來波前方暫時降低 excitability。成功 timing 令 activator front 在 recovery field 仍抑制時無法自持；太弱或太短則留下足夠 activator 回復；太遲則在波前越過 actuator 後才到。

模型亦顯示 event-triggering 為何可勝過稀疏周期時序：sensor 把介入對齊實際到達時間。但 delay uncertainty 有硬限制。若 delay 相對 sensor–actuator travel time 太長，在現有振幅界線下再強控制也不能恢復因果次序。

## 聲稱界線

可支持聲明是：

> 在已聲明一維可激發介質基準，凍結的振幅 $0.325$、持續 $7.2$ 局部政策以能量 $4.183$ 阻擋 $94.44\%$ 留出波；周期 global forcing 則以能量 $29.428$ 達 $100\%$。

這不表示心臟、神經或化學製程安全。FitzHugh–Nagumo 變數是一般化的；幾何只有一維；不確定範圍為合成；模型未包括各向異性、三維 scroll wave、refractory heterogeneity、量測 artefact 或硬件限制。

## 參考文獻

1. R. FitzHugh, “Impulses and physiological states in theoretical models of nerve membrane,” *Biophysical Journal*, 1961. [doi:10.1016/S0006-3495(61)86902-6](https://doi.org/10.1016/S0006-3495(61)86902-6).
2. J. Nagumo, S. Arimoto, and S. Yoshizawa, “An active pulse transmission line simulating nerve axon,” *Proceedings of the IRE*, 1962. [doi:10.1109/JRPROC.1962.288235](https://doi.org/10.1109/JRPROC.1962.288235).
3. J. Siehr *等*, “Targeting characteristic wave properties in reaction-diffusion systems by optimization of external forcing,” *Physical Review E*, 2007. [doi:10.1103/PhysRevE.76.056211](https://doi.org/10.1103/PhysRevE.76.056211).
4. E. A. Ermakova *等*, “On propagation of excitation waves in moving media,” *PLoS ONE*, 2009. [doi:10.1371/journal.pone.0004454](https://doi.org/10.1371/journal.pone.0004454).

