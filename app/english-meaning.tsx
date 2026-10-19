'use client';
import {useEffect,useState} from 'react';
import {dictionaryWord,englishDefinition,englishText,englishQuizClue} from '@/lib/english-content';
type Meaning={text:string;partOfSpeech?:string;source?:string};
const cache=new Map<string,Promise<Meaning>>();
async function lookup(word:string){const key=dictionaryWord(word);if(!key)throw Error('An English definition is not available for this entry.');if(!cache.has(key)){
 const pending=fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(key),{signal:AbortSignal.timeout(8000),credentials:'omit',referrerPolicy:'no-referrer'}).then(async r=>{if(!r.ok)throw Error('English definition unavailable. Try again or open the dictionary.');const value=englishDefinition(await r.json());if(!value)throw Error('English definition unavailable. Try again or open the dictionary.');return value}).catch(e=>{cache.delete(key);throw e});cache.set(key,pending);
 }return cache.get(key)!;
}
export async function resolveEnglishMeaning(word:string,stored?:string){const text=englishText(stored||'','');return text?{text}:lookup(word)}
export function useEnglishMeaning(word:string,stored:string|undefined,enabled=true){const supplied=englishText(stored||'',''),[value,setValue]=useState<Meaning|null>(supplied?{text:supplied}:null),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 useEffect(()=>{let active=true;setValue(supplied?{text:supplied}:null);setError('');if(enabled&&!supplied)lookup(word).then(result=>{if(active)setValue(result)}).catch(e=>{if(active)setError((e as Error).message)});return()=>{active=false}},[word,supplied,enabled,retry]);
 return {value,error,loading:enabled&&!value&&!error,retry:()=>setRetry(n=>n+1)};
}
export function EnglishMeaning({word,meaning}:{word:string;meaning?:string}){const state=useEnglishMeaning(word,meaning);return <div lang="en">{state.value?<><p>{state.value.text}</p>{state.value.source&&<small>{state.value.partOfSpeech} · {state.value.source}</small>}</>:state.error?<><p role="status">{state.error}</p><button type="button" className="text-link" onClick={state.retry}>Retry definition</button> · <a className="text-link" href={'https://dictionary.cambridge.org/dictionary/english/'+encodeURIComponent(dictionaryWord(word)||word)} target="_blank" rel="noopener noreferrer">Open English dictionary ↗</a></>:<p role="status">Loading English definition…</p>}</div>}
export function EnglishVocabularyQuiz({word,store,onMark,ready=true}:{word:any;store:import('./platform').Store;onMark?:(correct:boolean)=>Promise<unknown>;ready?:boolean}){
 const state=useEnglishMeaning(word.word,word.meaningEn||word.meaning),[guess,setGuess]=useState(''),[result,setResult]=useState(''),[busy,setBusy]=useState(false);
 const clue=state.value?englishQuizClue(state.value.text,word.word,word.accepted):'';
 return <section className="type-example"><h3>Recall the English word</h3>{clue?<p>{clue}</p>:<div><p role="status">{state.error||'Loading English definition…'}</p>{state.error&&<button type="button" className="text-link" onClick={state.retry}>Retry definition</button>}</div>}<label>Your answer<input maxLength={200} value={guess} onChange={e=>setGuess(e.target.value)}/></label><button className="button outline" disabled={busy||!guess.trim()||!state.value||!ready} onClick={async()=>{setBusy(true);try{const correct=[word.word,...(word.accepted||[])].some(w=>String(w).trim().toLowerCase()===guess.trim().toLowerCase());await store.save('attempt',{skill:'Vocabulary',title:'English definition quiz',answers:[guess],score:correct?1:0,total:1,text:'Definition: '+state.value!.text+' · English: '+word.word,assessment:'Objective practice'});await onMark?.(correct);setResult((correct?'Correct. ':'Review: ')+word.word)}catch(e){store.notify((e as Error).message)}finally{setBusy(false)}}}>Check & save</button>{result&&<p role="status">{result}</p>}</section>
}
