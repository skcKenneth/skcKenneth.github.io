---
title: "隨機壓力測試不是最壞情況證書"
slug: random-stress-tests-are-not-certificates
sourceSlug: random-stress-tests-are-not-certificates
summary: 一個 deterministic interval benchmark 說明 worst-case certificate 必須同時有 feasible lower bound 與 valid set-wise upper bound，而固定抽樣與 local search 只能交出 incumbents。
date: 2026-08-30
lastUpdated: 2026-08-30
featured: false
topics: [全局最優化, 不確定性, 數值證書, CSTR proxy, 可重現研究]
heroImage: /science/random-stress-tests-are-not-certificates/p07_02_certificate_convergence.svg
type: 研究筆記
archived: false
scienceProject: random-stress-tests-are-not-certificates
redirectFrom: []
---

做一萬次 stress test，仍然可能完全沒有碰到真正的最壞點。從三十二個 initial starts 跑 local optimizer，十九次收斂到幾乎相同的高值，也仍然沒有證明盒內其他位置不會更高。這兩類方法都能產生有用的 feasible incumbent，亦即已經實際找到的可行值；但只要沒有一個對未搜尋區域同樣有效的 upper bound，就不應把那個高值稱為 certificate。

實務報告很容易跨過這條語義邊界。Best-of-2048 sample 連續幾個 seeds 都相同至小數後四位，圖形在峰頂附近看來很平，multistart 又大多返回同一點，於是「大概已找到 worst case」慢慢被寫成「worst case 是……」。問題不只是措辭保守與否。對 maximization 而言，每一個已評估的 feasible point 只證明真實 maximum 至少有這麼大，屬於 lower bound。Global certificate 還要證明所有未評估點都不會高於某個 valid upper bound，並公開兩者的 gap。

P07 把問題縮到一個可以逐行核對的規模。Objective 看似 non-isothermal continuous stirred-tank reactor 的 thermal-drift score，但只是合成、無因次、靜態的 algebraic function。它沒有 dynamic mass balance、energy balance、heat capacity、residence time、coolant dynamics、controller、實驗數據、物理單位或 plant operating envelope。本文認證的是一個數學函數在一個指定 box 上的 maximum，不是 reactor runaway boundary，更不是 safety certificate。

凍結運算在這個窄問題上通過。結果為

$$
1.4443773087849885
\leq
\max_{\mathcal U}J
\leq
1.4443777214279065,
$$

所以 certified gap 是

$$
4.1264291805731546\times10^{-7},
$$

低於預先固定的 $10^{-6}$ gate。另一個獨立 200,001-point temperature grid 找到 $1.4443773092028358$，落在 certified interval 內。Dense grid 是交叉檢查，不是證書來源。真正令 upper endpoint 有效的是 interval enclosure。

比較結果刻意保留了不舒服的一面。IID-uniform 與 Latin-hypercube sampling 都使用 budgets 32、128、512、2,048，每個 method-budget cell 有三十二個固定 seeds。按 $10^{-4}$ shortfall rule 計算，八個 cells 全部是 0/32 hits。這只描述指定 designs；它不等於 population miss probability，也沒有 confidence level。Projected-gradient multistart 比 sampling 更接近：19/32 starts 到達 certificate width 內，另外十三次留在很低的 basin。即使十九個好結果與 dense reference 幾乎一致，它們仍然沒有 global upper bound。

## 甚麼得到證明，甚麼只經抽樣

下表把數學上界與只來自已評估 points 的結果分開。

| 問題 | 結果 | 為何重要 |
|---|---:|---|
| 研究背景 | Deterministic global bounds、interval methods、sampling design、scenario theory 與 CSTR uncertainty 已有成熟研究 | 本文是一個聚焦 benchmark，不是新 optimizer 或 reactor theory。 |
| Uncertainty set | $T\in[0.4,2]$、$z\in[-28,-20]$、$H\in[0.5,2]$ | 一個指定 rectangular box，不是量測所得 operating envelope。 |
| Monotonicity | $\partial J/\partial z>0$、$\partial J/\partial H<0$ | 每個 maximizer 都在 $z=-20$、$H=0.5$。 |
| Certificate | $[1.4443773087849885,1.4443777214279065]$ | 此 synthetic maximum 位於 interval 內。 |
| Gap | $4.1264291805731546\times10^{-7}$ | 預先凍結的 $10^{-6}$ gate 通過。 |
| Dense reference | 200,001 points；best value $1.4443773092028358$ | 獨立 numerical check 沒有衝破 upper bound；它本身不提供 proof。 |
| IID/LHS | 八個 cells 各為 0/32 hits | 只限 exact seeds、budgets、box、objective 與 $10^{-4}$ rule。 |
| Local search | 19/32 starts 在 certificate width 內 | 某些 starts 給出強 incumbents；沒有一個 local run 提供 set-wise UB。 |

Dense reference 與 certificate 的職責不同。把 $[0.4,2]$ 切成 200,001 個 temperatures，可以很有效地發現明顯 bug；若任何 grid value 高過 certified UB，enclosure 必定有問題。然而，相鄰 grid points 之間仍是未評估 continuum。除非另有 derivative bound、interval arithmetic 或解析結構，不能因為網格很密便假設中間沒有尖峰。

## 文獻如何改變研究問題

原先構想接近「為 uncertain CSTR safety 發展一個新 worst-case method」。與 primary literature 比較後，這個 headline 並不成立。

McCormick 在 1976 年已為 factorable nonconvex programs 建立 convex underestimators（[DOI](https://doi.org/10.1007/BF01580665)）。Ryoo 與 Sahinidis 發展帶 global bounds 的 branch-and-reduce（[DOI](https://doi.org/10.1007/BF00138689)），Sahinidis 亦記錄 BARON general-purpose deterministic global software（[DOI](https://doi.org/10.1007/BF00138693)）。Adjiman、Dallwig、Floudas 與 Neumaier 的 alphaBB work 奠定 smooth nonconvex NLP 的理論（[DOI](https://doi.org/10.1016/S0098-1354(98)00027-1)）。Deussen 與 Naumann 更直接研究 interval branch-and-bound 中的 monotonicity 及 separability（[DOI](https://doi.org/10.1007/s10898-022-01265-6)）；Moeller 等人在另一應用比較 rigorous interval maximization、stochastic methods 與 local methods（[DOI](https://doi.org/10.1007/s11081-022-09729-0)）。

Sampling design 同樣不是空白。McKay、Beckman 與 Conover 的 1979 paper 系統比較 Latin hypercube 與其他 computer-code input designs（[DOI](https://doi.org/10.1080/00401706.1979.10489755)）。Calafiore 與 Campi（[DOI](https://doi.org/10.1007/S10107-003-0499-Y)）、Campi 與 Garatti（[DOI](https://doi.org/10.1137/07069821X)）確實給出 scenario probability statements，但前提包括明確 random mechanism、convexity 及 support structure。有限 stress-test table 不可以在沒有滿足假設時借用那些 guarantee。

CSTR 研究亦比本文 proxy 豐富很多。Uppal、Ray 與 Poore 已分析 non-isothermal CSTR 的 multiplicity 與 dynamics（[DOI](https://doi.org/10.1016/0009-2509(74)80089-8)）；Vajda 與 Rabitz 討論 CSTR parametric sensitivity（[DOI](https://doi.org/10.1016/0009-2509(93)81066-5)）；Zaldivar 等人提出跨 reactor classes 的 runaway criterion（[DOI](https://doi.org/10.1016/S0950-4230(03)00003-2)）；Grossmann 等人回顧 process systems under uncertainty 的 mathematical programming techniques（[DOI](https://doi.org/10.1016/j.compchemeng.2016.03.002)）。

所以 P07 不聲稱新 global optimizer，不聲稱首次指出 random sampling 缺少 upper bound，也不聲稱新 CSTR safety theory。可辯護貢獻是一個 evidence-controlled demonstration：在同一 frozen objective 上，把 valid certificate、fixed seeded sampling 與 multistart incumbents 並列，逐項說明它們能證明甚麼。

<figure>
  <img src="/science/random-stress-tests-are-not-certificates/p07_01_model_reduction.svg" alt="合成三變量 objective、指定 uncertainty box、兩個 monotonicity signs、精確 corner reduction，以及 certificate 與 incumbent 的定義差別。" />
  <figcaption>兩個 derivative signs 把整個 box 精確縮到一維 temperature problem。這是 certificate 的解析部分，不是從 sample cloud 猜出的趨勢。</figcaption>
</figure>

## Synthetic objective 與物理邊界

函數定義為

$$
J(T,z,H)
=
T_{\mathrm{feed}}-T
+B\,r(T,z)
-H(T-T_{\mathrm{cool}}),
$$

其中

$$
r(T,z)
=
\operatorname{sigmoid}
\left(z+\frac{aT}{1+T}\right).
$$

凍結 constants 是

$$
a=40,\qquad B=3,\qquad
T_{\mathrm{feed}}=0.5,\qquad
T_{\mathrm{cool}}=0.2.
$$

Uncertainty set 為

$$
\mathcal U
=
[0.4,2]\times[-28,-20]\times[0.5,2].
$$

符號 $T,z,H$ 借用 temperature、log-kinetic factor 與 heat-removal strength 的直覺，但沒有物理單位。$J>0$ 不等於 runaway，$J<0$ 亦不等於 safe。它只是一個方便研究 bounded maximization 的 algebraic score。

這個 notation 有一個實際數學好處。Sigmoid reaction term 隨 $z$ 增加，而 removal term 在 $H$ 增加時令 objective 下降。因為整個 temperature interval 都有 $T-T_{\mathrm{cool}}>0$，直接微分得

$$
\frac{\partial J}{\partial z}
=
B\,r(1-r)>0,
$$

以及

$$
\frac{\partial J}{\partial H}
=
-(T-T_{\mathrm{cool}})<0.
$$

Derivative check 記錄 $\partial J/\partial z$ 的 minimum 為 $1.906519333497153\times10^{-7}$，$\partial J/\partial H$ 的 maximum 為 $-0.2$。兩個 signs 在完整 box 都成立，因此任一 global maximizer 必須位於

$$
z^\star=-20,\qquad H^\star=0.5.
$$

三維 problem 精確化成

$$
\max_{T\in[0.4,2]}f(T),
\qquad f(T)=J(T,-20,0.5).
$$

「精確」只指 reduction 對這個 function 與 box 無損失。它沒有把 static proxy 升級成 dynamic CSTR，也沒有把一維 certificate 擴張至其他 uncertainty sets。

## Certificate 必須同時有兩邊

對 maximization，任何已評估 feasible temperature $T_k$ 都給出

$$
L_k=f(T_k)\leq\max_{T\in I}f(T),
$$

所以 best feasible value 是 lower bound，亦即 incumbent。Sampling、local optimization、dense grid 都能產生這一邊。

另一邊要求每個 interval $I$ 有一個 $U(I)$，而且

$$
f(T)\leq U(I)\quad\text{for every }T\in I.
$$

關鍵是 every。Upper formula 必須覆蓋未取樣 points；不能只在一批 random checks 上看來成立。

P07 implementation 對每個 temperature interval 使用兩個各自有效的 enclosure，再取較小者。第一個由 derivative interval 建立 nearest-sample Lipschitz bound；第二個直接包住 monotone components。若 derivative interval 已能判定固定 sign，適當 endpoint 就是該 interval 的 exact maximizer；否則 interval 會被 bisect。計算亦加入 outward binary64 guard，避免 roundoff 把 UB 意外向內收縮。

Global state 保存 active intervals、feasible lower values 與 valid upper values。每輪處理最高 UB 的 interval，於 midpoint 評估 function，建立兩個 child bounds。停止條件只看

$$
\max_{I\ \mathrm{active}}U(I)-L_{\mathrm{global}}
\leq10^{-6}.
$$

「Best value 十輪沒有改變」、「三十二個 starts 一致」、「圖上看不到更高峰」都不在 stopping rule 內。那些現象可以幫助診斷，卻不能代替 UB。

## Gap 如何由 1.615 收窄至 $4.13\times10^{-7}$

初始 temperature interval 很寬，第一個 trace 的 gap 約 $1.61514$；分割一次後是 $1.2$。到四個 processed nodes，gap 降至約 $0.07395$；八個 nodes 時為 $2.78556\times10^{-4}$；十三個 nodes 後有五個 active intervals，gap 收窄至 $4.12643\times10^{-7}$。

Final lower bound 是

$$
L=1.4443773087849885,
$$

其 representative point 為

$$
(T,z,H)=(1.2953125,-20,0.5).
$$

Final upper bound 是

$$
U=1.4443777214279065.
$$

Independent 200,001-point grid 在 $T=1.29532$ 找到

$$
f_{\mathrm{dense}}=1.4443773092028358,
$$

滿足 $L\leq f_{\mathrm{dense}}\leq U$。Dense best 比 branch-and-bound representative incumbent 稍高並不矛盾。Certificate 從未聲稱 $T=1.2953125$ 是 exact optimizer；它只聲明至少一個 feasible point 到達 $L$，而所有可能值不超過 $U$。

<figure>
  <img src="/science/random-stress-tests-are-not-certificates/p07_02_certificate_convergence.svg" alt="Branch-and-bound processed nodes 增加時 certified lower 與 upper bounds 收合，並分開標示 final interval、gap 與 tolerance。" />
  <figcaption>Deterministic run 因 valid UB 減 LB 已低於 $10^{-6}$ 而停止，不是因為 successive incumbents 剛好相同。</figcaption>
</figure>

打印一個長小數作「the optimum」會隱藏仍未消除的 numerical uncertainty。Interval 誠實地顯示算法尚未定位 exact maximizer 至無限精度，但已把所有可能 values 包在指定寬度內。這個 uncertainty 只屬於 frozen function 的 set-wise numerical bound；model-form error、box 外參數、物理量測誤差完全沒有被處理。

## 固定 stress tests 得到甚麼

Sampling comparison 有兩個 designs。IID uniform 在三維 box 獨立抽點；Latin hypercube 在每個 coordinate 分層，再隨機配對。兩者都用 budgets 32、128、512、2,048，每個 method-budget cell 有 32 個 recorded seeds。

每個 replicate 的 best sample 是 feasible incumbent。Hit definition 在 protocol freeze 前固定為

$$
L_{\mathrm{cert}}
-\max_{x\in S}J(x)
\leq10^{-4}.
$$

採用 certified lower bound 作 benchmark，令 rule 可重現，而且不需要假裝知道 exact maximum。但 hit 依然不會生成 upper bound。Hit 只代表這個 finite design 找到一個與已知 feasible benchmark 很接近的 point。

八個 cells 全部是 0/32 hits。Worst point 的 $z,H$ 都在 boundary，temperature 則位於狹窄 interior region。Continuous random design 抽中 exact corner 的 probability 為零；靠近 corner 仍可取得高值，但沿兩個 monotone directions 離開 corner 都會受罰。

<figure>
  <img src="/science/random-stress-tests-are-not-certificates/p07_03_stress_shortfall.svg" alt="固定 IID-uniform 與 Latin-hypercube designs 在四個 budgets 的 shortfall distributions，八個 cells 都顯示 0/32 hits。" />
  <figcaption>圖中的 zero-hit counts 只屬於 exact seeds、budgets、box、objective 與 $10^{-4}$ rule，不能改寫成一般 miss probability。</figcaption>
</figure>

最危險的誤讀是「0/32 證明 sampling 幾乎一定 miss」。本專案沒有估計未知 Bernoulli parameter，沒有形成 binomial confidence interval，沒有定義 future problem distribution，也沒有驗證 scenario-optimization assumptions。Replicates 是固定 computational designs。

合資格公開句子必須保留 qualifiers：

> 對 budgets 32、128、512、2,048，IID-uniform 及 Latin-hypercube 的每個 frozen method-budget cell 都有三十二個 fixed replicates，而沒有一個達到 $10^{-4}$ shortfall rule。

Latin hypercube 在許多 integration 與 design tasks 可以改善 marginal coverage。P07 不是對 LHS 的普遍判決。Coordinate stratification 不保證填中指定 joint corner。換 objective、dimension、scrambling、adaptive strategy 或 boundary-aware design，結果都可能不同。

## Local search 很接近，仍然只是 incumbent

Projected-gradient multistart 使用 32 個 fixed seeded starts，所有 iterates 都投影回 box。某些 runs 找到 $z=-20,H=0.5$ corner，並接近 interior temperature maximum；另一些 runs 停在很差的 boundary 或 basin。

十九個 starts 的 final values 在 certificate width 內，十三個則遠低於它。一個差結果停在 $T=0.4$ 且 value 為負；另一個只稍高於零。一個成功 run 找到約

$$
(T,z,H)=(1.2953213,-20,0.5),
$$

value 為 $1.4443773092118821$，甚至略高過 branch-and-bound representative incumbent。

這是高質素 local solution，卻仍是 lower bound。Local algorithm 沒有排除其他 basin。它與 dense reference 的 agreement 增加 implementation confidence，但 agreement 不等於 set-wise UB。

<figure>
  <img src="/science/random-stress-tests-are-not-certificates/p07_04_local_not_certificate.svg" alt="三十二個 multistart local-search incumbents 距 certified upper bound 的差距，十九個好 starts 與十三個較差 basins 清楚分開。" />
  <figcaption>十九個 starts 到達 certificate width 內，十三個留在很低位置；沒有一個 local result 提供 global upper bound。</figcaption>
</figure>

命名會改變讀者如何理解結果。Local output 是某個 feasible point 的 value，以及它與已知 lower benchmark 的 shortfall；把它叫作 `certified optimum` 會改變數學意義。Plot 因此把 global UB 與 local values 分開。這可防止一個常見錯誤：高 feasible value 在反覆轉述後，逐漸被改名為 worst case，卻從未對其餘集合建立上界。

## 一維 worst-corner slice 應放在 proof 之後

Final diagnostic 畫出 proved corner 上的 $f(T)$，再與離開 corner 的 slices 比較。Worst-corner curve 在 $T\approx1.2953$ 有 interior peak。減少 $z$ 會降低 sigmoid contribution；增加 $H$ 會加強 removal，因為整個 box 都有 $T>0.2$。Derivative signs 在畫圖前已解釋 curves ordering。

<figure>
  <img src="/science/random-stress-tests-are-not-certificates/p07_05_worstcase_slice.svg" alt="已證 worst corner 的一維 temperature objective slice 與較低對照 slices，圖中標出 certified interval 及 representative temperature。" />
  <figcaption>圖像只傳達已由 derivative signs 證明的 reduction，不用 pixels 推斷 monotonicity，也不用 curve sampling 認證中間 points。</figcaption>
</figure>

Evidence ordering 很重要。先在 full domain 證 coordinate signs，再縮減 set，再為 remaining interval 建 valid bounds，最後用 plot 解釋。若先看圖再聲稱 monotonicity，視覺印象就承擔了超過它能力的 proof burden。

Independent dense grid 也應在 certificate definition 之後使用。它是 adversarial check：若 dense value 超過 UB，implementation 立即失敗。現在它落在 interval 內，表示這項明顯矛盾不存在；但 grid 本身仍不能排除 inter-grid spike。

## 如何核對 certificate

數值判定有四項：monotonicity signs 在 declared box 成立；certificate gap 不大於 $10^{-6}$；independent dense reference 位於 interval；certificate 只有在前三項全部通過時才接受。四項均 pass。

Sampling 或 local search 不需要「成功」才能令 certificate 成立。反過來，即使 sample 全部 hit，一個 invalid UB 仍然令認證失效。Comparator outcome 不會改變 certificate 的定義。

獨立核對涵蓋 derivative signs、interval enclosures、outward guards、branch containment、Latin-hypercube strata 與 local projection。一次完全不改設定的重複計算得到相同 certificate interval、gap 及 comparator results。這些核對支持 implementation，卻不會擴大 certificate 的覆蓋範圍。

五張圖亦不是五個互不相干的裝飾。第一張先把三個 comparator 的 terminal shortfall 放在同一尺度，回答「哪些方法只交出 incumbent」；第二張把每次 branch 後的 lower、upper endpoints 與 gap 分開畫，回答「certificate 如何收窄」；第三張保留全部 replicate distributions，避免只展示最幸運的 seed；第四張把 local-start output 與 certified upper bound 的距離並列，讓十九個 near starts 和十三個 low-basin starts 同時可見；第五張才顯示 reduced temperature slice、certified point 與 reference。若只刊第五張，平滑曲線很容易令人以為 dense plotting 已證明 maximum。按這個次序閱讀，圖表會把 search evidence、bound evidence 和 geometry evidence分開。

最重要的是，五張圖傳達三種不同的科學證據。Samples 只給出已評估點的 incumbents，local trajectory 只顯示 search behavior，dense grid 只提供有限交叉檢查；只有與函數 enclosure 對應的上下界序列才支撐 certificate。很多 samples 聚在峰頂附近、local trajectory 看似收斂，或 dense grid 非常細，都不會把有限觀察提升為 global upper bound。

Dense grid 提供另一項獨立檢查。若 200,001 個 values 中任何一個超過 reported upper endpoint，certificate implementation 便立即失敗；目前 grid best 落在 interval 內。這份 agreement 不會把 grid 變成 proof，但排除了一個清楚矛盾。

重複 calculation 亦不會擴大 claim。它只說明 interval 與 comparison 不是相同 inputs 下的單次偶然。任何新 box、objective、branch rule、seeds、budgets 或 hit tolerance 都會提出新問題，需要新的結果。

## 四個容易被誤解的詞

第一個是「CSTR」。讀者可能自然聯想到物理 reactor，但這個 objective 沒有時間動力、mass/energy balance、heat capacity、coolant response、feed disturbance 或 controller。Maximum 不能轉成 runaway temperature、safe limit、alarm threshold 或 emergency action。

第二個是「uncertainty」。這裡的 box 是 deterministic set。IID/LHS 只是 comparator designs，不是 plant-parameter distribution。Certificate 沒有為 $(T,z,H)$ 附加 probability measure。

第三個是「global」。Global 只表示這個 function 在這個 box 上，經過 proved corner reduction 後的所有 points。它不表示所有 reactors、所有 kinetics 或所有 uncertainty sources。

第四個是「certificate」。本文提供 mathematically valid numerical bound、tests 與 outward guard；不是 theorem-prover formal proof、regulatory assurance case 或 safety integrity level。

Zero-hit table 亦不容許寫成「random stress tests 通常失敗」、「LHS 不可靠」或「miss probability 接近一」。它只支持二種 methods、四個 budgets、每 cell 三十二個 fixed replicates 的 exact statement。

Local search 也一樣。十九個 near-certificate starts 不證明 multistart 一般成功；十三個 poor starts 不證明 gradient methods 一般失敗。唯一可一般化的概念是定義本身：沒有 valid set-wise upper bound 的 feasible local incumbent，不是 global certificate。

## 每一次分枝到底保存了甚麼

要判斷一個程式是否真的在做認證，最有用的方法不是先看最後顯示多少位小數，而是逐輪寫出不變量。P07 的 active queue 包含尚未被排除的溫度區間。對每個區間 $I$，演算法計算一個 $U(I)$，並要求區間內每一個 $T$ 都滿足 $J(T,-20,0.5)\leq U(I)$。目前已實際評估的可行點給出 $L$。只要 queue 未空，真正 maximum 便必須落在

$$
L\leq J^*\leq \max_{I\in\mathcal Q}U(I).
$$

這條關係比「現時最好點沒有再改善」強得多。最好點停滯，只反映 search history；上式則對尚未逐點搜尋的整個集合仍然有效。每次把一個 interval 分成兩半，都要為兩個 children 重新建立 enclosure。若某個 child 的 upper bound 已低於 $L$，它可以安全移除，因為它不可能改善 incumbent。若不能證明這件事，就必須把它留在 queue，不能因為其中心點看來差而刪除。

實作上的細節同樣屬於證據。浮點運算若把理論 upper bound 向下捨入，可能在最後幾位把有效區間錯誤收窄。P07 沒有宣稱已建立一套通用 directed-rounding library，而是在這個固定、低維的函數上使用保守 guard，並以 dense grid 和數學測試作獨立交叉檢查。Dense grid 不會令 bound 變得有效；它的角色是偵測顯然錯誤的 enclosure，例如 reference value 落在 reported interval 之外。真正的邏輯次序仍是先證明 enclosure 對整段成立，再用外部計算測試實作是否符合該邏輯。

停止條件也必須作用於全域 gap，而不是最後切開的單一 interval。若目前 queue 中仍有另一段的 $U(I)$ 很高，即使最新 child 已非常窄，整個問題仍未認證。P07 的 $4.1264291805731546\times10^{-7}$ 是 incumbent 與所有 active intervals 的最大 upper bound 之差；因此低於 $10^{-6}$ 才完成認證。把平均 interval width、best-node width 或 optimizer step size 當作 certificate gap，會改變聲稱的數學意義。

這套上下界更新方式亦解釋為何「十三個 nodes」不能單獨成為效率結論。節點數取決於 analytic reduction、initial box、bound formula、branch rule 與 tolerance。另一個 objective 或較鬆的 enclosure 可能需要遠多於十三個節點。本文只報告固定設計下的實際節點數，沒有外推 complexity rate，也沒有把這個小型 benchmark 寫成大型 global solver 的性能證明。

## 零命中表格應如何閱讀

每個 0/32 cell 都是一個完整但很窄的觀察：指定方法、指定 budget、指定三十二個 seeds，在指定 $10^{-4}$ shortfall 定義下，沒有一次 hit。它回答的是固定設計下的比較問題，而不是一個未知抽樣分布的普遍機率。若把三十二次看成獨立 Bernoulli trials，再計算 confidence interval，還需要先定義 sampling mechanism、target event 和 inference model；P07 沒有預先註冊這項推論，也沒有把 seeds 當成從某個母體隨機抽取的統計樣本。因此本文只展示 counts、shortfalls 和 exact design。

Budget 由 32 增加至 2,048，best value 可以逐步靠近峰值，但「靠近」與「命中」由不同門檻決定。最好的 sample 是可行點，所以它永遠提供一個可靠 lower bound；其 shortfall 卻要與 certified lower endpoint 或 reference carefully 比較。若事後看完數據才把 hit tolerance 放寬，便會把 exploratory choice 混入 confirmatory result。P07 固定 $10^{-4}$ 後才評估，故即使某些點視覺上貼近曲線頂部，仍按同一規則記為 miss。

Latin hypercube 的 stratification 改善各 coordinate 的 marginal coverage，卻不保證三維組合一定落在狹窄的高值區，更不提供未抽到區域的函數上界。反過來說，這個 benchmark 對它也不完全公平：解析導數已揭示 $z=-20$、$H=0.5$ 的 worst corner，而 generic LHS 仍在整個 box 分配 points。這個對比展示利用結構的重要性，不足以宣布 LHS 低效。若比較目標是演算法效率，下一個 protocol 應讓所有方法獲得相同的 derivative 或 monotonicity information，並分開計算 objective calls、derivative calls 和 bound operations。

「全部零命中」亦不能轉成危險發生率或漏檢率。$J$ 不是事故指標，box 不是 plant exposure distribution，hit rule 也不是 safety threshold。即使以真正 reactor model 取代 proxy，若沒有參數機率、觀測誤差、時間依賴與 validation data，stress-test frequencies 仍只描述 computational design。這是為何圖注和正文反覆寫明 fixed seeds/budgets，而沒有寫百分比風險。

同一 seed 在不同 random-number library 或 draw ordering 下可以生成另一批 points，所以「跑了 2,048 點」本身不足以定義一個 sampling design。本文的 0/32 只對指定 mapping、transformation、budgets 與 tie handling 成立。這項限制不妨礙比較，但它禁止把一次設計的結果冒充抽樣方法的一般性質。

## 機率聲稱需要另一種實驗

把每個 0/32 cell 改寫成 miss probability，需要先補上本文沒有的統計對象。研究者必須界定未來重複是同一 objective 下重新抽 points，還是從某個 problem population 抽出新的 objectives；兩者的母體、獨立性與 target event 完全不同。Hit rule 也要在看到 shortfalls 前選定，否則 confidence interval 只是替事後門檻加上統計外觀。

若研究問題只關心固定 objective 下 IID sampler 的 hit rate，可另行設計大量獨立 draws，申明 random-number transformation，並為估計誤差設定區間。這仍然只會得到 design-conditional probability，不會為未抽到 points 建立函數上界。若研究問題希望跨 objectives 比較 algorithms，則要先定義 problem generator、dimension、geometry、smoothness 及 boundary structure 的分布，再把每個 problem 視為一個抽樣單位。P07 沒有做這兩種推論中的任何一種。

Budget 增加時，best feasible value 通常會改善，但 hit rate 與 certificate 是兩個不同問題。即使 2,048-point sampling 在另一輪取得 32/32 hits，它仍只證明每次找到接近 benchmark 的 lower bound；除非同時對未搜尋集合建立 valid enclosure，否則不會變成 global certificate。相反，一個有效 interval algorithm 可以在 sampling table 全部零命中時照樣認證，因為它的 upper bound 不依賴 comparator 是否幸運。

這也說明公平比較要把 information access 寫清楚。本次 deterministic route 使用 exact derivative signs，把 $z,H$ 直接固定到 corner；generic IID 與 LHS 並不知道這個結構。如果 boundary-aware sampler 同樣得到 derivative information，它會把資源集中在剩餘 temperature interval，很可能找到更好的 incumbent。它仍需另一個 enclosure 才能認證。下一個比較應分開報告 function evaluations、derivative evaluations、bound operations 與最終 gap，不能只用 wall-clock 或 best value 排名。

## 審閱一個 worst-case 聲稱的七個問題

第一，問題集合是否完整公開？至少要有每個變數的 bounds、單位或 dimensionless 定義、coupling constraints，以及 objective 在邊界上的定義。若報告只給一個 optimum point，讀者無法知道「global」是相對哪個集合。P07 的結果只對文中三維 closed box 成立，任何擴大或平移都會成為新問題。

第二，objective 是否與聲稱對象一致？一個方便優化的 surrogate score 不會自動等於 physical temperature、yield loss 或 failure probability。P07 的名稱借用 CSTR 語境來建立可辨識的形狀，但結論只屬於合成 algebraic proxy。這條邊界應出現在摘要、圖注與結論，而不只是藏在 limitations。

第三，reported value 是 feasible evaluation、relaxation bound，還是兩者都有？對 maximization，feasible evaluation 是 lower bound；對 minimization，方向相反。很多報告只寫一個「best objective」便跳到 worst case。審閱時應要求 lower endpoint、upper endpoint、gap 和各自來源。若 upper endpoint 來自 sampling maximum，它仍然只是 lower bound，不會因 sample 很多而改變方向。

第四，解析 reduction 的適用條件有沒有在整個集合成立？P07 不是在幾個 grid points 看見偏導同號，而是對 box 上所有 admissible states 建立 sign argument，才把 $z,H$ 固定到 corner。若 derivative 在 box 內變號，corner reduction 便失效，必須保留相應 dimensions 或用另一個有效 bound。局部單調跡象不能偷換成全域證明。

第五，停止 tolerance 是否事前固定，而且與數值尺度相稱？看到結果後把 $10^{-6}$ 改成 $10^{-5}$，可能把不通過變成通過，卻破壞 confirmatory interpretation。另一方面，極小 tolerance 也不代表物理準確；它只控制 numerical enclosure。P07 的 tolerance、branch rule、guard 與 node accounting 都在結果前固定。

第六，有沒有獨立的實作檢查？Property tests 應覆蓋 enclosure domination、children coverage、monotonicity signs、feasibility 與 deterministic ordering。Dense reference 可以補充，但不能代替 validity property；它最有力的作用，是在任何 evaluated value 超過 reported UB 時立即否定 implementation。

第七，negative 或 null comparator result 有沒有原樣保存？在這裏，sampling 八個 cells 的 0/32 和 local search 的 19/32 near hits 都有價值，因為它們展示 incumbent 與 certificate 的分界。若只挑選最接近 maximum 的 seed，會隱藏 basin sensitivity；若只展示 poor starts，又會誇大 heuristic weakness。完整 fixed-design table 才讓比較維持可核查。

這七問不會把任何 optimizer 自動變成認證工具，但可以快速識別聲稱是否缺少 set-wise bound、是否把 probability 偷帶入 deterministic result，或是否把 synthetic proxy 誤寫成實體安全結論。對 P07 而言，答案都被限制在 Phase 1 小問題內；它是一個語義和證據結構示範，不是工業 certification workflow。

## 若單調性不再成立，證書要怎樣改

P07 之所以能用十三個 processed nodes 收窄 gap，關鍵不是 branch-and-bound 本身突然變得容易，而是兩條 derivative signs 在整個 box 成立。若 $\partial J/\partial z$ 或 $\partial J/\partial H$ 在區域內改變符號，便不能再把相應 coordinate 固定在 boundary。只在 dense grid 上看見大部分 signs 相同也不夠，因為一小段未察覺的 sign change 已可令 corner reduction 漏掉更高值。

最保守的做法是把變號 coordinate 留在 branch state，為每個多維 box 建 valid upper enclosure。若 derivative interval 在某個 child box 重新取得固定符號，才可在該 child 局部消去一個方向。這種 local monotonicity 會產生不規則的 search tree：有些 regions 很快降維，有些仍需在三維細分。Certificate gap 依然是所有 active boxes 的最大 upper bound 與 global incumbent 之差，不能只看已降維的容易 regions。

另一條路是建立 convex relaxation 或 McCormick envelopes，令每個 box 的 nonlinear terms 有可證明上下界。Bounds 可能較鬆，nodes 因而增加；但只要 enclosure valid，速度慢仍然比一個錯誤地向內收縮的「緊 bound」可靠。比較 interval 與 relaxation methods 時，應使用相同 uncertainty set、tolerance 及 arithmetic policy，並分開報 bound evaluations 與 feasible evaluations，否則 best value 接近只反映 search，不能說明認證效率。

若 dimension 增加，sampling 的 incumbent 可能改善得更慢，而 deterministic bounds 也可能受 curse of dimensionality 影響。這並不改變定義：兩者是否 certificate 仍由 set-wise upper bound 決定，不由 wall-clock 排名決定。下一個 benchmark 應故意加入 derivative sign changes、coupling constraints 與 narrow interior peak，同時保留 known reference 或獨立 enclosure，才可觀察 clean one-dimensional logic 在何處開始承受壓力。

Physical CSTR 問題還要再多一層。動態 mass 與 energy balances 會把 decision variables 變成 trajectories，runaway criterion 亦可能取決於 event time、stability 或 constraint violation，而非一個 static score。此時先要定義被認證的 quantity，再選擇能包住 integration error、parameter box 與 model equations 的方法。把 P07 的 algebraic UB 原封不動套到動態安全聲稱，會跨越目前完全沒有處理的 model-form 與 discretization uncertainty。

## 下一步應測試甚麼

現有 example 因 monotonicity 消去兩個 coordinates，故意保持容易核查。下一階段若只是再次使用相同 reduction，不應包裝成 algorithm novelty。更有內容的 protocol 可以：

- 選擇 derivatives 在 box 內改 sign 的 synthetic objective；
- 在同一 tolerance 比較 interval、convex-relaxation 與其他 deterministic bounds；
- 增加 dimensions，但仍要求 provably valid UB；
- 預先宣告 adaptive 或 boundary-aware sampling，而不只 IID/LHS；
- 分開 function-evaluation budget 與 certification-node budget；
- 建立有 known maximum 的 adversarial narrow peaks；
- 用獨立 implementation cross-check upper enclosure；
- 明確研究 directed rounding 或 interval-arithmetic library；
- 若目標真是 physical reactor，從 dynamic equations、units、data provenance、calibration、validation 及 safety-domain review 重新開始。

這些都是新 research questions，現有 P07 沒有運行。

公平比較亦要注意 information asymmetry。Deterministic method 使用 exact derivatives 與 monotonicity；IID/LHS 刻意 generic。這個不對稱正好說明 structure 的價值，但不能變成 universal efficiency ranking。若 boundary-aware sampler 同樣使用 derivative signs，它可以直接把 $z,H$ 固定在 corner，很快找到更好 incumbent；除非它同時包住 remaining temperature interval，否則仍沒有 certificate。

## 結論

Worst-case report 應明確列出 gap 的兩端。

已評估 feasible point 對 maximization 提供 lower bound。覆蓋所有 unresolved points 的 valid enclosure 提供 upper bound。兩者相減才是 certificate gap。若只有第一項，無論 sample 數、starts 數或 repeated decimals 有多漂亮，都應寫 incumbent。

P07 對一個 reduced synthetic objective 把 gap 關到 $4.1264291805731546\times10^{-7}$。結論有清楚邊界：一個 box、一個 function、一個 tolerance、一個 analytic corner reduction、一個 deterministic interval routine。Fixed random 與 Latin-hypercube designs 剛好全部零 hits，local search 則經常非常接近。這些 comparator outcomes 令差別容易看見，但沒有生成 probability claim 或 physical safety evidence。

最後一句應與計算同樣窄：

> 對指定 synthetic dimensionless objective 及 bounded set，deterministic interval run 以低於 $10^{-6}$ 的 gap 包住 global maximum；固定 seeded sampling 與 multistart outputs 是沒有 set-wise upper bounds 的 feasible incumbents。

## 參考文獻

1. Garth P. McCormick，〈Computability of Global Solutions to Factorable Nonconvex Programs: Part I, Convex Underestimating Problems〉，*Mathematical Programming* 10（1976），[DOI 10.1007/BF01580665](https://doi.org/10.1007/BF01580665)。
2. Ho-Sung Ryoo 與 Nikolaos V. Sahinidis，〈A Branch-and-Reduce Approach to Global Optimization〉，*Journal of Global Optimization* 8（1996），[DOI 10.1007/BF00138689](https://doi.org/10.1007/BF00138689)。
3. Nikolaos V. Sahinidis，〈BARON: A General Purpose Global Optimization Software Package〉，*Journal of Global Optimization* 8（1996），[DOI 10.1007/BF00138693](https://doi.org/10.1007/BF00138693)。
4. Claire S. Adjiman、Stefan Dallwig、Christodoulos A. Floudas 與 Arnold Neumaier，〈A Global Optimization Method, alphaBB, for General Twice-Differentiable Constrained NLPs, I. Theoretical Advances〉，*Computers & Chemical Engineering* 22（1998），[DOI 10.1016/S0098-1354(98)00027-1](https://doi.org/10.1016/S0098-1354(98)00027-1)。
5. Jens Deussen 與 Uwe Naumann，〈Subdomain Separability in Global Optimization〉，*Journal of Global Optimization* 86（2023），[DOI 10.1007/s10898-022-01265-6](https://doi.org/10.1007/s10898-022-01265-6)。
6. Michael Moeller 等人，〈A Rigorous Deterministic Global Optimization Approach for the Derivation of Secondary Information in Digital Maps〉，*Optimization and Engineering*（2023），[DOI 10.1007/s11081-022-09729-0](https://doi.org/10.1007/s11081-022-09729-0)。
7. Michael D. McKay、Richard J. Beckman 與 William J. Conover，〈A Comparison of Three Methods for Selecting Values of Input Variables in the Analysis of Output from a Computer Code〉，*Technometrics* 21（1979），[DOI 10.1080/00401706.1979.10489755](https://doi.org/10.1080/00401706.1979.10489755)。
8. Giuseppe C. Calafiore 與 Marco C. Campi，〈Uncertain Convex Programs: Randomized Solutions and Confidence Levels〉，*Mathematical Programming* 102（2005），[DOI 10.1007/S10107-003-0499-Y](https://doi.org/10.1007/S10107-003-0499-Y)。
9. Marco C. Campi 與 Simone Garatti，〈The Exact Feasibility of Randomized Solutions of Uncertain Convex Programs〉，*SIAM Journal on Optimization* 19（2008），[DOI 10.1137/07069821X](https://doi.org/10.1137/07069821X)。
10. A. Uppal、W. Harmon Ray 與 Aubrey B. Poore，〈On the Dynamic Behavior of Continuous Stirred Tank Reactors〉，*Chemical Engineering Science* 29（1974），[DOI 10.1016/0009-2509(74)80089-8](https://doi.org/10.1016/0009-2509(74)80089-8)。
11. Sandor Vajda 與 Herschel Rabitz，〈Generalized Parametric Sensitivity: Application to a CSTR〉，*Chemical Engineering Science* 48（1993），[DOI 10.1016/0009-2509(93)81066-5](https://doi.org/10.1016/0009-2509(93)81066-5)。
12. Jose M. Zaldivar 等人，〈A General Criterion to Define Runaway Limits in Chemical Reactors〉，*Journal of Loss Prevention in the Process Industries*（2003），[DOI 10.1016/S0950-4230(03)00003-2](https://doi.org/10.1016/S0950-4230(03)00003-2)。
13. Ignacio E. Grossmann、Robert M. Apap、Bruno A. Calfa、Pablo Garcia-Herreros 與 Qi Zhang，〈Recent Advances in Mathematical Programming Techniques for the Optimization of Process Systems under Uncertainty〉，*Computers & Chemical Engineering* 91（2016），[DOI 10.1016/j.compchemeng.2016.03.002](https://doi.org/10.1016/j.compchemeng.2016.03.002)。
