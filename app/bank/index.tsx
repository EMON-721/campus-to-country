'use client';
import {useEffect,useState} from 'react';
import {assistantRequest} from '@/lib/assistant-client';
import BankWorkspace from './workspace';
export function BankStatements({path}:{path:string}){
 const [dark,setDark]=useState(false);
 const [user,setUser]=useState<{name:string;email:string;admin:boolean}|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{try{setDark(localStorage.getItem('ctc-bank-theme')==='dark')}catch{}let active=true;(async()=>{try{const d=await assistantRequest('/api/v1/auth/me');const role=await fetch('/api/v1/admin/gemini',{cache:'no-store'});if(active)setUser({email:d.user.email,name:"Your workspace",admin:role.ok})}catch(e){if(active)setError((e as Error).message)}finally{if(active)setLoading(false)}})();return()=>{active=false}},[]);
 if(loading)return <p role="status">Loading Bank Statements…</p>;
 if(!user)return <section className="card"><h1>Bank Statements</h1><p role="alert">{error||'Sign in to your private financial workspace.'}</p><a className="button" href="/api/v1/auth/google">Sign in with Google</a></section>;
 return <div className={'bank-scope'+(dark?' dark':'')}><BankWorkspace key={path} route={path.split('/')[2]||'dashboard'} user={user} dark={dark} setDark={setDark}/></div>;
}
