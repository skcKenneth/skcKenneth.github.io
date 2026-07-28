---
title: 圖結構校準的電池組熱故障預警
slug: battery-pack-thermal-early-warning
sourceSlug: battery-pack-thermal-early-warning
summary: 在溫度感測器漂移或失去訊號時，以校準的 graph-CUSUM 基準研究局部電池組熱故障預警。
year: 2026
lastUpdated: 2026-07-28
status: Exploratory study
featured: true
topics: [可靠性與不確定性, 電池安全監察]
methods: [耦合熱網絡代理模型, Graph-CUSUM 變點偵測, 留出資料閾值校準]
researchQuestion: 移除共同趨勢並匯聚相鄰節點證據，能否在合成電池組越過溫度研究界線前發出預警，同時維持接近校準目標的誤報率？
dataType: 合成 4 × 4 耦合熱網絡，以及漂移、缺失與局部故障軌跡
codeAvailable: true
dataAvailable: true
studentSuitable: false
heroImage: /science/battery-pack-thermal-early-warning/benchmark-performance.svg
period: 2026
validation: 四個偵測器共用 220 條健康校準軌跡，並在每種漂移／缺失狀況使用互不重疊的 160 條健康及 160 條故障軌跡。
keyFindings:
  - 在每秒 0.010 °C 漂移兼一個感測器缺失時，graph-CUSUM 於研究界線前偵測 94.4% 故障，獨立 CUSUM 為 90.0%。
  - 綜合壓力下兩者誤報率分別為 6.25% 與 5.0%，而 95% 區間重疊。
  - 名義校準的最高溫度閾值在健康綜合壓力軌跡上產生 95.0% 誤報，揭示此基準對正向感測偏差十分敏感。
limitations:
  - 熱網絡是受控代理模型，不是含特定化學機理或濫用測試的電化學模型。
  - 60 °C 是研究終點，不是普遍熱失控或安全閾值。
  - 研究未評估實體模組、量產感測紀錄、冷卻控制器或已部署電池管理系統。
redirectFrom: []
---

## 概覽

模型把電池模組視為一張圖：每顆電芯與物理鄰居交換熱量，每個溫度通道則是圖上的時變訊號。方法先移除全組共同變化，再匯聚相鄰電芯的正殘差證據，最後順序累積。

## 問題為何重要

預警規則不能只看故障偵測率。若方法在幾乎所有健康軌跡都報警，即使看似靈敏也沒有實際判別力。正向溫度偏差正好暴露固定閾值的弱點。

## 模型與假設

基準模擬 16 顆熱耦合電芯共 240 秒，明確加入基準負載、環境溫度、電芯差異、過程噪聲及量測噪聲。故障熱在 90 秒後於局部增長；壓力條件包括正向線性漂移、一個通道缺失，或兩者同時發生。

## 驗證與解讀

四個主要方法使用相同校準資料，評估種子與校準資料分離。比例指標附 Wilson 95% 區間，預警提前時間中位數附 bootstrap 區間。Graph-CUSUM 在綜合壓力下有小幅偵測優勢，但證據不足以支持普遍優越的結論。

## 下一步證據

合理後續是使用有獨立故障時間與感測器校準歷史的實體模組資料重播。現階段結果只描述這個合成基準。

