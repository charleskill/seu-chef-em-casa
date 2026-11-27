// /para-chefs: página indexável para atrair chefs (cadastro grátis, mural de pedidos, vitrine). Leva ao cadastro (/#/entrar).
import { producao, lista } from '../_lib/seo.js';

const e = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const BLOCOS = [
  ['Pedidos da sua cidade chegam até você', 'Clientes contam o evento no mural: data, número de pessoas, o que imaginam. Você recebe o aviso pelo sino e por e-mail e decide se quer atender.'],
  ['Liberar o contato é grátis', 'Neste começo do Seu Chef em Casa, liberar o contato do cliente não custa nada. Até quatro chefs podem pegar cada pedido, então vale responder rápido.'],
  ['Você negocia direto e fica com 100%', 'A conversa, o cardápio, o preço e o pagamento são combinados entre você e o cliente, pelo WhatsApp. A plataforma não cobra comissão.'],
  ['Um perfil que vende por você', 'Mostre seus pratos com fotos, as cidades onde atende, o que inclui no serviço e os menus especiais de datas como Natal e Réveillon. Monte orçamentos em poucos toques no painel.']
];
const PERGUNTAS = [
  ['Quanto custa para o chef?', 'O cadastro é grátis e, neste começo, liberar contatos do mural também. Não há mensalidade nem comissão sobre o serviço.'],
  ['O que preciso para aparecer na busca e no mural?', 'Uma foto, pelo menos um prato no cardápio, as cidades onde você atende e um WhatsApp. Com isso o perfil fica completo.'],
  ['Quem vê meus dados?', 'Seu perfil público mostra nome, fotos, pratos, cidades e WhatsApp, para os clientes poderem te chamar. Seu e-mail não aparece.'],
  ['Posso pausar o perfil?', 'Sim. Você pode pausar quando estiver sem agenda e voltar quando quiser, ou apagar a conta a qualquer momento.']
];

export async function onRequest({ request }) {
  const url = new URL(request.url);
  return lista({ url: '/para-chefs', titulo: 'Personal chef: receba pedidos de clientes da sua cidade · Seu Chef em Casa',
    desc: 'Cadastro grátis para personal chefs. Receba pedidos de jantares, churrascos e eventos da sua cidade, negocie direto pelo WhatsApp e fique com 100% do valor.',
    olho: 'Para chefs', h1: 'Receba pedidos de clientes da sua cidade', trilha: [['Para chefs', '/para-chefs']],
    intro: ['O Seu Chef em Casa é uma vitrine para personal chefs: clientes encontram seu perfil, veem seus pratos e te chamam no WhatsApp.'],
    corpo: BLOCOS.map(([t, p]) => '<h2>' + e(t) + '</h2><p>' + e(p) + '</p>').join('') + '<p><a class="b b1" href="/#/entrar">Criar meu perfil de chef</a></p>',
    chefs: [], vazio: ['Comece em poucos minutos', 'Crie a conta com seu e-mail ou com o Google, coloque uma foto, um prato e as cidades onde atende.'],
    perguntas: PERGUNTAS, noindex: !producao(request.url) }, url.origin);
}
