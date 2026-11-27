// Mural de pedidos (modelo GetNinjas, sem cobrança no começo).
// Cliente publica o evento → chefs da cidade recebem aviso e veem sem o contato → até 4 liberam o contato e chamam o cliente.
// Rotas (todas com sessão): POST /mural · GET /mural · POST /mural/<id>/liberar · POST /mural/<id>/denunciar
//                           GET /mural/meus · POST /mural/meus/<id>/fechar
import MuralCore from '../../assets/mural-core.js';
const M = MuralCore && MuralCore.limpar ? MuralCore : globalThis.ChefMuralCore;

export const MURAL_ESQUEMA = [
  "CREATE TABLE IF NOT EXISTS mural_pedidos (id TEXT PRIMARY KEY, conta_id TEXT NOT NULL, cidade_slug TEXT NOT NULL, dados TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'aberto', criado_em TEXT NOT NULL, expira_em TEXT NOT NULL)",
  'CREATE INDEX IF NOT EXISTS mural_pedidos_cidade ON mural_pedidos(cidade_slug, status, expira_em)',
  'CREATE INDEX IF NOT EXISTS mural_pedidos_conta ON mural_pedidos(conta_id, criado_em)',
  'CREATE TABLE IF NOT EXISTS mural_liberacoes (pedido_id TEXT NOT NULL, chef_id TEXT NOT NULL, ordem INTEGER NOT NULL, criado_em TEXT NOT NULL, PRIMARY KEY (pedido_id, chef_id))',
  'CREATE INDEX IF NOT EXISTS mural_liberacoes_chef ON mural_liberacoes(chef_id, criado_em)',
  'CREATE TABLE IF NOT EXISTS mural_denuncias (pedido_id TEXT NOT NULL, chef_id TEXT NOT NULL, criado_em TEXT NOT NULL, PRIMARY KEY (pedido_id, chef_id))'
];
const DENUNCIAS_PARA_OCULTAR = 2;

// Ao excluir a conta: some com os pedidos dela, as liberações e denúncias feitas por ela.
export const apagarMural = (env, id) => [
  env.DB.prepare('DELETE FROM mural_liberacoes WHERE chef_id = ? OR pedido_id IN (SELECT id FROM mural_pedidos WHERE conta_id = ?)').bind(id, id),
  env.DB.prepare('DELETE FROM mural_denuncias WHERE chef_id = ? OR pedido_id IN (SELECT id FROM mural_pedidos WHERE conta_id = ?)').bind(id, id),
  env.DB.prepare('DELETE FROM mural_pedidos WHERE conta_id = ?').bind(id)
];

const perfilDe = row => { try { return JSON.parse(row.perfil || '{}'); } catch { return {}; } };
const ehChef = (C, p) => p.tipo !== 'cliente' && !C.faltaPerfil(p).length;

function emailChef(d, origem, perfil, p) {
  const link = origem + '/#/painel/mural', e = d.escH;
  const linhas = M.resumo(p).map(l => e(l)).join('<br>');
  return { assunto: 'Pedido novo em ' + M.cidadeTxt(p) + ': ' + M.titulo(p).toLowerCase(),
    texto: 'Olá! Um cliente publicou um pedido no mural do Seu Chef em Casa.\n\n' + M.resumo(p).join('\n') + '\n\n' + p.detalhes + '\n\nAté ' + M.MAX_CHEFS + ' chefs podem liberar o contato. Veja no painel: ' + link + '\n',
    html: d.layoutEmail(origem, { titulo: 'Pedido novo na sua cidade',
      corpo: d.pEmail('Um cliente publicou um pedido no mural e você atende em <b>' + e(M.cidadeTxt(p)) + '</b>.')
        + '<div style="background:#f7f5f0;border-left:3px solid #b4aa83;border-radius:10px;padding:16px 18px;margin:6px 0 10px;font-size:14px;line-height:1.6;color:#283b30"><b>' + linhas + '</b><br><br>' + e(p.detalhes) + '</div>'
        + d.pEmail('Só ' + M.MAX_CHEFS + ' chefs podem liberar o contato deste cliente. Quem chega primeiro tem mais chance.'),
      botao: 'Ver no mural', link, nota: 'Liberar o contato é grátis neste começo do Seu Chef em Casa.' }) };
}
function emailCliente(d, origem, chefNome, p) {
  const link = origem + '/#/painel', e = d.escH;
  return { assunto: chefNome + ' quer atender seu pedido',
    texto: chefNome + ' viu seu pedido (' + M.titulo(p).toLowerCase() + ') e vai te chamar pelo WhatsApp.\nVeja o perfil e os outros chefs interessados: ' + link + '\n',
    html: d.layoutEmail(origem, { titulo: 'Um chef quer atender seu pedido',
      corpo: d.pEmail('<b>' + e(chefNome) + '</b> viu seu pedido de ' + e(M.titulo(p).toLowerCase()) + ' e vai te chamar pelo WhatsApp.')
        + d.pEmail('Enquanto isso, veja o perfil, o cardápio e as fotos dos chefs interessados.'),
      botao: 'Ver chefs interessados', link }) };
}

// d: utilitários do arquivo da API. Devolve uma Response ou null quando a rota não é do mural.
export async function rotaMural(rota, metodo, req, env, d) {
  if (rota !== '/mural' && !rota.startsWith('/mural/')) return null;
  const { json, erro, corpo, notificar, enviarEmail, aleatorio, agora, C } = d;
  const eu = await d.chefDaSessao(env, req);
  if (!eu) return erro('Entre na sua conta para usar o mural.', 401);
  const meuPerfil = perfilDe(eu), origem = new URL(req.url).origin, hoje = M.hoje();
  const depois = p => { if (typeof d.waitUntil === 'function') d.waitUntil(p); else return p; };

  // Equipe: acompanha todos os pedidos (os sem resposta primeiro) e remove os suspeitos.
  if (rota === '/mural/admin' || rota.startsWith('/mural/admin/')) {
    if (!d.ehAdmin(env, eu)) return erro('Acesso só para a equipe.', 403);
    if (rota === '/mural/admin' && metodo === 'GET') {
      const { results } = await env.DB.prepare("SELECT p.id, p.dados, p.status, p.criado_em, p.expira_em, (SELECT COUNT(*) FROM mural_liberacoes l WHERE l.pedido_id = p.id) liberados, (SELECT COUNT(*) FROM mural_denuncias x WHERE x.pedido_id = p.id) denuncias FROM mural_pedidos p ORDER BY p.criado_em DESC LIMIT 150").all();
      return json({ pedidos: results.map(r => ({ id: r.id, ...JSON.parse(r.dados), status: r.expira_em < hoje && r.status === 'aberto' ? 'vencido' : r.status, criado_em: r.criado_em, liberados: r.liberados, denuncias: r.denuncias })) });
    }
    const x = rota.match(/^\/mural\/admin\/([a-f\d]{24})\/remover$/);
    if (x && metodo === 'POST') {
      const r = await env.DB.prepare("UPDATE mural_pedidos SET status = 'oculto' WHERE id = ?").bind(x[1]).run();
      return r.meta.changes ? json({ ok: true }) : erro('Pedido não encontrado.', 404);
    }
    return erro('Rota do mural não encontrada.', 404);
  }

  // Cliente publica um pedido.
  if (rota === '/mural' && metodo === 'POST') {
    if (!await d.limitar(env, req, 'mural', 6, 3600)) return erro('Muitos pedidos seguidos. Tente mais tarde.', 429);
    const abertos = await env.DB.prepare("SELECT COUNT(*) n FROM mural_pedidos WHERE conta_id = ? AND status IN ('aberto','completo') AND expira_em >= ?").bind(eu.id, hoje).first();
    if ((abertos && abertos.n) >= M.MAX_ABERTOS) return erro('Você já tem ' + M.MAX_ABERTOS + ' pedidos abertos. Feche um deles para publicar outro.', 409);
    let p; try { const b = await corpo(req); p = M.limpar({ ...b, nome: b.nome || meuPerfil.name }); } catch (e) { return json({ erro: e.message, campo: e.campo || '' }, 400); }
    const id = aleatorio(12), criado = agora();
    await env.DB.prepare('INSERT INTO mural_pedidos (id, conta_id, cidade_slug, dados, status, criado_em, expira_em) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(id, eu.id, p.cidadeSlug, JSON.stringify(p), 'aberto', criado, M.expira(p, criado)).run();
    // Avisa os chefs completos e visíveis que atendem a cidade.
    const { results } = await env.DB.prepare('SELECT id, email, perfil FROM chefs WHERE publicado = 1 AND oculto = 0 AND id != ?').bind(eu.id).all();
    const alvos = results.filter(r => { const pf = perfilDe(r); return ehChef(C, pf) && M.atende(pf, p.cidade, p.uf); });
    const avisos = alvos.map(r => Promise.all([
      notificar(env, r.id, 'mural', 'Pedido novo em ' + M.cidadeTxt(p) + ': ' + M.titulo(p).toLowerCase() + '.', '#/painel/mural'),
      enviarEmail(env, r.email, emailChef(d, origem, perfilDe(r), p))
    ]).catch(() => false));
    await depois(Promise.all(avisos));
    return json({ id, chefsAvisados: alvos.length }, 201);
  }

  // Cliente acompanha os próprios pedidos e vê quem liberou o contato.
  if (rota === '/mural/meus' && metodo === 'GET') {
    const { results } = await env.DB.prepare('SELECT id, dados, status, criado_em, expira_em FROM mural_pedidos WHERE conta_id = ? ORDER BY criado_em DESC LIMIT 20').bind(eu.id).all();
    const ids = results.map(r => r.id);
    const libs = ids.length ? (await env.DB.prepare('SELECT l.pedido_id, l.ordem, l.criado_em, c.id, c.perfil FROM mural_liberacoes l JOIN chefs c ON c.id = l.chef_id WHERE l.pedido_id IN (' + ids.map(() => '?').join(',') + ') ORDER BY l.ordem').bind(...ids).all()).results : [];
    return json({ pedidos: results.map(r => {
      const p = JSON.parse(r.dados), vencido = r.expira_em < hoje && r.status !== 'fechado';
      return { id: r.id, ...p, status: vencido ? 'vencido' : r.status, criado_em: r.criado_em, expira_em: r.expira_em,
        chefs: libs.filter(l => l.pedido_id === r.id).map(l => { const c = perfilDe(l); return { id: l.id, nome: c.name || 'Chef', foto: c.avatar || ((c.gallery || [])[0] || {}).url || '', especialidade: c.specialty || '', whatsapp: c.whatsapp || '', ordem: l.ordem, em: l.criado_em }; }) };
    }) });
  }
  if (rota.startsWith('/mural/meus/') && rota.endsWith('/fechar') && metodo === 'POST') {
    const id = rota.slice(12, -7);
    const r = await env.DB.prepare("UPDATE mural_pedidos SET status = 'fechado' WHERE id = ? AND conta_id = ?").bind(id, eu.id).run();
    return r.meta.changes ? json({ ok: true }) : erro('Pedido não encontrado.', 404);
  }

  // Daqui para baixo, só chef com perfil completo.
  if (meuPerfil.tipo === 'cliente') return erro('O mural é para chefs. Clientes acompanham os pedidos no painel.', 403);
  const falta = C.faltaPerfil(meuPerfil);

  // Chef vê os pedidos das cidades que atende.
  if (rota === '/mural' && metodo === 'GET') {
    const cidades = M.cidadesDe(meuPerfil);
    if (!cidades.length) return json({ pedidos: [], falta, cidades: [] });
    const { results } = await env.DB.prepare("SELECT p.id, p.dados, p.status, p.criado_em, p.expira_em, (SELECT COUNT(*) FROM mural_liberacoes l WHERE l.pedido_id = p.id) liberados, (SELECT ordem FROM mural_liberacoes l WHERE l.pedido_id = p.id AND l.chef_id = ?) minha FROM mural_pedidos p WHERE p.cidade_slug IN (" + cidades.map(() => '?').join(',') + ") AND p.status IN ('aberto','completo') AND p.expira_em >= ? AND p.conta_id != ? AND NOT EXISTS (SELECT 1 FROM mural_denuncias x WHERE x.pedido_id = p.id AND x.chef_id = ?) ORDER BY p.criado_em DESC")
      .bind(eu.id, ...cidades, hoje, eu.id, eu.id).all();
    const pedidos = [];
    for (const r of results) {
      if (r.status !== 'aberto' && !r.minha) continue;
      const p = JSON.parse(r.dados);
      if (!M.atende(meuPerfil, p.cidade, p.uf)) continue;
      pedidos.push({ id: r.id, ...(r.minha ? p : M.semContato(p)), liberados: r.liberados, vagas: Math.max(0, M.MAX_CHEFS - r.liberados), minha: r.minha || 0, criado_em: r.criado_em });
      if (pedidos.length === 60) break;
    }
    return json({ falta, cidades, pedidos });
  }

  const m = rota.match(/^\/mural\/([a-f\d]{24})\/(liberar|denunciar)$/);
  if (m && metodo === 'POST') {
    const [, id, acao] = m;
    const row = await env.DB.prepare('SELECT id, conta_id, dados, status, expira_em FROM mural_pedidos WHERE id = ?').bind(id).first();
    if (!row || row.conta_id === eu.id) return erro('Pedido não encontrado.', 404);
    const p = JSON.parse(row.dados);
    if (!M.atende(meuPerfil, p.cidade, p.uf)) return erro('Este pedido é de uma cidade que você não atende.', 403);
    if (acao === 'denunciar') {
      await env.DB.prepare('INSERT OR IGNORE INTO mural_denuncias (pedido_id, chef_id, criado_em) VALUES (?, ?, ?)').bind(id, eu.id, agora()).run();
      const n = await env.DB.prepare('SELECT COUNT(*) n FROM mural_denuncias WHERE pedido_id = ?').bind(id).first();
      if (n.n >= DENUNCIAS_PARA_OCULTAR) await env.DB.prepare("UPDATE mural_pedidos SET status = 'oculto' WHERE id = ? AND status != 'fechado'").bind(id).run();
      return json({ ok: true });
    }
    if (falta.length) return erro('Complete seu perfil (foto, um prato e cidade) para liberar contatos.', 403);
    const ja = await env.DB.prepare('SELECT ordem FROM mural_liberacoes WHERE pedido_id = ? AND chef_id = ?').bind(id, eu.id).first();
    if (!ja) {
      if (row.status === 'completo') return erro('Outros ' + M.MAX_CHEFS + ' chefs já pegaram este pedido.', 409);
      if (row.status !== 'aberto' || row.expira_em < hoje) return erro('Este pedido já foi encerrado.', 410);
      // Insere só se ainda há vaga: a contagem e a inserção acontecem no mesmo comando.
      const r = await env.DB.prepare('INSERT OR IGNORE INTO mural_liberacoes (pedido_id, chef_id, ordem, criado_em) SELECT ?, ?, COUNT(*) + 1, ? FROM mural_liberacoes WHERE pedido_id = ? HAVING COUNT(*) < ?')
        .bind(id, eu.id, agora(), id, M.MAX_CHEFS).run();
      if (!r.meta.changes) return erro('Outros ' + M.MAX_CHEFS + ' chefs já pegaram este pedido.', 409);
      const total = await env.DB.prepare('SELECT COUNT(*) n FROM mural_liberacoes WHERE pedido_id = ?').bind(id).first();
      if (total.n >= M.MAX_CHEFS) await env.DB.prepare("UPDATE mural_pedidos SET status = 'completo' WHERE id = ? AND status = 'aberto'").bind(id).run();
      const cliente = await env.DB.prepare('SELECT email FROM chefs WHERE id = ?').bind(row.conta_id).first();
      const nome = String(meuPerfil.name || 'Um chef').slice(0, 60);
      await depois(Promise.all([
        notificar(env, row.conta_id, 'mural', nome + ' quer atender seu pedido e vai te chamar no WhatsApp.', '#/painel'),
        cliente ? enviarEmail(env, cliente.email, emailCliente(d, origem, nome, p)) : false
      ]).catch(() => false));
    }
    const ordem = ja ? ja.ordem : (await env.DB.prepare('SELECT ordem FROM mural_liberacoes WHERE pedido_id = ? AND chef_id = ?').bind(id, eu.id).first()).ordem;
    return json({ ordem, contato: { nome: p.nome, whatsapp: p.whatsapp }, mensagem: M.mensagem(meuPerfil.name, p, origem + '/#/chef/' + eu.id) });
  }
  return erro('Rota do mural não encontrada.', 404);
}
