const {test}=require('node:test');
const assert=require('node:assert/strict');
const {loadSite}=require('./helpers/math-studio-runtime.cjs');
function input(site,dataset,value){for(const fn of site.listeners.input)fn({target:{dataset,value,matches(){return false;},closest(){return null;},checkValidity(){return true;},removeAttribute(){}}});}
test('two real legacy clients merge different first-record fields and retain unknown records',async()=>{
 const key='math-studio-inquiry-v2',unknown={future:{prediction:'Unrecognised original record',extra:{keep:true}}};
 const map=new Map([[key,JSON.stringify(unknown)]]),a=loadSite(map),b=loadSite(map);
 input(a,{inquiryField:'prediction',inquiryType:'triangle'},'A: strict triangle inequality');
 input(b,{inquiryField:'claim',inquiryType:'triangle'},'B: equality is degenerate');
 await Promise.all([a.flush(),b.flush()]);
 const saved=JSON.parse(map.get(key));assert.equal(saved.triangle.prediction,'A: strict triangle inequality');assert.equal(saved.triangle.claim,'B: equality is degenerate');assert.deepEqual(saved.future,unknown.future);
});
test('same-field edits retain both versions in a recovery conflict rather than overwriting',async()=>{
 const key='math-studio-inquiry-v2',map=new Map([[key,JSON.stringify({triangle:{prediction:'original'}})]]),a=loadSite(map),b=loadSite(map);
 input(a,{inquiryField:'prediction',inquiryType:'triangle'},'First competing prediction');input(b,{inquiryField:'prediction',inquiryType:'triangle'},'Second competing prediction');
 await Promise.all([a.flush(),b.flush()]);assert.equal(JSON.parse(map.get(key)).triangle.prediction,'First competing prediction');
 const variants=[...map].filter(([k])=>k.startsWith('math-learning-sync-v1:recovery:math-studio-inquiry-v2:')).flatMap(([,v])=>JSON.parse(v).conflicts||[]);
 assert(variants.some(v=>v.local==='Second competing prediction'&&v.remote==='First competing prediction'));
 assert(b.evaluate("Inquiry.exportText('triangle')").includes('Second competing prediction'));
});
test('Year 7 first-record reasoning merges while old fallback evidence remains verbatim',async()=>{
 const old={number:{prediction:'original',evidence:[{settings:'a=-3',result:'distance=3'}]}},raw=JSON.stringify(old),map=new Map([['math-studio-inquiry-v2',raw]]),a=loadSite(map),b=loadSite(map);
 input(a,{g7Id:'number',g7Field:'prediction'},'A new prediction');input(b,{g7Id:'number',g7Field:'claim'},'B new reasoning');
 await Promise.all([a.flush(),b.flush()]);
 const saved=JSON.parse(map.get('math-studio-inquiry-g7-v1')).number;
 assert.equal(saved.prediction,'A new prediction');assert.equal(saved.claim,'B new reasoning');assert.equal(saved.evidence[0].settings,'a=-3');assert.equal(saved.evidence[0].result,'distance=3');assert.equal(map.get('math-studio-inquiry-v2'),raw);
});
