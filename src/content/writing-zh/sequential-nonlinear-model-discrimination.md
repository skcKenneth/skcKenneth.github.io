---
title: 向振盪器提出最能分開模型的實驗
slug: sequential-nonlinear-model-discrimination
sourceSlug: sequential-nonlinear-model-discrimination
summary: 一個 Bayesian sequential-design 基準在六次實驗預算下，選擇能分辨 Van der Pol、Rayleigh 與 Duffing 機制的外力。
date: 2026-07-19
lastUpdated: 2026-07-28
featured: true
topics: [實驗設計, Bayesian 模型選擇, 非線性振盪]
heroImage: /science/sequential-nonlinear-model-discrimination/model_design_landscape.svg
draft: false
type: 研究筆記
archived: false
readingMinutes: 20
scienceProject: sequential-nonlinear-model-discrimination
redirectFrom: []
---

收集更多資料不等於收集有分辨力的資料。兩個非線性模型可產生相似自由振盪，卻對精心選擇的外力頻率與振幅有完全不同反應。若只能做少量實驗，下一個輸入應按它能揭示甚麼來選擇。

研究問：

> 在有限實驗預算下，哪些外力振幅與頻率最有效分辨競爭非線性振盪機制？

候選 family 為 Van der Pol、Rayleigh 與 Duffing。這是封閉世界合成問題；posterior probability 條件於三個 family 與其參數 prior。

## 競爭機制

代表形式為 Van der Pol：

$$
\ddot x-\mu(1-x^2)\dot x+x=A\cos(\omega t),
$$

Rayleigh：

$$
\ddot x+\mu(\dot x^2-1)\dot x+x=A\cos(\omega t),
$$

以及 Duffing：

$$
\ddot x+\delta\dot x+\alpha x+\beta x^3=A\cos(\omega t).
$$

三者都可維持或改變振盪，但非線性阻尼與非線性剛度對外力反應不同。每個模型含 26 個參數 particles。一次實驗施加一組振幅—頻率，觀察含 Gaussian noise $0.65$ 的壓縮後期響應。

<figure class="article-figure">
  <img src="/science/sequential-nonlinear-model-discrimination/model_design_landscape.svg" alt="三個非線性振盪模型在外力振幅與頻率上的預測分離景觀。" loading="lazy" />
  <figcaption><strong>圖 1。</strong> 設計景觀。有資訊的外力位於模型 predictive distributions 分離之處，不一定是響應振幅最大之處。</figcaption>
</figure>

## Sequential Bayesian 更新

每一輪前，模型與參數 particles 為所有未用候選實驗定義 predictive distribution。適應性分數相對 within-model 參數變化及 observation noise，獎勵穩健 between-model separation。

系統施行最高分且未用的外力，再以 Bayes rule 更新：

$$
p(M,\theta\mid z,d)\propto p(z\mid M,\theta,d)p(\theta\mid M)p(M),
$$

$d$ 是 design，$z$ 是壓縮觀察。過程重複六輪。

Fixed baseline 按與觀察無關的 space-filling 次序；oracle 知道 true model family 但不知道參數，只作上限比較，不可部署。

## 為何要令基準更困難

初版太容易：長、低噪軌跡令所有策略幾乎完美，無法測試 adaptive design。最終版本壓縮觀察並把噪聲提高至 $0.65$，令 predictive distributions 重疊，同時保留可辨識區域。

困難應來自目標 inference problem，而非 bug 或資訊遺漏。現基準仍可由好設計解決，但一般 schedule 留下可量度不確定性。

## 最終表現

每個 true model 各 70 次試驗：

- **Adaptive：** accuracy $1.000$，平均 true-model probability $0.992$，Brier $0.00287$；
- **Fixed：** accuracy $0.9619$，平均 probability $0.952$，Brier $0.0509$；
- **Oracle：** accuracy $1.000$，平均 probability $0.995$，Brier $0.00172$。

<figure class="article-figure">
  <img src="/science/sequential-nonlinear-model-discrimination/model_posterior_paths.svg" alt="適應性與固定策略在六次實驗內的 posterior model probability。" loading="lazy" />
  <figcaption><strong>圖 2。</strong> Posterior 路徑。Adaptive design 常用較少輪次製造決定性分離；fixed experiments 可能把預算花在三個模型預測相似的地方。</figcaption>
</figure>

只看 accuracy 會低估差別，因兩者都很強。Brier score 量度概率預測質素；fixed strategy 偶爾的含糊，即使最後 top-1 正確仍會保留在分數。

<figure class="article-figure">
  <img src="/science/sequential-nonlinear-model-discrimination/model_accuracy_calibration.svg" alt="Adaptive、fixed 及 oracle 實驗設計的準確率、真模型概率與 Brier score。" loading="lazy" />
  <figcaption><strong>圖 3。</strong> 準確與概率質素。Adaptive 方法在已聲明候選集內補回大部分與 oracle 的差距。</figcaption>
</figure>

## 設計分數實際做甚麼

若不同模型在積分參數不確定性後仍有分離預測，外力才有資訊。輸出大並不足夠：如果三個 family 都以相似方式 resonance，一條戲劇性軌跡仍可幾乎無法分辨。

分數也避免表面分離只依賴一個狹窄 particle。穩健分離要求不同 model clouds 之間距離大於各自內部 spread，等同實驗設計中不只比較 raw mean，還要相對 uncertainty 比較 effect size。

## 求解器驗證

若不同 family 或 forcing regime 的數值積分誤差不同，模型分辨會被污染。Tolerance 由 $10^{-3}$ 收緊至 $2\times10^{-7}$，代表性相對軌跡差降至 $7.72\times10^{-8}$。中間 $10^{-5}$ 附近的非單調數值被保留；adaptive solver 可改變步序，收斂不必每個 tolerance 完全單調。

最終參考誤差遠低於 observation noise，支持把 posterior 差異解讀成模型與資料效果，而非積分 artefact。

## 封閉世界 posterior

$0.992$ posterior 不表示自然界有 99.2% 機會使用該方程。它表示在以下條件下，觀察序列強烈偏向生成 family：

- 三個候選之一為真；
- 已聲明參數 priors；
- 指定 observation summary 與 noise model；
- forcing candidate set；
- 數值模擬器。

真實 model discrimination 需要「所有模型都錯」的出口：posterior predictive checks、discrepancy model、擴展機制，以及可暴露共同失敗的實驗。

## 聲稱界線

可支持結果是：

> 在已聲明六輪合成基準，adaptive predictive-separation design 達 100% 分類準確率及 Brier $0.00287$；fixed space-filling schedule 為 96.19% 及 $0.0509$。

它不辨認真實振盪器。候選設計、prior、summary、成本或未建模動力學改變後，優勢亦可能改變。

## 參考文獻

1. A. C. Atkinson and A. N. Donev, *Optimum Experimental Designs*, Oxford University Press, 1992.
2. K. Chaloner and I. Verdinelli, “Bayesian experimental design: A review,” *Statistical Science*, 1995. [doi:10.1214/ss/1177009939](https://doi.org/10.1214/ss/1177009939).
3. B. van der Pol, “On relaxation-oscillations,” *Philosophical Magazine*, 1926. [doi:10.1080/14786442608564127](https://doi.org/10.1080/14786442608564127).
4. G. Duffing, *Erzwungene Schwingungen bei veränderlicher Eigenfrequenz*, 1918.

