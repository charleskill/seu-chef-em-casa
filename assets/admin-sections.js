/* Seções do painel completo: pedidos, clientes, comentários, registro de atividades e exportação em planilha.
   A autorização de cada operação é conferida pela API; esta tela só organiza o que o servidor devolve. */
(function(root){
'use strict';
const CL=root.ChefCloud;
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const quando=iso=>{const d=new Date(iso);return isNaN(d)?'':d.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'America/Sao_Paulo'});};
const dia=iso=>{const d=new Date(iso);return isNaN(d)?'':d.toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'});};
const norm=v=>String(v||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const STATUS={novo:'Novo',respondido:'Respondido',fechado:'Fechado'};
const MODO={marmita:'Marmitas',especial:'Menu especial'};
const POR_PAGINA=50;
const st={pedidos:fresh(),clientes:fresh(),comentarios:fresh(),atividades:fresh()};
let resumo=null,tentou=false,draw=()=>{},link=null,flash='';
function fresh(){return {itens:null,loading:false,error:'',q:'',filtro:'todos',limite:POR_PAGINA,aberto:''};}

const loaders={pedidos:()=>CL.adminPedidos(),clientes:()=>CL.adminClientes(),comentarios:()=>CL.adminComentarios(),atividades:()=>CL.adminAtividades()};
async function load(sec){
 if(sec==='dashboard')return loadResumo();
 const s=st[sec];if(!s)return;
 s.loading=true;s.error='';draw();
 try{s.itens=await loaders[sec]();}catch(e){s.error=e.message||'Não foi possível carregar.';}
 finally{s.loading=false;draw();}
 loadResumo();
}
async function loadResumo(){tentou=true;try{resumo=await CL.adminResumo();draw();}catch(e){}}

// ---------- Filtros ----------
const busca={
 pedidos:p=>[p.cliente,p.chef,p.texto,MODO[p.modo]||'Serviço',STATUS[p.status]],
 clientes:c=>[c.nome,c.email,c.whatsapp,c.cidades],
 comentarios:c=>[c.autor,c.chef,c.texto],
 atividades:a=>[a.conta_nome,a.acao,a.alvo,a.detalhe]
};
function filtrar(sec){
 const s=st[sec],q=norm(s.q).trim();
 return (s.itens||[]).filter(x=>(sec!=='pedidos'||s.filtro==='todos'||x.status===s.filtro)&&(!q||busca[sec](x).some(v=>norm(v).includes(q))));
}

// ---------- Partes comuns ----------
function toolbar(sec,placeholder,extra=''){
 const s=st[sec];
 return '<div class="adm-toolbar">'+extra+'<label class="adm-search"><span class="sr-only">Buscar</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" data-adm-q="'+sec+'" value="'+esc(s.q)+'" placeholder="'+esc(placeholder)+'"></label><button type="button" class="b b2" data-adm="export" data-sec="'+sec+'">Exportar planilha</button><button type="button" class="b b2" data-adm="reload" data-sec="'+sec+'">Atualizar</button></div>';
}
function wrap(sec,head,body){
 const s=st[sec];head=flashHtml()+head;
 if(s.error)return head+'<p class="err" role="alert">'+esc(s.error)+' <button type="button" class="b b2" data-adm="reload" data-sec="'+sec+'">Tentar de novo</button></p>';
 if(!s.itens)return head+'<p class="empty" role="status">Carregando…</p>';
 return head+'<div id="adm-results" data-sec="'+sec+'">'+body()+'</div>';
}
function mais(sec,total){const s=st[sec];return total>s.limite?'<p class="adm-more"><button type="button" class="b b2" data-adm="more" data-sec="'+sec+'">Mostrar mais ('+(total-s.limite)+' restantes)</button></p>':'';}
const vazio=t=>'<p class="empty">'+esc(t)+'</p>';
const contagem=(n,um,varios)=>'<p class="adm-count">'+n.toLocaleString('pt-BR')+' '+(n===1?um:varios)+'</p>';

// ---------- Pedidos ----------
function pedidos(){
 const s=st.pedidos,todos=s.itens||[],n=k=>todos.filter(p=>k==='todos'||p.status===k).length;
 const tabs='<nav class="adm-subsubsub" aria-label="Filtrar pedidos">'+['todos','novo','respondido','fechado'].map(k=>'<button type="button" data-adm="filtro" data-sec="pedidos" data-v="'+k+'" class="'+(s.filtro===k?'is-active':'')+'" '+(s.filtro===k?'aria-current="true"':'')+'>'+(k==='todos'?'Todos':STATUS[k]+'s')+' <span>('+n(k)+')</span></button>').join('')+'</nav>';
 return wrap('pedidos',toolbar('pedidos','Buscar por cliente, chef ou texto',tabs),pedidosLista);
}
function pedidosLista(){
 const s=st.pedidos,lista=filtrar('pedidos');
 if(!lista.length)return vazio(s.itens.length?'Nenhum pedido com esse filtro.':'Ainda não há pedidos registrados.');
 return contagem(lista.length,'pedido','pedidos')+'<div class="adm-table-wrap"><table class="adm-table"><thead><tr><th scope="col">Cliente</th><th scope="col">Chef</th><th scope="col">Tipo</th><th scope="col">Situação</th><th scope="col">Recebido em</th><th scope="col"><span class="sr-only">Ações</span></th></tr></thead><tbody>'+lista.slice(0,s.limite).map(p=>{
  const open=s.aberto===p.id;
  return '<tr class="'+(p.status==='novo'?'is-new':'')+'"><td data-label="Cliente"><b>'+esc(p.cliente||'Sem nome')+'</b></td><td data-label="Chef">'+esc(p.chef)+'</td><td data-label="Tipo">'+esc(MODO[p.modo]||'Serviço')+'</td><td data-label="Situação"><label class="sr-only" for="ps-'+esc(p.id)+'">Situação do pedido</label><select id="ps-'+esc(p.id)+'" class="adm-status is-'+p.status+'" data-adm-status="'+esc(p.id)+'">'+Object.entries(STATUS).map(([k,v])=>'<option value="'+k+'"'+(p.status===k?' selected':'')+'>'+v+'</option>').join('')+'</select></td><td data-label="Recebido em" class="adm-num">'+esc(quando(p.criado_em))+'</td><td class="adm-actions"><button type="button" class="adm-link" data-adm="abrir" data-sec="pedidos" data-id="'+esc(p.id)+'" aria-expanded="'+open+'">'+(open?'Fechar':'Ver pedido')+'</button><button type="button" class="adm-link is-danger" data-adm="excluir-pedido" data-id="'+esc(p.id)+'">Excluir</button></td></tr>'+(open?'<tr class="adm-detail"><td colspan="6"><pre>'+esc(p.texto)+'</pre></td></tr>':'');
 }).join('')+'</tbody></table></div>'+mais('pedidos',lista.length);
}

// ---------- Clientes ----------
function clientes(){return wrap('clientes',toolbar('clientes','Buscar por nome, e-mail, WhatsApp ou cidade'),clientesLista);}
function clientesLista(){
 const s=st.clientes,lista=filtrar('clientes');
 if(!lista.length)return vazio(s.itens.length?'Nenhum cliente encontrado.':'Ainda não há contas de clientes.');
 return (link?'<div class="adm-notice" role="status"><p><b>Link de nova senha para '+esc(link.nome)+'</b> (vale '+link.horas+' horas, uso único). Entregue só ao dono da conta.</p><input readonly value="'+esc(link.url)+'" aria-label="Link de nova senha"><button type="button" class="b b2" data-adm="copiar">Copiar link</button></div>':'')+contagem(lista.length,'cliente','clientes')+'<div class="adm-table-wrap"><table class="adm-table"><thead><tr><th scope="col">Nome</th><th scope="col">Contato</th><th scope="col">Entrada</th><th scope="col">Atividade</th><th scope="col">Cadastro</th><th scope="col"><span class="sr-only">Ações</span></th></tr></thead><tbody>'+lista.slice(0,s.limite).map(c=>'<tr><td data-label="Nome"><b>'+esc(c.nome||'Sem nome')+'</b>'+(c.cidades?'<small>'+esc(c.cidades)+'</small>':'')+'</td><td data-label="Contato">'+esc(c.email)+(c.whatsapp?'<small>'+esc(c.whatsapp)+'</small>':'')+'</td><td data-label="Entrada">'+(c.google?'Google':'E-mail e senha')+'</td><td data-label="Atividade" class="adm-num">Segue '+c.seguindo+' · '+c.curtidas+' curtidas · '+c.comentarios+' comentários</td><td data-label="Cadastro" class="adm-num">'+esc(dia(c.criado_em))+'</td><td class="adm-actions">'+(c.google?'':'<button type="button" class="adm-link" data-adm="senha-cliente" data-id="'+esc(c.id)+'">Link de nova senha</button>')+'<button type="button" class="adm-link is-danger" data-adm="excluir-cliente" data-id="'+esc(c.id)+'">Excluir conta</button></td></tr>').join('')+'</tbody></table></div>'+mais('clientes',lista.length);
}

// ---------- Comentários ----------
function comentarios(){return wrap('comentarios',toolbar('comentarios','Buscar por autor, chef ou texto'),comentariosLista);}
function comentariosLista(){
 const s=st.comentarios,lista=filtrar('comentarios');
 if(!lista.length)return vazio(s.itens.length?'Nenhum comentário encontrado.':'Ainda não há comentários nas fotos.');
 return contagem(lista.length,'comentário','comentários')+'<ul class="adm-comments">'+lista.slice(0,s.limite).map(c=>'<li>'+(c.foto?'<img src="'+esc(c.foto)+'" alt="'+esc(c.legenda||'Foto de '+c.chef)+'" width="64" height="64" loading="lazy">':'<span class="adm-comments-nophoto" aria-hidden="true"></span>')+'<div><p class="adm-comments-meta"><b>'+esc(c.autor)+'</b> na foto de <b>'+esc(c.chef)+'</b> · <time datetime="'+esc(c.criado_em)+'">'+esc(quando(c.criado_em))+'</time></p><p class="adm-comments-text">'+esc(c.texto)+'</p><p class="adm-actions"><a class="adm-link" href="#/chef/'+encodeURIComponent(c.chefId)+'">Ver perfil</a><button type="button" class="adm-link is-danger" data-adm="apagar-comentario" data-id="'+esc(c.id)+'">Apagar</button></p></div></li>').join('')+'</ul>'+mais('comentarios',lista.length);
}

// ---------- Registro de atividades ----------
function atividades(){return wrap('atividades',toolbar('atividades','Buscar por pessoa, ação ou conta'),atividadesLista);}
function atividadesLista(){
 const s=st.atividades,lista=filtrar('atividades');
 if(!lista.length)return vazio(s.itens.length?'Nada encontrado.':'O registro começa a partir desta versão do painel. Cada ação da equipe aparece aqui.');
 return contagem(lista.length,'registro','registros')+'<div class="adm-table-wrap"><table class="adm-table"><thead><tr><th scope="col">Quando</th><th scope="col">Quem</th><th scope="col">O que fez</th><th scope="col">Em</th><th scope="col">Detalhe</th></tr></thead><tbody>'+lista.slice(0,s.limite).map(a=>'<tr><td data-label="Quando" class="adm-num">'+esc(quando(a.criado_em))+'</td><td data-label="Quem">'+esc(a.conta_nome)+'</td><td data-label="O que fez"><b>'+esc(a.acao)+'</b></td><td data-label="Em">'+esc(a.alvo)+'</td><td data-label="Detalhe">'+esc(STATUS[a.detalhe]||a.detalhe)+'</td></tr>').join('')+'</tbody></table></div>'+mais('atividades',lista.length);
}

// ---------- Resumo no estilo "Em resumo" + atividade recente ----------
function glance(){
 if(!resumo)return '';
 const box=(tab,n,label,alerta)=>'<button type="button" class="adm-glance-item'+(alerta?' is-alert':'')+'" data-manage="tab" data-tab="'+tab+'"><b>'+Number(n||0).toLocaleString('pt-BR')+'</b><span>'+label+'</span></button>';
 return '<section class="card adm-glance" aria-label="Em resumo"><div class="adm-glance-grid">'+box('pedidos',resumo.pedidosNovos,resumo.pedidosNovos===1?'pedido novo para acompanhar':'pedidos novos para acompanhar',resumo.pedidosNovos>0)+box('chefs',resumo.chefs,'contas de chefs')+box('clientes',resumo.clientes,'contas de clientes')+box('comentarios',resumo.comentariosSemana,'comentários nos últimos 7 dias')+'</div>'+(resumo.atividades&&resumo.atividades.length?'<div class="adm-recent"><h2>Atividade recente da equipe</h2><ul>'+resumo.atividades.map(a=>'<li><time>'+esc(quando(a.criado_em))+'</time> <b>'+esc(a.conta_nome)+'</b> '+esc(a.acao.toLowerCase())+(a.alvo?': '+esc(a.alvo):'')+'</li>').join('')+'</ul><button type="button" class="adm-link" data-manage="tab" data-tab="atividades">Ver registro completo</button></div>':'')+'</section>';
}
const badge=tab=>{if(!resumo)return 0;return tab==='pedidos'?resumo.pedidosNovos:0;};

// ---------- Planilha (CSV para Excel e Google Planilhas) ----------
const celula=v=>{let t=String(v??'');if(/^[=+\-@\t\r]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"';};
function baixar(nome,linhas){
 const csv='﻿'+linhas.map(l=>l.map(celula).join(';')).join('\r\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download=nome+'-'+new Date().toISOString().slice(0,10)+'.csv';
 document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
}
async function exportar(sec){
 if(sec==='chefs'){const chefs=await CL.adminChefs();return baixar('chefs',[['Nome','E-mail','WhatsApp','Cidades','Especialidade','Pratos','Fotos','Pedidos','Pedidos 7 dias','Último pedido','Situação','Cadastro'],...chefs.map(c=>[c.nome,c.email,c.whatsapp,c.cidades,c.especialidade,c.pratos,c.fotos,c.pedidos,c.pedidos7,c.ultimo?quando(c.ultimo):'',c.oculto?'Escondido':c.pausado?'Pausado':c.falta.length?'Incompleto':'Na vitrine',dia(c.criado_em)])]);}
 const lista=filtrar(sec);
 if(sec==='pedidos')return baixar('pedidos',[['Recebido em','Cliente','Chef','Tipo','Situação','Pedido'],...lista.map(p=>[quando(p.criado_em),p.cliente,p.chef,MODO[p.modo]||'Serviço',STATUS[p.status],p.texto])]);
 if(sec==='clientes')return baixar('clientes',[['Nome','E-mail','WhatsApp','Cidades','Entrada','Segue','Curtidas','Comentários','Cadastro'],...lista.map(c=>[c.nome,c.email,c.whatsapp,c.cidades,c.google?'Google':'E-mail e senha',c.seguindo,c.curtidas,c.comentarios,dia(c.criado_em)])]);
 if(sec==='comentarios')return baixar('comentarios',[['Data','Autor','Chef','Comentário'],...lista.map(c=>[quando(c.criado_em),c.autor,c.chef,c.texto])]);
 if(sec==='atividades')return baixar('registro-atividades',[['Quando','Quem','O que fez','Em','Detalhe'],...lista.map(a=>[quando(a.criado_em),a.conta_nome,a.acao,a.alvo,STATUS[a.detalhe]||a.detalhe])]);
}

// ---------- Ações ----------
const listas={pedidos:pedidosLista,clientes:clientesLista,comentarios:comentariosLista,atividades:atividadesLista};
function soLista(sec){const box=document.getElementById('adm-results');if(box&&box.dataset.sec===sec)box.innerHTML=listas[sec]();else draw();}
const flashHtml=()=>flash?'<p id="adm-flash" class="adm-flash" role="status">'+esc(flash)+'</p>':'';
function aviso(msg){flash=msg;const p=document.getElementById('adm-flash');if(p)p.textContent=msg;else{const h=document.querySelector('.adm-toolbar');if(h)h.insertAdjacentHTML('beforebegin',flashHtml());}clearTimeout(aviso.t);aviso.t=setTimeout(()=>{flash='';document.getElementById('adm-flash')?.remove();},5000);}
document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-adm]');if(!b)return;
 const a=b.dataset.adm,sec=b.dataset.sec,s=st[sec],id=b.dataset.id;
 try{
  if(a==='reload'){if(sec==='clientes')link=null;return load(sec);}
  if(a==='more'){s.limite+=POR_PAGINA;return soLista(sec);}
  if(a==='filtro'){s.filtro=b.dataset.v;s.limite=POR_PAGINA;return draw();}
  if(a==='abrir'){s.aberto=s.aberto===id?'':id;return soLista(sec);}
  if(a==='export'){b.disabled=true;await exportar(sec);return;}
  if(a==='copiar'){const i=b.previousElementSibling;i.select();await navigator.clipboard?.writeText(i.value).catch(()=>document.execCommand('copy'));b.textContent='Copiado';return;}
  if(a==='excluir-pedido'){const p=st.pedidos.itens.find(x=>x.id===id);if(!p||!confirm('Excluir o pedido de '+(p.cliente||'cliente sem nome')+' para '+p.chef+'? Isso não tem volta.'))return;b.disabled=true;await CL.adminExcluirPedido(id);st.pedidos.itens=st.pedidos.itens.filter(x=>x.id!==id);aviso('Pedido excluído.');draw();return loadResumo();}
  if(a==='apagar-comentario'){const c=st.comentarios.itens.find(x=>x.id===id);if(!c||!confirm('Apagar o comentário de '+c.autor+'? Isso não tem volta.'))return;b.disabled=true;await CL.adminApagarComentario(id);st.comentarios.itens=st.comentarios.itens.filter(x=>x.id!==id);aviso('Comentário apagado.');soLista('comentarios');return loadResumo();}
  if(a==='senha-cliente'){const c=st.clientes.itens.find(x=>x.id===id);b.disabled=true;const r=await CL.adminNovaSenha(id);link={nome:c?c.nome:'o cliente',url:r.link,horas:r.horas||48};return soLista('clientes');}
  if(a==='excluir-cliente'){const c=st.clientes.itens.find(x=>x.id===id);if(!c)return;const ok=prompt('Excluir a conta de '+(c.nome||c.email)+' apaga o cadastro, curtidas, comentários e quem ela segue. Não tem volta.\n\nDigite EXCLUIR para confirmar.');if(ok!=='EXCLUIR')return;b.disabled=true;await CL.adminExcluir(id);st.clientes.itens=st.clientes.itens.filter(x=>x.id!==id);aviso('Conta excluída.');soLista('clientes');return loadResumo();}
 }catch(x){b.disabled=false;aviso(x.message||'Não foi possível concluir. Tente de novo.');}
});
document.addEventListener('change',async e=>{
 const sel=e.target.closest('[data-adm-status]');if(!sel)return;
 const id=sel.dataset.admStatus,p=st.pedidos.itens.find(x=>x.id===id),antes=p.status;
 sel.disabled=true;
 try{await CL.adminStatusPedido(id,sel.value);p.status=sel.value;sel.className='adm-status is-'+p.status;aviso('Situação atualizada para '+STATUS[p.status]+'.');loadResumo();}
 catch(x){sel.value=antes;aviso(x.message||'Não foi possível atualizar.');}
 finally{sel.disabled=false;}
});
document.addEventListener('input',e=>{const i=e.target.closest('[data-adm-q]');if(!i)return;const s=st[i.dataset.admQ];s.q=i.value;s.limite=POR_PAGINA;soLista(i.dataset.admQ);});

root.ChefAdminSections={
 has:sec=>sec in st,
 render:sec=>({pedidos,clientes,comentarios,atividades}[sec]||(()=>''))(),
 load,glance,badge,exportar,
 needsLoad:sec=>sec==='dashboard'?!tentou:!!st[sec]&&!st[sec].itens&&!st[sec].loading&&!st[sec].error,
 init:fn=>{draw=fn;},
 reset:()=>{for(const k of Object.keys(st))st[k]=fresh();resumo=null;tentou=false;link=null;}
};
})(window);
