const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const lockQueues=new WeakMap();
function loadSite(storage=new Map(),broken=false){
 const listeners={},elements={};function element(){return {innerHTML:'',textContent:'',value:'',dataset:{},querySelector(){return null;},querySelectorAll(){return [];},setAttribute(){},removeAttribute(){},focus(){this.focused=true;},addEventListener(t,fn){(listeners[t]??=[]).push(fn);}};}
 if(!lockQueues.has(storage))lockQueues.set(storage,Promise.resolve());const locks={request(name,work){const task=lockQueues.get(storage).then(work);lockQueues.set(storage,task.catch(()=>{}));return task;}};
 const app=elements.app=element();const ctx=vm.createContext({console,Intl,Date,Math,Set,Map,JSON,Blob,URL,URLSearchParams,Promise,setTimeout,clearTimeout,AbortController,localStorage:{getItem(k){if(broken)throw Error('denied');return storage.get(k)||null;},setItem(k,v){if(broken)throw Error('denied');storage.set(k,v);},removeItem(k){if(broken)throw Error('denied');storage.delete(k);},get length(){return storage.size;},key(i){return [...storage.keys()][i]||null;}},window:{scrollY:0,scrollTo(){},navigator:{locks},addEventListener(){},print(){}},document:{title:'',getElementById(id){return elements[id]??=element();},querySelector(){return null;},querySelectorAll(){return [];},createElement(){return {click(){}};}}});
 const root=path.resolve(__dirname,'../../public/math-studio');
 vm.runInContext(fs.readFileSync(path.join(root,'../math-shared/storage.js'),'utf8'),ctx,{filename:'storage.js'});ctx.MathStorage=ctx.window.MathStorage;
 vm.runInContext(fs.readFileSync(path.join(root,'../math-shared/native-store.js'),'utf8'),ctx,{filename:'native-store.js'});
 for(const f of ['data.js','guided-practice-catalog.js','learning-content.js','challenge-bank.js','question-bank.js','learning-ui.js','practice.js','inquiry.js','inquiry-g7-core.js','inquiry-g7-content.js','inquiry-g7-ui.js','inquiry-g8-core.js','inquiry-g8-content.js','inquiry-g8-ui.js','app.js'])if(fs.existsSync(path.join(root,f)))vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
 const evaluate=s=>vm.runInContext(s,ctx),flush=()=>ctx.MathStorage.flushAll();return {ctx,app,elements,listeners,storage,evaluate,flush};
}
module.exports={loadSite};
