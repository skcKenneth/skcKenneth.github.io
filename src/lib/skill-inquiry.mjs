import * as qt from './skill-quadratics-trig-inquiry.mjs';
import * as vc from './skill-vectors-conics-inquiry.mjs';
import * as cs from './skill-calculus-statistics-inquiry.mjs';
const registry=id=>id.startsWith('quadratics-')||id.startsWith('trig-')?qt:id.startsWith('vectors-')||id.startsWith('conics-')?vc:cs;
export const skillInquiryControls=id=>registry(id).controls(id);
export const skillInquiryScene=(id,params)=>registry(id).scene(id,params);
export const skillInquirySimulation=(id,params,seed=37)=>cs.simulate(id,params,seed,200);
