import Platform from '../platform';
import {readPageSettings} from '@/lib/site-settings-server';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{slug?:string[]}>}){const {slug=[]}=await params;return <Platform path={'/'+slug.join('/')} initialSettings={await readPageSettings()}/>}
