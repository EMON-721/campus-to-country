'use client';
import {useState} from 'react';
import {adminControlIndex} from '@/lib/admin-control-index';
import {resourceDefaults} from '@/lib/module-resources';
import type {SiteSettings} from '@/lib/site-settings';
import {LearningAdmin} from './learning-admin';
import {ResourceAdmin} from './resource-admin';
import {MediaLibrary} from './super-admin';
export function ContentManagementHub({notify,settings}:{notify:(text:string)=>void;settings:SiteSettings}){
 const [tool,setTool]=useState('inventory'),[query,setQuery]=useState(''),[resource,setResource]=useState('admission-journey');
 return <section className="content-management-hub"><header className="page-heading"><div><span className="eyebrow">SUPER ADMIN · USER CONTENT</span><h2>All user content, one management centre</h2><p>Add, upload, edit, publish, hide, delete and restore content through its original editor. Existing content and records stay in their current storage.</p></div></header><nav className="admin-tabs" aria-label="Content management tools">{[['inventory','All content controls'],['learning','Learning content & JSON uploads'],['resources','Guides, templates & reference content'],['media','Public media & file uploads']].map(([id,label])=><button className="button outline" key={id} aria-pressed={tool===id} onClick={()=>setTool(id)}>{label}</button>)}</nav>
 {tool==='inventory'&&<section className="card"><h3>Find a user-side section</h3><label>Search content or action<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Vocabulary, university, scholarship, notice, documents…"/></label><div className="control-index">{adminControlIndex(settings.countries).filter(e=>Object.values(e).join(' ').toLowerCase().includes(query.toLowerCase())).map((e,i)=><article key={e.admin+e.route+i}><span className="badge">{e.area}</span><h4>{e.label}</h4><p>{e.actions}</p><div className="admin-choices"><a className="button outline small" href={e.admin}>Open original editor</a><a href={e.route}>View user page</a><a href={e.route+'?edit=1'}>Edit wording / visibility</a></div></article>)}</div><p>Deleting a built-in learning item hides it with a saved restore option. Deleting a page-text override restores the original wording. Private applicant files and protected course materials use their dedicated editors.</p></section>}
 {tool==='learning'&&<LearningAdmin/>}
 {tool==='resources'&&<><section className="card"><label>Resource collection<select value={resource} onChange={e=>setResource(e.target.value)}>{Object.keys(resourceDefaults).map(name=><option key={name} value={name}>{name.replaceAll('-',' ')}</option>)}</select></label></section><ResourceAdmin key={resource} name={resource}/></>}
 {tool==='media'&&<MediaLibrary notify={notify}/>}
 </section>;
}
