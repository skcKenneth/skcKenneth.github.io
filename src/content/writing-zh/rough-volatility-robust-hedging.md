---
title: 面對粗糙波動與交易成本的無交易帶
slug: rough-volatility-robust-hedging
sourceSlug: rough-volatility-robust-hedging
summary: 一個合成對沖實驗先凍結不確定性感知的無交易帶，再測試它能否在未見粗糙波動及成本情境降低尾部損失與換手。
date: 2026-07-23
lastUpdated: 2026-07-28
featured: true
topics: [粗糙波動, 穩健對沖, 尾部風險]
heroImage: /science/rough-volatility-robust-hedging/rough_hedging_paths.svg
draft: false
type: 研究筆記
archived: false
readingMinutes: 20
scienceProject: rough-volatility-robust-hedging
redirectFrom: []
---

Delta hedging 看似給出簡單指令：只要期權 delta 改變，便更新股票持倉。在無摩擦、連續交易的 Black–Scholes 世界，這有清楚複製論證。但現實波動不是常數，交易是離散的，每次再平衡都有成本；追隨每個細小 delta 變化，可把模型靈敏度變成不必要換手。

本研究問：

> 當波動粗糙度與交易成本被錯設時，考慮模型不確定性的無交易帶能否降低尾部對沖損失？

這是合成定價與對沖實驗，不是投資建議。粗糙過程是受控模擬器，不是市場校準模型。

## 模擬器與刻意錯設的基準

相關 Gaussian convolution 驅動 log variance，粗糙度 $H<1/2$；資產再以該隨機變異遵從幾何擴散。關鍵是每步變異驅動只使用過去及當時可用噪聲。較早實作意外讓同一步資訊洩漏到對沖；移除 look-ahead 後，結果才可解讀。

目標持倉是由簡單波動估計計算的 Black–Scholes delta，故相對粗糙模擬器刻意錯設。Full-delta 策略每一步移到目標；band 策略只有當目標離開目前持倉半寬 $b$ 的區間才交易。

<figure class="article-figure">
  <img src="/science/rough-volatility-robust-hedging/rough_hedging_paths.svg" alt="代表性粗糙波動價格、變異、delta 與無交易帶路徑。" loading="lazy" />
  <figcaption><strong>圖 1。</strong> 路徑機制。Band 忽略細小目標變動，跨過門檻才交易；降低換手的代價是追蹤誤差。</figcaption>
</figure>

## 只選一次，然後凍結

候選半寬為 $0$、$0.02$、$0.05$、$0.08$、$0.12$、$0.18$。每個 band 在粗糙度、vol-of-vol 與交易成本訓練網格評估，目標最小化跨訓練情境的最壞 95% CVaR。

$0.12$ 的最壞訓練 CVaR 最低，約 $8.738$。目標不是單調：$0.18$ 交易更少，但最壞 CVaR 升至 $9.256$，因為追蹤誤差開始主導。

選擇後，band 被凍結，再在未見中間與壓力情境評估。若每個測試情境都重新選最佳 band，那是 oracle 比較，不是可部署規則。

## 留出結果

跨留出情境，所選 band 平均 CVaR 約 $8.847$，full delta 為 $9.517$；平均換手下降 $42.33\%$。

<figure class="article-figure">
  <img src="/science/rough-volatility-robust-hedging/rough_hedging_stress_map.svg" alt="比較不同粗糙度、vol-of-vol 與成本下尾部對沖損失的留出壓力圖。" loading="lazy" />
  <figcaption><strong>圖 2。</strong> 留出壓力圖。Band 沒有逐格重新調整；局部損失顯示凍結決策在哪裡成功、在哪裡仍脆弱。</figcaption>
</figure>

聲稱只適用於已聲明留出情境平均，不表示每條路徑或每個情境都勝出。急速價格移動可令延遲調整代價高昂；反覆小幅目標變動則可能只製造費用，band 在後者較有利。

## 為何同時需要 CVaR 與換手

平均對沖誤差可隱藏不對稱尾部損失。CVaR 平均高分位以外的損失，令目標集中在嚴重結果；但若成本表示不完整，CVaR 單獨亦可偏好日常交易過多的策略。換手因此提供第二個操作指標。

<figure class="article-figure">
  <img src="/science/rough-volatility-robust-hedging/rough_hedging_frontier.svg" alt="候選無交易帶的留出尾部損失與換手前沿。" loading="lazy" />
  <figcaption><strong>圖 3。</strong> 尾損—換手前沿。$0.12$ 是此模擬器內的穩健折衷，不是普遍最優。</figcaption>
</figure>

資產模擬器亦接受 martingale 合理性檢查。最大折現價格絕對誤差約 $0.00735$。這不證明離散粗糙模型精確，但可暴露主要漂移或 look-ahead 錯誤。

## 「穩健」在此代表甚麼

訓練目標把粗糙度、vol-of-vol 與成本視為情境維度，沒有估計它們的後驗概率。「穩健」只表示 band 依最壞訓練 CVaR 選擇，之後不重新調參測試。

其他定義會產生不同選擇：按情境權重最小化平均 CVaR；限制換手後最小化最壞損失；distributionally robust 鄰域；相對情境 oracle 最小化 regret；或按 filtered state uncertainty 在線調整 band。本文選擇的優點是透明、可反駁。

## 聲稱界線

可支持的句子是：

> 在已聲明粗糙波動啟發模擬器，凍結的 $0.12$ band 相對 full delta 把平均留出 CVaR 由 $9.517$ 降至 $8.847$，並把平均換手降低 $42.33\%$。

它不建立預期盈利、市場校準、無套利定價準確度或實盤執行表現。模型未包括 order-book impact、離散 bid–ask dynamics、聲明規則以外的波動估計錯誤、跳躍、融資及重新校準。

## 參考文獻

1. J. Gatheral, T. Jaisson, and M. Rosenbaum, “Volatility is rough,” *Quantitative Finance*, 2018. [doi:10.1080/14697688.2017.1393551](https://doi.org/10.1080/14697688.2017.1393551).
2. C. Bayer, P. Friz, and J. Gatheral, “Pricing under rough volatility,” *Quantitative Finance*, 2016. [doi:10.1080/14697688.2015.1099717](https://doi.org/10.1080/14697688.2015.1099717).
3. H. Buehler *等*, “Deep hedging,” *Quantitative Finance*, 2019. [doi:10.1080/14697688.2019.1571683](https://doi.org/10.1080/14697688.2019.1571683).
4. P. Artzner *等*, “Coherent measures of risk,” *Mathematical Finance*, 1999. [doi:10.1111/1467-9965.00068](https://doi.org/10.1111/1467-9965.00068).

