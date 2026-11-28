/* Conexão com o banco do piloto (Cloudflare D1 via /api).
   Se a API não responder (ex.: GitHub Pages), o app continua no modo local de demonstração. */
(function (root) {
  'use strict';
  const BASE = '/api';
  async function req(metodo, rota, corpo, opts = {}) {
    const r = await fetch(BASE + rota, {
      method: metodo, credentials: 'same-origin', keepalive: !!opts.keepalive,
      headers: corpo ? { 'content-type': 'application/json' } : {},
      body: corpo ? JSON.stringify(corpo) : undefined
    });
    let j = null; try { j = await r.json(); } catch (e) {}
    if (!r.ok) { const err = new Error((j && j.erro) || 'Não foi possível falar com o servidor.'); err.status = r.status; throw err; }
    return j;
  }
  const Cloud = {
    on: false,
    temGoogle: false,
    temConvite: false,
    // Descobre se há banco e traz chefs reais e a sessão do chef (se houver).
    async start() {
      try {
        const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 4000);
        const r = await fetch(BASE + '/saude', { signal: ctl.signal, credentials: 'same-origin' }); clearTimeout(t);
        const saude = r.ok ? await r.json() : null;
        if (!saude || !saude.ok) return null;
        Cloud.temGoogle = !!saude.google;
        Cloud.temConvite = !!saude.convite;
      } catch (e) { return null; }
      const [lista, eu] = await Promise.all([req('GET', '/chefs'), req('GET', '/eu')]);
      Cloud.on = true;
      return { chefs: lista.chefs || [], me: eu.chef || null };
    },
    dashboard: (inicio,fim) => req('GET', '/admin/dashboard?'+new URLSearchParams({inicio,fim})),
    site: () => req('GET', '/site'),
    adminSite: () => req('GET', '/admin/site'),
    salvarSite: (config, versao) => req('PUT', '/admin/site', {config, versao}),
    adminPerfil: id => req('GET', '/admin/chefs/' + encodeURIComponent(id)),
    salvarAdminPerfil: (id, perfil, versao) => req('PUT', '/admin/chefs/' + encodeURIComponent(id), {perfil, versao}),
    cadastro: d => req('POST', '/cadastro', d).then(j => j.chef),
    entrar: (email, senha) => req('POST', '/entrar', { email, senha }).then(j => j.chef),
    sair: () => req('POST', '/sair', {}).catch(() => null),
    salvarMenus: (menus,versao) => req('PUT', '/eu/menus', {menus,versao}),
    salvar: perfil => req('PUT', '/eu', { perfil }).then(j => j.chef),
    // Ids dos chefs que estão recebendo pedidos agora (os pausados não aparecem).
    ativos: () => req('GET', '/chefs').then(j => (j.chefs || []).map(c => c.id)),
    statusPedido: (id, status) => req('PATCH', '/meus-pedidos/' + encodeURIComponent(id), { status }),
    // Apaga a conta do chef logado. Precisa da rota DELETE /api/eu no servidor.
    excluir: () => req('DELETE', '/eu'),
    // Registra o pedido antes de abrir o WhatsApp. keepalive mantém o envio mesmo se a aba mudar.
    pedido: (chefId, texto, dados) => req('POST', '/pedidos', { chefId, texto, dados }, { keepalive: true }),
    // Login com Google: o servidor devolve o endereço do Google para onde o navegador deve ir.
    social: id => req('GET', '/social/' + encodeURIComponent(id)),
    seguir: (id, on) => req('POST', '/social/' + encodeURIComponent(id) + '/seguir', { on }),
    curtir: (id, foto, on) => req('POST', '/social/' + encodeURIComponent(id) + '/curtir', { foto, on }),
    comentarios: (id, foto) => req('GET', '/social/' + encodeURIComponent(id) + '/comentarios?foto=' + encodeURIComponent(foto)),
    comentar: (id, foto, texto) => req('POST', '/social/' + encodeURIComponent(id) + '/comentarios', { foto, texto }),
    apagarComentario: id => req('DELETE', '/social/comentario/' + encodeURIComponent(id)),
    google: (modo, dados) => req('POST', '/google/iniciar', { modo, ...dados }).then(j => j.url),
    // Painel da equipe (só e-mails em ADMIN_EMAILS no servidor).
    adminChefs: () => req('GET', '/admin/chefs').then(j => j.chefs || []),
    adminOcultar: (id, oculto) => req('POST', '/admin/chefs/' + encodeURIComponent(id), { oculto }),
    // Link para o chef criar uma senha nova (vale 48 horas) e exclusão de conta pela equipe.
    adminNovaSenha: id => req('POST', '/admin/chefs/' + encodeURIComponent(id), { acao: 'nova-senha' }),
    adminExcluir: id => req('DELETE', '/admin/chefs/' + encodeURIComponent(id)),
    // Seções do painel completo: resumo, pedidos, clientes, comentários e registro de atividades.
    adminResumo: () => req('GET', '/admin/resumo'),
    adminPedidos: () => req('GET', '/admin/pedidos').then(j => j.pedidos || []),
    adminStatusPedido: (id, status) => req('PATCH', '/admin/pedidos/' + encodeURIComponent(id), { status }),
    adminExcluirPedido: id => req('DELETE', '/admin/pedidos/' + encodeURIComponent(id)),
    adminClientes: () => req('GET', '/admin/clientes').then(j => j.clientes || []),
    adminComentarios: () => req('GET', '/admin/comentarios').then(j => j.comentarios || []),
    adminApagarComentario: id => req('DELETE', '/admin/comentarios/' + encodeURIComponent(id)),
    adminAtividades: () => req('GET', '/admin/atividades').then(j => j.atividades || []),
    adminEquipe: () => req('GET', '/admin/equipe'),
    adminAddEquipe: email => req('POST', '/admin/equipe', { email }),
    adminTirarEquipe: email => req('DELETE', '/admin/equipe/' + encodeURIComponent(email)),
    adminServicos: () => req('GET', '/admin/servicos'),
    adminSalvarServicos: (servicos, versao) => req('PUT', '/admin/servicos', { servicos, versao }),
    adminMenus: () => req('GET', '/admin/menus').then(j => j.menus || []),
    adminTirarMenu: (chefId, menuId) => req('POST', '/admin/menus', { chefId, menuId }),
    // O chef abre o link da equipe e cria a senha nova; já sai logado.
    novaSenha: (id, token, senha) => req('POST', '/nova-senha', { id, token, senha }).then(j => j.chef),
    meusPedidos: () => req('GET', '/meus-pedidos').then(j => j.pedidos || [])
  };
  root.ChefCloud = Cloud;
})(typeof window !== 'undefined' ? window : globalThis);
