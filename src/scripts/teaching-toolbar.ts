import { loadProgress } from '../lib/jae-math-model.mjs';
import { progressForExport } from '../lib/jae-math-export.mjs';

export function initializeTeachingToolbar(toolbar: HTMLElement) {
  if (toolbar.dataset.ready) return; toolbar.dataset.ready = 'true';
  const zh = toolbar.dataset.locale === 'zh-Hant';
  const scope = toolbar.closest<HTMLElement>('[data-jae-studio], [data-workshop-lesson], [data-workshop-index], [data-senior-page]') || document.body;
  const target = toolbar.querySelector<HTMLElement>('[data-teaching-save-status]');
  const existingStatus = scope.querySelector<HTMLElement>('[data-save-status]');
  const copyStatus = () => { if (target && existingStatus?.textContent?.trim()) target.textContent = existingStatus.textContent.trim(); };
  if (existingStatus) { copyStatus(); new MutationObserver(copyStatus).observe(existingStatus, { childList: true, subtree: true, characterData: true }); }
  const button = toolbar.querySelector<HTMLButtonElement>('[data-teaching-export]');
  const exportButton = scope.querySelector<HTMLButtonElement>('[data-export="json"]');
  if (button && exportButton) { button.hidden = false; button.addEventListener('click', () => { if (!exportButton.disabled) exportButton.click(); }); }
  if (toolbar.dataset.kind === 'jae') {
    let storage: Storage | undefined; try { storage = window.localStorage; } catch { /* Never invent a saved state. */ }
    const loaded = storage ? loadProgress(storage) : null;
    const resume = toolbar.querySelector<HTMLAnchorElement>('[data-teaching-continue]');
    const ids = new Set((toolbar.dataset.questionIds || '').split(' ').filter(Boolean));
    const updateResume = (progress: any) => { const id = progress?.last?.question; if (!resume || !id || !ids.has(id)) return; const card = scope.querySelector<HTMLElement>(`[data-question="${CSS.escape(id)}"]`); resume.href = card ? `#${encodeURIComponent(id)}` : `${zh ? '/zh' : ''}/teaching/senior-math/questions/${encodeURIComponent(id)}/`; };
    if (loaded && !loaded.issue) updateResume(loaded.progress);
    scope.addEventListener('jae-progress', event => updateResume((event as CustomEvent).detail));
    if (button && !exportButton) {
      if (!loaded || loaded.issue) { if (target) target.textContent = zh ? '未能讀取本機紀錄' : 'Local record unavailable'; return; }
      if (target) target.textContent = Object.keys(loaded.progress.answers).length ? (zh ? '本機紀錄可讀取；只限此瀏覽器' : 'Local record available in this browser') : (zh ? '尚未有已保存的作答紀錄' : 'No saved answers yet');
      button.hidden = false;
      button.addEventListener('click', () => { const snapshot = progressForExport(storage, loaded.progress, new Set()); const url = URL.createObjectURL(new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'jae-math-learning-record.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
    }
  }
}
