import {isVisibleCountry} from "./country-visibility";
import institutions from './directories/institutions.json';
export const institutionSeeds=institutions;
export function institutionKey(row:{payload:Record<string,any>}){const p=row.payload;return String(p.country).toLowerCase()+'|'+String(p.name).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'')}
export function mergeInstitutions(rows:any[],editing=false){const saved=rows.filter(r=>r.kind==='institution'),savedIds=new Set(saved.map(r=>r.id)),savedKeys=new Set(saved.map(institutionKey));return [...rows,...institutionSeeds.filter(r=>!savedIds.has(r.id)&&!savedKeys.has(institutionKey(r)))].filter(r=>editing||(r.published&&(!r.payload.country||isVisibleCountry(r.payload.country))))}
