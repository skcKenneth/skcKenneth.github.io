"""Inspect the actual Chromium PDFs; do not repair or reflow the documents."""
import json
import logging
import re
import sys
import unicodedata
from pathlib import Path
from pypdf import PdfReader
import pdfplumber
import pypdfium2 as pdfium

logging.getLogger('pdfminer').setLevel(logging.ERROR)

def actual_collisions(page, pack_id, student=True):
    """Check physical PDF glyph/vector positions, independent of browser viewport."""
    footer = None
    if student:
        words = [word for word in page.extract_words() if word['text'].startswith(pack_id)]
        cards = [rect for rect in page.rects if rect['x1'] - rect['x0'] > 80 and 20 < rect['bottom'] - rect['top'] < 350]
        footer_top = min((word['top'] for word in words), default=None)
        card_bottom = max((rect['bottom'] for rect in cards), default=None)
        footer = {'passed': footer_top is not None and card_bottom is not None and card_bottom <= footer_top + .05,
                  'footerTop': footer_top, 'maxCardBottom': card_bottom,
                  'clearancePoints': footer_top - card_bottom if footer_top is not None and card_bottom is not None else None}
    collisions = []
    markers = 0
    chars = page.chars
    for index, marker in enumerate(chars[:-1]):
        following = chars[index + 1]
        if marker['text'] not in ('B', 'D') or following['text'] != '.' or abs(marker['top'] - following['top']) > .2:
            continue
        # Printed question list markers use the preserved 9 pt body font.
        # SVG labels, mathematical italic letters and small footers are excluded.
        if abs(marker['size'] - 9) > .05 or 'Math' in marker.get('fontname', ''):
            continue
        markers += 1
        intruders = [char for char in chars[:index] if char['text'].strip()
                     and abs(char['top'] - marker['top']) < .2 and abs(char['size'] - marker['size']) < .2
                     and char['x0'] < marker['x0'] and char['x1'] > marker['x0'] + .2]
        for char in intruders:
            collisions.append({'marker': marker['text'] + '.', 'top': marker['top'],
                               'markerBounds': [marker['x0'], following['x1']], 'previousGlyph': char['text'],
                               'glyphBounds': [char['x0'], char['x1']], 'overlapPoints': char['x1'] - marker['x0']})
    return {'footer': footer, 'optionMarkersChecked': markers, 'optionCollisions': collisions}

# A read-only probe demonstrates that new guards reject the preserved known
# failure before they are used to certify another build. It writes no evidence.
if len(sys.argv) > 1 and sys.argv[1] == '--probe-collisions':
    path, pack_id = Path(sys.argv[2]).resolve(), sys.argv[3]
    with pdfplumber.open(path) as pdf:
        results = [actual_collisions(page, pack_id) for page in pdf.pages]
    passed = all(row['footer']['passed'] and not row['optionCollisions'] for row in results)
    print(json.dumps({'file': str(path), 'passed': passed, 'pages': results}, ensure_ascii=True))
    raise SystemExit(0 if passed else 1)

output = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / '.tmp' / 'guided-practice-upper-browser-qa'
manifest = json.loads((output / 'pdf-manifest.json').read_text(encoding='utf-8'))
report = {'origin': manifest['origin'], 'checks': [], 'pdfs': [], 'unicodeAliases': {'U+2ED1 CJK RADICAL LONG': 'U+9577'}, 'limits': [
    'Physical A4 size, page count, extracted text and glyph bounds are checked for every approved new chapter-core pack and language.',
    'PDFium images support separate visual review; text extraction cannot prove universal printer or font compatibility.',
]}

def compact(text):
    # The Chromium CJK font's ToUnicode table uses the visually identical
    # standalone LONG radical for 長. Keep every other character significant.
    return re.sub(r'\s+', '', unicodedata.normalize('NFKC', text).replace('\u2ed1', '\u9577')).lower()

def check(name, passed, evidence=None):
    report['checks'].append({'name': name, 'passed': bool(passed), 'evidence': evidence})

for item in manifest['pdfs']:
    path = output / item['file']
    reader = PdfReader(path)
    pages = [page.extract_text() or '' for page in reader.pages]
    joined = compact(''.join(pages))
    prefix = item['file']
    sizes = [[float(page.mediabox.width), float(page.mediabox.height)] for page in reader.pages]
    check(prefix + ': A4', all(abs(w - 595.28) < 1 and abs(h - 841.89) < 1 for w, h in sizes), sizes)
    check(prefix + ': no blank page', all(len(compact(page)) > 30 for page in pages), [len(compact(page)) for page in pages])
    if item.get('expectedPages') is not None:
        check(prefix + ': required page count', len(pages) == item['expectedPages'], len(pages))
    outside = []
    collision_evidence = []
    with pdfplumber.open(path) as pdf:
        for number, page in enumerate(pdf.pages, 1):
            physical = actual_collisions(page, item['packId'], item['edition'] == 'student')
            collision_evidence.append({'page': number, **physical})
            if item['edition'] == 'student':
                check(prefix + ': page ' + str(number) + ' actual footer clears question cards', physical['footer']['passed'], physical['footer'])
            for char in page.chars:
                if char.get('text', '').strip() and (char['x0'] < -.5 or char['x1'] > page.width + .5 or char['top'] < -.5 or char['bottom'] > page.height + .5):
                    outside.append({'page': number, 'text': char['text'], 'bounds': [char['x0'], char['top'], char['x1'], char['bottom']]})
    check(prefix + ': text within paper', not outside, outside[:12])
    check(prefix + ': actual option marker columns do not collide', not any(row['optionCollisions'] for row in collision_evidence), collision_evidence)
    check(prefix + ': formula fits its own question column', not item.get('printLayoutIssues', []), item.get('printLayoutIssues', []))
    missing = [prompt for prompt in item.get('requiredText', []) if compact(prompt) not in joined]
    check(prefix + ': all fixed question prompts survive', not missing, missing)
    forbidden = [marker for marker in item.get('forbiddenText', []) if compact(marker) in joined]
    check(prefix + ': answer edition policy', not forbidden, forbidden)
    for label, snippets in item.get('requiredGroups', {}).items():
        absent = [snippet for snippet in snippets if compact(snippet) not in joined]
        check(prefix + ': ' + label, not absent, absent)
    if item.get('pageOneText') and len(pages) >= 2:
        check(prefix + ': first four questions on page 1', all(compact(text) in compact(pages[0]) for text in item['pageOneText']))
        check(prefix + ': independent and exit questions on page 2', all(compact(text) in compact(pages[1]) for text in item['pageTwoText']))
    if item['locale'] == 'en':
        check(prefix + ': authored English contains no Han text', not re.search(r'[\u3400-\u9fff]', ''.join(pages)))
    (output / (prefix + '.txt')).write_text('\n\n--- PAGE ---\n\n'.join(pages), encoding='utf-8')
    # Render every page, so both page breaks and the final problem can be reviewed.
    document = pdfium.PdfDocument(path)
    for index in range(len(document)):
        page = document[index]
        bitmap = page.render(scale=1.15)
        bitmap.to_pil().save(output / (prefix + '-page-' + str(index + 1) + '.png'))
        bitmap.close()
        page.close()
    document.close()
    report['pdfs'].append({'file': prefix, 'packId': item['packId'], 'locale': item['locale'], 'edition': item['edition'], 'pages': len(pages), 'questionIds': item['questionIds']})

expected_ids = manifest.get('expectedPackIds', [])
check('closed approved inventory has 21 unique new chapter-core packs', len(expected_ids) == 21 and len(set(expected_ids)) == 21)
expected = {(pack, locale, edition) for pack in expected_ids for locale in ['en', 'zh-Hant'] for edition in ['student', 'teacher', 'supplement']}
actual = {(item['packId'], item['locale'], item['edition']) for item in manifest['pdfs']}
check('all approved packs have exactly six distinct bilingual editions', actual == expected and len(manifest['pdfs']) == len(expected), {
    'expected': len(expected), 'actual': len(manifest['pdfs']), 'missing': sorted(expected - actual), 'unexpected': sorted(actual - expected),
})
check('all 42 bilingual student core worksheets contain exactly two A4 pages', len([item for item in report['pdfs'] if item['edition'] == 'student']) == len(expected_ids) * 2 and all(item['pages'] == 2 for item in report['pdfs'] if item['edition'] == 'student'))
report['passed'] = all(item['passed'] for item in report['checks'])
(output / 'pdf-audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'passed': report['passed'], 'checks': len(report['checks']), 'pdfs': len(report['pdfs']), 'failed': [item['name'] for item in report['checks'] if not item['passed']]}, ensure_ascii=True))
raise SystemExit(0 if report['passed'] else 1)
