import {cookies} from 'next/headers';
import {config,provider} from '@/lib/backend';
import {verifier,challenge,authorizeURL} from '@/lib/oauth';
export const dynamic='force-dynamic';
export async function GET(req:Request){const origin=new URL(req.url).origin;try{const settings=await provider('/auth/v1/settings');if(settings.external?.google!==true)return Response.redirect(origin+'/login?auth_error=google_not_configured',303);const code=verifier();const jar=await cookies();jar.set('ctc_oauth_verifier',code,{httpOnly:true,secure:true,sameSite:'lax',path:'/api/v1/auth/google',maxAge:600});return Response.redirect(authorizeURL(config().url,origin,await challenge(code)),303)}catch{return Response.redirect(origin+'/login?auth_error=google_unavailable',303)}}
