---
title: 當降階通風模型離開訓練範圍
slug: when-a-reduced-ventilation-model-leaves-its-training-regime
sourceSlug: when-a-reduced-ventilation-model-leaves-its-training-regime
summary: 一項凍結的 synthetic POD 與 POD-DEIM audit 先驗證 full-order reference，然後因兩個 reduced models 在 nominal holdout 已失敗而停止。
date: 2026-08-30
lastUpdated: 2026-08-30
featured: false
topics: [降階模型, POD, DEIM, 被動標量傳輸, 數值可靠性]
heroImage: /science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_01_basis_nominal_gate.svg
type: 研究筆記
archived: false
scienceProject: when-a-reduced-ventilation-model-leaves-its-training-regime
redirectFrom: []
---

如果一個 reduced model 在任何 shift 發生之前已經失敗，就不能把它之後的失準稱為「在 shift 下失敗」。這條先後次序，決定了整項研究能說甚麼，也決定了何時必須停止。

這個 benchmark 以四個合成 passive-scalar transport cases 訓練 proper orthogonal decomposition（POD）與 POD 加 discrete empirical interpolation（POD-DEIM）。凍結的 evaluation ladder 包括一個 nominal holdout、三個 single shifts，以及一個 combined stress case。原定問題是：schedule、source location 或 ventilation parameter 改變後，person-zone integral 與 threshold duration 的誤差會否超過已宣告 tolerance？

Full-order reference 通過自己的 numerical gate。Reduced models 卻在 nominal holdout 先失敗。POD 的 space-time relative field error 是 0.181929901217，POD-DEIM 是 0.364300559015，而 preregistered limit 是 0.05。兩者的最大 person-zone exposure-integral errors 分別為 0.103855579185 與 0.324698734984，超過 0.08。POD-DEIM 的 threshold-duration miss 更達六十秒，高於四十秒上限。

Terminal verdict 因而是 **STOP_REFERENCE_OR_ROM_INADMISSIBLE**。其中 reference admissible，ROM inadmissible。Shifted-case trajectories 可以保留作 diagnostics，但 Phase 1 不能把其誤差歸因為 distribution shift，因為 control condition 本身已不可信。

另外兩條假設也失敗。用二十四個固定 points 計算的 sampled-residual warning 與 actual POD-DEIM field error 的 Spearman correlation 是 $-0.50$，低於凍結的 $+0.60$ gate，而且沒有把兩個 worst-error cases 放進 warning top three。Accepted attempt 的 median POD-DEIM online speedup 是 2.978205301，亦未達 $5\times$。這些 negative outcomes 全部保留，沒有在看過結果後重選 points、rank 或 threshold。

這是一個 deterministic synthetic transport benchmark。它不是 calibrated room、CFD validation、carbon-dioxide exposure study、infection-risk model、building-controller safety assessment 或 deployment evidence。圖中「person zone」與「exposure」只代表數學 functionals，不代表人或健康風險。

## 測試了甚麼，又在哪裏停止

| 項目 | 凍結 Phase-1 紀錄 | 正確解讀 |
|---|---:|---|
| 文獻 gate | **REFRAME** | Indoor POD、ventilation ROM、DEIM 與 diagnostics 均有先例。 |
| Domain | $8\,\mathrm m\times5\,\mathrm m$，$36\times24$ cells | 一個粗網格合成二維 surrogate。 |
| Time grid | $T=1800$ s，$dt=2$ s | 一套 backward-Euler reference schedule。 |
| Training | 四個 nominal cases | 固定 source locations 與 pulse times 的設計。 |
| Evaluation | nominal、schedule、source、ventilation、combined | 五個 locked cases，只有三個是 single shift。 |
| POD rank | 6，energy 0.999386845565 | Compact training basis，不是 trust certificate。 |
| source-DEIM rank | 4，energy 1.0 | Saved source snapshots 的 energy capture，不代表 state accuracy。 |
| reference refinement | relative $L_2=0.002520990049$ | 通過 0.03 reference gate。 |
| reference minimum | 0 | 通過 $-10^{-12}$ nonnegativity gate。 |
| nominal POD field error | 0.181929901217 | 失敗；limit 是 0.05。 |
| nominal POD-DEIM field error | 0.364300559015 | 失敗；limit 是 0.05。 |
| warning correlation | $-0.50$ | 反駁五 cases 上的 $+0.60$ rule。 |
| median speedup | $2.9782\times$ | 未達 implementation-specific $5\times$ gate。 |
| 重現 | 兩次 signature `8591af…5cfc` | Frozen numerical JSON reproducible；runtime 分開。 |
| verdict | **STOP_REFERENCE_OR_ROM_INADMISSIBLE** | 不容許 causal shift-reliability conclusion。 |

Stop rule 防止一個常見倒敘。Source-shift 與 combined-shift 的大誤差很顯眼，很容易被描述成模型「離開分佈後崩潰」。可是，nominal POD-DEIM field error 已經是 0.3643，遠高於 0.05。如果基準線從未通過 trust gate，就沒有被驗證的 baseline 可供計算額外 shift penalty。

準確結論不是 shift 沒有影響，也不是 shift 一定造成所有 failure。它是更有限的一句話：這個 training 與 reduction design 沒有先建立可信 nominal control，因此目前 experiment 無法識別 shift 所造成的額外 reliability loss。

## 文獻 gate 為何是 REFRAME

POD 在 indoor-environment simulation 已有長期應用。Sempey、Inard、Ghiaus 與 Allery 在二〇〇九年用 POD 快速模擬 air-conditioned rooms 的 temperature distribution（[DOI](https://doi.org/10.1016/j.buildenv.2008.03.004)）。Li、Su、Chu 與 Xu 建立用於 indoor thermal simulation and control 的 fast-POD model（[DOI](https://doi.org/10.1016/j.buildenv.2012.11.020）；Li 等亦把 POD 與 genetic algorithm 結合以優化 office ventilation operation（[DOI](https://doi.org/10.1016/j.enbuild.2013.07.075)）。本研究不能聲稱 indoor POD 或 POD-based ventilation optimization 是新方法。

Field reconstruction 與 flow mixing 同樣已有直接 work。Meyer 與 Tan 用 POD-LSE 從有限 measurements 提供詳細 indoor information（[DOI](https://doi.org/10.1016/j.enbuild.2014.01.015)）。Christ 與 Sattelmayer 研究 automobile HVAC system 的 reduced-order flow and mixing（[DOI](https://doi.org/10.1016/j.applthermaleng.2018.01.023)）。Liu、Pan 與 Long 以 POD 優化 stratum-ventilation supply parameters（[DOI](https://doi.org/10.1016/j.scs.2021.103291)）。Wei、Zhang 與 Jin 用 POD 配 Markov chain 預測 aircraft cabin 的 airborne gaseous-pollutant transport（[DOI](https://doi.org/10.1016/j.buildenv.2022.109816)）。

改變 boundary 或 operating condition 也不是未探索範圍。Luo 等處理 complex boundaries 下 indoor temperature 與 velocity fields 的快速預測（[DOI](https://doi.org/10.1016/j.buildenv.2023.109987)）。Jiang 與 Tominaga 用 POD-based method 預測不同 wind directions 下的 cross-ventilation flow field 與 ventilation rate（[DOI](https://doi.org/10.1016/j.buildenv.2025.113673)）。因此，廣義的「在 nominal condition 以外測試 ventilation ROM」不能構成 novelty。

Hyper-reduction 的基礎更清楚。Chaturantabut 與 Sorensen 提出 DEIM for nonlinear model reduction（[DOI](https://doi.org/10.1137/090766498)），其後推導 POD-DEIM state-space error estimate（[DOI](https://doi.org/10.1137/110822724)）。Wirtz、Sorensen 與 Haasdonk 建立 DEIM-reduced nonlinear systems 的 a posteriori error estimation（[DOI](https://doi.org/10.1137/120899042)）。Drmač 與 Gugercin 提出具改善 error bound 的 selection operator（[DOI](https://doi.org/10.1137/15M1019271)），Oxberry 等則研究 limited-memory adaptive snapshot selection（[DOI](https://doi.org/10.1002/nme.5283)）。

這些 primary works 排除了 broad method claim。可辯護的範圍是一項 preregistered、failure-preserving audit：先問 nominally trained reduction 能否通過 field 與 person-zone gates，再測試一條 cheap warning rule 能否在凍結 synthetic cases 中排序 error。

文獻審計是 targeted search，不是 systematic review。沒有找到完全相同的五-case layout 或 warning score，並不證明沒有人做過。REFRAME 的作用是把 public claim 收窄到實際 evidence，而不是製造「first」敘事。

## Synthetic transport equation

令 $c(x,y,t)$ 是矩形內的 passive scalar：

$$
(x,y)\in[0,8]\times[0,5].
$$

模型包含向右 advection、isotropic diffusion、first-order removal 與 localized time-dependent source：

$$
\frac{\partial c}{\partial t}
+u\frac{\partial c}{\partial x}
=D\nabla^2c-\lambda c+q(x,y,t).
$$

Nominal velocity 是 $u=0.04\ \mathrm{m\,s^{-1}}$，nominal removal rate 是 $\lambda=0.0025\ \mathrm{s^{-1}}$，diffusivity 是 $D=0.03\ \mathrm{m^2\,s^{-1}}$。Localized source 的 Gaussian spatial width 為 0.42 m，amplitude 為每秒 0.08，pulse width 是 360 秒，並用 24 秒 smoothed edges 避免時間上不連續開關。

單位令 synthetic setup 容易閱讀，但不會把它變成 validated building model。方程沒有 walls、furniture、buoyancy、turbulence closure、supply jets、return geometry、thermal coupling、occupancy dynamics、sensor errors 或 measured boundary conditions。Constant horizontal velocity 與 first-order removal 都是為 controlled ROM audit 選擇的 surrogates。

Cell-centered full-order model 使用 $36\times24$ finite-volume grid、first-order upwind advection、conservative diffusive fluxes，以及 backward Euler，$dt=2$ seconds，總 horizon 1800 秒。每六 steps 儲存一次 snapshot。State dimension 是 864 cells，足以呈現移動 source plume 與 transport delay，又小得可以透明 audit；它不是 high-fidelity CFD mesh。

兩個 synthetic person zones 是 Gaussian spatial averages，中心分別在 $(6.2,1.7)$ 與 $(6.2,3.3)$ m，width 0.45 m。它們只是 observation functionals，不是實際 occupants 或 breathing-zone sensors。Event threshold 是 0.12 synthetic concentration units。每個 zone 記錄 peak、time integral 與 total duration above threshold。

Figures 中的「exposure」只指 synthetic zone average 的時間積分。它沒有 toxicological、infectious-dose 或 health interpretation，亦沒有估計 safe/unsafe threshold。這條語義邊界在每一次 public summary 都必須保留。

## Training cases 與 locked evaluation ladder

四個 training cases 全部使用 nominal velocity 與 removal rate，只改 source location 與 pulse start：

| Training case | Source $(x,y)$ m | Pulse start s |
|---|---:|---:|
| train A | $(2.2,1.7)$ | 240 |
| train B | $(2.2,3.3)$ | 720 |
| train C | $(3.0,1.7)$ | 720 |
| train D | $(3.0,3.3)$ | 240 |

Nominal holdout 位於四個 locations 之間，source 是 $(2.6,2.5)$，pulse 於 480 秒開始，並保持 $u=0.04$、$\lambda=0.0025$。它是一個 interpolation-like control。只有先通過它，後面更困難 cases 的 failure 才可能被解讀成超出 nominal regime 的額外 loss。

Schedule shift 保留 nominal source 與 transport parameters，只把 pulse start 移到 1020 秒。Source shift 把 source 移到 $(5.7,4.1)$，保留 nominal schedule 與 transport。Ventilation shift 保留 source 與 schedule，但把 velocity 改為 0.075、removal 改為 0.0060。Combined case 使用 source $(6.1,4.1)$、start 1020、$u=0.080$、$\lambda=0.0065$。

只有 schedule、source、ventilation 是 declared single shifts。Combined 同時改多個 factors，沒有 acceptance gate，只是 frozen evaluation set 內的 exploratory stress diagnostic。文章不會把 combined failure 計入 single-shift success rule，亦不會假裝由一個 combined run 分離每個 factor 的 effect。

這個 ladder 有嚴格順序。第一步驗證 numerical reference；第二步要求 POD 與 POD-DEIM 都通過 nominal gates；第三步才容許把 single-shift failure 描述為本 benchmark 內的 shift-induced loss。Phase 1 在第二步停止。後面數值仍被保存，是 diagnostics，不是把 stop rule 繞過去的 evidence。

## POD 壓縮的是 training snapshots

把 centered training snapshots 逐欄放入 matrix $X$，其 singular value decomposition 是

$$
X=U\Sigma V^\top.
$$

POD 保留 $U$ 的前 $r$ columns，並以

$$
c(t)\approx\bar c+U_r a(t)
$$

代表 full state。Rank 由 frozen energy rule 選擇，並限制在四至二十。最終 rank 是六，retained singular values 捕捉 0.999386845565 的 saved training-snapshot energy。

這個比例只回答一件事：training matrix 的 squared variance 有多少位於 selected linear subspace。它不 bound new trajectory error，不保證 person-zone local accuracy，不保存 threshold duration，也沒有計入 projected dynamics error。Compact spectrum 是 compression diagnostic，不是 reliability certificate。

POD model 把 transport dynamics 以 Galerkin projection 投到六維 basis。它仍在 full representation 評估 localized source，再投影。POD-DEIM 再加入四點 source approximation，只在 interpolation indices 評估 source，並以 source-DEIM basis reconstruct。

Selected source-DEIM rank 是四，對 saved source snapshots 的 energy capture 是 1.0。這仍不表示新 source location 的 forcing exact。Translated Gaussian 對低秩 linear source basis 可以很困難，即使所有 training pulses 在 snapshot energy rule 下都被完整捕捉。Energy statement 必須帶上「training」與「saved snapshots」兩個限定詞。

## 不做 dynamics 的 baseline

Static lookup 選取最近的 nominal training trajectory，直接用於 evaluation case。它刻意簡單，目的是問 reduced dynamical models 是否真正優於一條便宜 stored-trajectory shortcut，而不是只與 full-order solve 比較。

Lookup 當然不預期保存 shifted spatial fields，尤其 source 已移動時。但 baseline 仍然有用：較複雜方法不應只因比 full-order 快而獲勝，它至少應超過最低可行 shortcut。在 nominal holdout，一條 stored plume 恰好經過 monitor 附近，zone summary 可能偶然接近 reference，但 global field 很差。

這個 mismatch 解釋為何需要多個 metrics。Method 可以錯整個 field，卻因正負 cancellation 得到接近的 integral；可以 exposure 接近但 threshold timing 錯；亦可 duration 剛好一致而 peak 完全不同。任何一個 endpoint 都不能代表其餘全部。

## 凍結的 trust gates

Nominal admissibility 要求每一個 reduced model 同時滿足

$$
E_{\mathrm{field}}\leq0.05,
\qquad
E_{\mathrm{exposure}}\leq0.08,
\qquad
E_{\mathrm{duration}}\leq40\ \mathrm s.
$$

Declared single shifts 的 limits 較寬，分別是 0.10、0.15 與 80 seconds。Combined case 只畫出，沒有 pass/fail threshold。Field metric 是 relative space-time $L_2$ error；exposure metric 是兩個 zones 中最大的 relative time-integral error；event metric 是 above-0.12 duration 的 maximum absolute error。Duration 不用 relative error，是避免 reference duration 很短時把中等 absolute difference 放大。

Reference 需要 time-refinement relative difference 小於 0.03，minimum state 不低於 $-10^{-12}$。Diagnostic warning 需要在五 cases 上與 POD-DEIM field error 有至少 $+0.60$ Spearman correlation，並把 error 最差兩 cases 放在 warning top three。Median POD-DEIM online speedup 要至少五。Runtime 明確排除 offline snapshot generation、basis construction 與 DEIM selection。

所有 ranks、cases、thresholds、zone points 與 gates 均在 canonical attempt 前凍結。Nominal failure 出現後，沒有改 rank、加 training snapshot、調 threshold 或重選 warning monitors。

## Compact basis 仍然在 nominal gate 失敗

<figure class="article-figure">
  <img src="/science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_01_basis_nominal_gate.svg" alt="訓練奇異值頻譜與名義留出個案的門檻標準化誤差；雖然選出六個模態，兩個降階模型仍超標。" loading="lazy" />
  <figcaption>圖一：rank six 捕捉超過百分之九十九點九的 training energy，但 POD 與 POD-DEIM 都至少違反一個 nominal trust gate，Phase 1 因而停止。</figcaption>
</figure>

Panel (a) 是最容易令人放心的部分。Normalized singular values 下降數個 orders，rank six 位於早期快速下降之後。對四條 training trajectories 而言，一個六維 representation 看起來合理。

Panel (b) 把每個 nominal error 除以其 frozen gate；bar 低於一才 pass。POD field error 約為 limit 的 3.64 倍，exposure 約 1.30 倍，duration 則是 0.45 倍。POD-DEIM field 約 7.29 倍、exposure 4.06 倍、duration 1.5 倍。Static lookup 的 field 更差，exposure 亦 fail，只有 duration 偶然 pass。

這正是 energy threshold 不能充當 trust threshold 的原因。Training variance 由共同 large-scale plume structures 主導；很小的 omitted variance 可以集中在 holdout source 不同的位置、person-zone functional 敏感區或 threshold crossing 附近。即使 instantaneous projection 良好，Galerkin dynamics 亦是另一條 error channel。

Source-DEIM 的結果更嚴重。Hyper-reduction 並非只以較低 cost 保持 POD error；它把 nominal field error 約加倍，exposure-integral error 約增至 POD 的三倍。Training source snapshots 的 exact energy capture 沒有轉移到 intermediate holdout forcing 與 coupled dynamics。

## Nominal time series 顯示 failure mechanism

<figure class="article-figure">
  <img src="/science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_03_nominal_timeseries.svg" alt="名義留出個案兩個合成人區的濃度時間序列與瞬時場誤差，包含參考、兩個降階模型及靜態查表。" loading="lazy" />
  <figcaption>圖二：POD 高估 reference peaks，POD-DEIM 低估，static lookup 則移動 plume response；active interval 大部分時間的 field error 高於 0.05。</figcaption>
</figure>

Reference 在兩 zones 都達到 symmetric peak 0.333267535058，並維持 threshold 以上 410 秒。POD peak 是 0.362682472446，duration 428 秒；其 zone integral 134.577198548326，而 reference 是 121.915584869943。相應最大 errors 是 peak 8.83%、exposure 10.39%、duration 18 秒。

POD-DEIM 向相反方向偏差。Peak 只有 0.221810733410，integral 82.329748687854，duration 350 秒。其 peak error 33.44%、exposure error 32.47%、duration miss 60 秒。

Static lookup 展示 accidental endpoint agreement。兩條 stored zone trajectories 不對稱，一個 duration 388 秒、另一個 422，所以 maximum duration error 只有 22 秒；但 relative field error 是 1.149357880209。Duration pass 不會令 spatial prediction 可信。

Panel (c) 以 logarithmic scale 顯示 time-resolved field error。在 active plume 期間，ROM errors 並非幾個可被 integration 抵消的 spikes。POD 與 POD-DEIM 在長時間內高於 0.05 line，lookup 更大。Nominal failure 足夠持續，因此觸發 declared stop。

## Shifted results 只能作 diagnostics

<figure class="article-figure">
  <img src="/science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_02_shift_metrics.svg" alt="五個凍結個案中三種方法的場誤差、積分誤差和門檻持續時間誤差，並標出名義與單一轉移門檻。" loading="lazy" />
  <figcaption>圖三：source 與 combined cases 的 error 很大；因 nominal admissibility 已經失敗，這些 shifted values 不能解讀成由 shift 造成的額外 error。</figcaption>
</figure>

Machine-readable metrics 如下；每組依次為 field、exposure、duration：

| Case | POD | POD-DEIM | Static lookup |
|---|---:|---:|---:|
| Nominal | 0.1819 / 0.1039 / 18 s | 0.3643 / 0.3247 / 60 s | 1.1494 / 0.1650 / 22 s |
| Schedule | 0.1819 / 0.1022 / 18 s | 0.3643 / 0.3258 / 60 s | 1.2585 / 0.1645 / 22 s |
| Source | 0.3618 / 0.2339 / 38 s | 1.0000 / 1.0000 / 418 s | 1.1923 / 0.9686 / 134 s |
| Ventilation | 0.3590 / 0.1446 / 12 s | 0.3898 / 0.2908 / 100 s | 1.8964 / 1.0044 / 88 s |
| Combined | 0.5567 / 1.1821 / 6 s | 1.0000 / 1.0000 / 356 s | 2.4005 / 9.8400 / 390 s |

Source-shift POD-DEIM 特別差。Field error 1.0、exposure error 1.0、duration miss 418 秒，表示 reduced trajectory 幾乎沒有保存 relevant plume。Combined 同樣有 field 與 exposure 1.0，duration miss 356 秒。這些 observations 可以指出 frozen ROM 在哪些 cases 不可靠。

它們不能識別原因。Nominal POD-DEIM field error 已達 0.3643，source case 的 1.0 不能在本 protocol 中分解成「trusted baseline 加 shift penalty」。Training-basis truncation、projected dynamics、source interpolation 與 parameter change 可以互相作用。沒有 nominally admissible control，就無法 isolate 最後一項。

Schedule shift 與 nominal errors 幾乎相同，因 system time invariant，而且 pulse 在 horizon 內仍有完整 response。這是有用 internal diagnostic。Ventilation shift 改變 transport 與 removal，field 及 duration errors 都變化。但在 stop rule 之後，這些 pattern 仍然只可描述，不能作 causal shift-reliability conclusion。

Combined case 的 POD duration error 只有六秒，看起來非常好，但 field 0.5567、exposure 1.1821。這再次顯示 cancellation：threshold duration 可以剛好接近，trajectory 與 spatial field 卻嚴重錯誤。沒有一個單一 metric 可升格為全面 pass。

## Cheap warning 指向錯誤方向

<figure class="article-figure">
  <img src="/science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_04_diagnostic_failure.svg" alt="實際降階場誤差排序與二十四點殘差警告排序的對照；秩相關為負零點五，未達正零點六。" loading="lazy" />
  <figcaption>圖四：sampled residual 給 nominal 與 schedule 高 warning，卻把最差的 source 與 combined 評為低分；frozen warning rule 被反駁。</figcaption>
</figure>

Warning 只在二十四個固定 monitor points 評估 residual，原意是不 reconstruct full state 也能給 online signal。五 cases 的 POD-DEIM field errors 約為 0.36、0.36、1.00、0.39、1.00；sampled-residual RMS 則為 6.89、6.89、1.00、9.17、1.00。

對原定用途而言，ordering 幾乎完全相反。兩個 worst cases 收到最小 warning；ventilation 收到最大 9.17，field error 卻遠低於 source 與 combined。Spearman correlation 是 $-0.50$，不只是稍低於 $+0.60$。Worst-two-within-top-three condition 亦 fail。

這個結果只直接 refute 一條 warning rule 在一組五-case synthetic audit 的表現。它不證明 residual diagnostics 永遠無效。Fixed samples 可能漏掉 translated source，normalization 可能不合適，DEIM structure 亦可能令 sample points 的 residual 很小而 reconstruction error 很大。任何新 diagnostic 都需要新 frozen design 與 untouched evaluation，而不能用這五個已看過 outcomes 反覆挑 points。

Full-state subspace angle 與 projection error 只保存作 oracle audits。Largest angles 在不同 cases 接近九十度，projection errors 由 nominal 0.1526 至 combined 0.4666。這些 quantities 需要 online warning 原本拿不到的 full state，所以只能解釋 failure，不能宣稱 deployable。

## Nominal pulse midpoint 的 spatial fields

<figure class="article-figure">
  <img src="/science/when-a-reduced-ventilation-model-leaves-its-training-regime/p05_05_nominal_fields.svg" alt="時間六百六十秒的名義完整階參考場、兩種降階場與離散插值模型相對參考的絕對誤差場。" loading="lazy" />
  <figcaption>圖五：POD plume 有位移並較闊，POD-DEIM 則壓低大部分 nominal source response；error map 是 synthetic numerical field，不是 room measurement 或 risk map。</figcaption>
</figure>

在 $t=660$ 秒，reference plume 在 source 下游有 localized high-concentration region 與較寬 transported tail。POD 保留大致方向，但移動並平滑 high region。POD-DEIM 大幅壓低 peak 並改變 downstream field。Absolute-error panel 把 discrepancy 定位在 source plume 與 advected wake 附近。

圖像解釋 person-zone endpoints 為何改變。兩個 zones 都在 domain 右側；plume amplitude 或 arrival 有小變化，就可能同時改變 peak、integral 與 threshold duration。Global field norm 平均所有 cells 與 times，而 zone functional 強調一個局部區域。可靠 ROM 需要同時接受兩種檢查。

這張圖不能支持 indoor air-quality claim。Scalar source amplitude 是 synthetic，velocity field constant，domain 沒有房間 features，person zones 是 Gaussian weights。它的角色是診斷 numerical reduction，不是展示住戶 exposure 或風險分布。

## Full-order reference 通過自己的 gate

Verdict 名稱含有 `REFERENCE_OR_ROM`，因為任何一層都可能令 phase 停止。本次 reference passes。把 time step 減半後，saved full-order trajectory 的 relative $L_2$ difference 是 0.002520990049，低於 0.03。Minimum concentration 在 stored precision 是零，符合 $-10^{-12}$ floor。

二十個 focused tests 涵蓋 grid geometry、conservative operator behavior、source evaluation、POD orthogonality、DEIM interpolation、person-zone functionals、case freeze、signature construction 與 result validation，全部在 captured environment 通過。

這些 checks 只容許把 finite-volume trajectory 稱為此 synthetic benchmark 的 declared reference。它們沒有建立 grid-converged CFD 或 physical-flow fidelity。Grid 只有 $36\times24$，advection 是 first-order upwind，velocity prescribed。「Reference」的範圍必須連同 frozen verification criteria 一起讀。

Numerical-model reduction fidelity 與 physical-model validity 是兩層不同 evidence。ROM 可以準確逼近一個 synthetic full-order model，而兩者都未描述實際 building；亦可以像本次般 reference numerically admissible，ROM 卻未能達到 synthetic comparison gate。任何一層通過都不能代替另一層。

## 為何名義控制必須先於轉移解釋

要把一個誤差稱為「由分佈轉移造成」，至少需要一條可信的未轉移基準。直觀上，可以把評估結果想成基準能力、模型與資料不配合、以及數值隨機或測量不確定性的共同表現。如果基準能力已低於接受線，後來的大誤差不能唯一拆成原有缺陷與轉移新增部分。

本 benchmark 雖然 deterministic，識別問題仍然存在。名義個案位於四個訓練 source locations 中間，使用相同速度、移除率與 pulse family，原意是檢查空間與時間上的溫和插值。POD 在這個控制的場誤差已是上限三點六倍，POD-DEIM 更是七點三倍。因此，source-shift 的一點零誤差可能包括基底未能表示中間位置、投影動力學偏差、source interpolation 偏差，以及真正參數外推的交互作用。單次結果不能把它們分開。

Schedule case 與 nominal 幾乎相同，並不證明模型對任意時間轉移穩健。這個方程與離散在設定下時間不變，且較遲 pulse 仍有足夠時域完成反應，所以時間平移自然帶來相近指標。若 pulse 接近 horizon 終點、邊界條件隨時間變，或 removal schedule 改變，結論可能不同。現有數據只描述已鎖定的一個 schedule shift。

Ventilation case 同時改 velocity 與 removal，所以嚴格來說，即使名義 gate 通過，它仍代表一個二參數 operating-condition change，而不是只改一個物理旋鈕。Project 把它預先命名為單一「ventilation」情景，是因兩參數共同代表一套抽象操作狀態；不能由此分辨速度與移除各自貢獻。若要作機制歸因，需要因子設計分開改動並加入交互項。

Combined case 更明確沒有 acceptance gate。它同時移動 source、延後 pulse 並改 transport parameters。其作用是查看 frozen ROM 在一個壓力情景會呈現甚麼，而不是估計某個單一 effect。POD 的 duration error 只有六秒，正好提醒我們：一個看似成功的 endpoint 可以與極差的 field 及 integral 同時出現。若只挑最漂亮指標，就會把 cancellation 誤當 reliability。

Stop rule 因此不是浪費後面計算。保留 shifted diagnostics 可以定位 development weaknesses，也能測試 warning ranking；但 claim ledger 把「描述」與「歸因」分開。描述可以說 source 與 combined cases 的 POD-DEIM error 最大；歸因則不能說 source shift 導致 failure。前者由數字直接支持，後者需要一個已通過的對照及更強設計。

## 三類誤差為何不能互相代替

場誤差把全部網格及時間上的差異彙總，回答 reduced trajectory 在整體上離 reference 多遠。它對大範圍偏差敏感，也會把 person zones 之外的 regions 計入。相對正規化使不同 cases 可比較，但當 reference norm 很小時仍需小心解讀。本次 active plumes 提供非零 denominator，並由結果 validator 檢查有限性。

Exposure-integral error 只看兩個 Gaussian zones 的累積量。它是較接近應用決策的局部 functional，但可以因早期高估與晚期低估互相抵消。兩條完全不同的 time series 亦可能有相同積分。因此，integral pass 不能保證 peak、arrival 或 field pass；static lookup 的偶然表現就是例子。

Duration error 把每個 time sample 與 0.12 threshold 比較，再累加 above-threshold time。它對 crossing 附近的細小 amplitude 偏差敏感，而且只保存總長度，不保存區間位於何時。兩個 trajectory 可以在完全不同時間超標，總 duration 卻一樣。用 absolute seconds 而非 relative ratio，可以避免 reference duration 短時 denominator 放大，但沒有消除 threshold functional 的不連續性。

Nominal gate 要三項同時通過，是因任何一項都可能暴露另一項看不到的 failure。POD duration pass 不能抵銷 field 與 exposure fail；POD-DEIM 三項全 fail，更不容許用 compact basis energy 覆蓋。Gate normalization figure 把每一項除以自己的 limit，讓一條水平線表達通過與否，但不同 bars 仍對應不同 units 與意義，不應把它們相加成一個未申報總分。

Person-zone 指標取兩 zones 中最大 error，而不是平均。這是保守的 audit choice，避免一個 zone 表現好掩蓋另一個。它不表示這兩個位置代表所有室內位置，也不表示最大值是 population exposure。位置在 synthetic protocol 中固定，只用來測量局部 plume sensitivity。

這種多指標設計也說明為何不能在結果後選擇「最合理」指標。如果先看見 POD duration 通過，才宣稱 duration 最重要，就會產生 outcome selection。研究可在下一版本以應用理由指定 primary endpoint，但必須在打開結果前完成，並仍報告其餘關鍵 diagnostics。

## 從基底、動力學到超降階的誤差鏈

POD-DEIM 的最終誤差不是單一來源。第一層是 representation error：六維狀態基底未必包含 holdout plume。第二層是 projected-dynamics error：即使某個 state 能投影得好，沿六維 coordinates 演化仍可能累積偏差。第三層是 source hyper-reduction error：四個插值點與 source basis 要代表新的 Gaussian location。第四層是 time integration 與 full-order reference 本身的離散誤差。

Training energy 只直接描述第一層在已保存 training snapshots 的平均平方意義，並且連 holdout representation error 都不直接 bound。Source-DEIM energy 同樣只描述 training source matrix。它不控制新的 translated source 在插值點之外的重建，也不控制重建 forcing 經 dynamics 放大的程度。

Nominal POD error 0.1819 已顯示狀態基底或投影動力學不足。加入 DEIM 後變成 0.3643，說明 source approximation 再引入顯著 error，卻不能單憑兩個 totals 精確分解比例。要量化各層，可另算 holdout snapshot 的最佳投影誤差、以 full source 驅動的 projected dynamics、固定 state 下的 DEIM forcing error，以及逐時間 residual。這些 analyses 需預先規劃，不能把本次有限 diagnostics 說成完整 decomposition。

最差 source 與 combined cases 的 DEIM field error 顯示為一點零，並非一個神奇上限保證，而是相對誤差在該結果中的實際值。讀者應同時看 exposure、duration 與 spatial field，避免把格式化後的一點零誤會成 clipping。Machine-readable results 保存較完整精度，圖表為可讀性顯示四位小數。

改良方向應針對誤差鏈提出可測假設。例如增加 source locations 是檢查 training coverage；translated basis 是針對移動 plume；提高 POD rank 是針對 representation capacity；分開 source basis 是針對 forcing；改 warning samples 是針對 observability。每項改動都需新 validation，而不是一次全部改完再把 improvement 歸給某一項。

## Warning failure 應如何被使用

負相關不是「沒有相關」那麼簡單。在這五點上，warning 排序傾向把真正高 error 放在較低位置。若用它作觸發 full-order fallback，最需要 fallback 的 source 與 combined 反而可能不觸發。因此，在目前 frozen form 下，warning 不只未證明有用，還明確不應被部署。

不過，樣本只有五 cases，相關係數的不確定性很大。本次 gate 是一條預先申報的最低行為測試，不是對 population correlation 的精密估計。通過也不會足以證明 deployment；失敗則足以拒絕這個具體規則進入下一階段。這種非對稱正是 feasibility gate 的用途。

Worst-two-within-top-three rule 提供另一種不依賴相關值的 operational test。即使一個 score 在中間 cases 排序有少量顛倒，只要能把最危險 cases 放進有限檢查名單，仍可能有實際價值。本次連這條較寬鬆要求也失敗，所以不能以「樣本少令相關不穩」迴避結果。

要重做 warning，可先從幾何上檢查二十四 points 是否覆蓋 translated sources 與 downstream wakes，再在 development cases 比較不同 normalization。但 final threshold 與 samples 必須在 untouched cases 前凍結。若使用 full-state oracle 指標來選 point，亦要在公開說明它只是 offline design aid，不能把 oracle performance 當 online evidence。

最重要的是，warning 層次位於 accuracy 之後。即使 warning 完美排序，一個 nominally inadmissible ROM 也不會因「知道自己可能錯」而自動變可信。可靠 pipeline 需要先有可接受 base model，再有能辨認離域風險的監測，最後才有 fallback action。此研究只測到前兩層，且兩層都未達 gate。

## Speed gate 亦失敗

Accepted attempt 的 median POD-DEIM online speedup 是 2.978205301，相對 full-order finite-volume solve；gate 是五。Individual ratios 約為 nominal 2.80、schedule 8.99、source 3.61、ventilation 2.93、combined 2.98。

這些 runs 很短，full-order case 只需幾百分之一秒，所以 fixed Python 與 linear-algebra overhead 佔比很大。Schedule case 的 8.99 不能把 median 推過五。Machine、compiled kernel、batch size 或 state dimension 改變，都可能大幅改動 runtime。

Offline costs 按設計排除，包括 snapshot generation、SVD、DEIM basis construction、point selection 與 model-management cost。所以 saved ratio 不是 end-to-end economic claim，只回答這個 implementation 是否通過一條 preregistered online threshold。答案是否定。

Speed gate 不是 scientific STOP 的首要原因，因 nominal accuracy 已先 fail。它仍是一條獨立 refuted claim。保留它可以避免把 inaccurate ROM 單憑「比較快」宣傳成成功，也防止只報最快 schedule case 而隱藏 median。

## 兩次數值 run 相同，runtime 另存

Frozen configuration SHA-256 是

`228dec8f69ca5d02adfcd2e7e94242d29bc5184359947446a4ee48d501ff6f4b`。

Canonical attempts 0001 與 0002 都產生 numerical signature

`8591afc2f1727654ac264197fc24939e81d44d1ccead8e6cbff16093ca05dcfc`，

而 machine-readable numerical JSON byte-equivalent。

Runtime 不進入 signature。這讓 genuine timing variation 不會把 deterministic numerical reproduction 誤判為 failure。每個 attempt 都保存 environment、invocation、config snapshot、per-case series、fields、basis data、metrics、summary、numerical signature 與 separate runtime file。

第二次 attempt 沒有觸發 rank change、threshold tuning、source-grid modification 或 monitor reselection，只是在相同 protocol 下重現 null。Immutable attempt directories 與 append-only lifecycle record 保存實際工作次序。Reproducibility 不能把 failed gate 變成 positive，只能證明它不是 captured pipeline 的單次偶然。

## Visual evidence 與 rejected revisions

五幅 canonical figures 均輸出 SVG、vector PDF 與 600-dpi PNG。Publish SVG 與 accepted canonical SVG byte-identical。Lines、markers、hatches、direct labels 與 panel structure 提供 redundant encoding；SVG 含 title 與 description metadata，文字全為黑色，per-figure manifest 把 source metrics 連回 result files。

Accepted source revision 是 `final-003`。Initial layout 因 legend-data、annotation-data、colorbar-axis collisions、layout-bound failures，以及 SVG 內含 rasterized field content 而被拒。第二 revision 修正 geometry，卻仍有 raster colorbars，所以再次 rejected。第三 revision 改用 vector colorbar solids，通過 programmatic checks，以及全部五張 600-dpi PNG 與五張 2.5-times PDF renders 的 original-size review。

Technical repository 保留 rejected versions；site 只複製 accepted publish assets，並核對 SHA-256。Blog repository 沒有重新畫或編輯 scientific plots。這個界線確保 layout QA 不會變成無紀錄的 data alteration。

原尺寸 review 逐一查看四邊、panel headings、axis labels、ticks、legends、annotations、curves、markers 與 colorbars。Programmatic bounding-box pass 不能代替這一步，因文字與曲線可在 bounding boxes 未越界時仍然互相遮蓋。PNG 與 PDF raster counterpart 都 pass，才容許進入 publication manifest。

## 能夠聲稱的四件事

Evidence 支持四條窄 claim。第一，declared finite-volume reference 通過 Phase-1 time-refinement 與 nonnegativity checks。第二，selected rank-six POD 與 rank-four source-DEIM construction 沒有通過 nominal trust gate。第三，frozen 24-point sampled-residual score 未能按 POD-DEIM field error 排列五個 cases。第四，accepted implementation 沒有達到 five-times median online-speed gate。

Evidence 不支持以下 broader statements：

- distribution shift caused source 或 ventilation failures；
- POD 或 POD-DEIM 一般不適合 ventilation；
- DEIM 永遠不能 approximate moving sources；
- sampled residual 不可能修正；
- 此 ROM 已可 real-time control 或 deployment；
- synthetic threshold duration 是 health 或 safety endpoint；
- full-order model 是 validated CFD；
- results 適用於 real building、aircraft、classroom 或 occupant；
- work 發明 POD、DEIM、error estimator 或新的 indoor-ROM method。

Refuted frozen claim 與 universal impossibility 必須分開。這個由四個 source cases 建立的 rank-six basis 在這個 holdout 失敗。另一個較大 basis、transport-aware coordinate transform、localized library、shifted modes、nonlinear manifold、擴充 training design 或不同 hyper-reduction 可能成功；Phase 1 沒有測試它們。

## 一個可辯護的 next phase 需要改變甚麼

下一階段首先要修復 nominal admissibility，而且不能把現有 evaluation cases 偷偷當作 tuning set。可研究的 directions 包括增加 nominal training locations、分離 transport 與 source bases、使用 translated 或 localized bases、在凍結 selection rule 下提高 rank，或把 source location 當 parametric input，而不是要求同一 linear source basis 直接代表 translations。

修復後需建立新的 training、validation 與 untouched evaluation partitions。舊 nominal holdout 已參與 diagnosis，不能再冒充 pristine final test。Ranks、gates、monitor points 與 hyper-reduction choices 應在打開新 evaluation results 前凍結。

只有 POD 與 POD-DEIM 都通過 nominal control，才可以解讀 single shifts。之後可用 factorial design 分離 schedule、source、velocity 與 removal effects，而不是每個 factor 只有一個 case。Repeated parameter points 也可為 correlation 與 ranking 提供 uncertainty；五-case Spearman statistic 本來就很脆弱，不能當穩定 population measure。

Warning design 亦需分開 deployable information 與 oracle analysis。實用 score 可以考慮 sampled residuals、conservation defects、coefficient extrapolation、local basis distance 或 ensemble disagreement，但 thresholds 必須在 validation cases 選擇，再於 untouched shifts 評估。Full-state projection error 與 subspace angle 可以幫助解釋，卻不能在 full state unavailable 時稱作 online warning。

若要提出 physical ventilation claim，整個 evidence layer 都要更換：需要 dimensional geometry、real boundary conditions、turbulence 或 flow model、mesh study、measurements、sensor uncertainty、calibration split、external validation 與 application-specific endpoints。Health language 還需要額外 domain review。這些都不能由 current synthetic surrogate 推出。

## 精確重現邊界

Technical repository 包含 frozen config、dependency lock、exact attempts、tests 與 plotting pipeline。由 P05 project root 執行的紀錄次序為：

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
.\.venv\Scripts\python.exe scripts\run_phase1.py --config configs\phase1.toml --attempt-id attempt-0001
.\.venv\Scripts\python.exe scripts\run_phase1.py --config configs\phase1.toml --attempt-id attempt-0002
.\.venv\Scripts\python.exe scripts\check_reproducibility.py
.\.venv\Scripts\python.exe scripts\plot_phase1.py
.\.venv\Scripts\python.exe scripts\check_repo.py
```

Published attempt IDs immutable；fresh execution 應用新 IDs 或另一 results root。Environment-specific runtime 不應期望 byte-for-byte 一致。Canonical numerical signature 與 saved JSON 才定義本次 reproduction claim。

Blog 不取代 repository。Prose 負責說明 gate ordering 與 claim boundary；numbers 由 canonical JSON 提供，tests 只支持其覆蓋的 numerical properties，manifest 追蹤每幅 accepted figure。若摘要與 machine-readable result 衝突，應修正摘要而不是改 result。

## 精確而有限的結論

Full-order finite-volume reference 在 frozen synthetic checks 下 admissible。Time-refinement difference 是 0.002520990049，state 保持 nonnegative。Training spectrum 亦很 compact：六個 POD modes 捕捉 0.999386845565 的 snapshot energy，四個 source-DEIM modes 捕捉 saved source energy。

這些 compression facts 沒有產生可靠 nominal ROM。POD 的 field 與 exposure errors 超標；POD-DEIM 的 field、exposure、duration 以更大幅度超標。Experiment 因此在對 schedule、source-location 或 ventilation shift 歸因之前停止。

Shifted diagnostics 仍指出 frozen model 在 source 與 combined cases 特別差，而 cheap residual warning 恰好把它們列為低風險。這條 warning 在五個 locked cases 被反駁。Implementation 亦未達 median online-speed target。

最有用的結果是一條 procedural discipline：shift study 需要可信 nominal control，compact singular-value spectrum 不能代替；cheap warning 要以 actual error 驗證，不能因容易計算便假設有資訊；speedup 只有在 accuracy 與 scope 說清楚後才有意義。本次每個 gate 都獲准失敗，而 failure 決定唯一可辯護 headline：**reference 通過，nominal reduced models 不通過，所以 training-regime question 被阻擋，不能用 shifted plots 假裝已回答。**

## 文獻 gate 使用的 primary works

1. Sempey, Inard, Ghiaus & Allery (2009), air-conditioned room POD. [DOI](https://doi.org/10.1016/j.buildenv.2008.03.004)
2. Li, Su, Chu & Xu (2013), indoor thermal fast-POD. [DOI](https://doi.org/10.1016/j.buildenv.2012.11.020)
3. Li, Xue, Xu & Su (2013), POD ventilation optimization. [DOI](https://doi.org/10.1016/j.enbuild.2013.07.075)
4. Meyer & Tan (2014), POD-LSE with limited measurements. [DOI](https://doi.org/10.1016/j.enbuild.2014.01.015)
5. Christ & Sattelmayer (2018), automobile HVAC reduced flow and mixing. [DOI](https://doi.org/10.1016/j.applthermaleng.2018.01.023)
6. Liu, Pan & Long (2021), stratum-ventilation POD optimization. [DOI](https://doi.org/10.1016/j.scs.2021.103291)
7. Wei, Zhang & Jin (2023), aircraft-cabin pollutant prediction. [DOI](https://doi.org/10.1016/j.buildenv.2022.109816)
8. Luo et al. (2023), complex-boundary indoor field prediction. [DOI](https://doi.org/10.1016/j.buildenv.2023.109987)
9. Jiang & Tominaga (2025), cross-ventilation prediction under wind direction changes. [DOI](https://doi.org/10.1016/j.buildenv.2025.113673)
10. Chaturantabut & Sorensen (2010), discrete empirical interpolation. [DOI](https://doi.org/10.1137/090766498)
11. Chaturantabut & Sorensen (2012), POD-DEIM state-space error estimate. [DOI](https://doi.org/10.1137/110822724)
12. Wirtz, Sorensen & Haasdonk (2014), DEIM a posteriori error estimation. [DOI](https://doi.org/10.1137/120899042)
13. Drmač & Gugercin (2016), improved DEIM selection operator. [DOI](https://doi.org/10.1137/15M1019271)
14. Oxberry et al. (2017), limited-memory adaptive snapshot selection. [DOI](https://doi.org/10.1002/nme.5283)
