// API do piloto: Cloudflare Pages Functions + D1.
// Rotas em /api/*. Cada chef só altera o próprio perfil (a sessão decide quem é).
// Variáveis: DB (binding D1), CONVITE (código para criar conta de chef).
import Core from '../../assets/app-core.js';

const C = Core && Core.normalizeData ? Core : globalThis.ChefCore;
const SESSAO_DIAS = 30, PBKDF2_ITER = 100000; // 100 mil é o máximo aceito pelos Workers
const enc = new TextEncoder();

const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
});
const erro = (msg, status = 400) => json({ erro: msg }, status);
const agora = () => new Date().toISOString();
const hex = b => Array.from(new Uint8Array(b), x => x.toString(16).padStart(2, '0')).join('');
const aleatorio = (n = 16) => hex(crypto.getRandomValues(new Uint8Array(n)));
const sha256 = async s => hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));

async function derivar(senha, saltHex, iter) {
  const key = await crypto.subtle.importKey('raw', enc.encode(senha), 'PBKDF2', false, ['deriveBits']);
  const salt = Uint8Array.from(saltHex.match(/../g), x => parseInt(x, 16));
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, key, 256));
}
async function criarCredencial(senha) {
  const sal = aleatorio(16);
  return { algoritmo: 'PBKDF2-SHA256', iteracoes: PBKDF2_ITER, sal, hash: await derivar(senha, sal, PBKDF2_ITER) };
}
async function conferirSenha(senha, cred) {
  if (!cred || cred.algoritmo !== 'PBKDF2-SHA256') return false;
  const h = await derivar(senha, cred.sal, cred.iteracoes);
  // comparação em tempo constante
  if (h.length !== cred.hash.length) return false;
  let d = 0; for (let i = 0; i < h.length; i++) d |= h.charCodeAt(i) ^ cred.hash.charCodeAt(i);
  return d === 0;
}

function cookie(req) {
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)scc_sessao=([a-f\d]{64})/);
  return m ? m[1] : '';
}
const cookieSessao = (token, dias) =>
  `scc_sessao=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.round(dias * 86400)}`;

async function chefDaSessao(env, req) {
  const t = cookie(req); if (!t) return null;
  const row = await env.DB.prepare(
    'SELECT c.* FROM sessoes s JOIN chefs c ON c.id = s.chef_id WHERE s.token_hash = ? AND s.expira_em > ?'
  ).bind(await sha256(t), agora()).first();
  return row || null;
}
async function abrirSessao(env, chefId) {
  const token = aleatorio(32), expira = new Date(Date.now() + SESSAO_DIAS * 864e5).toISOString();
  await env.DB.prepare('INSERT INTO sessoes (token_hash, chef_id, expira_em) VALUES (?, ?, ?)')
    .bind(await sha256(token), chefId, expira).run();
  await env.DB.prepare('DELETE FROM sessoes WHERE expira_em <= ?').bind(agora()).run();
  return token;
}

// Limite simples por origem: n tentativas por janela.
async function limitar(env, req, tipo, max, janelaSeg) {
  const ip = req.headers.get('cf-connecting-ip') || 'local';
  const chave = tipo + ':' + await sha256(ip), t = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare('SELECT n, expira_em FROM limites WHERE chave = ?').bind(chave).first();
  if (!row || row.expira_em <= t) {
    await env.DB.prepare('INSERT OR REPLACE INTO limites (chave, n, expira_em) VALUES (?, 1, ?)').bind(chave, t + janelaSeg).run();
    return true;
  }
  if (row.n >= max) return false;
  await env.DB.prepare('UPDATE limites SET n = n + 1 WHERE chave = ?').bind(chave).run();
  return true;
}

const txt = (v, max) => String(v ?? '').trim().slice(0, max);
const FOTO_LOCAL = /^\/api\/foto\/[a-f\d]{32}$/;
const DATA_URL = /^data:image\/jpeg;base64,([a-z\d+/=]+)$/i;

// Limpa o perfil enviado pelo app. Só passam campos conhecidos.
// Fotos: data:image/jpeg vira registro na tabela fotos; /api/foto/<id> só se for do próprio chef.
async function limparPerfil(env, chefId, p, atual) {
  const minhas = new Set((await env.DB.prepare('SELECT id FROM fotos WHERE chef_id = ?').bind(chefId).all()).results.map(r => r.id));
  const novas = [];
  async function foto(url) {
    url = String(url || '');
    if (FOTO_LOCAL.test(url)) return minhas.has(url.slice(10)) ? url : '';
    const m = url.match(DATA_URL); if (!m) return '';
    const bin = Uint8Array.from(atob(m[1]), c => c.charCodeAt(0));
    if (bin.length > 1.5 * 1024 * 1024 || bin[0] !== 0xff || bin[1] !== 0xd8) return ''; // só JPEG até 1,5 MB
    const id = aleatorio(16); novas.push({ id, bin }); minhas.add(id);
    return '/api/foto/' + id;
  }
  const whatsapp = txt(p.whatsapp, 30);
  if (!C.phone(whatsapp)) throw new Error('Informe um WhatsApp válido com DDD.');
  let instagram = txt(p.instagram, 200);
  if (instagram) { try { const u = new URL(instagram); if (u.protocol !== 'https:' || !['instagram.com', 'www.instagram.com'].includes(u.hostname)) instagram = ''; } catch { instagram = ''; } }
  const nome = txt(p.name, 120); if (nome.length < 2) throw new Error('Informe um nome com pelo menos 2 caracteres.');
  const out = {
    name: nome, whatsapp, instagram,
    phone: txt(p.phone, 30), cities: txt(p.cities, 160), specialty: txt(p.specialty, 80), bio: txt(p.bio, 2000),
    avatar: await foto(p.avatar),
    gallery: [], dishes: []
  };
  for (const g of (Array.isArray(p.gallery) ? p.gallery : []).slice(0, 30)) {
    const url = await foto(g && g.url); if (url) out.gallery.push({ id: txt(g.id, 40) || aleatorio(6), url, caption: txt(g.caption, 600) });
  }
  for (const d of (Array.isArray(p.dishes) ? p.dishes : []).slice(0, 120)) {
    if (!d || !txt(d.name, 150)) continue;
    const price = Number(d.price);
    const x = { id: typeof d.id === 'number' ? d.id : txt(d.id, 40), category: txt(d.category, 60), name: txt(d.name, 150), desc: txt(d.desc, 600), price: Number.isFinite(price) && price >= 0 && price <= 100000 ? Math.round(price * 100) / 100 : 0 };
    if (d.marmita === true) x.marmita = true;
    out.dishes.push(x);
  }
  const m = C.cleanMarmita(p.marmita); if (m) out.marmita = m;
  const o = C.cleanOpcoes(p.opcoes); if (o) out.opcoes = o;
  const a = C.cleanAgenda(p.agenda); if (a) out.agenda = a;
  // Grava fotos novas e apaga as que o perfil deixou de usar.
  for (const f of novas) await env.DB.prepare('INSERT INTO fotos (id, chef_id, tipo, dados, criado_em) VALUES (?, ?, ?, ?, ?)').bind(f.id, chefId, 'image/jpeg', f.bin, agora()).run();
  const usadas = new Set([out.avatar, ...out.gallery.map(g => g.url)].filter(Boolean).map(u => u.slice(10)));
  for (const id of minhas) if (!usadas.has(id)) await env.DB.prepare('DELETE FROM fotos WHERE id = ? AND chef_id = ?').bind(id, chefId).run();
  return out;
}

const publico = row => ({ ...JSON.parse(row.perfil), id: row.id, cloud: true });
const doDono = row => ({ ...publico(row), email: row.email });

async function corpo(req) {
  if (!(req.headers.get('content-type') || '').startsWith('application/json')) throw new Error('Envie JSON.');
  const t = await req.text(); if (t.length > 12 * 1024 * 1024) throw new Error('Envio grande demais.');
  return JSON.parse(t || '{}');
}

export async function onRequest({ request: req, env, params }) {
  if (!env.DB) return erro('Banco não configurado.', 503);
  const rota = '/' + [].concat(params.rota || []).join('/'), metodo = req.method;
  try {
    if (rota === '/saude') return json({ ok: true });

    if (rota === '/chefs' && metodo === 'GET') {
      const { results } = await env.DB.prepare('SELECT id, perfil FROM chefs WHERE publicado = 1 ORDER BY criado_em').all();
      return json({ chefs: results.map(publico) }, 200, { 'cache-control': 'public, max-age=30' });
    }

    if (rota.startsWith('/foto/') && metodo === 'GET') {
      const id = rota.slice(6); if (!/^[a-f\d]{32}$/.test(id)) return erro('Foto não encontrada.', 404);
      const f = await env.DB.prepare('SELECT tipo, dados FROM fotos WHERE id = ?').bind(id).first();
      if (!f) return erro('Foto não encontrada.', 404);
      return new Response(new Uint8Array(f.dados), { headers: { 'content-type': f.tipo, 'cache-control': 'public, max-age=31536000, immutable' } });
    }

    if (rota === '/eu' && metodo === 'GET') {
      const c = await chefDaSessao(env, req); return json({ chef: c ? doDono(c) : null });
    }

    if (rota === '/cadastro' && metodo === 'POST') {
      if (!await limitar(env, req, 'cadastro', 10, 3600)) return erro('Muitas tentativas. Tente de novo em uma hora.', 429);
      const b = await corpo(req);
      if (!env.CONVITE || txt(b.convite, 80) !== env.CONVITE) return erro('Código de convite inválido. Peça o código à equipe.', 403);
      const email = C.email(b.email); if (!C.validEmail(email)) return erro('Confira o e-mail informado.');
      const senha = String(b.senha || ''); if (senha.length < 8 || senha.length > 200) return erro('Crie uma senha com pelo menos 8 caracteres.');
      if (await env.DB.prepare('SELECT 1 FROM chefs WHERE email = ?').bind(email).first()) return erro('Este e-mail já está cadastrado. Use Entrar.', 409);
      const id = 'chef-' + aleatorio(8);
      const perfil = await limparPerfil(env, id, { name: b.nome, whatsapp: b.whatsapp, cities: b.cidades }, null);
      await env.DB.prepare('INSERT INTO chefs (id, email, credencial, perfil, publicado, criado_em, atualizado_em) VALUES (?, ?, ?, ?, 1, ?, ?)')
        .bind(id, email, JSON.stringify(await criarCredencial(senha)), JSON.stringify(perfil), agora(), agora()).run();
      const token = await abrirSessao(env, id);
      const row = await env.DB.prepare('SELECT * FROM chefs WHERE id = ?').bind(id).first();
      return json({ chef: doDono(row) }, 201, { 'set-cookie': cookieSessao(token, SESSAO_DIAS) });
    }

    if (rota === '/entrar' && metodo === 'POST') {
      if (!await limitar(env, req, 'entrar', 10, 900)) return erro('Muitas tentativas. Espere 15 minutos.', 429);
      const b = await corpo(req), email = C.email(b.email);
      const row = await env.DB.prepare('SELECT * FROM chefs WHERE email = ?').bind(email).first();
      if (!row || !await conferirSenha(String(b.senha || ''), JSON.parse(row.credencial))) return erro('E-mail ou senha incorretos.', 401);
      const token = await abrirSessao(env, row.id);
      return json({ chef: doDono(row) }, 200, { 'set-cookie': cookieSessao(token, SESSAO_DIAS) });
    }

    if (rota === '/sair' && metodo === 'POST') {
      const t = cookie(req); if (t) await env.DB.prepare('DELETE FROM sessoes WHERE token_hash = ?').bind(await sha256(t)).run();
      return json({ ok: true }, 200, { 'set-cookie': cookieSessao('', 0) });
    }

    if (rota === '/eu' && metodo === 'PUT') {
      const c = await chefDaSessao(env, req); if (!c) return erro('Entre de novo para salvar.', 401);
      const b = await corpo(req), p = b.perfil || {};
      const email = C.email(p.email || c.email);
      if (!C.validEmail(email)) return erro('Confira o e-mail informado.');
      if (email !== c.email && await env.DB.prepare('SELECT 1 FROM chefs WHERE email = ? AND id <> ?').bind(email, c.id).first()) return erro('Este e-mail já está cadastrado.', 409);
      const perfil = await limparPerfil(env, c.id, p, JSON.parse(c.perfil));
      await env.DB.prepare('UPDATE chefs SET email = ?, perfil = ?, atualizado_em = ? WHERE id = ?').bind(email, JSON.stringify(perfil), agora(), c.id).run();
      return json({ chef: doDono(await env.DB.prepare('SELECT * FROM chefs WHERE id = ?').bind(c.id).first()) });
    }

    if (rota === '/pedidos' && metodo === 'POST') {
      if (!await limitar(env, req, 'pedido', 20, 3600)) return erro('Muitos pedidos seguidos. Tente mais tarde.', 429);
      const b = await corpo(req), chefId = txt(b.chefId, 40);
      if (!await env.DB.prepare('SELECT 1 FROM chefs WHERE id = ? AND publicado = 1').bind(chefId).first()) return erro('Chef não encontrado.', 404);
      const texto = txt(b.texto, 6000); if (texto.length < 20) return erro('Pedido incompleto.');
      const dados = JSON.stringify(b.dados && typeof b.dados === 'object' ? b.dados : {}).slice(0, 20000);
      const id = aleatorio(12);
      await env.DB.prepare('INSERT INTO pedidos (id, chef_id, texto, dados, criado_em) VALUES (?, ?, ?, ?, ?)').bind(id, chefId, texto, dados, agora()).run();
      return json({ id }, 201);
    }

    if (rota === '/meus-pedidos' && metodo === 'GET') {
      const c = await chefDaSessao(env, req); if (!c) return erro('Entre para ver seus pedidos.', 401);
      const { results } = await env.DB.prepare('SELECT id, texto, criado_em FROM pedidos WHERE chef_id = ? ORDER BY criado_em DESC LIMIT 100').bind(c.id).all();
      return json({ pedidos: results });
    }

    return erro('Rota não encontrada.', 404);
  } catch (e) {
    const msg = e && e.message && /[áéíóúãõç]|Informe|Confira|Envie/.test(e.message) ? e.message : 'Erro no servidor. Tente de novo.';
    return erro(msg, e instanceof SyntaxError ? 400 : (msg.startsWith('Erro') ? 500 : 400));
  }
}
