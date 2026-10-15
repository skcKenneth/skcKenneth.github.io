/** Explicit formulas in authored teaching text. Never apply to learner content. */
export const FORMULA_RENDER_VERSION = '2026-10-15-formulas-v2';

export function assertCanonicalDisplayMath(value) {
  const expression = String(value);
  if (/\^(?:\(|[+-]|\d{2})/.test(expression)) {
    throw new Error(`Group the complete superscript with TeX braces: ${expression}`);
  }
  return expression;
}

export function splitAuthoredMath(value) {
  const text = String(value ?? ''), parts = [];
  // A TeX row break followed by '(' is not an inline delimiter.
  const delimiter=(token,from)=>{let found=text.indexOf(token,from);while(found!==-1){let slashes=0;for(let i=found-1;i>=0&&text[i]==='\\';i--)slashes++;if(slashes%2===0)return found;found=text.indexOf(token,found+2);}return -1;};
  let at = 0;
  while (at < text.length) {
    const start = delimiter('\\(', at), stray = delimiter('\\)', at);
    if (stray !== -1 && (start === -1 || stray < start)) throw new Error('Unmatched authored math closing delimiter');
    if (start === -1) { parts.push({kind:'text',value:text.slice(at)}); break; }
    if (start > at) parts.push({kind:'text',value:text.slice(at,start)});
    const end = delimiter('\\)', start + 2);
    if (end === -1) throw new Error('Unclosed authored math delimiter');
    const expression = text.slice(start+2,end).trim();
    const nested=delimiter('\\(',start+2);
    if (!expression || (nested!==-1&&nested<end)) throw new Error('Empty or nested authored math delimiter');
    parts.push({kind:'math',value:assertCanonicalDisplayMath(expression)});
    at = end + 2;
  }
  return parts;
}
