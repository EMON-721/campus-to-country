import {env} from 'cloudflare:workers';
import {defaultSiteSettings,siteSettingsSchema} from './site-settings';
export async function readSiteSettings(){if(!env.DB)return {settings:defaultSiteSettings,revision:''};const row=await env.DB.prepare("SELECT body,updated FROM platform_content WHERE id='site-settings'").first<{body:string;updated:string}>();return row?{settings:siteSettingsSchema.parse(JSON.parse(row.body)),revision:row.updated}:{settings:defaultSiteSettings,revision:''}}

// Server-render public defaults without serialising members-only page bodies to visitors.
export async function readPageSettings(){const {settings}=await readSiteSettings();return {...settings,customization:{...settings.customization,customPages:settings.customization.customPages.map(p=>p.signedInOnly?{...p,description:'',blocks:[]}:p)}}}
