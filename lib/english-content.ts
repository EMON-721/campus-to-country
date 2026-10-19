import translations from './english-note-translations.json';
const bengali=/[\u0980-\u09ff]/u;
export const websiteLanguage='en' as const;
export function containsBengali(value:unknown){return typeof value==='string'&&bengali.test(value)}
export function englishText(value:unknown,fallback='English content is not available yet.'):string{
 if(typeof value!=='string')return fallback;
 if(!containsBengali(value))return value;
 let result=value;for(const [original,translated] of Object.entries(translations))result=result.split(original).join(translated);
 return containsBengali(result)?fallback:result;
}
export function englishLearningEntry(name:string,item:any){
 if(name.startsWith('vocabulary'))return {...item,meaning:englishText(item.meaningEn||item.meaning,'')};
 if(name==='notes')return Object.fromEntries(Object.entries(item).map(([key,value])=>[key,typeof value==='string'?englishText(value):value]));
 return item;
}
export function englishDefinition(payload:unknown){
 if(!Array.isArray(payload))return null;
 for(const entry of payload){for(const meaning of entry?.meanings||[]){for(const d of meaning.definitions||[]){
  if(typeof d.definition==='string'&&d.definition.trim()&&!containsBengali(d.definition))return {text:d.definition.trim().slice(0,1500),partOfSpeech:typeof meaning.partOfSpeech==='string'?englishText(meaning.partOfSpeech,''):'',source:'Free Dictionary API'};
 }}}
 return null;
}
export function dictionaryWord(word:string){const value=String(word).split(',')[0].trim();return value.length<=100&&/^[a-zA-Z][a-zA-Z '\-]*$/.test(value)?value.toLowerCase():'';}

export function englishQuizClue(definition:string,word:string,accepted:string[]=[]){const terms=[...new Set([word,...accepted].map(dictionaryWord).filter(Boolean))].sort((a,b)=>b.length-a.length);if(!terms.length)return definition;const pattern=terms.map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');return definition.replace(new RegExp('\\b(?:'+pattern+')\\b','gi'),'[word]');}
