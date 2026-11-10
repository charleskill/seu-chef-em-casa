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
    + '<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#161d19"><title>Seu Chef em Casa · em breve</title><style>'
    + 'body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#161d19;background-image:radial-gradient(ellipse at 50% 0%,#2b3a31 0%,#161d19 62%);color:#f3eee4;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:24px;box-sizing:border-box}'
    + 'main{width:100%;max-width:400px;text-align:center}'
    + '.marca{font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:#d9a184;margin:0 0 28px}'
    + 'h1{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-size:2rem;line-height:1.2;margin:0 0 14px}'
    + '.aguarde{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-size:1.1rem;color:#c9c3b6;margin:0 0 40px}'
    + 'form{border-top:1px solid rgba(243,238,228,.16);padding-top:28px}'
    + 'label{display:block;font-size:.95rem;line-height:1.45;color:#c9c3b6;margin-bottom:14px}'
    + 'input{width:100%;box-sizing:border-box;font:inherit;font-size:1.05rem;letter-spacing:.12em;text-align:center;padding:13px 14px;border:1px solid rgba(243,238,228,.3);border-radius:10px;background:rgba(255,255,255,.06);color:#f3eee4}'
    + 'input:focus{outline:2px solid #d9a184;outline-offset:2px}'
    + 'button{width:100%;margin-top:14px;font:inherit;font-weight:600;font-size:1rem;padding:13px;border:0;border-radius:10px;background:#b9623f;color:#fff;cursor:pointer}'
    + 'button:focus-visible{outline:2px solid #f3eee4;outline-offset:2px}.erro{color:#ffb4a2;font-size:.92rem;margin:14px 0 0}'
    + '</style></head><body><main><p class="marca">Seu Chef em Casa</p><h1>Grandes coisas estão para acontecer.</h1>'
    + '<p class="aguarde">O fogo já está aceso. Aguarde…</p>'
    + '<form method="post" action="/acesso"><input type="hidden" name="para" value="' + esc(para) + '">'
    + '<label for="senha">Se você sabe de algum segredo desta cozinha, digite a senha:</label><input id="senha" name="senha" type="password" autocomplete="current-password" required autofocus>'
    + (erro ? '<p class="erro" role="alert">' + esc(erro) + '</p>' : '')
    + '<button type="submit">Abrir a porta da cozinha</button></form></main></body></html>';
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
    return pagina(para, 'Esse não é o ingrediente secreto. Tente de novo.', 401);
  }

  if (liberado) return url.pathname === '/acesso' ? Response.redirect(url.origin + '/', 303) : next();

  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ erro: 'Site fechado para testes.' }), { status: 401, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Site fechado para testes.', { status: 401, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  return pagina(url.pathname === '/acesso' ? '/' : destino(url.pathname + url.search), '', 401);
}
