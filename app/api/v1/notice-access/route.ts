import {admin} from '@/lib/backend';
export const dynamic='force-dynamic';
export async function GET(){let allowed=false;try{await admin();allowed=true}catch{}return Response.json({admin:allowed},{headers:{'Cache-Control':'no-store'}})}
