---
title: Neural ODE 可以符合物理，卻仍然沒有校準
slug: intervention-calibrated-neural-odes
sourceSlug: intervention-calibrated-neural-odes
summary: 一個合成基因迴路基準在未見介入下比較無約束與符號結構向量場，發現可行性不等於誠實不確定性。
date: 2026-07-22
lastUpdated: 2026-07-28
featured: true
topics: [Neural ODE, 介入, 不確定性校準]
heroImage: /science/intervention-calibrated-neural-odes/neural_ode_interventions.svg
draft: false
type: 研究筆記
archived: false
readingMinutes: 20
scienceProject: intervention-calibrated-neural-odes
redirectFrom: []
---

學習所得微分方程可以完美插值觀察軌跡，卻誤解機制。問題常在介入後才出現：輸入比訓練更強、抑制一個元件，或由不常見初態開始。第二個問題是，即使多個模型 fit 之間有差異，ensemble uncertainty 也未必在陌生介入處擴闊得足夠。

本研究問：

> 結構符號約束與 ensemble uncertainty，能否令學習向量場在預測雙穩態基因迴路的未見介入時更誠實？

答案是混合的。結構改善物理可行性並稍為降低軌跡誤差，但在留出介入下，不確定區間校準很差。

## 合成 toggle-switch 世界

資料生成器是兩狀態互相抑制開關：

$$
\dot x=\frac{\alpha_x}{1+y^{n_y}}-d_xx+u_x(t),
\qquad
\dot y=\frac{\alpha_y}{1+x^{n_x}}-d_yy+u_y(t).
$$

產生項為正、自衰減為負、兩狀態互相抑制，介入 $u_x,u_y$ 有已聲明方向。30 條訓練軌跡提供 1,350 個狀態—介入—導數樣本。

兩個向量場競爭：

1. 無約束 multilayer perceptron；
2. 把 cross-repression、輸入、衰減與產生項限制到指定符號的結構 production–decay 網絡。

每個 family 有六個 bootstrap 成員。校準只使用 in-domain 資料，更強脈衝與 knockout-like 介入留作測試。

<figure class="article-figure">
  <img src="/science/intervention-calibrated-neural-odes/neural_ode_interventions.svg" alt="留出介入下真實與學習 toggle-switch 軌跡及不確定帶。" loading="lazy" />
  <figcaption><strong>圖 1。</strong> 介入 rollout。不確定帶在強留出擾動前校準；結構模型保持非負，但真值常落在帶外。</figcaption>
</figure>

## 結構改變 hypothesis class

無約束網絡可表示靈活局部導數，包括生物上不合理符號。結構模型分開產生與衰減，並以正值變換限制權重。這不證明找到真生成器，只排除部分已知違反定性機制的向量場。

留出介入下，結構模型平均 RMSE 為 $0.237$，無約束為 $0.259$。結構模型最小預測保持 $0.0146$；無約束最低達 $-1.178$，在模擬器中是不可能濃度。

<figure class="article-figure">
  <img src="/science/intervention-calibrated-neural-odes/neural_ode_phase_fields.svg" alt="基因迴路相平面上的真實、無約束及符號結構向量場。" loading="lazy" />
  <figcaption><strong>圖 2。</strong> 相場比較。相似訓練 loss 可隱藏不同全局幾何；符號結構排除部分不可能流，但未正確恢復所有 separatrix。</figcaption>
</figure>

誤差改善不大，較強結果是可行性：結構 architecture 防止負值 rollout。但可行性不足；一條正值但錯誤的軌跡仍然錯誤。

## 校準帶來負面發現

Ensemble standard deviation 乘上一個由 in-domain 校準軌跡選出的尺度。無約束 ensemble 需要 $3.52$ 倍，留出 coverage 達 $0.983$；結構 ensemble 需要更大的 $39.57$ 倍，coverage 仍只有 $0.721$。

<figure class="article-figure">
  <img src="/science/intervention-calibrated-neural-odes/neural_ode_calibration.svg" alt="兩個 neural ODE family 的 coverage、誤差、不確定性關聯與 abstention 曲線。" loading="lazy" />
  <figcaption><strong>圖 3。</strong> 校準診斷。較低 RMSE 與較好物理符號，不代表介入轉移下有有效預測區間。</figcaption>
</figure>

為何結構 ensemble 會過度自信？所有成員共享同一限制 architecture 及相似訓練支持，可以彼此同意但共同帶有相同外推偏差。Bootstrap spread 量度重抽樣引起的變化，不會自動表示遺漏機制或介入轉移的不確定性。

結構模型的誤差—不確定性相關為 $0.514$，無約束為 $0.953$。移除高不確定案例後，結構 RMSE 由 $0.237$ 降至約 $0.198$，所以不確定性並非無用，只是未校準到可當作有效區間。

## 分開檢查求解器誤差

Neural ODE 預測混合向量場誤差與數值積分誤差。Tolerance 由 $10^{-3}$ 收緊至 $2\times10^{-6}$ 時，相對軌跡差由約 $9.55\times10^{-4}$ 降至 $3.09\times10^{-6}$，遠低於模型 RMSE。

改變 ODE solver 不能修補錯誤外推向量場；相反，好的向量場若積分太粗也會看似很差。兩類誤差必須分開。

## 「介入校準」應要求甚麼

有科學用途的介入區間應在目標介入 family 評估，而非只看觀察軌跡。理想協議會預先聲明介入類別、分開弱校準與強測試介入、報告邊際及整條軌跡 coverage、檢查 interval width 與失敗位置、加入機制錯設模擬，並在支持不足時容許 abstention。

標題描述研究目標，結果則顯示目標尚未完全達成。這個負面發現比只報告 RMSE 更有資訊。

## 聲稱界線

所有軌跡均為合成，學習權重不辨認真實基因網絡。可支持結論是：

> 在此 toggle-switch 基準，符號結構降低平均留出 RMSE 並防止負預測，但 bootstrap ensemble 在強介入下仍嚴重 under-cover。

結構與校準是兩個不同設計問題。後續可結合符號約束、機制 ensembles、跨介入 family 的 conformal calibration、顯式 epistemic prior 或 reject option。

## 參考文獻

1. R. T. Q. Chen *等*, “Neural ordinary differential equations,” *NeurIPS*, 2018. [Proceedings](https://proceedings.neurips.cc/paper/2018/hash/69386f6bb1dfed68692a24c8686939b9-Abstract.html).
2. P. Kidger *等*, “Neural controlled differential equations for irregular time series,” *NeurIPS*, 2020. [Proceedings](https://proceedings.neurips.cc/paper/2020/hash/4a5876b450b45371f6cfe5047ac8cd45-Abstract.html).
3. Y. Gal and Z. Ghahramani, “Dropout as a Bayesian approximation,” *ICML*, 2016. [Proceedings](https://proceedings.mlr.press/v48/gal16.html).
4. A. Guo *等*, “On calibration of modern neural networks,” *ICML*, 2017. [Proceedings](https://proceedings.mlr.press/v70/guo17a.html).

