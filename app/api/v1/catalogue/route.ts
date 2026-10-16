import {readSiteSettings} from '@/lib/site-settings-server';
import {env} from 'cloudflare:workers';
import {institutionSeeds,mergeInstitutions} from '@/lib/institution-directory';
import {provider,admin,sameOrigin,failure,APIError} from '@/lib/backend';
import {academicSchemas} from '@/lib/academic';
export const dynamic='force-dynamic';
async function directoryOverrides(){if(!env.DB)return [];const result=await env.DB.prepare("SELECT body FROM platform_content WHERE kind IN ('institution-directory','academic-catalogue')").all<{body:string}>();return result.results.map(r=>JSON.parse(r.body));}
export async function GET(req:Request){try{const editing=new URL(req.url).searchParams.get('admin')==='1';const token=editing?(await admin()).token:undefined;
 // Include unpublished legacy records so hidden seed overrides never reappear publicly.
 const rows=await provider('/rest/v1/ctc_catalogue?order=updated_at.desc&limit=1000','GET',undefined,token);
 const local=await directoryOverrides();const ids=new Set(local.map(r=>r.id));const merged=mergeInstitutions([...local,...rows.filter((r:any)=>!ids.has(r.id))],editing);const {settings}=await readSiteSettings();const hidden=new Set(settings.countries.filter(c=>!c.enabled).map(c=>c.name));return Response.json({rows:editing?merged:merged.filter((r:any)=>!hidden.has(r.payload.country))},{headers:{'Cache-Control':'no-store'}});}catch(e){return failure(e)}}
export async function POST(req:Request){try{sameOrigin(req);const {token,user}=await admin();const b:any=await req.json();if(!Object.hasOwn(academicSchemas,b.kind))throw new APIError(400,'Unsupported catalogue type');const parsed=academicSchemas[b.kind as keyof typeof academicSchemas].safeParse(b.payload);if(!parsed.success)throw new APIError(400,parsed.error.issues.map(i=>i.path.join('.')+': '+i.message).join('; '));const payload=parsed.data;if(b.id&&!/^[a-f0-9-]{36}$/i.test(b.id))throw new APIError(400,'Invalid record ID');
 if(['institution','programme','visa'].includes(b.kind)){
  if(!env.DB)throw new APIError(503,'Directory storage unavailable');
  const existingLocal=(await directoryOverrides()).find(r=>r.id===b.id);const seed=institutionSeeds.find(r=>r.id===b.id);let before:any=existingLocal||seed;
  if(b.id&&!before){const records=await provider('/rest/v1/ctc_catalogue?id=eq.'+b.id,'GET',undefined,token);before=records[0];if(!before)throw new APIError(404,'Record no longer exists. Reload the directory.');}
  if(before&&before.kind!==b.kind)throw new APIError(400,'Keep the existing record type');
  const stamp=new Date().toISOString();const record={id:b.id||crypto.randomUUID(),kind:b.kind,payload,published:!!b.published,updated_at:stamp};
  await env.DB.batch([env.DB.prepare("INSERT INTO platform_content(id,kind,title,body,status,updated) VALUES(?,'academic-catalogue',?,?,?,?) ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,title=excluded.title,body=excluded.body,status=excluded.status,updated=excluded.updated").bind(record.id,(payload as any).name||(payload as any).title,JSON.stringify(record),record.published?'published':'draft',stamp),env.DB.prepare('INSERT INTO platform_audit(id,actor,target,action,reason,created) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),user.id,'catalogue:'+record.id,before?'catalogue.update':'catalogue.create',JSON.stringify({before:before||null,after:record}),stamp)]);
  const stored=await env.DB.prepare('SELECT body FROM platform_content WHERE id=?').bind(record.id).first<{body:string}>();if(!stored)throw new APIError(503,'Record save could not be verified');return Response.json({record:JSON.parse(stored.body)});
 }
 const rows=await provider('/rest/v1/ctc_catalogue'+(b.id?'?id=eq.'+b.id:''),b.id?'PATCH':'POST',{kind:b.kind,payload,published:!!b.published,updated_at:new Date().toISOString()},token);if(!rows?.[0])throw new APIError(404,'No record was saved. Reload and try again.');return Response.json({record:rows[0]});}catch(e){return failure(e)}}
