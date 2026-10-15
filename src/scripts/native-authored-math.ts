import katex from 'katex';
import {splitAuthoredMath,FORMULA_RENDER_VERSION} from '../lib/authored-math.mjs';
const escape=(value:string)=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export const version=FORMULA_RENDER_VERSION;
/** Caller must translate authored text first. User drafts continue to use textContent. */
export function render(text:string) {
  return splitAuthoredMath(text).map(part=>part.kind==='text'?escape(part.value):`<span class="authored-math-inline" data-authored-math>${katex.renderToString(part.value,{displayMode:false,output:'htmlAndMathml',throwOnError:true,trust:false,strict:'warn'})}</span>`).join('');
}
