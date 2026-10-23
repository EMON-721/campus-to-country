import {database,objects} from '@/lib/server-runtime';
import {identity,APIError} from '@/lib/backend';
// Multipart remains supported for small API clients. The browser sends large bytes
// directly to private Storage, then completes the original authorized handler.
export async function uploadForm(req:Request){
 if(!req.headers.get('content-type')?.includes('application/json')){const {readUpload}=await import('@/lib/public-content-assets');const body=await readUpload(req,26*1024*1024);return new Request(req.url,{method:'POST',headers:req.headers,body}).formData()}
 if(!database||!objects)throw new APIError(503,'Upload storage is not configured');
 const {user}=await identity(),input=await req.json() as {uploadId?:string;fields?:Record<string,string>};
 if(!input.uploadId||!/^[a-f0-9-]{36}$/i.test(input.uploadId))throw new APIError(400,'Invalid upload ticket');
 const row=await database.prepare("DELETE FROM platform_content WHERE id=? AND kind='upload-ticket' AND json_extract(body,'$.actor')=? AND json_extract(body,'$.target')=? AND json_extract(body,'$.expires')>? RETURNING body").bind(input.uploadId,user.id,new URL(req.url).pathname,Date.now()).first<{body:string}>();
 if(!row)throw new APIError(409,'Upload expired or already completed. Choose the file again');
 const ticket=JSON.parse(row.body),file=await objects.get(ticket.key);if(!file)throw new APIError(400,'Upload the file before completing it');
 try{
  if(file.size&&file.size!==ticket.size)throw new APIError(400,'Uploaded file size changed');
  const reader=file.body?.getReader();if(!reader)throw new APIError(400,'Empty upload');const chunks:Uint8Array[]=[];let size=0;
  for(;;){const next=await reader.read();if(next.done)break;size+=next.value.length;if(size>ticket.size){await reader.cancel();throw new APIError(413,'Uploaded file exceeds its declared size')}chunks.push(next.value)}
  if(size!==ticket.size)throw new APIError(400,'Uploaded file is incomplete');
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
  const form=new FormData();for(const [key,value] of Object.entries(input.fields||{})){if(key!=='file'&&typeof value==='string')form.set(key,value)}form.set('file',new File([bytes],ticket.name,{type:ticket.mime}));return form;
 }finally{await objects.delete(ticket.key)}
}
