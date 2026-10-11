"""Inspect local PDF page geometry and text bounds; rasterize selected pages for visual review."""
from pathlib import Path
import json
import logging
logging.getLogger('pdfminer').setLevel(logging.ERROR)
import pdfplumber
import pypdfium2 as pdfium

directory = Path(__file__).resolve().parent
manifest = json.loads((directory / 'render-manifest.json').read_text(encoding='utf-8'))
results = []
for item in manifest['documents']:
    filename = item['filename']
    with pdfplumber.open(directory / filename) as document:
        pages = []
        all_text = []
        math_sizes = []
        interval_sizes = []
        table_page = None
        for index, page in enumerate(document.pages):
            text = page.extract_text() or ''
            all_text.append(text)
            nonblank = [char for char in page.chars if char['text'].strip()]
            math_sizes.extend(round(char['size'],3) for char in nonblank if 'KaTeX' in char['fontname'])
            sequence = ''.join(char['text'] for char in page.chars)
            needle = '1.4443773087849885'
            start = sequence.find(needle)
            if start >= 0:
                # One character per glyph in this known numeric interval; unlike subscripts, these are base digits.
                selected = page.chars[start:start + len(needle)]
                if ''.join(char['text'] for char in selected) == needle:
                    interval_sizes.append({'page': index + 1, 'minimum': round(min(char['size'] for char in selected),3),
                                           'maximum': round(max(char['size'] for char in selected),3)})
            outside = [char for char in nonblank if char['x0'] < 40.5 or char['x1'] > page.width - 40.5]
            pages.append({'page': index + 1, 'width': round(page.width, 2), 'height': round(page.height, 2),
                          'characters': len(nonblank), 'outsideHorizontalMargins': len(outside),
                          'outsideSamples': [{'text': char['text'], 'x0': round(char['x0'], 2), 'x1': round(char['x1'], 2)} for char in outside[:12]]})
            if table_page is None and (('Candidate' in text and 'Absolute' in text) or ('候選' in text and '絕對' in text) or ('Question' in text and 'Finding' in text) or ('問題' in text and '發現' in text)):
                table_page = index
        text = '\n'.join(all_text)
        expected_url = 'https://skckenneth.github.io' + item['route']
        result = {'filename': filename, 'pageCount': len(pages), 'a4': all(abs(page['width'] - 595.28) < 1 and abs(page['height'] - 841.89) < 1 for page in pages),
                  'hasCanonicalUrl': expected_url in text.replace('\n', ''),
                  'hasReplacementCharacters': '\ufffd' in text,
                  'hasHiddenUiText': any(label in text for label in ['Continue from last section', 'Print / save PDF', '清除本篇位置', '列印／儲存 PDF']),
                  'mathGlyphSizesPt': {'minimum': min(math_sizes) if math_sizes else None,
                                       'maximum': max(math_sizes) if math_sizes else None,
                                       'note': 'PDF glyph sizes include subscripts, superscripts and fraction numerators; minimum is not the base formula font.'},
                  'selectedLongIntervalDigitsPt': interval_sizes,
                  'pages': pages}
        indices = {0}
        if item['name'] == 'traffic' and len(pages) > 1:
            indices.add(1)
        if item['name'] in ['solar', 'certificate'] and table_page is not None:
            indices.add(table_page)
        if item['name'] == 'solar' and item['locale'] == 'zh-Hant':
            indices.update(index for index in [13,14] if index < len(pages))
        rendered = pdfium.PdfDocument(directory / filename)
        result['previews'] = []
        for index in sorted(indices):
            output = f"{Path(filename).stem}-page-{index + 1}.png"
            rendered[index].render(scale=1.7).to_pil().save(directory / output)
            result['previews'].append(output)
        rendered.close()
        results.append(result)
(directory / 'pdf-inspection.json').write_text(json.dumps({'method': 'Actual PDF geometry/text extraction with pdfplumber; selected page rasters with PDFium. Bounds checks supplement visual review, not a proof of all pagination.', 'documents': results}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
for result in results:
    print(result['filename'], result['pageCount'], 'pages;', 'A4', result['a4'], 'URL', result['hasCanonicalUrl'], 'outliers', sum(page['outsideHorizontalMargins'] for page in result['pages']))
