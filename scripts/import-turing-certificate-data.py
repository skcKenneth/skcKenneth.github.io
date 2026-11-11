"""Curate an audit ZIP without executing its contents. Usage: python scripts/import-turing-certificate-data.py archive.zip"""
import argparse, csv, hashlib, io, json, zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("archive", type=Path)
args = parser.parse_args()
blob = args.archive.read_bytes()
public = root / "public/resources/turing-certificate-audit"
public.mkdir(parents=True, exist_ok=True)
prefix = "Weekly_Blog_2026-11-07_Turing_Certificate_Failure_Audit/"
truth = lambda v: str(v).lower() in ("true", "1")
with zipfile.ZipFile(io.BytesIO(blob)) as archive:
    raw = archive.read(prefix + "results/exploratory_rows.csv")
    frozen = archive.read(prefix + "results/summary.json")
    summary = json.loads(frozen)
    rows = list(csv.DictReader(io.StringIO(raw.decode("utf-8"))))
    assert len(rows) == summary["n_records"] == 2520
    records = []
    for d in summary["by_method_and_draws"]:
        group = [r for r in rows if r["method"] == d["method"] and int(r["draws"]) == d["draws"]]
        stable = [r for r in group if r["original_verdict"] == "stable"]
        unstable = [r for r in group if r["original_verdict"] == "unstable"]
        samples = {(r["graph_seed"], r["replicate"]) for r in group}
        assert (len(group), len(samples), len(stable), len(unstable)) == (180, 18, 96, 84)
        item = dict(d, evaluations=180, samplingInstances=18, scalesPerInstance=10,
                    stableDenominator=96, unstableDenominator=84,
                    disagreementCount=sum(truth(r["verdict_disagreement"]) for r in group),
                    conclusiveCount=sum(truth(r["certificate_conclusive"]) for r in group),
                    falseUnstableCount=sum(truth(r["false_unstable"]) for r in stable),
                    falseStableCount=sum(truth(r["false_stable"]) for r in unstable))
        for count, rate, denom in [("disagreementCount", "verdict_disagreement_rate", 180),
                                   ("conclusiveCount", "conclusive_certificate_rate", 180),
                                   ("falseUnstableCount", "false_unstable_conditional_rate", 96),
                                   ("falseStableCount", "false_stable_conditional_rate", 84)]:
            assert abs(item[count] / denom - d[rate]) < 1e-12
        records.append(item)
    assert sum(r["conclusiveCount"] for r in records) == 193
    assert all(not truth(r["certificate_conclusive"]) or r["certificate"] == r["original_verdict"] for r in rows)
    (root / "src/data/turing-certificate-audit.json").write_text(json.dumps(records, indent=2) + "\n", encoding="utf-8")
    (public / "results.csv").write_bytes(raw)
    (public / "summary.json").write_bytes(frozen)
    (public / "reference-cases.json").write_bytes(archive.read(prefix + "results/reference_cases.json"))
    provenance = dict(sourceArchive=args.archive.name, sourceArchiveSha256=hashlib.sha256(blob).hexdigest(),
        snapshotDate="2026-11-07", publicationDate="2026-11-11",
        resultsSha256=hashlib.sha256(raw).hexdigest(), summarySha256=hashlib.sha256(frozen).hexdigest(),
        rows=2520, referenceCases=30, samplingInstances=252, scalesReusedPerInstance=10,
        evaluationsPerMethodBudget=180, samplingInstancesPerMethodBudget=18,
        comparison="Matched draws with replacement, not matched distinct-edge counts.",
        scope="24-node synthetic undirected positive-weight graphs; linear instability only.",
        curation="Numerical source, tests, configuration and frozen results. Internal prompts excluded.")
    (public / "source-provenance.json").write_text(json.dumps(provenance, indent=2) + "\n", encoding="utf-8")
    readme = """# Turing certificate audit / Turing 證書審核

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
"""
    (public / "README.md").write_text(readme, encoding="utf-8")
    names = ["pyproject.toml", "configs/base.json", "scripts/run_experiment.py"]
    names += [n[len(prefix):] for n in archive.namelist() if n.startswith(prefix+"src/") or n.startswith(prefix+"tests/")]
    names += ["results/exploratory_rows.csv", "results/summary.json", "results/reference_cases.json"]
    with zipfile.ZipFile(public / "source-code.zip", "w", zipfile.ZIP_DEFLATED) as release:
        def add(name, content):
            info = zipfile.ZipInfo("turing-certificate-audit/" + name, (2026, 11, 7, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            release.writestr(info, content)
        add("README.md", readme.encode("utf-8"))
        add("figures/", b"")
        for name in sorted(set(names)):
            if not name.endswith("/"):
                add(name, archive.read(prefix + name))
print(f"Curated {len(records)} cells from {len(rows)} rows; 193 conclusive certificates match reference.")
