export function trustedRequest(req:Request){const origin=req.headers.get('origin'),site=req.headers.get('sec-fetch-site');return origin===new URL(req.url).origin&&(!site||site==='same-origin'||site==='none')}
export const aiLimits={text:{minute:20,day:100},voice:{minute:3,day:10}} as const;
export function quotaWindow(now:number,period:'minute'|'day'){const span=period==='minute'?60000:86400000;return Math.floor(now/span)*span}
