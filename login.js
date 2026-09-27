const {json,makeSession,cookieOptions,ADMIN_PASSWORD}=require('./_lib');
module.exports=async(req,res)=>{
  if(req.method!=='POST') return json(res,405,{error:'Method not allowed'});
  let body={}; try{body=typeof req.body==='string'?JSON.parse(req.body):req.body||{}}catch{}
  if(!ADMIN_PASSWORD || body.password!==ADMIN_PASSWORD) return json(res,401,{error:'Incorrect password'});
  res.setHeader('Set-Cookie',`chi_admin=${makeSession()}; ${cookieOptions()}`);
  return json(res,200,{ok:true});
};
