// /blog: lista de textos. /blog/<artigo>: texto com a voz da marca e chefs reais que fazem o serviço ligado a ele.
import { producao, chefsVisiveis, SERVICOS, fazServico, PERGUNTAS, lista, links, naoAchou } from '../_lib/seo.js';
import { ARTIGOS, publicados, hojeBR } from '../_lib/blog.js';

const e = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dataBR = d => d.split('-').reverse().join('/');

export async function onRequest({ request, env, params }) {
  const url = new URL(request.url), partes = [].concat(params.artigo || []), prod = producao(request.url);
  // Agenda para o painel da equipe: títulos, datas e situação (os títulos não são segredo).
  if (!partes.length && url.searchParams.get('formato') === 'agenda') {
    const hoje = hojeBR();
    return new Response(JSON.stringify({ hoje, artigos: [...ARTIGOS].sort((a, b) => a.data.localeCompare(b.data)).map(a => ({ slug: a.slug, titulo: a.h1, data: a.data, publicado: a.data <= hoje })) }), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
  }
  const lidos = publicados();
  if (!partes.length) {
    return lista({ url: '/blog', titulo: 'Blog · Seu Chef em Casa',
      desc: 'Dicas para receber em casa com personal chef: ceia de Natal, jantar a dois, marmitas da semana e mais.',
      olho: 'Blog', h1: 'Dicas para receber em casa', trilha: [['Blog', '/blog']],
      intro: ['Como planejar uma ocasião com um chef cozinhando na sua casa.'],
      corpo: lidos.map(a => '<h2><a href="/blog/' + e(a.slug) + '">' + e(a.h1) + '</a></h2><p>' + e(a.desc) + '</p>').join(''),
      chefs: [], vazio: ['Encontre um chef', 'Veja quem atende na sua cidade e o que cada chef prepara.'],
      noindex: !prod }, url.origin);
  }
  const a = ARTIGOS.find(x => x.slug === partes[0]);
  const previa = !!a && !lidos.includes(a);
  if (!a || partes.length > 1 || (previa && url.searchParams.get('previa') !== '1')) return naoAchou();
  const servicos = SERVICOS.filter(s => a.servicos.includes(s.slug));
  const chefs = (await chefsVisiveis(env)).filter(c => servicos.some(s => fazServico(c.p, s)));
  return lista({ url: '/blog/' + a.slug, titulo: a.titulo, desc: a.desc, olho: 'Blog', h1: a.h1,
    trilha: [['Blog', '/blog'], [a.h1, '/blog/' + a.slug]], intro: [a.lead],
    corpo: '<p class="data">Publicado em ' + e(dataBR(a.data)) + '</p>' + a.secoes.map(([t, ps]) => '<h2>' + e(t) + '</h2>' + ps.map(p => '<p>' + e(p) + '</p>').join('')).join(''),
    tituloChefs: 'Chefs que podem preparar', chefs,
    vazio: ['Encontre um chef', 'Veja quem atende na sua cidade e o que cada chef prepara.'],
    perguntas: PERGUNTAS('').slice(1),
    blocos: [
      ['Prefere que os chefs venham até você?', '<p>Conte o evento uma vez no mural e receba contato de até 4 chefs da sua cidade pelo WhatsApp. <a href="/orcamento-personal-chef">Veja como funciona</a>.</p>'],
      ['Serviços ligados a este texto', links(servicos.map(s => [s.nome, '/servicos/' + s.slug]))],
      ['Leia também', links(lidos.filter(x => x !== a).map(x => [x.h1, '/blog/' + x.slug]))]
    ],
    noindex: !prod || previa }, url.origin);
}
