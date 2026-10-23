import type {SqlDatabase,SqlStatement} from '@/lib/sql-database';
import type {ObjectStorage} from '@/lib/object-storage';
import {APIError,provider} from './backend';
export async function deleteApplicant({database,bucket,actor,token,target,reason,confirmation}:{database:SqlDatabase;bucket:ObjectStorage;actor:string;token:string;target:string;reason:string;confirmation:string}){
 if(!/^[a-f0-9-]{36}$/i.test(target)||reason.trim().length<3||reason.length>1000||confirmation!=='DELETE '+target)throw new APIError(400,'Type DELETE followed by the exact account ID');
 if(actor===target)throw new APIError(409,'Choose an applicant account');
 const body={user_id:target,reason,confirmation};
 await provider('/rest/v1/rpc/ctc_admin_delete_user','POST',{p_body:{...body,operation:'prepare'}},token);
 const stamp=new Date().toISOString();
 await database.prepare("INSERT INTO platform_users(id,name,email,status,created,last_seen,preferences) VALUES(?,?,'','deletion_pending',?,?,'{}') ON CONFLICT(id) DO UPDATE SET status='deletion_pending'").bind(target,target,stamp,stamp).run();
 const job=(await database.prepare("SELECT id FROM platform_deletion_jobs WHERE target=? AND policy_version='manual-owner-v1' ORDER BY created DESC LIMIT 1").bind(target).first<{id:string}>())?.id||crypto.randomUUID();
 await database.prepare("INSERT INTO platform_deletion_jobs(id,target,status,eligible_after,created,policy_version,requested_by) VALUES(?,?,'pending',?,?,'manual-owner-v1',?) ON CONFLICT(id) DO UPDATE SET status='pending',requested_by=excluded.requested_by").bind(job,target,stamp,stamp,actor).run();
 async function clearFiles(){for(const prefix of [target+'/','workspace/'+target+'/']){for(;;){const page=await bucket.list({prefix,limit:1000});if(page.objects.length)await bucket.delete(page.objects.map(o=>o.key));if(!page.truncated)break;if(!page.objects.length)throw new APIError(503,'File cleanup interrupted; retry deletion')}}}
 await clearFiles();
 const tables=['transactions','accounts','records','documents','workspace_documents','audit','bank_legacy_imports','mentorship_access','mentorship_bookings','mentorship_interests','auth_identities'];
 await database.prepare("DELETE FROM platform_content WHERE kind='mentorship-reply' AND title IN (SELECT id FROM mentorship_interests WHERE owner=?)").bind(target).run();
 await database.prepare("DELETE FROM platform_content WHERE kind IN ('contact-message','mentorship-comment','mentorship-enrollment','mentorship-grant','workspace-document-meta') AND json_extract(body,'$.owner')=?").bind(target).run();
 await database.batch(tables.map(table=>database.prepare('DELETE FROM '+table+' WHERE owner=?').bind(target)));
 await provider('/rest/v1/rpc/ctc_admin_delete_user','POST',{p_body:{...body,operation:'finish'}},token);
 await clearFiles();
 await database.prepare("DELETE FROM platform_content WHERE kind IN ('contact-message','mentorship-comment','mentorship-enrollment','mentorship-grant','workspace-document-meta') AND json_extract(body,'$.owner')=?").bind(target).run();
 await database.batch([...tables.map(table=>database.prepare('DELETE FROM '+table+' WHERE owner=?').bind(target)),database.prepare("DELETE FROM limits WHERE id LIKE ?").bind(target+':%'),database.prepare("UPDATE platform_users SET name='Deleted user',email='',status='deleted',preferences='{}' WHERE id=?").bind(target),database.prepare("UPDATE platform_deletion_jobs SET status='completed' WHERE id=?").bind(job),database.prepare('INSERT INTO platform_audit(id,actor,target,action,reason,created) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),actor,target,'user.delete',reason,new Date().toISOString())]);
 return {ok:true,status:'deleted'};
}
