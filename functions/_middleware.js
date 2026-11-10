// Site fechado para testes: enquanto a variável SENHA_SITE existir na Cloudflare, tudo (páginas, arquivos e /api)
// só abre depois de digitar essa senha. Sem a variável, este arquivo não faz nada e o site fica aberto.
// A senha não fica no código nem nos documentos: só na Cloudflare (Settings → Variables and secrets, tipo Secret).
// É uma porta simples para o período de testes, não substitui o login dos chefs.
// /acesso?previa mostra a tela de senha mesmo para quem já entrou (para rever a animação); ela não libera nada.
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

// Tela de senha: um livro de receitas antigo. Ele aparece fechado, a capa abre, duas folhas viram
// e a "câmera" se aproxima da página da direita, onde fica o campo da senha.
// Tudo em HTML e CSS (sem JavaScript, imagens ou fontes de fora).
// Depois de uma senha errada, e para quem pede menos movimento no aparelho, o livro já aparece aberto.
const SERIFA = 'Georgia,"Times New Roman",serif';
const PAPEL = 'background-color:#efe3c8;color:#3b2a1a;';
const ESTILO = [
  '*{box-sizing:border-box}',
  'body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow-x:hidden;background:#161d19;background-image:radial-gradient(ellipse at 50% 0%,#2b3a31 0%,#161d19 62%);color:#f3eee4;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:28px 22px}',
  'main{width:100%;max-width:340px;text-align:center}',
  '.marca{font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:#d9a184;margin:0 0 18px}',
  'h1{font-family:' + SERIFA + ';font-weight:400;font-size:1.7rem;line-height:1.2;margin:0 0 10px}',
  '.aguarde{font-family:' + SERIFA + ';font-style:italic;font-size:1.05rem;color:#c9c3b6;margin:0 0 34px}',

  // Cena e livro. O livro é a página da direita; capa e folhas giram em torno da lombada (borda esquerda).
  '.cena{width:300px;max-width:100%;margin:0 auto;perspective:1700px;text-align:left}',
  '.livro{position:relative;transform-style:preserve-3d;animation:zoom 4.8s cubic-bezier(.5,0,.2,1) both}',
  '@keyframes zoom{0%,18%{transform:translateX(0) scale(.6)}50%,66%{transform:translateX(90px) scale(.6)}100%{transform:translateX(0) scale(1)}}',

  // Página da direita (o formulário), com o bloco de folhas, a contracapa por baixo e a fita marcadora
  '.pagina{position:relative;display:block;min-height:400px;padding:34px 24px 28px 36px;border-radius:2px 8px 8px 2px;transform-style:preserve-3d;' + PAPEL
    + 'background-image:linear-gradient(90deg,rgba(60,35,10,.42) 0,rgba(60,35,10,.1) 18px,rgba(60,35,10,0) 40px),radial-gradient(ellipse at 78% 16%,rgba(255,255,255,.45),rgba(255,255,255,0) 60%),radial-gradient(ellipse at 22% 94%,rgba(140,95,40,.22),rgba(140,95,40,0) 55%);'
    + 'box-shadow:1px 1px 0 #e3d7b8,2px 2px 0 #c9b98f,3px 3px 0 #e3d7b8,4px 4px 0 #c9b98f,5px 5px 0 #e3d7b8,6px 6px 0 #bfae84,inset 0 0 36px rgba(120,82,34,.3)}',
  '.pagina::before{content:"";position:absolute;inset:-8px -14px -14px -6px;border-radius:4px 11px 11px 4px;background:#3a1610;transform:translateZ(-3px);box-shadow:0 26px 50px rgba(0,0,0,.6)}',
  '.pagina::after{content:"";position:absolute;right:46px;bottom:-34px;width:14px;height:52px;background:#9c2f22;clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%);transform:translateZ(-1px)}',
  '.enfeite{display:block;text-align:center;color:#8a6d4a;letter-spacing:.5em;font-size:.8rem;margin:0 0 16px}',
  'label{display:block;font-family:' + SERIFA + ';font-style:italic;font-size:1.1rem;line-height:1.45;margin-bottom:20px}',
  'input{width:100%;font:inherit;font-size:1.05rem;letter-spacing:.14em;text-align:center;padding:12px 14px;border:0;border-bottom:2px solid #6f5334;border-radius:6px 6px 0 0;background:rgba(255,255,255,.42);color:#2c1f12}',
  'input:focus{outline:2px solid #7a2e1f;outline-offset:2px}',
  'button{width:100%;margin-top:18px;font:inherit;font-weight:600;font-size:1rem;padding:13px;border:0;border-radius:8px;background:#7a2e1f;color:#fff;cursor:pointer}',
  'button:hover{background:#8e3725}button:focus-visible{outline:2px solid #2c1f12;outline-offset:2px}',
  '.erro{color:#8f1d10;font-weight:600;font-size:.92rem;margin:14px 0 0;text-align:center}',

  // Partes que giram
  '.capa,.folha{position:absolute;inset:0;transform-origin:left center;transform-style:preserve-3d;pointer-events:none}',
  '.capa{inset:-8px -14px -14px 0;animation:capa 1.6s cubic-bezier(.6,.05,.3,1) .8s both}',
  '.f1{animation:folha1 1s ease-in-out 2.1s both}.f2{animation:folha2 1s ease-in-out 2.45s both}',
  '.capa>div,.folha>div{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}',
  '.verso,.fv{transform:rotateY(180deg)}',
  '@keyframes capa{0%{transform:rotateY(0) translateZ(4px)}13%{transform:rotateY(-13deg) translateZ(4px)}25%{transform:rotateY(-3deg) translateZ(4px)}100%{transform:rotateY(-180deg) translateZ(4px)}}',
  '@keyframes folha1{from{transform:rotateY(0) translateZ(2.6px)}to{transform:rotateY(-180deg) translateZ(2.6px)}}',
  '@keyframes folha2{from{transform:rotateY(0) translateZ(1.3px)}to{transform:rotateY(-180deg) translateZ(1.3px)}}',

  // Capa de couro: lombada com nervuras, moldura dourada, cantoneiras e título
  '.frente{border-radius:3px 11px 11px 3px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding-left:30px;text-align:center;color:#dcb96c;background-color:#4a1d16;'
    + 'background-image:linear-gradient(90deg,#2a0f0b 0,#3b1711 10px,#2a0f0b 26px,rgba(255,255,255,.1) 28px,rgba(0,0,0,0) 34px),repeating-linear-gradient(180deg,rgba(0,0,0,0) 0 62px,rgba(220,185,108,.75) 62px 64px,rgba(0,0,0,.35) 64px 67px,rgba(0,0,0,0) 67px 110px),radial-gradient(ellipse at 40% 22%,#6e2d21 0%,#4a1d16 55%,#30120d 100%);'
    + 'background-size:auto,28px 100%,auto;background-repeat:no-repeat,no-repeat,no-repeat;box-shadow:inset 0 0 26px rgba(0,0,0,.45)}',
  '.moldura{position:absolute;inset:16px 16px 16px 42px;border:2px solid rgba(220,185,108,.85);border-radius:4px;box-shadow:inset 0 0 0 4px rgba(0,0,0,.12),inset 0 0 0 5px rgba(220,185,108,.45)}',
  '.canto{position:absolute;width:30px;height:30px;border:3px solid #dcb96c;opacity:.9}',
  '.c1{top:8px;right:8px;border-left:0;border-bottom:0;border-radius:0 9px 0 0}.c2{bottom:8px;right:8px;border-left:0;border-top:0;border-radius:0 0 9px 0}',
  '.frente svg{width:66px;height:66px;position:relative}',
  '.frente b{position:relative;font-family:' + SERIFA + ';font-weight:400;font-size:1.9rem;line-height:1.15;letter-spacing:.04em;text-shadow:0 1px 0 rgba(0,0,0,.5)}',
  '.frente i{position:relative;font-family:' + SERIFA + ';font-size:.95rem;letter-spacing:.34em;text-transform:uppercase;font-style:normal;opacity:.9}',
  '.frente u{position:relative;text-decoration:none;letter-spacing:.5em;font-size:.8rem;opacity:.8}',

  // Lado de dentro da capa: guarda do livro com uma "receita" manuscrita
  '.verso{border-radius:11px 3px 3px 11px;background-color:#3a1610;padding:8px 0 14px 14px}',
  '.guarda{height:100%;border-radius:8px 2px 2px 8px;padding:30px 30px 24px 24px;font-family:' + SERIFA + ';font-style:italic;font-size:.95rem;line-height:1.7;' + PAPEL
    + 'background-image:linear-gradient(270deg,rgba(60,35,10,.42) 0,rgba(60,35,10,.1) 18px,rgba(60,35,10,0) 40px),radial-gradient(ellipse at 24% 80%,rgba(140,95,40,.25),rgba(140,95,40,0) 55%);box-shadow:inset 0 0 36px rgba(120,82,34,.3)}',
  '.guarda strong{display:block;font-style:normal;font-weight:400;font-size:.72rem;letter-spacing:.26em;text-transform:uppercase;color:#8a6d4a;margin-bottom:10px}',
  '.guarda em{display:block;font-size:1.2rem;line-height:1.3;margin-bottom:14px}',
  '.guarda span{display:block;padding-left:14px;text-indent:-14px}',

  // Folhas que viram: pergaminho com linhas apagadas
  '.ff,.fv{' + PAPEL + 'background-image:linear-gradient(90deg,rgba(60,35,10,.34) 0,rgba(60,35,10,0) 36px),repeating-linear-gradient(180deg,rgba(0,0,0,0) 0 25px,rgba(90,70,48,.2) 25px 26px);background-position:0 0,0 46px;background-repeat:no-repeat,repeat;box-shadow:inset 0 0 36px rgba(120,82,34,.3)}',
  '.ff{border-radius:2px 8px 8px 2px}.fv{border-radius:8px 2px 2px 8px;background-image:linear-gradient(270deg,rgba(60,35,10,.34) 0,rgba(60,35,10,0) 36px),repeating-linear-gradient(180deg,rgba(0,0,0,0) 0 25px,rgba(90,70,48,.2) 25px 26px)}',

  // Livro já aberto: depois de uma senha errada, ou para quem pede menos movimento
  '.aberto .livro,.aberto .capa,.aberto .folha{animation:none}',
  '.aberto .capa{transform:rotateY(-180deg) translateZ(4px)}.aberto .f1{transform:rotateY(-180deg) translateZ(2.6px)}.aberto .f2{transform:rotateY(-180deg) translateZ(1.3px)}',
  '@media (prefers-reduced-motion:reduce){.livro,.capa,.folha{animation:none}.capa{transform:rotateY(-180deg) translateZ(4px)}.f1{transform:rotateY(-180deg) translateZ(2.6px)}.f2{transform:rotateY(-180deg) translateZ(1.3px)}}'
].join('');

const CLOCHE = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 44a22 22 0 0 1 44 0"/><path d="M6 44h52"/><path d="M12 50h40"/><circle cx="32" cy="18" r="3"/><path d="M22 38a11 11 0 0 1 7-9"/></svg>';

function pagina(para, erro, status) {
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#161d19"><title>Seu Chef em Casa · em breve</title><style>' + ESTILO + '</style></head>'
    + '<body><main' + (erro ? ' class="aberto"' : '') + '><p class="marca">Seu Chef em Casa</p><h1>Grandes coisas estão para acontecer.</h1>'
    + '<p class="aguarde">O fogo já está aceso. Aguarde…</p>'
    + '<div class="cena"><div class="livro">'
    + '<form class="pagina" method="post" action="/acesso"><input type="hidden" name="para" value="' + esc(para) + '">'
    + '<span class="enfeite" aria-hidden="true">· · ·</span>'
    + '<label for="senha">Se você sabe de algum segredo desta cozinha, digite a senha:</label>'
    + '<input id="senha" name="senha" type="password" autocomplete="current-password" required autofocus>'
    + (erro ? '<p class="erro" role="alert">' + esc(erro) + '</p>' : '')
    + '<button type="submit">Abrir a porta da cozinha</button></form>'
    + '<div class="folha f2" aria-hidden="true"><div class="ff"></div><div class="fv"></div></div>'
    + '<div class="folha f1" aria-hidden="true"><div class="ff"></div><div class="fv"></div></div>'
    + '<div class="capa" aria-hidden="true">'
    + '<div class="frente"><div class="moldura"></div><div class="canto c1"></div><div class="canto c2"></div>' + CLOCHE + '<b>Livro de<br>Receitas</b><i>secreto</i><u>· · ·</u></div>'
    + '<div class="verso"><div class="guarda"><strong>Receita nº 1</strong><em>Para abrir o apetite e a curiosidade</em>'
    + '<span>— 1 pitada de mistério</span><span>— 2 colheres de paciência</span><span>— fogo baixo, sem pressa</span><span>— e um segredo bem guardado</span></div></div>'
    + '</div>'
    + '</div></div></main></body></html>';
  return new Response(html, { status, headers: CABECALHOS });
}

export async function onRequest({ request: req, env, next }) {
  const url = new URL(req.url);
  // Prévia da tela (só mostra; o formulário continua exigindo a senha certa).
  if (req.method === 'GET' && url.pathname === '/acesso' && url.searchParams.has('previa')) return pagina('/', '', 200);

  const senha = String(env.SENHA_SITE || '').trim();
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
