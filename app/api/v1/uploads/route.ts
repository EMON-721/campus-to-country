import {database,objects} from '@/lib/server-runtime';
import {identity,admin,documentIdentity,sameOrigin,failure,APIError} from '@/lib/backend';
export const dynamic='force-dynamic';
const targets:Record<string,number>={'/api/v1/site-assets':12,'/api/v1/notice-image':5,'/api/v1/workspace/documents':10,'/api/v1/bank/documents':10,'/api/v1/premium/media':25,'/api/v1/mentorship/media':25};
export async function POST(req:Request){try{
 sameOrigin(req);if(!database||!objects)throw new APIError(503,'Configure the database and private Storage bucket');
 const b=await req.json() as {target:string;name:string;mime:string;size:number};if(!Object.hasOwn(targets,b.target)||typeof b.name!=='string'||!b.name.trim()||b.name.length>250||typeof b.mime!=='string'||b.mime.length>200||!Number.isSafeInteger(b.size)||b.size<1||b.size>targets[b.target]*1024*1024)throw new APIError(400,'Choose a supported file within this editor’s upload limit');
 const {user}=b.target==='/api/v1/workspace/documents'?await documentIdentity(req):b.target==='/api/v1/bank/documents'?await identity():await admin();
 // A support administrator's ticket is attached to their authenticated actor.
 const actor=(await identity()).user.id,stamp=Math.floor(Date.now()/60000);
 const allowed=await database.prepare('INSERT INTO limits(id,stamp,count) VALUES(?,?,1) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN stamp<>? THEN 1 ELSE count+1 END,stamp=? WHERE stamp<>? OR count<20 RETURNING count').bind('upload-ticket:'+actor,stamp,stamp,stamp,stamp).first();if(!allowed)throw new APIError(429,'Wait a minute before uploading more files');
 const stale=(await database.prepare("SELECT id,body FROM platform_content WHERE kind='upload-ticket' AND json_extract(body,'$.expires')<? LIMIT 25").bind(Date.now()).all<{id:string;body:string}>()).results;for(const row of stale){await objects.delete(JSON.parse(row.body).key);await database.prepare("DELETE FROM platform_content WHERE id=? AND kind='upload-ticket'").bind(row.id).run()}
 const id=crypto.randomUUID(),key='staging/'+actor+'/'+id,m={actor,owner:user.id,target:b.target,key,name:b.name,mime:b.mime,size:b.size,expires:Date.now()+15*60000};const url=await objects.signedUpload(key);
 await database.prepare("INSERT INTO platform_content(id,kind,title,body,status,updated) VALUES(?,'upload-ticket',?,?,'private',?)").bind(id,b.name,JSON.stringify(m),new Date().toISOString()).run();return Response.json({uploadId:id,url},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return failure(e)}}
