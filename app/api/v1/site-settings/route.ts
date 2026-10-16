import {readSiteSettings} from '@/lib/site-settings-server';
import {failure} from '@/lib/backend';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await readSiteSettings(),{headers:{'Cache-Control':'no-store'}})}catch(e){return failure(e)}}
