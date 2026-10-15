"""Package a closed accepted paper inventory; never glob browser output folders.

Compatible CLI: OUTPUT.zip SOURCES... (defaults to the original upper volume).
Add --scope lower or --scope all for the separately accepted lower or full set.
Sources are directories containing pdf-manifest.json and pdf-audit.json.
"""
import argparse
import hashlib
import json
import os
import re
import subprocess
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

UPPER_IDS = frozenset('''
g7-rational-number-line g7-rational-operations g7-expressions-values
g7-polynomial-add-subtract g7-equations-meaning g7-equations-collect
g7-equations-transpose g7-equations-brackets-fractions g7-equations-applications
g7-geometry-segments g7-geometry-angles
g8-triangles-sides g8-triangles-angles g8-congruence-sss-sas
g8-congruence-angle-hl g8-bisector-distances g8-bisector-converse
g8-symmetry-recognition g8-perpendicular-bisector g8-symmetry-axis-construction
g8-reflection-coordinates g8-isosceles-equilateral g8-powers-multiplication
g8-products-division g8-factorisation g8-rational-expressions
g8-rational-operations g8-rational-equations
'''.split())
LOWER_IDS = frozenset('''
g7-intersections-perpendicular g7-parallel-conditions g7-translation
g7-square-cube-roots g7-real-number-estimation g7-coordinate-location-translation
g7-systems-elimination g7-systems-modelling g7-three-variable-systems
g7-linear-inequalities g7-inequality-systems-applications
g7-statistical-surveys g7-frequency-histograms
g8-radicals-meaning g8-radicals-operations g8-pythagoras-lengths
g8-pythagoras-converse g8-parallelograms-tests g8-rectangles-rhombi
g8-squares-classification g8-functions-representations
g8-linear-functions-properties g8-linear-functions-models
g8-data-centres g8-data-variance
'''.split())
ALL_IDS = UPPER_IDS | LOWER_IDS
LOCALES = ('en', 'zh-Hant')
EDITIONS = ('student', 'teacher', 'supplement')
SCOPES = {'upper': UPPER_IDS, 'lower': LOWER_IDS, 'all': ALL_IDS}
ROOT = Path(__file__).resolve().parents[1]


def require(condition, message):
    if not condition:
        raise ValueError(message)


def load_json(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def identity(item):
    return item['packId'], item['locale'], item['edition']


def current_lower_fingerprint():
    """Read the accepted runtime source/build binding once; never infer it from PDF names."""
    try:
        result = subprocess.run(
            ['node', str(ROOT / 'scripts' / 'guided-practice-paper-fingerprint.mjs')],
            cwd=ROOT, check=True, capture_output=True, text=True)
    except (OSError, subprocess.CalledProcessError) as error:
        detail = getattr(error, 'stderr', '') or str(error)
        raise ValueError(f'Cannot verify current lower paper fingerprint: {detail.strip()}') from error
    fingerprint = json.loads(result.stdout)
    require(isinstance(fingerprint, dict)
            and fingerprint.get('schema') == 'lower-paper-v1'
            and fingerprint.get('routes') == 100
            and all(isinstance(fingerprint.get(key), str)
                    and re.fullmatch(r'[0-9a-fA-F]{64}', fingerprint[key])
                    for key in ('sourceSHA256', 'printBuildSHA256')),
            'Current lower paper fingerprint has an invalid schema')
    return fingerprint


def package(target, sources, scope='upper'):
    require(len(UPPER_IDS) == 28 and len(LOWER_IDS) == 25 and len(ALL_IDS) == 53,
            'Closed inventory definition is inconsistent')
    expected_ids = SCOPES[scope]
    expected = {(pack, locale, edition) for pack in expected_ids
                for locale in LOCALES for edition in EDITIONS}
    require(target.suffix.lower() == '.zip', 'Output must be a ZIP archive')
    lower_fingerprint = current_lower_fingerprint() if expected_ids & LOWER_IDS else None
    documents, identities, excluded, evidence = [], set(), [], []
    for argument in sources:
        source = Path(argument).resolve(strict=True)
        audit_path, manifest_path, browser_path = source / 'pdf-audit.json', source / 'pdf-manifest.json', source / 'report.json'
        audit, manifest, browser = load_json(audit_path), load_json(manifest_path), load_json(browser_path)
        require(isinstance(manifest.get('pdfs'), list), f'Missing PDF manifest: {source.name}')
        if any(item.get('packId') in expected_ids & LOWER_IDS for item in manifest['pdfs']):
            require(manifest.get('paperFingerprint') == lower_fingerprint,
                    f'Stale or missing lower paper source/build fingerprint: {source.name}')
        require(browser.get('passed') is True, f'Browser acceptance did not pass: {source.name}')
        require(isinstance(browser.get('cases'), list) and browser['cases']
                and all(case.get('status') == 'passed' for case in browser['cases']),
                f'Browser acceptance has incomplete or failed cases: {source.name}')
        require(not browser.get('pageErrors') and not browser.get('printIssues'),
                f'Browser acceptance contains unresolved errors: {source.name}')
        require(audit.get('passed') is True, f'Paper acceptance did not pass: {source.name}')
        require(all(check.get('passed') is True for check in audit.get('checks', [])),
                f'Acceptance contains a failed check: {source.name}')
        require(isinstance(audit.get('pdfs'), list), f'Missing per-PDF acceptance evidence: {source.name}')
        accepted = {}
        for item in audit['pdfs']:
            key = identity(item)
            require(key not in accepted, f'Duplicate per-PDF acceptance identity: {key}')
            accepted[key] = item['file']
        evidence.append({'source': source.name,
                         'manifestSHA256': hashlib.sha256(manifest_path.read_bytes()).hexdigest(),
                         'auditSHA256': hashlib.sha256(audit_path.read_bytes()).hexdigest(),
                         'browserReportSHA256': hashlib.sha256(browser_path.read_bytes()).hexdigest()})
        for item in manifest['pdfs']:
            key = identity(item)
            pack_id, locale, edition = key
            if pack_id not in expected_ids:
                excluded.append({'packId': pack_id,
                                 'reason': 'outside selected scope' if pack_id in ALL_IDS else 'unregistered fixture or other output'})
                continue
            require(locale in LOCALES and edition in EDITIONS, f'Unrecognised paper edition: {key}')
            require(key not in identities, f'Duplicate paper edition: {key}')
            filename = f'{pack_id}-{locale}-{edition}.pdf'
            require(item['file'] == filename, f'Noncanonical PDF filename: {item["file"]}')
            require(accepted.get(key) == filename, f'PDF is absent from passed acceptance: {key}')
            file = (source / filename).resolve(strict=True)
            require(file.parent == source and file.is_file(), f'PDF is outside acceptance directory: {filename}')
            with file.open('rb') as stream:
                require(stream.read(5) == b'%PDF-', f'Invalid PDF header: {filename}')
            if pack_id in LOWER_IDS:
                expected_hash = item.get('pdfSHA256')
                require(isinstance(expected_hash, str)
                        and re.fullmatch(r'[0-9a-fA-F]{64}', expected_hash),
                        f'Missing or invalid lower PDF byte fingerprint: {filename}')
                require(hashlib.sha256(file.read_bytes()).hexdigest() == expected_hash,
                        f'Lower PDF bytes changed after acceptance: {filename}')
            identities.add(key)
            documents.append((file, f'{locale}/{edition}/{filename}'))
    missing = sorted(expected - identities)
    require(not missing and identities == expected,
            f'Incomplete {scope} inventory: missing {len(missing)} of {len(expected)} editions; {missing[:6]}')
    plans = ['upper-core-plan.md'] if scope == 'upper' else ['lower-core-plan.md'] if scope == 'lower' else ['upper-core-plan.md', 'lower-core-plan.md']
    for name in plans:
        require((ROOT / 'docs' / name).is_file(), f'Missing classroom plan: {name}')
    packs, pdfs = len(expected_ids), len(expected)
    label = {'upper': ('七上、八上', 'upper-volume'), 'lower': ('七下、八下', 'lower-volume'),
             'all': ('七、八年級上下冊', 'upper- and lower-volume')}[scope]
    links = {'upper': ['https://skckenneth.github.io/zh/teaching/classroom-packs/curriculum/'],
             'lower': ['https://skckenneth.github.io/zh/teaching/classroom-packs/curriculum/lower/'],
             'all': ['https://skckenneth.github.io/zh/teaching/classroom-packs/curriculum/',
                     'https://skckenneth.github.io/zh/teaching/classroom-packs/curriculum/lower/']}[scope]
    readme = f'''{label[0]}章節核心課堂包 / Year 7–8 {label[1]} core practice
{packs} original bilingual packs, {packs * 16} fixed original questions, {pdfs} PDF editions.
Each pack has en and zh-Hant editions of student, supplement and teacher papers.
student: blank two-page A4 core worksheets, including worked/guided spaces.
supplement: further practice and extensions, separately printed.
teacher: reference answers and rubrics; keep separate from student copies.

共{packs}個原創雙語課堂包、{packs * 16}道固定題、{pdfs}份PDF。
student為兩頁A4留白核心；supplement為補練及進階；teacher附參考解答及準則。
配合相應正文課時學習後使用，亦可作章末複習；軟件驗收不等同教師試教或學習成效證據。
只收錄通過本機紙本驗收的已登記題組，不包含測試fixture、備份或原教材PDF。
{chr(10).join(links)}
'''
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(target.name + '.building')
    expected_names = {'README.txt', *plans, *(name for _, name in documents)}
    try:
        with ZipFile(temporary, 'w', ZIP_DEFLATED) as archive:
            archive.writestr('README.txt', readme)
            for name in plans:
                archive.write(ROOT / 'docs' / name, name)
            for file, name in sorted(documents, key=lambda row: row[1]):
                archive.write(file, name)
        with ZipFile(temporary) as archive:
            require(archive.testzip() is None, 'ZIP CRC verification failed')
            names = archive.namelist()
            require(len(names) == len(expected_names) and set(names) == expected_names,
                    'ZIP entry inventory differs from the accepted selection')
        os.replace(temporary, target)
    finally:
        if temporary.exists():
            temporary.unlink()
    return {'path': str(target), 'scope': scope, 'packs': packs, 'questions': packs * 16,
            'pdfs': pdfs, 'entries': len(expected_names), 'bytes': target.stat().st_size,
            'crcPassed': True, 'excludedEntries': len(excluded), 'acceptanceSources': evidence}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', help='OUTPUT.zip')
    parser.add_argument('sources', nargs='+', help='Accepted PDF manifest directories')
    parser.add_argument('--scope', choices=SCOPES, default='upper')
    args = parser.parse_args()
    try:
        print(json.dumps(package(Path(args.output).resolve(), args.sources, args.scope), ensure_ascii=True))
    except (ValueError, OSError, KeyError, TypeError, json.JSONDecodeError) as error:
        parser.exit(1, f'Packaging failed: {error}\n')


if __name__ == '__main__':
    main()
