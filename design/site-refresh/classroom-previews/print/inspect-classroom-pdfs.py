"""Inspect the current eight classroom PDFs after render completion.

Uses local pdfplumber/PDFium only. Does not render a browser, rebuild the site,
or read learner storage. The manifest must match the current classroom sources.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import logging
import re
import subprocess
import unicodedata
from pathlib import Path

logging.getLogger("pdfminer").setLevel(logging.ERROR)
import pdfplumber
import pypdfium2 as pdfium
from PIL import Image, ImageDraw


def compact(value: str) -> str:
    # The installed CJK PDF font maps 長 to the visually equivalent radical ⻑.
    # NFKC normalizes Kangxi radicals, but does not normalize this supplement.
    value = unicodedata.normalize("NFKC", value).replace("\u2ed1", "長")
    return re.sub(r"[\s\u200b\u200c\u200d\ufeff]+", "", value)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def registry(workspace: Path, node: str) -> dict:
    source = (workspace / "src/data/classroom-packs.mjs").as_uri()
    program = (
        f"import {{CLASSROOM_PACKS,classroomPackHref,classroomEngineHref,classroomSettingRows}} from {json.dumps(source)};"
        "console.log(JSON.stringify(Object.fromEntries(CLASSROOM_PACKS.map(pack=>[pack.id,{...pack,"
        "routes:Object.fromEntries(['en','zh-Hant'].map(locale=>[locale,{"
        "student:classroomPackHref(pack.id,locale),teacher:classroomPackHref(pack.id,locale,true),"
        "engine:classroomEngineHref(pack,locale)}])),"
        "settingRows:Object.fromEntries(['en','zh-Hant'].map(locale=>[locale,classroomSettingRows(pack.id,{},locale)]))}]))));"
    )
    result = subprocess.run([node, "--input-type=module", "-e", program], cwd=workspace,
                            check=True, capture_output=True, encoding="utf-8")
    return json.loads(result.stdout)


def page_bounds(page) -> dict:
    nonblank = [char for char in page.chars if char["text"].strip()]
    outside = [char for char in nonblank if char["x0"] < -0.5 or char["x1"] > page.width + 0.5
               or char["top"] < -0.5 or char["bottom"] > page.height + 0.5]
    # CSS @page: A4; 16mm top, 15mm sides, 18mm bottom. Allow 2pt rounding.
    margins = [char for char in nonblank if char["x0"] < 15 * 72 / 25.4 - 2
               or char["x1"] > page.width - 15 * 72 / 25.4 + 2
               or char["top"] < 16 * 72 / 25.4 - 2
               or char["bottom"] > page.height - 18 * 72 / 25.4 + 2]
    sample = lambda chars: [{"text": char["text"], "x0": round(char["x0"], 2),
                             "x1": round(char["x1"], 2), "top": round(char["top"], 2),
                             "bottom": round(char["bottom"], 2)} for char in chars[:12]]
    return {"widthPt": round(page.width, 3), "heightPt": round(page.height, 3),
            "visibleCharacters": len(nonblank), "outsidePageCount": len(outside),
            "contentBottomPt": round(max((char["bottom"] for char in nonblank), default=0), 3),
            "outsidePageSamples": sample(outside), "outsideCssMarginsCount": len(margins),
            "outsideCssMarginsSamples": sample(margins)}


def make_contact_sheet(directory: Path, filename: str, previews: list[str]) -> str:
    width, height = 315, 470
    columns = min(3, len(previews))
    rows = (len(previews) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * width, rows * height), "#e7e7e7")
    draw = ImageDraw.Draw(sheet)
    for index, preview in enumerate(previews):
        image = Image.open(directory / preview).convert("RGB")
        image.thumbnail((295, 435))
        x, y = (index % columns) * width + 10, (index // columns) * height + 24
        sheet.paste(image, (x, y))
        draw.text((x, y - 17), preview.rsplit("-page-", 1)[-1], fill="black")
    output = f"{Path(filename).stem}-contact.png"
    sheet.save(directory / output)
    return output


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--directory", type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument("--workspace", type=Path, default=Path(__file__).resolve().parents[4])
    parser.add_argument("--node", default="node")
    args = parser.parse_args()
    directory, workspace = args.directory.resolve(), args.workspace.resolve()
    manifest_path = directory / "render-manifest.json"
    if not manifest_path.exists():
        raise SystemExit("Render completion required: render-manifest.json does not exist.")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    packs = registry(workspace, args.node)
    errors: list[str] = []
    source_checks = {name: sha256(workspace / name) == expected
                     for name, expected in manifest["sourceHashes"].items()}
    if not source_checks or not all(source_checks.values()):
        raise SystemExit(f"Refusing stale PDF review: source hash mismatch {source_checks}")
    expected_documents = {(pack_id, role, locale) for pack_id in packs
                          for role in ["student", "teacher"] for locale in ["en", "zh-Hant"]}
    documents = manifest["documents"]
    actual_documents = [(item["packId"], item["role"], item["locale"]) for item in documents]
    if len(actual_documents) != 8 or set(actual_documents) != expected_documents:
        raise SystemExit("Expected exactly eight unique bilingual student/teacher documents.")
    results = []
    for item in documents:
        filename, pack_id, role, locale = (item[key] for key in ["filename", "packId", "role", "locale"])
        path = directory / filename
        if path.parent != directory or path.suffix != ".pdf":
            raise SystemExit(f"Invalid manifest PDF filename: {filename}")
        pack, teacher = packs[pack_id], role == "teacher"
        route = pack["routes"][locale][role]
        built_path = workspace / "dist" / route.strip("/") / "index.html"
        pdf_hash_ok = sha256(path) == item["sha256"]
        built_hash_ok = sha256(built_path) == item["builtHtmlSha256"]
        if not pdf_hash_ok or not built_hash_ok or item["route"] != route:
            raise SystemExit(f"PDF/build/route mismatch for {filename}")
        with pdfplumber.open(path) as pdf:
            texts = [page.extract_text() or "" for page in pdf.pages]
            contents = compact("\n".join(texts))
            page_details = []
            math_texts = []
            selected = {0, len(pdf.pages) - 1}
            for index, page in enumerate(pdf.pages):
                bounds = page_bounds(page)
                bounds["page"] = index + 1
                math_chars = [char for char in page.chars if "KaTeX" in char["fontname"]]
                bounds["mathGlyphCount"] = len(math_chars)
                bounds["mathFontNames"] = sorted({char["fontname"] for char in math_chars})
                math_text = compact("".join(char["text"] for char in math_chars))
                math_texts.append(math_text)
                page_details.append(bounds)
                page_text = compact(texts[index])
                if math_chars or any(compact(label) in page_text for label in [
                    "Printable worksheet" if locale == "en" else "可列印工作紙",
                    "Settings to apply manually" if locale == "en" else "手動套用的設定"
                ]):
                    selected.add(index)
            teacher_passages = [stage["teacher"][locale] for stage in pack["stages"]] + [pack["exitAnswer"][locale]]
            passages_found = [text for text in teacher_passages if compact(text) in contents]
            teacher_separator_ok = len(passages_found) == len(teacher_passages) if teacher else not passages_found
            math_all = "".join(math_texts)
            is_tank = pack_id == "mixing-tank"
            formula_checks = {
                "hasKaTeXGlyphs": bool(math_all),
                "hasBalanceSignature": "kVC" in math_all,
                "hasSteadyInfinityGlyph": "∞" in math_all,
            }
            if is_tank:
                formulas_ok = bool(math_all) and (formula_checks["hasBalanceSignature"] == teacher) and (formula_checks["hasSteadyInfinityGlyph"] == teacher)
            else:
                formulas_ok = True
            guide_url = "https://skckenneth.github.io" + route
            engine_url = "https://skckenneth.github.io" + pack["routes"][locale]["engine"]
            settings_heading = compact("Settings to apply manually" if locale == "en" else "手動套用的設定")
            output_heading = compact("Keep this evidence" if locale == "en" else "留下這些證據")
            settings_text = contents.split(settings_heading, 1)[-1].split(output_heading, 1)[0] if settings_heading in contents else ""
            settings_checks = [{**row, "labelFound": compact(row["label"]) in settings_text,
                                "valueFound": compact(row["value"]) in settings_text}
                               for row in pack["settingRows"][locale]] if not teacher else []
            current_settings_ok = teacher or all(row["labelFound"] and row["valueFound"] for row in settings_checks)
            hidden_ui = [label for label in ["Print tasks and worksheet", "Print teacher reference", "Projection mode", "Exit projection (Esc)",
                                            "Copy link", "列印任務及工作紙", "列印教師參考", "投影模式", "結束投影（Esc）", "複製連結"]
                         if compact(label) in contents]
            replacements = "\n".join(texts).count("\ufffd")
            cid_matches = re.findall(r"\(cid:\d+\)", "\n".join(texts))
            a4 = all(abs(page["widthPt"] - 595.276) < 1 and abs(page["heightPt"] - 841.89) < 1 for page in page_details)
            result = {**item, "pdfHashMatches": pdf_hash_ok, "builtHtmlHashMatches": built_hash_ok,
                      "pageCount": len(page_details), "a4": a4,
                      "hasGuideUrl": compact(guide_url) in contents, "hasOriginalEngineUrl": compact(engine_url) in contents,
                      "teacherContentSeparated": teacher_separator_ok,
                      "currentSettingsPrinted": current_settings_ok, "currentSettingsRows": settings_checks,
                      "settingsScenario": "Default route; the renderer supplies no preset/seed query. Custom settings require separate browser/print verification.",
                      "teacherPassagesFound": len(passages_found), "expectedTeacherPassages": len(teacher_passages) if teacher else 0,
                      "formulasExpectedForRole": formulas_ok, "formulaChecks": formula_checks,
                      "replacementCharacterCount": replacements, "unmappedCidSamples": sorted(set(cid_matches))[:15],
                      "hiddenControlTextFound": hidden_ui, "pages": page_details}
            failed = [key for key in ["a4", "hasGuideUrl", "hasOriginalEngineUrl", "teacherContentSeparated", "formulasExpectedForRole", "currentSettingsPrinted"] if not result[key]]
            if replacements or hidden_ui or any(page["outsidePageCount"] for page in page_details):
                failed.append("replacement/hidden-ui/off-page-text")
            if failed:
                errors.append(f"{filename}: {', '.join(failed)}")
            (directory / f"{path.stem}-text.txt").write_text("\n\n".join(f"--- Page {index + 1} ---\n{text}" for index, text in enumerate(texts)), encoding="utf-8")
        rendered = pdfium.PdfDocument(path)
        previews = []
        for index in sorted(selected):
            output = f"{path.stem}-page-{index + 1}.png"
            page = rendered[index]
            bitmap = page.render(scale=1.5)
            raster = bitmap.to_pil().convert("RGB")
            raster.save(directory / output)
            if index == len(page_details) - 1:
                bottom_text = page_details[index]["contentBottomPt"]
                x0, x1 = round(15 * 72 / 25.4 * 1.5), raster.width - round(15 * 72 / 25.4 * 1.5)
                y0 = round((bottom_text + 12) * 1.5)
                y1 = raster.height - round(18 * 72 / 25.4 * 1.5)
                if y1 > y0 and x1 > x0:
                    tail = raster.crop((x0, y0, x1, y1))
                    count = sum(abs(r - 245) <= 2 and abs(g - 243) <= 2 and abs(b - 237) <= 2
                                for r, g, b in tail.getdata())
                    result["emptyLastPageTail"] = {"pixels": tail.width * tail.height,
                                                   "ivoryPaperPixels": count,
                                                   "ivoryFraction": round(count / (tail.width * tail.height), 6)}
                    if count / (tail.width * tail.height) > 0.01:
                        errors.append(f"{filename}: ivory background in empty last-page tail")
            bitmap.close()
            page.close()
            previews.append(output)
        rendered.close()
        result["previews"] = previews
        result["contactSheet"] = make_contact_sheet(directory, filename, previews)
        results.append(result)
        print(f"{filename}: {result['pageCount']} pages; A4={a4}; separated={teacher_separator_ok}; formulas={formulas_ok}; offpage={sum(page['outsidePageCount'] for page in page_details)}")
    report = {"method": "Actual PDFs: pdfplumber page geometry, text, font glyphs and bounds; PDFium selected-page rasterization. No browser control.",
              "limits": "Text extraction and glyph signatures supplement selected-page visual inspection; they cannot establish screen-reader tagging or prove all pagination/layout. Text matching applies NFKC plus the PDF font's visually equivalent CJK radical ⻑ to 長 mapping. CSS-margin outliers are diagnostic; physical-page outliers fail. Private/cid glyphs require visual review.",
              "renderedAt": manifest["renderedAt"], "sourceBaseCommit": manifest["sourceBaseCommit"],
              "sourceHashesMatch": source_checks, "errors": errors, "documents": results}
    (directory / "classroom-pdf-inspection.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if errors:
        print("\n".join(errors))
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
