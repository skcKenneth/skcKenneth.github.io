const normalize = text => text.normalize('NFKC').toLocaleLowerCase().replace(/\s+/gu, '');
export function matchCatalog(query, catalog) {
  const term = normalize(query);
  return term.length < 2 ? [] : catalog.filter(entry => entry.aliases.some(alias => normalize(alias).includes(term)));
}
export function mergeSearchResults(named, indexed, origin) {
  const seen = new Set();
  return [...named, ...indexed].filter(entry => {
    const key = new URL(entry.url, origin).pathname.replace(/\/$/, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
