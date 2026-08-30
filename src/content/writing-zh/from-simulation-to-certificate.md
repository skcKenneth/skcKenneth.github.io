---
title: "由模擬走向證書"
slug: from-simulation-to-certificate
sourceSlug: from-simulation-to-certificate
summary: 一項凍結的合成雙艙正系統 audit，把有限 parameter sampling、共同 Lyapunov inequality、diagonal restriction 與可容許的 robust-decay claim 逐層分開。
date: 2026-08-30
lastUpdated: 2026-08-30
featured: false
topics: [正系統, 魯棒控制, Lyapunov 證書, 數值驗證, 可重現研究]
heroImage: /science/from-simulation-to-certificate/p09_02_certificate_decay_stress.svg
type: 研究筆記
archived: false
scienceProject: from-simulation-to-certificate
redirectFrom: []
---

在一條 uncertainty segment 上抽二十五個 points，逐一計算 eigenvalues，而且全部 stable，這是一項有用的 diagnostic；它仍然不是一張涵蓋整條 segment 的 certificate。即使把二十五增至二萬零一，邏輯也沒有改變：我們知道被檢查的位置發生甚麼，卻沒有單憑 sampling 排除兩點之間存在較差位置。相反，如果同一個 positive-definite matrix $P$ 在所有 vertices 都滿足一個 affine Lyapunov inequality，那個 inequality 便可直接延伸至它們的 convex mixtures。兩種證據都可以很精確，但它們回答的問題不同。

P09 把這個差別縮成一個可以逐項檢查的 Phase-1 benchmark。模型只有兩個 compartments，transfer 與 removal rates 全部是合成數值；uncertainty 只有兩個 endpoints 及其 line segment；stress 只有五級；certificate construction 只搜尋 trace-normalized 的二乘二 matrices。Seeds、grids、thresholds 與結論範圍都在 evaluation 前固定。六項預先申明的比較全部通過，因此狀態是 **PASS**；這個標記只屬於該固定 family。它不是新的 positive-systems theorem，不是 globally optimal SDP result，不是 large-network scaling result，更不是任何 physical 或 safety validation。

最容易被誤讀的數字是 full stress 下的 diagonal relative gap：$0.611148080688841$。它的正確句子是：「在這個凍結的雙艙 family、這個 construction、這個 reference diagnostic 與這個 stress endpoint 下，diagonal certificate 的 relative gap 是 $0.611148080688841$。」它不能改寫成「diagonal LMIs 一般都有六成 conservatism」，也不能證明 full matrices 永遠優勝。後者需要跨 families、dimensions、uncertainty geometries、solvers 和 cost budgets 的獨立 protocol；P09 沒有做那些實驗。

## 這張證書真正建立了甚麼

下表把有限抽樣與涵蓋整段 uncertainty 的 inequality 分開。每一行只說明該項計算真正到達的範圍。

| 問題 | 計算結果 | 它建立了甚麼 |
|---|---:|---|
| Model 是否保持 positive-network structure？ | 全部 endpoints 為 Metzler；minimum column leakage $0.1264590482842527$ | 證明 fixed synthetic family 具有所需結構。 |
| Reported bounds 是否真的 feasible？ | 全部 20 個 diagonal/full constructions 的 endpoint residual checks 通過 | 每個 reported $alpha$ 對相應 line segment 是 verified lower bound；不等於 global optimum。 |
| Collapsed family 是否通過 manufactured check？ | $s=0$ 時 diagonal/full relative difference $3.596327159290119\times10^{-11}$ | Implementation 在一個預期會相合的 limit 一致；不是一般 convergence theorem。 |
| Full construction 是否貼近 dense diagnostic？ | 五級 stress 的 maximum relative gap $5.686578772919613\times10^{-7}$ | 只對 fixed family 和 grid 成立；dense diagnostic 本身仍非 proof。 |
| Diagonal restriction 是否呈現對比？ | $s=1$ 時 certificate $0.10407958854612244$，relative gap $0.611148080688841$ | 一個 benchmark-specific conservatism witness；不是 universal law。 |
| Construction grid 是否足夠穩定？ | 241 對 121 grid 的 maximum absolute difference $6.763624081962405\times10^{-5}$ | 通過一次 finite resolution check；沒有證明搜尋到 global SDP optimum。 |

<figure>
  <img src="/science/from-simulation-to-certificate/p09_01_positive_network_protocol.svg" alt="雙艙漏損正系統連接三張證據卡，分開有限 spectral checks、diagonal quadratic construction 與 full quadratic endpoint certificate。" />
  <figcaption>同一個 synthetic family 可以產生兩類證據：finite checks 只描述已評估的 theta；verified endpoint inequalities 才把結論延伸至整條 convex segment。</figcaption>
</figure>

## 先行研究怎樣改變了問題

Positive systems 的 Lyapunov theory 並不是空白領域。Barker、Berman 與 Plemmons 在 1978 年已研究 Lyapunov equations 的 positive diagonal solutions。Mason 與 Shorten、Gurvits 與合作者，以及 Knorn、Mason 與 Shorten，後來分別處理 switched positive linear systems、linear copositive functions 和一組 positive systems 的 common certificates。Fornasini 與 Valcher把 continuous-time positive switched systems 的 copositive framework 說得更完整。這些工作已經排除「發現 positive system 可以用 common Lyapunov function」這種 headline。

Performance 與 uncertainty 方向同樣已有直接先行研究。Tanaka 與 Langbort 給出 internally positive systems 的 bounded-real 結果；Ebihara、Peaucelle 與 Arzelier研究 $L_1$ gain；Briat 討論 uncertain linear positive systems 的 robust stability、stabilization 與 gain characterizations；Rantzer 強調 scalable control；Colombino 與 Smith 提供 positive 與 positively dominated systems 的 robust-stability convex characterization。Gumus 與 Xu 則直接研究 common diagonal Lyapunov solutions。這個文獻集合不只「背景相似」，而是和 P09 原擬 method claim 高度重疊。

這些文獻直接排除了 method-novelty headline。問題因而改成 certificate-quality benchmark：在一個刻意簡小、可以完整跟隨的 family 中，restricted diagonal construction 與 full construction 的 decay lower bounds 怎樣隨 endpoint imbalance 改變？有限 sampling 和 certificate 又應如何分開解讀？

Positive leakage 使 fixed system 的 stability structurally plausible，所以「成功找到 stable matrices」沒有足夠信息量。真正要驗證的是 reported certificate 是否 feasible、diagonal restriction 是否仍保留 positive decay、full construction 是否有用、結果是否對 declared grid refinement 穩定，以及 finite diagnostics 有沒有被錯標成 guarantee。

## 由 transfer rates 推導 Metzler matrix

令 $x_1(t)$ 與 $x_2(t)$ 是兩個非負 compartments 的 state。$k_{12}$ 表示由第一個 compartment 流向第二個的 transfer rate，$k_{21}$ 表示反向 transfer；$r_1$ 與 $r_2$ 是各自的 removal rates。線性方程是

$$
x_1' = -(r_1+k_{12})x_1 + k_{21}x_2,
$$

$$
x_2' = k_{12}x_1 -(r_2+k_{21})x_2.
$$

因此 $x'=Ax$，其中

$$
A = \begin{bmatrix}
-(r_1+k_{12}) & k_{21} \\
k_{12} & -(r_2+k_{21})
\end{bmatrix}.
$$

只要四個 rates 為正，off-diagonal entries 便非負，所以 $A$ 是 Metzler matrix。這個 sign structure 意味着由 nonnegative initial state 出發，continuous-time flow 保持在 nonnegative orthant。把兩條 state equations 相加，internal transfers 正好消去：

$$
(x_1+x_2)'=-r_1x_1-r_2x_2.
$$

所以 total state 只由 removal terms 減少。Matrix 的 column sums 正好是 $(-r_1,-r_2)$；因此以 negative column sums 作 leakage check。這裏的「compartment」與「removal」只是 mathematical structure。沒有指定 chemical species、drug dose、population class、biological tissue 或 industrial tank，也沒有 units 或 measurement。把 state 稱為 mass 並不會自動產生物理 calibration。

兩個 endpoints 來自 preliminary candidate search。第一個 endpoint 的 $k_{12}=0.5643881500896605$、$k_{21}=2.6493424810092114$、$r_1=0.2831741517239682$、$r_2=0.20289426431561064$；第二個 endpoint 的相應數值是 $2.2068349884577403$、$0.022834967500031368$、$0.12645904828425247$ 與 $0.9070075625573553$。兩者有相反的 transfer imbalance，但全部 rates 保持正值。因為 selection stage 已看過 candidate behavior，這個 family 應被視為刻意選取的教學例子，而不是 held-out validation case。

## Stress 與 theta 是兩個不同座標

先把 original endpoints 記為 $A_1$ 與 $A_2$，midpoint 是 $A_m=(A_1+A_2)/2$。Stress $s$ 定義新的 endpoints：

$$
A_1(s)=A_m+s(A_1-A_m),
$$

$$
A_2(s)=A_m+s(A_2-A_m).
$$

當 $s=0$，兩個 endpoints 都等於 midpoint，uncertainty segment collapse 成單一 matrix；當 $s=1$，回到 original pair。P09 只使用 $s=0,0.25,0.5,0.75,1$ 五個 levels。這個 stress 不是 real-world hazard level，也不是 statistical confidence。它是一個可控幾何參數，用來逐步拉開 endpoints。

對每個固定 $s$，第二個參數 $\theta$ 才沿該 segment 混合：

$$
A(\theta,s)=(1-\theta)A_1(s)+\theta A_2(s),\qquad 0\le \theta\le1.
$$

兩個參數不能混用。Stress 改變 uncertainty set 的寬度；$\theta$ 選擇 set 內一個 matrix。Figure 2 的橫軸是 stress，每一個點代表完整 $\theta$ segment 的 summary。Figure 3 的橫軸則是 full stress 下的 $\theta$，展示 set 內 spectral decay 如何改變。若把 stress 當作 $\theta$，便會錯誤解讀 certificate 的 coverage。

Convex mixing 也保存 Metzler off-diagonals 與 positive leakage，因為每個 entry 和 column leakage 都是 endpoints 的 convex combinations。G1 仍然逐個 stress 計算，不用這句推理代替 code check。Observed minimum leakage 是 $0.1264590482842527$，高於 frozen threshold $0.1$。這是 structure gate，不是 decay-rate gate；一個 system 可以有正 leakage，同時仍需要清楚說明所用 norm、Lyapunov function 與 decay bound。

## Finite spectral checks 能說甚麼

對每個 matrix，spectral abscissa 是 eigenvalues real parts 的最大值。P09 把 decay diagnostic 寫成 spectral abscissa 的負值；數值為正表示該 particular matrix 的 linear asymptotic decay rate 為正。Dense diagnostic 在每個 stress 使用 20,001 個均勻 $\theta$ values，grid spacing 是 $0.00005$。較小的 diagnostic 則使用 25 個預先固定的 $\theta$，並先排序再報 minimum sampled decay。

Dense 與 seeded checks 都很有用。它們可以定位 sampled worst region、顯示 spectral curve 是否平滑、捕捉 endpoints 和 interior 的差別，也可以揭露 sparse sample 有多 optimistic。例如 full stress 的 dense minimum 是 $0.26765867256228715$，位於 theta 約 $0.04935$；25-point seeded minimum 是 $0.267681432313707$。兩者很接近，但 seeded value 較高，正符合有限 sample 可能錯過最差位置的方向。

然而「很接近」不等於「已證明相同」。Dense grid 仍有 20,000 個 intervals；除非另有 analytic monotonicity、interval enclosure 或 global optimization certificate，grid points 之間仍未由 sampling 本身覆蓋。因此 dense curve 與 seeded points 都只作 finite diagnostics；圖表與正文不能把它們升格為 certificate。

Vertex-only eigenvalue checks 更不能取代 common certificate。Full-stress endpoints 的 minimum decay 約 $0.2687804869601953$，而 dense interior minimum略低。差別在今次 family 不大，但已足以示範最差 theta 不必位於 vertex。更一般而言，每個 frozen matrix individually stable 不會自動推出 arbitrary switching stability，也不會自動給出一個 common quadratic decay rate。P09 沒有把所有這些問題合併；它只處理 affine segment 上一個 common quadratic inequality。

## 由 Lyapunov function 到 decay certificate

選一個 symmetric positive-definite matrix $P$，定義

$$
V(x)=x^\top P x.
$$

沿 $x'=Ax$ 的 trajectory，

$$
V'(x)=x^\top(A^\top P+PA)x.
$$

如果存在 $\alpha>0$ 使

$$
A^\top P+PA+2\alpha P\preceq0,
$$

那麼 $V'\le-2\alpha V$，因此

$$
V(t)\le V(0)e^{-2\alpha t}.
$$

這個 statement 是在 $P$ 所定義的 quadratic measure 中的 decay bound。它不是每一個 component 都以同一 scalar envelope 單調下降；transfer 可以令某個 compartment 暫時增加。也不能把 $alpha$ 未經 norm equivalence 直接稱為 total-mass half-life。P09 只報 certified quadratic decay lower bound，沒有作 safety 或 physical-time interpretation。

為甚麼檢查 endpoints 足以涵蓋 segment？對固定 $P$ 與 $\alpha$，residual

$$
R(A)=A^\top P+PA+2\alpha P
$$

對 $A$ 是 affine。若 $A(\theta)=(1-\theta)A_1+\theta A_2$，則

$$
R(A(\theta))=(1-\theta)R(A_1)+\theta R(A_2).
$$

Negative-semidefinite matrices 的 convex combination 仍是 negative semidefinite，所以兩個 endpoint residuals 通過便涵蓋全部 $0\le\theta\le1$。這是 established standard argument，不是 P09 新 theorem。Local contribution 只是把 construction、safety margin、direct residual eigenvalues 與 finite diagnostics 串成一個可核查的比較。

每個 reported certificate 都把 raw feasible decay 減去 $10^{-10}$ 作 safety margin，再重新計算 $P$ eigenvalues 與兩個 symmetric residual 的 maximum eigenvalue。Full stress 的 diagonal certificate maximum residual eigenvalue 是 $-8.634148951358611\times10^{-11}$；full certificate 是 $-1.2635535673322096\times10^{-10}$。負值代表 checked inequalities 在 floating-point recheck 下仍位於所需方向。這些 margins 不大，所以直接 recheck 很重要；只相信 search grid 的 objective value 會遺漏 rounding 把 boundary point 推到 infeasible side 的可能。

## Diagonal 與 full quadratic constructions 比較的是 restriction

所有 matrices 都用 $trace(P)=1$ normalization。若沒有 normalization，把 $P$ 乘任意 positive scalar 都代表同一 quadratic geometry，search 便有無意義的 scale freedom。Diagonal construction 令

$$
P=\begin{bmatrix}p&0\\0&1-p\end{bmatrix},
$$

只搜尋 $p$。Full construction 使用

$$
P=\begin{bmatrix}p&q\\q&1-p\end{bmatrix},
$$

並以 $q=t\sqrt{p(1-p)}$ parameterize off-diagonal entry，令 positive-definiteness domain 容易控制。Coarse 與 refined grids 每軸各 241 points；sensitivity rerun 把兩者改成 121 points。Full search 的 grid 包含 $t=0$，因此包含 diagonal candidates，但 finite discretization 仍可能令兩個 numerical maxima 受到 grid alignment 影響。

最重要的措辭是「constructed feasible certificate」，不是「optimal LMI bound」。計算沒有使用 external conic solver，也沒有 dual certificate、primal-dual gap 或 global branch-and-bound proof。二乘二 grid search 的優點是 dependency-light、每個 candidate 可直接計算 generalized eigenvalue、結果容易核查；缺點是不能把最好 grid point 等同 continuous SDP optimum。即使 full bound 和 dense diagnostic 相差只有約五十萬分之一，這項 proximity 也只是 observed quality metric。

Generalized decay 的計算先形成 $-(A^\top P+PA)/2$，再用 Cholesky factor of $P$ 轉成 symmetric standard eigenvalue problem。兩個 endpoints 的 minimum generalized eigenvalue 給 common raw decay。Hand-calculable 的 $A=-cI$ case 提供獨立核對：任意 positive $P$ 都應回傳 $c$，所以 transformation 次序或 transpose 若有錯，便會立即顯現。

## 比較方式在 evaluation 前固定

Development search 用 seed 90900 掃 240 個 candidate families，最後選 candidate 104。選擇準則包括 positive transfer/removal、Metzler structure、column leakage，以及在開發 diagnostic 中可見的 diagonal/full contrast。這一步確實看過 candidate behavior，所以不能當作 untouched final evidence。Candidate 選定後，exact rates、final seeds、five stress levels 與 six criteria 才固定下來作 evaluation。

G1 要求全部 endpoints 維持 Metzler 且 minimum leakage 至少 $0.1$。G2 要求所有 diagonal 與 full certificate residual verifications 通過。這兩項若失敗，certificate comparison 便要停止，因為 model structure 或 certificate feasibility 本身失效。G3 是 collapsed-midpoint manufactured check，relative difference 上限 $10^{-5}$。G4 要求 full-to-dense maximum relative gap 不超過 $0.005$。G5 預先要求 full stress diagonal gap 至少 $0.4$，同時 diagonal certified decay 不低於 $0.05$；前半確保 contrast 可見，後半避免以「diagonal 完全失敗」冒充有用比較。G6 要求 241 對 121 grid 的 maximum absolute difference 不超過 $0.001$。

若 G3 至 G6 任一失敗而 G1/G2 保持通過，結論便只能局限於已通過的部分，不會事後降低 threshold。若 G5 gap 未達 $0.4$，正確結論應是這個 family 沒有提供預定 contrast；若 diagonal decay 跌至零以下，則不能再說 restriction「仍保留 useful positive bound」。Failure-preserving 設計令研究可以完整完成而 hypothesis 不成功，而不是只有 favourable output 才有 publishable record。

<figure>
  <img src="/science/from-simulation-to-certificate/p09_02_certificate_decay_stress.svg" alt="五級端點不平衡 stress 上的 decay rate 曲線，比較 dense 與 seeded finite diagnostics，以及 verified diagonal 與 full quadratic certificates。" />
  <figcaption>在這個 frozen two-compartment family，full construction 一直貼近 dense diagnostic；diagonal certificate 隨 stress 增加而下降。圖中 0.611 gap 只屬於 $s=1$ 的本地結果。</figcaption>
</figure>

## 五級 stress 的完整結果

完整數值表如下；正文保留足夠 digits 方便 cross-check，各 threshold 則以未截短的計算值判定。

| $s$ | Dense finite diagnostic | Seeded 25-point diagnostic | Diagonal certificate | Full certificate |
|---:|---:|---:|---:|---:|
| 0.00 | 0.371832224166786 | 0.371832224166786 | 0.371832224053412 | 0.371832224066784 |
| 0.25 | 0.320095696585905 | 0.328338270167576 | 0.320095696014307 | 0.320095696485893 |
| 0.50 | 0.286991854972174 | 0.291208435853174 | 0.273443669159099 | 0.286991854872167 |
| 0.75 | 0.270344300372003 | 0.274603078965093 | 0.200729805259843 | 0.270344300272000 |
| 1.00 | 0.267658672562287 | 0.267681432313707 | 0.104079588546122 | 0.267658520356075 |

在 $s=0$，segment collapse，兩種 constructions 幾乎完全相合，G3 relative difference 是 $3.596327159290119\times10^{-11}$。這個 case 提供一個 consistency anchor：若 diagonal 和 full parameterizations 在同一 midpoint matrix 產生大差別，便要先檢查 search domain、transformation 或 refinement，而不能直接把差別解釋成 geometry。

到 $s=0.25$，full 與 diagonal 仍幾乎貼住 dense diagnostic；sparse seeded value $0.328338270167576$ 則高於 dense minimum $0.320095696585905$。在 $s=0.5$，diagonal bound 降至 $0.273443669159099$，而 full bound仍是 $0.286991854872167$。到 $s=0.75$，diagonal 已降至 $0.200729805259843$。這條 gradual path 比只展示 endpoints 更有信息：restriction gap 不是在最後一點突然由 plotting artifact 產生。

Full stress 時，dense diagnostic 與 full certificate 四捨五入至六位都顯示 $0.267659$，但兩者並非同一 quantity。前者是 20,001 個 spectral evaluations 的 minimum；後者是一個經 endpoint residual checks 的 all-theta lower bound。它們的 numerical proximity 是 G4 metric，不應用相同 rounded label 抹走 evidence-type difference。Diagonal bound $0.10407958854612244$ 仍 positive 且超過 frozen $0.05$ gate，所以局部結論是「較 conservative 但仍 informative」，不是「diagonal certificate 無法存在」。

G4 across-stress maximum full relative gap 是 $5.686578772919613\times10^{-7}$，遠低於 $0.005$ threshold。G6 maximum grid-resolution difference 是 $6.763624081962405\times10^{-5}$，低於 $0.001$。兩項都有舒適 margin，但不能合併成 global optimum claim。Resolution check 只比較兩個 nested-ish grid sizes；兩者可能共享 parameterization bias，也沒有獨立 solver。因此 C4 與 C6 必須作為兩項不同結論分開報告。

## Full-stress theta slice 顯示 evidence hierarchy

<figure>
  <img src="/science/from-simulation-to-certificate/p09_03_full_stress_theta_audit.svg" alt="Full stress 的 theta-decay 曲線與二十五個 seeded points，並以兩條水平線標出 full 及 diagonal robust certificate bounds。" />
  <figcaption>黑色曲線和橙色 markers 都是 finite evaluations；綠色與藍色水平 bounds 的 all-theta coverage 來自 verified endpoint inequalities，而不是曲線畫得夠密。</figcaption>
</figure>

Figure 3 的 401-point curve 是為可讀性 downsample 的 profile，不是 canonical dense search 的全部 20,001 points。紫色圈標出 dense diagnostic 的 minimum region，theta 約 $0.04935$。橙色 triangles 是 final seed 90905 的 25 sampled theta values。黑線在 theta 接近一時升至約 $0.895$，所以如果 random sample 偏向右半部，minimum 很容易被高估；今次 seed 幸運地抽到 theta 約 $0.04233$，因此 sampled minimum 只比 dense minimum高約 $2.28\times10^{-5}$。

綠色水平線是 full robust certificate，藍色 dashed line 是 diagonal certificate。它們是水平的，因為同一個 $P$ 和 $\alpha$ 要覆蓋整段 $\theta$，而不是為每個 $\theta$ 重新挑一個 Lyapunov matrix。若容許 parameter-dependent $P(\theta)$，問題與 certificate class 便已改變，需要另一個研究設計。P09 刻意保持 common $P$，以便 endpoint affine argument 清楚成立。

Curve 在 worst region 幾乎貼住 full bound，並不表示 curve「驗證」bound。因果方向相反：endpoint inequalities 先提供 guarantee，curve 再幫助評估 bound 有多 conservative。若 curve 某處低於 certified line，代表 implementation 或 plotting data 出現矛盾，應觸發 failure；若 curve全部高於 line，只是和 certificate 相容。這種 directionality 是 scientific visualization 常被忽略的部分。

Vertex eigenvalue minimum是 $0.2687804869601953$，比 interior dense minimum $0.26765867256228715$ 高約 $0.00112$。差別不大，卻足以提醒「只查 vertices 的 eigenvalues」與「查 vertex LMIs」不是同一件事。前者的 eigenvectors 和 Lyapunov geometry 可以隨 vertex 改變；後者要求一個共同 $P$。P09 的 all-theta statement來自後者。

## 為何這些數值核對可信

幾項彼此獨立的計算，分別針對不同的失敗方式。由 rate parameterization 重建兩個 original matrices，可核對全部 rates positive、off-diagonals nonnegative，並驗證 negative column sums 等於 declared removal rates；這會揭示 $k_{12}$、$k_{21}$ 放反位置或 diagonal 少減一項的錯誤，而只看 eigenvalues stable 並不足夠。

Known diagonal matrices 則提供可手算 reference。當 $\theta=0.25$，兩個 diagonal endpoints 的 mixture 應是 $\operatorname{diag}(-1.5,-2.5)$，spectral abscissa 必須是 $-1.5$；這個答案不依賴 certificate construction 本身。

另一個 hand-calculable case 使用 $A=-0.7I$ 與 $A=-1.2I$。對任意 positive $P$，common generalized decay 應為 $0.7$；$\alpha=0.7-10^{-11}$ 符合 inequality，而 $\alpha=0.71$ 不符合。這一正一負對照可揭示 inequality sign 反轉或無效 bound 被接受的問題。

Full-stress constructed $P$ 亦在 101 個 $\theta$ mixtures 上重新計算 common decay，所有值都沒有低於 certificate（容許 $10^{-10}$ floating tolerance）。All-$\theta$ coverage 仍然來自 endpoint affine proof；這些 interior evaluations 的用途，是確認 finite profile 與該 proof 沒有矛盾，而不是取代它。

Full construction 以相同 81-point settings 重算，並明確包含 diagonal candidate；所得值沒有在 numerical tolerance 外低於該 candidate。完整 experiment 亦獨立重複，所有結果一致，而兩類 finite spectral diagnostics 仍與 certificates 分開解讀。

這些核對沒有證明 241-grid optimum 等於 continuous optimum，也沒有驗證所有 dimensions 或 arbitrary Metzler matrices。它們的價值來自彼此不同的數學依據：model construction、known spectrum、manufactured generalized decay、endpoint convexity、family inclusion，以及完整重複計算。

這種分層亦令失敗較容易解讀。若 hand-calculable matrix 已不能回復已知 decay，問題首先落在 matrix transformation 或 inequality evaluation；若已知 case 通過，但 selected family 的 endpoint residual 變成正值，則候選 $P$ 不能取得 certificate 身分。兩者都可能產生一條外觀看似平滑的 spectral curve，卻需要完全不同的修正，因此不能只靠最終圖形判斷。

完整計算亦獨立重複一次。Spectral profiles、constructed matrices、residual eigenvalues 與六個 headline values 全部相同。這支持本實驗的 deterministic execution，但不會擴大 uncertainty set，也不會把 binary64 residual checks 變成 formal proof。

Selection history仍然是一項 limitation。Preliminary stage 已看過 candidate behavior，現有 family 沒有被保留作 untouched final sample。因此它適合作為有明顯 diagonal/full contrast 的 pedagogical benchmark，不適合被當成 unseen positive networks 的 validation。更嚴格 follow-up 要先分開 development families 和 held-out families，再問 conclusion 能否轉移。

<figure>
  <img src="/science/from-simulation-to-certificate/p09_04_predeclared_gate_audit.svg" alt="六張結果卡列出 G1 至 G6 的量度值，下方顯示 full-stress residual eigenvalues 及結論適用範圍。" />
  <figcaption>六項 benchmark checks 都符合預定條件，但不能推出新 theorem、global SDP optimum、scaling、physical validation 或 universal superiority。</figcaption>
</figure>

## 六項結果應怎樣解讀

G1 表示 fixed matrices 符合 declared positive leaky structure；它不表示所有 positive networks 都 stable。G2 表示每個 reported $P,\alpha$ pair 都符合 endpoint residual inequalities；它不表示 search 找到最大可能 $\alpha$。G3 顯示兩種 construction 在 collapsed family 一致；它不驗證 high-stress behavior。G4 表示 full construction 在五個 declared stress levels 都貼近 dense finite diagnostic；它不把 diagnostic 升格為 ground truth theorem。

G5 最容易被宣傳化。它預先要求 diagonal gap 至少 $0.4$ 且 bound 仍至少 $0.05$，今次 observed values 分別為 $0.611148080688841$ 與 $0.10407958854612244$。這只支持「fixed high-imbalance endpoint 呈現 substantial but nonzero diagonal conservatism」。它不支持「full $P$ universally better」，更不支持「應永遠避免 diagonal Lyapunov functions」。Diagonal structure 在較大 systems 可能有 sparsity、interpretability、distributed computation 或 robustness advantages，P09 完全沒有測 cost-benefit。

G6 表示 coarser construction grid 沒有 materially 改變 fixed bounds。若 external SDP solver 日後得到更高 full 或 diagonal alpha，這不會使目前 certificate 變成 false；feasible lower bound 仍有效，但 proximity/optimality interpretation 會更新。這正是 certificate validity 與 optimization quality 要分欄的原因。

完整計算仍不能越過先行研究。P09 的 local evidence chain 完整，但 method headline 與 established work 重疊。因此它是一項 controlled numerical benchmark，不是 published theorem 或 validated engineering tool。

## 哪些失敗會改變結論

若某 endpoint 不是 Metzler，rate-to-matrix construction 或 candidate family 便失效，不能繼續用 positive-system language。若 leakage 低於指定 threshold，model 仍可能 stable，但已不屬於本文所定義的 leaky family。若 residual maximum eigenvalue 為正，reported alpha 就不是 certificate；即使 dense curve 很漂亮也不能補救。

若 G3 失敗，最可能是 parameterization、generalized eigenvalue transform、grid inclusion 或 refinement bug。若 G4 失敗但 residuals 通過，full certificate 仍 valid，只是比 dense diagnostic 更 conservative。若 G5 gap 不足，正確結果會是「此 fixed family 未呈現預定 diagonal contrast」；若 diagonal alpha 低於 $0.05$，則只能說 restriction 在這個 benchmark 失去預定 usefulness，不能由單例推廣。

若 G6 失敗，current constructions 仍可能 feasible，但 quantitative comparison 對 grid 不穩定；需要新的 resolution study 或 independent solver，而不是只選對 headline 最有利的 grid。這些不同 failure modes 對應不同結論，不能用一個總分互相抵消。

這些 counterfactuals 讓讀者看見結果如何可能被推翻。只有成功路徑而沒有失敗條件的比較，很容易把任何輸出都解釋成支持原先想法。

## 這個 benchmark 沒有提供 physical 或 safety validation

兩個 states沒有 units，rates沒有由 experiment、database或named process估計。Positive leakage只是一個 mathematical condition，不能轉譯成 environmental clearance、drug elimination、infectious recovery或industrial safety margin。Certified decay in $P$-norm也不是 component-wise maximum concentration、time-to-safe-threshold或risk probability。

沒有 uncertainty distribution。Theta只在 $[0,1]$ parameterize convex segment，沒有說某些 theta較常見；seeded sampling只是 numerical negative control，不是 Monte Carlo risk estimate。Dense minimum不能叫 worst-case probability，full certificate也不能叫 confidence interval。Robust在這裏意指「對 declared deterministic set全部成立」，不是對真實世界 model misspecification robust。

沒有 control input、disturbance或output map，所以不能由 stability certificate推出 controller performance、$H_\infty$ attenuation、actuator safety或closed-loop robustness。Literature中有這些更廣結果，P09正因它們已 established才保持窄 scope。把 bibliography中的 performance theory引用進來，不代表 local code實作了那些 methods。

沒有 large-network timing。二乘二 vectorized grid search 很快不具 scalability 證據；dimension 增加時，parameterization、candidate count、linear algebra cost 與 solver choice 都會改變。未有 matched hardware、tolerances、failure accounting 和足夠大的 matrices 前，不能比較 computational scaling。

## 從橢圓幾何理解 diagonal gap

Quadratic function $V(x)=x^\top P x$ 的等值線是橢圓。當 $P$ 為 diagonal，橢圓主軸只能沿着 $x_1,x_2$ 坐標方向；改變兩個 diagonal entries 可以拉長或壓短橢圓，卻不能旋轉。Full symmetric $P$ 多了一個 off-diagonal entry，等值線因而可以傾斜。對單一 matrix，兩種形狀都可能找到可行 decay bound；要求同一個橢圓同時配合兩個方向差異很大的 endpoints 時，旋轉自由度才可能明顯影響 lower bound。

Full-stress matrices 正好提供這種幾何。第一個 endpoint 的強 transfer 方向和第二個 endpoint 不同，兩個 dynamics 把 state 拉向不同方向。Reported full matrix 的 off-diagonal entry 是 $0.3933259267$，和 diagonal entries 相比並不細小；其 eigenvalues 約為 $0.100862$ 與 $0.899138$，說明橢圓既有旋轉，也有明顯伸長。Diagonal matrix 只能用 $0.4014333333$ 與 $0.5985666667$ 調整兩條坐標軸，因而要選一個較低 alpha 才同時滿足 endpoints。

這個圖像解釋 gap 的方向，但不證明 grid search 已找到最佳橢圓。Parameterization 只在 trace-one slice 上用有限 points 搜尋；refinement check 顯示把 241-point construction 改成 121-point construction，reported bounds 最多改變 $6.76362408196\times10^{-5}$。這表示當前比較對這次 coarsening 不敏感，卻沒有排除兩個 grid nodes 之間存在更好 $P$。Feasibility 和 optimality 仍然是兩個問題。

同樣，full bound 靠近 dense spectral curve 也不可倒轉成 proof。Spectral decay 容許每個 theta 使用自己的 eigenvectors；common quadratic certificate 必須用同一個 $P$ 覆蓋全部 theta。兩條數值接近，只說明今次 family 存在一個 common ellipse，所得 bound 幾乎到達 dense sample 所見的最慢 decay。它沒有證明 dense minimum 是 continuum exact minimum，也沒有證明另一種 certificate class 不會更貼近。

Endpoint argument 的力量來自 affine structure，而不是二乘二 dimension。Residual 對 $A$ 線性，所以同一 $P,\alpha$ 在兩個 endpoints 成立時，任何 convex mixture 的 residual 都是兩個 negative-semidefinite matrices 的 convex combination。這個邏輯覆蓋沒有被 sampling 到的 $\theta$。Dimension 增加仍保留 convex implication，但尋找合適 $P$ 的成本、conditioning 和可解釋性會迅速改變，因此 present benchmark 不能提供 scaling 結論。

讀 Figure 2 時，dense、seeded、diagonal 和 full 四條線不應被視為同一場 race。前兩條是被訪問 matrices 的 spectral summaries；後兩條是共同 inequality 所容許的 lower bounds。Dense line 可用來發現 certificate implementation 的明顯矛盾，卻不能授權 all-theta statement。Certificate line 可以覆蓋全段，卻可能因 common form 而保守。把它們放在同一 axes 的目的，是比較數值尺度及 gap，不是抹平證據類型。

Figure 3 進一步顯示 sparse sampling 的位置效應。Full-stress adverse region 靠近 theta $0.04935$，25-point set 剛好有一點在約 $0.04233$，所以 sampled minimum 只略為 optimistic。若 adverse basin 更窄或移到兩個 points 中間，差距可能更大。這不是說 25 points 太少而 20,001 points 足夠；它說 finite design 的結論永遠要附帶被訪問位置，而 certificate 則要指出覆蓋位置之間的數學機制。

Decay bound 的數值也要連同 $P$ 的 conditioning 閱讀。由 $V(t)\le e^{-2\alpha t}V(0)$ 轉成 Euclidean norm 時，會出現 $\lambda_{\max}(P)/\lambda_{\min}(P)$ 的 factor。Full-stress full matrix 的 eigenvalue ratio 約為九，代表 quadratic energy 在不同方向有不一樣的尺度。較大的 certified alpha 不必在所有初始方向、所有有限時間都給出比例相同的 Euclidean improvement。若 application 真正關心 component peak 或 settling time，下一階段應把 norm-equivalence factor 及 transient response 一起報告，而不是只排名 alpha。

Positive-system structure 還提供其他 certificate choices。Linear copositive function、diagonal quadratic form、full quadratic form 和 parameter-dependent form 各有 coverage、conservatism 與計算成本。P09 只比較其中兩種，因為二乘二例子容許直接顯示橢圓 geometry。這不代表 quadratic form 是正系統最自然或最 scalable 的選擇。若擴展到 sparse network，certificate structure 本身應成為預先定義的比較軸，並同時記錄 feasible rate、bound quality、memory 和 solve failures。

Condition number 還會影響 numerical verification。當 $P$ 很接近 singular，generalized eigenvalue 與 residual calculation 對 rounding 更敏感，一個很小的 negative residual 未必有足夠安全距離。現有 full matrix 的 smallest eigenvalue 約 $0.100862$，尚未貼近零；擴展 study 仍應預先設定 eigenvalue floor，並報告 residual 相對 matrix scale，而不只報一個正負號。

若比較不同 certificate classes，這個 floor 必須一致，否則某一類可藉接近 singular 的矩陣取得表面較高 bound，數值可信度卻同時下降。

比較規則一致，幾何差異才有清楚含義。

## 下一個實驗應該測甚麼

第一條可能路線是 solver-quality study。先指定一個 independently maintained conic solver，凍結 primal/dual tolerances、normalization、warm starts、failure handling和hardware timing protocol，再把 grid-constructed feasible bounds與solver certificates比較。這可以回答grid search離continuous optimum多遠；它仍不自動構成new theory。

第二條路線是 held-out family study。先由一個有明確 physical-sign constraints的generator產生 development與final families，凍結dimension、sparsity、uncertainty polytopes與metrics，再比較 diagonal、block-diagonal、full quadratic、linear copositive或parameter-dependent certificates。主要 endpoint應同時包含 feasibility rate、certified decay quality、runtime和memory，避免只報 favourable feasible cases。

第三條路線是 application study。那需要named system、units、rate provenance、measurement model、calibration/validation split與domain review。Uncertainty set應由data或engineering tolerances建立，而不是為產生漂亮 gap手選。Safety-related claim還需要component constraints、inputs/disturbances、failure definitions與independent review；一張 asymptotic decay certificate遠遠不夠。

第四條路線是 mathematical study。若想提出新 theorem，必須在最新 literature network中找出 precise missing condition，例如某種structured polytope、distributed certificate或tightness characterization，然後提供proof與counterexamples。P09的2x2 grid benchmark可以作sanity test，但不能反過來替代theorem。

另一個直接的數學實驗，是在保持 pointwise spectral decay 近似不變時旋轉兩個 endpoints 的 eigendirections。這可較純粹地分離 common $P$ 的幾何負擔：diagonal form 的 level sets 不能旋轉，full form 則可透過 off-diagonal entry 傾斜。若同時報 $P$ 的 eigenvectors、condition number 與 certificate gap，Figure 3 的機制會比單看一條 stress curve 更清楚。

也可以加入第三個 vertex，把 line segment 變成 triangle。相同 inequality 若在三個 vertices 對同一 $P$ 成立，convexity 仍可覆蓋整個 triangle。這個擴展保持現有 proof logic，卻能測試 diagonal contrast 是否只依賴一條特殊線段。Family selection、certificate classes 和 primary metrics 都應先固定，否則新增 vertices 只會提供更多挑選漂亮例子的自由度。

Held-out design 尤其重要。若 development stage 用來找有清楚 gap 的 families，final stage 就應由另一組未看過的 seeds 或 deterministic cases 評估。結果可能顯示 gap 經常出現、只在特定 geometry 出現，或者幾乎完全消失；三種答案都有科學價值。現有單例只能提出這個問題，不能替它作 general answer。

## 結論

對這個 fixed synthetic two-compartment leaky-transfer family，兩個 verified endpoint inequalities 確實把 reported full 與 diagonal quadratic decay lower bounds 延伸到每個 convex-mixture theta。五級 stress 中，full construction 貼近 dense finite diagnostic；在 full stress，diagonal construction 仍給 positive bound，但相對同一 diagnostic 的 local gap 是 $0.611148080688841$。六項預定數值條件與直接 residual checks 均成立。

同時，finite curve 仍不是 certificate，constructed full $P$ 仍不是 globally optimal SDP proof，local gap 仍不是 general conservatism law，positive leakage 仍不是 physical validation。由模擬走向證書，不是把一張平滑曲線換成更強的形容詞，而是為每一句結論指出它真正擁有的數學 coverage。兩個小數看來接近，也可能分別來自有限抽樣與全集合不等式；只有後者能把結論延伸到沒有逐點計算的 $\theta$。

## 參考文獻

1. Barker、Berman 與 Plemmons，〈Positive Diagonal Solutions to the Lyapunov Equations〉，*Linear and Multilinear Algebra*（1978），[DOI 10.1080/03081087808817203](https://doi.org/10.1080/03081087808817203)。
2. Gurvits、Shorten 與 Mason，〈On the Stability of Switched Positive Linear Systems〉，*IEEE Transactions on Automatic Control*（2007），[DOI 10.1109/TAC.2007.899057](https://doi.org/10.1109/TAC.2007.899057)。
3. Mason 與 Shorten，〈On Linear Copositive Lyapunov Functions and the Stability of Switched Positive Linear Systems〉，*IEEE Transactions on Automatic Control*（2007），[DOI 10.1109/TAC.2007.900857](https://doi.org/10.1109/TAC.2007.900857)。
4. Knorn、Mason 與 Shorten，〈On Linear Co-positive Lyapunov Functions for Sets of Linear Positive Systems〉，*Automatica*（2009），[DOI 10.1016/j.automatica.2009.04.013](https://doi.org/10.1016/j.automatica.2009.04.013)。
5. Fornasini 與 Valcher，〈Linear Copositive Lyapunov Functions for Continuous-Time Positive Switched Systems〉，*IEEE Transactions on Automatic Control*（2010），[DOI 10.1109/TAC.2010.2049918](https://doi.org/10.1109/TAC.2010.2049918)。
6. Tanaka 與 Langbort，〈The Bounded Real Lemma for Internally Positive Systems and H-Infinity Structured Static State Feedback〉，*IEEE Transactions on Automatic Control*（2011），[DOI 10.1109/TAC.2011.2157394](https://doi.org/10.1109/TAC.2011.2157394)。
7. Ding、Shu 與 Liu，〈On Linear Copositive Lyapunov Functions for Switched Positive Systems〉，*Journal of the Franklin Institute*（2011），[DOI 10.1016/j.jfranklin.2011.06.002](https://doi.org/10.1016/j.jfranklin.2011.06.002)。
8. Ebihara、Peaucelle 與 Arzelier，〈L1 Gain Analysis of Linear Positive Systems and Its Application〉，*IEEE CDC/ECC*（2011），[DOI 10.1109/CDC.2011.6160692](https://doi.org/10.1109/CDC.2011.6160692)。
9. Briat，uncertain linear positive systems 的 robust stability、stabilization 與 gain characterization，*International Journal of Robust and Nonlinear Control*（2013），[DOI 10.1002/rnc.2859](https://doi.org/10.1002/rnc.2859)。
10. Rantzer，〈Scalable Control of Positive Systems〉，*European Journal of Control*（2015），[DOI 10.1016/j.ejcon.2015.04.004](https://doi.org/10.1016/j.ejcon.2015.04.004)。
11. Colombino 與 Smith，〈A Convex Characterization of Robust Stability for Positive and Positively Dominated Linear Systems〉，*IEEE Transactions on Automatic Control*（2016），[DOI 10.1109/TAC.2015.2480549](https://doi.org/10.1109/TAC.2015.2480549)。
12. Gumus 與 Xu，〈On Common Diagonal Lyapunov Solutions〉，*Linear Algebra and its Applications*（2016），[DOI 10.1016/j.laa.2016.05.032](https://doi.org/10.1016/j.laa.2016.05.032)。

這份清單用來界定研究位置，而不是用 citation count 製造 novelty。最接近的研究已涵蓋 common diagonal 與線性共正 Lyapunov certificates、robust stability 和 scalable positive control，所以 P09 只保留由本地數值直接支持的結論。
