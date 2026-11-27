/* Mural de pedidos (modelo GetNinjas): o cliente publica o evento, os chefs da cidade veem sem o contato
   e até MAX_CHEFS liberam o contato para chamar o cliente. Regras compartilhadas pelo site e pelo servidor. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ChefMuralCore=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MAX_CHEFS=4,MAX_ABERTOS=2,DIAS_SEM_DATA=30;
 const TIPOS=['Jantar','Almoço','Churrasco','Aniversário','Ceia de Natal','Réveillon','Evento de empresa','Marmitas da semana','Aula de cozinha','Outro'];
 const HORARIOS=['Manhã','Almoço','Tarde','Noite'];
 const LOCAIS={casa:'O chef cozinha na minha casa',entrega:'Quero receber pronto'};
 const COMPRAS={chef:'O chef faz as compras',cliente:'Eu compro os ingredientes',combinar:'A combinar'};
 const FAIXAS=['Até R$ 500','R$ 500 a R$ 1.000','R$ 1.000 a R$ 2.500','Acima de R$ 2.500','Prefiro não dizer'];
 const text=(s,n)=>String(s??'').trim().replace(/\s+\n/g,'\n').slice(0,n);
 const norm=v=>String(v||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
 const slug=v=>norm(v).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
 // Mesma regra das páginas de cidade: "Florianópolis, São José e Palhoça" → ['florianopolis','sao-jose','palhoca'].
 const cidadesDe=p=>String((p&&p.cities)||'').split(/[,;/\n&]|\s+e\s+/).map(s=>slug(s).replace(/-(sc|sp|rj|pr|rs|mg|ba|go|df|es|pe|ce)$/,'')).filter(Boolean);
 const atende=(perfil,cidade)=>cidadesDe(perfil).includes(slug(cidade));
 const hoje=(agora=Date.now())=>new Date(agora-3*3600000).toISOString().slice(0,10);
 const somaDias=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};
 const dataOk=d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&!isNaN(new Date(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
 const fone=v=>{let d=String(v||'').replace(/\D/g,'');if(d.length===12||d.length===13)d=d.replace(/^55/,'');return d.length===10||d.length===11?'55'+d:''};
 const primeiroNome=n=>text(n,80).split(/\s+/)[0]||'Cliente';
 function erro(msg,campo){const e=new Error(msg);e.campo=campo;return e}
 // Valida o que o cliente enviou. Devolve o pedido limpo ou lança erro com o campo.
 function limpar(b,agora=Date.now()){
  b=b&&typeof b==='object'?b:{};
  const tipo=TIPOS.includes(b.tipo)?b.tipo:'';if(!tipo)throw erro('Escolha o tipo de evento.','tipo');
  const cidade=text(b.cidade,80);if(slug(cidade).length<3)throw erro('Escolha a cidade do evento.','cidade');
  const semData=!!b.semData,d=text(b.data,10),h=hoje(agora);
  if(!semData&&(!dataOk(d)||d<h||d>somaDias(h,365)))throw erro('Escolha uma data a partir de hoje.','data');
  const pessoas=Number(b.pessoas);if(!Number.isInteger(pessoas)||pessoas<1||pessoas>500)throw erro('Informe quantas pessoas, de 1 a 500.','pessoas');
  const local=LOCAIS[b.local]?b.local:'casa',compras=COMPRAS[b.compras]?b.compras:'combinar';
  const horario=HORARIOS.includes(b.horario)?b.horario:'',faixa=FAIXAS.includes(b.faixa)?b.faixa:'';
  const detalhes=text(b.detalhes,1500);if(detalhes.length<15)throw erro('Conte um pouco mais sobre o evento (pelo menos uma frase).','detalhes');
  const whatsapp=fone(b.whatsapp);if(!whatsapp)throw erro('Informe um WhatsApp com DDD para os chefs te chamarem.','whatsapp');
  return {tipo,cidade,cidadeSlug:slug(cidade),bairro:text(b.bairro,80),data:semData?'':d,semData,horario,pessoas,local,compras,faixa,restricoes:text(b.restricoes,300),detalhes,whatsapp,nome:text(b.nome,80)};
 }
 // Até quando o pedido fica no mural: o dia do evento, ou 30 dias quando não há data.
 const expira=(p,criado)=>p.data?p.data:somaDias(String(criado).slice(0,10),DIAS_SEM_DATA);
 // O que o chef vê antes de liberar: sem WhatsApp e só com o primeiro nome.
 const semContato=p=>{const {whatsapp,nome,...r}=p;return {...r,nome:primeiroNome(nome)}};
 const dataTxt=p=>p.data?p.data.split('-').reverse().join('/'):'Data a combinar';
 const titulo=p=>p.tipo+' para '+p.pessoas+(p.pessoas===1?' pessoa':' pessoas');
 const resumo=p=>[titulo(p),dataTxt(p)+(p.horario?' · '+p.horario:''),p.cidade+(p.bairro?' · '+p.bairro:''),LOCAIS[p.local],COMPRAS[p.compras],p.faixa&&'Valor pensado: '+p.faixa,p.restricoes&&'Restrições: '+p.restricoes].filter(Boolean);
 // Primeira mensagem do chef ao cliente pelo WhatsApp.
 const mensagem=(chefNome,p,link)=>'Olá, '+primeiroNome(p.nome)+'! Sou '+text(chefNome,80)+' e vi seu pedido no Seu Chef em Casa: '+titulo(p).toLowerCase()+', '+dataTxt(p)+', em '+p.cidade+'. Posso te ajudar com o cardápio e o orçamento.'+(link?'\nMeu perfil: '+link:'');
 return {MAX_CHEFS,MAX_ABERTOS,TIPOS,HORARIOS,LOCAIS,COMPRAS,FAIXAS,slug,cidadesDe,atende,hoje,somaDias,limpar,expira,semContato,dataTxt,titulo,resumo,mensagem,primeiroNome,fone};
});
