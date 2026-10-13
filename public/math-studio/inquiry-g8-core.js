/* Original Year 8 geometry. Pure calculations; measurements are observations, never proofs. */
'use strict';
const G8BisectorCore = (() => {
  const id='bisector-property',version='g8-bisector-1';
  const defaults=()=>({theta:60,radius:4,bearing:0,locked:true});
  const bounded=(v,lo,hi,fallback)=>typeof v==='number'&&Number.isFinite(v)?Math.max(lo,Math.min(hi,v)):fallback;
  const tenth=v=>Math.sign(v)*Math.round(Math.abs(v)*10)/10;
  function normalize(input={}) {
    if(!input||typeof input!=='object'||Array.isArray(input))input={};
    const theta=Math.round(bounded(input.theta,30,90,60));
    return {theta,radius:Math.round(bounded(input.radius,1,7,4)*10)/10,
      bearing:input.locked!==false?0:tenth(bounded(input.bearing,1-theta/2,theta/2-1,0)),
      locked:input.locked!==false};
  }
  const dot=(a,b)=>a.x*b.x+a.y*b.y;
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function calculate(input={}) {
    const params=normalize(input),rad=Math.PI/180,h=params.theta*rad/2,t=params.bearing*rad;
    const O={x:0,y:0},A={x:Math.cos(h),y:Math.sin(h)},B={x:Math.cos(h),y:-Math.sin(h)};
    const P={x:params.radius*Math.cos(t),y:params.radius*Math.sin(t)};
    const om=dot(P,A),on=dot(P,B),M={x:om*A.x,y:om*A.y},N={x:on*B.x,y:on*B.y};
    // Q is a deliberately oblique endpoint on OA, chosen beyond the perpendicular foot.
    const Q={x:(om+.85)*A.x,y:(om+.85)*A.y};
    return {version,params,O,A,B,P,M,N,Q,om,on,pm:distance(P,M),pn:distance(P,N),pq:distance(P,Q),
      angleA:params.theta/2-params.bearing,angleB:params.theta/2+params.bearing,
      onBisector:params.bearing===0,inside:Math.abs(params.bearing)<params.theta/2,
      feetOnRays:om>0&&on>0};
  }
  const fmt=n=>Number(n.toFixed(3)).toString();
  function snapshot(input) {
    const r=calculate(input);
    return {version,params:r.params,settings:`∠AOB=${r.params.theta}°; OP=${fmt(r.params.radius)}; 偏離平分方向=${fmt(r.params.bearing)}°`,
      result:`PM≈${fmt(r.pm)}; PN≈${fmt(r.pn)}; ∠MOP=${fmt(r.angleA)}°; ∠PON=${fmt(r.angleB)}°. 數值觀察，不是一般性證明。`};
  }
  // Pointer and arrow keys use exactly the same bounds as the numeric controls.
  function fromPoint(x,y,input) {
    const p=normalize({...input,locked:false});
    return normalize({...p,radius:Math.hypot(x,y),bearing:Math.atan2(y,x)*180/Math.PI,locked:false});
  }
  return {id,version,defaults,normalize,calculate,snapshot,fromPoint,fmt};
})();
