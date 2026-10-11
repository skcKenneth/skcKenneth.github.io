declare global { interface Window { __readerPrintCleanup?:()=>void; __readerPrintBooted?:boolean; } }
/** Fixed print tables can be narrower than their pre-print screen measurements. */
export function availablePrintMathWidth(math:HTMLElement, paperWidth:number) {
  let available = Math.min(math.parentElement?.getBoundingClientRect().width || paperWidth,paperWidth);
  const cell = math.closest<HTMLTableCellElement>('td,th'), table = cell?.closest('table');
  if (cell && table) {
    const columns = Math.max(1,...[...table.rows].map(row => [...row.cells].reduce((sum,item) => sum + item.colSpan,0)));
    const tableWidth = Math.min(table.getBoundingClientRect().width || paperWidth,paperWidth);
    // Each fixed-layout column shares the table width; subtract both 1.5mm cell paddings.
    available = Math.min(available,tableWidth * cell.colSpan / columns - 12);
  }
  return Math.max(1,available);
}
/** Fit the rendered formula, preserving the TeX and MathML. Transform is avoided because it leaves stale layout width. */
export function fitPrintMath(math:HTMLElement, available:number) {
  const fontSize = Number.parseFloat(getComputedStyle(math).fontSize);
  math.style.display = 'inline-block'; math.style.width = 'max-content';
  const natural = Math.max(math.scrollWidth, math.getBoundingClientRect().width);
  const scale = Math.min(1, Math.max(1, available - 3) / Math.max(1,natural));
  if (scale < 1) math.style.fontSize = `${fontSize * scale}px`;
  return {scale, fontSize:fontSize*scale};
}
export function initializeReaderPrint(button:HTMLButtonElement) {
  if (button.dataset.printInitialized === 'true') return;
  window.__readerPrintCleanup?.(); button.dataset.printInitialized = 'true'; button.disabled = false;
  const abort = new AbortController(), options = {signal:abort.signal};
  const scope = document.querySelector<HTMLElement>('[data-article-reader]');
  const header = document.querySelector<HTMLElement>('.reader-article-head');
  if (!scope || !header) return;
  let active = false;
  const details = new Map<HTMLDetailsElement,boolean>(), styles = new Map<HTMLElement,string|null>();
  const prepare = () => {
    if (active) return; active = true;
    for (const area of [scope,header]) for (const item of area.querySelectorAll<HTMLDetailsElement>('details')) { details.set(item,item.open); item.open = true; }
    const probe = document.createElement('div'); probe.style.cssText = 'position:absolute;width:180mm;height:0;visibility:hidden;'; document.body.append(probe);
    const paperWidth = probe.getBoundingClientRect().width; probe.remove();
    for (const math of scope.querySelectorAll<HTMLElement>('.reader-prose .katex')) {
      styles.set(math,math.getAttribute('style'));
      const available = availablePrintMathWidth(math,paperWidth);
      const result = fitPrintMath(math,available);
      if (result.fontSize < 10.67) math.dataset.printSmallMath = 'true';
    }
    document.documentElement.dataset.readerPrinting = 'true';
  };
  const restore = () => {
    for (const [item,open] of details) item.open = open;
    for (const [item,style] of styles) { if (style === null) item.removeAttribute('style'); else item.setAttribute('style',style); delete item.dataset.printSmallMath; }
    details.clear(); styles.clear(); active = false; delete document.documentElement.dataset.readerPrinting;
  };
  window.addEventListener('beforeprint',prepare,options); window.addEventListener('afterprint',restore,options);
  button.addEventListener('click',async () => {
    button.disabled = true;
    try {
      await document.fonts?.ready;
      await Promise.allSettled([...scope.querySelectorAll<HTMLImageElement>('.reader-prose img')].map(image => { image.loading = 'eager'; return image.decode?.(); }));
      window.print();
    } finally { button.disabled = false; }
  },options);
  window.__readerPrintCleanup = () => { restore(); abort.abort(); };
}
function boot() { const button = document.querySelector<HTMLButtonElement>('[data-reader-print]'); if (button) initializeReaderPrint(button); else window.__readerPrintCleanup?.(); }
if (!window.__readerPrintBooted) { window.__readerPrintBooted = true; document.addEventListener('astro:page-load',boot); }
boot();
