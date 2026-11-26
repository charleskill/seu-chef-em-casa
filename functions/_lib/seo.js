// SEO: dados e páginas montadas no servidor para o Google (perfis, cidades, serviços e sitemap).
// O app continua por cima, em /#/...; estas páginas só mostram e levam para ele.
// Regras: só chefs publicados, não escondidos, completos (foto, prato, cidade, WhatsApp) e reais
// (perfis de apresentação, com e-mail @apresentacao.invalid, nunca entram). Página sem chef real fica com noindex.
import { C, e, fotoOk, SERIFA } from './vitrine.js';

export const SITE = 'https://seuchefemcasa.com.br';
// Prévias (*.pages.dev) e testes locais não devem ir para o Google.
export const producao = url => /^(www\.)?seuchefemcasa\.com\.br$/.test(new URL(url).hostname);

const SQL = "SELECT id, perfil, atualizado_em FROM chefs WHERE publicado = 1 AND COALESCE(oculto, 0) = 0"
  + " AND COALESCE(json_extract(perfil, '$.tipo'), 'chef') <> 'cliente' AND COALESCE(email, '') NOT LIKE '%@apresentacao.invalid'";

const montar = rows => (rows || []).map(r => {
  let p = null;
  try { p = JSON.parse(r.perfil || '{}'); } catch (err) { p = null; }
  if (!p || !String(p.name || '').trim() || C.faltaPerfil(p).length) return null;
  return { id: r.id, p, slug: C.slugChef(p.name, r.id), atualizado: r.atualizado_em || '' };
}).filter(x => x && x.slug);

export async function chefsVisiveis(env) {
  if (!env.DB) return [];
  try { return montar((await env.DB.prepare(SQL + ' ORDER BY atualizado_em DESC LIMIT 2000').all()).results); } catch (err) { return []; }
}

export async function chefPorId(env, id) {
  if (!env.DB || !/^chef-[a-f\d]{16}$/.test(id)) return null;
  try { return montar([await env.DB.prepare(SQL + ' AND id = ?').bind(id).first()].filter(Boolean))[0] || null; } catch (err) { return null; }
}

// Acha pelo fim do endereço (6 primeiros hex do id). Se houver dois com o mesmo começo, vale o que bate o endereço inteiro.
export async function chefPorSlug(env, slug) {
  const h = C.idDoSlug(slug);
  if (!env.DB || !h) return null;
  try {
    const lista = montar((await env.DB.prepare(SQL + ' AND id LIKE ?').bind('chef-' + h + '%').all()).results);
    return lista.find(x => x.slug === slug) || lista[0] || null;
  } catch (err) { return null; }
}

// Cidades com página própria. Só aparecem no sitemap quando têm ao menos um chef.
export const CIDADES = [
  ['florianopolis', 'Florianópolis'], ['sao-jose', 'São José'], ['palhoca', 'Palhoça'], ['biguacu', 'Biguaçu'],
  ['santo-amaro-da-imperatriz', 'Santo Amaro da Imperatriz'], ['governador-celso-ramos', 'Governador Celso Ramos'],
  ['garopaba', 'Garopaba'], ['balneario-camboriu', 'Balneário Camboriú'], ['itajai', 'Itajaí'], ['itapema', 'Itapema'],
  ['bombinhas', 'Bombinhas'], ['porto-belo', 'Porto Belo'], ['brusque', 'Brusque'], ['blumenau', 'Blumenau'],
  ['joinville', 'Joinville'], ['jaragua-do-sul', 'Jaraguá do Sul'], ['sao-francisco-do-sul', 'São Francisco do Sul'],
  ['criciuma', 'Criciúma'], ['tubarao', 'Tubarão'], ['lages', 'Lages'], ['chapeco', 'Chapecó']
];
const cidadesDe = p => String(p.cities || '').split(/[,;/\n]|\s+e\s+/).map(s => C.slug(s).replace(/-sc$/, '')).filter(Boolean);
export const atende = (p, cidade) => cidadesDe(p).includes(cidade);
export const cidadesDoChef = p => CIDADES.filter(([s]) => atende(p, s));

// Serviços: as experiências que o chef marca no perfil (aba Serviços do app) e as marmitas.
const PROPRIOS = {
  x_lanche: ['Noite do Lanche', 'Hambúrgueres e lanches montados na hora, na sua cozinha.'],
  x_pizza: ['Noite da Pizza', 'Massa aberta na hora e pizzas saindo uma atrás da outra para a turma.'],
  x_lounge: ['Lounge de petiscos e drinks', 'Petiscos e drinks para receber os convidados em pé, sem mesa posta.'],
  x_tematico: ['Cardápio temático', 'Escolha um tema, como um filme ou uma viagem, e combine os pratos com o chef.'],
  x_boteco: ['Noite do Boteco', 'Bolinhos, porções e tira-gostos de bar servidos em casa.'],
  x_churrasco: ['Churrasco em casa', 'O chef cuida da brasa e dos cortes enquanto você recebe.'],
  x_mar: ['Sequência de frutos do mar', 'Camarão, peixe e frutos do mar servidos em etapas.'],
  x_tainha: ['Noite da Tainha', 'Tainha escalada, recheada ou na brasa, do jeito do litoral catarinense.'],
  x_fondue: ['Noite do Fondue', 'Fondue de queijo e de chocolate para as noites frias.'],
  x_aula: ['Aula de cozinha em casa', 'O chef ensina as receitas na sua cozinha, com você de avental.']
};
export const SERVICOS = [
  ...Object.entries(PROPRIOS).map(([k, [nome, desc]]) => ({ k, nome, desc })),
  ...C.EXPERIENCIAS.map(([nome, desc, k]) => ({ k, nome, desc })),
  { k: 'marmita', nome: 'Marmitas da semana', desc: 'Refeições da semana preparadas pelo chef e porcionadas para a sua geladeira.' }
].map(s => ({ ...s, slug: C.slug(s.nome) }));
export const fazServico = (p, s) => s.k === 'marmita' ? !!p.marmita : !!C.opcoes(p)[s.k];

// ---------- Páginas de lista (cidade e serviço) ----------
const ESTILO = [
  '*{box-sizing:border-box}body{margin:0;background:#f6f3eb;color:#303629;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}',
  'a{color:inherit}img{display:block;max-width:100%}.l{max-width:1040px;margin:0 auto;padding:0 22px}',
  'h1,h2,h3{font-family:' + SERIFA + ';font-weight:400;margin:0;text-wrap:balance}',
  '.topo{background:#455238;color:#f3eee4}.topo .l{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:64px}',
  '.topo a{text-decoration:none}.topo b{font-family:' + SERIFA + ';font-weight:400;font-size:1.08rem;letter-spacing:.04em}.topo nav a{font-size:.8rem;letter-spacing:.16em;text-transform:uppercase;padding:12px 2px;border-bottom:1px solid rgba(243,238,228,.6)}',
  '.trilha{font-size:.85rem;color:#6a756c;padding-top:22px}.trilha a{color:#455238}',
  '.abre{padding:26px 0 40px}.olho{font-size:.72rem;letter-spacing:.28em;text-transform:uppercase;color:#754653;margin:0 0 12px}',
  'h1{font-size:clamp(2.1rem,7vw,3.4rem);line-height:1.08;margin-bottom:16px}.abre p{max-width:40em;margin:0 0 12px;color:#4b5648}',
  'section{padding:44px 0;border-top:1px solid rgba(28,37,32,.14)}h2{font-size:clamp(1.6rem,4.5vw,2.1rem);line-height:1.15;margin-bottom:22px}',
  '.chefs{list-style:none;margin:0;padding:0;display:grid;gap:14px}',
  '.chef a{display:grid;grid-template-columns:72px 1fr;gap:16px;align-items:center;padding:14px;border-radius:10px;background:#fff;text-decoration:none;box-shadow:0 1px 2px rgba(38,52,44,.08),0 6px 18px rgba(38,52,44,.06);transition:box-shadow .2s}',
  '.chef a:hover{box-shadow:0 1px 2px rgba(38,52,44,.1),0 10px 26px rgba(38,52,44,.12)}.chef img,.chef .sem{width:72px;height:72px;border-radius:50%;object-fit:cover;background:#e4dfd2}',
  '.chef h3{font-size:1.2rem;line-height:1.25}.chef p{margin:2px 0 0;font-size:.92rem;color:#56635a}.chef span{display:inline-block;margin-top:6px;font-size:.85rem;font-weight:600;color:#754653}',
  '.vazio{background:#fff;border-radius:10px;padding:26px 22px;box-shadow:0 1px 2px rgba(38,52,44,.08)}.vazio p{margin:0 0 18px;max-width:38em}',
  '.acoes{display:flex;flex-wrap:wrap;gap:12px}.b{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 24px;border-radius:999px;font-weight:600;text-decoration:none;border:1px solid #455238}',
  '.b1{background:#754653;border-color:#754653;color:#fff}.b2{color:#455238}.b:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #c9a46a;outline-offset:3px}',
  'details{border-bottom:1px solid rgba(28,37,32,.16)}summary{cursor:pointer;padding:16px 0;font-family:' + SERIFA + ';font-size:1.15rem;min-height:48px}details p{margin:0 0 18px;color:#4b5648;max-width:42em}',
  '.links{display:flex;flex-wrap:wrap;gap:8px}.links a{border:1px solid rgba(28,37,32,.3);border-radius:999px;padding:8px 16px;font-size:.92rem;text-decoration:none}.links a:hover{border-color:#455238;background:#fff}',
  'footer{background:#354229;color:#9aa39b;font-size:.84rem;padding:28px 0;text-align:center}footer p{margin:0 0 6px}footer a{color:#c9c3b6}',
  '@media (min-width:760px){.chefs{grid-template-columns:1fr 1fr}}',
  '@media (prefers-reduced-motion:reduce){.chef a{transition:none}}'
].join('');

const CABECALHOS = {
  'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300',
  'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY', 'referrer-policy': 'strict-origin-when-cross-origin',
  'content-security-policy': "default-src 'none'; img-src 'self' data: https://images.unsplash.com; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
};
const ld = o => '<script type="application/ld+json">' + JSON.stringify(o).replace(/</g, '\\u003c') + '</script>';

export const PERGUNTAS = lugar => [
  ['Como contrato um personal chef' + (lugar ? ' em ' + lugar : '') + '?', 'Escolha um chef e monte o pedido com a data, o número de pessoas e os pratos. Envie a mensagem pelo WhatsApp para combinar os detalhes com ele.'],
  ['Quanto custa um personal chef' + (lugar ? ' em ' + lugar : '') + '?', 'Cada chef define seus preços. Os valores do cardápio são referências por pessoa. O total depende do número de convidados, dos ingredientes e dos serviços que vocês combinarem.'],
  ['O chef faz as compras e limpa a cozinha?', 'Depende do chef. O perfil de cada um mostra se ele faz as compras dos ingredientes, leva os próprios utensílios e entrega a cozinha limpa no fim.'],
  ['Pago pelo site?', 'Não. O Seu Chef em Casa é uma vitrine: contratação, pagamento e serviço são combinados direto com o chef.']
];

// Monta uma página de lista. o: { url (endereço canônico), titulo, desc, olho, h1, intro: [], chefs, vazio, perguntas, trilha: [[nome, url]], blocos: [[titulo, html]], noindex }
export function lista(o, origem) {
  const cartoes = o.chefs.map(c => {
    const foto = fotoOk(c.p.avatar, origem) || fotoOk(((c.p.gallery || [])[0] || {}).url, origem);
    return '<li class="chef"><a href="/chef/' + e(c.slug) + '">' + (foto ? '<img src="' + e(foto) + '" alt="" width="72" height="72" loading="lazy">' : '<span class="sem"></span>')
      + '<div><h3>' + e(c.p.name) + '</h3><p>' + e([c.p.specialty, c.p.cities].map(s => String(s || '').trim()).filter(Boolean).join(' · ')) + '</p><span>Ver cardápio</span></div></a></li>';
  }).join('');
  const trilha = [['Início', '/'], ...(o.trilha || [])];
  const grafo = [
    { '@type': 'BreadcrumbList', itemListElement: trilha.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE + u })) },
    ...(o.perguntas ? [{ '@type': 'FAQPage', mainEntity: o.perguntas.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }] : []),
    ...(o.chefs.length ? [{ '@type': 'ItemList', itemListElement: o.chefs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: SITE + '/chef/' + c.slug, name: c.p.name })) }] : [])
  ];
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + e(o.titulo) + '</title><meta name="description" content="' + e(o.desc) + '"><meta name="theme-color" content="#455238">'
    + (o.noindex ? '<meta name="robots" content="noindex,follow">' : '') + '<link rel="canonical" href="' + e(SITE + o.url) + '">'
    + '<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Seu Chef em Casa">'
    + '<meta property="og:title" content="' + e(o.titulo) + '"><meta property="og:description" content="' + e(o.desc) + '"><meta property="og:url" content="' + e(SITE + o.url) + '">'
    + ld({ '@context': 'https://schema.org', '@graph': grafo }) + '<style>' + ESTILO + '</style></head><body>'
    + '<header class="topo"><div class="l"><a href="/"><b>Seu Chef em Casa</b></a><nav><a href="/#/buscar">Buscar chefs</a></nav></div></header>'
    + '<main><div class="l"><p class="trilha">' + trilha.map(([n, u], i) => i === trilha.length - 1 ? e(n) : '<a href="' + e(u) + '">' + e(n) + '</a>').join(' / ') + '</p>'
    + '<div class="abre"><p class="olho">' + e(o.olho) + '</p><h1>' + e(o.h1) + '</h1>' + o.intro.map(t => '<p>' + e(t) + '</p>').join('') + '</div></div>'
    + '<section><div class="l">' + (o.chefs.length ? '<h2>' + e(o.tituloChefs) + '</h2><ul class="chefs">' + cartoes + '</ul>'
      : '<div class="vazio"><h2>' + e(o.vazio[0]) + '</h2><p>' + e(o.vazio[1]) + '</p><div class="acoes"><a class="b b1" href="/#/entrar">Sou chef e quero aparecer aqui</a><a class="b b2" href="/#/buscar">Ver todos os chefs</a></div></div>')
    + '</div></section>'
    + (o.perguntas ? '<section><div class="l"><h2>Perguntas frequentes</h2>' + o.perguntas.map(([q, a]) => '<details><summary>' + e(q) + '</summary><p>' + e(a) + '</p></details>').join('') + '</div></section>' : '')
    + (o.blocos || []).map(([t, h]) => '<section><div class="l"><h2>' + e(t) + '</h2>' + h + '</div></section>').join('')
    + '</main><footer><div class="l"><p><a href="/">Seu Chef em Casa</a> · personal chefs em Santa Catarina</p>'
    + '<p>A plataforma é uma vitrine: contratação, pagamento e serviço são combinados direto com o chef. <a href="/#/termos">Termos de uso</a></p></div></footer></body></html>';
  return new Response(html, { status: o.status || 200, headers: CABECALHOS });
}

export const links = itens => '<nav class="links">' + itens.map(([n, u]) => '<a href="' + e(u) + '">' + e(n) + '</a>').join('') + '</nav>';

export function naoAchou() {
  return lista({ url: '/', titulo: 'Página não encontrada · Seu Chef em Casa', desc: 'Esta página não existe.', olho: 'Erro 404', h1: 'Não encontramos esta página.',
    intro: ['Use a busca para encontrar um chef.'], chefs: [], vazio: ['Encontre um chef', 'Busque um chef ou entre para criar seu perfil.'], noindex: true, status: 404 }, '');
}
