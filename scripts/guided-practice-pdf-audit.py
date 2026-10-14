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
output = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / '.tmp' / 'guided-practice-browser-qa'
manifest = json.loads((output / 'pdf-manifest.json').read_text(encoding='utf-8'))
report = {'origin': manifest['origin'], 'checks': [], 'pdfs': [], 'unicodeAliases': {'U+2ED1 CJK RADICAL LONG': 'U+9577'}, 'limits': [
    'Physical A4 size, page count, extracted text and glyph bounds are checked for every fixed pack and language.',
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
    with pdfplumber.open(path) as pdf:
        for number, page in enumerate(pdf.pages, 1):
            for char in page.chars:
                if char.get('text', '').strip() and (char['x0'] < -.5 or char['x1'] > page.width + .5 or char['top'] < -.5 or char['bottom'] > page.height + .5):
                    outside.append({'page': number, 'text': char['text'], 'bounds': [char['x0'], char['top'], char['x1'], char['bottom']]})
    check(prefix + ': text within paper', not outside, outside[:12])
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

check('all seven packs printed in both languages with blank core and full teacher answers', len({(item['packId'], item['locale'], item['edition']) for item in manifest['pdfs'] if item['edition'] in ['student', 'teacher']}) == 28)
check('all seven bilingual supplements are separate documents', len([item for item in manifest['pdfs'] if item['edition'] == 'supplement']) == 14)
report['passed'] = all(item['passed'] for item in report['checks'])
(output / 'pdf-audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'passed': report['passed'], 'checks': len(report['checks']), 'pdfs': len(report['pdfs']), 'failed': [item['name'] for item in report['checks'] if not item['passed']]}, ensure_ascii=True))
raise SystemExit(0 if report['passed'] else 1)
