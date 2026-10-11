import { POSITION_STORAGE_KEY, parsePositionState, mergePositionStates, positionGeneration, comparePositionStamp,
  getReadingPosition, setReadingPosition, clearReadingPosition, resolveReadingPosition, mappedHeading } from '../lib/reading-position.mjs';

type Stamp = {clock:number;actor:string};
type Heading = {slug:string;text:string;depth:number};
type Section = {id:string;en:string;'zh-Hant':string};
declare global { interface Window { __readerPositionCleanup?:()=>void; __readerPositionBooted?:boolean; } }

export function initializeReadingPosition(root: HTMLElement) {
  if (root.dataset.positionInitialized === 'true') return;
  const reader = document.querySelector<HTMLElement>('[data-article-reader]');
  const prose = reader?.querySelector<HTMLElement>('.reader-prose');
  if (!reader || !prose) return;
  let headings:Heading[], sections:Section[];
  try { headings = JSON.parse(root.dataset.headings || '[]'); sections = JSON.parse(root.dataset.sections || '[]'); } catch { return; }
  window.__readerPositionCleanup?.();
  root.dataset.positionInitialized = 'true';
  const abort = new AbortController(), options = {signal:abort.signal};
  const articleId = root.dataset.articleId!, locale = root.dataset.locale === 'zh-Hant' ? 'zh-Hant' : 'en';
  const zh = locale === 'zh-Hant', t = (en:string,ch:string)=>zh?ch:en;
  const actor = crypto.randomUUID?.() || `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const resume = root.querySelector<HTMLButtonElement>('[data-position-continue]')!;
  const clear = root.querySelector<HTMLButtonElement>('[data-position-clear]')!;
  const message = root.querySelector<HTMLElement>('[data-position-message]')!;
  const storageStatus = root.querySelector<HTMLElement>('[data-position-storage]')!;
  const status = root.querySelector<HTMLElement>('[data-position-status]')!;
  let state = parsePositionState(null), persistent = true, paused = false, intent = false, readingGesture = false;
  let timer:ReturnType<typeof setTimeout>|undefined, lastHeading = '', pendingHeading:Heading|undefined, languageHeading:string|undefined;
  function readStorage() { try { return parsePositionState(localStorage.getItem(POSITION_STORAGE_KEY)); } catch { persistent = false; return parsePositionState(null); } }
  state = readStorage();
  const generation:Stamp = {...positionGeneration(state, articleId)};
  const headingElement = (id:string) => { const element = document.getElementById(id); return element && prose!.contains(element) ? element : null; };
  const resolved = () => resolveReadingPosition(getReadingPosition(state, articleId), headings, sections, locale);
  function selectedHash() { try { const id = decodeURIComponent(location.hash.slice(1)); return headingElement(id) ? id : undefined; } catch { return undefined; } }
  languageHeading = location.hash ? selectedHash() : resolved().headingId;
  function render() {
    const position = getReadingPosition(state, articleId), result = resolved();
    resume.hidden = result.status !== 'ready'; clear.hidden = !position;
    resume.textContent = t('Continue from last section','由上次章節繼續');
    if (paused) message.textContent = t('This position was cleared. It will be remembered again when you reopen this article.','本篇位置已清除。重新開啟文章後，才會再次記住閱讀位置。');
    else if (result.status === 'ready') message.textContent = t(`Last section: ${result.label}`,`上次閱讀章節：${result.label}`);
    else if (result.status === 'stale') message.textContent = t('The article sections have changed; the saved section is no longer available. Start at the article opening or clear this position.','文章章節已更新，上次位置已失效。請由文章開頭閱讀，或清除本篇位置。');
    else if (result.status === 'unmapped') message.textContent = t('The saved section has no verified English counterpart. Start at the article opening; your position in the other language is kept.','上次章節未有已核對的繁中對應。請由文章開頭閱讀；另一語言的位置仍保留。');
    else message.textContent = t('Your reading position stays in this browser, separately from your saved reading list.','閱讀位置只會保存在這個瀏覽器，與「稍後閱讀」清單分開。');
    storageStatus.textContent = persistent ? '' : t('Browser storage is unavailable. This position lasts for this page only.','瀏覽器未允許儲存；閱讀位置只會暫存於本頁，關閉後不會保留。');
  }
  function persist() { try { localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(state)); persistent = true; } catch { persistent = false; } render(); }
  function reconcile(incoming:any) {
    state = mergePositionStates(state, incoming);
    if (comparePositionStamp(positionGeneration(state, articleId), generation) !== 0) {
      paused = true; if (timer) clearTimeout(timer); timer = undefined;
    }
  }
  function currentHeading() {
    const top = (document.querySelector('.site-header')?.getBoundingClientRect().height || 80) + 24;
    let current:Heading|undefined;
    for (const heading of headings) {
      const element = headingElement(heading.slug); if (!element) continue;
      if (element.getBoundingClientRect().top <= top) current = heading;
      else break;
    }
    return current;
  }
  function flush() {
    if (timer) clearTimeout(timer); timer = undefined;
    if (!intent || paused) return;
    reconcile(readStorage()); if (paused) { render(); return; }
    const heading = pendingHeading; pendingHeading = undefined; if (!heading || heading.slug === lastHeading) return;
    const sectionId = sections.find(section=>section[locale] === heading.slug)?.id || null;
    state = setReadingPosition(state, articleId, {headingId:heading.slug, locale, sectionId, outline:root.dataset.outline!}, actor, Date.now(), generation);
    lastHeading = heading.slug; persist();
  }
  const onScroll = () => {
    if (!readingGesture || paused || document.visibilityState === 'hidden') return;
    const heading = currentHeading(); if (!heading) return;
    pendingHeading = heading; languageHeading = heading.slug;
    if (timer) clearTimeout(timer); timer = setTimeout(flush, 700);
  };
  const onIntent = (event:Event) => {
    if (event.type === 'pointerdown' && (event.target as Element)?.closest?.('.site-header')) { readingGesture = false; return; }
    intent = true; readingGesture = true;
  };
  window.addEventListener('pointerdown', onIntent, {...options,passive:true});
  window.addEventListener('wheel', onIntent, {...options,passive:true});
  window.addEventListener('touchmove', onIntent, {...options,passive:true});
  window.addEventListener('keydown', event => {
    if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key) && !(event.target as Element)?.closest?.('input,textarea,select,button,a,summary,[contenteditable="true"]')) { intent = true; readingGesture = true; }
  }, options);
  window.addEventListener('focusin',event => { if ((event.target as Element)?.closest?.('.site-header')) readingGesture = false; },options);
  window.addEventListener('hashchange',() => { languageHeading = selectedHash(); readingGesture = false; },options);
  reader.addEventListener('click', event => {
    const link = (event.target as Element)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link?.closest('.reader-desktop-toc,.reader-mobile-toc')) return;
    let id:string; try { id = decodeURIComponent(link.hash.slice(1)); } catch { return; }
    const heading = headings.find(item => item.slug === id);
    if (!heading || !headingElement(id) || paused) return;
    // A TOC choice is explicit, even when its native hash jump fires no reading scroll.
    intent = true; readingGesture = false; pendingHeading = heading; languageHeading = id;
    if (timer) clearTimeout(timer); timer = setTimeout(flush,700);
  },options);
  window.addEventListener('scroll', onScroll, {...options,passive:true});
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); }, options);
  window.addEventListener('pagehide', flush, options);
  window.addEventListener('pageshow', event => { if (event.persisted) { reconcile(readStorage()); render(); intent = false; readingGesture = false; pendingHeading = undefined; languageHeading = location.hash ? selectedHash() : resolved().headingId; } }, options);
  window.addEventListener('storage', event => {
    if (event.key !== POSITION_STORAGE_KEY && event.key !== null) return;
    if (!event.newValue) { state = parsePositionState(null); paused = true; if (timer) clearTimeout(timer); render(); return; }
    reconcile(parsePositionState(event.newValue));
    if (JSON.stringify(state) !== event.newValue) persist(); else render();
  }, options);
  resume.addEventListener('click', () => {
    reconcile(readStorage()); const result = resolved();
    const target = result.status === 'ready' && result.headingId ? headingElement(result.headingId) : null;
    if (!target) { render(); return; }
    if (timer) clearTimeout(timer); timer = undefined; pendingHeading = undefined; readingGesture = false;
    target.tabIndex = -1; target.focus({preventScroll:true});
    languageHeading = result.headingId;
    target.scrollIntoView({block:'start',behavior:'instant'});
    const url = new URL(location.href); url.hash = result.headingId!; history.replaceState(history.state, '', url);
    status.textContent = t('Continued from the saved section.','已跳到上次閱讀章節。');
  }, options);
  clear.addEventListener('click', () => {
    state = clearReadingPosition(mergePositionStates(state,readStorage()), articleId, actor);
    paused = true; if (timer) clearTimeout(timer); persist();
    status.textContent = t('This article position was cleared. Saved articles and learning records were kept.','已清除本篇位置；稍後閱讀清單及學習紀錄已保留。');
    message.tabIndex = -1; message.focus({preventScroll:true});
  }, options);
  const language = document.querySelector<HTMLAnchorElement>('[data-language-switch]');
  if (language) {
    const alternate = new URL(language.href, location.href);
    language.dataset.readingPositionLanguageManaged = 'true';
    const syncLanguage = () => {
      const next = new URL(alternate); next.search = location.search; next.hash = '';
      // Header focus may scroll the viewport. It must not replace an explicit article selection.
      const source = languageHeading;
      const mapped = source && mappedHeading(source, locale, zh?'en':'zh-Hant', sections);
      if (mapped) next.hash = mapped;
      language.href = next.href;
    };
    language.addEventListener('focus',syncLanguage,options); language.addEventListener('click',syncLanguage,options); syncLanguage();
  }
  render();
  window.__readerPositionCleanup = () => { abort.abort(); if (timer) clearTimeout(timer); delete language?.dataset.readingPositionLanguageManaged; };
}
function boot() { const root = document.querySelector<HTMLElement>('[data-reading-position]'); if (root) initializeReadingPosition(root); else window.__readerPositionCleanup?.(); }
if (!window.__readerPositionBooted) { window.__readerPositionBooted = true; document.addEventListener('astro:page-load',boot); }
boot();
