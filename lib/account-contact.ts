import {z} from 'zod';
export const userIdSchema=z.string().uuid();
export const contactEmailSchema=z.string().trim().email().max(254).transform(v=>v.toLowerCase());
export function accountId(owner:string){return 'CTC-'+userIdSchema.parse(owner).toUpperCase()}
export type ContactReview={email?:string;decision?:'pending'|'approved'|'rejected';enabled?:boolean;note?:string;message?:string;at?:string;actor?:string};
export function contactState(account:any,preferences='{}'){
 let review:ContactReview={};try{review=JSON.parse(preferences).contactReview||{}}catch{}
 const email=String(account.contact_email||'').trim().toLowerCase();
 const decision=email?(review.email===email?review.decision||'pending':'pending'):'missing';
 const active=!['suspended','banned','deleted','deletion_pending'].includes(account.local_status)&&account.status!=='suspended'&&!['Suspended','Deleted'].includes(account.lifecycle_status);
 return {account_id:accountId(account.user_id),contact_email:email,contact_consent:account.contact_consent===true,decision,enabled:review.enabled!==false,eligible:!!email&&decision==='approved'&&review.enabled!==false&&account.contact_consent===true&&active,login_email_verified:!!email&&email===String(account.email||'').toLowerCase()&&!!account.email_confirmed_at,reviewed_at:review.at||null,message:review.email===email?review.message||'':'',note:review.note||'',review_actor:review.actor||null};
}
