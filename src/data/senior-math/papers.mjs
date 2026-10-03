import { L } from './authoring.mjs';
import { paperSourceManifest } from './paper-source-manifest.mjs';
import { jm01_2026,jm01_2026_inventory } from './paper-jm01-2026.mjs';
import { jm02_2026,jm02_2026_inventory } from './paper-jm02-2026.mjs';
import { jm01_2025,jm01_2025_inventory } from './paper-jm01-2025.mjs';
import { jm02_2025,jm02_2025_inventory } from './paper-jm02-2025.mjs';
import { jm01_2024,jm01_2024_inventory } from './paper-jm01-2024.mjs';
import { jm02_2024,jm02_2024_inventory } from './paper-jm02-2024.mjs';
import { jm01_2023,jm01_2023_inventory } from './paper-jm01-2023.mjs';
import { jm02_2023,jm02_2023_inventory } from './paper-jm02-2023.mjs';
import { jm01_2022,jm01_2022_inventory } from './paper-jm01-2022.mjs';
import { jm02_2022,jm02_2022_inventory } from './paper-jm02-2022.mjs';
import { jm01_2021,jm01_2021_inventory } from './paper-jm01-2021.mjs';
import { jm02_2021,jm02_2021_inventory } from './paper-jm02-2021.mjs';
const authored={
  'jm01-2026':{questions:jm01_2026,inventory:jm01_2026_inventory,status:'complete'},
  'jm02-2026':{questions:jm02_2026,inventory:jm02_2026_inventory,status:'complete'},
  'jm01-2025':{questions:jm01_2025,inventory:jm01_2025_inventory,status:'complete'},
  'jm02-2025':{questions:jm02_2025,inventory:jm02_2025_inventory,status:'complete'},
  'jm01-2024':{questions:jm01_2024,inventory:jm01_2024_inventory,status:'complete'},
  'jm02-2024':{questions:jm02_2024,inventory:jm02_2024_inventory,status:'complete'},
  'jm01-2023':{questions:jm01_2023,inventory:jm01_2023_inventory,status:'complete'},
  'jm02-2023':{questions:jm02_2023,inventory:jm02_2023_inventory,status:'complete'},
  'jm01-2022':{questions:jm01_2022,inventory:jm01_2022_inventory,status:'complete'},
  'jm02-2022':{questions:jm02_2022,inventory:jm02_2022_inventory,status:'complete'},
  'jm01-2021':{questions:jm01_2021,inventory:jm01_2021_inventory,status:'complete'},
  'jm02-2021':{questions:jm02_2021,inventory:jm02_2021_inventory,status:'complete'},
};
export const examPapers=paperSourceManifest.map(p=>({
  ...p,
  source:L('Joint Admission Examination — official university paper and suggested answers','澳門四高校聯合入學考試：高校官方試題及參考答案'),
  title:L(`${p.year} ${p.code} ${p.code==='JM01'?'Standard paper':'Supplementary paper'}`,`${p.year} ${p.code} ${p.code==='JM01'?'數學正卷':'數學附加卷'}`),
  status:'authoring',questions:[],
  ...(authored[p.id]||{}),
})).sort((a,b)=>b.year-a.year||a.code.localeCompare(b.code));
