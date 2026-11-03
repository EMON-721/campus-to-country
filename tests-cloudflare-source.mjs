import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('./'+p,import.meta.url),'utf8');
test('Vercel keeps its Next.js production configuration',()=>{
 assert.equal(JSON.parse(read('package.json')).scripts.build,'next build');
 const v=JSON.parse(read('vercel.json'));
 assert.equal(v.framework,'nextjs');
 assert.equal(v.outputDirectory,'.next');
});
test('Cloudflare Worker uses a server entry and static asset binding',()=>{
 const c=JSON.parse(read('wrangler.jsonc'));
 assert.equal(c.main,'.open-next/worker.js');
 assert.equal(c.assets.binding,'ASSETS');
 assert.ok(c.compatibility_flags.includes('nodejs_compat'));
 assert.match(read('open-next.config.ts'),/defineCloudflareConfig/);
});
test('Cloudflare secrets and build output are ignored',()=>{
 for(const name of ['/.dev.vars*','/.open-next/','/cloudflare-env.d.ts'])assert.ok(read('.gitignore').includes(name));
});
test('source checks complete without deploying',()=>{
 const r=spawnSync(process.execPath,['scripts/cloudflare-preflight.mjs'],{encoding:'utf8'});
 assert.equal(r.status,0,r.stderr||r.stdout);
});
