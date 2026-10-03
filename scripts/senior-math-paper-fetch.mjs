import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// URLs were discovered on official university indexes/search results and verified
// on 2026-10-03. This is a fixed historical manifest, not filename inference.
export const officialPaperSources = [
  [2021,'JM01','https://www.must.edu.mo/images/JAE/JEX2021_%E6%95%B8%E5%AD%B8%E6%AD%A3%E5%8D%B7.pdf'],
  [2021,'JM02','https://www.must.edu.mo/images/JAE/JEX2021_%E6%95%B8%E5%AD%B8%E9%99%84%E5%8A%A0%E5%8D%B7.pdf'],
  [2022,'JM01','https://www.must.edu.mo/images/JAE/JEX2022_%E6%95%B8%E5%AD%B8%E6%AD%A3%E5%8D%B7.pdf'],
  [2022,'JM02','https://www.must.edu.mo/images/JAE/JEX2022_%E6%95%B8%E5%AD%B8%E9%99%84%E5%8A%A0%E5%8D%B7.pdf'],
  [2023,'JM01','https://www.must.edu.mo/images/JAE/JEX2023_%E6%95%B8%E5%AD%B8%E6%AD%A3%E5%8D%B7.pdf'],
  [2023,'JM02','https://www.must.edu.mo/images/JAE/JEX2023_%E6%95%B8%E5%AD%B8%E9%99%84%E5%8A%A0%E5%8D%B7.pdf'],
  [2024,'JM01','https://www.utm.edu.mo/admission/filemanager/en/content_94/JM01%202024%20%20exam%20paper%20and%20suggested%20answers.pdf'],
  [2024,'JM02','https://www.utm.edu.mo/admission/filemanager/en/content_94/JM02%202024%20%20exam%20paper%20and%20suggested%20answers.pdf'],
  [2025,'JM01','https://www.utm.edu.mo/admission/filemanager/en/content_94/JM01%202025%20exam%20paper%20and%20suggested%20answers.pdf'],
  [2025,'JM02','https://www.utm.edu.mo/admission/filemanager/en/content_94/JM02%202025%20exam%20paper%20and%20suggested%20answers.pdf'],
  [2026,'JM01','https://www.utm.edu.mo/admission/filemanager/en/content_94/JM01%202026%20exam%20paper%20and%20suggested%20answers.pdf'],
  [2026,'JM02','https://www.utm.edu.mo/admission/filemanager/en/content_94/JM02%202026%20exam%20paper%20and%20suggested%20answers.pdf'],
].map(([year,code,url])=>({id:`${code.toLowerCase()}-${year}`,year,code,url}));

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const dir=path.resolve('.tmp/senior-math/papers');
  await mkdir(dir,{recursive:true});
  const records=[];
  for (const source of officialPaperSources) {
    const file=path.join(dir,`${source.id}.pdf`);
    let bytes;
    try { bytes=await readFile(file); } catch {
      const response=await fetch(source.url);
      if(!response.ok)throw new Error(`${source.id}: HTTP ${response.status}`);
      bytes=Buffer.from(await response.arrayBuffer());
      if(bytes.subarray(0,5).toString()!=='%PDF-')throw new Error(`${source.id}: not PDF`);
      await writeFile(file,bytes);
    }
    const record={...source,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),verified:'2026-10-03'};
    records.push(record);
    console.log(`${source.id}: ${bytes.length} bytes, ${record.sha256}`);
  }
  await writeFile(path.join(dir,'manifest.json'),JSON.stringify(records,null,2)+'\n');
}
