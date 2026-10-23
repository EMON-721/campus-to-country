import {database,objects} from '@/lib/server-runtime';
import {provider,APIError} from './backend';
import {duplicateApplication} from './student-journey';
import type {RecordRow} from './domain';
// Admin access always enters through the existing MFA-protected RPC; ordinary reads retain owner RLS.
export async function ownerRecords(owner:string,token:string,adminScope=false){
 const result:RecordRow[]=[];for(let offset=0;offset<20000;offset+=500){const page=adminScope?await provider('/rest/v1/rpc/ctc_admin_support','POST',{p_body:{operation:'records',owner,offset,limit:500}},token):await provider('/rest/v1/ctc_records?owner_id=eq.'+owner+'&order=created_at.desc,id.asc&limit=500&offset='+offset,'GET',undefined,token);result.push(...page);if(page.length<500)return result}throw new APIError(413,'Record history requires a paginated support review');
}
export async function validateWorkspaceLinks(owner:string,token:string,kind:string,p:any,id:string,adminScope=false){
 const documents=[...new Set([...(p.documentIds||[]),...(p.attachments||[]).map((f:any)=>f.id)])];
 for(const file of documents){if(!database)throw new APIError(503,'Private document storage unavailable');if(!await database.prepare("SELECT id FROM workspace_documents WHERE id=? AND owner=? AND scope='ielts'").bind(file,owner).first())throw new APIError(400,'Linked documents must belong to this applicant')}
 const needed=Boolean(p.applicationId||p.shortlistId||p.scholarshipIds?.length||p.sourceKind&&p.sourceKind!=='mentorship'||kind==='application');
 if(needed){const rows=await ownerRecords(owner,token,adminScope);const check=(ref:string|undefined,expected:string)=>{if(ref&&!rows.some(r=>r.id===ref&&r.kind===expected))throw new APIError(400,'Choose a related record belonging to this applicant')};check(p.applicationId,'application');check(p.shortlistId,'shortlist');for(const ref of p.scholarshipIds||[])if(!rows.some(r=>r.id===ref&&r.kind==='shortlist'&&r.payload.recordType==='scholarship'))throw new APIError(400,'Choose a saved scholarship belonging to this applicant');if(p.sourceKind&&p.sourceKind!=='mentorship')check(p.sourceId,p.sourceKind);if(kind==='application'&&duplicateApplication(rows,p,id)&&!p.duplicateAcknowledged)throw new APIError(409,'An application for this programme and intake already exists. Confirm an intentional duplicate.');}
 // A calendar event may refer only to its owner's actual mentorship booking.
 if(p.sourceKind==='mentorship'){
  if(!p.sourceId)throw new APIError(400,'Choose your own mentorship booking');
  const booking=database?await database.prepare('SELECT b.id,b.status,s.title,s.start,s.end,s.timezone FROM mentorship_bookings b JOIN mentorship_slots s ON s.id=b.slot_id WHERE b.id=? AND b.owner=?').bind(p.sourceId,owner).first<any>():null;
  if(!booking)throw new APIError(400,'Choose your own mentorship booking');
  Object.assign(p,{title:booking.title,start:booking.start,end:booking.end,timezone:booking.timezone,category:'Counseling',status:booking.status==='Completed'?'Completed':['Canceled','Rejected'].includes(booking.status)?'Canceled':'Planned',notes:'Mentorship service status: '+booking.status+(booking.status==='Pending'?' — provisional, awaiting approval.':'.'),link:'/counseling/my-bookings',recurrence:'none',overrides:[],excludedDates:[]});
 }
 if(p.sourceKind&&!p.sourceId)throw new APIError(400,'Choose a related record');
}

// Do not leave dangling relations when either the applicant or a support admin removes a record.
export async function validateRecordDeletion(owner:string,token:string,id:string,adminScope=false){
 const rows=await ownerRecords(owner,token,adminScope);
 if(!rows.some(r=>r.id===id))throw new APIError(404,'Record not found');
 if(rows.some(r=>r.id!==id&&(r.payload.applicationId===id||r.payload.shortlistId===id||(r.payload.scholarshipIds||[]).includes(id)||r.payload.sourceId===id&&r.payload.sourceKind||r.payload.eventId===id||r.payload.account===id)))throw new APIError(409,'Remove related record links before deleting this record. You can archive a saved programme instead.');
}
