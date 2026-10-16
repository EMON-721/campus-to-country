// Refresh only after an authentication rejection, never after a Google failure.
let refreshing:Promise<boolean>|null=null;
export async function assistantRequest(path:string,init:RequestInit={}){
 const send=()=>fetch(path,{...init,credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(35000)});
 let response=await send();
 if(response.status===401){
  if(!refreshing)refreshing=fetch('/api/v1/auth/refresh',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(15000)}).then(r=>r.ok).catch(()=>false).finally(()=>{refreshing=null});
  if(await refreshing)response=await send();
 }
 const data:any=await response.json().catch(()=>({error:'The server returned an unreadable response. Reload and retry.'}));
 if(!response.ok){const error=new Error(response.status===401?'Sign in to Campus to Country to use AI chat. Your saved Gemini key does not need to be entered again.':data.error||'Assistant request failed');Object.assign(error,{status:response.status});throw error}
 return data;
}
