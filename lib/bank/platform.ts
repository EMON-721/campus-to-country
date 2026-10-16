import {db,uid,now,admin} from './server';
export const superAdmin=admin;
export async function requireAdminMFA(){await admin()}
export function adminEvent(actor:string,target:string|null,action:string,reason:string){return db().prepare('INSERT INTO platform_audit(id,actor,target,action,reason,created) VALUES(?,?,?,?,?,?)').bind(uid(),actor,target,action,reason,now())}
