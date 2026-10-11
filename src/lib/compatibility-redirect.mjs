/** Resolve trusted, root-relative route aliases while retaining supported reader state. */
export const READER_QUERY_KEYS = ['q', 'topic', 'type', 'year', 'page', 'archive'];

export function compatibilityDestination(destination, search = '', hash = '', options = {}) {
  if (typeof destination !== 'string' || !destination.startsWith('/') || destination.startsWith('//') || /[\\\u0000-\u0020]/.test(destination)) {
    throw new TypeError('Compatibility destinations must be root-relative site paths.');
  }
  const target = new URL(destination, 'https://site.invalid');
  if (target.origin !== 'https://site.invalid' || target.pathname.startsWith('//')) {
    throw new TypeError('Compatibility destinations must stay within the site after normalization.');
  }
  const incoming = new URLSearchParams(search);
  for (const key of options.queryKeys ?? READER_QUERY_KEYS) {
    if (incoming.has(key)) target.searchParams.set(key, incoming.get(key));
  }
  if (options.preserveHash !== false && hash) {
    const key = hash.replace(/^#/, '');
    const mapped = options.hashMap && Object.hasOwn(options.hashMap, key) ? options.hashMap[key] : undefined;
    target.hash = mapped === undefined ? hash : mapped;
  }
  return `${target.pathname}${target.search}${target.hash}`;
}
