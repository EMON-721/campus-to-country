import {createClient,type Client,type InValue,type ResultSet} from '@libsql/client';
let client:Client|undefined;
export function sqlClient(){
 if(!client){const url=process.env.TURSO_DATABASE_URL;if(!url)throw new Error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in the server environment');if(process.env.VERCEL&&url.startsWith('file:'))throw new Error('Vercel requires a remote database; local files are not persistent');client=createClient({url,authToken:process.env.TURSO_AUTH_TOKEN,intMode:'number'})}
 return client;
}
export type SqlResult<T=Record<string,unknown>>={results:T[];success:boolean;meta:{changes:number;last_row_id:number}};
function result<T>(r:ResultSet):SqlResult<T>{return {results:r.rows.map(row=>Object.fromEntries(Object.entries(row))) as T[],success:true,meta:{changes:r.rowsAffected,last_row_id:Number(r.lastInsertRowid||0)}}}
export class SqlStatement{
 constructor(readonly sql:string,readonly args:InValue[]=[],private readonly connect:()=>Client=sqlClient){}
 bind(...args:unknown[]){return new SqlStatement(this.sql,args.map(value=>value===undefined?null:typeof value==='boolean'?Number(value):value as InValue),this.connect)}
 async all<T=Record<string,unknown>>(){return result<T>(await this.connect().execute({sql:this.sql,args:this.args}))}
 async run<T=Record<string,unknown>>(){return this.all<T>()}
 async first<T=Record<string,unknown>>(column?:string):Promise<T|null>{const row=(await this.all<T>()).results[0];return row?(column?(row as Record<string,unknown>)[column] as T:row):null}
 async raw<T=unknown[]>(){const rows=await this.connect().execute({sql:this.sql,args:this.args});return rows.rows.map(row=>rows.columns.map(c=>row[c])) as T[]}
}
export class SqlDatabase{
 constructor(private readonly connect:()=>Client=sqlClient){}
 prepare(sql:string){return new SqlStatement(sql,[],this.connect)}
 async batch<T=Record<string,unknown>>(statements:SqlStatement[]){if(!statements.length)return [];return (await this.connect().batch(statements.map(s=>({sql:s.sql,args:s.args})),'write')).map(r=>result<T>(r))}
 async exec(sql:string){await this.connect().executeMultiple(sql);return {count:0,duration:0}}
}
