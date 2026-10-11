# 第三批實際預覽與驗證

本目錄保存雙語課堂包、短札記及關於頁的實際瀏覽器預覽。響應式紀錄涵蓋九類頁面、兩種語言、360／390／768／1280 px，以及 100／200% 根字級，共 144 個組合；200% 以本機預覽頁的字級設定測試，並非宣稱瀏覽器 zoom 或完整 WCAG 認證。

課堂包的分享設定只含白名單 preset 與有效整數 seed，必須在原工具手動套用。學生及教師參考是分開的公開頁面；教師入口不是存取控制。原 Math Studio 與 Modeling Workshop 的儲存格式維持原狀。

`print/` 的八份 A4 PDF 涵蓋兩個課堂包、兩個語言及學生／教師版，使用預設情境及 seed 2026。`render-manifest.json` 記錄來源、建置 HTML 與 PDF SHA-256；`classroom-pdf-inspection.json` 記錄逐頁大小、文字邊界、字形、學生答案隔離、設定與來源網址檢查。選頁 PNG 與 contact sheets 用作人工視覺核對。

以獨立 headless Edge profile 只渲染本機文件；沒有操作使用者瀏覽器或執行原工具的學習活動。自選情境的設定與分享由實際 UI 另行核對，PDF 預設樣本不冒充自選情境測試。

最終結果及正式發布證據見 [第三批交付](../authoring-batch.md)。
