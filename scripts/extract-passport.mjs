import fs from 'node:fs';import vm from 'node:vm';
const root=process.argv[2]||'/workspace/sites/passport-source-recovery';
const ctx=vm.createContext({console:{log(){}},crypto:{randomUUID:()=>''},state:{},globalThis:{}});
for(const name of ['data.js','academy-data.js','curriculum45.js','mock-data.js','listening42-data.js','recovery45-data.js','transitions-notes46.js','tense-chart46.js','uploaded-practice46.js']){try{vm.runInContext(fs.readFileSync(root+'/public/legacy/'+name,'utf8'),ctx,{timeout:2000})}catch(e){console.log(name,e.message)}}
const values={};for(const n of ['TASKS','READING','LISTENING','GRAMMAR','SPEAKING','VOCAB','WORDS','LESSONS','UNITS45','MOCK41','LISTENING42','TRANSITION_NOTES46','TENSE_CHART46','TENSE_PRACTICE46','UPLOADED_PRACTICE46','WRITING_PROMPTS','EXTRA_VOCAB','RESOURCE_SEEDS']){try{values[n]=vm.runInContext(n,ctx)}catch{}}
values.extraMocks45=ctx.globalThis.extraMocks45||[];
fs.writeFileSync('/tmp/passport-export.json',JSON.stringify(values));
