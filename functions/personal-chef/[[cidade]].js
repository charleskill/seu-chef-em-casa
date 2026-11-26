// /personal-chef: lista de cidades. /personal-chef/<cidade>: chefs reais que atendem a cidade, com texto e perguntas frequentes.
// Sem chef real, a página mostra um convite e fica com noindex (e fora do sitemap) até o primeiro chef aparecer.
import { producao, chefsVisiveis, CIDADES, atende, PERGUNTAS, SERVICOS, fazServico, lista, links, naoAchou } from '../_lib/seo.js';

export async function onRequest({ request, env, params }) {
  const url = new URL(request.url), partes = [].concat(params.cidade || []);
  const chefs = await chefsVisiveis(env), prod = producao(request.url);
  if (!partes.length) {
    const comChef = CIDADES.map(([s, n]) => [s, n, chefs.filter(c => atende(c.p, s)).length]);
    return lista({ url: '/personal-chef', titulo: 'Personal chef em Santa Catarina, por cidade · Seu Chef em Casa',
      desc: 'Encontre personal chefs que cozinham na sua casa em Florianópolis, Balneário Camboriú, Joinville, Blumenau e outras cidades de SC.',
      olho: 'Santa Catarina', h1: 'Personal chef na sua cidade', trilha: [['Personal chef em SC', '/personal-chef']],
      intro: ['Escolha a cidade para ver quem atende na região, consultar cardápios e pedir um orçamento.'],
      chefs: [], vazio: ['Escolha a cidade abaixo', 'Se você atende em Santa Catarina, crie seu perfil para aparecer na busca.'],
      blocos: [['Cidades', links(comChef.map(([s, n, k]) => [n + (k ? ' (' + k + ')' : ''), '/personal-chef/' + s]))]],
      perguntas: PERGUNTAS(''), noindex: !prod || !chefs.length }, url.origin);
  }
  const cidade = CIDADES.find(([s]) => s === partes[0]);
  if (!cidade || partes.length > 1) return naoAchou();
  const [slug, nome] = cidade, daqui = chefs.filter(c => atende(c.p, slug));
  const servicos = SERVICOS.filter(s => daqui.some(c => fazServico(c.p, s)));
  return lista({ url: '/personal-chef/' + slug, titulo: 'Personal chef em ' + nome + ' · Seu Chef em Casa',
    desc: 'Personal chefs que atendem em ' + nome + ': veja cardápios, fotos dos pratos e peça seu orçamento para jantar, almoço ou evento em casa.',
    olho: 'Personal chef · ' + nome + ', SC', h1: 'Personal chef em ' + nome,
    trilha: [['Personal chef em SC', '/personal-chef'], [nome, '/personal-chef/' + slug]],
    intro: ['Veja quem atende na sua cidade e confira os cardápios antes de pedir um orçamento.',
      daqui.length ? (daqui.length === 1 ? 'Um chef atende ' : daqui.length + ' chefs atendem ') + 'em ' + nome + ' pelo Seu Chef em Casa.' : ''].filter(Boolean),
    tituloChefs: 'Chefs que atendem em ' + nome, chefs: daqui,
    vazio: ['A brigada de ' + nome + ' está sendo montada', 'Ainda não há chef de ' + nome + ' com perfil completo por aqui. Se você cozinha na cidade, entre e monte seu perfil; ele aparece nesta página assim que estiver pronto.'],
    perguntas: PERGUNTAS(nome),
    blocos: [
      ...(servicos.length ? [['O que os chefs de ' + nome + ' fazem', links(servicos.map(s => [s.nome, '/servicos/' + s.slug]))]] : []),
      ['Outras cidades', links(CIDADES.filter(([s]) => s !== slug).map(([s, n]) => [n, '/personal-chef/' + s]))]
    ],
    noindex: !prod || !daqui.length }, url.origin);
}
