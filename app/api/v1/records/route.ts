import {currentJourneyEvents} from '@/lib/workspace-calendar-projection';
import {validateWorkspaceLinks,validateRecordDeletion} from '@/lib/workspace-record-links';
import {identity,provider,sameOrigin,failure,APIError} from "@/lib/backend";
import {env} from 'cloudflare:workers';
import {validate} from "@/lib/domain";
export const dynamic="force-dynamic";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function GET(){try{const {user,token}=await identity();const rows=await provider("/rest/v1/ctc_records?owner_id=eq."+user.id+"&order=created_at.desc&limit=2000","GET",undefined,token);return Response.json({rows:await currentJourneyEvents(user.id,rows),truncated:rows.length===2000},{headers:{"Cache-Control":"no-store"}})}catch(e){return failure(e)}}
export async function POST(req:Request){try{sameOrigin(req);if(Number(req.headers.get("content-length")||0)>64000)throw new APIError(413,"Record is too large");const {user,token}=await identity();const b:any=await req.json();if(!uuid.test(b.id))throw new APIError(400,"Invalid record ID");const payload:any=validate(b.kind,b.payload);if(JSON.stringify(payload).length>30000)throw new APIError(413,"Record is too large");
 await validateWorkspaceLinks(user.id,token,b.kind,payload,b.id);
 if(b.kind==="transaction"){const accounts=await provider("/rest/v1/ctc_records?id=eq."+payload.account+"&owner_id=eq."+user.id+"&kind=eq.account","GET",undefined,token);if(!accounts.length)throw new APIError(400,"Choose one of your accounts")}
 const existing=await provider("/rest/v1/ctc_records?id=eq."+b.id+"&owner_id=eq."+user.id,"GET",undefined,token);
 if(b.kind==="account"&&existing.length&&existing[0].payload.currency!==payload.currency){const related=await provider("/rest/v1/ctc_records?owner_id=eq."+user.id+"&kind=eq.transaction&payload->>account=eq."+b.id,"GET",undefined,token);if(related.length)throw new APIError(409,"Create a new account for a different currency; existing transactions retain their original currency")}
 let result;if(existing.length){if(existing[0].kind!==b.kind)throw new APIError(400,"Record type cannot change");result=await provider("/rest/v1/ctc_records?id=eq."+b.id+"&owner_id=eq."+user.id,"PATCH",{payload,updated_at:new Date().toISOString()},token)}else result=await provider("/rest/v1/ctc_records","POST",{id:b.id,owner_id:user.id,kind:b.kind,payload},token);
 return Response.json({record:result[0]});}catch(e){return failure(e)}}
export async function DELETE(req:Request){try{sameOrigin(req);const {user,token}=await identity();const {id}=await req.json() as {id:string};if(!uuid.test(id))throw new APIError(400,"Invalid record ID");await validateRecordDeletion(user.id,token,id);const related=await provider("/rest/v1/ctc_records?owner_id=eq."+user.id+"&kind=eq.transaction&payload->>account=eq."+id,"GET",undefined,token);if(related.length)throw new APIError(409,"Remove this account's transactions before deleting it");const result=await provider("/rest/v1/ctc_records?id=eq."+id+"&owner_id=eq."+user.id,"DELETE",undefined,token);if(!result.length)throw new APIError(404,"Record not found");return Response.json({ok:true})}catch(e){return failure(e)}}
