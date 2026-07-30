---
title: "當發表數量開始選擇研究方法"
slug: when-publication-count-selects-the-method
sourceSlug: when-publication-count-selects-the-method
summary: 一個文化演化模型顯示，發表偏差與可見產出如何選擇低投入方法，以及具後果的重複驗證抽查何時會改變這股選擇壓力。
date: 2026-07-30
lastUpdated: 2026-07-30
featured: true
topics: [後設科學, agent-based modelling, 發表偏差, 重複驗證, 制度誘因]
heroImage: /science/publish-or-perish-method-selection/effort-evolution.svg
type: Research Notes
archived: false
readingMinutes: 20
scienceProject: publish-or-perish-method-selection
redirectFrom: []
---

制度通常聲稱重視可靠知識，實際獎勵的卻往往是最容易迅速計算的產出。論文數量很容易看見；方法是否仔細、量測是否可靠、分析是否經得起重複驗證，則較難即時觀察。當實驗室會模仿與職涯成功相關的做法，這個量度落差便可能改變哪些方法最終被保留下來。

本文以 agent-based model 檢視這個機制。它**不是**指科學家會有意追求錯誤發現，模型數值亦不是任何學科的實證估計。模型中所有實驗室均誠實依照公開規則行事；問題是結構性的：

> 如果成功方法會被文化繼承，以發表為中心的獎勵制度究竟選擇甚麼？

研究比較只按論文數量選擇的制度，以及會抽查正面結果、並令重複驗證失敗影響未來成功機會的制度。

## 一個可繼承特徵：方法投入

實驗室 \(i\) 具有方法投入

$$
e_i\in[0,1].
$$

較高投入會提升檢定力並降低偽陽性機率：

$$
\operatorname{power}(e)=0.20+0.75e,
$$

$$
\alpha(e)=0.01+0.35(1-e).
$$

仔細研究亦需要時間，因此預期研究產量為

$$
\lambda(e)=\lambda_0 e^{-ce},
$$

預設成本 \(c=1.6\)。新假說為真的基準率是 \(\pi=0.10\)。錯誤發現比例同時取決於測試表現與假說池組成：

$$
\operatorname{FDR}
=
\frac{(1-\pi)\alpha}
{\pi\,\operatorname{power}+(1-\pi)\alpha}.
$$

當大部分新假說為假，即使偽陽性率只屬中等，已發表正面結果仍可能主要由錯誤發現構成。

每一文化世代有 200 個實驗室。較成功者有較大機會成為下一代的「父代」；新實驗室繼承其投入程度，再加入高斯突變並截斷至允許範圍。「繼承」代表訓練、聲望導向模仿、聘任與制度複製，並非生物繁殖。

## 發表與抽查規則

模型中正面結果一定可發表；負面結果以 \(1-\rho\) 的機率發表，預設發表偏差為 \(\rho=0.80\)。

沒有抽查時，實驗室分數主要由論文數量決定。加入抽查後，

$$
F_i=N_{\mathrm{pub},i}
-P\,N_{\mathrm{failed\ replication},i},
$$

正面主張以機率 \(a\) 被抽查，\(P\) 是重複驗證失敗的後果。真主張在模型中以 \(0.85\) 機率重現，假主張則以 \(0.05\) 機率重現。

制度因而形成幾股競爭力量：

- 低投入帶來更多研究與更多發表機會；
- 高投入提升 power 並減少偽陽性；
- 抽查令不可靠正面主張有機會暴露；
- 只有當失敗具有後果，暴露才會改變文化選擇。

模型刻意保持透明，因為 agent-based 結果若隱藏更新次序、選擇、突變與發表規則，便很難判斷結果究竟由哪個機制造成。

## 制度可改變選擇方向

預設實驗運行 180 代，每個制度有 14 個隨機族群：

1. 論文數量制度：沒有抽查，亦沒有失敗後果；
2. 中度抽查：\(a=0.30\)、\(P=8\)；
3. 強重複驗證政策：\(a=0.55\)、\(P=12\)。

<figure class="article-figure">
  <img src="/science/publish-or-perish-method-selection/effort-evolution.svg" alt="三種制度下，方法投入在 180 代內的平均演化軌跡與重複模擬區間。" width="960" height="580" loading="eager" decoding="async" />
  <figcaption><strong>圖 1。</strong> 陰影總結重複族群。只按發表量選擇時，最終平均投入為 \(0.0493\)；預設強政策下則為 \(0.8584\)。</figcaption>
</figure>

這個結果不需要欺詐。當制度獎勵產出而脆弱主張沒有未來成本，低投入自然具有數量優勢；一旦重複失敗會改變文化上的繁衍成功，選擇梯度便可反轉。

這是一個有條件的機制結論：**在指定函數與制度規則下**，方法朝相反方向演化。它不能證明現實實驗室的投入是 \(0.05\) 或 \(0.86\)。

## 論文數量與可靠資訊是兩個目標

模型記錄論文數、正面結果中的錯誤發現比例，以及正面主張的預期重現機率。

<figure class="article-figure">
  <img src="/science/publish-or-perish-method-selection/reliability-outcomes.svg" alt="三種模擬制度的論文產出、錯誤發現比例與預期重現結果。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 2。</strong> 論文數量制度最終 FDR 約為 \(0.9302\)，強政策約為 \(0.4187\)。在此模型中，較高可靠性亦伴隨較低研究產量。</figcaption>
</figure>

強政策的 FDR 仍然不低，因為只有一成假說為真；改良方法不能憑空把研究議程變成高基準率問題。

產出取捨亦令政策結論不能過度簡化。由於 \(\lambda(e)\) 隨投入下降，高投入實驗室會進行較少研究。模擬可顯示可靠性與論文 throughput 之間的 Pareto 問題，卻不能替社會決定兩者應如何加權。

真正需要比較的不是「哪項政策產生最多論文」，而是論文服務哪一種資訊目標、抽查成本多大、錯誤分佈如何。

## 兩個政策槓桿

抽查包含兩個可分離成分：主張被檢查的機率，以及失敗後果。實驗掃描

$$
a\in\{0,0.10,0.20,0.30,0.40,0.55\}
$$

與

$$
P\in\{0,2,4,8,12,16\},
$$

每格使用五個重複族群。

<figure class="article-figure">
  <img src="/science/publish-or-perish-method-selection/policy-effort-heatmap.svg" alt="最終方法投入隨抽查機率與重複驗證失敗後果改變的熱圖。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 3。</strong> 經常抽查但沒有後果，或後果嚴重但幾乎不抽查，都很弱；兩個槓桿必須互相作用。</figcaption>
</figure>

最強測試格 \(a=0.55\)、\(P=16\) 的最終平均投入約為 \(0.891\)。表面呈門檻狀，因為政策產生的選擇優勢必須超過低投入的產量優勢。在邊界附近，小幅政策變化已可能把族群推向另一個長期區域。

<figure class="article-figure">
  <img src="/science/publish-or-perish-method-selection/policy-fdr-heatmap.svg" alt="同一抽查機率與失敗後果網格上的最終錯誤發現比例熱圖。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 4。</strong> 當政策真正改變所選擇的投入，可靠性才同步改善；最強測試格的 FDR 約為 \(0.374\)，並非零。</figcaption>
</figure>

現實抽查還有資源成本、申訴與管治問題，亦可能被策略性規避，這些都沒有進入分數。實際政策研究必須加入抽查準確度、行政成本、學科差異、策略適應與錯誤指控的後果。

## 發表偏差改變競爭環境

偏差實驗改變負面結果不被發表的機率：

$$
\rho\in\{0,0.2,0.4,0.6,0.8,0.95\}.
$$

<figure class="article-figure">
  <img src="/science/publish-or-perish-method-selection/publication-bias-sweep.svg" alt="在不同發表偏差下，比較論文數量制度與強重複驗證政策所選擇的最終方法投入。" width="960" height="580" loading="lazy" decoding="async" />
  <figcaption><strong>圖 5。</strong> 當正面產出是主要可見獎勵，壓低負面結果會加強低投入選擇；具後果的重複驗證可降低敏感度，但不能解決發表偏差。</figcaption>
</figure>

發表偏差與弱方法會互相放大。若正面發現較易被看見，能產生更多正面結果的方法便獲得更多文化曝光。抽查改變脆弱正面主張的 payoff，卻不會令負面結果自動可見，也不會修正研究內部的選擇性報告或被扭曲的研究議程。

Registered reports、獎勵有資訊價值的負面結果、數據與程式審查、發表後驗證，以及隨機抽查，其實作用於系統不同位置。本模型應視為一個組件實驗，而非完整改革方案。

## 與較早可靠性模型的分別

網站已有一篇[科學誘因與場域可靠性模型](/zh/writing/scientific-incentives-reliability/)，研究新穎性、嚴謹度與重複驗證獎勵如何在較廣的政策 simplex 上改變場域。

今次問題較窄：實驗室只有一個可繼承的方法投入特徵，模型明確加入發表偏差，並把抽查拆成「發現」與「後果」。核心結果是抽查頻率與後果形成的選擇表面，而不是再次講述新穎性與嚴謹度之爭。

題材相近不代表文章要重複；只要機制、實驗與決策問題不同，兩者便可以互相補充。

## 已核證內容

三項自動測試全部通過：投入與 power、偽陽性機率的單調關係；固定 seed 下族群運行能否完全重現；以及強抽查政策是否比論文數量基線選出較高投入。

輸出 manifest 有 23 個 checksum 驗證檔案。本文引用的預設值——投入 \(0.0493\) 對 \(0.8584\)、FDR \(0.9302\) 對 \(0.4187\)——均由已驗證 metadata 讀取，並與 summary table 交叉核對。

這證明軟件與隨機摘要在指定 seed 下可重現，卻不構成抽查、發表偏差或職涯誘因的實證因果識別。

## 模型省略了甚麼

現實研究系統還包括：

- 不同學科的假說基準率與量測技術；
- 合作、引用、聲望、資助與聘任網絡；
- 職涯階段、資源不平等與實驗室退出；
- preregistration、registered reports、open data 與更正；
- 同一研究內的選擇性分析；
- 對方法的誠實分歧；
- 針對抽查目標的策略行為；
- 從重複失敗中學習；
- 抽查錯誤與不成比例的懲罰。

單一投入特徵尤其嚴格。真實研究應把資源分配到樣本量、量測品質、透明度、robustness checks 與 replication 等多個維度。

## 從機制實驗走向研究計劃

下一階段可結合三種證據：

1. **形式分析：**推導期望分數對投入的梯度在甚麼條件下轉號；
2. **模擬穩健性：**改變真實率、產量成本、突變、選擇強度、抽查錯誤與網絡；
3. **實證校準：**用透明的 metascience 數據約束發表延遲、重現結果或抽查成本，同時避免把一個學科當成全部科學。

政策評估應同時報告可靠性、throughput、成本、不平等與策略適應。沒有清楚社會目標，就不應把熱圖某一格稱為「最佳」。

最持久的結論並非「懲罰可以修好科學」，而是選擇會回應真正實現的獎勵。若可靠性昂貴而不可見，論文數量卻便宜而易量度，制度即使沒有任何惡意個體，也可能選出違背其公開目標的做法。

## 參考文獻

1. Smaldino, P. E., & McElreath, R. (2016). The natural selection of bad science. *Royal Society Open Science, 3*, 160384. [https://doi.org/10.1098/rsos.160384](https://doi.org/10.1098/rsos.160384)
2. Nissen, S. B., Magidson, T., Gross, K., & Bergstrom, C. T. (2016). Publication bias and the canonization of false facts. *eLife, 5*, e21451. [https://doi.org/10.7554/eLife.21451](https://doi.org/10.7554/eLife.21451)
3. Barnett, A. G., Zardo, P., & Graves, N. (2018). Randomly auditing research labs could be an affordable way to improve research quality: A simulation study. *PLOS ONE, 13*, e0195613. [https://doi.org/10.1371/journal.pone.0195613](https://doi.org/10.1371/journal.pone.0195613)
4. Smaldino, P. E. (2023). *Modeling Social Behavior*. Princeton University Press.
