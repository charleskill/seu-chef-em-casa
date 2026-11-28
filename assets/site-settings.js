(function(root){
'use strict';
const defaults={heroTitle:'Boa comida. Boas histórias.',heroText:'Encontre um personal chef para transformar um encontro em casa em uma experiência especial.',heroImage:'/assets/capa/jantar-no-quintal-2.webp',heroCaption:'O cuidado começa antes do primeiro prato.',ctaTitle:'Seu talento merece uma vitrine.',ctaText:'Organize seu portfólio e apresente sua cozinha.',contactEmail:'',supportWhatsapp:'',instagram:'https://www.instagram.com/seuchefemcasaoficial/',facebook:'',tiktok:''};
const fields={heroTitle:['Título da página inicial',100],heroText:['Apresentação da página inicial',400],heroImage:['Endereço da imagem de capa (Unsplash)',500],heroCaption:['Legenda da capa',160],ctaTitle:['Título do convite aos chefs',120],ctaText:['Texto do convite aos chefs',300],contactEmail:['E-mail de contato',160],supportWhatsapp:['WhatsApp de suporte com DDD',30],instagram:['Link do Instagram',300],facebook:['Link do Facebook',300],tiktok:['Link do TikTok',300]};
function clean(input){
 const out={};
 for(const [key,[label,max]] of Object.entries(fields)){
  const v=String(input?.[key]??defaults[key]).trim();
  if(v.length>max)throw new Error(label+': texto longo demais.');
  if(['heroTitle','heroText','heroImage','ctaTitle'].includes(key)&&!v)throw new Error('Preencha '+label.toLowerCase()+'.');
  if(key==='contactEmail'&&v&&!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v))throw new Error('Confira o e-mail de contato.');
  if(key==='supportWhatsapp'&&v&&!/^(?:55)?[1-9]\d{9,10}$/.test(v.replace(/\D/g,'')))throw new Error('Confira o WhatsApp de suporte com DDD.');
  if(['heroImage','instagram','facebook','tiktok'].includes(key)&&v&&!(key==='heroImage'&&v===defaults.heroImage)){
   let u;try{u=new URL(v)}catch{throw new Error(label+': informe um endereço completo com https://.');}
   const allowed={heroImage:['images.unsplash.com'],instagram:['instagram.com','www.instagram.com'],facebook:['facebook.com','www.facebook.com'],tiktok:['tiktok.com','www.tiktok.com']};
   if(u.protocol!=='https:'||u.username||u.password||!allowed[key].includes(u.hostname))throw new Error(label+': domínio não permitido.');
  }
  out[key]=v;
 }
 return out;
}
// Ajustes dos serviços feitos pela equipe: descrição, foto e se aparece no site. O nome não muda, porque liga o serviço aos chefs.
const FOTO_LOCAL=/^\/?assets\/servicos\/[a-z0-9-]+\.webp$/;
function cleanServicos(input){
 if(!input||typeof input!=='object'||Array.isArray(input))return {};
 const out={},entries=Object.entries(input);
 if(entries.length>200)throw new Error('Serviços demais.');
 for(const [nome,v] of entries){
  const n=String(nome).trim();if(!n||n.length>80||!v||typeof v!=='object')continue;
  const x={},desc=String(v.desc??'').trim(),foto=String(v.foto??'').trim();
  if(desc.length>200)throw new Error(n+': descrição longa demais (até 200 caracteres).');
  if(desc)x.desc=desc;
  if(foto){
   if(!FOTO_LOCAL.test(foto)){let u;try{u=new URL(foto)}catch{throw new Error('Confira a foto de '+n+': use um endereço com https://.');}
    if(u.protocol!=='https:'||u.username||u.password||u.hostname!=='images.unsplash.com')throw new Error('Confira a foto de '+n+': use uma foto do site ou do Unsplash.');}
   x.foto=foto;
  }
  if(v.oculto===true)x.oculto=true;
  if(Object.keys(x).length)out[n]=x;
 }
 return out;
}
const api={defaults,fields,clean,cleanServicos};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChefSite=api;
})(typeof window!=='undefined'?window:globalThis);
