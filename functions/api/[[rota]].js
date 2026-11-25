// API do piloto: Cloudflare Pages Functions + D1.
// Rotas em /api/*. Cada chef só altera o próprio perfil (a sessão decide quem é).
// Variáveis: DB (binding D1), CONVITE (opcional: se existir, exige esse código para criar conta de chef; sem ela, cadastro aberto),
// GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET (login com Google; sem elas o botão não aparece),
// Administração restrita ao único e-mail autorizado em ChefCore.isAdminEmail; ADMIN_EMAILS legado não amplia acesso.
// EMAIL_REMETENTE + RESEND_API_KEY (Resend, preferido) ou CF_ACCOUNT_ID + CF_EMAIL_TOKEN (Cloudflare Email Service): aviso de pedido e recuperação de senha por e-mail; sem elas, não envia.
import Core from '../../assets/app-core.js';
import Site from '../../assets/site-settings.js';
import Dashboard from '../../assets/dashboard-core.js';
import Menus from '../../assets/menus-core.js';
import ServicePhotos from '../../assets/service-photos.js';

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
    // Preserva somente os arquivos de apresentação já pertencentes ao perfil editado.
    if (/^\/assets\/apresentacao\/[a-z0-9-]+\.webp$/.test(url) && atual && [atual.avatar,...(atual.gallery||[]).map(g=>g.url)].includes(url)) return url;
    if (FOTO_LOCAL.test(url)) return minhas.has(url.slice(10)) ? url : '';
    const m = url.match(DATA_URL); if (!m) return '';
    const bin = Uint8Array.from(atob(m[1]), c => c.charCodeAt(0));
    if (bin.length > 1.5 * 1024 * 1024 || bin[0] !== 0xff || bin[1] !== 0xd8) return ''; // só JPEG até 1,5 MB
    const id = aleatorio(16); novas.push({ id, bin }); minhas.add(id);
    return '/api/foto/' + id;
  }
  const whatsapp = txt(p.whatsapp, 30);
  if (!C.phone(whatsapp) && !((p.semWhatsapp || p.tipo === 'cliente' || (atual && atual.tipo === 'cliente')) && !whatsapp)) throw new Error('Informe um WhatsApp válido com DDD.');
  let instagram = txt(p.instagram, 200);
  if (instagram) { try { const u = new URL(instagram); if (u.protocol !== 'https:' || !['instagram.com', 'www.instagram.com'].includes(u.hostname)) instagram = ''; } catch { instagram = ''; } }
  const nome = txt(p.name, 120); if (nome.length < 2) throw new Error('Informe um nome com pelo menos 2 caracteres.');
  const out = {
    name: nome, whatsapp, instagram, tipo: atual ? (atual.tipo === 'cliente' ? 'cliente' : 'chef') : (p.tipo === 'cliente' ? 'cliente' : 'chef'),
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
  const usadas = new Set([out.avatar, ...out.gallery.map(g => g.url), ...(atual?.menus||[]).map(m=>m.photo)].filter(Boolean).map(u => u.slice(10)));
  for (const id of minhas) if (!usadas.has(id)) await env.DB.prepare('DELETE FROM fotos WHERE id = ? AND chef_id = ?').bind(id, chefId).run();
  return out;
}

// ---------- Login com Google (OpenID Connect, fluxo de código com PKCE) ----------
// O navegador vai ao Google; o Google volta em /api/google/retorno com um código; o servidor troca o código
// por um id_token direto com o Google (com o segredo) e confere aud, iss, validade, nonce e e-mail verificado.
// GOOGLE_BASE_TESTE só existe para teste local (servidor falso do Google); em produção fica vazio.
const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const googleOn = env => !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
function googleUrls(env) {
  const t = env.GOOGLE_BASE_TESTE;
  return t ? { auth: t + '/auth', token: t + '/token', iss: [t] }
    : { auth: 'https://accounts.google.com/o/oauth2/v2/auth', token: 'https://oauth2.googleapis.com/token', iss: ['https://accounts.google.com', 'accounts.google.com'] };
}
const cookieOauth = (estado, seg) => `scc_oauth=${estado}; Path=/api/google; HttpOnly; Secure; SameSite=Lax; Max-Age=${seg}`;
const voltar = (origem, destino, extra = {}) => new Response(null, { status: 302, headers: { location: origem + destino, 'cache-control': 'no-store', ...extra } });
function lerIdToken(t) {
  const parte = String(t || '').split('.')[1]; if (!parte) return null;
  try { return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(parte.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)))); } catch { return null; }
}

const publico = row => {const p=JSON.parse(row.perfil);delete p.menusVersao;return {...p,menus:Menus.active(p.menus),id:row.id,cloud:true}};
const ehAdmin = (env, row) => !!row && C.isAdminEmail(row.email);
// Avisos do sino. Falha ao avisar nunca derruba a ação principal.
async function notificar(env, contaId, tipo, texto, link = '') {
  try { await env.DB.prepare('INSERT INTO notificacoes (id, conta_id, tipo, texto, link, criado_em) VALUES (?, ?, ?, ?, ?, ?)').bind(aleatorio(12), contaId, tipo, txt(texto, 200), txt(link, 200), agora()).run(); } catch { /* sem aviso */ }
}
const nomeDe = row => { try { return txt(JSON.parse(row.perfil).name, 60) || 'Alguém'; } catch { return 'Alguém'; } };
const doDono = (row, env = {}) => ({ ...publico(row), menus:JSON.parse(row.perfil).menus||[],menusVersao:JSON.parse(row.perfil).menusVersao||'', email: row.email, pausado: !row.publicado, oculto: !!row.oculto, admin: ehAdmin(env, row) });

// ---------- Aviso de pedido por e-mail (Cloudflare Email Service, API REST) ----------
// Nunca atrapalha o pedido: qualquer falha é ignorada. EMAIL_API_TESTE só existe para teste local.
// Layout dos e-mails: tabela com estilos inline (funciona no Gmail, Outlook e celular).
const escH = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pEmail = h => '<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#283b30">' + h + '</p>';
// Saudação: chef recebe 'Chef Nome' (sem repetir se o nome já começa com Chef); cliente, só o nome.
const saudacao = perfil => { const n = txt(perfil && perfil.name, 80) || 'Chef'; return perfil && perfil.tipo === 'cliente' ? n : (/^chef\b/i.test(n) ? n : 'Chef ' + n); };
function layoutEmail(origem, { titulo, corpo, botao, link, nota }) {
  return '<!doctype html><html><body style="margin:0;padding:0;background:#f7f5f0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:32px 12px"><tr><td align="center">'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffefb;border-radius:18px;overflow:hidden;border:1px solid #e8e3d8;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#283b30">'
    + '<tr><td style="background:#304e3b;padding:20px 28px"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td><img src="' + origem + '/assets/email-logo.png" width="40" height="40" alt="" style="display:block;border-radius:10px"></td><td style="padding-left:12px;font-family:Georgia,serif;font-size:20px;color:#f7f5f0">Seu Chef em Casa</td></tr></table></td></tr>'
    + '<tr><td style="padding:32px 28px 4px"><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-weight:400;font-size:26px;line-height:1.25;color:#283b30">' + escH(titulo) + '</h1>' + corpo + '</td></tr>'
    + (botao ? '<tr><td style="padding:10px 28px 6px"><a href="' + escH(link) + '" style="display:inline-block;background:#304e3b;color:#fffefb;text-decoration:none;padding:14px 26px;border-radius:12px;font-weight:600;font-size:15px">' + escH(botao) + '</a></td></tr>' : '')
    + (nota ? '<tr><td style="padding:16px 28px 0;font-size:13px;line-height:1.55;color:#6b7a70">' + nota + '</td></tr>' : '')
    + '<tr><td style="padding:28px 28px 26px"><div style="border-top:1px solid #e8e3d8;padding-top:16px;font-size:12px;line-height:1.7;color:#8a948d">Boa comida. Boas histórias.<br><a href="' + origem + '" style="color:#b45335;text-decoration:none">seuchefemcasa.com.br</a> · <a href="mailto:contato@seuchefemcasa.com.br" style="color:#b45335;text-decoration:none">contato@seuchefemcasa.com.br</a></div></td></tr>'
    + '</table></td></tr></table></body></html>';
}
function emailPedido(perfil, texto, origem) {
  const cliente = (String(texto).match(/^Cliente: (.+)$/m) || [])[1] || 'um cliente';
  const data = (String(texto).match(/^(?:Data|Início desejado): (.+)$/m) || [])[1] || '';
  const assunto = 'Novo pedido de orçamento de ' + cliente + (data ? ' para ' + data : '');
  const painel = origem + '/#/painel';
  const corpoTxt = 'Olá, ' + saudacao(perfil) + ', tudo bem?\n\nVocê recebeu um pedido de orçamento pelo Seu Chef em Casa.\n'
    + 'O cliente deve enviar a mesma mensagem pelo WhatsApp. Se não chegar, você pode responder pelo painel.\n\n'
    + texto + '\n\nVer no painel: ' + painel + '\n';
  const e = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const html = layoutEmail(origem, { titulo: 'Chegou um pedido de orçamento',
    corpo: pEmail('Olá, ' + e(saudacao(perfil)) + ', tudo bem?') + pEmail('Um cliente montou um pedido para você no <b>Seu Chef em Casa</b>. Ele também deve te chamar no WhatsApp com a mesma mensagem.')
      + '<div style="background:#f7f5f0;border-left:3px solid #e9a98f;border-radius:10px;padding:16px 18px;margin:6px 0 10px;white-space:pre-wrap;font-size:14px;line-height:1.6;color:#283b30">' + e(texto) + '</div>',
    botao: 'Ver no painel', link: painel, nota: 'Se a mensagem não chegar no seu WhatsApp, você também pode responder o cliente pelo painel.' });
  return { assunto, texto: corpoTxt, html };
}
const emailAtivo = env => !!(env.EMAIL_REMETENTE && (env.EMAIL_API_TESTE || env.RESEND_API_KEY || (env.CF_ACCOUNT_ID && env.CF_EMAIL_TOKEN)));
// Envia pelo Resend quando há RESEND_API_KEY; senão pela Cloudflare. Nunca lança erro: devolve true/false.
async function enviarEmail(env, para, m) {
  if (!emailAtivo(env) || !C.validEmail(C.email(para))) return false;
  const resend = !!env.RESEND_API_KEY;
  const url = env.EMAIL_API_TESTE || (resend ? 'https://api.resend.com/emails' : 'https://api.cloudflare.com/client/v4/accounts/' + env.CF_ACCOUNT_ID + '/email/sending/send');
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + (env.RESEND_API_KEY || env.CF_EMAIL_TOKEN || 'teste') },
      body: JSON.stringify({ to: resend ? [C.email(para)] : C.email(para), from: env.EMAIL_REMETENTE, subject: m.assunto, text: m.texto, html: m.html }) });
    return r.ok;
  } catch { return false; }
}
async function avisarChef(env, para, perfil, texto, origem) {
  return enviarEmail(env, para, emailPedido(perfil, texto, origem));
}
function emailSenha(nome, link) {
  const e = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  return { assunto: 'Crie uma senha nova no Seu Chef em Casa',
    texto: 'Olá, ' + nome + ', tudo bem?\n\nRecebemos um pedido para trocar a senha da sua conta no Seu Chef em Casa.\nUse este link em até 1 hora:\n' + link + '\n\nSe não foi você, ignore este e-mail. Sua senha continua a mesma.\n',
    html: layoutEmail(new URL(link).origin, { titulo: 'Vamos criar sua senha nova', corpo: pEmail('Olá, ' + e(nome) + ', tudo bem?') + pEmail('Recebemos um pedido para trocar a senha da sua conta no <b>Seu Chef em Casa</b>. É só tocar no botão e escolher a nova.'),
      botao: 'Criar senha nova', link, nota: 'O link vale por 1 hora. Se não foi você que pediu, pode ignorar este e-mail: sua senha continua a mesma.' }) };
}

async function corpo(req) {
  if (!(req.headers.get('content-type') || '').startsWith('application/json')) throw new Error('Envie JSON.');
  const t = await req.text(); if (t.length > 12 * 1024 * 1024) throw new Error('Envio grande demais.');
  return JSON.parse(t || '{}');
}

// Atualiza o banco sozinho quando falta uma coluna nova (equivale a migrations/0003_admin.sql). Roda uma vez por instância.
let esquemaOk = false;
async function garantirEsquema(env) {
  if (esquemaOk) return;
  const { results } = await env.DB.prepare('PRAGMA table_info(chefs)').all();
  if (!results.some(c => c.name === 'oculto')) {
    try { await env.DB.prepare('ALTER TABLE chefs ADD COLUMN oculto INTEGER NOT NULL DEFAULT 0').run(); }
    catch (e) { if (!/duplicate column/i.test(String(e && e.message))) throw e; }
  }
  await env.DB.prepare('CREATE TABLE IF NOT EXISTS site_config (id INTEGER PRIMARY KEY CHECK (id = 1), dados TEXT NOT NULL, atualizado_em TEXT NOT NULL, atualizado_por TEXT NOT NULL)').run();
  for (const q of [
    'CREATE TABLE IF NOT EXISTS seguidores (chef_id TEXT NOT NULL, conta_id TEXT NOT NULL, criado_em TEXT NOT NULL, PRIMARY KEY (chef_id, conta_id))',
    'CREATE INDEX IF NOT EXISTS seguidores_conta ON seguidores(conta_id)',
    'CREATE TABLE IF NOT EXISTS curtidas (chef_id TEXT NOT NULL, foto_id TEXT NOT NULL, conta_id TEXT NOT NULL, criado_em TEXT NOT NULL, PRIMARY KEY (chef_id, foto_id, conta_id))',
    'CREATE INDEX IF NOT EXISTS curtidas_conta ON curtidas(conta_id)',
    'CREATE TABLE IF NOT EXISTS comentarios (id TEXT PRIMARY KEY, chef_id TEXT NOT NULL, foto_id TEXT NOT NULL, conta_id TEXT NOT NULL, texto TEXT NOT NULL, criado_em TEXT NOT NULL)',
    'CREATE INDEX IF NOT EXISTS comentarios_foto ON comentarios(chef_id, foto_id, criado_em)',
    'CREATE INDEX IF NOT EXISTS comentarios_conta ON comentarios(conta_id)',
    'CREATE TABLE IF NOT EXISTS denuncias (comentario_id TEXT NOT NULL, conta_id TEXT NOT NULL, criado_em TEXT NOT NULL, PRIMARY KEY (comentario_id, conta_id))',
    'CREATE TABLE IF NOT EXISTS notificacoes (id TEXT PRIMARY KEY, conta_id TEXT NOT NULL, tipo TEXT NOT NULL, texto TEXT NOT NULL, link TEXT NOT NULL DEFAULT \'\', lida INTEGER NOT NULL DEFAULT 0, criado_em TEXT NOT NULL)',
    'CREATE INDEX IF NOT EXISTS notificacoes_conta ON notificacoes(conta_id, criado_em)'
  ]) await env.DB.prepare(q).run();
  esquemaOk = true;
}

export async function onRequest({ request: req, env, params, waitUntil }) {
  if (!env.DB) return erro('Banco não configurado.', 503);
  await garantirEsquema(env);
  const rota = '/' + [].concat(params.rota || []).join('/'), metodo = req.method;
  try {
    if (rota === '/admin/dashboard' && metodo === 'GET') {
      const c = await chefDaSessao(env, req);
      if (!c) return erro('Entre com a conta da equipe.', 401);
      if (!ehAdmin(env, c)) return erro('Acesso só para a equipe.', 403);
      const q = new URL(req.url).searchParams, periodo = Dashboard.range(q.get('inicio'), q.get('fim'));
      const [daily, previous, summary, registered, ranking] = await Promise.all([
        env.DB.prepare("SELECT date(criado_em, '-3 hours') AS dia, COUNT(*) AS total FROM pedidos WHERE criado_em >= ? AND criado_em < ? GROUP BY dia ORDER BY dia").bind(periodo.from, periodo.until).all(),
        env.DB.prepare('SELECT COUNT(*) AS total FROM pedidos WHERE criado_em >= ? AND criado_em < ?').bind(periodo.previousFrom, periodo.from).first(),
        env.DB.prepare(`SELECT COUNT(*) AS total, COUNT(DISTINCT chef_id) AS chefs,
          COALESCE(SUM(CASE WHEN COALESCE(json_extract(dados, '$.status'), 'novo') = 'novo' THEN 1 ELSE 0 END),0) AS novos,
          COALESCE(SUM(CASE WHEN json_extract(dados, '$.status') = 'respondido' THEN 1 ELSE 0 END),0) AS respondidos,
          COALESCE(SUM(CASE WHEN json_extract(dados, '$.status') = 'fechado' THEN 1 ELSE 0 END),0) AS fechados,
          COALESCE(SUM(CASE WHEN json_extract(dados, '$.mode') = 'marmita' THEN 1 ELSE 0 END),0) AS marmitas
          FROM pedidos WHERE criado_em >= ? AND criado_em < ?`).bind(periodo.from, periodo.until).first(),
        env.DB.prepare('SELECT id, perfil, publicado, oculto, criado_em FROM chefs').all(),
        env.DB.prepare(`SELECT c.id, json_extract(c.perfil, '$.name') AS nome, COUNT(*) AS total
          FROM pedidos p JOIN chefs c ON c.id = p.chef_id WHERE p.criado_em >= ? AND p.criado_em < ?
          GROUP BY c.id ORDER BY total DESC, nome LIMIT 5`).bind(periodo.from, periodo.until).all()
      ]);
      const chefs = { cadastrados: registered.results.length, visiveis: 0, pausados: 0, ocultos: 0, incompletos: 0 };
      let cadastrosPeriodo = 0, cadastrosAnterior = 0;
      const newRows = [];
      for (const r of registered.results) {
        const falta = C.faltaPerfil(JSON.parse(r.perfil || '{}'));
        if (!r.publicado) chefs.pausados++;
        if (r.oculto) chefs.ocultos++;
        if (falta.length) chefs.incompletos++;
        if (r.publicado && !r.oculto && !falta.length) chefs.visiveis++;
        if (r.criado_em >= periodo.from && r.criado_em < periodo.until) {
          cadastrosPeriodo++; newRows.push({ dia: Dashboard.iso(Date.parse(r.criado_em)-3*3600000), total: 1 });
        } else if (r.criado_em >= periodo.previousFrom && r.criado_em < periodo.from) cadastrosAnterior++;
      }
      const grouped = new Map();for (const r of newRows) grouped.set(r.dia,(grouped.get(r.dia)||0)+1);
      return json({ periodo, geradoEm: agora(), pedidos: { ...summary, anterior: previous.total, variacao: Dashboard.change(summary.total, previous.total), serie: Dashboard.series(periodo, daily.results) },
        cadastros: { total: cadastrosPeriodo, anterior: cadastrosAnterior, variacao: Dashboard.change(cadastrosPeriodo, cadastrosAnterior), serie: Dashboard.series(periodo, [...grouped].map(([dia,total])=>({dia,total}))) }, chefs, ranking: ranking.results });
    }
    if (rota === '/site' && metodo === 'GET') {
      const row = await env.DB.prepare('SELECT dados FROM site_config WHERE id = 1').first();
      return json({ config: Site.clean(row ? JSON.parse(row.dados) : {}) });
    }
    if (rota === '/admin/site') {
      const c = await chefDaSessao(env, req);
      if (!c) return erro('Entre com a conta da equipe.', 401);
      if (!ehAdmin(env, c)) return erro('Acesso só para a equipe.', 403);
      const row = await env.DB.prepare('SELECT dados, atualizado_em FROM site_config WHERE id = 1').first();
      if (metodo === 'GET') return json({ config: Site.clean(row ? JSON.parse(row.dados) : {}), versao: row?.atualizado_em || '' });
      if (metodo === 'PUT') {
        const b = await corpo(req), config = Site.clean(b.config), expected = String(b.versao || '');
        if ((row?.atualizado_em || '') !== expected) return erro('Outra pessoa atualizou o site. Recarregue antes de editar.', 409);
        const versao = agora();
        const result = row
          ? await env.DB.prepare('UPDATE site_config SET dados = ?, atualizado_em = ?, atualizado_por = ? WHERE id = 1 AND atualizado_em = ?').bind(JSON.stringify(config), versao, c.id, expected).run()
          : await env.DB.prepare('INSERT OR IGNORE INTO site_config (id, dados, atualizado_em, atualizado_por) VALUES (1, ?, ?, ?)').bind(JSON.stringify(config), versao, c.id).run();
        if (!result.meta.changes) return erro('Outra pessoa atualizou o site. Recarregue antes de editar.', 409);
        return json({ config, versao });
      }
    }
    if (rota === '/saude') return json({ ok: true, google: googleOn(env), convite: !!env.CONVITE });

    if (rota === '/google/iniciar' && metodo === 'POST') {
      if (!googleOn(env)) return erro('Login com Google ainda não está ativado.', 503);
      if (!await limitar(env, req, 'google', 20, 900)) return erro('Muitas tentativas. Espere 15 minutos.', 429);
      const b = await corpo(req), modo = b.modo === 'cadastro' ? 'cadastro' : 'entrar', tipo = b.tipo === 'cliente' ? 'cliente' : 'chef';
      let dados = { tipo };
      if (modo === 'cadastro') {
        if (env.CONVITE && b.tipo !== 'cliente' && txt(b.convite, 80) !== env.CONVITE) return erro('Código de convite inválido. Peça o código à equipe.', 403);
        const whatsapp = txt(b.whatsapp, 30); if (whatsapp && !C.phone(whatsapp)) return erro('Informe um WhatsApp válido com DDD.');
        dados = { nome: txt(b.nome, 120), whatsapp, cidades: txt(b.cidades, 160), tipo };
      }
      const estado = aleatorio(24), verificador = b64url(crypto.getRandomValues(new Uint8Array(32))), nonce = aleatorio(16);
      const desafio = b64url(await crypto.subtle.digest('SHA-256', enc.encode(verificador)));
      const t = Math.floor(Date.now() / 1000);
      await env.DB.prepare('DELETE FROM oauth_pendente WHERE expira_em <= ?').bind(t).run();
      await env.DB.prepare('INSERT INTO oauth_pendente (estado, verificador, nonce, modo, dados, expira_em) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(estado, verificador, nonce, modo, JSON.stringify(dados), t + 600).run();
      const u = new URL(googleUrls(env).auth);
      Object.entries({ client_id: env.GOOGLE_CLIENT_ID, redirect_uri: new URL(req.url).origin + '/api/google/retorno', response_type: 'code',
        scope: 'openid email profile', state: estado, nonce, code_challenge: desafio, code_challenge_method: 'S256', prompt: 'select_account' })
        .forEach(([k, v]) => u.searchParams.set(k, v));
      return json({ url: u.toString() }, 200, { 'set-cookie': cookieOauth(estado, 600) });
    }

    if (rota === '/google/retorno' && metodo === 'GET') {
      const origem = new URL(req.url).origin, q = new URL(req.url).searchParams, apagar = { 'set-cookie': cookieOauth('', 0) };
      const falha = cod => voltar(origem, '/?google=' + cod + '#/entrar', apagar);
      if (!googleOn(env)) return falha('desligado');
      if (q.get('error')) return falha('cancelado');
      const estado = String(q.get('state') || ''), m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)scc_oauth=([a-f\d]{48})/);
      if (!/^[a-f\d]{48}$/.test(estado) || !m || m[1] !== estado) return falha('expirado');
      const p = await env.DB.prepare('SELECT * FROM oauth_pendente WHERE estado = ?').bind(estado).first();
      await env.DB.prepare('DELETE FROM oauth_pendente WHERE estado = ?').bind(estado).run();
      if (!p || p.expira_em <= Math.floor(Date.now() / 1000)) return falha('expirado');
      const urls = googleUrls(env);
      const r = await fetch(urls.token, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({
        code: String(q.get('code') || ''), client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: origem + '/api/google/retorno', grant_type: 'authorization_code', code_verifier: p.verificador }) });
      const tk = r.ok ? await r.json().catch(() => null) : null, id = lerIdToken(tk && tk.id_token);
      const ok = id && id.aud === env.GOOGLE_CLIENT_ID && urls.iss.includes(id.iss) && Number(id.exp) * 1000 > Date.now()
        && id.nonce === p.nonce && id.sub && id.email && (id.email_verified === true || id.email_verified === 'true');
      if (!ok) return falha('invalido');
      const sub = txt(id.sub, 100), email = C.email(id.email);
      let row = await env.DB.prepare('SELECT * FROM chefs WHERE google_sub = ?').bind(sub).first();
      if (!row) {
        row = await env.DB.prepare('SELECT * FROM chefs WHERE email = ?').bind(email).first();
        if (row && row.google_sub && row.google_sub !== sub) return falha('outra-conta');
        if (row) await env.DB.prepare('UPDATE chefs SET google_sub = ?, atualizado_em = ? WHERE id = ?').bind(sub, agora(), row.id).run();
      }
      if (!row) {
        const d = JSON.parse(p.dados || '{}');
        if (p.modo !== 'cadastro' && env.CONVITE && d.tipo !== 'cliente') return falha('sem-conta');
        const chefId = 'chef-' + aleatorio(8);
        const perfil = await limparPerfil(env, chefId, { name: d.nome || txt(id.name, 120) || email.split('@')[0], whatsapp: d.whatsapp || '', cities: d.cidades || '', semWhatsapp: true, tipo: d.tipo }, null);
        await env.DB.prepare('INSERT INTO chefs (id, email, credencial, perfil, publicado, criado_em, atualizado_em, google_sub) VALUES (?, ?, ?, ?, 1, ?, ?, ?)')
          .bind(chefId, email, JSON.stringify({ algoritmo: 'google' }), JSON.stringify(perfil), agora(), agora(), sub).run();
        row = { id: chefId };
      }
      const token = await abrirSessao(env, row.id);
      const h = new Headers({ location: origem + '/#/painel', 'cache-control': 'no-store' });
      h.append('set-cookie', cookieSessao(token, SESSAO_DIAS)); h.append('set-cookie', cookieOauth('', 0));
      return new Response(null, { status: 302, headers: h });
    }

    // ---------- Social: seguir chefs, curtir e comentar fotos da galeria (só com conta) ----------
    if (rota.startsWith('/social/')) {
      const partes = rota.split('/').slice(2), eu = await chefDaSessao(env, req);
      if (partes[0] === 'comentario' && partes[2] === 'denunciar' && metodo === 'POST') {
        if (!eu) return erro('Entre para denunciar.', 401);
        const cm = await env.DB.prepare('SELECT id FROM comentarios WHERE id = ?').bind(txt(partes[1], 40)).first();
        if (!cm) return erro('Comentário não encontrado.', 404);
        await env.DB.prepare('INSERT OR IGNORE INTO denuncias (comentario_id, conta_id, criado_em) VALUES (?, ?, ?)').bind(cm.id, eu.id, agora()).run();
        return json({ ok: true });
      }
      if (partes[0] === 'comentario' && metodo === 'DELETE') {
        if (!eu) return erro('Entre para continuar.', 401);
        const cm = await env.DB.prepare('SELECT id, chef_id, conta_id FROM comentarios WHERE id = ?').bind(txt(partes[1], 40)).first();
        if (!cm) return erro('Comentário não encontrado.', 404);
        if (cm.conta_id !== eu.id && cm.chef_id !== eu.id && !ehAdmin(env, eu)) return erro('Você não pode apagar este comentário.', 403);
        await env.DB.prepare('DELETE FROM comentarios WHERE id = ?').bind(cm.id).run();
        await env.DB.prepare('DELETE FROM denuncias WHERE comentario_id = ?').bind(cm.id).run();
        return json({ ok: true });
      }
      const chefId = txt(partes[0], 40), acao = partes[1] || '';
      const alvo = await env.DB.prepare('SELECT id, perfil FROM chefs WHERE id = ? AND publicado = 1 AND COALESCE(oculto, 0) = 0').bind(chefId).first();
      const perfilAlvo = alvo ? JSON.parse(alvo.perfil) : null;
      if (!perfilAlvo || perfilAlvo.tipo === 'cliente') return erro('Chef não encontrado.', 404);
      const contar = async (sql, ...v) => Number((await env.DB.prepare(sql).bind(...v).first()).n);
      if (!acao && metodo === 'GET') {
        const sigo = eu ? !!await env.DB.prepare('SELECT 1 FROM seguidores WHERE chef_id = ? AND conta_id = ?').bind(chefId, eu.id).first() : false;
        const cur = (await env.DB.prepare('SELECT foto_id, COUNT(*) n, MAX(conta_id = ?) eu FROM curtidas WHERE chef_id = ? GROUP BY foto_id').bind(eu ? eu.id : '', chefId).all()).results;
        const com = (await env.DB.prepare('SELECT foto_id, COUNT(*) n FROM comentarios WHERE chef_id = ? GROUP BY foto_id').bind(chefId).all()).results;
        const fotos = {};
        for (const r of cur) fotos[r.foto_id] = { curtidas: Number(r.n), curti: !!r.eu, comentarios: 0 };
        for (const r of com) (fotos[r.foto_id] ||= { curtidas: 0, curti: false, comentarios: 0 }).comentarios = Number(r.n);
        return json({ seguidores: await contar('SELECT COUNT(*) n FROM seguidores WHERE chef_id = ?', chefId), sigo, fotos }, 200, { 'cache-control': 'no-store' });
      }
      if (acao === 'comentarios' && metodo === 'GET') {
        const foto = txt(new URL(req.url).searchParams.get('foto'), 40), admin = !!eu && ehAdmin(env, eu);
        const { results } = await env.DB.prepare("SELECT c.id, c.conta_id, c.texto, c.criado_em, json_extract(x.perfil, '$.name') nome FROM comentarios c LEFT JOIN chefs x ON x.id = c.conta_id WHERE c.chef_id = ? AND c.foto_id = ? ORDER BY c.criado_em LIMIT 200").bind(chefId, foto).all();
        return json({ comentarios: results.map(r => ({ id: r.id, nome: r.nome || 'Conta removida', texto: r.texto, criado_em: r.criado_em, podeApagar: !!eu && (r.conta_id === eu.id || chefId === eu.id || admin), meu: !!eu && r.conta_id === eu.id })) }, 200, { 'cache-control': 'no-store' });
      }
      if (metodo !== 'POST') return erro('Rota não encontrada.', 404);
      if (!eu) return erro('Crie sua conta grátis para continuar.', 401);
      const b = await corpo(req), on = b.on !== false;
      if (acao === 'seguir') {
        if (eu.id === chefId) return erro('Você não pode seguir o próprio perfil.');
        if (on) { const r = await env.DB.prepare('INSERT OR IGNORE INTO seguidores (chef_id, conta_id, criado_em) VALUES (?, ?, ?)').bind(chefId, eu.id, agora()).run(); if (r && r.meta && r.meta.changes) await notificar(env, chefId, 'seguidor', nomeDe(eu) + ' agora acompanha a sua cozinha.', JSON.parse(eu.perfil).tipo === 'cliente' ? '' : '#/chef/' + eu.id); }
        else await env.DB.prepare('DELETE FROM seguidores WHERE chef_id = ? AND conta_id = ?').bind(chefId, eu.id).run();
        return json({ seguidores: await contar('SELECT COUNT(*) n FROM seguidores WHERE chef_id = ?', chefId), sigo: on });
      }
      const foto = txt(b.foto, 40);
      if (!(perfilAlvo.gallery || []).some(g => String(g.id) === foto)) return erro('Foto não encontrada.', 404);
      if (acao === 'curtir') {
        if (on) await env.DB.prepare('INSERT OR IGNORE INTO curtidas (chef_id, foto_id, conta_id, criado_em) VALUES (?, ?, ?, ?)').bind(chefId, foto, eu.id, agora()).run();
        else await env.DB.prepare('DELETE FROM curtidas WHERE chef_id = ? AND foto_id = ? AND conta_id = ?').bind(chefId, foto, eu.id).run();
        return json({ curtidas: await contar('SELECT COUNT(*) n FROM curtidas WHERE chef_id = ? AND foto_id = ?', chefId, foto), curti: on });
      }
      if (acao === 'comentarios') {
        if (!await limitar(env, req, 'comentario', 30, 3600)) return erro('Muitos comentários seguidos. Tente mais tarde.', 429);
        const texto = txt(b.texto, 500); if (!texto) return erro('Escreva um comentário.');
        const id = aleatorio(12);
        await env.DB.prepare('INSERT INTO comentarios (id, chef_id, foto_id, conta_id, texto, criado_em) VALUES (?, ?, ?, ?, ?, ?)').bind(id, chefId, foto, eu.id, texto, agora()).run();
        if (eu.id !== chefId) await notificar(env, chefId, 'comentario', nomeDe(eu) + ' comentou um prato seu: ' + texto.slice(0, 80), '#/chef/' + chefId);
        return json({ ok: true, id }, 201);
      }
      return erro('Rota não encontrada.', 404);
    }

    if (rota === '/chefs' && metodo === 'GET') {
      const { results } = await env.DB.prepare('SELECT id, perfil FROM chefs WHERE publicado = 1 AND oculto = 0 ORDER BY criado_em').all();
      return json({ chefs: results.map(publico).filter(c => c.tipo !== 'cliente' && !C.faltaPerfil(c).length) }, 200, { 'cache-control': 'public, max-age=30' });
    }

    if (rota.startsWith('/foto/') && metodo === 'GET') {
      const id = rota.slice(6); if (!/^[a-f\d]{32}$/.test(id)) return erro('Foto não encontrada.', 404);
      const f = await env.DB.prepare('SELECT tipo, dados FROM fotos WHERE id = ?').bind(id).first();
      if (!f) return erro('Foto não encontrada.', 404);
      return new Response(new Uint8Array(f.dados), { headers: { 'content-type': f.tipo, 'cache-control': 'public, max-age=31536000, immutable' } });
    }

    if (rota === '/eu' && metodo === 'GET') {
      const c = await chefDaSessao(env, req); return json({ chef: c ? doDono(c, env) : null });
    }

    if (rota === '/cadastro' && metodo === 'POST') {
      if (!await limitar(env, req, 'cadastro', 10, 3600)) return erro('Muitas tentativas. Tente de novo em uma hora.', 429);
      const b = await corpo(req);
      if (env.CONVITE && b.tipo !== 'cliente' && txt(b.convite, 80) !== env.CONVITE) return erro('Código de convite inválido. Peça o código à equipe.', 403);
      const email = C.email(b.email); if (!C.validEmail(email)) return erro('Confira o e-mail informado.');
      if (C.emailTemporario(email)) return erro('E-mails temporários não são aceitos. Use seu e-mail pessoal ou entre com Google.');
      const senha = String(b.senha || ''); if (senha.length < 8 || senha.length > 200) return erro('Crie uma senha com pelo menos 8 caracteres.');
      if (await env.DB.prepare('SELECT 1 FROM chefs WHERE email = ?').bind(email).first()) return erro('Este e-mail já está cadastrado. Use Entrar.', 409);
      const id = 'chef-' + aleatorio(8);
      const perfil = await limparPerfil(env, id, { name: b.nome, whatsapp: b.whatsapp, cities: b.cidades, tipo: b.tipo }, null);
      await env.DB.prepare('INSERT INTO chefs (id, email, credencial, perfil, publicado, criado_em, atualizado_em) VALUES (?, ?, ?, ?, 1, ?, ?)')
        .bind(id, email, JSON.stringify(await criarCredencial(senha)), JSON.stringify(perfil), agora(), agora()).run();
      const token = await abrirSessao(env, id);
      const row = await env.DB.prepare('SELECT * FROM chefs WHERE id = ?').bind(id).first();
      return json({ chef: doDono(row, env) }, 201, { 'set-cookie': cookieSessao(token, SESSAO_DIAS) });
    }

    if (rota === '/entrar' && metodo === 'POST') {
      if (!await limitar(env, req, 'entrar', 10, 900)) return erro('Muitas tentativas. Espere 15 minutos.', 429);
      const b = await corpo(req), email = C.email(b.email);
      const row = await env.DB.prepare('SELECT * FROM chefs WHERE email = ?').bind(email).first();
      if (row && JSON.parse(row.credencial).algoritmo === 'google') return erro('Esta conta entra com o Google. Toque em Entrar com Google.', 401);
      if (!row || !await conferirSenha(String(b.senha || ''), JSON.parse(row.credencial))) return erro('E-mail ou senha incorretos.', 401);
      const token = await abrirSessao(env, row.id);
      return json({ chef: doDono(row, env) }, 200, { 'set-cookie': cookieSessao(token, SESSAO_DIAS) });
    }

    if (rota === '/sair' && metodo === 'POST') {
      const t = cookie(req); if (t) await env.DB.prepare('DELETE FROM sessoes WHERE token_hash = ?').bind(await sha256(t)).run();
      return json({ ok: true }, 200, { 'set-cookie': cookieSessao('', 0) });
    }

    // Nova senha por link gerado pela equipe (/#/nova-senha/<id>/<token>). O link vale 48 horas e uma vez só.
    if (rota === '/esqueci' && metodo === 'POST') {
      if (!emailAtivo(env)) return erro('A recuperação por e-mail ainda não está ativa. Fale com a equipe.', 503);
      if (!await limitar(env, req, 'esqueci', 5, 900)) return erro('Muitas tentativas. Espere 15 minutos.', 429);
      const b = await corpo(req), email = C.email(b.email);
      if (!C.validEmail(email)) return erro('Confira o e-mail informado.');
      const row = await env.DB.prepare('SELECT id, perfil, credencial FROM chefs WHERE email = ?').bind(email).first();
      if (row) {
        const token = aleatorio(24), cred = JSON.parse(row.credencial || '{}');
        cred.redefinir = { hash: await sha256(token), expira: Date.now() + 3600e3 };
        await env.DB.prepare('UPDATE chefs SET credencial = ? WHERE id = ?').bind(JSON.stringify(cred), row.id).run();
        const envio = enviarEmail(env, email, emailSenha(saudacao(JSON.parse(row.perfil || '{}')), new URL(req.url).origin + '/#/nova-senha/' + row.id + '/' + token));
        if (typeof waitUntil === 'function') waitUntil(envio); else await envio;
      }
      // Mesma resposta exista ou não a conta, para não revelar quem está cadastrado.
      return json({ ok: true });
    }

    if (rota === '/nova-senha' && metodo === 'POST') {
      if (!await limitar(env, req, 'novasenha', 10, 900)) return erro('Muitas tentativas. Espere 15 minutos.', 429);
      const b = await corpo(req), id = txt(b.id, 40), token = txt(b.token, 80), senha = String(b.senha || '');
      const invalido = () => erro('Este link não vale mais. Peça um novo à equipe.', 400);
      if (!/^chef-[a-f\d]{16}$/.test(id) || !/^[a-f\d]{48}$/.test(token)) return invalido();
      if (senha.length < 8 || senha.length > 200) return erro('Crie uma senha com pelo menos 8 caracteres.');
      const row = await env.DB.prepare('SELECT * FROM chefs WHERE id = ?').bind(id).first();
      const r = row && (JSON.parse(row.credencial || '{}').redefinir || null);
      if (!r || !(Number(r.expira) > Date.now()) || r.hash !== await sha256(token)) return invalido();
      // Troca a credencial (o pedido de redefinição some junto) e encerra as sessões abertas em outros aparelhos.
      await env.DB.batch([
        env.DB.prepare('UPDATE chefs SET credencial = ?, atualizado_em = ? WHERE id = ?').bind(JSON.stringify(await criarCredencial(senha)), agora(), id),
        env.DB.prepare('DELETE FROM sessoes WHERE chef_id = ?').bind(id)
      ]);
      const sessao = await abrirSessao(env, id);
      return json({ chef: doDono(await env.DB.prepare('SELECT * FROM chefs WHERE id = ?').bind(id).first(), env) }, 200, { 'set-cookie': cookieSessao(sessao, SESSAO_DIAS) });
    }

    if (rota === '/eu/menus' && metodo === 'PUT') {
      const c=await chefDaSessao(env,req);if(!c)return erro('Entre de novo para salvar.',401);
      const b=await corpo(req),p=JSON.parse(c.perfil);
      if(b.versao!==(p.menusVersao||''))return erro('Os menus mudaram em outra aba. Recarregue antes de editar.',409);
      const fotos=new Set([p.avatar,...(p.gallery||[]).map(g=>g.url),...(p.menus||[]).map(m=>m.photo),...Object.values(ServicePhotos).map(u=>'/'+u.replace(/^\//,''))].filter(Boolean));
      const menus=Menus.clean(b.menus,fotos),versao=aleatorio(12);
      const result=await env.DB.prepare("UPDATE chefs SET perfil=json_set(perfil,'$.menus',json(?),'$.menusVersao',?),atualizado_em=? WHERE id=? AND COALESCE(json_extract(perfil,'$.menusVersao'),'')=?").bind(JSON.stringify(menus),versao,agora(),c.id,b.versao).run();
      if(!result.meta.changes)return erro('Os menus mudaram em outra aba. Recarregue antes de editar.',409);
      return json({menus,versao});
    }

    if (rota === '/eu' && metodo === 'PUT') {
      const c = await chefDaSessao(env, req); if (!c) return erro('Entre de novo para salvar.', 401);
      const b = await corpo(req), p = b.perfil || {};
      const email = C.email(p.email || c.email);
      if (!C.validEmail(email)) return erro('Confira o e-mail informado.');
      if (email !== c.email && C.emailTemporario(email)) return erro('E-mails temporários não são aceitos.');
      if (email !== c.email && await env.DB.prepare('SELECT 1 FROM chefs WHERE email = ? AND id <> ?').bind(email, c.id).first()) return erro('Este e-mail já está cadastrado.', 409);
      const perfil = await limparPerfil(env, c.id, p, JSON.parse(c.perfil));
      const publicado = typeof p.pausado === 'boolean' ? (p.pausado ? 0 : 1) : c.publicado;
      await env.DB.prepare("UPDATE chefs SET email = ?, perfil = json_set(?,'$.menus',json(COALESCE(json_extract(perfil,'$.menus'),'[]')),'$.menusVersao',COALESCE(json_extract(perfil,'$.menusVersao'),'')), publicado = ?, atualizado_em = ? WHERE id = ?").bind(email, JSON.stringify(perfil), publicado, agora(), c.id).run();
      return json({ chef: doDono(await env.DB.prepare('SELECT * FROM chefs WHERE id = ?').bind(c.id).first(), env) });
    }

    if (rota === '/eu' && metodo === 'DELETE') {
      const c = await chefDaSessao(env, req); if (!c) return erro('Entre de novo para excluir a conta.', 401);
      await env.DB.batch(['pedidos', 'fotos', 'sessoes'].map(t => env.DB.prepare('DELETE FROM ' + t + ' WHERE chef_id = ?').bind(c.id)).concat(['seguidores', 'curtidas', 'comentarios'].map(t => env.DB.prepare('DELETE FROM ' + t + ' WHERE chef_id = ? OR conta_id = ?').bind(c.id, c.id))).concat(['notificacoes', 'denuncias'].map(t => env.DB.prepare('DELETE FROM ' + t + ' WHERE conta_id = ?').bind(c.id))).concat(env.DB.prepare('DELETE FROM chefs WHERE id = ?').bind(c.id)));
      return json({ ok: true }, 200, { 'set-cookie': cookieSessao('', 0) });
    }

    if (rota === '/pedidos' && metodo === 'POST') {
      if (!await limitar(env, req, 'pedido', 20, 3600)) return erro('Muitos pedidos seguidos. Tente mais tarde.', 429);
      const b = await corpo(req), chefId = txt(b.chefId, 40);
      const alvo = await env.DB.prepare('SELECT email, perfil FROM chefs WHERE id = ? AND publicado = 1 AND oculto = 0').bind(chefId).first();
      if (!alvo || C.faltaPerfil(JSON.parse(alvo.perfil)).length) return erro('Chef não encontrado.', 404);
      const texto = txt(b.texto, 6000); if (texto.length < 20) return erro('Pedido incompleto.');
      const extra = b.dados && typeof b.dados === 'object' ? { ...b.dados } : {}; delete extra.status;
      if(extra.mode==='especial'){
        const perfil=JSON.parse(alvo.perfil),menu=Menus.active(perfil.menus).find(m=>m.id===extra.menuId);
        if(!menu)return erro('Este menu não está mais disponível.',410);
        const data=extra.f?.date,pessoas=Number(extra.pessoas);
        if(!Menus.date(data)||data<Menus.today()||!C.isFree(perfil,data)||!Number.isInteger(pessoas)||pessoas<menu.serves||pessoas>500)return erro('Confira a data e a quantidade de pessoas.');
        extra.menu=menu; // O registro usa o menu vigente do chef, não uma cópia enviada pelo cliente.
      }
      const dadosJson = JSON.stringify(extra), dados = dadosJson.length > 20000 ? '{}' : dadosJson;
      const id = aleatorio(12);
      await env.DB.prepare('INSERT INTO pedidos (id, chef_id, texto, dados, criado_em) VALUES (?, ?, ?, ?, ?)').bind(id, chefId, texto, dados, agora()).run();
    await notificar(env, chefId, 'pedido', 'Comanda nova na mesa: você recebeu um pedido de orçamento.', '#/painel');
      const aviso = avisarChef(env, alvo.email, JSON.parse(alvo.perfil), texto, new URL(req.url).origin).catch(() => false);
      if (typeof waitUntil === 'function') waitUntil(aviso); else await aviso;
      return json({ id }, 201);
    }

    if (rota === '/meus-pedidos' && metodo === 'GET') {
      const c = await chefDaSessao(env, req); if (!c) return erro('Entre para ver seus pedidos.', 401);
      const { results } = await env.DB.prepare("SELECT id, texto, criado_em, COALESCE(json_extract(dados, '$.status'), 'novo') AS status FROM pedidos WHERE chef_id = ? ORDER BY criado_em DESC LIMIT 100").bind(c.id).all();
      return json({ pedidos: results });
    }

    if (rota.startsWith('/meus-pedidos/') && metodo === 'PATCH') {
      const c = await chefDaSessao(env, req); if (!c) return erro('Entre de novo para atualizar o pedido.', 401);
      const id = rota.slice(14), status = String((await corpo(req)).status || '');
      if (!['novo', 'respondido', 'fechado'].includes(status)) return erro('Informe uma situação válida.');
      const r = await env.DB.prepare("UPDATE pedidos SET dados = json_set(dados, '$.status', ?) WHERE id = ? AND chef_id = ?").bind(status, id, c.id).run();
      if (!r.meta.changes) return erro('Pedido não encontrado.', 404);
      return json({ ok: true, status });
    }

if (rota === '/notificacoes' && metodo === 'GET') {
      const c = await chefDaSessao(env, req); if (!c) return erro('Entre para ver seus avisos.', 401);
      const { results } = await env.DB.prepare('SELECT id, tipo, texto, link, lida, criado_em FROM notificacoes WHERE conta_id = ? ORDER BY criado_em DESC LIMIT 30').bind(c.id).all();
      return json({ avisos: results.map(r => ({ ...r, lida: !!r.lida })), naoLidas: results.filter(r => !r.lida).length }, 200, { 'cache-control': 'no-store' });
    }
    if (rota === '/notificacoes/lidas' && metodo === 'POST') {
      const c = await chefDaSessao(env, req); if (!c) return erro('Entre de novo.', 401);
      await env.DB.prepare('UPDATE notificacoes SET lida = 1 WHERE conta_id = ? AND lida = 0').bind(c.id).run();
      return json({ ok: true });
    }
    if (rota === '/admin/comentarios' && metodo === 'GET') {
      const c = await chefDaSessao(env, req);
      if (!c) return erro('Entre com a conta da equipe.', 401);
      if (!ehAdmin(env, c)) return erro('Acesso só para a equipe.', 403);
      const { results } = await env.DB.prepare("SELECT m.id, m.chef_id, m.texto, m.criado_em, json_extract(a.perfil, '$.name') autor, json_extract(f.perfil, '$.name') chef, (SELECT COUNT(*) FROM denuncias d WHERE d.comentario_id = m.id) denuncias FROM comentarios m LEFT JOIN chefs a ON a.id = m.conta_id LEFT JOIN chefs f ON f.id = m.chef_id ORDER BY denuncias DESC, m.criado_em DESC LIMIT 200").all();
      return json({ comentarios: results }, 200, { 'cache-control': 'no-store' });
    }

    // ---------- Painel do administrador (só e-mails em ADMIN_EMAILS) ----------
    if (rota === '/admin/chefs' || rota.startsWith('/admin/chefs/')) {
      const c = await chefDaSessao(env, req);
      if (!c) return erro('Entre com a conta da equipe.', 401);
      if (!ehAdmin(env, c)) return erro('Acesso só para a equipe.', 403);
    if (rota === '/admin/chefs' && metodo === 'GET') {
        const { results } = await env.DB.prepare(`SELECT c.id, c.email, c.perfil, c.publicado, c.oculto, c.criado_em, c.atualizado_em, c.google_sub,
          (SELECT COUNT(*) FROM pedidos p WHERE p.chef_id = c.id) AS pedidos,
          (SELECT COUNT(*) FROM pedidos p WHERE p.chef_id = c.id AND p.criado_em > ?) AS pedidos7,
          (SELECT MAX(p.criado_em) FROM pedidos p WHERE p.chef_id = c.id) AS ultimo
          FROM chefs c ORDER BY c.criado_em DESC`).bind(new Date(Date.now() - 7 * 864e5).toISOString()).all();
        return json({ chefs: results.map(r => { const p = JSON.parse(r.perfil || '{}'); return {
          id: r.id, email: r.email, nome: p.name || '', cidades: p.cities || '', especialidade: p.specialty || '', whatsapp: p.whatsapp || '',
          foto: p.avatar || (p.gallery && p.gallery[0] && p.gallery[0].url) || '', pratos: (p.dishes || []).length, fotos: (p.gallery || []).length,
          falta: C.faltaPerfil({ ...p, id: r.id }), pausado: !r.publicado, oculto: !!r.oculto, google: !!r.google_sub,
          criado_em: r.criado_em, atualizado_em: r.atualizado_em, pedidos: r.pedidos, pedidos7: r.pedidos7, ultimo: r.ultimo }; }) });
      }
      const id = rota.slice(13);
      if (/^chef-[a-f\d]{16}$/.test(id) && ['GET', 'PUT'].includes(metodo)) {
        const alvo = await env.DB.prepare('SELECT * FROM chefs WHERE id = ?').bind(id).first();
        if (!alvo) return erro('Chef não encontrado.', 404);
        if (metodo === 'GET') return json({ chef: doDono(alvo, env), versao: alvo.atualizado_em });
        const b = await corpo(req);
        if (b.versao !== alvo.atualizado_em) return erro('O perfil foi atualizado. Reabra antes de editar.', 409);
        // A edição de conteúdo preserva e-mail, credenciais, permissões e pausa.
        const perfil = await limparPerfil(env, id, b.perfil || {}, JSON.parse(alvo.perfil));
        const versao = agora();
        await env.DB.prepare("UPDATE chefs SET perfil = json_set(?,'$.menus',json(COALESCE(json_extract(perfil,'$.menus'),'[]')),'$.menusVersao',COALESCE(json_extract(perfil,'$.menusVersao'),'')), atualizado_em = ? WHERE id = ?").bind(JSON.stringify(perfil), versao, id).run();
        return json({ chef: doDono(await env.DB.prepare('SELECT * FROM chefs WHERE id = ?').bind(id).first(), env), versao });
      }
      if (/^chef-[a-f\d]{16}$/.test(id) && metodo === 'POST') {
        const b = await corpo(req);
        // Gera um link para o chef criar uma senha nova. A equipe nunca vê nem escolhe a senha.
        if (b.acao === 'nova-senha') {
          const alvo = await env.DB.prepare('SELECT credencial FROM chefs WHERE id = ?').bind(id).first();
          if (!alvo) return erro('Chef não encontrado.', 404);
          const token = aleatorio(24), cred = JSON.parse(alvo.credencial || '{}');
          cred.redefinir = { hash: await sha256(token), expira: Date.now() + 48 * 3600e3 };
          await env.DB.prepare('UPDATE chefs SET credencial = ? WHERE id = ?').bind(JSON.stringify(cred), id).run();
          return json({ ok: true, horas: 48, link: new URL(req.url).origin + '/#/nova-senha/' + id + '/' + token });
        }
        if (typeof b.oculto !== 'boolean') return erro('Informe se o perfil fica escondido.');
        const r = await env.DB.prepare('UPDATE chefs SET oculto = ?, atualizado_em = ? WHERE id = ?').bind(b.oculto ? 1 : 0, agora(), id).run();
        if (!r.meta.changes) return erro('Chef não encontrado.', 404);
        return json({ ok: true, oculto: b.oculto });
      }
      // Exclui a conta de um chef: perfil, fotos, pedidos e sessões. Não tem volta.
      if (/^chef-[a-f\d]{16}$/.test(id) && metodo === 'DELETE') {
        if (id === c.id) return erro('Para excluir a sua própria conta, use Painel > Configurações.');
        if (!await env.DB.prepare('SELECT 1 FROM chefs WHERE id = ?').bind(id).first()) return erro('Chef não encontrado.', 404);
        await env.DB.batch(['pedidos', 'fotos', 'sessoes'].map(t => env.DB.prepare('DELETE FROM ' + t + ' WHERE chef_id = ?').bind(id)).concat(['seguidores', 'curtidas', 'comentarios'].map(t => env.DB.prepare('DELETE FROM ' + t + ' WHERE chef_id = ? OR conta_id = ?').bind(id, id))).concat(['notificacoes', 'denuncias'].map(t => env.DB.prepare('DELETE FROM ' + t + ' WHERE conta_id = ?').bind(id))).concat(env.DB.prepare('DELETE FROM chefs WHERE id = ?').bind(id)));
        return json({ ok: true });
      }
    }

    return erro('Rota não encontrada.', 404);
  } catch (e) {
    const msg = e && e.message && /[áéíóúãõç]|Informe|Confira|Envie/.test(e.message) ? e.message : 'Erro no servidor. Tente de novo.';
    return erro(msg, e instanceof SyntaxError ? 400 : (msg.startsWith('Erro') ? 500 : 400));
  }
}
