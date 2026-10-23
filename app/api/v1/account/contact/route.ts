import {identity,provider,failure,APIError} from '@/lib/backend';
import {database,objects} from '@/lib/server-runtime';
import {contactState} from '@/lib/account-contact';
export const dynamic='force-dynamic';
export async function GET(){try{
 const {user,token}=await identity();if(!database)throw new APIError(503,'Account contact storage unavailable');
 const profiles=await provider('/rest/v1/ctc_records?owner_id=eq.'+user.id+'&kind=eq.profile&order=updated_at.desc,id.desc&limit=1','GET',undefined,token);
 const local=await database.prepare('SELECT preferences,status FROM platform_users WHERE id=?').bind(user.id).first<{preferences:string;status:string}>();
 const profile=profiles[0]?.payload;
 const {note,review_actor,...contact}=contactState({user_id:user.id,email:user.email,email_confirmed_at:user.email_confirmed_at,contact_email:profile?.email,contact_consent:profile?.contactConsent,local_status:local?.status},local?.preferences);
 return Response.json({...contact,login_email:user.email},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return failure(e)}}
