"""Package only accepted authored PDFs, excluding browser fixtures and backups."""
import json
import sys
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

if len(sys.argv) < 4:
    raise SystemExit('Usage: python package-guided-practice-worksheets.py OUTPUT.zip PILOT_ACCEPTANCE UPPER_ACCEPTANCE')
target = Path(sys.argv[1]).resolve()
documents = []
identities = set()
for argument in sys.argv[2:]:
    source = Path(argument).resolve()
    audit = json.loads((source / 'pdf-audit.json').read_text(encoding='utf-8'))
    assert audit['passed'], 'Only accepted paper editions can be packaged'
    manifest = json.loads((source / 'pdf-manifest.json').read_text(encoding='utf-8'))
    for item in manifest['pdfs']:
        identity = (item['packId'], item['locale'], item['edition'])
        assert identity not in identities, 'Duplicate paper edition'
        identities.add(identity)
        file = (source / item['file']).resolve()
        assert file.parent == source and file.suffix == '.pdf' and file.is_file()
        documents.append((file, f"{item['locale']}/{item['edition']}/{item['file']}"))
assert len({identity[0] for identity in identities}) == 28
assert len(documents) == 168
assert all({(locale, edition) for pack_id, locale, edition in identities if pack_id == pack} ==
           {(locale, edition) for locale in ['en', 'zh-Hant'] for edition in ['student', 'teacher', 'supplement']}
           for pack in {identity[0] for identity in identities})
target.parent.mkdir(parents=True, exist_ok=True)
readme = '''七上、八上章節核心課堂包 / Year 7–8 upper-volume core practice
28 original bilingual packs, 448 fixed original questions, 168 PDF editions.
student: blank two-page A4 core worksheets.
supplement: further practice and extensions, separately printed.
teacher: reference answers and assessment rubrics; keep separate from student copies.

共28個原創雙語課堂包，448道固定題。student為兩頁A4留白核心；supplement為補練及進階；teacher附參考解答及準則，請與學生版本分開派發。
配合相應教材課時學習後使用，亦可作章末複習。
https://skckenneth.github.io/zh/teaching/classroom-packs/curriculum/
'''
with ZipFile(target, 'w', ZIP_DEFLATED) as archive:
    archive.writestr('README.txt', readme)
    archive.write(Path(__file__).resolve().parents[1] / 'docs' / 'upper-core-plan.md', 'upper-core-plan.md')
    for file, name in documents:
        archive.write(file, name)
with ZipFile(target) as archive:
    assert archive.testzip() is None
    assert len(archive.namelist()) == 170
print(json.dumps({'path': str(target), 'pdfs': len(documents), 'bytes': target.stat().st_size}))
