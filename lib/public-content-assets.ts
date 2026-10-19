import {APIError} from './backend';
export const publicAssetTypes=['image/png','image/jpeg','image/webp','application/pdf','text/plain','application/vnd.openxmlformats-officedocument.wordprocessingml.document','audio/mpeg','audio/wav','audio/webm','video/mp4','video/webm'];
export async function readUpload(req:Request,max:number){
 if(Number(req.headers.get('content-length')||0)>max)throw new APIError(413,'Upload is too large');const reader=req.body?.getReader();if(!reader)throw new APIError(400,'Choose a file');const chunks:Uint8Array[]=[];let size=0;
 while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>max){await reader.cancel();throw new APIError(413,'Upload is too large')}chunks.push(part.value)}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}return bytes;
}
export function validatePublicAsset(type:string,bytes:Uint8Array){
 const max=(type.startsWith('image/')?8:12)*1024*1024;if(!publicAssetTypes.includes(type)||!bytes.length||bytes.length>max)throw new APIError(400,'Use an image up to 8 MB, or PDF, Word, text, audio or video up to 12 MB');
 const text=(a:number,b:number)=>new TextDecoder().decode(bytes.slice(a,b)),starts=(values:number[])=>values.every((v,i)=>bytes[i]===v);
 if(type==='image/png'&&!starts([137,80,78,71,13,10,26,10])||type==='image/jpeg'&&!starts([255,216,255])||type==='image/webp'&&!(text(0,4)==='RIFF'&&text(8,12)==='WEBP')||type==='application/pdf'&&text(0,5)!=='%PDF-'||type==='audio/mpeg'&&!(text(0,3)==='ID3'||bytes[0]===255&&(bytes[1]&224)===224)||type==='audio/wav'&&!(text(0,4)==='RIFF'&&text(8,12)==='WAVE')||['audio/webm','video/webm'].includes(type)&&!starts([26,69,223,163])||type==='video/mp4'&&text(4,8)!=='ftyp')throw new APIError(400,'File contents do not match the selected format');
 if(type==='text/plain'){try{if(new TextDecoder('utf-8',{fatal:true}).decode(bytes).includes('\u0000'))throw Error('Binary text')}catch{throw new APIError(400,'Use UTF-8 text')}}
 if(type.includes('wordprocessingml')&&(!starts([80,75])||!text(0,bytes.length).includes('[Content_Types].xml')||!text(0,bytes.length).includes('word/document.xml')))throw new APIError(400,'Choose an actual Word document');
}
