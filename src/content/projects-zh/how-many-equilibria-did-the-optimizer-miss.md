---
title: 優化器漏掉了多少個平衡態？
slug: how-many-equilibria-did-the-optimizer-miss
sourceSlug: how-many-equilibria-did-the-optimizer-miss
summary: 以獨立兩模態控制與分支延續，分清找到最低已知能量、回收所有穩定家族，以及描述不穩定平衡結構之間的差別。
year: 2026
date: 2026-10-03T16:20:00+08:00
lastUpdated: 2026-10-03T16:20:00+08:00
period: 2026
status: Reproducible study
featured: true
draft: false
topics: [Nonlinear mechanics, Numerical continuation, Metastability, Mathematical modeling]
methods: [Sine-Galerkin energy, Analytic gradient and Hessian, Independent polynomial census, Multistart minimization, Pseudo-arclength continuation, Shifted deflation]
researchQuestion: 逐點能量最小化何時漏掉已驗證的穩定摺疊家族，而新增求根方法何時只是補充不穩定平衡結構？
dataType: 指定異質摺疊能量的合成 stationary states，沒有材料校準或試件量測
codeAvailable: false
dataAvailable: false
studentSuitable: false
projectUrl: https://skckenneth.github.io/zh/writing/how-many-equilibria-did-the-optimizer-miss/
heroImage: /images/deflated-continuation-folding/01-energy-landscape.svg
validation: 獨立兩模態代數與區間 Sturm 控制、解析導數、原始梯度與 Hessian 核對、保留失敗紀錄，以及模態、積分、初值和步長細化。
keyFindings:
  - 首輪載荷 42–60 比較中，獨立 multistart 覆蓋所有穩定參照態，額外 deflation 沒有新增通過驗收的根。
  - 十六設定的五種主流程均找回全部穩定參照；只有舊式 natural 遺失部分 stationary 覆蓋，deflation 沒有在偽弧長之上增加根。
  - 零相位兩模態枚舉核對 C=4,S=1 在較高載荷出現亞穩定家族；舊 C=14000,S=42 在選定窗口沒有同樣變化。
  - 載荷 76 的純高斯初值，在 32、64、128 個起點預算分別有 3/10、6/10、10/10 組找齊四個極小值；結構化初值在三個預算均為 10/10。
  - 次級事件由兩模態的 75.546888 移至十二模態的 77.992739；載荷 76 的新增兩模態極小值在高模態變成鞍點。
  - 相位平移可以破壞空間反射，卻不破壞能量的整體符號對稱。
  - 正確殘差與完整切片覆蓋，並不證明每條延續軌跡都保留原本分支。
limitations:
  - 完整性只限於通過認證、未退化的兩模態控制，更大模態參照是經驗發現聯集。
  - Galerkin 空間中的局部能量穩定，不等於連續梁穩定或物理可實現。
  - 未有連續路徑證據時，鞍點與極小值能量差不是已證明的轉換屏障。
  - 成本摘要披露共用發現與額外搜尋，不主張同預算下的普遍效率優勢。
---

## 漂亮的形狀圖，可以只回答一部分問題

摺疊最佳化器可以可靠地找到較深的已知形狀，卻沒有描述它周圍的整個平衡結構。新增 stationary states 可能是不穩定鞍點，也可能是較高能量的局部極小值。這兩種結果的科學意義不同：找到更多鞍點，並不能證明最小化漏掉穩定形狀。

這個項目重新檢視[先前的弱異質性摺疊研究](/zh/projects/heterogeneous-morphoelastic-folding/)，加入解析能量導數、獨立低維根數及分支方法。小型基準與舊模型的非線性係數分開比較，避免把不同景觀當成同一套結果。

## 負面結果，令比較更精確

首輪固定相位比較中，multistart 在載荷 42 至 60 找回所有穩定參照。延續補充部分最佳化輸出未出現的平衡，額外 deflation 卻沒有增加根。這個結果支持較簡單的方法在該窗口已足夠。

擴展比較固定兩套非線性係數、兩種模態數和四個載荷相位，在載荷 42 至 90 的 193 個切片評估。五種流程均找回全部穩定參照。切線預測 natural、偽弧長及加入 deflation 的流程也找齊 stationary 參照；只有舊式 natural，在零相位四模態基準最低降至 5/9。額外 deflation anchor 搜尋在 16,384 次嘗試中沒有接受新根。獨立兩模態控制核對小型基準在較高載荷出現亞穩定極小值與混合鞍點，舊係數在選定範圍卻沒有同樣變化。小幅載荷相位平移改變次級事件，但正負形狀仍然對稱。

初始化會改變結果，能量本身卻沒有改變。載荷 76 的十組純高斯初值，在 32 個起點有 3/10 組找齊兩模態極小值，64 個起點有 6/10，128 個有 10/10。結構化初值在三個預算均為 10/10。載荷 80 的高斯結果則為 8/10、9/10、10/10，只漏個別符號夥伴，不是整個家族。局部十二模態修正保留較高能量一對的極小值分類，但不是十二模態初始化實驗。固定主初值集找回新增家族，因此 multistart 並非必然失敗。

模態細化帶來更強的警告。零相位次級事件由兩模態的 75.546888，移至四模態 78.740022、十二模態 77.992739。載荷 76 的新增兩模態極小值，經十二模態修正後是 index-1 鞍點；載荷 80 則仍為極小值。受限形狀空間中的已驗證根，不會自動在更豐富空間穩定。高模態發現聯集只是經驗參照，不是完整清單，也不是物理可實現的認證。

閱讀[《優化器漏掉了多少個平衡態？》](/zh/writing/how-many-equilibria-did-the-optimizer-miss/)，可查看完整能量、十幅研究圖、方法資訊比較，以及平衡覆蓋、分支身份與轉換證據的區別。文章對照既有 deflation、梁延續和解景觀文獻，不把這些算法包裝成新理論。
