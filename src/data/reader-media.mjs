import manifest from '../../public/images/reader-media-manifest.json' with { type: 'json' };

export const EDITORIAL_ARTICLE_IDS = Object.freeze([
  'do-more-test-time-steps-make-better-forecasts',
  'two-networks-one-spectrum-different-alarms',
  'how-many-equilibria-did-the-optimizer-miss',
  'what-must-a-traffic-model-remember',
  'when-the-fit-is-not-the-model',
  'random-stress-tests-are-not-certificates',
  'when-solar-power-changes-fast'
]);

/** Decorative editorial art is separate from every scientific hero/figure. */
export function getReaderMedia(articleId, locale = 'en') {
  if (!EDITORIAL_ARTICLE_IDS.includes(articleId) || !['en', 'zh-Hant'].includes(locale)) return null;
  const item = manifest.editorial?.[articleId];
  if (!item?.titles?.[locale] || !manifest.images[item.cover] || !manifest.images[item.shares?.[locale]]) return null;
  return {
    cover: { src: '/' + item.cover, width: 640, height: 400 },
    share: { src: '/' + item.shares[locale], width: 1200, height: 630, alt: `${item.titles[locale]} — Kenneth Cheng` }
  };
}
