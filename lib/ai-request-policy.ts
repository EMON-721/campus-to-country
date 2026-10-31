export function trustedRequest(req:Request){
 const origin=req.headers.get('origin'),site=req.headers.get('sec-fetch-site');
 if(!origin||(site&&site!=='same-origin'&&site!=='none'))return false;
 try{
  const requestURL=new URL(req.url),host=req.headers.get('host')||req.headers.get('x-forwarded-host')||requestURL.host;
  if(!host||/[\s,@/\\?#]/.test(host))return false;
  const protocol=req.headers.get('x-forwarded-proto')||requestURL.protocol.slice(0,-1);
  if(protocol!=='http'&&protocol!=='https')return false;
  const expected=new URL(protocol+'://'+host).origin;
  // Next.js can expose an internal localhost URL behind a reverse proxy. Host
  // is the ingress host; browser clients cannot forge it. Never trust Origin
  // by itself or an arbitrary forwarded-host value over the actual Host.
  return origin===expected;
 }catch{return false}
}

export const aiLimits={text:{minute:20,day:100},voice:{minute:3,day:10}} as const;
export function quotaWindow(now:number,period:'minute'|'day'){const span=period==='minute'?60000:86400000;return Math.floor(now/span)*span}
