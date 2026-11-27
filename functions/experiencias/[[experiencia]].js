// /experiencias: lista de experiências. /experiencias/<experiencia>: chefs reais que oferecem a experiência (marcada no perfil).
// Sem chef real, mostra convite e fica com noindex (e fora do sitemap).
import { producao, chefsVisiveis, SERVICOS, ehExperiencia, fazServico, CIDADES, atende, PERGUNTAS, lista, links, naoAchou } from '../_lib/seo.js';

const EXPERIENCIAS = SERVICOS.filter(ehExperiencia);

export async function onRequest({ request, env, params }) {
  const url = new URL(request.url), partes = [].concat(params.experiencia || []);
  const chefs = await chefsVisiveis(env), prod = producao(request.url);
  if (!partes.length) {
    return lista({ url: '/experiencias', titulo: 'Experiências com personal chef em casa · Seu Chef em Casa',
      desc: 'Noite da Pizza, churrasco, fondue, aula de cozinha e outras experiências com personal chef em Santa Catarina.',
      olho: 'Experiências com chef', h1: 'Uma noite diferente na sua casa', trilha: [['Experiências', '/experiencias']],
      intro: ['Noites temáticas, aulas e cardápios com tema. Cada chef marca no perfil as experiências que faz.'],
      chefs: [], vazio: ['Escolha a experiência abaixo', 'As páginas mostram só chefs com perfil completo.'],
      blocos: [['Experiências', links(EXPERIENCIAS.map(s => [s.nome, s.url]))], ['Serviços', links([['Jantar, almoço e celebrações em casa', '/servicos'], ...SERVICOS.filter(s => !ehExperiencia(s)).map(s => [s.nome, s.url])])]],
      noindex: !prod || !chefs.length }, url.origin);
  }
  const s = EXPERIENCIAS.find(x => x.slug === partes[0]);
  if (!s || partes.length > 1) return naoAchou();
  const fazem = chefs.filter(c => fazServico(c.p, s));
  const cidades = CIDADES.filter(([cs]) => fazem.some(c => atende(c.p, cs)));
  return lista({ url: s.url, titulo: s.nome + ' com personal chef em SC · Seu Chef em Casa',
    desc: s.desc + ' Veja os chefs que fazem ' + s.nome + ' em Santa Catarina e peça seu orçamento.',
    olho: 'Experiência com chef em casa', h1: s.nome, trilha: [['Experiências', '/experiencias'], [s.nome, s.url]],
    intro: [s.desc, 'Escolha os pratos, informe quantas pessoas vão participar e envie o pedido ao chef pelo WhatsApp.'],
    tituloChefs: 'Chefs que fazem ' + s.nome, chefs: fazem,
    vazio: ['Ainda sem chef para ' + s.nome, 'Nenhum chef com perfil completo marcou esta experiência ainda. Se você faz ' + s.nome + ', marque no seu perfil e apareça aqui.'],
    perguntas: PERGUNTAS('').slice(1),
    blocos: [
      ...(cidades.length ? [['Onde tem', links(cidades.map(([cs, n]) => [n, '/personal-chef/' + cs]))]] : []),
      ['Outras experiências', links(EXPERIENCIAS.filter(x => x !== s).map(x => [x.nome, x.url]))]
    ],
    noindex: !prod || !fazem.length }, url.origin);
}
