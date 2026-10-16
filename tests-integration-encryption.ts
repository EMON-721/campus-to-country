import assert from 'node:assert/strict';
import {encryptSecret,decryptSecret} from './lib/integration-encryption.ts';
process.env.CTC_INTEGRATION_ENCRYPTION_KEY=btoa('a'.repeat(32));
const a=await encryptSecret('fixture-api-key'),b=await encryptSecret('fixture-api-key');assert.notEqual(a.iv,b.iv);assert.notEqual(a.data,b.data);assert.equal(await decryptSecret(a),'fixture-api-key');await assert.rejects(()=>decryptSecret({...a,data:b.data}));process.env.CTC_INTEGRATION_ENCRYPTION_KEY=btoa('b'.repeat(32));await assert.rejects(()=>decryptSecret(a));delete process.env.CTC_INTEGRATION_ENCRYPTION_KEY;await assert.rejects(()=>encryptSecret('fixture'));console.log('6 secret encryption checks passed; fresh IVs, roundtrip, tamper and wrong/missing-key rejection');
