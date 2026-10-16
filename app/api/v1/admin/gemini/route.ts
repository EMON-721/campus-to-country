import {admin,provider,sameOrigin,failure,APIError} from '@/lib/backend';
import {encryptSecret,decryptSecret} from '@/lib/integration-encryption';
import {isGeminiModel,normalizeGeminiKey,validGeminiKey,googleKeyError} from '@/lib/gemini-models';
export const dynamic='force-dynamic';
export async function GET(){try{const {token}=await admin();const c=await provider('/rest/v1/rpc/ctc_gemini_config','POST',{},token);return Response.json({configured:c.configured,model:c.model,encryptionReady:!!process.env.CTC_INTEGRATION_ENCRYPTION_KEY},{headers:{'Cache-Control':'no-store'}})}catch(e){return failure(e)}}
export async function POST(req:Request){let stage='authorization';try{
 sameOrigin(req);const {token}=await admin();stage='validation';const b:any=await req.json();
 if(b.operation==='test'){if(b.consent!==true)throw new APIError(400,'Confirm testing the saved Google connection');stage='google_verification';const saved=await provider('/rest/v1/rpc/ctc_gemini_server_read','POST',{p_server_secret:process.env.CTC_INTEGRATION_ENCRYPTION_KEY},token);if(!saved.enabled||!saved.encrypted_key)throw new APIError(503,'Save a Gemini key first');if(!isGeminiModel(saved.model))throw new APIError(400,'Choose a supported model');const key=await decryptSecret(saved.encrypted_key);const response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(saved.model)+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{role:'user',parts:[{text:'Reply with the word Connected.'}]}],generationConfig:{maxOutputTokens:saved.model==='gemini-3.8-flash'?8192:512,...(saved.model==='gemini-3.8-flash'?{thinkingConfig:{thinkingLevel:'LOW',includeThoughts:false}}:{})}}),signal:AbortSignal.timeout(25000)});const d:any=await response.json().catch(()=>null);if(!response.ok)throw new APIError(response.status===429?429:503,googleKeyError(response.status));const reply=(d?.candidates?.[0]?.content?.parts||[]).filter((p:any)=>typeof p.text==='string'&&!p.thought).map((p:any)=>p.text).join(' ').slice(0,200);if(!reply)throw new APIError(503,'Google returned no text. Retry or select another supported model.');return Response.json({configured:true,model:saved.model,encryptionReady:true,connectionVerified:true,reply},{headers:{'Cache-Control':'no-store'}})}
 if(b.operation==='disable'){await provider('/rest/v1/rpc/ctc_gemini_config','POST',{p_body:{operation:'disable'}},token);return Response.json({configured:false},{headers:{'Cache-Control':'no-store'}})}
 const apiKey=normalizeGeminiKey(b.apiKey);
 if(b.freeConfirmed!==true)throw new APIError(400,'Tick the Free tier confirmation before saving.');
 if(!validGeminiKey(apiKey))throw new APIError(400,'Paste the complete Google AI Studio Gemini API key. Standard and authorization keys are supported. Do not paste an OAuth Client ID or Secret.');
 if(!isGeminiModel(b.model))throw new APIError(400,'Choose a supported Gemini model.');
 if(!process.env.CTC_INTEGRATION_ENCRYPTION_KEY)throw new APIError(503,'Secure key storage is not ready. Contact the site administrator.');
 stage='google_verification';
 const response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(b.model),{headers:{'x-goog-api-key':apiKey},signal:AbortSignal.timeout(15000)});
 const model:any=await response.json().catch(()=>null);
 if(!response.ok)throw new APIError(response.status===429?429:400,googleKeyError(response.status,model?.error?.details?.find((d:any)=>typeof d.reason==='string')?.reason));
 if(!model?.supportedGenerationMethods?.includes('generateContent'))throw new APIError(400,'This model does not support text chat for your project. Select another listed model.');
 stage='encryption';const encrypted=await encryptSecret(apiKey);
 stage='secure_storage';const c=await provider('/rest/v1/rpc/ctc_gemini_config','POST',{p_body:{operation:'save',free_confirmed:true,model:b.model,encrypted_key:encrypted}},token);
 if(c.enabled!==true)throw new APIError(503,'The secure storage did not confirm saving. Retry the connection.');
 stage='connection_check';const saved=await provider('/rest/v1/rpc/ctc_gemini_server_read','POST',{p_server_secret:process.env.CTC_INTEGRATION_ENCRYPTION_KEY},token);
 if(!saved.enabled||!saved.encrypted_key||await decryptSecret(saved.encrypted_key)!==apiKey||saved.model!==b.model)throw new APIError(503,'Key saved, but the assistant connection could not be verified. Contact the site administrator.');
 return Response.json({configured:true,model:c.model,encryptionReady:true,connectionVerified:true},{headers:{'Cache-Control':'no-store'}});
 }catch(e){
 const known=e instanceof APIError;
 const message=stage==='secure_storage'?'Google verified the key, but secure database storage failed. Retry; contact the administrator if this continues.':stage==='connection_check'?'Key saved, but server access to it could not be verified. Contact the site administrator.':stage==='encryption'?'Secure encryption failed. Contact the site administrator.':stage==='google_verification'&&!known?'Google verification timed out or could not connect. Retry in a moment.':null;
 if(message)return failure(new APIError(503,message));
 return failure(e);
 }}
