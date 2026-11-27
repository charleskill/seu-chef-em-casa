// Textos do blog (passo 7 do docs/SEO-PLANO.md). Sem números, preços ou depoimentos inventados.
// Cada artigo: slug, titulo (página), h1, desc (meta), data (AAAA-MM-DD), servicos (slugs de SERVICOS para listar chefs reais), lead, secoes [[título, [parágrafos]]].
export const ARTIGOS = [
  {
    slug: 'ceia-de-natal-com-personal-chef',
    titulo: 'Ceia de Natal com personal chef em casa · Seu Chef em Casa',
    h1: 'Ceia de Natal com personal chef em casa',
    desc: 'Como organizar a ceia de Natal com um personal chef: quando reservar, como montar o cardápio e o que combinar antes do dia 24.',
    data: '2026-11-27',
    servicos: ['menu-degustacao', 'carnes-nobres', 'jantar-harmonizado', 'sequencia-de-frutos-do-mar'],
    lead: 'A ceia é a noite em que quem cozinha costuma ser o último a sentar. Com um chef na cozinha, a família inteira chega à mesa junta.',
    secoes: [
      ['Reserve cedo', [
        'Dezembro é o mês mais disputado para quem cozinha em casas. Os chefs fecham a agenda do dia 24 e do dia 31 com antecedência, então vale conversar com eles ainda em novembro ou no começo de dezembro.',
        'Na primeira conversa, diga a data, o horário em que a ceia vai para a mesa e quantas pessoas vão comer. Com isso o chef já consegue dizer se atende e sugerir um cardápio.'
      ]],
      ['Monte o cardápio com o chef', [
        'Conte o que não pode faltar na mesa da sua família. Pode ser o peru, o tender, um bacalhau, uma farofa da avó ou um prato que ninguém da casa sabe fazer. O chef ajuda a equilibrar entradas, principal e sobremesa para que tudo chegue quente à mesa.',
        'Avise sobre alergias, restrições e convidados vegetarianos. É mais fácil incluir um prato pensado para eles do que adaptar na hora.'
      ]],
      ['Combine os detalhes antes', [
        'Pergunte quem faz as compras, se o chef leva utensílios e louças de apoio, se serve à mesa e se entrega a cozinha limpa no fim. Cada chef trabalha de um jeito, e o perfil dele mostra o que está incluído.',
        'Confirme também o espaço: forno, bocas do fogão e geladeira livre fazem diferença numa noite com muitos pratos.'
      ]],
      ['Como pedir', [
        'Escolha um chef, monte o pedido com a data, o número de pessoas e os pratos e envie pelo WhatsApp. O preço final é combinado direto com ele.'
      ]]
    ]
  },
  {
    slug: 'jantar-a-dois-em-casa',
    titulo: 'Jantar a dois em casa com personal chef · Seu Chef em Casa',
    h1: 'Jantar a dois em casa, com um chef cozinhando',
    desc: 'Ideias para um jantar a dois em casa com personal chef: como escolher o cardápio, o que combinar e como deixar a noite tranquila.',
    data: '2026-11-27',
    servicos: ['jantar-harmonizado', 'menu-degustacao', 'cozinha-italiana', 'cozinha-francesa'],
    lead: 'Um jantar a dois em casa tem o que o restaurante não tem: a sua música, o seu sofá e nenhuma pressa para liberar a mesa.',
    secoes: [
      ['Escolha o estilo da noite', [
        'Tem casal que prefere uma sequência de pratos pequenos, servidos um de cada vez. Outros querem um prato principal caprichado e uma sobremesa para dividir. Uma massa italiana, uma noite japonesa ou um menu harmonizado com vinhos mudam bastante o clima.',
        'Se for uma data especial, conte ao chef. Aniversário de namoro, pedido de casamento ou só a vontade de comemorar uma semana boa: ele pode pensar o cardápio a partir disso.'
      ]],
      ['O que combinar', [
        'Informe o horário, se vocês querem o chef servindo à mesa ou só deixando tudo pronto, e se ele deve trazer louças ou usar as da casa. Diga também o que vocês não comem.',
        'Pergunte se o chef faz as compras e se a cozinha fica limpa no final. Assim a noite termina na mesa, e não na pia.'
      ]],
      ['Como pedir', [
        'Escolha um chef, veja o cardápio dele, monte o pedido para duas pessoas e envie pelo WhatsApp. Valores e detalhes são combinados direto com o chef.'
      ]]
    ]
  },
  {
    slug: 'marmitas-da-semana-feitas-por-chef',
    titulo: 'Marmitas da semana feitas por chef · Seu Chef em Casa',
    h1: 'Marmitas da semana feitas por um chef',
    desc: 'Como funcionam as marmitas da semana com personal chef: cardápio, quantidades, armazenamento e o que combinar.',
    data: '2026-11-27',
    servicos: ['marmitas-da-semana'],
    lead: 'Comer bem de segunda a sexta sem cozinhar todo dia. O chef prepara as refeições da semana e entrega porcionadas para a sua geladeira.',
    secoes: [
      ['Como funciona', [
        'Você combina com o chef quantas refeições quer por semana e para quantas pessoas. Ele monta um cardápio variado, prepara tudo e entrega em porções prontas para aquecer.',
        'Cada chef tem o seu jeito: alguns cozinham na sua casa, outros entregam pronto. O perfil mostra como cada um trabalha e o pedido mínimo.'
      ]],
      ['Monte o cardápio do seu jeito', [
        'Diga o que a casa gosta e o que precisa evitar: menos sal, sem glúten, sem lactose, mais proteína, refeições vegetarianas. O chef ajusta o cardápio para a sua rotina, e não o contrário.',
        'Vale pedir variedade ao longo da semana para não repetir o mesmo prato vários dias seguidos.'
      ]],
      ['Guarde direito', [
        'Pergunte ao chef quanto tempo cada prato dura na geladeira e quais podem ir para o congelador. Ele sabe o que aguenta melhor e pode indicar a ordem de consumo.'
      ]],
      ['Como pedir', [
        'Na busca, procure chefs que fazem marmitas, escolha as quantidades e envie o pedido pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  },
  {
    slug: 'churrasco-em-casa-com-personal-chef',
    titulo: 'Churrasco em casa com personal chef · Seu Chef em Casa',
    h1: 'Churrasco em casa com um chef na churrasqueira',
    desc: 'Como organizar um churrasco em casa com personal chef: cortes, acompanhamentos, quantidade por pessoa e o que combinar antes.',
    data: '2026-11-27',
    servicos: ['churrasco-em-casa', 'carnes-nobres', 'costela-de-preparo-lento'],
    lead: 'No churrasco, quem fica na churrasqueira quase não conversa com ninguém. Com um chef cuidando da brasa, o anfitrião volta para a roda.',
    secoes: [
      ['Defina o estilo do churrasco', [
        'Pode ser o churrasco gaúcho, com costela no fogo de chão, um churrasco de cortes nobres servidos em sequência ou algo mais leve, com peixes e legumes na grelha. Conte ao chef o que a turma gosta e o que ninguém pode ficar sem.',
        'Os acompanhamentos fazem metade da festa: farofa, vinagrete, pão de alho, saladas, arroz. Combine quais o chef prepara e quais ficam por sua conta.'
      ]],
      ['Quantidade e compras', [
        'O chef calcula a carne pelo número de pessoas e pelo perfil dos convidados, contando crianças e quem come menos carne. Pergunte se ele faz as compras ou se você compra pela lista que ele manda.',
        'Se for comprar por conta própria, peça a lista com os cortes e o peso de cada um. Isso evita sobra demais ou carne faltando no meio da tarde.'
      ]],
      ['O que combinar antes', [
        'Confirme o tipo de churrasqueira, o carvão ou a lenha, os espetos e as grelhas. Pergunte se o chef traz utensílios, se fica até o fim servindo e se deixa a área limpa.',
        'Avise sobre convidados vegetarianos ou com restrições. Legumes, queijos e cogumelos na brasa também fazem sucesso.'
      ]],
      ['Como pedir', [
        'Procure chefs que fazem churrasco na sua cidade, veja os cortes e as fotos e envie o pedido com a data e o número de pessoas pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  }
];
