import {provider} from './backend';
import {decryptSecret} from './integration-encryption';
export async function geminiConfiguration(token:string){if(process.env.CTC_GEMINI_API_KEY&&process.env.CTC_GEMINI_FREE_TIER_CONFIRMED==='true')return {key:process.env.CTC_GEMINI_API_KEY,model:process.env.CTC_GEMINI_MODEL||'gemini-3.5-flash-lite'};const c=await provider('/rest/v1/rpc/ctc_gemini_server_read','POST',{p_server_secret:process.env.CTC_INTEGRATION_ENCRYPTION_KEY},token);return {key:c.enabled&&c.encrypted_key?await decryptSecret(c.encrypted_key):null,model:c.model||'gemini-3.5-flash-lite'}}
