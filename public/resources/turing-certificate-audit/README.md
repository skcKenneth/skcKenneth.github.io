# Turing certificate audit / Turing 證書審核

Research snapshot: 2026-11-07. Article: 2026-11-11.
研究凍結日期：2026-11-07；文章日期：2026-11-11。

This small synthetic reference audit studies linear instability, not realised
nonlinear patterns or biological data. It does not propose a new sparsifier.
Comparisons match draw counts, not distinct retained edges. Exact posterior
distortion uses the original reference eigensystem; no end-to-end speedup is shown.
這是小型合成參考審核，只研究線性失穩，沒有非線性圖樣或生物實證。
比較匹配抽樣次數，沒有匹配保留邊數；計算證書仍需完整原圖特徵分解。

## Reproduce / 重現

In an isolated Python environment / 在獨立 Python 環境執行：

    python -m pip install -e ".[dev]"
    python -m pytest -q
    python scripts/run_experiment.py

Minimum dependency versions are declared; no lockfile is supplied.
Consult the article for the independently checked environment.
依賴只宣告最低版本，沒有鎖定環境；本次核查環境記錄見兩語文章。

## Data / 資料

2,520 rows =252 sampling instances reused across10 Laplacian scales.
Each method/budget has180 graph-scale evaluations from18 underlying samples.
False-unstable and false-stable conditional denominators are96 and84.
There are193 conclusive and2,327 inconclusive recorded certificates.
These are dependent descriptive evaluations, not2,520 independent trials.
2,520行來自252組抽樣各重用10尺度；每方法／預算180評估只有18組基礎抽樣。
錯報／漏報失穩分母分別96／84；沒有按獨立試驗估計信賴區間。

## Source boundary / 來源界線

This package contains numerical source, tests, configuration and frozen results.
Working prompts and internal instructions are excluded. See source-provenance.json
beside the archive for source hashes.
公開包只含數值程式、測試、設定和凍結結果，沒有工作提示或內部指示。
來源雜湊記錄在本壓縮檔旁邊的 source-provenance.json。
