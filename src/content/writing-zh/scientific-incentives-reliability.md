---
title: 科學領域能否獎勵新穎性而不失去可靠性？
slug: scientific-incentives-reliability
sourceSlug: scientific-incentives-reliability
summary: 一個演化個體為本模型，把新穎性、嚴謹度與重複研究信用視為競爭的制度誘因，並繪出發現—可靠性前沿。
date: 2026-07-24
lastUpdated: 2026-07-28
featured: true
topics: [個體為本模型, 元科學, 制度設計]
heroImage: /science/scientific-incentives-reliability/science_policy_simplex.svg
draft: false
type: 研究筆記
archived: false
readingMinutes: 20
scienceProject: scientific-incentives-reliability
redirectFrom: []
---

「獎勵更好的科學」聽來簡單，直至我們要定義獎勵。新穎發現可開拓方向，嚴謹方法可減少假聲稱，重複研究可修正紀錄；但領域注意力與職業信用有限，加強一項誘因可削弱另一項。

研究問題是：

> 哪種新穎性、預先註冊／嚴謹度及重複研究信用組合，可以提升競爭研究領域的可靠性，而不令發現率崩塌？

這是制度思想實驗，不是任何真實學科的效果估計。它的作用是把回饋環明確化，揭露純文字論證容易隱藏的取捨。

## 實驗室作為演化策略

每個模擬實驗室有三個連續特徵：偏好新穎問題、投入方法嚴謹度、願意重複研究。原創假設可以真或假；在已聲明世界中，越新穎的假設先驗真值越低，而較高嚴謹度會提高 power 並降低 false-positive rate。已發表工作取得信用，成功實驗室較易被模仿，並有突變。

重複研究優先選擇影響力高但仍不確定的聲稱。它使用原本可作新研究的資源，但能更新已發表紀錄的可靠性。

政策權重位於 simplex：

$$
w_N+w_R+w_P=1,
$$

$w_N$ 獎勵新穎性，$w_R$ 獎勵嚴謹度，$w_P$ 獎勵重複研究。只獎勵新穎性的角落是基準。

<figure class="article-figure">
  <img src="/science/scientific-incentives-reliability/science_policy_simplex.svg" alt="科學政策權重 simplex，附可靠性與發現結果。" loading="lazy" />
  <figcaption><strong>圖 1。</strong> 政策 simplex。每點是一套完整獎勵組合；等高線與數值顯示結果不是「重複越多越好」的一維故事。</figcaption>
</figure>

## 「可靠性」與「發現」如何定義

可靠性是模型紀錄中獲支持原創聲稱為真的比例；發現率是每單位活動產生的真原創發現。模型亦保留發表率與重複率。

它們是模擬器觀察量，不是科學質素的直接量度。真實聲稱可以部分正確，重複設計可不同，發表亦可在沒有二元裁決下改變信念。簡化指標只有在各政策比較中定義固定，才有分析價值。

## 只獎勵新穎性的失敗案例

14 個種子下，新穎性角落平均可靠性約 $0.463$、發現率 $0.171$、平均嚴謹度 $0.271$、平均新穎性 $0.916$。Mean-field positive predictive value 為 $0.440$，與個體模型合理接近。

這個角落不是諷刺任何實際期刊，而是測試一個回饋：若信用追隨驚奇正結果，而昂貴嚴謹度沒有直接回報，低嚴謹高新穎策略可在制度上繁衍，即使它降低紀錄可靠性。

## 最高可靠性不一定是最佳政策

只獎勵重複研究的角落可靠性達約 $0.995$，但發現率降至 $0.065$。大部分活動重訪舊聲稱，紀錄可靠卻較少新真發現。

較有意思的是 nondominated frontier。約 $0.833$ 嚴謹度加 $0.167$ 重複信用的組合，可靠性 $0.992$、發現率 $0.451$；重複權重加至三分之一後，可靠性 $0.993$、發現率 $0.442$；嚴謹與重複各半，可靠性 $0.994$、發現率 $0.342$。

<figure class="article-figure">
  <img src="/science/scientific-incentives-reliability/science_reliability_frontier.svg" alt="不同科學誘因政策的可靠性與發現率 Pareto 前沿。" loading="lazy" />
  <figcaption><strong>圖 2。</strong> 可靠性—發現前沿。位於左下方的政策在模擬器內被支配；前沿上的選擇仍需要模型以外的價值與成本判斷。</figcaption>
</figure>

模型內較意外的結果是：強烈獎勵嚴謹度可同時改善可靠性與發現率。方法改善令真發現比例升幅足以補償新穎性下降；適量重複再修正紀錄，但過多重複最終擠走原創工作。

## 演化路徑很重要

政策不是只改變一代文章。它改變哪些策略取得信用，再改變實驗室策略分布，最後改變未來證據。

<figure class="article-figure">
  <img src="/science/scientific-incentives-reliability/science_strategy_evolution.svg" alt="選定誘因政策下平均新穎性、嚴謹度與重複策略的演化。" loading="lazy" />
  <figcaption><strong>圖 3。</strong> 策略演化。制度權重經重複選擇週期改變研究行為群體；只看終點平均會隱藏路徑。</figcaption>
</figure>

這種內生適應令靜態成本效益表不足。獎勵嚴謹結果初期可能降低發表量，後來卻把群體推向產生更多真陽性的策略。相反，真實制度中的規則亦可被「遊戲化」；現模型未加入策略性重新標籤或指標操控。

## 防止單次運行講故事

分析使用 28 個政策點，每點 14 個獨立種子，並展示標準差。人口規模敏感度檢查結果是否由過小實驗室群造成；極限情況則確認提高 power、降低 false-positive rate 會按預期提高 PPV。

Mean-field 檢查尤其有用。它移除演化選擇與聲稱網絡歷史，不能重現完整個體模型；但與可靠性尺度大致一致，表示基本真值—power—假陽性算術連貫。

## 模型遺漏甚麼

真實制度包含異質學科、合作、聲望網絡、資助限制、職業階段、選擇性報告、量測誤差、理論發展、資料重用，以及對「重複」的不同理解。真值也不是評估者可直接看見的 simulator bit。

政策權重假設不同信用可比較且可執行。現實中，名義嚴謹獎勵可變成文件工作，重複誘因亦可能偏向容易目標；模型未表示 Goodhart 式適應。

因此，研究不推薦任何期刊計分表，只建立條件機制：

> 當實驗室策略按發表信用演化，直接獎勵嚴謹度並配合適量重複研究，可令模擬領域移到比新穎性單一獎勵更好的可靠性—發現前沿。

## 研究延伸

下一版本可加入學科基率與成本異質性、publication bias、聲稱影響網絡、策略性投入與不完美審核、不同效度的重複設計、方法或儀器衝擊，以及用 empirical metascience 摘要校準並留出驗證。

目前結果之所以有用，正因為這些被清楚列為缺失機制，而非暗中假設已處理。

## 參考文獻

1. P. E. Smaldino and R. McElreath, “The natural selection of bad science,” *Royal Society Open Science*, 2016. [doi:10.1098/rsos.160384](https://doi.org/10.1098/rsos.160384).
2. L. Tiokhin *等*, “Competition for priority harms the reliability of science, but reforms can help,” *Nature Human Behaviour*, 2021. [doi:10.1038/s41562-020-01040-1](https://doi.org/10.1038/s41562-020-01040-1).
3. M. Gordon *等*, “Examining the replicability of online experiments selected by a decision market,” *Nature Human Behaviour*, 2024. [doi:10.1038/s41562-024-01879-8](https://doi.org/10.1038/s41562-024-01879-8).
4. J. P. A. Ioannidis, “Why most published research findings are false,” *PLoS Medicine*, 2005. [doi:10.1371/journal.pmed.0020124](https://doi.org/10.1371/journal.pmed.0020124).

