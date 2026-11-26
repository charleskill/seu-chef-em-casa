/* Orçamento rápido: regras compartilhadas pelo painel do chef, pela página /o/ e pelos testes.
   O orçamento viaja dentro do link (sem banco de dados). O WhatsApp do cliente nunca entra no link. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ChefOrcamentoCore=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const LIMITE_LINK=3500,MAX_ITENS=30;
 const texto=(v,max)=>String(v??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').trim().slice(0,max);
 const data=v=>{const s=String(v||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return '';const d=new Date(s+'T12:00:00Z');return !isNaN(d)&&d.toISOString().slice(0,10)===s?s:''};
 // Aceita 1.200,50 / 1200,5 / 65.50 (teclado com ponto) / 1.200 (milhar).
 const numero=(v,max)=>{if(typeof v==='string'){v=v.trim().replace(/^R\$\s*/,'').replace(/\s/g,'');v=v.includes(',')?v.replace(/\./g,'').replace(',','.'):/^\d+\.\d{1,2}$/.test(v)?v:v.replace(/\./g,'')}const n=Number(v);return Number.isFinite(n)&&n>=0&&n<=max?Math.round(n*100)/100:NaN};
 // Deixa o orçamento só com campos conhecidos, tamanhos limitados e números válidos. Lança erro com mensagem para o chef.
 function clean(q){
  q=q&&typeof q==='object'?q:{};
  const itens=(Array.isArray(q.i)?q.i:[]).map(x=>Array.isArray(x)?x:[x&&x.d,x&&x.q,x&&x.v]).filter(x=>texto(x[0],90)).slice(0,MAX_ITENS).map(([d,qt,v])=>{
   const qtd=numero(qt===''||qt==null?1:qt,10000),valor=numero(v,1000000);
   if(isNaN(qtd)||qtd<=0)throw new Error('Confira a quantidade de "'+texto(d,40)+'".');
   if(isNaN(valor))throw new Error('Confira o valor de "'+texto(d,40)+'".');
   return [texto(d,90),qtd,valor];
  });
  if(!itens.length)throw new Error('Inclua pelo menos um item no orçamento.');
  const pessoas=q.p===''||q.p==null?0:numero(q.p,5000);
  if(isNaN(pessoas)||pessoas%1)throw new Error('Confira o número de pessoas.');
  const out={v:1,c:texto(q.c,40),n:texto(q.n,60),t:texto(q.t,90),d:data(q.d),h:/^\d{2}:\d{2}$/.test(q.h||'')?q.h:'',p:pessoas,l:texto(q.l,90),i:itens,o:texto(q.o,600),val:data(q.val),em:data(q.em)};
  if(!out.n)throw new Error('Escreva o nome do cliente.');
  if(!out.t)throw new Error('Dê um título ao orçamento, por exemplo: Feijoada para 15 pessoas.');
  return out;
 }
 const total=q=>Math.round(q.i.reduce((s,[,qt,v])=>s+qt*v,0)*100)/100;
 const dinheiro=n=>Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
 const qtd=n=>Number(n).toLocaleString('pt-BR',{maximumFractionDigits:2});
 const DIAS=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
 const MESES=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
 function dataLonga(s){if(!s)return '';const [a,m,d]=s.split('-').map(Number),dia=new Date(Date.UTC(a,m-1,d)).getUTCDay();return DIAS[dia]+', '+d+' de '+MESES[m-1]+' de '+a}
 const dataCurta=s=>s?s.split('-').reverse().join('/'):'';
 // base64url do JSON em UTF-8: funciona no navegador e no servidor (Cloudflare tem btoa/atob e TextEncoder).
 function b64(str){const bytes=new TextEncoder().encode(str);let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
 function unb64(s){s=String(s||'').replace(/-/g,'+').replace(/_/g,'/');const bin=atob(s+'==='.slice((s.length+3)%4));return new TextDecoder().decode(Uint8Array.from(bin,c=>c.charCodeAt(0)))}
 function encode(q){const s=b64(JSON.stringify(clean(q)));if(s.length>LIMITE_LINK)throw new Error('O orçamento ficou grande demais para um link. Encurte as descrições ou as observações.');return s}
 function decode(s){if(!s||String(s).length>LIMITE_LINK+50)return null;try{return clean(JSON.parse(unb64(s)))}catch(err){return null}}
 const link=(origem,q)=>origem+'/o/'+encodeURIComponent(q.c)+'?q='+encode(q);
 // Mensagem que o chef manda ao cliente. Sem preço no texto: o cliente abre o link e vê tudo arrumado.
 function mensagem(chefNome,q,url){const w=String(q.n).split(/\s+/),primeiro=/^(seu|sr\.?|sra\.?|dona|dr\.?|dra\.?)$/i.test(w[0])&&w[1]?w[0]+' '+w[1]:w[0];return 'Olá, '+primeiro+'! Aqui é '+chefNome+'. Preparei o orçamento de '+q.t+(q.d?' para '+dataLonga(q.d):'')+'.\n\nVeja os detalhes e o valor neste link:\n'+url}
 function aceite(q,url){return 'Olá! Aqui é '+q.n+'. Aceito o orçamento "'+q.t+'"'+(q.d?' para '+dataCurta(q.d):'')+', no total de '+dinheiro(total(q))+'. Vamos combinar os próximos passos?\n\n'+url}
 function vencido(q,hoje){return !!q.val&&q.val<(hoje||new Date().toISOString().slice(0,10))}
 return {clean,total,dinheiro,qtd,dataLonga,dataCurta,encode,decode,link,mensagem,aceite,vencido,LIMITE_LINK,MAX_ITENS};
});
