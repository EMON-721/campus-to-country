// Stable keys preserve long paragraphs instead of truncating them to 200 characters.
export function copyKey(text:string){let a=2166136261,b=5381;for(let i=0;i<text.length;i++){a=Math.imul(a^text.charCodeAt(i),16777619);b=Math.imul(b,33)^text.charCodeAt(i)}return '@text:'+ (a>>>0).toString(16)+':'+(b>>>0).toString(16)+':'+text.length}
