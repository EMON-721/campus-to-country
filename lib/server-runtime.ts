import {SqlDatabase} from './sql-database';
import {ObjectStorage} from './object-storage';
// Lazy services: next build needs no database token, bucket or network connection.
export const database=process.env.TURSO_DATABASE_URL?new SqlDatabase():undefined;
export const objects=process.env.CTC_SUPABASE_URL&&process.env.CTC_SUPABASE_SERVICE_ROLE_KEY?new ObjectStorage():undefined;
