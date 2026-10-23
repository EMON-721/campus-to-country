import type {SqlDatabase,SqlStatement} from '@/lib/sql-database';
import type {ObjectStorage} from '@/lib/object-storage';
import {provider} from '@/lib/backend';
import {db,log,now,HttpError} from './server';
// Additive, idempotent bridge. Existing Campus records remain untouched.
export async function importCampusFunds(owner:string,token:string,suppliedRows?:any[]){
 if(await db().prepare('SELECT owner FROM bank_legacy_imports WHERE owner=?').bind(owner).first())return;
 const rows:any[]=suppliedRows?suppliedRows.filter(r=>["account","transaction"].includes(r.kind)):[];
 if(!suppliedRows)for(let offset=0;;offset+=500){const page=await provider('/rest/v1/ctc_records?owner_id=eq.'+owner+'&kind=in.(account,transaction)&order=id.asc&limit=500&offset='+offset,'GET',undefined,token);rows.push(...page);if(page.length<500)break;if(rows.length>=20000)throw new HttpError(413,'Too many legacy financial records for automatic import. Contact support for a complete migration.')}
 const statements:SqlStatement[]=[];const accounts=new Map(rows.filter(r=>r.kind==='account').map(r=>[r.id,r]));
 for(const a of accounts.values()){const p=a.payload;if(!Number.isSafeInteger(p.opening)||typeof p.currency!=='string'||typeof p.date!=='string')throw new HttpError(409,'A legacy account requires review before import');const details={name:p.title,bank:'',holder:'',ownership:'Self',type:'Planning account',accessible:true,country:'Bangladesh',legacyCampusRecord:true};statements.push(db().prepare('INSERT OR IGNORE INTO accounts(id,owner,name,bank,currency,opening,date,details,created) VALUES(?,?,?,?,?,?,?,?,?)').bind(a.id,owner,p.title,'',p.currency,p.opening,p.date,JSON.stringify(details),a.created_at))}
 for(const t of rows.filter(r=>r.kind==='transaction')){const p=t.payload;if(!accounts.has(p.account)||!Number.isSafeInteger(p.amount)||!['credit','debit'].includes(p.direction))throw new HttpError(409,'A legacy transaction requires review before import');statements.push(db().prepare('INSERT OR IGNORE INTO transactions(id,owner,account,date,amount,direction,category,description,details,fingerprint,transfer,imported,deleted,created,updated) VALUES(?,?,?,?,?,?,?,?,?,NULL,NULL,0,0,?,?)').bind(t.id,owner,p.account,p.date,p.amount,p.direction,'Other',p.description,JSON.stringify({...p,verified:'Manual',legacyCampusRecord:true}),t.created_at,t.updated_at||t.created_at))}
 statements.push(db().prepare('INSERT OR IGNORE INTO bank_legacy_imports(owner,imported_at) VALUES(?,?)').bind(owner,now()));
 if(rows.length)statements.push(log(owner,owner,'campus-finance.import',null,{accounts:accounts.size,transactions:rows.length-accounts.size}));
 await db().batch(statements);
}
