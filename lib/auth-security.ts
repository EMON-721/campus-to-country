import {database} from './server-runtime';
import {APIError} from './backend';
const policies:Record<string,{limit:number;period:number}>={login:{limit:10,period:60000},register:{limit:5,period:60000},recover:{limit:3,period:60000},'mfa-verify':{limit:5,period:60000},'mfa-enroll':{limit:3,period:60000},'set-password':{limit:5,period:60000},refresh:{limit:30,period:60000}};
export async function readAuthInput(req:Request){
 if(!req.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw new APIError(415,'Use application/json');
 const reader=req.body?.getReader();if(!reader)throw new APIError(400,'Missing account form');const chunks:Uint8Array[]=[];let size=0;
 for(;;){const next=await reader.read();if(next.done)break;size+=next.value.length;if(size>16384){await reader.cancel();throw new APIError(413,'Account form is too large')}chunks.push(next.value)}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
 let body;try{body=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes))}catch{throw new APIError(400,'Invalid account form')}
 if(!body||typeof body!=='object'||Array.isArray(body))throw new APIError(400,'Invalid account form');
 for(const key of Object.keys(body))if(!['email','password','factorId','code'].includes(key))throw new APIError(400,'Unexpected account field');
 if(body.email!==undefined){if(typeof body.email!=='string'||body.email.length>254)throw new APIError(400,'Enter a valid email address');body.email=body.email.trim().toLowerCase()}
 return body;
}
async function digest(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,'0')).join('')}
export async function limitAuthAttempt(req:Request,operation:string,body:{email?:string}){
 const policy=policies[operation];if(!policy)return;
 // A durable counter is required; an in-memory map is not reliable on Vercel.
 if(!database)throw new APIError(503,'Secure account protection is not configured. The administrator must configure the website database.');
 const ip=(req.headers.get('x-vercel-forwarded-for')||req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim();
 const identifiers=['ip:'+ip,...(body.email?['account:'+body.email]:[])];
 // Never persist passwords, tokens, raw email addresses or raw IP addresses.
 for(const identifier of identifiers){const id='auth:'+operation+':'+await digest(identifier),stamp=Math.floor(Date.now()/policy.period);const result=await database.prepare('INSERT INTO limits(id,stamp,count) VALUES(?,?,1) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN limits.stamp=excluded.stamp THEN limits.count+1 ELSE 1 END,stamp=excluded.stamp RETURNING count').bind(id,stamp).first<{count:number}>();if(!result||result.count>policy.limit)throw new APIError(429,'Too many account attempts. Wait one minute and try again.')}
}
export function accessCookieOptions(expires:unknown){const value=Number(expires);return {httpOnly:true,secure:true,sameSite:'lax' as const,path:'/',maxAge:Number.isFinite(value)&&value>0?Math.min(Math.floor(value),3600):3600}}
export const refreshCookieOptions={httpOnly:true,secure:true,sameSite:'strict' as const,path:'/api/v1/auth',maxAge:604800};
