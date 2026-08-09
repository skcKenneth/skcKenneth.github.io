---
title: 當量子糾纏過期
slug: risk-sensitive-quantum-repeater-scheduling
sourceSlug: risk-sensitive-quantum-repeater-scheduling
summary: 一項可重現的合成研究，分析四鏈路量子中繼鏈中的記憶衰減、截斷排程、尾部延遲，以及以證據為本的拒絕選擇。
year: 2026
lastUpdated: 2026-08-09
status: Reproducible study
featured: true
topics: [量子網絡, 可靠性與不確定性]
methods: [離散事件蒙地卡羅, Werner 可見度模型, 可靠性約束 CVaR 選擇]
researchQuestion: 一個預先凍結、按鏈路跨度設定的截斷策略，能否同時滿足跨情境的保真度可靠性門檻，並控制平均與尾部傳送延遲？
dataType: 受控合成的協議層量子中繼事件
codeAvailable: false
dataAvailable: false
studentSuitable: true
heroImage: /science/risk-sensitive-quantum-repeater-scheduling/mechanism-timeline.svg
period: 2026
validation: 解析等待時間與更新過程檢查、固定事件軌跡、細規模精確 MDP oracle、固定種子蒙地卡羅、bootstrap 區間及零刪截審核均已通過。
keyFindings:
  - 沒有候選策略通過原定全域可靠性門檻；選擇器拒絕作出選擇，而沒有虛構勝出策略。
  - 27 個訓練情境中有 9 個低於與策略無關的保真度上限；當壽命為 8 時，最快可行路徑的保真度僅約 0.772，低於 0.80 門檻。
  - 各跨度均採用兩時槽截斷的策略只在明確限定的高記憶壽命訓練分層內通過；40 個異質留出情境均不符合相同分層規則，因此分析對全部情境拒絕作出認證。
limitations:
  - 本研究使用合成模型，未以實測量子網絡硬件校準。
  - 即時取得經典資訊、每個鄰居一個記憶量子位，以及禁止同一時槽連鎖交換，均屬模型假設。
  - 高記憶壽命敏感度結果並非全域認證策略、硬件基準或量子密鑰分發安全證明。
redirectFrom: []
---

## 編輯導讀

完整文章請閱讀[〈當量子糾纏過期〉](/zh/writing/when-entanglement-expires/)。文章包括完整模型、文獻回顧、解析可行性上限、策略實驗、不確定性分析、限制，以及八幅已審核圖表。

研究的核心結果是「拒絕選擇」：在既定情境網格之下，沒有策略能通過全域保真度約束。公開文章會解釋這個負面結果的研究意義，但不會公開私人程式碼、原始事件軌跡、notebook 或中間計算。

你亦可以使用[量子中繼互動實驗室](/zh/teaching/quantum-repeater-lab/)，自行調整事件次序相關參數、記憶壽命、保真度門檻、生成與交換機率、截斷值及隨機種子。
