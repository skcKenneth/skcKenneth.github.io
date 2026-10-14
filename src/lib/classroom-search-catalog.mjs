import { ALL_CLASSROOM_PACKS, classroomPackHref } from '../data/classroom-packs.mjs';

/** Student activities are everyday entrances; teacher references require the lesson filter. */
export function createClassroomSearchCatalog(locale = 'en') {
  const other = locale === 'en' ? 'zh-Hant' : 'en';
  return ALL_CLASSROOM_PACKS.flatMap(pack => [false, true].map(teacher => ({
    id: `${pack.id}${teacher ? '-teacher' : ''}`,
    url: classroomPackHref(pack.id, locale, teacher),
    alternateUrl: classroomPackHref(pack.id, other, teacher),
    title: teacher ? `${pack.title[locale]} — ${locale === 'en' ? 'Teacher reference' : '教師參考'}` : pack.title[locale],
    excerpt: pack.summary[locale],
    aliases: [pack.id, ...Object.values(pack.title), ...Object.values(pack.sourceNavigation||{}), ...(pack.aliases||[]), ...(teacher ? ['teacher reference', '教師參考'] : ['classroom pack', '一節課活動', ...(pack.kind==='guided-practice'?['guided practice','paper practice','分步練習','紙筆練習','40 minutes','40分鐘']:[])])],
    kind: teacher ? 'lesson' : 'teaching', archived: false, topicIds: pack.topicIds,
  })));
}
