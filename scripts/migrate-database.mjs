import {createClient} from '@libsql/client';
import {readdir,readFile} from 'node:fs/promises';
const url=process.env.TURSO_DATABASE_URL;
if(!url)throw Error('Set TURSO_DATABASE_URL (and TURSO_AUTH_TOKEN for the hosted database)');
const db=createClient({url,authToken:process.env.TURSO_AUTH_TOKEN});
try{
 await db.execute('CREATE TABLE IF NOT EXISTS ctc_schema_migrations(name TEXT PRIMARY KEY, applied TEXT NOT NULL)');
 for(const name of (await readdir(new URL('../drizzle/',import.meta.url))).filter(x=>x.endsWith('.sql')).sort()){
  if((await db.execute({sql:'SELECT name FROM ctc_schema_migrations WHERE name=?',args:[name]})).rows.length)continue;
  const text=await readFile(new URL('../drizzle/'+name,import.meta.url),'utf8');
  const statements=text.split('--> statement-breakpoint').map(s=>s.trim()).filter(Boolean);
  await db.batch([...statements.map(sql=>({sql,args:[]})),{sql:'INSERT INTO ctc_schema_migrations(name,applied) VALUES(?,?)',args:[name,new Date().toISOString()]}],'write');
  console.log('Applied '+name);
 }
}finally{db.close()}
