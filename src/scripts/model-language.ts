import {translateModelText} from '../lib/model-translations.mjs';
/** Localize exact strings in generated SVG/output without modifying numerical engines. */
export function initializeModelLanguage(doc:Document){
 if(doc.documentElement.lang!=='zh-Hant'||doc.documentElement.dataset.modelLanguage==='ready')return;
 doc.documentElement.dataset.modelLanguage='ready';
 const skip='script,style,code,pre,.katex,math,[data-preserve-language]';
 function textNode(node:Text){
  if(node.parentElement?.closest(skip))return;
  const value=node.data,trimmed=value.trim();if(!trimmed)return;
  const translated=translateModelText(trimmed);if(translated!==trimmed)node.data=value.replace(trimmed,translated);
 }
 function translate(root:Node){
  if(root.nodeType===Node.TEXT_NODE){textNode(root as Text);return;}
  if(!(root instanceof Element)&&root!==doc.body)return;
  if(root instanceof Element&&root.closest(skip))return;
  const walker=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode()))textNode(node as Text);
  const elements=root instanceof Element?[root,...root.querySelectorAll('[aria-label],[title],[placeholder],[alt]')]:[];
  for(const element of elements){if(element.closest(skip))continue;for(const name of ['aria-label','title','placeholder','alt']){const value=element.getAttribute(name);if(value){const next=translateModelText(value);if(next!==value)element.setAttribute(name,next);}}}
 }
 translate(doc.body);
 const observer=new MutationObserver(records=>{for(const record of records){if(record.type==='characterData')translate(record.target);else if(record.type==='attributes')translate(record.target);else for(const node of record.addedNodes)translate(node);}});
 observer.observe(doc.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder','alt']});
 window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
}
