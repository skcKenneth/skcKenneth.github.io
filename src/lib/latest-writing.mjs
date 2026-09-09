/**
 * Homepage writing follows publication dates, independently of editorial flags.
 * Shared slugs break same-day ties identically in English and Traditional Chinese.
 * @template {{ data: { slug: string, sourceSlug?: string, date?: Date, draft?: boolean, archived?: boolean } }} T
 * @param {readonly T[]} entries
 * @param {number} limit
 * @returns {T[]}
 */
export function selectLatestWriting(entries, limit = 3) {
  return entries
    .filter(({ data }) => !data.draft && !data.archived)
    .sort((a, b) => {
      const dateDifference = (b.data.date?.valueOf() || 0) - (a.data.date?.valueOf() || 0);
      const aSlug = a.data.sourceSlug ?? a.data.slug;
      const bSlug = b.data.sourceSlug ?? b.data.slug;
      return dateDifference || (aSlug < bSlug ? -1 : aSlug > bSlug ? 1 : 0);
    })
    .slice(0, limit);
}
