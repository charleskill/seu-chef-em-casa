/* Painel > Orçamentos: o chef monta um orçamento em poucos toques e manda o link pelo WhatsApp.
   Os orçamentos ficam guardados neste aparelho (localStorage); o cliente vê tudo pelo link. */
(function(root){
 'use strict';
 const Q=root.ChefOrcamentoCore,e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const EXTRAS=['Compras dos ingredientes','Garçom','Louça e limpeza','Deslocamento'];
 const CONDICOES='Sinal de 30% para reservar a data. O restante no dia do evento.';
 let ctx,atual=null;
 const chave=c=>'sce-orcamentos-'+c.id;
 const lista=c=>{try{return JSON.parse(localStorage.getItem(chave(c))||'[]')}catch(err){return []}};
 const guardar=(c,l)=>{try{localStorage.setItem(chave(c),JSON.stringify(l.slice(0,60)))}catch(err){}};
 const hoje=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)};
 const maisDias=(s,n)=>{const d=new Date(s+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
 // No modo de demonstração o chef não está publicado; a página /o/exemplo mostra o chef fictício.
 const idPublico=c=>/^chef-[a-f\d]{16}$/.test(c.id)?c.id:'exemplo';
 const valorTxt=v=>v===''||v==null?'':Number(v).toLocaleString('pt-BR',{minimumFractionDigits:Number(v)%1?2:0,maximumFractionDigits:2});
 const novo=c=>({id:crypto.randomUUID(),zap:'',dias:7,q:{n:'',t:'',d:'',h:'',p:'',l:'',i:[['','','']],o:localStorage.getItem('sce-orc-cond-'+c.id)||CONDICOES}});

 function linha([d,q,v]={}){return '<div class="oc-item"><input name="d" aria-label="Item" placeholder="Ex.: Feijoada completa" maxlength="90" value="'+e(d||'')+'">'
  +'<input name="q" aria-label="Quantidade" inputmode="decimal" placeholder="Qtd." value="'+e(q===''||q==null?'':Q.qtd(q))+'">'
  +'<input name="v" aria-label="Valor de cada um, em reais" inputmode="decimal" placeholder="R$ cada" value="'+e(valorTxt(v))+'">'
  +'<button type="button" class="oc-x" data-oc="tirar" aria-label="Tirar este item">×</button></div>'}

 function panel(c){
  if(!atual||atual.chef!==c.id)atual={chef:c.id,...novo(c)};
  const q=atual.q,salvos=lista(c),pratos=(c.dishes||[]).filter(d=>d&&d.name).slice(0,10);
  return '<section class="card oc"><div class="oc-topo"><div><p class="sec">Orçamento rápido</p><h2>'+(atual.editando?'Editar orçamento':'Novo orçamento')+'</h2></div>'
  +(atual.editando||q.n?'<button type="button" class="b b2" data-oc="limpar">Começar outro</button>':'')+'</div>'
  +'<p class="form-help">Monte em poucos minutos e mande pelo WhatsApp. O cliente recebe um link com o orçamento bem apresentado, pode baixar em PDF e aceitar com um toque.</p>'
  +'<form id="oc-form" novalidate>'
  +'<fieldset><legend>Cliente</legend><div class="oc-2"><div class="f"><label for="oc-n">Nome</label><input id="oc-n" name="n" autocomplete="off" maxlength="60" placeholder="Ex.: Seu João" value="'+e(q.n)+'" required></div>'
  +'<div class="f"><label for="oc-zap">WhatsApp <span class="mut">(opcional)</span></label><input id="oc-zap" name="zap" type="tel" inputmode="tel" autocomplete="off" placeholder="(48) 99110-6355" value="'+e(atual.zap)+'"></div></div>'
  +'<p class="form-help">O WhatsApp do cliente fica só neste aparelho e não aparece no link.</p></fieldset>'
  +'<fieldset><legend>Evento</legend><div class="f"><label for="oc-t">O que você vai fazer</label><input id="oc-t" name="t" maxlength="90" placeholder="Ex.: Feijoada para 15 pessoas" value="'+e(q.t)+'" required></div>'
  +'<div class="oc-3"><div class="f"><label for="oc-d">Data</label><input id="oc-d" name="d" type="date" min="'+hoje()+'" value="'+e(q.d)+'"></div>'
  +'<div class="f"><label for="oc-h">Horário</label><input id="oc-h" name="h" type="time" value="'+e(q.h)+'"></div>'
  +'<div class="f"><label for="oc-p">Pessoas</label><input id="oc-p" name="p" type="number" inputmode="numeric" min="1" max="5000" step="1" placeholder="15" value="'+e(q.p)+'"></div></div>'
  +'<div class="f"><label for="oc-l">Local</label><input id="oc-l" name="l" maxlength="90" placeholder="Bairro e cidade" value="'+e(q.l)+'"></div></fieldset>'
  +'<fieldset><legend>O que está incluído</legend>'
  +(pratos.length?'<p class="form-help">Toque para incluir um prato do seu cardápio. A quantidade vem do número de pessoas.</p><div class="oc-chips">'+pratos.map((d,i)=>'<button type="button" class="oc-chip" data-oc="prato" data-i="'+i+'">+ '+e(d.name)+'</button>').join('')+'</div>':'')
  +'<div class="oc-cab" aria-hidden="true"><span>Item</span><span>Qtd.</span><span>Valor cada</span><span></span></div><div id="oc-itens">'+q.i.map(linha).join('')+'</div>'
  +'<div class="oc-chips"><button type="button" class="oc-chip oc-chip-forte" data-oc="item">+ Outro item</button>'+EXTRAS.map(x=>'<button type="button" class="oc-chip" data-oc="extra" data-v="'+e(x)+'">+ '+e(x)+'</button>').join('')+'</div>'
  +'<div class="oc-total" aria-live="polite"><span>Total</span><strong id="oc-total">'+Q.dinheiro(0)+'</strong><small id="oc-pp"></small></div></fieldset>'
  +'<fieldset><legend>Condições</legend><div class="f"><label for="oc-o">Sinal, pagamento e observações</label><textarea id="oc-o" name="o" rows="3" maxlength="600">'+e(q.o)+'</textarea></div>'
  +'<div class="f"><label for="oc-dias">Validade</label><select id="oc-dias" name="dias">'+[3,7,15,30].map(n=>'<option value="'+n+'"'+(Number(atual.dias)===n?' selected':'')+'>'+n+' dias</option>').join('')+'</select></div></fieldset>'
  +'<div class="acts oc-acts"><button class="b b1" type="submit">Enviar pelo WhatsApp</button><button class="b b2" type="button" data-oc="ver">Ver como o cliente vê</button></div>'
  +'</form></section>'
  +(salvos.length?'<section class="card oc-salvos"><h2>Orçamentos enviados</h2><p class="form-help">Ficam guardados neste aparelho.</p><ul>'+salvos.map(s=>'<li><div><b>'+e(s.q.t)+'</b><span>'+e(s.q.n)+(s.q.d?' · '+Q.dataCurta(s.q.d):'')+' · '+Q.dinheiro(Q.total(s.q))+'</span></div><div class="oc-li-acts">'
   +'<button type="button" class="b b2" data-oc="abrir" data-id="'+e(s.id)+'">Editar</button><button type="button" class="b b2" data-oc="duplicar" data-id="'+e(s.id)+'">Usar como modelo</button><button type="button" class="linkbtn" data-oc="apagar" data-id="'+e(s.id)+'">Apagar</button></div></li>').join('')+'</ul></section>':'');
 }

 // Lê a tela inteira para o estado (sem recarregar a página, para não perder o foco do teclado).
 function ler(){
  const f=document.getElementById('oc-form');if(!f)return;
  const v=n=>f.elements[n].value;
  atual.zap=v('zap');atual.dias=Number(v('dias'))||7;
  Object.assign(atual.q,{n:v('n'),t:v('t'),d:v('d'),h:v('h'),p:v('p'),l:v('l'),o:v('o')});
  atual.q.i=[...f.querySelectorAll('.oc-item')].map(r=>[r.querySelector('[name=d]').value,r.querySelector('[name=q]').value,r.querySelector('[name=v]').value]);
 }
 function pronto(c){ // orçamento limpo e validado, pronto para virar link
  ler();const em=hoje();
  return Q.clean({...atual.q,c:idPublico(c),p:atual.q.p===''?0:atual.q.p,i:atual.q.i.filter(([d,q,v])=>String(d).trim()||String(v).trim()).map(([d,q,v])=>[d,q===''?1:q,v===''?NaN:v]),em,val:maisDias(em,atual.dias)});
 }
 function somar(){
  ler();let t=0;for(const [d,q,v] of atual.q.i){try{const x=Q.clean({n:'x',t:'x',i:[[d||'item',q===''?1:q,v===''?0:v]]});t+=Q.total(x)}catch(err){}}
  const p=Number(atual.q.p);document.getElementById('oc-total').textContent=Q.dinheiro(t);
  document.getElementById('oc-pp').textContent=p>1&&t?Q.dinheiro(t/p)+' por pessoa':'';
 }
 function addLinha(item){const box=document.getElementById('oc-itens');const vazia=[...box.querySelectorAll('.oc-item')].find(r=>!r.querySelector('[name=d]').value.trim()&&!r.querySelector('[name=v]').value.trim());
  if(vazia)vazia.outerHTML=linha(item);else box.insertAdjacentHTML('beforeend',linha(item));
  const rows=box.querySelectorAll('.oc-item'),alvo=[...rows].find(r=>r.querySelector('[name=d]').value===item[0]&&!r.querySelector('[name=v]').value)||null;
  (alvo?alvo.querySelector('[name=v]'):item[0]?null:rows[rows.length-1].querySelector('[name=d]'))?.focus();somar();
 }
 function salvar(c,q){const l=lista(c).filter(s=>s.id!==atual.id);l.unshift({id:atual.id,zap:atual.zap,dias:atual.dias,q,criado:Date.now()});guardar(c,l);try{localStorage.setItem('sce-orc-cond-'+c.id,q.o)}catch(err){}}
 function erro(err){ctx.toast(err.message||'Não foi possível montar o orçamento.');const f=document.getElementById('oc-form');const m=String(err.message);
  (m.includes('cliente')?f.elements.n:m.includes('título')?f.elements.t:m.includes('pessoas')?f.elements.p:f.querySelector('.oc-item input'))?.focus()}

 addEventListener('input',ev=>{if(ev.target.closest('#oc-form'))somar()});
 addEventListener('click',ev=>{
  const b=ev.target.closest('[data-oc]');if(!b||!ctx)return;const c=ctx.me();if(!c)return;const a=b.dataset.oc;
  if(a==='tirar'){const box=document.getElementById('oc-itens');b.closest('.oc-item').remove();if(!box.children.length)box.insertAdjacentHTML('beforeend',linha());somar();return}
  if(a==='item'){addLinha(['','',''])}
  else if(a==='extra'){addLinha([b.dataset.v,1,''])}
  else if(a==='prato'){ler();const d=(c.dishes||[]).filter(x=>x&&x.name)[Number(b.dataset.i)];if(d)addLinha([d.name,Number(atual.q.p)||1,Number(d.price)>0?d.price:''])}
  else if(a==='limpar'){atual={chef:c.id,...novo(c)};ctx.render();scrollTo(0,0)}
  else if(a==='abrir'||a==='duplicar'){const s=lista(c).find(x=>x.id===b.dataset.id);if(!s)return;
   atual=a==='abrir'?{chef:c.id,id:s.id,zap:s.zap,dias:s.dias||7,q:JSON.parse(JSON.stringify(s.q)),editando:true}:{...novo(c),chef:c.id,dias:s.dias||7,q:{...JSON.parse(JSON.stringify(s.q)),n:'',d:'',h:'',l:''}};
   ctx.render();document.getElementById(a==='abrir'?'oc-t':'oc-n')?.focus()}
  else if(a==='apagar'){if(!confirm('Apagar este orçamento da lista? O link que o cliente recebeu continua funcionando.'))return;guardar(c,lista(c).filter(x=>x.id!==b.dataset.id));if(atual.id===b.dataset.id)atual=null;ctx.render()}
  else if(a==='ver'){try{const q=pronto(c);salvar(c,q);open(Q.link(location.origin,q),'_blank','noopener')}catch(err){erro(err)}}
 });
 addEventListener('submit',ev=>{
  if(ev.target.id!=='oc-form')return;ev.preventDefault();const c=ctx&&ctx.me();if(!c)return;
  try{const q=pronto(c),url=Q.link(location.origin,q),fone=root.ChefCore&&root.ChefCore.phone(atual.zap);
   if(atual.zap.trim()&&!fone){ctx.toast('Confira o WhatsApp do cliente, com DDD.');document.getElementById('oc-zap').focus();return}
   salvar(c,q);open('https://wa.me/'+(fone||'')+'?text='+encodeURIComponent(Q.mensagem(c.name,q,url)),'_blank','noopener,noreferrer');
   ctx.toast('Confira a mensagem e toque em enviar no WhatsApp.');atual.editando=true;ctx.render();
  }catch(err){erro(err)}
 });
 root.ChefOrcamento={init(context){ctx=context},panel(c){const h=panel(c);setTimeout(()=>document.getElementById('oc-total')&&somar());return h}};
})(window);
