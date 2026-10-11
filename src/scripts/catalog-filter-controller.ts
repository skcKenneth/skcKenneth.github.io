import { catalogFilterUrl, matchesCatalogFilters, readCatalogFilters, translatedCatalogFilters } from '../lib/catalog-filters.mjs';

/** Shared behaviour for small, server-rendered catalogues; no experiment runtime imports. */
export function initializeCatalogFilters(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('[data-catalog-filters]');
  if (!form || root.dataset.filtersReady) return;
  root.dataset.filtersReady = 'true';
  const selects = [...form.querySelectorAll<HTMLSelectElement>('select[name]')];
  const options: Record<string, string[]> = Object.fromEntries(selects.map(select => [select.name, [...select.options].map(option => option.value)]));
  const kind = root.dataset.catalogKind || 'project';
  const zh = root.dataset.locale === 'zh-Hant';
  const cards = [...root.querySelectorAll<HTMLElement>(kind === 'model' ? '[data-model-library] article' : '[data-project-card]')];
  const count = root.querySelector<HTMLElement>('[data-catalog-count]');
  const empty = root.querySelector<HTMLElement>('[data-catalog-empty]');
  const language = document.querySelector<HTMLAnchorElement>('[data-language-switch]');
  if (language) language.dataset.catalogLanguageManaged = 'true';
  const targetOptions: Record<string, string[]> = root.dataset.alternateOptions ? JSON.parse(root.dataset.alternateOptions) : options;
  const currentFilters = () => Object.fromEntries(selects.map(select => [select.name, select.value]));
  const syncLanguage = () => {
    if (!language) return;
    const target = new URL(language.href, location.href);
    target.search = '';
    target.hash = location.hash;
    language.href = catalogFilterUrl(target.href, translatedCatalogFilters(currentFilters(), targetOptions)).href;
  };
  const render = (write = false) => {
    const filters = currentFilters(); let visible = 0;
    for (const card of cards) {
      const match = matchesCatalogFilters(kind, card.dataset, filters);
      card.hidden = !match;
      if (match) visible++;
    }
    if (count) count.textContent = zh ? `顯示 ${visible} / ${cards.length} ${kind === 'model' ? '個實驗' : '個專案'}` : `Showing ${visible} of ${cards.length} ${kind === 'model' ? 'experiments' : 'projects'}.`;
    if (empty) empty.hidden = visible > 0;
    if (write) {
      const url = catalogFilterUrl(location.href, filters);
      if (url.href !== location.href) history.pushState(null, '', url);
    }
    syncLanguage();
  };
  const restore = () => {
    const filters = readCatalogFilters(location.search, options);
    for (const select of selects) select.value = filters[select.name];
    render();
  };
  form.addEventListener('submit', event => { event.preventDefault(); render(true); });
  form.addEventListener('change', () => render(true));
  form.addEventListener('reset', event => {
    event.preventDefault();
    for (const select of selects) select.value = '';
    render(true);
    selects[0]?.focus();
  });
  window.addEventListener('popstate', restore);
  window.addEventListener('pageshow', event => { if (event.persisted) restore(); });
  language?.addEventListener('focus', syncLanguage);
  language?.addEventListener('click', syncLanguage);
  restore();
}
