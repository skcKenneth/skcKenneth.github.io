import { canonicalId } from '../src/data/site-reader.mjs';
import { conceptHref, conceptPlacementsFor, getConcept, getConceptCopy } from '../src/data/reader-concepts.mjs';

const element = (tagName, properties, children) => ({type:'element',tagName,properties,children});
const text = value => ({type:'text',value});

/** Only original writing Markdown with explicit editorial metadata can receive a prompt. */
export function resolveConceptArticleContext(file) {
  const path = String(file.path || file.history?.[0] || '').replace(/\\/g,'/');
  const match = path.match(/(?:^|\/)src\/content\/(writing|writing-zh)\/[^/]+\.md$/);
  const data = file.data?.astro?.frontmatter;
  if (!match || !data || data.draft || data.archived || data.legacySource) return null;
  const articleId = canonicalId(data);
  const locale = match[1] === 'writing-zh' ? 'zh-Hant' : 'en';
  return conceptPlacementsFor(articleId, locale).length ? {articleId,locale} : null;
}

function conceptNote(conceptId, articleId, locale) {
  const concept = getConcept(conceptId);
  const copy = getConceptCopy(conceptId,locale);
  const zh = locale === 'zh-Hant';
  const paragraph = (label, value) => element('p',{},[element('strong',{},[text(label)]),text(value)]);
  return element('details',{
    className:['reader-concept-note'],
    'data-reader-concept':conceptId,
    'data-concept-article':articleId,
    'data-pagefind-ignore':true
  },[
    element('summary',{},[text(`${zh?'概念導讀':'Concept guide'} · ${concept.label[locale]}`)]),
    element('div',{className:['reader-concept-note-body']},[
      element('p',{},[text(copy.definition)]),
      paragraph(zh?'本文例子：':'In this article: ',copy.example),
      paragraph(zh?'常見誤解：':'Common misconception: ',copy.misconception),
      paragraph(zh?'適用範圍：':'Scope: ',copy.scope),
      element('p',{className:['reader-concept-note-link']},[element('a',{href:conceptHref(conceptId,locale)},[text(zh?'查看完整詞條與參考來源 →':'Read the concept and its sources →')])])
    ])
  ]);
}

/** Run after rehypeHeadingIds. Inserts native HTML without altering prose or headings. */
export default function rehypeReaderConcepts() {
  return (tree, file) => {
    const context = resolveConceptArticleContext(file);
    if (!context) return;
    const placements = conceptPlacementsFor(context.articleId,context.locale);
    const found = new Map(placements.map(placement => [placement.headingId,0]));
    const existing = new Set();
    function inspect(node) {
      if (node.type === 'element' && node.properties?.['data-reader-concept']) existing.add(node.properties['data-reader-concept']);
      for (const child of node.children || []) inspect(child);
    }
    inspect(tree);
    function insert(parent) {
      if (!parent.children) return;
      const children = [];
      for (const node of parent.children) {
        children.push(node);
        const placement = node.type === 'element' && /^h[23]$/.test(node.tagName)
          ? placements.find(placement => placement.headingId === node.properties?.id) : undefined;
        if (placement) {
          found.set(placement.headingId,found.get(placement.headingId)+1);
          if (!existing.has(placement.conceptId)) children.push(conceptNote(placement.conceptId,context.articleId,context.locale));
        }
        insert(node);
      }
      parent.children = children;
    }
    insert(tree);
    for (const [headingId,count] of found) {
      if (count !== 1) throw new Error(`Reader concept placement requires one heading "${headingId}" in ${file.path}; found ${count}. Review the paired placement before publishing.`);
    }
  };
}
