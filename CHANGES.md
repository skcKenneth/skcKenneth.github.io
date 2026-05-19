# 改動清單 / Changes summary

呢個 patch 修咗你 GitHub Page 入面所有未動過嘅 Academic Pages template placeholder，
重整咗首頁同 projects 頁，整咗 5 張 project teaser 圖同一張 OG 分享圖。

---

## ✅ 改咗嘅嘢

### 1. `_config.yml`
- `description`: 由「personal description」改成真實描述（會用喺 SEO / 社交分享）
- `author.bio`: 用更具體嘅一句話介紹（會喺 sidebar 顯示）
- `og_image`: 設為 `/images/og-image.png`（分享連結出去會見到預覽圖）
- `read_more: enabled`: archive 頁會顯示 "Read more" link，blog list 觀感更好

### 2. `_pages/about.md` (首頁)
- Title 由「Home Page」改成 **"Kenneth Cheng — Mathematics, Modeling, Curiosity."**
- 重寫整個 home page：強 hook 開頭、4 個 current research themes、featured projects table、最近 5 篇 blog post（用 Liquid 自動拉）、畀學生嘅 advice、聯絡資訊
- 拿走重複嘅「Thank you for visiting」/「Please feel free to contact me」

### 3. `_pages/cv.md`
- 完全推翻 GitHub University / Professor Hub / Slack 43 teams 等 template 內容
- 換上真實骨架：Education / Current position / Selected projects / Skills / Publications
- 我唔知嘅地方（學位、學校名、年份）標註咗 `[請填入]`，請你補返
- 預設**仲未喺 navigation**顯示，因為個 file 仲有 `[請填入]`，等你填好之後再去 `_data/navigation.yml` 解 comment

### 4. `_pages/projects.html`
- 加咗短簡介
- `reversed` — 最新嘅 project 排最前

### 5. 五個 project 加咗 `header.teaser` 同 `header.overlay_image`
喺 `_projects/*.md` 嘅 frontmatter 入面，依家 archive 頁同 project page top 都會有圖：
- `/assets/images/projects/air-quality-ai.png`
- `/assets/images/projects/harmony-math-ai.png`
- `/assets/images/projects/interactive-fractal-explorer.png`
- `/assets/images/projects/smart-energy-macau.png`
- `/assets/images/projects/urban-climate-resilience.png`

每張係 1200×600，主題符合 project（air quality 用 inferno colormap、fractal 用 Mandelbrot、smart energy 用 high-rise illustration 等等）。

### 6. 新增 `images/og-image.png`
1200×630 嘅 Open Graph 分享圖，share 你個 site 出去 WhatsApp / FB / Twitter 都會見到呢張預覽。

### 7. `README.md`
換咗你個 repo 嘅 README，由 template 嘅 academic-pages 文件變成介紹你個 site。

---

## 🗑 刪咗嘅嘢（全部都係 template placeholder）

### Collection items (全部係預設範例)
- `_portfolio/portfolio-1.md`, `_portfolio/portfolio-2.html`
- `_talks/2012-03-01-talk-1.md`, `_talks/2013-03-01-tutorial-1.md`, `_talks/2014-02-01-talk-2.md`, `_talks/2014-03-01-talk-3.md`
- `_teaching/2014-spring-teaching-1.md`, `_teaching/2015-spring-teaching-2.md`
- `_drafts/post-draft.md`

### Orphan pages (本身已經唔喺 nav，又無真實 content)
- `_pages/talks.html`, `_pages/teaching.html`, `_pages/portfolio.html`
- `_pages/talkmap.html`
- `_pages/category-archive.html`, `_pages/collection-archive.html`, `_pages/tag-archive.html`
- `_pages/markdown.md` (theme 嘅 demo 文件)
- `_pages/non-menu-page.md`, `_pages/archive-layout-with-content.md`, `_pages/page-archive.html`

### Talkmap tooling (用嚟整地圖 talk locations，你冇 talk 就用唔到)
- `talkmap.py`, `talkmap.ipynb`, `talkmap/`, `markdown_generator/`, `ruby-build/`

留低咗（仍然有用）:
- `_publications/2009-10-01-paper-title-number-1.md` ← 你 2019 嘅 arXiv paper，係真實內容
- `_pages/publications.md` ← 顯示上面嗰篇 paper

---

## 📝 你要做嘅事

### 高優先
1. **`_pages/cv.md`** — 填返所有 `[請填入]` (學位、學校名、年份、學校全名)
2. **`_data/navigation.yml`** — 填好 CV 之後，解 comment：
   ```yaml
   - title: "CV"
     url: /cv/
   ```
3. **`_config.yml` 入面嘅學術 link** — 如果你個 ORCID `0009-0005-8148-7221` 同 Google Scholar `PS_CX0AAAAAJ` 真係你嘅，解 comment 兩條 line，icon 就會喺 sidebar 自動出現
4. **LinkedIn** — 強烈建議加，喺 `_config.yml` 個 `linkedin:` 填入你個 username

### 中優先
5. **`avatar.png`** — Chiikawa 可愛但 share 出去畀 admission / employer 睇可能會掉分。建議放一張真人相做主 avatar；Chiikawa 可以留做彩蛋
6. **真實 favicon** — 而家係預設嘅，可以整一個有 K / 數學符號嘅
7. **Blog post filename** — 而家係 `2026-02-15-blog-post-1.md` 咁，建議改成 descriptive 嘅（permalink 已經 override 咗，所以唔影響 URL，但對自己 maintain 有幫助）

### 低優先
8. **`_config.yml` 入面 analytics** — 開 Google Analytics 4 睇 traffic
9. **`files/cv.pdf`** — upload 你個 PDF CV，個 `/cv/` 頁面入面有條 link 指住佢

---

## 🚀 部署

直接 commit + push 到你個 `master` branch，GitHub Actions（`.github/workflows/jekyll.yml`）會自動 build + deploy。

如果想 local preview：
```bash
bundle install
bundle exec jekyll serve -l -H localhost
# 開 http://localhost:4000
```

---

## 🎨 多送你嘅 (可以放喺 blog post header)

`/assets/images/projects/` 5 張圖你都可以用喺相應主題嘅 blog post，例如氣象 / epidemiology 嘅 post 加：

```yaml
header:
  teaser: /assets/images/projects/urban-climate-resilience.png
```

archive 頁就會有圖。
