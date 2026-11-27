// /orcamento-personal-chef: página indexável que explica o mural de pedidos e leva ao formulário (/#/pedir).
import { producao, PERGUNTAS, lista, links, SERVICOS } from '../_lib/seo.js';

const e = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PASSOS = [
  ['Conte o evento', 'Diga a ocasião, a cidade, a data, quantas pessoas e o que você imagina. Leva poucos minutos e é grátis.'],
  ['Até 4 chefs se interessam', 'Os chefs com perfil completo que atendem a sua cidade recebem o pedido. Eles veem o evento, mas não o seu WhatsApp.'],
  ['Eles te chamam no WhatsApp', 'Só os chefs que liberarem o contato podem te chamar. Você vê o perfil, o cardápio e as fotos de cada um e escolhe com calma.']
];

export async function onRequest({ request }) {
  const url = new URL(request.url);
  return lista({ url: '/orcamento-personal-chef', titulo: 'Orçamento de personal chef em casa, grátis · Seu Chef em Casa',
    desc: 'Conte o evento uma vez e receba contato de até 4 personal chefs da sua cidade pelo WhatsApp. Grátis e sem compromisso.',
    olho: 'Mural de pedidos', h1: 'Peça orçamento a vários personal chefs de uma vez', trilha: [['Pedir orçamento', '/orcamento-personal-chef']],
    intro: ['Em vez de procurar chef por chef, conte o evento uma vez. Os chefs da sua cidade que se interessarem te chamam no WhatsApp.'],
    corpo: PASSOS.map(([t, p], i) => '<h2>' + (i + 1) + '. ' + e(t) + '</h2><p>' + e(p) + '</p>').join('')
      + '<p><a class="b b1" href="/#/pedir">Pedir orçamentos agora</a></p>',
    chefs: [], vazio: ['Prefere escolher você mesmo?', 'Veja os chefs, os cardápios e as fotos e peça direto a quem você gostar.'],
    perguntas: PERGUNTAS('').slice(1),
    blocos: [['Ocasiões mais pedidas', links(SERVICOS.slice(0, 12).map(s => [s.nome, '/servicos/' + s.slug]))]],
    noindex: !producao(request.url) }, url.origin);
}
