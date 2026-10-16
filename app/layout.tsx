import {SiteNotice} from './site-notice';
import type { Metadata } from "next";
import "./globals.css";
import "./bank/bank.css";
import {FloatingAssistant} from "./floating-assistant";
export const metadata:Metadata={title:"Campus to Country",description:"Your study abroad journey, connected. Countries, IELTS, Bank Statements and your private applicant workspace.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<FloatingAssistant/><SiteNotice/></body></html>}
