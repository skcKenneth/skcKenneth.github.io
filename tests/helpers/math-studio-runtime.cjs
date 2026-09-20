const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function loadSite(storage=new Map(),broken=false){
 const listeners={},elements={};function element(){return {innerHTML:'',textContent:'',value:'',dataset:{},querySelector(){return null;},querySelectorAll(){return [];},setAttribute(){},removeAttribute(){},focus(){this.focused=true;},addEventListener(t,fn){(listeners[t]??=[]).push(fn);}};}
 const app=elements.app=element();const ctx=vm.createContext({console,Intl,Date,Math,Set,Map,JSON,Blob,URL,setTimeout,AbortController,localStorage:{getItem(k){if(broken)throw Error('denied');return storage.get(k)||null;},setItem(k,v){if(broken)throw Error('denied');storage.set(k,v);}},window:{scrollY:0,scrollTo(){},addEventListener(){},print(){}},document:{title:'',getElementById(id){return elements[id]??=element();},querySelectorAll(){return [];},createElement(){return {click(){}};}}});
 const root=path.resolve(__dirname,'../../public/math-studio');
 for(const f of ['data.js','learning-content.js','challenge-bank.js','question-bank.js','learning-ui.js','practice.js','inquiry.js','inquiry-g7-core.js','inquiry-g7-content.js','inquiry-g7-ui.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
 const evaluate=s=>vm.runInContext(s,ctx);return {ctx,app,elements,listeners,storage,evaluate};
}
module.exports={loadSite};
