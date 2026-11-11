"""Generate reviewed Turing-audit figures from the frozen archive, never its code.

python scripts/turing-certificate-figures.py --source-zip PATH

Input code is not imported or executed. CSV aggregates are checked against the
frozen summary. The mathematical panel independently evaluates the stated 2x2
model. Certificate intervals are explicitly schematic, not experimental modes.
"""
from __future__ import annotations

import argparse
from collections import Counter, defaultdict
import csv
import hashlib
import html
import io
import json
import math
from pathlib import Path
import zipfile

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import NullLocator
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images" / "turing-certificate-audit"
METHODS = [
    ("effective_resistance", "Effective resistance", "#0072B2", "o", "-"),
    ("uniform", "Uniform", "#D55E00", "s", "--"),
]
DRAWS = [20, 40, 70, 110, 170, 350, 700]
BLACK = "#111111"


def load_archive(path: Path) -> tuple[dict, list[dict], dict]:
    with zipfile.ZipFile(path) as archive:
        entries = {}
        payloads = {}
        for suffix in ["results/summary.json", "results/exploratory_rows.csv"]:
            name = next(name for name in archive.namelist() if name.endswith(suffix))
            payloads[suffix] = archive.read(name)
            entries[suffix] = {"entry": name, "sha256": hashlib.sha256(payloads[suffix]).hexdigest()}
    summary = json.loads(payloads["results/summary.json"])
    rows = list(csv.DictReader(io.StringIO(payloads["results/exploratory_rows.csv"].decode("utf-8"))))
    assert summary["n_records"] == len(rows) == 2520
    assert summary["reference_cases"] == 30
    assert summary["config"]["n_nodes"] == 24
    assert len(summary["by_method_and_draws"]) == 14
    grouped = defaultdict(list)
    for row in rows:
        grouped[(row["method"], int(row["draws"]))].append(row)
        assert row["certificate"] == "inconclusive" or row["certificate"] == row["original_verdict"]
    assert len(grouped) == 14
    epsilon_spread = 0.0
    for (method, draws), selected in grouped.items():
        assert len(selected) == 180
        assert Counter(row["original_verdict"] for row in selected) == {"stable": 96, "unstable": 84}
        instances = defaultdict(list)
        for row in selected:
            instances[(row["graph_seed"], row["replicate"])].append(row)
        assert len(instances) == 18 and all(len(values) == 10 for values in instances.values())
        for values in instances.values():
            eps = [float(row["spectral_distortion"]) for row in values]
            epsilon_spread = max(epsilon_spread, max(eps) - min(eps))
            assert max(eps) - min(eps) < 1e-10
            assert len({row["retained_edges"] for row in values}) == 1
        aggregate = next(record for record in summary["by_method_and_draws"]
                         if record["method"] == method and record["draws"] == draws)
        for target, source in [("mean_retained_fraction", "retained_fraction"),
                               ("verdict_disagreement_rate", "verdict_disagreement"),
                               ("conclusive_certificate_rate", "certificate_conclusive")]:
            assert math.isclose(sum(float(row[source]) for row in selected) / 180,
                                aggregate[target], abs_tol=1e-12)
        for reference, source, target in [
            ("stable", "false_unstable", "false_unstable_conditional_rate"),
            ("unstable", "false_stable", "false_stable_conditional_rate"),
        ]:
            conditioned = [row for row in selected if row["original_verdict"] == reference]
            assert math.isclose(sum(int(row[source]) for row in conditioned) / len(conditioned),
                                aggregate[target], abs_tol=1e-12)
    provenance = {
        "purpose": "Publication-inspired explanatory figures, not a certification of journal submission compliance",
        "input_archive_name": path.name,
        "inputs": entries,
        "validation": {
            "rows": 2520, "reference_cases": 30,
            "evaluations_per_method_and_budget": 180,
            "sampling_instances_per_method_and_budget": 18,
            "scales_per_sampling_instance": 10,
            "reference_stable_evaluations_per_method_budget": 96,
            "reference_unstable_evaluations_per_method_budget": 84,
            "max_scale_duplicate_epsilon_spread": epsilon_spread,
            "all_plotted_summary_aggregates_match_csv": True,
            "all_conclusive_certificates_match_reference_verdict": True,
        },
        "scope": "24-node synthetic undirected positive-weight networks; homogeneous-equilibrium linear instability only",
        "comparison": "Equal draws with replacement, not equal unique retained edges or equal runtime",
        "inference": "Descriptive summaries; 180 evaluations are not 180 independent sampling instances",
        "spectral_distortion_deduplication": "Select the smallest Laplacian scale for each method/draw/graph_seed/replicate after confirming all 10 scale duplicates agree to 1e-10",
        "schematic_intervals": "All illustrated intervals use epsilon=0.2 and are hypothetical, not sampled eigenvalues",
        "style_references": [
            "https://research-figure-guide.nature.com/figures/preparing-figures-our-specifications/",
            "https://conferences.ieeeauthorcenter.ieee.org/write-your-paper/improve-your-graphics/",
        ],
    }
    return summary, rows, provenance


def styling(ieee: bool = False) -> None:
    plt.rcParams.update({
        "font.family": "Times New Roman" if ieee else "Arial", "font.size": 9,
        "axes.labelsize": 9, "axes.titlesize": 9, "legend.fontsize": 8.5,
        "text.color": BLACK, "axes.labelcolor": BLACK, "axes.edgecolor": BLACK,
        "xtick.color": BLACK, "ytick.color": BLACK,
        "axes.linewidth": 0.7, "figure.facecolor": "white", "axes.facecolor": "white",
        "savefig.facecolor": "white", "svg.fonttype": "none", "pdf.fonttype": 42,
        "ps.fonttype": 42, "mathtext.default": "regular", "axes.unicode_minus": True,
    })


def clean_axes(ax: plt.Axes) -> None:
    ax.spines[["top", "right"]].set_visible(False)
    ax.tick_params(direction="out", length=3, width=0.7)


def budget_axis(ax: plt.Axes, mobile: bool = False) -> None:
    clean_axes(ax)
    ax.set_xscale("log")
    ax.set_xlim(17, 850)
    ax.set_xticks(DRAWS, [str(draws) for draws in DRAWS], rotation=0 if mobile else 40,
                  ha="center" if mobile else "right", rotation_mode="anchor")
    ax.xaxis.set_minor_locator(NullLocator())
    ax.set_xlabel("Sampling draws", labelpad=4)


def panel_letter(ax: plt.Axes, letter: str, x: float = -0.18) -> None:
    ax.text(x, 1.13, letter, transform=ax.transAxes, fontsize=10, fontweight="bold",
            color=BLACK, ha="left", va="bottom")


def save(fig: plt.Figure, name: str, title: str, description: str, pdf: bool = True,
         formats: list[str] | None = None) -> None:
    for extension in formats or (["svg", "png"] + (["pdf"] if pdf else [])):
        metadata = {"Title": title, "Description": description, "Date": None} if extension == "svg" else None
        destination = OUT / f"{name}.{extension}"
        fig.savefig(destination, dpi=300, metadata=metadata)
        if extension == "svg":
            svg = destination.read_text(encoding="utf-8")
            svg = svg.replace("<svg ", '<svg role="img" aria-labelledby="figure-title figure-description" ', 1)
            svg = svg.replace("<title>", '<title id="figure-title">', 1)
            svg = svg.replace("</title>", '</title>\n <desc id="figure-description">' + html.escape(description) + "</desc>", 1)
            # Explicit attributes also remain machine-readable when font names
            # contain quotation marks inside Matplotlib's style attribute.
            svg = svg.replace("<text ", '<text fill="#111" ')
            destination.write_text(svg, encoding="utf-8")
    plt.close(fig)


def band_certificate(mobile: bool = False) -> None:
    if mobile:
        fig, axes = plt.subplots(2, 1, figsize=(3.75, 7.4))
        fig.subplots_adjust(left=0.19, right=0.965, top=0.92, bottom=0.16, hspace=0.60)
    else:
        fig, axes = plt.subplots(1, 2, figsize=(7.6, 3.65), gridspec_kw={"width_ratios": [1, 1.35]})
        fig.subplots_adjust(left=0.09, right=0.975, top=0.83, bottom=0.25, wspace=0.42)
    left, right = axes
    q = np.linspace(0, 7, 701)
    determinant = 0.1 * (q - 2) * (q - 5)
    left.axvspan(2, 5, color="#E8F1F6", zorder=0)
    left.plot(q, determinant, color="#0072B2", linewidth=1.7)
    left.axhline(0, color=BLACK, linewidth=0.75)
    left.scatter([2, 5], [0, 0], s=22, facecolors="white", edgecolors=BLACK, zorder=5)
    left.set(xlim=(0, 7), ylim=(-0.30, 1.12), xlabel="Laplacian eigenvalue q",
             ylabel="det(J − qD)", xticks=[0, 2, 3.5, 5, 7], yticks=[-0.2, 0, 0.5, 1])
    left.set_title("Exact instability band", pad=12)
    left.text(3.5, 0.50, "2 < q < 5\nlinear instability", ha="center", va="center", color=BLACK)
    left.text(0.02, 0.96, "0.1(q − 2)(q − 5)", transform=left.transAxes,
              ha="left", va="top", fontsize=8.3, color=BLACK)
    clean_axes(left)
    panel_letter(left, "a", -0.18 if mobile else -0.24)

    right.axvspan(2, 5, color="#E8F1F6", zorder=0)
    right.axvline(2, color=BLACK, linewidth=0.65, linestyle=":")
    right.axvline(5, color=BLACK, linewidth=0.65, linestyle=":")
    # Each interval is s/(1+.2) to s/(1-.2); ratio of endpoints = 1.5.
    examples = [
        (2.45, "UNSTABLE", [(0.4, 0.6), (2.6, 3.9), (6.5, 9.75)],
         "One full interval inside (2,5)"),
        (1.45, "NO UNSTABLE MODE", [(0.4, 0.6), (1.0, 1.5), (6.5, 9.75)],
         "Every interval excludes [2,5]"),
        (0.45, "INCONCLUSIVE", [(0.4, 0.6), (1.6, 2.4), (4.0, 6.0)],
         "Neither condition is met"),
    ]
    for y, label, intervals, explanation in examples:
        right.text(0.02, y + 0.32, label, ha="left", va="bottom", color=BLACK,
                   fontsize=8.5 if mobile else 8.1, fontweight="bold", zorder=5,
                   bbox={"facecolor": "white", "edgecolor": "none", "pad": 1.0})
        for a, b in intervals:
            right.plot([a, b], [y, y], color=BLACK, linewidth=1.5)
            right.plot([a, a], [y - 0.07, y + 0.07], color=BLACK, linewidth=0.8)
            right.plot([b, b], [y - 0.07, y + 0.07], color=BLACK, linewidth=0.8)
        right.text(0.02, y - 0.17, explanation, ha="left", va="top", color=BLACK,
                   fontsize=7.7 if mobile else 7.5, zorder=5,
                   bbox={"facecolor": "white", "edgecolor": "none", "pad": 1.0})
    right.set(xlim=(0, 10), ylim=(-0.05, 3.07), xlabel="Possible original eigenvalue q",
              xticks=[0, 2, 5, 10], yticks=[])
    right.set_title("Three certificate outcomes", pad=12)
    clean_axes(right)
    right.spines["left"].set_visible(False)
    panel_letter(right, "b", -0.12)
    if mobile:
        fig.text(0.035, 0.052, "Schematic intervals: ε = 0.2; endpoints are neutral.", fontsize=7.3)
        fig.text(0.035, 0.025, "A stable conclusion requires every mode to be checked.", fontsize=7.3)
    else:
        fig.text(0.09, 0.095, "trace(J − qD) = −0.2 − 1.1q < 0; q = 2 and 5 are neutral, not strictly stable.", fontsize=8)
        fig.text(0.09, 0.037, "Intervals are schematic (ε = 0.2). A no-instability conclusion checks every mode and excludes neutral endpoints.", fontsize=8)
    save(fig, "band-certificate" + ("-mobile" if mobile else ""),
         "Exact Turing instability band and three logically distinct certificate outcomes",
         "For the stated Schnakenberg model, determinant 0.1(q−2)(q−5) is negative exactly for 2<q<5 while trace stays negative. Endpoints q=2 and5 are neutral. Hypothetical eigenvalue intervals with epsilon0.2 illustrate: one entire interval strictly inside the band proves original instability; all intervals strictly outside the closed band exclude unstable and neutral modes; otherwise the outcome is inconclusive. Checking one outside interval never proves stability.",
         pdf=not mobile)


def budget_outcomes(summary: dict, mobile: bool = False, ieee: bool = False) -> None:
    styling(ieee)
    panels = [
        ("mean_retained_fraction", "Retained unique edges", "Retained edges (%)"),
        ("verdict_disagreement_rate", "Sparse verdict disagreement", "Disagreement (%)"),
        ("conclusive_certificate_rate", "Conclusive certificates", "Conclusive (%)"),
    ]
    if mobile:
        fig, axes = plt.subplots(3, 1, figsize=(3.75, 8.8))
        fig.subplots_adjust(left=0.20, right=0.965, top=0.90, bottom=0.09, hspace=0.69)
    else:
        fig, axes = plt.subplots(1, 3, figsize=(7.6, 3.15))
        fig.subplots_adjust(left=0.075, right=0.988, top=0.79, bottom=0.27, wspace=0.52)
    handles = []
    for index, (key, title, ylabel) in enumerate(panels):
        ax = axes[index]
        for method, label, color, marker, linestyle in METHODS:
            values = sorted([row for row in summary["by_method_and_draws"] if row["method"] == method], key=lambda row: row["draws"])
            line, = ax.plot(DRAWS, [100 * row[key] for row in values], color=color, marker=marker,
                            linestyle=linestyle, linewidth=1.45, markersize=4,
                            markerfacecolor="white", markeredgewidth=0.8, label=label)
            if index == 0:
                handles.append(line)
        budget_axis(ax, mobile)
        ax.set(ylim=(-2, 104), yticks=[0, 25, 50, 75, 100], ylabel=ylabel)
        ax.set_title(title, pad=11)
        panel_letter(ax, chr(97 + index), -0.24)
    fig.legend(handles=handles, loc="upper center", bbox_to_anchor=(0.53, 0.995),
               ncol=1 if mobile else 2, frameon=False, handlelength=2.8)
    note = "Equal draws with replacement; distinct-edge counts differ."
    fig.text(0.035 if mobile else 0.075, 0.033, note, fontsize=7.7 if mobile else 8)
    name = "budget-outcomes" + ("-mobile" if mobile else "") + ("-ieee" if ieee else "")
    save(fig, name, "Draw budget versus edge retention, verdict disagreement and conclusive certification",
         "Three descriptive panels compare effective-resistance sampling, blue circles and solid lines, with uniform sampling, vermilion squares and dashed lines, at20,40,70,110,170,350 and700 draws with replacement. At110 draws effective resistance retains68.05percent of distinct edges, disagrees in63of180 evaluations and has0of180 conclusive certificates. Each method/budget contains180 graph-scale evaluations from18 sampling instances reused across10 scales. Comparisons match draws, not distinct edges or runtime. No confidence interval or superiority claim is implied.",
         pdf=not mobile, formats=["pdf"] if ieee else None)
    styling()


def conditional_errors(rows: list[dict], mobile: bool = False) -> None:
    if mobile:
        fig, axes = plt.subplots(2, 1, figsize=(3.75, 6.7))
        fig.subplots_adjust(left=0.20, right=0.965, top=0.87, bottom=0.13, hspace=0.68)
    else:
        fig, axes = plt.subplots(1, 2, figsize=(7.6, 3.5))
        fig.subplots_adjust(left=0.085, right=0.98, top=0.78, bottom=0.28, wspace=0.34)
    handles = []
    for index, (column, denominator, title, ymax) in enumerate([
        ("false_unstable", 96, "False unstable | reference stable", 100),
        ("false_stable", 84, "False stable | reference unstable", 1.5),
    ]):
        ax = axes[index]
        for method, label, color, marker, linestyle in METHODS:
            counts = [sum(int(row[column]) for row in rows if row["method"] == method and int(row["draws"]) == draws) for draws in DRAWS]
            line, = ax.plot(DRAWS, np.asarray(counts) / denominator * 100, color=color, marker=marker,
                            linestyle=linestyle, linewidth=1.45, markersize=4,
                            markerfacecolor="white", markeredgewidth=0.8, label=label)
            if index == 0:
                handles.append(line)
        budget_axis(ax, mobile)
        ax.set_ylim(-ymax * 0.025, ymax)
        ax.set_yticks([0, 25, 50, 75, 100] if index == 0 else [0, 0.5, 1, 1.5])
        ax.set_ylabel("Conditional error (%)")
        ax.set_title(title + f"\nDenominator: {denominator} evaluations", pad=10)
        panel_letter(ax, chr(97 + index), -0.23 if mobile else -0.17)
        if index == 1:
            ax.annotate("1/84", xy=(20, 100 / 84), xytext=(38, 1.27), fontsize=8, color=BLACK,
                        arrowprops={"arrowstyle": "-", "color": BLACK, "lw": 0.7})
            ax.text(0.98, 0.86, "All other counts = 0/84", transform=ax.transAxes,
                    ha="right", va="top", fontsize=8, color=BLACK)
        else:
            ax.annotate("63/96", xy=(110, 63 / 96 * 100), xytext=(155, 82), color=BLACK,
                        fontsize=8, arrowprops={"arrowstyle": "-", "color": BLACK, "lw": 0.7})
            ax.annotate("57/96", xy=(110, 57 / 96 * 100), xytext=(155, 47), color=BLACK,
                        fontsize=8, arrowprops={"arrowstyle": "-", "color": BLACK, "lw": 0.7})
    fig.legend(handles=handles, loc="upper center", bbox_to_anchor=(0.53, 0.995),
               ncol=1 if mobile else 2, frameon=False, handlelength=2.8)
    if mobile:
        fig.text(0.035, 0.055, "Different y-axis scales: 0–100% and 0–1.5%.", fontsize=7.7)
        fig.text(0.035, 0.026, "Counts are graph-scale evaluations, not independent trials.", fontsize=7.3)
    else:
        fig.text(0.085, 0.10, "Different y-axis scales: 0–100% at left; 0–1.5% at right. Numerators count sparse-verdict errors.", fontsize=8)
        fig.text(0.085, 0.045, "Each method/budget: 96 reference-stable and 84 reference-unstable graph-scale evaluations; samples are reused across scales.", fontsize=7.4)
    save(fig, "conditional-errors" + ("-mobile" if mobile else ""),
         "Conditional sparse-verdict errors with explicit denominators and different vertical scales",
         "False-unstable errors are divided by96 reference-stable graph-scale evaluations per method and draw budget. False-stable errors are divided by84 reference-unstable evaluations. At110 draws the false-unstable counts are63of96 for effective resistance and57of96 for uniform. The only false-stable observation is1of84 for effective resistance at20draws; every other method-budget false-stable count is0of84. Left vertical scale is0to100percent and right scale0to1.5percent. Zero observed misses is not a bound on population risk. Evaluations reuse18 underlying samples across10 scales.",
         pdf=not mobile)


def spectral_distortion(rows: list[dict], mobile: bool = False) -> None:
    if mobile:
        fig, ax = plt.subplots(figsize=(3.75, 4.4))
        fig.subplots_adjust(left=0.20, right=0.965, top=0.77, bottom=0.25)
    else:
        fig, ax = plt.subplots(figsize=(7.6, 3.65))
        fig.subplots_adjust(left=0.085, right=0.98, top=0.81, bottom=0.31)
    handles = []
    for method, label, color, marker, linestyle in METHODS:
        unique = {}
        for row in sorted(rows, key=lambda row: float(row["scale"])):
            if row["method"] == method:
                unique.setdefault((int(row["draws"]), row["graph_seed"], row["replicate"]), float(row["spectral_distortion"]))
        medians = []
        for draws in DRAWS:
            values = [value for (budget, _, _), value in unique.items() if budget == draws]
            assert len(values) == 18
            ax.scatter([draws] * 18, values, color=color, marker=marker, s=17, alpha=0.40,
                       linewidths=0.6, facecolors="none", zorder=2)
            medians.append(float(np.median(values)))
        line, = ax.plot(DRAWS, medians, color=color, marker=marker, linestyle=linestyle,
                        linewidth=1.6, markersize=5, markerfacecolor="white", markeredgewidth=0.9,
                        label=label + " median", zorder=4)
        handles.append(line)
    ax.axhline(1, color=BLACK, linewidth=0.9, linestyle=":", zorder=1)
    ax.text(0.99, 0.235, "ε = 1", transform=ax.transAxes, ha="right", va="bottom", fontsize=8, color=BLACK)
    budget_axis(ax, mobile)
    ax.set(ylim=(0, 5), yticks=[0, 1, 2, 3, 4, 5], ylabel="Posterior Loewner distortion ε")
    ax.set_title("18 unique sampling instances per method/budget", pad=10)
    panel_letter(ax, "a", -0.18 if mobile else -0.06)
    fig.legend(handles=handles, loc="upper center", bbox_to_anchor=(0.54, 0.995),
               ncol=1 if mobile else 2, frameon=False, handlelength=2.8)
    if mobile:
        fig.text(0.035, 0.12, "Points: 18 samples; lines: descriptive medians.", fontsize=7.8)
        fig.text(0.035, 0.077, "Scale duplicates removed; no uncertainty interval.", fontsize=7.8)
        fig.text(0.035, 0.034, "ε < 1 is necessary for this rule, not a conclusion.", fontsize=7.5)
    else:
        fig.text(0.085, 0.10, "Small markers: individual samples; lines: medians. Ten scale duplicates are removed; no uncertainty interval.", fontsize=8)
        fig.text(0.085, 0.045, "ε < 1 is necessary for this two-sided interval rule, but does not ensure a conclusive certificate. Reference eigensystems are required.", fontsize=7.5)
    save(fig, "spectral-distortion" + ("-mobile" if mobile else ""),
         "Posterior spectral distortion after removing reused Laplacian-scale duplicates",
         "At every draw budget and for each method,18 points represent the three graph seeds times six sampling replicates, with10 scale duplicates removed. Lines show descriptive medians. The dotted horizontal epsilon1 line marks the requirement epsilon<1 for the stated two-sided eigenvalue interval rule; crossing below it is not sufficient for conclusive certification. Epsilon is computed using dense reference eigensystems; no scalable or end-to-end runtime result is established.",
         pdf=not mobile)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-zip", type=Path, required=True)
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    summary, rows, provenance = load_archive(args.source_zip)
    styling()
    for mobile in [False, True]:
        band_certificate(mobile)
        budget_outcomes(summary, mobile)
        conditional_errors(rows, mobile)
        spectral_distortion(rows, mobile)
    budget_outcomes(summary, ieee=True)
    (OUT / "figure-provenance.json").write_text(json.dumps(provenance, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(OUT), "validation": provenance["validation"],
                      "files": sorted(path.name for path in OUT.iterdir())}, indent=2))


if __name__ == "__main__":
    main()
