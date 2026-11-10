// Site fechado para testes: enquanto a variável SENHA_SITE existir na Cloudflare, tudo (páginas, arquivos e /api)
// só abre depois de digitar essa senha. Sem a variável, este arquivo não faz nada e o site fica aberto.
// A senha não fica no código nem nos documentos: só na Cloudflare (Settings → Variables and secrets, tipo Secret).
// É uma porta simples para o período de testes, não substitui o login dos chefs.
const COOKIE = 'scc_acesso', DIAS = 30;
const enc = new TextEncoder();
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
// O cookie guarda uma marca derivada da senha, nunca a senha. Trocar a senha invalida os cookies antigos.
const marca = async senha => hex(await crypto.subtle.digest('SHA-256', enc.encode('seu-chef-em-casa:acesso:' + senha)));
const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Só aceita voltar para um caminho do próprio site.
const destino = p => { p = String(p || '/'); return p.startsWith('/') && !p.startsWith('//') && !p.includes('\\') && p.length < 500 ? p : '/'; };

const CABECALHOS = {
  'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow',
  'x-frame-options': 'DENY', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer',
  'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"
};

function pagina(para, erro, status) {
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<meta name="robots" content="noindex,nofollow"><title>Seu Chef em Casa · em testes</title><style>'
    + 'body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f3ee;color:#26342c;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:20px;box-sizing:border-box}'
    + 'main{width:100%;max-width:360px;background:#fff;border:1px solid rgba(48,78,59,.18);border-radius:16px;padding:28px 24px;box-sizing:border-box}'
    + 'h1{font-family:Georgia,"Times New Roman",serif;font-weight:500;font-size:1.5rem;margin:0 0 6px}p{margin:0 0 18px;color:#5f6b62;font-size:.95rem;line-height:1.45}'
    + 'label{display:block;font-weight:600;font-size:.9rem;margin-bottom:6px}'
    + 'input{width:100%;box-sizing:border-box;font:inherit;font-size:1rem;padding:12px 14px;border:1px solid #b9c0b8;border-radius:10px;background:#fff;color:inherit}'
    + 'input:focus{outline:2px solid #304e3b;outline-offset:1px}'
    + 'button{width:100%;margin-top:14px;font:inherit;font-weight:600;font-size:1rem;padding:13px;border:0;border-radius:10px;background:#a5583c;color:#fff;cursor:pointer}'
    + 'button:focus-visible{outline:2px solid #304e3b;outline-offset:2px}.erro{color:#a12b1c;font-size:.9rem;margin:10px 0 0}'
    + '</style></head><body><main><h1>Seu Chef em Casa</h1><p>O site está em fase de testes. Digite a senha de acesso para entrar.</p>'
    + '<form method="post" action="/acesso"><input type="hidden" name="para" value="' + esc(para) + '">'
    + '<label for="senha">Senha de acesso</label><input id="senha" name="senha" type="password" autocomplete="current-password" required autofocus>'
    + (erro ? '<p class="erro" role="alert">' + esc(erro) + '</p>' : '')
    + '<button type="submit">Entrar</button></form></main></body></html>';
  return new Response(html, { status, headers: CABECALHOS });
}

export async function onRequest({ request: req, env, next }) {
  const senha = String(env.SENHA_SITE || '').trim();
  if (!senha) return next();

  const esperado = await marca(senha);
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)scc_acesso=([a-f\d]{64})/);
  const url = new URL(req.url);
  const liberado = !!m && m[1] === esperado;

  if (req.method === 'POST' && url.pathname === '/acesso') {
    let f = null;
    try { f = await req.formData(); } catch (e) { f = null; }
    const para = destino(f && f.get('para'));
    if (f && String(f.get('senha') || '').trim() === senha) {
      return new Response(null, { status: 303, headers: {
        location: para, 'cache-control': 'no-store',
        'set-cookie': COOKIE + '=' + esperado + '; Path=/; Max-Age=' + DIAS * 86400 + '; HttpOnly; Secure; SameSite=Lax'
      } });
    }
    // Pequena espera para atrapalhar tentativas em série.
    await new Promise(r => setTimeout(r, 700));
    return pagina(para, 'Senha incorreta. Tente de novo.', 401);
  }

  if (liberado) return url.pathname === '/acesso' ? Response.redirect(url.origin + '/', 303) : next();

  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ erro: 'Site fechado para testes.' }), { status: 401, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Site fechado para testes.', { status: 401, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  return pagina(url.pathname === '/acesso' ? '/' : destino(url.pathname + url.search), '', 401);
}
