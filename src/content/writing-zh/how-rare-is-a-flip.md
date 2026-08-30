---
title: "一次翻轉究竟有多罕見？"
slug: how-rare-is-a-flip
sourceSlug: how-rare-is-a-flip
summary: 帶誤差界的有限狀態計算與固定種子的直接模擬，在一個合成低 copy 數基因開關事件上互相吻合；但這項第一階段結果只是起點，並非 rare-event 方法的勝利。
date: 2026-08-29
lastUpdated: 2026-08-29
featured: true
topics: [罕見事件, 隨機反應網絡, 基因開關, 有限狀態投影, 不確定性]
heroImage: /science/how-rare-is-a-flip/p03_02_fsp_vs_naive_ssa.svg
type: 研究筆記
archived: false
scienceProject: how-rare-is-a-flip
redirectFrom: []
---

一個基因開關可以長時間看似穩定，然後在一小段充滿噪聲的過程中改變狀態。正因如此，「它多久翻轉一次？」聽起來簡單，實際上卻同時包含多個問題：甚麼狀態才算完成翻轉？觀察到哪個時間便停止？所用隨機模型有哪些反應？如果事件真的很少出現，數值方法又能否在可負擔的計算量內給出可靠不確定性？

這個專案最初想直接比較 adaptive multilevel splitting、Gillespie 直接模擬與帶誤差控制的 forward-flux baseline。正式計算開始前的文獻審查改變了研究方向。基因與生化開關的 rare-event sampling 已有深厚先行工作；只展示「增強取樣比 brute force 更有效率」，並不能構成新的研究貢獻。因此審查結論是 **REFRAME**，即先縮窄問題，再開始計算。

改寫後可辯護的問題窄得多：在同一個固定的 exclusive-toggle 連續時間馬可夫鏈上，將進度座標由機理合理逐步降質時，未來 benchmark 能否找出估計器失去校準的邊界，而且把前導、設定與正式抽樣成本全部計入？要回答這個問題，首先需要可信的參考機率與已核對的直接模擬 baseline。

本文只報告這個基礎。它是一項**合成、低 copy 數的第一階段 smoke study**。當每個物種的有限狀態上限設為 20，有限狀態投影把已申明有限時域命中機率夾在 $0.2575946379$ 與 $0.2575946395$ 之間，overflow probability 為 $1.62\times10^{-9}$。固定種子的直接 SSA 在 $6000$ 條軌跡中錄得 $1580$ 次命中，估計值為 $0.26333$，95% Wilson 區間為 $0.25234$ 至 $0.27463$。另外 32 個較小、彼此獨立種子的批次中，有 30 個 Wilson 區間與 FSP 機率界相交。Structural invariants 與一個可手算 special case 提供另外兩層數值核對。

以上就是本階段全部正面結論。本文沒有 adaptive multilevel splitting 或 FFPilot 結果，沒有 rare-event speedup，沒有生物驗證，也沒有最終 rarity ladder。目前 smoke 設定的事件機率大約是四分之一；把這次計算包裝成「已經解決極罕見切換」尤其會誤導讀者。

## 第一階段建立了甚麼

| 問題 | 結果 | 為何重要 |
|---|---:|---|
| 使用了甚麼系統？ | 合成低 copy 數 exclusive-toggle CTMC | 它是受控數值案例，不是指定生物迴路。 |
| 甚麼才算事件？ | 在 $T=12$ 前首次進入已申明的 $B$-dominant 集合 | 結果是有限時域命中機率，不是穩態切換率或 MFPT。 |
| Cap 18 是否足夠？ | 否；它超出固定 overflow 及 bracket tolerance | 這次失敗說明為何必須擴大狀態空間。 |
| Cap 20 提供甚麼？ | $[0.2575946379,\,0.2575946395]$，overflow $1.62\times10^{-9}$ | 它給出這個 smoke event 的狹窄參考界。 |
| 直接模擬得到甚麼？ | $1580/6000=0.26333$ | Wilson 區間 $[0.25234,\,0.27463]$ 與 FSP 界相交。 |
| 小批次是否完全吻合？ | 否；32 個區間中 30 個相交 | 兩個 miss 顯示普通有限樣本變動。 |

最後一欄的措辭刻意收窄。信賴區間碰到參考界，不等於每個數值細節都已證明無誤；結構與解析核對吻合，不等於生化機理已獲實驗驗證；截斷界非常窄，也不會把中等機率事件變成罕見事件。每項證據只回答一個特定問題，其他問題仍須保持開放。

## 文獻為何改變了研究問題

原來研究構想最吸引人的地方是計算效率。直接模擬可能先經過大量普通反應事件，才偶然看到一次跨 basin 轉換；splitting 或 importance sampling 可以把較多計算資源放在接近轉換路徑的位置。這個想法重要，卻並不新。

Allen、Warren 與 ten Wolde 在 [2005 年](https://doi.org/10.1103/PhysRevLett.94.018104)把 forward-flux sampling 用於生化網絡的罕見切換，並處理互相抑制的 genetic switch。Allen、Frenkel 與 ten Wolde 隨後在 [2006 年](https://doi.org/10.1063/1.2140273)於 genetic switch 比較多種 interface 與 path-sampling 算法。Morelli 等人在 [2008 年](https://doi.org/10.1529/biophysj.107.116699)研究 general 與 exclusive genetic switch 的 flip rate、reaction coordinate 與 committor 分佈。最直觀的研究空間——讓罕見翻轉變得可計、比較取樣路線、分析進度座標——早已有人直接探索。

重疊範圍並不限於 forward-flux sampling。Roh 等人在 [2011 年](https://doi.org/10.1063/1.3668100)提出 state-dependent doubly weighted stochastic simulation algorithm，研究生化 rare event，案例包括雙穩態 lac-operon switch。Cao 與 Liang 在 [2013 年](https://doi.org/10.1063/1.4811286)把 adaptively biased sequential importance sampling 與 finite-buffer chemical master equation 的結果比較。Tse 等人在 [2015 年](https://doi.org/10.1016/j.bpj.2015.08.035)用 weighted-ensemble string sampling 研究 DNA binding kinetics 如何改變 noise-induced switching path，並在 [2018 年](https://doi.org/10.1371/journal.pcbi.1006336)把 rare-event sampling、coarse graining、landscape 與 phenotype transition 分析結合。

另有兩條文獻線索直接影響實驗設計。Rolland 與 Simonnet 在 [2015 年](https://doi.org/10.1016/j.jcp.2014.12.009)以簡化模型展示：當 reaction coordinate 不理想，adaptive multilevel splitting 的有限樣本行為可以很差。Cao、Terebus 與 Liang 在 [2016 年](https://doi.org/10.1137/15M1034180)發展 multi-finite-buffer chemical master equation 解法，為包括 genetic toggle 在內的可處理系統提供帶截斷控制的參考。Klein 與 Roberts 在 [2020 年](https://doi.org/10.1063/1.5129461)為 forward-flux sampling 加入全階段自動誤差控制，測試亦包括 genetic toggle 類 master-equation model。

這十篇 primary work 共同界定了「文獻已建立」而不是「本地新發現」的三件事。第一，interface、weighted ensemble 與 importance-sampling 路線已用於生化或基因網絡的罕見切換。第二，進度座標質素、誤差控制、設定成本與抽樣成本都是公平比較的核心。第三，在可處理的低 copy 數 toggle regime，帶截斷誤差界的有限狀態 master-equation 計算，可以比把一個超大 Monte Carlo run 當成真值更透明。

因此剩下的研究空間是診斷，而不是宣告勝利。一個有用 benchmark 可以事前固定幾個進度座標，以受控方式逐級惡化，然後在 matched total compute 下比較 empirical interval coverage、誤差與失敗率，找出方法何時不再可靠。第一階段沒有執行這項 benchmark；它只先問模型、事件、直接 simulator、不確定性公式與有限狀態參考能否在 tractable regime 對上。

## 合成 exclusive toggle 的狀態與反應

連續時間狀態寫成

$$
X(t)=(N_A(t),N_B(t),S(t)),
$$

其中 $N_A$ 與 $N_B$ 是兩類低 copy 數蛋白的總數；共享 operator 的狀態為

$$
S(t)\in\{U,A,B\}.
$$

$U$ 表示 operator 未被佔據，$A$ 表示一個 $A$ 蛋白結合，$B$ 表示一個 $B$ 蛋白結合。由於只有一個共享 operator，兩種蛋白不可能同時佔據它。已結合蛋白仍計入對應物種的總數；因此設定降解反應時，只有游離蛋白可以降解。這個細節若前後不一致，會直接改變生成矩陣與命中機率。

反應通道包括蛋白生產、游離蛋白降解、單體 binding 與 unbinding。簡寫為

$$
\varnothing\rightarrow A,\qquad A\rightarrow\varnothing,
$$

$$
\varnothing\rightarrow B,\qquad B\rightarrow\varnothing,
$$

以及 operator 在 $U$、$A$-bound 與 $B$-bound 之間的轉換。當 $B$ 佔據 operator，$A$ 的生產率乘上 leak fraction；當 $A$ 佔據 operator，$B$ 的生產率使用同一抑制規則。共享 operator 將兩個方向的抑制連結成 exclusive toggle。

固定合成參數是對稱的。兩個未受抑制生產率均為 $1.5$，leak fraction 為 $0.08$，兩個降解率均為 $0.55$，兩個 binding coefficient 均為 $0.8$，兩個 unbinding rate 均為 $0.35$。初始狀態是

$$
X(0)=(6,0,A),
$$

即系統由 $A$-dominant 狀態開始，而且 operator 被 $A$ 佔據。

<figure class="article-figure">
  <img src="/science/how-rare-is-a-flip/p03_01_exclusive_toggle_ctmc.svg" alt="合成 exclusive genetic-toggle CTMC 示意圖：A 與 B 互相抑制生產，共享一個 U/A/B operator，並標出固定初始狀態及 B-dominant 首達事件。" width="1031" height="454" loading="eager" decoding="async" />
  <figcaption><strong>圖 1。</strong> 第一階段使用合成低 copy 數 exclusive-toggle CTMC。圖中分開反應結構、固定 A-dominant 起點與 B-dominant 首達條件；這不是一項生物迴路驗證。</figcaption>
</figure>

這個模型刻意保持細小。它沒有指定 organism、promoter、plasmid、實驗 copy-number calibration 或量得的反應率；也沒有包括 mRNA、transcriptional burst、translation delay、細胞生長與分裂、extrinsic noise、resource competition 或演化穩定性。它的用途是數值可追溯：每個合法狀態都是離散狀態，每條 transition 都有已申明 propensity，而低 copy 數令獨立、帶誤差界的有限狀態計算可行。

這個用途也有別於本站較早討論 qualitative noise-induced switching 的文章。本研究的主要 observable 不是 stationary landscape，也不是沒有時間限制的 mean first-passage time，而是一個定義非常清楚的有限時域事件。

## 甚麼才算完成一次 flip？

把觀察時域固定為 $T=12$，target set 定義為

$$
\mathcal B=
\{(n_A,n_B,s): n_B\ge4,\ n_B-n_A\ge2,\ s=B\}.
$$

研究事件是在 $T$ 或之前首次進入 $\mathcal B$：

$$
H=\{\tau_{\mathcal B}\le T\},
\qquad
\tau_{\mathcal B}=\inf\{t\ge0:X(t)\in\mathcal B\}.
$$

三個條件缺一不可。要求 $n_B\ge4$，避免只出現一兩個 $B$ 分子便被叫作完成切換；要求 $n_B-n_A\ge2$，使分類有 abundance margin，而不是接受平手；要求 $B$ 佔據 operator，則把調控狀態納入分類，而不只看蛋白總數。

一條軌跡首次進入 $\mathcal B$ 後便計作 hit，即使它在更後時間可能離開。因此本文研究量是

$$
p_T=\Pr(\tau_{\mathcal B}\le12\mid X(0)=(6,0,A)).
$$

它與 stationary transition rate 不是同一個量，也不可自動當作 mean first-passage time 的倒數，更不是「每單位時間的概率」。在額外假設或某些極限 regime 下，這些量可能互相關聯；但如果未加說明便混用，方法之間的數值比較會失去共同 target。

在 rare-event 研究中，事前固定事件尤其重要。若看到哪些軌跡成功後才改 target threshold、time horizon 或 basin definition，估計器已不再回答原本申明的問題。這個第一階段 run 把 model parameter、initial state、event definition、truncation tolerance、seed 與 budget 固定在 smoke configuration 中。

## 直接 Gillespie simulation 提供甚麼 baseline？

對具有 state-dependent reaction propensity $a_j(x)$ 的連續時間馬可夫鏈，direct stochastic simulation algorithm 先以總率

$$
a_0(x)=\sum_j a_j(x)
$$

抽取 exponential waiting time，再以 $a_j(x)/a_0(x)$ 選擇第 $j$ 條反應。狀態更新後重複，直至軌跡首次命中 $\mathcal B$ 或時間到達 $T$。

對第 $i$ 條軌跡，定義 Bernoulli indicator

$$
Y_i=\mathbf1\{\tau_{\mathcal B}^{(i)}\le T\}.
$$

naive Monte Carlo estimator 是

$$
\widehat p=\frac1N\sum_{i=1}^{N}Y_i.
$$

它的優點是透明：對已申明 CTMC，它直接模擬目標事件。其抽樣變異數為

$$
\operatorname{Var}(\widehat p)=\frac{p_T(1-p_T)}{N}.
$$

相對標準誤差近似為

$$
\frac{\sqrt{\operatorname{Var}(\widehat p)}}{p_T}
=\sqrt{\frac{1-p_T}{Np_T}}.
$$

這條公式解釋為何在 $p_T$ 極小時 direct Monte Carlo 會變得昂貴：若要收集有用數目的命中，$N$ 大致要隨 $1/p_T$ 增長。但第一階段並沒有展示這種困難。由於 $p_T\approx0.258$，普通 baseline 已可取得足夠命中來進行 smoke check。

固定種子的 aggregate run 使用 $N=6000$ 條軌跡，得到

$$
K=1580,\qquad
\widehat p=\frac{1580}{6000}=0.26333\ldots.
$$

若只列五位小數而沒有 binomial interval，讀者很容易把 Monte Carlo decimal 當成確定答案。本研究使用 Wilson interval。對信心水平 $1-\alpha$，normal quantile $z=z_{1-\alpha/2}$，Wilson centre 與 half-width 分別為

$$
c=\frac{\widehat p+z^2/(2N)}{1+z^2/N},
$$

$$
h=\frac{z}{1+z^2/N}
\sqrt{\frac{\widehat p(1-\widehat p)}{N}+\frac{z^2}{4N^2}}.
$$

在 95% 信心水平，紀錄區間為

$$
[c-h,c+h]=[0.25234,\,0.27463].
$$

這是直接估計器的抽樣不確定性。它不包括 model-form error、生物參數不確定性，也不包括這個 synthetic CTMC 與真實 genetic circuit 之間未知的落差。

## 不把 Monte Carlo 自稱為真值

要核對直接模擬，第一階段另行組裝 finite-state projection。選擇 molecule cap $C$，列舉所有滿足

$$
0\le n_A\le C,\qquad0\le n_B\le C
$$

的合法非 target 狀態，以及相容的 $U$、$A$-bound 與 $B$-bound occupancy。然後加入兩個 absorbing sink：第一個收集 transition 首次進入 $\mathcal B$ 的 probability mass，第二個收集路徑離開矩形 molecule-count truncation 時的 mass。

若 $Q_C$ 是這個有限 generator，$\pi_C(0)$ 把全部 mass 放在 $(6,0,A)$，則時間 $T$ 的 transient distribution 由 matrix exponential 給出：

$$
\pi_C(T)=\pi_C(0)e^{Q_C T}.
$$

以 $p_{\mathrm{target}}(C)$ 表示 target sink mass，$p_{\mathrm{overflow}}(C)$ 表示 overflow sink mass。進入 target sink 的每條 path 都是未截斷 CTMC 的真實 hit，所以提供 lower bound。最保守情況下，每條 overflow path 都可能在 $T$ 前轉而命中 target，因此

$$
p_{\mathrm{target}}(C)
\le p_T
\le p_{\mathrm{target}}(C)+p_{\mathrm{overflow}}(C).
$$

除數值 rounding 外，這個 bracket 的寬度就是 overflow probability。這個建構不猜測未列狀態尾部的形狀，而是直接紀錄那些省略狀態最多可以令命中機率改變多少。

正因如此，第一次嘗試失敗後不能放寬 overflow tolerance。有限狀態計算若要成為 reference，其申明的 error control 必須在實際 state space 下通過，而不是看到結果後再改合格線。

## 為何 cap 18 被否決

當 $C=18$ 時，計算得到

$$
[0.2575946336,\,0.2575947078]
$$

的 bracket，overflow probability 約為 $7.42\times10^{-8}$。預先設定的最大 bracket width 是 $10^{-8}$，所以 cap 18 判定為 FAIL。這個結果沒有被改名為「已經很接近」，tolerance 也沒有因為結果看來方便而變寬。

下一次 attempt 只把 count cap 增至 20，得到

$$
p_{\mathrm{target}}(20)=0.2575946378813493,
$$

$$
p_{\mathrm{overflow}}(20)=1.6201573386\times10^{-9},
$$

因而有

$$
0.2575946378813493
\le p_T\le
0.2575946395015066.
$$

四捨五入至十位小數，第一階段 reference bracket 為

$$
[0.2575946379,\,0.2575946395].
$$

<figure class="article-figure">
  <img src="/science/how-rare-is-a-flip/p03_04_fsp_truncation_audit.svg" alt="對數尺度 FSP 截斷檢查：cap 18 位於固定 overflow tolerance 之上而失敗，cap 20 位於 tolerance 之下而通過。" width="1031" height="454" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong> 截斷合格線保持不變。Cap 18 失敗並被保留；把 molecule cap 增至 20 後，overflow 降至固定的第一階段 threshold 以下。</figcaption>
</figure>

保留失敗不只是整理檔案的習慣。如果文章只展示成功的 cap，讀者無法分辨 state space 是否依固定規則擴展，也無法知道研究者是否曾把 tolerance 調到恰好通過。這裏清楚寫出失敗的是哪項 control，而修正只改了一個合理輸入：cap 增大，criterion 沒有移動。

這亦是避免 cherry-picking 的關鍵。讀者需要看到同一判準下哪次結果不夠好，以及下一步為何能處理該問題。若失敗分支被刪除，最後的漂亮數字便會失去判斷脈絡。

Cap 20 並沒有被當成無界狀態空間。它是否足夠，要看 probability bracket，而不是 cap 的名稱。保留狀態內的計算給出下界，再把未解析 overflow mass 加上去便得到上界。當兩界只差 $1.62\times10^{-9}$，在這個 construction 下，省略狀態對已申明 hit probability 的最大影響也受同一數量控制。更大的 cap 可以再收窄 bracket，卻不會改變它與較寬 SSA interval 比較時的尺度。

FSP bracket 與 SSA interval 的寬度不能互相取代。前者控制有限狀態截斷造成的 numerical uncertainty；後者描述 $6000$ 次 Bernoulli trials 的 sampling uncertainty。以 $p\approx0.258$ 代入 $\sqrt{p(1-p)/6000}$，standard error 約為 $0.00565$，所以 95% interval 有百分點尺度的寬度並不反常。相比之下，FSP 上下界只差 $1.62\times10^{-9}$。兩個方法在各自不確定性下相容，意思不是它們有同樣精度，而是較粗的 Monte Carlo interval 覆蓋了極窄的截斷參考。

若要收窄 SSA interval，應增加獨立 trajectories；若要收窄 FSP bracket，則應擴大有限狀態空間。把兩種控制分開，才能知道額外計算量實際改善哪一種誤差。

## 將帶界參考與固定種子 SSA 放在一起

FSP midpoint 約為 $0.2575946387$。固定種子的直接估計是 $0.26333$，比 midpoint 高約 $0.00574$。若不考慮抽樣不確定性，只列這個 absolute difference，便會誇大它的意義。6000 次 Bernoulli trial 的估計沒有理由必須落在一個寬度約 $10^{-9}$ 的 reference bracket 內。

對 smoke baseline 更合理的問題是：直接估計的 interval 是否與 reference 相容？答案是相交：

$$
[0.25234,\,0.27463]
\cap
[0.2575946379,\,0.2575946395]
\ne\varnothing.
$$

<figure class="article-figure">
  <img src="/science/how-rare-is-a-flip/p03_02_fsp_vs_naive_ssa.svg" alt="Cap-20 FSP 狹窄機率界，與固定種子 naive SSA 點估計及其 95% Wilson 區間的比較。" width="1031" height="454" loading="lazy" decoding="async" />
  <figcaption><strong>圖 3。</strong> 固定種子的 aggregate SSA estimate 及其 95% Wilson 區間與 cap-20 FSP bracket 相交。這是第一階段 smoke regime 的吻合，不是 rare-event acceleration 證據。</figcaption>
</figure>

兩條計算路線的失敗方式不同。Direct SSA 有 Monte Carlo sampling error，但沒有 molecule-count truncation。FSP 則把省略 state space 的 mass 顯式放入 overflow sink；在申明有限 generator 下，matrix-exponential calculation 是確定的。兩者吻合不只是把同一行程式跑兩次，而是比較兩種不同結構如何到達同一個固定時域概率。

不過，一次吻合仍不足以校準 interval procedure。Aggregate interval 可能偶然碰到 reference，而單一 seed 亦會掩蓋 run-to-run variation。因此第一階段加入一項規模很小的 batch diagnostic。

## 三十二個區間中的三十個相交

這項 diagnostic 使用 32 個彼此獨立 seed 的 batch，每個 batch 含 300 條 direct SSA trajectory。每批各自產生 hit fraction 與 95% Wilson interval。預先固定的判定是：只要某批 interval 與嚴格 FSP bracket 有非空交集，便記作一次 intersection。

32 個 interval 中有 30 個相交，兩個沒有。圖中以空心圓標示相交 batch，以叉號保留 miss。

<figure class="article-figure">
  <img src="/science/how-rare-is-a-flip/p03_03_seeded_interval_calibration.svg" alt="三十二個獨立種子的 300-trajectory SSA 批次估計及 Wilson 區間；其中三十個與 FSP 參考相交，兩個 miss 以叉號標示。" width="1031" height="454" loading="lazy" decoding="async" />
  <figcaption><strong>圖 4。</strong> 32 個獨立種子 batch interval 中有 30 個與 FSP bracket 相交，兩個 miss 完整保留。只有 32 批，這是 smoke diagnostic，不是長期 95% coverage 的精密結論。</figcaption>
</figure>

為何不直接宣稱 empirical coverage 是 93.75%？算術當然正確：

$$
\frac{30}{32}=0.9375.
$$

但 coverage 一詞有 repeated-sampling 的統計含義。只有 32 個 batch，不足以緊密估計 nominal 95% coverage probability。除此之外，這裡的判定是 interval 與狹窄 probability bracket 相交，而不是檢查 interval 是否包含一個以無限精度表示的 scalar truth。這個 bracket 已經極窄，視覺解釋差別很小；方法上的區別仍應寫清楚。

兩個 miss 不是要藏起來的尷尬，而是這項診斷最有用的部分。在每批只有 300 條 trajectory 時，binomial variation 足以令少數 interval 不包含固定概率。若把這兩個 seed 刪除，calibration check 便會變成依結果選擇資料。保留它們，使圖表可核查，也阻止文章暗示 interval 表現完美。

同樣地，30/32 不可外推到最終 rarity ladder。當 event probability 下降很多、trajectory 變長、batch 中 hit 數可能接近零時，Wilson interval 的寬度與 estimator 行為都會改變。現時 diagnostic 只證明 smoke configuration 沒有出現明顯 baseline/reference 衝突。

## 為何數值核對可信

所有 emitted reaction channel rate 都是正值，destination state 保持非負且合法；occupancy-dependent repression 與 free-protein degradation 亦按模型定義組裝。Finite generator 是 conservative、off-diagonal rate 非負、diagonal entry 非正。這些 structural invariants 可在 probability calculation 前揭示 state 或 rate 組裝問題。

另一項獨立核對把 FSP calculation 與一個有 analytic answer 的 single-birth first-hit special case 比較。在這個情況，

$$
\Pr(\tau\le T)=1-e^{-\lambda T}.
$$

在相同 analytic case，固定種子的 SSA 得到包含 analytic probability 的 Wilson interval；用同一設定重算亦重現相同結果。

這些比較把一般 structural invariant、可手算 special case 與本次 smoke calculation 串起來。它們沒有證明 synthetic rate 描述真實細胞，沒有排除所有可能 numerical error，也沒有驗證 adaptive multilevel splitting 或 FFPilot，因為兩者根本不是第一階段結果的一部分；亦未建立任何 final rarity ladder 的結果。數值吻合加強了 baseline，卻不會擴大 scientific claim。

核對次序亦避免 circular validation：structural invariants 不依賴最後的 hit probability，analytic birth case 不依賴 toggle 的選定 rates，而 SSA interval 又不使用 FSP 的矩陣指數演算法。三者若同時吻合，比單純重跑同一條計算路徑更能支持這個 baseline。

## 文獻已知與本地 smoke 必須分開

這個區分是整項專案最重要的科學界線。

**十篇 primary literature 已建立的內容：** rare-event method 已應用於生化及 genetic switching；interface placement 與 reaction-coordinate quality 會影響行為；weighted 或 biased sampling 可以研究 transition probability 與 path；設定與抽樣不確定性需要 error control；在 tractable regime，finite-state master-equation calculation 可以提供受控 reference。

**本地第一階段實際觀察：** 對一個 synthetic low-copy exclusive toggle、一個固定 horizon 的 $B$-dominant first-hit event，cap-20 FSP bracket 是 $0.2575946379$ 至 $0.2575946395$；固定種子 direct SSA 是 $1580/6000=0.26333$，Wilson interval 為 $0.25234$ 至 $0.27463$；32 個較小 batch interval 有 30 個相交；申明 verification checks 通過。

**本地沒有觀察：** adaptive multilevel splitting、FFPilot、importance sampling、progress-coordinate degradation、matched-compute efficiency、rare-event speedup、預先註冊 final rarity ladder、stationary switching rate、MFPT accuracy 或 biological data 的任何結果。

如果不作這三層分隔，很容易出現推理錯置：一個方法在 literature 中已有驗證，不代表第一階段已測試該方法；另一方面，本地 baseline 內部一致，也不代表它新穎或 biologically realistic。若把兩者揉成「我們證明 rare-event sampling 對 genetic switch 有效」，便會把別人的研究成果錯誤歸到這次 smoke calculation。

## 目前事件為何還不是承諾中的 rare event

文章標題問 flip 有多罕見，而第一階段答案刻意平凡：在這個 configuration 與 horizon 下，已申明 target 的 hit probability 約為 $0.258$，即大約四條 trajectory 有一條命中，並非百萬分之一。

這個中等概率對 software validation 很有用。Direct simulation 能產生大量 hit，不需要巨大 compute budget 也可以看出明顯 implementation mistake；finite-state truncation 亦可處理，讓 overflow mass 降至固定的小 tolerance。這些特性令它成為好的 smoke test。

同一批特性也令它不適合支持 speedup claim。事件常見時，rare-event method 可能在 pilot run、interface、replica 或 coordinate design 上花費比 direct SSA 收集 hit 更多成本。文獻審查已把未來研究轉向 total-cost accounting，但第一階段沒有量度這種 accounting。不能由 baseline/reference 比對通過，推斷 enhanced sampler 將來必定更快。

目前 probability 也不是一個「flip rate」。縮短或延長 $T$、改變 target margin、取消 required operator occupancy、改 initial state，都會得到不同 probability。未來 rarity ladder 必須先凍結這些 design choice，只改預先註冊的 regime control。在 ladder 真正執行前，專案沒有 estimator reliability 隨 rarity 變化的 empirical statement。

## 下一個 benchmark 必須測試甚麼

問題收窄後的 research design 要求下列元素；它們是未來工作，不是本文暗示已完成的成果：

1. 在整條預先註冊 rarity ladder 保持同一個 fully specified exclusive-toggle CTMC 與 event definition；
2. 在 matched total compute 下評估 naive SSA、adaptive multilevel splitting 與 error-controlled forward-flux baseline；
3. 事前固定少量 progress coordinate，由 mechanistically informed 到 deliberate misspecification；
4. 在 tractable regime 使用 error-controlled finite-state probability，在不可行 regime 才使用另外 seed 的 direct simulation reference；
5. 以 empirical interval coverage、relative bias 或 RMSE、variance per total compute、failed-run rate 作主要 diagnostic；
6. 把 pilot、interface selection、training 與 tuning cost 計入造成該成本的方法；
7. 保留一個不預設 enhanced sampling 有優勢的 non-rare regime。

這是一份後續設計，不是 achievement list。涉及 AMS、FFPilot、coordinate stress test、matched-compute comparison 或 final ladder 的項目，都沒有在本文執行。文獻審查解釋為何值得做這項 benchmark，卻不能代替 benchmark outcome。

未來 benchmark 也可能無法產生有用 reliability boundary。如果 preregistered coordinate degradation 沒有造成可重現 calibration change，或者 total-cost accounting 只得到文獻早已解釋的普通結果，誠實結論可以是 null result 或停止研究。這次收窄問題的價值之一，正是防止研究者用籠統 speedup demonstration 製造虛假 novelty。

## 第一階段貢獻了甚麼

這次 contribution 是程序性的，而且範圍有限。Event 被寫成 first-hit set，而不是憑圖看似完成 flip；direct estimator 配有具名 uncertainty interval，而不是一個沒有誤差的 decimal；finite-state reference 顯示 overflow mass，而不是隱藏 truncation；cap-18 failure 留在 record；independent seeds 暴露兩個 missed batch interval；test 同時覆蓋 structural invariant 與 analytic special case；public article 把尚未執行的內容與已通過內容並列。

這些選擇沒有令 underlying method 變成新方法，卻讓下一個結果更容易解讀。若未來 estimator 在 tractable regime 與 cap-20 reference 不合，便可分開調查 coordinate choice、sampling variance、interval construction 與 implementation。若 direct SSA 與 reference 在這裡已不吻合，便不應在其上堆疊更複雜 rare-event comparison。

因此最重要的數字可能既不是 $0.26333$，也不是 $0.2575946387$，而是 18——那個失敗但被保留的 cap。Reliability study 的可信度，來自它先保留 control 未通過的位置，再只改一個有理由改變的輸入；state-space cap 增大，但 threshold 不動。

## 如何閱讀四幅圖

四幅圖不是裝飾，而是一條 logical sequence。圖 1 申明 synthetic state model 與 target event；圖 2 顯示 truncation failure 與 fixed-tolerance correction；圖 3 比較兩條獨立結構的 probability route；圖 4 暴露 run-to-run interval variation 並保留 miss。沿這個次序，讀者由問題走到 reference、baseline comparison，再到 uncertainty diagnostic。

每幅圖都不是 experimental biology 意義下的生物迴路圖。Network schematic 代表數學 CTMC。圖中沒有 AMS particle、forward-flux interface、rarity ladder 或 speedup curve，因為第一階段沒有進行這些實驗。Caption 直接說明限制，避免圖像被抽離文章後繼承一個更強但不存在的 claim。

圖的視覺編碼以可讀性為先：相交 interval 與 miss 不只靠顏色區分，亦以空心圓與叉號區分；cap failure 與 pass 使用不同 marker 與文字 label；reference 與 estimate 使用不同形狀。即使讀者以灰階或色覺差異閱讀，仍可辨認主要關係。這些呈現選擇不會增加 scientific evidence。

## 對標題的最短回答

對已申明 synthetic low-copy model、initial state、target 與 horizon，第一階段最精確答案是 FSP bracket：

$$
0.2575946379\le p_T\le0.2575946395.
$$

固定種子 direct simulation 在其抽樣不確定性下與 reference 相容：6000 條 trajectory 有 1580 次 hit，得到 $0.26333$，95% Wilson interval 為 $[0.25234,\,0.27463]$。32 個小 batch interval 有 30 個與 bracket 相交。

這個答案只屬於一個 smoke event。它沒有說真實 genetic switch 多久翻轉，沒有說 enhanced sampler 會快多少，沒有驗證某個 progress coordinate 是否可靠，也沒有描述 final rarity ladder。文獻審查顯示更廣的 computational question 已有大量先例，所以本專案必須用更窄、更嚴格的 reliability test 來證明自身價值。

第一階段最後留下了一種有用的不對稱：numerical reference 很窄，scientific claim 卻刻意很小。這才是正確方向。計算精度只應收窄對已申明模型量的 uncertainty，不應擴大模型被允許代表的世界。

## 五個很容易出現的誤讀

第一個誤讀是把「FSP 界很窄」理解成「整個研究問題都很確定」。FSP 界只控制有限 state space 省略的 probability mass；它不會替 synthetic reaction rate 加上 biological credibility，也不會消除 event definition 的選擇。若把 $B$ 的最低數目由 4 改成別的數字，或把 horizon 由 12 改變，便已經提出另一條 probability question。窄 bracket 對原問題很有價值，但不可搬到新問題使用。

第二個誤讀是把 $0.26333$ 與 FSP midpoint 的差距當作 bias estimate。只有一次 aggregate run，差距同時包含普通 Monte Carlo fluctuation；要估計 bias 或 RMSE，需要固定 estimator、重複獨立 run、明確 reference 與預先指定 summary rule。本文只能說 Wilson interval 與 bracket 相交，不能由一個 point difference 宣稱 direct SSA 有系統性高估或低估。

第三個誤讀是把 30/32 當作已證明長期 95% coverage。這個比例只描述今次 32 個 small batch，而且「相交」的判斷以 reference interval 為對象。真正 coverage benchmark 應事前固定 replicate count 與 interval construction，再在不同 rarity regime 重複；若看到結果後才增加 batch 或改 interval，nominal calibration 的解釋便會受破壞。第一階段 deliberately 只稱它為 diagnostic。

第四個誤讀是把「文獻中已有 speedup」改寫成「本研究已有 speedup」。十篇 primary work 說明原 generic hypothesis 為何不新；那些研究的方法、模型、event 與 cost accounting 各有自己的設定。本地 smoke 沒有運行 AMS 或 FFPilot，也沒有 matched-compute table。引用先行成果是界定研究位置，不是借用別人的結果替本地 calculation 背書。

第五個誤讀是把第一階段檢查通過當作「研究已完成所有階段」。目前結果只覆蓋明確寫出的 Phase 1；未執行的範圍不會因基礎計算一致而自動變成完成。

## 這個 smoke study 如何組織數值比較

這項案例亦可作為數學建模的證據設計示範。第一步不是挑一個複雜算法，而是把 quantity of interest 寫清楚。狀態、起點、target set 與 horizon 一旦固定，SSA 與 FSP 才真正回答同一條問題。若兩種方法各用不同 flip definition，即使數字接近也沒有驗證意義。

第二步是讓不同 error source 分家。SSA 的主要可見不確定性來自有限 Bernoulli sample；FSP 的主要可見 approximation 來自 count truncation。前者以 Wilson interval 表示，後者以 overflow bracket 表示。把兩者分開，便能針對不同失敗採取不同措施：增加 trajectory 改善抽樣精度，增加 cap 收窄 truncation bound。若只列一個總誤差數字，讀者反而無法知道該改哪個控制。

第三步是先定合格線，再看結果。Cap 18 失敗時，最容易的做法是把 $10^{-8}$ tolerance 改寬；但那會使判準依結果移動。這次保留 threshold，增加 cap 至 20，再重新計算。這個順序比成功數字本身更能表達 protocol integrity。失敗不是要從研究故事刪除的雜訊，而是判準確實具有約束力的證據。

第四步是讓每幅圖回答一條明確問題。Network 圖回答「模擬的是甚麼」；truncation 圖回答「reference 為何可用」；FSP–SSA comparison 回答「兩條 route 是否在 uncertainty 下相容」；batch calibration 圖回答「不同 seed 會有多少變化」。Caption 同時寫 limitation，避免視覺效果把結論推得過遠。

第五步是把 stop point 寫入結論。第一階段通過不代表應立即宣佈最終研究成功，而是表示基礎足以讓下一個 protocol decision 有意義。下一階段若開始，仍須預先固定 rarity ladder、coordinate 與 cost rule；若這些條件未完成，結論就只能停在第一階段，讓未測試問題與已完成結果保持分開。

## 為何 endpoint 名稱必須精確

固定時域 hitting probability、stationary switching rate 與 mean first-passage time 常在討論中都被簡稱為「切換有多快」，但三者的估計與驗證要求不同。本文 quantity 是 $p_T$：在指定起點下，時間 $T$ 前是否至少命中一次 target。它天然是 Bernoulli outcome，適合用 binomial uncertainty 描述。

MFPT 則研究 $\mathbb E[\tau_{\mathcal B}]$。若 trajectory 到 observation window 結束仍未命中，便產生 censoring；只平均已命中 path 會改變 estimand。Stationary rate 又需要對 basin occupancy、穩態或近穩態假設及長時間 transition counting 作額外處理。因此後續 benchmark 即使計算多種 endpoint，也必須各自保存 definition 與 reference，不能以一個 $p_T$ bracket 代替全部。

這項精確命名亦關乎 literature comparison。某篇 paper 的 fixed-horizon threshold event、另一篇的 spontaneous flip rate，以及第三篇的 MFPT，可能都使用 rare-event method，卻不是可直接互換的數值 task。先行研究用來界定已有方法與 validity risk；本地計算只與自身申明的 $p_T$ 作一對一核對。

## 參考文獻

1. Allen, R. J., Warren, P. B., & ten Wolde, P. R. (2005). Sampling Rare Switching Events in Biochemical Networks. *Physical Review Letters, 94*, 018104. [https://doi.org/10.1103/PhysRevLett.94.018104](https://doi.org/10.1103/PhysRevLett.94.018104)
2. Allen, R. J., Frenkel, D., & ten Wolde, P. R. (2006). Simulating Rare Events in Equilibrium or Nonequilibrium Stochastic Systems. *The Journal of Chemical Physics, 124*, 024102. [https://doi.org/10.1063/1.2140273](https://doi.org/10.1063/1.2140273)
3. Morelli, M. J., Tanase-Nicola, S., Allen, R. J., & ten Wolde, P. R. (2008). Reaction Coordinates for the Flipping of Genetic Switches. *Biophysical Journal, 94*, 3413–3423. [https://doi.org/10.1529/biophysj.107.116699](https://doi.org/10.1529/biophysj.107.116699)
4. Roh, M. K., Daigle, B. J., Jr., Gillespie, D. T., & Petzold, L. R. (2011). State-Dependent Doubly Weighted Stochastic Simulation Algorithm for Automatic Characterization of Stochastic Biochemical Rare Events. *The Journal of Chemical Physics, 135*, 234108. [https://doi.org/10.1063/1.3668100](https://doi.org/10.1063/1.3668100)
5. Cao, Y., & Liang, J. (2013). Adaptively Biased Sequential Importance Sampling for Rare Events in Reaction Networks with Comparison to Exact Solutions from Finite Buffer dCME Method. *The Journal of Chemical Physics, 139*, 025101. [https://doi.org/10.1063/1.4811286](https://doi.org/10.1063/1.4811286)
6. Rolland, J., & Simonnet, E. (2015). Statistical Behaviour of Adaptive Multilevel Splitting Algorithms in Simple Models. *Journal of Computational Physics, 283*, 541–558. [https://doi.org/10.1016/j.jcp.2014.12.009](https://doi.org/10.1016/j.jcp.2014.12.009)
7. Tse, M. J., Chu, B. K., Roy, M., & Read, E. L. (2015). DNA-Binding Kinetics Determines the Mechanism of Noise-Induced Switching in Gene Networks. *Biophysical Journal, 109*, 1746–1757. [https://doi.org/10.1016/j.bpj.2015.08.035](https://doi.org/10.1016/j.bpj.2015.08.035)
8. Cao, Y., Terebus, A., & Liang, J. (2016). Accurate Chemical Master Equation Solution Using Multi-Finite Buffers. *Multiscale Modeling & Simulation, 14*, 923–963. [https://doi.org/10.1137/15M1034180](https://doi.org/10.1137/15M1034180)
9. Tse, M. J., Chu, B. K., Gallivan, C. P., & Read, E. L. (2018). Rare-Event Sampling of Epigenetic Landscapes and Phenotype Transitions. *PLOS Computational Biology, 14*, e1006336. [https://doi.org/10.1371/journal.pcbi.1006336](https://doi.org/10.1371/journal.pcbi.1006336)
10. Klein, M. C., & Roberts, E. (2020). Automatic Error Control during Forward Flux Sampling of Rare Events in Master Equation Models. *The Journal of Chemical Physics, 152*, 035102. [https://doi.org/10.1063/1.5129461](https://doi.org/10.1063/1.5129461)
