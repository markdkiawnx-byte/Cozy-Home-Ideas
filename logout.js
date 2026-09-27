const {json,cookieOptions}=require('./_lib');
module.exports=async(req,res)=>{res.setHeader('Set-Cookie',`chi_admin=; ${cookieOptions(0)}`);return json(res,200,{ok:true});};
