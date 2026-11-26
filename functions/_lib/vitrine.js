// Vitrine do chef, montada no servidor. Usada em /chef/<slug> (endereço para o Google) e em /c/exemplo.
// Antes ficava em functions/c/[id].js; /c/<id> agora redireciona (301) para /chef/<slug>.
// Perfil compartilhável com apresentação, publicações e cardápio no HTML inicial.
// A prévia do WhatsApp vem dos metadados. O visualizador de fotos aprimora os links da galeria.
// Só aparece para perfil publicado, não escondido pela equipe e pronto (foto, prato e cidade), como na busca.
import Core from '../../assets/app-core.js';
import DishPhotos from '../../assets/dish-photos.js';

export const C = Core && Core.normalizeData ? Core : globalThis.ChefCore;
export const PADRAO = {
  titulo: 'Seu Chef em Casa · Boa comida, boas histórias',
  desc: 'Encontre personal chefs, veja seus cardápios e peça um orçamento.',
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
  'content-security-policy': "default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self' data: https://images.unsplash.com; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
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
  '.conversa{border-top:1px solid #dfd9cc;margin-top:12px;padding-top:12px}.conversa h3{font-size:1.3rem;margin-top:10px}.conversa [aria-pressed=true]{color:#754653;border-color:#754653}.conversa ol{list-style:none;padding:0;margin:4px 0 12px;max-height:12rem;overflow:auto}.conversa li{padding:6px 0;overflow-wrap:anywhere}.conversa li+li{border-top:1px solid #dfd9cc}.conversa li p{margin:0}.conversa form{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.conversa textarea{flex:1 1 200px;min-width:0;min-height:44px;padding:8px;border:1px solid #827e70;border-radius:8px;background:#fffdf8;color:inherit;font:inherit;resize:vertical}.conversa button.b1{background:#754653}.conversa [role=status]{font-size:.87rem;margin:6px 0}',
  '#foto-publica{width:min(100% - 24px,960px);padding:0;border-radius:16px}.foto-topo{padding:8px 16px;border-bottom:1px solid #dfd9cc}.foto-topo h2{font-size:1.2rem}.foto-topo .b{border-color:transparent}.foto-corpo{display:grid}.foto-midia{min-width:0;background:#ebe7dc}.foto-midia img{max-height:42dvh;background:transparent}.foto-nav{padding:2px 12px;background:#f1eee4}.foto-nav .b{border-color:transparent}.foto-nav output{color:#455238;font-size:.82rem;font-variant-numeric:tabular-nums}',
  '.conversa{display:flex;flex-direction:column;min-width:0;margin:0;padding:12px 16px;border-top:0;background:#fffdf8}.conversa #foto-legenda{margin:0 0 8px;max-height:7rem;overflow:auto}.conversa h3{margin:0;font-size:1.18rem}.conversa-cabecalho{display:flex;justify-content:space-between;align-items:center;gap:8px}.conversa [data-curtir]{border-color:transparent;background:#f2ede3}.conversa [data-curtir][aria-pressed=true]{background:#f3e5e9}.conversa ol{margin:6px 0;max-height:clamp(5rem,25dvh,15rem)}.conversa li{font-size:.91rem}.conversa [data-social-status]:empty{display:none}.conversa form{flex-wrap:nowrap;align-items:flex-end;margin-top:auto;padding-top:8px}.conversa textarea{flex:1 1 auto;max-height:9rem;font-size:.9rem}.conversa .nota{font-size:.75rem;margin-top:6px}.conversa .foto-compartilhar{border-top:1px solid #e9e3d7;margin-top:9px;gap:4px 10px}.foto-compartilhar .b{padding:5px 2px;border-color:transparent;color:#455238;font-size:.79rem;text-decoration:underline;text-underline-offset:3px}.conversa [data-link-manual]{width:100%;min-height:38px}',
  '@media(min-width:760px){.foto-corpo{grid-template-columns:minmax(0,1.55fr) minmax(0,1fr)}.foto-midia{display:flex;flex-direction:column;justify-content:space-between}.foto-midia img{height:clamp(220px,56dvh,530px);max-height:none}.conversa{border-left:1px solid #dfd9cc;padding:16px}.foto-topo{padding-inline:20px}}',
  '#foto-publica{--foto-marfim:#faf5ea;--foto-papel:#fffaf1;--foto-linho:#ede4d5;--foto-oliva:#3c4a32;--foto-vinho:#713c4b;--foto-linha:#ded3c1;background:var(--foto-marfim);color:#303629}#foto-publica::backdrop{background:#242a20bf}',
  '#foto-publica .foto-topo,#foto-publica .conversa,#foto-publica .foto-compartilhar,#foto-publica .conversa li+li{border-color:var(--foto-linha)}#foto-publica .foto-midia{background:var(--foto-linho)}#foto-publica .foto-nav{background:#f4eddf}#foto-publica .conversa,#foto-publica textarea{background:var(--foto-papel)}#foto-publica textarea{border-color:#8a8273}',
  '#foto-publica .b:not(.b1),#foto-publica .foto-nav output,#foto-publica .nota{color:var(--foto-oliva)}#foto-publica [data-curtir]{background:#ececde}#foto-publica [data-curtir][aria-pressed=true]{background:#f2e1e7;border-color:var(--foto-vinho);color:var(--foto-vinho)}#foto-publica .b1{background:var(--foto-vinho);border-color:var(--foto-vinho)}#foto-publica .b1:hover{background:#5d303d}#foto-publica :focus-visible{outline-color:var(--foto-vinho)}',
  '.pular{position:absolute;top:8px;left:8px;z-index:2;padding:8px 12px;background:#fffdf8;color:#455238;transform:translateY(-150%)}.pular:focus{transform:none}#foto-publica,.conversa ol{overscroll-behavior:contain}',
  '.contatos-chef{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.contatos-chef a{display:inline-grid;place-items:center;width:44px;height:44px;border:1px solid #b9b19f;border-radius:50%;color:#455238}.contatos-chef a:hover{background:#eee6d7;color:#754653}',
  '@media(min-width:670px){.perfil{padding-top:30px}.fotos{gap:8px}.pratos{grid-template-columns:1fr 1fr}}'
  ,'.prato-foto{float:left;width:94px;margin:0 12px 5px 0}.prato-foto img{width:94px;height:82px;object-fit:cover;border-radius:6px}.prato-foto figcaption{font-size:.68rem;color:#455238}.credito-prato{display:none}.foto-prato-ampliada figure{margin:0}.foto-prato-ampliada header{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px}.foto-prato-ampliada header h2{font-size:1.35rem}.foto-prato-ampliada figcaption{margin-top:8px;color:#455238;font-size:.85rem}.prato{display:flow-root}'
].join('');

const ESTILO_PORTFOLIO = [
  '@page{size:A4;margin:14mm}',
  '.portfolio{width:min(100% - 32px,850px);margin:24px auto 46px;color:#303629}.portfolio p{overflow-wrap:anywhere}.portfolio a{overflow-wrap:anywhere}',
  '.portfolio-ferramentas{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:0 0 18px;margin-bottom:16px;border-bottom:1px solid #ded3c1}.portfolio-ferramentas .acoes{margin:0;gap:8px}.portfolio-ferramentas p{margin:0;color:#455238;font-size:.82rem}.portfolio-ferramentas button{cursor:pointer}',
  '.portfolio-capa{display:grid;grid-template-columns:minmax(0,1fr);background:#eee6d7;border-radius:14px;overflow:hidden}.portfolio-abertura{padding:clamp(24px,5vw,48px);align-self:center}.portfolio-abertura .marca{margin:0 0 16px;color:#455238;font-size:.96rem}.portfolio-abertura h1{font-size:clamp(2.35rem,7vw,4rem);line-height:.98;margin-bottom:14px}.portfolio-abertura p{margin:4px 0}.portfolio-abertura .cidade{font-size:.9rem}.portfolio-abertura .retrato{width:52px;margin-bottom:12px}.portfolio-destaque{margin:0;position:relative;min-width:0}.portfolio-destaque figcaption{position:absolute;bottom:0;right:0;left:0;margin:0;padding:5px 9px;background:#303629e8;color:white}.portfolio-capa-foto{width:100%;height:clamp(185px,36vw,335px);object-fit:cover}',
  '.portfolio .portfolio-secao{margin:30px 0 0;padding:0;border:0}.portfolio .portfolio-secao h2{margin:0 0 14px;line-height:1.1;color:#455238}.portfolio-apresentacao{border-left:3px solid #9d6877!important;padding-left:16px!important}.portfolio-apresentacao p{max-width:58ch;margin:0 0 8px;line-height:1.55}.portfolio .nota{color:#455238;font-size:.8rem}',
  '.portfolio .fotos{gap:8px}.portfolio .fotos figure{margin:0;break-inside:avoid;min-width:0}.portfolio .fotos img{aspect-ratio:4/3;height:auto;border-radius:6px}.portfolio figcaption{font-size:.73rem;margin-top:3px;overflow-wrap:anywhere}',
  '.portfolio-categoria{margin:18px 0 0;padding:0 0 4px;border-bottom:1px solid #ded3c1;color:#754653;break-after:avoid}.portfolio .prato{break-inside:avoid;padding:9px 0}.portfolio .prato h3{font-size:1.13rem}.portfolio .prato p{font-size:.88rem}.portfolio .prato > small{display:none}.portfolio .prato span{font-size:.83rem}',
  '.portfolio .contato{break-inside:avoid;background:#455238;color:#fffaf1;border-radius:10px;padding:20px}.portfolio .contato h2{color:inherit}.portfolio .contato p{margin:7px 0 0}',
  '@media(max-width:520px){.portfolio-ferramentas{display:block}.portfolio-ferramentas p{margin-top:10px}.portfolio .fotos{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}}',
  '@media(min-width:620px){.portfolio-capa.com-foto{grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr)}.portfolio-capa-foto{height:100%;min-height:290px}}',
  '@media print{body{background:white;font-size:10pt;-webkit-print-color-adjust:exact;print-color-adjust:exact}.portfolio{width:auto;margin:0}.portfolio .sem-impressao{display:none}.portfolio-capa{break-inside:avoid}.portfolio-capa.com-foto{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.portfolio-abertura{padding:8mm}.portfolio-abertura h1{font-size:29pt}.portfolio-abertura .marca{margin-bottom:4mm}.portfolio-capa-foto{height:56mm;min-height:0}.portfolio .portfolio-secao{margin-top:6mm}.portfolio .portfolio-secao h2{font-size:19pt;margin-bottom:3mm;break-after:avoid}.portfolio .fotos{gap:2mm}.portfolio .fotos img{height:28mm}.portfolio .pratos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:7mm}.portfolio-cardapio{break-before:page}.portfolio .prato-foto{width:28mm;margin-right:3mm}.portfolio .prato-foto img{height:19mm;width:28mm}.portfolio .prato-foto figcaption{display:block;font-size:7pt}.portfolio-categoria{margin-top:4mm}}'
].join('');

function fotoParaImpressao(src, largura) {
  const url = new URL(src);
  if (url.hostname !== 'images.unsplash.com') return src;
  url.searchParams.delete('auto');
  url.searchParams.set('w', String(largura));
  url.searchParams.set('fm', 'jpg');
  url.searchParams.set('q', '75');
  return url.href;
}

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
    { category: 'Pratos Principais', name: 'Risoto de funghi', desc: 'Arroz arbóreo, cogumelos frescos e secos, finalizado com parmesão.', price: 84, photoPreset: 'risoto-funghi' },
    { category: 'Pratos Principais', name: 'Ossobuco à milanesa', desc: 'Cozido lentamente em vinho branco, servido com risoto de açafrão.', price: 96 },
    { category: 'Sobremesas', name: 'Tiramisù', desc: 'A receita clássica, montada no dia.', price: 28, photoPreset: 'tiramisu' },
    { category: 'Sobremesas', name: 'Panna cotta com frutas vermelhas', desc: 'Leve, com calda feita em casa.', price: 26, photoPreset: 'panna-cotta' }
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
  const idFoto = (g, i) => String(g.id ?? 'foto-' + (i + 1));
  const fotoSelecionada = galeria.find((g, i) => idFoto(g, i) === extra.foto);
  const linkFoto = (g, i, base) => base + '?foto=' + encodeURIComponent(idFoto(g, i));
  const linkPerfil = origem + new URL(esteLink).pathname;
  const fone = C.phone(p.whatsapp);
  const contatos = exemplo ? C.CONTATOS.map(([chave, nome]) => ({ chave, nome, href: 'https://google.com/' })) : C.linksContato(p);
  const zap = !exemplo && fone && contatos.some(({ chave }) => chave === 'whatsapp') ? 'https://wa.me/' + fone + '?text=' + encodeURIComponent('Olá, ' + p.name + '! Vi sua página no Seu Chef em Casa e gostaria de conversar sobre um encontro.') : '';
  const iconesContato = contatos.length ? '<nav class="contatos-chef" aria-label="Contatos do chef">'
    + contatos.map(({ chave, nome, href }) => '<a href="' + e(chave === 'whatsapp' && zap ? zap : href) + '" title="' + e(nome) + '" aria-label="' + e(nome) + '"'
      + (href.startsWith('https:') ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + C.iconeContato(chave) + '</a>').join('') + '</nav>' : '';
  const linha = [p.specialty, p.cities].map(s => String(s || '').trim()).filter(Boolean).join(' · ');
  const titulo = p.name + ' · Personal chef';
  const desc = (linha ? linha + '. ' : '') + 'Veja os trabalhos e o cardápio do chef. Peça um orçamento para seu encontro.';

  const pratos = (Array.isArray(p.dishes) ? p.dishes : []).filter(d => d && d.name)
    .map((d, i) => ({ d, i, o: ORDEM.indexOf(d.category) < 0 ? 99 : ORDEM.indexOf(d.category) })).sort((a, b) => a.o - b.o || a.i - b.i).map(x => x.d);
  const mostra = pratos.slice(0, 8);
  const fotoDoPrato = d => {
    const preset = Object.hasOwn(DishPhotos, d.photoPreset) ? DishPhotos[d.photoPreset] : null;
    const url = preset ? origem + preset.url : fotoOk(d.photo, origem);
    if (!url) return '';
    return '<figure class="prato-foto"><a data-ampliar-prato href="' + e(url) + '"><img src="' + e(url) + '" alt="' + e(d.name) + '"' + (extra.portfolio ? '' : ' loading="lazy"') + '></a>'
      + (preset ? '<figcaption class="credito-prato">Ilustrativa · <a href="' + e(preset.source) + '">' + e(preset.author) + '</a> · <a href="' + e(preset.license) + '">' + e(preset.version) + '</a> · redimensionada</figcaption>' : '') + '</figure>';
  };
  const prato = d => '<article class="prato">' + fotoDoPrato(d) + (d.category ? '<small>' + e(d.category) + '</small>' : '') + '<h3>' + e(d.name) + '</h3>'
    + (d.desc ? '<p>' + e(d.desc) + '</p>' : '') + (Number(d.price) > 0 ? '<span>Referência: ' + e(dinheiro(d.price)) + ' por pessoa</span>' : '') + '</article>';
  if (extra.portfolio) {
    const categorias = new Map();
    for (const d of pratos) {
      const categoria = d.category || 'Outros pratos';
      if (!categorias.has(categoria)) categorias.set(categoria, []);
      categorias.get(categoria).push(d);
    }
    const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
      + '<title>Portfólio de ' + e(p.name) + ' · Seu Chef em Casa</title><meta name="robots" content="noindex">'
      + '<link rel="canonical" href="' + e(esteLink) + '"><style>' + ESTILO + ESTILO_PORTFOLIO + '</style><script defer src="/assets/perfil-publico.js?v=6"></script></head><body>'
      + '<main class="portfolio"><div class="sem-impressao portfolio-ferramentas"><div class="acoes"><a class="b" href="' + e(linkPerfil) + '">Voltar ao perfil</a>'
      + '<button class="b b1" data-imprimir>Salvar como PDF</button></div><p>Na janela de impressão, escolha Salvar como PDF.</p></div>'
      + '<header class="portfolio-capa' + (galeria.length ? ' com-foto' : '') + '"><div class="portfolio-abertura">'
      + '<p class="marca">Seu Chef em Casa</p>'
      + (avatar ? '<img class="retrato" src="' + e(avatar) + '" alt="">' : '')
      + '<h1>' + e(p.name) + '</h1><p class="especialidade">' + e(p.specialty || 'Personal chef') + '</p>'
      + (p.cities ? '<p class="cidade">' + e(p.cities) + '</p>' : '') + '</div>'
      + (galeria.length ? '<figure class="portfolio-destaque"><img class="portfolio-capa-foto" src="' + e(fotoParaImpressao(galeria[0].url, 900)) + '" alt="' + e(galeria[0].legenda || 'Trabalho em destaque de ' + p.name) + '">'
        + (galeria[0].legenda ? '<figcaption>' + e(galeria[0].legenda) + '</figcaption>' : '') + '</figure>' : '')
      + '</header>' + (exemplo ? '<p class="nota">Perfil fictício, com fotos ilustrativas.</p>' : '')
      + (p.bio ? '<section class="portfolio-secao portfolio-apresentacao"><h2>Minha cozinha</h2>' + paragrafos(p.bio) + '</section>' : '')
      + (galeria.length > 1 ? '<section class="portfolio-secao"><h2>Trabalhos selecionados</h2><div class="fotos">'
        + galeria.slice(1, 9).map(g => '<figure><img src="' + e(fotoParaImpressao(g.url, 600)) + '" alt="' + e(g.legenda || 'Trabalho de ' + p.name)
          + '" width="300" height="300">' + (g.legenda ? '<figcaption>' + e(g.legenda) + '</figcaption>' : '') + '</figure>').join('')
        + '</div></section>' : '')
      + (pratos.length ? '<section class="portfolio-secao portfolio-cardapio"><h2>Cardápio</h2><p class="nota">Os preços são por pessoa. Combine o valor final com o chef.</p>'
        + [...categorias].map(([nome, itens]) => '<h3 class="portfolio-categoria">' + e(nome) + '</h3><div class="pratos">'
        + itens.map(prato).join('') + '</div>').join('') + '</section>' : '')
      + '<section class="portfolio-secao contato"><h2>Contato e orçamento</h2><p><a href="' + e(linkPerfil) + '">Ver perfil completo</a></p>'
      + (zap && !exemplo ? '<p><a href="' + e(zap) + '">WhatsApp · ' + e(p.whatsapp) + '</a></p>' : '')
      + (!exemplo ? contatos.filter(({ chave }) => chave !== 'whatsapp').map(({ chave, nome, href }) => '<p><a href="' + e(href) + '">' + e(nome)
        + (chave === 'phone' || chave === 'contactEmail' ? ' · ' + e(p[chave]) : '') + '</a></p>').join('') : '')
      + '</section></main></body></html>';
    return new Response(html, { headers: CABECALHOS });
  }
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
    + (resumo !== bio ? '<details class="bio"><summary>Ler mais sobre o chef</summary>' + paragrafos(bio) + '</details>' : '')
    + '</div><div class="acoes"><a class="b b1" href="' + e(pedido) + '">Pedir orçamento</a>'
    + (pratos.length ? '<a class="b" href="#cardapio">Ver cardápio</a>' : '')
    + '<a class="b" href="' + e(linkPerfil + '?portfolio=pdf') + '">Portfólio em PDF</a>'
    + (!exemplo ? '<a class="b" href="' + e(perfil) + '">Acompanhar chef</a>' : '') + '</div>' + iconesContato + '</div>';

  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + e(titulo) + '</title><meta name="description" content="' + e(desc) + '"><meta name="theme-color" content="#455238">'
    + '<meta property="og:type" content="profile"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Seu Chef em Casa">'
    + '<meta property="og:title" content="' + e(titulo) + '"><meta property="og:description" content="' + e(desc) + '">'
    + '<meta property="og:image" content="' + e(fotoSelecionada?.url || capa || PADRAO.imagem) + '"><meta property="og:url" content="' + e(fotoSelecionada ? linkFoto(fotoSelecionada, galeria.indexOf(fotoSelecionada), esteLink) : esteLink) + '">'
    + '<meta name="twitter:card" content="summary_large_image"><link rel="canonical" href="' + e(esteLink) + '">'
    + (exemplo || extra.noindex ? '<meta name="robots" content="noindex">' : '')
    + (extra.jsonld ? '<script type="application/ld+json">' + JSON.stringify(extra.jsonld).replace(/</g, '\\u003c') + '</script>' : '')
    + '<style>' + ESTILO + '</style><script defer src="/assets/cloud.js"></script><script defer src="/assets/perfil-publico.js?v=6"></script></head><body>'
    + '<a class="pular" href="#perfil-conteudo">Pular para o conteúdo</a><header class="topo"><div class="l"><a class="marca" href="/">Seu Chef em Casa</a><a class="buscar" href="/#/buscar">Conhecer chefs</a></div></header>'
    + '<main class="l" id="perfil-conteudo" tabindex="-1">' + perfilPublico
    + (exemplo ? '<p class="nota">Perfil fictício, com fotos ilustrativas.</p>' : '')
    + '<nav class="secoes" aria-label="Neste perfil"><a href="#publicacoes">Publicações</a>'
    + (pratos.length ? '<a href="#cardapio">Cardápio</a>' : '') + '<a href="#contato">Contato</a></nav>'
    + '<section id="publicacoes" aria-label="Publicações">'
    + (galeria.length ? '<div class="fotos">' + galeria.map((g, i) => {
      const alt = g.legenda || 'Trabalho de ' + p.name + ', foto ' + (i + 1);
      return '<a href="' + e(g.url) + '" data-publicacao data-link="' + e(linkFoto(g, i, linkPerfil)) + '" data-legenda="' + e(g.legenda) + '"'
        + (g === fotoSelecionada ? ' data-foto-inicial' : '')
        + ' data-foto-id="' + e(idFoto(g, i)) + '"'
        + '><img src="'
        + e(g.url) + '" alt="' + e(alt) + '" width="300" height="300"' + (i >= 3 ? ' loading="lazy"' : '') + ' decoding="async"></a>';
    }).join('') + '</div>' : '<p class="nota">Este chef ainda não publicou fotos.</p>') + '</section>'
    + (galeria.length ? '<dialog id="foto-publica" aria-labelledby="foto-titulo" data-chef="' + e(id) + '"><div class="foto-topo"><h2 id="foto-titulo">Foto do portfólio</h2><button class="b" data-fechar autofocus>Fechar</button></div>'
      + '<div class="foto-corpo"><div class="foto-midia"><img alt=""><div class="foto-nav"><button class="b" data-anterior>Anterior</button>'
      + '<output aria-live="polite"></output><button class="b" data-proxima>Próxima</button></div></div>'
      + '<section class="conversa" aria-label="Curtidas e comentários"><p id="foto-legenda"></p>'
      + '<div class="conversa-cabecalho"><h3>Comentários</h3><button class="b" type="button" data-curtir aria-pressed="false">♡ Curtir</button></div>'
      + '<ol data-comentarios aria-label="Comentários da publicação"></ol>'
      + '<p data-social-status role="status"></p><a href="/#/entrar" data-entrar hidden>Entrar para participar</a>'
      + '<form data-comentar><textarea aria-label="Seu comentário" placeholder="Escreva um comentário…" maxlength="500" rows="1" required></textarea>'
      + '<button class="b b1" type="submit">Publicar</button></form>'
      + '<div class="acoes foto-compartilhar"><a class="b" data-whatsapp target="_blank" rel="noopener noreferrer">Enviar pelo WhatsApp</a>'
      + '<button class="b" data-copiar>Copiar link da foto</button></div>'
      + '<p data-compartilhamento role="status" hidden></p><input type="url" data-link-manual aria-label="Link da foto" readonly hidden>'
      + (exemplo ? '<p class="nota">As curtidas e os comentários de teste ficam nesta aba.</p>' : '') + '</section></div></dialog>' : '')
    + (mostra.length ? '<section id="cardapio"><h2>Meu cardápio</h2><div class="pratos">' + mostra.map(prato).join('') + '</div>'
      + (pratos.length > mostra.length ? '<details class="mais"><summary>Ver mais pratos</summary><div class="pratos">'
        + pratos.slice(mostra.length, 60).map(prato).join('') + '</div></details>' : '')
      + '<p class="nota">Os preços são valores de referência por pessoa. Confirme o total com o chef.</p></section>' : '')
    + (trabalho.length || experiencias.length ? '<section><h2>Como eu atendo</h2>'
      + (trabalho.length ? '<ul class="lista">' + trabalho.map(t => '<li>' + e(t) + '</li>').join('') + '</ul>' : '')
      + (experiencias.length ? '<div class="exp">' + experiencias.map(t => '<span>' + e(t) + '</span>').join('') + '</div>' : '') + '</section>' : '')
    + '<section class="final" id="contato"><h2>Fale com o chef</h2><div class="acoes">'
    + '<a class="b b1" href="' + e(pedido) + '">Pedir orçamento</a>'
    + (zap && !exemplo ? '<a class="b" href="' + e(zap) + '" target="_blank" rel="noopener">Conversar no WhatsApp</a>' : '')
    + '</div></section></main>'
    + '<footer><div class="l"><p>' + e(p.name) + ' no <a href="/">Seu Chef em Casa</a>.</p>'
    + ((extra.cidades || []).length ? '<p>Mais chefs em ' + extra.cidades.map(([s, n]) => '<a href="' + e(origem + '/personal-chef/' + s) + '">' + e(n) + '</a>').join(', ') + '.</p>' : '')
    + '<p>Contratação, pagamento e serviço são combinados direto com o chef. <a href="/#/termos">Termos de uso</a></p></div></footer>'
    + '</body></html>';
  return new Response(html, { headers: CABECALHOS });
}
