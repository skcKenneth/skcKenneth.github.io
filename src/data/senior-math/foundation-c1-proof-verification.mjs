/** Snapshot-bound manual derivation review; hashes prevent silent reuse after content changes.
 * This is an audit ledger with regression checks, not an automatic theorem prover.
 */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const reviewed = {
 'c1-1-1':'03308759149191e00d4a44187cc360d3fdb146f34ddcfd136eecdefdc6db962b',
 'c1-1-2':'54bc38b0acdf44264ec7b85a0fd6f53269662ed475378da2e4107489acaf571a',
 'c1-1-3':'385a8474ff87c93e9314c883b2c39f532a3097cfa07e94037501900512bf3f8f',
 'c1-1-4':'229d88a819221ea8135e4d0a7c9f87810c17f01b773edb8c31c27fb2f6984d87',
 'c1-1-5':'c2be5322192bf143e51a73f974c1e9521e60ffbc8850a62bfe097e91356bb0b1',
 'c1-2-1':'5bb16436a946dba0dcce7b6917df67ea505f775a8818fcc7faad02d9323db79a',
 'c1-2-2':'72b695e3ab10ee2a1753fbed021b01b67cbf457747b42333f35616bda29871e0',
 'c1-2-3':'cb01ee23d0f44e2d807873d3e4b23d1850ce497e82b7e45c11cf377e883a5f53',
 'c1-3-1':'4d7204391caf82bf943377de401452fe172f6aaa898d42b40e6bd79d0c3995cb',
 'c1-3-2':'3a650a10cc44d219da2aa18efb44e9d0bd97c3762d8df29f2350091af4ae82a8',
 'c1-3-3':'5ef0abe8753a95f2e2180d3d41988b0ac6ed98f5e4561e2d1d5c5e9747263a8a',
 'c1-3-4':'dbd98b57e208b5a490d8254c24870db712d8310f6a9dfd5adf0c995bab231bfb',
 'c1-4-1':'231047c52c83484b22f7882e9ba6d865235116acfdce5950876915639fdba444',
 'c1-4-2':'dcaf210973158c2dddb05b1fe86c48ac65ffa74e4fc3f707b965fb35600c5803',
 'c1-4-3':'793305ab791fb4c01b6996a0891d89c008923e4b2e01aee94dc2844f1540e3d2',
 'c1-4-4':'761de58e79c65756318f8250ae14ec15243fa5700f2c264db2d45b5af25b3906',
 'c1-4-5':'ddff637b635d3dcef04aabf41eed5736f7f5f7339462ae8c0677a22205bc692b',
 'c1-5-1':'a74b1a0c14919229becc2bb8c36d3d8f4b8d41cd9156d2dec3dfe5f732a69756',
 'c1-5-2':'d668f5fff21d41185efb3785d17b3c4bdc78682de56af907f39f48d5f6f482ff',
 'c1-5-3':'b74f414ff1af2c7fc26c0bc1d11d94608afbff3c19645647f20484ade641bea3',
 'c1-5-4':'e5e23a3044e89389f955dbf08cf483d5491caaea2d189203bc8aee8f83c68f7d',
 'c1-5-5':'c5efc7dcc58d7f446e5e78c3e49e28160abf7bf73ee60d8e319bbce6b5d813e7',
 'c1-5-6':'eb667d47aa52127dfb8de6c8aee81380ec36409362d915a981781a4a88fd8e0d',
 'c1-5-7':'20495e147804d5fb7c1159ee6839dc10d53a5ea6e4919a7dcbe0f773be461d45',
 'review-c1-1':'0de12bb38bea77f1a430d46125003b911b649b76072c04349ca632ac3bdd5091',
 'review-c1-2':'e523d87b1d26936fac2dd14719da4494ca173c97a2ac68b17b3b42e7825f892e',
 'review-c1-3':'02893ab20a396755f763cc983ec79094b5e86a5207525c62654eb057abe8f206',
 'review-c1-4':'465e8d04ec1240053c9e09e9806536479c456c30fe7b87909acece02c44a2797',
 'review-c1-5':'d7b7c1df5a5b00119787d08e70260aa5c007fadcea5aac00374dd770aff8f877',
};
const payload=questions=>questions.map(({id,prompt,expression,answer,hints,steps,result,explanation,conditions})=>({id,prompt,expression,answer,hints,steps,result,explanation,conditions}));
export function auditFoundationC1Proofs(units){
 const records=[],reviewedIds=[];
 for(const unit of units.filter(u=>u.bookId==='c1')){
  const written=unit.questions.filter(q=>typeof q.answer!=='number');
  const sha256=createHash('sha256').update(JSON.stringify(payload(written))).digest('hex');
  assert.equal(sha256,reviewed[unit.id],`${unit.id}: written solutions changed; re-review the proof/domain ledger before updating its fingerprint`);
  records.push({unit:unit.id,count:written.length,sha256});reviewedIds.push(...written.map(q=>q.id));
  for(const q of written){
   assert(!q.expression?.includes('2*k'),`${q.id}: undeclared exponent parameter`);
   if(q.prompt.en.includes('For π<α<3π/2 and cos α=−3/5')){
    assert(q.prompt.zh.includes('π<α<3π/2'));assert(q.expression.includes('\\pi<\\alpha<3\\pi/2'));
   }
  }
 }
 assert.equal(records.length,29);assert.equal(reviewedIds.length,178);
 // The missing English interval was substantive: identical terminal rays can have opposite half-angle signs.
 const alpha=2*Math.PI-Math.acos(-3/5);
 assert(alpha>Math.PI&&alpha<3*Math.PI/2);
 assert(Math.abs(Math.sin(alpha/2)-2/Math.sqrt(5))<1e-12);
 assert(Math.sin((alpha+2*Math.PI)/2)<0);
 // Endpoint exclusion and attainability witnesses for the reviewed range/infimum proofs.
 for(const y of [.01,.25,1,4,100]){
  const inverseSquareInput=1/Math.sqrt(y),cubeSquareInput=y**1.5;
  assert(Math.abs(1/inverseSquareInput**2-y)<1e-10);
  assert(Math.abs(Math.cbrt(cubeSquareInput)**2-y)<1e-10);
 }
 for(const k of [3,8])for(const gap of [.1,.01,.001]){
  const x=k+gap;assert(x+k*k/x>2*k);assert(Math.abs(x+k*k/x-2*k-gap*gap/x)<1e-12);
 }
 return{reviewedIds,records,reviewDate:'2026-10-03',method:'manual derivation and condition review; finite boundary checks are regression evidence only'};
}
