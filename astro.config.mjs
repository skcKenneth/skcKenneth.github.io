import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://skckenneth.github.io",
  output: "static",
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }),
    shikiConfig: { theme: "github-dark", wrap: true }
  },
  vite: { resolve: { alias: [{ find: /^picomatch$/, replacement: fileURLToPath(new URL("./scripts/picomatch-esm.mjs", import.meta.url)) }] }, build: { cssMinify: true } }
});
