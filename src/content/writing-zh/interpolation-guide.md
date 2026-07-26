---
title: 插值時，不要遺失問題原來的形狀
slug: interpolation-guide
sourceSlug: interpolation-guide
summary: 把多項式插值、Chebyshev 節點與 Gibbs 現象連接起來的主題導讀。
date: 2024-07-21
lastUpdated: 2026-07-26
featured: true
topics: [數值分析, 插值]
type: 技術教程
archived: false
redirectFrom: []
---

插值不只是「畫一條多項式穿過所有資料點」。節點的位置、函數的平滑程度，以及我們真正希望保存的量，都會影響結果。

對節點 $x_0,\ldots,x_n$，Lagrange 形式是

$$
p_n(x)=\sum_{j=0}^{n} f(x_j)\prod_{k\ne j}\frac{x-x_k}{x_j-x_k}.
$$

Chebyshev 節點能減少端點附近的誤差放大，避免等距節點的高次插值變得不穩定。函數不連續時則是另一種問題：即使增加更多項，跳躍附近的振盪仍然存在。把「節點造成的不穩定」與「平滑度不足造成的限制」分開理解，正是原本整組筆記的組織主線。
