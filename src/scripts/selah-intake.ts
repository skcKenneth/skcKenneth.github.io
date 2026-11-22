import { catalogue, identifyProblem, q5Id, resolveBoard } from '../data/selah-intake.mjs';

const tag = (name: string) => '[data-si-' + name + ']';
type Locale = 'en' | 'zh-Hant';

function initialize(root: HTMLElement) {
  const locale: Locale = root.dataset.locale === 'en' ? 'en' : 'zh-Hant';
  const t = (english: string, chinese: string) => locale === 'en' ? english : chinese;
  const get = <T extends HTMLElement>(name: string) => root.querySelector<T>(tag(name))!;
  const input = get<HTMLTextAreaElement>('input');
  const result = get('result');
  const status = get('status');
  const fileInput = get<HTMLInputElement>('file');
  const review = get<HTMLButtonElement>('review');
  const preview = get('preview');
  const canvas = preview.querySelector('canvas')!;
  let selected: string | null = null;
  let loading: AbortController | undefined;
  const resetResult = () => { result.hidden = true; selected = null; };

  function openBoard(id: string) {
    if (id === q5Id) {
      window.dispatchEvent(new CustomEvent('selah:lesson', { detail: { id } }));
      return;
    }
    const board = resolveBoard(id);
    if (board) window.dispatchEvent(new CustomEvent('selah:lesson', {
      detail: { ...board, problemText: board.question[locale] },
    }));
  }
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-si-open]')) {
    button.addEventListener('click', () => openBoard(button.dataset.siOpen!));
  }
  root.querySelector('a[href="#selah-bring"]')?.addEventListener('click', () => {
    root.querySelector('details')!.open = true;
  });
  input.addEventListener('input', () => {
    loading?.abort();
    loading = undefined;
    review.disabled = false;
    resetResult();
    status.textContent = '';
  });
  get('example').addEventListener('click', () => {
    loading?.abort();
    loading = undefined;
    review.disabled = false;
    resetResult();
    fileInput.value = '';
    preview.hidden = true;
    input.value = t('Find the maximum of √(x − 2) + √(10 − x).', '求 √(x − 2) + √(10 − x) 的最大值。');
    status.textContent = '';
    input.focus();
  });
  review.addEventListener('click', () => {
    resetResult();
    const match = identifyProblem(input.value);
    if (!match.id) {
      const corrections: Record<string, string> = {
        empty: t('Paste the question or choose a file first.', '請先貼上題目，或者揀一個檔案。'),
        diagram: t('Add the diagram’s point labels, lengths and angles to the text. For an archived problem you can also enter the year and question number.', '請補上附圖嘅點名、長度同角度；如果係已收錄嘅競賽題，亦可輸入年份同題號。'),
        objective: t('Please check the goal and constraints. The supported new problem asks for the maximum of the two radicals over real x. Use the example for the input format.', '請核對目標同條件。新課支援喺實數範圍求兩個根式和嘅最大值，可以睇例題格式。'),
        range: t('Use integer endpoints from −10,000 to 10,000, with the lower endpoint smaller than the upper one.', '請用 −10,000 至 10,000 之間嘅整數端點，左端點要細過右端點。'),
      };
      status.textContent = corrections[match.kind] ?? t('Try an archived year and question number (2022/23 Q6), or a maximum in the example format. Check the symbols if this text came from a file.', '可以輸入已收錄嘅年份及題號（例如 2022/23 Q6），或者用例題格式輸入根式最大值問題。如用相片，請先核對符號。');
      return;
    }
    const entry = catalogue.find(item => item.id === match.id) ?? resolveBoard(match.id);
    if (!entry) return;
    selected = entry.id;
    get('label').textContent = match.kind === 'candidate'
      ? t('Possibly related contest lesson · compare the conditions', '搵到相關競賽課堂 · 請先比較題目條件')
      : match.kind === 'reviewed'
      ? t('Matched a reviewed contest lesson', '已配對到核對過嘅競賽課堂')
      : t('New board · domain and maximum checked', '新白板 · 已驗算定義域及最大值');
    get('question').textContent = entry.question[locale];
    const source = get<HTMLAnchorElement>('source');
    source.hidden = !('source' in entry && entry.source);
    if ('source' in entry && entry.source) {
      source.href = entry.source.url;
      source.textContent = entry.source.label + ' · Q' + entry.number;
    }
    status.textContent = t('Compare the question below with yours before opening the board.', '請對照下方題意，確認一致後再開課。');
    result.hidden = false;
  });
  get('confirm').addEventListener('click', () => { if (selected) openBoard(selected); });

  fileInput.addEventListener('change', async () => {
    loading?.abort();
    resetResult();
    preview.hidden = true;
    input.value = '';
    review.disabled = false;
    const file = fileInput.files?.[0];
    if (!file) { status.textContent = ''; return; }
    if (file.size > 12 * 1024 * 1024) {
      status.textContent = t('Choose a file under 12 MB.', '請揀一個 12 MB 以內嘅檔案。');
      return;
    }
    const job = new AbortController();
    loading = job;
    const { signal } = job;
    const check = () => signal.throwIfAborted();
    review.disabled = true;
    status.textContent = t('Reading the file on your device…', '正喺裝置讀取檔案…');
    try {
      const stage = document.createElement('canvas');
      let extracted = '';
      if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
        const moduleUrl = '/selah-ocr/pdf.min.mjs';
        const pdf: typeof import('pdfjs-dist') = await import(/* @vite-ignore */ moduleUrl);
        check();
        pdf.GlobalWorkerOptions.workerSrc = '/selah-ocr/pdf.worker.min.mjs';
        const task = pdf.getDocument({ data: new Uint8Array(await file.arrayBuffer()), useWasm: false, useSystemFonts: true });
        try {
          const doc = await task.promise;
          check();
          if (doc.numPages !== 1) throw new Error('MULTIPAGE');
          const page = await doc.getPage(1);
          const unscaled = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: Math.min(3, 1800 / Math.max(unscaled.width, unscaled.height)) });
          stage.width = Math.ceil(viewport.width);
          stage.height = Math.ceil(viewport.height);
          await page.render({ canvas: stage, viewport }).promise;
          const content = await page.getTextContent();
          extracted = content.items.map(item => 'str' in item ? item.str : '').join(' ').trim();
          if ((extracted.match(/[\p{L}\p{N}]/gu) ?? []).length < 4) extracted = '';
        } finally {
          await task.destroy();
        }
      } else if (/^image\/(jpeg|png|webp)$/i.test(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name)) {
        const url = URL.createObjectURL(file);
        try {
          const img = new Image();
          img.src = url;
          await img.decode();
          check();
          const scale = Math.min(2, 1800 / Math.max(img.naturalWidth, img.naturalHeight));
          stage.width = Math.max(1, Math.round(img.naturalWidth * scale));
          stage.height = Math.max(1, Math.round(img.naturalHeight * scale));
          const ctx = stage.getContext('2d')!;
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, stage.width, stage.height);
          ctx.drawImage(img, 0, 0, stage.width, stage.height);
        } finally {
          URL.revokeObjectURL(url);
        }
      } else {
        throw new Error('TYPE');
      }
      check();
      canvas.width = stage.width;
      canvas.height = stage.height;
      canvas.getContext('2d')!.drawImage(stage, 0, 0);
      preview.hidden = false;
      if (!extracted) {
        status.textContent = t('Loading the text reader on your device…', '正喺裝置載入文字辨識工具…');
        const { createWorker, OEM } = await import('tesseract.js');
        check();
        const worker = await createWorker(locale === 'en' ? ['eng'] : ['chi_tra', 'eng'], OEM.LSTM_ONLY, {
          workerPath: '/selah-ocr/worker.min.js', corePath: '/selah-ocr/', langPath: '/selah-ocr/',
          workerBlobURL: false,
          logger: event => {
            if (!signal.aborted && event.status === 'recognizing text') status.textContent = t('Reading the image', '正在辨識相片文字') + ' · ' + Math.round(event.progress * 100) + '%';
          },
        });
        const cancel = () => { void worker.terminate(); };
        signal.addEventListener('abort', cancel, { once: true });
        try {
          check();
          extracted = (await worker.recognize(stage)).data.text.trim();
        } finally {
          signal.removeEventListener('abort', cancel);
          await worker.terminate();
        }
      }
      check();
      if (extracted.length > 6000) throw new Error('LENGTH');
      input.value = extracted;
      status.textContent = extracted ? t('Text ready. Check it against the image and correct any symbols, then choose Check problem.', '文字已載入。請對照原圖修改數學符號，再撳「核對題目」。') : t('No clear text was found. Type the question below.', '未能辨認清楚文字，請喺下面輸入題目。');
    } catch (error) {
      if (signal.aborted) return;
      const code = error instanceof Error ? error.message : '';
      status.textContent = code === 'MULTIPAGE' ? t('This PDF contains multiple pages. Export the page with your problem and try again.', '呢份 PDF 有多過一頁。請另存題目嗰一頁再試。')
        : code === 'LENGTH' ? t('This page has several passages. Paste just the question, up to 6,000 characters.', '呢頁文字較多，請貼上其中一條題目，最多 6,000 字。')
        : t('The file could not be read. Try a clear JPG, PNG, WebP or unlocked single-page PDF, or paste the text.', '未能讀取檔案。請試清晰嘅 JPG、PNG、WebP 或無密碼單頁 PDF，亦可以直接貼文字。');
    } finally {
      if (loading === job) { review.disabled = false; loading = undefined; }
    }
  });
}
document.querySelectorAll<HTMLElement>('[data-selah-intake]').forEach(initialize);
