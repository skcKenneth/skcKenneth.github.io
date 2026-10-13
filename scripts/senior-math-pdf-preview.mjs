// @ts-nocheck -- Optional host-provided PDF.js and canvas dependencies.
import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const require=createRequire(process.env.PLAYWRIGHT_RUNTIME||'C:/Users/kenneth/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {createCanvas,DOMMatrix,Path2D,ImageData}=require('@napi-rs/canvas');
Object.assign(globalThis,{DOMMatrix,Path2D,ImageData});
const {getDocument}=await import(pathToFileURL(require.resolve('pdfjs-dist/legacy/build/pdf.mjs')).href);
const output=resolve(dirname(fileURLToPath(import.meta.url)),'../.tmp/senior-math-v2/browser-qa');
for(const [name,numbers] of [['long-proof-teacher',[1,2]],['long-proof-teacher-zh',[1,2]],['student-worksheet',[1]],['probability-simulation',[3,4]]]){
 const doc=await getDocument({data:new Uint8Array(await readFile(resolve(output,name+'.pdf'))),useSystemFonts:true,disableFontFace:true}).promise;
 for(const number of numbers){const page=await doc.getPage(number),viewport=page.getViewport({scale:1.35}),canvas=createCanvas(Math.ceil(viewport.width),Math.ceil(viewport.height));await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;await writeFile(resolve(output,name+'-page-'+number+'.png'),canvas.toBuffer('image/png'));console.log(name+' page '+number+' rendered');}
 await doc.destroy();
}
