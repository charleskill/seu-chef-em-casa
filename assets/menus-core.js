/* Regras compartilhadas pelo editor, vitrine e servidor. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ChefMenusCore=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const occasions=['Natal','Réveillon','Páscoa','Dia das Mães','Dia dos Pais','Dia dos Namorados','Aniversário','Encontro especial'];
 const modes={casa:'Chef na sua casa',entrega:'Entrega',retirada:'Retirada'};
 const text=(s,n)=>String(s??'').trim().slice(0,n);
 const today=()=>new Date(Date.now()-3*3600000).toISOString().slice(0,10);
 const date=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
 function clean(list,allowedPhotos){
  if(!Array.isArray(list)||list.length>12)throw Error('Crie até 12 menus especiais.');
  const ids=new Set();
  return list.map(p=>{
   if(!p||typeof p!=='object')throw Error('Menu inválido.');
   const m={id:text(p.id,60),title:text(p.title,80),occasion:text(p.occasion,40),description:text(p.description,600),items:text(p.items,1400),photo:text(p.photo,240),mode:text(p.mode,20),price:Number(p.price),basis:p.basis==='pessoa'?'pessoa':'menu',starting:p.starting===true,serves:Number(p.serves),includes:text(p.includes,600),deadline:text(p.deadline,10),until:text(p.until,10),published:p.published===true};
   if(!/^[a-zA-Z0-9-]{1,60}$/.test(m.id)||ids.has(m.id))throw Error('Identificador de menu inválido ou repetido.');ids.add(m.id);
   if(!m.title)throw Error('Dê um nome ao menu.');
   if(!occasions.includes(m.occasion)||!modes[m.mode])throw Error('Escolha a ocasião e a forma de atendimento.');
   if(!Number.isFinite(m.price)||m.price<=0||m.price>100000||!Number.isInteger(m.serves)||m.serves<1||m.serves>500)throw Error('Informe um preço válido e a quantidade de pessoas.');
   m.price=Math.round(m.price*100)/100;
   if(!date(m.deadline)||!date(m.until)||m.deadline>m.until)throw Error('Confira o prazo de encomenda e o fim da divulgação.');
   if(allowedPhotos&&!allowedPhotos.has(m.photo))throw Error('Escolha uma foto da sua galeria ou da coleção do site.');
   if(m.published&&(!m.photo||!m.items||!m.includes||m.deadline<today()))throw Error('Para divulgar, inclua foto, cardápio, o que está incluso e um prazo vigente.');
   return m;
  });
 }
 const active=(list,day=today())=>(Array.isArray(list)?list:[]).filter(m=>m.published&&m.until>=day&&m.deadline>=day);
 const money=n=>Number(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
 const price=m=>(m.starting?'A partir de ':'')+money(m.price)+(m.basis==='pessoa'?' / pessoa':' / menu');
 const quantity=m=>(m.basis==='pessoa'?'Mínimo de ':'Serve ')+m.serves+(m.serves===1?' pessoa':' pessoas');
 const link=(origin,c,m)=>origin+'/m/'+encodeURIComponent(c.id)+'/'+encodeURIComponent(m.id);
 const caption=(c,m,url)=>m.title+' — '+c.name+'\n'+price(m)+' · '+quantity(m)+'\n'+modes[m.mode]+' · '+c.cities+'\nEncomendas até '+m.deadline.split('-').reverse().join('/')+'.\nConfira o cardápio e peça seu orçamento: '+url+'\nSeu Chef em Casa';
 return {occasions,modes,today,date,clean,active,price,quantity,link,caption};
});
