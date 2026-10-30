/* Pure helpers shared by the prototype and its Node tests. No backend authentication. */
(function(root){
'use strict';
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const email=v=>String(v||'').trim().toLowerCase();
const validEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||'').trim());
function safeUrl(value,image=false){
  const v=String(value||'').trim();
  if(image&&/^data:image\/(jpeg|png|webp|gif);base64,[a-z\d+/=\s]+$/i.test(v))return v;
  try{const u=new URL(v);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return ''}
}
function phone(value){
  const v=String(value||'').trim();if(!/^[+\d\s().-]+$/.test(v))return '';
  let n=v.replace(/\D/g,'');if(n.startsWith('55')&&n.length>11)n=n.slice(2);
  return /^[1-9]\d{9,10}$/.test(n)?'55'+n:'';
}
function parsePrice(value){
  if(typeof value==='number')return Number.isFinite(value)&&value>=0?value:NaN;
  const s=String(value??'').trim().replace(/^R\$\s*/,'');
  if(/^(\d{1,3}(\.\d{3})+|\d+)(,\d{1,2})?$/.test(s))return Number(s.replace(/\./g,'').replace(',','.'));
  if(/^\d+\.\d{1,2}$/.test(s))return Number(s);
  return NaN;
}
function validateProfile(p,others=[]){
  if(String(p.name||'').trim().length<2)return 'Informe um nome com pelo menos 2 caracteres.';
  if(!validEmail(p.email))return 'Confira o e-mail informado.';
  if(others.some(c=>c.id!==p.id&&email(c.email)===email(p.email)))return 'Este e-mail já está cadastrado.';
  if(p.whatsapp&&!phone(p.whatsapp))return 'Informe um WhatsApp válido com DDD.';
  if(p.instagram){try{const u=new URL(p.instagram);if(u.protocol!=='https:'||!['instagram.com','www.instagram.com'].includes(u.hostname))throw 0}catch{return 'Use um link https://instagram.com/seu.perfil.'}}
  return '';
}
function normalizeData(data,seed){
  const source=Array.isArray(data?.chefs)?data.chefs:seed;
  const chefs=source.filter(c=>c&&typeof c.id==='string'&&typeof c.name==='string').map(c=>({...c,
    isDemo:c.isDemo??seed.some(s=>s.id===c.id),
    gallery:(Array.isArray(c.gallery)?c.gallery:[]).filter(p=>p&&p.id!=null&&typeof p.url==='string'),
    dishes:(Array.isArray(c.dishes)?c.dishes:[]).filter(d=>d&&d.id!=null&&typeof d.name==='string').map(d=>({...d,price:Number.isFinite(Number(d.price))&&Number(d.price)>=0?Number(d.price):0}))
  }));
  return {version:4,chefs,messages:(Array.isArray(data?.messages)?data.messages:[]).filter(m=>m&&typeof m.chefId==='string'&&typeof m.text==='string'),orders:Array.isArray(data?.orders)?data.orders:[],name:String(data?.name||''),visitorId:typeof data?.visitorId==='string'?data.visitorId:'',draft:data?.draft&&typeof data.draft==='object'?data.draft:null};
}
function readData(storage,seed){
  const current=storage.getItem('scf4_store');if(current)return normalizeData(JSON.parse(current),seed);
  const chefs=storage.getItem('scf3_db'),messages=storage.getItem('scf3_msgs');
  return normalizeData({chefs:chefs?JSON.parse(chefs):seed,messages:messages?JSON.parse(messages):[],name:storage.getItem('scf3_name')||''},seed);
}
function persist(storage,data){storage.setItem('scf4_store',JSON.stringify(data))}
function buildOrderText(c,o){const f=o.f,pr=c.dishes.filter(d=>o.dishes.includes(d.id)).map(d=>'- '+d.name).join('\n');return `*PEDIDO DE ORÇAMENTO — ${c.name}*\n\nCliente: ${f.name.trim()}\nTelefone: ${f.phone.trim()}${f.email?'\nE-mail: '+f.email.trim():''}\nData: ${f.date?f.date.split('-').reverse().join('/'):'A combinar'}\nEvento: ${f.type||'Jantar a dois'}\nLocal: ${f.local||'A combinar'}\nConvidados: ${o.adults} adultos e ${o.kids} crianças\nServiços solicitados: ${[o.shop?'Compras dos ingredientes':'',o.clean?'Limpeza ao final':''].filter(Boolean).join(', ')||'A combinar'}\nRestrições e preferências: ${o.chips.concat(f.allergies?[f.allergies]:[]).join(', ')||'Nenhuma informada'}\n\nPratos:\n${pr}\n\nValores, serviços e disponibilidade a confirmar com o chef.\nSeu Chef em Casa`}
const hex=bytes=>Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');
async function passwordRecord(password,cryptoApi){
  const c=cryptoApi||root.crypto;if(!c?.subtle)throw new Error('Abra a versão HTTPS para criar sua conta local.');
  const salt=c.getRandomValues(new Uint8Array(16)),iterations=210000;
  const key=await c.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
  return {algorithm:'PBKDF2-SHA256',iterations,salt:hex(salt),hash:hex(await c.subtle.deriveBits({name:'PBKDF2',salt,iterations,hash:'SHA-256'},key,256))};
}
async function verifyPassword(password,account,cryptoApi){
  const c=cryptoApi||root.crypto,record=account.credential;
  if(record){if(record.algorithm!=='PBKDF2-SHA256'||!Number.isInteger(record.iterations)||record.iterations<100000||record.iterations>1000000||!/^[\da-f]{32}$/.test(record.salt))return false;
    if(!c?.subtle)throw new Error('Abra a versão HTTPS para entrar.');
    const key=await c.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
    const salt=Uint8Array.from(record.salt.match(/../g),x=>parseInt(x,16));return record.hash===hex(await c.subtle.deriveBits({name:'PBKDF2',salt,iterations:record.iterations,hash:'SHA-256'},key,256));}
  // Legacy hashes are accepted only for migration after a successful password check.
  if(!account.pass)return false;
  if(/^x\d+$/.test(account.pass)){let h=5381,t=account.id+':'+password;for(let i=0;i<t.length;i++)h=((h<<5)+h+t.charCodeAt(i))>>>0;return account.pass==='x'+h}
  if(!/^[a-f\d]{64}$/i.test(account.pass)||!c?.subtle)return false;
  return account.pass===hex(await c.subtle.digest('SHA-256',new TextEncoder().encode(account.id+':'+password)));
}
const api={norm,email,validEmail,safeUrl,phone,parsePrice,validateProfile,normalizeData,readData,persist,buildOrderText,passwordRecord,verifyPassword};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChefCore=api;
})(typeof window!=='undefined'?window:globalThis);
