import {moduleNavigation} from './module-navigation';
export const workspaceRecordKinds:Record<string,string[]>={
 '/applicant/dashboard':['profile','shortlist','application','event','checklist','attempt','study','question','settings','milestone'],
 '/applicant/scholarships':['shortlist','application','event'],'/applicant/notifications':['settings','application','event','checklist'],'/applicant/financial-preparation':['profile'],'/applicant/mentorship':['event'],'/applicant/profile':['profile'],'/applicant/shortlists':['shortlist'],'/applicant/applications':['application'],
 '/applicant/calendar':['event','milestone'],'/applicant/ielts-progress':['attempt','study','event','milestone','question','settings'],
 '/applicant/visa-journey':['checklist','application','event'],'/applicant/settings':['settings'],
};
export function workspaceControls(route:string){return {route,label:moduleNavigation.workspace.find(([,path])=>path===route)?.[0]||'Workspace records',kinds:workspaceRecordKinds[route]};}
// Newly registered Workspace navigation is listed by ModuleAdminSite automatically.
// A page without a record mapping uses the complete applicant-record manager, not a Profile fallback.
