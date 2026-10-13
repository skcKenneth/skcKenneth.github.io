'use strict';
(() => {
  const toolbar = document.querySelector('[data-site-learning-toolbar]');
  const appRoot = document.getElementById('app');
  if (!toolbar || !appRoot) return;
  const exportButton = toolbar.querySelector('[data-site-export]');
  const status = toolbar.querySelector('[data-site-save-status]');
  const currentExport = () => appRoot.querySelector('[data-g8-action="export"], [data-g7-action="export"], [data-inquiry-action="export"]');
  const update = () => {
    exportButton.disabled = !currentExport();
    const source = appRoot.querySelector('#g8-save-status, #g7-save-status, #inquiry-save-status');
    status.textContent = source?.textContent?.trim() || '探究紀錄限此瀏覽器；作答與分數限本次頁面。';
  };
  exportButton.addEventListener('click', () => currentExport()?.click());
  new MutationObserver(update).observe(appRoot, { subtree: true, childList: true, characterData: true });
  update();
})();
