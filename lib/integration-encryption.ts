export type EncryptedSecret={iv:string;data:string};
function encode(bytes:Uint8Array){return btoa(String.fromCharCode(...bytes))}
function decode(value:string){return Uint8Array.from(atob(value),c=>c.charCodeAt(0))}
async function key(){const raw=process.env.CTC_INTEGRATION_ENCRYPTION_KEY;if(!raw)throw Error('Integration encryption is not configured');const bytes=decode(raw);if(bytes.length!==32)throw Error('Invalid integration encryption configuration');return crypto.subtle.importKey('raw',bytes,{name:'AES-GCM'},false,['encrypt','decrypt'])}
export async function encryptSecret(value:string):Promise<EncryptedSecret>{const iv=crypto.getRandomValues(new Uint8Array(12));const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:new TextEncoder().encode('ctc:gemini:v1')},await key(),new TextEncoder().encode(value));return {iv:encode(iv),data:encode(new Uint8Array(encrypted))}}
export async function decryptSecret(value:EncryptedSecret){const decrypted=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(value.iv),additionalData:new TextEncoder().encode('ctc:gemini:v1')},await key(),decode(value.data));return new TextDecoder().decode(decrypted)}
