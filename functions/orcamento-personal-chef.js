import { producao, chefsVisiveis, lista } from './_lib/seo.js';

export async function onRequest({ request, env }) {
  const url = new URL(request.url), chefs = await chefsVisiveis(env);
  return lista({ url: '/orcamento-personal-chef', titulo: 'Orçamento para personal chef em casa · Seu Chef em Casa',
    desc: 'Encontre um personal chef, confira o cardápio e combine os detalhes do seu orçamento diretamente com ele.',
    olho: 'Orçamento com personal chef', h1: 'Peça um orçamento para cozinhar na sua casa',
    intro: ['Escolha um chef, confira o cardápio e combine os detalhes do encontro diretamente com ele.'],
    corpo: '<h2>Como pedir seu orçamento</h2><ol><li>Escolha um chef na lista e confira o perfil e o cardápio.</li><li>No perfil, abra o WhatsApp e envie a data, o número de pessoas e o cardápio desejado. Combine os detalhes diretamente com o chef.</li><li>Receba o orçamento em PDF, confira as informações e, se estiver de acordo, aceite com o chef.</li></ol>',
    tituloChefs: 'Escolha um chef para pedir orçamento', chefs,
    vazio: ['Ainda não há chefs disponíveis nesta página', 'Use a busca para conferir os perfis disponíveis.'],
    acoes: [['Buscar chefs', '/#/buscar']], noindex: !producao(request.url) || !chefs.length
  }, url.origin);
}
