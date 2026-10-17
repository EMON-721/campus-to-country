'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import {defaultSiteSettings,SiteSettings,siteSettingsSchema} from '@/lib/site-settings';
export const SettingsContext=createContext<SiteSettings>(defaultSiteSettings);
export const useSiteSettings=()=>useContext(SettingsContext);
export function useSettingsLoader(initialSettings?:SiteSettings){const [settings,setSettings]=useState(initialSettings||defaultSiteSettings);useEffect(()=>{let live=true;fetch('/api/v1/site-settings',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then((d:any)=>{if(live)setSettings(siteSettingsSchema.parse(d.settings))}).catch(()=>{});return()=>{live=false}},[]);return settings}
export function SiteAppearance(){const s=useSiteSettings();useEffect(()=>{document.title=s.brand.name},[s.brand.name]);return <style>{`body{background:${s.theme.canvas}!important;color:${s.theme.ink};font-size:${s.theme.fontSize}px}.header.header.header,.header.header.header .main-nav.open{background:${s.theme.header}!important}.header.header.header .button{background:${s.theme.accent}!important;border-color:${s.theme.accent}!important}`}</style>}
