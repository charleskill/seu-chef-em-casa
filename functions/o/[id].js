// /o/<id do chef>?q=<orçamento>: orçamento que o chef montou no painel e mandou ao cliente.
// O conteúdo vem do link; o nome, a foto e o WhatsApp do chef vêm do cadastro publicado.
import Q from '../../assets/orcamento-core.js';
import { EXEMPLO, e, fotoOk, SERIFA, PADRAO } from '../_lib/vitrine.js';
import { chefPorId } from '../_lib/seo.js';

const CABECALHOS = {
  'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex',
  'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY', 'referrer-policy': 'no-referrer',
  'content-security-policy': "default-src 'none'; script-src 'self'; img-src 'self' data: https://images.unsplash.com; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
};

const ESTILO = [
  '@page{size:A4;margin:12mm}*{box-sizing:border-box}',
  'body{margin:0;background:#efeadf;color:#2f3529;font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}',
  'h1,h2,.serifa{font-family:' + SERIFA + ';font-weight:400;margin:0;text-wrap:balance}a{color:inherit}img{display:block}',
  '.folha{width:min(100% - 24px,760px);margin:20px auto 32px;background:#fbf8f1;border-radius:22px;box-shadow:0 1px 2px rgba(47,53,41,.06),0 18px 50px -18px rgba(47,53,41,.22);overflow:hidden}',
  '.faixa{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:16px 28px;background:#455238;color:#efeadf;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase}.faixa .serifa{font-size:1.02rem;letter-spacing:.02em;text-transform:none}',
  '.miolo{padding:30px 28px 26px}',
  '.chef{display:flex;align-items:center;gap:16px;padding-bottom:24px;border-bottom:1px solid #e2dacb}',
  '.chef img,.chef .ini{width:72px;height:72px;border-radius:50%;object-fit:cover;flex:none;outline:1px solid rgba(0,0,0,.08);outline-offset:-1px}.chef .ini{display:grid;place-items:center;background:#455238;color:#efeadf;font-family:' + SERIFA + ';font-size:1.6rem}',
  '.chef h2{font-size:1.45rem;line-height:1.2}.chef p{margin:2px 0 0;color:#5e6656;font-size:.88rem}',
  '.para{padding:26px 0 6px}.rotulo{margin:0 0 6px;color:#754653;font-size:.72rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase}',
  '.para h1{font-size:clamp(1.9rem,6.4vw,2.7rem);line-height:1.1}.para .cliente{margin:10px 0 0;color:#5e6656}',
  '.dados{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;margin:24px 0 8px;background:#e2dacb;border:1px solid #e2dacb;border-radius:14px;overflow:hidden}',
  '.dados div{background:#f6f2e8;padding:12px 14px}.dados div:last-child:nth-child(odd){grid-column:1/-1}.dados dt{color:#6d7564;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase}.dados dd{margin:3px 0 0;font-weight:500;overflow-wrap:anywhere}',
  'table{width:100%;border-collapse:collapse;margin:22px 0 0;font-variant-numeric:tabular-nums}caption{text-align:left;padding-bottom:6px}',
  'th{color:#6d7564;font-size:.7rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;text-align:left;padding:0 0 8px;border-bottom:1px solid #2f3529}th:last-child,td:last-child{text-align:right}',
  'td{padding:13px 0;border-bottom:1px solid #e2dacb;vertical-align:top}td small{display:block;color:#6d7564;font-size:.82rem;margin-top:2px}td:last-child{white-space:nowrap;padding-left:14px}',
  '.total{display:flex;justify-content:space-between;align-items:baseline;gap:14px;margin:18px 0 0;padding:18px 20px;background:#455238;color:#fbf8f1;border-radius:14px}.total span{font-size:.75rem;letter-spacing:.14em;text-transform:uppercase}.total strong{font-family:' + SERIFA + ';font-weight:400;font-size:clamp(1.7rem,6vw,2.2rem);font-variant-numeric:tabular-nums}',
  '.pp{margin:8px 0 0;text-align:right;color:#6d7564;font-size:.85rem;font-variant-numeric:tabular-nums}',
  '.obs{margin:24px 0 0;padding:16px 18px;border-left:3px solid #754653;background:#f6f2e8;border-radius:0 12px 12px 0}.obs p{margin:0;white-space:pre-line;overflow-wrap:anywhere}',
  '.validade{margin:18px 0 0;color:#5e6656;font-size:.88rem}.vencido{color:#754653;font-weight:600}',
  '.acoes{display:flex;flex-wrap:wrap;gap:10px;margin:26px 0 0}',
  '.b{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 20px;border-radius:999px;border:1px solid #455238;background:transparent;color:#455238;font:inherit;font-weight:600;text-decoration:none;cursor:pointer;transition:transform .15s ease,background-color .15s ease}',
  '.b:active{transform:scale(.97)}.b:focus-visible{outline:2px solid #2f3529;outline-offset:2px}.b1{background:#455238;color:#fbf8f1;flex:1 1 220px}@media(hover:hover){.b:hover{background:#e7ecdf}.b1:hover{background:#3a4630}}',
  '.rodape{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;margin-top:26px;padding-top:16px;border-top:1px solid #e2dacb;color:#7d8574;font-size:.78rem}',
  '@media(max-width:520px){.miolo{padding:24px 18px 20px}.faixa{padding:14px 18px}.folha{width:100%;margin:0;border-radius:0}.total{padding:16px}}',
  '@media print{body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}.folha{width:auto;margin:0;box-shadow:none;border-radius:0}.acoes{display:none}tr,.total,.obs,.dados{break-inside:avoid}}'
].join('');

const indisponivel = () => new Response('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Orçamento indisponível</title><style>' + ESTILO + '</style></head><body><main class="folha"><div class="miolo"><h1>Este orçamento não abriu.</h1><p>O link pode ter sido cortado ao copiar. Peça ao chef para enviar de novo.</p><p><a href="/">Seu Chef em Casa</a></p></div></main></body></html>', { status: 404, headers: CABECALHOS });

export async function onRequest({ request, env, params }) {
  const url = new URL(request.url), id = String(params.id || '');
  const q = Q.decode(url.searchParams.get('q'));
  if (!q || q.c !== id) return indisponivel();
  const c = id === 'exemplo' ? EXEMPLO : await chefPorId(env, id);
  if (!c) return indisponivel();
  const origem = url.origin, esteLink = url.href;
  const avatar = fotoOk(c.avatar, origem);
  const iniciais = String(c.name).trim().split(/\s+/).slice(0, 2).map(n => n[0]).join('');
  const zap = String(c.whatsapp || '').replace(/\D/g, '');
  const zapChef = zap ? 'https://wa.me/' + (zap.startsWith('55') ? zap : '55' + zap) : '';
  const vencido = Q.vencido(q);
  const tot = Q.total(q);
  const perfil = c.slug ? origem + '/chef/' + c.slug : origem + '/c/' + id;
  const titulo = 'Orçamento para ' + q.n + ' · ' + c.name;
  const desc = q.t + (q.d ? ' · ' + Q.dataLonga(q.d) : '') + ' · Seu Chef em Casa';
  const dados = [
    q.d && ['Data', Q.dataLonga(q.d).replace(/^./, s => s.toUpperCase()) + (q.h ? ', às ' + q.h : '')],
    q.p && ['Pessoas', q.p + (q.p === 1 ? ' pessoa' : ' pessoas')],
    q.l && ['Local', q.l]
  ].filter(Boolean);
  const linhas = q.i.map(([d, qt, v]) => '<tr><td>' + e(d) + (qt !== 1 ? '<small>' + e(Q.qtd(qt)) + ' × ' + e(Q.dinheiro(v)) + '</small>' : '') + '</td><td>' + e(Q.dinheiro(qt * v)) + '</td></tr>').join('');
  const aceitar = zapChef ? '<a class="b b1" href="' + e(zapChef + '?text=' + encodeURIComponent(vencido ? 'Olá! Aqui é ' + q.n + '. Recebi o orçamento "' + q.t + '", mas ele venceu. Pode me mandar um atualizado?' : Q.aceite(q, esteLink))) + '" target="_blank" rel="noopener noreferrer">' + (vencido ? 'Pedir orçamento atualizado' : 'Aceitar orçamento') + '</a>' : '';

  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + e(titulo) + '</title><meta name="robots" content="noindex"><meta name="description" content="' + e(desc) + '"><meta name="theme-color" content="#455238">'
    + '<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Seu Chef em Casa">'
    + '<meta property="og:title" content="' + e(titulo) + '"><meta property="og:description" content="' + e(desc) + '"><meta property="og:image" content="' + e(avatar || PADRAO.imagem) + '">'
    + '<style>' + ESTILO + '</style><script defer src="/assets/orcamento-pagina.js"></script></head><body>'
    + '<main class="folha"><div class="faixa"><span class="serifa">Seu Chef em Casa</span><span>Orçamento</span></div><div class="miolo">'
    + '<header class="chef">' + (avatar ? '<img src="' + e(avatar) + '" alt="" width="72" height="72">' : '<span class="ini" aria-hidden="true">' + e(iniciais) + '</span>')
    + '<div><h2>' + e(c.name) + '</h2><p>' + e(c.specialty || 'Personal chef') + (c.cities ? ' · ' + e(c.cities) : '') + '</p></div></header>'
    + '<section class="para"><p class="rotulo">Preparado para ' + e(q.n) + '</p><h1>' + e(q.t) + '</h1></section>'
    + (dados.length ? '<dl class="dados">' + dados.map(([k, v]) => '<div><dt>' + k + '</dt><dd>' + e(v) + '</dd></div>').join('') + '</dl>' : '')
    + '<table><thead><tr><th scope="col">O que está incluído</th><th scope="col">Valor</th></tr></thead><tbody>' + linhas + '</tbody></table>'
    + '<div class="total"><span>Total</span><strong>' + e(Q.dinheiro(tot)) + '</strong></div>'
    + (q.p > 1 ? '<p class="pp">' + e(Q.dinheiro(tot / q.p)) + ' por pessoa</p>' : '')
    + (q.o ? '<div class="obs"><p class="rotulo">Condições</p><p>' + e(q.o) + '</p></div>' : '')
    + (q.val ? '<p class="validade' + (vencido ? ' vencido' : '') + '">' + (vencido ? 'Este orçamento venceu em ' : 'Válido até ') + e(Q.dataCurta(q.val)) + '.</p>' : '')
    + '<div class="acoes">' + aceitar + '<button class="b" type="button" data-imprimir>Baixar PDF</button><a class="b" href="' + e(perfil) + '">Ver perfil do chef</a></div>'
    + '<footer class="rodape"><span>' + (q.em ? 'Emitido em ' + e(Q.dataCurta(q.em)) : '') + '</span><span>Contratação e pagamento combinados direto com o chef.</span></footer>'
    + '</div></main></body></html>';
  return new Response(html, { headers: CABECALHOS });
}
