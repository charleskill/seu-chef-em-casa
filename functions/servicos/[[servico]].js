// /servicos: o que o chef faz indo à sua casa (ocasiões e marmitas). /servicos/<servico>: chefs reais que oferecem o serviço.
// Experiências moraram aqui até 27/11/2026: /servicos/<experiencia> agora redireciona (301) para /experiencias/<experiencia>.
import { producao, chefsVisiveis, SERVICOS, ehExperiencia, fazServico, CIDADES, atende, PERGUNTAS, lista, links, naoAchou } from '../_lib/seo.js';

const PROPRIOS = SERVICOS.filter(s => !ehExperiencia(s));

export async function onRequest({ request, env, params }) {
  const url = new URL(request.url), partes = [].concat(params.servico || []);
  const antiga = partes.length === 1 && SERVICOS.find(x => ehExperiencia(x) && x.slug === partes[0]);
  if (antiga) return Response.redirect(url.origin + antiga.url, 301);
  const chefs = await chefsVisiveis(env), prod = producao(request.url);
  if (!partes.length) {
    return lista({ url: '/servicos', titulo: 'Serviços de personal chef em casa · Seu Chef em Casa',
      desc: 'Jantar a dois, almoço em família, celebrações e marmitas da semana com personal chef em Santa Catarina.',
      olho: 'Serviços dos chefs', h1: 'O chef vai à sua casa', trilha: [['Serviços', '/servicos']],
      intro: ['Jantar a dois, almoço em família, encontro com amigos ou uma celebração: o chef cozinha na sua casa e combina o cardápio com você.'],
      chefs: [], vazio: ['Escolha como quer receber', 'As páginas mostram só chefs com perfil completo.'],
      blocos: [['Serviços', links([['Buscar chefs para uma ocasião', '/#/servicos'], ...PROPRIOS.map(s => [s.nome, s.url])])], ['Experiências', links([['Ver todas as experiências', '/experiencias']])]],
      noindex: !prod || !chefs.length }, url.origin);
  }
  const s = PROPRIOS.find(x => x.slug === partes[0]);
  if (!s || partes.length > 1) return naoAchou();
  const fazem = chefs.filter(c => fazServico(c.p, s));
  const cidades = CIDADES.filter(([cs]) => fazem.some(c => atende(c.p, cs)));
  return lista({ url: s.url, titulo: s.nome + ' com personal chef em SC · Seu Chef em Casa',
    desc: s.desc + ' Veja os chefs que fazem ' + s.nome + ' em Santa Catarina e peça seu orçamento.',
    olho: 'Serviço de chef em casa', h1: s.nome, trilha: [['Serviços', '/servicos'], [s.nome, s.url]],
    intro: [s.desc, 'Escolha os pratos, informe quantas pessoas vão participar e envie o pedido ao chef pelo WhatsApp.'],
    tituloChefs: 'Chefs que fazem ' + s.nome, chefs: fazem,
    vazio: ['Ainda sem chef para ' + s.nome, 'Nenhum chef com perfil completo oferece este serviço ainda. Se você faz ' + s.nome + ', marque no seu perfil e apareça aqui.'],
    perguntas: PERGUNTAS('').slice(1),
    blocos: [
      ...(cidades.length ? [['Onde tem', links(cidades.map(([cs, n]) => [n, '/personal-chef/' + cs]))]] : []),
      ['Experiências', links([['Ver todas as experiências', '/experiencias']])]
    ],
    noindex: !prod || !fazem.length }, url.origin);
}
