export const C={ink:'#193b33',green:'#27866c',amber:'#b66b24',red:'#b63b43',muted:'#60736d',paper:'#faf8f1',line:'#ced9cf'};
export const t=(locale,en,zh)=>locale==='zh-Hant'?zh:en;
export const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const fmt=value=>Number.isFinite(value)?String(Number(value.toFixed(6))):'—';
export const finite=(value,fallback=0)=>typeof value==='number'&&Number.isFinite(value)?value:fallback;
export const clamp=(value,lo,hi)=>Math.max(lo,Math.min(hi,value));
export const snap=(value,step=1)=>Number((Math.round(value/step)*step).toFixed(9));
export const clone=value=>JSON.parse(JSON.stringify(value));
export const text=(x,y,value,attrs='')=>`<text x="${x}" y="${y}" fill="${C.ink}" ${/font-size=/.test(attrs)?'':'font-size="20"'} ${attrs}>${esc(value)}</text>`;
export const line=(x1,y1,x2,y2,color=C.line,width=2,attrs='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${attrs}/>`;
export const circle=(x,y,r=7,fill=C.green,stroke=C.green)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
export const rect=(x,y,w,h,fill=C.paper,stroke=C.line,attrs='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="2" rx="10" ${attrs}/>`;
export function dragValue(action,lo,hi,pixelLo,pixelHi,axis='x',step=0){const coordinate=action?.[axis];if(typeof coordinate!=='number'||!Number.isFinite(coordinate))return null;let value=lo+(coordinate-pixelLo)/(pixelHi-pixelLo)*(hi-lo);value=clamp(value,lo,hi);return step?clamp(snap(value,step),lo,hi):value;}
export function plot({xmin=-3,xmax=3,ymin=-3,ymax=9,x=80,y=70,w=800,h=350}={}){
 const X=value=>x+(value-xmin)/(xmax-xmin)*w,Y=value=>y+h-(value-ymin)/(ymax-ymin)*h;
 const toX=pixel=>xmin+(pixel-x)/w*(xmax-xmin),toY=pixel=>ymin+(y+h-pixel)/h*(ymax-ymin);
 const ticks=(lo,hi)=>{const target=(hi-lo)/8,scale=10**Math.floor(Math.log10(target));const step=[1,2,5,10].map(v=>v*scale).sort((a,b)=>Math.abs(Math.log(a/target))-Math.abs(Math.log(b/target)))[0],values=[];for(let value=Math.ceil(lo/step)*step;value<=hi+step*1e-8;value+=step)values.push(Number(value.toPrecision(10)));return values;};
 let svg='';for(const value of ticks(xmin,xmax))svg+=line(X(value),y,X(value),y+h)+text(X(value),y+h+27,fmt(value),'text-anchor="middle" font-size="16"');for(const value of ticks(ymin,ymax))svg+=line(x,Y(value),x+w,Y(value))+text(x-12,Y(value)+5,fmt(value),'text-anchor="end" font-size="16"');
 svg+=line(x,Y(clamp(0,ymin,ymax)),x+w,Y(clamp(0,ymin,ymax)),C.muted)+line(X(clamp(0,xmin,xmax)),y,X(clamp(0,xmin,xmax)),y+h,C.muted);
 svg+=text(x+w+12,Y(clamp(0,ymin,ymax))+5,'x','font-size="18"')+text(X(clamp(0,xmin,xmax))+12,y-12,'y','font-size="18"');
 return {svg,X,Y,toX,toY};
}
