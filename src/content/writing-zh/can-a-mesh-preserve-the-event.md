---
title: 網格能否保留這個事件？
slug: can-a-mesh-preserve-the-event
sourceSlug: can-a-mesh-preserve-the-event
summary: 一個凍結的 growing-domain reaction–diffusion benchmark 出現清楚的 modal transition，但預先申報的事件仍然是 null，adaptive-mesh 比較因此必須停止。
date: 2026-08-30
lastUpdated: 2026-08-30
featured: false
topics: [數值分析, 有限元素, 反應擴散, 事件偵測, 可重現研究]
heroImage: /science/can-a-mesh-preserve-the-event/p01_01_event_score.svg
type: 研究筆記
archived: false
scienceProject: can-a-mesh-preserve-the-event
redirectFrom: []
---

一幅數值圖可以看起來已經完成峰值分裂，但用來量度這次分裂的事件仍然不存在。這不是措辭上的差別，而是本專案在比較任何自適應網格之前必須先回答的邏輯問題。

原來的研究構想很直接：在一個按指定速率指數增長的一維區間上，Schnakenberg 反應擴散圖樣由一階空間模態轉移到二階模態；然後比較均勻有限元素、residual-based adaptivity 與 event-goal adaptivity，看看哪一種方法能用較少計算量保留首次 modal-transfer time。可是，這個比較從未獲准開始。

凍結的事件定義不只要求一條分數曲線穿過門檻。mode one 必須先同時滿足幅度與 modal purity 兩個條件，並連續維持五十個時間單位；只有在這段 establishment interval 之後，modal-transfer score 向上穿越 $S=0.5$ 才可稱為 $t^*$。所有 growing-domain FEM 與 FD 計算都在時間約五百四十出現明顯的 raw crossing，之後 $S$ 更接近一。然而，兩個 establishment 條件同時成立的最長時間只有十六。formal analyzer 因此在所有 solver 上都回傳 `event_time: null`。

這就是 Phase-1A 的結果。專案沒有在看過曲線後縮短時間窗、移動門檻、改用 peak count，亦沒有把 raw crossing 重新命名為正式事件。終止判定是 **STOP_PHASE1A**。Residual adaptivity、adjoint、goal marking、estimator effectivity、matched-resolution comparison 與效率結論全部保持 locked，而且沒有執行。

## 先把證據邊界寫清楚

| 項目 | 凍結紀錄 | 可以支持甚麼 |
|---|---:|---|
| 文獻 gate | **REFRAME** | 可以做 replication-extension benchmark，不能聲稱方法原創性。 |
| 模型 | 一個 prescribed-growth 一維 Schnakenberg 系統 | 合成數值個案，不是生物校準。 |
| 時域 | $T=1200$ | 容納預期 transition 與事後 persistence window。 |
| FEM 層級 | $(128,0.2)$、$(256,0.1)$、$(512,0.05)$ | 三組 nested uniform P1 FEM space-time resolution。 |
| 獨立核對 | 1024-cell conservative FD，$dt=0.025$ | 另一套 assembly 的診斷 reference，不是效率競爭者。 |
| raw crossing | 539.45 至 541.39 | 一個隨 refinement 移動的可見 transition。 |
| 最長 establishment | 16；要求 50 | 凍結定義下的事件不存在。 |
| formal event time | 所有 growing solves 均為 `null` | 不能計 event-time error，亦不能比較 adaptivity。 |
| no-growth control | 沒有 raw crossing；沒有 event | 相同 detector 不會在移除 growth 後製造 split。 |
| numerical verification | 時間一階、空間二階、constant residual 為零 | 相關 operator 的實作行為符合預期。 |
| 重現 | 兩次 signature 同為 `acc4a…7344` | 凍結設定下的 null 是 deterministic。 |
| 未執行部分 | residual/goal adaptivity、adjoint、effectivity、efficiency | 對這些階段沒有結果，也沒有 claim。 |

這張表刻意分開三件事。第一，operator-level verification 可以通過。第二，FEM 與一套獨立組裝的 FD 可以在肉眼可見的 transition 上高度一致。第三，預先申報的 event predicate 仍然可以是假。前兩項證據不能把第三項由 false 改成 true。

## 文獻審計為何把研究問題收窄

Growing-domain pattern formation 並不是空白領域。Crampin、Gaffney 與 Maini 在一九九九年推導 growing domain 上的 reaction–diffusion equations，並以 Schnakenberg system 展示 frequency doubling（[DOI](https://doi.org/10.1006/bulm.1999.0131)）。他們其後用 piecewise-linear analysis 更直接研究 mode doubling 與 tripling（[DOI](https://doi.org/10.1007/s002850100112)），並在相關模型中處理 nonuniform growth（[DOI](https://doi.org/10.1006/bulm.2002.0295)）。所以，本專案可以把 canonical mechanism 當作 benchmark，卻不能把 growth-induced peak splitting 包裝成新發現。

這類系統的有限元素離散也已有直接先例。Madzvamuse、Wathen 與 Maini 用 moving-grid FEM 模擬 biological pattern generator（[DOI](https://doi.org/10.1016/S0021-9991(03)00294-8)）。之後的研究分別處理 moving-grid Turing simulation（[DOI](https://doi.org/10.1007/s10915-004-4617-7)）、fixed 與 growing domain 上的 time stepping（[DOI](https://doi.org/10.1016/j.jcp.2005.09.012)），以及 grid velocity 對所選圖樣的影響（[DOI](https://doi.org/10.1016/j.jcp.2006.11.022)）。最後一項尤其重要：一個看來合理的圖樣不一定是 mesh-independent 的圖樣。

對 evolving-domain discretization 的驗證亦已有成熟結果。MacKenzie 與 Madzvamuse 分析一維 growing domain 上有限差分的 stability 與 convergence（[DOI](https://doi.org/10.1093/imanum/drp030)）。Lakkis、Madzvamuse 與 Venkataraman 為 evolving domain 上的 implicit-explicit FEM 建立 error estimates（[DOI](https://doi.org/10.1137/120880112)）。MacKenzie、Rowlatt 與 Insall 後來提出二維 evolving domain 的 conservative ALE finite-element scheme（[DOI](https://doi.org/10.1137/19M1298585)）。因此，新 benchmark 必須驗證自己的 assembly 與 time treatment，不能把基本 solver correctness 當成貢獻。

Adaptivity 也不是新主意。Venkataraman、Lakkis 與 Madzvamuse 報告 growing-domain semilinear reaction–diffusion system 的 adaptive FEM（[DOI](https://doi.org/10.1007/978-3-642-33134-3_8)）；Xie 與 Hu 亦在包括 growing-domain example 的反應擴散問題使用 adaptively moving finite elements（[DOI](https://doi.org/10.4208/nmtma.2016.m1229)）。Li 與 Yi 對 nonlinear reaction–diffusion problems 建立 goal-oriented a posteriori estimators（[DOI](https://doi.org/10.1016/j.cam.2022.114362)）。這些文獻排除了「第一個 adaptive growing-domain solver」或「第一個 goal-oriented reaction–diffusion method」一類說法。

First-threshold time 本身也是特殊 quantity of interest。Chaudhry、Estep、Stevens 與 Tavener 對 differential equations 的 first time to a threshold 推導 error representation（[DOI](https://doi.org/10.1007/s10543-020-00825-0)），後續 PDE work 把 adjoint-based estimate 延伸到 evolutionary semilinear parabolic equation（[DOI](https://doi.org/10.1007/s10543-023-00947-1)）。Cliffe、Collis 與 Houston 則在 goal-oriented framework 中處理 nonsmooth travel-time functional（[DOI](https://doi.org/10.1137/140960499)）。

有限的 targeted search 沒有找到完全相同的組合：這個一維 frequency-doubling case、這個 smooth modal score、這個 establishment predicate、一套 independently assembled reference，以及 uniform、residual 與 event-goal marking 的 matched-resolution comparison。這種「沒有找到」不是不存在的證明。它只容許一條很窄的 replication-extension 問題：在已宣告的 protocol 下，必要的 reference event 能否先被建立？

## 凍結的 growing-domain 模型

Reference coordinate 是 $x\in[0,1]$，兩端使用 homogeneous Neumann conditions。把物理增長拉回固定座標後，兩個 state components 滿足

$$
\partial_t \mathbf c
=\gamma(t)^{-1}\operatorname{diag}(1,0.01)\,\partial_{xx}\mathbf c
+
\begin{bmatrix}
0.9-c_1c_2^2\\
0.1-c_2+c_1c_2^2
\end{bmatrix},
\qquad \gamma(t)=e^{0.002t}.
$$

Growth-rate parameter 是 $\rho=0.001$，而 $\gamma=e^{2\rho t}$。物理區間變長時，拉回 reference coordinate 的 diffusion coefficient 乘上 $\gamma^{-1}$，所以 diffusion 的相對作用逐步減弱。這是從 primary literature 選出的 nondilute slow-growth benchmark。被省略的 dilution term 是 benchmark choice 的一部分，並非程式遺漏，更不能把結果外推到所有 growing-tissue equations。

參數命名需要特別說明。Repository 沿用 Schnakenberg 慣例，把 $a=0.1$、$b=0.9$；但第一個 reaction component 的 production term 是 $b=0.9$，第二個則是 $a=0.1$：

$$
R_1=b-c_1c_2^2,
\qquad
R_2=a-c_2+c_1c_2^2.
$$

在方程中直接寫出 0.9 與 0.1，可以避免兩套 implementation 在比較時把 $a$、$b$ 對調。Homogeneous state 是 $(\bar c_1,\bar c_2)=(0.9,1.0)$。

初值完全 deterministic：

$$
c_1(x,0)=0.9\,[1-0.005\cos(\pi x)],
\qquad
c_2(x,0)=1.0\,[1+0.005\cos(\pi x)].
$$

它只擾動第一個 cosine mode，沒有 random seed，也沒有挑選一條有利 trajectory 的重試。研究問題不是自然界是否一定發生峰值分裂，而是這個固定初值、固定 growth law 與固定 detector 能否產生 admissible numerical event。

## Event definition 必須先於答案

對 activator $c_1$，先扣除空間平均，再投影到 Neumann cosine modes：

$$
a_k(t)=\frac{\int_0^1[c_1(x,t)-\bar c_1(t)]\cos(k\pi x)\,dx}
{\int_0^1\cos^2(k\pi x)\,dx},
\qquad k=1,2.
$$

Modal-transfer score 定義為

$$
S(t)=\frac{a_2(t)^2}{a_1(t)^2+a_2(t)^2+10^{-16}}.
$$

$S$ 接近零代表 mode one 佔兩個追蹤 modes 的主要能量，接近一則代表 mode two 佔優。分母的小常數只防止零除法；它不是調校結果的 smoothing parameter。

正式事件不是單一 crossing。Detector 必須按以下順序檢查：

1. $|a_1|\geq0.1$，避免把近乎平坦的 state 當成已建立圖樣；
2. $a_1^2/(a_1^2+a_2^2+10^{-16})\geq0.8$，確保 predecessor state 主要是 mode one；
3. 以上兩條件連續維持至少五十個時間單位；
4. establishment 完成後，$S$ 才可向上穿越 0.5；
5. crossing 必須唯一，而且其後 $S\geq0.5$ 再維持五十個時間單位；
6. crossing 需滿足 dimensionless transversality check $T|S'(t^*)|\geq0.1$。

Crossing time 若存在，才以相鄰輸出點線性插值。Uniqueness、persistence 與 transversality 亦只能在 establishment 通過後評估。這個順序防止程式把一個數學上不存在的 formal event 用附帶診斷補成數值。

## 為何不用 peak count

峰的數量很適合描述 pattern，卻不一定適合做可微、可重現的 time functional。離散曲線中的一個肩位何時算新峰，會受 smoothing、節點位置、endpoint treatment、prominence threshold 及取樣頻率影響。若 event time 要進入 adjoint 或 goal-oriented error analysis，這些離散選擇會造成不連續。

Smooth modal score 避開部分問題。它把整個空間 profile 壓成連續 coefficients，也能在不同網格之間用相同 functional 比較。但 smooth 不等於 admissible。若 source mode 從未按定義建立，或 crossing 來回多次、未能保持、斜率近乎零，單一 $S=0.5$ 仍不能代表穩健事件。

所以，這個 project 沒有聲稱 modal score 是唯一正確的 biological definition。它只要求 protocol 一旦凍結，就不能在結果不合意時改回較方便的 peak count。Event definition 可以在下一個有版本標記的研究重新設計，不能在同一 attempt 裏回溯修改。

## 為何 horizon 是 1200

預期的 raw transition 約在五百四十，formal event 又要求事後五十個時間單位 persistence。$T=1200$ 為事件前建立、crossing 後檢查及意外延遲留下足夠空間。這不是因為看見 transition 後才延長的 horizon。

更長時域也不能修補前置 establishment failure。最長 simultaneous run 發生在 raw transition 之前，而且只有十六。把終點由 1200 延長不會改寫已經發生的 history。反過來，若只計到五百四十，則可能因沒有完整 post-event window 而得到另一種不可判定。固定較長 horizon 把這兩種問題分開。

## 兩套數值 formulation，而不是同一路徑的複製

Uniform FEM 使用 continuous piecewise-linear basis。Mass matrix 與 stiffness matrix 分別依標準一維 element assembly 建立，Neumann boundary condition 由 weak form 自然進入。Diffusion 以 implicit step 處理，reaction 以 first-order explicit evaluation 處理。Initial condition 並非單純在 nodes 取樣，而是透過 consistent mass projection 投影到 finite-element space。

三個 nested levels 同時 refinement 空間與時間：128 elements 配 $dt=0.2$、256 配 $0.1$、512 配 $0.05$。這個 coupling 不是用來分離 space 與 time order；分離的 order verification 另有 manufactured tests。三層 nonlinear solve 的作用是檢查 event diagnostics 隨實際 production resolution 的穩定性。

Fine FD 使用 1024 個 cell centers 與 $dt=0.025$。它以 conservative flux differences、boundary zero flux 與相同階數的 IMEX treatment 獨立組裝。FD 不調用 FEM matrix assembler，不重用 FEM quadrature，亦不是把 FEM solution interpolate 到另一網格後冒充 reference。

兩套 formulation 只共享 model parameters、deterministic initial condition、horizon、output schema、event analyzer 與凍結設定。不同 spatial representation 對相同 modal history 的 agreement，比兩個只改 resolution 的相同 code path 更能排除共同 assembly mistake。不過，fine FD 仍然不是絕對真值。它是一個較細、已宣告的 independent cross-check；真正的 reference 還需要 admissible event 及 convergence gate，後者在此失敗。

## 很像答案的 raw crossing 並不算數

<figure class="article-figure">
  <img src="/science/can-a-mesh-preserve-the-event/p01_01_event_score.svg" alt="四個增長域求解器的模態轉移分數，以及原始門檻穿越附近的放大圖；所有正式事件時間均為空值。" loading="lazy" />
  <figcaption>圖一：三個 nested P1 FEM 與獨立 conservative FD 對 raw score transition 高度一致，但凍結的五十時間單位 establishment 條件失敗，所以 crossing 只屬診斷。</figcaption>
</figure>

全時域上，四條 growing-domain 曲線在顯示尺度幾乎重合。$S$ 先升到約 0.25，在 0.3 附近緩慢變化，約在時間五百三十突然下降，隨後快速穿過 0.5 並趨近一。放大 panel 顯示一個看似良好的 refinement sequence：

| 求解器 | Resolution | diagnostic raw crossing |
|---|---:|---:|
| FEM | 128 elements，$dt=0.2$ | 541.3928 |
| FEM | 256 elements，$dt=0.1$ | 540.2555 |
| FEM | 512 elements，$dt=0.05$ | 539.7169 |
| FD | 1024 cells，$dt=0.025$ | 539.4518 |

這組數字很容易誘惑人把 finest value 當作 event time，甚至對序列 extrapolate。可是，formal analyzer 根本未獲准開始搜尋 $t^*$，因為 prerequisite establishment interval 不存在。因此 machine-readable record 是 `crossing_count=0`、`established=false`、`persistent=false`、`transversal=false`、`unique=false`、`event_time=null`。Raw crossing 另存於標明 diagnostic-only 的欄位。

這不是行政式 bookkeeping。First-threshold adjoint 依賴 event functional 的 derivative 與一個可辨識 crossing。若 formal predicate 失敗後才以目測 crossing 替代，reported number 就與原本 quantity of interest 脫節，往後再精確的 estimator 也只是在估計另一個未申報的量。

## 失敗在可見 split 之前已經發生

<figure class="article-figure">
  <img src="/science/can-a-mesh-preserve-the-event/p01_02_establishment_audit.svg" alt="細網格有限元素與獨立有限差分的一階模態幅度和一階模態比例；兩條件同時成立只維持十六時間單位。" loading="lazy" />
  <figcaption>圖二：幅度條件長時間成立，但 modal purity 大部分時間低於 0.8；兩條件重疊最長只有十六，遠低於要求的五十。</figcaption>
</figure>

Panel (a) 解釋為何只看 amplitude 會誤判為通過。$|a_1|$ 很快超過 0.1，在數百個時間單位內維持約 1.5，然後隨 mode-two profile 出現而崩落。系統確實有很強的 mode-one component。

缺少的條件在 panel (b)。Mode-one fraction 從一很快降到約 0.75，之後在看似 mode-one plateau 的大部分時間低於 0.8。它在 transition 前短暫回到 threshold 以上，但與 amplitude condition 的 qualifying overlap 只維持十六。

兩條件共同存在，是為了避免把很弱或高度 mixed 的 state 當成 clean transfer 的 predecessor。這條 rule 是否為最佳科學定義，可以在未來版本討論；目前紀錄只能說這個 trajectory 不符合已凍結定義。看見結果後刪去 purity condition，等同改變研究問題。

Score 的劇烈上升也不能補救。$S$ 的分子與分母只描述 mode one 與 mode two 的相對 ownership，不記錄 state 之前是否按標準建立。即使分數由近零移到近一，source state 的歷史資格仍可失敗。

## FEM 與 FD 對 null 結果一致

<figure class="article-figure">
  <img src="/science/can-a-mesh-preserve-the-event/p01_03_null_concordance.svg" alt="三層有限元素、細網格有限差分與無增長控制的原始穿越時間和最長建立區間；所有 admissible event 均為空值。" loading="lazy" />
  <figcaption>圖三：refinement 令 diagnostic crossing 收斂，但所有 growing solves 的 establishment 都只有十六；no-growth control 為七，全部低於五十。</figcaption>
</figure>

左 panel 保留 raw crossing 的數值資訊，卻沒有錯叫它 formal event。時間由 541.39 隨 joint refinement 移向 539.45。右 panel 才是決定性 gate：每個 growing-domain method 的 longest duration 都是十六，與虛線五十有清楚距離；no-growth fine FEM 的 duration 是七，而且沒有 raw crossing。

這是對 negative result 的 concordance。兩套 solver 不是各自因不相關錯誤而失敗；它們解析出幾乎相同 modal history，並以同一個未修改 predicate 評估。Null 經 refinement 保留，也經 spatial discretization family 的改變保留。

因此，結果比「程式找不到事件」更具體：machine-readable diagnostics 清楚指出 simultaneous condition 未能持續。可是，它又比「frequency doubling 沒有發生」窄。Spatial profile 的確由一種主要結構轉向另一種，raw score 亦有 crossing。失敗的只是這個 initial condition、horizon 與 event definition 的 conjunction。

## Spatial profiles 說明了甚麼

<figure class="article-figure">
  <img src="/science/can-a-mesh-preserve-the-event/p01_04_activator_profiles.svg" alt="細網格有限元素與保守有限差分在時間五百、五百四十及六百的活化子空間剖面，呈現原始模態轉移前中後。" loading="lazy" />
  <figcaption>圖四：fine FEM 與 independent FD 在 raw transition 前、附近與之後解析出相同 profile；這支持 diagnostic narrative，不能把 null 改成 event。</figcaption>
</figure>

在 $t=500$，activator profile 沿 reference interval 大致下降；$t=540$ 時形成強烈 interior peak；到 $t=600$，高值區的形狀再次改變。Cosine coefficients 把這種空間結構轉換成可比較的 modal summary。FEM 與 FD curves 幾乎重合，說明 raw transition 不是單一 solver 或繪圖 interpolation 的 artifact。

這些 profiles 同時展示 peak count 的 discretion。Endpoint shoulder、寬而平的 maximum 或剛出現的 curvature change 是否算一個峰，會令 counting event 前後移動。Modal score 提供連續診斷，卻仍需要 establishment、uniqueness、persistence 與 transversality 才能成為 formal event。

圖中沒有任何 biological structure identification。橫軸是 reference coordinate，不是測得的 tissue length；縱軸是 synthetic model state，不是 concentration assay。兩種 numerical methods 一致，只是 implementation evidence，並非 equations 已描述某個 organism 的證據。

## No-growth control 使用完全相同 detector

<figure class="article-figure">
  <img src="/science/can-a-mesh-preserve-the-event/p01_05_negative_control.svg" alt="增長率零點零零一的增長計算與零增長控制的模態分數和一階模態幅度，兩者使用同一初值與偵測器。" loading="lazy" />
  <figcaption>圖五：只把 $\rho$ 由 0.001 改為零，raw score crossing 就消失；兩個 runs 均沒有 admissible event，但 null 的原因不同。</figcaption>
</figure>

Negative control 只把 $\rho$ 由 0.001 改成零。它保留 fine FEM grid、time step、initial condition、horizon、output schedule 與 event code。其 $S$ 維持約 0.24，mode-one amplitude 仍然建立，沒有 raw crossing，也沒有 formal event。

Growing run 的行為明顯不同：score 最終接近一，mode-one amplitude 崩落。這只支持 synthetic model 內的一條有限敘述，即 prescribed growth 在固定參數下改變 modal trajectory。它不能挽救 event，因為 establishment history 仍然失敗，也不能推論真實生物組織的 growth mechanism。

Negative control 的價值不是強迫 primary result 變 positive，而是檢查 detector specificity。相同 detector 不會因 stationary-domain numerical drift 製造 crossing。它也說明兩個 `event_time=null` 可以有不同原因：no-growth run 缺少 raw transfer；growing run 有 raw transfer，卻沒有合格 predecessor establishment。保存 failure reason 可避免把所有 null 混為一類。

## Numerical verification 通過，事件仍然失敗

<figure class="article-figure">
  <img src="/science/can-a-mesh-preserve-the-event/p01_06_verification_orders.svg" alt="有限元素時間誤差、有限元素空間誤差及保守有限差分空間誤差的收斂圖，觀察階數分別約為一、二和二。" loading="lazy" />
  <figcaption>圖六：manufactured 與 analytic checks 回復預期的一階時間及二階空間行為；它們驗證 assembly trend，不會改變 event predicate。</figcaption>
</figure>

Manufactured problem 是

$$
u_t=0.1u_{xx}-0.3u,
\qquad
u(x,0)=\cos(\pi x),
$$

並使用 homogeneous Neumann boundaries。FEM temporal errors 在 $dt=0.02,0.01,0.005$ 的 observed orders 是 0.990 與 0.995。FEM spatial errors 在 16、32、64 elements 的 orders 是 2.064 與 2.282。Conservative FD Neumann Laplacian 在 32、64、128 cells 的 orders 是 1.9997 與 1.9999。Constant vector 對 FEM stiffness matrix 與 FD flux Laplacian 都在 machine precision 內屬於 nullspace。

Nonlinear runs 全程有限，亦在凍結的 $-10^{-8}$ tolerance 內非負；global minima 約為 0.110。這些 checks 很重要，因為若 event 缺失源自 blow-up、negative concentration、破壞的 Neumann flux 或錯誤空間階數，整個 null 便不可解釋。

Checks 通過只回答窄問題：實作的 operators 與 time treatment 在指定 verification cases 表現一致。它們不證明 nonlinear trajectory exact，不證明所有 output functionals 都已收斂，更不能在 recorded modal history 只有十六 qualifying units 時創造五十-unit interval。

## 為何不能報 event-time error

Event-time error 需要兩個存在的 quantities：candidate method 的 $t_h^*$ 與 admissible reference 的 $t_{ref}^*$。本 project 在第一個 prerequisite 已經沒有任何 $t^*$。寫成

$$
|t_h^*-t_{ref}^*|
$$

並不會令兩個 null values 成為數字。把 raw crossing 代入只會計算另一個 diagnostic 的 refinement difference，並非 preregistered event-time error。

同樣地，不能把「所有方法都是 null」解讀成 zero error。Null equality 不是 numerical equality；它表示 functional 在每一條 trajectory 上都未定義。也不能在 bar chart 中把 null 畫成零，因為零代表事件在初始時間發生。Canonical JSON 保留真正的 `null`，figure 亦以文字與 gate outcome 表達。

Reference-feasibility tolerance 原定為 nested event times 相差不超過 $10^{-4}T$，FEM 與 independent FD 相差不超過 $2\times10^{-4}T$。這些 tolerance 沒有被 raw crossings 冒名通過。只有在 formal event 存在、unique、persistent 且 transversal 時才適用。這一點保護後續 comparison 不會以錯誤 endpoint 開始。

## 從軌跡到停止判定的完整邏輯

把整個判定拆開，可以看見「有轉變」與「有合格事件」之間究竟差在哪裏。第一層只問數值解是否可用。所有濃度有限，沒有超出容許的負值；空間算子對常數給出零，製造解的時間與空間收斂階數亦符合預期。若這一層失敗，軌跡本身便不能進入事件分析。本次第一層通過。

第二層問兩套不同離散是否看到相同現象。三層有限元素隨網格及時間步長細化，原始穿越時間向約五百三十九點五移動；獨立有限差分的數字與最細有限元素相近。三個剖面時刻的曲線亦幾乎重合。這使「可見轉變只源自某一套組裝」變得不太可能，但仍未證明正式事件存在。

第三層才檢查前置狀態。幅度門檻要求第一模態不是接近零的數值噪聲，純度門檻要求其在追蹤的兩個模態中真正佔優。這兩條件必須同時連續五十個時間單位，而不是各自在不同時段成立。實際最長重疊只有十六，所以第三層失敗。

第四層原本要在前置狀態合格後搜尋向上穿越，再檢查唯一性、事後維持及非切向性。由於第三層未通過，第四層沒有合法起點。紀錄中的 `false` 並非表示程式在一個已承認事件上量得不良斜率，而是表示這些後續資格沒有被授予。這也是為何不能只挑出視覺上最陡的一次穿越。

第五層才是建立參考值。若正式事件存在，三層有限元素的事件時間要在指定容差內穩定，最細有限元素亦要與獨立有限差分一致。這些比較需要數值型事件時間，不能把空值相減。故第五層未執行，而不是以「大家都是空值」當作通過。

第六層才輪到自適應策略。它會需要可微的事件量、參考事件時間、誤差定義、配對成本與估計器。前五層任何一層失敗，都足以阻止第六層。本次停止點精確位於第三層，並保留第一、二層的正面數值證據。這種分層紀錄比單一成功或失敗標籤更有資訊，也避免讀者誤以為程式崩潰或自適應方法已輸掉比較。

這條邏輯也說明為何停止不是保守過度。假如略過前置狀態，只用最細原始穿越作參考，後續估計器可能對該數字得到很小誤差；但它回答的是「分數何時越過二分之一」，不是「已建立的一階圖樣何時轉交給二階圖樣」。兩個問題在某些軌跡可以重合，在本軌跡並不重合。把它們混在一起，精密計算只會掩飾定義錯置。

## 如何理解看似良好的原始收斂

四個原始穿越時間按細化方向單調靠近，這是有價值的診斷。它表明可見的分數轉折不是任意跳動，也提示時空離散誤差正在減少。不過，單調序列不自動給出誤差階數，因為三個有限元素層級同時減半網格及時間步，時間一階與空間二階貢獻混合；有限差分又使用另一種空間表示。製造解測試才負責分離各自階數。

即使能對原始穿越做外推，外推極限仍只是另一個量的極限。數值分析中常見的危險，是把一個計得非常穩定的代理量誤認成真正研究端點。穩定性回答「這個量能否重複算到」，合適性回答「這個量是否對應宣告問題」。兩者必須分開。

此外，最細有限差分不是無限解析度。它雖以獨立保守通量組裝，仍有時間截斷、空間截斷與同一反應項離散。它的主要角色是降低共同錯誤的可能性，而不是為所有未量化誤差提供證書。若正式事件存在，仍需按凍結容差評估；若要作更強參考，則需獨立的空間與時間細化、誤差界或解析基準。

無增長控制亦應按同樣界線解讀。它顯示移除指定增長後，原始穿越消失，支持 detector 沒有在每條長軌跡上必然產生事件。它不是對增長因果機制的普遍證明，因為只比較一組參數與一個初值，也沒有處理稀釋、非均勻增長或實驗觀測。良好控制令本次結論更可信，卻不擴大結論涵蓋的世界。

## 若重新設計事件，甚麼必須預先決定

目前結果合理地提出一個新問題：五十時間單位及百分之八十純度是否太嚴格？這可以研究，但答案不能由本次軌跡倒推。新的版本至少要在計算前寫明科學上要辨認的前置狀態、幅度正規化方式、純度涉及哪些模態、容許短暫跌出條件多久、穿越方向、重複穿越的處理、事後維持區間及切向門檻。

若改用峰數，還要凍結平滑方法、峰顯著度、端點規則、最小峰距與輸出頻率；若改用形態距離，則要先指定模板、距離、正規化與閾值；若改用能量比，則要決定截取多少模態及高頻能量如何處理。每一種定義都會產生不同量，沒有一種可以在同一結果上事後挑到最漂亮的一個。

新版本還應使用開發、驗證與最終評估的分離。現有軌跡已揭露哪個條件失敗，可以用來發展候選定義，卻不能再作無偏最終驗證。應在其他預先指定參數或初值上檢查候選規則，再把選定規則凍結，最後於未打開的軌跡評估是否存在、唯一、穩定及可跨方法重現。

這樣做不是要求事件定義永遠不變，而是要求變更有版本、有理由、有新資料邊界。研究方法可以從 null 中學習；不能做的是抹去原先 null，讓讀者以為新定義一直存在。

## 原定 adaptive comparison 為何沒有運行

完整設計原本包括三個策略。Uniform refinement 提供 baseline；residual marking 根據 state-equation residual 與 flux jump 選 element；goal marking 則以 event-time adjoint 權重集中 event functional 最敏感的 regions。比較會固定 accuracy target 或 matched computational budget，報 event-time error、degrees of freedom、steps、work proxy、effectivity 與 wall-clock distribution。

Phase-1A 只獲准建立 reference feasibility。它沒有 residual estimator implementation、沒有 dual solve、沒有 Dörfler marking、沒有 mesh transfer study，也沒有 matched-budget timing。這些缺項不是「未寫進文章」而已；contract 與 claim ledger 明確把它們鎖住。

因此，不能從 uniform FEM 與 fine FD 的一致推論 adaptive method superiority，也不能說 event-goal mesh 會較高效。甚至「網格能否保留事件」這個標題在目前只是研究問題。現有答案是：對 frozen benchmark 而言，沒有 admissible event 可供任何 mesh 保存。

一個合理下一階段可能先版本化 event definition，例如重新考慮 predecessor purity 或改用具物理意義的 functional，再以新的 protocol 重做 feasibility。那會是新 experiment，不是把本次 STOP 改判。另一個方向是在保持 event definition 下改變 model parameter 或 initial perturbation，但亦必須在運行前宣告 grid、horizon、gates 與 multiplicity rule。

## Reproducibility 不把 runtime 當成數值資料

兩個 canonical attempts 使用完全相同 production configuration，沒有在第一次 null 後修改 threshold 或 window。其 numerical JSON byte-equivalent，canonical signature 都是

`acc4a406360bca26f89d032d5251c06e20b12f2153c557358ed3fa6175447344`。

Frozen configuration hash 是

`49dbc1cae23113a5562bc8fd5c24cb51cec86a55e0cfddd23193748a71a86691`。

Signature 包含 model、discretization、modal histories、event fields、control、verification 與 terminal verdict；不包含 wall-clock runtime、timestamp 或 machine-specific path。這個分離很重要。相同數值計算在不同電腦可能耗時不同，但不能因 elapsed time 改變而被誤判成不重現；反過來，相同 runtime 也不能證明數值內容相同。

Preflight 曾發現一個 test fixture 的 shape 與 detector input contract 不一致。修正只改 synthetic fixture，production configuration、hash、threshold、window 與 event code 沒有更動。Before/after evidence 保留在 attempt history。這類修正可以接受，因為它不在看過 scientific result 後調校 endpoint。

正式 test suite 有十七個 substantive tests，涵蓋 config freeze、FEM/FD matrix properties、consistent-mass projection、manufactured orders、event interpolation、uniqueness、persistence、transversality、negative control、canonical schema 與 signature stability。Tests 通過與 scientific gate 失敗同時成立，正是這次 audit 的重點。

## 圖像 QA 也是 evidence chain

六幅 canonical figures 都由 machine-readable result 重新生成，並輸出 SVG、PDF 與 600-dpi PNG；blog 使用的 publish SVG 與 technical repository 的 accepted files 位元一致。所有文字為黑色，顏色以線型、marker、hatch 或直接文字作 redundant encoding，不能只靠紅綠區分結果。SVG 內含 title 與 description，manifest 記錄 source result、script、revision 與 hash。

Visual QA 不只是檢查檔案可開啟。每個 PNG 及其 PDF raster counterpart 都在原尺寸查看四邊、panel headings、legends、ticks、annotations、curves 與 markers。過程保留 rejected-to-revised history：早期 revision 曾有 annotation 穿過曲線、order labels 太接近 segment，以及 negative-control PDF 的左上 panel heading 被裁掉。Final-006 把 heading 移入安全邊界，六組最終 PNG/PDF pairs 全部通過 overlap 與 clipping review。

保留 rejected revision 很重要。如果只留下最後圖，讀者無法判斷 QA 是真正執行，還是事後一句聲明。Rejection record 表明哪些位置失敗、如何修正，以及 scientific data 沒有被改動。圖形 layout correction 不應偷偷改 result array，亦不應用 opaque textbox 蓋住曲線。

## 這個 null 對 event design 的啟示

第一，event 是一個帶歷史的 predicate，不一定是當下 scalar threshold。Establishment 與 persistence 把「從哪個 state 轉到哪個 state」寫進定義。只保存 crossing point 而遺失其前後 history，會令不同物理敘事共享同一數字。

第二，relative score 可以在 absolute amplitudes 很小時劇烈變化。這就是 amplitude gate 存在的原因。相反，absolute amplitude 強也不保證 modal purity，正如本 case 所示。兩種條件捕捉不同 failure modes，不能在事後任意刪去其一。

第三，convergence of a surrogate 不等於 existence of the target. Raw crossing sequence 看來規整，甚至可以估計 order；但 target event 未定義。Numerical analyst 必須先問 functional 是否 well posed，再問 discretization error 多大。

第四，independent formulations 最有價值的時候，不一定是確認 positive result。FEM/FD concordance 令我們較有把握 null 不是某個 spatial assembly artifact。Negative evidence 若有 precise failure reason、refinement 與 control，也可以是扎實結果。

第五，stop rule 需要在運行前具體。若規則只寫「結果不夠好便再調」，就不能區分 protocol refinement 與 outcome tuning。本專案的 STOP 是因 formal event null，而不是因 adaptive method 表現差。後者根本未被測試。

## 哪些 claims 仍然被封鎖

以下敘述沒有 evidence，因此文章不會暗示它們成立：

- goal-oriented adaptive mesh 比 uniform 或 residual mesh 更準確；
- residual estimator 對此 nonlinear growing-domain problem reliable 或 efficient；
- adjoint effectivity 接近一；
- adaptive strategy 以較少 degrees of freedom 保存 peak splitting；
- FEM 一般優於 FD，或 FD 是 exact reference；
- synthetic modal transfer 對應真實 tissue patterning event；
- 這個 benchmark 是首個 growing-domain adaptivity 或 threshold-time method；
- raw crossing 539.45 是正式 $t^*$。

可以支持的 claims 只有：solver operators 通過所列 tests；FEM 與 independent FD 對 diagnostic transition 一致；no-growth control 沒有 raw crossing；所有 growing solves 的 establishment 最長十六；formal event 全部 null；兩次 canonical numerical records 相同；因此 Phase-1A 按 frozen rule 停止。

## 精確的重現邊界

Technical repository 保存 frozen configuration、environment file、solver source、test suite、attempt directories、top-level summary JSON、figure generator、publish assets、visual QA ledger、claim ledger、decision log、literature gate 與 references。最小重現次序是：先驗證 configuration hash；運行 tests；執行一個 canonical attempt；以相同設定再執行 reproduction attempt；比較 numerical signature；由 canonical JSON 生成 figures；最後執行 artifact 與 visual-QA checks。

重現的核心不是要求另一台機器有相同 runtime，而是要求所有 scientific fields、null values、gate decisions 與 signature 相同。Dependency versions 與實際 Python executable 被記錄，避免默認 environment 悄悄漂移。任何改動 threshold、establishment window、initial condition、horizon 或 grid 的 run 都應產生新 config hash，不能覆寫現有 attempts。

Blog 本身不取代 repository。文章把決策鏈翻譯成可閱讀敘事；machine-readable JSON 才是 numbers 的權威來源，claim ledger 界定何者可公開，visual manifest 則把每幅圖連回 generator 與 data。若 prose 與 JSON 不一致，應以 frozen result 與 tests 為準並修正文稿。

## 一個精確而有限的結論

這個 benchmark 解析出清楚、隨 refinement 穩定並經 independent FD 核對的 raw modal transition。它也通過 selected operator verification，並在 no-growth control 中避免虛假 crossing。可是，凍結的 predecessor establishment 只維持十六，而要求是五十。所有 formal event times 因而是 null。

所以，問題「哪一種 mesh 最能保存事件」在本 Phase 沒有可比較答案。不是 uniform FEM 勝出，不是 adaptive FEM 失敗，也不是 growth pattern 不存在。準確說法是：這個 event definition 在這個 frozen trajectory 上未建立 reference feasibility，任何 event-time error、effectivity 或 efficiency comparison 都不具 admissibility。

STOP 保存了研究的意義。若把 539.45 改叫 $t^*$，文章會得到較順眼的 positive plot，卻失去原本 quantity of interest。保留 null 則留下可審計的教訓：在最佳化網格之前，先證明要保存的事件真的存在。

## 文獻 gate 使用的 primary works

- Crampin, Gaffney & Maini (1999), growing-domain reaction–diffusion 與 frequency doubling. [DOI](https://doi.org/10.1006/bulm.1999.0131)
- Crampin, Gaffney & Maini (2002), mode doubling/tripling 的 piecewise-linear analysis. [DOI](https://doi.org/10.1007/s002850100112)
- Crampin, Hackborn & Maini (2002), nonuniform domain growth. [DOI](https://doi.org/10.1006/bulm.2002.0295)
- Madzvamuse, Wathen & Maini (2003), moving-grid FEM pattern generator. [DOI](https://doi.org/10.1016/S0021-9991(03)00294-8)
- Madzvamuse (2005), moving-grid Turing simulation. [DOI](https://doi.org/10.1007/s10915-004-4617-7)
- Madzvamuse (2006), fixed/growing-domain time stepping. [DOI](https://doi.org/10.1016/j.jcp.2005.09.012)
- Madzvamuse, Maini & Wathen (2007), grid velocity 對 selected pattern 的影響. [DOI](https://doi.org/10.1016/j.jcp.2006.11.022)
- MacKenzie & Madzvamuse (2010), 一維 growing-domain finite-difference convergence. [DOI](https://doi.org/10.1093/imanum/drp030)
- Lakkis, Madzvamuse & Venkataraman (2013), evolving-domain IMEX FEM error analysis. [DOI](https://doi.org/10.1137/120880112)
- Venkataraman, Lakkis & Madzvamuse (2013), growing-domain adaptive FEM. [DOI](https://doi.org/10.1007/978-3-642-33134-3_8)
- Xie & Hu (2016), adaptively moving finite elements for reaction–diffusion. [DOI](https://doi.org/10.4208/nmtma.2016.m1229)
- MacKenzie, Rowlatt & Insall (2021), conservative ALE FEM on evolving domains. [DOI](https://doi.org/10.1137/19M1298585)
- Li & Yi (2023), nonlinear reaction–diffusion goal-oriented estimators. [DOI](https://doi.org/10.1016/j.cam.2022.114362)
- Chaudhry et al. (2021), first time to threshold error estimation. [DOI](https://doi.org/10.1007/s10543-020-00825-0)
- Chaudhry, Estep & Tavener (2023), semilinear parabolic threshold-time functional. [DOI](https://doi.org/10.1007/s10543-023-00947-1)
- Cliffe, Collis & Houston (2015), goal-oriented travel-time functional. [DOI](https://doi.org/10.1137/140960499)
