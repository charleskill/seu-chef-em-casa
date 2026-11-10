// Site fechado para testes: enquanto a variável SENHA_SITE existir na Cloudflare, tudo (páginas, arquivos e /api)
// só abre depois de digitar essa senha. Sem a variável, este arquivo não faz nada e o site fica aberto.
// A senha não fica no código nem nos documentos: só na Cloudflare (Settings → Variables and secrets, tipo Secret).
// É uma porta simples para o período de testes, não substitui o login dos chefs.
// /acesso?previa mostra a tela de senha mesmo para quem já entrou (para rever a tela); ela não libera nada.
const LIGADA = false;
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

// Tela de senha: sóbria, fundo escuro, texto em serifa e um campo só com a linha de baixo.
// O conteúdo entra com um aparecimento suave, em sequência. Só HTML e CSS (sem JavaScript, imagens ou fontes de fora).
// A versão com o livro de receitas animado ficou no histórico do Git (commit 4357e2a), caso queiram voltar a ela.
const SERIFA = 'Georgia,"Times New Roman",serif';
const ESTILO = [
  '*{box-sizing:border-box}',
  'body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#141a17;background-image:radial-gradient(ellipse at 50% -10%,#27332c 0%,#141a17 60%);color:#f1ece2;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:32px 26px}',
  'main{width:100%;max-width:380px;text-align:center}',
  'main>*{animation:surgir 1.1s cubic-bezier(.2,.6,.2,1) both}',
  '.marca{animation-delay:.1s}h1{animation-delay:.35s}.aguarde{animation-delay:.7s}.fio{animation-delay:1s}form{animation-delay:1.25s}',
  '@keyframes surgir{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
  '.marca{font-size:.7rem;letter-spacing:.32em;text-transform:uppercase;color:#c9a46a;margin:0 0 34px}',
  'h1{font-family:' + SERIFA + ';font-weight:400;font-size:2rem;line-height:1.22;letter-spacing:.005em;margin:0 0 16px}',
  '.aguarde{font-family:' + SERIFA + ';font-style:italic;font-size:1.08rem;color:#b9b3a6;margin:0}',
  '.fio{width:44px;height:1px;background:#c9a46a;margin:38px auto;opacity:.8}',
  'label{display:block;font-size:.92rem;line-height:1.5;color:#b9b3a6;margin-bottom:18px}',
  'input{width:100%;font:inherit;font-size:1.1rem;letter-spacing:.28em;text-align:center;padding:12px 8px;border:0;border-bottom:1px solid rgba(241,236,226,.45);border-radius:0;background:transparent;color:#f1ece2}',
  'input:focus{outline:0;border-bottom-color:#c9a46a;box-shadow:0 1px 0 #c9a46a}',
  'input:focus-visible{outline:2px solid #c9a46a;outline-offset:6px}',
  'button{margin-top:30px;font:inherit;font-size:.78rem;font-weight:600;letter-spacing:.24em;text-transform:uppercase;padding:15px 30px;min-height:48px;border:1px solid #c9a46a;border-radius:2px;background:transparent;color:#e2c48f;cursor:pointer;transition:background .2s,color .2s}',
  'button:hover{background:#c9a46a;color:#141a17}button:focus-visible{outline:2px solid #f1ece2;outline-offset:3px}',
  '.erro{color:#f0a999;font-size:.9rem;margin:16px 0 0}',
  '.aberto>*{animation:none}',
  '@media (prefers-reduced-motion:reduce){main>*{animation:none}}'
].join('');

function pagina(para, erro, status) {
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#141a17"><title>Seu Chef em Casa · em breve</title><style>' + ESTILO + '</style></head>'
    + '<body><main' + (erro ? ' class="aberto"' : '') + '><p class="marca">Seu Chef em Casa</p><h1>Grandes coisas estão para acontecer.</h1>'
    + '<p class="aguarde">O fogo já está aceso. Aguarde…</p><div class="fio" aria-hidden="true"></div>'
    + '<form method="post" action="/acesso"><input type="hidden" name="para" value="' + esc(para) + '">'
    + '<label for="senha">Se você sabe de algum segredo desta cozinha, digite a senha.</label>'
    + '<input id="senha" name="senha" type="password" autocomplete="current-password" required autofocus>'
    + (erro ? '<p class="erro" role="alert">' + esc(erro) + '</p>' : '')
    + '<button type="submit">Entrar</button></form></main></body></html>';
  return new Response(html, { status, headers: CABECALHOS });
}

export async function onRequest({ request: req, env, next }) {
  const url = new URL(req.url);
  // Prévia da tela (só mostra; o formulário continua exigindo a senha certa).
  if (req.method === 'GET' && url.pathname === '/acesso' && url.searchParams.has('previa')) return pagina('/', '', 200);

  // LIGADA = false: porta desligada em 10/11/2026, a pedido (site aberto). Para fechar de novo, troque para true
  // e mantenha a variável SENHA_SITE na Cloudflare.
  const senha = LIGADA ? String(env.SENHA_SITE || '').trim() : '';
  if (!senha) return next();

  const esperado = await marca(senha);
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)scc_acesso=([a-f\d]{64})/);
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
