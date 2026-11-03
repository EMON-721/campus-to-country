// Static-only preflight: no credentials, network access or deployment.
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const pkg=JSON.parse(read('package.json'));
const vercel=JSON.parse(read('vercel.json'));
const cf=JSON.parse(read('wrangler.jsonc'));
const ts=JSON.parse(read('tsconfig.json'));
const problems=[];
const check=(ok,msg)=>{if(!ok)problems.push(msg)};
check(pkg.scripts.build==='next build','Keep the standard Vercel build script');
check(vercel.framework==='nextjs'&&vercel.outputDirectory==='.next','Keep the existing Vercel output configuration');
check(!/output\s*:\s*['"]export['"]/.test(read('next.config.ts')),'Do not statically export APIs, auth, or private content');
check(cf.main==='.open-next/worker.js'&&cf.assets?.directory==='.open-next/assets'&&cf.assets?.binding==='ASSETS','OpenNext Worker/assets configuration is invalid');
check(cf.compatibility_flags?.includes('nodejs_compat'),'Enable Workers Node.js compatibility');
check(ts.exclude.includes('open-next.config.ts'),'Exclude Cloudflare adapter from Vercel TypeScript build');
check(read('lib/sql-database.ts').includes("from '@libsql/client/web'"),'Cloudflare needs remote libSQL web client');
check(read('db/index.ts').includes("from 'drizzle-orm/libsql/web'"),'Cloudflare needs Drizzle web driver');
check(read('.gitignore').includes('/.dev.vars*'),'Ignore Cloudflare local credentials');
if(problems.length){console.error('Cloudflare source preflight failed:\n'+problems.map(x=>'- '+x).join('\n'));process.exitCode=1}
else console.log('Cloudflare source checks passed. Real Worker build/preview testing still required; nothing deployed.');
