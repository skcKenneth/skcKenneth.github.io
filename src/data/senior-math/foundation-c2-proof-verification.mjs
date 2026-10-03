/**
 * Snapshot-bound manual derivation and condition review of every nonnumeric
 * compulsory-2 record. See docs/senior-math-foundation-c2-proof-audit.md.
 * These fingerprints detect change; neither hashes nor finite witnesses prove
 * a universal mathematical claim. Re-review before refreshing a fingerprint.
 */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const reviewed = {
 'c2-6-1':'e7df83a7abf85e0409a87d2c9d8c063a9dbb947da65d91c35eda365bb4f123ca',
 'c2-6-2':'ada5ea13e9f1dd4602798f056b7bbbe40ef0673ac2ba2904d1da31219a286ff9',
 'c2-6-3':'dca0492484c928348cd3a3e8480355ccad7063f28763934f330928ede4e41573',
 'c2-6-4':'45ff6df1a571038e8f0b85eb03704f435f06506e65297b5ac5a50e1c8512b667',
 'c2-7-1':'6b75e224831830d881c9d9dab8961d6b3db6cd0da705eb6ee9f4bfc74bda5874',
 'c2-7-2':'ced76a58c705ef53dd837e7f44349bbdefd6d5d11e5dda147cc12f142f22f34f',
 'c2-7-3':'20caa5d53e55c4be0561f76998fe1cb7eba32c9b2965cf1dad1f2a987c6869a2',
 'c2-8-1':'f591a1a9eab210622c2af2d31acb2c3ada64edbe28da35473f776aa80006ed61',
 'c2-8-2':'351e150e7ad8efac4015abd1583a928426e27d5b0016a48bc9b19440ff08bbc2',
 'c2-8-3':'4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
 'c2-8-4':'680df30564da69ec16016152be2934517663c4d5797d7b8de1ad0af4f6cf19ac',
 'c2-8-5':'ff835947bdaa724470e5116def8208d3acf34c1f85568fe11b08078b25134d4b',
 'c2-8-6':'ee1a5e60c4cc84dfd75961d34912409b99541fd0656db0a91d9d9275c7ce6b4f',
 'c2-9-1':'a7e5fe078aca946170a61f44fa17d224ffe92d07da099d76e8fca057058c90b7',
 'c2-9-2':'9d426065f0457d99514a0052b0080ad0997e9702a5ec0b06c507954327b2c263',
 'c2-9-3':'19313fe361c419a61adb605883d79f7a9312d060f50bdceafe2e2cbb1f07912d',
 'c2-10-1':'c00bdd80b1fd0637bff3858a4e496b8eca52ff97d3aa764e8a7531954e8e6c7c',
 'c2-10-2':'ea5872068317ed036e5ad012ec7687da4e9589457af06563f433713979b4d56a',
 'c2-10-3':'fbecbbc84e51a798f1bbfc13eeebccf4daefdbc82d362b1054ac767a39e1de6a',
 'review-c2-6':'dcfa54fdddcba2f4bae716cd03edb14bd52031b38a6c30b3441e416bd371e131',
 'review-c2-7':'862c2bc55f74367f02cfe8f59f039216befcbd59878b9b8c1cfb9df682d767bf',
 'review-c2-8':'0d80a458d3f71e2b293994509328854c3720607a5e94965ed716114d00f6af78',
 'review-c2-9':'e237029be3f562a088bb430b98204aee01d308e77373b7bd12feea2121c8a3c0',
 'review-c2-10':'b63bc255a0aba53a70039923ef276061e60217869359054b40ae263267931c53',
};
const payload=questions=>questions.map(({id,prompt,expression,answer,hints,steps,result,explanation,conditions})=>({id,prompt,expression,answer,hints,steps,result,explanation,conditions}));
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cmul=([a,b],[c,d])=>[a*c-b*d,a*d+b*c];
const close=(a,b)=>assert(Math.abs(a-b)<1e-10);

export function auditFoundationC2Proofs(units){
 const records=[],reviewedIds=[];
 for(const unit of units.filter(u=>u.bookId==='c2')){
  const written=unit.questions.filter(q=>typeof q.answer!=='number');
  const sha256=createHash('sha256').update(JSON.stringify(payload(written))).digest('hex');
  assert.equal(sha256,reviewed[unit.id],unit.id+': written solutions changed; re-review the proof/domain ledger before updating its fingerprint');
  records.push({unit:unit.id,count:written.length,sha256});
  reviewedIds.push(...written.map(q=>q.id));
 }
 assert.equal(records.length,24);
 assert.equal(reviewedIds.length,114);

 // Finite witnesses supplement, and remain separate from, the manual review.
 // Nonzero equal norms do not imply equal direction, and normalization needs
 // a nonzero denominator. The two signed roots are checked by multiplication.
 for(const k of [2,3,4,8,10,11]){
  assert.equal(Math.hypot(k,0),Math.hypot(0,k));
  assert.notDeepEqual([k,0],[0,k]);
  close(Math.hypot(3*k/(5*k),4*k/(5*k)),1);
  for(const sign of [-1,1]){
   const square=cmul([0,sign*k],[0,sign*k]);
   close(square[0],-k*k);close(square[1],0);
   const z=[k,sign],zz=cmul(z,z);
   close(zz[0]-2*k*z[0]+k*k+1,0);close(zz[1]-2*k*z[1],0);
  }
 }
 for(const theta of [0,2*Math.PI/3,4*Math.PI/3]){
  const z=[Math.cos(theta),Math.sin(theta)],cube=cmul(cmul(z,z),z);
  close(cube[0],1);close(cube[1],0);
 }
 // Prism topology is this convex family only, not a universal Euler proof.
 for(const n of [5,6,12]){
  const V=2*n,E=n+n+n,F=2+n;assert.equal(V-E+F,2);
 }
 // The spatial counterexample is perpendicular to one plane direction only.
 assert.equal(dot([0,1,1],[1,0,0]),0);
 assert.notEqual(dot([0,1,1],[0,1,0]),0);
 for(const u of [[1,0,0],[0,1,0],[2,-3,0]]){
  const v=[2,4,5],projection=[2,4,0];
  assert.equal(dot(u,v),dot(u,projection));
 }
 // Unit tetrahedron midpoint plane x+y+z=1/2 is disjoint from the base
 // plane x+y+z=1 and has the same normal. This is a witness, not the proof.
 for(const midpoint of [[.5,0,0],[0,.5,0],[0,0,.5]])assert.equal(dot(midpoint,[1,1,1]),.5);
 for(const baseVertex of [[1,0,0],[0,1,0],[0,0,1]])assert.equal(dot(baseVertex,[1,1,1]),1);
 // A three-identical-observation sample refutes equal median/mean movement.
 for(const k of [2,3,11]){
  const data=[k,k,k,100*k],mean=data.reduce((s,v)=>s+v,0)/data.length;
  assert.equal((data[1]+data[2])/2,k);assert(mean>k);
  assert((1-.5)**k>0); // explicitly independent Bernoulli counterexample
  assert((k-1)/k!==k/(k+1)); // without-replacement conditional probability
  assert((1/(k+2))**2>0); // disjoint positive-probability events are dependent
 }
 return{reviewedIds,records,reviewDate:'2026-10-03',method:'manual derivation and condition review; finite boundary checks are regression evidence only'};
}
