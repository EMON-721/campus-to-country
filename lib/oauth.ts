export function base64url(bytes:Uint8Array){return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
export function verifier(){return base64url(crypto.getRandomValues(new Uint8Array(32)))}
export async function challenge(value:string){return base64url(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))))}
export function authorizeURL(providerURL:string,origin:string,codeChallenge:string){const url=new URL('/auth/v1/authorize',providerURL);url.searchParams.set('provider','google');url.searchParams.set('redirect_to',origin+'/api/v1/auth/google/callback');url.searchParams.set('code_challenge',codeChallenge);url.searchParams.set('code_challenge_method','s256');return url.toString()}
