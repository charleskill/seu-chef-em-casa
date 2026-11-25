// /servicos: lista de experiências. /servicos/<servico>: chefs reais que oferecem a experiência (marcada no perfil).
// Sem chef real, mostra convite e fica com noindex (e fora do sitemap).
import { producao, chefsVisiveis, SERVICOS, fazServico, CIDADES, atende, PERGUNTAS, lista, links, naoAchou } from '../_lib/seo.js';

export async function onRequest({ request, env, params }) {
  const url = new URL(request.url), partes = [].concat(params.servico || []);
  const chefs = await chefsVisiveis(env), prod = producao(request.url);
  if (!partes.length) {
    return lista({ url: '/servicos', titulo: 'Experiências com personal chef em casa · Seu Chef em Casa',
      desc: 'Noite da Pizza, churrasco, jantar harmonizado, marmitas da semana e outras experiências com personal chef em Santa Catarina.',
      olho: 'Cardápio de experiências', h1: 'O que um chef pode fazer na sua casa', trilha: [['Experiências', '/servicos']],
      intro: ['Do café da manhã à sequência de frutos do mar: escolha a ocasião e veja os chefs que fazem.'],
      chefs: [], vazio: ['Escolha a experiência abaixo', 'Cada chef marca no perfil o que faz. As páginas mostram só quem tem perfil completo.'],
      blocos: [['Experiências', links(SERVICOS.map(s => [s.nome, '/servicos/' + s.slug]))]],
      noindex: !prod || !chefs.length }, url.origin);
  }
  const s = SERVICOS.find(x => x.slug === partes[0]);
  if (!s || partes.length > 1) return naoAchou();
  const fazem = chefs.filter(c => fazServico(c.p, s));
  const cidades = CIDADES.filter(([cs]) => fazem.some(c => atende(c.p, cs)));
  return lista({ url: '/servicos/' + s.slug, titulo: s.nome + ' com personal chef em SC · Seu Chef em Casa',
    desc: s.desc + ' Veja os chefs que fazem ' + s.nome + ' em Santa Catarina e peça seu orçamento.',
    olho: 'Experiência com chef em casa', h1: s.nome, trilha: [['Experiências', '/servicos'], [s.nome, '/servicos/' + s.slug]],
    intro: [s.desc, 'O chef leva a experiência até a sua casa. Você escolhe os pratos, conta quantas pessoas vêm e o pedido segue para o WhatsApp dele.'],
    tituloChefs: 'Chefs que fazem ' + s.nome, chefs: fazem,
    vazio: ['Ainda sem chef para ' + s.nome, 'Nenhum chef com perfil completo marcou esta experiência ainda. Se você faz ' + s.nome + ', marque no seu perfil e apareça aqui.'],
    perguntas: PERGUNTAS('').slice(1),
    blocos: [
      ...(cidades.length ? [['Onde tem', links(cidades.map(([cs, n]) => [n, '/personal-chef/' + cs]))]] : []),
      ['Outras experiências', links(SERVICOS.filter(x => x !== s).map(x => [x.nome, '/servicos/' + x.slug]))]
    ],
    noindex: !prod || !fazem.length }, url.origin);
}
