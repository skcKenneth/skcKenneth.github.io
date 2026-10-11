# 第一批實際瀏覽器預覽

2026-10-11，本地正式建置產物，Codex in-app browser。

| 頁面 | 桌面 1280 × 1000 | 手機 390 × 844 |
|---|---|---|
| 首頁 | [home-desktop.png](home-desktop.png) | [home-mobile.png](home-mobile.png) |
| 主題詳情 | [topic-desktop.png](topic-desktop.png) | [topic-mobile.png](topic-mobile.png) |
| 文章 | [article-desktop.png](article-desktop.png) | [article-mobile.png](article-mobile.png) |

`responsive-checks.json`：三類頁面雙語 × 四寬度 × 兩字級，共 48 條。

`pilot-responsive-checks.json`：六篇試點雙語 × 四寬度 × 兩字級，共 96 條。`mobile-guides.json` 另記錄 360 px 正常字級時核心問題的位置。`qaText=200` 由本機預覽伺服器注入根字級 32 px，正式網站沒有這個測試參數功能。

已依 [Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)、[Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) 及 [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) 的相關要求抽查。記錄僅涵蓋這次新增介面及列明條件。
