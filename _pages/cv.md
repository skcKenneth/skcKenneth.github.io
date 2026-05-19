---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<!--
  Kenneth — 呢頁我幫你搭咗骨架，
  但你嘅學歷、年份、學校名等等我冇辦法確認，
  所以填咗 [請填入] 嘅地方麻煩你親自補返。
  改完之後可以喺 _data/navigation.yml 將 CV 嘅 comment 解開，
  令到 nav 重新顯示 CV link。
-->

Cheng Sok Kin (Kenneth) — Macau · [sokkincheng@gmail.com](mailto:sokkincheng@gmail.com) · [github.com/skcKenneth](https://github.com/skcKenneth)

A short version of [the home page](/): I teach secondary mathematics in Macau and spend much of my off-time building mathematical models and writing about them.

A downloadable PDF version is at <a href="/files/cv.pdf">/files/cv.pdf</a> *(once you upload it)*.

Education
======
* **[請填入學位], [請填入專業]**, [請填入大學名], [請填入年份]
* **[請填入學位], [請填入專業]**, [請填入大學名], [請填入年份]

Current position
======
* **Secondary Mathematics Teacher**, [請填入學校名], Macau
  * Teaching secondary-level mathematics and a mathematical-modeling course
  * Course materials: [Material-for-Mathematical-Modeling](https://skckenneth.github.io/Material-for-Mathematical-Modeling/)

Selected projects
======
* **Urban Climate Resilience** — mathematical framework modeling climate-epidemiological-network dynamics for resilient cities. [Details](/projects/urban-climate-resilience/)
* **Smart Energy Macau** — AI-driven energy optimization system for Macau's high-rise urban environment. [Details](/projects/smart-energy-macau/)
* **AI-Powered Air Quality Prediction System** — STEAM research project combining PyTorch deep learning and XGBoost ensemble methods for real-time urban air quality prediction. [Details](/projects/air-quality-ai/)
* **HarmonyMath AI** — real-time music-to-mathematical-equation converter using FFT analysis and harmonic detection. [Details](/projects/harmony-math-ai/)
* **Interactive Fractal Dimension Explorer** — educational web application for analyzing fractal dimensions in images. [Details](/projects/interactive-fractal-explorer/)

Skills
======
* **Mathematical modeling**: ODE / PDE systems, reaction-diffusion, optimal control, compartmental models, network dynamics, stochastic processes
* **Numerical methods**: FFT, interpolation, finite differences, Cowell's formulation, particle swarm and ant colony optimization
* **Programming**: Python (NumPy, SciPy, scikit-learn, PyTorch, XGBoost), Streamlit, Matplotlib / Plotly
* **Teaching**: secondary-school mathematics, mathematical modeling for competitions (e.g. ICM/MCM-style problems)

Publications
======
<ul>{% for post in site.publications reversed %}
  {% include archive-single-cv.html %}
{% endfor %}</ul>

Blog (selected technical writeups)
======
* See the [full blog archive](/year-archive/) — 50+ posts on epidemics, optimization, orbital mechanics, traffic dynamics, and more.

<!--
  Talks 同 Teaching 兩個 collection 仲係 template 預設內容，
  暫時隱藏咗。如果你日後有真實 talk / teaching record，
  將 _talks/ 同 _teaching/ 入面嘅 example 檔案刪走、
  加入真實檔案，再喺呢度 uncomment 下面兩個 block。
-->
<!--
Talks
======
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>

Teaching
======
  <ul>{% for post in site.teaching reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
-->
