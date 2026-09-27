const {json,sb,requireAdmin}=require('./_lib');
module.exports=async(req,res)=>{
  try{
    if(req.method==='GET'){
      const data=await sb('posts?select=*&order=created_at.desc');
      return json(res,200,data.map(p=>({id:p.id,title:p.title,group:p.group_name,style:p.style,budget:p.budget,time:p.time_text,rating:Number(p.rating),image:p.image_url,desc:p.description,tags:p.tags||[]})));
    }
    if(!requireAdmin(req,res)) return;
    let body={}; try{body=typeof req.body==='string'?JSON.parse(req.body):req.body||{}}catch(e){return json(res,400,{error:'Invalid JSON'});}
    if(req.method==='POST'){
      const rows=await sb('posts',{method:'POST',body:JSON.stringify({title:body.title,group_name:body.group,style:body.style,budget:body.budget,time_text:body.time,rating:Number(body.rating)||4.8,image_url:body.image,description:body.desc||'',tags:Array.isArray(body.tags)?body.tags:[]}),headers:{'Content-Type':'application/json'}});
      return json(res,201,rows[0]);
    }
    const id=new URL(req.url,`https://${req.headers.host}`).searchParams.get('id'); if(!id)return json(res,400,{error:'Missing id'});
    if(req.method==='PUT'){
      const rows=await sb(`posts?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({title:body.title,group_name:body.group,style:body.style,budget:body.budget,time_text:body.time,rating:Number(body.rating)||4.8,image_url:body.image,description:body.desc||'',tags:Array.isArray(body.tags)?body.tags:[],updated_at:new Date().toISOString()}),headers:{'Content-Type':'application/json'}});
      return json(res,200,rows[0]||{});
    }
    if(req.method==='DELETE'){await sb(`posts?id=eq.${encodeURIComponent(id)}`,{method:'DELETE'});return json(res,200,{ok:true});}
    return json(res,405,{error:'Method not allowed'});
  }catch(e){return json(res,500,{error:e.message});}
};
