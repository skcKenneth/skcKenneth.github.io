// Only a user-triggered startup fetches the pinned scientific runtime.
const PYODIDE_BASE='https://cdn.jsdelivr.net/pyodide/v314.0.6/full/';
let runtime;
let output='';
async function initialize() {
  if(!runtime)runtime=(async()=>{
    const {loadPyodide}=await import(PYODIDE_BASE+'pyodide.mjs');
    const py=await loadPyodide({indexURL:PYODIDE_BASE,stdout:s=>{if(output.length<20000)output+=s+'\n';},stderr:s=>{if(output.length<20000)output+=s+'\n';}});
    await py.loadPackage(['numpy','scipy','matplotlib']);
    return py;
  })();
  return runtime;
}
self.onmessage=async({data})=>{
  const {id,type}=data;
  try{
    const py=await initialize();
    if(type==='init'){self.postMessage({id,type:'ready'});return;}
    if(type!=='run')return;
    output='';
    const ns=py.globals.get('dict')();
    try{
      const setup='\nLESSON = '+JSON.stringify(data.slug)+'\nPARAMS = json.loads('+JSON.stringify(JSON.stringify(data.params))+')\nSEED = '+data.seed+'\n';
      await py.runPythonAsync(data.core+setup+data.code,{globals:ns});
      const serialized=await py.runPythonAsync('json.dumps(result, allow_nan=False)',{globals:ns});
      self.postMessage({id,type:'result',result:JSON.parse(serialized),stdout:output});
    }finally{ns.destroy();}
  }catch(error){self.postMessage({id,type:'error',message:String(error),stdout:output});}
};
