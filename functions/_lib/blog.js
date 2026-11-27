// Textos do blog (passo 7 do docs/SEO-PLANO.md). Sem números, preços ou depoimentos inventados.
// Cada artigo: slug, titulo (página), h1, desc (meta), data (AAAA-MM-DD), servicos (slugs de SERVICOS para listar chefs reais), lead, secoes [[título, [parágrafos]]].
// Publicação agendada: o texto só aparece no site, no blog e no sitemap a partir da data (horário de Brasília).
// Para agendar, basta pôr uma data futura em "data". Rascunho visível só com /blog/<slug>?previa=1 (noindex).
export const hojeBR = () => new Date(Date.now() - 3 * 3600000).toISOString().slice(0, 10);
export const publicados = (hoje = hojeBR()) => ARTIGOS.filter(a => a.data <= hoje).sort((a, b) => b.data.localeCompare(a.data));
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
  },
  {
    slug: 'reveillon-em-casa-com-personal-chef',
    titulo: 'Réveillon em casa com personal chef · Seu Chef em Casa',
    h1: 'Réveillon em casa com personal chef',
    desc: 'Veja como organizar o Réveillon em casa com personal chef, da escolha do cardápio ao horário da ceia, e o que acertar antes do brinde.',
    data: '2026-12-03',
    servicos: ['menu-degustacao', 'lounge-de-petiscos-e-drinks', 'sequencia-de-frutos-do-mar'],
    lead: 'No Réveillon, sempre tem alguém perguntando se já pode abrir a espumante enquanto a ceia ainda está no forno. Com um chef em casa, dá para combinar o ritmo do jantar com a hora do brinde.',
    secoes: [
      ['Diga a que horas vocês querem comer', [
        'Ao consultar a agenda do chef, conte se a ideia é jantar antes da meia-noite ou servir a ceia depois da virada. Se a turma costuma chegar em horários diferentes, petiscos na chegada ajudam a dar tempo para todo mundo se reunir.'
      ]],
      ['Escolha os pratos da virada', [
        'Vale contar se a lentilha é tradição na sua casa ou se a família espera peixe à mesa. Diga também quem tem restrições alimentares e quantas pessoas vão comer. O chef calcula as quantidades e sugere como distribuir os pratos ao longo da noite.'
      ]],
      ['Combine o fim do serviço', [
        'Pergunte se o chef fica até depois do brinde e quem recolhe as travessas. Se a festa for no terraço ou no quintal, pense com ele em onde servir caso chova e em como levar os pratos da cozinha até lá.'
      ]],
      ['Como pedir', [
        'Procure chefs na sua cidade ou conte como será a virada no mural de pedidos para receber contato de até 4 chefs pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  },
  {
    slug: 'confraternizacao-de-fim-de-ano-da-empresa-com-chef',
    titulo: 'Confraternização de fim de ano da empresa com chef · Seu Chef em Casa',
    h1: 'Confraternização de fim de ano da empresa com chef',
    desc: 'Planeje a confraternização de fim de ano da empresa com chef e veja como combinar o almoço ou jantar da equipe, o cardápio e a estrutura do local.',
    data: '2026-12-10',
    servicos: ['finger-food-para-receber', 'churrasco-em-casa', 'cardapio-tematico'],
    lead: 'Para reunir a equipe no fim do ano, dá para combinar um almoço numa casa alugada ou um jantar num salão com cozinha. Antes de escolher o cardápio, veja como será o dia da turma.',
    secoes: [
      ['Escolha o formato da confraternização', [
        'Se o almoço tiver hora para acabar, pergunte ao chef quais pratos ele consegue servir de uma vez. Se a turma vai circular pelo espaço durante o jantar, petiscos que se comem em pé deixam mais espaço para conversar.'
      ]],
      ['Passe a programação para o chef', [
        'Informe quando o pessoal chega e se haverá discurso ou entrega de lembranças. Assim o chef pode acertar a saída dos pratos para que todo mundo consiga ouvir a fala e comer com calma.',
        'Reúna as restrições alimentares antes de fechar o menu. Passe ao chef a previsão de convidados e combine até quando você pode confirmar o total.'
      ]],
      ['Confira o local e o que a empresa precisa', [
        'Veja se há cozinha disponível e em que horário a equipe do chef pode entrar para montar o serviço. Combine quem fornece louças e bebidas. Se a empresa precisar de nota fiscal ou tiver prazo de pagamento, converse sobre isso antes de reservar.'
      ]],
      ['Como pedir', [
        'Procure chefs na sua cidade ou conte como será a confraternização no mural de pedidos para receber contato de até 4 chefs pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  },
  {
    slug: 'com-quanta-antecedencia-contratar-um-chef',
    titulo: 'Com quanta antecedência contratar um chef para datas especiais · Seu Chef em Casa',
    h1: 'Com quanta antecedência contratar um chef para datas especiais?',
    desc: 'Saiba quando procurar um chef para datas especiais, quais informações ajudam a consultar a agenda e o que acertar antes de confirmar a reserva.',
    data: '2026-12-17',
    servicos: ['cardapio-tematico', 'menu-degustacao', 'jantar-harmonizado'],
    lead: 'Se você já sabe o dia da comemoração, já dá para consultar a agenda de um personal chef. O cardápio pode ser acertado depois, com tempo para conversar sobre o que a turma gosta.',
    secoes: [
      ['Comece pela data', [
        'Para feriados e festas de fim de ano, vale procurar assim que a data estiver definida. Se você puder mudar o dia ou trocar jantar por almoço, avise na primeira conversa para o chef checar mais opções na agenda.'
      ]],
      ['Dê uma ideia do tamanho do evento', [
        'Informe a cidade, o local e quantas pessoas você espera. Diga se imagina um almoço em travessas ou um jantar servido em etapas. Se o total ainda for aproximado, pergunte até quando precisa confirmá-lo.'
      ]],
      ['Saiba quando a reserva está confirmada', [
        'Pergunte o que o chef precisa para reservar o dia e até quando a proposta vale. Combine por escrito como funcionam mudanças de data, ajustes no número de convidados e cancelamento.'
      ]],
      ['Como pedir', [
        'Procure chefs na sua cidade ou conte a data e os detalhes do evento no mural de pedidos para receber contato de até 4 chefs pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  },
  {
    slug: 'almoco-de-domingo-em-familia-com-chef-em-casa',
    titulo: 'Almoço de domingo em família com chef em casa · Seu Chef em Casa',
    h1: 'Almoço de domingo em família com chef em casa',
    desc: 'Organize um almoço de domingo em família com chef em casa e veja como escolher pratos para dividir, acertar o horário e preparar a cozinha.',
    data: '2027-01-07',
    servicos: ['cozinha-italiana', 'feijoada-em-casa', 'costela-de-preparo-lento'],
    lead: 'Travessa passando de mão em mão é bem coisa de almoço de domingo. Com um chef em casa, quem costuma cuidar do fogão pode sentar junto desde o começo.',
    secoes: [
      ['Pense no que a família gosta de dividir', [
        'Uma lasanha ou uma carne assada com os acompanhamentos da casa funciona bem em travessas. Se o almoço gira em torno de uma receita de família, conte ao chef como ela costuma ser feita e o que precisa aparecer no prato.'
      ]],
      ['Combine um horário que funcione para a família', [
        'Diga se tem criança que almoça mais cedo ou parente que chega de viagem perto da hora de servir. O chef pode combinar com você o que vai à mesa primeiro e como servir quem chegar depois.'
      ]],
      ['Abra espaço para as travessas', [
        'Veja com o chef quais utensílios da casa ele vai usar e onde pode apoiar as travessas antes de servir. Se alguém quiser trazer sobremesa, reserve espaço na geladeira e avise para o chef contar com ela ao montar o menu.'
      ]],
      ['Como pedir', [
        'Procure chefs na sua cidade ou conte como será o almoço no mural de pedidos para receber contato de até 4 chefs pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  },
  {
    slug: 'sequencia-de-frutos-do-mar-em-casa-com-chef',
    titulo: 'Sequência de frutos do mar em casa com chef · Seu Chef em Casa',
    h1: 'Sequência de frutos do mar em casa com chef',
    desc: 'Veja como montar uma sequência de frutos do mar em casa com chef, com camarão, peixe e moqueca, e o que combinar sobre compras e restrições.',
    data: '2027-01-14',
    servicos: ['sequencia-de-frutos-do-mar', 'peixes-grelhados', 'moqueca-a-mesa'],
    lead: 'Camarão para abrir, peixe na grelha e moqueca para dividir. Numa sequência de frutos do mar em casa, o chef pode combinar com você a ordem dos pratos e a pausa entre eles.',
    secoes: [
      ['Monte a sequência', [
        'O camarão salteado pode abrir o almoço, seguido de um peixe grelhado com limão. Se a moqueca for o prato principal, converse sobre os acompanhamentos e deixe o chef calcular as porções da sequência inteira.'
      ]],
      ['Combine as compras e o espaço na cozinha', [
        'Pergunte quem vai comprar o pescado e qual peixe pode substituir o escolhido se ele estiver em falta. Veja quanto espaço o chef precisa na geladeira e se prefere usar a grelha da casa ou preparar o peixe no fogão.'
      ]],
      ['Avise sobre alergias antes de fechar o menu', [
        'Se alguém tem alergia a peixe ou camarão, diga qual é a restrição logo no primeiro contato. Pergunte ao chef como ele evita o contato entre os preparos e avaliem juntos se é preciso trocar o menu.'
      ]],
      ['Como pedir', [
        'Procure chefs na sua cidade ou conte como será a refeição no mural de pedidos para receber contato de até 4 chefs pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  },
  {
    slug: 'aula-de-cozinha-em-casa-com-chef',
    titulo: 'Aula de cozinha em casa com chef · Seu Chef em Casa',
    h1: 'Aula de cozinha em casa com chef',
    desc: 'Veja como planejar uma aula de cozinha em casa com chef, escolher uma receita que você queira repetir e organizar a bancada para quem vai participar.',
    data: '2027-01-21',
    servicos: ['aula-de-cozinha-em-casa', 'noite-de-massas', 'paes-artesanais'],
    lead: 'Tem receita que fica mais fácil depois que alguém mostra o ponto da massa com a mão. Numa aula em casa, você pratica na sua própria cozinha e pode tirar as dúvidas que aparecem durante o preparo.',
    secoes: [
      ['Escolha o que quer aprender', [
        'Você pode pedir para aprender a abrir massa fresca ou entender o ponto de um pão que costuma dar errado. Conte ao chef o que já sabe fazer e quais utensílios tem para repetir a receita depois.'
      ]],
      ['Diga quem vai pôr a mão na massa', [
        'Pergunte quais etapas cada pessoa pode fazer e quais o chef vai demonstrar. Se houver crianças, diga a idade delas e combine tarefas que possam fazer com supervisão.'
      ]],
      ['Deixe a bancada pronta', [
        'Mostre ao chef o espaço disponível e confirme quem fornece ingredientes e utensílios. Se a turma quiser comer junto depois, combine se a refeição será toda preparada durante a aula ou se algum prato precisa chegar adiantado.'
      ]],
      ['Como pedir', [
        'Procure chefs na sua cidade ou conte o que quer aprender no mural de pedidos para receber contato de até 4 chefs pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  },
  {
    slug: 'aniversario-em-casa-com-personal-chef',
    titulo: 'Aniversário em casa com personal chef · Seu Chef em Casa',
    h1: 'Aniversário em casa com personal chef',
    desc: 'Planeje um aniversário em casa com personal chef, da escolha entre jantar e petiscos à hora do parabéns, e veja o que combinar antes da festa.',
    data: '2027-01-28',
    servicos: ['finger-food-para-receber', 'noite-da-pizza', 'confeitaria-em-casa'],
    lead: 'Tem aniversário que pede mesa posta e tem festa em que a turma prefere comer enquanto conversa pela casa. Conte ao chef como você gosta de receber e o que o aniversariante faz questão de comer.',
    secoes: [
      ['Escolha como servir', [
        'Para um jantar sentado, veja quantos lugares cabem à mesa. Se os convidados vão ficar entre a sala e o quintal, combine petiscos que possam sair aos poucos ou uma estação de pizza perto de onde a turma vai se reunir.'
      ]],
      ['Reserve a hora do parabéns', [
        'Diga se o bolo será feito pelo chef ou comprado à parte. Combine onde ele fica guardado, quem leva à mesa e o que será servido depois. Se houver jantar, acerte a hora do parabéns para dar tempo de todos terminarem de comer.'
      ]],
      ['Avise quem vem e como chegar', [
        'Passe o número de convidados e conte quantos são crianças. O chef calcula a comida para o perfil da festa. Avise também se há portaria ou escadas para que ele possa planejar a chegada com os utensílios.'
      ]],
      ['Como pedir', [
        'Procure chefs na sua cidade ou conte como será o aniversário no mural de pedidos para receber contato de até 4 chefs pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  },
  {
    slug: 'cardapio-vegetariano-e-vegano-em-casa-com-chef',
    titulo: 'Cardápio vegetariano e vegano em casa com chef · Seu Chef em Casa',
    h1: 'Cardápio vegetariano e vegano em casa com chef',
    desc: 'Veja como montar um cardápio vegetariano e vegano em casa com chef, dos pratos principais à sobremesa, e quais ingredientes vale confirmar antes.',
    data: '2027-02-04',
    servicos: ['menu-vegetariano', 'menu-vegano', 'cozinha-mediterranea'],
    lead: 'Uma moqueca de banana-da-terra ou um assado de cogumelos pode ir para o centro da mesa. Conte ao chef quem vai comer para ele sugerir um cardápio vegetariano ou vegano que a turma possa dividir.',
    secoes: [
      ['Combine quais ingredientes entram', [
        'No menu vegano, combine preparos sem ingredientes de origem animal. Se for vegetariano, pergunte aos convidados se comem ovos e laticínios. Avise o chef sobre alergias, como a castanhas ou soja, antes de escolher os pratos.'
      ]],
      ['Comece pelo prato principal', [
        'Uma torta de legumes com recheio de grão-de-bico ou uma moqueca com arroz pode ser o ponto de partida. Peça ao chef sugestões de acompanhamentos que façam sentido com o principal e deixe que ele calcule as quantidades.'
      ]],
      ['Confira os detalhes até a sobremesa', [
        'Pergunte o que entra no caldo da casa, no molho da salada e na massa da sobremesa. Se parte da refeição for trazida pelos convidados, combine como identificar os pratos para que todo mundo saiba o que pode comer.'
      ]],
      ['Como pedir', [
        'Procure chefs na sua cidade ou conte o que você quer servir no mural de pedidos para receber contato de até 4 chefs pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  },
  {
    slug: 'jantar-harmonizado-com-vinhos-em-casa',
    titulo: 'Jantar harmonizado com vinhos em casa · Seu Chef em Casa',
    h1: 'Jantar harmonizado com vinhos em casa',
    desc: 'Organize um jantar harmonizado com vinhos em casa e veja como acertar com o chef a escolha dos pratos, as garrafas e o ritmo do serviço à mesa.',
    data: '2027-02-11',
    servicos: ['jantar-harmonizado', 'menu-degustacao', 'queijos-e-tabuas-artesanais'],
    lead: 'Se você tem uma garrafa guardada para abrir com amigos, ela pode ser o ponto de partida para o jantar. Mostre o rótulo ao chef e converse sobre o prato que vocês gostariam de servir com ela.',
    secoes: [
      ['Conte o que vocês gostam de beber', [
        'Diga se a turma prefere espumante, branco ou tinto. Se você já escolheu o prato principal, pergunte ao chef que estilo de vinho combina com o preparo. O molho de uma carne ou de um peixe pode pesar tanto na escolha quanto o ingrediente principal.'
      ]],
      ['Combine as compras e as taças', [
        'Pergunte se o chef indica os vinhos ou se também pode comprá-los. Diga quais taças tem em casa e confirme quais garrafas precisam estar geladas. Vale deixar água à mesa e combinar uma bebida sem álcool para quem preferir.'
      ]],
      ['Acerte o ritmo da noite', [
        'Diga ao chef se vocês querem ouvir sobre cada combinação ou seguir com a conversa à mesa. Combine quem abre as garrafas e serve as taças quando sair cada prato.'
      ]],
      ['Como pedir', [
        'Procure chefs na sua cidade ou conte como será o jantar no mural de pedidos para receber contato de até 4 chefs pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  },
  {
    slug: 'como-escolher-um-personal-chef',
    titulo: 'Como escolher um personal chef · Seu Chef em Casa',
    h1: 'Como escolher um personal chef: perguntas antes de contratar',
    desc: 'Saiba como escolher um personal chef e quais perguntas fazer sobre cardápio, compras, serviço à mesa e condições de reserva antes de contratar.',
    data: '2027-02-18',
    servicos: ['cardapio-tematico', 'menu-degustacao'],
    lead: 'O cardápio dá vontade de chamar o chef, mas é na conversa que você descobre se o serviço combina com a sua casa e com o seu evento. Vale fazer algumas perguntas antes de fechar.',
    secoes: [
      ['Que cardápio você sugere para este encontro?', [
        'Conte o que está comemorando e quantas pessoas vão comer. Veja no perfil os pratos que o chef costuma fazer e pergunte como ele adapta o menu às preferências e restrições dos convidados.'
      ]],
      ['O que você precisa encontrar na cozinha?', [
        'Diga que tipo de fogão e forno tem em casa e se há espaço na geladeira. Pergunte quem compra os ingredientes, quais utensílios o chef traz e se vai precisar de uma bancada de apoio.'
      ]],
      ['O que está incluído na proposta?', [
        'Confirme se a proposta inclui ingredientes, deslocamento e serviço à mesa. Pergunte quem cuida da louça e da limpeza da cozinha e como ficam o pagamento e a reserva se você precisar mudar a data.'
      ]],
      ['Como pedir', [
        'Procure chefs na sua cidade ou conte o que você precisa no mural de pedidos para receber contato de até 4 chefs pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  },
  {
    slug: 'personal-chef-ou-buffet',
    titulo: 'Personal chef ou buffet para o seu evento · Seu Chef em Casa',
    h1: 'Personal chef ou buffet: qual escolher para o seu evento?',
    desc: 'Compare personal chef e buffet para o seu evento e veja o que perguntar sobre a cozinha do local, o formato da refeição e o que cada proposta inclui.',
    data: '2027-02-25',
    servicos: ['finger-food-para-receber', 'menu-degustacao', 'churrasco-em-casa'],
    lead: 'A escolha entre personal chef e buffet começa pelo jeito que você imagina a refeição. Pense em onde os convidados vão comer e em quem vai cuidar do serviço enquanto você recebe a turma.',
    secoes: [
      ['Quando chamar um personal chef', [
        'Se você quer combinar um menu para um almoço ou jantar preparado na sua casa, converse com um personal chef. Mostre a cozinha e pergunte como ele serviria o grupo, desde a chegada dos convidados até a sobremesa.'
      ]],
      ['Quando pedir uma proposta de buffet', [
        'Se a festa pede uma mesa de autosserviço com reposição, ou equipe circulando pelo salão com bandejas, vale pedir uma proposta de buffet para esse formato. Confirme como a comida chega, onde é finalizada e quem cuida da montagem.'
      ]],
      ['Compare o que cada proposta cobre', [
        'Passe o mesmo número de convidados e os mesmos horários ao conversar com os fornecedores. Veja quem leva louças, quem serve as bebidas e se a retirada do material está incluída. Antes de fechar, confirme também o que o local permite usar na cozinha.'
      ]],
      ['Como pedir', [
        'Se quiser cozinhar com um profissional na sua casa, procure chefs na sua cidade ou conte como será o evento no mural de pedidos para receber contato de até 4 chefs pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  },
  {
    slug: 'noite-de-massas-e-risotos-em-casa-com-chef',
    titulo: 'Noite de massas e risotos em casa com chef · Seu Chef em Casa',
    h1: 'Noite de massas e risotos em casa com chef',
    desc: 'Planeje uma noite de massas e risotos em casa com chef e veja como escolher os molhos, organizar a ordem dos pratos e acertar a hora de servir.',
    data: '2027-03-04',
    servicos: ['noite-de-massas', 'festival-de-risotos', 'cozinha-italiana'],
    lead: 'Ravióli de abóbora e risoto de cogumelos podem dividir a mesma noite. Combine com o chef o que vocês querem provar e como cada prato vai chegar à mesa.',
    secoes: [
      ['Escolha os pratos e os molhos juntos', [
        'Conte se a turma prefere massa recheada ou uma massa longa para acompanhar o molho da casa. Se quiser servir risoto também, peça ao chef para sugerir porções e sabores que funcionem na mesma refeição.'
      ]],
      ['Combine como os pratos vão sair', [
        'Pergunte se faz mais sentido servir em etapas ou escolher pratos para dividir. Risoto costuma ir à mesa assim que fica pronto, então vale acertar a hora de sentar com quem está no fogão.'
      ]],
      ['Confira os ingredientes e a cozinha', [
        'Avise sobre restrições a trigo, ovos ou leite. Pergunte o que entra na massa, no caldo e na finalização dos pratos. Confirme também quantas bocas do fogão ficam livres e se o chef vai trazer as panelas de que precisa.'
      ]],
      ['Como pedir', [
        'Procure chefs na sua cidade ou conte o que quer servir no mural de pedidos para receber contato de até 4 chefs pelo WhatsApp. O valor é combinado direto com o chef.'
      ]]
    ]
  }
];
