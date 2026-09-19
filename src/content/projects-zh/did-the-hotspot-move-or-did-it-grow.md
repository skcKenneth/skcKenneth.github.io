---
title: 搬移還是生長？非平衡傳輸的機制解讀研究
slug: did-the-hotspot-move-or-did-it-grow
sourceSlug: did-the-hotspot-move-or-did-it-grow
summary: 以已知生成歷史、明確歧義反例及獨立數值核對，檢查帶熵非平衡傳輸的成本分配，是否足以解釋兩張週期密度圖之間真正發生的機制。
year: 2026
date: 2026-09-19
lastUpdated: 2026-09-19
status: Reproducible study
featured: false
draft: false
topics: [Optimal transport, Inverse problems, Identifiability, Uncertainty]
methods: [Entropic unbalanced optimal transport, Balanced Sinkhorn baseline, Known generating histories, Deterministic sensitivity analysis]
researchQuestion: 靜態運輸與邊際變化的成本佔比，何時接近已知生成作用量，而相同端點何時容許不同歷史？
dataType: 一維圓形空間上的合成平滑正密度，沒有真實場域觀測
codeAvailable: false
dataAvailable: false
studentSuitable: false
projectUrl: https://skckenneth.github.io/zh/writing/did-the-hotspot-move-or-did-it-grow/
heroImage: /images/uot-move-or-grow/02-two-histories-one-endpoint.svg
period: 2026
validation: 核對單一位置解析解、獨立凸最佳化與 POT 結果、原始及對偶殘差、完全一致的重複求解、選定網格加密，以及生成路徑的連續性方程。保留平衡求解器的迭代上限失敗及粗網格比較例外。
keyFindings:
  - 全部 4,320 次主 UOT 擬合收斂，但收斂不代表辨認了物理歷史。
  - 靜態成本分配與生成歷史的動態作用量是不同數學量，一致性需要檢查而不是預設。
  - 相同等質量端點同時容許搬移與原地反應歷史，因此任何只看端點的比例診斷，至少對一段歷史相差二分之一。
  - 完全相同的圖仍可產生正的正則化運輸成本，展示的無變化控制例中靜態佔比達 99.29%。
  - 540 次正規化平衡擬合中有 14 次到達固定迭代上限，不當成已收斂的有效基準解。
limitations:
  - 靜態平方距離 KL 表述不等同於精確的動態 Wasserstein–Fisher–Rao 度量。
  - 確定性參數網格不是獨立樣本，分類門檻與成本價格都是明確指定的慣例。
  - 這是既有方法的合成機制解讀研究，不是新求解器、新穎性主張或真實生態驗證。
---

## 一個對應，不等於親眼見證的歷史

兩張分布圖可以顯示熱點改變位置，卻未必說明物質真的搬移，還是局部密度在原地改變。本研究先指定可核對的生成歷史，再只把兩個端點交給估計器。

四類案例包括純平移、均勻生長、移動加局部生長，以及雙峰交換權重。三種幾何、256 格週期場和固定的懲罰與熵參數，令比較有明確範圍。正規化平衡對照則展示：若在擬合前移除總量，哪些資訊會一併消失。

## 這個結果能說明甚麼

最清楚的反例來自問題結構：同一對端點可以由搬移歷史或原地反應歷史生成。沒有額外假設或觀測，任何只接收端點的估計器都無法分辨兩者。

數值核對支持實作的目標函數，以及選定主網格結果的精度，但不會把最低成本配對變成因果解釋。研究保留負面控制例、參數敏感度及未收斂的對照項目，不單靠端點擬合來宣稱成功還原機制。

閱讀[《熱點移動了，還是在原地長大？》](/zh/writing/did-the-hotspot-move-or-did-it-grow/)，可查看雙語長文、八幅數據圖，以及下一個可檢驗問題：甚麼額外觀測，可以排除另一段歷史？
