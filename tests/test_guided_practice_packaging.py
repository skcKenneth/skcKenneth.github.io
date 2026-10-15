"""Synthetic packaging contracts, not real PDF or classroom acceptance evidence."""
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('guided_packaging', ROOT / 'scripts' / 'package-guided-practice-worksheets.py')
packager = importlib.util.module_from_spec(spec)
spec.loader.exec_module(packager)
FINGERPRINT = {'schema': 'lower-paper-v1', 'sourceSHA256': 'a' * 64,
               'printBuildSHA256': 'b' * 64, 'routes': 100}


class PackagingFreshnessTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='packaging-contract-', dir=ROOT / '.tmp')
        self.folder = Path(self.temporary.name).resolve()
        self.assertTrue(self.folder.is_relative_to((ROOT / '.tmp').resolve()))
        self.source = self.folder / 'synthetic-acceptance'
        self.source.mkdir()
        self.target = self.folder / 'existing.zip'
        self.target.write_bytes(b'KEEP ORIGINAL ZIP')
        self.item = {'packId': sorted(packager.LOWER_IDS)[0], 'locale': 'en', 'edition': 'student'}
        self.item['file'] = '{packId}-{locale}-{edition}.pdf'.format(**self.item)
        self.pdf = self.source / self.item['file']
        self.pdf.write_bytes(b'%PDF-1.4\nSynthetic contract fixture, not a worksheet.\n%%EOF\n')
        self.item['pdfSHA256'] = hashlib.sha256(self.pdf.read_bytes()).hexdigest()
        self.manifest = {'paperFingerprint': dict(FINGERPRINT), 'pdfs': [dict(self.item)]}
        self.write_reports()

    def tearDown(self):
        self.assertTrue(self.folder.is_relative_to((ROOT / '.tmp').resolve()))
        self.temporary.cleanup()

    def write_reports(self):
        reports = {
            'pdf-manifest.json': self.manifest,
            'pdf-audit.json': {'passed': True, 'checks': [{'passed': True}], 'pdfs': self.manifest['pdfs']},
            'report.json': {'passed': True, 'cases': [{'status': 'passed'}], 'pageErrors': [], 'printIssues': []},
        }
        for filename, value in reports.items():
            (self.source / filename).write_text(json.dumps(value), encoding='utf-8', newline='\n')

    def reject(self, expression, scope='lower'):
        completed = subprocess.CompletedProcess([], 0, json.dumps(FINGERPRINT), '')
        with patch.object(packager.subprocess, 'run', return_value=completed) as helper:
            with self.assertRaisesRegex(ValueError, expression):
                packager.package(self.target, [self.source], scope)
            helper.assert_called_once_with(
                ['node', str(ROOT / 'scripts' / 'guided-practice-paper-fingerprint.mjs')],
                cwd=ROOT, check=True, capture_output=True, text=True)
        self.assertEqual(self.target.read_bytes(), b'KEEP ORIGINAL ZIP')
        self.assertFalse(self.target.with_name(self.target.name + '.building').exists())

    def test_old_manifest_without_current_fingerprint_is_rejected_before_target_write(self):
        del self.manifest['paperFingerprint']
        self.write_reports()
        self.reject('Stale or missing lower paper source/build fingerprint')

    def test_source_and_build_fingerprints_compare_the_complete_object(self):
        self.manifest['paperFingerprint']['printBuildSHA256'] = 'c' * 64
        self.write_reports()
        self.reject('Stale or missing lower paper source/build fingerprint', scope='all')

    def test_changed_pdf_bytes_are_rejected_even_with_matching_source_build(self):
        self.pdf.write_bytes(self.pdf.read_bytes() + b'changed after audit\n')
        self.reject('Lower PDF bytes changed after acceptance')

    def test_missing_pdf_byte_fingerprint_is_rejected(self):
        del self.manifest['pdfs'][0]['pdfSHA256']
        self.write_reports()
        self.reject('Missing or invalid lower PDF byte fingerprint')

    def test_upper_legacy_sources_do_not_require_lower_fingerprints(self):
        upper = {'packId': sorted(packager.UPPER_IDS)[0], 'locale': 'en', 'edition': 'student'}
        upper['file'] = '{packId}-{locale}-{edition}.pdf'.format(**upper)
        (self.source / upper['file']).write_bytes(self.pdf.read_bytes())
        self.manifest = {'pdfs': [upper]}
        self.write_reports()
        with patch.object(packager.subprocess, 'run', side_effect=AssertionError('Upper legacy must not invoke lower helper')):
            with self.assertRaisesRegex(ValueError, 'Incomplete upper inventory'):
                packager.package(self.target, [self.source], 'upper')
        self.assertEqual(self.target.read_bytes(), b'KEEP ORIGINAL ZIP')


if __name__ == '__main__':
    unittest.main()
