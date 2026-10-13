"""Validate the actual bilingual classroom PDFs made by Chromium, without editing them."""
import json, re, unicodedata, sys
from pathlib import Path
from pypdf import PdfReader
import pdfplumber
import pypdfium2 as pdfium

root=Path(__file__).resolve().parents[1]
output=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root/'.tmp'/'math-system-browser-qa'
report={'checks':[], 'pdfs':[], 'limits':'Selected actual A4 editions; extraction and glyph bounds do not establish every possible print layout.'}
compact=lambda s:re.sub(r'\s+','',unicodedata.normalize('NFKC',s))
def check(name,ok,evidence=None):report['checks'].append({'name':name,'passed':bool(ok),'evidence':evidence})
for language in ['zh-Hant','en']:
 for edition in ['student','teacher']:
  filename=f'g8-{language}-{edition}.pdf'
  path=output/filename
  reader=PdfReader(path)
  text='\n'.join(p.extract_text() or '' for p in reader.pages)
  sizes=[(float(p.mediabox.width),float(p.mediabox.height)) for p in reader.pages]
  check(filename+': A4',all(abs(w-595.28)<1 and abs(h-841.89)<1 for w,h in sizes),sizes)
  outside=[]
  with pdfplumber.open(path) as pdf:
   for i,p in enumerate(pdf.pages):
    for c in p.chars:
     if c.get('text','').strip() and (c['x0']<-.5 or c['x1']>p.width+.5 or c['top']<-.5 or c['bottom']>p.height+.5):outside.append({'page':i+1,'text':c['text']})
  check(filename+': within paper',not outside,outside[:10])
  check(filename+': no blank pages',all(len(compact(p.extract_text() or ''))>8 for p in reader.pages))
  check(filename+': task and conditions survive',all(s in compact(text) for s in ['PM','PN','AAS','HL','3.5']))
  proof='OP=OP'
  check(filename+': correct answer visibility',(proof in compact(text))==(edition=='teacher'))
  check(filename+': expected language',(compact('角的平分線') in compact(text)) if language=='zh-Hant' else ('Angle-bisector property' in text))
  report['pdfs'].append({'file':filename,'pages':len(reader.pages),'characters':len(text)})
  (output/(filename+'.txt')).write_text(text,encoding='utf-8')
  pdf=pdfium.PdfDocument(path);pdf[0].render(scale=1.4).to_pil().save(output/(filename+'.png'));pdf.close()
report['passed']=all(x['passed'] for x in report['checks'])
(output/'pdf-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'passed':report['passed'],'checks':len(report['checks']),'pdfs':report['pdfs']},ensure_ascii=False))
raise SystemExit(0 if report['passed'] else 1)
