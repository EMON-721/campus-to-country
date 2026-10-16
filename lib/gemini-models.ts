// Standard text models with documented Gemini API free tiers.
export const geminiModels = [
 {id:'gemini-3.8-flash',label:'Gemini 3.8 Flash'},
 {id:'gemini-3.5-flash-lite',label:'Gemini 3.5 Flash-Lite'},
 {id:'gemini-3.1-flash-lite',label:'Gemini 3.1 Flash-Lite'},
] as const;
export function isGeminiModel(value:unknown):value is string{return typeof value==='string'&&geminiModels.some(m=>m.id===value)}
export function normalizeGeminiKey(value:unknown){return typeof value==='string'?value.trim():''}
export function validGeminiKey(value:string){return /^[\x21-\x7e]{30,1024}$/.test(value)}
export function googleKeyError(status:number,reason?:string){
 if(status===429)return 'Google verification quota was reached. Wait a little and try again; your existing key has not changed.';
 if(status===404)return 'This model is not available to your Google project. Select another listed model and retry.';
 if(reason==='API_KEY_INVALID'||status===400)return 'Google rejected this API key. Copy the full Gemini API key from Google AI Studio.';
 if(reason==='ACCESS_TOKEN_TYPE_UNSUPPORTED')return 'Google rejected this authorization key for the Gemini API. Check that the key belongs to the intended AI Studio project and is restricted to the Generative Language API.';
 if(status===401)return 'Google rejected the API key. Check whether it was deleted or replaced.';
 if(status===403)return 'Google blocked this key. Check its API restrictions: allow the Generative Language API and server requests; browser-only referrer restrictions will block this website.';
 return 'Google verification is temporarily unavailable. Retry later; your existing key has not changed.';
}
