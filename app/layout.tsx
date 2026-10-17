import {readSiteSettings} from '@/lib/site-settings-server';
import {SiteNotice} from './site-notice';
import type { Metadata } from "next";
import "./globals.css";
import "./bank/bank.css";
import {FloatingAssistant} from "./floating-assistant";
const fallbackMetadata:Metadata={title:"Campus to Country",description:"Your study abroad journey, connected. Countries, IELTS, Bank Statements and your private applicant workspace.",icons:{icon:"/favicon.svg"}};
export async function generateMetadata():Promise<Metadata>{try{const {settings}=await readSiteSettings();return {...fallbackMetadata,title:settings.brand.name,icons:{icon:settings.customization.faviconUrl}}}catch{return fallbackMetadata}}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<FloatingAssistant/><SiteNotice/></body></html>}
