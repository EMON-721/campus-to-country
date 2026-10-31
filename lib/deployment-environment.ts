export const requiredEnvironment=['CTC_SUPABASE_URL','CTC_SUPABASE_KEY','CTC_SUPABASE_SERVICE_ROLE_KEY','TURSO_DATABASE_URL','TURSO_AUTH_TOKEN'] as const;
export function isPrivilegedKey(key:string){if(key.startsWith('sb_secret_'))return true;try{return JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role==='service_role'}catch{return false}}
export function environmentProblems(env:Record<string,string|undefined>){
 const problems:string[]=[];for(const name of requiredEnvironment)if(!env[name]?.trim())problems.push('Missing '+name);
 if(env.CTC_SUPABASE_URL){try{const u=new URL(env.CTC_SUPABASE_URL);if(u.protocol!=='https:'||u.username||u.password||u.pathname!=='/')problems.push('CTC_SUPABASE_URL must be a clean HTTPS project origin')}catch{problems.push('CTC_SUPABASE_URL is invalid')}}
 if(env.CTC_SUPABASE_KEY&&isPrivilegedKey(env.CTC_SUPABASE_KEY))problems.push('CTC_SUPABASE_KEY must be a publishable/anon key, never a privileged key');
 if(env.TURSO_DATABASE_URL&&!/^(libsql|https):\/\//.test(env.TURSO_DATABASE_URL))problems.push('Use a remote libSQL database URL for Vercel');
 for(const [name,value] of Object.entries(env))if(name.startsWith('NEXT_PUBLIC_')&&value&&(/SERVICE_ROLE|TURSO_AUTH_TOKEN|ENCRYPTION_KEY|PRIVATE_KEY/.test(name)||isPrivilegedKey(value)))problems.push('Remove privileged browser environment variable '+name);
 return problems;
}
