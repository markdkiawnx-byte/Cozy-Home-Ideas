const {json,requireAdmin,SUPABASE_URL,SERVICE_KEY,BUCKET,publicUrl}=require('./_lib');
module.exports=async(req,res)=>{
 try{
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed'});
  if(!requireAdmin(req,res))return;
  let body={};try{body=typeof req.body==='string'?JSON.parse(req.body):req.body||{}}catch{return json(res,400,{error:'Invalid JSON'});}
  const dataUrl=String(body.dataUrl||'');
  const m=dataUrl.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/);
  if(!m)return json(res,400,{error:'Please send a JPEG, PNG, WEBP or GIF image.'});
  const ext={ 'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'}[m[1]];
  const buf=Buffer.from(m[2],'base64');
  if(buf.length>4*1024*1024)return json(res,413,{error:'Image is too large. Please use an image under 4 MB.'});
  const path=`posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const r=await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`,{method:'POST',headers:{apikey:SERVICE_KEY,Authorization:`Bearer ${SERVICE_KEY}`,'Content-Type':m[1],'x-upsert':'true'},body:buf});
  if(!r.ok){const t=await r.text();throw new Error(t);}
  return json(res,200,{url:publicUrl(path)});
 }catch(e){return json(res,500,{error:e.message});}
};
