"""Audit actual A4 browser prints, including bilingual transfer tasks and answer separation."""
from pathlib import Path
import json
import re
import unicodedata
import logging
from pypdf import PdfReader
import pdfplumber
logging.getLogger('pdfminer').setLevel(logging.ERROR)

root = Path(__file__).resolve().parents[1]
directory = root / '.tmp' / 'chapter3-browser-qa'
expectations = json.loads((directory / 'print-expectations.json').read_text(encoding='utf-8'))
report = json.loads((directory / 'report.json').read_text(encoding='utf-8'))

def normalize(value):
    return re.sub(r'\s+', '', unicodedata.normalize('NFKC', value)).replace('\u200b', '')

results = []
for filename in report['pdfs']:
    match = re.fullmatch(r'functions-(\d\d)-(en|zh-Hant)-(student|teacher)\.pdf', filename)
    assert match, filename
    lesson_id, locale, edition = match.groups()
    document = PdfReader(directory / filename)
    text = normalize('\n'.join(page.extract_text() or '' for page in document.pages))
    expected = expectations[lesson_id]
    for field in ['title', 'transfer', 'exitPrompt']:
        assert normalize(expected[field][locale]) in text, (filename, 'missing', field)
    answer = normalize(expected['exitAnswer'][locale])
    if edition == 'student':
        assert answer not in text, (filename, 'student answer leaked')
    else:
        assert answer in text, (filename, 'teacher answer missing')
    with pdfplumber.open(directory / filename) as measured:
        for page in measured.pages:
            assert abs(page.width - 595.276) < 1 and abs(page.height - 841.89) < 1, (filename, 'not A4')
            for character in page.chars:
                assert character['x0'] >= 8 and character['top'] >= 8 and character['x1'] <= page.width - 8 and character['bottom'] <= page.height - 8, (filename, 'text clipped', character)
    results.append({'file': filename, 'pages': len(document.pages), 'A4': True, 'transferPresent': True, 'answerSeparation': True, 'textWithinPage': True})

assert len(results) == 8, 'Expected all eight representative bilingual student/teacher PDFs'
(directory / 'pdf-audit.json').write_text(json.dumps({'status': 'passed', 'files': results}, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'status': 'passed', 'files': len(results), 'pages': sum(item['pages'] for item in results)}, ensure_ascii=False))
