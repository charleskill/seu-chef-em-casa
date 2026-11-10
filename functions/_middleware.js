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

// Tela de senha: um livro de receitas antigo que se abre sozinho e mostra o campo da senha.
// Tudo em HTML e CSS (sem JavaScript, imagens ou fontes de fora). Quem pede menos movimento no aparelho vê o livro já aberto.
const ESTILO = [
  '*{box-sizing:border-box}',
  'body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow-x:hidden;background:#161d19;background-image:radial-gradient(ellipse at 50% 0%,#2b3a31 0%,#161d19 62%);color:#f3eee4;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:28px 22px}',
  'main{width:100%;max-width:340px;text-align:center}',
  '.marca{font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:#d9a184;margin:0 0 18px}',
  'h1{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-size:1.7rem;line-height:1.2;margin:0 0 10px}',
  '.aguarde{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-size:1.05rem;color:#c9c3b6;margin:0 0 30px}',
  // Livro
  '.livro{position:relative;perspective:1500px;text-align:left}',
  '.pagina{position:relative;min-height:372px;padding:30px 24px 26px 34px;border-radius:3px 9px 9px 3px;color:#3b2a1a;background:#efe3c8;background-image:linear-gradient(90deg,rgba(60,35,10,.34) 0,rgba(60,35,10,.08) 16px,rgba(60,35,10,0) 34px),radial-gradient(ellipse at 78% 18%,rgba(255,255,255,.45),rgba(255,255,255,0) 60%),radial-gradient(ellipse at 20% 92%,rgba(140,95,40,.2),rgba(140,95,40,0) 55%);box-shadow:2px 2px 0 #dccfae,4px 4px 0 #cfc09c,6px 6px 0 #c2b28c,inset 0 0 34px rgba(120,82,34,.28),0 22px 44px rgba(0,0,0,.5)}',
  '.pagina .enfeite{display:block;text-align:center;color:#8a6d4a;letter-spacing:.5em;font-size:.8rem;margin:0 0 14px}',
  'label{display:block;font-family:Georgia,"Times New Roman",serif;font-style:italic;font-size:1.08rem;line-height:1.45;margin-bottom:18px}',
  'input{width:100%;font:inherit;font-size:1.05rem;letter-spacing:.14em;text-align:center;padding:12px 14px;border:0;border-bottom:2px solid #6f5334;border-radius:6px 6px 0 0;background:rgba(255,255,255,.42);color:#2c1f12}',
  'input:focus{outline:2px solid #7a2e1f;outline-offset:2px}',
  'button{width:100%;margin-top:18px;font:inherit;font-weight:600;font-size:1rem;padding:13px;border:0;border-radius:8px;background:#7a2e1f;color:#fff;cursor:pointer}',
  'button:hover{background:#8e3725}button:focus-visible{outline:2px solid #2c1f12;outline-offset:2px}',
  '.erro{color:#8f1d10;font-weight:600;font-size:.92rem;margin:14px 0 0;text-align:center}',
  // Capa: gira em torno da lombada (borda esquerda)
  '.capa{position:absolute;inset:0;transform-origin:left center;transform-style:preserve-3d;pointer-events:none;animation:abrir 2.6s cubic-bezier(.62,.04,.3,1) .9s both}',
  '.capa>div{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:3px 9px 9px 3px}',
  '.frente{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;color:#d8b46a;background:#4a1d16;background-image:linear-gradient(90deg,rgba(0,0,0,.5) 0,rgba(0,0,0,.12) 14px,rgba(255,255,255,.07) 20px,rgba(0,0,0,0) 30px),radial-gradient(ellipse at 30% 20%,#6a2b20 0%,#4a1d16 55%,#33130e 100%);box-shadow:inset 0 0 0 10px rgba(0,0,0,.14),inset 0 0 0 12px rgba(216,180,106,.75),inset 0 0 0 16px rgba(0,0,0,.1),inset 0 0 0 17px rgba(216,180,106,.45),0 22px 44px rgba(0,0,0,.5)}',
  '.frente svg{width:62px;height:62px}',
  '.frente b{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-size:1.55rem;line-height:1.2;letter-spacing:.04em}',
  '.frente i{font-family:Georgia,"Times New Roman",serif;font-size:.95rem;letter-spacing:.3em;text-transform:uppercase;font-style:normal;opacity:.85}',
  '.frente span{letter-spacing:.5em;font-size:.8rem;opacity:.8}',
  '.verso{transform:rotateY(180deg);background:#5b3a22;background-image:repeating-linear-gradient(45deg,rgba(255,255,255,.05) 0 6px,rgba(0,0,0,.05) 6px 12px);box-shadow:inset 0 0 40px rgba(0,0,0,.45)}',
  '@keyframes abrir{0%{transform:rotateY(0)}14%{transform:rotateY(-10deg)}26%{transform:rotateY(-2deg)}100%{transform:rotateY(-176deg)}}',
  // Livro já aberto: depois de uma senha errada, ou para quem pede menos movimento
  '.aberto .capa{animation:none;transform:rotateY(-176deg)}',
  '@media (prefers-reduced-motion:reduce){.capa{animation:none;transform:rotateY(-176deg)}}'
].join('');

const CLOCHE = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 44a22 22 0 0 1 44 0"/><path d="M6 44h52"/><path d="M12 50h40"/><circle cx="32" cy="18" r="3"/><path d="M22 38a11 11 0 0 1 7-9"/></svg>';

function pagina(para, erro, status) {
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#161d19"><title>Seu Chef em Casa · em breve</title><style>' + ESTILO + '</style></head>'
    + '<body><main' + (erro ? ' class="aberto"' : '') + '><p class="marca">Seu Chef em Casa</p><h1>Grandes coisas estão para acontecer.</h1>'
    + '<p class="aguarde">O fogo já está aceso. Aguarde…</p>'
    + '<div class="livro"><form class="pagina" method="post" action="/acesso"><input type="hidden" name="para" value="' + esc(para) + '">'
    + '<span class="enfeite" aria-hidden="true">· · ·</span>'
    + '<label for="senha">Se você sabe de algum segredo desta cozinha, digite a senha:</label>'
    + '<input id="senha" name="senha" type="password" autocomplete="current-password" required autofocus>'
    + (erro ? '<p class="erro" role="alert">' + esc(erro) + '</p>' : '')
    + '<button type="submit">Abrir a porta da cozinha</button></form>'
    + '<div class="capa" aria-hidden="true"><div class="frente">' + CLOCHE + '<b>Livro de<br>Receitas</b><i>secreto</i><span>· · ·</span></div><div class="verso"></div></div>'
    + '</div></main></body></html>';
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
