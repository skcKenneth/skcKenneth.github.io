---
title: 感知佔用情況的課室通風
slug: occupancy-aware-classroom-ventilation
sourceSlug: occupancy-aware-classroom-ventilation
summary: 當實際房間使用偏離時間表時，以共用容量預測控制比較課室 CO₂ 暴露。
year: 2026
lastUpdated: 2026-07-28
status: Exploratory study
featured: true
topics: [環境建模, 數學建模教育]
methods: [多區 CO₂ 質量平衡, 模型預測控制, 配對 Monte Carlo 評估]
researchQuestion: 當房間使用與共用通風容量偏離時間表，短視窗氣流分配能否降低有人時的 CO₂ 暴露？加入人數緩衝又有多少能源代價？
dataType: 合成三課室時間表、佔用擾動與完全混合 CO₂ 軌跡
codeAvailable: true
dataAvailable: true
studentSuitable: true
heroImage: /science/occupancy-aware-classroom-ventilation/benchmark-exposure-and-energy.svg
period: 2026
validation: 每種情境下四個控制器各以 120 個配對合成日評估；緩衝 MPC 與時間表 MPC 的差異使用配對 bootstrap 區間。
keyFindings:
  - 在未通報轉房兼共用容量下降時，高於 1000 ppm 研究線的人員加權暴露比例，固定時間表為 74.5%、反應式 CO₂ 為 68.7%、時間表 MPC 為 43.4%、緩衝 MPC 為 42.0%。
  - 相對時間表 MPC，五人緩衝令暴露改變 −1.45 個百分點，同時令風機能源代理增加每日 0.93 kWh。
  - 緩衝 MPC 稍為提高不加權的全日最高值，顯示較低有人暴露不保證較低的最壞房間峰值。
limitations:
  - 課室是完全混合合成區域，不是經校準的實體課室或已調試空調系統。
  - 1000 ppm 只作基準控制目標，不是普遍健康、安全或法規閾值。
  - 能源與熱負荷均為代理量；模型不包含氣溶膠、過濾、感染風險或健康結果。
redirectFrom: []
---

## 概覽

研究把通風視為共用資源分配問題。三間課室共用有限指令容量；時間表有參考價值但並不完美，因為出席會波動、班級可臨時轉房，風機可用容量亦可能下降。

四個控制器接收相同合成軌跡。固定時間表與反應式 CO₂ 規則提供基準；時間表 MPC 用未來 30 分鐘安排預測；緩衝 MPC 則在每個預計使用中的房間額外加入五人。

## 模型、資料與假設

每間 180 m³ 課室以五分鐘步長遵從完全混合 CO₂ 質量平衡。九個排定課節產生實際佔用，壓力情境加入 10–16 人未通報轉房及三小時共用容量下降。

1000 ppm 是一致比較策略的研究目標，不是直接健康界線。模型沒有描述室內氣流幾何、開門、過濾、氣溶膠、設備調試或本地規例。

## 驗證與結果

不同控制器共用相同物理種子，使配對差異主要反映控制規則。結果顯示預測方法以較多風機指令換取較低有人暴露；額外佔用緩衝的改善細小，且略為惡化另一個峰值指標。這是取捨，不是普遍排名。

## 下一步證據

後續應以實體課室校準質量平衡與風機定律，再用獨立記錄的時間表偏差重播，而且不可在測試建築重新調參。

