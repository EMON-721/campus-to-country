import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
function mount(file,search='',result){
 const state=[],effects=[],changes=[],location={href:'https://campus.test/admin'+search,search};let cursor=0;
 const react={useState(initial){const index=cursor++;if(!(index in state))state[index]=index===0&&result!==undefined?result:initial;return [state[index],value=>{state[index]=typeof value==='function'?value(state[index]):value}]},useEffect:fn=>effects.push(fn),useEffectEvent:fn=>fn};
 const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports,URL,URLSearchParams,location,history:{replaceState(_a,_b,url){location.href=String(url);changes.push(String(url))}},setTimeout,clearTimeout,require:name=>name==='react'?react:name==='./admin-console'?{default:()=>null}:name==='./operator-admin'?{BankOperatorAdmin:()=>null}:name==='@/lib/admin-client'?{}:name==='@/lib/bank/module-policy'?{workspaceModules:[],overviewParts:[]}:name==='@/lib/bank/countries'?{destinations:[{name:'Germany'}]}:require(name)});
 return {render(props){cursor=0;return exports.default(props)},effects,state,changes,location};
}
function nodes(root){if(root==null||typeof root!=='object')return [];if(Array.isArray(root))return root.flatMap(nodes);return [root,...nodes(root.props?.children)]}
const legacy=fs.readFileSync('legacy/visafund/app/admin-site.tsx','utf8').match(/const sections=(\[.*?\]);/)[1];
const original=vm.runInNewContext(legacy);
test('Every VisaFund admin option remains accessible within Bank Statements, plus applicant support',()=>{
 const app=mount('app/bank/admin-site.tsx');
 for(const [id,label] of [...original,['workspace','Applicant workspace']]){
  const button=nodes(app.render({onExit(){}})).find(n=>n.type==='button'&&n.props.children===label);assert.ok(button,'Missing '+label);button.props.onClick();
  assert.equal(app.state[0],id);const url=new URL(app.location.href);assert.equal(url.searchParams.get('section'),'bank');assert.equal(url.searchParams.get('bankAdmin'),id);
 }
});
test('Direct Bank admin links open locally and applicant owner links preserve support context',()=>{
 for(const [id] of original){const app=mount('app/bank/admin-site.tsx','?section=bank&bankAdmin='+id);app.render({onExit(){}});app.effects[0]();assert.equal(app.state[0],id)}
 const app=mount('app/bank/admin-site.tsx','?section=bank&owner=applicant&bankRoute=transactions');app.render({onExit(){}});app.effects[0]();assert.equal(app.state[0],'workspace');nodes(app.render({onExit(){}})).find(n=>n.type==='button'&&n.props.children==='User management').props.onClick();assert.equal(new URL(app.location.href).searchParams.has('owner'),false);
});
test('Overview shortcuts include user management, security, audit and settings in Bank Statements',()=>{
 const app=mount('app/bank/admin-console.tsx','',{});const links=nodes(app.render({section:'overview'})).filter(n=>n.type==='a');
 for(const id of ['modules','users','countries','requirements','content','security','audit','settings'])assert.ok(links.some(n=>n.props.href==='/admin?section=bank&bankAdmin='+id),id);
});
test('Permanent deletion requires exact confirmation and never enables an own-account action',()=>{
 const result={self:'admin-id',users:[]};const app=mount('app/bank/admin-console.tsx','',result);app.render({section:'users'});app.state[5]='other-id';app.state[7]='delete-user';
 const submit=()=>nodes(app.render({section:'users'})).find(n=>n.type==='button'&&n.props.children==='Apply account action');
 assert.equal(submit().props.disabled,true);app.state[8]='DELETE other-id';assert.equal(submit().props.disabled,false);app.state[5]='admin-id';app.state[8]='DELETE admin-id';assert.equal(submit().props.disabled,true);
});
