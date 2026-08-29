---
title: "從像素到巡邏：校準如何改變合成巡邏規劃"
slug: from-pixels-to-patrols
sourceSlug: from-pixels-to-patrols
summary: 以技術角度閱讀一項 AI4Nature@AVSS 2026 camera-trap 研究，追蹤機率校準如何進入合成巡邏配置，同時分開議程、證據與出版狀態。
date: 2026-08-29
lastUpdated: 2026-08-30
featured: false
topics: [camera trap, 機率校準, 保育科技, 資源配置, 合成實驗]
heroImage: /images/writing/from-pixels-to-patrols/calibration-to-allocation-pipeline.svg
draft: false
type: 研究筆記
archived: false
redirectFrom: []
---

> **議程狀態——2026 年 8 月 30 日。** [AI4Nature@AVSS 2026 官方議程](https://www.ai4nature.tech/program.html)把 *From Pixels to Patrols: A Calibration-Aware Sensor Fusion Pipeline for Camera-Trap-Driven Anti-Poaching Resource Allocation* 列為 Paper ID 7，安排於明日（2026 年 8 月 31 日）Oral Session 1A。口頭報告仍未舉行；proceedings 出版、IEEE Xplore 紀錄與 DOI 均尚待確認。

> **證據界線。** 下文所有數值均屬 **manuscript-reported**：它們來自二十個不同 seed、每個包含 400 個網格的受控合成實驗。我沒有為本篇 Blog 獨立重跑程式或重現這些數值。研究沒有使用真實 camera-trap 影像、巡邏紀錄、保護區部署或 field-effectiveness validation。

官方議程列出的作者是 Ka Hin Chan、Long Nam Ao、Weng Kin Loi、Long Tin Tse 與 Sok Kin Cheng。研究由一個很容易被忽略的事實開始：即使沒有人明言把分類器分數當作決策量，它仍可能在下游變成決策量。

設想 camera-trap 模型為「有人出現」類別輸出一個機率。下游系統把同一網格內的機率相加、排列網格，再分配有限巡邏時數。若模型給出的 $0.8$ 信心在經驗上只對應約 $0.5$ 事件率，偏差不會停留在分類器；它會改變空間風險估計，甚至把資源移到另一批網格。

手稿在受控設定中研究這條由機率走到決策的鏈。它**沒有**研究真實反偷獵計劃是否有效。「有人出現」只是 risk proxy，並非直接的 poacher label；獲授權職員、遊客、研究人員、車輛、路線、季節、行程時間、安全與在地保育知識均不在合成實驗內。

## 同一條鏈上的不同問題

整個 pipeline 有五個概念階段：

1. 四類合成分類器為每幅影像輸出機率向量；
2. 四批互不重用的標記資料分別用作 calibrator fitting、metric evaluation、interval calibration 與 deployment checking；
3. temperature scaling 校準完整多類分佈，第二個單調映射再針對指定 risk-proxy 類別；
4. 影像機率匯聚成每格預期數量與 realised-count interval；
5. 受約束 optimiser 把網格摘要轉成巡邏時間。

<figure class="article-figure">
  <img src="/images/writing/from-pixels-to-patrols/calibration-to-allocation-pipeline.svg" alt="五階段圖解，把合成分類器機率、互相分離的資料角色、校準、網格匯聚與受約束巡邏配置連起來，並標示 field validation 界線。" width="1200" height="675" loading="eager" decoding="async" />
  <figcaption><strong>圖 1。</strong> 這是按手稿方法重新繪製的編輯圖解，不是由 supplied PDF 抽取的圖。下方虛線界線不可省略：pipeline 只在合成景觀內測試，並未證明真實巡邏成效。</figcaption>
</figure>

每一階段回答不同問題。Multiclass calibration 檢查各預測標籤的信心能否對應經驗頻率；task calibration 檢查真正進入 allocator 的指定類別機率是否可靠；count aggregation 研究影像層不確定性如何在網格內累積；allocation 則研究這些數量的偏差如何在指定 utility 下改變決策。

若把四者壓成「更好校準改善保育」一句，便會跳過大部分推理鏈。手稿較克制：它量度中間量，也把最終 decision objective 明確限制在合成世界。

## 為甚麼資料角色必須分開

若同一批 labels 同時影響校準轉換及其評估，校準效果很容易看來過度理想。手稿由同一個 latent synthetic landscape 生成四批條件獨立資料，以避免直接 leakage：

- **fit batch** 估計校準參數；
- **evaluation batch** 報告 ECE、Brier score 與 negative log likelihood；
- **interval-calibration batch** 選取 predictive-width adjustment；
- **deployment batch** 檢查 realised counts 與決策表現。

這個分工是方法上的優點，避免 deployment check 同時充當 tuning set。不過，它不代表合成網格在所有科學意義上互相獨立：它們仍共享景觀生成假設、空間相關模型、class bias 與 observation model。研究可以乾淨地測試內部行為，卻不能證明同一轉換能跨保護區、季節、相機或分類器維持有效。

## 兩種不同的校準工作

令 $\boldsymbol{\pi}_j$ 為影像 $j$ 的四類機率向量，並令 $\ell_j=\log \boldsymbol{\pi}_j$。Temperature scaling 擬合一個正純量 $T$：

$$
\widehat{T}
=\arg\min_{T>0}
-\sum_{j\in C_{\mathrm{fit}}}
\log\left[\operatorname{softmax}(\ell_j/T)\right]_{y_j}.
$$

因為所有 logits 除以同一純量不會改變類別排序，temperature scaling 可以把信心變軟或變尖，而不改變預測類別。它能修正整體過度自信，但巡邏 allocator 並不只使用 top-label confidence；它使用指定 risk-proxy 類別 $K$ 的機率。

手稿因此再擬合一個單調轉換：

$$
q_j
=\sigma\!\left(a\,\operatorname{logit}(\pi_{jK})+b\right),
\qquad a>0,
$$

其中 $q_j$ 是經 task calibration 的 risk-proxy probability。正斜率限制保留原來排序，同時容許機率尺度改變。

這個分別很重要。分類器的 top-label calibration 可以看似合理，但真正用來加總的單一類別機率仍可能高估或低估。反過來，改善一個指定類別亦不證明所有類別或所有用途都完成校準。

手稿報告 expected calibration error，但 ECE 會受 binning 與實作細節影響。在程式及穩定 revision 可供檢查前，本篇只把 ECE 視作手稿證據，不把它寫成已獨立 audit 的統計量。

## 由影像機率走到不確定網格數量

網格 $i$ 的 task-calibrated point estimate 是

$$
\widehat z_i=\sum_{j\in D_i}q_{ij}.
$$

這是一個 expected count，不是 realised count，更不是「網格有偷獵者」的機率。手稿把 realised synthetic count 寫成 Bernoulli variables 之和：

$$
Z_i=\sum_{j\in D_i}B_{ij},
\qquad B_{ij}\sim\operatorname{Bernoulli}(q_{ij}).
$$

當每幅影像機率不同，便得到 Poisson-binomial distribution。Dynamic programming 先給出 base interval；獨立 interval-calibration batch 再選擇一個非負整數 margin，在 deployment evaluation 前把 interval 加寬。

手稿清楚表明這不是 distribution-free conformal guarantee。Coverage 仍取決於 probability model，也取決於 interval-calibration batch 是否能代表 deployment。Simulator 內的 empirical coverage 不能變成對未來 camera network 的普遍定理。

## 配置模型

Fixed-budget experiment 使用 diminishing-return utility：

$$
u_i(\tau_i,z_i)
=z_i\left(1-e^{-\lambda\tau_i}\right),
$$

並限制總巡邏時間及每格上限。估計風險較高的網格先得到較多時間，但同一網格的 marginal gain 逐步下降，所以 optimiser 會把時間分散，而不是把全部 budget 放到最大 point estimate。

研究把 raw、temperature-scaled、task-calibrated 與 predictive-upper counts 所產生的 policies，與 synthetic oracle 比較。Regret 定義為 oracle utility 減去 tested policy 在 simulator expected field 上取得的 utility。

這個設定令 decision consequence 可以量度，亦非常 stylised。它沒有 travel route、ranger 出發點、地形、進入限制、巡邏後 detection uncertainty、對手適應、職員安全，亦沒有把一般人類活動當成可疑事件的傷害。這些省略意味著 utility score 不能被當作 operational recommendation。

## 手稿報告了甚麼

以下數字來自 author-provided camera-ready manuscript，並未在本篇獨立重現。

在二十個、每個 400 格的合成網絡上，手稿報告：

- top-label ECE 由 raw scores 的 $0.341\pm0.010$ 變成 temperature scaling 後的 $0.048\pm0.010$；
- risk-proxy ECE 由 raw 的 $0.111\pm0.013$，變成 temperature scaling 後 $0.057\pm0.005$，再到 task calibration 後 $0.017\pm0.005$；
- oracle-relative patrol regret 由 raw plan 的 $2.64\pm0.51\%$，變成 temperature scaling 後 $0.54\pm0.21\%$，以及 task calibration 後 $0.33\pm0.08\%$；
- base interval coverage 為 $0.877\pm0.028$，held-out calibration 後 coverage 為 $0.932\pm0.020$，nominal level 是 $0.90$；
- task calibration 後，raw-policy regret gap 的 manuscript-reported closure 是 $87.46\pm2.20\%$。

手稿以 $\pm$ 表示 across-seed summaries。本篇稱之為 **reported dispersion**，不自行改稱 confidence interval；精確 aggregation 仍應與 released implementation 或 machine-readable table 對照。

<figure class="article-figure">
  <img src="/images/writing/from-pixels-to-patrols/manuscript-reported-metrics.svg" alt="四張資訊卡概括手稿報告的 top-label 校準誤差、risk-proxy 校準誤差、巡邏 regret 與 interval coverage，並在下方分開已支持與未證立聲稱。" width="1200" height="720" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong> 這是按手稿數值重新繪製的編輯摘要。較低 ECE 與 regret 只在 simulator 內有利；coverage point 與 nominal 0.90 比較。圖中數值均未為本篇獨立重現。</figcaption>
</figure>

結果 pattern 與研究問題相符：校準完整 class vector 有幫助，進一步校準真正進入 decision rule 的機率又帶來額外差異。因此，研究在其已聲明的 synthetic protocol 內展示 probability scale 的 decision-stage consequence。

它並未證明真實 camera-trap classifier 會有同樣程度的 miscalibration 或 improvement。Simulator 以 class bias、noisy logits 與特意 overconfident regime 生成輸出；部署模型可能因 domain shift、未見 species、低照度、camera hardware、habitat、人類活動或 class prevalence 改變而以完全不同方式失效。

## Upper bound 不會自動變得更安全

手稿亦比較 task-calibrated point plan 與 predictive upper endpoint plan。在指定 upper-risk stress field 下，upper-bound plan 按構造會有保護作用；在 nominal field 下，它卻可能令資源過度集中並增加成本。

這是一個有價值的負面結果。「使用 upper confidence bound」並不是免費 robustness principle。它是否有用，取決於 missed event、patrol hour 與錯誤集中資源各自的 loss。真實決策需要 stakeholder-defined costs 與 operational constraints，不能只偏好看似保守的數字。

## 研究沒有證明甚麼

手稿把 synthetic evaluation 列為主要限制。以下說法均超出現有證據：

- pipeline 能偵測偷獵者；
- human-presence class 能分辨獲授權與未獲授權人士；
- 某個指定保護區的 deployed classifier 已完成校準；
- synthetic utility 等於拯救動物、阻止事件或提高 ranger safety；
- interval 有 distribution-free coverage；
- upper-bound planning 普遍 robust；
- manuscript-reported values 已獨立重現；
- 論文已完成口頭報告、已收入 proceedings、已在 IEEE Xplore 上線或已有 DOI。

真實部署還需要合法及合乎倫理地治理涉及人的影像、核對 authorised-person records、接受在地審查、安全處理敏感保育位置、加入 route-aware planning、監察季節與 hardware shift，並反覆檢查 calibration。公開材料不應洩露巡邏路線或脆弱物種座標。

## 可重現性與出版狀態

Supplied six-page PDF 寫明 implementation 可在 project repository 取得，但 PDF 內沒有 repository URL。我沒有驗證 public code revision、dependency environment、完整 seed list、machine-readable result table 或 output manifest。因此，全部數值仍屬 manuscript-reported。

PDF metadata 表示檔案通過 IEEE PDF eXpress certification。[IEEE conference guidance](https://events.ieee.org/planning-basics/ieee-conference-publications/publishing-information-for-ieee-conference-authors/)說明 PDF eXpress 用來檢查或轉換符合 IEEE Xplore 相容格式的檔案；這項 metadata 並不是 IEEE Xplore publication record。

不過，官方所列的出版路徑不只是模糊可能性。[AI4Nature call for papers](https://www.ai4nature.tech/cfp.html)寫明 accepted papers 將收入 AVSS 2026 proceedings 並在 IEEE Xplore 出版，而且每篇 accepted paper 至少要由一個 full registration 覆蓋。[AVSS call for papers](https://www.avss2026.org/call-for-papers/)則寫明 accepted 且已 **presented** 的 papers 會收入 proceedings；camera-ready 流程另要求 PDF eXpress-compatible file、CMT upload 及 IEEE electronic copyright transfer。公開網頁無法核實用戶的付款收據、實際 registration category、CMT final state 或 eCF 是否完成，因此本篇只把它寫成：**若作者端條件完成，而且明日按議程完成報告，則有明確官方出版安排**；不能提前寫成已出版。

官方頁面沒有給出 AVSS-specific Xplore date。IEEE 的 [Xplore conference FAQ](https://xplorestaging.ieee.org/Xplorehelp/administrators-and-librarians/administrator-faqs)表示，proceedings 通常在 IEEE **收到完整內容後**約 30–60 日出現在 Xplore，同時提醒 organizers 可能在 conference 後數星期才送交。合理監察窗口因此是會後數星期至數月，而不是由 8 月 31 日起計的一個保證倒數。

本頁不會上載 supplied PDF，也沒有抽取其中任何 figure。兩幅圖都是為本篇重新製作的 editorial graphics。任何 accepted manuscript 上載前，作者仍應核對適用版本、copyright agreement、required notice 與 co-author approval。IEEE 的 [conference posting policy](https://conferences.ieeeauthorcenter.ieee.org/author-ethics/guidelines-and-policies/post-publication-policies/)明確區分 accepted manuscript 與 version of record。

## 下一次可以更新甚麼

8 月 31 日後，第一項更新應核實已安排的 oral presentation 是否實際舉行。只有經核實後，措辭才可由「scheduled」改為「presented」；這仍不等於 proceedings 已出版。

IEEE Xplore record 出現後，才加入 DOI、完整 citation 與 official abstract link。技術重現亦應另作更新：鎖定 stable code revision、重建 environment、運行已聲明 seeds 或有紀錄的 subset、把 regenerated tables 與手稿逐項比較，並保留相符與不相符之處。

核心教訓毋須把 simulator 假裝成保護區。Probability score 經 aggregation、uncertainty estimation 與 optimisation 後，可以變成 resource-allocation input。因此，只要下游 decision 把 probabilities 當成 quantities，calibration 便不只是 model evaluation 指標，也屬整條決策鏈的 audit 問題。

## 來源與狀態紀錄

1. Chan, K. H., Ao, L. N., Loi, W. K., Tse, L. T., & Cheng, S. K. (2026). *From Pixels to Patrols: A Calibration-Aware Sensor Fusion Pipeline for Camera-Trap-Driven Anti-Poaching Resource Allocation*. Author-provided camera-ready manuscript；截至 2026 年 8 月 30 日，proceedings record 與 DOI pending。
2. [AI4Nature@AVSS 2026 官方議程](https://www.ai4nature.tech/program.html)——Paper ID 7、作者、session 與 scheduled date。
3. [AI4Nature call for papers](https://www.ai4nature.tech/cfp.html)——workshop publication plan 與日期。
4. [AVSS 2026 programme](https://www.avss2026.org/programme/)及 [camera-ready instructions](https://www.avss2026.org/call-for-papers/)——workshop day 與 conference publication process。
5. Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). [On Calibration of Modern Neural Networks](https://proceedings.mlr.press/v70/guo17a.html). *Proceedings of Machine Learning Research, 70*, 1321–1330.
6. [IEEE Xplore conference FAQ](https://xplorestaging.ieee.org/Xplorehelp/administrators-and-librarians/administrator-faqs)——IEEE 收到 proceedings 後一般約 30–60 日的 ingestion guidance，並非 AVSS-specific guarantee。
