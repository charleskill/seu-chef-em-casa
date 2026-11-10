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
    cadastro: d => req('POST', '/cadastro', d).then(j => j.chef),
    entrar: (email, senha) => req('POST', '/entrar', { email, senha }).then(j => j.chef),
    sair: () => req('POST', '/sair', {}).catch(() => null),
    salvar: perfil => req('PUT', '/eu', { perfil }).then(j => j.chef),
    // Ids dos chefs que estão recebendo pedidos agora (os pausados não aparecem).
    ativos: () => req('GET', '/chefs').then(j => (j.chefs || []).map(c => c.id)),
    statusPedido: (id, status) => req('PATCH', '/meus-pedidos/' + encodeURIComponent(id), { status }),
    // Apaga a conta do chef logado. Precisa da rota DELETE /api/eu no servidor.
    excluir: () => req('DELETE', '/eu'),
    // Registra o pedido antes de abrir o WhatsApp. keepalive mantém o envio mesmo se a aba mudar.
    pedido: (chefId, texto, dados) => req('POST', '/pedidos', { chefId, texto, dados }, { keepalive: true }),
    // Login com Google: o servidor devolve o endereço do Google para onde o navegador deve ir.
    google: (modo, dados) => req('POST', '/google/iniciar', { modo, ...dados }).then(j => j.url),
    // Painel da equipe (só e-mails em ADMIN_EMAILS no servidor).
    adminChefs: () => req('GET', '/admin/chefs').then(j => j.chefs || []),
    adminOcultar: (id, oculto) => req('POST', '/admin/chefs/' + encodeURIComponent(id), { oculto }),
    // Link para o chef criar uma senha nova (vale 48 horas) e exclusão de conta pela equipe.
    adminNovaSenha: id => req('POST', '/admin/chefs/' + encodeURIComponent(id), { acao: 'nova-senha' }),
    adminExcluir: id => req('DELETE', '/admin/chefs/' + encodeURIComponent(id)),
    // O chef abre o link da equipe e cria a senha nova; já sai logado.
    novaSenha: (id, token, senha) => req('POST', '/nova-senha', { id, token, senha }).then(j => j.chef),
    meusPedidos: () => req('GET', '/meus-pedidos').then(j => j.pedidos || [])
  };
  root.ChefCloud = Cloud;
})(typeof window !== 'undefined' ? window : globalThis);
