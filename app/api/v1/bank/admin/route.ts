import {admin,guard,db,fail,readJson,uid,now} from '@/lib/bank/server';
import {moduleSettings} from '@/lib/bank/module-service';
import {workspaceModules,overviewParts} from '@/lib/bank/module-policy';
import {z} from 'zod';
export const dynamic='force-dynamic';
const schema=z.object({route:z.enum(workspaceModules.map(([r])=>r) as [string,...string[]]),label:z.string().trim().min(1).max(60),description:z.string().max(600),heading:z.string().max(120).default(''),enabled:z.boolean(),allowCreate:z.boolean(),allowEdit:z.boolean(),allowDelete:z.boolean(),parts:z.record(z.string(),z.object({enabled:z.boolean(),label:z.string().max(80)})).optional()});
export async function GET(){try{await admin();return Response.json({modules:await moduleSettings(),overviewParts},{headers:{'Cache-Control':'no-store'}})}catch(e){return fail(e)}}
export async function POST(req:Request){try{guard(req);const user=await admin();const data=schema.parse(await readJson(req,15000));await db().batch([db().prepare('INSERT INTO platform_content(id,kind,title,body,status,updated) VALUES(?,?,?,?,?,?)').bind(uid(),'setting','module:'+data.route,JSON.stringify(data),'published',now()),db().prepare('INSERT INTO platform_audit(id,actor,target,action,reason,created) VALUES(?,?,?,?,?,?)').bind(uid(),user.userId,data.route,'bank-module.update',data.label,now())]);return Response.json({modules:await moduleSettings()})}catch(e){return fail(e)}}
