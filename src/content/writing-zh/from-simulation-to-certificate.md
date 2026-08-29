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

P09 把這個差別縮成一個可以逐行審核的 Phase-1 benchmark。模型只有兩個 compartments，transfer 與 removal rates 全部是合成數值；uncertainty 只有兩個 endpoints 及其 line segment；stress 只有五級；certificate construction 只搜尋 trace-normalized 的二乘二 matrices；所有 seeds、grids、thresholds 和 claim boundaries 都在 canonical evaluation 前凍結。結果是六個 predeclared gates 全部通過，但這個 PASS 只屬於該 frozen family。它不是新的 positive-systems theorem，不是 globally optimal SDP result，不是 large-network scaling result，更不是任何 physical 或 safety validation。

最容易被誤讀的數字是 full stress 下的 diagonal relative gap：$0.611148080688841$。它的正確句子是：「在這個凍結的雙艙 family、這個 construction、這個 reference diagnostic 與這個 stress endpoint 下，diagonal certificate 的 relative gap 是 $0.611148080688841$。」它不能改寫成「diagonal LMIs 一般都有六成 conservatism」，也不能證明 full matrices 永遠優勝。後者需要跨 families、dimensions、uncertainty geometries、solvers 和 cost budgets 的獨立 protocol；P09 沒有做那些實驗。

## 先把 evidence ledger 放在前面

下表把每個 public number 的證據類型與推論上限列出。若只讀本文一部分，應先保留這些限定。

| 問題 | Frozen evidence | 只可作出的推論 |
|---|---:|---|
| 文獻是否支持 method novelty？ | 12 篇 DOI-verified primary works；**COMPLETE / REFRAME** | Common diagonal、copositive、quadratic 與 robust positive-system certificates 已成熟；P09 是 audit，不是新理論。 |
| Model 是否保持 positive-network structure？ | 全部 endpoints 為 Metzler；minimum column leakage $0.1264590482842527$ | 只證明 frozen synthetic family 的結構與第一個 gate。 |
| Reported bounds 是否真的 feasible？ | 全部 20 個 diagonal/full constructions 的 endpoint residual checks 通過 | 每個 reported $alpha$ 對相應 line segment 是 verified lower bound；不等於 global optimum。 |
| Collapsed family 是否通過 manufactured check？ | $s=0$ 時 diagonal/full relative difference $3.596327159290119\times10^{-11}$ | Implementation 在一個預期會相合的 limit 一致；不是一般 convergence theorem。 |
| Full construction 是否貼近 dense diagnostic？ | 五級 stress 的 maximum relative gap $5.686578772919613\times10^{-7}$ | 只對 frozen family 和 grid 成立；dense diagnostic 本身仍非 proof。 |
| Diagonal restriction 是否呈現對比？ | $s=1$ 時 certificate $0.10407958854612244$，relative gap $0.611148080688841$ | 一個 benchmark-specific conservatism witness；不是 universal law。 |
| Construction grid 是否足夠穩定？ | 241 對 121 grid 的 maximum absolute difference $6.763624081962405\times10^{-5}$ | 通過一次 finite resolution check；沒有證明搜尋到 global SDP optimum。 |
| Rerun 是否一致？ | Canonical 與 rerun JSON byte-identical | 在記錄的 runtime 與 protocol 下 deterministic；不代表模型對外部世界有效。 |

Frozen config file 的 SHA-256 是

`c1c20c5ed0e6ea0c2f781b3a10bbb9638e659593af1cd323304a35ec7ee1ebc4`。

Canonical 與 rerun result file 共有 SHA-256

`e4defd81ca7ac3a11f6652414addf2fa2ecabf6eed543a3a756319dd8f637a7d`。

這兩個 hashes 各有角色。第一個把 model rates、stress levels、sample counts、seeds、search grids、safety margin 與 gates 綁在一起；第二個把完整 machine-readable outputs 綁在一起。若只保存圖上的 rounded labels，日後重繪便很容易把新 output 與舊 prose 混合。Hash 不能證明 mathematics 正確，但可以阻止一個改過的 protocol 冒充原本 frozen run。

<figure>
  <img src="/science/from-simulation-to-certificate/p09_01_positive_network_protocol.svg" alt="雙艙漏損正系統連接三張證據卡，分開有限 spectral checks、diagonal quadratic construction 與 full quadratic endpoint certificate。" />
  <figcaption>同一個 synthetic family 可以產生兩類證據：finite checks 只描述已評估的 theta；verified endpoint inequalities 才把結論延伸至整條 convex segment。</figcaption>
</figure>

## Literature gate 為何只能是 REFRAME

Positive systems 的 Lyapunov theory 並不是空白領域。Barker、Berman 與 Plemmons 在 1978 年已研究 Lyapunov equations 的 positive diagonal solutions。Mason 與 Shorten、Gurvits 與合作者，以及 Knorn、Mason 與 Shorten，後來分別處理 switched positive linear systems、linear copositive functions 和一組 positive systems 的 common certificates。Fornasini 與 Valcher把 continuous-time positive switched systems 的 copositive framework 說得更完整。這些工作已經排除「發現 positive system 可以用 common Lyapunov function」這種 headline。

Performance 與 uncertainty 方向同樣已有直接先行研究。Tanaka 與 Langbort 給出 internally positive systems 的 bounded-real 結果；Ebihara、Peaucelle 與 Arzelier研究 $L_1$ gain；Briat 討論 uncertain linear positive systems 的 robust stability、stabilization 與 gain characterizations；Rantzer 強調 scalable control；Colombino 與 Smith 提供 positive 與 positively dominated systems 的 robust-stability convex characterization。Gumus 與 Xu 則直接研究 common diagonal Lyapunov solutions。這個文獻集合不只「背景相似」，而是和 P09 原擬 method claim 高度重疊。

因此 gate 的作用不是替結果加一段 references，而是在執行前改寫研究問題。若 verdict 仍寫 GO，讀者可能以為本專案提出新 convex characterization；那會忽略至少十二篇 closest primary works。REFRAME 後，問題變成一項 certificate-quality benchmark：在一個刻意簡小、完全可審核的 family 中，restricted diagonal construction 與 full construction 的 decay lower bounds 怎樣隨 endpoint imbalance 改變？有限 sampling 和 certificate 又應如何在 public narrative 中分欄？

這個 reframe 也改變 failure criterion。Positive leakage 使 frozen system 的 stability structurally plausible，所以「成功找到 stable matrices」沒有足夠信息量。Phase-1 真正需要驗證的是 reported certificate 是否 feasible、diagonal restriction 是否仍保留 positive decay、full construction 是否有用、結果是否對 declared grid refinement 穩定，以及 finite diagnostics 有沒有被錯標成 guarantee。若這些條件失敗，研究應保存 PARTIAL 或 STOP，而不是更換 family 直至圖形好看。

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

所以 total state 只由 removal terms 減少。Matrix 的 column sums 正好是 $(-r_1,-r_2)$；程式因此以 negative column sums 作 leakage audit。這裏的「compartment」與「removal」只是 mathematical structure。沒有指定 chemical species、drug dose、population class、biological tissue 或 industrial tank，也沒有 units 或 measurement。把 state 稱為 mass 並不會自動產生物理 calibration。

Frozen original endpoints 來自 development-only candidate search。第一個 endpoint 的 $k_{12}=0.5643881500896605$、$k_{21}=2.6493424810092114$、$r_1=0.2831741517239682$、$r_2=0.20289426431561064$；第二個 endpoint 的相應數值是 $2.2068349884577403$、$0.022834967500031368$、$0.12645904828425247$ 與 $0.9070075625573553$。兩者有相反的 transfer imbalance，但全部 rates 保持正值。候選編號 104 與探索 seed 90900 留在 append-only attempts log，明確標記為 development evidence，不能和 canonical results 混在一起。

## Stress 與 theta 是兩個不同座標

先把 original endpoints 記為 $A_1$ 與 $A_2$，midpoint 是 $A_m=(A_1+A_2)/2$。Stress $s$ 定義新的 endpoints：

$$
A_1(s)=A_m+s(A_1-A_m),
$$

$$
A_2(s)=A_m+s(A_2-A_m).
$$

當 $s=0$，兩個 endpoints 都等於 midpoint，uncertainty segment collapse 成單一 matrix；當 $s=1$，回到 original pair。P09 只使用 $s=0,0.25,0.5,0.75,1$ 五個 levels。這個 stress 不是 real-world hazard level，也不是 statistical confidence。它是一個可控幾何參數，用來逐步拉開 endpoints。

對每個固定 $s$，第二個參數 $theta$ 才沿該 segment 混合：

$$
A(theta,s)=(1-theta)A_1(s)+theta A_2(s),\qquad 0\le theta\le1.
$$

兩個參數不能混用。Stress 改變 uncertainty set 的寬度；theta 選擇 set 內一個 matrix。Figure 2 的橫軸是 stress，每一個點代表先對完整 theta segment 做一次 audit 後所得的 summary。Figure 3 的橫軸則是 full stress 下的 theta，展示 set 內 spectral decay 如何改變。若把 stress 當作 theta，便會錯誤解讀 certificate 的 coverage。

Convex mixing 也保存 Metzler off-diagonals 與 positive leakage，因為每個 entry 和 column leakage 都是 endpoints 的 convex combinations。G1 仍然逐個 stress 計算，不用這句推理代替 code check。Observed minimum leakage 是 $0.1264590482842527$，高於 frozen threshold $0.1$。這是 structure gate，不是 decay-rate gate；一個 system 可以有正 leakage，同時仍需要清楚說明所用 norm、Lyapunov function 與 decay bound。

## Finite spectral checks 能說甚麼

對每個 matrix，spectral abscissa 是 eigenvalues real parts 的最大值。P09 把 decay diagnostic 寫成 spectral abscissa 的負值；數值為正表示該 particular matrix 的 linear asymptotic decay rate 為正。Dense diagnostic 在每個 stress 使用 20,001 個均勻 theta values，grid spacing 是 $0.00005$。Seeded diagnostic 則只抽 25 個 theta，final seeds 由 90901 至 90905，並先排序再報 minimum sampled decay。

Dense 與 seeded checks 都很有用。它們可以定位 sampled worst region、顯示 spectral curve 是否平滑、捕捉 endpoints 和 interior 的差別，也可以揭露 sparse sample 有多 optimistic。例如 full stress 的 dense minimum 是 $0.26765867256228715$，位於 theta 約 $0.04935$；25-point seeded minimum 是 $0.267681432313707$。兩者很接近，但 seeded value 較高，正符合有限 sample 可能錯過最差位置的方向。

然而「很接近」不等於「已證明相同」。Dense grid 仍有 20,000 個 intervals；除非另有 analytic monotonicity、interval enclosure 或 global optimization certificate，grid points 之間仍未由 sampling 本身覆蓋。P09 的 result JSON 因此在兩類 diagnostic records 都明寫 `is_certificate: false`。這個 boolean 看似多餘，實際上是 anti-overclaim guard：plotting、README 或 site content 若把 dense curve 稱為 certificate，checker 與 review 便有具體欄位可對照。

Vertex-only eigenvalue checks 更不能取代 common certificate。Full-stress endpoints 的 minimum decay 約 $0.2687804869601953$，而 dense interior minimum略低。差別在今次 family 不大，但已足以示範最差 theta 不必位於 vertex。更一般而言，每個 frozen matrix individually stable 不會自動推出 arbitrary switching stability，也不會自動給出一個 common quadratic decay rate。P09 沒有把所有這些問題合併；它只處理 affine segment 上一個 common quadratic inequality。

## 由 Lyapunov function 到 decay certificate

選一個 symmetric positive-definite matrix $P$，定義

$$
V(x)=x^T P x.
$$

沿 $x'=Ax$ 的 trajectory，

$$
V'(x)=x^T(A^T P+PA)x.
$$

如果存在 $alpha>0$ 使

$$
A^T P+PA+2alpha P\preceq0,
$$

那麼 $V'\le-2alpha V$，因此

$$
V(t)\le V(0)e^{-2alpha t}.
$$

這個 statement 是在 $P$ 所定義的 quadratic measure 中的 decay bound。它不是每一個 component 都以同一 scalar envelope 單調下降；transfer 可以令某個 compartment 暫時增加。也不能把 $alpha$ 未經 norm equivalence 直接稱為 total-mass half-life。P09 只報 certified quadratic decay lower bound，沒有作 safety 或 physical-time interpretation。

為甚麼檢查 endpoints 足以涵蓋 segment？對固定 $P$ 與 $alpha$，residual

$$
R(A)=A^T P+PA+2alpha P
$$

對 $A$ 是 affine。若 $A(theta)=(1-theta)A_1+theta A_2$，則

$$
R(A(theta))=(1-theta)R(A_1)+theta R(A_2).
$$

Negative-semidefinite matrices 的 convex combination 仍是 negative semidefinite，所以兩個 endpoint residuals 通過便涵蓋全部 $0\le theta\le1$。這是 established standard argument，不是 P09 新 theorem。Local contribution只是把 construction、safety margin、direct residual eigenvalues、finite diagnostics 與 claim ledger 串成可重現 record。

每個 reported certificate 都把 raw feasible decay 減去 $10^{-10}$ 作 safety margin，再重新計算 $P$ eigenvalues 與兩個 symmetric residual 的 maximum eigenvalue。Full stress 的 diagonal certificate maximum residual eigenvalue 是 $-8.634148951358611\times10^{-11}$；full certificate 是 $-1.2635535673322096\times10^{-10}$。負值代表 checked inequalities 在 floating-point audit 下仍位於所需方向。這些 margins 不大，所以直接 recheck 很重要；只相信 search grid 的 objective value會遺漏 rounding 把 boundary point推到 infeasible side 的可能。

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

最重要的措辭是「constructed feasible certificate」，不是「optimal LMI bound」。程式沒有調用 external conic solver，也沒有 dual certificate、primal-dual gap 或 global branch-and-bound proof。二乘二 grid search 的優點是 dependency-light、每個 candidate 可直接計算 generalized eigenvalue、結果容易 audit；缺點是不能把最好 grid point等同 continuous SDP optimum。即使 full bound 和 dense diagnostic 相差只有約五十萬分之一，這項 proximity 也只是 observed quality metric。

Generalized decay 的計算先形成 $-(A^TP+PA)/2$，再用 Cholesky factor of $P$ 轉成 symmetric standard eigenvalue problem。兩個 endpoints 的 minimum generalized eigenvalue 給 common raw decay。Tests 包括 manufactured $A=-cI$ case，此時任意 positive $P$ 都應回傳 $c$；若 transformation 次序、transpose 或 Cholesky solve 寫錯，這個 exact case 會立即失敗。

## Protocol 在 final evaluation 前凍結

Development search 用 seed 90900 掃 240 個 candidate families，最後選 candidate 104。選擇準則包括 positive transfer/removal、Metzler structure、column leakage，以及在開發 diagnostic 中可見的 diagonal/full contrast。這一步確實看過 candidate behavior，所以它不能假裝是 untouched final evidence。Attempts log 明確寫上 `development_only_not_canonical_evidence`；canonical protocol 隨後才凍結 exact rates、final seeds、five stress levels 和 six gates。

G1 要求全部 endpoints 維持 Metzler 且 minimum leakage 至少 $0.1$。G2 要求所有 diagonal 與 full certificate residual verifications 通過。這兩項若失敗，verdict 是 STOP，因為 model structure 或 certificate feasibility 本身失效。G3 是 collapsed-midpoint manufactured check，relative difference 上限 $10^{-5}$。G4 要求 full-to-dense maximum relative gap 不超過 $0.005$。G5 預先要求 full stress diagonal gap 至少 $0.4$，同時 diagonal certified decay 不低於 $0.05$；前半確保 contrast 可見，後半避免以「diagonal 完全失敗」冒充有用比較。G6 要求 241 對 121 grid 的 maximum absolute difference 不超過 $0.001$。

若 G3 至 G6 任一失敗而 G1/G2 保持通過，verdict 是 PARTIAL，不會事後降低 threshold。若 G5 gap 未達 $0.4$，正確結論應是這個 family 沒有提供預定 contrast；若 diagonal decay 跌至零以下，則不能再說 restriction「仍保留 useful positive bound」。Failure-preserving設計令研究可以完整完成而 hypothesis 不成功，而不是只有 favourable output 才有 publishable record。

<figure>
  <img src="/science/from-simulation-to-certificate/p09_02_certificate_decay_stress.svg" alt="五級端點不平衡 stress 上的 decay rate 曲線，比較 dense 與 seeded finite diagnostics，以及 verified diagonal 與 full quadratic certificates。" />
  <figcaption>在這個 frozen two-compartment family，full construction 一直貼近 dense diagnostic；diagonal certificate 隨 stress 增加而下降。圖中 0.611 gap 只屬於 $s=1$ 的本地結果。</figcaption>
</figure>

## 五級 stress 的完整結果

Machine-readable table 如下；正文保留足夠 digits 方便 cross-check，但 acceptance 仍用 JSON full precision。

| $s$ | Dense finite diagnostic | Seeded 25-point diagnostic | Diagonal certificate | Full certificate |
|---:|---:|---:|---:|---:|
| 0.00 | 0.371832224166786 | 0.371832224166786 | 0.371832224053412 | 0.371832224066784 |
| 0.25 | 0.320095696585905 | 0.328338270167576 | 0.320095696014307 | 0.320095696485893 |
| 0.50 | 0.286991854972174 | 0.291208435853174 | 0.273443669159099 | 0.286991854872167 |
| 0.75 | 0.270344300372003 | 0.274603078965093 | 0.200729805259843 | 0.270344300272000 |
| 1.00 | 0.267658672562287 | 0.267681432313707 | 0.104079588546122 | 0.267658520356075 |

在 $s=0$，segment collapse，兩種 constructions 幾乎完全相合，G3 relative difference 是 $3.596327159290119\times10^{-11}$。這個 case 是 implementation audit 的 anchor：若 diagonal 和 full parameterizations 在同一 midpoint matrix 產生大差別，便要先檢查 search domain、transformation 或 refinement，而不能直接把差別解釋成 geometry。

到 $s=0.25$，full 與 diagonal 仍幾乎貼住 dense diagnostic；sparse seeded value $0.328338270167576$ 則高於 dense minimum $0.320095696585905$。在 $s=0.5$，diagonal bound 降至 $0.273443669159099$，而 full bound仍是 $0.286991854872167$。到 $s=0.75$，diagonal 已降至 $0.200729805259843$。這條 gradual path 比只展示 endpoints 更有信息：restriction gap 不是在最後一點突然由 plotting artifact 產生。

Full stress 時，dense diagnostic 與 full certificate 四捨五入至六位都顯示 $0.267659$，但兩者並非同一 quantity。前者是 20,001 個 spectral evaluations 的 minimum；後者是一個經 endpoint residual checks 的 all-theta lower bound。它們的 numerical proximity 是 G4 metric，不應用相同 rounded label 抹走 evidence-type difference。Diagonal bound $0.10407958854612244$ 仍 positive 且超過 frozen $0.05$ gate，所以局部結論是「較 conservative 但仍 informative」，不是「diagonal certificate 無法存在」。

G4 across-stress maximum full relative gap 是 $5.686578772919613\times10^{-7}$，遠低於 $0.005$ threshold。G6 maximum grid-resolution difference 是 $6.763624081962405\times10^{-5}$，低於 $0.001$。兩項都有舒適 margin，但不能合併成 global optimum claim。Resolution check 只比較兩個 nested-ish grid sizes；兩者可能共享 parameterization bias，也沒有獨立 solver。因此 claim ledger 把 C4 與 C6 分開。

## Full-stress theta slice 顯示 evidence hierarchy

<figure>
  <img src="/science/from-simulation-to-certificate/p09_03_full_stress_theta_audit.svg" alt="Full stress 的 theta-decay 曲線與二十五個 seeded points，並以兩條水平線標出 full 及 diagonal robust certificate bounds。" />
  <figcaption>黑色曲線和橙色 markers 都是 finite evaluations；綠色與藍色水平 bounds 的 all-theta coverage 來自 verified endpoint inequalities，而不是曲線畫得夠密。</figcaption>
</figure>

Figure 3 的 401-point curve 是為可讀性 downsample 的 profile，不是 canonical dense search 的全部 20,001 points。紫色圈標出 dense diagnostic 的 minimum region，theta 約 $0.04935$。橙色 triangles 是 final seed 90905 的 25 sampled theta values。黑線在 theta 接近一時升至約 $0.895$，所以如果 random sample 偏向右半部，minimum 很容易被高估；今次 seed 幸運地抽到 theta 約 $0.04233$，因此 sampled minimum 只比 dense minimum高約 $2.28\times10^{-5}$。

綠色水平線是 full robust certificate，藍色 dashed line 是 diagonal certificate。它們是水平的，因為同一個 $P$ 和 $alpha$ 要覆蓋整段 theta，而不是為每個 theta 重新挑一個 Lyapunov matrix。若容許 parameter-dependent $P(theta)$，問題與 certificate class 便已改變，需要另一個 protocol。P09 刻意保持 common $P$，以便 endpoint affine argument 清楚成立。

Curve 在 worst region 幾乎貼住 full bound，並不表示 curve「驗證」bound。因果方向相反：endpoint inequalities 先提供 guarantee，curve 再幫助評估 bound 有多 conservative。若 curve 某處低於 certified line，代表 implementation 或 plotting data 出現矛盾，應觸發 failure；若 curve全部高於 line，只是和 certificate 相容。這種 directionality 是 scientific visualization 常被忽略的部分。

Vertex eigenvalue minimum是 $0.2687804869601953$，比 interior dense minimum $0.26765867256228715$ 高約 $0.00112$。差別不大，卻足以提醒「只查 vertices 的 eigenvalues」與「查 vertex LMIs」不是同一件事。前者的 eigenvectors 和 Lyapunov geometry 可以隨 vertex 改變；後者要求一個共同 $P$。P09 的 all-theta statement來自後者。

## 六項 tests 分別防止甚麼錯誤

第一項 test 由 rate parameterization 重建兩個 original matrices，檢查全部 rates positive、off-diagonals nonnegative，並驗證 negative column sums 等於 declared removal rates。這可以捕捉 $k_{12}$、$k_{21}$ 放反位置或 diagonal 少減一項的錯誤。只檢查 eigenvalues stable 不會發現這種 model-semantic mistake。

第二項 test 使用 known diagonal matrices，確認 convex interpolation 和 spectral abscissa 計算。在 theta $0.25$ 時，兩個 diagonal endpoints 的 mixture應是 $diag(-1.5,-2.5)$，spectral abscissa必須是 $-1.5$。這是可手算 reference，不依賴同一個 certificate routine。

第三項 manufactured test 用 $A=-0.7I$ 與 $A=-1.2I$。對任意 positive $P$，common generalized decay 應為 $0.7$。Test 同時確認 $alpha=0.7-10^{-11}$ 通過、$alpha=0.71$ 失敗。這一正一負 case 防止 verifier 只會回傳 true，亦防止 inequality sign 反轉。

第四項 test 取得 full-stress constructed $P$，在 101 個 theta mixtures重新計算 common decay，確認沒有低於 certificate（容許 $10^{-10}$ floating tolerance）。Endpoint affine proof 才是 coverage 理由，但 sample-based regression test仍可捕捉 convex_matrix 或 matrix-order code bug。這裏亦再次表明 tests 與 proofs 是互補，不是互相替代。

第五項 test 用相同 81-point settings 重跑 full construction兩次，要求 serialized record deterministic，並確認 full search 不比 included diagonal candidate低超過 numerical tolerance。第六項跑完整 experiment兩次，比較 sorted JSON serialization，並逐 row 確認兩類 spectral records 的 `is_certificate` 都是 false。完整 suite 六項全部通過，project validator、project checker 和 ten-project root checker亦通過。

Tests 沒有證明 241-grid optimum 等於 continuous optimum，也沒有驗證所有 dimensions 或 arbitrary Metzler matrices。Substantive test 的標準不是數量越多越好，而是每一項有獨立 failure mode：model construction、known spectrum、manufactured generalized decay、convex coverage regression、search determinism、end-to-end claim labels。若增加一百個只重跑相同 function 的 tests，evidence breadth不會相應增加。

## Canonical run、rerun 與 attempts history

Runner 讀取 frozen JSON，對五級 stress 逐一計算 dense reference、seeded sample、241-grid diagonal/full constructions 與 121-grid sensitivity constructions。每級共有四個 certificate records，五級合共二十個；每一個都保存 $P$、raw feasible decay、safety-adjusted certified decay、$P$ eigenvalues、兩個 vertex residual eigenvalues 和 grid intervals。Result serialization 使用 sorted keys 並拒絕 NaN。

Canonical run 記錄 Python 3.12.13、NumPy 2.3.5、config file hash、canonicalized config hash 與 result hash。Rerun 寫入另一個 filename 和 signature file，但 scientific result bytes完全相同。Validator 不只比較 high-level metrics，而是比較兩個 JSON files 的 raw bytes；因此任何 sampled theta、$P$ entry、residual 或 explanatory label改變都會令 equality failure。

Attempts log 是 append-only。第一行是 pre-freeze candidate search；後兩行是 canonical 與 rerun events，包含 timestamps、config hash、result hash、output path 和 verdict。Timestamp 不進 result JSON，所以 rerun仍可 byte-identical。這種分層避免兩個極端：完全不記 operational history，或者把 execution timestamp混入 scientific output，令 deterministic bytes 永遠不可能相同。

探索期看過 candidate behavior 是一項 limitation。Phase-1 沒有獨立 held-out family，所以不應把 PASS 當作對 unseen positive networks 的 validation。Candidate 104 的作用是建立一個具有預定 contrast 的 pedagogical benchmark。更嚴格的 follow-up 要先凍結 family generator、training/development subset、held-out generation seeds 和 evaluation metrics，再測試是否在 unseen families 保持同樣 conclusions。

## Visual QA 亦保留 rejected revision

四張 canonical figures 同時輸出 SVG、vector PDF 與 4296×2160、600-dpi PNG。Public SVG 與 canonical SVG byte-identical；每張 SVG 有非空 title、description，全部 text 使用 explicit black，color 只用於 lines、fills、markers 和 redundant encodings。Figure manifests 把 source result hash、每個 format hash、dimensions 與 generator path 綁在一起。

首輪 rev1 不是直接接受。`p09_02_certificate_decay_stress` 的兩行 claim-boundary footer 太接近 x-axis label 與下邊，第二行有 clipping risk。整批 rev1 被標記 REJECTED，原 PNG hash `ac52a42762d0ba0683610a8060e7c5031bd2a931fc2390999ea7a24a6b027ddf` 與 SVG/PDF hashes 都保存在 `figures/rejected/rev1` 和 QA history。Revision 把 plot 與 side panel 高度減少 20 canvas units，重新分配 x-label、兩行 footers 與 lower margin。

Rev2 的四張 4296×2160 canonical PNG，以及四個 PDF rasterized to 4296×2160，先由 implementation reviewer逐張檢查，再由 root independent reviewer逐張檢查。Review scope 明列 titles、panel labels、curves、markers、legends、audit boxes、x/y labels、two-line footers 與 four edges。結果無 text-text、text-data、legend-data overlap，也無 clipping；p09_02 revised bottom boundary 有安全距離。這個 PASS 綁定 final PNG/PDF hashes，不沿用 rev1 judgment。

Visual QA 只處理 readability 與 provenance。它不能證明 matrix algebra、literature novelty 或 residual computation。相反，unit tests 和 hashes 也不能看出 footer 是否被 page edge截掉。把兩種 QA 分開存檔，可以避免一句「所有 checks pass」掩蓋究竟檢查過甚麼。

<figure>
  <img src="/science/from-simulation-to-certificate/p09_04_predeclared_gate_audit.svg" alt="六張綠色 audit cards 顯示 G1 至 G6 全部通過，下方列出 full-stress residual eigenvalues、byte-identical rerun 與 REFRAME claim boundary。" />
  <figcaption>Phase-1 verdict 是 6/6 PASS，但圖底明確鎖定不可推出的 claims：沒有新 theorem、global SDP optimum、scaling、physical validation 或 universal superiority。</figcaption>
</figure>

## PASS 究竟表示甚麼

G1 PASS 表示 frozen matrices 符合 declared positive leaky structure；它不表示所有 positive networks 都 stable。G2 PASS 表示每個 reported $P,alpha$ pair 經 endpoint residual verifier 接受；它不表示 search 找到最大可能 alpha。G3 PASS 是 collapsed family 的 internal consistency check；它不驗證 high-stress behavior。G4 PASS 表示 full construction 在五個 declared stress levels 都貼近 dense finite diagnostic；它不把 diagnostic 升格為 ground truth theorem。

G5 PASS 是最容易被宣傳化的一項。它預先要求 diagonal gap至少 $0.4$ 且 bound仍至少 $0.05$，今次 observed values 分別為 $0.611148080688841$ 與 $0.10407958854612244$。這只支持「frozen high-imbalance endpoint呈現 substantial but nonzero diagonal conservatism」。它不支持「full P universally better」，更不支持「應永遠避免 diagonal Lyapunov functions」。Diagonal structure在較大 systems 可能有 sparsity、interpretability、distributed computation 或 robustness advantages，P09 完全沒有測 cost-benefit。

G6 PASS 表示 coarser construction grid沒有 materially改變 frozen bounds。若 external SDP solver 日後得到更高 full 或 diagonal alpha，這不會使目前 certificate 變成 false；feasible lower bound仍有效，但 proximity/optimality interpretation會更新。這正是 certificate validity 與 optimization quality要分欄的原因。

整體 PASS 也不能越過 literature REFRAME。Novelty gate與experiment gate是兩條 axes：一項 computation可以完整、正確而不新穎；一項理論問題可以新穎但目前 experiment失敗。P09 的位置是前者：local evidence chain完整，method headline與 established work重疊。因此 public status 用 Reproducible study，而不是 Published theorem 或 validated engineering tool。

## 如果 gates 沒有通過，結論應怎樣改

若某 endpoint 不是 Metzler，應先判定 rate-to-matrix construction或 candidate family失效，不能繼續用 positive-system language。若 leakage低於 threshold，model仍可能 stable，但已不符合 frozen structural gate，verdict 應 STOP，而不是把 threshold降至 observed value。若 residual maximum eigenvalue為正，reported alpha就不是 certificate；即使 dense curve很漂亮也不能補救。

若 G3 失敗，最可能是 parameterization、generalized eigenvalue transform、grid inclusion或refinement bug。若 G4 失敗但 residuals通過，full certificate仍 valid，只是較 conservative；verdict應 PARTIAL，headline不能說它 tracks diagnostic。若 G5 gap不足，研究應保留 null：「此 frozen family未呈現預定 diagonal contrast。」若 diagonal alpha低於 $0.05$，可說 restriction在這個 benchmark失去預定 usefulness，但不能由單例推廣。

若 G6 失敗，所有 current constructions仍可能 feasible，但 quantitative comparison對 grid不穩定；應增加預先規範的新 resolution study或引入 independent solver，而不是只選對 headline最有利的 grid。若 rerun bytes不同，先比對 config、random seeds、serialization與 library versions；不能把 non-determinism當作 scientific uncertainty，除非 protocol本來就定義了 stochastic ensemble與統計 tolerance。

這些 counterfactual rules 在看到 final PASS後仍保留，目的不是補寫保險句，而是讓讀者知道 verdict logic事前可逆。一個只描述成功 path 的 protocol很容易在 failure時失去約束力。

## 這個 benchmark 沒有提供 physical 或 safety validation

兩個 states沒有 units，rates沒有由 experiment、database或named process估計。Positive leakage只是一個 mathematical condition，不能轉譯成 environmental clearance、drug elimination、infectious recovery或industrial safety margin。Certified decay in $P$-norm也不是 component-wise maximum concentration、time-to-safe-threshold或risk probability。

沒有 uncertainty distribution。Theta只在 $[0,1]$ parameterize convex segment，沒有說某些 theta較常見；seeded sampling只是 numerical negative control，不是 Monte Carlo risk estimate。Dense minimum不能叫 worst-case probability，full certificate也不能叫 confidence interval。Robust在這裏意指「對 declared deterministic set全部成立」，不是對真實世界 model misspecification robust。

沒有 control input、disturbance或output map，所以不能由 stability certificate推出 controller performance、$H_\infty$ attenuation、actuator safety或closed-loop robustness。Literature中有這些更廣結果，P09正因它們已 established才保持窄 scope。把 bibliography中的 performance theory引用進來，不代表 local code實作了那些 methods。

沒有 large-network timing。二乘二 vectorized grid search很快不具 scalability證據；dimension增加時，parameterization、candidate count、linear algebra cost與solver choice都改變。README明確刪除原 contract 的 solver-time/scaling endpoint，因 Phase-1沒有 frozen timing protocol。執行時間若受 machine負載影響，更不能在未控制 environment下比較。

## 如何重現完整 evidence chain

私人 ScienceProject repository 的 P09 工作區分開保存 source、tests、frozen protocol、COMPLETE / REFRAME literature gate、claim ledger、canonical result、reproducibility record 及被拒圖像 revision。公開 Blog 只同步經審閱的解讀與獲准 SVG，刻意不提供訪客無法存取的私人 repository 連結。

在 project directory 執行：

~~~powershell
python -m unittest discover -s tests -v
python scripts/run_phase1.py
python scripts/run_phase1.py --output results/p09_phase1_rerun.json --signature results/p09_phase1_rerun_signature.json
python scripts/validate_phase1.py --compare results/p09_phase1_rerun.json
python scripts/plot_phase1.py
python scripts/check_repo.py
~~~

有效 reproduction 應得到六個 tests PASS、Phase-1 validator PASS、canonical/rerun byte identity、P09 repository checker PASS。Root portfolio checker還要確認十個 projects 都有 complete literature gate、至少十篇 bibliography entries、substantive tests、machine-readable results、至少四組 canonical figure triples、byte-identical publish SVG、original-size QA與 site-manifest record。

Re-running plotting可能因 font、Pillow、reportlab或PDF compression版本改變 bytes，所以 scientific result hash與visual artifact hashes分開。Recorded canonical environment是 Python 3.12.13、NumPy 2.3.5、Pillow 12.3.0、reportlab 4.4.9。若只改 renderer，result JSON應保持相同，而 figures hashes可以在新 revision改變；若 model、grid或gate改變，則必須建立新 protocol，不能覆寫 Phase-1 PASS。

`scripts/explore_candidates.py` 不在 reproduction的confirmatory sequence內。它屬於 development history；再次執行可能找到其他 families，但那些 families沒有繼承 Phase-1 gates或claims。這個 distinction 對防止 data snooping尤其重要：selection code可以公開、seed可以固定，仍不等於 selected case是held-out validation。

## 下一階段需要新的問題，而不是更大的同一張圖

第一條可能路線是 solver-quality study。先指定一個 independently maintained conic solver，凍結 primal/dual tolerances、normalization、warm starts、failure handling和hardware timing protocol，再把 grid-constructed feasible bounds與solver certificates比較。這可以回答grid search離continuous optimum多遠；它仍不自動構成new theory。

第二條路線是 held-out family study。先由一個有明確 physical-sign constraints的generator產生 development與final families，凍結dimension、sparsity、uncertainty polytopes與metrics，再比較 diagonal、block-diagonal、full quadratic、linear copositive或parameter-dependent certificates。主要 endpoint應同時包含 feasibility rate、certified decay quality、runtime和memory，避免只報 favourable feasible cases。

第三條路線是 application study。那需要named system、units、rate provenance、measurement model、calibration/validation split與domain review。Uncertainty set應由data或engineering tolerances建立，而不是為產生漂亮 gap手選。Safety-related claim還需要component constraints、inputs/disturbances、failure definitions與independent review；一張 asymptotic decay certificate遠遠不夠。

第四條路線是 mathematical study。若想提出新 theorem，必須在最新 literature network中找出 precise missing condition，例如某種structured polytope、distributed certificate或tightness characterization，然後提供proof與counterexamples。P09的2x2 grid benchmark可以作sanity test，但不能反過來替代theorem。

所有路線目前都鎖定。Phase-1 PASS沒有自動授權Phase-2 final evaluation、public theorem headline或submission decision。新的研究問題若改變certificate class、family generator或primary metric，應建立新 config hash與new claim ledger，而不是在現有 JSON追加幾個fields。

## Literature gate 保留的十二篇 primary works

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

這份清單的作用是限制claim，不是以citation count製造novelty。最接近的works已經涵蓋common diagonal與線性共正Lyapunov certificates、robust stability和scalable positive control，所以P09只保留可由local evidence直接支持的句子。

## 最後的窄結論

對這個凍結的synthetic two-compartment leaky-transfer family，兩個verified endpoint inequalities確實把reported full與diagonal quadratic decay lower bounds延伸到每個convex-mixture theta。五級stress中，full construction貼近dense finite diagnostic；在full stress，diagonal construction仍給positive bound，但相對同一diagnostic的local gap是$0.611148080688841$。六個predeclared gates、六項tests、identical rerun和兩位reviewers的visual QA全部通過。

同時，finite curve仍不是certificate，constructed full $P$仍不是globally optimal SDP proof，local gap仍不是general conservatism law，positive leakage仍不是physical validation。由模擬走向證書，不是把一張平滑曲線換成更強的形容詞；是把每個sentence追溯到它真正擁有的數學coverage，並把coverage之外的部分明確鎖住。
