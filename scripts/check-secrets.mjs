import {execFileSync} from 'node:child_process';
import {readFileSync,statSync} from 'node:fs';
const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const rules=[['private key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],['provider secret',/(?:sk-proj-|sb_secret_|ghp_|github_pat_|AIza)[A-Za-z0-9_-]{20,}/g],['literal JWT',/eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}/g]];
const findings=[];
for(const file of files){
 if(/(?:^|\/)\.env(?:\.|$)/.test(file)&&!file.endsWith('.example'))findings.push(file+': tracked environment file');
 if(/(?:^|\/)\.vercel\/|\.(?:db|sqlite|sqlite3|pem|p12|pfx)$/.test(file))findings.push(file+': private runtime artifact');
 let text;try{if(statSync(file).size>3_000_000)continue;text=readFileSync(file,'utf8')}catch{continue}
 for(const [name,pattern] of rules){pattern.lastIndex=0;for(const match of text.matchAll(pattern))findings.push(file+':'+(text.slice(0,match.index).split('\n').length)+': '+name)}
}
if(findings.length){console.error('Potential secrets/private artifacts found (values are intentionally hidden):\n'+findings.join('\n'));process.exitCode=1}else console.log('Tracked-source secret checks passed ('+files.length+' files).');
