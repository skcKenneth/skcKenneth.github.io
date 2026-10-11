import { READER_GUIDES } from './reader-guides.mjs';
import { READING_PATHS } from './reading-paths.mjs';
import { CONCEPTS, CONCEPT_PLACEMENTS } from './reader-concepts.mjs';
import { MILESTONES } from './site-editorial.mjs';
import { CLASSROOM_PACKS } from './classroom-packs.mjs';

// This is a dependency registry, not a declaration that the imported material was reviewed.
const locales = ['en', 'zh-Hant'];
const writing = (id, locale) => `writing:${id}:${locale}`;
const localized = (value,locale) => {
  if(Array.isArray(value))return value.map(item=>localized(item,locale));
  if(value && typeof value==='object') {
    if(Object.hasOwn(value,'en')&&Object.hasOwn(value,'zh-Hant'))return localized(value[locale],locale);
    return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,localized(item,locale)]));
  }
  return value;
};
export const NOTE_REVIEW_DEPENDENCIES = [
  { id:'after-a-good-fit-what-to-measure', sources:['when-the-fit-is-not-the-model'] },
  { id:'keep-the-result-that-changes-the-question', sources:['how-many-equilibria-did-the-optimizer-miss','when-a-reduced-ventilation-model-leaves-its-training-regime'] },
  { id:'choose-the-question-before-the-score', sources:['when-a-traffic-solver-invents-a-jam','when-solar-power-changes-fast'] }
];

export const MANAGED_REVIEW_SOURCES = [
  { id:'macau-competition', paths:['public/resources/macau-school-math-competition-2019-2026/manifest.json','public/resources/macau-school-math-competition-2019-2026/managed-assets.json'], teachingIds:['macau-school-math-competition'] },
  { id:'lecture-materials', paths:['public/resources/mathematical-modeling-lecture-materials/manifest.json','public/resources/mathematical-modeling-lecture-materials/managed-assets.json'], teachingIds:['mathematical-modeling-lecture-programme'] },
  { id:'modeling-workshop', paths:['public/resources/modeling-workshop/manifest.json','public/resources/modeling-workshop/source-map.json'], teachingIds:[] }
];

export function editorialReviewNodes() {
  return [
    ...Object.entries(READER_GUIDES).flatMap(([id, pair]) => locales.map(locale => ({
      key:`guide:${id}:${locale}`, kind:'guide', locale, id, title:pair[locale].question,
      paths:['src/data/reader-guides.mjs'], value:pair[locale], dependencies:[writing(id,locale)], pilot:true
    }))),
    ...READING_PATHS.flatMap(path => locales.map(locale => ({
      key:`path:${path.id}:${locale}`, kind:'path', locale, id:path.id, title:path.title[locale],
      paths:['src/data/reading-paths.mjs'],
      value:{topicIds:path.topicIds,title:path.title[locale],description:path.description[locale],boundary:path.boundary[locale],
        steps:path.steps.map(step => ({articleId:step.articleId,optional:Boolean(step.optional),purpose:step.purpose[locale],prerequisite:step.prerequisite[locale],boundary:step.boundary[locale]}))},
      dependencies:path.steps.map(step => writing(step.articleId,locale)), pilot:true
    }))),
    ...CONCEPTS.flatMap(concept => locales.map(locale => ({
      key:`concept:${concept.id}:${locale}`, kind:'concept', locale, id:concept.id, title:concept.label[locale],
      paths:['src/data/reader-concepts.mjs'],
      value:{label:concept.label[locale],aliases:concept.aliases[locale],topicIds:concept.topicIds,copy:concept.copy[locale],sources:concept.sources,
        resources:(concept.resources||[]).map(resource => ({label:resource.label[locale],href:resource.href[locale]})),
        placements:Object.entries(CONCEPT_PLACEMENTS).flatMap(([id,placements]) => placements.filter(item => item.conceptId===concept.id).map(item => ({articleId:id,headingId:item.headingId[locale]})))},
      dependencies:concept.articleIds.map(id => writing(id,locale)), pilot:true
    }))),
    {key:'teaching-source:math-studio-sampling:shared',kind:'teaching-source',locale:'shared',id:'math-studio-sampling',title:'Existing Year 7 sampling activity',
      paths:['public/math-studio/inquiry-g7-core.js','public/math-studio/inquiry-g7-content.js','public/math-studio/inquiry-g7-ui.js','public/math-studio/app.js','docs/math-studio-g7-inquiry.md'],dependencies:[],pilot:true},
    {key:'teaching-source:mixing-tank:shared',kind:'teaching-source',locale:'shared',id:'mixing-tank',title:'Existing mixing-tank lesson and reference',
      paths:['src/data/workshop-lessons.ts','src/lib/workshop-state.mjs','src/scripts/workshop-client.ts','public/resources/modeling-workshop/worker.mjs',
        'public/resources/modeling-workshop/mixing-tank/exercise.json','public/resources/modeling-workshop/mixing-tank/reference.py','public/resources/modeling-workshop/mixing-tank/reference.ipynb','public/resources/modeling-workshop/mixing-tank/baseline.csv'],
      dependencies:['manifest:modeling-workshop:shared'],pilot:true},
    ...CLASSROOM_PACKS.flatMap(pack => locales.map(locale => ({key:`classroom-pack:${pack.id}:${locale}`,kind:'classroom-pack',locale,id:pack.id,title:pack.title[locale],
      paths:['src/data/classroom-packs.mjs'],value:localized(pack,locale),pilot:true,
      dependencies:[writing('modeling-workflow',locale),...(pack.id==='sampling-bias'?['teaching-source:math-studio-sampling:shared']:
        pack.id==='mixing-tank'?['teaching-source:mixing-tank:shared',`concept:validation:${locale}`]:[`missing-classroom-source:${pack.id}:shared`])]
    }))),
    ...CLASSROOM_PACKS.flatMap(pack => locales.map(locale => {
      const opposite=locale==='en'?'zh-Hant':'en';
      return {key:`translation-classroom-pack:${pack.id}:${locale}-to-${opposite}`,kind:'translation',locale:opposite,id:pack.id,title:`${pack.title[locale]} (${locale} → ${opposite})`,
        paths:['src/data/classroom-packs.mjs'],value:{source:`classroom-pack:${pack.id}:${locale}`,target:`classroom-pack:${pack.id}:${opposite}`},
        dependencies:[`classroom-pack:${pack.id}:${locale}`,`classroom-pack:${pack.id}:${opposite}`],pilot:true};
    })),
    ...locales.map(locale => ({key:`teaching-interface:modeling-workshop:${locale}`,kind:'teaching-interface',locale,id:'modeling-workshop',title:'Modeling workshop entrance',
      paths:[`src/pages/${locale==='en'?'':'zh/'}teaching/modeling-workshop/index.astro`,'src/components/WorkshopIndex.astro'],
      dependencies:['manifest:modeling-workshop:shared'],pilot:true}))
  ];
}

// Only the delimited receipt array is writable by the explicit `record` command.
// A snapshot, a successful test or an elapsed milestone never creates a receipt.
export const REVIEW_RECEIPTS = /* CONTENT_REVIEW_RECEIPTS_START */
[
  {
    "key": "classroom-pack:mixing-tank:en",
    "fingerprint": "c038ae6a13ae0d2a40eaacda70ed9b78fc920abb5d7dc5038f19cf66a56d71c7",
    "dependencies": {
      "concept:validation:en": "0a3f8bdbb25d79b3d652237141dedbde6c9f91a330dfe07f612260ddbc649a3c",
      "manifest:modeling-workshop:shared": "bd2761e88bd85b2172aa4fd45ff8dd01a13f4ea5a0f71f506353c6b0574c55c8",
      "teaching-source:mixing-tank:shared": "5df5490ab45418d01c93a9f9163639c248f4d94cc0bf3a17e0142a17ae6fe9dc",
      "writing:modeling-workflow:en": "fed33a79d96aab3831ebe48d144c7570024363178abed20a77f49065ae7c2a08",
      "writing:what-must-a-traffic-model-remember:en": "839deef2d1712138c18ad428cad41261f9d1ea51da63f47739b465b96a8199da",
      "writing:when-solar-power-changes-fast:en": "976fcd86fa4b3234f4c0afa48a3a4881dcc5df12558993b881a9451f0ca8a06f",
      "writing:when-the-fit-is-not-the-model:en": "52649512d0cc66fb856dfd2c59dc900ff25bba90de3839df08d9095c744fe943"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Bilingual lesson sequence, time totals, source mathematics, source navigation, settings whitelist and student/teacher content separation.",
    "conclusion": "consistent",
    "reason": "The 45/50 minute totals, actual four sampling cases and mixing v1.0.0 match sources; two independent audits found no unresolved source mismatch. Times are authored pacing, not measured outcomes.",
    "references": [
      "src/data/classroom-packs.mjs",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "classroom-pack:mixing-tank:zh-Hant",
    "fingerprint": "20321d8addd947ad1351fc2cda8eb742abdfb6804850ed959ba2f17369f38ab4",
    "dependencies": {
      "concept:validation:zh-Hant": "721cf0ee2b31a465be17b703478f4cd8f5c89859ecf1ac316808b040e38a7db7",
      "manifest:modeling-workshop:shared": "bd2761e88bd85b2172aa4fd45ff8dd01a13f4ea5a0f71f506353c6b0574c55c8",
      "teaching-source:mixing-tank:shared": "5df5490ab45418d01c93a9f9163639c248f4d94cc0bf3a17e0142a17ae6fe9dc",
      "writing:modeling-workflow:zh-Hant": "d727c80b4810dd9af09e94f0d0c911ff130cf7aa3b45ff05f655c3e29142d1b9",
      "writing:what-must-a-traffic-model-remember:zh-Hant": "4550219d3f70be9bc6850b9abebfcbb0f961ace3a9708cb56411d8bebe52b54d",
      "writing:when-solar-power-changes-fast:zh-Hant": "5102ed8a34c7f43b6e001647d61d682e2a645f0935ccb3c0baf5e10586731931",
      "writing:when-the-fit-is-not-the-model:zh-Hant": "f11041634753a25611e313696fdddf29b8a82034956a626d76d8762bf7c65539"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Bilingual lesson sequence, time totals, source mathematics, source navigation, settings whitelist and student/teacher content separation.",
    "conclusion": "consistent",
    "reason": "The 45/50 minute totals, actual four sampling cases and mixing v1.0.0 match sources; two independent audits found no unresolved source mismatch. Times are authored pacing, not measured outcomes.",
    "references": [
      "src/data/classroom-packs.mjs",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "classroom-pack:sampling-bias:en",
    "fingerprint": "e4bdc507f0271a626cd7b012318d20b5ea541bed47b70acb03568099daf64b64",
    "dependencies": {
      "teaching-source:math-studio-sampling:shared": "679680402ae8b865357595dd0892276f40107dfd1d2c1802ae2bcb7ff5711336",
      "writing:modeling-workflow:en": "fed33a79d96aab3831ebe48d144c7570024363178abed20a77f49065ae7c2a08"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Bilingual lesson sequence, time totals, source mathematics, source navigation, settings whitelist and student/teacher content separation.",
    "conclusion": "consistent",
    "reason": "The 45/50 minute totals, actual four sampling cases and mixing v1.0.0 match sources; two independent audits found no unresolved source mismatch. Times are authored pacing, not measured outcomes.",
    "references": [
      "src/data/classroom-packs.mjs",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "classroom-pack:sampling-bias:zh-Hant",
    "fingerprint": "8d04062616a3f3313ee878828dbe8e1a19734527f231dfccc12c8b669b5c4b6a",
    "dependencies": {
      "teaching-source:math-studio-sampling:shared": "679680402ae8b865357595dd0892276f40107dfd1d2c1802ae2bcb7ff5711336",
      "writing:modeling-workflow:zh-Hant": "d727c80b4810dd9af09e94f0d0c911ff130cf7aa3b45ff05f655c3e29142d1b9"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Bilingual lesson sequence, time totals, source mathematics, source navigation, settings whitelist and student/teacher content separation.",
    "conclusion": "consistent",
    "reason": "The 45/50 minute totals, actual four sampling cases and mixing v1.0.0 match sources; two independent audits found no unresolved source mismatch. Times are authored pacing, not measured outcomes.",
    "references": [
      "src/data/classroom-packs.mjs",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "concept:assumption:en",
    "fingerprint": "dde42d33e969dd52712f31629eb11dab3d14b794b888a4c2f34554ac37ff4278",
    "dependencies": {
      "writing:random-stress-tests-are-not-certificates:en": "e70a3ed209c0a5742ac18fbecb12ac120249fec816ae77d3276259081e285af5",
      "writing:two-networks-one-spectrum-different-alarms:en": "1358da6d12a31d9b1a00534e09082e56ffdf4efb5fbde5b482c5346d2ca55657"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:assumption:zh-Hant",
    "fingerprint": "b3fbc594fb5ae73e1bbc6f6f651a6b7096fe193c04892a096779d2d8c9704f9e",
    "dependencies": {
      "writing:random-stress-tests-are-not-certificates:zh-Hant": "16e8b4018cc67ca30dd6143ce1ad046974bf530a4d92c9754e2f7efe13bd72d5",
      "writing:two-networks-one-spectrum-different-alarms:zh-Hant": "0016d48aa4927c4dcc7b4c6a02c488a598d5d396fd8f0805d7fb0aeffafbb83e"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:baseline:en",
    "fingerprint": "b229d89ae903bc27b33593d64b244f619be8d704db095cba88bcfd5abcdb0d74",
    "dependencies": {
      "writing:how-many-equilibria-did-the-optimizer-miss:en": "d187c0b8280bab4c0f5d1317d4133b9e2f48ec189050496d8ce6c6c9c3142063",
      "writing:what-must-a-traffic-model-remember:en": "839deef2d1712138c18ad428cad41261f9d1ea51da63f47739b465b96a8199da",
      "writing:when-solar-power-changes-fast:en": "976fcd86fa4b3234f4c0afa48a3a4881dcc5df12558993b881a9451f0ca8a06f"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:baseline:zh-Hant",
    "fingerprint": "70d5a4004a7715661240df150c8e149d0d3c56fdf29c822dafceaa2aaacd5fc6",
    "dependencies": {
      "writing:how-many-equilibria-did-the-optimizer-miss:zh-Hant": "609050f056dcdc7ce464063ceb785cccf531460a661d69ebd2b1e47846ae0c76",
      "writing:what-must-a-traffic-model-remember:zh-Hant": "4550219d3f70be9bc6850b9abebfcbb0f961ace3a9708cb56411d8bebe52b54d",
      "writing:when-solar-power-changes-fast:zh-Hant": "5102ed8a34c7f43b6e001647d61d682e2a645f0935ccb3c0baf5e10586731931"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:calibration:en",
    "fingerprint": "509fdbeebaddf4a9a71d7e5dd11062702ea6c54a4d48105619628ced20bdcbfc",
    "dependencies": {
      "writing:when-solar-power-changes-fast:en": "976fcd86fa4b3234f4c0afa48a3a4881dcc5df12558993b881a9451f0ca8a06f"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:calibration:zh-Hant",
    "fingerprint": "f822ed9fa1c7496c5092ab910dd476a8c5ea79db522a543f9494ebc0d32d71b3",
    "dependencies": {
      "writing:when-solar-power-changes-fast:zh-Hant": "5102ed8a34c7f43b6e001647d61d682e2a645f0935ccb3c0baf5e10586731931"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:identifiability:en",
    "fingerprint": "61c2c832b481cabc6c3ac067f4b3a7552009b7b22178d1c9e92179f50d01b727",
    "dependencies": {
      "writing:when-the-fit-is-not-the-model:en": "52649512d0cc66fb856dfd2c59dc900ff25bba90de3839df08d9095c744fe943"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:identifiability:zh-Hant",
    "fingerprint": "56d2efddb4031f7788449432209ae42b384791bc65fdc44ac5f78005ed769973",
    "dependencies": {
      "writing:when-the-fit-is-not-the-model:zh-Hant": "f11041634753a25611e313696fdddf29b8a82034956a626d76d8762bf7c65539"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:robustness:en",
    "fingerprint": "3b69452286a23f29a8089fb97156389f67ad5de8283d68e4b6d5240df44fd628",
    "dependencies": {
      "writing:how-many-equilibria-did-the-optimizer-miss:en": "d187c0b8280bab4c0f5d1317d4133b9e2f48ec189050496d8ce6c6c9c3142063",
      "writing:two-networks-one-spectrum-different-alarms:en": "1358da6d12a31d9b1a00534e09082e56ffdf4efb5fbde5b482c5346d2ca55657",
      "writing:what-must-a-traffic-model-remember:en": "839deef2d1712138c18ad428cad41261f9d1ea51da63f47739b465b96a8199da"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:robustness:zh-Hant",
    "fingerprint": "b9f237115457143c7b5113a7bf50ba0a0430529f727301cc4d826719c2ee02cc",
    "dependencies": {
      "writing:how-many-equilibria-did-the-optimizer-miss:zh-Hant": "609050f056dcdc7ce464063ceb785cccf531460a661d69ebd2b1e47846ae0c76",
      "writing:two-networks-one-spectrum-different-alarms:zh-Hant": "0016d48aa4927c4dcc7b4c6a02c488a598d5d396fd8f0805d7fb0aeffafbb83e",
      "writing:what-must-a-traffic-model-remember:zh-Hant": "4550219d3f70be9bc6850b9abebfcbb0f961ace3a9708cb56411d8bebe52b54d"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:sensitivity:en",
    "fingerprint": "782e7ea4e4d48e0fc1d866e846d08c6d0ea05e323f83290d5d173d80503b6d1a",
    "dependencies": {
      "writing:how-many-equilibria-did-the-optimizer-miss:en": "d187c0b8280bab4c0f5d1317d4133b9e2f48ec189050496d8ce6c6c9c3142063",
      "writing:what-must-a-traffic-model-remember:en": "839deef2d1712138c18ad428cad41261f9d1ea51da63f47739b465b96a8199da",
      "writing:when-solar-power-changes-fast:en": "976fcd86fa4b3234f4c0afa48a3a4881dcc5df12558993b881a9451f0ca8a06f"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:sensitivity:zh-Hant",
    "fingerprint": "721e4a5aba631d16a03b407f4913539340ab71fc90ae7b3411f19be341edb456",
    "dependencies": {
      "writing:how-many-equilibria-did-the-optimizer-miss:zh-Hant": "609050f056dcdc7ce464063ceb785cccf531460a661d69ebd2b1e47846ae0c76",
      "writing:what-must-a-traffic-model-remember:zh-Hant": "4550219d3f70be9bc6850b9abebfcbb0f961ace3a9708cb56411d8bebe52b54d",
      "writing:when-solar-power-changes-fast:zh-Hant": "5102ed8a34c7f43b6e001647d61d682e2a645f0935ccb3c0baf5e10586731931"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:uncertainty:en",
    "fingerprint": "092158b7942b2d5d5c50a7ed81639ff63cfbed09dd75c5e2e1b394e186e404c2",
    "dependencies": {
      "writing:random-stress-tests-are-not-certificates:en": "e70a3ed209c0a5742ac18fbecb12ac120249fec816ae77d3276259081e285af5",
      "writing:when-solar-power-changes-fast:en": "976fcd86fa4b3234f4c0afa48a3a4881dcc5df12558993b881a9451f0ca8a06f",
      "writing:when-the-fit-is-not-the-model:en": "52649512d0cc66fb856dfd2c59dc900ff25bba90de3839df08d9095c744fe943"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:uncertainty:zh-Hant",
    "fingerprint": "84f348a717b3605c1b3900e738c794c8c451b79cbf946bfa11f48a5ffccd3482",
    "dependencies": {
      "writing:random-stress-tests-are-not-certificates:zh-Hant": "16e8b4018cc67ca30dd6143ce1ad046974bf530a4d92c9754e2f7efe13bd72d5",
      "writing:when-solar-power-changes-fast:zh-Hant": "5102ed8a34c7f43b6e001647d61d682e2a645f0935ccb3c0baf5e10586731931",
      "writing:when-the-fit-is-not-the-model:zh-Hant": "f11041634753a25611e313696fdddf29b8a82034956a626d76d8762bf7c65539"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:validation:en",
    "fingerprint": "0a3f8bdbb25d79b3d652237141dedbde6c9f91a330dfe07f612260ddbc649a3c",
    "dependencies": {
      "writing:what-must-a-traffic-model-remember:en": "839deef2d1712138c18ad428cad41261f9d1ea51da63f47739b465b96a8199da",
      "writing:when-solar-power-changes-fast:en": "976fcd86fa4b3234f4c0afa48a3a4881dcc5df12558993b881a9451f0ca8a06f",
      "writing:when-the-fit-is-not-the-model:en": "52649512d0cc66fb856dfd2c59dc900ff25bba90de3839df08d9095c744fe943"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "concept:validation:zh-Hant",
    "fingerprint": "721cf0ee2b31a465be17b703478f4cd8f5c89859ecf1ac316808b040e38a7db7",
    "dependencies": {
      "writing:what-must-a-traffic-model-remember:zh-Hant": "4550219d3f70be9bc6850b9abebfcbb0f961ace3a9708cb56411d8bebe52b54d",
      "writing:when-solar-power-changes-fast:zh-Hant": "5102ed8a34c7f43b6e001647d61d682e2a645f0935ccb3c0baf5e10586731931",
      "writing:when-the-fit-is-not-the-model:zh-Hant": "f11041634753a25611e313696fdddf29b8a82034956a626d76d8762bf7c65539"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Definition, example, misconception and scope against the paired public articles and recorded primary references; inserted notes leave original rendered prose intact.",
    "conclusion": "consistent",
    "reason": "Eight concept pairs were checked in batch 2; CQR exchangeability/marginal coverage, finite-grid identification and pairwise robustness limitations remain. This does not recheck external source freshness.",
    "references": [
      "src/data/reader-concepts.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "guide:how-many-equilibria-did-the-optimizer-miss:en",
    "fingerprint": "f9b19d93cca0ecdca2a18ff29ee5601587d1af5ae119f0e78507083775ee3dbd",
    "dependencies": {
      "writing:how-many-equilibria-did-the-optimizer-miss:en": "d187c0b8280bab4c0f5d1317d4133b9e2f48ec189050496d8ce6c6c9c3142063"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Editorial question, prerequisites, takeaways and evidence boundary against the six unchanged public articles; paired copy audited in batch 1.",
    "conclusion": "consistent",
    "reason": "Source limits remain explicit, including 4D traffic memory versus the separate headway-only control. This is an editorial source audit, not research reproduction.",
    "references": [
      "src/data/reader-guides.mjs",
      "design/site-refresh/editorial-batch.md"
    ]
  },
  {
    "key": "guide:how-many-equilibria-did-the-optimizer-miss:zh-Hant",
    "fingerprint": "454e3b4c273ccf2326ab9dc57855cd9bcad9bb0c9d29738154d6a083bf9c0c0e",
    "dependencies": {
      "writing:how-many-equilibria-did-the-optimizer-miss:zh-Hant": "609050f056dcdc7ce464063ceb785cccf531460a661d69ebd2b1e47846ae0c76"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Editorial question, prerequisites, takeaways and evidence boundary against the six unchanged public articles; paired copy audited in batch 1.",
    "conclusion": "consistent",
    "reason": "Source limits remain explicit, including 4D traffic memory versus the separate headway-only control. This is an editorial source audit, not research reproduction.",
    "references": [
      "src/data/reader-guides.mjs",
      "design/site-refresh/editorial-batch.md"
    ]
  },
  {
    "key": "guide:random-stress-tests-are-not-certificates:en",
    "fingerprint": "5d8ee7d1743185fa7b81abad1149f2785335a83c82d7b17feae39ebda6390f01",
    "dependencies": {
      "writing:random-stress-tests-are-not-certificates:en": "e70a3ed209c0a5742ac18fbecb12ac120249fec816ae77d3276259081e285af5"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Editorial question, prerequisites, takeaways and evidence boundary against the six unchanged public articles; paired copy audited in batch 1.",
    "conclusion": "consistent",
    "reason": "Source limits remain explicit, including 4D traffic memory versus the separate headway-only control. This is an editorial source audit, not research reproduction.",
    "references": [
      "src/data/reader-guides.mjs",
      "design/site-refresh/editorial-batch.md"
    ]
  },
  {
    "key": "guide:random-stress-tests-are-not-certificates:zh-Hant",
    "fingerprint": "f2f9e6fcd03708834fbd4f34734c1ed62fdc37f07af46da3374af61c050163d8",
    "dependencies": {
      "writing:random-stress-tests-are-not-certificates:zh-Hant": "16e8b4018cc67ca30dd6143ce1ad046974bf530a4d92c9754e2f7efe13bd72d5"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Editorial question, prerequisites, takeaways and evidence boundary against the six unchanged public articles; paired copy audited in batch 1.",
    "conclusion": "consistent",
    "reason": "Source limits remain explicit, including 4D traffic memory versus the separate headway-only control. This is an editorial source audit, not research reproduction.",
    "references": [
      "src/data/reader-guides.mjs",
      "design/site-refresh/editorial-batch.md"
    ]
  },
  {
    "key": "guide:two-networks-one-spectrum-different-alarms:en",
    "fingerprint": "abdf21084045620cc8b55a036538b5cbdc76af84c0deb890afcec9cb834e2e4c",
    "dependencies": {
      "writing:two-networks-one-spectrum-different-alarms:en": "1358da6d12a31d9b1a00534e09082e56ffdf4efb5fbde5b482c5346d2ca55657"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Editorial question, prerequisites, takeaways and evidence boundary against the six unchanged public articles; paired copy audited in batch 1.",
    "conclusion": "consistent",
    "reason": "Source limits remain explicit, including 4D traffic memory versus the separate headway-only control. This is an editorial source audit, not research reproduction.",
    "references": [
      "src/data/reader-guides.mjs",
      "design/site-refresh/editorial-batch.md"
    ]
  },
  {
    "key": "guide:two-networks-one-spectrum-different-alarms:zh-Hant",
    "fingerprint": "6ae49bdc084f4beed6362462f2d27e852f1d68932251736b0cdf60b00756cf16",
    "dependencies": {
      "writing:two-networks-one-spectrum-different-alarms:zh-Hant": "0016d48aa4927c4dcc7b4c6a02c488a598d5d396fd8f0805d7fb0aeffafbb83e"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Editorial question, prerequisites, takeaways and evidence boundary against the six unchanged public articles; paired copy audited in batch 1.",
    "conclusion": "consistent",
    "reason": "Source limits remain explicit, including 4D traffic memory versus the separate headway-only control. This is an editorial source audit, not research reproduction.",
    "references": [
      "src/data/reader-guides.mjs",
      "design/site-refresh/editorial-batch.md"
    ]
  },
  {
    "key": "guide:what-must-a-traffic-model-remember:en",
    "fingerprint": "960faa0859e3cf0fa6dafd1cacafb56d9087c6cdabddfb24077975622fa8f6fe",
    "dependencies": {
      "writing:what-must-a-traffic-model-remember:en": "839deef2d1712138c18ad428cad41261f9d1ea51da63f47739b465b96a8199da"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Editorial question, prerequisites, takeaways and evidence boundary against the six unchanged public articles; paired copy audited in batch 1.",
    "conclusion": "consistent",
    "reason": "Source limits remain explicit, including 4D traffic memory versus the separate headway-only control. This is an editorial source audit, not research reproduction.",
    "references": [
      "src/data/reader-guides.mjs",
      "design/site-refresh/editorial-batch.md"
    ]
  },
  {
    "key": "guide:what-must-a-traffic-model-remember:zh-Hant",
    "fingerprint": "c17129c6b5936ca310d0124810b7f3655ef10d1248f7646c573e11e491bd811a",
    "dependencies": {
      "writing:what-must-a-traffic-model-remember:zh-Hant": "4550219d3f70be9bc6850b9abebfcbb0f961ace3a9708cb56411d8bebe52b54d"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Editorial question, prerequisites, takeaways and evidence boundary against the six unchanged public articles; paired copy audited in batch 1.",
    "conclusion": "consistent",
    "reason": "Source limits remain explicit, including 4D traffic memory versus the separate headway-only control. This is an editorial source audit, not research reproduction.",
    "references": [
      "src/data/reader-guides.mjs",
      "design/site-refresh/editorial-batch.md"
    ]
  },
  {
    "key": "guide:when-solar-power-changes-fast:en",
    "fingerprint": "d5902959c61cf41a05cc4f5919c10c71fc99e3a58cf9eea07e844f79cfca4cab",
    "dependencies": {
      "writing:when-solar-power-changes-fast:en": "976fcd86fa4b3234f4c0afa48a3a4881dcc5df12558993b881a9451f0ca8a06f"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Editorial question, prerequisites, takeaways and evidence boundary against the six unchanged public articles; paired copy audited in batch 1.",
    "conclusion": "consistent",
    "reason": "Source limits remain explicit, including 4D traffic memory versus the separate headway-only control. This is an editorial source audit, not research reproduction.",
    "references": [
      "src/data/reader-guides.mjs",
      "design/site-refresh/editorial-batch.md"
    ]
  },
  {
    "key": "guide:when-solar-power-changes-fast:zh-Hant",
    "fingerprint": "9f6cc64ab234702dacf71729e605139860112a5b4afee3e1d1fefa07b0bf5c58",
    "dependencies": {
      "writing:when-solar-power-changes-fast:zh-Hant": "5102ed8a34c7f43b6e001647d61d682e2a645f0935ccb3c0baf5e10586731931"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Editorial question, prerequisites, takeaways and evidence boundary against the six unchanged public articles; paired copy audited in batch 1.",
    "conclusion": "consistent",
    "reason": "Source limits remain explicit, including 4D traffic memory versus the separate headway-only control. This is an editorial source audit, not research reproduction.",
    "references": [
      "src/data/reader-guides.mjs",
      "design/site-refresh/editorial-batch.md"
    ]
  },
  {
    "key": "guide:when-the-fit-is-not-the-model:en",
    "fingerprint": "8babd81e05e2b8f2cd4eef83e065f116a59eedc5a08e9bf38021b396b2c55168",
    "dependencies": {
      "writing:when-the-fit-is-not-the-model:en": "52649512d0cc66fb856dfd2c59dc900ff25bba90de3839df08d9095c744fe943"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Editorial question, prerequisites, takeaways and evidence boundary against the six unchanged public articles; paired copy audited in batch 1.",
    "conclusion": "consistent",
    "reason": "Source limits remain explicit, including 4D traffic memory versus the separate headway-only control. This is an editorial source audit, not research reproduction.",
    "references": [
      "src/data/reader-guides.mjs",
      "design/site-refresh/editorial-batch.md"
    ]
  },
  {
    "key": "guide:when-the-fit-is-not-the-model:zh-Hant",
    "fingerprint": "a6142cc0163c11d3db12cf0f68de77ced9e49d59b00b1a30a09a0d9764e7ce87",
    "dependencies": {
      "writing:when-the-fit-is-not-the-model:zh-Hant": "f11041634753a25611e313696fdddf29b8a82034956a626d76d8762bf7c65539"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Editorial question, prerequisites, takeaways and evidence boundary against the six unchanged public articles; paired copy audited in batch 1.",
    "conclusion": "consistent",
    "reason": "Source limits remain explicit, including 4D traffic memory versus the separate headway-only control. This is an editorial source audit, not research reproduction.",
    "references": [
      "src/data/reader-guides.mjs",
      "design/site-refresh/editorial-batch.md"
    ]
  },
  {
    "key": "manifest:lecture-materials:shared",
    "fingerprint": "b5290d68971a370ab07ec1054883d4b1d0454914af6ded883387966bf8b2f5c9",
    "dependencies": {},
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Public manifest metadata, declared version, bytes, hashes, existing licence/source fields and asset boundary against current local publication gates.",
    "conclusion": "consistent",
    "reason": "Teaching-resource validation checked 214 competition solutions, 27 lecture units and 94 lecture assets; workshop release/hash and provenance checks passed. No claim of upstream latestness or independent correctness of every solution.",
    "references": [
      "public/resources/mathematical-modeling-lecture-materials/managed-assets.json",
      "public/resources/mathematical-modeling-lecture-materials/manifest.json",
      "design/site-refresh/content-review/README.md"
    ]
  },
  {
    "key": "manifest:macau-competition:shared",
    "fingerprint": "8774a5679382b39ce52fd7786098d12cde528dc7d0b4f48a2edb1f34ebed6dbd",
    "dependencies": {},
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Public manifest metadata, declared version, bytes, hashes, existing licence/source fields and asset boundary against current local publication gates.",
    "conclusion": "consistent",
    "reason": "Teaching-resource validation checked 214 competition solutions, 27 lecture units and 94 lecture assets; workshop release/hash and provenance checks passed. No claim of upstream latestness or independent correctness of every solution.",
    "references": [
      "public/resources/macau-school-math-competition-2019-2026/managed-assets.json",
      "public/resources/macau-school-math-competition-2019-2026/manifest.json",
      "design/site-refresh/content-review/README.md"
    ]
  },
  {
    "key": "manifest:modeling-workshop:shared",
    "fingerprint": "bd2761e88bd85b2172aa4fd45ff8dd01a13f4ea5a0f71f506353c6b0574c55c8",
    "dependencies": {},
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Public manifest metadata, declared version, bytes, hashes, existing licence/source fields and asset boundary against current local publication gates.",
    "conclusion": "consistent",
    "reason": "Teaching-resource validation checked 214 competition solutions, 27 lecture units and 94 lecture assets; workshop release/hash and provenance checks passed. No claim of upstream latestness or independent correctness of every solution.",
    "references": [
      "public/resources/modeling-workshop/manifest.json",
      "public/resources/modeling-workshop/source-map.json",
      "design/site-refresh/content-review/README.md"
    ]
  },
  {
    "key": "milestone:adma-2026:shared",
    "fingerprint": "eb7c6451c7eeb0a2917f7f7fda108c29e94d72b3af9fbf98b399d97417d4de55",
    "dependencies": {},
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Retained milestone metadata and the specific presentation/publication facts that still require external or author confirmation.",
    "conclusion": "pending",
    "reason": "Programme listing, acceptance and scheduled dates are retained as recorded. Elapsed or future event dates do not prove presentation, attendance or proceedings publication; those outcomes remain pending.",
    "references": [
      "src/data/site-editorial.mjs"
    ]
  },
  {
    "key": "milestone:ai4nature-2026:shared",
    "fingerprint": "b0a0e395539731f9cd143ba6dad6b893effa507e6ba82e1389ffade2197b230a",
    "dependencies": {},
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Retained milestone metadata and the specific presentation/publication facts that still require external or author confirmation.",
    "conclusion": "pending",
    "reason": "Programme listing, acceptance and scheduled dates are retained as recorded. Elapsed or future event dates do not prove presentation, attendance or proceedings publication; those outcomes remain pending.",
    "references": [
      "src/data/site-editorial.mjs"
    ]
  },
  {
    "key": "path:city-models:en",
    "fingerprint": "19a149c6216bbe65c6364176d6d4d9a41852b15a3e1966a720c77662bef77a21",
    "dependencies": {
      "writing:what-must-a-traffic-model-remember:en": "839deef2d1712138c18ad428cad41261f9d1ea51da63f47739b465b96a8199da",
      "writing:when-a-reduced-ventilation-model-leaves-its-training-regime:en": "12864d6e14a6a04c01bac5f5a12c01859f79c86c59e527173c52c8628fc25664",
      "writing:when-a-traffic-solver-invents-a-jam:en": "d81121c984c4907ce8a3637eddf2fe43c3596896360a3a2d65cf58b6e3a391c3",
      "writing:when-the-timetable-lies:en": "7ed6375e39f0a61e0dfc344735a942615204657cc37ea53d5b83dccaa397a025"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Manually curated sequence, actual localized article identities, prerequisites and scope boundaries against current public sources.",
    "conclusion": "consistent",
    "reason": "The two routes retain nominal failures, synthetic-only examples and optional advanced steps; route time derives from current published content.",
    "references": [
      "src/data/reading-paths.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "path:city-models:zh-Hant",
    "fingerprint": "07c4f20c9de589ce58e4b0052e236c979465ea1be8b6dbf94498d91a2c123514",
    "dependencies": {
      "writing:what-must-a-traffic-model-remember:zh-Hant": "4550219d3f70be9bc6850b9abebfcbb0f961ace3a9708cb56411d8bebe52b54d",
      "writing:when-a-reduced-ventilation-model-leaves-its-training-regime:zh-Hant": "c1675126922600e6c7536ac0143548840459bb150114e92f5cb131daa595b03c",
      "writing:when-a-traffic-solver-invents-a-jam:zh-Hant": "545b9fa6248375ed9fbe9075b87679c15a139d72e621feb65e4ee9cffa6386e2",
      "writing:when-the-timetable-lies:zh-Hant": "1a8872031827befb0429b8d7342f65d98c69f009b117d2d709e35eeb1baa7264"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Manually curated sequence, actual localized article identities, prerequisites and scope boundaries against current public sources.",
    "conclusion": "consistent",
    "reason": "The two routes retain nominal failures, synthetic-only examples and optional advanced steps; route time derives from current published content.",
    "references": [
      "src/data/reading-paths.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "path:model-trust:en",
    "fingerprint": "3530e98693a673d1899b11399de8b8290dfed659bd4ba22dd76aded2a750c125",
    "dependencies": {
      "writing:random-stress-tests-are-not-certificates:en": "e70a3ed209c0a5742ac18fbecb12ac120249fec816ae77d3276259081e285af5",
      "writing:two-networks-one-spectrum-different-alarms:en": "1358da6d12a31d9b1a00534e09082e56ffdf4efb5fbde5b482c5346d2ca55657",
      "writing:when-solar-power-changes-fast:en": "976fcd86fa4b3234f4c0afa48a3a4881dcc5df12558993b881a9451f0ca8a06f",
      "writing:when-the-fit-is-not-the-model:en": "52649512d0cc66fb856dfd2c59dc900ff25bba90de3839df08d9095c744fe943"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Manually curated sequence, actual localized article identities, prerequisites and scope boundaries against current public sources.",
    "conclusion": "consistent",
    "reason": "The two routes retain nominal failures, synthetic-only examples and optional advanced steps; route time derives from current published content.",
    "references": [
      "src/data/reading-paths.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "path:model-trust:zh-Hant",
    "fingerprint": "7133858a131d1f1a736b4e177e881887c12351cec6747856f55114a74d2351a4",
    "dependencies": {
      "writing:random-stress-tests-are-not-certificates:zh-Hant": "16e8b4018cc67ca30dd6143ce1ad046974bf530a4d92c9754e2f7efe13bd72d5",
      "writing:two-networks-one-spectrum-different-alarms:zh-Hant": "0016d48aa4927c4dcc7b4c6a02c488a598d5d396fd8f0805d7fb0aeffafbb83e",
      "writing:when-solar-power-changes-fast:zh-Hant": "5102ed8a34c7f43b6e001647d61d682e2a645f0935ccb3c0baf5e10586731931",
      "writing:when-the-fit-is-not-the-model:zh-Hant": "f11041634753a25611e313696fdddf29b8a82034956a626d76d8762bf7c65539"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Manually curated sequence, actual localized article identities, prerequisites and scope boundaries against current public sources.",
    "conclusion": "consistent",
    "reason": "The two routes retain nominal failures, synthetic-only examples and optional advanced steps; route time derives from current published content.",
    "references": [
      "src/data/reading-paths.mjs",
      "design/site-refresh/reading-batch.md"
    ]
  },
  {
    "key": "teaching-interface:modeling-workshop:en",
    "fingerprint": "2d07106315a8a635257b4092c6dca5cf7f3a01f1c2d6a742f64a71dd3940ea6f",
    "dependencies": {
      "manifest:modeling-workshop:shared": "bd2761e88bd85b2172aa4fd45ff8dd01a13f4ea5a0f71f506353c6b0574c55c8"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Existing paired workshop entrances, six-lesson versioned catalogue and export/storage boundary against current workshop tests.",
    "conclusion": "consistent",
    "reason": "The public entrance and v1.0.0 manifest agree; session-only fallback and draft exports preserve existing records. No learner completion or executed browser Python is inferred.",
    "references": [
      "src/components/WorkshopIndex.astro",
      "src/pages/teaching/modeling-workshop/index.astro",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "teaching-interface:modeling-workshop:zh-Hant",
    "fingerprint": "84194158c9497109cf58b02ee887c52569f9dc4051ff0c373770cf0bc0b8db54",
    "dependencies": {
      "manifest:modeling-workshop:shared": "bd2761e88bd85b2172aa4fd45ff8dd01a13f4ea5a0f71f506353c6b0574c55c8"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Existing paired workshop entrances, six-lesson versioned catalogue and export/storage boundary against current workshop tests.",
    "conclusion": "consistent",
    "reason": "The public entrance and v1.0.0 manifest agree; session-only fallback and draft exports preserve existing records. No learner completion or executed browser Python is inferred.",
    "references": [
      "src/components/WorkshopIndex.astro",
      "src/pages/zh/teaching/modeling-workshop/index.astro",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "teaching-source:math-studio-sampling:shared",
    "fingerprint": "679680402ae8b865357595dd0892276f40107dfd1d2c1802ae2bcb7ff5711336",
    "dependencies": {},
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Only classroom-relevant source presets, navigation, numerical reference, record format and runtime provenance; no general code-security or pedagogy validation.",
    "conclusion": "consistent",
    "reason": "Sampling presets match the actual G7 core and 36/40 group; grade-before-exploration is corrected. Mixing defaults, Euler 0.9/0.81, steady values, manual settings and reference-versus-learner execution are independently checked.",
    "references": [
      "docs/math-studio-g7-inquiry.md",
      "public/math-studio/app.js",
      "public/math-studio/inquiry-g7-content.js",
      "public/math-studio/inquiry-g7-core.js",
      "public/math-studio/inquiry-g7-ui.js",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "teaching-source:mixing-tank:shared",
    "fingerprint": "5df5490ab45418d01c93a9f9163639c248f4d94cc0bf3a17e0142a17ae6fe9dc",
    "dependencies": {
      "manifest:modeling-workshop:shared": "bd2761e88bd85b2172aa4fd45ff8dd01a13f4ea5a0f71f506353c6b0574c55c8"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Only classroom-relevant source presets, navigation, numerical reference, record format and runtime provenance; no general code-security or pedagogy validation.",
    "conclusion": "consistent",
    "reason": "Sampling presets match the actual G7 core and 36/40 group; grade-before-exploration is corrected. Mixing defaults, Euler 0.9/0.81, steady values, manual settings and reference-versus-learner execution are independently checked.",
    "references": [
      "public/resources/modeling-workshop/mixing-tank/baseline.csv",
      "public/resources/modeling-workshop/mixing-tank/exercise.json",
      "public/resources/modeling-workshop/mixing-tank/reference.ipynb",
      "public/resources/modeling-workshop/mixing-tank/reference.py",
      "public/resources/modeling-workshop/worker.mjs",
      "src/data/workshop-lessons.ts",
      "src/lib/workshop-state.mjs",
      "src/scripts/workshop-client.ts",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "teaching:macau-school-math-competition:en",
    "fingerprint": "85411068a55240e4bca8f9df90d84842d6c1466780b1871ca89b8527b0212048",
    "dependencies": {
      "manifest:macau-competition:shared": "8774a5679382b39ce52fd7786098d12cde528dc7d0b4f48a2edb1f34ebed6dbd"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Paired public teaching entrance copy and its declared release metadata/source boundary, not the mathematical correctness of the entire resource library.",
    "conclusion": "consistent",
    "reason": "Competition copy retains official papers as authoritative and independent companion status; lecture copy retains 27 units, paired public assets and private-source separation.",
    "references": [
      "src/content/teaching/macau-school-math-competition.mdx",
      "design/site-refresh/content-review/README.md"
    ]
  },
  {
    "key": "teaching:macau-school-math-competition:zh-Hant",
    "fingerprint": "fb6b74035d5f230d01100f1846021a745e860ad34d29fd0875fd847f26f6262f",
    "dependencies": {
      "manifest:macau-competition:shared": "8774a5679382b39ce52fd7786098d12cde528dc7d0b4f48a2edb1f34ebed6dbd"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Paired public teaching entrance copy and its declared release metadata/source boundary, not the mathematical correctness of the entire resource library.",
    "conclusion": "consistent",
    "reason": "Competition copy retains official papers as authoritative and independent companion status; lecture copy retains 27 units, paired public assets and private-source separation.",
    "references": [
      "src/content/teaching-zh/macau-school-math-competition.mdx",
      "design/site-refresh/content-review/README.md"
    ]
  },
  {
    "key": "teaching:mathematical-modeling-lecture-programme:en",
    "fingerprint": "f78c1aa1bdab8d3489857b941fee343752383cc888312560bd3ae43b9975a005",
    "dependencies": {
      "manifest:lecture-materials:shared": "b5290d68971a370ab07ec1054883d4b1d0454914af6ded883387966bf8b2f5c9"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Paired public teaching entrance copy and its declared release metadata/source boundary, not the mathematical correctness of the entire resource library.",
    "conclusion": "consistent",
    "reason": "Competition copy retains official papers as authoritative and independent companion status; lecture copy retains 27 units, paired public assets and private-source separation.",
    "references": [
      "src/content/teaching/mathematical-modeling-lecture-programme.md",
      "design/site-refresh/content-review/README.md"
    ]
  },
  {
    "key": "teaching:mathematical-modeling-lecture-programme:zh-Hant",
    "fingerprint": "f6dcb4c3db9ff0f2d595d5a0aac4113545e1621625374409bfcc6d27dc0c5231",
    "dependencies": {
      "manifest:lecture-materials:shared": "b5290d68971a370ab07ec1054883d4b1d0454914af6ded883387966bf8b2f5c9"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Paired public teaching entrance copy and its declared release metadata/source boundary, not the mathematical correctness of the entire resource library.",
    "conclusion": "consistent",
    "reason": "Competition copy retains official papers as authoritative and independent companion status; lecture copy retains 27 units, paired public assets and private-source separation.",
    "references": [
      "src/content/teaching-zh/mathematical-modeling-lecture-programme.md",
      "design/site-refresh/content-review/README.md"
    ]
  },
  {
    "key": "translation-classroom-pack:mixing-tank:en-to-zh-Hant",
    "fingerprint": "53b0a90c13c07d90d2e93b18662b367cd27885a513d0d9eeb3fadd056f0e7025",
    "dependencies": {
      "classroom-pack:mixing-tank:en": "c038ae6a13ae0d2a40eaacda70ed9b78fc920abb5d7dc5038f19cf66a56d71c7",
      "classroom-pack:mixing-tank:zh-Hant": "20321d8addd947ad1351fc2cda8eb742abdfb6804850ed959ba2f17369f38ab4",
      "concept:validation:en": "0a3f8bdbb25d79b3d652237141dedbde6c9f91a330dfe07f612260ddbc649a3c",
      "concept:validation:zh-Hant": "721cf0ee2b31a465be17b703478f4cd8f5c89859ecf1ac316808b040e38a7db7",
      "manifest:modeling-workshop:shared": "bd2761e88bd85b2172aa4fd45ff8dd01a13f4ea5a0f71f506353c6b0574c55c8",
      "teaching-source:mixing-tank:shared": "5df5490ab45418d01c93a9f9163639c248f4d94cc0bf3a17e0142a17ae6fe9dc",
      "writing:modeling-workflow:en": "fed33a79d96aab3831ebe48d144c7570024363178abed20a77f49065ae7c2a08",
      "writing:modeling-workflow:zh-Hant": "d727c80b4810dd9af09e94f0d0c911ff130cf7aa3b45ff05f655c3e29142d1b9",
      "writing:what-must-a-traffic-model-remember:en": "839deef2d1712138c18ad428cad41261f9d1ea51da63f47739b465b96a8199da",
      "writing:what-must-a-traffic-model-remember:zh-Hant": "4550219d3f70be9bc6850b9abebfcbb0f961ace3a9708cb56411d8bebe52b54d",
      "writing:when-solar-power-changes-fast:en": "976fcd86fa4b3234f4c0afa48a3a4881dcc5df12558993b881a9451f0ca8a06f",
      "writing:when-solar-power-changes-fast:zh-Hant": "5102ed8a34c7f43b6e001647d61d682e2a645f0935ccb3c0baf5e10586731931",
      "writing:when-the-fit-is-not-the-model:en": "52649512d0cc66fb856dfd2c59dc900ff25bba90de3839df08d9095c744fe943",
      "writing:when-the-fit-is-not-the-model:zh-Hant": "f11041634753a25611e313696fdddf29b8a82034956a626d76d8762bf7c65539"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Directional consistency of the current paired short note or classroom pack, including numerical statements, limitations, actual tool language and source links.",
    "conclusion": "consistent",
    "reason": "Root and independent source audits compared both editions; shared IDs, scientific boundaries and learner/teacher roles correspond. This is not human approval of authorship.",
    "references": [
      "src/data/classroom-packs.mjs",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "translation-classroom-pack:mixing-tank:zh-Hant-to-en",
    "fingerprint": "a79d5b33b7fb7d515c82ee7317094b19f528abca9fbc290d41bb5c3a35a7cbe6",
    "dependencies": {
      "classroom-pack:mixing-tank:en": "c038ae6a13ae0d2a40eaacda70ed9b78fc920abb5d7dc5038f19cf66a56d71c7",
      "classroom-pack:mixing-tank:zh-Hant": "20321d8addd947ad1351fc2cda8eb742abdfb6804850ed959ba2f17369f38ab4",
      "concept:validation:en": "0a3f8bdbb25d79b3d652237141dedbde6c9f91a330dfe07f612260ddbc649a3c",
      "concept:validation:zh-Hant": "721cf0ee2b31a465be17b703478f4cd8f5c89859ecf1ac316808b040e38a7db7",
      "manifest:modeling-workshop:shared": "bd2761e88bd85b2172aa4fd45ff8dd01a13f4ea5a0f71f506353c6b0574c55c8",
      "teaching-source:mixing-tank:shared": "5df5490ab45418d01c93a9f9163639c248f4d94cc0bf3a17e0142a17ae6fe9dc",
      "writing:modeling-workflow:en": "fed33a79d96aab3831ebe48d144c7570024363178abed20a77f49065ae7c2a08",
      "writing:modeling-workflow:zh-Hant": "d727c80b4810dd9af09e94f0d0c911ff130cf7aa3b45ff05f655c3e29142d1b9",
      "writing:what-must-a-traffic-model-remember:en": "839deef2d1712138c18ad428cad41261f9d1ea51da63f47739b465b96a8199da",
      "writing:what-must-a-traffic-model-remember:zh-Hant": "4550219d3f70be9bc6850b9abebfcbb0f961ace3a9708cb56411d8bebe52b54d",
      "writing:when-solar-power-changes-fast:en": "976fcd86fa4b3234f4c0afa48a3a4881dcc5df12558993b881a9451f0ca8a06f",
      "writing:when-solar-power-changes-fast:zh-Hant": "5102ed8a34c7f43b6e001647d61d682e2a645f0935ccb3c0baf5e10586731931",
      "writing:when-the-fit-is-not-the-model:en": "52649512d0cc66fb856dfd2c59dc900ff25bba90de3839df08d9095c744fe943",
      "writing:when-the-fit-is-not-the-model:zh-Hant": "f11041634753a25611e313696fdddf29b8a82034956a626d76d8762bf7c65539"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Directional consistency of the current paired short note or classroom pack, including numerical statements, limitations, actual tool language and source links.",
    "conclusion": "consistent",
    "reason": "Root and independent source audits compared both editions; shared IDs, scientific boundaries and learner/teacher roles correspond. This is not human approval of authorship.",
    "references": [
      "src/data/classroom-packs.mjs",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "translation-classroom-pack:sampling-bias:en-to-zh-Hant",
    "fingerprint": "8ac68b5ef69659bb9e4e2bfe9eb76939384be9ecdc5e0a847c1dbec916f021f7",
    "dependencies": {
      "classroom-pack:sampling-bias:en": "e4bdc507f0271a626cd7b012318d20b5ea541bed47b70acb03568099daf64b64",
      "classroom-pack:sampling-bias:zh-Hant": "8d04062616a3f3313ee878828dbe8e1a19734527f231dfccc12c8b669b5c4b6a",
      "teaching-source:math-studio-sampling:shared": "679680402ae8b865357595dd0892276f40107dfd1d2c1802ae2bcb7ff5711336",
      "writing:modeling-workflow:en": "fed33a79d96aab3831ebe48d144c7570024363178abed20a77f49065ae7c2a08",
      "writing:modeling-workflow:zh-Hant": "d727c80b4810dd9af09e94f0d0c911ff130cf7aa3b45ff05f655c3e29142d1b9"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Directional consistency of the current paired short note or classroom pack, including numerical statements, limitations, actual tool language and source links.",
    "conclusion": "consistent",
    "reason": "Root and independent source audits compared both editions; shared IDs, scientific boundaries and learner/teacher roles correspond. This is not human approval of authorship.",
    "references": [
      "src/data/classroom-packs.mjs",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "translation-classroom-pack:sampling-bias:zh-Hant-to-en",
    "fingerprint": "11ddde99ddf2918a4db70bace5bd7de9c8380b4c5e108a8c25dcb7db5605ce29",
    "dependencies": {
      "classroom-pack:sampling-bias:en": "e4bdc507f0271a626cd7b012318d20b5ea541bed47b70acb03568099daf64b64",
      "classroom-pack:sampling-bias:zh-Hant": "8d04062616a3f3313ee878828dbe8e1a19734527f231dfccc12c8b669b5c4b6a",
      "teaching-source:math-studio-sampling:shared": "679680402ae8b865357595dd0892276f40107dfd1d2c1802ae2bcb7ff5711336",
      "writing:modeling-workflow:en": "fed33a79d96aab3831ebe48d144c7570024363178abed20a77f49065ae7c2a08",
      "writing:modeling-workflow:zh-Hant": "d727c80b4810dd9af09e94f0d0c911ff130cf7aa3b45ff05f655c3e29142d1b9"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Directional consistency of the current paired short note or classroom pack, including numerical statements, limitations, actual tool language and source links.",
    "conclusion": "consistent",
    "reason": "Root and independent source audits compared both editions; shared IDs, scientific boundaries and learner/teacher roles correspond. This is not human approval of authorship.",
    "references": [
      "src/data/classroom-packs.mjs",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "translation-writing:after-a-good-fit-what-to-measure:en-to-zh-Hant",
    "fingerprint": "e99f0b0f7daf816ba23e94ff35bb229a3e16584dd86e7504b363e3c6f8eca135",
    "dependencies": {
      "writing:after-a-good-fit-what-to-measure:en": "029feba1d063ac2bb31c7950c3cd6e1d97cbbb4bea0583f23eabce8da8afba63",
      "writing:after-a-good-fit-what-to-measure:zh-Hant": "e9a2c64136e1607b7f31aa7c660b2de31e0f9596ce75f01d1234c34c708d23a5",
      "writing:when-the-fit-is-not-the-model:en": "52649512d0cc66fb856dfd2c59dc900ff25bba90de3839df08d9095c744fe943",
      "writing:when-the-fit-is-not-the-model:zh-Hant": "f11041634753a25611e313696fdddf29b8a82034956a626d76d8762bf7c65539"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Directional consistency of the current paired short note or classroom pack, including numerical statements, limitations, actual tool language and source links.",
    "conclusion": "consistent",
    "reason": "Root and independent source audits compared both editions; shared IDs, scientific boundaries and learner/teacher roles correspond. This is not human approval of authorship.",
    "references": [
      "src/content/writing-zh/after-a-good-fit-what-to-measure.md",
      "src/content/writing/after-a-good-fit-what-to-measure.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "translation-writing:after-a-good-fit-what-to-measure:zh-Hant-to-en",
    "fingerprint": "a0da3bb5a45de90d6146342c9619e814dfa59d5aa1d7ed6bd628e7b76ffcb1f6",
    "dependencies": {
      "writing:after-a-good-fit-what-to-measure:en": "029feba1d063ac2bb31c7950c3cd6e1d97cbbb4bea0583f23eabce8da8afba63",
      "writing:after-a-good-fit-what-to-measure:zh-Hant": "e9a2c64136e1607b7f31aa7c660b2de31e0f9596ce75f01d1234c34c708d23a5",
      "writing:when-the-fit-is-not-the-model:en": "52649512d0cc66fb856dfd2c59dc900ff25bba90de3839df08d9095c744fe943",
      "writing:when-the-fit-is-not-the-model:zh-Hant": "f11041634753a25611e313696fdddf29b8a82034956a626d76d8762bf7c65539"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Directional consistency of the current paired short note or classroom pack, including numerical statements, limitations, actual tool language and source links.",
    "conclusion": "consistent",
    "reason": "Root and independent source audits compared both editions; shared IDs, scientific boundaries and learner/teacher roles correspond. This is not human approval of authorship.",
    "references": [
      "src/content/writing-zh/after-a-good-fit-what-to-measure.md",
      "src/content/writing/after-a-good-fit-what-to-measure.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "translation-writing:choose-the-question-before-the-score:en-to-zh-Hant",
    "fingerprint": "fe597c045caaa43f147959734ab5e216b0d4fffc84f4ae9b033b8caabd5a3042",
    "dependencies": {
      "writing:choose-the-question-before-the-score:en": "b2e65ccdc512f44560487f86da0a02588f08899b988e65aafa273be244cd97f3",
      "writing:choose-the-question-before-the-score:zh-Hant": "049133e9407a627f509214064d25227565737cd5b8744f0e8052d62ccf2e1b7e",
      "writing:when-a-traffic-solver-invents-a-jam:en": "d81121c984c4907ce8a3637eddf2fe43c3596896360a3a2d65cf58b6e3a391c3",
      "writing:when-a-traffic-solver-invents-a-jam:zh-Hant": "545b9fa6248375ed9fbe9075b87679c15a139d72e621feb65e4ee9cffa6386e2",
      "writing:when-solar-power-changes-fast:en": "976fcd86fa4b3234f4c0afa48a3a4881dcc5df12558993b881a9451f0ca8a06f",
      "writing:when-solar-power-changes-fast:zh-Hant": "5102ed8a34c7f43b6e001647d61d682e2a645f0935ccb3c0baf5e10586731931"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Directional consistency of the current paired short note or classroom pack, including numerical statements, limitations, actual tool language and source links.",
    "conclusion": "consistent",
    "reason": "Root and independent source audits compared both editions; shared IDs, scientific boundaries and learner/teacher roles correspond. This is not human approval of authorship.",
    "references": [
      "src/content/writing-zh/choose-the-question-before-the-score.md",
      "src/content/writing/choose-the-question-before-the-score.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "translation-writing:choose-the-question-before-the-score:zh-Hant-to-en",
    "fingerprint": "7998a4d4991c1b90716d723cc12e95b88ebb81c5aa6fe63c776b94bda4edb95d",
    "dependencies": {
      "writing:choose-the-question-before-the-score:en": "b2e65ccdc512f44560487f86da0a02588f08899b988e65aafa273be244cd97f3",
      "writing:choose-the-question-before-the-score:zh-Hant": "049133e9407a627f509214064d25227565737cd5b8744f0e8052d62ccf2e1b7e",
      "writing:when-a-traffic-solver-invents-a-jam:en": "d81121c984c4907ce8a3637eddf2fe43c3596896360a3a2d65cf58b6e3a391c3",
      "writing:when-a-traffic-solver-invents-a-jam:zh-Hant": "545b9fa6248375ed9fbe9075b87679c15a139d72e621feb65e4ee9cffa6386e2",
      "writing:when-solar-power-changes-fast:en": "976fcd86fa4b3234f4c0afa48a3a4881dcc5df12558993b881a9451f0ca8a06f",
      "writing:when-solar-power-changes-fast:zh-Hant": "5102ed8a34c7f43b6e001647d61d682e2a645f0935ccb3c0baf5e10586731931"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Directional consistency of the current paired short note or classroom pack, including numerical statements, limitations, actual tool language and source links.",
    "conclusion": "consistent",
    "reason": "Root and independent source audits compared both editions; shared IDs, scientific boundaries and learner/teacher roles correspond. This is not human approval of authorship.",
    "references": [
      "src/content/writing-zh/choose-the-question-before-the-score.md",
      "src/content/writing/choose-the-question-before-the-score.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "translation-writing:keep-the-result-that-changes-the-question:en-to-zh-Hant",
    "fingerprint": "fa998a9e423bbeb0c9b88fbadd762b7475a5bda49b0eb8c542fb49c3b938bb77",
    "dependencies": {
      "writing:how-many-equilibria-did-the-optimizer-miss:en": "d187c0b8280bab4c0f5d1317d4133b9e2f48ec189050496d8ce6c6c9c3142063",
      "writing:how-many-equilibria-did-the-optimizer-miss:zh-Hant": "609050f056dcdc7ce464063ceb785cccf531460a661d69ebd2b1e47846ae0c76",
      "writing:keep-the-result-that-changes-the-question:en": "1c8952d437c63c6e463d677f9b39fd07223cbb1898420efeaaf505e39ac7e2d5",
      "writing:keep-the-result-that-changes-the-question:zh-Hant": "b74466280d15347ea02a22a13f95cc05752f0b52a86a111f9e7fdb83554eba62",
      "writing:when-a-reduced-ventilation-model-leaves-its-training-regime:en": "12864d6e14a6a04c01bac5f5a12c01859f79c86c59e527173c52c8628fc25664",
      "writing:when-a-reduced-ventilation-model-leaves-its-training-regime:zh-Hant": "c1675126922600e6c7536ac0143548840459bb150114e92f5cb131daa595b03c"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Directional consistency of the current paired short note or classroom pack, including numerical statements, limitations, actual tool language and source links.",
    "conclusion": "consistent",
    "reason": "Root and independent source audits compared both editions; shared IDs, scientific boundaries and learner/teacher roles correspond. This is not human approval of authorship.",
    "references": [
      "src/content/writing-zh/keep-the-result-that-changes-the-question.md",
      "src/content/writing/keep-the-result-that-changes-the-question.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "translation-writing:keep-the-result-that-changes-the-question:zh-Hant-to-en",
    "fingerprint": "0b4450ec2a6b67636a5621fc7e9a01a6da84e25bc9936359210c5c501cc48ede",
    "dependencies": {
      "writing:how-many-equilibria-did-the-optimizer-miss:en": "d187c0b8280bab4c0f5d1317d4133b9e2f48ec189050496d8ce6c6c9c3142063",
      "writing:how-many-equilibria-did-the-optimizer-miss:zh-Hant": "609050f056dcdc7ce464063ceb785cccf531460a661d69ebd2b1e47846ae0c76",
      "writing:keep-the-result-that-changes-the-question:en": "1c8952d437c63c6e463d677f9b39fd07223cbb1898420efeaaf505e39ac7e2d5",
      "writing:keep-the-result-that-changes-the-question:zh-Hant": "b74466280d15347ea02a22a13f95cc05752f0b52a86a111f9e7fdb83554eba62",
      "writing:when-a-reduced-ventilation-model-leaves-its-training-regime:en": "12864d6e14a6a04c01bac5f5a12c01859f79c86c59e527173c52c8628fc25664",
      "writing:when-a-reduced-ventilation-model-leaves-its-training-regime:zh-Hant": "c1675126922600e6c7536ac0143548840459bb150114e92f5cb131daa595b03c"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Directional consistency of the current paired short note or classroom pack, including numerical statements, limitations, actual tool language and source links.",
    "conclusion": "consistent",
    "reason": "Root and independent source audits compared both editions; shared IDs, scientific boundaries and learner/teacher roles correspond. This is not human approval of authorship.",
    "references": [
      "src/content/writing-zh/keep-the-result-that-changes-the-question.md",
      "src/content/writing/keep-the-result-that-changes-the-question.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "writing:after-a-good-fit-what-to-measure:en",
    "fingerprint": "029feba1d063ac2bb31c7950c3cd6e1d97cbbb4bea0583f23eabce8da8afba63",
    "dependencies": {
      "writing:when-the-fit-is-not-the-model:en": "52649512d0cc66fb856dfd2c59dc900ff25bba90de3839df08d9095c744fe943"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Three short bilingual notes directly compared with their linked public research articles and explicit interpretation limits.",
    "conclusion": "consistent",
    "reason": "Finite-grid diagnostics are not confidence or structural proofs; later fold verification does not rewrite coverage; nominal ROM failure, event error and absolute solar reliability failures remain visible.",
    "references": [
      "src/content/writing/after-a-good-fit-what-to-measure.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "writing:after-a-good-fit-what-to-measure:zh-Hant",
    "fingerprint": "e9a2c64136e1607b7f31aa7c660b2de31e0f9596ce75f01d1234c34c708d23a5",
    "dependencies": {
      "writing:when-the-fit-is-not-the-model:zh-Hant": "f11041634753a25611e313696fdddf29b8a82034956a626d76d8762bf7c65539"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Three short bilingual notes directly compared with their linked public research articles and explicit interpretation limits.",
    "conclusion": "consistent",
    "reason": "Finite-grid diagnostics are not confidence or structural proofs; later fold verification does not rewrite coverage; nominal ROM failure, event error and absolute solar reliability failures remain visible.",
    "references": [
      "src/content/writing-zh/after-a-good-fit-what-to-measure.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "writing:choose-the-question-before-the-score:en",
    "fingerprint": "b2e65ccdc512f44560487f86da0a02588f08899b988e65aafa273be244cd97f3",
    "dependencies": {
      "writing:when-a-traffic-solver-invents-a-jam:en": "d81121c984c4907ce8a3637eddf2fe43c3596896360a3a2d65cf58b6e3a391c3",
      "writing:when-solar-power-changes-fast:en": "976fcd86fa4b3234f4c0afa48a3a4881dcc5df12558993b881a9451f0ca8a06f"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Three short bilingual notes directly compared with their linked public research articles and explicit interpretation limits.",
    "conclusion": "consistent",
    "reason": "Finite-grid diagnostics are not confidence or structural proofs; later fold verification does not rewrite coverage; nominal ROM failure, event error and absolute solar reliability failures remain visible.",
    "references": [
      "src/content/writing/choose-the-question-before-the-score.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "writing:choose-the-question-before-the-score:zh-Hant",
    "fingerprint": "049133e9407a627f509214064d25227565737cd5b8744f0e8052d62ccf2e1b7e",
    "dependencies": {
      "writing:when-a-traffic-solver-invents-a-jam:zh-Hant": "545b9fa6248375ed9fbe9075b87679c15a139d72e621feb65e4ee9cffa6386e2",
      "writing:when-solar-power-changes-fast:zh-Hant": "5102ed8a34c7f43b6e001647d61d682e2a645f0935ccb3c0baf5e10586731931"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Three short bilingual notes directly compared with their linked public research articles and explicit interpretation limits.",
    "conclusion": "consistent",
    "reason": "Finite-grid diagnostics are not confidence or structural proofs; later fold verification does not rewrite coverage; nominal ROM failure, event error and absolute solar reliability failures remain visible.",
    "references": [
      "src/content/writing-zh/choose-the-question-before-the-score.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "writing:keep-the-result-that-changes-the-question:en",
    "fingerprint": "1c8952d437c63c6e463d677f9b39fd07223cbb1898420efeaaf505e39ac7e2d5",
    "dependencies": {
      "writing:how-many-equilibria-did-the-optimizer-miss:en": "d187c0b8280bab4c0f5d1317d4133b9e2f48ec189050496d8ce6c6c9c3142063",
      "writing:when-a-reduced-ventilation-model-leaves-its-training-regime:en": "12864d6e14a6a04c01bac5f5a12c01859f79c86c59e527173c52c8628fc25664"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Three short bilingual notes directly compared with their linked public research articles and explicit interpretation limits.",
    "conclusion": "consistent",
    "reason": "Finite-grid diagnostics are not confidence or structural proofs; later fold verification does not rewrite coverage; nominal ROM failure, event error and absolute solar reliability failures remain visible.",
    "references": [
      "src/content/writing/keep-the-result-that-changes-the-question.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "writing:keep-the-result-that-changes-the-question:zh-Hant",
    "fingerprint": "b74466280d15347ea02a22a13f95cc05752f0b52a86a111f9e7fdb83554eba62",
    "dependencies": {
      "writing:how-many-equilibria-did-the-optimizer-miss:zh-Hant": "609050f056dcdc7ce464063ceb785cccf531460a661d69ebd2b1e47846ae0c76",
      "writing:when-a-reduced-ventilation-model-leaves-its-training-regime:zh-Hant": "c1675126922600e6c7536ac0143548840459bb150114e92f5cb131daa595b03c"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Three short bilingual notes directly compared with their linked public research articles and explicit interpretation limits.",
    "conclusion": "consistent",
    "reason": "Finite-grid diagnostics are not confidence or structural proofs; later fold verification does not rewrite coverage; nominal ROM failure, event error and absolute solar reliability failures remain visible.",
    "references": [
      "src/content/writing-zh/keep-the-result-that-changes-the-question.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "manifest:lecture-materials:shared",
    "fingerprint": "0d3cf9cb3b99e5b08d0d92a07bce243e220f34a18175b241134ffd9b5d403e46",
    "dependencies": {},
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Explicit recheck of the current public snapshot provenance and dependent entrance metadata after this local fallback build.",
    "conclusion": "consistent",
    "reason": "Exact parsed-JSON comparison against HEAD proves the only change is source provenance from the sibling private release to the committed public snapshot. Versions, allowlists, bytes, hashes, licences and editorial source-of-truth fields are identical; existing asset gates pass. This does not inspect private files or confirm upstream freshness.",
    "references": [
      "public/resources/mathematical-modeling-lecture-materials/managed-assets.json",
      "public/resources/mathematical-modeling-lecture-materials/manifest.json",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "manifest:macau-competition:shared",
    "fingerprint": "3097ca05159cc84b5ce63e8d8c626b50c643225a4595894392bbc492f1bf221e",
    "dependencies": {},
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Explicit recheck of the current public snapshot provenance and dependent entrance metadata after this local fallback build.",
    "conclusion": "consistent",
    "reason": "Exact parsed-JSON comparison against HEAD proves the only change is source provenance from the sibling private release to the committed public snapshot. Versions, allowlists, bytes, hashes, licences and editorial source-of-truth fields are identical; existing asset gates pass. This does not inspect private files or confirm upstream freshness.",
    "references": [
      "public/resources/macau-school-math-competition-2019-2026/managed-assets.json",
      "public/resources/macau-school-math-competition-2019-2026/manifest.json",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "teaching:mathematical-modeling-lecture-programme:en",
    "fingerprint": "f78c1aa1bdab8d3489857b941fee343752383cc888312560bd3ae43b9975a005",
    "dependencies": {
      "manifest:lecture-materials:shared": "0d3cf9cb3b99e5b08d0d92a07bce243e220f34a18175b241134ffd9b5d403e46"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Explicit recheck of the current public snapshot provenance and dependent entrance metadata after this local fallback build.",
    "conclusion": "consistent",
    "reason": "Exact parsed-JSON comparison against HEAD proves the only change is source provenance from the sibling private release to the committed public snapshot. Versions, allowlists, bytes, hashes, licences and editorial source-of-truth fields are identical; existing asset gates pass. This does not inspect private files or confirm upstream freshness.",
    "references": [
      "src/content/teaching/mathematical-modeling-lecture-programme.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "teaching:mathematical-modeling-lecture-programme:zh-Hant",
    "fingerprint": "f6dcb4c3db9ff0f2d595d5a0aac4113545e1621625374409bfcc6d27dc0c5231",
    "dependencies": {
      "manifest:lecture-materials:shared": "0d3cf9cb3b99e5b08d0d92a07bce243e220f34a18175b241134ffd9b5d403e46"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Explicit recheck of the current public snapshot provenance and dependent entrance metadata after this local fallback build.",
    "conclusion": "consistent",
    "reason": "Exact parsed-JSON comparison against HEAD proves the only change is source provenance from the sibling private release to the committed public snapshot. Versions, allowlists, bytes, hashes, licences and editorial source-of-truth fields are identical; existing asset gates pass. This does not inspect private files or confirm upstream freshness.",
    "references": [
      "src/content/teaching-zh/mathematical-modeling-lecture-programme.md",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "teaching:macau-school-math-competition:en",
    "fingerprint": "85411068a55240e4bca8f9df90d84842d6c1466780b1871ca89b8527b0212048",
    "dependencies": {
      "manifest:macau-competition:shared": "3097ca05159cc84b5ce63e8d8c626b50c643225a4595894392bbc492f1bf221e"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Explicit recheck of the current public snapshot provenance and dependent entrance metadata after this local fallback build.",
    "conclusion": "consistent",
    "reason": "Exact parsed-JSON comparison against HEAD proves the only change is source provenance from the sibling private release to the committed public snapshot. Versions, allowlists, bytes, hashes, licences and editorial source-of-truth fields are identical; existing asset gates pass. This does not inspect private files or confirm upstream freshness.",
    "references": [
      "src/content/teaching/macau-school-math-competition.mdx",
      "design/site-refresh/authoring-batch.md"
    ]
  },
  {
    "key": "teaching:macau-school-math-competition:zh-Hant",
    "fingerprint": "fb6b74035d5f230d01100f1846021a745e860ad34d29fd0875fd847f26f6262f",
    "dependencies": {
      "manifest:macau-competition:shared": "3097ca05159cc84b5ce63e8d8c626b50c643225a4595894392bbc492f1bf221e"
    },
    "reviewedAt": "2026-10-11",
    "reviewedBy": "Codex source audit",
    "scope": "Explicit recheck of the current public snapshot provenance and dependent entrance metadata after this local fallback build.",
    "conclusion": "consistent",
    "reason": "Exact parsed-JSON comparison against HEAD proves the only change is source provenance from the sibling private release to the committed public snapshot. Versions, allowlists, bytes, hashes, licences and editorial source-of-truth fields are identical; existing asset gates pass. This does not inspect private files or confirm upstream freshness.",
    "references": [
      "src/content/teaching-zh/macau-school-math-competition.mdx",
      "design/site-refresh/authoring-batch.md"
    ]
  }
]
/* CONTENT_REVIEW_RECEIPTS_END */;

export const CONTENT_REVIEW_REGISTRY = {
  version:1, nodes:editorialReviewNodes(), notes:NOTE_REVIEW_DEPENDENCIES,
  managed:MANAGED_REVIEW_SOURCES, milestones:MILESTONES, receipts:REVIEW_RECEIPTS
};
