---
title: 如何謹慎解讀一項空間登革熱實驗
slug: climate-driven-dengue
sourceSlug: climate-driven-dengue
summary: 說明一個合成反應—擴散實驗，對氣候敏感傳播機制可以告訴我們甚麼，以及不能支持哪些結論。
date: 2025-12-26
lastUpdated: 2026-07-26
featured: true
topics: [微分方程, 流行病學, 數值方法]
type: 研究筆記
archived: false
redirectFrom: []
---

這個專案把受溫度影響的蚊媒動力學，連接到一個空間反應—擴散模型。實驗矩陣使用合成設定：它適合在受控假設下比較機制，並不是澳門或任何特定城市的疫情預測。

## 一個小而清楚的數學核心

空間感染分區可以概略寫成

$$
\frac{\partial I}{\partial t}=D_I\nabla^2 I + \mathcal{T}(S,I,V,T)-\gamma I,
$$

其中擴散項代表局部移動，$\mathcal{T}$ 集合了取決於宿主、病媒與溫度的傳播項；若要表示遠距離傳播，則需要再加入非局部過程。

## 應該如何閱讀輸出

真正有用的問題，不是某一次模擬曲線看起來是否合理，而是當網格解像度、時間步長或不確定參數改變時，比較結果是否仍然穩定。因此，計算工作包括數值驗證、測試和敏感度實驗。這些工作提高我們對實作正確性的信心；以實際觀測資料作經驗校準，仍然是另一項獨立任務。

```python
# 在專案環境內重現已記錄的合成實驗矩陣
python run_experiment_matrix.py --tfinal 365 --grid 30 --dt 0.2 --save 30
```
