export const readerAssets = new Map([
  ['pdf.min.mjs', 'pdfjs-dist/legacy/build/pdf.min.mjs'],
  ['pdf.worker.min.mjs', 'pdfjs-dist/legacy/build/pdf.worker.min.mjs'],
  ['worker.min.js', 'tesseract.js/dist/worker.min.js'],
  ['pdfjs-LICENSE.txt', 'pdfjs-dist/LICENSE'],
  ['tesseract-js-LICENSE.txt', 'tesseract.js/LICENSE.md'],
  ['tesseract-core-LICENSE.txt', 'tesseract.js-core/LICENSE'],
  ['worker.min.js.LICENSE.txt', 'tesseract.js/dist/worker.min.js.LICENSE.txt'],
  ['tesseract.min.js.LICENSE.txt', 'tesseract.js/dist/tesseract.min.js.LICENSE.txt'],
  ...['', '-simd', '-relaxedsimd'].map(suffix => {
    const name = 'tesseract-core' + suffix + '-lstm.wasm.js';
    return [name, 'tesseract.js-core/' + name];
  }),
  ...['eng', 'chi_tra'].map(lang => [lang + '.traineddata.gz', '@tesseract.js-data/' + lang + '/4.0.0_best_int/' + lang + '.traineddata.gz']),
]);
