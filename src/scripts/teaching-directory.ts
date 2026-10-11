export function initializeTeachingDirectory(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('[data-teaching-filters]');
  if (!form || root.dataset.ready) return;
  root.dataset.ready = 'true';
  const audience = form.elements.namedItem('audience') as HTMLSelectElement;
  const format = form.elements.namedItem('format') as HTMLSelectElement;
  const query = form.elements.namedItem('q') as HTMLInputElement;
  const cards = [...root.querySelectorAll<HTMLElement>('[data-teaching-resource]')];
  const zh = root.dataset.locale === 'zh-Hant';
  const render = (write = false) => {
    const q = query.value.trim().toLocaleLowerCase(); let total = 0;
    cards.forEach(card => { const match = (!audience.value || card.dataset.audiences?.split(' ').includes(audience.value)) && (!format.value || card.dataset.formats?.split(' ').includes(format.value)) && (!q || card.dataset.search?.includes(q)); card.hidden = !match; if (match) total++; });
    root.querySelector<HTMLElement>('[data-teaching-result-count]')!.textContent = `${total} ${zh ? '份資源' : total === 1 ? 'resource' : 'resources'}`;
    root.querySelector<HTMLElement>('[data-teaching-empty]')!.hidden = total > 0;
    root.querySelectorAll<HTMLAnchorElement>('[data-audience-link]').forEach(link => link.setAttribute('aria-current', link.dataset.audienceLink === audience.value ? 'true' : 'false'));
    if (write) { const url = new URL(location.href); for (const [key, value] of [['audience', audience.value], ['format', format.value], ['q', query.value.trim()]]) value ? url.searchParams.set(key, value) : url.searchParams.delete(key); history.pushState(null, '', url); }
  };
  const restore = () => { const params = new URLSearchParams(location.search); audience.value = params.get('audience') || ''; format.value = params.get('format') || ''; query.value = params.get('q') || ''; render(); };
  form.addEventListener('submit', event => { event.preventDefault(); render(true); }); form.addEventListener('change', () => render(true));
  let debounce: ReturnType<typeof setTimeout>; query.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => render(true), 250); });
  form.addEventListener('reset', () => { clearTimeout(debounce); setTimeout(() => render(true), 0); });
  root.querySelectorAll<HTMLAnchorElement>('[data-audience-link]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); audience.value = link.dataset.audienceLink || ''; render(true); root.querySelector('#teaching-resources')?.scrollIntoView({ block: 'start' }); audience.focus({ preventScroll: true }); }));
  window.addEventListener('popstate', restore); restore();
}
