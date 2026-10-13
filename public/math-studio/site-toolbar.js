'use strict';
(() => {
  const toolbar = document.querySelector('[data-site-learning-toolbar]');
  const appRoot = document.getElementById('app');
  if (!toolbar || !appRoot) return;
  const exportButton = toolbar.querySelector('[data-site-export]');
  const status = toolbar.querySelector('[data-site-save-status]');
  const currentExport = () => appRoot.querySelector('[data-g8-action="export"], [data-g7-action="export"], [data-inquiry-action="export"]');
  const update = () => {
    const en = document.documentElement.lang === 'en';
    toolbar.setAttribute('aria-label', en ? 'Learning tools' : '學習工具');
    const links = toolbar.querySelectorAll('a');
    links[0].textContent = en ? '← All teaching resources' : '← 返回教學總覽';
    links[0].href = en ? '/teaching/' : '/zh/teaching/';
    links[1].textContent = en ? 'Continue learning' : '繼續學習';
    toolbar.querySelector('strong').textContent = en ? 'English' : '繁體中文';
    exportButton.textContent = en ? 'Export current inquiry' : '匯出目前探究';
    exportButton.disabled = !currentExport();
    const source = appRoot.querySelector('#g8-save-status, #g7-save-status, #inquiry-save-status');
    status.textContent = source?.textContent?.trim() || (en ? 'Inquiry notes stay in this browser; practice answers and scores stay in this session.' : '探究紀錄限此瀏覽器；作答與分數限本次頁面。');
  };
  exportButton.addEventListener('click', () => currentExport()?.click());
  new MutationObserver(update).observe(appRoot, { subtree: true, childList: true, characterData: true });
  update();
})();
