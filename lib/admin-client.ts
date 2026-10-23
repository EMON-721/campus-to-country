import {uploadFetch} from './upload-client';
// Refresh expired administrator sessions once; never retry validation or provider errors.
let refreshing:Promise<boolean>|null=null;
export async function adminFetch(path:string,init:RequestInit={}){const send=()=>uploadFetch(path,{...init,credentials:'same-origin',cache:'no-store',signal:init.signal||AbortSignal.timeout(35000)});let response=await send();if(response.status===401){if(!refreshing)refreshing=fetch('/api/v1/auth/refresh',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(15000)}).then(r=>r.ok).catch(()=>false).finally(()=>{refreshing=null});if(await refreshing)response=await send()}return response;}
