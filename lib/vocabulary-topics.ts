import {z} from 'zod';
import categories from './vocabulary-topics.json';
import classification from './vocabulary-classification.json';
export const vocabularyTopics=categories;
const primary=Object.fromEntries(Object.entries(classification.primary).flatMap(([topic,ids])=>ids.map(id=>[id,topic])));
const related=classification.related as Record<string,string[]>;
const spelling=new Set(classification.spelling);
const tag=z.string().regex(/^[a-z0-9-]{1,80}$/);
export const vocabularyTopicSchema=z.object({id:tag,title:z.string().min(1).max(200),titleBn:z.string().max(200),description:z.string().max(2000),skills:z.array(z.enum(['Listening','Reading','Writing','Speaking'])).max(4),hidden:z.boolean()}).strict();
export const vocabularyMetadataSchema=z.object({primaryTopic:tag.optional(),topics:z.array(tag).max(30).optional(),skills:z.array(z.enum(['Listening','Reading','Writing','Speaking'])).max(4).optional(),spellingFocus:z.boolean().optional()}).passthrough();
export function enrichVocabulary(entries:any[]){return entries.map(w=>{const topic=w.primaryTopic||primary[w.id]||'general-everyday';const category=categories.find(c=>c.id===topic);return {...w,primaryTopic:topic,topics:w.topics||[topic,...(related[w.id]||[])],skills:w.skills||category?.skills||['Listening','Reading','Writing','Speaking'],spellingFocus:w.spellingFocus??spelling.has(w.id)}})}
export function vocabularyLevels(word:{details?:string}){return [...new Set((typeof word.details==='string'?word.details.match(/\b(?:A1|A2|B1|B2|C1|C2)\b/g):[])||[])]}
export function wordsInTopic(words:any[],topic:string){return !topic||topic==='all'?words:topic==='listening-spelling'?words.filter(w=>w.spellingFocus):words.filter(w=>w.primaryTopic===topic)}
export function vocabularyWordState(states:Record<string,string>,id:string){return ['learned','learning'].includes(states[id])?states[id]:'new'}
export function vocabularyProgress(words:any[],states:Record<string,string>){const learned=words.filter(w=>vocabularyWordState(states,w.id)==='learned').length;return {total:words.length,learned,percent:words.length?Math.round(learned/words.length*100):0}}
