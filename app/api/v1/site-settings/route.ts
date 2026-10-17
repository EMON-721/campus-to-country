import {readSiteSettings} from '@/lib/site-settings-server';
import {identity,failure} from '@/lib/backend';
export const dynamic='force-dynamic';
export async function GET(){try{const state=await readSiteSettings();if(state.settings.customization.customPages.some(p=>p.signedInOnly)){let signedIn=false;try{await identity();signedIn=true}catch{}if(!signedIn)state.settings={...state.settings,customization:{...state.settings.customization,customPages:state.settings.customization.customPages.map(p=>p.signedInOnly?{...p,description:'',blocks:[]}:p)}}}return Response.json(state,{headers:{'Cache-Control':'no-store'}})}catch(e){return failure(e)}}
