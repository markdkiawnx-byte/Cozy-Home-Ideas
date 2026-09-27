const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || 'cozy-images';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const SESSION_SECRET = process.env.SESSION_SECRET || '';

function json(res, status, body) {
  res.status(status).setHeader('Content-Type','application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}
function cookieOptions(maxAge=60*60*24*7){
  return `Path=/; HttpOnly; SameSite=Lax; ${process.env.VERCEL ? 'Secure; ' : ''}Max-Age=${maxAge}`;
}
function sign(value){return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('base64url');}
function makeSession(){const payload=Buffer.from(JSON.stringify({admin:true,iat:Date.now()})).toString('base64url');return `${payload}.${sign(payload)}`;}
function validSession(req){
  const raw=req.headers.cookie||''; const m=raw.match(/(?:^|;\s*)chi_admin=([^;]+)/); if(!m)return false;
  const [payload,sig]=m[1].split('.'); if(!payload||!sig)return false;
  const expected=sign(payload); if(!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return false;
  try{const data=JSON.parse(Buffer.from(payload,'base64url').toString()); return data.admin===true && Date.now()-data.iat < 1000*60*60*24*7;}catch{return false;}
}
function requireAdmin(req,res){if(!validSession(req)){json(res,401,{error:'Unauthorized'});return false;}return true;}
async function sb(path, options={}){
  const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...options,headers:{apikey:SERVICE_KEY,Authorization:`Bearer ${SERVICE_KEY}`,Prefer:'return=representation',...(options.headers||{})}});
  const text=await r.text(); let data; try{data=JSON.parse(text)}catch{data=text}
  if(!r.ok) throw new Error(typeof data==='string'?data:(data.message||data.error||JSON.stringify(data)));
  return data;
}
function publicUrl(path){return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;}
module.exports={json,sb,requireAdmin,validSession,makeSession,cookieOptions,publicUrl,BUCKET,ADMIN_PASSWORD,SUPABASE_URL,SERVICE_KEY};
