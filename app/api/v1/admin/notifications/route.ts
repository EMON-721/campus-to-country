import {admin,provider,sameOrigin,failure,APIError} from '@/lib/backend';
export const dynamic='force-dynamic';
export async function POST(req:Request){try{sameOrigin(req);const {token}=await admin();const body:any=await req.json();if(body.operation==='retry'){return Response.json(await provider('/rest/v1/rpc/ctc_notice_jobs','POST',{p_body:body},token))}
if(body.operation!=='dispatch')throw new APIError(400,'Unsupported notification operation');throw new APIError(503,'External email dispatch is not activated. Automatic approval review requires explicit authorization for Brevo. In-app notices remain available.');}catch(e){return failure(e)}}
