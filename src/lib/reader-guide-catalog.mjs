import { READING_PATHS } from '../data/reading-paths.mjs';
import { CONCEPTS, conceptHref } from '../data/reader-concepts.mjs';

/** Named aliases complement Pagefind without replacing its full-text index. */
export function createReaderGuideCatalog(locale = 'en') {
  const base = locale === 'zh-Hant' ? '/zh' : '';
  const other = locale === 'zh-Hant' ? 'en' : 'zh-Hant';
  return [
    ...READING_PATHS.map(path => ({
      url: `${base}/topics/routes/${path.id}/`, alternateUrl: `${other === 'zh-Hant' ? '/zh' : ''}/topics/routes/${path.id}/`,
      id: path.id, title: path.title[locale], excerpt: path.description[locale],
      aliases: [path.id, ...Object.values(path.title)], topicIds: path.topicIds, kind: 'guide', archived: false,
    })),
    ...CONCEPTS.map(concept => ({
      url: conceptHref(concept.id, locale), alternateUrl: conceptHref(concept.id, other),
      id: concept.id, title: concept.label[locale], excerpt: concept.copy[locale].definition,
      aliases: [concept.id, ...Object.values(concept.label), ...Object.values(concept.aliases).flat()],
      topicIds: concept.topicIds, kind: 'guide', archived: false,
    })),
  ];
}
