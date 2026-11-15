/* Personagens criados para a apresentação de Carlos. Não são profissionais reais.
   O script só prepara os dados/SQL; não conecta nem escreve no banco remoto. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),origin='';
const phone='(48) 99110-6355';
const dish=(category,name,desc,price)=>({category,name,desc,price});
const groups=[
 {id:'chef-a671dc49f32b8e10',email:'helena.duarte@apresentacao.invalid',slug:'helena',name:'Chef Helena Duarte',cities:'Florianópolis, São José e Palhoça',specialty:'Cozinha italiana, massas artesanais e jantares intimistas',bio:'Acredito que uma boa mesa começa muito antes do primeiro prato. Minha cozinha combina massas artesanais, molhos preparados com calma e ingredientes que respeitam a estação.\n\nGosto de receber com elegância e sem formalidade excessiva: uma entrada para dividir, uma massa feita com cuidado e uma sobremesa que prolonga a conversa. Crio cardápios para jantares a dois, almoços em família e pequenas celebrações.\n\nO menu é pensado junto com você, considerando preferências, restrições alimentares e a estrutura da sua cozinha. Ingredientes, quantidade de pessoas, serviço e valores são combinados antes do encontro.',options:['x_italiana','x_massas','x_risotos','x_nhoque','x_degustacao','x_harmonizado','x_aula','x_paes','x_confeitaria','x_vegetariano'],gallery:[['Noite de Massas','Massa artesanal com ervas e molho delicado.'],['Cozinha Italiana','Penne ao molho de tomate, finalizado com queijo.'],['Noite do Nhoque','Nhoques cremosos com finalização de ervas.'],['Festival de Risotos','Risoto de cogumelos e queijo curado.'],['Pães artesanais','Pães de fermentação lenta para abrir a mesa.'],['Festival de Crepes','Crepes delicados com frutas e recheio doce.'],['evento-helena','Mesa preparada para uma celebração ao ar livre.'],['mesa-helena','Luz suave e uma mesa pensada para receber.'],['preparo-helena','O cuidado com os ingredientes começa no preparo.']],dishes:[
 dish('Entradas','Bruschetta de tomates confitados','Pão tostado, tomates assados lentamente, manjericão e azeite.',29),
 dish('Entradas','Burrata com pêssegos grelhados','Burrata cremosa, folhas frescas, fruta da estação e balsâmico.',48),
 dish('Entradas','Carpaccio de abobrinha','Lâminas de abobrinha, limão siciliano, alcaparras e parmesão.',32),
 dish('Entradas','Arancini de cogumelos','Bolinhos de arroz cremoso com cogumelos e aioli de ervas.',36),
 dish('Entradas','Focaccia de alecrim','Massa de fermentação lenta, flor de sal e azeite extravirgem.',25),
 dish('Saladas','Salada de rúcula com figos','Rúcula, figos da estação, lascas de parmesão e nozes.',34),
 dish('Saladas','Caprese de tomates coloridos','Tomates, muçarela fresca, manjericão e azeite.',36),
 dish('Massas','Ravioli de ricota e espinafre','Massa fresca, manteiga de sálvia e nozes tostadas.',72),
 dish('Massas','Tagliatelle ao ragù de carne','Fitas de massa artesanal com ragù de cozimento lento.',78),
 dish('Massas','Linguine ao limão siciliano','Molho delicado de limão, queijo curado e ervas.',64),
 dish('Massas','Pappardelle de cogumelos','Cogumelos salteados, creme leve e queijo parmesão.',74),
 dish('Massas','Nhoque de batata com pomodoro','Nhoques macios com molho de tomate e manjericão.',66),
 dish('Massas','Nhoque de abóbora e gorgonzola','Abóbora assada, molho de gorgonzola e nozes.',72),
 dish('Massas','Lasanha de berinjela','Camadas de berinjela, tomate, queijo e manjericão.',62),
 dish('Risotos','Risoto de cogumelos frescos','Arroz arbóreo, cogumelos variados e parmesão.',74),
 dish('Risotos','Risoto de pera e gorgonzola','Pera, gorgonzola e finalização de nozes.',72),
 dish('Risotos','Risoto de limão com camarões','Camarões salteados e notas de limão siciliano.',96),
 dish('Pratos Principais','Filé ao molho de vinho tinto','Medalhão de filé, redução de vinho e purê rústico.',118),
 dish('Pratos Principais','Frango recheado com ervas','Peito de frango, creme de ricota e legumes assados.',76),
 dish('Pratos Principais','Peixe com crosta de amêndoas','Filé de peixe, crosta delicada e legumes da estação.',94),
 dish('Acompanhamentos','Legumes assados com ervas','Seleção de legumes da estação com azeite e ervas.',28),
 dish('Sobremesas','Tiramisù da casa','Creme de mascarpone, café e cacau.',34),
 dish('Sobremesas','Panna cotta de baunilha','Creme delicado com calda de frutas vermelhas.',29),
 dish('Sobremesas','Torta de limão siciliano','Base crocante, creme de limão e merengue leve.',30),
 dish('Sobremesas','Peras ao vinho','Peras cozidas em vinho e especiarias, com creme.',32)
 ]},
 {id:'chef-b982ef73a14c605d',email:'rafael.monteiro@apresentacao.invalid',slug:'rafael',name:'Chef Rafael Monteiro',cities:'Florianópolis, Governador Celso Ramos e Biguaçu',specialty:'Frutos do mar e cozinha contemporânea do litoral',bio:'Minha inspiração vem do encontro entre o mar e uma mesa bem recebida. Trabalho com peixes, frutos do mar e acompanhamentos que valorizam frescor, textura e temperos equilibrados.\n\nDa entrada leve ao prato principal, gosto de criar uma sequência que faça sentido: acidez na medida, cocções cuidadosas e apresentação elegante. Também preparo opções sem frutos do mar para compor encontros com diferentes preferências.\n\nAtendo jantares, almoços e celebrações em casa. A escolha dos ingredientes depende da sazonalidade e da disponibilidade; o cardápio final, as restrições alimentares e os detalhes do serviço são alinhados previamente.',options:['x_mar','x_tainha','x_paella','x_peruana','x_peixes','x_moqueca','x_mediterranea','x_degustacao','x_risotos','x_harmonizado','x_saladas'],gallery:[['Sequência de frutos do mar','Ostras com frescor e apresentação delicada.'],['Peixes grelhados','Peixe grelhado com acompanhamentos sazonais.'],['Ceviches e sabores peruanos','Ceviche com notas cítricas e texturas frescas.'],['Paella em casa','Arroz e frutos do mar para compartilhar.'],['Moqueca à mesa','Moqueca servida à mesa, com acompanhamentos.'],['Confeitaria em casa','Um final leve com frutas vermelhas.'],['evento-rafael','Mesa longa para um encontro especial.'],['mesa-rafael','Uma celebração preparada nos pequenos detalhes.'],['preparo-rafael','Finalização cuidadosa antes de servir.']],dishes:[
 dish('Entradas','Ceviche de peixe branco','Peixe branco, limão, cebola roxa, coentro e milho.',44),
 dish('Entradas','Tartar de salmão com manga','Salmão, manga, pepino e molho cítrico.',48),
 dish('Entradas','Ostras com vinagrete cítrico','Ostras frescas e vinagrete de limão e ervas.',58),
 dish('Entradas','Ostras gratinadas','Ostras com creme suave, queijo e gratinado dourado.',64),
 dish('Entradas','Camarões ao alho e azeite','Camarões salteados com alho, azeite e pão tostado.',54),
 dish('Entradas','Bolinho de peixe com aioli','Bolinhos crocantes de peixe e aioli de limão.',36),
 dish('Saladas','Salada cítrica com camarões','Folhas, camarões, laranja e molho de limão.',52),
 dish('Saladas','Salada de grãos e ervas','Grãos, pepino, tomate e ervas frescas.',34),
 dish('Frutos do mar','Paella de frutos do mar','Arroz com peixe, camarões, lula e mexilhões.',128),
 dish('Frutos do mar','Moqueca de peixe e camarão','Peixe, camarões, pimentões, leite de coco e ervas.',118),
 dish('Frutos do mar','Camarão ao creme de abóbora','Camarões com creme de abóbora e arroz.',112),
 dish('Frutos do mar','Lula grelhada com ervas','Lula na chapa, azeite de ervas e legumes.',92),
 dish('Pratos Principais','Peixe branco com crosta de ervas','Peixe assado, crosta aromática e purê de mandioquinha.',96),
 dish('Pratos Principais','Salmão com molho de maracujá','Salmão grelhado, molho de fruta e arroz de amêndoas.',108),
 dish('Pratos Principais','Tainha assada com farofa','Tainha, farofa de ervas, batatas e limão.',94),
 dish('Pratos Principais','Peixe em papillote','Peixe delicado, legumes e ervas cozidos no papel.',88),
 dish('Pratos Principais','Frango com creme de milho','Frango dourado, creme de milho e legumes.',72),
 dish('Pratos Principais','Abóbora assada com cogumelos','Abóbora, cogumelos salteados e creme de castanhas.',64),
 dish('Risotos','Risoto de camarão e alho-poró','Camarões, alho-poró e finalização de limão.',98),
 dish('Risotos','Risoto de limão e ervas','Arroz cremoso, limão siciliano e ervas frescas.',66),
 dish('Acompanhamentos','Arroz de coco','Arroz leve com coco e ervas.',24),
 dish('Acompanhamentos','Pirão de peixe','Pirão de caldo de peixe com temperos suaves.',26),
 dish('Sobremesas','Mousse de maracujá','Mousse leve com calda da própria fruta.',26),
 dish('Sobremesas','Panna cotta com frutas vermelhas','Creme de baunilha e frutas frescas.',30),
 dish('Sobremesas','Cocada cremosa com sorvete','Coco cremoso servido morno com sorvete.',29)
 ]},
 {id:'chef-c453a0e1967fb82d',email:'andre.valenca@apresentacao.invalid',slug:'andre',name:'Chef André Valença',cities:'São José, Palhoça, Florianópolis e Santo Amaro da Imperatriz',specialty:'Carnes na brasa, preparo lento e encontros ao ar livre',bio:'Gosto de transformar a brasa em ponto de encontro. Minha cozinha reúne cortes preparados com atenção ao ponto, receitas de cozimento lento e acompanhamentos que merecem o mesmo cuidado da carne.\n\nA proposta é receber bem, com comida generosa e serviço organizado. Preparo de um almoço descontraído a um jantar com cortes selecionados, incluindo alternativas vegetarianas e opções para diferentes gostos.\n\nPlanejamos juntos o cardápio, o tamanho do grupo e o ritmo do serviço. Antes de confirmar, verificamos churrasqueira, equipamentos, ingredientes, restrições alimentares e tudo o que será necessário para o encontro.',options:['x_churrasco','x_carnes','x_costela','x_lanche','x_boteco','x_fingerfood','x_tapas','x_queijos','x_tematico','x_vegetariano','x_colonial'],gallery:[['Churrasco em casa','Carnes e legumes preparados na brasa.'],['Carnes nobres','Cortes selecionados e finalização com ervas.'],['Costela de preparo lento','Costela de preparo lento e acompanhamentos.'],['Noite do Lanche','Hambúrguer com queijo e pão macio.'],['Queijos e tábuas artesanais','Tábua para abrir a conversa antes do almoço.'],['Celebração','Uma sobremesa para encerrar a celebração.'],['evento-andre','Encontro ao ar livre sob luzes quentes.'],['mesa-andre','Recepção com mesa posta e serviço planejado.'],['preparo-andre','Preparo atento, do primeiro corte à finalização.']],dishes:[
 dish('Entradas','Tábua de queijos e charcutaria','Queijos, embutidos, frutas, pães e geleia.',58),
 dish('Entradas','Pão de alho com ervas','Pão tostado com manteiga de alho e ervas.',18),
 dish('Entradas','Provoleta na brasa','Provolone derretido com orégano e tomate.',32),
 dish('Entradas','Espetinho de cogumelos','Cogumelos marinados, grelhados e finalizados com ervas.',28),
 dish('Entradas','Bolinho de costela','Costela desfiada em bolinhos crocantes com molho da casa.',38),
 dish('Saladas','Salada de folhas com frutas','Folhas, frutas da estação e vinagrete de mostarda.',28),
 dish('Saladas','Salada de batatas com ervas','Batatas, cebola suave e molho cremoso de ervas.',26),
 dish('Carnes','Picanha na brasa','Picanha grelhada, sal na medida e molho de ervas.',118),
 dish('Carnes','Ancho com manteiga de ervas','Bife ancho, manteiga aromática e batatas.',124),
 dish('Carnes','Chorizo com chimichurri','Contrafilé alto grelhado com chimichurri fresco.',112),
 dish('Carnes','Costela bovina de preparo lento','Costela macia, molho do assado e mandioca.',108),
 dish('Carnes','Costelinha suína ao molho barbecue','Costelinha assada lentamente com barbecue da casa.',88),
 dish('Carnes','Frango desossado na brasa','Frango marinado, pele dourada e ervas.',68),
 dish('Carnes','Linguiça artesanal com cebolas','Linguiça grelhada e cebolas caramelizadas.',54),
 dish('Lanches','Hambúrguer de carne com cheddar','Hambúrguer na brasa, cheddar, cebola e pão macio.',42),
 dish('Lanches','Sanduíche de costela','Costela desfiada, queijo, picles e maionese de ervas.',46),
 dish('Vegetarianos','Berinjela na brasa com tahine','Berinjela defumada, tahine e sementes tostadas.',48),
 dish('Vegetarianos','Espeto de legumes e queijo','Legumes da estação e queijo grelhado.',42),
 dish('Acompanhamentos','Farofa crocante de cebola','Farofa dourada com cebola e ervas frescas.',22),
 dish('Acompanhamentos','Mandioca com manteiga de alho','Mandioca macia, manteiga de alho e cheiro-verde.',26),
 dish('Acompanhamentos','Batatas rústicas na brasa','Batatas douradas com páprica e alecrim.',24),
 dish('Acompanhamentos','Arroz com alho-poró','Arroz soltinho com alho-poró salteado.',22),
 dish('Sobremesas','Abacaxi na brasa com canela','Abacaxi grelhado, canela e sorvete.',25),
 dish('Sobremesas','Banana assada com doce de leite','Banana quente, doce de leite e farofa doce.',26),
 dish('Sobremesas','Bolo de chocolate com frutas','Bolo de chocolate e finalização com frutas da estação.',30)
 ]}
];
const profiles=groups.map(g=>({id:g.id,email:g.email,profile:{name:g.name,whatsapp:phone,phone,cities:g.cities,specialty:g.specialty,bio:g.bio,instagram:'',avatar:origin+'/assets/apresentacao/'+g.slug+'-retrato.webp',gallery:g.gallery.map(([,caption],i)=>({id:g.slug+'-foto-'+(i+1),url:origin+'/assets/apresentacao/'+g.slug+'-'+(i+1)+'.webp',caption})),dishes:g.dishes.map((d,i)=>({id:g.slug+'-prato-'+(i+1),...d})),opcoes:{r_gluten:false,r_lactose:false,r_mar:false,r_vegano:false,r_vegetariano:true,...Object.fromEntries(g.options.map(k=>[k,true]))}}}));
module.exports={groups,profiles};
if(require.main===module){const out=process.argv[2];if(!out)throw Error('Informe o arquivo SQL de saída.');const quote=s=>"'"+String(s).replaceAll("'","''")+"'",now=new Date().toISOString();const sql=profiles.map(c=>'INSERT OR IGNORE INTO chefs (id,email,credencial,perfil,publicado,oculto,criado_em,atualizado_em) VALUES ('+[c.id,c.email,JSON.stringify({algoritmo:'sem-acesso',finalidade:'apresentacao'}),JSON.stringify(c.profile),1,0,now,now].map(quote).join(',')+');').join('\n');fs.writeFileSync(path.resolve(out),sql+'\n');console.log('Preparados '+profiles.length+' perfis; nenhum banco foi alterado.');}
