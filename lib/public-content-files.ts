import {z} from 'zod';
export const publicContentFiles=z.array(z.object({label:z.string().trim().min(1).max(250),url:z.string().max(2048).refine(v=>/^https:\/\//.test(v)&&URL.canParse(v)||/^\/api\/v1\/site-assets\?id=[a-f0-9-]{36}$/i.test(v)||/^\/ielts-content\/[^\s\\]+$/.test(v),'Use a public HTTPS URL or public content asset')}).strict()).max(20);
