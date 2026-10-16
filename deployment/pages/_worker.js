// Public Pages entrypoint. All application logic, secrets and durable data stay on the existing backend.
const BACKEND='https://campus-to-country.emonhossain5081.chatgpt.site';
const WRITE_METHODS=new Set(['POST','PUT','PATCH','DELETE']);
export function upstreamRequest(request){
 const incoming=new URL(request.url),target=new URL(BACKEND),headers=new Headers(request.headers);target.pathname=incoming.pathname;target.search=incoming.search;
 const origin=headers.get('Origin'),site=headers.get('Sec-Fetch-Site');
 if(WRITE_METHODS.has(request.method)&&(origin!==incoming.origin||site&&site!=='same-origin'&&site!=='none'))return null;
 for(const name of ['host','OAI-Sites-Authorization','x-forwarded-host','x-forwarded-proto','forwarded','x-ctc-public-origin'])headers.delete(name);
 if(origin===incoming.origin)headers.set('Origin',BACKEND);
 return new Request(target,{method:request.method,headers,body:['GET','HEAD'].includes(request.method)?undefined:request.body,redirect:'manual',...(request.body?{duplex:'half'}:{})});
}
export function publicRedirect(location,origin){const url=new URL(location,BACKEND);if(url.origin===BACKEND)return origin+url.pathname+url.search+url.hash;
 // Supabase must allow the Pages /api/v1/auth/google/callback URL before owner Google sign-in is used there.
 const callback=url.searchParams.get('redirect_to');if(callback?.startsWith(BACKEND+'/'))url.searchParams.set('redirect_to',origin+callback.slice(BACKEND.length));return url.toString();}
export default {async fetch(request){const upstream=upstreamRequest(request);if(!upstream)return Response.json({error:'Request origin is not allowed'},{status:403,headers:{'Cache-Control':'no-store'}});try{const response=await fetch(upstream),headers=new Headers(response.headers),origin=new URL(request.url).origin;const location=headers.get('location');if(location)headers.set('location',publicRedirect(location,origin));const cookies=response.headers.getSetCookie();if(cookies.length){headers.delete('set-cookie');for(const cookie of cookies)headers.append('set-cookie',cookie.replace(/;\s*Domain=[^;]+/ig,''))}headers.set('Cache-Control','no-store');headers.delete('access-control-allow-origin');headers.delete('access-control-allow-credentials');return new Response(response.body,{status:response.status,statusText:response.statusText,headers})}catch{return Response.json({error:'The website is temporarily unavailable. Please try again.'},{status:502,headers:{'Cache-Control':'no-store'}})}}};
