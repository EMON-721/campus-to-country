import {activeDestinations} from '@/lib/bank/platform-catalog';
import {publicRules} from '@/lib/bank/public-rules';
import {fail} from '@/lib/bank/server';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json({rules:await publicRules(),destinations:await activeDestinations()},{headers:{'Cache-Control':'private, no-store'}})}catch(e){return fail(e)}}

