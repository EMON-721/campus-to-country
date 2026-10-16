const priority=["Italy","France","Czech Republic","Spain","Poland","Sweden","USA","Canada"];
export function compareCountries(a:string,b:string){const rank=(name:string)=>{const i=priority.indexOf(name==="United States"?"USA":name);return i<0?priority.length:i};return rank(a)-rank(b)||a.localeCompare(b)}
