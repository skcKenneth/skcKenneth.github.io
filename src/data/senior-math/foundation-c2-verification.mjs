import assert from 'node:assert/strict';

// This audit consumes only the public English prompt and displayed expression
// during derivation. Authored answers are read only at the final comparison.
// Numeric incidences use geometric axioms; this does not certify written proofs.
const match=(text,re)=>{const m=text.match(re);assert(m,'Cannot read public given '+re+': '+text);return m.slice(1).map(Number);};
const one=(text,re)=>match(text,re)[0];
const kOf=e=>one(e,/^k=(\d+)$/);
const rad=d=>d*Math.PI/180;
const pairs=e=>[...e.matchAll(/\((-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\)/g)].map(m=>m.slice(1).map(Number));
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const cmul=([a,b],[c,d])=>[a*c-b*d,a*d+b*c];
const cpow=(z,n)=>{let product=[1,0];for(let i=0;i<n;i++)product=cmul(product,z);return product;};
const range=n=>Array.from({length:n},(_,i)=>i+1);
const proportion=(values,predicate)=>values.filter(predicate).length/values.length;
const cartesian=(a,b)=>a.flatMap(x=>b.map(y=>[x,y]));
const average=a=>a.reduce((s,v)=>s+v,0)/a.length;
const triples=n=>range(n).flatMap(a=>range(n).filter(b=>b>a).flatMap(b=>range(n).filter(c=>c>b).map(c=>[a,b,c])));
// Simpson integration is exact for each polynomial used here (degree <= 2).
const integrateQuadratic=(f,a,b)=>(b-a)*(f(a)+4*f((a+b)/2)+f(b))/6;
const rules=[];
const rule=(prompt,method,compute)=>rules.push({matches:typeof prompt==='string'?p=>p===prompt:p=>prompt.test(p),method,compute});

rule('Find the vector magnitude.','Euclidean norm of the displayed vector',(p,e)=>Math.hypot(...pairs(e)[0]));
rule(/^A walker travels \d+ m east then \d+ m west\./,'signed displacement along an east-positive axis',p=>{const[a,b]=match(p,/travels (\d+) m east then (\d+) m west/);return Math.hypot(a-b,0);});
rule('Find the x-coordinate of a+b.','componentwise vector addition',(p,e)=>{const[a,b]=pairs(e);return add(a,b)[0];});
rule('Calculate the dot product.','sum of coordinate products',(p,e)=>{const[a,b]=pairs(e);return dot(a,b);});
rule('Find the magnitude after scalar multiplication.','realize the given norm on the horizontal axis and scale the vector',(p,e)=>{const[n,s]=match(e,/\|\\mathbf a\|=(\d+),\\quad\|(-?\d+)\\mathbf a\|/);return Math.hypot(s*n,0);});
rule('Find the angle in degrees between these nonzero vectors.','arccos of normalized coordinate dot product',(p,e)=>{const[a,b]=pairs(e);return Math.acos(dot(a,b)/Math.hypot(...a)/Math.hypot(...b))*180/Math.PI;});
rule('Find the coefficient of e₁ in the given basis representation.','solve the two-coordinate basis system by determinants',(p,e)=>{const[a,b,v]=pairs(e);assert(cross(a,b)!==0);return cross(v,b)/cross(a,b);});
rule('Find the midpoint x-coordinate.','average endpoints componentwise',(p,e)=>{const[a,b]=pairs(e);return average([a[0],b[0]]);});
rule('Find the distance between the two points.','norm of the endpoint displacement',(p,e)=>{const[a,b]=pairs(e);return Math.hypot(...sub(b,a));});
rule('Find m for the two vectors to be parallel.','zero two-dimensional cross product',(p,e)=>{const[a,b,c]=match(e,/\\mathbf a=\((-?\d+),(-?\d+)\),\\quad\\mathbf b=\((-?\d+),m\)/);assert(a!==0);return b*c/a;});
rule('Find m for the vectors to be perpendicular.','zero dot product solved for the unknown coordinate',(p,e)=>{const[a,b,c]=match(e,/\\mathbf a=\((-?\d+),(-?\d+)\),\\quad\\mathbf b=\(m,(-?\d+)\)/);assert(a!==0);return-b*c/a;});
rule('Find the signed scalar projection on the positive x-axis.','dot product with the positive horizontal unit vector',(p,e)=>dot(pairs(e)[0],[1,0]));
rule('Find the third side using the cosine rule.','distance between polar endpoints of the two given sides',(p,e)=>{const[a,b,angle]=match(e,/a=(\d+),\\quad b=(\d+),\\quad C=(\d+)/);return Math.hypot(b*Math.cos(rad(angle))-a,b*Math.sin(rad(angle)));});
rule('Find b using the sine rule.','common circumdiameter from opposite side and sine',(p,e)=>{const[a,A,B]=match(e,/a=(\d+),\\quad A=(\d+)\^\{\\circ\},\\quad B=(\d+)/);return a/Math.sin(rad(A))*Math.sin(rad(B));});
rule('Find the triangle area.','half the determinant of two polar side vectors',(p,e)=>{const[a,b,C]=match(e,/a=(\d+),\\quad b=(\d+),\\quad C=(\d+)/);return Math.abs(cross([a,0],[b*Math.cos(rad(C)),b*Math.sin(rad(C))]))/2;});
rule('Find the x-coordinate of the centroid.','mean of the three vertex coordinates',(p,e)=>average(pairs(e).map(v=>v[0])));
rule('Find the work done by the constant force, in joules.','coordinate force-displacement dot product',(p,e)=>{const[F,s]=pairs(e);return dot(F,s);});
rule('Find the magnitude of the resultant force.','norm after coordinate force addition',(p,e)=>{const[a,b]=pairs(e);return Math.hypot(...add(a,b));});

rule('Find the imaginary part.','read the signed coefficient of the imaginary unit',(p,e)=>one(e,/z=-?\d+([+-]\d+)i/));
rule('Find m so the complex number is real.','set the displayed imaginary coefficient to zero',(p,e)=>{const c=one(e,/z=-?\d+\+\(m([+-]\d+)\)i/);return-c;});
rule('Find the sum a+b when the complex number is zero.','solve independent real and imaginary zero equations',(p,e)=>{const[a,b]=match(e,/\(a([+-]\d+)\)\+\(b([+-]\d+)\)i=0/);return-a-b;});
rule('Find the modulus.','Euclidean norm in the Argand plane',(p,e)=>Math.hypot(...match(e,/z=(-?\d+)([+-]\d+)i/)));
rule('Find the real part of the product.','complex multiplication by real coordinate pairs',(p,e)=>{const[a,b]=match(e,/\((-?\d+)\+i\)\((-?\d+)-i\)/);return cmul([a,1],[b,-1])[0];});
rule('Simplify the sum and explain the cancellation.','successive multiplication by i and sum of four powers',(p,e)=>{assert.equal(e,'1+i+i^2+i^3');const sum=range(4).map(n=>cpow([0,1],n-1)).reduce(add,[0,0]);assert(Math.abs(sum[1])<1e-12);return sum[0];});
rule('Calculate z times its conjugate.','multiply complex coordinates by their reflected pair',(p,e)=>{const[a,b]=match(e,/z=(-?\d+)([+-]\d+)i/);const product=cmul([a,b],[a,-b]);assert.equal(product[1],0);return product[0];});
rule('Evaluate the power.','repeated complex multiplication, not a stored residue answer',(p,e)=>{const n=one(e,/^i\^\{(\d+)\}$/),z=cpow([0,1],n);assert.equal(z[1],0,'Numeric answer requires a real power');return z[0];});
rule('Find the imaginary part of the reciprocal.','solve complex product equal to one',(p,e)=>{const a=one(e,/\\frac1\{(-?\d+)\+i\}/),den=a*a+1;const z=[a/den,-1/den],product=cmul([a,1],z);assert(Math.abs(product[0]-1)<1e-12&&Math.abs(product[1])<1e-12);return z[1];});
rule('Find the modulus of the product.','complex multiplication of representative positive-real numbers',(p,e)=>{const[a,b]=match(e,/\|z_1\|=(\d+),\\quad\|z_2\|=(\d+)/);return Math.hypot(...cmul([a,0],[b,0]));});
rule('Find the real part using de Moivre’s formula.','rectangular complex multiplication repeated for the displayed power',(p,e)=>{const[r,d,n]=match(e,/^\[(\d+)\(\\cos\(\\pi\/(\d+)\)\+i\\sin\(\\pi\/3\)\)\]\^(\d+)$/);assert.equal(d,3);return cpow([r*Math.cos(Math.PI/d),r*Math.sin(Math.PI/d)],n)[0];});
rule('Find the modulus of the quotient.','scale representative positive-real complex coordinates',(p,e)=>{const[a,b]=match(e,/\|z_1\|=(\d+),\\quad\|z_2\|=(\d+)/);assert(b>0);return Math.hypot(a/b,0);});

rule(/^How many vertices does an \d+-gonal prism have\?$/,'enumerate upper and lower copies of polygon vertices',p=>{const n=one(p,/an (\d+)-gonal/);return cartesian(['top','bottom'],range(n)).length;});
rule(/^How many edges does an \d+-gonal pyramid have\?$/,'enumerate base-cycle edges and apex-to-vertex edges',p=>{const n=one(p,/an (\d+)-gonal/),base=range(n).map(i=>[i,i%n+1]),apex=range(n).map(i=>[0,i]);return[...base,...apex].length;});
rule('Find the slant height of the right circular cone.','norm of the radius-height meridian vector',(p,e)=>Math.hypot(...match(e,/r=(\d+),\\quad h=(\d+)/)));
rule('A plane parallel to a pyramid base cuts halfway between apex and base. Find the ratio of the small cross-section area to the base area.','determinant of a half-scale model section',()=>Math.abs(cross([1/2,0],[0,1/2]))/Math.abs(cross([1,0],[0,1])));
rule('A sphere has radius r. What is the distance of every surface point from its centre?','sphere defining distance using a radius-axis surface point',(p,e)=>Math.hypot(one(e,/^r=(\d+)$/),0,0));
rule('In the 45° half-depth oblique convention, an original depth is d. Find its drawn length.','norm of the half-depth vector at the stated angle',(p,e)=>{const d=one(e,/^d=(\d+)$/),angle=rad(one(p,/the (\d+)°/));return Math.hypot(d/2*Math.cos(angle),d/2*Math.sin(angle));});
rule('Recover the actual depth from its half-scale drawn length.','invert the one-half drawing scale',(p,e)=>one(e,/^d'=(\d+)$/)/(1/2));
rule(/^A horizontal rectangle has side lengths \d+ and \d+\./,'determinant of the two oblique edge vectors divided by sqrt2',p=>{const[a,b,angle]=match(p,/side lengths (\d+) and (\d+).*half length and (\d+)°/);return Math.abs(cross([a,0],[b/2*Math.cos(rad(angle)),b/2*Math.sin(rad(angle))]))/Math.SQRT2;});
rule(/^A vertical edge has actual length \d+ and vertical scale one\./,'apply the stated unit scale to the vertical coordinate',p=>Math.hypot(0,one(p,/actual length (\d+)/)));
rule(/^A horizontal region has oblique drawn area \d+√2/,'invert the determinant of the half-depth oblique map',p=>{const[a,angle]=match(p,/area (\d+)√2.*half-depth (\d+)°/),det=cross([1,0],[Math.cos(rad(angle))/2,Math.sin(rad(angle))/2]);return a*Math.SQRT2/Math.abs(det);});
rule('Find the volume of the prism.','integrate the constant base cross-section along height',(p,e)=>{const[s,h]=match(e,/S_\{\\text\{base\}\}=(\d+),\\quad h=(\d+)/);return integrateQuadratic(()=>s,0,h);});
rule('A cone has radius r and height h. Write its volume as cπ and find c.','integrate squared linearly tapering circular radius, divide by pi',(p,e)=>{const[r,h]=match(e,/r=(\d+),\\quad h=(\d+)/);return integrateQuadratic(z=>(r*(1-z/h))**2,0,h);});
rule('A sphere has radius r. Write its volume as cπ and find c.','integrate circular cross-section radius squared across the sphere',(p,e)=>{const r=one(e,/^r=(\d+)$/);return integrateQuadratic(z=>r*r-z*z,-r,r);});
rule('Find c when the total surface area of this closed cylinder is cπ.','two circular discs plus unfolded circumference-height rectangle',(p,e)=>{const[r,h]=match(e,/r=(\d+),\\quad h=(\d+)/);const discs=[r,r].map(radius=>Math.PI*radius**2),rectangle=(2*Math.PI*r)*h;return(discs.reduce((s,v)=>s+v,0)+rectangle)/Math.PI;});
rule('Find the volume of a pyramid frustum with parallel bases.','integrate the square of the linearly varying section scale',(p,e)=>{const[a,b,h]=match(e,/S_1=(\d+),\\quad S_2=(\d+),\\quad h=(\d+)/);return integrateQuadratic(z=>(Math.sqrt(a)+(Math.sqrt(b)-Math.sqrt(a))*z/h)**2,0,h);});
rule(/^Similar solids have volume ratio \d+ from large to small\./,'solve the cube scaling equation from the volume ratio',p=>Math.cbrt(one(p,/volume ratio (\d+)/)));
rule(/^Similar solids have linear scale factor \d+ from small to large\./,'determinant of two independent surface directions',p=>{const s=one(p,/scale factor (\d+)/);return Math.abs(cross([s,0],[0,s]));});
rule('A sphere is replaced by eight similar smaller spheres with the same total volume. Find the ratio of total new surface area to the original area.','conserve volume and compare explicitly scaled sphere areas',()=>{const count=8,scale=Math.cbrt(1/count);return range(count).reduce(total=>total+4*Math.PI*scale**2,0)/(4*Math.PI);});
rule('How many planes are determined by three noncollinear points?','unique plane through an affine independent triple',()=>{const points=[[0,0],[1,0],[0,1]];assert(cross(sub(points[1],points[0]),sub(points[2],points[0]))!==0);return triples(points.length).length;});
rule('How many planes are determined by choosing three of four noncoplanar points?','enumerate distinct triples of noncoplanar points',()=>triples(4).length);
rule('How many planes contain two distinct parallel lines? Explain.','one plane spanned by line direction and interline displacement',()=>{const direction=[1,0],separation=[0,1];assert(cross(direction,separation)!==0);return triples(3).length;});
rule('How many planes contain a given line and a point outside it? Explain.','unique plane from two line points and the external point',()=>{const lineA=[0,0],lineB=[1,0],external=[0,1];assert(cross(sub(lineB,lineA),sub(external,lineA))!==0);return triples(3).length;});
rule('Five points have no three collinear and no four coplanar. How many different planes do their triples determine?','enumerate unordered triples; no four coplanar prevents duplicates',()=>triples(5).length);
rule('How many regions do two distinct intersecting planes divide space into?','enumerate both independent signs of the plane equations',()=>cartesian([-1,1],[-1,1]).length);
rule('Two parallel planes have equations z=a and z=b. For a=0 and b=k, find their distance.','norm of the displacement along the common normal',(p,e)=>Math.hypot(0,0,kOf(e)-0));
rule('A plane parallel to a pyramid base cuts at two-thirds of the full height measured from the apex. Find the section-to-base area ratio.','determinant of the section map at two-thirds linear scale',()=>Math.abs(cross([2/3,0],[0,2/3])));
rule('Find the distance from P to the plane.','orthogonal projection onto the coordinate plane z=0',(p,e)=>{const[x,y,z,h]=match(e,/P=\((-?\d+),(-?\d+),(-?\d+)\),\\quad\\alpha:z=(-?\d+)/);return Math.hypot(x-x,y-y,z-h);});
rule('A segment makes 30° with a plane and has length 2k. Find its perpendicular component.','normal coordinate of a segment using the stated plane angle',(p,e)=>one(p,/length (\d+)k/)*kOf(e)*Math.sin(rad(one(p,/makes (\d+)°/))));
rule('Find sin²θ for a cube’s space diagonal making angle θ with the base.','squared normal projection divided by squared cube-diagonal norm',()=>{const diagonal=[1,1,1],normal=[0,0,1];return dot(diagonal,normal)**2/dot(diagonal,diagonal);});
rule('Find the dihedral angle between the coordinate planes x=0 and y=0.','arccos of the dot product of coordinate-plane unit normals',()=>Math.acos(dot([1,0,0],[0,1,0]))*180/Math.PI);

rule('A population has 100k students and a simple random sample has 10k. Find each student’s inclusion probability.','exchangeable inclusion count divided by population size',(p,e)=>{const[N,n]=match(p,/has (\d+)k students.*has (\d+)k/),k=kOf(e);return(n*k)/(N*k);});
rule('A stratified sample has total 10k from a school with 60k junior and 40k senior students. Find the senior sample size under proportional allocation.','allocate total sample by the senior population fraction',(p,e)=>{const[n,j,s]=match(p,/total (\d+)k.*with (\d+)k junior and (\d+)k senior/),k=kOf(e);return(n*k)*(s*k)/(j*k+s*k);});
rule('Systematically select 10k from an ordered population of 100k. Find the interval.','count positions per systematic-sampling block',(p,e)=>{const[n,N]=match(p,/select (\d+)k.*of (\d+)k/),k=kOf(e);return(N*k)/(n*k);});
rule('A selected sample has 10k people but only 6k reply. Find the response rate.','respondent count divided by selected count',(p,e)=>{const[n,r]=match(p,/has (\d+)k people.*only (\d+)k reply/),k=kOf(e);return(r*k)/(n*k);});
rule('Sampling with replacement chooses 2 people from a population of k+2. Find the probability the same person appears twice.','enumerate ordered pairs and count the diagonal',(p,e)=>{const n=kOf(e)+one(p,/population of k\+(\d+)/);return proportion(cartesian(range(n),range(n)),([a,b])=>a===b);});
rule('In a sample of 20k, 5k use public transport. Estimate the population proportion.','public-transport observations divided by sample size',(p,e)=>{const[n,r]=match(p,/sample of (\d+)k, (\d+)k use/),k=kOf(e);return(r*k)/(n*k);});
rule('A representative sample estimates a proportion 1/4 in a population of 80k. Estimate the corresponding count.','multiply population by the stated sampled fraction',(p,e)=>{const[a,b,N]=match(p,/proportion (\d+)\/(\d+).*of (\d+)k/);return N*kOf(e)*a/b;});
rule('A histogram class [0,2k) has frequency 6k. Find its frequency density (count per unit).','histogram count divided by actual interval width',(p,e)=>{const[w,f]=match(p,/class \[0,(\d+)k\) has frequency (\d+)k/),k=kOf(e);return f*k/(w*k);});
rule('For observations k,k+2,k+4, find the sample mean.','enumerate given observations and take their arithmetic mean',(p,e)=>{const[a,b]=match(p,/observations k,k\+(\d+),k\+(\d+)/),k=kOf(e);return average([k,k+a,k+b]);});
rule('For observations k,k+2,k+4, find variance using denominator 3 as specified.','sum centered squared observations and divide by stated denominator',(p,e)=>{const[a,b,n]=match(p,/observations k,k\+(\d+),k\+(\d+).*denominator (\d+)/),k=kOf(e),values=[k,k+a,k+b],mean=average(values);return values.reduce((s,v)=>s+(v-mean)**2,0)/n;});
rule('The sample proportions for three exhaustive categories are 1/4,1/2,p. Find p.','subtract the two disjoint category fractions from unit total',(p)=>{const[a,b,c,d]=match(p,/are (\d+)\/(\d+),(\d+)\/(\d+),p/);return 1-a/b-c/d;});
rule('An anonymous commute survey records 20k students; 12k travel at most 30 minutes. Find the sample proportion.','count qualifying commute observations relative to the sample',(p,e)=>{const[n,r]=match(p,/records (\d+)k students; (\d+)k travel/),k=kOf(e);return(r*k)/(n*k);});
rule('Two strata have mean commute times 20 and 40 minutes and sizes 3k and k. Find the overall mean.','expand strata into equal-valued observations and average',(p,e)=>{const[a,b,m]=match(p,/times (\d+) and (\d+) minutes and sizes (\d+)k/),k=kOf(e);return average([...Array(m*k).fill(a),...Array(k).fill(b)]);});
rule('The class counts for commute time <20,20–40,>40 minutes are k,2k,k. Find the fraction above 40.','sum the displayed class counts and select the last class',(p,e)=>{const m=one(p,/are k,(\d+)k,k/),k=kOf(e),counts=[k,m*k,k];return counts.at(-1)/counts.reduce((s,v)=>s+v,0);});

rule('A fair spinner has k+3 equally likely labels 1,…,k+3. Find the probability of label 1.','enumerate equally likely spinner labels and select label one',(p,e)=>{const n=kOf(e)+one(p,/has k\+(\d+)/);return proportion(range(n),v=>v===1);});
rule('The spinner has labels 1,…,2k. Find the probability of an even label.','enumerate spinner labels satisfying evenness',(p,e)=>proportion(range(one(p,/1,…,(\d+)k/)*kOf(e)),v=>v%2===0));
rule('P(A)=k/(k+2). Find P(Aᶜ).','enumerate equally likely outcomes outside a k-element event',(p,e)=>{const k=kOf(e),n=k+one(p,/k\/\(k\+(\d+)\)/);return proportion(range(n),v=>v>k);});
rule('Disjoint events have probabilities 1/(k+3) and 2/(k+3). Find their union probability.','enumerate two disjoint blocks in a common sample space',(p,e)=>{const[a,c,b,d]=match(p,/probabilities (\d+)\/\(k\+(\d+)\) and (\d+)\/\(k\+(\d+)\)/);assert.equal(c,d);return proportion(range(kOf(e)+c),v=>v<=a||v>a&&v<=a+b);});
rule('P(A)=1/2,P(B)=1/3,P(A∩B)=1/(6k). Find P(A∪B).','construct a finite Venn partition with the stated marginals and overlap',(p,e)=>{const[a,b,c,d,x,y]=match(p,/P\(A\)=(\d+)\/(\d+),P\(B\)=(\d+)\/(\d+),P\(A∩B\)=(\d+)\/\((\d+)k\)/),N=y*kOf(e),nA=N*a/b,nB=N*c/d,overlap=x;assert(Number.isInteger(nA)&&Number.isInteger(nB));const A=new Set(range(nA)),B=new Set([...range(overlap),...range(nB-overlap).map(v=>v+nA)]);assert([...A].filter(v=>B.has(v)).length===overlap);return new Set([...A,...B]).size/N;});
rule('Independent A,B have probabilities 1/2 and 1/(k+2). Find P(A∩B).','enumerate Cartesian outcomes of two independent experiments',(p,e)=>{const[a,b,c,d]=match(p,/probabilities (\d+)\/(\d+) and (\d+)\/\(k\+(\d+)\)/);return proportion(cartesian(range(b),range(kOf(e)+d)),([x,y])=>x<=a&&y<=c);});
rule('Two independent components each work with probability k/(k+1). A series system needs both. Find success probability.','enumerate independent component states and require both working',(p,e)=>{const k=kOf(e),n=k+one(p,/probability k\/\(k\+(\d+)\)/);return proportion(cartesian(range(n),range(n)),([a,b])=>a<=k&&b<=k);});
rule('Two independent components each fail with probability 1/(k+1). A parallel system works if at least one works. Find success probability.','enumerate component states and exclude only simultaneous failure',(p,e)=>{const[f,c]=match(p,/probability (\d+)\/\(k\+(\d+)\)/),n=kOf(e)+c;return proportion(cartesian(range(n),range(n)),([a,b])=>a>f||b>f);});
rule('An event occurs 3k times in 10k trials. Find its relative frequency.','observed success count divided by observed trial count',(p,e)=>{const[s,n]=match(p,/occurs (\d+)k times in (\d+)k/),k=kOf(e);return s*k/(n*k);});
rule('Two batches have 2k successes in 5k trials and 3k in 10k. Find pooled relative frequency.','pool counts of successful and unsuccessful trials before dividing',(p,e)=>{const[a,n,b,m]=match(p,/have (\d+)k successes in (\d+)k trials and (\d+)k in (\d+)k/),k=kOf(e);return(a*k+b*k)/(n*k+m*k);});
rule('A model has p=1/4. In 20k independent trials, find the expected number of occurrences.','sum individual Bernoulli expectations across the trial list',(p,e)=>{const[a,b,n]=match(p,/p=(\d+)\/(\d+)\. In (\d+)k/);return range(n*kOf(e)).reduce(s=>s+a/b,0);});
rule('After k consecutive heads from an independent fair coin, what is the probability the next toss is heads?','enumerate equally likely extensions of the fixed coin history',(p,e)=>{const history=Array(kOf(e)).fill('H');return proportion(['H','T'].map(next=>[...history,next]),sequence=>sequence.at(-1)==='H');});
rule('A simulation makes 10k equally likely selections from labels 1,…,k. What model probability does label 1 have?','enumerate the model label space independent of simulation length',(p,e)=>proportion(range(kOf(e)),label=>label===1));

export function auditFoundationC2(units){
 const records=[],uncovered=[];
 for(const unit of units.filter(u=>u.bookId==='c2'))for(const q of unit.questions){
  if(typeof q.answer!=='number')continue;
  const applicable=rules.filter(r=>r.matches(q.prompt.en));
  if(!applicable.length){uncovered.push(q.id);continue;}
  assert.equal(applicable.length,1,q.id+': ambiguous verification method');
  const r=applicable[0],derived=r.compute(q.prompt.en,q.expression||'');
  assert(Number.isFinite(derived),q.id+': nonfinite independent calculation');
  assert(Math.abs(derived-q.answer)<=1e-7,q.id+': published '+q.answer+', independently derived '+derived);
  records.push({id:q.id,method:r.method,derived,published:q.answer});
 }
 assert.deepEqual(uncovered,[],'Unverified compulsory-2 numerical answers: '+uncovered.join(', '));
 return{verifiedIds:records.map(r=>r.id),methods:Object.fromEntries([...new Set(records.map(r=>r.method))].map(m=>[m,records.filter(r=>r.method===m).length])),records,uncovered};
}
