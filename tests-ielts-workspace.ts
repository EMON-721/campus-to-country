import assert from 'node:assert/strict';
import {schemas} from './lib/domain.ts';
const file={id:'1e2f0d8c-8137-482a-942d-e24c1f8dbf94',name:'notes.pdf'};
const mock={skill:'Reading',title:'Cambridge mock',entryType:'Mock',date:'2026-10-12',band:7.5,score:34,total:40,notes:'Review matching headings',comments:[{text:'Check keywords again',at:'2026-10-12T16:00:00Z'}],attachments:[file]};
assert.equal(schemas.attempt.parse(mock).band,7.5);
assert.equal(schemas.attempt.parse({skill:'Speaking',title:'Study note',entryType:'Note',notes:'Practise fluency',comments:[]}).entryType,'Note');
assert.throws(()=>schemas.attempt.parse({...mock,band:9.5}));assert.throws(()=>schemas.attempt.parse({...mock,band:7.3}));assert.throws(()=>schemas.attempt.parse({...mock,date:'2026-02-30'}));assert.throws(()=>schemas.attempt.parse({...mock,comments:[{text:'',at:'today'}]}));assert.throws(()=>schemas.attempt.parse({...mock,attachments:[{id:'other-user-file',name:'notes.pdf'}]}));
assert.equal(schemas.attempt.parse({skill:'Reading',title:'Existing practice',score:10,total:12}).score,10);
console.log('IELTS progress schema: 8 assertions passed.');
