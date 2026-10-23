import {drizzle} from 'drizzle-orm/libsql';
import {sqlClient} from '@/lib/sql-database';
import * as schema from './schema';
export function getDb(){return drizzle(sqlClient(),{schema})}
