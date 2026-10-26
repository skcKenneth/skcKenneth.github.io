"""Independently audit actual browser-generated Senior 1 A4 PDFs.

Run with the bundled Python and --directory .tmp/g10-inquiries-qa (the default).
PyMuPDF is preferred; pdfplumber is an explicit fallback when it is unavailable.
The catalogue is read through Node, never inferred from the browser's DOM counts.
The optional print-expectations.json format is {"chapters": [...], "inquiries":
[{"id": ..., "chapter": ..., "title": {locale: text}, "exit": {"prompt":
{locale: text}, "answer": {locale: text}}}]}. It is used only if Node cannot load
the live source catalogue, and that fallback is recorded in the audit report.
"""
from __future__ import annotations

import argparse
from collections import Counter
from datetime import datetime, timezone
import hashlib
import io
import json
import logging
import math
from pathlib import Path
import re
import shutil
import subprocess
import sys
import unicodedata


ROOT = Path(__file__).resolve().parents[1]
LOCALES = ("en", "zh-Hant")
ACTIVITY_ID = re.compile(r"g10-\d{2}-\d{2}", re.IGNORECASE)
TEACHER_LABEL = re.compile(r"\bteacher\b|教師版|教師參考", re.IGNORECASE)
# Chromium subset fonts can omit FontBBox. pdfminer still extracts character
# boxes; keep this recoverable descriptor warning from obscuring audit failures.
logging.getLogger("pdfminer").setLevel(logging.ERROR)


def normalize(value: str) -> str:
    """Allow PDF line wrapping/compatibility glyphs, retaining all answer content."""
    text = unicodedata.normalize("NFKC", value)
    # Chromium's CJK subset fonts can map these visually identical glyphs to
    # radical-supplement code points, which NFKC does not itself unify.
    text = text.translate(str.maketrans({"−": "-", "‐": "-", "‑": "-", "‒": "-", "–": "-", "—": "-", "’": "'", "‘": "'", "“": '"', "”": '"', "⻑": "長", "⺟": "母"}))
    return re.sub(r"\s+|[\u200b\u200c\u200d\ufeff\u00ad]", "", text)


def load_expectations(directory: Path) -> tuple[dict, str]:
    program = (
        "import {chapters,inquiries} from './src/data/g10-inquiries.mjs';"
        "console.log(JSON.stringify({chapters,inquiries:inquiries.map(a=>"
        "({id:a.id,chapter:a.chapter,title:a.title,exit:a.exit}))}));"
    )
    node = shutil.which("node")
    node_error = "Node executable unavailable"
    if node:
        try:
            completed = subprocess.run(
                [node, "--input-type=module", "-e", program], cwd=ROOT,
                capture_output=True, text=True, encoding="utf-8", check=True,
                timeout=60,
            )
            return json.loads(completed.stdout), "live source catalogue via Node"
        except (OSError, subprocess.SubprocessError, ValueError) as error:
            node_error = str(error)
    snapshot = directory / "print-expectations.json"
    if snapshot.exists():
        data = json.loads(snapshot.read_text(encoding="utf-8"))
        if isinstance(data, dict) and isinstance(data.get("chapters"), list) and isinstance(data.get("inquiries"), list):
            return data, "print-expectations.json fallback after Node failure"
    raise RuntimeError(f"Cannot load independent source expectations: {node_error}")


def select_engine():
    try:
        import pymupdf
        return "PyMuPDF", getattr(pymupdf, "VersionBind", "unknown"), pymupdf
    except ImportError:
        try:
            import fitz
            if hasattr(fitz, "open") and hasattr(fitz, "Rect"):
                return "PyMuPDF", getattr(fitz, "VersionBind", "unknown"), fitz
        except ImportError:
            pass
    try:
        import pdfplumber
        return "pdfplumber fallback", getattr(pdfplumber, "__version__", "unknown"), pdfplumber
    except ImportError as error:
        raise RuntimeError("Install PyMuPDF or use the bundled Python with pdfplumber.") from error


def extracted_pages(data: bytes, engine_name: str, engine) -> list[dict]:
    pages = []
    if engine_name == "PyMuPDF":
        with engine.open(stream=data, filetype="pdf") as document:
            if document.needs_pass:
                raise ValueError("PDF is encrypted and requires a password")
            for page in document:
                bounds = page.rect
                # An unbounded extraction rectangle also exposes text outside the
                # media box, which default page-clipped extraction can omit.
                raw = page.get_text("rawdict", clip=engine.Rect(-1e6, -1e6, 1e6, 1e6))
                characters = []
                for block in raw.get("blocks", []):
                    for line in block.get("lines", []):
                        for span in line.get("spans", []):
                            for character in span.get("chars", []):
                                characters.append({"text": character.get("c", ""), "bbox": list(character["bbox"])})
                pages.append({
                    "width": bounds.width, "height": bounds.height,
                    "text": page.get_text("text"), "characters": characters,
                })
    else:
        with engine.open(io.BytesIO(data)) as document:
            for page in document.pages:
                pages.append({
                    "width": float(page.width), "height": float(page.height),
                    # Six points keeps inline Unicode subscripts/superscripts
                    # in their visual line; body baselines are over 12pt apart.
                    "text": page.extract_text(x_tolerance=2, y_tolerance=6) or "",
                    "characters": [{"text": c.get("text", ""), "bbox": [c["x0"], c["top"], c["x1"], c["bottom"]]} for c in page.chars],
                })
    return pages


def audit_pdf(data: bytes, entry: dict, expected: list[dict], engine_name: str, engine, tolerance: float = 1.5) -> dict:
    teacher = entry["teacher"]
    locale = entry["locale"]
    expected_pages = len(expected) if teacher else math.ceil(len(expected) / 2)
    result = {
        "file": entry["file"], "locale": locale, "chapter": entry["chapter"],
        "teacher": teacher, "count": len(expected), "sha256": hashlib.sha256(data).hexdigest(),
        "expectedPages": expected_pages, "pages": 0, "pageResults": [], "failures": [],
        "requiredIds": [activity["id"] for activity in expected],
    }
    errors = result["failures"]
    try:
        pages = extracted_pages(data, engine_name, engine)
    except Exception as error:
        errors.append({"check": "readable PDF", "detail": str(error)})
        result["status"] = "failed"
        return result
    result["pages"] = len(pages)
    if len(pages) != expected_pages:
        errors.append({"check": "page count", "expected": expected_pages, "actual": len(pages)})
    all_text = "\n".join(page["text"] for page in pages)
    # The printed eyebrow deliberately uses CSS text-transform: uppercase.
    id_counts = Counter(value.lower() for value in ACTIVITY_ID.findall(all_text))
    required_ids = {activity["id"] for activity in expected}
    for activity_id in sorted(required_ids):
        if id_counts[activity_id] != 1:
            errors.append({"check": "activity ID exactly once", "id": activity_id, "actual": id_counts[activity_id]})
    unexpected_ids = sorted(set(id_counts) - required_ids)
    if unexpected_ids:
        errors.append({"check": "unexpected chapter activities", "ids": unexpected_ids})
    labels = TEACHER_LABEL.findall(all_text)
    if teacher and not labels:
        errors.append({"check": "teacher edition clearly labelled"})
    if not teacher and labels:
        errors.append({"check": "student edition contains teacher labels", "labels": labels[:10]})
    for index, page in enumerate(pages):
        page_number = index + 1
        text = page["text"]
        norm_text = normalize(text)
        assigned = expected[index:index + 1] if teacher else expected[index * 2:index * 2 + 2]
        assigned_ids = [activity["id"] for activity in assigned]
        visible_ids = [value.lower() for value in ACTIVITY_ID.findall(text)]
        page_errors = []
        if abs(page["width"] - 595.276) > 1.2 or abs(page["height"] - 841.89) > 1.2:
            page_errors.append({"check": "A4 page dimensions", "width": page["width"], "height": page["height"]})
        if len(norm_text) < 30 or not visible_ids:
            page_errors.append({"check": "nonempty activity page", "textCharacters": len(norm_text), "ids": visible_ids})
        if Counter(visible_ids) != Counter(assigned_ids):
            page_errors.append({"check": "activities remain on their assigned page", "expected": assigned_ids, "actual": visible_ids})
        overflow = []
        checked_characters = 0
        for character in page["characters"]:
            if not character["text"].strip():
                continue
            checked_characters += 1
            x0, y0, x1, y1 = character["bbox"]
            if not all(math.isfinite(float(v)) for v in (x0, y0, x1, y1)) or x0 < -tolerance or y0 < -tolerance or x1 > page["width"] + tolerance or y1 > page["height"] + tolerance:
                overflow.append(character)
        if not checked_characters:
            page_errors.append({"check": "extractable positioned text"})
        if overflow:
            page_errors.append({"check": "text glyph bounding boxes inside page", "count": len(overflow), "examples": overflow[:12]})
        answer_checks = []
        for activity in assigned:
            activity_id = activity["id"]
            for field, expected_text in [("title", activity["title"][locale]), ("exit prompt", activity["exit"]["prompt"][locale])]:
                if normalize(expected_text) not in norm_text:
                    page_errors.append({"check": f"complete {field} text", "id": activity_id, "expected": expected_text})
            if teacher:
                answer = activity["exit"]["answer"][locale]
                present = bool(normalize(answer)) and normalize(answer) in norm_text
                answer_checks.append({"id": activity_id, "completeAnswerPresent": present})
                if not present:
                    page_errors.append({"check": "complete teacher exit answer text", "id": activity_id, "expected": answer})
        result["pageResults"].append({
            "page": page_number, "width": page["width"], "height": page["height"],
            "textCharacters": len(norm_text), "positionedCharactersChecked": checked_characters,
            "ids": visible_ids, "expectedIds": assigned_ids, "overflowCharacters": len(overflow),
            "teacherAnswers": answer_checks, "status": "failed" if page_errors else "passed",
        })
        errors.extend({"page": page_number, **error} for error in page_errors)
    result["status"] = "failed" if errors else "passed"
    return result


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--directory", type=Path, default=ROOT / ".tmp" / "g10-inquiries-qa")
    parser.add_argument("--tolerance", type=float, default=1.5, help="Permitted glyph-box rounding at page edges, in points")
    args = parser.parse_args(argv)
    directory = args.directory.resolve()
    directory.mkdir(parents=True, exist_ok=True)
    audit = {
        "generatedAt": datetime.now(timezone.utc).isoformat(), "directory": str(directory),
        "status": "failed", "expectedFiles": 56, "files": [], "totalPages": 0, "failures": [],
        "checks": ["source catalogue counts", "actual A4 page count", "per-page activity IDs", "complete titles and exit prompts", "complete teacher exit answers", "student teacher-label separation", "positioned text overflow", "no empty pages"],
    }
    try:
        if not math.isfinite(args.tolerance) or args.tolerance < 0 or args.tolerance > 3:
            raise ValueError("Tolerance must be between zero and three points")
        source, provenance = load_expectations(directory)
        audit["expectationsSource"] = provenance
        chapters = {str(chapter["id"]).zfill(2): chapter for chapter in source["chapters"]}
        activities = source["inquiries"]
        if len(chapters) != 14 or len(activities) != 85 or len({a["id"] for a in activities}) != 85:
            raise ValueError("The independent catalogue must contain 14 chapters and 85 unique activities")
        engine_name, engine_version, engine = select_engine()
        audit["engine"] = engine_name
        audit["engineVersion"] = engine_version
        report_path = directory / "report.json"
        report = json.loads(report_path.read_text(encoding="utf-8")) if report_path.exists() else {}
        reported_entries = report.get("pdfs", [])
        if not isinstance(reported_entries, list):
            raise ValueError("report.json pdfs must be a list")
        audit["browserPdfEntries"] = len(reported_entries)
        # A later focused browser retest can legitimately replace report.json
        # without regenerating PDFs. Audit the full independently known file
        # inventory rather than treating that focused DOM report as a manifest.
        if len(reported_entries) == 56:
            entries = reported_entries
            audit["inventorySource"] = "complete browser PDF report, checked against source catalogue"
        else:
            entries = [{"file": f"{locale}-{chapter}-{'teacher' if teacher else 'student'}.pdf", "locale": locale, "chapter": chapter, "teacher": teacher, "count": int(chapters[chapter]["count"])} for locale in LOCALES for chapter in sorted(chapters) for teacher in (False, True)]
            audit["inventorySource"] = "all 56 expected filenames derived from source catalogue; browser report is focused or absent"
        expected_combinations = {(locale, chapter, teacher) for locale in LOCALES for chapter in chapters for teacher in (False, True)}
        seen = Counter()
        if len(entries) != 56:
            audit["failures"].append({"check": "all 56 PDF entries", "actual": len(entries)})
        for entry in entries:
            if not isinstance(entry, dict) or not isinstance(entry.get("teacher"), bool):
                audit["failures"].append({"check": "PDF entry schema", "entry": entry})
                continue
            chapter = str(entry.get("chapter", "")).zfill(2)
            entry = {**entry, "chapter": chapter}
            key = (entry.get("locale"), chapter, entry["teacher"])
            if key not in expected_combinations:
                audit["failures"].append({"check": "unexpected locale/chapter/edition", "entry": entry})
                continue
            seen[key] += 1
            filename = entry.get("file")
            if not isinstance(filename, str) or Path(filename).name != filename or Path(filename).suffix.lower() != ".pdf":
                audit["failures"].append({"check": "safe PDF filename", "entry": entry})
                continue
            expected = sorted((a for a in activities if str(a["chapter"]).zfill(2) == chapter), key=lambda a: a["id"])
            if len(expected) != int(chapters[chapter]["count"]):
                raise ValueError(f"Catalogue count disagrees for chapter {chapter}")
            if entry.get("count") != len(expected):
                audit["failures"].append({"check": "browser count versus source count", "file": filename, "expected": len(expected), "actual": entry.get("count")})
            try:
                file_result = audit_pdf((directory / filename).read_bytes(), entry, expected, engine_name, engine, args.tolerance)
            except Exception as error:
                file_result = {"file": filename, "status": "failed", "pages": 0, "failures": [{"check": "PDF audit exception", "detail": str(error)}]}
            audit["files"].append(file_result)
            audit["totalPages"] += file_result["pages"]
            audit["failures"].extend({"file": filename, **error} for error in file_result["failures"])
        for key in sorted(expected_combinations):
            if seen[key] != 1:
                audit["failures"].append({"check": "locale/chapter/edition exactly once", "locale": key[0], "chapter": key[1], "teacher": key[2], "actual": seen[key]})
        audit["status"] = "failed" if audit["failures"] else "passed"
    except Exception as error:
        audit["failures"].append({"check": "audit setup", "detail": str(error)})
    destination = directory / "pdf-audit.json"
    destination.write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"status": audit["status"], "files": len(audit["files"]), "totalPages": audit["totalPages"], "failures": len(audit["failures"]), "engine": audit.get("engine"), "report": str(destination)}, ensure_ascii=False))
    return 0 if audit["status"] == "passed" else 1


if __name__ == "__main__":
    sys.exit(main())
