// Vitrine do chef, montada no servidor. Usada em /chef/<slug> (endereço para o Google) e em /c/exemplo.
// Antes ficava em functions/c/[id].js; /c/<id> agora redireciona (301) para /chef/<slug>.
// Perfil compartilhável com apresentação, publicações e cardápio no HTML inicial.
// A prévia do WhatsApp vem dos metadados. O visualizador de fotos aprimora os links da galeria.
// Só aparece para perfil publicado, não escondido pela equipe e pronto (foto, prato e cidade), como na busca.
import Core from '../../assets/app-core.js';

export const C = Core && Core.normalizeData ? Core : globalThis.ChefCore;
export const PADRAO = {
  titulo: 'Seu Chef em Casa · Boa comida, boas histórias',
  desc: 'Conheça personal chefs, explore cardápios e prepare seu pedido de orçamento.',
  imagem: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200&h=630&fit=crop&q=80'
};
export const e = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dinheiro = n => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const ORDEM = ['Entradas', 'Massas', 'Frutos do mar', 'Pratos Principais', 'Sobremesas', 'Bebidas & drinks'];
// Só fotos do próprio site ou do Unsplash (as mesmas origens que a política de segurança permite).
export const fotoOk = (u, origem) => { u = String(u || ''); return /^\/api\/foto\/[a-f\d]{32}$/.test(u) || /^\/assets\/apresentacao\/[a-z0-9-]+\.webp$/.test(u) ? origem + u : /^https:\/\/images\.unsplash\.com\//.test(u) ? u : ''; };
const paragrafos = t => String(t || '').split(/\n\s*\n|\r?\n/).map(s => s.trim()).filter(Boolean).slice(0, 8).map(s => '<p>' + e(s) + '</p>').join('');

export const CABECALHOS = {
  'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300',
  'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY', 'referrer-policy': 'strict-origin-when-cross-origin',
  'content-security-policy': "default-src 'none'; script-src 'self'; img-src 'self' data: https://images.unsplash.com; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
};

export const SERIFA = 'Palatino,"Palatino Linotype",Georgia,serif';
const ESTILO = [
  '*{box-sizing:border-box}body{margin:0;background:#f6f3eb;color:#303629;font:16px/1.5 system-ui,sans-serif}a{color:inherit}img{display:block;max-width:100%}',
  '.l{width:min(100% - 32px,800px);margin-inline:auto}h1,h2,h3,.marca{font-family:' + SERIFA + ';font-weight:400;margin:0}h1{font-size:clamp(1.8rem,6vw,3.1rem);line-height:1.12;overflow-wrap:anywhere}h2{font-size:1.8rem}',
  '.topo{border-bottom:1px solid #dfd9cc}.topo .l{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:54px}.marca{color:#455238;text-decoration:none;font-size:1.15rem}.buscar{font-size:.83rem;color:#455238}',
  '.perfil{padding:22px 0 16px}.identidade{display:flex;align-items:center;gap:clamp(12px,4vw,40px)}.retrato{flex:none;width:clamp(60px,18vw,112px);aspect-ratio:1;border-radius:50%;object-fit:cover;border:2px solid #754653;background:#e8e3d6;color:#455238}.iniciais{display:grid;place-items:center;font:1.5rem Georgia,serif}',
  '.contadores{margin:0;display:grid;flex:1;grid-template-columns:repeat(3,minmax(0,1fr));text-align:center;gap:4px}.contadores div{display:flex;flex-direction:column-reverse}.contadores dt{font-size:clamp(.69rem,2.8vw,.9rem);color:#455238}.contadores dd{margin:0;font-size:1.25rem;font-weight:650;font-variant-numeric:tabular-nums}',
  '.apresentacao{margin-top:14px}.especialidade{color:#754653;font-weight:600}.apresentacao p{margin:4px 0;overflow-wrap:anywhere}.bio{margin-top:8px;max-width:60ch}.bio summary{min-height:44px;cursor:pointer;color:#455238;align-content:center}.cidade{color:#455238}',
  '.acoes{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.b{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:8px 15px;border:1px solid #455238;border-radius:999px;font-weight:600;font-size:.88rem;text-decoration:none;color:#455238}.b1{background:#754653;border-color:#754653;color:#fff}.b:hover{box-shadow:0 0 0 1px currentColor inset}',
  ':focus-visible{outline:3px solid #754653;outline-offset:2px}.secoes{display:flex;gap:20px;border-block:1px solid #dfd9cc;margin-bottom:5px}.secoes a{display:inline-flex;align-items:center;min-height:44px;font-size:.88rem;color:#455238;font-weight:600}.secoes a:first-child{color:#754653}',
  '.fotos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.fotos a{aspect-ratio:1;overflow:hidden;border-radius:4px;background:#e8e3d6}.fotos a:focus-visible{outline-offset:-4px}.fotos img{width:100%;height:100%;object-fit:cover}',
  'section+section{margin-top:28px;padding-top:20px;border-top:1px solid #dfd9cc}.pratos{display:grid;gap:0 24px}.prato{padding:12px 0;border-bottom:1px solid #dfd9cc;overflow-wrap:anywhere}.prato h3{font-size:1.22rem}.prato p,.nota{color:#455238;margin:4px 0}.prato span{color:#754653;font-weight:600}.mais summary{cursor:pointer;min-height:44px;align-content:center}',
  '.lista{padding-left:22px}.exp{display:flex;flex-wrap:wrap;gap:8px}.exp span{border:1px solid #dfd9cc;padding:6px 12px;border-radius:999px}.final{padding-bottom:28px}footer{background:#455238;color:#f6f3eb;padding:18px 0;font-size:.88rem}',
  'dialog{box-sizing:border-box;width:min(100% - 24px,660px);max-height:calc(100dvh - 24px);border:0;border-radius:12px;padding:14px;color:#303629;background:#f6f3eb}dialog::backdrop{background:#252a21cc}.foto-topo,.foto-nav{display:flex;align-items:center;justify-content:space-between;gap:8px}.foto-topo h2{font-size:1.3rem}dialog img{width:100%;max-height:56dvh;object-fit:contain;background:#e8e3d6}dialog button{min-height:44px;cursor:pointer;background:transparent}dialog button:disabled{opacity:.5;cursor:default}dialog p{white-space:pre-wrap;overflow-wrap:anywhere}',
  '@media(min-width:670px){.perfil{padding-top:30px}.fotos{gap:8px}.pratos{grid-template-columns:1fr 1fr}}'
].join('');

// /c/exemplo: vitrine de um chef fictício, para mostrar aos chefs como a página fica (e para testar sem banco).
// Tudo inventado; fotos ilustrativas do Unsplash; telefone de teste do projeto.
const U = id => 'https://images.unsplash.com/photo-' + id + '?w=1400&q=80&auto=format&fit=crop';
export const EXEMPLO = {
  name: 'Helena Duarte', specialty: 'Cozinha italiana', cities: 'Florianópolis, São José, Palhoça', whatsapp: '(48) 99110-6355',
  bio: 'Cozinho há quinze anos e acredito que um bom jantar começa muito antes do primeiro prato: na escolha dos ingredientes, na conversa sobre a ocasião, no cuidado com cada detalhe.\n\nLevo a cozinha até a sua casa, preparo tudo na hora e deixo o ambiente pronto para você só receber quem gosta. (Este é um perfil de exemplo, com dados fictícios.)',
  avatar: '',
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

export function indisponivel(origem) {
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">'
    + '<title>' + e(PADRAO.titulo) + '</title><meta property="og:title" content="' + e(PADRAO.titulo) + '"><meta property="og:description" content="' + e(PADRAO.desc) + '"><meta property="og:image" content="' + e(PADRAO.imagem) + '">'
    + '<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f6f3eb;color:#303629;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:24px;text-align:center}h1{font-family:' + SERIFA + ';font-weight:400;font-size:1.8rem;margin:0 0 10px}p{margin:0 0 24px;color:#56635a}a{display:inline-block;padding:13px 26px;border-radius:999px;background:#754653;color:#fff;text-decoration:none;font-weight:600}</style></head>'
    + '<body><main><h1>Este perfil não está disponível</h1><p>O chef pode ter pausado a página ou o endereço mudou.</p><a href="' + e(origem + '/#/buscar') + '">Conhecer outros chefs</a></main></body></html>';
  return new Response(html, { status: 404, headers: { ...CABECALHOS, 'cache-control': 'no-store' } });
}

// p: perfil do chef; id: id no banco; esteLink: endereço canônico da página; extra: { jsonld, cidades: [[slug, nome]] }.
export function vitrine(p, { origem, id, esteLink, extra = {} }) {
  const exemplo = p === EXEMPLO;
  const perfil = exemplo ? origem + '/#/buscar' : origem + '/#/chef/' + encodeURIComponent(id);
  const pedido = exemplo ? origem + '/#/buscar' : origem + '/#/pedido/' + encodeURIComponent(id);
  const galeria = (Array.isArray(p.gallery) ? p.gallery : []).map(g => ({ id: g?.id, url: fotoOk(g && g.url, origem), legenda: String((g && g.caption) || '').trim() })).filter(g => g.url);
  const avatar = fotoOk(p.avatar, origem);
  const capa = (galeria[0] && galeria[0].url) || avatar;
  const fone = C.phone(p.whatsapp);
  const zap = fone ? 'https://wa.me/' + fone + '?text=' + encodeURIComponent('Olá, ' + p.name + '! Vi sua página no Seu Chef em Casa e gostaria de conversar sobre um encontro.') : '';
  const linha = [p.specialty, p.cities].map(s => String(s || '').trim()).filter(Boolean).join(' · ');
  const titulo = p.name + ' · Personal chef';
  const desc = (linha ? linha + '. ' : '') + 'Veja fotos dos trabalhos, explore o cardápio e peça um orçamento.';

  const pratos = (Array.isArray(p.dishes) ? p.dishes : []).filter(d => d && d.name)
    .map((d, i) => ({ d, i, o: ORDEM.indexOf(d.category) < 0 ? 99 : ORDEM.indexOf(d.category) })).sort((a, b) => a.o - b.o || a.i - b.i).map(x => x.d);
  const mostra = pratos.slice(0, 8);
  const prato = d => '<article class="prato">' + (d.category ? '<small>' + e(d.category) + '</small>' : '') + '<h3>' + e(d.name) + '</h3>'
    + (d.desc ? '<p>' + e(d.desc) + '</p>' : '') + (Number(d.price) > 0 ? '<span>Referência: ' + e(dinheiro(d.price)) + ' por pessoa</span>' : '') + '</article>';
  const op = C.opcoes(p);
  const marcadas = C.OPCOES.filter(x => op[x[0]]);
  const trabalho = marcadas.filter(x => !x[0].startsWith('x_')).map(x => x[1]);
  const experiencias = marcadas.filter(x => x[0].startsWith('x_')).map(x => x[1].replace(/^Faço /, ''));
  if (p.marmita) experiencias.push('Marmitas da semana');
  const social = extra.social || {};
  const bio = String(p.bio || '').trim();
  const resumo = bio.length > 180 ? bio.slice(0, 177).replace(/\s+\S*$/, '') + '…' : bio;
  const iniciais = String(p.name).trim().split(/\s+/).slice(0, 2).map(n => n[0]).join('');
  const perfilPublico = '<div class="perfil"><div class="identidade">'
    + (avatar ? '<img class="retrato" src="' + e(avatar) + '" alt="" width="112" height="112">' : '<span class="retrato iniciais" aria-hidden="true">' + e(iniciais) + '</span>')
    + '<dl class="contadores"><div><dt>Publicações</dt><dd>' + galeria.length + '</dd></div>'
    + '<div><dt>Seguidores</dt><dd>' + e(social.seguidores ?? '—') + '</dd></div>'
    + '<div><dt>Seguindo</dt><dd>' + e(social.seguindo ?? '—') + '</dd></div></dl></div>'
    + '<div class="apresentacao"><h1>' + e(p.name) + '</h1>'
    + '<p class="especialidade">' + e(p.specialty || 'Personal chef') + '</p>'
    + (p.cities ? '<p class="cidade">' + e(p.cities) + '</p>' : '')
    + (bio ? '<p>' + e(resumo) + '</p>' : '')
    + (resumo !== bio ? '<details class="bio"><summary>Ler apresentação completa</summary>' + paragrafos(bio) + '</details>' : '')
    + '</div><div class="acoes"><a class="b b1" href="' + e(pedido) + '">Pedir orçamento</a>'
    + (pratos.length ? '<a class="b" href="#cardapio">Ver cardápio</a>' : '')
    + (!exemplo ? '<a class="b" href="' + e(perfil) + '">Acompanhar chef</a>' : '') + '</div></div>';

  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + e(titulo) + '</title><meta name="description" content="' + e(desc) + '"><meta name="theme-color" content="#455238">'
    + '<meta property="og:type" content="profile"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Seu Chef em Casa">'
    + '<meta property="og:title" content="' + e(titulo) + '"><meta property="og:description" content="' + e(desc) + '">'
    + '<meta property="og:image" content="' + e(capa || PADRAO.imagem) + '"><meta property="og:url" content="' + e(esteLink) + '">'
    + '<meta name="twitter:card" content="summary_large_image"><link rel="canonical" href="' + e(esteLink) + '">'
    + (exemplo || extra.noindex ? '<meta name="robots" content="noindex">' : '')
    + (extra.jsonld ? '<script type="application/ld+json">' + JSON.stringify(extra.jsonld).replace(/</g, '\\u003c') + '</script>' : '')
    + '<style>' + ESTILO + '</style><script defer src="/assets/perfil-publico.js"></script></head><body>'
    + '<header class="topo"><div class="l"><a class="marca" href="/">Seu Chef em Casa</a><a class="buscar" href="/#/buscar">Conhecer chefs</a></div></header>'
    + '<main class="l">' + perfilPublico
    + (exemplo ? '<p class="nota">Perfil fictício, com fotos ilustrativas.</p>' : '')
    + '<nav class="secoes" aria-label="Neste perfil"><a href="#publicacoes">Publicações</a>'
    + (pratos.length ? '<a href="#cardapio">Cardápio</a>' : '') + '<a href="#contato">Contato</a></nav>'
    + '<section id="publicacoes" aria-label="Publicações">'
    + (galeria.length ? '<div class="fotos">' + galeria.map((g, i) => {
      const alt = g.legenda || 'Trabalho de ' + p.name + ', foto ' + (i + 1);
      const interagir = g.id == null ? perfil : perfil + '/foto/' + encodeURIComponent(g.id);
      return '<a href="' + e(g.url) + '" data-publicacao data-legenda="' + e(g.legenda)
        + '" data-interagir="' + e(interagir) + '"><img src="'
        + e(g.url) + '" alt="' + e(alt) + '" width="300" height="300"' + (i >= 3 ? ' loading="lazy"' : '') + ' decoding="async"></a>';
    }).join('') + '</div>' : '<p class="nota">O chef está preparando seu portfólio.</p>') + '</section>'
    + (galeria.length ? '<dialog id="foto-publica" aria-labelledby="foto-titulo"><div class="foto-topo"><h2 id="foto-titulo">Da minha cozinha</h2><button class="b" data-fechar autofocus>Fechar</button></div>'
      + '<img alt=""><p id="foto-legenda"></p><div class="foto-nav"><button class="b" data-anterior>Anterior</button>'
      + '<output aria-live="polite"></output><button class="b" data-proxima>Próxima</button></div>'
      + (!exemplo ? '<div class="acoes"><a class="b" data-interagir href="' + e(perfil) + '">Curtir ou comentar</a></div>' : '') + '</dialog>' : '')
    + (mostra.length ? '<section id="cardapio"><h2>Meu cardápio</h2><div class="pratos">' + mostra.map(prato).join('') + '</div>'
      + (pratos.length > mostra.length ? '<details class="mais"><summary>Ver mais pratos</summary><div class="pratos">'
        + pratos.slice(mostra.length, 60).map(prato).join('') + '</div></details>' : '')
      + '<p class="nota">Os valores são uma referência por pessoa. Confirme o preço no orçamento.</p></section>' : '')
    + (trabalho.length || experiencias.length ? '<section><h2>Como eu atendo</h2>'
      + (trabalho.length ? '<ul class="lista">' + trabalho.map(t => '<li>' + e(t) + '</li>').join('') + '</ul>' : '')
      + (experiencias.length ? '<div class="exp">' + experiencias.map(t => '<span>' + e(t) + '</span>').join('') + '</div>' : '') + '</section>' : '')
    + '<section class="final" id="contato"><h2>Vamos conversar sobre seu encontro?</h2><div class="acoes">'
    + '<a class="b b1" href="' + e(pedido) + '">Pedir orçamento</a>'
    + (zap && !exemplo ? '<a class="b" href="' + e(zap) + '" target="_blank" rel="noopener">Conversar no WhatsApp</a>' : '')
    + '</div></section></main>'
    + '<footer><div class="l"><p>' + e(p.name) + ' no <a href="/">Seu Chef em Casa</a>.</p>'
    + ((extra.cidades || []).length ? '<p>Mais chefs em ' + extra.cidades.map(([s, n]) => '<a href="' + e(origem + '/personal-chef/' + s) + '">' + e(n) + '</a>').join(', ') + '.</p>' : '')
    + '<p>Contratação, pagamento e serviço são combinados direto com o chef. <a href="/#/termos">Termos de uso</a></p></div></footer>'
    + '</body></html>';
  return new Response(html, { headers: CABECALHOS });
}
