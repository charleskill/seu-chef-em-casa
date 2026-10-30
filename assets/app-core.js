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
const FREQ={semanal:{label:'Semanal',perMonth:4},quinzenal:{label:'Quinzenal',perMonth:2},mensal:{label:'Mensal',perMonth:1}};
const MODOS={entrega:'Entrega das marmitas prontas',casa:'Preparo na minha casa'};
const DIAS=[['seg','Seg'],['ter','Ter'],['qua','Qua'],['qui','Qui'],['sex','Sex'],['sab','Sáb'],['dom','Dom']];
const money2=n=>Math.round(n*100)/100;
const brl=n=>Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
function cleanKits(k){
  if(!Array.isArray(k))return [];
  return k.map(x=>{
    if(!x||typeof x!=='object')return null;
    const name=String(x.name||'').trim().slice(0,60),items={};
    Object.entries(x.items&&typeof x.items==='object'?x.items:{}).forEach(([id,q])=>{const n=Math.floor(Number(q));if(id&&n>=1&&n<=500)items[String(id)]=n});
    return name&&Object.keys(items).length?{id:String(x.id||name).slice(0,40),name,items}:null;
  }).filter(Boolean).slice(0,6);
}
function cleanMarmita(m){
  if(!m||typeof m!=='object')return null;
  const price=Number(m.price),min=Math.floor(Number(m.min));
  const freq=(Array.isArray(m.freq)?m.freq:[]).filter(f=>FREQ[f]).filter((f,i,a)=>a.indexOf(f)===i);
  const modes=(Array.isArray(m.modes)?m.modes:[]).filter(f=>MODOS[f]).filter((f,i,a)=>a.indexOf(f)===i);
  if(!(price>0&&price<=1000)||!(min>=1&&min<=500)||!freq.length||!modes.length)return null;
  const kits=cleanKits(m.kits);
  return kits.length?{price:money2(price),min,freq,modes,kits}:{price:money2(price),min,freq,modes};
}
function validateMarmita(m){
  if(!Number.isFinite(m.price)||m.price<=0||m.price>1000)return 'Informe o preço por marmita, de R$ 0,01 a R$ 1.000,00.';
  if(!Number.isInteger(m.min)||m.min<1||m.min>500)return 'Informe o mínimo de marmitas por entrega, de 1 a 500.';
  if(!(m.freq||[]).length)return 'Escolha ao menos uma frequência de entrega.';
  if(!(m.modes||[]).length)return 'Escolha ao menos uma forma de atendimento.';
  return '';
}
// Estimativa de referência. Considera 4 semanas por mês; não é preço final.
function marmitaEstimate(m,chef){
  const cfg=chef&&chef.marmita,f=FREQ[m&&m.freq];
  const unit=Number(cfg&&cfg.price),qty=Math.floor(Number(m&&m.qty)),months=Math.floor(Number(m&&m.months));
  if(!f||!(unit>0)||!(qty>=1)||!(months>=1))return null;
  const monthly=money2(unit*qty*f.perMonth);
  return {unit,qty,deliveries:f.perMonth,monthly,months,total:money2(monthly*months),units:qty*f.perMonth*months};
}
// Perfis de exemplo vêm sempre do código e nunca são gravados no navegador.
// Assim, desligar ou apagar a demonstração remove os perfis de qualquer navegador.
const isTransientDemo=c=>c&&c.isDemo===true&&c.id!=='demo-workspace';
function withDemo(data,demo){
  const keep=(data.chefs||[]).filter(c=>!isTransientDemo(c));
  const add=(Array.isArray(demo)?demo:[]).filter(c=>c&&typeof c.id==='string'&&typeof c.name==='string').map(c=>({...c,isDemo:true}));
  return {...data,chefs:[...keep,...normalizeData({chefs:add},add).chefs]};
}
function stripDemo(data){return {...data,chefs:(data.chefs||[]).filter(c=>!isTransientDemo(c))}}
const OPCOES=[
  ['criancas','Atendo eventos com crianças','Quem não marcar não verá o campo de crianças no pedido.',true],
  ['compras','Faço as compras dos ingredientes','O cliente poderá pedir esse serviço no orçamento.',true],
  ['limpeza','Deixo a cozinha limpa ao final','O cliente poderá pedir a limpeza no orçamento.',true],
  ['utensilios','Levo meus utensílios e equipamentos','Aparece no seu perfil como diferencial.',true],
  ['garcom','Ofereço serviço de mesa (garçom)','Aparece no seu perfil como diferencial.',false],
  ['grupos','Atendo grupos grandes (mais de 20 pessoas)','Aparece no seu perfil como diferencial.',false],
  ['fds','Atendo fins de semana e feriados','Aparece no seu perfil.',true],
  ['viagem','Atendo outras cidades (com taxa de deslocamento)','Aparece no seu perfil.',false],
  ['r_gluten','Cozinho sem glúten','Mostra a opção no pedido do cliente.',true],
  ['r_lactose','Cozinho sem lactose','Mostra a opção no pedido do cliente.',true],
  ['r_vegetariano','Cozinho pratos vegetarianos','Mostra a opção no pedido do cliente.',true],
  ['r_vegano','Cozinho pratos veganos','Mostra a opção no pedido do cliente.',true],
  ['r_mar','Cuido de alergia a frutos do mar','Mostra a opção no pedido do cliente.',true]
];
const RESTR={'Sem glúten':'r_gluten','Sem lactose':'r_lactose','Vegetariano':'r_vegetariano','Vegano':'r_vegano','Alergia a frutos do mar':'r_mar'};
const opcoes=c=>{const o=c&&c.opcoes&&typeof c.opcoes==='object'?c.opcoes:{};const r={};OPCOES.forEach(([k,,,d])=>{r[k]=typeof o[k]==='boolean'?o[k]:d});return r};
const cleanOpcoes=o=>{if(!o||typeof o!=='object')return null;const r={};OPCOES.forEach(([k])=>{if(typeof o[k]==='boolean')r[k]=o[k]});return Object.keys(r).length?r:null};
const cleanAgenda=a=>{if(!a||!Array.isArray(a.off))return null;const off=[...new Set(a.off.filter(d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)))].sort().slice(-400);return off.length?{off}:null};
const isFree=(c,date)=>!date||!(c&&c.agenda&&Array.isArray(c.agenda.off)&&c.agenda.off.includes(date));
const mapsUrl=q=>{q=String(q||'').trim();return q?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q):''};
function normalizeData(data,seed){
  const source=Array.isArray(data?.chefs)?data.chefs:seed;
  const chefs=source.filter(c=>c&&typeof c.id==='string'&&typeof c.name==='string').map(c=>({...c,
    isDemo:c.isDemo??seed.some(s=>s.id===c.id),
    gallery:(Array.isArray(c.gallery)?c.gallery:[]).filter(p=>p&&p.id!=null&&typeof p.url==='string'),
    dishes:(Array.isArray(c.dishes)?c.dishes:[]).filter(d=>d&&d.id!=null&&typeof d.name==='string').map(d=>{const x={...d,price:Number.isFinite(Number(d.price))&&Number(d.price)>=0?Number(d.price):0};if(x.marmita!==true)delete x.marmita;return x})
  })).map(c=>{const m=cleanMarmita(c.marmita);if(m)c.marmita=m;else delete c.marmita;const op=cleanOpcoes(c.opcoes);if(op)c.opcoes=op;else delete c.opcoes;const ag=cleanAgenda(c.agenda);if(ag)c.agenda=ag;else delete c.agenda;return c});
  return {version:4,chefs,messages:(Array.isArray(data?.messages)?data.messages:[]).filter(m=>m&&typeof m.chefId==='string'&&typeof m.text==='string'),orders:Array.isArray(data?.orders)?data.orders:[],name:String(data?.name||''),visitorId:typeof data?.visitorId==='string'?data.visitorId:'',draft:data?.draft&&typeof data.draft==='object'?data.draft:null};
}
function readData(storage,seed){
  const current=storage.getItem('scf4_store');if(current)return normalizeData(JSON.parse(current),seed);
  const chefs=storage.getItem('scf3_db'),messages=storage.getItem('scf3_msgs');
  return normalizeData({chefs:chefs?JSON.parse(chefs):seed,messages:messages?JSON.parse(messages):[],name:storage.getItem('scf3_name')||''},seed);
}
function persist(storage,data){storage.setItem('scf4_store',JSON.stringify(data))}
function buildMarmitaText(c,o){
  const f=o.f,m=o.m||{},e=marmitaEstimate(m,c),mix=m.mix&&typeof m.mix==='object'?m.mix:{},pr=c.dishes.filter(d=>o.dishes.includes(d.id)).map(d=>'- '+(mix[String(d.id)]?mix[String(d.id)]+'x ':'')+d.name).join('\n');
  const dias=DIAS.filter(([k])=>(m.days||[]).includes(k)).map(x=>x[1]).join(', ');
  const meses=m.months===1?'1 mês':m.months+' meses';
  return `*PEDIDO DE ORÇAMENTO — ${c.name}*\n*Plano de marmitas*\n\nCliente: ${f.name.trim()}\nTelefone: ${f.phone.trim()}${f.email?'\nE-mail: '+f.email.trim():''}\nInício desejado: ${f.date?f.date.split('-').reverse().join('/'):'A combinar'}\nLocal: ${f.local||'A combinar'}${f.local&&f.local.trim()?'\nMapa: '+mapsUrl(f.local):''}\nPessoas atendidas: ${o.adults} adultos e ${o.kids} crianças\nFrequência: ${(FREQ[m.freq]||{}).label||'A combinar'}\nMarmitas por entrega: ${m.qty}\nDuração do plano: ${meses}\nForma de atendimento: ${MODOS[m.way]||'A combinar'}\nDias preferidos: ${dias||'A combinar'}\nServiços solicitados: ${[o.shop?'Compras dos ingredientes':'',o.clean?'Limpeza ao final':''].filter(Boolean).join(', ')||'A combinar'}\nRestrições e preferências: ${o.chips.concat(f.allergies?[f.allergies]:[]).join(', ')||'Nenhuma informada'}\n\n${Object.keys(mix).length?'Marmitas escolhidas por entrega':'Pratos de interesse'}:\n${pr}\n\n${e?`Estimativa de referência: ${brl(e.monthly)} por mês (${e.qty*e.deliveries} marmitas × ${brl(e.unit)})${e.months>1?'; plano de '+meses+': '+brl(e.total):''}.\n`:''}Valores, serviços e disponibilidade a confirmar com o chef.\nSeu Chef em Casa`;
}
function buildOrderText(c,o){if(o.mode==='marmita'&&c.marmita)return buildMarmitaText(c,o);const f=o.f,pr=c.dishes.filter(d=>o.dishes.includes(d.id)).map(d=>'- '+d.name).join('\n');return `*PEDIDO DE ORÇAMENTO — ${c.name}*\n\nCliente: ${f.name.trim()}\nTelefone: ${f.phone.trim()}${f.email?'\nE-mail: '+f.email.trim():''}\nData: ${f.date?f.date.split('-').reverse().join('/'):'A combinar'}\nEvento: ${f.type||'Jantar a dois'}\nLocal: ${f.local||'A combinar'}${f.local&&f.local.trim()?'\nMapa: '+mapsUrl(f.local):''}\nConvidados: ${o.adults} adultos e ${o.kids} crianças\nServiços solicitados: ${[o.shop?'Compras dos ingredientes':'',o.clean?'Limpeza ao final':''].filter(Boolean).join(', ')||'A combinar'}\nRestrições e preferências: ${o.chips.concat(f.allergies?[f.allergies]:[]).join(', ')||'Nenhuma informada'}\n\nPratos:\n${pr}\n\nValores, serviços e disponibilidade a confirmar com o chef.\nSeu Chef em Casa`}
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
const api={norm,email,validEmail,safeUrl,phone,parsePrice,validateProfile,normalizeData,readData,persist,buildOrderText,passwordRecord,verifyPassword,FREQ,MODOS,DIAS,cleanMarmita,validateMarmita,marmitaEstimate,withDemo,stripDemo,OPCOES,RESTR,opcoes,cleanOpcoes,mapsUrl,cleanAgenda,isFree,cleanKits};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChefCore=api;
})(typeof window!=='undefined'?window:globalThis);
