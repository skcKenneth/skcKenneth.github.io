"""Inspect actual browser-generated PDFs, with explicit limits on what extraction proves."""
import json
import re
import unicodedata
import logging
from pathlib import Path
from pypdf import PdfReader
import pdfplumber
import pypdfium2 as pdfium
logging.getLogger('pdfminer').setLevel(logging.ERROR)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / '.tmp' / 'senior-math-v2' / 'browser-qa'


def compact(text):
    return re.sub(r'\s+', '', unicodedata.normalize('NFKC', text)).lower()


report = {'checks': [], 'pdfs': [], 'limitations': [
    'PDF text and glyph bounds establish content survival and physical page bounds, not universal visual correctness.',
    'The test covers selected long written reasoning, multiple-choice options, saved work, and the simulation table; it does not print every lesson.',
]}


def check(name, condition, evidence=None):
    report['checks'].append({'name': name, 'passed': bool(condition), 'evidence': evidence})


texts = {}
for name in ['long-proof-teacher', 'long-proof-teacher-zh', 'student-worksheet', 'student-work', 'probability-simulation']:
    file = OUTPUT / (name + '.pdf')
    reader = PdfReader(file)
    pages = [page.extract_text() or '' for page in reader.pages]
    texts[name] = pages
    sizes = [[float(page.mediabox.width), float(page.mediabox.height)] for page in reader.pages]
    check(name + ': A4 physical page size', all(abs(w - 595.28) < 1 and abs(h - 841.89) < 1 for w, h in sizes), sizes)
    outside = []
    with pdfplumber.open(file) as pdf:
        for number, page in enumerate(pdf.pages, 1):
            for char in page.chars:
                if char.get('text', '').strip() and (char['x0'] < -0.5 or char['x1'] > page.width + 0.5 or char['top'] < -0.5 or char['bottom'] > page.height + 0.5):
                    outside.append({'page': number, 'text': char['text'], 'bounds': [char['x0'], char['top'], char['x1'], char['bottom']]})
    check(name + ': no extracted text outside paper bounds', not outside, outside[:10])
    check(name + ': no empty page', all(len(compact(page)) > 20 for page in pages), [len(compact(page)) for page in pages])
    report['pdfs'].append({'filename': file.name, 'pages': len(pages), 'sizes': sizes, 'charactersPerPage': list(map(len, pages))})
    (OUTPUT / (name + '-extracted.txt')).write_text('\n\n--- PAGE ---\n\n'.join(pages), encoding='utf-8')

teacher = [compact(page) for page in texts['long-proof-teacher']]
first = compact('Identify the exponent, its real domain and how it changes order.')
last = compact('Function evaluation is different from solving f(x)=0.')
first_pages = [i + 1 for i, text in enumerate(teacher) if first in text]
last_pages = [i + 1 for i, text in enumerate(teacher) if last in text]
check('Long proof genuinely continues on a later page', bool(first_pages and last_pages and min(last_pages) > min(first_pages)), {'firstReasoningPages': first_pages, 'finalReasoningPages': last_pages})
check('Middle proof domain-and-range justification survives', compact('Every positive output is attained by the displayed nonzero input; zero is excluded as both input and output.') in ''.join(teacher))
browser_report = json.loads((OUTPUT / 'report.json').read_text(encoding='utf-8'))
zh_pages = [compact(page) for page in texts['long-proof-teacher-zh']]
zh_steps = browser_report['zhProofSteps']
check('All nine Traditional Chinese proof steps survive PDF extraction', all(compact(step) in ''.join(zh_pages) for step in zh_steps), zh_steps)
zh_start = [i + 1 for i, text in enumerate(zh_pages) if compact(zh_steps[1]) in text]
zh_end = [i + 1 for i, text in enumerate(zh_pages) if compact(zh_steps[-1]) in text]
check('Traditional Chinese proof completes across physical pages', bool(zh_start and zh_end and min(zh_end) > min(zh_start)), {'firstReasoningPages': zh_start, 'finalReasoningPages': zh_end})
for name in ['student-worksheet', 'student-work']:
    joined = compact(''.join(texts[name]))
    check(name + ': worked solution is hidden', last not in joined and first not in joined)
    check(name + ': multiple-choice options A-E survive', all(compact(x) in joined for x in ['A.', 'B.', 'C.', 'D.', 'E.']))
work = compact(''.join(texts['student-work']))
check('Work PDF contains separate attempt and correction drafts', all(compact(x) in work for x in ['QA_FIRST_ATTEMPT_MARKER', 'QA_CORRECTION_MARKER']))
simulation = [compact(page) for page in texts['probability-simulation']]
joined = ''.join(simulation)
check('Simulation assumptions and seed are printed', all(compact(x) in joined for x in ['seed=37', 'Simulation of 200 samples', 'bag N=6, K=3, draws n=2']))
check('Simulation frequencies survive actual pagination', all(compact(x) in joined for x in ['Red count', 'No-replacement frequency', 'Replacement frequency', '0 50 50', '1 115 92', '2 35 58']))
report['passed'] = all(check['passed'] for check in report['checks'])
report['rasterRenderer'] = 'PDFium via installed pypdfium2 (independent of PDF.js)'
for name, numbers in [
    ('long-proof-teacher', [1, 2]),
    ('long-proof-teacher-zh', [1, 2]),
    ('student-worksheet', [1]),
    ('probability-simulation', [3, 4]),
]:
    document = pdfium.PdfDocument(OUTPUT / (name + '.pdf'))
    for number in numbers:
        page = document[number - 1]
        bitmap = page.render(scale=1.35)
        bitmap.to_pil().save(OUTPUT / (name + '-pdfium-page-' + str(number) + '.png'))
        bitmap.close()
        page.close()
    document.close()
(OUTPUT / 'pdf-audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'passed': report['passed'], 'checks': len(report['checks']), 'failed': [check['name'] for check in report['checks'] if not check['passed']], 'pdfs': [{key: item[key] for key in ['filename', 'pages']} for item in report['pdfs']]}, ensure_ascii=True))
raise SystemExit(0 if report['passed'] else 1)
