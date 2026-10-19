import {customizationSchema,defaultCustomization} from './site-customization';
import {noticeSchema,defaultNotice} from './site-notice';
import {z} from 'zod';
import {moduleNavigation,legacyNavigationRoutes} from './module-navigation';
import {brand,modules} from './brand';
import {compareCountries} from './country-order';
import {destinations} from './catalog';
const route=z.string().regex(/^\/(?!\/)[a-zA-Z0-9/_-]*$/).max(100);
const https=z.string().refine(v=>!v||/^https:\/\//.test(v),'Use an HTTPS URL');
export const siteSettingsSchema=z.object({
 customization:customizationSchema,
 notice:noticeSchema,
 brand:z.object({name:z.string().min(1).max(80),email:z.string().email(),copyright:z.string().min(1).max(100).transform(v=>/^emon\s*hossain$/i.test(v.trim())?'Campus to Country':v)}),
 modules:z.array(z.object({href:z.enum(['/countries','/ielts','/visafund','/visa','/applicant/dashboard','/counseling']),name:z.string().min(1).max(60),label:z.string().max(160),text:z.string().max(1000),icon:z.string().max(20),enabled:z.boolean()})).length(6).refine(a=>new Set(a.map(m=>m.href)).size===6,'Keep all six modules').transform(rows=>rows.map(m=>m.href==='/countries'&&/^(Country\s*(?:&|and)\s*Campus|Country and campus)$/i.test(m.name.trim())?{...m,name:'Universities'}:m)),
 countries:z.array(z.object({name:z.string().min(1).max(100),code:z.string().length(2),route:z.string().regex(/^[a-z0-9-]+$/),region:z.string().max(50),url:https,portal:z.string().max(200),note:z.string().max(2000),enabled:z.boolean()})).max(250).refine(a=>new Set(a.map(c=>c.route)).size===a.length,'Country routes must be unique'),
 navigation:z.array(z.object({module:z.enum(['countries','ielts','visa','workspace','counseling']),route,label:z.string().min(1).max(100),enabled:z.boolean(),order:z.number().int().min(0).max(500)})).max(500).refine(rows=>rows.every(row=>(moduleNavigation[row.module]?.some(([,path])=>path===row.route)||legacyNavigationRoutes[row.module]?.includes(row.route))),'Choose a registered user page').refine(rows=>new Set(rows.map(r=>r.module+':'+r.route)).size===rows.length,'Navigation entries must be unique').default([]),
 pages:z.array(z.object({route:route.refine(v=>!/^\/(admin|api|login|register|recover|account-security|account-status)(\/|$)/.test(v),'Authentication and administrator routes stay available'),enabled:z.boolean(),message:z.string().max(1000)})).max(300),
 theme:z.object({header:z.string().regex(/^#[0-9a-fA-F]{6}$/),canvas:z.string().regex(/^#[0-9a-fA-F]{6}$/),ink:z.string().regex(/^#[0-9a-fA-F]{6}$/),accent:z.string().regex(/^#[0-9a-fA-F]{6}$/),fontSize:z.number().int().min(16).max(22)}),
});
export type SiteSettings=z.infer<typeof siteSettingsSchema>;
export const defaultSiteSettings:SiteSettings= {customization:customizationSchema.parse(undefined),notice:defaultNotice,navigation:[],brand,modules:modules.map(m=>({...m,enabled:true})),countries:[...destinations].sort((a,b)=>compareCountries(a.name,b.name)).map(c=>({...c,enabled:true})),pages:[],theme:{header:'#d2e3df',canvas:'#e6eeeb',ink:'#173b43',accent:'#205d56',fontSize:17}};
export function disabledPage(settings:SiteSettings,path:string){const nav=settings.navigation.find(n=>n.route===path&&!n.enabled);if(nav)return nav.label+' is temporarily suspended.';const page=settings.pages.find(p=>p.route===path&&!p.enabled);if(page)return page.message||'This page is temporarily suspended.';const ownedModule=['/institutions','/programmes','/programmes/compare','/scholarships','/admission-guide'].includes(path)?'/countries':undefined;const mod=settings.modules.find(m=>m.href===ownedModule||path===m.href||path.startsWith((m.href==='/applicant/dashboard'?'/applicant':m.href)+'/'));if(mod&&!mod.enabled)return mod.name+' is temporarily suspended.';return null}
