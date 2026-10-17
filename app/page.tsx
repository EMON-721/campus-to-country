import Platform from './platform';
import {readPageSettings} from '@/lib/site-settings-server';
export const dynamic='force-dynamic';
export default async function Home(){return <Platform path="/" initialSettings={await readPageSettings()}/>}
