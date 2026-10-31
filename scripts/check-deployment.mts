import {environmentProblems} from '../lib/deployment-environment.ts';
import {createClient} from '@libsql/client';
const problems=environmentProblems(process.env);
if(problems.length){console.error(problems.join('\n'));process.exitCode=1}else{
 const db=createClient({url:process.env.TURSO_DATABASE_URL!,authToken:process.env.TURSO_AUTH_TOKEN});
 try{
  await db.execute('SELECT 1');
  const tables=await db.execute("SELECT name FROM sqlite_master WHERE type='table'");
  const found=new Set(tables.rows.map(row=>row.name));
  const required=['platform_users','platform_content','platform_audit','limits','records','workspace_documents','accounts','transactions','documents','mentorship_settings','mentorship_bookings'];
  if(required.some(name=>!found.has(name)))throw Error('Website database schema is incomplete; review and apply the existing migrations before launch');
  const url=process.env.CTC_SUPABASE_URL!.replace(/\/$/,''),key=process.env.CTC_SUPABASE_SERVICE_ROLE_KEY!,bucket=process.env.CTC_STORAGE_BUCKET||'ctc-files';
  const response=await fetch(url+'/storage/v1/bucket/'+encodeURIComponent(bucket),{headers:{apikey:key,Authorization:'Bearer '+key},signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('Private Storage bucket is not accessible with the configured server key');
  const metadata=await response.json() as {public?:boolean};if(metadata.public!==false)throw Error('Workspace/course Storage bucket must be private');
  console.log('Required configuration, database schema and private Storage access verified. No user records were read.');
 }catch{console.error('Deployment check failed: verify database credentials/schema and server access to a private Storage bucket. No credential values were printed.');process.exitCode=1}finally{db.close()}
}
