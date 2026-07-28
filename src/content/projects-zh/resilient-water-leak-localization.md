---
title: 具韌性的供水網漏水定位
slug: resilient-water-leak-localization
sourceSlug: resilient-water-leak-localization
summary: 在量測含噪聲且一個感測器可能失效時，研究可區分漏水區域的抗缺失壓力感測器配置。
year: 2026
lastUpdated: 2026-07-28
status: Exploratory study
featured: true
topics: [可靠性與不確定性, 基建監察]
methods: [圖結構水力代理模型, 貪婪感測器配置, Monte Carlo 評估]
researchQuestion: 針對漏水訊號下尾分離度選出的感測器，能否在量測含噪聲且一個感測器失效時保留定位能力？
dataType: 合成水力啟發網絡與 Monte Carlo 基準
codeAvailable: true
dataAvailable: true
studentSuitable: false
heroImage: /science/resilient-water-leak-localization/robustness-comparison.svg
period: 2026
validation: 四種配置策略以共同亂數比較 45 個方法—條件組合，每組含 1,225 次 Monte Carlo 試驗。
keyFindings:
  - 在指定的 8% 噪聲與 40% 單感測器缺失壓力測試，抗缺失配置 top-1 準確率為 88.8%，名義消融版本為 85.9%。
  - 同一測試的最差區域準確率分別為 65.7% 與 51.4%。
  - 優勢沒有在所有噪聲水平一致出現，因此證據只支持擴展基準，不支持實地表現聲稱。
limitations:
  - 圖 Laplacian 反應是受控代理模型，不是 EPANET 或現場校準水力模型。
  - 只表示一個感測器失效、獨立高斯噪聲及一次一個漏點。
  - 聚合 Wilson 區間不能取代完整配對顯著性分析，也未處理所有區內依賴。
redirectFrom: []
---

## 概覽

研究把壓力感測器配置視為容錯設計。目標不只是所有感測器正常時能否分辨漏水訊號，還會逐一移除每個感測器後重新評分。

## 問題為何重要

漏水定位可高度依賴少量壓力感測器。為完整系統選出的配置，在通訊中斷、維修、停電或拒用異常讀數後可能變得模糊；冗餘應在配置階段表示，而不是故障後才補救。

## 模型與假設

試驗使用 36 節點合成網絡，包含一個固定水頭水庫與 35 個候選漏區。阻尼圖 Laplacian 產生水力啟發的壓力訊號，七個感測器分別由隨機、節點度數、名義貪婪分離或抗缺失貪婪目標選出。

## 驗證與結果

每個方法—條件組合含 1,225 次試驗，並以共同亂數形成配對比較。指定壓力測試顯示總體 top-1 有小幅改善，最差區域改善較大；但在更高噪聲下兩個貪婪方法近乎相同，極端噪聲公平性仍未解決。

## 下一步證據

下一步應以 EPANET 基準水力取代圖代理模型，並加入需求與拓撲不確定性，再以獨立資料評估。

