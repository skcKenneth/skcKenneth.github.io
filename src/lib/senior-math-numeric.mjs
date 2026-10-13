/** A bounded arithmetic parser: numbers, pi, square roots and arithmetic only. */
export function parseExactNumeric(input) {
 const source=String(input??'').trim().replaceAll('−','-').replaceAll('×','*').replaceAll('÷','/');
 if(!source||source.length>200)return null;
 const tokens=[];let offset=0;
 while(offset<source.length){
  if(/\s/.test(source[offset])){offset++;continue;}
  const match=/^(?:\d+(?:\.\d*)?|\.\d+|sqrt|pi|π|√|[()+*/^-])/.exec(source.slice(offset));
  if(!match)return null;tokens.push(match[0]);offset+=match[0].length;if(tokens.length>100)return null;
 }
 let position=0,depth=0;
 const finite=value=>{if(!Number.isFinite(value))throw Error('nonfinite');return value;};
 const atom=()=>{
  if(++depth>16)throw Error('depth');let value;const token=tokens[position++];
  if(token==='('){value=sum();if(tokens[position++]!==')')throw Error('parenthesis');}
  else if(token==='sqrt'){if(tokens[position++]!=='(')throw Error('sqrt');value=Math.sqrt(sum());if(tokens[position++]!==')')throw Error('sqrt');}
  else if(token==='√'){value=Math.sqrt(atom());}
  else if(token==='pi'||token==='π')value=Math.PI;
  else if(token&&/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(token))value=Number(token);
  else throw Error('atom');depth--;return finite(value);
 };
 const power=()=>{let value=atom();if(tokens[position]==='^'){position++;const exponent=unary();if(Math.abs(exponent)>100||value===0&&exponent<=0)throw Error('exponent');value=finite(value**exponent);}return value;};
 const unary=()=>tokens[position]==='+'?(position++,unary()):tokens[position]==='-'?(position++,-unary()):power();
 const product=()=>{
  let value=unary();
  while(position<tokens.length){
   const token=tokens[position],implicit=['(','pi','π','sqrt','√'].includes(token);
   if(token!=='*'&&token!=='/'&&!implicit)break;if(!implicit)position++;
   const right=unary();value=finite(token==='/'?value/right:value*right);
  }return value;
 };
 const sum=()=>{let value=product();while(tokens[position]==='+'||tokens[position]==='-'){const sign=tokens[position++],right=product();value=finite(sign==='+'?value+right:value-right);}return value;};
 try{const result=sum();return position===tokens.length?finite(result):null;}catch{return null;}
}
