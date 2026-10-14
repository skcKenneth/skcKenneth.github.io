import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {PRACTICE_PACKS,getPracticePack} from '../src/data/guided-practice/index.mjs';

const locales=['en','zh-Hant'];
const roles={worked:1,guided:1,prior:2,independent:4,exit:2,supplement:4,extension:2};
const close=(actual,expected,message)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<1e-8,`${message}: ${actual} != ${expected}`);
const bilingual=(value,label)=>{for(const locale of locales){assert.equal(typeof value?.[locale],'string',`${label}/${locale}`);assert.ok(value[locale].trim(),`${label}/${locale} empty`);}assert.ok(!/[\u3400-\u9fff]/u.test(value.en),`${label} English contains Han text`);};

// A deliberately independent arithmetic parser. It evaluates the displayed
// expression, rather than importing an answer or simplifier from the lesson.
function arithmetic(source,x){
 let text=source.replace(/\\(?:left|right|,|;|!)/g,'').replace(/\\(?:times|cdot)|×/g,'*').replace(/÷/g,'/').replace(/[−–]/g,'-');
 while(/\\(?:d?frac)\{([^{}]+)\}\{([^{}]+)\}/.test(text))text=text.replace(/\\(?:d?frac)\{([^{}]+)\}\{([^{}]+)\}/g,'(($1)/($2))');
 text=text.replace(/[{}]/g,m=>m==='{'?'(':')').replace(/\s+/g,'');
 const tokens=text.match(/\d+(?:\.\d+)?|x|[()+\-*/^]/g)||[];
 assert.equal(tokens.join(''),text,`Unsupported displayed arithmetic: ${source}`);
 let cursor=0;
 function atom(){const token=tokens[cursor++];if(token==='+')return atom();if(token==='-')return -atom();if(token==='('){const value=sum();assert.equal(tokens[cursor++],')',source);return value;}if(token==='x')return x;assert.ok(token&&/^\d/.test(token),`Invalid arithmetic atom ${source}`);return Number(token);}
 function power(){let value=atom();if(tokens[cursor]==='^'){cursor++;value**=atom();}return value;}
 function product(){let value=power();while(cursor<tokens.length){const token=tokens[cursor];if(token==='*'||token==='/'){cursor++;const next=power();value=token==='*'?value*next:value/next;}else if(token==='x'||token==='('||/^\d/.test(token)){value*=power();}else break;}return value;}
 function sum(){let value=product();while(tokens[cursor]==='+'||tokens[cursor]==='-'){const token=tokens[cursor++],next=product();value+=token==='+'?next:-next;}return value;}
 const value=sum();assert.equal(cursor,tokens.length,`Unconsumed arithmetic: ${source}`);return value;
}
const equation=source=>{const sides=source.split('=');assert.equal(sides.length,2,`Expected one equality: ${source}`);return sides;};
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
const difference=(a,b)=>[a[0]-b[0],a[1]-b[1]];
function reflect(point,line){const unit=line.direction,norm=dot(unit,unit);assert.ok(norm>0);const offset=difference(point,line.through),projection=dot(offset,unit)/norm;return [line.through[0]+2*projection*unit[0]-offset[0],line.through[1]+2*projection*unit[1]-offset[1]];}
function symmetric(vertices,line){return vertices.every(point=>vertices.some(other=>distance(reflect(point,line),other)<1e-7));}
function symmetryCount(vertices){
 assert.ok(Array.isArray(vertices)&&vertices.length>=3,'Axis counts require the actual polygon vertices');
 const centre=vertices.reduce((sum,p)=>[sum[0]+p[0]/vertices.length,sum[1]+p[1]/vertices.length],[0,0]);
 const angles=[];
 const add=point=>{const d=difference(point,centre);if(Math.hypot(...d)<1e-9)return;let angle=((Math.atan2(d[1],d[0])%Math.PI)+Math.PI)%Math.PI;if(!angles.some(a=>Math.abs(Math.sin(a-angle))<1e-8))angles.push(angle);};
 vertices.forEach(add);vertices.forEach((p,i)=>add([(p[0]+vertices[(i+1)%vertices.length][0])/2,(p[1]+vertices[(i+1)%vertices.length][1])/2]));
 return angles.filter(a=>symmetric(vertices,{through:centre,direction:[Math.cos(a),Math.sin(a)]})).length;
}

test('seven fixed bilingual 40-minute packs contain all 112 authored questions with exact roles',()=>{
 assert.equal(PRACTICE_PACKS.length,7);assert.equal(PRACTICE_PACKS.filter(pack=>pack.grade===7||pack.grade==='g7'||pack.grade==='7').length,2);
 const ids=[];
 for(const pack of PRACTICE_PACKS){
  assert.equal(getPracticePack(pack.id),pack);assert.equal(pack.minutes,40);assert.equal(pack.questions.length,16);
  bilingual(pack.title,pack.id+'/title');
  assert.match(pack.source.fileName,/\.pdf$/);assert.ok(pack.source.chapter&&pack.source.section);assert.ok(Number.isInteger(pack.source.foundationLesson)&&pack.source.foundationLesson>0);for(const field of ['printedPages','pdfPages','foundationPages'])assert.ok(pack.source[field].length>0&&pack.source[field].every(page=>Number.isInteger(page)&&page>0),pack.id+'/typed source '+field);assert.equal(pack.source.printedPages.length,pack.source.pdfPages.length);
  assert.deepEqual(Object.fromEntries(Object.keys(roles).map(role=>[role,pack.questions.filter(q=>q.role===role).length])),roles,pack.id);
  for(const flow of [pack.ordinaryFlow,pack.inquiryFlow])assert.equal(flow.reduce((sum,step)=>sum+step[1],0),40,pack.id+'/flow');
  assert.equal(pack.coreIds.length,8);assert.equal(new Set(pack.coreIds).size,8);
  assert.ok(pack.coreIds.every(id=>pack.questions.some(q=>q.id===id&&['prior','independent','exit'].includes(q.role))));
  for(const question of pack.questions){
   ids.push(question.id);assert.ok(question.id.startsWith(pack.id+':'));
   for(const field of ['prompt','answer'])bilingual(question[field],question.id+'/'+field);
   assert.equal(question.hints.length,3,question.id+'/3 hints');question.hints.forEach((hint,i)=>bilingual(hint,question.id+'/hint'+i));
   assert.ok(question.steps.length>=2,question.id+'/steps');question.steps.forEach((step,i)=>bilingual(step,question.id+'/step'+i));
   assert.ok(question.rubric.length>=1,question.id+'/rubric');question.rubric.forEach((row,i)=>bilingual(row,question.id+'/rubric'+i));
   assert.ok(question.audit?.kind,question.id+'/independent audit missing');
  }
 }
 assert.equal(new Set(ids).size,112);assert.equal(getPracticePack('__proto__'),null);
});

test('displayed G7 equations agree with audit coefficients and independently solved answers',()=>{
 let checked=0;
 for(const pack of PRACTICE_PACKS)for(const question of pack.questions){
  const audit=question.audit;if(!['linear','linear-check'].includes(audit.kind))continue;checked++;
  for(const side of [audit.left,audit.right])assert.ok(Number.isFinite(side.a)&&Number.isFinite(side.b),question.id);
  const coefficient=audit.left.a-audit.right.a,constant=audit.right.b-audit.left.b;
  assert.ok(Math.abs(coefficient)>1e-10,question.id+'/unique linear solution');
  const solution=constant/coefficient;
  if(audit.kind==='linear')close(question.numericAnswer,solution,question.id+'/independent solution');
  else assert.equal(Math.abs(coefficient*audit.candidate-constant)<1e-8,audit.equal,question.id+'/candidate substitution');
  assert.ok(question.expression,question.id+'/displayed expression required');
  const sides=equation(question.expression);
  for(const x of [-3,0,2,7]){close(arithmetic(sides[0],x),audit.left.a*x+audit.left.b,question.id+'/display left');close(arithmetic(sides[1],x),audit.right.a*x+audit.right.b,question.id+'/display right');}
  close(arithmetic(sides[0],solution),arithmetic(sides[1],solution),question.id+'/display substitution');
  const check=question.steps.map(step=>step.en).findLast(step=>/^Check[^:]*:|^Left side:/.test(step));
  assert.ok(check,question.id+'/explicit original-equation check');
  for(const statement of check.replace(/^Check[^:]*:/,'').replace(/\b(?:left|right) side\b:?/gi,'').replace(/\.$/,'').split(/;|\band\b|\.\s+/)){
   const chain=statement.trim().split('=');assert.ok(chain.length>=2,question.id+'/substitution check equality');
   const value=arithmetic(chain[0],solution);for(const side of chain.slice(1))close(arithmetic(side,solution),value,question.id+'/authored substitution arithmetic');
  }
 }
 assert.ok(checked>=28,`Only ${checked} G7 equations checked`);
});

test('coefficient prerequisites preserve signed arithmetic',()=>{
 const sums=PRACTICE_PACKS.flatMap(pack=>pack.questions).filter(q=>q.audit.kind==='sum');assert.ok(sums.length);
 for(const q of sums){const sum=q.audit.values.reduce((total,value)=>total+value,0);close(q.audit.result,sum,q.id+'/signed sum');close(q.numericAnswer,sum,q.id+'/coefficient answer');}
});

test('G8 distance and angle answers follow the stated geometric conditions',()=>{
 let checked=0;
 for(const pack of PRACTICE_PACKS)for(const q of pack.questions){const a=q.audit;let expected;
  if(a.kind==='bisector-distance'){assert.equal(a.onBisector,true,q.id);assert.equal(a.interior,true,q.id);assert.equal(a.perpendiculars,true,q.id);expected=a.givenDistance;}
  else if(a.kind==='bisector-angle'){assert.ok(a.wholeAngle>0&&a.wholeAngle<180,q.id);assert.ok(['half','whole'].includes(a.request));if(a.fromConverse)for(const flag of ['interior','perpendiculars','equalDistances'])assert.equal(a[flag],true,q.id+'/'+flag);if(a.givenHalf!==undefined)close(2*a.givenHalf,a.wholeAngle,q.id+'/whole angle from given half');expected=a.request==='half'?a.wholeAngle/2:a.wholeAngle;}
  else if(['bisector-linear','perpendicular-bisector-linear'].includes(a.kind)){
   if(a.kind==='perpendicular-bisector-linear'||a.theorem==='perpendicular-bisector'){assert.equal(a.midpoint??q.diagram?.givenMidpoint,true,q.id+'/midpoint');assert.equal(a.perpendicular??a.perpendiculars,true,q.id+'/perpendicular');if(a.onPerpendicularBisector!==undefined)assert.equal(a.onPerpendicularBisector,true);}
   else{assert.equal(a.onBisector,true);assert.equal(a.interior,true);assert.equal(a.perpendiculars,true);}
   const [l,b]=a.left,[r,d]=a.right;assert.notEqual(l,r);const x=(d-b)/(l-r),length=l*x+b;assert.ok(length>0,q.id+'/distance positive');close(a.expectedX,x,q.id+'/x');close(a.expectedDistance,length,q.id+'/distance');
   if(q.expression){const sides=equation(q.expression);for(const sample of [-3,0,2,7]){close(arithmetic(sides[0],sample),l*sample+b,q.id+'/displayed equal-distance left');close(arithmetic(sides[1],sample),r*sample+d,q.id+'/displayed equal-distance right');}}
   if(q.numericAnswer!==undefined)close(q.numericAnswer,x,q.id+'/answer');checked++;continue;
  }
  else if(a.kind==='perpendicular-bisector-distance'){assert.ok(a.givenLength>0);assert.ok(['half-segment','endpoint-distance'].includes(a.request));expected=a.request==='half-segment'?a.givenLength/2:a.givenLength;}
  else if(a.kind==='bisector-perimeter'){const triangle=a.feasibleTriangle;assert.ok(triangle?.length===3);assert.ok(triangle.every(x=>x>0));assert.ok(triangle[0]+triangle[1]>triangle[2]&&triangle[0]+triangle[2]>triangle[1]&&triangle[1]+triangle[2]>triangle[0],q.id+'/triangle inequality');close(triangle[0]**2+triangle[1]**2,triangle[2]**2,q.id+'/feasible right triangle');close(triangle.reduce((s,x)=>s+x,0),a.perimeter,q.id+'/perimeter');assert.deepEqual(a.requestedSegments,['OP','ON']);assert.deepEqual(a.triangleSegments,['PM','OM','OP']);assert.equal(a.onBisector,true);assert.equal(a.perpendiculars,true);expected=a.perimeter-a.leg;}
  else continue;
  checked++;close(a.expected??a.expectedSum,expected,q.id+'/geometry expected');if(q.numericAnswer!==undefined)close(q.numericAnswer,expected,q.id+'/authored answer');
  if(q.type==='choice')close(parseFloat(q.options[q.correctChoice].en),expected,q.id+'/selected numerical option');
 }
 assert.ok(checked>=10,`Only ${checked} numerical geometry checks`);
});

test('geometric proof audits contain sufficient noncircular hypotheses',()=>{
 let checked=0;
 for(const pack of PRACTICE_PACKS)for(const q of pack.questions){const a=q.audit;
  if(a.kind==='bisector-forward-proof'){assert.equal(a.method,'AAS');for(const flag of ['interior','perpendiculars','bisectedAngle','commonSide'])assert.equal(a[flag],true,q.id+'/'+flag);assert.equal(a.assumesEqualDistances,false,q.id+'/no circular premise');if(q.diagram)assert.notEqual(q.diagram.givenEqualDistances,true,q.id+'/diagram no circular distance premise');checked++;}
  if(a.kind==='bisector-converse-proof'){assert.equal(a.method,'HL');for(const flag of ['interior','perpendiculars','equalLegs','commonHypotenuse'])assert.equal(a[flag],true,q.id+'/'+flag);if(q.diagram)assert.equal(q.diagram.givenBisector,false,q.id+'/diagram does not assume bisector');checked++;}
  if(a.kind==='perpendicular-bisector-proof'){assert.ok(['SAS','SSS'].includes(a.method));assert.equal(a.midpoint,true);assert.equal(a.commonPM,true);assert.equal(a.noncollinear,true);assert.equal(a.method==='SAS'?a.perpendicular:a.equalEndpointDistances,true,q.id+'/congruence hypotheses');if(q.diagram&&a.method==='SSS')assert.equal(q.diagram.givenPerpendicular,false,q.id+'/SSS diagram omits target right angle');checked++;}
 }
 assert.ok(checked>=4,`Only ${checked} proof conditions checked`);
});

test('reflection axes are checked against actual coordinates rather than shape names',()=>{
 let checked=0,arcConstructions=0;
 for(const pack of PRACTICE_PACKS)for(const q of pack.questions){const a=q.audit;
  if(a.kind==='axis-count'){if(a.shape==='circle'){assert.equal(a.expected,'infinite');assert.ok(a.radius>0);for(let n=0;n<13;n++){const angle=n*Math.PI/13,line={through:a.center,direction:[Math.cos(angle),Math.sin(angle)]},point=[a.center[0]+a.radius*Math.cos(n*.71),a.center[1]+a.radius*Math.sin(n*.71)];close(distance(reflect(point,line),a.center),a.radius,q.id+'/circle reflection preserves radius');}}else{const vertices=a.vertices||q.diagram?.vertices,count=symmetryCount(vertices);close(count,a.expected,q.id+'/independent reflection count');if(q.numericAnswer!==undefined)close(q.numericAnswer,count,q.id+'/authored axis answer');if(q.type==='choice'){const selected=parseFloat(q.options[q.correctChoice].en);if(Number.isFinite(selected))close(selected,count,q.id+'/selected axis count');else{assert.equal(a.shape,'rectangle');assert.match(q.prompt.en,/diagonal/i);for(const[i,j]of [[0,2],[1,3]])assert.equal(symmetric(vertices,{through:vertices[i],direction:difference(vertices[j],vertices[i])}),false,q.id+'/non-square diagonal is not an axis');}}}checked++;}
  if(a.kind==='construction-axis'){assert.ok(a.pairs.length>=1);const all=a.pairs.every(([p,r])=>distance(reflect(p,a.line),r)<1e-7);assert.equal(all,a.valid,q.id+'/reflection pairs');if(a.arcRadius!==undefined){const [p,r]=a.pairs[0],span=distance(p,r),midpoint=[(p[0]+r[0])/2,(p[1]+r[1])/2],height=Math.sqrt(a.arcRadius**2-(span/2)**2),normal=[-(r[1]-p[1])/span,(r[0]-p[0])/span];assert.ok(span>0&&height>0,q.id+'/two distinct compass intersections');for(const sign of [-1,1]){const intersection=midpoint.map((value,i)=>value+sign*height*normal[i]);close(distance(intersection,p),a.arcRadius,q.id+'/first equal-radius arc');close(distance(intersection,r),a.arcRadius,q.id+'/second equal-radius arc');}arcConstructions++;}if(a.requiredLines){assert.equal(a.requiredLines.length,a.pairs.length);for(let i=0;i<a.pairs.length;i++)assert.ok(distance(reflect(a.pairs[i][0],a.requiredLines[i]),a.pairs[i][1])<1e-7,q.id+'/each inconsistent pair required axis');assert.ok(a.requiredLines.some(line=>!a.pairs.every(([p,r])=>distance(reflect(p,line),r)<1e-7)),q.id+'/required axes cannot serve every pair');}checked++;}
 }
 assert.ok(checked>=10,`Only ${checked} coordinate reflection checks`);assert.ok(arcConstructions>=6,`Only ${arcConstructions} equal-radius constructions checked`);
});

test('condition counterexamples, theorem directions and degenerate cases are logically sound',()=>{
 let checked=0;
 for(const pack of PRACTICE_PACKS)for(const q of pack.questions){const a=q.audit;
  if(a.kind==='geometric-condition-check'){
   const requirements={'bisector-forward':['onBisector','perpendiculars'],'bisector-converse':['interior','perpendiculars','equalDistances'],'perpendicular-bisector':['midpoint','perpendicular']}[a.theorem];assert.ok(requirements,q.id+'/known theorem');assert.equal(requirements.every(flag=>a[flag]===true),a.valid,q.id+'/necessary conditions');
   if(a.distances){assert.ok(a.distances.every(value=>value>0));assert.notEqual(a.distances[0],a.distances[1],q.id+'/counterexample unequal distances');}checked++;
  }
  if(a.kind==='distance-identification'){assert.equal(a.answerSegment,a.perpendicularSegment);assert.notEqual(a.answerSegment,a.obliqueSegment);assert.equal(q.options[q.correctChoice].en,a.answerSegment);checked++;}
  if(a.kind==='hypotenuse-identification'){assert.equal(a.hypotenuse.length,2);assert.ok(!a.hypotenuse.includes(a.rightAngleVertex));const triangle=q.prompt.en.match(/△([A-Z]{3})/)?.[1];assert.ok(triangle&&[...a.hypotenuse,a.rightAngleVertex].every(vertex=>triangle.includes(vertex)),q.id+'/opposite side');checked++;}
  if(a.kind==='right-angle'){assert.equal(a.perpendicular,true);close(Math.acos(dot([1,0],[0,1]))*180/Math.PI,a.expected,q.id+'/perpendicular angle');close(parseFloat(q.options[q.correctChoice].en),a.expected,q.id+'/selected angle');checked++;}
  if(a.kind==='proof-directions'){assert.equal(a.forwardMethod,'AAS');assert.equal(a.converseMethod,'HL');assert.equal(a.interiorRequired,true);assert.equal(a.perpendicularDistancesRequired,true);checked++;}
  if(['three-bisectors','three-perpendicular-bisectors'].includes(a.kind)){
   if(a.kind==='three-bisectors'){assert.equal(a.interior,true);assert.equal(a.perpendicularFeet,true);}else assert.equal(a.verticesNoncollinear,true);
   const groups=new Map();const find=id=>{if(!groups.has(id))groups.set(id,id);return groups.get(id)===id?id:find(groups.get(id));};for(const[left,right]of a.equalPairs)groups.set(find(left),find(right));assert.equal(find(a.conclusionPair[0]),find(a.conclusionPair[1]),q.id+'/equality transitivity');checked++;
  }
  if(a.kind==='degenerate-geometry'){if(a.pointEqualsVertex){assert.equal(a.hlApplicable,false);assert.equal(a.rayDetermined,false);}else{assert.equal(a.pointEqualsMidpoint,true);assert.equal(a.sasApplicable,false);assert.equal(a.equidistant,true);close(distance([0,0],[-3,0]),distance([0,0],[3,0]),q.id+'/midpoint special case');}checked++;}
  if(a.kind==='locus-domain'){assert.equal(a.segmentEndpointsDistinct,true);assert.equal(a.endpointEquality,true);assert.equal(a.specifiedAngleInteriorRequired,false);for(const y of [-5,0,8])close(distance([0,y],[-3,0]),distance([0,y],[3,0]),q.id+'/full perpendicular bisector');checked++;}
  if(a.kind==='proof-scope'){assert.ok(a.finiteTrials>0&&Number.isInteger(a.finiteTrials));assert.equal(a.generalConclusionRequiresProof,true);const witness=x=>Array.from({length:a.finiteTrials},(_,i)=>x-i).reduce((product,value)=>product*value,1);for(let i=0;i<a.finiteTrials;i++)close(witness(i),0,q.id+'/finite witness');assert.notEqual(witness(a.finiteTrials),0);checked++;}
  if(a.kind==='reflection-definition'){assert.equal(a.wholeFigureRequired,true);checked++;}
  if(a.kind==='axis-vocabulary'){assert.equal(a.object,'line');assert.equal(a.finiteSegmentOnly,false);checked++;}
  if(a.kind==='single-figure-versus-pair'){assert.equal(a.congruenceSufficient,false);assert.equal(a.commonAxisRequired,true);const vertices=[[0,0],[2,0],[0,1]],translated=vertices.map(p=>[p[0]+4,p[1]+3]),axis={through:[2,1.5],direction:[-3,4]};assert.ok(!vertices.every((p,i)=>distance(reflect(p,axis),translated[i])<1e-8),'A translated scalene triangle gives a congruence counterexample');checked++;}
  if(a.kind==='compass-intersections'){assert.ok(a.endpointDistance>0&&a.radius>0);const separation=a.endpointDistance,discriminant=a.radius**2-(separation/2)**2,count=discriminant>1e-10?2:Math.abs(discriminant)<1e-10?1:0;assert.equal(count,a.requiredIntersections,q.id+'/independent equal-circle intersection count');assert.equal(count,2,q.id+'/construction needs two distinct intersections');for(const sign of [-1,1]){const point=[separation/2,sign*Math.sqrt(discriminant)];close(distance(point,[0,0]),a.radius,q.id+'/first circle');close(distance(point,[separation,0]),a.radius,q.id+'/second circle');}checked++;}
 }
 assert.ok(checked>=15,`Only ${checked} conceptual condition checks`);
});

test('every authored question has a supported independent mathematical audit',()=>{
 const supported=new Set(['linear','linear-check','sum','bisector-distance','bisector-angle','bisector-linear','bisector-perimeter','bisector-forward-proof','bisector-converse-proof','perpendicular-bisector-distance','perpendicular-bisector-linear','perpendicular-bisector-proof','axis-count','construction-axis','geometric-condition-check','distance-identification','hypotenuse-identification','right-angle','proof-directions','three-bisectors','three-perpendicular-bisectors','degenerate-geometry','locus-domain','proof-scope','reflection-definition','axis-vocabulary','single-figure-versus-pair','compass-intersections']);
 for(const pack of PRACTICE_PACKS)for(const q of pack.questions){assert.ok(supported.has(q.audit.kind),q.id+'/unsupported audit '+q.audit.kind);if(q.type==='choice'){assert.ok(Number.isInteger(q.correctChoice)&&q.correctChoice>=0&&q.correctChoice<q.options.length,q.id+'/selected option range');q.options.forEach((option,i)=>bilingual(option,q.id+'/option'+i));}}
 const positions=new Set(PRACTICE_PACKS.flatMap(pack=>pack.questions).filter(q=>q.type==='choice').map(q=>q.correctChoice));assert.ok(positions.size>1,'The correct choice must not always occupy the same position');
});

test('paper presentation does not introduce browser stores or call the learner-practice runtime',()=>{
 const root=resolve(import.meta.dirname,'..'),source=readFileSync(resolve(root,'src/scripts/guided-practice.ts'),'utf8');
 assert.ok(!/localStorage|sessionStorage|indexedDB|PracticeUI|MathNativeStore|createStore\s*\(/.test(source),'Presentation must not write native learning records');
 assert.ok(!/Math\.random\s*\(/.test(source),'Fixed instances must not redraw on reveal or print');
});
