import {admin,provider,sameOrigin,failure} from '@/lib/backend';
export const dynamic='force-dynamic';
export async function GET(){try{const {token}=await admin();const data=await provider('/rest/v1/rpc/ctc_admin_lifecycle','POST',{},token);return Response.json(data,{headers:{'Cache-Control':'no-store'}})}catch(e){return failure(e)}}
export async function POST(req:Request){try{sameOrigin(req);const {token}=await admin();const body=await req.json();const data=await provider('/rest/v1/rpc/ctc_admin_lifecycle','POST',{p_body:body},token);return Response.json(data,{headers:{'Cache-Control':'no-store'}})}catch(e){return failure(e)}}
