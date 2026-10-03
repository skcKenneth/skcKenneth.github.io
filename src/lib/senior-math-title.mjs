import { label,lessonById,questionById,books,chapters,papers,schoolRoutes } from '../data/senior-math/catalog.mjs';
export function pageTitle(page,locale){
  const zh=locale==='zh-Hant',titles={home:['Senior Mathematics Studio','高中數學研習室'],bank:['Question bank','可篩選題庫'],papers:['JAE past-paper explanations','聯考舊卷詳解'],remedial:['Build the foundations','補底與訂正路徑'],exam:['Prepare by examination skill','按聯考考點備試'],diagnostic:['Six starting checks','六題入口檢核'],teacher:['Teacher resources','教師備課資源'],sources:['Curriculum and source notes','教材與來源對照']};
  if(titles[page.type])return titles[page.type][zh?1:0];
  const item=page.type==='lesson'?lessonById.get(page.id):page.type==='question'?questionById.get(page.id):page.type==='book'?books.find(b=>b.id===page.id):page.type==='chapter'?chapters.find(c=>c.id===page.id):page.type==='school'?schoolRoutes.find(r=>r.id===page.id):papers.find(p=>p.id===page.id);
  return page.type==='paper'?`${item.year} ${item.code}`:page.type==='question'?label(item.prompt,locale):label(item.title,locale);
}
