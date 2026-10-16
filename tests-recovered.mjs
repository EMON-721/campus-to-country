import assert from 'node:assert/strict';import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync('public/ielts-content/'+n+'.json','utf8'));
assert.equal(read('vocabulary-1000').length,1000);assert.equal(read('vocabulary-full').length,3003);
const notes=read('notes');for(const s of ['reading','listening','writing','speaking'])assert(notes.some(n=>n.skill.toLowerCase()===s));assert.equal(new Set(notes.map(n=>n.id)).size,notes.length);
const grammar=read('grammar');assert.equal(grammar.entries.length,200);assert.equal(grammar.sources.length,3);for(const e of grammar.entries){assert(fs.existsSync('public'+e.image));assert(e.text);assert(!('originalOcrText' in e))}
for(const n of notes)if(n.diagram)assert(fs.existsSync('public'+n.diagram));
const mocks=read('mocks');for(const skill of ['reading','listening']){assert.equal(mocks[skill].length,3);for(const set of mocks[skill]){const qs=set[skill].flatMap(p=>p.questions);assert.equal(qs.length,40);assert.equal(new Set(qs.map(q=>q.id)).size,40);for(const q of qs){assert(q.answer!==undefined);if(q.audio)assert(fs.existsSync('public'+q.audio))}}}
console.log('Recovered content verified: 1,000 + 3,003 vocabulary entries, '+notes.length+' notes, 200 worksheets, 6 complete 40-question sets and all referenced media.');
