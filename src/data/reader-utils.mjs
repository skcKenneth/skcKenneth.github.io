import { canonicalId, getTopicIds, localeBase, SITE_URL } from './site-reader.mjs';

export const ARTICLE_PAGE_SIZE = 12;
export function normalizeReaderText(value = '') {
  return String(value).normalize('NFKC').toLocaleLowerCase().trim();
}
export function readArticleQuery(search = '', defaults = {}) {
  const query = new URLSearchParams(search);
  return {
    q: query.get('q')?.trim() || '', topic: query.get('topic') || '',
    type: query.get('type') || '', year: query.get('year') || '',
    archive: query.has('archive') ? query.get('archive') === '1' : Boolean(defaults.archive),
    page: Math.max(1, Number.parseInt(query.get('page') || '1', 10) || 1)
  };
}
export function writeArticleQuery(state) {
  const query = new URLSearchParams();
  for (const key of ['q', 'topic', 'type', 'year']) if (state[key]) query.set(key, state[key]);
  // Explicit zero preserves the user's selection on the archive route.
  query.set('archive', state.archive ? '1' : '0');
  if (state.page > 1) query.set('page', String(state.page));
  return query.toString();
}
export function filterArticles(items, state) {
  const words = normalizeReaderText(state.q).split(/\s+/u).filter(Boolean);
  return items.filter(item => (state.archive || !item.archived)
    && (!state.topic || item.topicIds.includes(state.topic))
    && (!state.type || item.type === state.type)
    && (!state.year || String(item.year) === state.year)
    && words.every(word => normalizeReaderText(item.search).includes(word)));
}
export function paginateArticles(items, requestedPage = 1, pageSize = ARTICLE_PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(pageCount, Math.max(1, requestedPage));
  return { items: items.slice((page - 1) * pageSize, page * pageSize), page, pageCount, total: items.length };
}
export function selectRelatedArticles(entry, entries, limit = 3) {
  const id = canonicalId(entry.data);
  const candidates = entries.filter(item => !item.data.draft && !item.data.archived && canonicalId(item.data) !== id);
  const selected = [];
  for (const slug of entry.data.relatedSlugs || []) {
    const item = candidates.find(item => item.data.slug === slug || canonicalId(item.data) === slug);
    if (item && !selected.includes(item)) selected.push(item);
  }
  const topicIds = getTopicIds(entry.data);
  const score = item => getTopicIds(item.data).filter(topic => topicIds.includes(topic)).length;
  const remaining = candidates.filter(item => !selected.includes(item)).sort((a, b) =>
    score(b) - score(a) || (b.data.date?.valueOf() || 0) - (a.data.date?.valueOf() || 0) || a.data.slug.localeCompare(b.data.slug));
  return [...selected, ...remaining].slice(0, limit);
}
export function xmlEscape(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);
}
export function createWritingFeed(entries, locale = 'en') {
  const isZh = locale === 'zh-Hant';
  const base = localeBase(locale);
  const published = entries.filter(entry => !entry.data.draft && !entry.data.archived && entry.data.slug !== 'legacy-archive')
    .sort((a, b) => (b.data.date?.valueOf() || 0) - (a.data.date?.valueOf() || 0));
  const feedUrl = `${SITE_URL}${base}/rss.xml`;
  const latest = Math.max(0, ...published.map(entry => (entry.data.lastUpdated || entry.data.date)?.valueOf() || 0));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${xmlEscape(isZh ? 'Kenneth Cheng — 文章' : 'Kenneth Cheng — Writing')}</title>
<link>${SITE_URL}${base}/writing/</link><description>${xmlEscape(isZh ? '數學思考、計算實驗與教學的新文章。' : 'New writing on mathematical thinking, computational experiments and teaching.')}</description>
<language>${locale}</language><atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${latest ? `<lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>` : ''}
${published.map(entry => {
    const url = `${SITE_URL}${base}/writing/${entry.data.slug}/`;
    return `<item><title>${xmlEscape(entry.data.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${xmlEscape(entry.data.summary)}</description>${entry.data.date ? `<pubDate>${entry.data.date.toUTCString()}</pubDate>` : ''}${getTopicIds(entry.data).map(topic => `<category>${topic}</category>`).join('')}</item>`;
  }).join('\n')}
</channel></rss>`;
}
