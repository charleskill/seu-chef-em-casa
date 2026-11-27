// /blog: lista de textos. /blog/<artigo>: texto com a voz da marca e chefs reais que fazem o serviço ligado a ele.
import { producao, chefsVisiveis, SERVICOS, fazServico, PERGUNTAS, lista, links, naoAchou } from '../_lib/seo.js';
import { ARTIGOS } from '../_lib/blog.js';

const e = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dataBR = d => d.split('-').reverse().join('/');

export async function onRequest({ request, env, params }) {
  const url = new URL(request.url), partes = [].concat(params.artigo || []), prod = producao(request.url);
  if (!partes.length) {
    return lista({ url: '/blog', titulo: 'Blog · Seu Chef em Casa',
      desc: 'Dicas para receber em casa com personal chef: ceia de Natal, jantar a dois, marmitas da semana e mais.',
      olho: 'Blog', h1: 'Dicas para receber em casa', trilha: [['Blog', '/blog']],
      intro: ['Como planejar uma ocasião com um chef cozinhando na sua casa.'],
      corpo: ARTIGOS.map(a => '<h2><a href="/blog/' + e(a.slug) + '">' + e(a.h1) + '</a></h2><p>' + e(a.desc) + '</p>').join(''),
      chefs: [], vazio: ['Encontre um chef', 'Veja quem atende na sua cidade e o que cada chef prepara.'],
      noindex: !prod }, url.origin);
  }
  const a = ARTIGOS.find(x => x.slug === partes[0]);
  if (!a || partes.length > 1) return naoAchou();
  const servicos = SERVICOS.filter(s => a.servicos.includes(s.slug));
  const chefs = (await chefsVisiveis(env)).filter(c => servicos.some(s => fazServico(c.p, s)));
  return lista({ url: '/blog/' + a.slug, titulo: a.titulo, desc: a.desc, olho: 'Blog', h1: a.h1,
    trilha: [['Blog', '/blog'], [a.h1, '/blog/' + a.slug]], intro: [a.lead],
    corpo: '<p class="data">Publicado em ' + e(dataBR(a.data)) + '</p>' + a.secoes.map(([t, ps]) => '<h2>' + e(t) + '</h2>' + ps.map(p => '<p>' + e(p) + '</p>').join('')).join(''),
    tituloChefs: 'Chefs que podem preparar', chefs,
    vazio: ['Encontre um chef', 'Veja quem atende na sua cidade e o que cada chef prepara.'],
    perguntas: PERGUNTAS('').slice(1),
    blocos: [
      ['Serviços ligados a este texto', links(servicos.map(s => [s.nome, '/servicos/' + s.slug]))],
      ['Leia também', links(ARTIGOS.filter(x => x !== a).map(x => [x.h1, '/blog/' + x.slug]))]
    ],
    noindex: !prod }, url.origin);
}
