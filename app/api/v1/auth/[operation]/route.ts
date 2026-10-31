import {readAuthInput,limitAuthAttempt,accessCookieOptions,refreshCookieOptions} from '@/lib/auth-security';
import {readSiteSettings} from '@/lib/site-settings-server';
import {cookies} from "next/headers";
import {provider,identity,sameOrigin,failure,APIError} from "@/lib/backend";
export const dynamic="force-dynamic";
export async function GET(){try{const {user}=await identity(true);return Response.json({user:{id:user.id,email:user.email}},{headers:{"Cache-Control":"no-store"}})}catch(e){return failure(e)}}
export async function POST(req:Request,{params}:{params:Promise<{operation:string}>}){try{sameOrigin(req);const {operation}=await params;const body:any=await readAuthInput(req);await limitAuthAttempt(req,operation,body);const jar=await cookies();const put=(data:any)=>{if(data?.access_token){jar.set("ctc_access",data.access_token,accessCookieOptions(data.expires_in));jar.set("ctc_refresh",data.refresh_token,refreshCookieOptions)}};
 if(operation==="mfa-info"||operation==="mfa-verify"||operation==="mfa-enroll"){
 const {user,token}=await identity();const roles=await provider("/rest/v1/ctc_admins?user_id=eq."+encodeURIComponent(user.id),"GET",undefined,token);if(!roles?.length)throw new APIError(403,"Administrator role required");const factors=(user.factors||[]).filter((f:any)=>f.status==="verified"&&f.factor_type==="totp");
 if(operation==="mfa-info")return Response.json({factors:factors.map((f:any)=>({id:f.id,name:f.friendly_name||"Authenticator"}))},{headers:{"Cache-Control":"no-store"}});
 if(operation==="mfa-enroll"){
 if(factors.length)throw new APIError(409,"Use your existing verified authenticator");
 for(const f of (user.factors||[]).filter((f:any)=>f.status==='unverified'&&f.factor_type==='totp'))await provider('/auth/v1/factors/'+encodeURIComponent(f.id),'DELETE',undefined,token);
 const enrolled=await provider('/auth/v1/factors','POST',{factor_type:'totp',friendly_name:'Campus to Country Admin',issuer:'Campus to Country'},token);
 if(!enrolled.id||!enrolled.totp?.qr_code)throw new APIError(503,'Authenticator setup unavailable');
 return Response.json({factorId:enrolled.id,qrCode:enrolled.totp.qr_code,secret:enrolled.totp.secret},{headers:{'Cache-Control':'no-store'}});
 }
 if(!(user.factors||[]).some((f:any)=>f.id===body.factorId&&f.factor_type==='totp'&&['verified','unverified'].includes(f.status))||!/^\d{6}$/.test(body.code||""))throw new APIError(400,"Choose your authenticator and enter its six-digit code");
 const challenge=await provider("/auth/v1/factors/"+body.factorId+"/challenge","POST",{},token);const result=await provider("/auth/v1/factors/"+body.factorId+"/verify","POST",{challenge_id:challenge.id,code:body.code},token);put(result);return Response.json({ok:true});
 }
 if(operation==="set-password"){
 const {user,token}=await identity();if(typeof body.password!=="string"||body.password.length<10||body.password.length>128)throw new APIError(400,"Use a password with 10–128 characters");
 const claims=JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));if((user.factors||[]).some((f:any)=>f.status==='verified')&&claims.aal!=='aal2')throw new APIError(403,"Complete your enrolled MFA verification before setting the password");
 await provider('/auth/v1/user','PUT',{password:body.password},token);return Response.json({ok:true});
 }
 if(operation==="logout"){const token=jar.get("ctc_access")?.value;try{if(token)await provider("/auth/v1/logout","POST",{},token)}finally{jar.set("ctc_access","",{...accessCookieOptions(1),maxAge:0});jar.set("ctc_refresh","",{...refreshCookieOptions,maxAge:0})}return Response.json({ok:true})}
 if(operation==="refresh"){const token=jar.get("ctc_refresh")?.value;if(!token)throw new APIError(401,"Please sign in again");const data=await provider("/auth/v1/token?grant_type=refresh_token","POST",{refresh_token:token});put(data);return Response.json({ok:true})}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email||""))throw new APIError(400,"Enter a valid email address");
 if(operation==="recover"){await provider("/auth/v1/recover","POST",{email:body.email});return Response.json({message:"If the address is registered, the account provider will send recovery instructions."})}
 if(typeof body.password!=="string"||body.password.length<10||body.password.length>128)throw new APIError(400,"Use a password with 10–128 characters");
 if(operation==="register"){const data=await provider("/auth/v1/signup","POST",{email:body.email,password:body.password});put(data);return Response.json({message:data?.access_token?"Account created.":"Check your email to confirm your account. Email delivery depends on the account provider."})}
 if(operation!=="login")throw new APIError(404,"Unknown account operation");
 const data=await provider("/auth/v1/token?grant_type=password","POST",{email:body.email,password:body.password});if((await readSiteSettings()).settings.notice.demoOnly){const u=await provider("/auth/v1/user","GET",undefined,data.access_token);const roles=await provider("/rest/v1/ctc_admins?user_id=eq."+encodeURIComponent(u.id),"GET",undefined,data.access_token);if(!roles?.length)throw new APIError(423,"Demo preview only. Please wait for the launch announcement before signing in.")}await provider("/rest/v1/rpc/ctc_keep_active","POST",{p_reason:"login"},data.access_token);put(data);return Response.json({ok:true});
 }catch(e){return failure(e)}}
