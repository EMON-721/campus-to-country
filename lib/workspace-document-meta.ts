import {env} from 'cloudflare:workers';
import {APIError} from './backend';
import {vaultCategories} from './vault-categories';
function database(){if(!env.DB)throw new APIError(503,'Private document storage unavailable');return env.DB}
export type DocumentMeta={owner:string;category:string;archived:boolean;previousVersion?:string};
export async function documentMeta(owner:string,id:string):Promise<DocumentMeta>{
 const row=await database().prepare("SELECT body FROM platform_content WHERE id=? AND kind='workspace-document-meta'").bind('vault:'+id).first<{body:string}>();
 if(!row)return {owner,category:'Other',archived:false};
 const meta=JSON.parse(row.body);if(meta.owner!==owner)throw new APIError(403,'Document ownership mismatch');return meta;
}
export function validCategory(value:unknown){if(typeof value!=='string'||!vaultCategories.some(c=>c===value))throw new APIError(400,'Choose a document category');return value}
export function metadataStatement(owner:string,id:string,meta:DocumentMeta){return database().prepare("INSERT INTO platform_content(id,kind,title,body,status,updated) VALUES(?,'workspace-document-meta','Private document metadata',?,'private',?) ON CONFLICT(id) DO UPDATE SET body=excluded.body,updated=excluded.updated WHERE platform_content.kind='workspace-document-meta'").bind('vault:'+id,JSON.stringify({...meta,owner}),new Date().toISOString())}
export function documentAudit(actor:string,owner:string,id:string,action:string){return database().prepare('INSERT INTO platform_audit(id,actor,target,action,reason,created) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),actor,id,'workspace.document.'+action,'Private document operation for account '+owner,new Date().toISOString())}

export async function documentRateLimit(owner:string,action:string,max:number){
 const stamp=Math.floor(Date.now()/60000),row=await database().prepare('INSERT INTO limits(id,stamp,count) VALUES(?,?,1) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN limits.stamp=excluded.stamp THEN limits.count+1 ELSE 1 END,stamp=excluded.stamp RETURNING count').bind(owner+':workspace-document:'+action,stamp).first<{count:number}>();
 if(!row||row.count>max)throw new APIError(429,'Too many document requests. Try again in a minute.');
}
