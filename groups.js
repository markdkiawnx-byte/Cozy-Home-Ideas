const {json,sb,requireAdmin}=require('./_lib');
module.exports=async(req,res)=>{
 try{
  if(req.method==='GET'){
   const rows=await sb('site_groups?select=*&order=sort_order.asc');
   return json(res,200,rows.map(g=>({id:g.id,name:g.name,icon:g.icon,count:0,sort_order:g.sort_order})));
  }
  if(!requireAdmin(req,res))return;
  let body={};try{body=typeof req.body==='string'?JSON.parse(req.body):req.body||{}}catch{return json(res,400,{error:'Invalid JSON'});}
  if(req.method==='POST'){
   const rows=await sb('site_groups',{method:'POST',body:JSON.stringify({name:body.name,icon:body.icon||'🏡',sort_order:Number(body.sort_order)||0}),headers:{'Content-Type':'application/json'}});return json(res,201,rows[0]);
  }
  const id=new URL(req.url,`https://${req.headers.host}`).searchParams.get('id');if(!id)return json(res,400,{error:'Missing id'});
  if(req.method==='PUT'){const rows=await sb(`site_groups?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({name:body.name,icon:body.icon||'🏡',sort_order:Number(body.sort_order)||0}),headers:{'Content-Type':'application/json'}});return json(res,200,rows[0]||{});}
  if(req.method==='DELETE'){await sb(`site_groups?id=eq.${encodeURIComponent(id)}`,{method:'DELETE'});return json(res,200,{ok:true});}
  return json(res,405,{error:'Method not allowed'});
 }catch(e){return json(res,500,{error:e.message});}
};
