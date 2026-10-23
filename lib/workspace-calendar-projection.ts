import {database,objects} from '@/lib/server-runtime';
import type {RecordRow} from './domain';
import {localParts,wallToISO} from './time';
// Only previously opted-in linked events are projected. Never create an event on a read.
// Service booking data remains canonical; this avoids stale confirmations and duplicate copies.
export async function currentJourneyEvents(owner:string,rows:RecordRow[]){
 const byId=new Map(rows.map(r=>[r.id,r]));
 return Promise.all(rows.map(async r=>{
  if(r.kind!=='event'||!r.payload.sourceKind||!r.payload.sourceId)return r;
  const p={...r.payload};
  if(p.sourceKind==='mentorship'){
   if(!database)return r;
   const booking=await database.prepare('SELECT b.id,b.status,s.title,s.start,s.end,s.timezone FROM mentorship_bookings b JOIN mentorship_slots s ON s.id=b.slot_id WHERE b.id=? AND b.owner=?').bind(p.sourceId,owner).first<{id:string;status:string;title:string;start:string;end:string;timezone:string}>();
   if(!booking)return {...r,payload:{...p,status:'Canceled',notes:'The linked booking is no longer available. Review your mentorship records.'}};
   Object.assign(p,{title:booking.title,start:booking.start,end:booking.end,timezone:booking.timezone,category:'Counseling',status:booking.status==='Completed'?'Completed':['Canceled','Rejected'].includes(booking.status)?'Canceled':'Planned',notes:'Mentorship service status: '+booking.status+(booking.status==='Pending'?' — provisional, awaiting approval.':'.'),recurrence:'none',overrides:[],excludedDates:[],link:'/counseling/my-bookings'});
  }else{
   const source=byId.get(p.sourceId);if(!source||source.kind!==p.sourceKind)return r;
   const s=source.payload;
   if(s.done||['Archived','Completed','Not applicable','Rejected','Withdrawn'].includes(s.status||s.stage))p.status='Canceled';
   else if(s.deadline){try{const tz=p.timezone||'Asia/Dhaka',start=localParts(p.start,tz),end=localParts(p.end,tz);if(start.date!==s.deadline&&start.date===end.date){p.start=wallToISO(s.deadline,start.time,tz);p.end=wallToISO(s.deadline,end.time,tz)}}catch{/* Keep the original schedule if the new local time is invalid. */}}
  }
  return {...r,payload:p};
 }));
}
