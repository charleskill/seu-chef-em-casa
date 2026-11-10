// Vitrine do chef: /c/<id>
// Uma página de apresentação com cara de site próprio do chef (capa, sobre, cardápio, fotos, como trabalha),
// feita para ele compartilhar com clientes. Os botões levam ao pedido de orçamento no app e ao WhatsApp.
// É montada no servidor (sem JavaScript), então abre rápido e mostra a prévia com foto no WhatsApp, Instagram e Facebook.
// Só aparece para perfil publicado, não escondido pela equipe e pronto (foto, prato e cidade), como na busca.
import Core from '../../assets/app-core.js';

const C = Core && Core.normalizeData ? Core : globalThis.ChefCore;
const PADRAO = {
  titulo: 'Seu Chef em Casa · Boa comida, boas histórias',
  desc: 'Conheça personal chefs, explore cardápios e prepare seu pedido de orçamento.',
  imagem: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200&h=630&fit=crop&q=80'
};
const e = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dinheiro = n => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const ORDEM = ['Entradas', 'Pratos Principais', 'Massas', 'Frutos do mar', 'Sobremesas', 'Bebidas & drinks'];
// Só fotos do próprio site ou do Unsplash (as mesmas origens que a política de segurança permite).
const fotoOk = (u, origem) => { u = String(u || ''); return /^\/api\/foto\/[a-f\d]{32}$/.test(u) ? origem + u : /^https:\/\/images\.unsplash\.com\//.test(u) ? u : ''; };
const paragrafos = t => String(t || '').split(/\n\s*\n|\r?\n/).map(s => s.trim()).filter(Boolean).slice(0, 8).map(s => '<p>' + e(s) + '</p>').join('');

const CABECALHOS = {
  'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300',
  'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY', 'referrer-policy': 'strict-origin-when-cross-origin',
  'content-security-policy': "default-src 'none'; img-src 'self' data: https://images.unsplash.com; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
};

const SERIFA = 'Georgia,"Times New Roman",serif';
const ESTILO = [
  '*{box-sizing:border-box}html{scroll-behavior:smooth}',
  'body{margin:0;background:#f6f3ec;color:#26342c;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}',
  'img{display:block;max-width:100%}a{color:inherit}',
  '.l{width:100%;max-width:1040px;margin:0 auto;padding:0 22px}',
  'h1,h2,h3{font-family:' + SERIFA + ';font-weight:400;margin:0;text-wrap:balance}',
  '.olho{font-size:.72rem;letter-spacing:.28em;text-transform:uppercase;color:#a5583c;margin:0 0 12px}',
  // Botões
  '.b{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:13px 26px;border-radius:999px;font-weight:600;font-size:.98rem;text-decoration:none;border:1px solid transparent;transition:background .2s,color .2s,border-color .2s}',
  '.b1{background:#a5583c;color:#fff}.b1:hover{background:#8f4a31}',
  '.b2{background:transparent;color:#fff;border-color:rgba(255,255,255,.7)}.b2:hover{background:#fff;color:#26342c}',
  '.b3{background:transparent;color:#304e3b;border-color:#304e3b}.b3:hover{background:#304e3b;color:#fff}',
  '.b:focus-visible{outline:3px solid #e2c48f;outline-offset:3px}',
  '.acoes{display:flex;flex-wrap:wrap;gap:12px}',
  // Capa
  '.capa{position:relative;min-height:88vh;display:flex;flex-direction:column;color:#fff;background:#1c2520;overflow:hidden}',
  '.capa>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
  '.capa::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,20,17,.62) 0%,rgba(15,20,17,.18) 30%,rgba(15,20,17,.55) 62%,rgba(15,20,17,.92) 100%)}',
  '.topo{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:16px;padding-top:22px;padding-bottom:22px}',
  '.topo b{font-family:' + SERIFA + ';font-weight:400;font-size:1.05rem;letter-spacing:.04em}',
  '.topo a{font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;padding:12px 4px;border-bottom:1px solid rgba(255,255,255,.6)}',
  '.heroi{position:relative;z-index:1;margin-top:auto;padding-top:60px;padding-bottom:54px}',
  '.heroi .olho{color:#e2c48f}',
  '.heroi h1{font-size:clamp(2.6rem,9vw,4.6rem);line-height:1.04;letter-spacing:-.01em;margin-bottom:14px}',
  '.heroi .linha{font-size:1.08rem;color:rgba(255,255,255,.88);margin:0 0 30px;max-width:34em}',
  // Seções
  'section{padding:72px 0}section+section{border-top:1px solid rgba(48,78,59,.14)}',
  'h2{font-size:clamp(1.8rem,5vw,2.5rem);line-height:1.15;margin-bottom:26px}',
  '.sobre{display:grid;gap:34px;align-items:start}',
  '.sobre .retrato{width:132px;height:132px;border-radius:50%;object-fit:cover;border:4px solid #fff;box-shadow:0 10px 30px rgba(38,52,44,.18)}',
  '.sobre p{margin:0 0 1em;max-width:38em}.sobre p:first-of-type{font-family:' + SERIFA + ';font-size:1.3rem;line-height:1.5}',
  // Cardápio
  '.pratos{display:grid;gap:0 56px}',
  '.prato{padding:20px 0;border-bottom:1px solid rgba(48,78,59,.16)}',
  '.prato small{display:block;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:#7b857c;margin-bottom:4px}',
  '.prato h3{font-size:1.28rem;line-height:1.3}',
  '.prato p{margin:6px 0 0;color:#56635a;font-size:.96rem}',
  '.prato span{display:block;margin-top:8px;font-size:.88rem;color:#a5583c;font-weight:600}',
  '.nota{margin:22px 0 0;font-size:.88rem;color:#6a756c;max-width:44em}',
  // Fotos
  '.fotos{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}',
  '.fotos figure{margin:0;position:relative;aspect-ratio:1;overflow:hidden;border-radius:6px;background:#e4dfd2}',
  '.fotos img{width:100%;height:100%;object-fit:cover}',
  '.fotos figcaption{position:absolute;left:0;right:0;bottom:0;padding:26px 12px 10px;font-size:.82rem;line-height:1.35;color:#fff;background:linear-gradient(180deg,rgba(15,20,17,0),rgba(15,20,17,.78))}',
  // Como trabalho
  '.lista{list-style:none;margin:0;padding:0;display:grid;gap:12px 40px}',
  '.lista li{position:relative;padding-left:28px}.lista li::before{content:"";position:absolute;left:2px;top:.52em;width:12px;height:7px;border-left:2px solid #a5583c;border-bottom:2px solid #a5583c;transform:rotate(-45deg)}',
  '.exp{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}.exp span{border:1px solid rgba(48,78,59,.4);border-radius:999px;padding:8px 18px;font-size:.92rem}',
  // Passos
  '.passos{counter-reset:p;list-style:none;margin:0;padding:0;display:grid;gap:30px}',
  '.passos li{counter-increment:p}.passos li::before{content:"0" counter(p);display:block;font-family:' + SERIFA + ';font-size:1.5rem;color:#a5583c;margin-bottom:6px}',
  '.passos b{display:block;font-family:' + SERIFA + ';font-weight:400;font-size:1.2rem;margin-bottom:4px}.passos span{color:#56635a;font-size:.96rem}',
  // Chamada final e rodapé
  '.final{background:#1c2520;color:#f3eee4;text-align:center;padding:84px 0;border:0}',
  '.final h2{margin-bottom:12px}.final p{margin:0 auto 30px;color:#c9c3b6;max-width:30em}.final .acoes{justify-content:center}.final .olho{color:#e2c48f}',
  'footer{background:#141a17;color:#9aa39b;font-size:.84rem;padding:28px 0 96px;text-align:center}footer p{margin:0 0 6px}footer a{color:#c9c3b6}',
  // Barra fixa no celular
  '.barra{position:fixed;left:0;right:0;bottom:0;z-index:5;display:flex;gap:10px;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:rgba(246,243,236,.96);border-top:1px solid rgba(48,78,59,.18)}',
  '.barra .b{flex:1;min-height:48px;padding:10px 12px;font-size:.92rem}',
  '@media (min-width:760px){body{font-size:18px}.sobre{grid-template-columns:132px 1fr;gap:48px}.pratos{grid-template-columns:1fr 1fr}.fotos{grid-template-columns:repeat(3,1fr);gap:14px}.lista{grid-template-columns:1fr 1fr}.passos{grid-template-columns:repeat(3,1fr);gap:44px}section{padding:96px 0}.barra{display:none}footer{padding-bottom:34px}.heroi{padding-bottom:76px}}',
  '@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.b{transition:none}}',
  '@media print{.barra,.topo a{display:none}.capa{min-height:0}}'
].join('');

// /c/exemplo: vitrine de um chef fictício, para mostrar aos chefs como a página fica (e para testar sem banco).
// Tudo inventado; fotos ilustrativas do Unsplash; telefone de teste do projeto.
const U = id => 'https://images.unsplash.com/photo-' + id + '?w=1400&q=80&auto=format&fit=crop';
const EXEMPLO = {
  name: 'Helena Duarte', specialty: 'Cozinha italiana', cities: 'Florianópolis, São José, Palhoça', whatsapp: '(48) 99110-6355',
  bio: 'Cozinho há quinze anos e acredito que um bom jantar começa muito antes do primeiro prato: na escolha dos ingredientes, na conversa sobre a ocasião, no cuidado com cada detalhe.\n\nLevo a cozinha até a sua casa, preparo tudo na hora e deixo o ambiente pronto para você só receber quem gosta. (Este é um perfil de exemplo, com dados fictícios.)',
  avatar: U('1577219491135-ce391730fb2c'),
  gallery: [
    { url: U('1414235077428-338989a2e8c0'), caption: '' },
    { url: U('1476124369491-e7addf5db371'), caption: '' },
    { url: U('1616669944447-d65d41a222bd'), caption: '' },
    { url: U('1464093515883-ec948246accb'), caption: '' },
    { url: U('1544025162-d76694265947'), caption: '' },
    { url: U('1529692236671-f1f6cf9683ba'), caption: '' },
    { url: U('1519708227418-c8fd9a32b7a2'), caption: '' }
  ],
  dishes: [
    { category: 'Entradas', name: 'Burrata com tomates assados', desc: 'Burrata cremosa, tomates confitados, manjericão e azeite extravirgem.', price: 38 },
    { category: 'Entradas', name: 'Carpaccio de carne', desc: 'Lâminas finas com rúcula, parmesão e molho de alcaparras.', price: 42 },
    { category: 'Massas', name: 'Tagliatelle ao ragu de costela', desc: 'Massa fresca feita na hora e costela cozida por seis horas.', price: 78 },
    { category: 'Massas', name: 'Ravióli de abóbora', desc: 'Na manteiga de sálvia, com amêndoas tostadas.', price: 72 },
    { category: 'Pratos Principais', name: 'Risoto de funghi', desc: 'Arroz arbóreo, cogumelos frescos e secos, finalizado com parmesão.', price: 84 },
    { category: 'Pratos Principais', name: 'Ossobuco à milanesa', desc: 'Cozido lentamente em vinho branco, servido com risoto de açafrão.', price: 96 },
    { category: 'Sobremesas', name: 'Tiramisù', desc: 'A receita clássica, montada no dia.', price: 28 },
    { category: 'Sobremesas', name: 'Panna cotta com frutas vermelhas', desc: 'Leve, com calda feita em casa.', price: 26 }
  ],
  opcoes: { garcom: true, x_pizza: true, x_lounge: true }
};

function indisponivel(origem) {
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">'
    + '<title>' + e(PADRAO.titulo) + '</title><meta property="og:title" content="' + e(PADRAO.titulo) + '"><meta property="og:description" content="' + e(PADRAO.desc) + '"><meta property="og:image" content="' + e(PADRAO.imagem) + '">'
    + '<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f6f3ec;color:#26342c;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:24px;text-align:center}h1{font-family:' + SERIFA + ';font-weight:400;font-size:1.8rem;margin:0 0 10px}p{margin:0 0 24px;color:#56635a}a{display:inline-block;padding:13px 26px;border-radius:999px;background:#a5583c;color:#fff;text-decoration:none;font-weight:600}</style></head>'
    + '<body><main><h1>Este perfil não está disponível</h1><p>O chef pode ter pausado a página ou o endereço mudou.</p><a href="' + e(origem + '/#/buscar') + '">Conhecer outros chefs</a></main></body></html>';
  return new Response(html, { status: 404, headers: { ...CABECALHOS, 'cache-control': 'no-store' } });
}

export async function onRequest({ request, env, params }) {
  const origem = new URL(request.url).origin, id = String(params.id || '');
  let p = null;
  if (id === 'exemplo') p = EXEMPLO;
  else if (/^chef-[a-f\d]{16}$/.test(id) && env.DB) {
    try {
      const row = await env.DB.prepare('SELECT perfil FROM chefs WHERE id = ? AND publicado = 1 AND COALESCE(oculto, 0) = 0').bind(id).first();
      if (row) { const x = JSON.parse(row.perfil || '{}'); if (x.name && !C.faltaPerfil(x).length) p = x; }
    } catch (err) { p = null; }
  }
  if (!p) return indisponivel(origem);

  const esteLink = origem + '/c/' + id;
  const exemplo = p === EXEMPLO;
  const perfil = exemplo ? origem + '/#/buscar' : origem + '/#/chef/' + encodeURIComponent(id);
  const pedido = exemplo ? origem + '/#/buscar' : origem + '/#/pedido/' + encodeURIComponent(id);
  const galeria = (Array.isArray(p.gallery) ? p.gallery : []).map(g => ({ url: fotoOk(g && g.url, origem), legenda: String((g && g.caption) || '').trim() })).filter(g => g.url);
  const avatar = fotoOk(p.avatar, origem);
  const capa = (galeria[0] && galeria[0].url) || avatar;
  const fone = C.phone(p.whatsapp);
  const zap = fone ? 'https://wa.me/' + fone + '?text=' + encodeURIComponent('Olá, ' + p.name + '! Vi sua página no Seu Chef em Casa e gostaria de conversar sobre um encontro.') : '';
  const primeiroNome = String(p.name).trim().split(/\s+/)[0];
  const linha = [p.specialty, p.cities].map(s => String(s || '').trim()).filter(Boolean).join(' · ');
  const titulo = p.name + ' · Personal chef';
  const desc = (linha ? linha + '. ' : '') + 'Veja o cardápio e peça seu orçamento.';

  const pratos = (Array.isArray(p.dishes) ? p.dishes : []).filter(d => d && d.name)
    .map((d, i) => ({ d, i, o: ORDEM.indexOf(d.category) < 0 ? 99 : ORDEM.indexOf(d.category) })).sort((a, b) => a.o - b.o || a.i - b.i).map(x => x.d);
  const mostra = pratos.slice(0, 8);
  const op = C.opcoes(p);
  const marcadas = C.OPCOES.filter(x => op[x[0]]);
  const trabalho = marcadas.filter(x => !x[0].startsWith('x_')).map(x => x[1]);
  const experiencias = marcadas.filter(x => x[0].startsWith('x_')).map(x => x[1].replace(/^Faço /, ''));
  if (p.marmita) experiencias.push('Marmitas da semana');
  const fotos = galeria.slice(1, 7);

  const botoes = (claro) => '<div class="acoes"><a class="b b1" href="' + e(pedido) + '">Montar meu orçamento</a>'
    + (zap ? '<a class="b ' + (claro ? 'b2' : 'b3') + '" href="' + e(zap) + '" target="_blank" rel="noopener">Conversar no WhatsApp</a>' : '') + '</div>';

  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + e(titulo) + '</title><meta name="description" content="' + e(desc) + '"><meta name="theme-color" content="#1c2520">'
    + '<meta property="og:type" content="profile"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Seu Chef em Casa">'
    + '<meta property="og:title" content="' + e(titulo) + '"><meta property="og:description" content="' + e(desc) + '">'
    + '<meta property="og:image" content="' + e(capa || PADRAO.imagem) + '"><meta property="og:url" content="' + e(esteLink) + '">'
    + '<meta name="twitter:card" content="summary_large_image"><link rel="canonical" href="' + e(esteLink) + '">'
    + '<style>' + ESTILO + '</style></head><body>'

    // Capa
    + '<header class="capa">' + (capa ? '<img src="' + e(capa) + '" alt="">' : '')
    + '<div class="l topo"><b>' + e(p.name) + '</b><a href="#contato">Pedir orçamento</a></div>'
    + '<div class="l heroi"><p class="olho">Personal chef' + (p.specialty ? ' · ' + e(p.specialty) : '') + '</p><h1>' + e(p.name) + '</h1>'
    + '<p class="linha">' + (p.cities ? 'Na sua casa, em ' + e(p.cities) + '.' : 'Na sua casa, do seu jeito.') + '</p>' + botoes(true) + '</div></header><main>'

    // Sobre
    + (p.bio || avatar ? '<section><div class="l sobre">' + (avatar ? '<img class="retrato" src="' + e(avatar) + '" alt="Foto de ' + e(p.name) + '" width="132" height="132">' : '<span></span>')
      + '<div><p class="olho">Sobre</p><h2>Prazer, ' + e(primeiroNome) + '.</h2>' + (paragrafos(p.bio) || '<p>Cozinho na sua casa, com cardápio pensado para o seu encontro.</p>') + '</div></div></section>' : '')

    // Cardápio
    + (mostra.length ? '<section><div class="l"><p class="olho">Do cardápio</p><h2>Alguns pratos que eu preparo</h2><div class="pratos">'
      + mostra.map(d => '<article class="prato">' + (d.category ? '<small>' + e(d.category) + '</small>' : '') + '<h3>' + e(d.name) + '</h3>'
        + (d.desc ? '<p>' + e(d.desc) + '</p>' : '') + (Number(d.price) > 0 ? '<span>Referência: ' + e(dinheiro(d.price)) + ' por pessoa</span>' : '') + '</article>').join('')
      + '</div><p class="nota">' + (pratos.length > mostra.length ? 'São ' + pratos.length + ' pratos no cardápio completo. ' : '')
      + 'Os valores são uma referência; o preço final depende do número de pessoas e do que combinarmos. <a href="' + e(perfil) + '">Ver o cardápio completo</a></p></div></section>' : '')

    // Fotos
    + (fotos.length ? '<section><div class="l"><p class="olho">Da minha cozinha</p><h2>Um pouco do que já servi</h2><div class="fotos">'
      + fotos.map(g => '<figure><img src="' + e(g.url) + '" alt="' + e(g.legenda || 'Prato preparado por ' + p.name) + '" loading="lazy">' + (g.legenda ? '<figcaption>' + e(g.legenda.slice(0, 90)) + '</figcaption>' : '') + '</figure>').join('')
      + '</div></div></section>' : '')

    // Como trabalho
    + (trabalho.length || experiencias.length ? '<section><div class="l"><p class="olho">Como eu trabalho</p><h2>Cuido de tudo para você aproveitar</h2>'
      + (trabalho.length ? '<ul class="lista">' + trabalho.map(t => '<li>' + e(t) + '</li>').join('') + '</ul>' : '')
      + (experiencias.length ? '<div class="exp">' + experiencias.map(t => '<span>' + e(t) + '</span>').join('') + '</div>' : '') + '</div></section>' : '')

    // Passos
    + '<section><div class="l"><p class="olho">Como funciona</p><h2>Do primeiro contato ao último prato</h2><ol class="passos">'
    + '<li><b>Escolha os pratos</b><span>Veja o cardápio e marque o que combina com o seu encontro.</span></li>'
    + '<li><b>Conte como será</b><span>Data, número de pessoas e o que mais for importante para você.</span></li>'
    + '<li><b>Combinamos os detalhes</b><span>O pedido segue pelo WhatsApp e acertamos valores e disponibilidade.</span></li></ol></div></section>'

    // Chamada final
    + '<section class="final" id="contato"><div class="l"><p class="olho">Vamos conversar</p><h2>Seu próximo encontro começa aqui.</h2>'
    + '<p>Me conte a ocasião e eu preparo uma proposta para a sua mesa.</p>' + botoes(true) + '</div></section></main>'

    + '<footer><div class="l"><p>' + e(p.name) + ' atende pelo <a href="' + e(origem + '/') + '">Seu Chef em Casa</a>.</p>'
    + '<p>A plataforma é uma vitrine: contratação, pagamento e serviço são combinados direto com o chef. <a href="' + e(origem + '/#/termos') + '">Termos de uso</a></p></div></footer>'
    + '<nav class="barra" aria-label="Contato"><a class="b b1" href="' + e(pedido) + '">Montar orçamento</a>' + (zap ? '<a class="b b3" href="' + e(zap) + '" target="_blank" rel="noopener">WhatsApp</a>' : '') + '</nav>'
    + '</body></html>';
  return new Response(html, { headers: CABECALHOS });
}
