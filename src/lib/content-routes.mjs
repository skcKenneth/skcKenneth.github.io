import { canonicalId } from '../data/site-reader.mjs';

/**
 * Resolve a content page within its collection before pairing its translation.
 * A Writing story and a Project overview may share a slug without sharing metadata.
 * @param {string} pathname
 * @param {Record<string, any[]>} collections
 */
export function resolveContentRoute(pathname, collections) {
  const match = pathname.match(/^\/(zh\/)?(writing|projects|research|teaching)\/([^/]+)\/?$/);
  if (!match) return { entry: undefined, alternatePath: undefined };
  const [, translated, section, slug] = match;
  const localCollection = `${section}${translated ? 'Zh' : ''}`;
  const otherCollection = `${section}${translated ? '' : 'Zh'}`;
  const entry = (collections[localCollection] || []).find(item => !item.data.draft && item.data.slug === slug);
  if (!entry) return { entry: undefined, alternatePath: undefined };
  const pair = (collections[otherCollection] || []).find(item => !item.data.draft && canonicalId(item.data) === canonicalId(entry.data));
  return { entry, alternatePath: pair ? `${translated ? '' : '/zh'}/${section}/${pair.data.slug}/` : undefined };
}
