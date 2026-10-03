"""Local verification cache only; no PDF or extraction belongs in public/."""
from pathlib import Path
import json
from pypdf import PdfReader

base = Path('.tmp/senior-math/papers')
manifest = json.loads((base / 'manifest.json').read_text(encoding='utf-8'))
for entry in manifest:
    reader=PdfReader(base / (entry['id']+'.pdf'))
    pages=[{'pdfPage':i+1,'text':page.extract_text(extraction_mode='layout') or ''} for i,page in enumerate(reader.pages)]
    (base / (entry['id']+'.json')).write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf-8')
    (base / (entry['id']+'.txt')).write_text('\n\n'.join(f"=== PDF PAGE {p['pdfPage']} ===\n{p['text']}" for p in pages),encoding='utf-8')
    print(entry['id'],len(pages),'pages',sum(len(p['text']) for p in pages),'text characters')
