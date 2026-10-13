/* Original, bilingual 18-minute projection lesson; no textbook text is reproduced. */
'use strict';
const G8BisectorContent = (() => {
  const stages=[
    {minutes:2,title:['先預測','Predict first'],question:['P 在角平分線上。它到角兩邊的距離有甚麼關係？先說理由，再看量度。','P lies on the angle bisector. How do its distances to the two sides compare? Explain your prediction before measuring.']},
    {minutes:2,title:['甚麼才是距離？','What counts as distance?'],question:['PM 垂直 OA，PQ 是斜線。哪一段才表示 P 到 OA 的距離？指出圖中的直角。','PM is perpendicular to OA; PQ is oblique. Which segment is the distance from P to OA? Identify the right angle.']},
    {minutes:3,title:['移動、記錄、猜想','Move, record, conjecture'],question:['保持 P 在平分線上，依次試 OP=2、4、6；再改角度。每次只改一項，至少記錄三筆。','Keep P on the bisector. Try OP=2, 4, and 6, then change the angle. Change one variable at a time and record at least three cases.']},
    {minutes:3,title:['離開平分線','Move off the bisector'],question:['先預測 P 向 OA 移動時哪個距離較小。拖動 P，或用方向鍵／數值框。再尋找兩個距離相等的位置。','Predict which distance decreases when P moves towards OA. Drag P, use arrow keys, or enter numbers. Find a position with equal distances.']},
    {minutes:5,title:['從猜想到證明','From conjecture to proof'],question:['量度三次相等，能保證每一點都成立嗎？在兩個直角三角形中，找出兩組相等角及公共邊，完成 AAS 證明。','Do three equal measurements prove the claim for every point? Find two equal angle pairs and a common side in the right triangles, then prove congruence by AAS.']},
    {minutes:0,optional:true,title:['反過來也成立？','Does the converse hold?'],question:['延伸（有時間才做）：已知 P 在角內，PM⊥OA、PN⊥OB，且 PM=PN。用 HL 證明 OP 是角平分線。哪個條件不能漏？','Optional extension, if time allows: given P inside the angle, PM⊥OA, PN⊥OB, and PM=PN, use HL to prove that OP bisects the angle. Which condition must be retained?']},
    {minutes:3,title:['獨立離堂題','Independent exit task'],question:['P 在 ∠AOB 的平分線上，PM⊥OA、PN⊥OB。若 PM=3.5 cm，PN 是多少？若改說 PQ=3.5 cm，但 PQ 不垂直 OA，仍可這樣推嗎？寫下理由。','P lies on the bisector of ∠AOB; PM⊥OA and PN⊥OB. If PM=3.5 cm, find PN. If instead PQ=3.5 cm and PQ is not perpendicular to OA, can you make the same deduction? Explain.']}
  ];
  const hints=[
    ['比較 △OPM 和 △OPN；先圈出兩個直角。','Compare △OPM and △OPN; mark the two right angles first.'],
    ['角平分線給哪一組相等角？兩個三角形有哪一條公共邊？','Which equal angles come from the bisector? Which side do the triangles share?'],
    ['∠OMP=∠ONP=90°，∠MOP=∠PON，OP=OP。OP 對著直角，所以用 AAS。','∠OMP=∠ONP=90°, ∠MOP=∠PON, and OP=OP. OP is opposite the right angles, so use AAS.']
  ];
  const forward=[
    ['已知 OP 平分 ∠AOB，PM⊥OA、PN⊥OB。','Given OP bisects ∠AOB, PM⊥OA, and PN⊥OB.'],
    ['∠OMP=∠ONP=90°（垂直的定義）。','∠OMP=∠ONP=90° (definition of perpendicular lines).'],
    ['∠MOP=∠PON（角平分線的定義）。','∠MOP=∠PON (definition of angle bisector).'],
    ['OP=OP（公共邊）。','OP=OP (common side).'],
    ['△OPM≅△OPN（AAS），所以 PM=PN（全等三角形的對應邊相等）。','△OPM≅△OPN by AAS; therefore PM=PN (corresponding sides of congruent triangles).']
  ];
  const converse=[
    ['已知 P 在 ∠AOB 內，PM⊥OA、PN⊥OB，且 PM=PN。','Given P is inside ∠AOB, PM⊥OA, PN⊥OB, and PM=PN.'],
    ['兩個三角形均為直角三角形；斜邊 OP=OP，直角邊 PM=PN。','Both triangles are right triangles; their hypotenuse OP is common and their legs PM and PN are equal.'],
    ['△OPM≅△OPN（HL），所以 ∠MOP=∠PON。','△OPM≅△OPN by HL; hence ∠MOP=∠PON.'],
    ['P 在角內，因此 OP 是 ∠AOB 的內角平分線。','Since P is inside the angle, OP is the internal angle bisector.']
  ];
  const exitAnswer=['PN=3.5 cm，由角平分線的性質。PQ 若不是垂線段，它的長不能當作到 OA 的距離，不能據此推出 PN=3.5 cm。','PN=3.5 cm by the angle-bisector property. If PQ is not perpendicular to OA, it does not measure the distance to OA, so its length cannot justify PN=3.5 cm.'];
  const theorem=['角平分線上的點到角兩邊的距離相等；角內到兩邊距離相等的點，在角平分線上。距離均指垂線段長。','A point on an internal angle bisector is equidistant from the two sides. Conversely, a point inside an angle that is equidistant from its sides lies on the bisector. Distances are perpendicular lengths.'];
  const teacherFlow=[
    ['距離辨析 2 分鐘：先開啟「甚麼才是距離？」，找出垂線段及直角。','Distance, 2 min: open “What counts as distance?” and identify perpendicular segments and right angles.'],
    ['預測及平分線上觀察 5 分鐘：預測 2 分鐘，保持 P 在平分線上量度、記錄 3 分鐘。','Prediction and locked observation, 5 min: predict for 2 min, then measure and record with P on the bisector for 3 min.'],
    ['自由移動 3 分鐘：離開平分線，比較兩個距離，再回到相等位置。','Free movement, 3 min: move off the bisector, compare both distances, and return to equality.'],
    ['AAS 證明 5 分鐘：先讓學生提出全等條件，再連結到對應邊相等。','AAS proof, 5 min: pupils propose the congruence conditions, then deduce equality of corresponding sides.'],
    ['獨立離堂題 3 分鐘：先自行解答，再對照理由。HL 逆命題在這 18 分鐘之外，有時間才作延伸。','Independent exit task, 3 min: answer individually before comparing reasoning. The HL converse is an optional extension beyond these 18 minutes.']
  ];
  return {stages,hints,forward,converse,exitAnswer,theorem,teacherFlow};
})();
