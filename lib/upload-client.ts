const uploadTargets=new Set(['/api/v1/site-assets','/api/v1/notice-image','/api/v1/workspace/documents','/api/v1/bank/documents','/api/v1/premium/media','/api/v1/mentorship/media']);
// Calls the same endpoint for final validation and publication; bytes go directly
// to private Supabase Storage so Vercel's request size limit is not exceeded.
export async function uploadFetch(input:RequestInfo|URL,init:RequestInit={}):Promise<Response>{
 const path=typeof input==='string'?input:input instanceof URL?input.pathname:input.url;
 if(!(init.body instanceof FormData)||!uploadTargets.has(path)||init.method?.toUpperCase()!=='POST')return fetch(input,init);
 const file=init.body.get('file');if(!(file instanceof File))return fetch(input,init);
 const headers=new Headers(init.headers);headers.delete('Content-Type');headers.set('Content-Type','application/json');
 const ticket=await fetch('/api/v1/uploads',{...init,headers,body:JSON.stringify({target:path,name:file.name,mime:file.type,size:file.size})});if(!ticket.ok)return ticket;
 const data=await ticket.json() as {uploadId:string;url:string};
 const direct=await fetch(data.url,{method:'PUT',headers:{'Content-Type':file.type||'application/octet-stream'},body:file,signal:init.signal});
 if(!direct.ok)return Response.json({error:'File upload failed. Choose the file and retry.'},{status:502});
 const fields:Record<string,string>={};for(const [key,value] of init.body.entries())if(typeof value==='string')fields[key]=value;
 return fetch(input,{...init,headers,body:JSON.stringify({uploadId:data.uploadId,fields})});
}
