/* Mural de pedidos: formulário do cliente (#/pedir), acompanhamento no painel do cliente e aba "Mural" no painel do chef.
   As regras ficam em mural-core.js; o servidor em functions/_lib/mural.js. */
(function(root){
 'use strict';
 const M=root.ChefMuralCore,e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let ctx=null;const st={chef:null,cliente:null,carregando:{},enviado:null,erro:'',liberando:''};
 async function api(metodo,rota,corpo){const r=await fetch('/api/'+rota,{method:metodo,credentials:'same-origin',headers:corpo?{'content-type':'application/json'}:{},body:corpo?JSON.stringify(corpo):undefined});
  let j=null;try{j=await r.json()}catch(x){}if(!r.ok){const err=new Error((j&&j.erro)||'Não foi possível falar com o servidor.');err.campo=j&&j.campo;err.status=r.status;throw err}return j}
 const quando=t=>{const m=Math.round((Date.now()-Date.parse(t))/60000);return m<2?'agora':m<60?'há '+m+' min':m<1440?'há '+Math.round(m/60)+' h':'há '+Math.round(m/1440)+(m<2880?' dia':' dias')};
 const wa=(fone,txt)=>'https://wa.me/'+String(fone||'').replace(/\D/g,'')+(txt?'?text='+encodeURIComponent(txt):'');
 const opcoes=(lista,sel,vazio)=>(vazio?'<option value="">'+e(vazio)+'</option>':'')+lista.map(([v,t])=>'<option value="'+e(v)+'"'+(v===sel?' selected':'')+'>'+e(t)+'</option>').join('');
 function carregar(qual,rota){if(st.carregando[qual])return;st.carregando[qual]=true;
  api('GET',rota).then(j=>{st[qual]=j}).catch(err=>{st[qual]={erro:err.message}}).finally(()=>{st[qual+'Em']=Date.now();st.carregando[qual]=false;ctx&&ctx.render()})}
 const vagas=(n,total=M.MAX_CHEFS)=>'<span class="mu-vagas" aria-label="'+n+' de '+total+' chefs já pegaram">'+Array.from({length:total},(_,i)=>'<i class="'+(i<n?'on':'')+'"></i>').join('')+'</span>';
 const detalhes=p=>'<ul class="mu-tags">'+[M.LOCAIS[p.local],M.COMPRAS[p.compras],p.faixa,p.restricoes&&'Restrições: '+p.restricoes].filter(Boolean).map(t=>'<li>'+e(t)+'</li>').join('')+'</ul>';
 const cabeca=p=>'<div><p class="mu-quando">'+e(M.dataTxt(p))+(p.horario?' · '+e(p.horario):'')+' · '+e(M.cidadeTxt(p))+(p.bairro?', '+e(p.bairro):'')+'</p><h3>'+e(M.titulo(p))+'</h3></div>';

 // ---------- Cliente: #/pedir ----------
 function pedir(){
  const eu=ctx.me();
  const passos='<ol class="mu-passos"><li><b>Conte o evento</b><span>Data, cidade, quantas pessoas e o que você imagina.</span></li><li><b>Até '+M.MAX_CHEFS+' chefs se interessam</b><span>Só chefs com perfil completo que atendem a sua cidade.</span></li><li><b>Eles te chamam no WhatsApp</b><span>Você vê o perfil de cada um e escolhe com calma.</span></li></ol>';
  const topo='<p class="eyebrow">Pedido no mural · grátis</p><h1>Conte o evento. Os chefs vêm até você.</h1>';
  if(!eu)return '<section class="card mu-pedir">'+topo+passos+'<a class="b b1 full" href="#/entrar">Entrar ou criar conta para pedir</a><p class="form-help c">Leva um minuto. Seu WhatsApp só aparece para os chefs que você vai conhecer.</p></section>';
  if(st.enviado)return '<section class="card mu-pedir mu-ok" role="status"><p class="eyebrow">Pedido publicado</p><h1>Pronto! Agora é com os chefs.</h1><p>'+(st.enviado.chefsAvisados?'Avisamos <b>'+st.enviado.chefsAvisados+(st.enviado.chefsAvisados===1?' chef':' chefs')+'</b> que atendem a sua cidade.':'Ainda não há chefs cadastrados na sua cidade. Seu pedido fica no mural e avisamos assim que alguém se interessar.')+' Quem se interessar vai te chamar no WhatsApp, e você acompanha tudo no seu painel.</p><a class="b b1 full" href="#/painel">Acompanhar meu pedido</a><button class="b b2 full" type="button" data-mu="novo">Fazer outro pedido</button></section>';
  const hoje=M.hoje(),tipos=M.TIPOS.map(t=>'<label class="mu-chip"><input type="radio" name="tipo" value="'+e(t)+'"><span>'+e(t)+'</span></label>').join('');
  return '<section class="card mu-pedir">'+topo+passos+'<form id="mu-form" novalidate>'
   +'<fieldset class="f"><legend>Qual é a ocasião?</legend><div class="mu-chips">'+tipos+'</div></fieldset>'
   +'<div class="mu-2"><div class="f"><label for="mu-cidade">Cidade</label><input id="mu-cidade" name="cidade" data-endereco="cidade" data-endereco-uf="uf" autocomplete="off" placeholder="Digite e escolha uma cidade" required><input type="hidden" name="uf"></div><div class="f"><label for="mu-bairro">Bairro <small>(opcional)</small></label><input id="mu-bairro" name="bairro" maxlength="80"></div></div>'
   +'<div class="mu-2"><div class="f"><label for="mu-data">Data</label><input id="mu-data" name="data" type="date" min="'+hoje+'" max="'+M.somaDias(hoje,365)+'"><label class="mu-check"><input type="checkbox" name="semData" id="mu-semdata"> Ainda não sei a data</label></div><div class="f"><label for="mu-horario">Horário</label><select id="mu-horario" name="horario">'+opcoes(M.HORARIOS.map(h=>[h,h]),'','Tanto faz')+'</select></div></div>'
   +'<div class="mu-2"><div class="f"><label for="mu-pessoas">Quantas pessoas?</label><input id="mu-pessoas" name="pessoas" type="number" inputmode="numeric" min="1" max="500" value="'+e((root.ChefApp&&root.ChefApp.guests)||'')+'" required></div><div class="f"><label for="mu-faixa">Valor que você pensa em investir <small>(opcional)</small></label><select id="mu-faixa" name="faixa">'+opcoes(M.FAIXAS.map(f=>[f,f]),'','Escolha')+'</select></div></div>'
   +'<div class="mu-2"><div class="f"><label for="mu-local">Onde</label><select id="mu-local" name="local">'+opcoes(Object.entries(M.LOCAIS),'casa')+'</select></div><div class="f"><label for="mu-compras">Ingredientes</label><select id="mu-compras" name="compras">'+opcoes(Object.entries(M.COMPRAS),'combinar')+'</select></div></div>'
   +'<div class="f"><label for="mu-detalhes">Conte como você imagina</label><textarea id="mu-detalhes" name="detalhes" rows="4" maxlength="1500" placeholder="Ex.: jantar de aniversário da minha mãe, com entrada, prato principal e sobremesa. Gostamos de frutos do mar." required></textarea></div>'
   +'<div class="f"><label for="mu-restricoes">Alergias ou restrições <small>(opcional)</small></label><input id="mu-restricoes" name="restricoes" maxlength="300" placeholder="Ex.: uma pessoa sem glúten"></div>'
   +'<div class="f"><label for="mu-whatsapp">Seu WhatsApp</label><input id="mu-whatsapp" name="whatsapp" type="tel" autocomplete="tel" value="'+e(eu.whatsapp||'')+'" placeholder="(48) 99999-9999" required><p class="form-help">Só os chefs que pegarem seu pedido veem este número.</p></div>'
   +'<p class="err" id="mu-erro" role="alert">'+e(st.erro)+'</p><button class="b b1 full" type="submit">Publicar pedido</button><p class="form-help c">Grátis. Você pode ter até '+M.MAX_ABERTOS+' pedidos abertos ao mesmo tempo.</p></form></section>';
 }

 // ---------- Cliente: bloco no painel ----------
 const velho=q=>st[q]&&!st.carregando[q]&&Date.now()-(st[q+'Em']||0)>60000;
 function cliente(){
  if(velho('cliente'))st.cliente=null;
  if(!st.cliente)carregar('cliente','mural/meus');
  const lista=(st.cliente&&st.cliente.pedidos)||[];
  const status={aberto:'Esperando chefs',completo:'4 chefs interessados',fechado:'Encerrado',vencido:'Data passou',oculto:'Em análise'};
  const itens=lista.map(p=>'<article class="mu-card"><div class="mu-topo">'+cabeca(p)+'<span class="mu-status s-'+e(p.status)+'">'+e(status[p.status]||p.status)+'</span></div>'
   +(p.chefs.length?'<ul class="mu-chefs">'+p.chefs.map(c=>'<li><img src="'+e(c.foto||'')+'" alt="" width="44" height="44" loading="lazy"><div><b>'+e(c.nome)+'</b><small>'+e(c.especialidade||'Chef')+' · '+quando(c.em)+'</small></div><a class="b b2" href="#/chef/'+e(c.id)+'">Perfil</a>'+(c.whatsapp?'<a class="b b1" href="'+e(wa(c.whatsapp))+'" target="_blank" rel="noopener">WhatsApp</a>':'')+'</li>').join('')+'</ul>'
     :'<p class="mu-espera">'+(p.status==='aberto'?'Os chefs da sua cidade já foram avisados. Quem se interessar aparece aqui e te chama no WhatsApp.':'Nenhum chef pegou este pedido.')+'</p>')
   +(p.status==='aberto'||p.status==='completo'?'<button class="b b2 mu-fechar" type="button" data-mu="fechar" data-id="'+e(p.id)+'">Já resolvi, encerrar pedido</button>':'')+'</article>').join('');
  return '<section class="card mu-cliente"><div class="mu-sec"><div><p class="eyebrow">Mural de pedidos</p><h2>Seus pedidos</h2></div><a class="b b1" href="#/pedir">Novo pedido</a></div>'
   +(st.cliente&&st.cliente.erro?'<p class="err">'+e(st.cliente.erro)+'</p>':!st.cliente?'<p class="form-help">Carregando…</p>':itens||'<p class="mu-espera">Conte o evento uma vez e receba contato de até '+M.MAX_CHEFS+' chefs da sua cidade.</p>')+'</section>';
 }

 // ---------- Chef: aba Mural ----------
 function panel(c){
  if(velho('chef'))st.chef=null;
  if(!st.chef)carregar('chef','mural');
  const d=st.chef||{},lista=d.pedidos||[];
  const aviso=d.falta&&d.falta.length?'<div class="note" role="status"><b>Complete seu perfil para liberar contatos.</b> Falta: '+e(d.falta.join(', '))+'.</div>':'';
  const semCidade=d.cidades&&!d.cidades.length?'<div class="note">Informe no Perfil as cidades onde você atende para ver os pedidos delas.</div>':'';
  const card=p=>{const meu=p.minha>0;return '<article class="mu-card'+(meu?' mu-meu':'')+'"><div class="mu-topo">'+cabeca(p)+(meu?'<span class="mu-status s-completo">Você é o '+p.minha+'º</span>':'<span class="mu-novo">'+quando(p.criado_em)+'</span>')+'</div>'
   +'<p class="mu-cliente-nome">'+e(p.nome)+' escreveu:</p><blockquote>'+e(p.detalhes)+'</blockquote>'+detalhes(p)
   +(meu?'<div class="mu-contato"><div><small>Contato liberado</small><b>'+e(p.nome)+'</b></div><a class="b b1" href="'+e(wa(p.whatsapp,M.mensagem(c.name,p,location.origin+'/#/chef/'+c.id)))+'" target="_blank" rel="noopener">Chamar no WhatsApp</a></div>'
     :'<div class="mu-acoes">'+vagas(p.liberados)+'<span class="mu-vtxt">'+(p.vagas===1?'Última vaga':p.vagas+' de '+M.MAX_CHEFS+' vagas')+'</span><button class="b b1" type="button" data-mu="liberar" data-id="'+e(p.id)+'"'+(st.liberando===p.id?' disabled':'')+'>'+(st.liberando===p.id?'Liberando…':'Liberar contato · grátis')+'</button></div>')
   +(meu?'':'<button class="mu-denunciar" type="button" data-mu="denunciar" data-id="'+e(p.id)+'">Pedido estranho? Denunciar</button>')+'</article>'};
  return '<div class="mu-painel"><div class="mu-sec"><div><p class="eyebrow">Mural de pedidos</p><h2>Pedidos na sua região</h2><p class="form-help">Clientes contam o evento e até '+M.MAX_CHEFS+' chefs liberam o contato. Quem chega primeiro tem mais chance.</p></div><button class="b b2" type="button" data-mu="atualizar">Atualizar</button></div>'
   +aviso+semCidade+(d.erro?'<p class="err">'+e(d.erro)+'</p>':!st.chef?'<p class="form-help">Carregando…</p>':lista.length?lista.map(card).join(''):'<p class="mu-espera">Nenhum pedido aberto nas suas cidades agora. Avisamos pelo sino e por e-mail quando chegar um.</p>')+'</div>';
 }

 // ---------- Ações ----------
 addEventListener('click',async ev=>{
  const b=ev.target.closest('[data-mu]');if(!b||!ctx)return;const a=b.dataset.mu,id=b.dataset.id;
  if(a==='novo'){st.enviado=null;ctx.render();return}
  if(a==='atualizar'){st.chef=null;ctx.render();return}
  try{
   if(a==='liberar'){st.liberando=id;ctx.render();const j=await api('POST','mural/'+id+'/liberar',{});st.liberando='';st.chef=null;ctx.toast('Contato liberado. Você é o '+j.ordem+'º chef. Chame o cliente no WhatsApp.');ctx.render()}
   else if(a==='denunciar'){if(!confirm('Denunciar este pedido? Ele some do seu mural e a equipe é avisada.'))return;await api('POST','mural/'+id+'/denunciar',{});st.chef=null;ctx.toast('Obrigado. O pedido saiu do seu mural.');ctx.render()}
   else if(a==='fechar'){if(!confirm('Encerrar este pedido? Ele sai do mural dos chefs.'))return;await api('POST','mural/meus/'+id+'/fechar',{});st.cliente=null;ctx.toast('Pedido encerrado.');ctx.render()}
  }catch(err){st.liberando='';st.chef=null;ctx.toast(err.message);ctx.render()}
 });
 addEventListener('change',ev=>{if(ev.target.id==='mu-semdata'){const d=document.getElementById('mu-data');if(d){d.disabled=ev.target.checked;if(ev.target.checked)d.value=''}}});
 addEventListener('submit',async ev=>{
  if(ev.target.id!=='mu-form')return;ev.preventDefault();const f=ev.target,btn=f.querySelector('[type=submit]'),erro=document.getElementById('mu-erro');
  const v=Object.fromEntries(new FormData(f));v.semData=!!f.semData.checked;v.pessoas=Number(v.pessoas);
  if(!v.uf){erro.textContent='Escolha a cidade e a UF na lista de sugestões.';f.elements.namedItem('cidade').focus();return}
  try{M.limpar(v)}catch(err){erro.textContent=err.message;const alvo=err.campo&&(f.querySelector('[name="'+err.campo+'"]'));if(alvo)alvo.focus();return}
  btn.disabled=true;btn.textContent='Publicando…';
  try{st.enviado=await api('POST','mural',v);st.erro='';st.cliente=null;ctx.render();scrollTo({top:0,behavior:'smooth'})}
  catch(err){erro.textContent=err.message;btn.disabled=false;btn.textContent='Publicar pedido';const alvo=err.campo&&f.querySelector('[name="'+err.campo+'"]');if(alvo)alvo.focus()}
 });
 root.ChefMural={init(c){ctx=c},pedir,cliente,panel,recarregar(){st.chef=null;st.cliente=null}};
})(window);
