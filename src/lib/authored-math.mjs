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
  let at = 0;
  while (at < text.length) {
    const start = text.indexOf('\\(', at), stray = text.indexOf('\\)', at);
    if (stray !== -1 && (start === -1 || stray < start)) throw new Error('Unmatched authored math closing delimiter');
    if (start === -1) { parts.push({kind:'text',value:text.slice(at)}); break; }
    if (start > at) parts.push({kind:'text',value:text.slice(at,start)});
    const end = text.indexOf('\\)', start + 2);
    if (end === -1) throw new Error('Unclosed authored math delimiter');
    const expression = text.slice(start+2,end).trim();
    if (!expression || expression.includes('\\(')) throw new Error('Empty or nested authored math delimiter');
    parts.push({kind:'math',value:assertCanonicalDisplayMath(expression)});
    at = end + 2;
  }
  return parts;
}
