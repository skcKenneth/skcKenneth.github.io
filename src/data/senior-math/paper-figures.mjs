// Original vector diagrams generated from the mathematics, never scanned papers.
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function geometrySvg(points,segments,title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" role="img"><title>${esc(title)}</title><rect width="400" height="280" fill="white"/><g stroke="#17679b" stroke-width="2" fill="none">${segments.map(([a,b])=>`<line x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}"/>`).join('')}</g><g font-family="system-ui,sans-serif" font-size="15" fill="#203246">${Object.entries(points).map(([name,[x,y]])=>`<circle cx="${x}" cy="${y}" r="2.5"/><text x="${x+7}" y="${y-7}">${esc(name)}</text>`).join('')}</g></svg>`;
}
export function functionSvg(fn,{xMin,xMax,yMin,yMax,title,points=[]}) {
  const w=680,h=380,p=42,sx=x=>p+(x-xMin)/(xMax-xMin)*(w-2*p),sy=y=>h-p-(y-yMin)/(yMax-yMin)*(h-2*p);
  const line=(x1,y1,x2,y2,color)=>`<line x1="${sx(x1)}" y1="${sy(y1)}" x2="${sx(x2)}" y2="${sy(y2)}" stroke="${color}"/>`;
  const tickStep=range=>{const base=10**Math.floor(Math.log10(range/6));const ratio=range/6/base;return (ratio<=1?1:ratio<=2?2:ratio<=5?5:10)*base;};
  const tickLabel=value=>Number(value.toPrecision(8)).toString();
  let grid='';
  const dx=tickStep(xMax-xMin),dy=tickStep(yMax-yMin);
  for(let n=Math.ceil(xMin/dx);n*dx<=xMax+dx/100;n++){const x=n*dx;grid+=line(x,yMin,x,yMax,'#d8e1e8')+`<text x="${sx(x)}" y="${h-18}" text-anchor="middle">${tickLabel(x)}</text>`;}
  for(let n=Math.ceil(yMin/dy);n*dy<=yMax+dy/100;n++){const y=n*dy;grid+=line(xMin,y,xMax,y,'#d8e1e8')+`<text x="${p-9}" y="${sy(y)+4}" text-anchor="end">${tickLabel(y)}</text>`;}
  let penDown=false;
  const path=Array.from({length:401},(_,i)=>{const x=xMin+i*(xMax-xMin)/400,y=fn(x);if(!Number.isFinite(y)||y<yMin||y>yMax){penDown=false;return '';}const command=penDown?'L':'M';penDown=true;return `${command}${sx(x).toFixed(2)},${sy(y).toFixed(2)}`;}).join(' ');
  const marks=points.map(({x,y,label,dx=7,dy=-9})=>`<circle cx="${sx(x)}" cy="${sy(y)}" r="3.5" fill="#bf3f30"/><text x="${sx(x)+dx}" y="${sy(y)+dy}" fill="#86261b">${esc(label)}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><rect width="${w}" height="${h}" fill="white"/><g font-family="system-ui,sans-serif" font-size="12" fill="#27364a">${grid}${yMin<=0&&yMax>=0?line(xMin,0,xMax,0,'#27364a'):''}${xMin<=0&&xMax>=0?line(0,yMin,0,yMax,'#27364a'):''}<path d="${path}" fill="none" stroke="#096b9d" stroke-width="2.8"/>${marks}<text x="${w/2}" y="20" text-anchor="middle" font-size="15">${esc(title)}</text></g></svg>`;
}
