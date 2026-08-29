---
title: 由模擬走向證書
slug: from-simulation-to-certificate
sourceSlug: from-simulation-to-certificate
summary: 一項凍結的合成雙艙 positive-network benchmark，把有限 spectral checks 與涵蓋整段不確定性的 verified decay certificates 分開，並審核只限此 family 的 diagonal restriction gap。
year: 2026
lastUpdated: 2026-08-30
status: Reproducible study
featured: false
topics: [正系統, 魯棒控制, 數值驗證]
methods: [Lyapunov inequalities, Polytopic uncertainty, Certificate residual audit]
researchQuestion: 在一個凍結的 positive leaky-transfer family 中，端點不平衡逐步增加時，diagonal restriction 如何改變所構造的 robust decay lower bound？
dataType: 合成雙艙 Metzler matrices、有限 spectral diagnostics 與已驗證 quadratic certificate records
codeAvailable: true
dataAvailable: false
studentSuitable: true
heroImage: /science/from-simulation-to-certificate/p09_02_certificate_decay_stress.svg
period: 2026
validation: 六個凍結 gates 全部通過；六項 substantive tests 與 project/root checkers 通過；canonical 與 rerun JSON byte-identical；四組 SVG/PDF/600-dpi PNG figures 通過兩位 reviewers 的原尺寸 PNG 及 PDF-raster overlap/clipping QA。
keyFindings:
  - 在 stress 為零的 collapsed-midpoint check，diagonal 與 full constructions 的相對差只有 3.596327e-11。
  - 在 full stress，此 benchmark 的 dense finite diagnostic、full certificate 與 diagonal certificate 分別為 0.2676586726、0.2676585204 與 0.1040795885；diagonal relative gap 為 0.6111480807。
  - 241 對 121 construction-grid sensitivity 的最大 absolute difference 為 6.763624e-5；全部 endpoint residual checks 通過，但 grid construction 不代表 globally optimal SDP。
limitations:
  - 證據只涵蓋一個合成 two-state line segment，不能推廣為 diagonal-LMI conservatism 的一般定律。
  - Deterministic grid 只構造 feasible trace-normalized matrices，並非 globally optimal SDP solver 或 large-network scaling study。
  - 沒有 physical system、experimental data、controller、safety conclusion、新 theorem 或 universal certificate ranking。
redirectFrom: []
---

## 編輯導讀

文獻 gate 為 **COMPLETE / REFRAME**：positive systems 的 common diagonal、copositive、quadratic 與 robust convex certificate theory 已經成熟。P09 因而不聲稱新 LMI 理論，而是把「在若干 parameter points 看見 stability」與「一個 inequality 對整條 convex segment 成立」的證據差別做成可重現 audit。

完整推導、五級 stress 結果、開發期 candidate search、rev1 圖像 rejection、直接 residual verification、reproduction hashes 與 locked next stages，見[由模擬走向證書](/zh/writing/from-simulation-to-certificate/)。
