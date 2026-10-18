import {z} from 'zod';
import {admin,provider,sameOrigin,failure,APIError} from '@/lib/backend';
import {env} from 'cloudflare:workers';
import {accountId,contactState,contactEmailSchema,userIdSchema} from '@/lib/account-contact';
import {validate} from '@/lib/domain';
export const dynamic='force-dynamic';
async function directory(token:string,body:unknown){return provider('/rest/v1/rpc/ctc_contact_directory','POST',{p_body:body},token)}
export async function GET(req:Request){try{
 const {token}=await admin();if(!env.DB)throw new APIError(503,'Administration database unavailable');
 const p=new URL(req.url).searchParams,offset=z.coerce.number().int().nonnegative().max(10000000).parse(p.get('offset')||0),limit=100;
 const accounts=await directory(token,{offset,limit});
 const metadata=(await env.DB.prepare('SELECT id,status,preferences FROM platform_users').all<{id:string;status:string;preferences:string}>()).results;
 const rows=accounts.map((a:any)=>{const m=metadata.find(m=>m.id===a.user_id);return {...a,profile:undefined,local_status:m?.status,...contactState({...a,local_status:m?.status},m?.preferences)}});
 return Response.json({rows,nextOffset:rows.length===limit?offset+limit:null,audit:offset===0?(await env.DB.prepare("SELECT id,actor,target,action,reason,created FROM platform_audit WHERE action LIKE 'user.contact.%' ORDER BY created DESC LIMIT 100").all()).results:[]},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return failure(e)}}
const input=z.object({owner:userIdSchema,action:z.enum(['edit-email','approve','reject','enable','disable','reset-review','save-note']),reason:z.string().trim().min(3).max(1000),expectedEmail:z.string().max(254),email:contactEmailSchema.optional(),note:z.string().max(2000).optional(),message:z.string().max(500).optional()}).strict();
export async function POST(req:Request){try{
 sameOrigin(req);const {user,token}=await admin();if(!env.DB)throw new APIError(503,'Administration database unavailable');
 const raw=await req.text();if(raw.length>10000)throw new APIError(413,'Request too large');const b=input.parse(JSON.parse(raw));
 const a=(await directory(token,{owner:b.owner,limit:1}))[0];if(!a)throw new APIError(404,'Account not found');
 if(String(a.contact_email||'').trim().toLowerCase()!==b.expectedEmail.trim().toLowerCase())throw new APIError(409,'Contact email changed. Refresh and review the current address.');
 const before=await env.DB.prepare('SELECT preferences,status FROM platform_users WHERE id=?').bind(b.owner).first<{preferences:string;status:string}>();
 const current=contactState({...a,local_status:before?.status},before?.preferences);let prior:any={};try{prior=JSON.parse(before?.preferences||'{}').contactReview||{}}catch{}
 const stamp=new Date().toISOString();let review={...prior,email:current.contact_email,decision:current.decision==='missing'?'pending':current.decision,message:current.message,at:stamp,actor:user.id};
 if(b.action==='edit-email'){
  if(!b.email)throw new APIError(400,'Enter a contact email');
  const payload=validate('profile',{...(a.profile||{name:'',timezone:'Asia/Dhaka'}),email:b.email});
  await provider('/rest/v1/rpc/ctc_admin_support','POST',{p_body:{operation:a.profile_id?'update_record':'create_record',owner:b.owner,id:a.profile_id||crypto.randomUUID(),kind:'profile',payload,reason:b.reason}},token);
  review={...review,email:b.email,decision:'pending',message:''};
 }else if(b.action==='approve'||b.action==='reject'){
  if(!current.contact_email)throw new APIError(400,'Add a contact email first');review={...review,decision:b.action==='approve'?'approved':'rejected',message:b.message||''};
 }else if(b.action==='enable'||b.action==='disable')review={...review,enabled:b.action==='enable'};
 else if(b.action==='reset-review')review={...review,decision:'pending',message:''};
 else review={...review,note:b.note||''};
 await env.DB.batch([
 env.DB.prepare("INSERT INTO platform_users(id,name,email,status,created,last_seen,preferences) VALUES(?,?,?,'active',?,?,json_object('contactReview',json(?))) ON CONFLICT(id) DO UPDATE SET preferences=json_set(CASE WHEN json_valid(platform_users.preferences) THEN platform_users.preferences ELSE '{}' END,'$.contactReview',json(?))").bind(b.owner,a.name||a.email||b.owner,a.email||'',stamp,stamp,JSON.stringify(review),JSON.stringify(review)),
 env.DB.prepare('INSERT INTO platform_audit(id,actor,target,action,reason,created) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),user.id,b.owner,'user.contact.'+b.action,b.reason,stamp)
 ]);
 return Response.json({ok:true,account_id:accountId(b.owner)},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return failure(e)}}
