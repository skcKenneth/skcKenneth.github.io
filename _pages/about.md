---
permalink: /
title: "Kenneth Cheng — Mathematics, Modeling, Curiosity."
excerpt: "Secondary mathematics teacher in Macau exploring mathematical modeling, data science, and the math behind interesting things."
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

I am **Cheng Sok Kin (Kenneth)** — a secondary mathematics teacher in Macau. I build mathematical models for a living and for fun: epidemics on spatial grids, drone delivery networks, orbital debris cascades, music-to-equation converters. If a real-world problem has a curve hiding inside it, I want to find it.

I run a [mathematical modeling course](https://skckenneth.github.io/Material-for-Mathematical-Modeling/) for my students and write [a blog](/year-archive/) where I work problems out in public, complete with code, equations, and the wrong turns along the way.

---

## What I'm currently exploring

- 🦟 **Climate-driven epidemics** — reaction-diffusion models for dengue with temperature-dependent mosquito ecology and $R_0$ fields
- 🚁 **Last-mile drone delivery** — ant-colony heuristics on networks with no-fly zones
- 🛰️ **Orbital debris cascades** — parallelized Cowell's formulation for the Kessler syndrome
- 🌊 **Coastal defense optimization** — sea level rise, storm surges, and where to spend the dollar

→ Browse all [55+ blog posts](/year-archive/) or the [project portfolio](/projects/).

---

## Featured projects

| Project | One line |
|---|---|
| [🌆 Urban Climate Resilience](/projects/urban-climate-resilience/) | Climate × epidemiology × network dynamics for resilient cities |
| [🏢 Smart Energy Macau](/projects/smart-energy-macau/) | AI-driven energy optimization for Macau's high-rises |
| [🌬️ Air Quality AI](/projects/air-quality-ai/) | PyTorch + XGBoost for real-time urban air quality prediction |
| [🎵 HarmonyMath AI](/projects/harmony-math-ai/) | Real-time music-to-equation converter via FFT and harmonic analysis |
| [🔍 Fractal Dimension Explorer](/projects/interactive-fractal-explorer/) | Web app for analyzing fractal dimensions in images |

---

## Recent writing

<ul>
{% for post in site.posts limit:5 %}
  <li>
    <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
    <span style="color: #888; font-size: 0.9em;"> · {{ post.date | date: "%b %Y" }}</span>
  </li>
{% endfor %}
</ul>

→ [See all blog posts by year](/year-archive/)

---

## For my modeling students

Welcome — you're in the right place. The [course materials](https://skckenneth.github.io/Material-for-Mathematical-Modeling/) and the [blog archive](/year-archive/) are both for you. Many of the posts started life as worked examples for class.

If you're stuck on a problem, try this in order:
1. Write down what you know and what you want — in symbols, not sentences.
2. Simplify until the problem is obviously solvable, then add the complications back one at a time.
3. Plot something. Always plot something.
4. If still stuck, [email me](mailto:sokkincheng@gmail.com).

---

## Elsewhere

- 📧 [sokkincheng@gmail.com](mailto:sokkincheng@gmail.com)
- 💻 [github.com/skcKenneth](https://github.com/skcKenneth)
- 📍 Macau

---

*Off the clock you'll find me re-reading old mathematics, getting lost in Pink Floyd, or watching Chiikawa (yes — that's where the avatar comes from).*
