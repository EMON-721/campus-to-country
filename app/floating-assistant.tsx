'use client';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import {MessageCircle,X} from 'lucide-react';
import {StudyAssistant} from './search-assistant';

export function FloatingAssistant(){
 const [open,setOpen]=useState(false),[opened,setOpened]=useState(false);
 const launcher=useRef<HTMLButtonElement>(null),closeButton=useRef<HTMLButtonElement>(null);
 const path=usePathname();
 function close(){setOpen(false);launcher.current?.focus()}
 useEffect(()=>{setOpen(false)},[path]);
 useEffect(()=>{if(!open)return;closeButton.current?.focus();const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();setOpen(false);launcher.current?.focus()}};document.addEventListener('keydown',escape);return()=>document.removeEventListener('keydown',escape)},[open]);
 return <aside className="floating-assistant" aria-label="Campus to Country AI assistant">
  {opened&&<div id="floating-ai-panel" className="floating-ai-panel" role="dialog" aria-labelledby="floating-ai-title" hidden={!open}>
   <header className="floating-ai-header"><div><strong id="floating-ai-title">Campus to Country AI</strong><span>Text chat & live voice</span></div><button ref={closeButton} type="button" aria-label="Close AI assistant and stop microphone" onClick={close}><X size={22}/></button></header>
   <div className="floating-ai-body"><StudyAssistant compact active={open}/></div>
  </div>}
  <button ref={launcher} type="button" className="floating-ai-launcher" aria-expanded={open} aria-controls={opened?'floating-ai-panel':undefined} onClick={()=>{if(open)close();else{setOpened(true);setOpen(true)}}}><MessageCircle size={23}/><span>{open?'Close AI':'Ask AI'}</span></button>
 </aside>
}
